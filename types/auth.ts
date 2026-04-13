import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

// ─── Extend NextAuth session / JWT with ParasitePro fields ───────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      imageCredits: number
      memberSince: string
      avatarUrl: string | null
      isGuest: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    imageCredits: number
    memberSince: string
    avatarUrl: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    imageCredits: number
    memberSince: string
    avatarUrl: string | null
  }
}

// ─── App-level user type (used in components) ────────────────────────────────

export interface AppUser {
  id: string
  name: string | null
  email: string | null
  imageCredits: number
  memberSince: string
  avatarUrl: string | null
  isGuest: false
}

export interface GuestUser {
  isGuest: true
  name: 'Guest'
  email: null
  imageCredits: 0
  memberSince: null
  avatarUrl: null
}

export type CurrentUser = AppUser | GuestUser

// ─── Route protection tiers ───────────────────────────────────────────────────

/**
 * PUBLIC: No auth required, no restrictions.
 * GUEST_ALLOWED: Accessible without login; unauthenticated users see
 *   a "sign up to save" banner but can still use the feature.
 * PROTECTED: Must be logged in; guests redirect to /login?next=<route>.
 */
export type RouteAccess = 'public' | 'guest_allowed' | 'protected'

export const ROUTE_ACCESS_MAP: Record<string, RouteAccess> = {
  '/':           'public',
  '/research':   'public',
  '/assistant':  'public',
  '/privacy':    'public',
  '/terms':      'public',
  '/chat':       'guest_allowed',   // Free chatbot — guests allowed, save prompt shown
  '/analyzer':   'protected',       // Requires login (uses credits)
  '/dashboard':  'protected',       // Requires login
}
