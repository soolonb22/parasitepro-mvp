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

      analyzeImage(url, sampleType)
        .then(async (aiResult) => {
          const { detections, summary, overallAssessment, visualFindings, urgencyLevel, imageQuality,
                  differentialDiagnoses, recommendedActions, healthRisks, treatmentOptions,
                  gpTestingList, gpScriptIfDismissed, naturalRemedies } = aiResult;
          console.log('✅ AI analysis complete for:', analysisId);
          await withTransaction(async (client) => {
            for (const detection of detections) {
              await client.query(
                `INSERT INTO detections (analysis_id, parasite_id, common_name, scientific_name, confidence_score, parasite_type, urgency_level, life_stage, bounding_box_x, bounding_box_y, bounding_box_width, bounding_box_height)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [analysisId, detection.parasiteId, detection.commonName, detection.scientificName, detection.confidenceScore, detection.parasiteType, detection.urgencyLevel, detection.lifeStage || null, detection.boundingBox?.x || null, detection.boundingBox?.y || null, detection.boundingBox?.width || null, detection.boundingBox?.height || null]
              );
            }
            await client.query(
              `UPDATE analyses SET status = 'completed', processing_completed_at = NOW(),
               ai_summary = $2, overall_assessment = $3, visual_findings = $4, urgency_level = $5,
               image_quality = $6, differential_diagnoses = $7, recommended_actions = $8,
               health_risks = $9, treatment_options = $10, gp_testing_list = $11, gp_script_if_dismissed = $12, natural_remedies = $13
               WHERE id = $1`,
              [analysisId, summary || overallAssessment || null, overallAssessment || null,
               visualFindings || null, urgencyLevel || null, imageQuality || null,
               JSON.stringify(differentialDiagnoses || []), JSON.stringify(recommendedActions || []),
               JSON.stringify(healthRisks || []), JSON.stringify(treatmentOptions || []),
               JSON.stringify(gpTestingList || []), JSON.stringify(gpScriptIfDismissed || []),
               JSON.stringify(naturalRemedies || [])]
            );
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
        `SELECT a.id, a.image_url, a.thumbnail_url, a.status, a.sample_type, a.collection_date, a.location, a.uploaded_at, a.processing_started_at, a.processing_completed_at, a.user_id, a.ai_summary, a.overall_assessment, a.visual_findings, a.urgency_level, a.image_quality, a.differential_diagnoses, a.recommended_actions, a.health_risks, a.treatment_options, a.gp_testing_list, a.gp_script_if_dismissed, a.natural_remedies FROM analyses a WHERE a.id = $1`,
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
        aiSummary: analysis.ai_summary,
        overallAssessment: analysis.overall_assessment,
        visualFindings: analysis.visual_findings,
        urgencyLevel: analysis.urgency_level,
        imageQuality: analysis.image_quality,
        differentialDiagnoses: analysis.differential_diagnoses || [],
        recommendedActions: analysis.recommended_actions || [],
        healthRisks: analysis.health_risks || [],
        treatmentOptions: analysis.treatment_options || [],
        gpTestingList: analysis.gp_testing_list || [],
        gpScriptIfDismissed: analysis.gp_script_if_dismissed || [],
        naturalRemedies: analysis.natural_remedies || [],
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

// ─── Deep Dive Routes ─────────────────────────────────────────────────────────

// Run migration once on startup to add deep dive columns
(async () => {
  try {
    await pool.query(`
      ALTER TABLE analyses
        ADD COLUMN IF NOT EXISTS deep_dive_report JSONB,
        ADD COLUMN IF NOT EXISTS deep_dive_generated_at TIMESTAMPTZ
    `);
  } catch (e) {
    console.warn('Deep dive migration skipped:', e);
  }
})();

/**
 * GET /api/analysis/:id/deep-dive
 * Return cached deep dive report (free re-read)
 */
router.get(
  '/:id/deep-dive',
  authenticateToken,
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const result = await pool.query(
        `SELECT user_id, deep_dive_report, deep_dive_generated_at FROM analyses WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Analysis not found' });
        return;
      }
      if (result.rows[0].user_id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      if (!result.rows[0].deep_dive_report) {
        res.status(404).json({ error: 'No deep dive report generated yet' });
        return;
      }

      res.json({
        report: result.rows[0].deep_dive_report,
        generatedAt: result.rows[0].deep_dive_generated_at,
      });
    } catch (err) {
      console.error('Deep dive GET error:', err);
      res.status(500).json({ error: 'Failed to retrieve deep dive report' });
    }
  }
);

/**
 * POST /api/analysis/:id/deep-dive
 * Generate deep dive report — costs 1 credit. Cached after first generation.
 */
router.post(
  '/:id/deep-dive',
  authenticateToken,
  [param('id').isUUID().withMessage('Invalid analysis ID')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    try {
      const { id } = req.params;
      const userId = req.userId!;

      // 1. Load analysis + check ownership
      const analysisResult = await pool.query(
        `SELECT user_id, deep_dive_report, deep_dive_generated_at,
                overall_assessment, urgency_level
         FROM analyses WHERE id = $1`,
        [id]
      );

      if (analysisResult.rows.length === 0) {
        res.status(404).json({ error: 'Analysis not found' });
        return;
      }
      const analysis = analysisResult.rows[0];
      if (analysis.user_id !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      // 2. Return cached if already generated (free re-read)
      if (analysis.deep_dive_report) {
        res.json({ report: analysis.deep_dive_report, generatedAt: analysis.deep_dive_generated_at, cached: true });
        return;
      }

      // 3. Get detections to know what parasite to research
      const detectionsResult = await pool.query(
        `SELECT common_name, scientific_name, confidence_score, parasite_type
         FROM detections WHERE analysis_id = $1 ORDER BY confidence_score DESC LIMIT 1`,
        [id]
      );

      const detection = detectionsResult.rows[0];
      if (!detection) {
        res.status(400).json({ error: 'No parasite identified in this analysis — cannot generate deep dive' });
        return;
      }

      // 4. Check + deduct credits
      const userResult = await pool.query(
        `SELECT image_credits FROM users WHERE id = $1`,
        [userId]
      );
      const credits = userResult.rows[0]?.image_credits ?? 0;
      if (credits < 1) {
        res.status(402).json({
          error: 'Insufficient credits',
          details: { message: 'You need at least 1 credit to generate a Deep Dive report', creditsRequired: 1, creditsAvailable: credits },
        });
        return;
      }
      await pool.query(`UPDATE users SET image_credits = image_credits - 1 WHERE id = $1`, [userId]);

      // 5. Generate the report with Claude
      const parasiteName = detection.common_name || 'Unknown parasite';
      const scientificName = detection.scientific_name || '';

      const prompt = `You are a clinical parasitology expert. Generate a comprehensive, evidence-based deep dive research report on the following parasite for an Australian user.

PARASITE: ${parasiteName} (${scientificName})
PARASITE TYPE: ${detection.parasite_type || 'unknown'}
CLINICAL CONTEXT: ${analysis.overall_assessment || 'No additional context'}

Return ONLY valid JSON with NO markdown, NO backticks, NO preamble. Use this exact structure:

{
  "parasiteName": "${parasiteName}",
  "scientificName": "${scientificName}",
  "overview": "2-3 paragraph overview. What is it, where is it found, how significant is it clinically.",
  "taxonomy": "Full taxonomic classification: Kingdom, Phylum, Class, Order, Family, Genus, Species.",
  "lifecycle": "Detailed lifecycle description — definitive host, intermediate hosts, larval stages, how it completes its lifecycle.",
  "transmission": "How humans become infected. Routes, risk factors, environmental conditions. Include Australian-specific risks.",
  "symptomsAndProgression": "Symptom onset, acute vs chronic phases, systemic effects, what worsens outcomes.",
  "diagnosis": "How it is definitively diagnosed — stool ova/parasite exam, serology, imaging, biopsy. What Australian labs typically use.",
  "treatment": "Treatment categories used (e.g. anthelmintics, antiprotozoals) without specific drug dosages. Mention whether treatment requires a specialist. Note PBS-listed categories where relevant.",
  "prevention": "Practical prevention steps relevant to Australians — hygiene, travel precautions, food safety, pet treatment.",
  "australianRelevance": "Is this parasite endemic to Australia or Queensland? Known outbreaks, notifiable disease status, NHMRC guidelines if applicable.",
  "keyFacts": ["5–8 short bullet-point key facts a patient would find valuable"],
  "sources": [
    { "title": "Source title or document name", "organisation": "WHO / CDC / NHMRC / TGA / Queensland Health / PubMed / etc", "year": "Year if known" }
  ]
}

Draw on knowledge from WHO, CDC, NHMRC, Queensland Health, TGA, UpToDate, and peer-reviewed literature. Cite 4–6 authoritative sources. Be specific, clinically accurate, and write in plain English accessible to an educated general audience. Do not prescribe specific medication names or dosages.`;

      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      const rawText = response.content
        .filter((c) => c.type === 'text')
        .map((c) => (c as any).text)
        .join('');

      // Parse JSON — strip any accidental backtick fences
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      let report: any;
      try {
        report = JSON.parse(cleaned);
      } catch {
        console.error('Deep dive JSON parse error. Raw:', rawText.slice(0, 500));
        // Refund credit since generation failed
        await pool.query(`UPDATE users SET image_credits = image_credits + 1 WHERE id = $1`, [userId]);
        res.status(500).json({ error: 'Failed to parse deep dive report. Credit refunded.' });
        return;
      }

      // 6. Store in DB
      await pool.query(
        `UPDATE analyses SET deep_dive_report = $1, deep_dive_generated_at = NOW() WHERE id = $2`,
        [JSON.stringify(report), id]
      );

      res.json({ report, cached: false });
    } catch (err: any) {
      console.error('Deep dive POST error:', err);
      res.status(500).json({ error: 'Failed to generate deep dive report' });
    }
  }
);

export default router;

