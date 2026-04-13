import type { Conversation } from '@/types/chat'
import type { AnalysisReport } from '@/types/analyzer'

// ─── Stats returned by /api/user/stats ───────────────────────────────────────

export interface DashboardStats {
  imageCredits: number
  totalReports: number
  savedReports: number
  totalConversations: number
  savedConversations: number
  memberSince: string
  lastActive: string | null
  creditsUsedAllTime: number
}

// ─── Activity feed event ──────────────────────────────────────────────────────

export type ActivityEventType =
  | 'account_created'
  | 'credits_purchased'
  | 'credits_applied'
  | 'report_created'
  | 'report_saved'
  | 'chat_saved'
  | 'profile_updated'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  description: string
  detail?: string
  timestamp: string
}

// ─── Credit bundle ────────────────────────────────────────────────────────────

export interface CreditBundle {
  id: string
  name: string
  credits: number
  price: number
  priceId: string       // Stripe price ID
  highlight: boolean
  badge?: string
}

export const CREDIT_BUNDLES: CreditBundle[] = [
  {
    id:        'bundle_5',
    name:      'Starter',
    credits:   5,
    price:     6,
    priceId:   process.env.NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_5 ?? 'price_starter',
    highlight: false,
  },
  {
    id:        'bundle_10',
    name:      'Popular',
    credits:   10,
    price:     10,
    priceId:   process.env.NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_10 ?? 'price_popular',
    highlight: true,
    badge:     '★ Most Popular',
  },
  {
    id:        'bundle_25',
    name:      'Value',
    credits:   25,
    price:     25,
    priceId:   process.env.NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_25 ?? 'price_value',
    highlight: false,
    badge:     'Best value',
  },
]

// ─── Dashboard tab IDs ────────────────────────────────────────────────────────

export type DashboardTab = 'overview' | 'chats' | 'reports' | 'profile'

export const DASHBOARD_TABS: { id: DashboardTab; label: string; icon: string }[] = [
  { id: 'overview',  label: 'Overview',  icon: '📊' },
  { id: 'chats',     label: 'Chats',     icon: '💬' },
  { id: 'reports',   label: 'Reports',   icon: '🔬' },
  { id: 'profile',   label: 'Profile',   icon: '👤' },
]

// ─── Mock activity events ─────────────────────────────────────────────────────

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-1',
    type: 'report_created',
    description: 'New analysis completed',
    detail: 'Tapeworm (possible proglottids)',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'act-2',
    type: 'chat_saved',
    description: 'Chat saved',
    detail: 'Pinworm symptoms in kids',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'act-3',
    type: 'credits_applied',
    description: '3 credits applied',
    detail: 'Promo code BETA3FREE',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'act-4',
    type: 'account_created',
    description: 'Account created',
    detail: 'Welcome to ParasitePro',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
]
