import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateToken,
  AuthRequest,
} from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('First name must be less than 100 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Last name must be less than 100 characters'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        res.status(409).json({ 
          error: 'Registration failed',
          details: { field: 'email', message: 'Email already registered' }
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, image_credits)
         VALUES ($1, $2, $3, $4, 0)
         RETURNING id, email, first_name, last_name, image_credits, created_at`,
        [email, passwordHash, firstName || null, lastName || null]
      );

      const user = result.rows[0];

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      console.log('✅ User registered:', user.email);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          imageCredits: user.image_credits,
          createdAt: user.created_at,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        error: 'Registration failed',
        details: { message: 'Internal server error' }
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT id, email, password_hash, first_name, last_name, image_credits FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ 
          error: 'Authentication failed',
          details: { message: 'Invalid email or password' }
        });
        return;
      }

      const user = result.rows[0];

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid) {
        res.status(401).json({ 
          error: 'Authentication failed',
          details: { message: 'Invalid email or password' }
        });
        return;
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      console.log('✅ User logged in:', user.email);

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          imageCredits: user.image_credits,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        details: { message: 'Internal server error' }
      });
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { refreshToken } = req.body;

      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Generate new access token
      const newAccessToken = generateAccessToken(payload.userId, payload.email);

      console.log('✅ Token refreshed for user:', payload.email);

      res.status(200).json({
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(403).json({ 
        error: 'Token refresh failed',
        details: { message: 'Invalid or expired refresh token' }
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user (client should delete tokens)
 */
router.post(
  '/logout',
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('✅ User logged out:', req.userEmail);
      
      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Logout failed',
        details: { message: 'Internal server error' }
      });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get(
  '/me',
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, image_credits, created_at, last_login_at FROM users WHERE id = $1',
        [req.userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ 
          error: 'User not found',
          details: { message: 'User account no longer exists' }
        });
        return;
      }

      const user = result.rows[0];

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          imageCredits: user.image_credits,
          createdAt: user.created_at,
          lastLoginAt: user.last_login_at,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve profile',
        details: { message: 'Internal server error' }
      });
    }
  }
);

export default router;
