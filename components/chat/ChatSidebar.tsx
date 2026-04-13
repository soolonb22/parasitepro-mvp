'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Plus,
  Search,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Bug,
  Plane,
  Users,
  Dog,
  Leaf,
  X,
  Microscope,
  ChevronLeft,
} from 'lucide-react'
import { type Conversation, type ConversationCategory } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  activeConversationId: string | null
  onSelectConversation: (id: string, messages?: unknown[]) => void
  onNewChat: () => void
  isOpen: boolean
  onClose: () => void
}

const CATEGORY_CONFIG: Record<ConversationCategory, { icon: typeof Bug; color: string; label: string }> = {
  skin:     { icon: Leaf,          color: 'text-green-600',  label: 'Skin' },
  stool:    { icon: Bug,           color: 'text-slate-600',  label: 'Stool' },
  travel:   { icon: Plane,         color: 'text-purple-600', label: 'Travel' },
  pets:     { icon: Dog,           color: 'text-orange-600', label: 'Pets' },
  children: { icon: Users,         color: 'text-pink-600',   label: 'Children' },
  general:  { icon: MessageCircle, color: 'text-teal-600',   label: 'General' },
  urgent:   { icon: MessageCircle, color: 'text-red-600',    label: 'Urgent' },
}

function groupConversations(conversations: Conversation[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86400000)
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000)

  const groups: { label: string; items: Conversation[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Last 7 days', items: [] },
    { label: 'Older', items: [] },
  ]

  for (const conv of conversations) {
    const d = new Date(conv.updatedAt)
    if (d >= todayStart) groups[0].items.push(conv)
    else if (d >= yesterdayStart) groups[1].items.push(conv)
    else if (d >= weekStart) groups[2].items.push(conv)
    else groups[3].items.push(conv)
  }

  return groups.filter((g) => g.items.length > 0)
}

function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function ChatSidebar({
  activeConversationId,
  onSelectConversation,
  onNewChat,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } catch {
      console.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (conv: Conversation) => {
    try {
      const res = await fetch(`/api/conversations/${conv.id}`)
      const data = await res.json()
      onSelectConversation(conv.id, data.messages)
      if (window.innerWidth < 768) onClose()
    } catch {
      onSelectConversation(conv.id)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) onNewChat()
    } catch {
      console.error('Failed to delete conversation')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleSave = async (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation()
    const newSaved = !conv.saved
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, saved: newSaved } : c))
    )
    await fetch(`/api/conversations/${conv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saved: newSaved }),
    })
  }

  const filtered = search.trim()
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.preview.toLowerCase().includes(search.toLowerCase())
      )
    : conversations

  const groups = groupConversations(filtered)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed md:relative top-0 left-0 h-full w-72 bg-slate-900 flex flex-col z-40 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <Microscope className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-semibold text-white text-sm">
                Parasite<span className="text-teal-400">Pro</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => { onNewChat(); if (window.innerWidth < 768) onClose() }}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm h-9 rounded-xl justify-start gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats…"
              className="pl-8 h-8 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:border-teal-500 focus:ring-0 rounded-lg"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {loading ? (
            <div className="px-4 py-8 text-center">
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : groups.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {search ? 'No chats match your search' : 'No previous chats yet'}
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-2">
                {/* Group label */}
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>

                {group.items.map((conv) => {
                  const catConfig = conv.category ? CATEGORY_CONFIG[conv.category] : null
                  const CatIcon = catConfig?.icon ?? MessageCircle
                  const isActive = activeConversationId === conv.id

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelect(conv)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 mx-1 rounded-xl group transition-all duration-150 relative',
                        'hover:bg-slate-800',
                        isActive ? 'bg-slate-800 border border-teal-600/30' : 'border border-transparent',
                        deletingId === conv.id && 'opacity-50 pointer-events-none'
                      )}
                      style={{ width: 'calc(100% - 8px)' }}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Category icon */}
                        <div className={cn(
                          'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                          isActive ? 'bg-teal-600/20' : 'bg-slate-800 group-hover:bg-slate-700'
                        )}>
                          <CatIcon className={cn('w-3 h-3', catConfig?.color ?? 'text-slate-500')} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className={cn(
                              'text-xs font-medium truncate flex-1',
                              isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                            )}>
                              {conv.title}
                            </p>
                            {conv.saved && (
                              <Bookmark className="w-2.5 h-2.5 text-teal-400 shrink-0 fill-teal-400" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate leading-relaxed">
                            {conv.preview}
                          </p>
                          <p className="text-[10px] text-slate-600 mt-0.5">
                            {relativeTime(conv.updatedAt)} · {conv.messageCount} msgs
                          </p>
                        </div>
                      </div>

                      {/* Hover actions */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={(e) => handleToggleSave(e, conv)}
                          className="p-1 rounded-md hover:bg-slate-700 text-slate-500 hover:text-teal-400 transition-colors"
                          title={conv.saved ? 'Unsave' : 'Save'}
                        >
                          {conv.saved ? (
                            <BookmarkCheck className="w-3 h-3 fill-teal-400 text-teal-400" />
                          ) : (
                            <Bookmark className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, conv.id)}
                          className="p-1 rounded-md hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-green-900/50 text-green-400 border-green-700/50 text-[10px]">
              Free chatbot
            </Badge>
            <a href="/analyzer" className="text-[10px] text-teal-400 hover:text-teal-300 font-medium transition-colors">
              AI Analyser →
            </a>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Educational use only. Not medical advice. Always see a GP for health concerns.
          </p>
        </div>
      </aside>
    </>
  )
}
