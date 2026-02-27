// services/aiAnalysis.ts
// Claude Vision API - Primary AI Analysis Engine
// Replace the mock service with this file
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── TYPE DEFINITIONS ────────────────────────────────────────────────────────
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIDetection {
  parasiteId: string;
  commonName: string;
  scientificName: string;
  confidenceScore: number;
  parasiteType: 'protozoa' | 'helminth' | 'ectoparasite';
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
  disclaimerAcknowledged: boolean;
}

// ─── MAIN ANALYSIS FUNCTION ──────────────────────────────────────────────────
export async function analyzeImage(imageUrl: string): Promise<AIAnalysisResult> {
  try {
    // Fetch the image and convert to base64 for Claude Vision
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const mediaType = contentType.includes('png') ? 'image/png' : 'image/jpeg';

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    return parseAnalysisResponse(rawText, imageUrl);
  } catch (error: any) {
    console.error('Claude Vision analysis error:', error);

    // Attempt GPT-4o fallback
    if (process.env.OPENAI_API_KEY) {
      console.log('Attempting GPT-4o fallback...');
      try {
        return await analyzeWithGPT4o(imageUrl);
      } catch (fallbackError) {
        console.error('GPT-4o fallback also failed:', fallbackError);
      }
    }

    throw new Error('AI analysis failed: ' + error.message);
  }
}

// ─── EXPERT ANALYSIS PROMPT ─────────────────────────────────────────────────
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
  "detections": [
    {
      "parasiteId": "unique-id-slug",
      "commonName": "Common name",
      "scientificName": "Scientific name",
      "confidenceScore": 0.85,
      "parasiteType": "protozoa|helminth|ectoparasite",
      "urgencyLevel": "low|moderate|high|emergency",
      "lifeStage": "cyst|egg|adult|larva|trophozoite|proglottid",
      "boundingBox": { "x": 100, "y": 80, "width": 200, "height": 150 }
    }
  ],
  "differentialDiagnoses": [
    {
      "condition": "Condition name",
      "likelihood": "low|moderate|high",
      "reasoning": "Specific clinical reasoning for why this is or isn't likely based on what you see"
    }
  ],
  "recommendedActions": [
    {
      "priority": "immediate|soon|routine",
      "action": "Short action title",
      "detail": "Detailed explanation of this action, why it's needed, and what to expect"
    }
  ],
  "healthRisks": [
    {
      "category": "Risk category name",
      "description": "Detailed explanation of this health risk and its mechanism",
      "severity": "low|moderate|high"
    }
  ],
  "treatmentOptions": [
    {
      "type": "medical|supportive|environmental",
      "name": "Treatment name",
      "description": "Complete treatment description including dose, duration, and what it targets",
      "requiresPrescription": true
    }
  ],
  "gpTestingList": [
    "Stool Ova & Parasite (O&P) x3 samples on different days",
    "Giardia antigen test (ELISA)",
    "Blastocystis PCR",
    "Add all specific tests relevant to your findings here"
  ],
  "gpScriptIfDismissed": [
    "If GP says it's just IBS: 'IBS is a diagnosis of exclusion - it should not be given until infectious causes are eliminated. Can we please do a stool O&P x3, Giardia antigen test, and Blastocystis PCR?'",
    "Add specific responses to anticipated GP pushback based on your findings"
  ],
  "disclaimerAcknowledged": true
}

CRITICAL RULES:
1. Be SPECIFIC and DETAILED - users are desperate for real answers after being dismissed by GPs
2. Always include Blastocystis hominis in your differential if ANY IBS-like pattern is present - it is THE most commonly missed parasite in Australia
3. Always note if Queensland/tropical Australia is a risk factor for the organisms you identify
4. For the gpScriptIfDismissed array: give users EXACT words to say to their GP, anticipating dismissal
5. Include the eosinophil count tip in gpTestingList if you suspect any parasitic infection
6. Treatment options must include BOTH prescription medications AND things they can start immediately without a prescription
7. Health risks must explain the MECHANISM - not just "causes symptoms" but HOW it causes those symptoms
8. If you see steatorrhea (pale fatty stool), ALWAYS flag Giardia as high confidence
9. If you see clustered round structures, ALWAYS consider Blastocystis cysts
10. Your analysis will be reviewed by a medical professional before the user acts on it - be thorough, not cautious
11. Respond with JSON ONLY - no markdown, no backticks, no explanation`;

// ─── RESPONSE PARSER ─────────────────────────────────────────────────────────
function parseAnalysisResponse(rawText: string, imageUrl: string): AIAnalysisResult {
  try {
    // Strip any markdown formatting if present
    const cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate and fill defaults for required fields
    return {
      detections: Array.isArray(parsed.detections) ? parsed.detections : [],
      differentialDiagnoses: Array.isArray(parsed.differentialDiagnoses) ? parsed.differentialDiagnoses : [],
      recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
      healthRisks: Array.isArray(parsed.healthRisks) ? parsed.healthRisks : [],
      treatmentOptions: Array.isArray(parsed.treatmentOptions) ? parsed.treatmentOptions : [],
      gpTestingList: Array.isArray(parsed.gpTestingList) ? parsed.gpTestingList : [],
      gpScriptIfDismissed: Array.isArray(parsed.gpScriptIfDismissed) ? parsed.gpScriptIfDismissed : [],
      overallAssessment: parsed.overallAssessment || 'Analysis complete. Please review findings.',
      urgencyLevel: parsed.urgencyLevel || 'moderate',
      visualFindings: parsed.visualFindings || 'Visual analysis completed.',
      disclaimerAcknowledged: true,
    };
  } catch (parseError) {
    console.error('Failed to parse Claude response as JSON:', parseError);
    console.error('Raw response:', rawText.substring(0, 500));
    throw new Error('Failed to parse AI analysis response');
  }
}

// ─── GPT-4o FALLBACK ─────────────────────────────────────────────────────────
async function analyzeWithGPT4o(imageUrl: string): Promise<AIAnalysisResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl, detail: 'high' },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`GPT-4o API error: ${response.status}`);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const rawText = data.choices?.[0]?.message?.content || '';
  return parseAnalysisResponse(rawText, imageUrl);
}

export async function checkAIServiceHealth(): Promise<boolean> {
  return !!process.env.ANTHROPIC_API_KEY;
}

export function getSupportedSampleTypes(): string[] {
  return ['stool', 'blood', 'skin', 'other'];
}

export function getAIServiceInfo() {
  return {
    provider: 'Anthropic Claude Vision (claude-opus-4-5)',
    fallback: process.env.OPENAI_API_KEY ? 'GPT-4o' : 'none',
    version: '2.0.0',
    status: 'active',
  };
}
