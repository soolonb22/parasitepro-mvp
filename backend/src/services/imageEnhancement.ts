// services/imageEnhancement.ts
// Server-side deep image enhancement pipeline using Sharp
// Generates 4 scientifically targeted versions for maximum AI analysis accuracy

import sharp from 'sharp';

export interface EnhancedImageSet {
  autoCorrect: Buffer;       // Auto brightness/contrast/gamma — baseline fix
  localContrast: Buffer;     // CLAHE-style tile-based contrast — reveals hidden structure
  shadowRecovery: Buffer;    // Aggressive shadow lift — dark toilet/microscope photos
  roiZoom: Buffer;           // Smart crop around specimen area — max detail on subject
  qualityReport: ImageQualityReport;
}

export interface ImageQualityReport {
  brightness: number;        // 0-255 average luminance
  contrast: number;          // Standard deviation of luminance
  sharpness: number;         // Laplacian variance — higher = sharper
  dominantIssue: 'too_dark' | 'too_bright' | 'too_blurry' | 'low_contrast' | 'good';
  retakeAdvice: string | null;
  processingApplied: string[];
}

// ─── QUALITY ANALYSIS ────────────────────────────────────────────────────────
async function analyzeQuality(buffer: Buffer): Promise<{ brightness: number; contrast: number; sharpness: number }> {
  const { data, info } = await sharp(buffer)
    .resize(400, 400, { fit: 'inside' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const len = pixels.length;

  // Brightness — average luminance
  let sum = 0;
  for (let i = 0; i < len; i++) sum += pixels[i];
  const brightness = sum / len;

  // Contrast — standard deviation
  let varSum = 0;
  for (let i = 0; i < len; i++) varSum += Math.pow(pixels[i] - brightness, 2);
  const contrast = Math.sqrt(varSum / len);

  // Sharpness — Laplacian variance on downsampled image
  const w = info.width, h = info.height;
  let lapSum = 0, lapSumSq = 0, lapN = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const c = pixels[y * w + x];
      const lap = 4 * c
        - pixels[(y - 1) * w + x]
        - pixels[(y + 1) * w + x]
        - pixels[y * w + (x - 1)]
        - pixels[y * w + (x + 1)];
      lapSum += lap;
      lapSumSq += lap * lap;
      lapN++;
    }
  }
  const lapMean = lapSum / lapN;
  const sharpness = (lapSumSq / lapN) - (lapMean * lapMean);

  return { brightness, contrast, sharpness };
}

// ─── CLAHE-STYLE LOCAL CONTRAST ───────────────────────────────────────────────
// Sharp doesn't have native CLAHE but we simulate it with tiled normalisation
async function localContrastEnhance(buffer: Buffer): Promise<Buffer> {
  const img = sharp(buffer);
  const meta = await img.metadata();
  const w = meta.width || 1200;
  const h = meta.height || 1200;

  // Get raw pixel data
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8ClampedArray(data);
  const iw = info.width, ih = info.height;
  const result = new Uint8ClampedArray(pixels.length);

  // Tile size for local contrast (roughly 8x8 grid)
  const tileW = Math.floor(iw / 8);
  const tileH = Math.floor(ih / 8);

  for (let ty = 0; ty < ih; ty++) {
    for (let tx = 0; tx < iw; tx++) {
      const idx = (ty * iw + tx) * 4;

      // Sample local neighbourhood (tile)
      const x0 = Math.max(0, tx - tileW);
      const x1 = Math.min(iw - 1, tx + tileW);
      const y0 = Math.max(0, ty - tileH);
      const y1 = Math.min(ih - 1, ty + tileH);

      let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
      const step = 4; // Sample every 4th pixel for speed
      for (let sy = y0; sy <= y1; sy += step) {
        for (let sx = x0; sx <= x1; sx += step) {
          const si = (sy * iw + sx) * 4;
          if (pixels[si+3] < 128) continue; // skip transparent
          if (pixels[si]   < rMin) rMin = pixels[si];
          if (pixels[si]   > rMax) rMax = pixels[si];
          if (pixels[si+1] < gMin) gMin = pixels[si+1];
          if (pixels[si+1] > gMax) gMax = pixels[si+1];
          if (pixels[si+2] < bMin) bMin = pixels[si+2];
          if (pixels[si+2] > bMax) bMax = pixels[si+2];
        }
      }

      // Clip limit — prevent over-saturation (CLAHE clip)
      const clipRange = 200;
      const rRange = Math.min(Math.max(rMax - rMin, 1), clipRange);
      const gRange = Math.min(Math.max(gMax - gMin, 1), clipRange);
      const bRange = Math.min(Math.max(bMax - bMin, 1), clipRange);

      result[idx]   = Math.min(255, Math.max(0, ((pixels[idx]   - rMin) / rRange) * 240));
      result[idx+1] = Math.min(255, Math.max(0, ((pixels[idx+1] - gMin) / gRange) * 240));
      result[idx+2] = Math.min(255, Math.max(0, ((pixels[idx+2] - bMin) / bRange) * 240));
      result[idx+3] = pixels[idx+3];
    }
  }

  return sharp(Buffer.from(result), { raw: { width: iw, height: ih, channels: 4 } })
    .jpeg({ quality: 92 })
    .toBuffer();
}

// ─── ROI DETECTION — finds specimen area ─────────────────────────────────────
// Finds the region with highest local contrast — where the specimen likely is
async function findROI(buffer: Buffer): Promise<{ left: number; top: number; width: number; height: number }> {
  const { data, info } = await sharp(buffer)
    .resize(200, 200, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const iw = info.width, ih = info.height;

  // Scan in 4x4 tiles, find highest variance tile
  const tileW = Math.floor(iw / 4);
  const tileH = Math.floor(ih / 4);
  let bestScore = -1, bestTX = 1, bestTY = 1;

  for (let ty = 0; ty < 4; ty++) {
    for (let tx = 0; tx < 4; tx++) {
      let sum = 0, count = 0;
      for (let y = ty * tileH; y < Math.min((ty + 1) * tileH, ih); y++) {
        for (let x = tx * tileW; x < Math.min((tx + 1) * tileW, iw); x++) {
          sum += pixels[y * iw + x];
          count++;
        }
      }
      const mean = sum / count;
      let variance = 0;
      for (let y = ty * tileH; y < Math.min((ty + 1) * tileH, ih); y++) {
        for (let x = tx * tileW; x < Math.min((tx + 1) * tileW, iw); x++) {
          variance += Math.pow(pixels[y * iw + x] - mean, 2);
        }
      }
      variance /= count;

      // Also penalise very bright (toilet water) or very dark (background) tiles
      const brightPenalty = mean > 220 ? 0.3 : 1.0;
      const darkPenalty   = mean < 30  ? 0.3 : 1.0;
      const score = variance * brightPenalty * darkPenalty;

      if (score > bestScore) { bestScore = score; bestTX = tx; bestTY = ty; }
    }
  }

  // Expand the best tile by 1 tile in each direction (gives context)
  const meta = await sharp(buffer).metadata();
  const realW = meta.width || 1200;
  const realH = meta.height || 1200;
  const scalX = realW / iw;
  const scalY = realH / ih;

  const left   = Math.max(0,       Math.round((bestTX - 1) * tileW * scalX));
  const top    = Math.max(0,       Math.round((bestTY - 1) * tileH * scalY));
  const right  = Math.min(realW,   Math.round((bestTX + 2) * tileW * scalX));
  const bottom = Math.min(realH,   Math.round((bestTY + 2) * tileH * scalY));

  return { left, top, width: right - left, height: bottom - top };
}

// ─── MAIN ENHANCEMENT PIPELINE ───────────────────────────────────────────────
export async function enhanceImageForAnalysis(inputBuffer: Buffer): Promise<EnhancedImageSet> {
  const processingApplied: string[] = [];

  // Step 1 — Quality analysis
  const quality = await analyzeQuality(inputBuffer);
  console.log(`📊 Image quality — brightness: ${quality.brightness.toFixed(0)}, contrast: ${quality.contrast.toFixed(0)}, sharpness: ${quality.sharpness.toFixed(0)}`);

  // Determine dominant issue and retake advice
  let dominantIssue: ImageQualityReport['dominantIssue'] = 'good';
  let retakeAdvice: string | null = null;

  if (quality.brightness < 40) {
    dominantIssue = 'too_dark';
    retakeAdvice = 'Your photo is very dark. Try taking it near a window or turning on the bathroom light fully. Good lighting makes a big difference to the accuracy of the report.';
  } else if (quality.brightness > 220) {
    dominantIssue = 'too_bright';
    retakeAdvice = 'Your photo is overexposed. Move slightly away from direct light or turn off your phone flash.';
  } else if (quality.sharpness < 50) {
    dominantIssue = 'too_blurry';
    retakeAdvice = 'Your photo is out of focus. Tap on the specimen area on your phone screen before taking the shot, and hold your phone steady.';
  } else if (quality.contrast < 15) {
    dominantIssue = 'low_contrast';
    retakeAdvice = 'The specimen is hard to distinguish. Try photographing against a plain white background (like white toilet paper or a white plate).';
  }

  // Step 2 — Normalise input: ensure 1200px minimum, consistent format
  const normalised = await sharp(inputBuffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: false })
    .jpeg({ quality: 95 })
    .toBuffer();
  processingApplied.push('Normalised to 1200px, JPEG 95%');

  // Step 3 — AUTO-CORRECT VERSION
  // Adaptive gamma based on brightness + contrast boost + saturation lift
  const gammaCurve = quality.brightness < 80 ? 0.6    // aggressive lift for dark
                   : quality.brightness < 120 ? 0.75   // moderate lift
                   : quality.brightness > 180 ? 1.4    // darken overexposed
                   : 1.0;                               // near-perfect, minimal adjustment

  const autoCorrect = await sharp(normalised)
    .gamma(gammaCurve)                                  // gamma correction
    .modulate({ saturation: 1.35, brightness: 1.0 })   // saturation boost for colour differentiation
    .sharpen({ sigma: 1.2, m1: 0.5, m2: 3.0 })         // adaptive unsharp mask
    .normalise()                 // percentile stretch (ignores outliers)
    .jpeg({ quality: 93 })
    .toBuffer();
  processingApplied.push(`Auto-correct: gamma ${gammaCurve}, saturation +35%, percentile normalise`);

  // Step 4 — LOCAL CONTRAST VERSION (CLAHE-style)
  const localContrast = await localContrastEnhance(normalised);
  processingApplied.push('CLAHE-style local contrast enhancement');

  // Step 5 — SHADOW RECOVERY VERSION
  // Specifically designed for dark toilet photos / dim specimen photos
  const shadowRecovery = await sharp(normalised)
    .gamma(0.45)                                        // very aggressive gamma lift
    .modulate({ saturation: 1.5, brightness: 1.15 })   // boost saturation + brightness
    .linear(1.4, -20)                                   // contrast stretch: multiply + offset
    .sharpen({ sigma: 1.5, m1: 1.0, m2: 3.5 })
    .normalise()
    .jpeg({ quality: 90 })
    .toBuffer();
  processingApplied.push('Shadow recovery: aggressive gamma 0.45, contrast linear stretch');

  // Step 6 — ROI ZOOM VERSION
  // Detect specimen area and crop to max detail
  let roiZoom: Buffer;
  try {
    const roi = await findROI(normalised);
    console.log(`🎯 ROI detected: left=${roi.left} top=${roi.top} ${roi.width}x${roi.height}`);

    // Only crop if the ROI is meaningfully smaller than the full image (>20% smaller)
    const meta = await sharp(normalised).metadata();
    const fullArea = (meta.width || 1200) * (meta.height || 1200);
    const roiArea = roi.width * roi.height;
    const shouldCrop = roiArea < fullArea * 0.75 && roi.width > 200 && roi.height > 200;

    if (shouldCrop) {
      roiZoom = await sharp(normalised)
        .extract({ left: roi.left, top: roi.top, width: roi.width, height: roi.height })
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: false })
        .gamma(gammaCurve)
        .modulate({ saturation: 1.4 })
        .sharpen({ sigma: 1.0, m1: 0.8, m2: 3.0 })
        .normalise()
        .jpeg({ quality: 95 })
        .toBuffer();
      processingApplied.push(`ROI crop: ${roi.width}x${roi.height} at (${roi.left},${roi.top}), upscaled to 1200px`);
    } else {
      // Full image is already the specimen — just enhance maximally
      roiZoom = await sharp(normalised)
        .resize(1400, 1400, { fit: 'inside', withoutEnlargement: false })
        .modulate({ saturation: 1.5 })
        .sharpen({ sigma: 0.8, m1: 1.2, m2: 4.0 })
        .normalise()
        .jpeg({ quality: 96 })
        .toBuffer();
      processingApplied.push('Full image max-detail upscale (specimen fills frame)');
    }
  } catch (e) {
    console.warn('⚠️ ROI detection failed, using full enhanced image:', e);
    roiZoom = autoCorrect;
    processingApplied.push('ROI detection failed — using auto-correct fallback');
  }

  return {
    autoCorrect,
    localContrast,
    shadowRecovery,
    roiZoom,
    qualityReport: {
      brightness: quality.brightness,
      contrast: quality.contrast,
      sharpness: quality.sharpness,
      dominantIssue,
      retakeAdvice,
      processingApplied,
    },
  };
}
