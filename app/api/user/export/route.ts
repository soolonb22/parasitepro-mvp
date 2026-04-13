import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'

/**
 * GET /api/user/export
 * Returns all of the user's data as a JSON download — GDPR/Privacy Act compliance.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const userId = session.user.id

    // Fetch profile
    const profile = await queryOne(
      'SELECT id, name, email, image, image_credits, created_at FROM users WHERE id = $1',
      [userId]
    )

    // Fetch reports
    const { rows: reports } = await query(
      'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    ).catch(() => ({ rows: [] }))

    // Fetch conversations + messages
    const { rows: conversations } = await query(
      'SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    ).catch(() => ({ rows: [] }))

    const conversationIds = conversations.map((c: { id: string }) => c.id)
    const messages = conversationIds.length > 0
      ? await query(
          `SELECT * FROM messages WHERE conversation_id = ANY($1) ORDER BY created_at ASC`,
          [conversationIds]
        ).then((r) => r.rows).catch(() => [])
      : []

    const exportData = {
      exportedAt: new Date().toISOString(),
      notice: 'This is all personal data held by ParasitePro (notworms.com) for your account.',
      profile,
      reports,
      conversations: conversations.map((c: Record<string, unknown>) => ({
        ...c,
        messages: messages.filter((m: { conversation_id: string }) => m.conversation_id === c.id),
      })),
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="parasitepro-data-export-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 })
  }
}
