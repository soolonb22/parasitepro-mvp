import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne, query } from '@/lib/db'

const PROMO_CREDITS: Record<string, number> = {
  BETA3FREE: 3,
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, promoCode } = await request.json()

    // ── Validation ──────────────────────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // ── Check for existing user ─────────────────────────────────────────────
    const existing = await queryOne('SELECT id FROM users WHERE email=$1', [cleanEmail])
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 409 }
      )
    }

    // ── Hash password ────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12)

    // ── Promo code credits ───────────────────────────────────────────────────
    const promoUpper = (promoCode ?? '').trim().toUpperCase()
    const bonusCredits = PROMO_CREDITS[promoUpper] ?? 0
    const startingCredits = 0 + bonusCredits  // 0 base + promo

    // ── Insert user ──────────────────────────────────────────────────────────
    const newUser = await queryOne<{
      id: string; name: string | null; email: string; image_credits: number; created_at: string
    }>(
      `INSERT INTO users (name, email, password_hash, image_credits, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, image_credits, created_at`,
      [name?.trim() || null, cleanEmail, passwordHash, startingCredits]
    )

    if (!newUser) throw new Error('User creation failed')

    // ── Log promo code usage ─────────────────────────────────────────────────
    if (bonusCredits > 0) {
      await query(
        `INSERT INTO credit_transactions (user_id, amount, type, description, created_at)
         VALUES ($1, $2, 'promo', $3, NOW())`,
        [newUser.id, bonusCredits, `Promo code: ${promoUpper}`]
      ).catch(() => {
        // Non-fatal if credit_transactions table doesn't exist yet
      })
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id:           newUser.id,
          name:         newUser.name,
          email:        newUser.email,
          imageCredits: newUser.image_credits,
        },
        message: bonusCredits > 0
          ? `Account created! ${bonusCredits} free credits applied.`
          : 'Account created successfully.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again or contact support@notworms.com' },
      { status: 500 }
    )
  }
}
