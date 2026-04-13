import { Zap, FileText, MessageCircle, User, ShoppingBag, Bookmark } from 'lucide-react'
import type { ActivityEvent, ActivityEventType } from '@/types/dashboard'
import { cn } from '@/lib/utils'

const EVENT_CONFIG: Record<ActivityEventType, {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  account_created:   { icon: User,          color: 'text-teal-600',   bg: 'bg-teal-100'   },
  credits_purchased: { icon: ShoppingBag,   color: 'text-purple-600', bg: 'bg-purple-100' },
  credits_applied:   { icon: Zap,           color: 'text-amber-600',  bg: 'bg-amber-100'  },
  report_created:    { icon: FileText,      color: 'text-blue-600',   bg: 'bg-blue-100'   },
  report_saved:      { icon: Bookmark,      color: 'text-blue-600',   bg: 'bg-blue-100'   },
  chat_saved:        { icon: Bookmark,      color: 'text-teal-600',   bg: 'bg-teal-100'   },
  profile_updated:   { icon: User,          color: 'text-slate-600',  bg: 'bg-slate-100'  },
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)   return `${days}d ago`
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

interface ActivityFeedProps {
  events: ActivityEvent[]
  compact?: boolean
}

export function ActivityFeed({ events, compact = false }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-6">No activity yet.</p>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200" />

      <div className="space-y-4">
        {events.map((event, i) => {
          const cfg = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.account_created
          const Icon = cfg.icon
          const isLast = i === events.length - 1

          return (
            <div key={event.id} className="relative flex items-start gap-3 pl-1">
              {/* Dot */}
              <div className={cn(
                'relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-2 ring-white',
                cfg.bg
              )}>
                <Icon className={cn('w-3 h-3', cfg.color)} />
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 min-w-0 pb-4',
                isLast ? '' : ''
              )}>
                <p className="text-sm font-medium text-slate-800 leading-tight">
                  {event.description}
                </p>
                {event.detail && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{event.detail}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1">{relativeTime(event.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
