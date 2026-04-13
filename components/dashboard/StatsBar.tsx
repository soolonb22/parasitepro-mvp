import { Zap, FileText, MessageCircle, Calendar } from 'lucide-react'
import type { DashboardStats } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface StatsBarProps {
  stats: DashboardStats
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function memberDays(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days < 1) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

const STATS = (s: DashboardStats) => [
  {
    icon:    Zap,
    label:   'Credits',
    value:   s.imageCredits,
    sub:     s.imageCredits === 1 ? '1 analysis remaining' : `${s.imageCredits} analyses remaining`,
    color:   s.imageCredits > 0 ? 'text-teal-600' : 'text-red-500',
    bg:      s.imageCredits > 0 ? 'bg-teal-50'   : 'bg-red-50',
    border:  s.imageCredits > 0 ? 'border-teal-200' : 'border-red-200',
  },
  {
    icon:    FileText,
    label:   'Reports',
    value:   s.totalReports,
    sub:     `${s.savedReports} saved`,
    color:   'text-purple-600',
    bg:      'bg-purple-50',
    border:  'border-purple-200',
  },
  {
    icon:    MessageCircle,
    label:   'Chats',
    value:   s.totalConversations,
    sub:     `${s.savedConversations} saved`,
    color:   'text-blue-600',
    bg:      'bg-blue-50',
    border:  'border-blue-200',
  },
  {
    icon:    Calendar,
    label:   'Member for',
    value:   memberDays(s.memberSince),
    sub:     s.lastActive ? `Active ${relativeDate(s.lastActive)}` : 'Welcome!',
    color:   'text-slate-600',
    bg:      'bg-slate-50',
    border:  'border-slate-200',
    wide:    true,
  },
]

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {STATS(stats).map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'rounded-2xl border p-4 flex flex-col gap-1',
            stat.bg, stat.border
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <p className={cn('font-display text-2xl font-bold', stat.color)}>
            {stat.value}
          </p>
          <p className="text-xs text-slate-500">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}
