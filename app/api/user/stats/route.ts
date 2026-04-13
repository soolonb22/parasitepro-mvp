import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { queryOne } from '@/lib/db'

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

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    // TODO: replace mock with real DB aggregation
    // const stats = await queryOne<DashboardStats>(`
    //   SELECT
    //     u.image_credits,
    //     u.created_at        AS member_since,
    //     COUNT(DISTINCT r.id) FILTER (WHERE r.user_id = u.id)              AS total_reports,
    //     COUNT(DISTINCT r.id) FILTER (WHERE r.saved = true)                AS saved_reports,
    //     COUNT(DISTINCT c.id) FILTER (WHERE c.user_id = u.id)              AS total_conversations,
    //     COUNT(DISTINCT c.id) FILTER (WHERE c.saved = true)                AS saved_conversations,
    //     COALESCE(SUM(r.credits_used), 0)                                  AS credits_used_all_time,
    //     GREATEST(MAX(r.created_at), MAX(c.updated_at))                    AS last_active
    //   FROM users u
    //   LEFT JOIN reports       r ON r.user_id = u.id
    //   LEFT JOIN conversations c ON c.user_id = u.id
    //   WHERE u.id = $1
    //   GROUP BY u.id
    // `, [session.user.id])

    // Mock stats (replace once DB is wired)
    const mockStats: DashboardStats = {
      imageCredits:        session.user.imageCredits ?? 3,
      totalReports:        2,
      savedReports:        1,
      totalConversations:  6,
      savedConversations:  2,
      memberSince:         session.user.memberSince ?? new Date().toISOString(),
      lastActive:          new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      creditsUsedAllTime:  2,
    }

    return NextResponse.json({ stats: mockStats })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
