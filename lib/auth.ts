/**
 * lib/auth.ts — Full NextAuth v5 configuration (Node.js runtime only).
 *
 * Providers:
 *   1. Credentials — email + password (bcrypt hashed, stored in Postgres)
 *   2. Google       — OAuth (optional; enable by setting GOOGLE_CLIENT_ID/SECRET)
 *
 * Strategy: JWT (no database sessions — keeps Railway Postgres free tier happy).
 *
 * To enable Google OAuth:
 *   1. Create project at console.cloud.google.com
 *   2. Add OAuth 2.0 credentials
 *   3. Authorised redirect URI: https://notworms.com/api/auth/callback/google
 *   4. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { authConfig } from '@/lib/auth.config'
import { queryOne } from '@/lib/db'

// ─── DB user shape ────────────────────────────────────────────────────────────
interface DBUser {
  id: string
  name: string | null
  email: string
  password_hash: string | null
  image: string | null
  image_credits: number
  created_at: string
}

// ─── NextAuth export ──────────────────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    // ── Email / Password ────────────────────────────────────────────────────
    Credentials({
      name: 'Email & Password',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        if (!email || !password) return null

        const user = await queryOne<DBUser>(
          'SELECT id, name, email, password_hash, image, image_credits, created_at FROM users WHERE email = $1',
          [email.toLowerCase().trim()]
        )

        if (!user || !user.password_hash) return null

        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatch) return null

        return {
          id:           user.id,
          name:         user.name,
          email:        user.email,
          image:        user.image,
          imageCredits: user.image_credits,
          memberSince:  user.created_at,
          avatarUrl:    user.image,
        }
      },
    }),

    // ── Google OAuth (only active when env vars present) ────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
              // Upsert user in Postgres on Google sign-in
              let user = await queryOne<DBUser>(
                'SELECT id, name, email, image, image_credits, created_at FROM users WHERE email=$1',
                [profile.email]
              )

              if (!user) {
                user = await queryOne<DBUser>(
                  `INSERT INTO users (name, email, image, image_credits, email_verified)
                   VALUES ($1, $2, $3, 3, NOW())
                   RETURNING id, name, email, image, image_credits, created_at`,
                  [profile.name, profile.email, profile.picture]
                )
              }

              return {
                id:           user!.id,
                name:         user!.name,
                email:        user!.email,
                image:        user!.image,
                imageCredits: user!.image_credits,
                memberSince:  user!.created_at,
                avatarUrl:    user!.image,
              }
            },
          }),
        ]
      : []),
  ],

  events: {
    // Refresh credit count from DB on every sign-in so it's current in JWT
    async signIn({ user }) {
      if (!user?.id) return
      const fresh = await queryOne<{ image_credits: number }>(
        'SELECT image_credits FROM users WHERE id=$1',
        [user.id]
      )
      if (fresh) {
        (user as { imageCredits?: number }).imageCredits = fresh.image_credits
      }
    },
  },
})
