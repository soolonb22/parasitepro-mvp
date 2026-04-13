'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Microscope, LayoutDashboard, LogOut, User, ChevronDown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/chat',               label: 'Free Chatbot' },
  { href: '/analyzer',           label: 'AI Analyser' },
  { href: '/encyclopedia',       label: 'Encyclopedia' },
  { href: '/travel',             label: 'Travel Map' },
  { href: '/journal',            label: 'Journal' },
  { href: '/treatment-tracker',  label: 'Treatment Tracker' },
  { href: '/research',           label: 'Research Library' },
]

function UserMenu({ name, email, credits, avatarUrl }: {
  name: string | null; email: string | null; credits: number; avatarUrl: string | null
}) {
  const [open, setOpen] = useState(false)
  const initials = (name ?? email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-teal-50 transition-colors group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
          {avatarUrl
            ? <img src={avatarUrl} alt={name ?? ''} className="w-full h-full object-cover" />
            : initials}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight max-w-[100px] truncate">
            {name ?? email ?? 'My Account'}
          </p>
          <p className="text-[10px] text-teal-600 leading-tight flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5" />
            {credits} credit{credits !== 1 ? 's' : ''}
          </p>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 py-1.5 z-40">
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800 truncate">{name ?? 'My Account'}</p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${Math.min(100, (credits / 25) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{credits} credits</span>
              </div>
            </div>

            {/* Links */}
            {[
              { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { href: '/dashboard?tab=profile', icon: User, label: 'Profile & Settings' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <div className="border-t border-slate-100 mt-1.5 pt-1.5">
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function Navbar() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const isLoading = status === 'loading'
  const isLoggedIn = !!session?.user

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md group-hover:shadow-teal-300 transition-shadow">
              <Microscope className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg text-slate-800">
              Parasite<span className="text-teal-600">Pro</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="w-24 h-8 bg-slate-100 rounded-xl animate-pulse" />
            ) : isLoggedIn ? (
              <UserMenu
                name={session.user.name ?? null}
                email={session.user.email ?? null}
                credits={session.user.imageCredits ?? 0}
                avatarUrl={session.user.avatarUrl ?? null}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal-700">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                    Get started →
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-2 mt-6">
                {/* Mobile user info */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                      {session.user.avatarUrl
                        ? <img src={session.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : (session.user.name ?? session.user.email ?? 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{session.user.name ?? 'My Account'}</p>
                      <p className="text-xs text-teal-600 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {session.user.imageCredits} credit{session.user.imageCredits !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {!isLoggedIn && (
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                      <Microscope className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-display font-semibold text-slate-800">
                      Parasite<span className="text-teal-600">Pro</span>
                    </span>
                  </div>
                )}

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">Sign in</Button>
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                          Get started free →
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
