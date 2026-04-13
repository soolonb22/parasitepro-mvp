'use client'

import { useRef, useEffect, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
  disabled?: boolean
  placeholder?: string
}

const MAX_CHARS = 1200

export function ChatInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
  placeholder = 'Ask PARA about symptoms, parasites, or when to see a GP…',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charsLeft = MAX_CHARS - value.length
  const isOverLimit = charsLeft < 0
  const isNearLimit = charsLeft < 100 && charsLeft >= 0

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`
  }, [value])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading && !disabled) {
      e.preventDefault()
      if (value.trim() && !isOverLimit) onSubmit()
    }
  }

  const canSend = value.trim().length > 0 && !loading && !disabled && !isOverLimit

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
      <div className="max-w-2xl mx-auto">
        <div className={cn(
          'flex items-end gap-2 bg-slate-50 rounded-2xl border transition-all p-1',
          loading ? 'border-slate-200' : 'border-slate-200 focus-within:border-teal-400 focus-within:bg-white focus-within:shadow-sm focus-within:shadow-teal-100'
        )}>
          {/* Attachment hint (future image upload) */}
          <button
            type="button"
            disabled
            title="Image upload coming soon with AI Analyser"
            className="p-2 text-slate-300 cursor-not-allowed shrink-0 mb-0.5"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled || loading}
            className={cn(
              'flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 py-2.5 pr-1 leading-relaxed focus:outline-none min-h-[40px] max-h-36 disabled:opacity-60',
            )}
          />

          {/* Send button */}
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canSend}
            size="icon"
            className={cn(
              'h-10 w-10 rounded-xl shrink-0 mb-0.5 transition-all',
              canSend
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-1.5 px-1">
          <p className="text-[10px] text-slate-400">
            Enter to send · Shift+Enter for new line
          </p>
          {value.length > 0 && (
            <p className={cn(
              'text-[10px] tabular-nums',
              isOverLimit ? 'text-red-500 font-semibold' :
              isNearLimit ? 'text-amber-500' : 'text-slate-400'
            )}>
              {isOverLimit ? `${Math.abs(charsLeft)} over limit` : `${charsLeft} left`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
