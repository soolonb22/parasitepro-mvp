'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Upload,
  X,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Lightbulb,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type SampleType,
  type AnalysisSubmission,
  SAMPLE_TYPE_CONFIG,
} from '@/types/analyzer'

interface UploadZoneProps {
  onSubmit: (submission: AnalysisSubmission) => void
  credits: number
  isLoading?: boolean
}

const WRITING_TIPS = [
  'Include when symptoms started and how they have changed',
  'Describe colour, size, shape, and any movement if relevant',
  'Mention recent travel (domestic or overseas)',
  'Note if pets in the household show similar signs',
  'Include your location (state/territory) for geographic context',
  'Describe any recent outdoor activities (camping, gardening, etc.)',
]

const MIN_CHARS = 40
const MAX_CHARS = 2000

const ACCEPTED_TYPES = ['.pdf', '.txt', '.doc', '.docx']

export function UploadZone({ onSubmit, credits, isLoading }: UploadZoneProps) {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text')
  const [sampleType, setSampleType] = useState<SampleType>('unknown')
  const [textInput, setTextInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const charsLeft = MAX_CHARS - textInput.length
  const canSubmit = credits > 0 && !isLoading && (
    (inputMode === 'text' && textInput.trim().length >= MIN_CHARS) ||
    (inputMode === 'file' && !!file)
  )

  // ── File handling ────────────────────────────────────────────────────────
  const processFile = useCallback((f: File) => {
    setFileError('')
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED_TYPES.includes(ext)) {
      setFileError(`File type not supported. Please upload ${ACCEPTED_TYPES.join(', ')}`)
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setFileError('File is too large. Maximum size is 5MB.')
      return
    }

    setFile(f)

    // Read text files directly
    if (ext === '.txt') {
      const reader = new FileReader()
      reader.onload = (e) => setFileContent(e.target?.result as string ?? '')
      reader.readAsText(f)
    } else {
      // PDF/DOC: in production, send to /api/parse-file for text extraction
      // For now, signal to backend that file was uploaded
      setFileContent(`[File: ${f.name} — text extraction will be performed server-side]`)
    }
  }, [])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) processFile(dropped)
  }, [processFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      sampleType,
      textInput: textInput.trim(),
      fileName: file?.name,
      fileContent,
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">

      {/* ── Credit counter ──────────────────────────────────────────────── */}
      <div className={cn(
        'flex items-center justify-between px-4 py-3 rounded-xl border text-sm',
        credits > 0
          ? 'bg-teal-50 border-teal-200'
          : 'bg-red-50 border-red-200'
      )}>
        <div className="flex items-center gap-2">
          <span className="text-base">{credits > 0 ? '⚡' : '❌'}</span>
          <span className={cn('font-semibold', credits > 0 ? 'text-teal-800' : 'text-red-800')}>
            {credits > 0 ? `${credits} analysis credit${credits !== 1 ? 's' : ''} remaining` : 'No credits remaining'}
          </span>
        </div>
        {credits === 0 ? (
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-7">
            Buy credits
          </Button>
        ) : (
          <span className="text-xs text-teal-600">1 credit per analysis</span>
        )}
      </div>

      {/* ── Sample type picker ──────────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          What type of sample or concern is this?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(SAMPLE_TYPE_CONFIG) as [SampleType, { label: string; icon: string }][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSampleType(key)}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm transition-all',
                sampleType === key
                  ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
              )}
            >
              <span className="text-base leading-none">{cfg.icon}</span>
              <span className="text-xs font-medium leading-tight">{cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Input mode tabs ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Tab bar */}
        <div className="flex border-b border-slate-200">
          {([
            { mode: 'text', icon: FileText, label: 'Describe symptoms' },
            { mode: 'file', icon: Paperclip, label: 'Upload file' },
          ] as const).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all',
                inputMode === mode
                  ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-500'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-b-2 border-transparent'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Text mode ─────────────────────────────────────────────────── */}
        {inputMode === 'text' && (
          <div className="p-4">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.slice(0, MAX_CHARS))}
              placeholder={
                sampleType === 'stool'
                  ? 'e.g. "Found white thread-like segments about 5mm long in stool this morning. Slight abdominal discomfort for 2 weeks. Recently returned from Thailand…"'
                  : sampleType === 'skin'
                  ? 'e.g. "Circular red rash about 3cm diameter appeared on my lower leg after bushwalking in QLD. Itchy, slightly raised. No recent travel overseas…"'
                  : 'Describe what you\'ve observed in as much detail as possible — colour, size, shape, location, duration, and any recent travel or pet exposure…'
              }
              className="min-h-[140px] resize-none border-0 focus:ring-0 text-sm text-slate-800 placeholder:text-slate-400 p-0 shadow-none"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                What to include
                <ChevronDown className={cn('w-3 h-3 transition-transform', showTips && 'rotate-180')} />
              </button>
              <span className={cn(
                'text-xs tabular-nums',
                textInput.length < MIN_CHARS ? 'text-slate-400' :
                charsLeft < 100 ? 'text-amber-500' : 'text-slate-400'
              )}>
                {textInput.length < MIN_CHARS
                  ? `${MIN_CHARS - textInput.length} more characters needed`
                  : `${charsLeft} left`}
              </span>
            </div>
            {showTips && (
              <div className="mt-3 bg-teal-50 rounded-xl p-3 border border-teal-200">
                <p className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider mb-2">
                  Tips for a better assessment
                </p>
                <ul className="space-y-1">
                  {WRITING_TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-teal-800">
                      <CheckCircle2 className="w-3 h-3 text-teal-500 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ── File mode ─────────────────────────────────────────────────── */}
        {inputMode === 'file' && (
          <div className="p-4">
            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all',
                  dragOver
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                )}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-slate-400 mb-3">
                  PDF, TXT, DOC, DOCX — up to 5MB
                </p>
                <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px]">
                  Lab results, discharge summaries, symptom notes
                </Badge>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
                <FileText className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-teal-800 truncate">{file.name}</p>
                  <p className="text-xs text-teal-600 mt-0.5">
                    {(file.size / 1024).toFixed(0)} KB · Ready for analysis
                  </p>
                </div>
                <button
                  onClick={() => { setFile(null); setFileContent('') }}
                  className="text-teal-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {fileError && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {fileError}
              </p>
            )}
            {file && (
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Optionally, add any additional context about your symptoms below:
              </p>
            )}
            {file && (
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Any additional symptoms, travel history, or context…"
                className="mt-2 min-h-[80px] resize-none text-sm border-slate-200"
              />
            )}
          </div>
        )}
      </div>

      {/* ── Submit button ────────────────────────────────────────────────── */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          'w-full h-12 text-sm font-semibold rounded-xl shadow-sm transition-all',
          canSubmit
            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        )}
      >
        {credits === 0 ? (
          'Purchase credits to continue'
        ) : (
          <>
            <span className="mr-2">🔬</span>
            Run Educational Analysis
            <span className="ml-2 text-teal-200 text-xs font-normal">
              (uses 1 credit · ~60 sec)
            </span>
          </>
        )}
      </Button>

      {/* ── Inline disclaimer ────────────────────────────────────────────── */}
      <p className="text-[11px] text-center text-slate-400 leading-relaxed px-4">
        By submitting, you confirm you understand this is an{' '}
        <strong className="text-slate-500">educational assessment only</strong> and not a medical diagnosis.
        Always consult a qualified Australian GP or specialist.
      </p>
    </div>
  )
}
