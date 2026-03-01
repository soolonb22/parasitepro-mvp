/**
 * pdfReport.js
 * Professional PDF report generation for ParasitePro
 * Uses pdfkit — already in your package.json
 * Generates downloadable reports suitable for sharing with healthcare providers
 */

import PDFDocument from 'pdfkit';

// ─── BRAND COLOURS ────────────────────────────────────────────────────────────
const COLOURS = {
  primary:    '#0891B2',  // Teal/cyan
  dark:       '#0F172A',  // Near-black
  mediumGrey: '#64748B',
  lightGrey:  '#F1F5F9',
  white:      '#FFFFFF',
  emergency:  '#DC2626',
  high:       '#EA580C',
  moderate:   '#D97706',
  low:        '#16A34A',
  border:     '#CBD5E1'
};

const URGENCY_COLOURS = {
  emergency: COLOURS.emergency,
  high:      COLOURS.high,
  moderate:  COLOURS.moderate,
  low:       COLOURS.low
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

function addPageHeader(doc, pageNum) {
  const bottom = doc.page.margins.top / 2;
  doc
    .fillColor(COLOURS.mediumGrey)
    .fontSize(8)
    .text('ParasitePro — Educational Report', doc.page.margins.left, bottom, { continued: true })
    .text(`Page ${pageNum}`, { align: 'right' })
    .fillColor(COLOURS.dark);
}

function drawHorizontalRule(doc, colour = COLOURS.border) {
  doc
    .strokeColor(colour)
    .lineWidth(0.5)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
    .moveDown(0.5);
}

function sectionHeading(doc, text) {
  doc.moveDown(0.5);
  drawHorizontalRule(doc, COLOURS.primary);
  doc
    .fillColor(COLOURS.primary)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(text.toUpperCase())
    .fillColor(COLOURS.dark)
    .font('Helvetica')
    .fontSize(10)
    .moveDown(0.5);
}

function urgencyBadge(doc, level, x, y) {
  const colour = URGENCY_COLOURS[level] || COLOURS.mediumGrey;
  const label = level.toUpperCase();
  const w = 70;
  const h = 16;

  doc
    .roundedRect(x, y - 2, w, h, 3)
    .fill(colour)
    .fillColor(COLOURS.white)
    .fontSize(7)
    .font('Helvetica-Bold')
    .text(label, x, y + 1, { width: w, align: 'center' })
    .fillColor(COLOURS.dark)
    .font('Helvetica')
    .fontSize(10);
}

function confidenceBar(doc, score, x, y, width = 200) {
  const filled = Math.round(score * width);
  const colour = score >= 0.8 ? COLOURS.low : score >= 0.6 ? COLOURS.moderate : COLOURS.high;

  // Background
  doc.roundedRect(x, y, width, 8, 2).fill(COLOURS.lightGrey);
  // Fill
  doc.roundedRect(x, y, filled, 8, 2).fill(colour);

  // Label
  doc
    .fillColor(COLOURS.mediumGrey)
    .fontSize(8)
    .text(`${(score * 100).toFixed(0)}%`, x + width + 6, y - 1)
    .fillColor(COLOURS.dark)
    .fontSize(10);
}

// ─── MAIN PDF GENERATOR ───────────────────────────────────────────────────────

/**
 * Generate a professional PDF report
 * @param {Object} analysis - Full analysis result from database
 * @param {Object} user - { firstName, lastName, email }
 * @returns {Buffer} PDF buffer
 */
export function generatePDFReport(analysis, user) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 50, right: 50 },
      info: {
        Title: `ParasitePro Analysis Report — ${analysis.id}`,
        Author: 'ParasitePro AI',
        Subject: 'Parasite Identification Educational Report',
        Creator: 'ParasitePro'
      }
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    let pageNum = 1;

    // ── COVER HEADER ────────────────────────────────────────────────────────
    // Logo area / brand bar
    doc
      .rect(0, 0, doc.page.width, 90)
      .fill(COLOURS.dark);

    doc
      .fillColor(COLOURS.white)
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('ParasitePro', doc.page.margins.left, 24)
      .fontSize(10)
      .font('Helvetica')
      .fillColor(COLOURS.primary)
      .text('AI-Powered Parasite Analysis — Educational Report', doc.page.margins.left, 52)
      .fillColor(COLOURS.dark);

    doc.y = 110;

    // ── DISCLAIMER BOX ──────────────────────────────────────────────────────
    doc
      .roundedRect(doc.page.margins.left, doc.y, pageWidth, 42, 4)
      .fill(COLOURS.lightGrey)
      .stroke(COLOURS.border);

    doc
      .fillColor(COLOURS.mediumGrey)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('⚠  IMPORTANT DISCLAIMER', doc.page.margins.left + 10, doc.y + 8)
      .font('Helvetica')
      .text(
        'This report is for educational and informational purposes only. It does not constitute medical advice, ' +
        'diagnosis, or treatment. Always consult a qualified healthcare professional before making any health decisions.',
        doc.page.margins.left + 10,
        doc.y + 19,
        { width: pageWidth - 20 }
      )
      .fillColor(COLOURS.dark)
      .fontSize(10);

    doc.y += 50;

    // ── REPORT INFO ─────────────────────────────────────────────────────────
    sectionHeading(doc, '📋 Report Details');

    const reportDate = new Date(analysis.uploadedAt || analysis.createdAt || Date.now());
    const formatDate = (d) => new Intl.DateTimeFormat('en-AU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Brisbane'
    }).format(d);

    const infoRows = [
      ['Report ID',         analysis.id || 'N/A'],
      ['Patient',           `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous'],
      ['Email',             user?.email || 'N/A'],
      ['Sample Type',       (analysis.sampleType || 'Not specified').charAt(0).toUpperCase() + (analysis.sampleType || 'not specified').slice(1)],
      ['Collection Date',   analysis.collectionDate ? new Intl.DateTimeFormat('en-AU').format(new Date(analysis.collectionDate)) : 'Not specified'],
      ['Sample Location',   analysis.location || 'Not specified'],
      ['Analysis Date',     formatDate(reportDate)],
      ['AI Provider',       analysis.aiResult?.aiProvider === 'claude' ? 'Claude Vision (Anthropic)' : 'GPT-4o (OpenAI)']
    ];

    infoRows.forEach(([label, value]) => {
      doc
        .font('Helvetica-Bold').text(`${label}:  `, { continued: true })
        .font('Helvetica').text(value)
        .moveDown(0.2);
    });

    // ── URGENCY SUMMARY ─────────────────────────────────────────────────────
    const aiResult = analysis.aiResult || {};
    const detections = aiResult.detections || [];
    const overallUrgency = aiResult.overallUrgency || 'low';

    doc.moveDown();
    sectionHeading(doc, '🚨 Overall Assessment');

    const urgencyColour = URGENCY_COLOURS[overallUrgency] || COLOURS.low;
    doc
      .roundedRect(doc.page.margins.left, doc.y, pageWidth, 40, 4)
      .fill(urgencyColour);

    doc
      .fillColor(COLOURS.white)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(
        `${detections.length === 0 ? 'No Parasites Detected' : `${detections.length} Organism(s) Identified`}  —  Urgency: ${overallUrgency.toUpperCase()}`,
        doc.page.margins.left + 12,
        doc.y + 12,
        { width: pageWidth - 24 }
      )
      .fillColor(COLOURS.dark)
      .font('Helvetica')
      .fontSize(10);

    doc.y += 48;
    doc.moveDown(0.5);

    // Overall conclusion
    if (aiResult.overallConclusion) {
      doc
        .font('Helvetica-Bold').text('Summary:  ', { continued: true })
        .font('Helvetica').text(aiResult.overallConclusion)
        .moveDown(0.5);
    }

    // ── DETECTIONS ──────────────────────────────────────────────────────────
    if (detections.length > 0) {
      sectionHeading(doc, '🔬 Detected Organisms');

      detections.forEach((d, index) => {
        // Check page break
        if (doc.y > doc.page.height - 200) {
          doc.addPage();
          pageNum++;
        }

        // Detection card background
        doc
          .roundedRect(doc.page.margins.left, doc.y, pageWidth, 12, 2)
          .fill(COLOURS.lightGrey);

        doc
          .fillColor(COLOURS.dark)
          .font('Helvetica-Bold')
          .fontSize(11)
          .text(
            `${index + 1}. ${d.commonName}`,
            doc.page.margins.left + 8,
            doc.y + 2,
            { continued: true, width: pageWidth - 100 }
          )
          .font('Helvetica')
          .fontSize(10);

        // Urgency badge
        urgencyBadge(doc, d.urgencyLevel, doc.page.margins.left + pageWidth - 72, doc.y - 10);

        doc.y += 18;
        doc.moveDown(0.3);

        // Scientific name
        doc
          .fillColor(COLOURS.mediumGrey)
          .font('Helvetica-Oblique')
          .text(`   ${d.scientificName || ''}`)
          .fillColor(COLOURS.dark)
          .font('Helvetica');

        doc.moveDown(0.3);

        // Confidence bar
        doc
          .text('   Confidence:  ', { continued: true })
          .text('', { continued: false });

        const barY = doc.y - 12;
        confidenceBar(doc, d.confidenceScore || 0, doc.page.margins.left + 90, barY);

        doc.moveDown(0.2);

        // Life stage & type
        if (d.lifeStage) {
          doc.text(`   Life stage observed:  `, { continued: true }).font('Helvetica-Bold').text(d.lifeStage).font('Helvetica');
        }
        if (d.parasiteType) {
          doc.text(`   Classification:  `, { continued: true }).font('Helvetica-Bold').text(d.parasiteType.charAt(0).toUpperCase() + d.parasiteType.slice(1)).font('Helvetica');
        }

        // Visual evidence
        if (d.visualEvidence) {
          doc.moveDown(0.3);
          doc
            .font('Helvetica-Bold').text('   Visual Evidence:  ', { continued: true })
            .font('Helvetica').text(d.visualEvidence, { width: pageWidth - 20 });
        }

        // Holistic treatment (brief summary)
        if (d.holisticTreatment) {
          doc.moveDown(0.5);
          doc
            .fillColor(COLOURS.primary)
            .font('Helvetica-Bold')
            .text('   🌿 Holistic Support Options:')
            .fillColor(COLOURS.dark)
            .font('Helvetica');

          // Herbal recommendations (top 3)
          const herbs = (d.holisticTreatment.herbal || []).slice(0, 3);
          if (herbs.length > 0) {
            doc.text('   Herbal:  ', { continued: true });
            doc.text(herbs.map(h => `${h.name} (${h.dose})`).join(' · '));
          }

          // Key dietary tips (top 3)
          const dietary = (d.holisticTreatment.dietary || []).slice(0, 3);
          if (dietary.length > 0) {
            doc.text('   Dietary:  ', { continued: true });
            doc.text(dietary.join(' · '));
          }

          // Top supplements
          const supps = (d.holisticTreatment.supplements || []).slice(0, 2);
          if (supps.length > 0) {
            doc.text('   Supplements:  ', { continued: true });
            doc.text(supps.map(s => `${s.name} ${s.dose}`).join(' · '));
          }

          if (d.holisticTreatment.disclaimer) {
            doc
              .fillColor(COLOURS.mediumGrey)
              .fontSize(8)
              .text(`   Note: ${d.holisticTreatment.disclaimer}`, { width: pageWidth - 20 })
              .fillColor(COLOURS.dark)
              .fontSize(10);
          }
        }

        // Conventional treatment note
        if (d.conventionalTreatment) {
          doc.moveDown(0.3);
          doc
            .font('Helvetica-Bold').text('   Conventional Treatment:  ', { continued: true })
            .font('Helvetica').fillColor(COLOURS.mediumGrey)
            .text(d.conventionalTreatment, { width: pageWidth - 20 })
            .fillColor(COLOURS.dark);
        }

        doc.moveDown(1);
        drawHorizontalRule(doc);
      });
    } else {
      doc
        .fillColor(COLOURS.low)
        .font('Helvetica-Bold')
        .text('✓  No parasitic organisms were confidently detected in this image.')
        .fillColor(COLOURS.dark)
        .font('Helvetica')
        .moveDown(0.5)
        .text('This may be because:')
        .text('  • No parasites are present')
        .text('  • Image quality was insufficient for detection')
        .text('  • Organisms present are not in the current detection database')
        .moveDown();
    }

    // ── DIAGNOSTIC REASONING ────────────────────────────────────────────────
    const steps = aiResult.analysisSteps || [];
    if (steps.length > 0) {
      if (doc.y > doc.page.height - 150) { doc.addPage(); pageNum++; }
      sectionHeading(doc, '🧠 Step-by-Step Diagnostic Reasoning');

      steps.forEach((step, i) => {
        doc
          .font('Helvetica-Bold')
          .fillColor(COLOURS.primary)
          .text(`Step ${step.step || i + 1}: ${step.title}`)
          .fillColor(COLOURS.dark)
          .font('Helvetica');

        if (step.observation) {
          doc.text(`  Observation: ${step.observation}`, { width: pageWidth });
        }
        if (step.significance) {
          doc.text(`  Significance: ${step.significance}`, { width: pageWidth });
        }
        doc.moveDown(0.5);
      });
    }

    // ── RECOMMENDED ACTIONS ─────────────────────────────────────────────────
    const actions = aiResult.recommendedActions || [];
    const tests = aiResult.recommendedTests || [];

    if (actions.length > 0 || tests.length > 0) {
      if (doc.y > doc.page.height - 150) { doc.addPage(); pageNum++; }
      sectionHeading(doc, '📌 Recommended Next Steps');

      actions.forEach((action, i) => {
        doc.text(`${i + 1}. ${action}`, { width: pageWidth });
      });

      if (tests.length > 0) {
        doc.moveDown(0.5);
        doc
          .font('Helvetica-Bold')
          .text('Suggested Pathology Tests:')
          .font('Helvetica');
        tests.forEach(test => {
          doc.text(`  • ${test}`);
        });
      }
    }

    // ── FOOTER ──────────────────────────────────────────────────────────────
    doc.moveDown(2);
    drawHorizontalRule(doc, COLOURS.primary);
    doc
      .fillColor(COLOURS.mediumGrey)
      .fontSize(8)
      .text(
        'Generated by ParasitePro AI | parasitepro.com | ' +
        'For educational purposes only. Not a substitute for professional medical advice.',
        { align: 'center' }
      )
      .text(
        `Report ID: ${analysis.id} | Generated: ${new Date().toISOString()}`,
        { align: 'center' }
      );

    doc.end();
  });
}
