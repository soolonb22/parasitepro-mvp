'use client'

import { useEffect, useState, useRef } from 'react'
import { CheckCircle2, Loader2, Clock } from 'lucide-react'
import { PIPELINE_STEPS } from '@/types/analyzer'
import { cn } from '@/lib/utils'

interface AnalysisProgressProps {
  isComplete?: boolean
}

type StepStatus = 'pending' | 'active' | 'done'

export function AnalysisProgress({ isComplete = false }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map((_, i) => (i === 0 ? 'active' : 'pending'))
  )
  const [progressPct, setProgressPct] = useState(2)
  const [elapsedSecs, setElapsedSecs] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Elapsed seconds counter
  useEffect(() => {
    const tick = setInterval(() => setElapsedSecs((s) => s + 1), 1000)
    return () => clearInterval(tick)
  }, [])

  // Advance through steps based on their declared durations
  useEffect(() => {
    let accumulated = 0

    PIPELINE_STEPS.forEach((step, index) => {
      // Don't schedule past last step
      if (index === PIPELINE_STEPS.length - 1) return

      accumulated += step.durationMs
      const t = setTimeout(() => {
        setCurrentStep(index + 1)
        setStepStatuses((prev) =>
          prev.map((s, i) => {
            if (i < index + 1) return 'done'
            if (i === index + 1) return 'active'
            return 'pending'
          })
        )
      }, accumulated)
      timersRef.current.push(t)
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  // Smooth progress bar — tracks step advancement + creeps toward 95% max
  useEffect(() => {
    if (isComplete) {
      setProgressPct(100)
      return
    }

    const totalDuration = PIPELINE_STEPS.reduce((s, p) => s + p.durationMs, 0)
    const stepProgress = (currentStep / PIPELINE_STEPS.length) * 90
    const target = Math.min(stepProgress + 5, 92)
    setProgressPct(target)

    // Creep within current step
    const creep = setInterval(() => {
      setProgressPct((p) => Math.min(p + 0.4, target))
    }, 150)
    return () => clearInterval(creep)
  }, [currentStep, isComplete])

  const totalEstimatedMs = PIPELINE_STEPS.reduce((s, p) => s + p.durationMs, 0)
  const totalEstimatedSec = Math.ceil(totalEstimatedMs / 1000)

  return (
    <div className="w-full max-w-lg mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-200">
            <span className="text-3xl">🔬</span>
          </div>
          {!isComplete && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
              <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />
            </div>
          )}
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-1">
          {isComplete ? 'Analysis complete!' : 'Analysing your submission…'}
        </h2>
        <p className="text-sm text-slate-500">
          {isComplete
            ? 'Your educational report is ready to review'
            : 'PARA is working through your submission — this takes about 60 seconds'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-600">
            {isComplete ? 'Complete' : `Step ${Math.min(currentStep + 1, PIPELINE_STEPS.length)} of ${PIPELINE_STEPS.length}`}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {isComplete ? `Completed in ${elapsedSecs}s` : `${elapsedSecs}s / ~${totalEstimatedSec}s`}
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              isComplete ? 'bg-teal-500' : 'bg-gradient-to-r from-teal-500 to-teal-600'
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-right text-[10px] text-slate-400 mt-1">{Math.round(progressPct)}%</p>
      </div>

      {/* Step list */}
      <div className="space-y-2">
        {PIPELINE_STEPS.map((step, index) => {
          const status = isComplete ? 'done' : stepStatuses[index]

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-300',
                status === 'active' && 'bg-teal-50 border-teal-300 shadow-sm shadow-teal-100',
                status === 'done'   && 'bg-white border-slate-200 opacity-70',
                status === 'pending' && 'bg-slate-50 border-slate-200 opacity-40'
              )}
            >
              {/* Status icon */}
              <div className="shrink-0 mt-0.5">
                {status === 'done' && (
                  <CheckCircle2 className="w-4.5 h-4.5 text-teal-500" />
                )}
                {status === 'active' && (
                  <Loader2 className="w-4.5 h-4.5 text-teal-600 animate-spin" />
                )}
                {status === 'pending' && (
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300" />
                )}
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium leading-tight',
                  status === 'active'  ? 'text-teal-800' :
                  status === 'done'    ? 'text-slate-600' : 'text-slate-400'
                )}>
                  {step.label}
                </p>
                <p className={cn(
                  'text-xs mt-0.5 leading-relaxed',
                  status === 'active'  ? 'text-teal-600' :
                  status === 'done'    ? 'text-slate-400' : 'text-slate-300'
                )}>
                  {step.sublabel}
                </p>
              </div>

              {/* Step number badge */}
              {status === 'pending' && (
                <span className="text-[10px] text-slate-400 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Compliance note */}
      <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
        PARA is cross-referencing the Australian parasite knowledge base and applying TGA-compliant educational language.
      </p>
    </div>
  )
}
