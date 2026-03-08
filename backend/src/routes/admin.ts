import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ── Middleware: require admin ─────────────────────────────────────────────────
async function requireAdmin(req: Request, res: Response, next: Function) {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [userId]
    );
    if (!result.rows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

// ── GET /api/admin/check ──────────────────────────────────────────────────────
router.get('/check', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    res.json({ isAdmin: result.rows[0]?.is_admin === true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [users, analyses, revenue, recentUsers, recentTransactions] = await Promise.all([
      // User stats
      pool.query(`
        SELECT
          COUNT(*) AS total_users,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') AS today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS last_7_days,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS last_30_days
        FROM users
      `),
      // Analysis stats
      pool.query(`
        SELECT
          COUNT(*) AS total_analyses,
          COUNT(*) FILTER (WHERE uploaded_at >= NOW() - INTERVAL '1 day') AS today,
          COUNT(*) FILTER (WHERE uploaded_at >= NOW() - INTERVAL '7 days') AS last_7_days
        FROM analyses
      `),
      // Revenue stats
      pool.query(`
        SELECT
          COALESCE(SUM(amount), 0) AS total_revenue,
          COALESCE(SUM(amount) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days'), 0) AS last_30_days,
          COALESCE(SUM(amount) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'), 0) AS last_7_days
        FROM payments WHERE status = 'succeeded'
      `),
      // Recent users
      pool.query(`
        SELECT id, email, first_name, last_name, image_credits, created_at
        FROM users ORDER BY created_at DESC LIMIT 10
      `),
      // Recent transactions
      pool.query(`
        SELECT p.id, p.amount, p.credits_purchased AS credits, p.status, p.created_at,
               u.email
        FROM payments p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC LIMIT 10
      `),
    ]);

    res.json({
      users: users.rows[0],
      analyses: analyses.rows[0],
      revenue: revenue.rows[0],
      recentUsers: recentUsers.rows,
      recentTransactions: recentTransactions.rows,
      notifications: [],
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── GET /api/admin/search-user ────────────────────────────────────────────────
router.get('/search-user', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.json({ users: [] });
  }
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, image_credits, created_at
       FROM users WHERE email ILIKE $1 LIMIT 10`,
      [`%${email}%`]
    );
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// ── POST /api/admin/grant-credits ─────────────────────────────────────────────
router.post('/grant-credits', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  const { email, credits, reason } = req.body;

  if (!email || !credits || isNaN(Number(credits)) || Number(credits) < 1) {
    return res.status(400).json({ error: 'Valid email and credits required' });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET image_credits = image_credits + $1
       WHERE email = $2
       RETURNING id, email, image_credits`,
      [Number(credits), email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No user found with email: ${email}` });
    }

    const user = result.rows[0];
    console.log(`[ADMIN] Granted ${credits} credits to ${email}. Reason: ${reason || 'none'}. New balance: ${user.image_credits}`);

    res.json({
      user: {
        email: user.email,
        creditsGranted: Number(credits),
        newBalance: user.image_credits,
        previousBalance: user.image_credits - Number(credits),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to grant credits' });
  }
});


// ── POST /api/admin/setup-admin (bootstrap only - requires JWT_SECRET) ─────────
router.post('/setup-admin', async (req: Request, res: Response) => {
  const { email, setupSecret } = req.body;
  if (!setupSecret || setupSecret !== process.env.JWT_SECRET) {
    return res.status(403).json({ error: 'Invalid setup secret' });
  }
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;');
    const result = await pool.query(
      'UPDATE users SET is_admin = TRUE WHERE email = $1 RETURNING email, is_admin',
      [email]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ── GET /api/admin/list-users (bootstrap only) ───────────────────────────────
router.get('/list-users', async (req: Request, res: Response) => {
  const secret = req.headers['x-setup-secret'];
  if (!secret || secret !== process.env.JWT_SECRET) {
    return res.status(403).json({ error: 'Invalid setup secret' });
  }
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ── POST /api/admin/update-email (bootstrap only) ────────────────────────────
router.post('/update-email', async (req: Request, res: Response) => {
  const { oldEmail, newEmail, setupSecret } = req.body;
  if (!setupSecret || setupSecret !== process.env.JWT_SECRET) {
    return res.status(403).json({ error: 'Invalid setup secret' });
  }
  if (!oldEmail || !newEmail) {
    return res.status(400).json({ error: 'oldEmail and newEmail required' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET email = $1 WHERE email = $2 RETURNING id, email, is_admin',
      [newEmail, oldEmail]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
