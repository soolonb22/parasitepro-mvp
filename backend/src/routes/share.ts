import express, { Response } from 'express';
import crypto from 'crypto';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/share
 * Authenticated — create a 7-day share link for an analysis the caller owns.
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { analysisId } = req.body;
  if (!analysisId) {
    res.status(400).json({ error: 'analysisId is required' });
    return;
  }

  try {
    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM analyses WHERE id = $1 AND user_id = $2 AND status = $3',
      [analysisId, req.userId, 'completed']
    );
    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: 'Analysis not found or not yet complete' });
      return;
    }

    // Reuse existing non-expired token if present
    const existing = await pool.query(
      'SELECT token FROM shared_analyses WHERE analysis_id = $1 AND expires_at > NOW()',
      [analysisId]
    );
    if (existing.rows.length > 0) {
      res.json({ token: existing.rows[0].token });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO shared_analyses (analysis_id, token, expires_at) VALUES ($1, $2, $3)',
      [analysisId, token, expiresAt]
    );

    res.json({ token });
  } catch (err: any) {
    console.error('Share create error:', err.message);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

/**
 * GET /api/share/view/:token
 * Public — retrieve a shared analysis. Increments view count.
 */
router.get('/view/:token', async (req, res: Response): Promise<void> => {
  const { token } = req.params;

  try {
    const shareRow = await pool.query(
      `SELECT sa.id, sa.analysis_id, sa.expires_at, sa.view_count
       FROM shared_analyses sa
       WHERE sa.token = $1 AND sa.expires_at > NOW()`,
      [token]
    );

    if (shareRow.rows.length === 0) {
      res.status(404).json({ error: 'This share link has expired or does not exist' });
      return;
    }

    const share = shareRow.rows[0];

    // Increment view count
    await pool.query(
      'UPDATE shared_analyses SET view_count = view_count + 1 WHERE id = $1',
      [share.id]
    );

    // Fetch analysis data
    const analysisRow = await pool.query(
      `SELECT a.id, a.image_url, a.thumbnail_url, a.status, a.sample_type,
              a.uploaded_at, a.processing_completed_at,
              a.ai_summary, a.overall_assessment, a.urgency_level,
              a.differential_diagnoses, a.natural_remedies, a.treatment_options,
              a.recommended_actions
       FROM analyses a
       WHERE a.id = $1 AND a.status = 'completed'`,
      [share.analysis_id]
    );

    if (analysisRow.rows.length === 0) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    const a = analysisRow.rows[0];

    res.json({
      analysis: {
        id: a.id,
        imageUrl: a.image_url,
        thumbnailUrl: a.thumbnail_url,
        sampleType: a.sample_type,
        completedAt: a.processing_completed_at,
        overallDiagnosis: a.overall_assessment,
        aiSummary: a.ai_summary,
        urgencyLevel: a.urgency_level,
        fullAnalysis: {
          differentialDiagnoses: a.differential_diagnoses || [],
          naturalTreatments: a.natural_remedies || a.treatment_options || [],
        },
        disclaimer: 'This analysis is for informational purposes only and is not a substitute for professional medical advice.',
      },
      expiresAt: share.expires_at,
      viewCount: share.view_count + 1,
    });
  } catch (err: any) {
    console.error('Share view error:', err.message);
    res.status(500).json({ error: 'Failed to load shared analysis' });
  }
});

export default router;
