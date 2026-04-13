/**
 * middleware.ts — Next.js 15 Edge Middleware
 *
 * Uses NextAuth v5's built-in middleware support.
 * The `authorized` callback in lib/auth.config.ts handles all route-level logic:
 *
 *   /dashboard  → protected  (redirect to /login?next=/dashboard)
 *   /analyzer   → protected  (redirect to /login?next=/analyzer)
 *   /chat       → guest_allowed (accessible without login; GuestBanner shown in-page)
 *   everything else → public
 *
 * The matcher excludes static files and Next.js internals so middleware
 * only runs on real page/API requests.
 */
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico, robots.txt, sitemap.xml
     *   - Public image assets
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
}
