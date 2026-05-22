// services/aiAnalysis.ts — Deep Assessment Engine with Dual-Image + Context Support
import Anthropic from '@anthropic-ai/sdk';
import { enhanceImageForAnalysis } from './imageEnhancement';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface UserContext {
  sampleType?: string;
  sampleLocation?: string;
  duration?: string;
  subject?: string;
  recentTravel?: string[];
  symptoms?: string[];
  captureMethod?: string;
  estimatedSize?: string;
  additionalNotes?: string;
}

export interface BoundingBox { x: number; y: number; width: number; height: number; }

export interface AIDetection {
  parasiteId: string; commonName: string; scientificName: string;
  confidenceScore: number; parasiteType: 'protozoa' | 'helminth' | 'ectoparasite' | 'unknown';
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  lifeStage?: string; boundingBox?: BoundingBox;
}

export interface DifferentialDiagnosis { condition: string; likelihood: 'low' | 'moderate' | 'high'; reasoning: string; }
export interface RecommendedAction { priority: 'immediate' | 'soon' | 'routine'; action: string; detail: string; }
export interface HealthRisk { category: string; description: string; severity: 'low' | 'moderate' | 'high'; }
export interface TreatmentOption { type: 'medical' | 'supportive' | 'environmental'; name: string; description: string; requiresPrescription: boolean; }
export interface NaturalRemedy { name: string; category: 'herbal' | 'dietary' | 'topical' | 'environmental' | 'integrative'; description: string; evidenceLevel: 'anecdotal' | 'traditional' | 'preliminary' | 'emerging'; safetyNotes: string; }

// Phase 2: richer education
export interface SymptomStage { stage: string; timeframe: string; description: string; }
export interface LifestyleFactors { worsens: string[]; helps: string[]; }
export interface DietaryGuidance {
  foodsToFavour: string[];
  foodsToAvoid: string[];
  drinksToFavour: string[];
  drinksToAvoid: string[];
  rationale?: string;
}

// Phase 3: protocol preview (week 1 only — full protocol in course)
export interface ProtocolPreview {
  weekOneTitle: string;
  weekOneFocus: string;
  weekOneActions: string[];
  whatComesNext: string;
}

export interface AIAnalysisResult {
  detections: AIDetection[];
  differentialDiagnoses: DifferentialDiagnosis[];
  recommendedActions: RecommendedAction[];
  healthRisks: HealthRisk[];
  treatmentOptions: TreatmentOption[];
  gpTestingList: string[];
  gpScriptIfDismissed: string[];
  naturalRemedies: NaturalRemedy[];
  overallAssessment: string;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  visualFindings: string;
  imageQuality?: string;
  imageUsed?: 'original' | 'enhanced' | 'both';
  sampleType?: string;
  confidencePercentage?: number;
  morphologicalEvidence?: string[];
  gpPreparationNotes?: string;
  geographicContext?: string;
  disclaimerAcknowledged: boolean;
  summary?: string;
  disclaimer?: string;
  // Phase 1 restoration
  parasiteProfile?: any;
  // Phase 2 expansion
  symptomProgression?: SymptomStage[];
  longTermDamage?: string;
  lifestyleFactors?: LifestyleFactors;
  dietaryGuidance?: DietaryGuidance;
  thingsToAvoid?: string[];
  // Phase 3 protocol preview
  protocolPreview?: ProtocolPreview;
}

// ─── BUILD CONTEXT BLOCK ─────────────────────────────────────────────────────
function buildContextBlock(ctx?: UserContext): string {
  if (!ctx) return '';
  const lines: string[] = ['USER CONTEXT (collected before submission):'];
  if (ctx.sampleType)       lines.push(`- Sample type: ${ctx.sampleType}`);
  if (ctx.sampleLocation)   lines.push(`- Sample found at: ${ctx.sampleLocation}`);
  if (ctx.duration)         lines.push(`- Duration noticed: ${ctx.duration}`);
  if (ctx.subject)          lines.push(`- Subject: ${ctx.subject}`);
  if (ctx.recentTravel?.length) lines.push(`- Recent travel: ${ctx.recentTravel.join(', ')}`);
  if (ctx.symptoms?.length) lines.push(`- Reported symptoms: ${ctx.symptoms.join(', ')}`);
  if (ctx.captureMethod)    lines.push(`- Image captured with: ${ctx.captureMethod}`);
  if (ctx.estimatedSize)    lines.push(`- Estimated real size: ${ctx.estimatedSize}`);
  if (ctx.additionalNotes)  lines.push(`- Additional notes: ${ctx.additionalNotes}`);

  lines.push('');
  lines.push('Use this context to weight your analysis:');
  if (ctx.recentTravel?.some(t => t.toLowerCase().includes('queensland') || t.toLowerCase().includes('tropical') || t.toLowerCase().includes('asia') || t.toLowerCase().includes('africa'))) {
    lines.push('- ELEVATED TROPICAL RISK: weight hookworm, strongyloides, giardia, cryptosporidium higher.');
  }
  if (ctx.subject?.toLowerCase().includes('child') && ctx.symptoms?.some(s => s.toLowerCase().includes('itch'))) {
    lines.push('- CHILD + ITCHING: prioritise pinworm/threadworm (Enterobius vermicularis) differential.');
  }
  if (ctx.subject?.toLowerCase().includes('dog') || ctx.subject?.toLowerCase().includes('cat')) {
    lines.push('- PET: consider toxocara, flea larvae, tapeworm proglottids, cheyletiella.');
  }
  if (ctx.symptoms?.includes('No symptoms')) {
    lines.push('- ASYMPTOMATIC: use educational tone, lower urgency threshold unless visually clear.');
  }
  return lines.join('\n');
}

// ─── DEEP ANALYSIS PROMPT ────────────────────────────────────────────────────
const DEEP_ANALYSIS_PROMPT = `You are ParasitePro's deep image analysis engine — an expert parasitologist and medical microscopist with 20+ years of experience analysing human stool, blood, skin, and environmental samples, with specialist knowledge in Australian tropical medicine and Queensland-specific parasitology.

Run the following pipeline in exact sequence. Respond ONLY with a valid JSON object — no preamble, no markdown fences, no text outside the JSON.

ANALYSIS PIPELINE:

1. IMAGE QUALITY REPORT — assess resolution (good/marginal/poor), focus quality, lighting, obstructions. If two images provided, state which reveals more detail and why.

2. PRIMARY VISUAL FINDING — most likely identification in plain English + scientific name in brackets. One clear sentence explaining the match. Use "visual pattern consistent with" or "resembles" — never "this is" or "you have".

3. MORPHOLOGICAL EVIDENCE — list 5–8 specific visual features: exact colour description (not just "brown" — say "amber-brown with translucent lateral margins"), shape and symmetry, texture, segmentation, estimated size relative to any visible reference object, unusual features.

4. CONFIDENCE ASSESSMENT — High/Moderate/Low plus percentage estimate. State what limits confidence.

5. DIFFERENTIAL DIAGNOSES — 3 alternatives with specific visual differentiators.

6. URGENCY CLASSIFICATION — low=monitor, moderate=GP within 1–2 weeks, high=GP within 24–48hrs, emergency=call 000.

7. GEOGRAPHIC CONTEXT — Australian/Queensland relevance. Flag tropical transmission risk if applicable.

8. EDUCATIONAL SUMMARY — what is this organism, life cycle, transmission, why it matters. Plain English.

9. GP PREPARATION NOTES — what to tell the GP, what tests are typically relevant, framed as questions to ask.

10. SYMPTOM PROGRESSION — typical clinical presentation timeline as documented in medical literature. 3–5 stages with rough timeframes (e.g. "Early — first 1–2 weeks", "Established — weeks 2–8", "Chronic — beyond 3 months"). Each stage: what someone typically experiences. Educational only — frame as "typically reported" or "documented in cases".

11. LONG-TERM DAMAGE IF UNTREATED — plain-English description of what this organism can do to body systems if it persists untreated, citing the affected systems (gut lining, nutrient absorption, immune burden, etc). Educational framing — "may contribute to" or "has been associated with", never "will cause".

12. LIFESTYLE FACTORS — list 4–6 factors that typically worsen this condition (stress, sugar, alcohol, poor sleep, etc.) and 4–6 factors that typically support recovery (hydration, sleep, fibre, etc.). Educational, not prescriptive.

13. DIETARY GUIDANCE (educational) — list 5–8 foods traditionally favoured during cleanses for this category of parasite, 5–8 foods traditionally avoided, 3–5 drinks traditionally favoured, 3–5 drinks traditionally avoided. Frame as "traditionally associated with" — these are educational patterns from historical and integrative literature, NOT medical prescriptions. Include one-sentence rationale.

14. THINGS TO AVOID — 4–8 specific behaviours, foods, or exposures that may worsen the condition or interfere with recovery (e.g. "raw or undercooked meat during recovery phase", "sharing towels with affected family members", "high-sugar foods that feed candida overgrowth").

15. PROTOCOL PREVIEW (WEEK 1 ONLY) — a teaser of what Week 1 of a traditional parasite cleanse framework typically looks like, for educational purposes. ONLY Week 1. The full multi-week protocol is reserved for the dedicated course "Clearing the Body of Toxins & Parasites" and must NOT be detailed here. Provide:
    - weekOneTitle (e.g. "Foundation & Gentle Preparation")
    - weekOneFocus (1–2 sentence focus statement)
    - weekOneActions (4–6 specific, educational, non-prescriptive actions someone might take in Week 1)
    - whatComesNext (1 sentence teasing Weeks 2–5 without giving them away — e.g. "Weeks 2–5 progress through targeted herbal support, die-off management, gut repair, and reinoculation — covered in the full course.")

Respond with this exact JSON structure:

{
  "imageQuality": "good|marginal|poor",
  "imageUsed": "original|enhanced|both",
  "imageAssessmentNotes": "which image was more useful and why",
  "overallAssessment": "2-3 sentence summary of visual findings and clinical impression",
  "urgencyLevel": "low|moderate|high|emergency",
  "visualFindings": "Detailed paragraph of exactly what you observe — specific structures, exact colours, zones, patterns. Lab-report level specificity.",
  "morphologicalEvidence": [
    "Feature 1 with exact description",
    "Feature 2",
    "Feature 3",
    "Feature 4",
    "Feature 5"
  ],
  "confidencePercentage": 78,
  "sampleType": "stool|skin|blood|microscopy|environmental|unknown",
  "detections": [
    {
      "parasiteId": "slug-id",
      "commonName": "Common name",
      "scientificName": "Genus species",
      "confidenceScore": 0.78,
      "parasiteType": "protozoa|helminth|ectoparasite|unknown",
      "urgencyLevel": "low|moderate|high|emergency",
      "lifeStage": "egg|larva|adult|cyst|oocyst|trophozoite"
    }
  ],
  "differentialDiagnoses": [
    {
      "condition": "Condition name",
      "likelihood": "low|moderate|high",
      "reasoning": "Specific visual differentiator"
    }
  ],
  "recommendedActions": [
    {
      "priority": "immediate|soon|routine",
      "action": "Action title",
      "detail": "Specific detail of what to do and why"
    }
  ],
  "healthRisks": [
    {
      "category": "Risk category",
      "description": "Plain language description",
      "severity": "low|moderate|high"
    }
  ],
  "treatmentOptions": [
    {
      "type": "medical|supportive|environmental",
      "name": "Treatment name",
      "description": "What this involves — no specific doses",
      "requiresPrescription": true
    }
  ],
  "gpTestingList": ["Test name and why"],
  "gpPreparationNotes": "What to tell and ask your GP — framed as questions, not advice",
  "gpScriptIfDismissed": ["What to say if doctor is dismissive"],
  "naturalRemedies": [
    {
      "name": "Remedy name",
      "category": "herbal|dietary|topical|environmental|integrative",
      "description": "Traditional use and what it involves",
      "evidenceLevel": "anecdotal|traditional|preliminary|emerging",
      "safetyNotes": "Safety considerations and contraindications"
    }
  ],
  "geographicContext": "Australian/Queensland relevance and transmission risk notes",
  "symptomProgression": [
    {
      "stage": "Early (typically first 1-2 weeks)",
      "timeframe": "Days 1-14 post-exposure",
      "description": "What is typically reported during this stage"
    },
    {
      "stage": "Established",
      "timeframe": "Weeks 2-8",
      "description": "Typical presentation as condition becomes established"
    },
    {
      "stage": "Chronic (if untreated)",
      "timeframe": "Beyond 3 months",
      "description": "Chronic presentation typically documented"
    }
  ],
  "longTermDamage": "Plain-English educational description of body systems that may be affected if untreated — gut lining, nutrient absorption, immune system, etc. Use 'may contribute to' or 'has been associated with', never absolute claims.",
  "lifestyleFactors": {
    "worsens": ["Factor 1 that typically worsens", "Factor 2", "Factor 3", "Factor 4"],
    "helps": ["Factor 1 that typically supports recovery", "Factor 2", "Factor 3", "Factor 4"]
  },
  "dietaryGuidance": {
    "foodsToFavour": ["Food 1 traditionally favoured during cleanses", "Food 2", "Food 3", "Food 4", "Food 5"],
    "foodsToAvoid": ["Food 1 traditionally avoided", "Food 2", "Food 3", "Food 4", "Food 5"],
    "drinksToFavour": ["Drink 1", "Drink 2", "Drink 3"],
    "drinksToAvoid": ["Drink 1", "Drink 2", "Drink 3"],
    "rationale": "One sentence on why this pattern is traditionally used"
  },
  "thingsToAvoid": [
    "Specific behaviour, food or exposure to avoid 1",
    "Specific item 2",
    "Specific item 3",
    "Specific item 4"
  ],
  "protocolPreview": {
    "weekOneTitle": "Week 1: Foundation & Gentle Preparation",
    "weekOneFocus": "1-2 sentence statement of what Week 1 is focused on",
    "weekOneActions": [
      "Action 1 — educational, non-prescriptive",
      "Action 2",
      "Action 3",
      "Action 4"
    ],
    "whatComesNext": "1 sentence teaser of weeks 2-5 without revealing the protocol — point to the course"
  },
  "parasiteProfile": {
    "commonName": "Common name",
    "scientificName": "Genus species",
    "classification": {
      "kingdom": "Animalia|Chromista|Protozoa|Fungi",
      "phylum": "e.g. Nematoda",
      "class": "Taxonomic class",
      "order": "Taxonomic order",
      "family": "Taxonomic family",
      "genus": "Genus",
      "species": "species"
    },
    "description": "2-3 sentence educational description for a layperson",
    "appearance": "Colour, shape, texture",
    "size": "Typical size range",
    "lifecycle": "Brief lifecycle description",
    "transmission": ["Transmission route 1", "Transmission route 2"],
    "geographicDistribution": "Where found globally",
    "australianRelevance": "Australian/Queensland specific context",
    "symptomsInHumans": ["Symptom 1", "Symptom 2"],
    "incubationPeriod": "Exposure to symptoms timeframe",
    "treatmentOverview": "General approach without specific drugs/doses",
    "preventionTips": ["Prevention tip 1", "Prevention tip 2"],
    "riskGroups": ["At-risk group 1"],
    "funFact": "One surprising fact",
    "dangerLevel": "low|moderate|high|critical"
  },
  "disclaimerAcknowledged": true
}

RULES:
- NEVER say "this is" or "you have" — always "consistent with", "resembles", "visual pattern suggests"
- NEVER prescribe specific medications, dosages, or supplement doses
- For dietary guidance, symptom progression, and protocol preview: use educational language — "typically", "traditionally associated with", "documented in literature" — never "you should" or "do this"
- Protocol preview MUST ONLY cover Week 1. Do not detail Weeks 2-5; that is reserved for the paid course
- If image is unidentifiable, say so clearly in overallAssessment and explain what better photos would help
- Include 3–5 natural/traditional remedies with honest evidence levels; include Aboriginal Australian remedies where relevant
- confidenceScore: 0.0–1.0. confidencePercentage: 0–100
- Respond ONLY with the JSON object`;

// ─── FETCH IMAGE AS BASE64 ────────────────────────────────────────────────────
async function fetchBase64(url: string): Promise<{ data: string; mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
  const buf = await res.arrayBuffer();
  const ct = res.headers.get('content-type') || 'image/jpeg';
  const mediaType = ct.includes('png') ? 'image/png' : ct.includes('webp') ? 'image/webp' : 'image/jpeg';
  return { data: Buffer.from(buf).toString('base64'), mediaType: mediaType as any };
}

// ─── MAIN ANALYSIS FUNCTION ───────────────────────────────────────────────────
export async function analyzeImage(
  originalUrl: string,
  sampleType?: string,
  userContext?: UserContext,
  enhancedUrl?: string,   // legacy param — kept for compatibility but ignored
  rawBuffer?: Buffer,     // NEW: raw image buffer for server-side enhancement
): Promise<AIAnalysisResult> {
  console.log('🔬 Deep analysis starting — server-side enhancement pipeline active');

  try {
    // ── Step 1: Get raw image buffer ────────────────────────────────────────
    let imageBuffer: Buffer;
    if (rawBuffer) {
      imageBuffer = rawBuffer;
      console.log('📦 Using raw buffer from upload');
    } else {
      const res = await fetch(originalUrl);
      if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
      imageBuffer = Buffer.from(await res.arrayBuffer());
      console.log('📥 Fetched image from URL for enhancement');
    }

    // ── Step 2: Run server-side enhancement pipeline ─────────────────────────
    console.log('🎨 Running server-side enhancement pipeline...');
    const enhanced = await enhanceImageForAnalysis(imageBuffer);
    const q = enhanced.qualityReport;
    console.log(`📊 Quality: brightness=${q.brightness.toFixed(0)} contrast=${q.contrast.toFixed(0)} sharpness=${q.sharpness.toFixed(0)} issue=${q.dominantIssue}`);
    console.log('✅ Enhancement complete:', q.processingApplied.join(' | '));

    // ── Step 3: Also fetch original from URL (for Claude comparison) ─────────
    const original = await fetchBase64(originalUrl);

    // ── Step 4: Build context ─────────────────────────────────────────────────
    const contextBlock = buildContextBlock(userContext);
    const sampleHint = sampleType && sampleType !== 'auto' ? `Sample type indicated by user: ${sampleType}.\n` : '';
    const qualityNote = `IMAGE PRE-PROCESSING APPLIED (server-side, before this analysis):
- Quality scan: brightness=${q.brightness.toFixed(0)}/255, contrast=${q.contrast.toFixed(0)}, sharpness=${q.sharpness.toFixed(0)}, dominant issue: ${q.dominantIssue}
- ${q.processingApplied.join('\n- ')}
You are receiving FOUR versions of the same image. Compare all four and use whichever reveals the most diagnostic detail. Synthesise findings across versions — a feature visible in one version but not others is still valid evidence.`;

    const fullPrompt = [qualityNote, contextBlock, sampleHint, DEEP_ANALYSIS_PROMPT].filter(Boolean).join('\n\n');

    // ── Step 5: Build multi-image content blocks ──────────────────────────────
    const toBase64 = (buf: Buffer) => buf.toString('base64');

    const contentBlocks: any[] = [
      // Version 1: Original
      { type: 'text', text: 'VERSION 1 — ORIGINAL (unmodified upload):' },
      { type: 'image', source: { type: 'base64', media_type: original.mediaType, data: original.data } },

      // Version 2: Auto-correct (gamma + saturation + normalise)
      { type: 'text', text: 'VERSION 2 — AUTO-CORRECTED (adaptive gamma correction, saturation +35%, percentile normalisation — best for most photos):' },
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: toBase64(enhanced.autoCorrect) } },

      // Version 3: Local contrast (CLAHE-style)
      { type: 'text', text: 'VERSION 3 — LOCAL CONTRAST ENHANCED (tile-based CLAHE-style — reveals structure hidden in uniform-toned areas, best for specimens in liquid):' },
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: toBase64(enhanced.localContrast) } },

      // Version 4: ROI zoom (specimen-focused crop)
      { type: 'text', text: 'VERSION 4 — SPECIMEN ZOOM (auto-detected region of interest, upscaled — use this for fine morphological detail: segmentation, surface texture, size estimation):' },
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: toBase64(enhanced.roiZoom) } },

      { type: 'text', text: fullPrompt },
    ];

    // ── Step 6: Send to Claude ────────────────────────────────────────────────
    console.log('🤖 Sending 4-version image set to Claude...');
    const ANALYSIS_TIMEOUT_MS = 90_000;
    const apiCall = anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-6',
      max_tokens: 24576, // Schema grew (added symptomProgression, dietaryGuidance, protocolPreview, lifestyleFactors) — give headroom
      messages: [{ role: 'user', content: contentBlocks }],
    });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Anthropic API timeout after ${ANALYSIS_TIMEOUT_MS / 1000}s`)), ANALYSIS_TIMEOUT_MS)
    );
    const response: any = await Promise.race([apiCall, timeoutPromise]);

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(`✅ Deep analysis received. stop_reason=${response.stop_reason} usage=in:${response.usage?.input_tokens}/out:${response.usage?.output_tokens}`);
    console.log('First 400 chars:', rawText.substring(0, 400));

    // Diagnostic: if Claude truncated due to max_tokens, log loudly — parser will likely fail next
    if (response.stop_reason === 'max_tokens') {
      console.error(`⚠️  RESPONSE TRUNCATED at max_tokens limit. Last 200 chars: ${rawText.slice(-200)}`);
    }

    let result: AIAnalysisResult;
    try {
      result = parseAnalysisResponse(rawText);
    } catch (parseErr: any) {
      console.error('❌ JSON parse failed. Full raw response below:');
      console.error(rawText);
      throw new Error(`JSON parse failed (stop_reason=${response.stop_reason}): ${parseErr.message}`);
    }

    // ── Attach quality report to result ──────────────────────────────────────
    result.imageUsed = 'both';
    if (q.retakeAdvice) {
      result.imageQuality = `${result.imageQuality || 'processed'} — Note: ${q.retakeAdvice}`;
    }

    return result;

  } catch (error: any) {
    // Capture everything we can — Anthropic SDK errors have .status, .error.type, .headers
    console.error('❌ Analysis error:', {
      message: error.message,
      name: error.name,
      status: error.status,
      type: error.error?.type || error.type,
      requestId: error.request_id || error.headers?.['request-id'],
    });
    if (error.stack) console.error(error.stack);
    if (process.env.OPENAI_API_KEY) {
      console.log('🔄 GPT-4o fallback...');
      try { return await analyzeWithGPT4o(originalUrl, sampleType, userContext); }
      catch (fe: any) { console.error('❌ Fallback failed:', fe.message); }
    }
    throw new Error('AI analysis failed: ' + error.message);
  }
}

// ─── PARSER ───────────────────────────────────────────────────────────────────
function parseAnalysisResponse(rawText: string): AIAnalysisResult {
  const cleaned = rawText.replace(/^```json\s*/m, '').replace(/^```\s*/m, '').replace(/```\s*$/m, '').trim();
  let parsed: any;
  try { parsed = JSON.parse(cleaned); }
  catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Could not parse JSON from AI response');
    parsed = JSON.parse(match[0]);
  }

  const detections: AIDetection[] = (parsed.detections || []).map((d: any, i: number) => ({
    parasiteId: d.parasiteId || `detection-${i}`,
    commonName: d.commonName || 'Unknown',
    scientificName: d.scientificName || '',
    confidenceScore: Math.max(0, Math.min(1, Number(d.confidenceScore) || 0.5)),
    parasiteType: d.parasiteType || 'unknown',
    urgencyLevel: d.urgencyLevel || 'low',
    lifeStage: d.lifeStage || undefined,
  }));

  return {
    detections,
    differentialDiagnoses: parsed.differentialDiagnoses || [],
    recommendedActions: parsed.recommendedActions || [],
    healthRisks: parsed.healthRisks || [],
    treatmentOptions: parsed.treatmentOptions || [],
    gpTestingList: parsed.gpTestingList || [],
    gpScriptIfDismissed: parsed.gpScriptIfDismissed || [],
    naturalRemedies: parsed.naturalRemedies || [],
    overallAssessment: parsed.overallAssessment || '',
    urgencyLevel: parsed.urgencyLevel || 'low',
    visualFindings: parsed.visualFindings || '',
    imageQuality: parsed.imageQuality || 'adequate',
    imageUsed: parsed.imageUsed || 'original',
    morphologicalEvidence: parsed.morphologicalEvidence || [],
    confidencePercentage: parsed.confidencePercentage || undefined,
    gpPreparationNotes: parsed.gpPreparationNotes || '',
    geographicContext: parsed.geographicContext || '',
    sampleType: parsed.sampleType || undefined,
    disclaimerAcknowledged: true,
    summary: parsed.overallAssessment || '',
    disclaimer: '⚠️ This is an AI-assisted educational visual assessment only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for confirmation and treatment. In an emergency, call 000.',
    // Phase 1 restoration
    parasiteProfile: parsed.parasiteProfile || undefined,
    // Phase 2 expansion
    symptomProgression: Array.isArray(parsed.symptomProgression) ? parsed.symptomProgression : [],
    longTermDamage: parsed.longTermDamage || '',
    lifestyleFactors: parsed.lifestyleFactors && typeof parsed.lifestyleFactors === 'object'
      ? { worsens: parsed.lifestyleFactors.worsens || [], helps: parsed.lifestyleFactors.helps || [] }
      : undefined,
    dietaryGuidance: parsed.dietaryGuidance && typeof parsed.dietaryGuidance === 'object'
      ? {
          foodsToFavour: parsed.dietaryGuidance.foodsToFavour || [],
          foodsToAvoid: parsed.dietaryGuidance.foodsToAvoid || [],
          drinksToFavour: parsed.dietaryGuidance.drinksToFavour || [],
          drinksToAvoid: parsed.dietaryGuidance.drinksToAvoid || [],
          rationale: parsed.dietaryGuidance.rationale || '',
        }
      : undefined,
    thingsToAvoid: Array.isArray(parsed.thingsToAvoid) ? parsed.thingsToAvoid : [],
    // Phase 3 protocol preview
    protocolPreview: parsed.protocolPreview && typeof parsed.protocolPreview === 'object'
      ? {
          weekOneTitle: parsed.protocolPreview.weekOneTitle || 'Week 1: Foundation',
          weekOneFocus: parsed.protocolPreview.weekOneFocus || '',
          weekOneActions: Array.isArray(parsed.protocolPreview.weekOneActions) ? parsed.protocolPreview.weekOneActions : [],
          whatComesNext: parsed.protocolPreview.whatComesNext || '',
        }
      : undefined,
  };
}

// ─── GPT-4o FALLBACK ──────────────────────────────────────────────────────────
async function analyzeWithGPT4o(imageUrl: string, sampleType?: string, userContext?: UserContext): Promise<AIAnalysisResult> {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const contextBlock = buildContextBlock(userContext);
  const sampleHint = sampleType && sampleType !== 'auto' ? `Sample type: ${sampleType}.\n` : '';
  const fullPrompt = [contextBlock, sampleHint, DEEP_ANALYSIS_PROMPT].filter(Boolean).join('\n\n');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o', max_tokens: 4096,
    messages: [{ role: 'user', content: [
      { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
      { type: 'text', text: fullPrompt },
    ]}],
  });
  const rawText = response.choices[0]?.message?.content || '';
  return parseAnalysisResponse(rawText);
}

export async function checkAIServiceHealth(): Promise<boolean> { return !!process.env.ANTHROPIC_API_KEY; }
export function getSupportedSampleTypes(): string[] { return ['stool', 'blood', 'skin', 'microscopy', 'environmental', 'other', 'auto']; }
export function getAIServiceInfo() {
  return { provider: 'Anthropic Claude Vision', model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-6', fallback: process.env.OPENAI_API_KEY ? 'GPT-4o' : 'none', status: 'active' };
}
