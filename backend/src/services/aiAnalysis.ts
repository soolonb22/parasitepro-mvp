// services/aiAnalysis.ts — Deep Assessment Engine with Dual-Image + Context Support
import Anthropic from '@anthropic-ai/sdk';

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
- NEVER prescribe specific medications or dosages
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
  enhancedUrl?: string,
): Promise<AIAnalysisResult> {
  console.log('🔬 Deep analysis starting. Enhanced image:', !!enhancedUrl);

  try {
    const original = await fetchBase64(originalUrl);
    const enhanced = enhancedUrl ? await fetchBase64(enhancedUrl) : null;

    const contextBlock = buildContextBlock(userContext);
    const sampleHint = sampleType && sampleType !== 'auto' ? `Sample type indicated by user: ${sampleType}.\n` : '';
    const fullPrompt = [contextBlock, sampleHint, DEEP_ANALYSIS_PROMPT].filter(Boolean).join('\n\n');

    // Build content array — send both images if available
    const contentBlocks: any[] = [];
    contentBlocks.push({ type: 'image', source: { type: 'base64', media_type: original.mediaType, data: original.data } });
    if (enhanced) {
      contentBlocks.push({ type: 'text', text: 'The image above is the ORIGINAL. The image below is the AI-ENHANCED version (contrast boosted, sharpened, colour normalised). Compare both and use whichever reveals more diagnostic detail.' });
      contentBlocks.push({ type: 'image', source: { type: 'base64', media_type: enhanced.mediaType, data: enhanced.data } });
    }
    contentBlocks.push({ type: 'text', text: fullPrompt });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: contentBlocks }],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('✅ Deep analysis complete. First 400 chars:', rawText.substring(0, 400));
    return parseAnalysisResponse(rawText);

  } catch (error: any) {
    console.error('❌ Analysis error:', error.message);
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
