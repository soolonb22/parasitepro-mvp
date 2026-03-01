/**
 * imagePreprocessing.js
 * Sharp-based image optimisation pipeline for ParasitePro
 * Improves AI analysis accuracy by normalising images before submission
 */

import sharp from 'sharp';

/**
 * Assess raw image quality and return metadata used for confidence calibration
 */
export async function assessImageQuality(buffer) {
  const metadata = await sharp(buffer).metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const hasAlpha = metadata.hasAlpha || false;
  const format = metadata.format || 'unknown';

  // Resolution score (0–1)
  const minDimension = Math.min(width, height);
  const resolutionScore =
    minDimension >= 1000 ? 1.0 :
    minDimension >= 600  ? 0.8 :
    minDimension >= 400  ? 0.6 :
    minDimension >= 200  ? 0.4 : 0.2;

  // Estimate sharpness via edge detection using statistics
  let sharpnessScore = 0.7; // default moderate
  try {
    const { data, info } = await sharp(buffer)
      .greyscale()
      .resize(200, 200, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate variance of pixel values — higher variance = more edges = sharper
    let sum = 0;
    let sumSq = 0;
    const n = data.length;
    for (let i = 0; i < n; i++) {
      sum += data[i];
      sumSq += data[i] * data[i];
    }
    const mean = sum / n;
    const variance = (sumSq / n) - (mean * mean);

    // Typical variance range for microscope images: 200–3000
    sharpnessScore =
      variance >= 2000 ? 1.0 :
      variance >= 1000 ? 0.85 :
      variance >= 500  ? 0.70 :
      variance >= 200  ? 0.55 : 0.35;
  } catch {
    sharpnessScore = 0.6;
  }

  // Lighting score based on mean brightness
  let lightingScore = 0.7;
  try {
    const stats = await sharp(buffer).greyscale().stats();
    const mean = stats.channels[0].mean;
    // Ideal mean for microscope images: 80–180
    lightingScore =
      (mean >= 80 && mean <= 180) ? 1.0 :
      (mean >= 50 && mean <= 210) ? 0.8 :
      (mean >= 30 && mean <= 230) ? 0.6 : 0.4;
  } catch {
    lightingScore = 0.6;
  }

  const overallQuality = (resolutionScore * 0.4) + (sharpnessScore * 0.35) + (lightingScore * 0.25);

  return {
    width,
    height,
    format,
    hasAlpha,
    resolutionScore,
    sharpnessScore,
    lightingScore,
    overallQuality,
    qualityLabel:
      overallQuality >= 0.8 ? 'excellent' :
      overallQuality >= 0.6 ? 'good' :
      overallQuality >= 0.4 ? 'fair' : 'poor'
  };
}

/**
 * Main preprocessing pipeline
 * Returns optimised buffer + quality metadata
 */
export async function preprocessImage(buffer) {
  const quality = await assessImageQuality(buffer);

  const processed = await sharp(buffer)
    // Auto-rotate based on EXIF orientation (fixes mobile photos)
    .rotate()
    // Resize to optimal dimensions for AI analysis (max 1600px on longest side)
    .resize(1600, 1600, {
      fit: 'inside',
      withoutEnlargement: true
    })
    // Enhance contrast and normalise levels
    .normalise()
    // Sharpen slightly to improve microscope image clarity
    .sharpen({
      sigma: 1.2,
      m1: 0.5,
      m2: 0.3
    })
    // Remove alpha channel (AI models don't need it)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    // Output as JPEG for consistent format
    .jpeg({
      quality: 92,
      progressive: true,
      mozjpeg: true
    })
    .toBuffer();

  console.log(`📸 Image preprocessed | Quality: ${quality.qualityLabel} (${(quality.overallQuality * 100).toFixed(0)}%) | ${quality.width}x${quality.height}px`);

  return {
    buffer: processed,
    quality,
    originalSize: buffer.length,
    processedSize: processed.length
  };
}

/**
 * Convert buffer to base64 data URL for Claude Vision API
 */
export function bufferToBase64(buffer, mimeType = 'image/jpeg') {
  return buffer.toString('base64');
}
