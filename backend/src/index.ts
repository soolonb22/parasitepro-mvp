import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pool from './config/database';

dotenv.config();

// ─── Crash guards FIRST — before anything else ───────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err.message, err.stack);
  // Don't exit — keep serving requests
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
  // Don't exit — keep serving requests
});
// ─────────────────────────────────────────────────────────────────────────────

// Log all env vars available (masked)
console.log('🔧 ENV CHECK:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? '✅ set' : '❌ MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ MISSING',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '✅ set' : '❌ MISSING',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ MISSING',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅ set' : '❌ MISSING',
});

// Validate required environment variables
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed CORS origins
const allowedOrigins = [
  'https://www.notworms.com',
  'https://notworms.com',
  'https://parasitepro-mvp.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
  allowedOrigins.push(frontendUrl);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());

// ⚠️ CRITICAL: Stripe webhook needs raw body — MUST be registered BEFORE express.json()
// express.raw() only matches /api/payment/webhook; all other routes get json() below
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── Health checks ─────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ParasitePro Backend', timestamp: new Date().toISOString() });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// ───────────────────────────────────────────────────────────────────────────

// ─── Rate limiters ────────────────────────────────────────────────────────────
// Strict: auth endpoints — 10 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again in 15 minutes.' },
});

// Moderate: analysis uploads — 20 per hour per IP (credits are the real gate anyway)
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many analysis requests — please try again later.' },
});

// Payment: 30 per hour per IP — generous enough for legit use, blocks bulk abuse
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests — please try again later.' },
});
// ─────────────────────────────────────────────────────────────────────────────

// Lazy-load routes to avoid startup crashes from missing env vars
let authRoutes: express.Router;
let analysisRoutes: express.Router;
let paymentRouter: express.Router;
let adminRouter: express.Router;

try {
  authRoutes = require('./routes/auth').default;
  app.use('/api/auth', authLimiter, authRoutes);
  console.log('✅ Auth routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load auth routes:', e.message);
}

try {
  analysisRoutes = require('./routes/analysis').default;
  app.use('/api/analysis', analysisLimiter, analysisRoutes);
  console.log('✅ Analysis routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load analysis routes:', e.message);
}

try {
  paymentRouter = require('./routes/payment').default;
  app.use('/api/payment', paymentLimiter, paymentRouter);
  console.log('✅ Payment routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load payment routes:', e.message);
}

try {
  adminRouter = require('./routes/admin').default;
  app.use('/api/admin', adminRouter);
  console.log('✅ Admin routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load admin routes:', e.message);
}

try {
  const chatbotRouter = require('./routes/chatbot').default;
  app.use('/api/chatbot', chatbotRouter);
  console.log('✅ Chatbot routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load chatbot routes:', e.message);
}

try {
  const paradoxRouter = require('./routes/paradox').default;
  app.use('/api/paradox', paradoxRouter);
  console.log('✅ ParaDox routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load paradox routes:', e.message);
}

try {
  const encyclopediaRouter = require('./routes/encyclopedia').default;
  app.use('/api/encyclopedia', encyclopediaRouter);
  console.log('✅ Encyclopedia routes loaded');
} catch (e: any) {
  console.error('❌ Failed to load encyclopedia routes:', e.message);
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  🦠 ParasitePro MVP Backend          ║');
  console.log(`║  Port: ${PORT}                           ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}            ║`);
  console.log('╚═══════════════════════════════════════╝');
  console.log('✅ Server listening on port', PORT);

  // Run migrations and test DB connection (non-fatal)
  (async () => {
    try {
      const { runMigrations } = await import('./migrate');
      await runMigrations();
    } catch (err: any) {
      console.error('⚠️  Startup migration failed (non-fatal):', err.message);
    }
  })();
});

server.on('error', (err: any) => {
  console.error('❌ Server error:', err);
});

export default app;
