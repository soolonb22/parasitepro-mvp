'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Pill, CheckCircle2, Circle, Flame,
  Trash2, Clock, ChevronDown, ChevronUp,
  AlertTriangle, BarChart2, X, Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface ProtocolItem {
  id: string
  name: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime'
  notes: string
}

interface Protocol {
  id: string
  name: string
  description: string
  startDate: string
  durationDays: number
  items: ProtocolItem[]
  completedDays: string[]   // ISO date strings of fully-completed days
  active: boolean
  createdAt: string
}

interface DayLog {
  date: string
  completedItems: string[]  // item IDs
}

/* ─── Helpers ─────────────────────────────────────────────────────────────────── */

const STORAGE_KEY_PROTOCOLS = 'parasitepro_protocols'
const STORAGE_KEY_LOGS      = 'parasitepro_treatment_logs'

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback }
}
function save(key: string, data: unknown) { localStorage.setItem(key, JSON.stringify(data)) }

const todayStr = () => new Date().toISOString().split('T')[0]

const TIME_LABELS: Record<ProtocolItem['timeOfDay'], string> = {
  morning: '🌅 Morning', afternoon: '☀️ Afternoon',
  evening: '🌙 Evening', anytime: '⏰ Anytime',
}

const TIME_ORDER: ProtocolItem['timeOfDay'][] = ['morning', 'afternoon', 'evening', 'anytime']

/* ─── Component ──────────────────────────────────────────────────────────────── */

export default function TreatmentTrackerPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [logs, setLogs]           = useState<DayLog[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Form
  const [newName, setNewName]         = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [newDuration, setNewDuration] = useState(14)
  const [newItems, setNewItems]       = useState<Omit<ProtocolItem, 'id'>[]>([])
  const [itemName, setItemName]       = useState('')
  const [itemTime, setItemTime]       = useState<ProtocolItem['timeOfDay']>('morning')

  useEffect(() => {
    setProtocols(load(STORAGE_KEY_PROTOCOLS, []))
    setLogs(load(STORAGE_KEY_LOGS, []))
  }, [])

  const today = todayStr()
  const todayLog = logs.find((l) => l.date === today) ?? { date: today, completedItems: [] }

  const getStreakForProtocol = (protocol: Protocol): number => {
    let streak = 0
    const d = new Date()
    while (true) {
      const ds = d.toISOString().split('T')[0]
      const log = logs.find((l) => l.date === ds)
      const allDone = protocol.items.every((item) => log?.completedItems.includes(item.id))
      if (!allDone && ds !== today) break
      if (allDone) streak++
      d.setDate(d.getDate() - 1)
      if (streak > 365) break
    }
    return streak
  }

  const toggleItem = (protocolId: string, itemId: string) => {
    const prev = logs.find((l) => l.date === today) ?? { date: today, completedItems: [] }
    const next = prev.completedItems.includes(itemId)
      ? { ...prev, completedItems: prev.completedItems.filter((id) => id !== itemId) }
      : { ...prev, completedItems: [...prev.completedItems, itemId] }
    const updated = [...logs.filter((l) => l.date !== today), next]
    setLogs(updated)
    save(STORAGE_KEY_LOGS, updated)
  }

  const addItem = () => {
    if (!itemName.trim()) return
    setNewItems((prev) => [...prev, { name: itemName.trim(), timeOfDay: itemTime, notes: '' }])
    setItemName('')
  }

  const createProtocol = () => {
    if (!newName.trim() || newItems.length === 0) return
    const protocol: Protocol = {
      id: `prot-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim(),
      startDate: today,
      durationDays: newDuration,
      items: newItems.map((item, i) => ({ ...item, id: `item-${Date.now()}-${i}` })),
      completedDays: [],
      active: true,
      createdAt: new Date().toISOString(),
    }
    const updated = [protocol, ...protocols]
    setProtocols(updated)
    save(STORAGE_KEY_PROTOCOLS, updated)
    setShowCreate(false)
    setNewName(''); setNewDesc(''); setNewItems([])
    setExpandedId(protocol.id)
  }

  const deleteProtocol = (id: string) => {
    const updated = protocols.filter((p) => p.id !== id)
    setProtocols(updated)
    save(STORAGE_KEY_PROTOCOLS, updated)
    if (expandedId === id) setExpandedId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Pill className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Treatment Tracker</h1>
                <p className="text-sm text-slate-500">Track your daily protocols and build streaks</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
            >
              <Plus className="w-4 h-4 mr-1.5" />New
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              This tracker is for educational self-monitoring only. Always follow your GP's treatment instructions. Do not replace prescribed medication with supplements without medical advice.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Create protocol form */}
        {showCreate && (
          <div className="bg-white rounded-2xl border border-teal-200 overflow-hidden shadow-sm">
            <div className="bg-teal-600 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Create New Protocol</h2>
              <button onClick={() => setShowCreate(false)} className="text-teal-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Protocol name</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Post-treatment antiparasitic protocol"
                    className="border-slate-200 focus:border-teal-400" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Description (optional)</Label>
                  <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Notes from your GP, what this protocol is for…"
                    className="resize-none border-slate-200 focus:border-teal-400 min-h-[60px] text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Duration (days)</Label>
                  <Input type="number" min={1} max={365} value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="border-slate-200 focus:border-teal-400" />
                </div>
              </div>

              {/* Add items */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Daily tasks</Label>
                {newItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <span className="text-xs text-slate-500">{TIME_LABELS[item.timeOfDay]}</span>
                    <span className="text-sm text-slate-700 flex-1">{item.name}</span>
                    <button onClick={() => setNewItems((prev) => prev.filter((_, j) => j !== i))}
                      className="text-slate-400 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select value={itemTime} onChange={(e) => setItemTime(e.target.value as ProtocolItem['timeOfDay'])}
                    className="text-sm border border-slate-200 rounded-xl px-2 py-2 focus:outline-none focus:border-teal-400 bg-white">
                    {TIME_ORDER.map((t) => <option key={t} value={t}>{TIME_LABELS[t]}</option>)}
                  </select>
                  <Input value={itemName} onChange={(e) => setItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Task name (e.g. Take medication, Drink 2L water)"
                    className="border-slate-200 focus:border-teal-400 text-sm flex-1" />
                  <Button variant="outline" size="sm" onClick={addItem} className="shrink-0">Add</Button>
                </div>
              </div>

              <Button
                onClick={createProtocol}
                disabled={!newName.trim() || newItems.length === 0}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
              >
                Create Protocol
              </Button>
            </div>
          </div>
        )}

        {/* Protocol list */}
        {protocols.length === 0 && !showCreate ? (
          <div className="text-center py-14">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium mb-1">No protocols yet</p>
            <p className="text-sm text-slate-400 mb-4">Create a protocol to track your daily treatment tasks.</p>
            <Button onClick={() => setShowCreate(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Create First Protocol
            </Button>
          </div>
        ) : (
          protocols.map((protocol) => {
            const isExpanded = expandedId === protocol.id
            const streak = getStreakForProtocol(protocol)
            const todayCompleted = protocol.items.filter((i) => todayLog.completedItems.includes(i.id)).length
            const todayPct = protocol.items.length > 0 ? Math.round((todayCompleted / protocol.items.length) * 100) : 0
            const daysElapsed = Math.floor((Date.now() - new Date(protocol.startDate).getTime()) / (1000 * 60 * 60 * 24))
            const daysLeft = protocol.durationDays - daysElapsed

            return (
              <div key={protocol.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Protocol header */}
                <button
                  className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : protocol.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{protocol.name}</p>
                      {streak >= 3 && (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] flex items-center gap-1">
                          <Flame className="w-3 h-3" />{streak}d streak
                        </Badge>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', todayPct === 100 ? 'bg-teal-500' : 'bg-amber-400')}
                          style={{ width: `${todayPct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500">{todayCompleted}/{protocol.items.length} today</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Day {Math.max(1, daysElapsed + 1)} of {protocol.durationDays} · {Math.max(0, daysLeft)} days left
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 mt-1 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 mt-1 shrink-0" />}
                </button>

                {/* Expanded: today's tasks */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Today — {new Intl.DateTimeFormat('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
                    </p>

                    {TIME_ORDER.map((timeOfDay) => {
                      const timeItems = protocol.items.filter((i) => i.timeOfDay === timeOfDay)
                      if (timeItems.length === 0) return null
                      return (
                        <div key={timeOfDay}>
                          <p className="text-xs font-medium text-slate-400 mb-2">{TIME_LABELS[timeOfDay]}</p>
                          <div className="space-y-2">
                            {timeItems.map((item) => {
                              const done = todayLog.completedItems.includes(item.id)
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggleItem(protocol.id, item.id)}
                                  className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                                    done
                                      ? 'bg-teal-50 border-teal-300'
                                      : 'bg-white border-slate-200 hover:border-teal-200'
                                  )}
                                >
                                  {done
                                    ? <CheckCircle2 className="w-4.5 h-4.5 text-teal-500 shrink-0" />
                                    : <Circle className="w-4.5 h-4.5 text-slate-300 shrink-0" />}
                                  <span className={cn('text-sm font-medium', done ? 'text-teal-700 line-through' : 'text-slate-700')}>
                                    {item.name}
                                  </span>
                                  {done && <span className="ml-auto text-[10px] text-teal-500">✓ Done</span>}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}

                    {/* All done celebration */}
                    {todayPct === 100 && (
                      <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-center">
                        <p className="text-teal-800 font-semibold text-sm">🎉 All tasks complete for today!</p>
                        {streak >= 1 && <p className="text-teal-600 text-xs mt-0.5">{streak}-day streak — keep going!</p>}
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        {streak} day streak
                      </div>
                      <button
                        onClick={() => deleteProtocol(protocol.id)}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                      >
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
          ⚠️ Not a substitute for GP-prescribed treatment. Always follow qualified medical advice.
        </p>
      </div>
    </div>
  )
}
