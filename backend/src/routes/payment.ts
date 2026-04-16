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
  bundle_5:  { credits: 5,  priceId: 'price_1T9ZvVI3iOfYVCAUk9F9LnbV', label: '5 Credits',  aud: 1999 },
  bundle_10: { credits: 10, priceId: 'price_1T9ZvVI3iOfYVCAUKy6XHMnR', label: '10 Credits', aud: 3499, popular: true },
  bundle_25: { credits: 25, priceId: 'price_1T9ZvWI3iOfYVCAUarVuV29g', label: '25 Credits', aud: 7499 },
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

// ── POST /api/payment/create-subscription-session ────────────────────────────
router.post('/create-subscription-session', authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId!;
    const subPriceId = process.env.STRIPE_SUB_PRICE_ID;
    if (!subPriceId) { res.status(500).json({ error: 'Subscription not configured' }); return; }

    try {
      const userRow = await pool.query('SELECT email, stripe_customer_id, subscription_status FROM users WHERE id = $1', [userId]);
      const user = userRow.rows[0];
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }

      if (user.subscription_status === 'active' || user.subscription_status === 'past_due') {
        res.status(409).json({ error: 'You already have an active subscription. To manage or cancel, please contact support.' });
        return;
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        line_items: [{ price: subPriceId, quantity: 1 }],
        success_url: `${FRONTEND_URL}/dashboard?subscribed=1`,
        cancel_url: `${FRONTEND_URL}/pricing?cancelled=1`,
        metadata: { userId },
      };

      if (user.stripe_customer_id) {
        sessionParams.customer = user.stripe_customer_id;
      } else {
        sessionParams.customer_email = user.email;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log(`✅ Subscription checkout session: ${session.id} — user ${userId}`);
      res.json({ sessionUrl: session.url });
    } catch (error) {
      console.error('Create subscription session error:', error);
      res.status(500).json({ error: 'Failed to create subscription session' });
    }
  }
);

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

        if (session.mode === 'subscription') {
          // ── New subscription activated ──────────────────────────
          const userId = session.metadata?.userId;
          if (!userId) { console.error('❌ No userId in subscription session metadata:', session.id); res.json({ received: true }); return; }

          await pool.query(
            `UPDATE users SET subscription_status = 'active', stripe_customer_id = $1, stripe_subscription_id = $2 WHERE id = $3`,
            [session.customer, session.subscription, userId]
          );
          console.log(`✅ Subscription activated — user ${userId}`);

        } else {
          // ── One-time credit purchase ────────────────────────────
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

          // ── Notify Fallon of new purchase ─────────────────────────
          if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
              const buyerRow = await pool.query('SELECT email, first_name, last_name FROM users WHERE id = $1', [userId]);
              const buyer = buyerRow.rows[0];
              const buyerName = buyer ? `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() || buyer.email : userId;
              const buyerEmail = buyer?.email || 'unknown';
              const amountAud = ((session.amount_total || 0) / 100).toFixed(2);
              const nodemailer = await import('nodemailer');
              const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
              });
              await transporter.sendMail({
                from: process.env.SMTP_FROM || 'ParasitePro <noreply@notworms.com>',
                to: 'importantalerts26@gmail.com',
                subject: `💰 New Purchase — $${amountAud} AUD (${credits} credits)`,
                html: `
                  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0E0F11;color:#F5F0E8;border-radius:12px;">
                    <h2 style="color:#D97706;margin:0 0 4px 0;">💰 New Purchase on ParasitePro!</h2>
                    <p style="color:#6B7280;font-size:13px;margin:0 0 24px 0;">notworms.com</p>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr><td style="padding:10px 0;border-bottom:1px solid #1F2937;color:#9CA3AF;">Customer</td>
                          <td style="padding:10px 0;border-bottom:1px solid #1F2937;font-weight:600;">${buyerName}</td></tr>
                      <tr><td style="padding:10px 0;border-bottom:1px solid #1F2937;color:#9CA3AF;">Email</td>
                          <td style="padding:10px 0;border-bottom:1px solid #1F2937;">${buyerEmail}</td></tr>
                      <tr><td style="padding:10px 0;border-bottom:1px solid #1F2937;color:#9CA3AF;">Amount</td>
                          <td style="padding:10px 0;border-bottom:1px solid #1F2937;color:#D97706;font-size:20px;font-weight:700;">$${amountAud} AUD</td></tr>
                      <tr><td style="padding:10px 0;color:#9CA3AF;">Credits</td>
                          <td style="padding:10px 0;font-weight:600;">${credits} credits</td></tr>
                    </table>
                    <a href="https://www.notworms.com/admin" style="display:inline-block;margin-top:24px;background:#D97706;color:#0E0F11;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">View Admin Dashboard →</a>
                    <p style="margin-top:16px;font-size:12px;color:#4B5563;">Remember: If this is a first-time buyer from your launch offer, message them back with their 2 bonus credits 💛</p>
                  </div>
                `,
              });
              console.log(`📧 Purchase notification sent to Fallon for user ${buyerEmail}`);
            } catch (emailErr) {
              console.error('⚠️ Purchase notification email failed (non-fatal):', emailErr);
            }
          }
        }

      } else if (event.type === 'customer.subscription.updated') {
        const sub = event.data.object as Stripe.Subscription;
        const newStatus = sub.status === 'active' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : sub.status === 'canceled' ? 'cancelled'
          : 'free';
        await pool.query(
          `UPDATE users SET subscription_status = $1 WHERE stripe_customer_id = $2`,
          [newStatus, sub.customer]
        );
        console.log(`✅ Subscription updated → ${newStatus} for customer ${sub.customer}`);

      } else if (event.type === 'customer.subscription.deleted') {
        const sub = event.data.object as Stripe.Subscription;
        await pool.query(
          `UPDATE users SET subscription_status = 'cancelled', stripe_subscription_id = NULL WHERE stripe_customer_id = $1`,
          [sub.customer]
        );
        console.log(`✅ Subscription cancelled for customer ${sub.customer}`);

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
