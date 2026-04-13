'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  MessageCircle,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  FlaskConical,
  MessageSquare,
  MapPin,
  Shield,
  Clock,
  FileText,
  Copy,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import {
  type AnalysisReport,
  URGENCY_CONFIG,
  CONFIDENCE_CONFIG,
  SAMPLE_TYPE_CONFIG,
} from '@/types/analyzer'
import { cn } from '@/lib/utils'

interface ReportDisplayProps {
  report: AnalysisReport
  onNewAnalysis: () => void
  onSave: (reportId: string, saved: boolean) => Promise<void>
}

// ─── Collapsible section wrapper ─────────────────────────────────────────────
function ReportSection({
  icon: Icon,
  title,
  badge,
  children,
  defaultOpen = true,
  accent = false,
}: {
  icon: React.ElementType
  title: string
  badge?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  accent?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden',
      accent ? 'border-teal-200 bg-teal-50/30' : 'border-slate-200 bg-white'
    )}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center justify-between px-5 py-4 text-left transition-colors',
          accent ? 'hover:bg-teal-50' : 'hover:bg-slate-50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            accent ? 'bg-teal-100' : 'bg-slate-100'
          )}>
            <Icon className={cn('w-4 h-4', accent ? 'text-teal-600' : 'text-slate-600')} />
          </div>
          <span className={cn('font-semibold text-sm', accent ? 'text-teal-800' : 'text-slate-800')}>
            {title}
          </span>
          {badge}
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-slate-100 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ReportDisplay({ report, onNewAnalysis, onSave }: ReportDisplayProps) {
  const [saved, setSaved] = useState(report.saved)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const urgency = URGENCY_CONFIG[report.urgencyLevel]
  const confidence = CONFIDENCE_CONFIG[report.confidence]
  const sampleCfg = SAMPLE_TYPE_CONFIG[report.sampleType]

  const reportDate = new Intl.DateTimeFormat('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(report.createdAt))

  const handleSave = async () => {
    setSaving(true)
    const newSaved = !saved
    try {
      await onSave(report.id, newSaved)
      setSaved(newSaved)
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = async () => {
    const text = buildPlainTextReport(report)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* ── Top disclaimer ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3.5">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold">Educational assessment only — does not diagnose.</strong>
          {' '}This report is for general information to help you prepare for a GP visit.
          It is not a medical opinion, clinical diagnosis, or treatment plan.
          Always consult a qualified Australian healthcare professional.
          {report.urgencyLevel === 'urgent' && (
            <strong className="block mt-1 text-red-800"> ⚠️ This assessment suggests urgent review — please seek medical attention today.</strong>
          )}
        </p>
      </div>

      {/* ── Report header card ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-slate-900 to-teal-900 px-5 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-white/15 text-white border-white/20 text-[10px]">
                  {sampleCfg.icon} {sampleCfg.label}
                </Badge>
                <Badge className="bg-white/15 text-white border-white/20 text-[10px]">
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  TGA-Compliant Educational Report
                </Badge>
              </div>
              <h2 className="font-display text-xl font-bold leading-tight">
                {report.primaryFinding.commonName}
              </h2>
              {report.primaryFinding.scientificName && (
                <p className="text-teal-300 text-xs italic mt-0.5">
                  {report.primaryFinding.scientificName}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Report ID</p>
              <p className="text-xs text-white font-mono">{report.id.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {reportDate}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FileText className="w-3.5 h-3.5" />
            Quality: {report.imageQuality}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FlaskConical className="w-3.5 h-3.5" />
            {report.creditsUsed} credit used
          </div>
        </div>
      </div>

      {/* ── Urgency level ───────────────────────────────────────────────── */}
      <div className={cn(
        'rounded-2xl border-2 px-5 py-5',
        urgency.bgColor, urgency.borderColor
      )}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{urgency.emoji}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Urgency Classification
              </p>
              <p className={cn('text-xl font-display font-bold', urgency.textColor)}>
                {urgency.label}
              </p>
            </div>
          </div>
          {/* Visual urgency bar */}
          <div className="flex items-center gap-1">
            {(['low', 'moderate', 'high', 'urgent'] as const).map((tier) => (
              <div
                key={tier}
                className={cn(
                  'w-6 h-2 rounded-full transition-all',
                  tier === report.urgencyLevel
                    ? URGENCY_CONFIG[tier].barColor + ' w-10'
                    : 'bg-slate-200'
                )}
              />
            ))}
          </div>
        </div>
        <p className={cn('text-sm font-medium', urgency.textColor)}>
          {urgency.tagline}
        </p>
        {report.urgencyRationale && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {report.urgencyRationale}
          </p>
        )}
      </div>

      {/* ── Primary finding ─────────────────────────────────────────────── */}
      <ReportSection
        icon={FlaskConical}
        title="Primary Finding"
        accent
        badge={
          <span className={cn('ml-2 text-xs font-medium', confidence.color)}>
            {confidence.label} confidence
          </span>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {report.primaryFinding.description}
        </p>

        {report.visualEvidence.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Supporting evidence
            </p>
            <ul className="space-y-2">
              {report.visualEvidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  {ev}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className={cn(
          'mt-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs',
          confidence.color === 'text-emerald-600'
            ? 'bg-emerald-50 border-emerald-200'
            : confidence.color === 'text-amber-600'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-slate-50 border-slate-200'
        )}>
          <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="text-slate-600">{confidence.description}</span>
        </div>
      </ReportSection>

      {/* ── Differential diagnoses ──────────────────────────────────────── */}
      {report.differentialDiagnoses.length > 0 && (
        <ReportSection icon={FileText} title="Differential Findings" defaultOpen={true}>
          <p className="text-xs text-slate-500 mb-3">
            Other possibilities considered, in descending order of likelihood:
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Condition</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Likelihood</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Key Differentiator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.differentialDiagnoses.map((dx, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 text-sm">{dx.condition}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                        dx.likelihood === 'High'   ? 'bg-amber-100 text-amber-700' :
                        dx.likelihood === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      )}>
                        {dx.likelihood}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 leading-relaxed">{dx.keyDifferentiator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>
      )}

      {/* ── Recommended action ──────────────────────────────────────────── */}
      <ReportSection icon={Stethoscope} title="Recommended Next Steps" accent defaultOpen={true}>
        <p className="text-sm text-slate-700 leading-relaxed">
          {report.recommendedAction}
        </p>
      </ReportSection>

      {/* ── GP prep notes ───────────────────────────────────────────────── */}
      <ReportSection icon={MessageSquare} title="For Your GP Visit" defaultOpen={true}>
        <div className="space-y-5">
          {report.gpPrepNotes.whatToTell.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-teal-500" />
                What to tell your GP
              </p>
              <ul className="space-y-1.5">
                {report.gpPrepNotes.whatToTell.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.gpPrepNotes.questionsToAsk.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                Questions to ask
              </p>
              <ul className="space-y-1.5">
                {report.gpPrepNotes.questionsToAsk.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.gpPrepNotes.testsToRequest.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                Tests to ask about
              </p>
              <ul className="space-y-1.5">
                {report.gpPrepNotes.testsToRequest.map((test, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    {test}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ReportSection>

      {/* ── Geographic relevance ────────────────────────────────────────── */}
      {report.geographicRelevance && (
        <ReportSection icon={MapPin} title="Geographic Context" defaultOpen={false}>
          <p className="text-sm text-slate-700 leading-relaxed">{report.geographicRelevance}</p>
        </ReportSection>
      )}

      {/* ── Action buttons ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="outline"
          className={cn(
            'border-2 h-11 font-semibold text-sm transition-all',
            saved
              ? 'border-teal-400 bg-teal-50 text-teal-700 hover:bg-teal-100'
              : 'border-slate-300 text-slate-700 hover:border-teal-400 hover:bg-teal-50'
          )}
        >
          {saved ? (
            <><BookmarkCheck className="w-4 h-4 mr-2" />Saved to history</>
          ) : (
            <><Bookmark className="w-4 h-4 mr-2" />Save this report</>
          )}
        </Button>

        <Button
          onClick={handleCopy}
          variant="outline"
          className="border-2 border-slate-300 h-11 font-semibold text-sm text-slate-700 hover:border-slate-400"
        >
          {copied ? (
            <><Check className="w-4 h-4 mr-2 text-teal-600" /><span className="text-teal-700">Copied!</span></>
          ) : (
            <><Copy className="w-4 h-4 mr-2" />Copy report</>
          )}
        </Button>

        <Button
          onClick={onNewAnalysis}
          className="col-span-2 bg-teal-600 hover:bg-teal-700 text-white h-11 font-semibold text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Run Another Analysis
        </Button>

        <Link href="/chat" className="col-span-2">
          <Button
            variant="ghost"
            className="w-full h-10 text-slate-500 hover:text-teal-700 hover:bg-teal-50 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Discuss this with PARA
          </Button>
        </Link>
      </div>

      {/* ── Bottom disclaimer ───────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-5 text-center">
        <Shield className="w-5 h-5 text-slate-400 mx-auto mb-2" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-300">⚠️ Educational Assessment Only — Does Not Diagnose.</strong>
          {' '}This report is generated by AI for educational purposes only. It does not constitute medical advice,
          a clinical diagnosis, or a treatment recommendation. ParasitePro is not a registered medical device
          under the TGA Software as a Medical Device (SaMD) framework. All content is framed as "consistent with"
          or "visual pattern suggests" — not as diagnostic conclusions.
          <br /><br />
          Always consult a qualified Australian GP, specialist, or healthcare professional for medical advice.
          If you are experiencing a medical emergency, call <strong className="text-white">000</strong> immediately.
          <br /><br />
          <Link href="/terms" className="text-teal-400 hover:text-teal-300 underline">Terms of Service</Link>
          {' · '}
          <Link href="/privacy" className="text-teal-400 hover:text-teal-300 underline">Privacy Policy</Link>
          {' · '}
          <span>AHPRA advertising guidelines observed.</span>
        </p>
      </div>
    </div>
  )
}

// ─── Plain text report builder (for copy) ────────────────────────────────────
function buildPlainTextReport(report: AnalysisReport): string {
  const date = new Intl.DateTimeFormat('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(report.createdAt))

  const lines = [
    'PARASITEPRO — EDUCATIONAL ASSESSMENT REPORT',
    '==============================================',
    `Report ID: ${report.id.toUpperCase()}`,
    `Date: ${date}`,
    `Sample Type: ${SAMPLE_TYPE_CONFIG[report.sampleType].label}`,
    '',
    '⚠️ EDUCATIONAL TOOL ONLY — NOT A MEDICAL DIAGNOSIS',
    '',
    '1. PRIMARY FINDING',
    `   ${report.primaryFinding.commonName}${report.primaryFinding.scientificName ? ` (${report.primaryFinding.scientificName})` : ''}`,
    `   ${report.primaryFinding.description}`,
    '',
    '2. URGENCY LEVEL',
    `   ${URGENCY_CONFIG[report.urgencyLevel].emoji} ${URGENCY_CONFIG[report.urgencyLevel].label}`,
    `   ${URGENCY_CONFIG[report.urgencyLevel].tagline}`,
    '',
    '3. SUPPORTING EVIDENCE',
    ...report.visualEvidence.map((e) => `   • ${e}`),
    '',
    '4. RECOMMENDED ACTION',
    `   ${report.recommendedAction}`,
    '',
    '5. FOR YOUR GP VISIT',
    '   What to tell your GP:',
    ...report.gpPrepNotes.whatToTell.map((p, i) => `   ${i + 1}. ${p}`),
    '   Questions to ask:',
    ...report.gpPrepNotes.questionsToAsk.map((q) => `   → ${q}`),
    '   Tests to request:',
    ...report.gpPrepNotes.testsToRequest.map((t) => `   ✓ ${t}`),
    '',
    '6. GEOGRAPHIC CONTEXT',
    `   ${report.geographicRelevance}`,
    '',
    '─────────────────────────────────────────────',
    'This report is for educational purposes only.',
    'Always consult a qualified Australian healthcare professional.',
    'In an emergency, call 000.',
    'notworms.com · support@notworms.com',
  ]

  return lines.join('\n')
}
