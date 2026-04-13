'use client'

/**
 * /analyzer — ParasitePro AI Text & File Analyser
 *
 * Page stages:
 *   input       → User fills in UploadZone (text description or file)
 *   processing  → AnalysisProgress shows while /api/analyze is running (~60s)
 *   results     → ReportDisplay renders the full structured educational report
 *   error       → Error state with retry option
 *
 * API endpoint:
 *   POST /api/analyze
 *   Body: { sampleType, textInput, fileContent? }
 *   Returns: { report: AnalysisReport }
 *
 * Credit flow:
 *   Credits are checked and decremented server-side in /api/analyze.
 *   The client shows a credit counter sourced from /api/auth/session (TODO).
 *   Promo code BETA3FREE grants 3 free credits on first signup.
 *
 * Database:
 *   Completed reports are persisted to PostgreSQL via Railway.
 *   Table: reports (see /api/analyze/route.ts for schema).
 *   Reports are retrievable from /api/reports and displayed in ReportHistory.
 */

import { useState, useCallback, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UploadZone } from '@/components/analyzer/UploadZone'
import { AnalysisProgress } from '@/components/analyzer/AnalysisProgress'
import { ReportDisplay } from '@/components/analyzer/ReportDisplay'
import { ReportHistory } from '@/components/analyzer/ReportHistory'
import {
  AlertTriangle,
  Shield,
  RefreshCw,
  History,
  ChevronDown,
  Microscope,
  Zap,
  FileText,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import {
  type AnalyzerStage,
  type AnalysisReport,
  type AnalysisSubmission,
} from '@/types/analyzer'
import { cn } from '@/lib/utils'

// ─── Demo credits (replace with real auth session) ───────────────────────────
const DEMO_CREDITS = 3

export default function AnalyzerPage() {
  const [stage, setStage]           = useState<AnalyzerStage>('input')
  const [report, setReport]         = useState<AnalysisReport | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [credits, setCredits]       = useState(DEMO_CREDITS)
  const [isProcessing, setIsProcessing] = useState(false)
  const [historyOpen, setHistoryOpen]   = useState(false)
  const [historyRefresh, setHistoryRefresh] = useState(0)

  // ── Submit analysis ───────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (submission: AnalysisSubmission) => {
    setStage('processing')
    setError(null)
    setIsProcessing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleType:  submission.sampleType,
          textInput:   submission.textInput,
          fileContent: submission.fileContent,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle no-credits 402
        if (res.status === 402) {
          setError('no_credits')
          setStage('error')
          return
        }
        throw new Error(data.error ?? `Server error ${res.status}`)
      }

      setReport(data.report)
      setCredits((c) => Math.max(0, c - 1))
      // Small delay so the progress bar can reach 100%
      await new Promise((r) => setTimeout(r, 600))
      setStage('results')
    } catch (err) {
      console.error('Analysis failed:', err)
      setError((err as Error).message ?? 'Analysis failed. Please try again.')
      setStage('error')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // ── Save report ───────────────────────────────────────────────────────────
  const handleSaveReport = useCallback(async (reportId: string, saved: boolean) => {
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, saved }),
    })
    setHistoryRefresh((n) => n + 1)
  }, [])

  // ── Reset to input ────────────────────────────────────────────────────────
  const handleNewAnalysis = useCallback(() => {
    setStage('input')
    setReport(null)
    setError(null)
  }, [])

  // ── Load from history ─────────────────────────────────────────────────────
  const handleLoadFromHistory = useCallback((r: AnalysisReport) => {
    setReport(r)
    setStage('results')
    setHistoryOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top disclaimer bar ────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 sticky top-16 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 leading-snug">
            <strong className="font-semibold">Educational tool only — does not diagnose.</strong>
            {' '}All reports are for general information to help prepare for a GP visit. Not a medical device under the TGA SaMD framework. Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page header ───────────────────────────────────────────────── */}
        {stage !== 'results' && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
                <Microscope className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    AI Analyser
                  </h1>
                  <Badge className="bg-teal-100 text-teal-800 border-teal-300 text-[10px]">
                    Beta
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">
                  Describe symptoms or upload a file — get a structured educational assessment in ~60 seconds
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Zap,         label: '~60 seconds' },
                { icon: Shield,      label: 'TGA compliant' },
                { icon: FileText,    label: 'Structured report' },
                { icon: MessageCircle, label: 'GP prep notes' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
                  <Icon className="w-3.5 h-3.5 text-teal-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Stage: INPUT ──────────────────────────────────────────────── */}
        {stage === 'input' && (
          <UploadZone
            onSubmit={handleSubmit}
            credits={credits}
            isLoading={isProcessing}
          />
        )}

        {/* ── Stage: PROCESSING ─────────────────────────────────────────── */}
        {stage === 'processing' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-8">
            <AnalysisProgress isComplete={!isProcessing && report !== null} />
          </div>
        )}

        {/* ── Stage: RESULTS ────────────────────────────────────────────── */}
        {stage === 'results' && report && (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Educational Report
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewAnalysis}
                className="text-slate-500 hover:text-teal-700 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                New analysis
              </Button>
            </div>
            <ReportDisplay
              report={report}
              onNewAnalysis={handleNewAnalysis}
              onSave={handleSaveReport}
            />
          </>
        )}

        {/* ── Stage: ERROR ──────────────────────────────────────────────── */}
        {stage === 'error' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-10 text-center max-w-lg mx-auto">
            {error === 'no_credits' ? (
              <>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                  No credits remaining
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  You've used all your analysis credits. Purchase more to continue,
                  or use the free PARA chatbot for symptom guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold">
                    Buy more credits
                  </Button>
                  <Link href="/chat">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Use free chatbot
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                  Analysis failed
                </h3>
                <p className="text-sm text-slate-500 mb-2 leading-relaxed">
                  {error}
                </p>
                <p className="text-xs text-slate-400 mb-6">
                  Your credit has not been deducted. Please try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleNewAnalysis}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try again
                  </Button>
                  <Link href="/chat">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Use free chatbot instead
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Report history accordion ──────────────────────────────────── */}
        {(stage === 'input' || stage === 'error') && (
          <div className="mt-10">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="flex items-center justify-between w-full text-left px-1 mb-3 group"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition-colors">
                  Previous Reports
                </span>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-slate-400 transition-transform',
                historyOpen && 'rotate-180'
              )} />
            </button>
            {historyOpen && (
              <ReportHistory
                onLoad={handleLoadFromHistory}
                refreshTrigger={historyRefresh}
              />
            )}
          </div>
        )}

        {/* ── Cross-sell to chatbot ─────────────────────────────────────── */}
        {stage === 'input' && credits > 0 && (
          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-teal-800 mb-0.5">
                Want to explore first?
              </p>
              <p className="text-xs text-teal-700 leading-relaxed mb-2">
                The PARA chatbot is free — no credits required. Ask about symptoms, parasites, or when to see a GP.
              </p>
              <Link href="/chat">
                <button className="text-xs font-semibold text-teal-600 hover:text-teal-800 underline underline-offset-2 transition-colors">
                  Try the free chatbot →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
