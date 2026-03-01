/**
 * analysisRoutes.js
 * Updated analysis routes for ParasitePro
 * Integrates: image preprocessing, enhanced AI analysis, PDF export, share links
 *
 * Mount in your main server as:
 *   app.use('/api/analysis', analysisRouter);
 */

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeImage } from '../services/aiAnalysis.js';
import { generatePDFReport } from '../services/pdfReport.js';

const router = express.Router();

// ─── MULTER CONFIG ────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are accepted.'));
    }
  }
});

// ─── CLOUDINARY UPLOAD HELPER ─────────────────────────────────────────────────

async function uploadToCloudinary(buffer, folder = 'parasitepro') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function uploadThumbnail(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'parasitepro/thumbnails',
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto:eco' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// ─── POST /upload ─────────────────────────────────────────────────────────────

/**
 * POST /api/analysis/upload
 * Upload image, run AI analysis, store results
 */
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const userId = req.user.id;
  const {
    sampleType = 'other',
    collectionDate,
    location,
    notes
  } = req.body;

  const client = await req.db.connect();
  try {
    // 1. Check user has credits
    const userResult = await client.query(
      'SELECT image_credits, first_name, last_name, email FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];
    if (user.image_credits < 1) {
      return res.status(402).json({
        error: 'Insufficient credits.',
        creditsRequired: 1,
        currentBalance: user.image_credits,
        purchaseUrl: `${process.env.FRONTEND_URL}/pricing`
      });
    }

    // 2. Deduct credit immediately (prevents double-spend)
    await client.query(
      'UPDATE users SET image_credits = image_credits - 1 WHERE id = $1',
      [userId]
    );

    // 3. Upload to Cloudinary (original + thumbnail in parallel)
    console.log('☁️ Uploading to Cloudinary...');
    const [cloudResult, thumbResult] = await Promise.all([
      uploadToCloudinary(req.file.buffer),
      uploadThumbnail(req.file.buffer)
    ]);

    // 4. Create analysis record (status: processing)
    const analysisResult = await client.query(
      `INSERT INTO analyses 
        (user_id, image_url, thumbnail_url, status, sample_type, collection_date, location, processing_started_at)
       VALUES ($1, $2, $3, 'processing', $4, $5, $6, NOW())
       RETURNING id`,
      [
        userId,
        cloudResult.secure_url,
        thumbResult.secure_url,
        sampleType,
        collectionDate || null,
        location || null
      ]
    );

    const analysisId = analysisResult.rows[0].id;

    // 5. Run AI analysis (preprocessing + Claude Vision)
    console.log(`🔬 Starting AI analysis for ${analysisId}...`);
    let aiResult;
    try {
      aiResult = await analyzeImage(req.file.buffer, {
        sampleType,
        collectionDate,
        location,
        notes
      });
    } catch (aiError) {
      console.error('AI analysis failed:', aiError.message);
      // Refund credit if AI fails
      await client.query(
        'UPDATE users SET image_credits = image_credits + 1 WHERE id = $1',
        [userId]
      );
      await client.query(
        "UPDATE analyses SET status = 'failed' WHERE id = $1",
        [analysisId]
      );
      return res.status(500).json({
        error: 'AI analysis failed. Your credit has been refunded.',
        analysisId
      });
    }

    // 6. Store detections in database
    const detections = aiResult.detections || [];

    for (const detection of detections) {
      await client.query(
        `INSERT INTO detections 
          (analysis_id, parasite_id, common_name, scientific_name, confidence_score,
           parasite_type, urgency_level, life_stage,
           bounding_box_x, bounding_box_y, bounding_box_width, bounding_box_height)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          analysisId,
          detection.parasiteId,
          detection.commonName,
          detection.scientificName,
          detection.confidenceScore,
          detection.parasiteType,
          detection.urgencyLevel,
          detection.lifeStage,
          detection.boundingBox?.x || null,
          detection.boundingBox?.y || null,
          detection.boundingBox?.width || null,
          detection.boundingBox?.height || null
        ]
      );
    }

    // 7. Update analysis record with full AI result
    await client.query(
      `UPDATE analyses 
       SET status = 'completed',
           processing_completed_at = NOW(),
           ai_result = $1
       WHERE id = $2`,
      [JSON.stringify(aiResult), analysisId]
    );

    // 8. Get updated credit balance
    const balanceResult = await client.query(
      'SELECT image_credits FROM users WHERE id = $1',
      [userId]
    );

    console.log(`✅ Analysis ${analysisId} complete. ${detections.length} detection(s).`);

    res.status(201).json({
      analysisId,
      status: 'completed',
      detectionsCount: detections.length,
      overallUrgency: aiResult.overallUrgency,
      creditsRemaining: balanceResult.rows[0].image_credits,
      message: 'Analysis complete.'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed. Please try again.' });
  } finally {
    client.release();
  }
});

// ─── GET /:id ─────────────────────────────────────────────────────────────────

/**
 * GET /api/analysis/:id
 * Get full analysis result with detections and AI reasoning
 */
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const client = await req.db.connect();
    try {
      const result = await client.query(
        `SELECT a.*, 
                json_agg(
                  json_build_object(
                    'id', d.id,
                    'parasiteId', d.parasite_id,
                    'commonName', d.common_name,
                    'scientificName', d.scientific_name,
                    'confidenceScore', d.confidence_score,
                    'parasiteType', d.parasite_type,
                    'urgencyLevel', d.urgency_level,
                    'lifeStage', d.life_stage,
                    'boundingBox', CASE 
                      WHEN d.bounding_box_x IS NOT NULL 
                      THEN json_build_object('x', d.bounding_box_x, 'y', d.bounding_box_y, 'width', d.bounding_box_width, 'height', d.bounding_box_height)
                      ELSE NULL 
                    END
                  )
                ) FILTER (WHERE d.id IS NOT NULL) as detections
         FROM analyses a
         LEFT JOIN detections d ON a.id = d.analysis_id
         WHERE a.id = $1 AND a.user_id = $2
         GROUP BY a.id`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Analysis not found.' });
      }

      const row = result.rows[0];
      res.json({
        id: row.id,
        imageUrl: row.image_url,
        thumbnailUrl: row.thumbnail_url,
        status: row.status,
        sampleType: row.sample_type,
        collectionDate: row.collection_date,
        location: row.location,
        uploadedAt: row.uploaded_at,
        completedAt: row.processing_completed_at,
        detections: row.detections || [],
        aiResult: row.ai_result,
        // Include image quality assessment if available
        imageQuality: row.ai_result?.imageQuality || null,
        analysisSteps: row.ai_result?.analysisSteps || [],
        overallUrgency: row.ai_result?.overallUrgency || 'unknown',
        overallConclusion: row.ai_result?.overallConclusion || null,
        recommendedActions: row.ai_result?.recommendedActions || [],
        recommendedTests: row.ai_result?.recommendedTests || []
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis.' });
  }
});

// ─── GET /user/history ─────────────────────────────────────────────────────────

/**
 * GET /api/analysis/user/history
 */
router.get('/user/history', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, offset = 0, status, sampleType } = req.query;

  try {
    const client = await req.db.connect();
    try {
      let whereClause = 'WHERE a.user_id = $1';
      const params = [userId];
      let paramCount = 1;

      if (status) {
        paramCount++;
        whereClause += ` AND a.status = $${paramCount}`;
        params.push(status);
      }

      if (sampleType) {
        paramCount++;
        whereClause += ` AND a.sample_type = $${paramCount}`;
        params.push(sampleType);
      }

      const countResult = await client.query(
        `SELECT COUNT(*) FROM analyses a ${whereClause}`,
        params
      );

      const analysesResult = await client.query(
        `SELECT a.id, a.thumbnail_url, a.image_url, a.status, a.sample_type,
                a.uploaded_at, a.processing_completed_at, a.location,
                COUNT(d.id) as detection_count,
                a.ai_result->>'overallUrgency' as urgency
         FROM analyses a
         LEFT JOIN detections d ON a.id = d.analysis_id
         ${whereClause}
         GROUP BY a.id
         ORDER BY a.uploaded_at DESC
         LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
        [...params, limit, offset]
      );

      res.json({
        analyses: analysesResult.rows,
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to retrieve history.' });
  }
});

// ─── GET /:id/pdf ─────────────────────────────────────────────────────────────

/**
 * GET /api/analysis/:id/pdf
 * Generate and download PDF report
 */
router.get('/:id/pdf', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const client = await req.db.connect();
    try {
      const result = await client.query(
        `SELECT a.*, u.first_name, u.last_name, u.email
         FROM analyses a
         JOIN users u ON a.user_id = u.id
         WHERE a.id = $1 AND a.user_id = $2`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Analysis not found.' });
      }

      const row = result.rows[0];
      const user = {
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email
      };

      const pdfBuffer = await generatePDFReport(row, user);

      const filename = `ParasitePro-Report-${id.slice(0, 8)}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report.' });
  }
});

export default router;
