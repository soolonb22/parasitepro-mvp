// services/aiAnalysis.ts
// Claude Vision API - Primary AI Analysis Engine
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── TYPE DEFINITIONS ────────────────────────────────────────────────────────
export interface BoundingBox { x: number; y: number; width: number; height: number; }

export interface AIDetection {
  parasiteId: string;
  commonName: string;
  scientificName: string;
  confidenceScore: number;
  parasiteType: 'protozoa' | 'helminth' | 'ectoparasite' | 'unknown';
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  lifeStage?: string;
  boundingBox?: BoundingBox;
}

export interface DifferentialDiagnosis {
  condition: string;
  likelihood: 'low' | 'moderate' | 'high';
  reasoning: string;
}

export interface RecommendedAction {
  priority: 'immediate' | 'soon' | 'routine';
  action: string;
  detail: string;
}

export interface HealthRisk {
  category: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface TreatmentOption {
  type: 'medical' | 'supportive' | 'environmental';
  name: string;
  description: string;
  requiresPrescription: boolean;
}

export interface AIAnalysisResult {
  detections: AIDetection[];
  differentialDiagnoses: DifferentialDiagnosis[];
  recommendedActions: RecommendedAction[];
  healthRisks: HealthRisk[];
  treatmentOptions: TreatmentOption[];
  gpTestingList: string[];
  gpScriptIfDismissed: string[];
  overallAssessment: string;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  visualFindings: string;
  imageQuality?: string;
  sampleType?: string;
  disclaimerAcknowledged: boolean;
  // Legacy compat
  summary?: string;
  disclaimer?: string;
}

// ─── EXPERT ANALYSIS PROMPT ──────────────────────────────────────────────────
const ANALYSIS_PROMPT = `You are an expert parasitologist and medical microscopist with 20+ years of experience 
analysing human stool, blood, and skin samples. You have specific expertise in Australian parasites, 
tropical medicine, and Queensland-specific parasitology.

Analyse this sample image with the thoroughness of a senior hospital laboratory parasitologist. 
Look carefully at:
- Colour patterns and zones (two-zone separations indicate co-infections)
- Texture, consistency, and structural anomalies
- Any circular, oval, or elongated structures that may be cysts, eggs, or organisms
- Fat content indicators (pale, greasy, floating characteristics = steatorrhea)
- Blood indicators (dark zones, unusual colour)
- Mucus presence
- Pattern distribution (clustered vs random distribution matters)

Provide your complete clinical analysis as a JSON object ONLY. No preamble, no explanation outside the JSON.
Respond with this exact structure:

{
  "overallAssessment": "2-3 sentence clinical summary of what you observe and your overall clinical impression",
  "urgencyLevel": "low|moderate|high|emergency",
  "visualFindings": "Detailed paragraph describing exactly what you observe in the image - specific structures, colours, zones, patterns. Be as specific as a lab report.",
  "imageQuality": "good|adequate|poor",
  "sampleType": "your best guess at the sample type: stool|skin|blood|microscopy|environmental|unknown",
  "detections": [
    {
      "parasiteId": "unique-slug-id",
      "commonName": "Common name in plain English",
      "scientificName": "Scientific binomial name",
      "confidenceScore": 0.85,
      "parasiteType": "protozoa|helminth|ectoparasite|unknown",
      "urgencyLevel": "low|moderate|high|emergency",
      "lifeStage": "egg|larva|adult|cyst|oocyst|trophozoite (if identifiable, else omit)"
    }
  ],
  "differentialDiagnoses": [
    {
      "condition": "Condition name",
      "likelihood": "low|moderate|high",
      "reasoning": "One sentence explaining why this is or isn't likely"
    }
  ],
  "recommendedActions": [
    {
      "priority": "immediate|soon|routine",
      "action": "Brief action title",
      "detail": "Specific detail of what to do and why"
    }
  ],
  "healthRisks": [
    {
      "category": "Risk category (e.g. Transmission, Nutritional, Organ damage)",
      "description": "Plain language description of this risk",
      "severity": "low|moderate|high"
    }
  ],
  "treatmentOptions": [
    {
      "type": "medical|supportive|environmental",
      "name": "Treatment name",
      "description": "What this involves (do NOT prescribe specific doses)",
      "requiresPrescription": true
    }
  ],
  "gpTestingList": [
    "Specific test name and why (e.g. 'Stool microscopy x3 — gold standard for protozoan detection')"
  ],
  "gpScriptIfDismissed": [
    "What to say to your doctor if they are dismissive, in plain language (e.g. 'I'd like to request a full stool PCR panel given my travel history to tropical Queensland')"
  ],
  "disclaimerAcknowledged": true
}

CRITICAL RULES:
- If no parasite is detected, return detections as an empty array and explain clearly in overallAssessment
- confidenceScore must be between 0.0 and 1.0
- Never prescribe specific medications or dosages
- Frame all findings as "consistent with" or "most likely" — never a definitive diagnosis
- urgencyLevel: low=monitor only, moderate=GP within 1-2 weeks, high=GP within 48hrs, emergency=call 000
- Respond ONLY with the JSON object, no other text, no markdown fences`;

// ─── MAIN ANALYSIS FUNCTION ──────────────────────────────────────────────────
export async function analyzeImage(imageUrl: string, sampleType?: string): Promise<AIAnalysisResult> {
  console.log('🔬 Starting Claude Vision analysis for:', imageUrl);

  try {
    // Fetch image and convert to base64 — more reliable than URL source with Cloudinary
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' = 
      contentType.includes('png') ? 'image/png' : 
      contentType.includes('webp') ? 'image/webp' : 'image/jpeg';

    const userText = sampleType && sampleType !== 'auto'
      ? `Please analyse this ${sampleType} sample image. ${ANALYSIS_PROMPT}`
      : ANALYSIS_PROMPT;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Image },
            },
            { type: 'text', text: userText },
          ],
        },
      ],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('✅ Claude Vision raw response (first 400 chars):', rawText.substring(0, 400));

    return parseAnalysisResponse(rawText);
  } catch (error: any) {
    console.error('❌ Claude Vision analysis error:', error.message);

    // GPT-4o fallback if OpenAI key is set
    if (process.env.OPENAI_API_KEY) {
      console.log('🔄 Attempting GPT-4o fallback...');
      try {
        return await analyzeWithGPT4o(imageUrl, sampleType);
      } catch (fallbackError: any) {
        console.error('❌ GPT-4o fallback also failed:', fallbackError.message);
      }
    }

    throw new Error('AI analysis failed: ' + error.message);
  }
}

// ─── RESPONSE PARSER ─────────────────────────────────────────────────────────
function parseAnalysisResponse(rawText: string): AIAnalysisResult {
  // Strip markdown fences if present
  const cleaned = rawText
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON object from text
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
    boundingBox: undefined,
  }));

  return {
    detections,
    differentialDiagnoses: parsed.differentialDiagnoses || [],
    recommendedActions: parsed.recommendedActions || [],
    healthRisks: parsed.healthRisks || [],
    treatmentOptions: parsed.treatmentOptions || [],
    gpTestingList: parsed.gpTestingList || [],
    gpScriptIfDismissed: parsed.gpScriptIfDismissed || [],
    overallAssessment: parsed.overallAssessment || '',
    urgencyLevel: parsed.urgencyLevel || 'low',
    visualFindings: parsed.visualFindings || '',
    imageQuality: parsed.imageQuality || 'adequate',
    sampleType: parsed.sampleType || undefined,
    disclaimerAcknowledged: true,
    // Legacy compat fields
    summary: parsed.overallAssessment || '',
    disclaimer: '⚠️ This is an AI-assisted visual assessment only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for confirmation and treatment. In an emergency, call 000.',
  };
}

// ─── GPT-4o FALLBACK ─────────────────────────────────────────────────────────
async function analyzeWithGPT4o(imageUrl: string, sampleType?: string): Promise<AIAnalysisResult> {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userText = sampleType && sampleType !== 'auto'
    ? `Please analyse this ${sampleType} sample image. ${ANALYSIS_PROMPT}`
    : ANALYSIS_PROMPT;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  const rawText = response.choices[0]?.message?.content || '';
  console.log('✅ GPT-4o raw response (first 400 chars):', rawText.substring(0, 400));
  return parseAnalysisResponse(rawText);
}

// ─── HEALTH & INFO ───────────────────────────────────────────────────────────
export async function checkAIServiceHealth(): Promise<boolean> {
  return !!process.env.ANTHROPIC_API_KEY;
}

export function getSupportedSampleTypes(): string[] {
  return ['stool', 'blood', 'skin', 'microscopy', 'environmental', 'other', 'auto'];
}

export function getAIServiceInfo() {
  return {
    provider: 'Anthropic Claude Vision',
    model: 'claude-3-5-sonnet-20241022',
    fallback: process.env.OPENAI_API_KEY ? 'GPT-4o' : 'none',
    status: 'active',
  };
}
