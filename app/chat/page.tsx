'use client'

/**
 * /chat — ParasitePro AI Chatbot
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  ChatSidebar (desktop always-on, mobile slide-in)          │
 * │  ┌───────────────────────────────────────────────────────┐ │
 * │  │  Chat header  ─  PARA branding + disclaimer bar       │ │
 * │  │  ─────────────────────────────────────────────────── │ │
 * │  │  Message area                                         │ │
 * │  │   · SuggestedPrompts (when empty)                     │ │
 * │  │   · ChatMessage × N  (user + assistant bubbles)       │ │
 * │  │   · TypingIndicator  (while streaming)                │ │
 * │  │  ─────────────────────────────────────────────────── │ │
 * │  │  ChatInput (auto-grow textarea + send)                │ │
 * │  └───────────────────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Streaming: Server-sent events via /api/chat (Anthropic Claude SDK).
 *
 * Vector DB (RAG) note:
 *   The /api/chat route enriches each request with context from a
 *   pgvector knowledge base. Before calling the LLM, the API:
 *   1. Generates an embedding for the user query
 *   2. Runs: SELECT content FROM parasite_knowledge
 *             ORDER BY embedding <=> $1 LIMIT 5
 *   3. Injects the top-5 chunks into the system prompt context window
 *   This keeps PARA grounded in curated Australian parasitology data.
 *
 * Conversation persistence:
 *   Conversations are auto-saved to PostgreSQL after the first exchange.
 *   The title is derived from the first user message (truncated to 60 chars).
 *   Users can manually save/star chats via the Bookmark button.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { SuggestedPrompts } from '@/components/chat/SuggestedPrompts'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { DisclaimerBanner } from '@/components/chat/DisclaimerBanner'
import {
  Microscope,
  RotateCcw,
  PanelLeftOpen,
  ChevronRight,
  Shield,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import {
  type ChatMessage as ChatMessageType,
  parseUrgency,
} from '@/types/chat'

// ─── Constants ──────────────────────────────────────────────────────────────

const PARA_GREETING: ChatMessageType = {
  id: 'greeting',
  role: 'assistant',
  content: `G'day! I'm **PARA** — your personal guide to ParasitePro.

I can help you understand parasite-related symptoms, work through what something might be, and prepare structured notes for your GP visit. I'm not a doctor, but I draw on clinical parasitology and Australian health guidelines to give you clear, evidence-based information.

**You can ask me about:**
- Specific symptoms or something you've noticed (skin, stool, rashes, bites)
- Parasites common in Queensland, tropical Australia, or after travel
- Whether something needs urgent attention or can wait
- How to prepare for your GP visit

⚠️ *Educational tool only — always see a qualified healthcare professional for medical advice.*`,
  timestamp: new Date(),
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface StreamingState {
  isStreaming: boolean
  activeMessageId: string | null
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([PARA_GREETING])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState<StreamingState>({
    isStreaming: false,
    activeMessageId: null,
  })
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewChat = useCallback(() => {
    abortRef.current?.abort()
    setMessages([{ ...PARA_GREETING, timestamp: new Date() }])
    setInput('')
    setConversationId(null)
    setStreaming({ isStreaming: false, activeMessageId: null })
  }, [])

  const handleLoadConversation = useCallback(
    (id: string, loadedMessages?: unknown[]) => {
      abortRef.current?.abort()
      setConversationId(id)
      setStreaming({ isStreaming: false, activeMessageId: null })
      if (loadedMessages && Array.isArray(loadedMessages)) {
        const typed = loadedMessages as ChatMessageType[]
        setMessages([{ ...PARA_GREETING, timestamp: new Date() }, ...typed])
      }
    },
    []
  )

  const persistConversation = useCallback(
    async (convId: string | null, newMessages: ChatMessageType[], userContent: string) => {
      try {
        if (convId) {
          await fetch(`/api/conversations/${convId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: newMessages.slice(-2) }),
          })
          return convId
        } else {
          const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: userContent.slice(0, 60),
              firstMessage: userContent,
            }),
          })
          const data = await res.json()
          return data.conversation?.id ?? null
        }
      } catch {
        return convId
      }
    },
    []
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || streaming.isStreaming) return

      const userMsg: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      const assistantId = `assistant-${Date.now()}`
      const assistantMsg: ChatMessageType = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setInput('')
      setStreaming({ isStreaming: true, activeMessageId: assistantId })

      const history = messages
        .filter((m) => m.id !== 'greeting')
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }))

      const controller = new AbortController()
      abortRef.current = controller
      let accumulated = ''

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, query: trimmed }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) throw new Error(`API error: ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                accumulated += parsed.text
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: accumulated, urgency: parseUrgency(accumulated) }
                      : m
                  )
                )
              }
            } catch {
              // malformed SSE line
            }
          }
        }

        // Persist to Postgres after streaming complete
        const allCurrent = messages.filter((m) => m.id !== 'greeting')
        const finalMessages = [
          ...allCurrent,
          userMsg,
          { ...assistantMsg, content: accumulated, urgency: parseUrgency(accumulated) },
        ]
        const newConvId = await persistConversation(conversationId, finalMessages, trimmed)
        if (!conversationId && newConvId) setConversationId(newConvId)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        console.error('Chat error:', err)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm having trouble connecting right now. Please try again or email support@notworms.com",
                }
              : m
          )
        )
      } finally {
        setStreaming({ isStreaming: false, activeMessageId: null })
        abortRef.current = null
      }
    },
    [messages, streaming.isStreaming, conversationId, persistConversation]
  )

  const handleFeedback = useCallback(
    async (messageId: string, value: 'positive' | 'negative') => {
      console.log('Feedback:', { messageId, conversationId, value })
      // TODO: POST /api/feedback { messageId, conversationId, value }
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedback: value } : m))
      )
    },
    [conversationId]
  )

  const handleSave = useCallback(
    async (_messageId: string) => {
      if (!conversationId) return
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved: true }),
      })
    },
    [conversationId]
  )

  const isStreaming = streaming.isStreaming
  const showSuggestedPrompts = messages.length === 1 && !isStreaming
  const lastMsgEmpty =
    messages[messages.length - 1]?.role === 'assistant' &&
    messages[messages.length - 1]?.content === ''

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">

      {/* Sidebar */}
      <ChatSidebar
        activeConversationId={conversationId}
        onSelectConversation={handleLoadConversation}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-700 -ml-1 shrink-0"
            aria-label="Open conversation history"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
                <Microscope className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-slate-800 leading-none">PARA</p>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] leading-none py-0.5">
                  Free
                </Badge>
              </div>
              <p className="text-xs text-slate-500 leading-none mt-1 truncate">
                Your personal guide to ParasitePro · notworms.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-medium cursor-default"
              title="PARA uses a curated Australian parasitology knowledge base (pgvector RAG)"
            >
              <Shield className="w-3 h-3" />
              AUS Knowledge Base
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Start new chat"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Link href="/analyzer" className="hidden sm:block">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium h-8 px-3">
                AI Analyser
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Disclaimer */}
        <DisclaimerBanner />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-4 space-y-4 min-h-full">
            {showSuggestedPrompts && (
              <SuggestedPrompts onSelect={sendMessage} disabled={isStreaming} />
            )}

            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                isStreaming={streaming.activeMessageId === message.id}
                onFollowUp={sendMessage}
                onSave={handleSave}
                onFeedback={handleFeedback}
              />
            ))}

            {isStreaming && lastMsgEmpty && <TypingIndicator />}
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => sendMessage(input)}
          loading={isStreaming}
        />

        {/* TGA footer */}
        <div className="bg-white border-t border-slate-100 px-4 py-1.5 shrink-0">
          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
            <Info className="w-3 h-3 shrink-0" />
            Educational tool only — not a medical diagnosis service. TGA SaMD non-device. AHPRA compliant.
            <Link href="/terms" className="underline hover:text-slate-600">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="underline hover:text-slate-600">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
