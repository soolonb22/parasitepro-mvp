import Anthropic from '@anthropic-ai/sdk';

export interface AIDetection {
  parasiteId: string;
  commonName: string;
  scientificName: string;
  confidenceScore: number;
  parasiteType: 'protozoa' | 'helminth' | 'ectoparasite' | 'unknown';
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  lifeStage?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface AIAnalysisResult {
  detections: AIDetection[];
  summary?: string;
  imageQuality?: string;
  disclaimer?: string;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are ParasitePro, an expert AI parasite identification assistant trained in clinical parasitology, dermatology, and tropical medicine. You analyse images submitted by users (stool samples, skin presentations, microscopy slides, and environmental samples).

When analysing an image, respond ONLY with a valid JSON object in this exact format:
{
  "imageQuality": "good" | "adequate" | "poor",
  "detections": [
    {
      "parasiteId": "unique-slug-id",
      "commonName": "Common name",
      "scientificName": "Scientific name",
      "confidenceScore": 0.85,
      "parasiteType": "protozoa" | "helminth" | "ectoparasite" | "unknown",
      "urgencyLevel": "low" | "moderate" | "high" | "emergency",
      "lifeStage": "egg/larva/adult/cyst (optional)"
    }
  ],
  "summary": "Brief plain-language summary of findings",
  "disclaimer": "⚠️ This is an AI-assisted visual assessment only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for confirmation and treatment. In an emergency, call 000."
}

Rules:
- If no parasite is detected, return detections as an empty array and explain in summary
- confidenceScore must be between 0.0 and 1.0
- urgencyLevel: low=monitor, moderate=see GP in 1-2 weeks, high=see doctor within 48hrs, emergency=call 000
- Never prescribe specific medications or dosages
- Frame findings as "consistent with" or "most likely" — never a definitive diagnosis
- If image quality is too poor to assess, set imageQuality to "poor" and return empty detections
- Respond ONLY with the JSON object, no other text`;

export async function analyzeImage(
  imageUrl: string,
  sampleType?: string
): Promise<AIAnalysisResult> {
  console.log('🔬 Starting Anthropic vision analysis for:', imageUrl);

  const userPrompt = `Please analyse this ${sampleType || 'sample'} image for any parasites, parasitic infections, or related conditions. Respond only with the JSON format specified.`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
    });

    const rawText = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => (b as any).text)
      .join('');

    console.log('✅ Anthropic raw response:', rawText.substring(0, 300));

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const detections: AIDetection[] = (parsed.detections || []).map((d: any, i: number) => ({
      parasiteId: d.parasiteId || `detection-${i}`,
      commonName: d.commonName || 'Unknown',
      scientificName: d.scientificName || '',
      confidenceScore: Math.max(0, Math.min(1, Number(d.confidenceScore) || 0.5)),
      parasiteType: d.parasiteType || 'unknown',
      urgencyLevel: d.urgencyLevel || 'low',
      lifeStage: d.lifeStage || undefined,
      boundingBox: undefined, // Vision API doesn't return pixel coordinates
    }));

    console.log(`✅ Analysis complete: ${detections.length} detection(s)`);

    return {
      detections,
      summary: parsed.summary || '',
      imageQuality: parsed.imageQuality || 'adequate',
      disclaimer: parsed.disclaimer || '⚠️ This is an AI-assisted visual assessment only. Please consult a qualified healthcare professional.',
    };
  } catch (err: any) {
    console.error('❌ Anthropic analysis failed:', err.message);
    throw err;
  }
}

export async function checkAIServiceHealth(): Promise<boolean> {
  return !!process.env.ANTHROPIC_API_KEY;
}

export function getSupportedSampleTypes(): string[] {
  return ['stool', 'blood', 'skin', 'microscopy', 'environmental', 'other'];
}

export function getAIServiceInfo() {
  return {
    provider: 'Anthropic Claude Vision',
    model: 'claude-opus-4-5',
    status: 'active',
  };
}
