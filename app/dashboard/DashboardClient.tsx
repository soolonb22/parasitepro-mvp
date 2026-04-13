'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { OverviewTab }  from '@/components/dashboard/tabs/OverviewTab'
import { ChatsTab }     from '@/components/dashboard/tabs/ChatsTab'
import { ReportsTab }   from '@/components/dashboard/tabs/ReportsTab'
import { ProfileTab }   from '@/components/dashboard/tabs/ProfileTab'
import {
  Microscope, LayoutDashboard, MessageCircle,
  FileText, User, LogOut, Upload, Zap,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { DashboardStats, ActivityEvent } from '@/types/dashboard'
import type { Conversation } from '@/types/chat'
import type { AnalysisReport } from '@/types/analyzer'

// ─── Types ────────────────────────────────────────────────────────────────────
type DashboardTab = 'overview' | 'chats' | 'reports' | 'profile'

interface DashboardClientProps {
  initialTab: DashboardTab
  initialStats: DashboardStats | null
  initialActivity: ActivityEvent[]
  user: {
    name: string | null
    email: string | null
    imageCredits: number
    avatarUrl: string | null
    memberSince: string
  }
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { id: DashboardTab; label: string; icon: React.ElementType; mobileLabel: string }[] = [
  { id: 'overview', label: 'Overview',  icon: LayoutDashboard, mobileLabel: 'Home'     },
  { id: 'chats',    label: 'Chats',     icon: MessageCircle,   mobileLabel: 'Chats'    },
  { id: 'reports',  label: 'Reports',   icon: FileText,        mobileLabel: 'Reports'  },
  { id: 'profile',  label: 'Profile',   icon: User,            mobileLabel: 'Profile'  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardClient({
  initialTab,
  initialStats,
  initialActivity,
  user,
}: DashboardClientProps) {
  const router   = useRouter()
  const pathname = usePathname()

  const [activeTab, setActiveTab]       = useState<DashboardTab>(initialTab)
  const [stats, setStats]               = useState<DashboardStats | null>(initialStats)
  const [activity]                      = useState<ActivityEvent[]>(initialActivity)
  const [recentChats, setRecentChats]   = useState<Conversation[]>([])
  const [recentReports, setRecentReports] = useState<Partial<AnalysisReport>[]>([])
  const [dataLoaded, setDataLoaded]     = useState(false)

  // ── Tab change — sync URL param ─────────────────────────────────────────
  const handleTabChange = useCallback((tab: string) => {
    const t = tab as DashboardTab
    setActiveTab(t)
    const url = new URL(window.location.href)
    if (t === 'overview') url.searchParams.delete('tab')
    else url.searchParams.set('tab', t)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  // ── Load supporting data once ───────────────────────────────────────────
  useEffect(() => {
    if (dataLoaded) return
    Promise.allSettled([
      fetch('/api/conversations').then((r) => r.json()),
      fetch('/api/reports').then((r) => r.json()),
      stats ? Promise.resolve({ stats }) : fetch('/api/user/stats').then((r) => r.json()),
    ]).then(([convsResult, reportsResult, statsResult]) => {
      if (convsResult.status === 'fulfilled')  setRecentChats(convsResult.value.conversations ?? [])
      if (reportsResult.status === 'fulfilled') setRecentReports(reportsResult.value.reports ?? [])
      if (statsResult.status === 'fulfilled' && !stats) setStats(statsResult.value.stats ?? null)
      setDataLoaded(true)
    })
  }, [dataLoaded, stats])

  // ── User initials / avatar ──────────────────────────────────────────────
  const initials = (user.name ?? user.email ?? 'U').slice(0, 2).toUpperCase()
  const memberDate = new Intl.DateTimeFormat('en-AU', { month: 'long', year: 'numeric' })
    .format(new Date(user.memberSince))

  const defaultStats: DashboardStats = stats ?? {
    imageCredits: user.imageCredits,
    totalReports: 0,
    savedReports: 0,
    totalConversations: 0,
    savedConversations: 0,
    memberSince: user.memberSince,
    lastActive: null,
    creditsUsedAllTime: 0,
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Dashboard header ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14">

            {/* Avatar + greeting */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden shrink-0">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                  G'day, {user.name ?? 'there'}! 👋
                </p>
                <p className="text-xs text-slate-400 leading-tight">
                  Member since {memberDate}
                </p>
              </div>
            </div>

            {/* Credit pill */}
            <Link href="/analyzer">
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all',
                user.imageCredits > 0
                  ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              )}>
                <Zap className="w-3.5 h-3.5" />
                {user.imageCredits} credit{user.imageCredits !== 1 ? 's' : ''}
              </div>
            </Link>

            {/* New analysis CTA */}
            <Link href="/analyzer" className="hidden sm:block">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-medium">
                <Upload className="w-3.5 h-3.5 mr-1.5" />New Analysis
              </Button>
            </Link>

            {/* Sign out */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 -mb-px overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all',
                    isActive
                      ? 'text-teal-700 border-teal-600'
                      : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {activeTab === 'overview' && (
          <OverviewTab
            stats={defaultStats}
            activity={activity}
            recentChats={recentChats}
            recentReports={recentReports}
            onTabChange={handleTabChange}
          />
        )}

        {activeTab === 'chats' && <ChatsTab />}

        {activeTab === 'reports' && <ReportsTab />}

        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* ── Mobile bottom nav ───────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex md:hidden z-20 safe-area-pb">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
                isActive ? 'text-teal-600' : 'text-slate-400'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.mobileLabel}
            </button>
          )
        })}
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
