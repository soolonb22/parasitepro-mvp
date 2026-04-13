'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { CreditBundles } from '@/components/dashboard/CreditBundles'
import {
  MessageCircle, Upload, BookOpen, Microscope,
  ChevronRight, FileText, Clock, Bug, Plane,
  Users, Dog, Leaf,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { URGENCY_CONFIG, SAMPLE_TYPE_CONFIG } from '@/types/analyzer'
import type { DashboardStats, ActivityEvent } from '@/types/dashboard'
import type { Conversation, ConversationCategory } from '@/types/chat'
import type { AnalysisReport } from '@/types/analyzer'

// ─── Quick actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    icon: Upload,
    label: 'New Analysis',
    desc: 'Run an AI educational assessment',
    href: '/analyzer',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    iconColor: 'text-teal-600 bg-teal-100',
  },
  {
    icon: MessageCircle,
    label: 'Chat with PARA',
    desc: 'Free AI assistant · no credits needed',
    href: '/chat',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600 bg-blue-100',
    badge: 'Free',
  },
  {
    icon: BookOpen,
    label: 'Research Library',
    desc: 'Evidence-based educational articles',
    href: '/research',
    color: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
    iconColor: 'text-slate-600 bg-slate-100',
  },
  {
    icon: Microscope,
    label: 'PARA Assistant',
    desc: 'Learn what PARA can help with',
    href: '/assistant',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-600 bg-purple-100',
  },
]

const CATEGORY_ICON: Record<ConversationCategory, React.ElementType> = {
  skin:     Leaf,
  stool:    Bug,
  travel:   Plane,
  pets:     Dog,
  children: Users,
  general:  MessageCircle,
  urgent:   MessageCircle,
}

interface OverviewTabProps {
  stats: DashboardStats
  activity: ActivityEvent[]
  recentChats: Conversation[]
  recentReports: Partial<AnalysisReport>[]
  onTabChange: (tab: string) => void
}

export function OverviewTab({
  stats,
  activity,
  recentChats,
  recentReports,
  onTabChange,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={cn(
                'group flex flex-col gap-3 p-4 rounded-2xl border cursor-pointer transition-all h-full',
                action.color
              )}>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', action.iconColor)}>
                  <action.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                    {action.badge && (
                      <span className="text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Two-column: recent data + credits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: recent chats + reports */}
        <div className="lg:col-span-2 space-y-5">

          {/* Recent chats */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-800">Recent Chats</h3>
              </div>
              <button
                onClick={() => onTabChange('chats')}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentChats.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 mb-3">No chats yet</p>
                <Link href="/chat">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                    Start a free chat
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentChats.slice(0, 4).map((chat) => {
                  const Icon = chat.category ? CATEGORY_ICON[chat.category] : MessageCircle
                  return (
                    <Link key={chat.id} href="/chat">
                      <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                            {chat.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{chat.preview}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] text-slate-400">
                            {new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(chat.updatedAt))}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent reports */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-slate-800">Recent Reports</h3>
              </div>
              <button
                onClick={() => onTabChange('reports')}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentReports.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Microscope className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 mb-3">No reports yet</p>
                <Link href="/analyzer">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                    Run first analysis
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentReports.slice(0, 4).map((report) => {
                  if (!report.id) return null
                  const urgency = report.urgencyLevel ? URGENCY_CONFIG[report.urgencyLevel] : null
                  const sample = report.sampleType ? SAMPLE_TYPE_CONFIG[report.sampleType] : null
                  return (
                    <Link key={report.id} href="/analyzer">
                      <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <span className="text-lg leading-none shrink-0 mt-0.5">{sample?.icon ?? '🔬'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                            {report.primaryFinding?.commonName ?? 'Analysis result'}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{report.inputSummary}</p>
                        </div>
                        <div className="shrink-0">
                          {urgency && (
                            <span className={cn(
                              'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                              urgency.bgColor, urgency.textColor, urgency.borderColor
                            )}>
                              {urgency.emoji} {urgency.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: credits + activity */}
        <div className="space-y-5">
          <CreditBundles currentCredits={stats.imageCredits} />

          {/* Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-800">Activity</h3>
            </div>
            <div className="px-5 py-4">
              <ActivityFeed events={activity.slice(0, 5)} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
