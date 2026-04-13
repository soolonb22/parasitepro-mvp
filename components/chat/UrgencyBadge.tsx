import { URGENCY_MAP, type UrgencyLevel } from '@/types/chat'
import { AlertTriangle, AlertCircle, Info, Siren } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UrgencyBadgeProps {
  level: UrgencyLevel
  className?: string
  size?: 'sm' | 'md'
}

const ICONS = {
  low: Info,
  moderate: AlertCircle,
  high: AlertTriangle,
  urgent: Siren,
}

export function UrgencyBadge({ level, className, size = 'sm' }: UrgencyBadgeProps) {
  if (!level) return null

  const entry = Object.values(URGENCY_MAP).find((v) => v.level === level)
  if (!entry) return null

  const Icon = ICONS[level]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold leading-none',
        entry.bg,
        entry.color,
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {entry.emoji} {entry.label}
    </span>
  )
}
