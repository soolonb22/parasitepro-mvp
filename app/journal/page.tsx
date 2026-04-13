'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Plus, BookOpen, ChevronDown, ChevronUp, Trash2,
  Calendar, Activity, AlertCircle, TrendingUp,
  Loader2, CheckCircle2, Clock,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────────────────────── */

const SYMPTOM_OPTIONS = [
  'Abdominal cramps', 'Bloating', 'Diarrhoea', 'Constipation',
  'Nausea', 'Vomiting', 'Itching (perianal)', 'Skin rash',
  'Fatigue', 'Weight loss', 'Fever', 'Night sweats',
  'Muscle aches', 'Loss of appetite', 'Blood in stool',
]

const MOOD_OPTIONS = ['Great', 'Good', 'Okay', 'Poor', 'Very poor']
const SEVERITY_LABELS: Record<number, string> = {
  1: 'Very mild', 2: 'Mild', 3: 'Noticeable', 4: 'Moderate',
  5: 'Significant', 6: 'Uncomfortable', 7: 'Concerning',
  8: 'Severe', 9: 'Very severe', 10: 'Debilitating',
}

interface JournalEntry {
  id: string
  date: string
  symptoms: string[]
  severity: number
  mood: string
  notes: string
  energyLevel: number
  createdAt: string
}

/* ─── Helpers ─────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'parasitepro_journal'

function loadEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch { return [] }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

/* ─── Component ──────────────────────────────────────────────────────────────── */

export default function JournalPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [severity, setSeverity] = useState(3)
  const [mood, setMood] = useState('Okay')
  const [notes, setNotes] = useState('')
  const [energyLevel, setEnergyLevel] = useState(5)

  useEffect(() => {
    setEntries(loadEntries())
  }, [])

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const handleAddCustomSymptom = () => {
    const trimmed = customSymptom.trim()
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms((prev) => [...prev, trimmed])
      setCustomSymptom('')
    }
  }

  const handleSave = async () => {
    if (symptoms.length === 0 && !notes.trim()) return
    setSaving(true)

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date,
      symptoms,
      severity,
      mood,
      notes: notes.trim(),
      energyLevel,
      createdAt: new Date().toISOString(),
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    saveEntries(updated)

    // TODO: POST /api/journal with auth token for cloud sync
    // if (session?.user?.id) {
    //   await fetch('/api/journal', { method: 'POST', body: JSON.stringify(newEntry) })
    // }

    setSaving(false)
    setSaved(true)
    setShowForm(false)
    // Reset
    setSymptoms([])
    setNotes('')
    setSeverity(3)
    setMood('Okay')
    setEnergyLevel(5)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    saveEntries(updated)
  }

  const avgSeverity = entries.length
    ? Math.round(entries.slice(0, 7).reduce((s, e) => s + e.severity, 0) / Math.min(entries.length, 7))
    : null

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso))

  const severityColor = (s: number) =>
    s <= 3 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
    s <= 6 ? 'text-amber-600 bg-amber-50 border-amber-200' :
    'text-red-600 bg-red-50 border-red-200'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Symptom Journal</h1>
              <p className="text-sm text-slate-500">Track symptoms over time to share with your GP</p>
            </div>
          </div>

          {!session && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-start gap-2 mt-4">
              <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-xs text-teal-800">
                Entries are saved to this device only.{' '}
                <Link href="/signup" className="font-semibold underline">Create an account</Link>{' '}
                to sync your journal across devices.
              </p>
            </div>
          )}

          {/* Stats row */}
          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="font-display text-2xl font-bold text-slate-800">{entries.length}</p>
                <p className="text-xs text-slate-500">Entries</p>
              </div>
              {avgSeverity !== null && (
                <div className={cn('rounded-xl p-3 text-center border', severityColor(avgSeverity))}>
                  <p className="font-display text-2xl font-bold">{avgSeverity}/10</p>
                  <p className="text-xs">Avg severity (7d)</p>
                </div>
              )}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="font-display text-2xl font-bold text-slate-800">
                  {[...new Set(entries.flatMap((e) => e.symptoms))].length}
                </p>
                <p className="text-xs text-slate-500">Unique symptoms</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Saved confirmation */}
        {saved && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-teal-800 text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Entry saved successfully.
          </div>
        )}

        {/* New entry button / form toggle */}
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold h-12"
          >
            <Plus className="w-4 h-4 mr-2" />Log Today's Symptoms
          </Button>
        ) : (
          <div className="bg-white rounded-2xl border border-teal-200 shadow-sm overflow-hidden">
            <div className="bg-teal-600 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">New Journal Entry</h2>
              <button onClick={() => setShowForm(false)} className="text-teal-200 hover:text-white">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="border-slate-200 focus:border-teal-400 max-w-xs" />
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Symptoms experienced today</Label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                        symptoms.includes(s)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                      )}
                    >{s}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                    placeholder="Add custom symptom…"
                    className="border-slate-200 focus:border-teal-400 text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddCustomSymptom} className="shrink-0">
                    Add
                  </Button>
                </div>
              </div>

              {/* Severity slider */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Overall severity: <span className={cn('font-semibold', severity >= 7 ? 'text-red-600' : severity >= 4 ? 'text-amber-600' : 'text-emerald-600')}>
                    {severity}/10 — {SEVERITY_LABELS[severity]}
                  </span>
                </Label>
                <input
                  type="range" min={1} max={10} value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 — Minimal</span><span>5 — Moderate</span><span>10 — Severe</span>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Energy level: {energyLevel}/10</Label>
                <input
                  type="range" min={1} max={10} value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Mood */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Overall mood</Label>
                <div className="flex gap-2 flex-wrap">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                        mood === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      )}
                    >{m}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Additional notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any other observations — recent meals, activities, medications, travel…"
                  className="resize-none border-slate-200 focus:border-teal-400 text-sm min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || (symptoms.length === 0 && !notes.trim())}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : 'Save Entry'}
              </Button>
            </div>
          </div>
        )}

        {/* Entry list */}
        {entries.length === 0 && !showForm ? (
          <div className="text-center py-14">
            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium mb-1">No entries yet</p>
            <p className="text-sm text-slate-400">Start tracking your symptoms to identify patterns over time.</p>
          </div>
        ) : (
          entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{formatDate(entry.date)}</p>
                      <Badge className={cn('text-[10px] border', severityColor(entry.severity))}>
                        Severity {entry.severity}/10
                      </Badge>
                    </div>
                    {entry.symptoms.length > 0 && (
                      <p className="text-xs text-slate-500 truncate">
                        {entry.symptoms.slice(0, 3).join(', ')}
                        {entry.symptoms.length > 3 && ` +${entry.symptoms.length - 3} more`}
                      </p>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3">
                    {entry.symptoms.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Symptoms</p>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.symptoms.map((s) => (
                            <Badge key={s} className="bg-teal-50 text-teal-700 border-teal-200 text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className={cn('font-bold text-lg', severityColor(entry.severity))}>{entry.severity}/10</p>
                        <p className="text-[10px] text-slate-400">Severity</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="font-bold text-lg text-blue-600">{entry.energyLevel}/10</p>
                        <p className="text-[10px] text-slate-400">Energy</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="font-bold text-sm text-slate-700 mt-1">{entry.mood}</p>
                        <p className="text-[10px] text-slate-400">Mood</p>
                      </div>
                    </div>
                    {entry.notes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{entry.notes}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(entry.createdAt))}
                      </span>
                      <button onClick={() => handleDelete(entry.id)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}

        <p className="text-xs text-center text-slate-400 leading-relaxed pt-2">
          ⚠️ This journal is for your personal reference only. Share entries with your GP to support your consultation. Not a medical record.
        </p>
      </div>
    </div>
  )
}
