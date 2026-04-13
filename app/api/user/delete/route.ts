import { NextRequest, NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'
import bcrypt from 'bcryptjs'

/**
 * DELETE /api/user/delete
 * Permanently deletes the account and all associated data.
 * Requires password confirmation (or "CONFIRM" for OAuth accounts).
 */
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const { confirmation } = await request.json()

    const user = await queryOne<{ password_hash: string | null }>(
      'SELECT password_hash FROM users WHERE id = $1',
      [session.user.id]
    )

    // For password accounts: confirm password. For OAuth: require typed "DELETE"
    if (user?.password_hash) {
      const match = await bcrypt.compare(confirmation ?? '', user.password_hash)
      if (!match) {
        return NextResponse.json({ error: 'Incorrect password. Account not deleted.' }, { status: 400 })
      }
    } else {
      if ((confirmation ?? '').trim().toUpperCase() !== 'DELETE') {
        return NextResponse.json(
          { error: 'Please type DELETE to confirm account deletion.' },
          { status: 400 }
        )
      }
    }

    // Cascade delete (reports, conversations, messages FK-cascade in DB)
    await query('DELETE FROM users WHERE id = $1', [session.user.id])

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    })
  } catch (error) {
    console.error('Account delete error:', error)
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 })
  }
}
