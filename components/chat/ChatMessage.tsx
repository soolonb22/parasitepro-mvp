'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Microscope, Copy, Check, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UrgencyBadge } from '@/components/chat/UrgencyBadge'
import { type ChatMessage as ChatMessageType, type FollowUpSuggestion, parseUrgency, generateFollowUps } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessageType
  isLast: boolean
  isStreaming: boolean
  onFollowUp: (prompt: string) => void
  onSave?: (messageId: string) => void
  onFeedback?: (messageId: string, value: 'positive' | 'negative') => void
}

// Custom markdown components for health-edtech prose style
const markdownComponents = {
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-teal-800 mt-4 mb-1.5 first:mt-0 font-body">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-xs font-bold text-slate-700 mt-3 mb-1 uppercase tracking-wide font-body">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-sm text-slate-700 leading-relaxed mb-2.5 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-sm space-y-1 mb-2.5 pl-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-sm space-y-1 mb-2.5 pl-4 list-decimal">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-2 text-slate-700 leading-relaxed">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-slate-500 text-xs">{children}</em>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto mb-3 rounded-xl border border-slate-200">
      <table className="w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-teal-50">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3 py-2 text-left font-semibold text-teal-800 border-b border-teal-200">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-3 py-2 text-slate-700 border-b border-slate-100 last:border-0">{children}</td>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-teal-300 pl-3 my-2 text-sm text-slate-500 italic">{children}</blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-3" />,
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isBlock = className?.includes('language-')
    return isBlock ? (
      <code className="block bg-slate-900 text-green-400 rounded-xl px-4 py-3 text-xs font-mono overflow-x-auto mb-2">
        {children}
      </code>
    ) : (
      <code className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    )
  },
}

export function ChatMessage({
  message,
  isLast,
  isStreaming,
  onFollowUp,
  onSave,
  onFeedback,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(message.feedback ?? null)
  const [saved, setSaved] = useState(false)

  const isAssistant = message.role === 'assistant'
  const isUser = message.role === 'user'
  const showActions = isAssistant && !isStreaming && message.content.length > 0
  const urgency = isAssistant ? parseUrgency(message.content) : null
  const followUps: FollowUpSuggestion[] = isLast && isAssistant && showActions
    ? generateFollowUps(message.content)
    : []

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (value: 'positive' | 'negative') => {
    setFeedback(value)
    onFeedback?.(message.id, value)
  }

  const handleSave = () => {
    setSaved(true)
    onSave?.(message.id)
  }

  const formattedTime = new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(message.timestamp))

  if (isUser) {
    return (
      <div className="flex justify-end px-4 max-w-2xl mx-auto w-full">
        <div className="max-w-[80%] sm:max-w-[72%]">
          <div className="bg-teal-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-[10px] text-slate-400 text-right mt-1 pr-1">{formattedTime}</p>
        </div>
      </div>
    )
  }

  if (isAssistant) {
    return (
      <div className="flex flex-col gap-1 px-4 max-w-2xl mx-auto w-full">
        <div className="flex items-start gap-3">
          {/* PARA avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md shrink-0 mt-0.5">
            <Microscope className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Message bubble */}
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
              {/* Urgency ribbon — only for non-null levels */}
              {urgency && (
                <div className={cn(
                  'px-4 py-2 border-b flex items-center gap-2',
                  urgency === 'urgent' ? 'bg-red-50 border-red-200' :
                  urgency === 'high'   ? 'bg-red-50 border-red-100' :
                  urgency === 'moderate' ? 'bg-amber-50 border-amber-200' :
                  'bg-green-50 border-green-100'
                )}>
                  <UrgencyBadge level={urgency} size="sm" />
                  {urgency === 'urgent' && (
                    <span className="text-xs text-red-700 font-medium">
                      Please seek medical attention promptly
                    </span>
                  )}
                  {urgency === 'high' && (
                    <span className="text-xs text-red-600">
                      See a doctor within 24–48 hours
                    </span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-4 py-3">
                {message.content === '' ? (
                  <div className="flex items-center gap-2 py-0.5">
                    <span
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: '0ms', animationDuration: '900ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: '150ms', animationDuration: '900ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: '300ms', animationDuration: '900ms' }}
                    />
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <p className="text-[10px] text-slate-400 mt-1 pl-1">{formattedTime}</p>

            {/* ── Post-response action bar ─────────────────────────────── */}
            {showActions && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-all"
                  title="Copy response"
                >
                  {copied ? (
                    <><Check className="w-3 h-3 text-teal-600" /><span className="text-teal-600">Copied!</span></>
                  ) : (
                    <><Copy className="w-3 h-3" />Copy</>
                  )}
                </button>

                {/* Save this chat */}
                <button
                  onClick={handleSave}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all',
                    saved
                      ? 'text-teal-700 bg-teal-50 border-teal-300'
                      : 'text-slate-500 bg-white border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
                  )}
                  title="Save this chat to your account"
                >
                  {saved ? (
                    <><BookmarkCheck className="w-3 h-3" />Saved</>
                  ) : (
                    <><Bookmark className="w-3 h-3" />Save chat</>
                  )}
                </button>

                {/* Divider */}
                <span className="w-px h-4 bg-slate-200 mx-0.5" />

                {/* Thumbs */}
                <button
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    'p-1.5 rounded-lg border transition-all',
                    feedback === 'positive'
                      ? 'text-green-600 bg-green-50 border-green-300'
                      : 'text-slate-400 border-transparent hover:border-slate-200 hover:bg-slate-50'
                  )}
                  title="Helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleFeedback('negative')}
                  className={cn(
                    'p-1.5 rounded-lg border transition-all',
                    feedback === 'negative'
                      ? 'text-red-500 bg-red-50 border-red-300'
                      : 'text-slate-400 border-transparent hover:border-slate-200 hover:bg-slate-50'
                  )}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* ── Follow-up suggestions ────────────────────────────────── */}
            {followUps.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                  Ask a follow-up
                </p>
                <div className="flex flex-wrap gap-2">
                  {followUps.map((fu, i) => (
                    <button
                      key={i}
                      onClick={() => onFollowUp(fu.prompt)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 hover:border-teal-300 transition-all"
                    >
                      {fu.label}
                      <ChevronRight className="w-3 h-3 text-teal-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
