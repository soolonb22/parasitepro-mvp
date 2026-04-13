'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, ChevronRight, Bookmark } from 'lucide-react'
import { type AnalysisReport, URGENCY_CONFIG, SAMPLE_TYPE_CONFIG } from '@/types/analyzer'
import { cn } from '@/lib/utils'

interface ReportHistoryProps {
  onLoad: (report: AnalysisReport) => void
  refreshTrigger?: number
}

export function ReportHistory({ onLoad, refreshTrigger }: ReportHistoryProps) {
  const [reports, setReports] = useState<Partial<AnalysisReport>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <div className="text-3xl mb-2">🔬</div>
        <p className="text-sm">No reports yet — run your first analysis above</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => {
        if (!report.id) return null
        const urgency = report.urgencyLevel ? URGENCY_CONFIG[report.urgencyLevel] : null
        const sample = report.sampleType ? SAMPLE_TYPE_CONFIG[report.sampleType] : null

        return (
          <button
            key={report.id}
            onClick={() => onLoad(report as AnalysisReport)}
            className="w-full text-left flex items-start gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all group"
          >
            <span className="text-xl shrink-0 mt-0.5">{sample?.icon ?? '🔬'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {report.primaryFinding?.commonName ?? 'Unknown finding'}
                </p>
                {report.saved && (
                  <Bookmark className="w-3 h-3 text-teal-500 fill-teal-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 truncate mb-1.5">{report.inputSummary}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {urgency && (
                  <Badge className={cn('text-[10px] border', urgency.bgColor, urgency.textColor, urgency.borderColor)}>
                    {urgency.emoji} {urgency.label}
                  </Badge>
                )}
                {report.createdAt && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(report.createdAt))}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 shrink-0 mt-1 transition-colors" />
          </button>
        )
      })}
    </div>
  )
}
