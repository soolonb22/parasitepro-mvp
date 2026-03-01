/**
 * shareRoutes.js
 * Secure shareable result links for ParasitePro
 * Allows users to share analysis results with GPs / healthcare providers
 * Links expire after 30 days and require a token (not login)
 */

import express from 'express';
import crypto from 'crypto';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function generateShareToken() {
  return crypto.randomBytes(24).toString('base64url');
}

function getExpiryDate(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// ─── CREATE SHARE LINK ────────────────────────────────────────────────────────

/**
 * POST /api/share/:analysisId
 * Creates a secure shareable link for an analysis
 * Auth required — only the owner can create a share link
 */
router.post('/:analysisId', authenticateToken, async (req, res) => {
  const { analysisId } = req.params;
  const userId = req.user.id;
  const { expiryDays = 30 } = req.body;

  try {
    const client = await req.db.connect();
    try {
      // Verify user owns this analysis
      const ownerCheck = await client.query(
        'SELECT id FROM analyses WHERE id = $1 AND user_id = $2',
        [analysisId, userId]
      );

      if (ownerCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Analysis not found or access denied.' });
      }

      // Check if a share link already exists for this analysis
      const existingShare = await client.query(
        'SELECT share_token, expires_at FROM shared_results WHERE analysis_id = $1 AND expires_at > NOW()',
        [analysisId]
      );

      if (existingShare.rows.length > 0) {
        const share = existingShare.rows[0];
        const shareUrl = `${process.env.FRONTEND_URL}/shared/${share.share_token}`;
        return res.json({
          shareUrl,
          shareToken: share.share_token,
          expiresAt: share.expires_at,
          message: 'Existing share link returned.'
        });
      }

      // Create new share link
      const shareToken = generateShareToken();
      const expiresAt = getExpiryDate(Math.min(expiryDays, 90)); // Max 90 days

      await client.query(
        `INSERT INTO shared_results (analysis_id, share_token, created_by, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [analysisId, shareToken, userId, expiresAt]
      );

      const shareUrl = `${process.env.FRONTEND_URL}/shared/${shareToken}`;

      res.status(201).json({
        shareUrl,
        shareToken,
        expiresAt,
        message: 'Share link created successfully.'
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create share link error:', error);
    res.status(500).json({ error: 'Failed to create share link.' });
  }
});

// ─── REVOKE SHARE LINK ────────────────────────────────────────────────────────

/**
 * DELETE /api/share/:analysisId
 * Revokes all share links for an analysis
 */
router.delete('/:analysisId', authenticateToken, async (req, res) => {
  const { analysisId } = req.params;
  const userId = req.user.id;

  try {
    const client = await req.db.connect();
    try {
      // Verify ownership
      const ownerCheck = await client.query(
        'SELECT id FROM analyses WHERE id = $1 AND user_id = $2',
        [analysisId, userId]
      );

      if (ownerCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Analysis not found or access denied.' });
      }

      await client.query(
        'DELETE FROM shared_results WHERE analysis_id = $1',
        [analysisId]
      );

      res.json({ message: 'Share link(s) revoked successfully.' });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Revoke share link error:', error);
    res.status(500).json({ error: 'Failed to revoke share link.' });
  }
});

// ─── VIEW SHARED RESULT ───────────────────────────────────────────────────────

/**
 * GET /api/share/view/:token
 * Public endpoint — no auth required, only token
 * Returns sanitised analysis result for sharing with GPs
 */
router.get('/view/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const client = await req.db.connect();
    try {
      // Find and validate share record
      const shareResult = await client.query(
        `SELECT sr.analysis_id, sr.expires_at, sr.view_count,
                a.id, a.image_url, a.thumbnail_url, a.status, a.sample_type,
                a.collection_date, a.location, a.uploaded_at, a.processing_completed_at,
                a.ai_result,
                u.first_name, u.last_name
         FROM shared_results sr
         JOIN analyses a ON sr.analysis_id = a.id
         JOIN users u ON a.user_id = u.id
         WHERE sr.share_token = $1`,
        [token]
      );

      if (shareResult.rows.length === 0) {
        return res.status(404).json({ error: 'Share link not found or has expired.' });
      }

      const row = shareResult.rows[0];

      // Check expiry
      if (new Date(row.expires_at) < new Date()) {
        return res.status(410).json({
          error: 'This share link has expired.',
          expiredAt: row.expires_at
        });
      }

      // Increment view count
      await client.query(
        'UPDATE shared_results SET view_count = view_count + 1, last_viewed_at = NOW() WHERE share_token = $1',
        [token]
      );

      // Return sanitised result (no email, no payment data)
      res.json({
        analysis: {
          id: row.id,
          imageUrl: row.thumbnail_url || row.image_url,
          status: row.status,
          sampleType: row.sample_type,
          collectionDate: row.collection_date,
          location: row.location,
          uploadedAt: row.uploaded_at,
          completedAt: row.processing_completed_at,
          result: row.ai_result
        },
        patient: {
          firstName: row.first_name,
          lastName: row.last_name
          // No email exposed in shared view
        },
        shareInfo: {
          expiresAt: row.expires_at,
          viewCount: (row.view_count || 0) + 1
        },
        disclaimer: 'This report is generated by ParasitePro AI for educational purposes only. It does not constitute medical advice or diagnosis. This AI tool is not a substitute for professional medical evaluation.'
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('View shared result error:', error);
    res.status(500).json({ error: 'Failed to retrieve shared result.' });
  }
});

// ─── GET SHARE STATUS ─────────────────────────────────────────────────────────

/**
 * GET /api/share/:analysisId/status
 * Check if a share link exists for an analysis
 */
router.get('/:analysisId/status', authenticateToken, async (req, res) => {
  const { analysisId } = req.params;
  const userId = req.user.id;

  try {
    const client = await req.db.connect();
    try {
      const result = await client.query(
        `SELECT sr.share_token, sr.expires_at, sr.view_count, sr.created_at
         FROM shared_results sr
         JOIN analyses a ON sr.analysis_id = a.id
         WHERE sr.analysis_id = $1 AND a.user_id = $2 AND sr.expires_at > NOW()`,
        [analysisId, userId]
      );

      if (result.rows.length === 0) {
        return res.json({ hasActiveShare: false });
      }

      const share = result.rows[0];
      res.json({
        hasActiveShare: true,
        shareUrl: `${process.env.FRONTEND_URL}/shared/${share.share_token}`,
        shareToken: share.share_token,
        expiresAt: share.expires_at,
        viewCount: share.view_count,
        createdAt: share.created_at
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Share status error:', error);
    res.status(500).json({ error: 'Failed to get share status.' });
  }
});

export default router;

// ─── DATABASE MIGRATION ───────────────────────────────────────────────────────
// Run this SQL on your Railway PostgreSQL database to add share functionality:
//
// CREATE TABLE IF NOT EXISTS shared_results (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
//   share_token VARCHAR(64) UNIQUE NOT NULL,
//   created_by UUID NOT NULL REFERENCES users(id),
//   expires_at TIMESTAMP NOT NULL,
//   view_count INTEGER DEFAULT 0,
//   last_viewed_at TIMESTAMP,
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE INDEX idx_shared_results_token ON shared_results(share_token);
// CREATE INDEX idx_shared_results_analysis ON shared_results(analysis_id);
