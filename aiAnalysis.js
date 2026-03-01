/**
 * aiAnalysis.js
 * Enhanced AI analysis service for ParasitePro
 * Uses Claude Vision (primary) with GPT-4o fallback
 * Includes: image preprocessing, confidence calibration, 
 *           step-by-step diagnostic reasoning, holistic treatments
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { preprocessImage, bufferToBase64 } from './imagePreprocessing.js';
import { getParasiteById, PARASITE_DATABASE } from '../data/parasiteEncyclopedia.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ─── CONFIDENCE CALIBRATION ───────────────────────────────────────────────────

/**
 * Calibrate final confidence score based on image quality + AI raw confidence
 * Prevents overconfident results from poor-quality images
 */
function calibrateConfidence(rawConfidence, imageQuality) {
  const qualityPenalty = {
    excellent: 0,
    good:      0.02,
    fair:      0.08,
    poor:      0.18
  };

  const penalty = qualityPenalty[imageQuality?.qualityLabel] || 0.05;
  const calibrated = rawConfidence - penalty;

  // Floor at 0.35 (below this we'd report as "insufficient image quality")
  return Math.max(0.35, Math.min(0.99, calibrated));
}

/**
 * Determine if confidence is high enough to report a detection
 * Returns false if image quality is too poor to make a reliable call
 */
function isDetectionReliable(confidenceScore, imageQuality) {
  const thresholds = {
    excellent: 0.45,
    good:      0.50,
    fair:      0.60,
    poor:      0.72   // Only report high-confidence findings from poor images
  };
  const threshold = thresholds[imageQuality?.qualityLabel] || 0.55;
  return confidenceScore >= threshold;
}

// ─── CLAUDE VISION ANALYSIS ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are ParasitePro AI, an expert medical imaging assistant specialising in parasitology. You analyse microscope images, gross stool images, skin images, and blood smears to identify potential parasitic infections.

Your role is EDUCATIONAL and INFORMATIONAL — you empower users to seek appropriate medical care, not replace it.

CRITICAL GUIDELINES:
- Be scientifically accurate but accessible
- Never provide a definitive medical diagnosis
- Always recommend professional medical evaluation
- Flag high-urgency findings clearly
- Be honest about image quality limitations
- Consider Australian epidemiology (common parasites: Giardia, Blastocystis, Cryptosporidium, Dientamoeba, Enterobius, Strongyloides, scabies)

ANALYSIS APPROACH:
1. Assess image quality and suitability for analysis
2. Identify morphological features systematically
3. Match features against known parasite characteristics
4. Provide confidence levels based on visual evidence quality
5. Explain your reasoning step by step
6. Recommend appropriate next steps

Always respond in valid JSON format only. No markdown, no preamble.`;

const ANALYSIS_PROMPT = `Analyse this medical sample image for potential parasitic organisms.

Sample metadata:
- Type: {SAMPLE_TYPE}
- Collection date: {COLLECTION_DATE}
- Location: {LOCATION}
- Patient notes: {NOTES}

Return ONLY a valid JSON object with this exact structure:
{
  "imageQualityAssessment": {
    "suitableForAnalysis": true/false,
    "qualityNotes": "Brief description of image quality",
    "limitations": ["list of any limitations affecting analysis"]
  },
  "analysisSteps": [
    {
      "step": 1,
      "title": "Step title",
      "observation": "What you observe",
      "significance": "What this means diagnostically"
    }
  ],
  "detections": [
    {
      "parasiteId": "use exact ID from common parasites or best-match string",
      "commonName": "Common name",
      "scientificName": "Scientific name",
      "parasiteType": "protozoa|helminth|ectoparasite",
      "urgencyLevel": "low|moderate|high|emergency",
      "confidenceScore": 0.0-1.0,
      "lifeStage": "cyst|trophozoite|egg|larva|adult|proglottid|other",
      "visualEvidence": "Specific morphological features seen that support this identification",
      "differentialDiagnoses": [
        {
          "name": "Alternative organism",
          "reason": "Why this was considered",
          "confidenceScore": 0.0-1.0,
          "ruledOutBecause": "Why this is less likely"
        }
      ],
      "boundingBox": null
    }
  ],
  "overallConclusion": "Summary of findings in plain language",
  "recommendedActions": [
    "Specific, prioritised action items for the user"
  ],
  "recommendedTests": [
    "Specific pathology tests that would confirm findings (e.g., 'Stool PCR for Giardia lamblia')"
  ],
  "naturalTreatmentNotes": "Brief mention of supportive holistic approaches (1-2 sentences)",
  "disclaimer": "This analysis is educational only and does not constitute medical diagnosis."
}

If no parasites are detected, return an empty detections array and explain what WAS observed.
If image quality is insufficient, return suitableForAnalysis: false and explain why.`;

async function analyseWithClaude(imageBase64, metadata) {
  const prompt = ANALYSIS_PROMPT
    .replace('{SAMPLE_TYPE}', metadata.sampleType || 'not specified')
    .replace('{COLLECTION_DATE}', metadata.collectionDate || 'not specified')
    .replace('{LOCATION}', metadata.location || 'not specified')
    .replace('{NOTES}', metadata.notes || 'none');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ]
  });

  const content = response.content[0].text;
  
  // Strip any markdown fences if present
  const clean = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
}

// ─── GPT-4o FALLBACK ─────────────────────────────────────────────────────────

async function analyseWithGPT4o(imageBase64, metadata) {
  const prompt = ANALYSIS_PROMPT
    .replace('{SAMPLE_TYPE}', metadata.sampleType || 'not specified')
    .replace('{COLLECTION_DATE}', metadata.collectionDate || 'not specified')
    .replace('{LOCATION}', metadata.location || 'not specified')
    .replace('{NOTES}', metadata.notes || 'none');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'high'
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

// ─── ENRICH WITH ENCYCLOPEDIA DATA ───────────────────────────────────────────

/**
 * Enrich AI detections with full encyclopedia data (holistic treatments, etc.)
 */
function enrichDetections(aiDetections, imageQuality) {
  return aiDetections.map(detection => {
    // Try to match to encyclopedia entry
    const encyclopediaEntry = PARASITE_DATABASE.find(p => 
      p.id === detection.parasiteId ||
      p.scientificName.toLowerCase().includes(detection.scientificName?.toLowerCase() || '') ||
      p.commonName.toLowerCase().includes(detection.commonName?.toLowerCase() || '')
    );

    // Calibrate confidence
    const rawConfidence = detection.confidenceScore || 0.5;
    const calibratedConfidence = calibrateConfidence(rawConfidence, imageQuality);
    const reliable = isDetectionReliable(calibratedConfidence, imageQuality);

    return {
      ...detection,
      parasiteId: encyclopediaEntry?.id || detection.parasiteId,
      confidenceScore: calibratedConfidence,
      confidenceRaw: rawConfidence,
      isReliableDetection: reliable,
      confidenceLabel:
        calibratedConfidence >= 0.85 ? 'high' :
        calibratedConfidence >= 0.65 ? 'moderate' :
        calibratedConfidence >= 0.45 ? 'low' : 'insufficient',
      // Add holistic treatment data from encyclopedia
      holisticTreatment: encyclopediaEntry?.holistic || null,
      conventionalTreatment: encyclopediaEntry?.conventionalTreatment || detection.conventionalTreatment || null,
      encyclopediaEntry: encyclopediaEntry ? {
        australianPrevalence: encyclopediaEntry.australianPrevalence,
        transmission: encyclopediaEntry.transmission,
        prevention: encyclopediaEntry.prevention,
        australianResources: encyclopediaEntry.australianResources,
        microscopeAppearance: encyclopediaEntry.microscopyAppearance
      } : null
    };
  });
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

/**
 * Main analysis function
 * @param {Buffer} imageBuffer - Raw image buffer
 * @param {Object} metadata - { sampleType, collectionDate, location, notes }
 * @returns {Object} Complete analysis result
 */
export async function analyzeImage(imageBuffer, metadata = {}) {
  const startTime = Date.now();
  let aiProvider = 'claude';

  // Step 1: Preprocess image
  console.log('🔬 Starting image preprocessing...');
  const { buffer: processedBuffer, quality } = await preprocessImage(imageBuffer);
  const imageBase64 = bufferToBase64(processedBuffer);

  console.log(`📊 Image quality: ${quality.qualityLabel} (${(quality.overallQuality * 100).toFixed(0)}%)`);

  // Step 2: AI Analysis (Claude primary, GPT-4o fallback)
  let aiResult;
  try {
    console.log('🤖 Running Claude Vision analysis...');
    aiResult = await analyseWithClaude(imageBase64, metadata);
    aiProvider = 'claude';
  } catch (claudeError) {
    console.warn('⚠️ Claude Vision failed, trying GPT-4o fallback:', claudeError.message);
    try {
      aiResult = await analyseWithGPT4o(imageBase64, metadata);
      aiProvider = 'gpt-4o';
    } catch (gptError) {
      console.error('❌ Both AI providers failed:', gptError.message);
      throw new Error('AI analysis service temporarily unavailable. Please try again.');
    }
  }

  // Step 3: Enrich detections with encyclopedia data + confidence calibration
  const enrichedDetections = enrichDetections(
    aiResult.detections || [],
    quality
  );

  // Filter out unreliable detections (too low confidence given image quality)
  const reliableDetections = enrichedDetections.filter(d => d.isReliableDetection);
  const filteredOutCount = enrichedDetections.length - reliableDetections.length;

  if (filteredOutCount > 0) {
    console.log(`⚠️ ${filteredOutCount} detection(s) filtered out due to low confidence/image quality`);
  }

  // Step 4: Determine overall urgency
  const urgencyRanking = { emergency: 4, high: 3, moderate: 2, low: 1 };
  const highestUrgency = reliableDetections.reduce((highest, d) => {
    return (urgencyRanking[d.urgencyLevel] || 0) > (urgencyRanking[highest] || 0)
      ? d.urgencyLevel : highest;
  }, 'low');

  const processingTime = Date.now() - startTime;
  console.log(`✅ Analysis complete in ${processingTime}ms | Provider: ${aiProvider} | Detections: ${reliableDetections.length}`);

  return {
    // Analysis metadata
    aiProvider,
    processingTimeMs: processingTime,
    analysedAt: new Date().toISOString(),

    // Image quality report
    imageQuality: {
      ...quality,
      assessment: aiResult.imageQualityAssessment || null
    },

    // Diagnostic reasoning steps
    analysisSteps: aiResult.analysisSteps || [],

    // Confirmed detections (enriched with holistic data)
    detections: reliableDetections,

    // Summary
    overallUrgency: highestUrgency,
    overallConclusion: aiResult.overallConclusion || 'Analysis complete.',
    recommendedActions: aiResult.recommendedActions || [],
    recommendedTests: aiResult.recommendedTests || [],

    // Filtered out low-confidence detections (for transparency)
    lowConfidenceDetections: enrichedDetections.filter(d => !d.isReliableDetection),

    // Standard disclaimer
    disclaimer: 'This analysis is for educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.'
  };
}

/**
 * Lightweight version for re-processing existing results without new AI call
 * Useful for recalibrating old results when algorithm improves
 */
export function recalibrateResult(existingResult, newImageQuality) {
  return {
    ...existingResult,
    detections: enrichDetections(existingResult.detections, newImageQuality)
  };
}
