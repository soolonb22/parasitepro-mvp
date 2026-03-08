import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { body, validationResult } from 'express-validator';
import pool, { withTransaction } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.notworms.com';

// Credit bundles — live Stripe price IDs (AUD)
const BUNDLES: Record<string, { credits: number; priceId: string; label: string; aud: number; popular?: boolean }> = {
  bundle_5:  { credits: 5,  priceId: 'price_1T8gC0KP9uxdve7jWtDs8iTn', label: '5 Credits',  aud: 1999 },
  bundle_10: { credits: 10, priceId: 'price_1T8gC4KP9uxdve7jolsajyEt', label: '10 Credits', aud: 3499, popular: true },
  bundle_25: { credits: 25, priceId: 'price_1T8gC7KP9uxdve7jpjJJctrr', label: '25 Credits', aud: 7499 },
};

// ── GET /api/payment/pricing ──────────────────────────────────────────────────
router.get('/pricing', async (_req: Request, res: Response): Promise<void> => {
  const options = Object.entries(BUNDLES).map(([id, b]) => ({
    id, credits: b.credits, label: b.label, popular: b.popular || false,
    aud: (b.aud / 100).toFixed(2), audPerCredit: (b.aud / b.credits / 100).toFixed(2),
  }));
  res.json({ options, currency: 'AUD' });
});

// ── POST /api/payment/create-checkout-session ─────────────────────────────────
router.post('/create-checkout-session', authenticateToken,
  [body('bundleId').isIn(Object.keys(BUNDLES)).withMessage('Invalid bundle')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ error: errors.array()[0].msg }); return; }

    const { bundleId } = req.body;
    const bundle = BUNDLES[bundleId];
    const userId = req.userId!;

    try {
      const userRow = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
      const email = userRow.rows[0]?.email;

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: bundle.priceId, quantity: 1 }],
        success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/pricing?cancelled=1`,
        customer_email: email,
        metadata: { userId, credits: bundle.credits.toString(), bundleId },
        payment_intent_data: { metadata: { userId, credits: bundle.credits.toString() } },
      });

      console.log(`✅ Checkout session: ${session.id} — ${bundle.label} — user ${userId}`);
      res.json({ sessionUrl: session.url });
    } catch (error) {
      console.error('Create checkout session error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  }
);

// ── GET /api/payment/verify-session ──────────────────────────────────────────
router.get('/verify-session', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const sessionId = req.query.session_id as string;
  if (!sessionId) { res.status(400).json({ error: 'session_id required' }); return; }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      res.status(402).json({ error: 'Payment not completed', status: session.payment_status });
      return;
    }
    const result = await pool.query('SELECT image_credits FROM users WHERE id = $1', [req.userId]);
    res.json({ paid: true, credits: result.rows[0]?.image_credits ?? 0 });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: 'Failed to verify session' });
  }
});

// ── POST /api/payment/webhook ─────────────────────────────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) { console.error('❌ STRIPE_WEBHOOK_SECRET not set'); res.status(500).send('Not configured'); return; }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook sig failed:', err);
      res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== 'paid') { res.json({ received: true }); return; }

        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || '0');

        if (!userId || !credits) { console.error('❌ Missing metadata:', session.id); res.json({ received: true }); return; }

        const existing = await pool.query('SELECT id FROM payments WHERE stripe_payment_intent_id = $1', [session.id]);
        if (existing.rows.length > 0) { res.json({ received: true }); return; }

        await withTransaction(async (client) => {
          await client.query('UPDATE users SET image_credits = image_credits + $1 WHERE id = $2', [credits, userId]);
          await client.query(
            `INSERT INTO payments (user_id, stripe_payment_intent_id, amount, currency, credits_purchased, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, session.id, session.amount_total, session.currency, credits, 'succeeded']
          );
        });

        console.log(`✅ Webhook: ${credits} credits granted → user ${userId}`);

      } else {
        console.log('Unhandled event:', event.type);
      }
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Webhook processing failed');
    }
  }
);

// ── GET /api/payment/history ──────────────────────────────────────────────────
router.get('/history', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, stripe_payment_intent_id, amount, currency, credits_purchased, status, created_at
       FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.userId]
    );
    res.json({
      payments: result.rows.map((p) => ({
        id: p.id, sessionId: p.stripe_payment_intent_id, amount: p.amount,
        currency: p.currency, creditsPurchased: p.credits_purchased, status: p.status, createdAt: p.created_at,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payment history' });
  }
});

export default router;
