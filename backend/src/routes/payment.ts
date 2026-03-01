import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { body, validationResult } from 'express-validator';
import pool, { withTransaction } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'

const PRICE_PER_CREDIT = parseInt(process.env.STRIPE_PRICE_PER_CREDIT || '499'); // cents

/**
 * GET /api/payment/pricing
 * Get pricing information (public endpoint)
 */
router.get('/pricing', async (req: Request, res: Response): Promise<void> => {
  try {
    const options = [
      { credits: 1, price: (PRICE_PER_CREDIT / 100).toFixed(2), pricePerCredit: (PRICE_PER_CREDIT / 100).toFixed(2) },
      { credits: 5, price: ((PRICE_PER_CREDIT * 5 * 0.8) / 100).toFixed(2), pricePerCredit: ((PRICE_PER_CREDIT * 0.8) / 100).toFixed(2), savings: '20%' },
      { credits: 10, price: ((PRICE_PER_CREDIT * 10 * 0.7) / 100).toFixed(2), pricePerCredit: ((PRICE_PER_CREDIT * 0.7) / 100).toFixed(2), savings: '30%' },
    ];
    res.status(200).json({ options, currency: 'USD' });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ error: 'Failed to retrieve pricing', details: { message: 'Internal server error' } });
  }
});

/**
 * POST /api/payment/create-intent
 * Create Stripe payment intent
 */
router.post(
  '/create-intent',
  authenticateToken,
  [body('credits').isInt({ min: 1, max: 100 }).withMessage('Credits must be between 1 and 100')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { credits } = req.body;
      const userId = req.userId!;

      let pricePerCredit = PRICE_PER_CREDIT;
      if (credits >= 10) { pricePerCredit = Math.floor(PRICE_PER_CREDIT * 0.7); }
      else if (credits >= 5) { pricePerCredit = Math.floor(PRICE_PER_CREDIT * 0.8); }

      const amount = pricePerCredit * credits;

      const paymentIntent = await stripe.paymentIntents.create({
        amount, currency: 'usd',
        metadata: { userId, credits: credits.toString() },
        automatic_payment_methods: { enabled: true },
      });

      console.log('✅ Payment intent created:', paymentIntent.id);
      res.status(200).json({ clientSecret: paymentIntent.client_secret, amount, credits });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ error: 'Failed to create payment', details: { message: 'Internal server error' } });
    }
  }
);

/**
 * POST /api/payment/confirm
 * Confirm payment and add credits to user account
 */
router.post(
  '/confirm',
  authenticateToken,
  [body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { paymentIntentId } = req.body;
      const userId = req.userId!;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        res.status(400).json({ error: 'Payment not completed', details: { message: 'Payment has not been successfully processed', status: paymentIntent.status } });
        return;
      }

      if (paymentIntent.metadata.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized', details: { message: 'Payment does not belong to this user' } });
        return;
      }

      const credits = parseInt(paymentIntent.metadata.credits);

      const existingPayment = await pool.query('SELECT id FROM payments WHERE stripe_payment_intent_id = $1', [paymentIntentId]);
      if (existingPayment.rows.length > 0) {
        res.status(400).json({ error: 'Payment already processed', details: { message: 'This payment has already been credited' } });
        return;
      }

      const result = await withTransaction(async (client) => {
        await client.query('UPDATE users SET image_credits = image_credits + $1 WHERE id = $2', [credits, userId]);
        await client.query(
          `INSERT INTO payments (user_id, stripe_payment_intent_id, amount, currency, credits_purchased, status) VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, paymentIntentId, paymentIntent.amount, paymentIntent.currency, credits, 'succeeded']
        );
        const userResult = await client.query('SELECT image_credits FROM users WHERE id = $1', [userId]);
        return userResult.rows[0].image_credits;
      });

      console.log('✅ Credits added to user:', { userId, credits });
      res.status(200).json({ success: true, creditsAdded: credits, newBalance: result });
    } catch (error) {
      console.error('Confirm payment error:', error);
      res.status(500).json({ error: 'Failed to process payment', details: { message: 'Internal server error' } });
    }
  }
);

/**
 * POST /api/payment/webhook
 * Stripe webhook handler for payment events
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error('Webhook secret not configured');
        res.status(500).send('Webhook secret not configured');
        return;
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return;
      }

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('✅ Payment succeeded:', paymentIntent.id);
          break;

        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object as Stripe.PaymentIntent;
          console.log('❌ Payment failed:', failedIntent.id);
          await pool.query(
            `INSERT INTO payments (user_id, stripe_payment_intent_id, amount, currency, credits_purchased, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (stripe_payment_intent_id) DO NOTHING`,
            [failedIntent.metadata.userId, failedIntent.id, failedIntent.amount, failedIntent.currency, parseInt(failedIntent.metadata.credits || '0'), 'failed']
          );
          break;

        default:
          console.log('Unhandled event type:', event.type);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Webhook processing failed');
    }
  }
);

/**
 * GET /api/payment/history
 * Get user's payment history
 */
router.get('/history', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const result = await pool.query(
      `SELECT id, stripe_payment_intent_id, amount, currency, credits_purchased, status, created_at FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    res.status(200).json({
      payments: result.rows.map((p) => ({
        id: p.id, paymentIntentId: p.stripe_payment_intent_id, amount: p.amount,
        currency: p.currency, creditsPurchased: p.credits_purchased, status: p.status, createdAt: p.created_at,
      })),
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to retrieve payment history', details: { message: 'Internal server error' } });
  }
});

export default router;
