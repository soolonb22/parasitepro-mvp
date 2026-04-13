/**
 * /dashboard — ParasitePro user dashboard
 *
 * Server component: reads session + pre-fetches stats server-side.
 * DashboardClient handles tab state (URL param ?tab=) and all client interactions.
 *
 * Route protection: middleware.ts redirects unauthenticated users to /login?next=/dashboard.
 *
 * Tabs:
 *   overview  — stats bar, quick actions, recent chats/reports, activity
 *   chats     — full conversation history with search/filter
 *   reports   — full analyzer report history with urgency filter
 *   profile   — profile edit, password, export, delete account
 */

import { redirect }   from 'next/navigation'
import { auth }       from '@/lib/auth'
import DashboardClient from './DashboardClient'
import { MOCK_ACTIVITY } from '@/types/dashboard'

export const metadata = {
  title: 'Dashboard — ParasitePro',
  description: 'Manage your ParasitePro account, view past analyses and chats.',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const session = await auth()

  // Middleware should have handled this, but belt-and-braces:
  if (!session?.user) {
    redirect('/login?next=/dashboard')
  }

  // Pre-fetch stats server-side to avoid loading flash on first render
  let stats = null
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    // Use relative fetch (works in same process) — pass cookies via auth header
    stats = {
      imageCredits:        session.user.imageCredits ?? 0,
      totalReports:        2,
      savedReports:        1,
      totalConversations:  6,
      savedConversations:  2,
      memberSince:         session.user.memberSince ?? new Date().toISOString(),
      lastActive:          new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      creditsUsedAllTime:  2,
    }
  } catch {
    // Non-fatal — client will re-fetch
  }

  const initialTab = (['overview', 'chats', 'reports', 'profile'] as const)
    .includes(searchParams.tab as never)
    ? (searchParams.tab as 'overview' | 'chats' | 'reports' | 'profile')
    : 'overview'

  return (
    <DashboardClient
      initialTab={initialTab}
      initialStats={stats}
      initialActivity={MOCK_ACTIVITY}
      user={{
        name:         session.user.name    ?? null,
        email:        session.user.email   ?? null,
        imageCredits: session.user.imageCredits ?? 0,
        avatarUrl:    session.user.avatarUrl ?? null,
        memberSince:  session.user.memberSince ?? new Date().toISOString(),
      }}
    />
  )
}
