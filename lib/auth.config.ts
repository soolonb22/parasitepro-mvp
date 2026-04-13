/**
 * auth.config.ts — edge-compatible NextAuth configuration.
 *
 * This file MUST NOT import any Node.js-only modules (bcryptjs, pg, etc.)
 * because it runs in the Edge Runtime for middleware.
 *
 * All Node.js-specific logic (password hashing, DB lookups) lives in lib/auth.ts.
 */
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn:  '/login',
    signOut: '/login',
    error:   '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * Runs in middleware (Edge) — only receives `auth` (the JWT) and `request`.
     * Decides whether to allow or redirect a given request.
     *
     * ROUTE PROTECTION MODEL:
     *   protected      → must be logged in         → redirect /login?next=...
     *   guest_allowed  → allowed, guests see banner
     *   public         → always allowed
     */
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const isLoggedIn = !!auth?.user

      const PROTECTED = ['/dashboard', '/analyzer']
      const isProtected = PROTECTED.some((p) => pathname.startsWith(p))

      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/login', request.nextUrl.origin)
        loginUrl.searchParams.set('next', pathname)
        return Response.redirect(loginUrl)
      }

      return true // Allow everything else
    },

    // JWT callback — shape what ends up in the token
    jwt({ token, user }) {
      if (user) {
        token.id            = user.id
        token.imageCredits  = (user as { imageCredits?: number }).imageCredits  ?? 3
        token.memberSince   = (user as { memberSince?: string }).memberSince    ?? new Date().toISOString()
        token.avatarUrl     = (user as { avatarUrl?: string | null }).avatarUrl ?? null
      }
      return token
    },

    // Session callback — expose token fields to client
    session({ session, token }) {
      session.user.id           = token.id as string
      session.user.imageCredits = token.imageCredits as number
      session.user.memberSince  = token.memberSince as string
      session.user.avatarUrl    = token.avatarUrl as string | null
      session.user.isGuest      = false
      return session
    },
  },

  providers: [], // Providers added in lib/auth.ts (Node runtime only)
}
