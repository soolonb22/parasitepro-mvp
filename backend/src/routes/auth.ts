import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { query } from '../config/database';
import { generateAccessToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name, image_credits) VALUES ($1, $2, $3, $4, 0) RETURNING id, email, first_name, last_name, image_credits',
      [email, passwordHash, firstName || null, lastName || null]
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user.id, user.email);

    console.log(' User registered:', user.email);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        imageCredits: user.image_credits
      },
      accessToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, image_credits FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    const accessToken = generateAccessToken(user.id, user.email);

    console.log(' User logged in:', user.email);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        imageCredits: user.image_credits
      },
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: 'Email required' }); return; }

    const userResult = await query('SELECT id, email FROM users WHERE email = $1', [email]);
    // Always return 200 to avoid email enumeration
    if (userResult.rows.length === 0) {
      res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
      return;
    }

    const user = userResult.rows[0];
    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any existing unused tokens for this user
    await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL', [user.id]);
    // Insert new token
    await query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'https://www.notworms.com';
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    // Send email if SMTP is configured, otherwise log
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `ParasitePro <noreply@notworms.com>`,
          to: user.email,
          subject: 'Reset your ParasitePro password',
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0E0F11; color: #F5F0E8; border-radius: 12px;">
              <h2 style="color: #D97706; margin-bottom: 8px;">ParasitePro</h2>
              <p style="margin-bottom: 24px;">You requested a password reset. Click the button below to set a new password.</p>
              <a href="${resetLink}" style="display: inline-block; background: #D97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
              <p style="margin-top: 24px; font-size: 13px; color: #6B7280;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
              <p style="font-size: 12px; color: #6B7280;">Or copy this link: ${resetLink}</p>
            </div>
          `,
        });
        console.log('✅ Password reset email sent to:', user.email);
      } catch (emailErr) {
        console.error('❌ Email send failed:', emailErr);
        // Don't expose failure — token is still valid
      }
    } else {
      // Dev/no-SMTP fallback: log token to console
      console.log(`\n🔑 PASSWORD RESET LINK (no SMTP configured):\n${resetLink}\n`);
    }

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Request failed' });
  }
});


// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) { res.status(400).json({ error: 'Token and password required' }); return; }
    if (password.length < 8) { res.status(400).json({ error: 'Password must be at least 8 characters' }); return; }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenResult = await query(
      `SELECT prt.id, prt.user_id, prt.expires_at, prt.used_at
       FROM password_reset_tokens prt
       WHERE prt.token_hash = $1`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      res.status(400).json({ error: 'Invalid or expired reset link' }); return;
    }

    const resetToken = tokenResult.rows[0];
    if (resetToken.used_at) { res.status(400).json({ error: 'Reset link already used' }); return; }
    if (new Date(resetToken.expires_at) < new Date()) { res.status(400).json({ error: 'Reset link expired' }); return; }

    const passwordHash = await bcrypt.hash(password, 12);

    // Update password + mark token used in a transaction
    await query('BEGIN');
    try {
      await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetToken.user_id]);
      await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [resetToken.id]);
      // Invalidate all other tokens for this user
      await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND id != $2 AND used_at IS NULL', [resetToken.user_id, resetToken.id]);
      await query('COMMIT');
    } catch (txErr) {
      await query('ROLLBACK');
      throw txErr;
    }

    console.log('✅ Password reset for user:', resetToken.user_id);
    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Reset failed' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      'SELECT id, email, first_name, last_name, image_credits, is_admin FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: 'User not found' }); return; }
    const u = result.rows[0];
    res.json({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      imageCredits: u.image_credits,
      isAdmin: u.is_admin,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
