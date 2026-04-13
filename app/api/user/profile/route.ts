import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const { name, avatarUrl } = await request.json()

    if (name !== undefined && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json({ error: 'Name must be a string under 100 characters.' }, { status: 400 })
    }

    // Build dynamic SET clause — only update provided fields
    const updates: string[] = []
    const values: unknown[] = []
    let paramIdx = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIdx++}`)
      values.push(name.trim() || null)
    }
    if (avatarUrl !== undefined) {
      updates.push(`image = $${paramIdx++}`)
      values.push(avatarUrl || null)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    updates.push(`updated_at = NOW()`)
    values.push(session.user.id)

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIdx}`,
      values
    )

    // Note: the JWT won't refresh immediately — the user needs to re-sign-in
    // or we can use NextAuth's update() method on the client.
    return NextResponse.json({ success: true, message: 'Profile updated.' })
  } catch (error) {
    console.error('Profile PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
