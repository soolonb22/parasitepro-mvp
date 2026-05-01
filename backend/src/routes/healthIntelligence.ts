// routes/healthIntelligence.ts
// PARA Health Intelligence — AI-powered educational health research engine
// Paywall: subscribers free, non-subscribers 1 credit per AI brief
// All output is educational only — TGA/AHPRA compliant framing throughout

import { Router } from 'express';
import pool from '../config/database';
import { authenticateToken } from '../middleware/auth';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// ─── HEALTH INTELLIGENCE PROMPT ────────────────────────────────────────────────
// Designed to surface genuinely useful, research-backed educational information
// while staying compliant with TGA SaMD rules and AHPRA advertising guidelines
const buildIntelligencePrompt = (symptoms: string[], context: string, journalSummary: string) => `
You are PARA Health Intelligence — an advanced educational research engine specialising in parasitic, gut, and environmental health. Your role is to surface research-backed educational information that helps people understand what science, traditional medicine, and clinical practitioners have documented about their symptoms and body burden concerns.

USER SYMPTOMS / CONCERNS:
${symptoms.join(', ')}

USER CONTEXT:
${context || 'No additional context provided'}

RECENT JOURNAL DATA:
${journalSummary || 'No journal history available'}

EDUCATIONAL BRIEF STRUCTURE — respond in this exact JSON format:

{
  "headline": "2-sentence plain English summary of what research suggests about these symptom patterns",
  "patternInsight": "What researchers understand about this combination of symptoms — patterns documented in clinical and epidemiological literature",
  "conventionalApproaches": [
    {
      "category": "Category name",
      "summary": "What conventional medicine and GPs typically investigate and address",
      "keyStudies": "Brief mention of what research supports this approach",
      "discussWithGP": "Specific questions to ask your doctor"
    }
  ],
  "nutritionalResearch": [
    {
      "approach": "Specific nutritional/dietary approach",
      "mechanism": "What researchers believe is the biological mechanism",
      "evidence": "Level of evidence — strong/moderate/emerging/traditional",
      "sources": "Key nutrients, foods, or compounds researched"
    }
  ],
  "traditionalAndHistorical": [
    {
      "tradition": "System (e.g. Ayurveda, Traditional Chinese Medicine, Western Herbal, Indigenous Australian)",
      "approach": "What was historically used",
      "modernResearch": "Whether modern science has studied this — what was found",
      "compounds": "Key active compounds if identified by research"
    }
  ],
  "microbiomeAndGutHealth": {
    "summary": "What gut microbiome research reveals about these symptoms",
    "keyResearch": "Notable findings from microbiome studies",
    "probioticStrains": "Specific strains researched for these conditions (if applicable)",
    "prebiotics": "Prebiotic compounds studied"
  },
  "environmentalAndDetox": {
    "summary": "What detoxification research covers for these symptoms",
    "pathways": "Biological detox pathways relevant to parasitic/environmental load",
    "supportedBy": "What research supports the detox approach",
    "keyCompounds": "Compounds researched for supporting clearance: e.g. glutathione, NAC, binders (activated charcoal, bentonite clay, zeolite), liver support herbs"
  },
  "hiddenAndEmergingResearch": [
    {
      "topic": "Topic name",
      "finding": "What the research found — often overlooked or under-discussed",
      "source": "Type of source (e.g. University of X study, WHO bulletin, Lancet case series)",
      "whyItMatters": "Why this is relevant to the user's symptoms"
    }
  ],
  "antiParasiticResearch": {
    "naturalCompounds": "Compounds with documented antiparasitic activity in research: e.g. black walnut hull (juglone), wormwood (artemisinin), clove (eugenol), papaya seeds, pumpkin seeds, diatomaceous earth, oregano oil (carvacrol)",
    "evidenceLevel": "What level of evidence exists (in vitro, animal, human trials)",
    "historicalUse": "Long-documented traditional use across cultures",
    "protocolsStudied": "Any studied protocols (e.g. 3-week herbal cycles, moon cycle timing documented in traditional systems)",
    "importantNote": "Always note: consult a practitioner before starting any protocol"
  },
  "lifestyleFactors": [
    {
      "factor": "Factor name",
      "impact": "What research shows about its impact on parasite/pathogen load",
      "actionable": "Educational note on what this means"
    }
  ],
  "gpPrepNotes": "What to discuss with your GP or integrative practitioner based on this research",
  "disclaimer": "This educational brief is compiled from research literature and traditional knowledge sources. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional."
}

IMPORTANT GUIDELINES:
- Frame ALL findings as "researchers have documented", "studies suggest", "traditionally used", "evidence indicates" — never as direct recommendations
- Include genuinely useful, specific information — not generic platitudes
- Surface lesser-known but legitimate research that users may not have encountered
- Include specific compound names, strains, and mechanisms where research supports them
- Be honest about evidence levels — distinguish between strong RCT evidence and traditional/anecdotal
- The "hiddenAndEmergingResearch" section should include genuinely interesting, specific findings
- Artemisinin, juglone, carvacrol, berberine, allicin are all legitimate research compounds — include specific research context
- Moon cycle/circadian rhythm timing for parasite protocols is documented in traditional and some clinical literature — include honestly
- Respond ONLY with the JSON object — no preamble, no markdown fences
`;

// ─── GET JOURNAL ENTRIES ───────────────────────────────────────────────────────
router.get('/entries', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM health_journal_entries WHERE user_id = $1 ORDER BY entry_date DESC LIMIT 90`,
      [req.userId]
    );
    res.json({ entries: result.rows });
  } catch (err: any) {
    console.error('Journal entries error:', err);
    res.status(500).json({ error: 'Failed to load journal' });
  }
});

// ─── ADD JOURNAL ENTRY ─────────────────────────────────────────────────────────
router.post('/entries', authenticateToken, async (req: any, res) => {
  try {
    const { entry_date, symptoms, severity, energy_level, sleep_quality, mood, bowel_movements, notes, diet_notes, supplements } = req.body;
    const result = await pool.query(
      `INSERT INTO health_journal_entries
        (user_id, entry_date, symptoms, severity, energy_level, sleep_quality, mood, bowel_movements, notes, diet_notes, supplements)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [req.userId, entry_date || new Date().toISOString().split('T')[0],
       symptoms || [], severity, energy_level, sleep_quality, mood, bowel_movements, notes, diet_notes, supplements]
    );
    res.json({ entry: result.rows[0] });
  } catch (err: any) {
    console.error('Journal save error:', err);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

// ─── DELETE JOURNAL ENTRY ──────────────────────────────────────────────────────
router.delete('/entries/:id', authenticateToken, async (req: any, res) => {
  try {
    await pool.query(
      `DELETE FROM health_journal_entries WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.userId]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// ─── AI INTELLIGENCE BRIEF — the core paid feature ────────────────────────────
router.post('/intelligence', authenticateToken, async (req: any, res) => {
  try {
    const { symptoms, context } = req.body;
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Please select at least one symptom' });
    }

    // Check paywall — subscriber gets free access, otherwise costs 1 credit
    const userRow = await pool.query(
      `SELECT image_credits, is_subscriber FROM users WHERE id = $1`,
      [req.userId]
    );
    const user = userRow.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isFree = user.is_subscriber === true;
    if (!isFree && user.image_credits < 1) {
      return res.status(402).json({
        error: 'insufficient_credits',
        message: 'You need 1 credit or an active subscription to generate an AI Health Intelligence brief.',
        isSubscriber: false,
        credits: 0,
      });
    }

    // Get last 14 days of journal entries for context
    const journalRows = await pool.query(
      `SELECT entry_date, symptoms, severity, energy_level, mood, notes
       FROM health_journal_entries
       WHERE user_id = $1 AND entry_date >= CURRENT_DATE - INTERVAL '14 days'
       ORDER BY entry_date DESC`,
      [req.userId]
    );

    const journalSummary = journalRows.rows.length > 0
      ? journalRows.rows.map(e =>
          `${e.entry_date}: symptoms=[${(e.symptoms || []).join(', ')}] severity=${e.severity}/10 energy=${e.energy_level}/10 mood=${e.mood || 'n/a'} notes=${e.notes || ''}`
        ).join('\n')
      : '';

    // Call Claude
    console.log('🧠 Generating health intelligence brief for:', symptoms);
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-6',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: buildIntelligencePrompt(symptoms, context || '', journalSummary),
      }],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse JSON response
    let brief;
    try {
      const clean = rawText.replace(/```json|```/g, '').trim();
      brief = JSON.parse(clean);
    } catch (e) {
      console.error('JSON parse failed, returning raw:', rawText.substring(0, 200));
      return res.status(500).json({ error: 'AI response parsing failed — please try again' });
    }

    // Deduct credit if not subscriber
    if (!isFree) {
      await pool.query(
        `UPDATE users SET image_credits = image_credits - 1 WHERE id = $1`,
        [req.userId]
      );
    }

    // Save session to DB
    await pool.query(
      `INSERT INTO health_intelligence_sessions (user_id, query_symptoms, query_context, ai_brief, credits_used)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.userId, symptoms, context || '', JSON.stringify(brief), isFree ? 0 : 1]
    );

    res.json({
      brief,
      creditsUsed: isFree ? 0 : 1,
      isSubscriber: isFree,
      creditsRemaining: isFree ? null : user.image_credits - 1,
    });

  } catch (err: any) {
    console.error('Health intelligence error:', err);
    res.status(500).json({ error: 'Failed to generate brief — please try again' });
  }
});

// ─── GET PAST INTELLIGENCE SESSIONS ───────────────────────────────────────────
router.get('/sessions', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      `SELECT id, query_symptoms, query_context, created_at
       FROM health_intelligence_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 20`,
      [req.userId]
    );
    res.json({ sessions: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

export default router;
