// Mock AI Service for MVP
// Replace this with real AI integration in Phase 2

export interface AIDetection {
  parasiteId: string;
  commonName: string;
  scientificName: string;
  confidenceScore: number;
  parasiteType: 'protozoa' | 'helminth' | 'ectoparasite';
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  lifeStage?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Mock parasite database
const MOCK_PARASITES = [
  {
    parasiteId: 'giardia-001',
    commonName: 'Giardia lamblia',
    scientificName: 'Giardia intestinalis',
    parasiteType: 'protozoa' as const,
    urgencyLevel: 'moderate' as const,
    lifeStage: 'cyst',
  },
  {
    parasiteId: 'ascaris-001',
    commonName: 'Roundworm',
    scientificName: 'Ascaris lumbricoides',
    parasiteType: 'helminth' as const,
    urgencyLevel: 'moderate' as const,
    lifeStage: 'egg',
  },
  {
    parasiteId: 'taenia-001',
    commonName: 'Tapeworm',
    scientificName: 'Taenia saginata',
    parasiteType: 'helminth' as const,
    urgencyLevel: 'high' as const,
    lifeStage: 'proglottid',
  },
  {
    parasiteId: 'entamoeba-001',
    commonName: 'Entamoeba',
    scientificName: 'Entamoeba histolytica',
    parasiteType: 'protozoa' as const,
    urgencyLevel: 'high' as const,
    lifeStage: 'cyst',
  },
  {
    parasiteId: 'cryptosporidium-001',
    commonName: 'Cryptosporidium',
    scientificName: 'Cryptosporidium parvum',
    parasiteType: 'protozoa' as const,
    urgencyLevel: 'moderate' as const,
    lifeStage: 'oocyst',
  },
  {
    parasiteId: 'hookworm-001',
    commonName: 'Hookworm',
    scientificName: 'Ancylostoma duodenale',
    parasiteType: 'helminth' as const,
    urgencyLevel: 'high' as const,
    lifeStage: 'egg',
  },
];

/**
 * Simulate AI analysis of parasite image
 * @param imageUrl - URL of the uploaded image
 * @returns Promise with detection results
 */
export async function analyzeImage(
  imageUrl: string
): Promise<{ detections: AIDetection[] }> {
  console.log('🔬 Starting mock AI analysis for:', imageUrl);

  // Simulate realistic processing time (3-5 seconds)
  const processingTime = 3000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, processingTime));

  // Randomly select 1-3 parasites for detection
  const numDetections = Math.floor(Math.random() * 3) + 1;
  const selectedParasites = MOCK_PARASITES
    .sort(() => Math.random() - 0.5)
    .slice(0, numDetections);

  // Generate detections with realistic confidence scores
  const detections: AIDetection[] = selectedParasites.map((parasite, index) => {
    // First detection has highest confidence, subsequent ones lower
    const baseConfidence = 0.95 - index * 0.15;
    const randomVariation = Math.random() * 0.1;
    const confidence = baseConfidence - randomVariation;

    // Generate realistic bounding box coordinates
    const boundingBox = {
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 300),
      width: Math.floor(Math.random() * 200) + 100,
      height: Math.floor(Math.random() * 150) + 75,
    };

    return {
      ...parasite,
      confidenceScore: Math.max(0.60, Math.min(0.99, confidence)),
      boundingBox,
    };
  });

  console.log('✅ Mock AI analysis complete:', {
    detectionsCount: detections.length,
    parasites: detections.map((d) => d.commonName),
  });

  return { detections };
}

/**
 * Check if AI service is available
 * Always returns true for mock service
 */
export async function checkAIServiceHealth(): Promise<boolean> {
  return true;
}

/**
 * Get supported sample types
 */
export function getSupportedSampleTypes(): string[] {
  return ['stool', 'blood', 'skin', 'other'];
}

/**
 * Get AI service information
 */
export function getAIServiceInfo() {
  return {
    provider: 'Mock AI Service',
    version: '1.0.0',
    status: 'active',
    note: 'This is a mock service for MVP. Replace with real AI in Phase 2.',
  };
}
