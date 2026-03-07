import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';
import paymentRouter from './routes/payment';
import pool from './config/database';

dotenv.config();

// Validate required environment variables
const required = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'];
const missing = required.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Missing environment variables:', missing.join(', '));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed CORS origins
const allowedOrigins = [
  'https://www.notworms.com',
  'https://notworms.com',
  'https://parasitepro-mvp.vercel.app',
];

const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
  allowedOrigins.push(frontendUrl);
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  credentials: true
}));

// Health check endpoints
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ParasitePro Backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/payment', paymentRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  🦠 ParasitePro MVP Backend          ║');
  console.log(`║  Port: ${PORT}                           ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}            ║`);
  console.log('╚═══════════════════════════════════════╝');
});

export default app;
```

Paste that into GitHub at:
```
https://github.com/soolonb22/parasitepro-mvp/edit/main/backend/src/index.ts
