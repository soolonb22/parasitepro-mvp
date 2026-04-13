// ─── Analyzer types ──────────────────────────────────────────────────────────

export type SampleType =
  | 'skin'
  | 'stool'
  | 'blood'
  | 'microscopy'
  | 'environmental'
  | 'unknown'

export type ConfidenceLevel = 'high' | 'moderate' | 'low'

export type UrgencyTier = 'low' | 'moderate' | 'high' | 'urgent'

export interface DifferentialDiagnosis {
  condition: string
  likelihood: 'High' | 'Moderate' | 'Low'
  keyDifferentiator: string
}

export interface GpPrepNotes {
  whatToTell: string[]      // Specific facts to relay to GP
  questionsToAsk: string[]  // Questions to raise
  testsToRequest: string[]  // Diagnostic tests to ask about
}

export interface PrimaryFinding {
  commonName: string
  scientificName: string | null
  description: string
}

export interface AnalysisReport {
  id: string
  createdAt: string           // ISO string
  sampleType: SampleType
  inputSummary: string        // First 120 chars of the user's submission

  // ── Clinical findings ──
  imageQuality: string        // "Good" / "Adequate" / "Poor" / "Text only"
  primaryFinding: PrimaryFinding
  visualEvidence: string[]    // 3-5 bullet points of supporting evidence
  confidence: ConfidenceLevel
  differentialDiagnoses: DifferentialDiagnosis[]

  // ── Urgency ──
  urgencyLevel: UrgencyTier
  urgencyRationale: string

  // ── Action guidance ──
  recommendedAction: string
  gpPrepNotes: GpPrepNotes
  geographicRelevance: string

  // ── Meta ──
  saved: boolean
  creditsUsed: number
}

// ─── Submission input ──────────────────────────────────────────────────────

export interface AnalysisSubmission {
  sampleType: SampleType
  textInput: string           // Symptom description or pasted lab results
  fileName?: string           // If file was uploaded
  fileContent?: string        // Extracted text from PDF/TXT
}

// ─── Pipeline step (progress UI) ──────────────────────────────────────────

export interface PipelineStep {
  id: string
  label: string
  sublabel: string
  durationMs: number          // Approximate real duration of this step
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'validate',    label: 'Validating submission',                  sublabel: 'Checking input quality and completeness',         durationMs: 800  },
  { id: 'extract',     label: 'Extracting key findings',                sublabel: 'Identifying symptoms, patterns, and markers',      durationMs: 1800 },
  { id: 'database',    label: 'Cross-referencing parasite database',    sublabel: 'Matching against Australian endemic species',       durationMs: 2800 },
  { id: 'differential',label: 'Running differential analysis',          sublabel: 'Evaluating 2–3 alternative possibilities',         durationMs: 3200 },
  { id: 'geographic',  label: 'Applying geographic context',            sublabel: 'Weighting for Queensland / tropical Australia',     durationMs: 1500 },
  { id: 'gp',          label: 'Generating GP preparation notes',        sublabel: 'Preparing questions, tests to request',            durationMs: 2200 },
  { id: 'compile',     label: 'Compiling educational report',           sublabel: 'Structuring findings and safety classifications',   durationMs: 1400 },
]

// ─── Urgency display config ───────────────────────────────────────────────

export const URGENCY_CONFIG: Record<UrgencyTier, {
  emoji: string
  label: string
  tagline: string
  textColor: string
  bgColor: string
  borderColor: string
  barColor: string
}> = {
  low: {
    emoji: '🟢',
    label: 'LOW',
    tagline: 'Monitor and observe — no immediate action required',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    barColor: 'bg-emerald-500',
  },
  moderate: {
    emoji: '🟡',
    label: 'MODERATE',
    tagline: 'Seek medical advice within 1–2 weeks',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    barColor: 'bg-amber-500',
  },
  high: {
    emoji: '🔴',
    label: 'HIGH',
    tagline: 'See a doctor within 24–48 hours',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    barColor: 'bg-red-500',
  },
  urgent: {
    emoji: '🚨',
    label: 'URGENT',
    tagline: 'Seek emergency care immediately — call 000 if severe',
    textColor: 'text-red-900',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    barColor: 'bg-red-600',
  },
}

export const CONFIDENCE_CONFIG: Record<ConfidenceLevel, {
  label: string
  color: string
  description: string
}> = {
  high:     { label: 'High',     color: 'text-emerald-600', description: 'Strong visual/descriptive alignment with primary finding' },
  moderate: { label: 'Moderate', color: 'text-amber-600',   description: 'Several indicators present, some ambiguity remains' },
  low:      { label: 'Low',      color: 'text-slate-500',   description: 'Limited information — multiple possibilities remain' },
}

export const SAMPLE_TYPE_CONFIG: Record<SampleType, { label: string; icon: string }> = {
  skin:          { label: 'Skin / Rash / Bite',    icon: '🩹' },
  stool:         { label: 'Stool Sample',           icon: '🔬' },
  blood:         { label: 'Blood Smear / Results',  icon: '🩸' },
  microscopy:    { label: 'Microscopy Slide',       icon: '🧫' },
  environmental: { label: 'Environmental Sample',   icon: '🌿' },
  unknown:       { label: 'Unknown / Other',        icon: '❓' },
}

// ─── Analyzer page states ─────────────────────────────────────────────────

export type AnalyzerStage = 'input' | 'processing' | 'results' | 'error'
