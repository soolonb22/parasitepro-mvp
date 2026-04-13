import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { AnalysisReport, SampleType } from '@/types/analyzer'

/**
 * POST /api/analyze
 *
 * Accepts a text description / pasted lab results (+ optional extracted file text)
 * and returns a fully structured AnalysisReport JSON object.
 *
 * This is a NON-streaming endpoint — the client shows an animated progress bar
 * while awaiting the single JSON response.
 *
 * Database integration (Railway PostgreSQL):
 *   After generation, reports are saved to:
 *   CREATE TABLE reports (
 *     id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
 *     sample_type     TEXT NOT NULL,
 *     input_summary   TEXT,
 *     urgency_level   TEXT,
 *     primary_finding JSONB,
 *     full_report     JSONB,          -- Full AnalysisReport stored as JSONB
 *     saved           BOOLEAN DEFAULT FALSE,
 *     credits_used    INT DEFAULT 1,
 *     created_at      TIMESTAMPTZ DEFAULT NOW()
 *   );
 *
 * Credit deduction (Stripe):
 *   Before running analysis, deduct 1 credit:
 *   UPDATE users SET image_credits = image_credits - 1 WHERE id = $userId AND image_credits > 0
 *   If 0 credits: return 402 Payment Required.
 *
 * Vector DB (pgvector) enrichment:
 *   The system prompt is augmented with top-5 relevant chunks from:
 *   SELECT content FROM parasite_knowledge
 *   ORDER BY embedding <=> query_embedding LIMIT 5
 *   Embeddings generated via Anthropic's embeddings API or OpenAI ada-002.
 */

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── System prompt ────────────────────────────────────────────────────────

const ANALYZER_SYSTEM_PROMPT = `You are PARA — ParasitePro's AI educational analyser, trained in clinical parasitology, tropical medicine, and dermatology with a specific focus on Australian conditions.

## YOUR TASK
Analyse the submitted text (symptom description, lab results, or observations) and return a STRICTLY VALID JSON object matching the schema below. Output ONLY the JSON — no preamble, no markdown fences, no commentary.

## COMPLIANCE RULES (NON-NEGOTIABLE)
- NEVER use the word "diagnosis" — always "finding", "assessment", "consistent with", "visual pattern suggests"
- NEVER prescribe specific medications or dosages
- NEVER state accuracy percentages or certainty numbers
- NEVER cause unnecessary alarm
- ALWAYS recommend GP consultation
- ALWAYS include disclaimer
- In emergencies, direct to 000

## OUTPUT SCHEMA (return exactly this structure)
{
  "imageQuality": "Text only" | "Good" | "Adequate" | "Poor",
  "primaryFinding": {
    "commonName": "string — plain English name",
    "scientificName": "string | null — Latin binomial if applicable",
    "description": "string — 2-3 sentences explaining what this is in plain language"
  },
  "visualEvidence": ["string", "string", "string"],
  "confidence": "high" | "moderate" | "low",
  "differentialDiagnoses": [
    { "condition": "string", "likelihood": "High" | "Moderate" | "Low", "keyDifferentiator": "string" },
    { "condition": "string", "likelihood": "High" | "Moderate" | "Low", "keyDifferentiator": "string" }
  ],
  "urgencyLevel": "low" | "moderate" | "high" | "urgent",
  "urgencyRationale": "string — 1-2 sentences explaining why this urgency level",
  "recommendedAction": "string — 2-4 sentences of actionable next steps",
  "gpPrepNotes": {
    "whatToTell": ["string", "string", "string"],
    "questionsToAsk": ["string", "string"],
    "testsToRequest": ["string", "string"]
  },
  "geographicRelevance": "string — 1-2 sentences about Australian/QLD prevalence"
}

## TONE
Professional, calm, clear. Everyday Australians who may be anxious. Plain English. Explain medical terms briefly.`

// ─── Route handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { textInput, sampleType, fileContent } = body as {
      textInput: string
      sampleType: SampleType
      fileContent?: string
    }

    // ── Input validation ──────────────────────────────────────────────────
    if (!textInput?.trim() && !fileContent?.trim()) {
      return NextResponse.json(
        { error: 'Please provide a description or upload a file.' },
        { status: 400 }
      )
    }

    const combinedInput = [
      textInput?.trim(),
      fileContent?.trim() ? `\n\n--- Extracted file content ---\n${fileContent.trim()}` : '',
    ]
      .filter(Boolean)
      .join('')

    if (combinedInput.length < 20) {
      return NextResponse.json(
        { error: 'Please provide more detail — at least a sentence describing your concern.' },
        { status: 400 }
      )
    }

    // ── TODO: Credit gate (Railway PostgreSQL) ────────────────────────────
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    // const user = await db.query('SELECT image_credits FROM users WHERE id=$1', [session.user.id])
    // if (user.rows[0]?.image_credits < 1) {
    //   return NextResponse.json({ error: 'Insufficient credits', code: 'NO_CREDITS' }, { status: 402 })
    // }
    // await db.query('UPDATE users SET image_credits=image_credits-1 WHERE id=$1', [session.user.id])

    // ── TODO: pgvector RAG enrichment ─────────────────────────────────────
    // const queryEmbedding = await generateEmbedding(combinedInput)
    // const ragContext = await db.query(
    //   'SELECT content FROM parasite_knowledge ORDER BY embedding <=> $1 LIMIT 5',
    //   [JSON.stringify(queryEmbedding)]
    // )
    // const contextBlock = ragContext.rows.map(r => r.content).join('\n\n')
    // const enrichedSystemPrompt = ANALYZER_SYSTEM_PROMPT + '\n\n## KNOWLEDGE BASE CONTEXT\n' + contextBlock

    const userPrompt = `SAMPLE TYPE: ${sampleType.toUpperCase()}

SUBMISSION:
${combinedInput}

Please analyse this and return the JSON report object.`

    // ── Call Anthropic ─────────────────────────────────────────────────────
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: ANALYZER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    // ── Parse JSON ────────────────────────────────────────────────────────
    let parsed: Partial<AnalysisReport>
    try {
      // Strip any accidental markdown fences
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim()
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse failed — raw output:', rawText.slice(0, 500))
      return NextResponse.json(
        { error: 'Analysis could not be structured. Please try again with more detail.' },
        { status: 500 }
      )
    }

    // ── Assemble full report ──────────────────────────────────────────────
    const report: AnalysisReport = {
      id: `rpt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      sampleType,
      inputSummary: combinedInput.slice(0, 120),
      imageQuality: parsed.imageQuality ?? 'Text only',
      primaryFinding: parsed.primaryFinding ?? {
        commonName: 'Unable to determine',
        scientificName: null,
        description: 'Insufficient information was provided for a structured finding.',
      },
      visualEvidence: parsed.visualEvidence ?? [],
      confidence: parsed.confidence ?? 'low',
      differentialDiagnoses: parsed.differentialDiagnoses ?? [],
      urgencyLevel: parsed.urgencyLevel ?? 'moderate',
      urgencyRationale: parsed.urgencyRationale ?? 'Please consult a GP for further assessment.',
      recommendedAction: parsed.recommendedAction ?? 'Consult a qualified Australian healthcare professional.',
      gpPrepNotes: parsed.gpPrepNotes ?? { whatToTell: [], questionsToAsk: [], testsToRequest: [] },
      geographicRelevance: parsed.geographicRelevance ?? '',
      saved: false,
      creditsUsed: 1,
    }

    // ── TODO: Persist to DB ───────────────────────────────────────────────
    // await db.query(
    //   `INSERT INTO reports (id, user_id, sample_type, input_summary, urgency_level, primary_finding, full_report, credits_used, created_at)
    //    VALUES ($1, $2, $3, $4, $5, $6, $7, 1, NOW())`,
    //   [report.id, session.user.id, report.sampleType, report.inputSummary,
    //    report.urgencyLevel, JSON.stringify(report.primaryFinding), JSON.stringify(report)]
    // )

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again. If the issue persists, contact support@notworms.com' },
      { status: 500 }
    )
  }
}
