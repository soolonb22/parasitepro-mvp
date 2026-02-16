import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Validate required environment variables
const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'];
const missing = required.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Missing env vars:', missing.join(', '));
  process.exit(1);
}

// Database connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()').then((res) => {
  console.log('✅ DB connected:', res.rows[0].now);
}).catch((err) => {
  console.error('❌ DB error:', err.message);
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
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
  res.json({ status: 'healthy' });
});

// Auth routes
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(password, 12);
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, image_credits) VALUES ($1, $2, $3, $4, 0) RETURNING id, email, first_name, last_name, image_credits',
      [email.toLowerCase(), hash, firstName || null, lastName || null]
    );
    
    const user = result.rows[0];
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    console.log('✅ User registered:', user.email);
    
    res.status(201).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name, 
        lastName: user.last_name, 
        imageCredits: user.image_credits 
      }, 
      accessToken, 
      refreshToken 
    });
  } catch (error: any) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const bcrypt = require('bcrypt');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    
    console.log('✅ User logged in:', user.email);
    
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name, 
        lastName: user.last_name, 
        imageCredits: user.image_credits 
      }, 
      accessToken, 
      refreshToken 
    });
  } catch (error: any) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  🦠 ParasitePro MVP Backend          ║');
  console.log(`║  Port: ${PORT}                           ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}            ║`);
  console.log('╚═══════════════════════════════════════╝');
});
```

---

## 💾 **STEP 3: COMMIT THE CHANGES**

1. Scroll to bottom
2. In "Commit message" box, type: `Fix backend code`
3. Click **"Commit changes"** button

---

## ⏰ **STEP 4: WAIT 3 MINUTES**

Railway will automatically detect the change and redeploy!

---

## 🔍 **STEP 5: TEST IT**

After 3 minutes, open:
```
https://parasitepro-mvp-production.up.railway.app/
