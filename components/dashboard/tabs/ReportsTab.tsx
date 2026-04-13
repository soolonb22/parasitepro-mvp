'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search, Microscope, Bookmark, BookmarkCheck,
  Trash2, ChevronRight, Plus, Filter, Clock, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { URGENCY_CONFIG, SAMPLE_TYPE_CONFIG } from '@/types/analyzer'
import type { AnalysisReport, UrgencyTier } from '@/types/analyzer'

type UrgencyFilter = 'all' | UrgencyTier | 'saved'

export function ReportsTab() {
  const [reports, setReports] = useState<Partial<AnalysisReport>[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<UrgencyFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleToggleSave = useCallback(async (reportId: string, currentSaved: boolean) => {
    const newSaved = !currentSaved
    setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, saved: newSaved } : r))
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, saved: newSaved }),
    })
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this report? This cannot be undone.')) return
    setDeletingId(id)
    // TODO: DELETE /api/reports/[id]
    setReports((prev) => prev.filter((r) => r.id !== id))
    setDeletingId(null)
  }, [])

  const filtered = reports.filter((r) => {
    const matchSearch = !search.trim() ||
      (r.primaryFinding?.commonName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (r.inputSummary ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ? true
      : filter === 'saved' ? r.saved
      : r.urgencyLevel === filter
    return matchSearch && matchFilter
  })

  const FILTER_OPTIONS: { value: UrgencyFilter; label: string; color?: string }[] = [
    { value: 'all',      label: 'All' },
    { value: 'saved',    label: 'Saved' },
    { value: 'urgent',   label: '🚨 Urgent',   color: 'bg-red-50 text-red-700 border-red-200' },
    { value: 'high',     label: '🔴 High',     color: 'bg-red-50 text-red-600 border-red-200' },
    { value: 'moderate', label: '🟡 Moderate', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'low',      label: '🟢 Low',      color: 'bg-green-50 text-green-700 border-green-200' },
  ]

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="pl-9 border-slate-200 focus:border-teal-400 bg-white"
          />
        </div>
        <Link href="/analyzer">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />New Analysis
          </Button>
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-all',
              filter === value
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-14 text-center">
          <Microscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium mb-1">
            {search ? 'No reports match your search' : 'No reports yet'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            {search ? 'Try different keywords' : 'Run your first AI educational analysis'}
          </p>
          <Link href="/analyzer">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-3.5 h-3.5 mr-1.5" />Run Analysis
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 pl-1">
            {filtered.length} report{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((report) => {
            if (!report.id) return null
            const urgency = report.urgencyLevel ? URGENCY_CONFIG[report.urgencyLevel] : null
            const sample = report.sampleType ? SAMPLE_TYPE_CONFIG[report.sampleType] : null
            const isExpanded = expanded === report.id

            return (
              <div
                key={report.id}
                className={cn(
                  'bg-white rounded-2xl border overflow-hidden transition-all group',
                  urgency ? urgency.borderColor : 'border-slate-200',
                  'hover:shadow-sm',
                  deletingId === report.id && 'opacity-50 pointer-events-none'
                )}
              >
                {/* Urgency ribbon */}
                {urgency && (
                  <div className={cn('h-1', urgency.barColor)} />
                )}

                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    {/* Sample icon */}
                    <span className="text-xl shrink-0 mt-0.5">{sample?.icon ?? '🔬'}</span>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 flex-1 truncate">
                          {report.primaryFinding?.commonName ?? 'Analysis result'}
                        </p>
                        {report.saved && (
                          <Bookmark className="w-3.5 h-3.5 text-teal-500 fill-teal-500 shrink-0 mt-0.5" />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                        {report.inputSummary}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {urgency && (
                          <span className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            urgency.bgColor, urgency.textColor, urgency.borderColor
                          )}>
                            {urgency.emoji} {urgency.label}
                          </span>
                        )}
                        {sample && (
                          <Badge className="text-[10px] bg-slate-100 text-slate-600 border-0">
                            {sample.label}
                          </Badge>
                        )}
                        {report.createdAt && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(report.createdAt)}
                          </span>
                        )}
                        {report.confidence && (
                          <span className="text-[10px] text-slate-400 capitalize">
                            {report.confidence} confidence
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleSave(report.id!, !!report.saved)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                        title={report.saved ? 'Unsave' : 'Save'}
                      >
                        {report.saved
                          ? <BookmarkCheck className="w-4 h-4 text-teal-500 fill-teal-500" />
                          : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(report.id!)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : report.id!)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                        title="Expand"
                      >
                        <ChevronRight className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded GP prep notes */}
                  {isExpanded && report.gpPrepNotes && (
                    <div className={cn(
                      'mt-4 pt-4 border-t space-y-3',
                      urgency ? urgency.borderColor : 'border-slate-100'
                    )}>
                      {report.gpPrepNotes.whatToTell?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            What to tell your GP
                          </p>
                          <ul className="space-y-1">
                            {report.gpPrepNotes.whatToTell.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {report.gpPrepNotes.testsToRequest?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            Tests to request
                          </p>
                          <ul className="space-y-1">
                            {report.gpPrepNotes.testsToRequest.map((test, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <FileText className="w-3 h-3 text-purple-500 mt-0.5 shrink-0" />{test}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Link href="/analyzer">
                        <Button size="sm" variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50 text-xs mt-1">
                          Open in Analyser →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
