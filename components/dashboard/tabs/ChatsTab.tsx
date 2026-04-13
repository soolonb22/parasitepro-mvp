'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search, MessageCircle, Bookmark, BookmarkCheck,
  Trash2, ChevronRight, Plus, Filter, Bug,
  Plane, Users, Dog, Leaf, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Conversation, ConversationCategory } from '@/types/chat'

const CATEGORY_CONFIG: Record<ConversationCategory, { icon: React.ElementType; label: string; color: string }> = {
  skin:     { icon: Leaf,          label: 'Skin',     color: 'text-green-600 bg-green-100' },
  stool:    { icon: Bug,           label: 'Stool',    color: 'text-slate-600 bg-slate-100' },
  travel:   { icon: Plane,         label: 'Travel',   color: 'text-purple-600 bg-purple-100' },
  pets:     { icon: Dog,           label: 'Pets',     color: 'text-orange-600 bg-orange-100' },
  children: { icon: Users,         label: 'Children', color: 'text-pink-600 bg-pink-100' },
  general:  { icon: MessageCircle, label: 'General',  color: 'text-teal-600 bg-teal-100' },
  urgent:   { icon: MessageCircle, label: 'Urgent',   color: 'text-red-600 bg-red-100' },
}

type FilterOption = 'all' | 'saved' | ConversationCategory

function relativeTime(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(date))
}

export function ChatsTab() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleToggleSave = useCallback(async (conv: Conversation) => {
    const newSaved = !conv.saved
    setConversations((prev) => prev.map((c) => c.id === conv.id ? { ...c, saved: newSaved } : c))
    await fetch(`/api/conversations/${conv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saved: newSaved }),
    })
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      setConversations((prev) => prev.filter((c) => c.id !== id))
    } finally {
      setDeletingId(null)
    }
  }, [])

  const filtered = conversations.filter((c) => {
    const matchSearch = !search.trim() || c.title.toLowerCase().includes(search.toLowerCase()) || c.preview.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ? true : filter === 'saved' ? c.saved : c.category === filter
    return matchSearch && matchFilter
  })

  const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
    { value: 'all',      label: 'All' },
    { value: 'saved',    label: 'Saved' },
    { value: 'skin',     label: 'Skin' },
    { value: 'stool',    label: 'Stool' },
    { value: 'travel',   label: 'Travel' },
    { value: 'pets',     label: 'Pets' },
    { value: 'children', label: 'Children' },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="pl-9 border-slate-200 focus:border-teal-400 bg-white"
          />
        </div>
        <Link href="/chat">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />New Chat
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
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-14 text-center">
          <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium mb-1">
            {search ? 'No chats match your search' : 'No chats yet'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            {search ? 'Try different keywords' : 'Start a free conversation with PARA'}
          </p>
          <Link href="/chat">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-3.5 h-3.5 mr-1.5" />Start a Chat
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 pl-1">{filtered.length} conversation{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.map((chat) => {
            const catCfg = chat.category ? CATEGORY_CONFIG[chat.category] : null
            const Icon = catCfg?.icon ?? MessageCircle
            return (
              <div
                key={chat.id}
                className={cn(
                  'bg-white rounded-2xl border border-slate-200 hover:border-teal-200 hover:shadow-sm transition-all overflow-hidden group',
                  deletingId === chat.id && 'opacity-50 pointer-events-none'
                )}
              >
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Category icon */}
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    catCfg?.color ?? 'text-teal-600 bg-teal-100'
                  )}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800 flex-1 truncate group-hover:text-teal-700 transition-colors">
                        {chat.title}
                      </p>
                      {chat.saved && (
                        <Bookmark className="w-3.5 h-3.5 text-teal-500 fill-teal-500 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate leading-relaxed mb-2">
                      {chat.preview}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {catCfg && (
                        <Badge className={cn('text-[10px] border-0 px-2 py-0.5', catCfg.color)}>
                          {catCfg.label}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {relativeTime(chat.updatedAt)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {chat.messageCount} message{chat.messageCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleSave(chat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                      title={chat.saved ? 'Unsave' : 'Save'}
                    >
                      {chat.saved
                        ? <BookmarkCheck className="w-4 h-4 text-teal-500 fill-teal-500" />
                        : <Bookmark className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link href="/chat">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
