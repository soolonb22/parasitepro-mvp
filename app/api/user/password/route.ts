import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required.' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
    }

    // Fetch current hash
    const user = await queryOne<{ password_hash: string | null }>(
      'SELECT password_hash FROM users WHERE id = $1',
      [session.user.id]
    )

    if (!user?.password_hash) {
      return NextResponse.json(
        { error: 'Your account uses Google sign-in and does not have a password.' },
        { status: 400 }
      )
    }

    const match = await bcrypt.compare(currentPassword, user.password_hash)
    if (!match) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, session.user.id]
    )

    return NextResponse.json({ success: true, message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })
  }
}
