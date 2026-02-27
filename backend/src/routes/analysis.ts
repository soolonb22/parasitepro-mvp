import express, { Request, Response } from 'express';
import multer from 'multer';
import { body, param, query, validationResult } from 'express-validator';
import pool, { withTransaction } from '../config/database';
import { uploadImage } from '../config/cloudinary';
import { analyzeImage } from '../services/aiAnalysis';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  },
});

/**
 * POST /api/analysis/upload
 * Upload and analyze parasite sample image
 */
router.post(
  '/upload',
  authenticateToken,
  upload.single('image'),
  [
    body('sampleType')
      .optional()
      .isIn(['stool', 'blood', 'skin', 'other'])
      .withMessage('Invalid sample type'),
    body('collectionDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Location must be less than 255 characters'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'Upload failed', details: { message: 'No image file uploaded' } });
        return;
      }

      const userId = req.userId!;
      const { sampleType, collectionDate, location } = req.body;

      const userResult = await pool.query('SELECT image_credits FROM users WHERE id = $1', [userId]);

      if (userResult.rows.length === 0) {
        res.status(404).json({ error: 'User not found', details: { message: 'User account does not exist' } });
        return;
      }

      const credits = userResult.rows[0].image_credits;
      if (credits < 1) {
        res.status(402).json({
          error: 'Insufficient credits',
          details: { message: 'You need at least 1 credit to upload an image', creditsRequired: 1, creditsAvailable: credits },
        });
        return;
      }

      console.log('📤 Uploading image to Cloudinary...');

      const { url, thumbnailUrl, publicId } = await uploadImage(req.file.buffer, {
        folder: `parasitepro/user-${userId}`,
        public_id: `analysis-${Date.now()}`,
      });

      console.log('✅ Image uploaded:', url);

      const analysisResult = await withTransaction(async (client) => {
        await client.query('UPDATE users SET image_credits = image_credits - 1 WHERE id = $1', [userId]);
        const result = await client.query(
          `INSERT INTO analyses (user_id, image_url, thumbnail_url, status, sample_type, collection_date, location, uploaded_at, processing_started_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id, status, uploaded_at`,
          [userId, url, thumbnailUrl, 'processing', sampleType || null, collectionDate || null, location || null]
        );
        return result.rows[0];
      });

      const analysisId = analysisResult.id;
      console.log('🔬 Starting AI analysis for:', analysisId);

      analyzeImage(url)
        .then(async ({ detections }) => {
          console.log('✅ AI analysis complete for:', analysisId);
          await withTransaction(async (client) => {
            for (const detection of detections) {
              await client.query(
                `INSERT INTO detections (analysis_id, parasite_id, common_name, scientific_name, confidence_score, parasite_type, urgency_level, life_stage, bounding_box_x, bounding_box_y, bounding_box_width, bounding_box_height)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [analysisId, detection.parasiteId, detection.commonName, detection.scientificName, detection.confidenceScore, detection.parasiteType, detection.urgencyLevel, detection.lifeStage || null, detection.boundingBox?.x || null, detection.boundingBox?.y || null, detection.boundingBox?.width || null, detection.boundingBox?.height || null]
              );
            }
            await client.query(`UPDATE analyses SET status = 'completed', processing_completed_at = NOW() WHERE id = $1`, [analysisId]);
          });
          console.log('✅ Analysis saved to database:', analysisId);
        })
        .catch(async (error) => {
          console.error('❌ AI analysis failed:', error);
          await pool.query(`UPDATE analyses SET status = 'failed', processing_completed_at = NOW() WHERE id = $1`, [analysisId]);
        });

      res.status(202).json({ analysisId, status: 'processing', message: 'Image uploaded successfully. Analysis in progress.' });
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.message.includes('Invalid file type')) {
        res.status(400).json({ error: 'Invalid file type', details: { message: 'Only JPEG and PNG images are allowed' } });
        return;
      }
      res.status(500).json({ error: 'Upload failed', details: { message: 'Internal server error during upload' } });
    }
  }
);

/**
 * GET /api/analysis/:id
 * Get analysis results by ID
 */
router.get(
  '/:id',
  authenticateToken,
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { id } = req.params;
      const userId = req.userId!;

      const analysisResult = await pool.query(
        `SELECT a.id, a.image_url, a.thumbnail_url, a.status, a.sample_type, a.collection_date, a.location, a.uploaded_at, a.processing_started_at, a.processing_completed_at, a.user_id FROM analyses a WHERE a.id = $1`,
        [id]
      );

      if (analysisResult.rows.length === 0) {
        res.status(404).json({ error: 'Analysis not found', details: { message: 'The requested analysis does not exist' } });
        return;
      }

      const analysis = analysisResult.rows[0];

      if (analysis.user_id !== userId) {
        res.status(403).json({ error: 'Unauthorized', details: { message: 'You do not have access to this analysis' } });
        return;
      }

      const detectionsResult = await pool.query(
        `SELECT id, parasite_id, common_name, scientific_name, confidence_score, parasite_type, urgency_level, life_stage, bounding_box_x, bounding_box_y, bounding_box_width, bounding_box_height FROM detections WHERE analysis_id = $1 ORDER BY confidence_score DESC`,
        [id]
      );

      const detections = detectionsResult.rows.map((d) => ({
        id: d.id,
        parasiteId: d.parasite_id,
        commonName: d.common_name,
        scientificName: d.scientific_name,
        confidenceScore: parseFloat(d.confidence_score),
        parasiteType: d.parasite_type,
        urgencyLevel: d.urgency_level,
        lifeStage: d.life_stage,
        boundingBox: d.bounding_box_x !== null ? { x: d.bounding_box_x, y: d.bounding_box_y, width: d.bounding_box_width, height: d.bounding_box_height } : undefined,
      }));

      res.status(200).json({
        id: analysis.id, imageUrl: analysis.image_url, thumbnailUrl: analysis.thumbnail_url,
        status: analysis.status, sampleType: analysis.sample_type, collectionDate: analysis.collection_date,
        location: analysis.location, uploadedAt: analysis.uploaded_at,
        processingStartedAt: analysis.processing_started_at, processingCompletedAt: analysis.processing_completed_at,
        detections,
      });
    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ error: 'Failed to retrieve analysis', details: { message: 'Internal server error' } });
    }
  }
);

/**
 * GET /api/analysis/user/history
 * Get user's analysis history with pagination and filters
 */
router.get(
  '/user/history',
  authenticateToken,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be 0 or greater'),
    query('status').optional().isIn(['pending', 'processing', 'completed', 'failed']).withMessage('Invalid status filter'),
    query('sampleType').optional().isIn(['stool', 'blood', 'skin', 'other']).withMessage('Invalid sample type filter'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const status = req.query.status as string | undefined;
      const sampleType = req.query.sampleType as string | undefined;

      let queryText = `SELECT a.id, a.thumbnail_url, a.status, a.sample_type, a.uploaded_at, a.processing_completed_at, COUNT(d.id) as detection_count FROM analyses a LEFT JOIN detections d ON d.analysis_id = a.id WHERE a.user_id = $1`;
      const queryParams: any[] = [userId];
      let paramIndex = 2;

      if (status) { queryText += ` AND a.status = $${paramIndex}`; queryParams.push(status); paramIndex++; }
      if (sampleType) { queryText += ` AND a.sample_type = $${paramIndex}`; queryParams.push(sampleType); paramIndex++; }

      queryText += ` GROUP BY a.id ORDER BY a.uploaded_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);

      const analysesResult = await pool.query(queryText, queryParams);

      let countQuery = 'SELECT COUNT(*) FROM analyses WHERE user_id = $1';
      const countParams: any[] = [userId];
      let countParamIndex = 2;

      if (status) { countQuery += ` AND status = $${countParamIndex}`; countParams.push(status); countParamIndex++; }
      if (sampleType) { countQuery += ` AND sample_type = $${countParamIndex}`; countParams.push(sampleType); }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.status(200).json({
        analyses: analysesResult.rows.map((a) => ({
          id: a.id, thumbnailUrl: a.thumbnail_url, status: a.status, sampleType: a.sample_type,
          uploadedAt: a.uploaded_at, processingCompletedAt: a.processing_completed_at,
          detectionCount: parseInt(a.detection_count),
        })),
        total, limit, offset,
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Failed to retrieve history', details: { message: 'Internal server error' } });
    }
  }
);

/**
 * POST /api/analysis/:id/feedback
 * Submit feedback for an analysis
 */
router.post(
  '/:id/feedback',
  authenticateToken,
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return;
      }

      const { id } = req.params;
      const userId = req.userId!;
      const { wasHelpful, comment } = req.body;

      const analysisResult = await pool.query(
        'SELECT id, user_id FROM analyses WHERE id = $1',
        [id]
      );

      if (analysisResult.rows.length === 0) {
        res.status(404).json({ error: 'Analysis not found' });
        return;
      }

      if (analysisResult.rows[0].user_id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      await pool.query(
        'INSERT INTO feedback (analysis_id, user_id, was_helpful, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (analysis_id, user_id) DO UPDATE SET was_helpful = $3, comment = $4, created_at = NOW()',
        [id, userId, wasHelpful ?? null, comment || null]
      );

      res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error('Feedback error:', error);
      res.status(500).json({ error: 'Failed to submit feedback' });
    }
  }
);

export default router;
