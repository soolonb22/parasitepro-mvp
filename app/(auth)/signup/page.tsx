'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Microscope, Mail, Lock, User, Tag, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8,             label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p),           label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p),           label: 'One number' },
]

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'
  const prefilledPromo = searchParams.get('promo') ?? ''

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [promo, setPromo]         = useState(prefilledPromo)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const passwordValid = PASSWORD_RULES.every((r) => r.test(password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Email and password are required.'); return }
    if (!passwordValid) { setError('Please meet all password requirements.'); return }

    setLoading(true)
    setError('')

    // 1. Register
    const regRes = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, promoCode: promo }),
    })
    const regData = await regRes.json()

    if (!regRes.ok) {
      setError(regData.error ?? 'Registration failed. Please try again.')
      setLoading(false)
      return
    }

    // 2. Auto sign-in
    const signInRes = await signIn('credentials', {
      email, password,
      redirect: false,
    })

    if (signInRes?.error) {
      // Registration succeeded but auto sign-in failed — redirect to login
      router.push(`/login?next=${next}`)
      return
    }

    setSuccess(true)
    router.push(next)
    router.refresh()
  }

  const handleGoogle = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: next })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
              <Microscope className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-slate-800">
              Parasite<span className="text-teal-600">Pro</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Free account · Use code <code className="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-mono text-xs">BETA3FREE</code> for 3 free credits
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-8">
          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-11 border-slate-300 font-medium text-slate-700 hover:bg-slate-50 mb-5"
          >
            <svg className="w-4.5 h-4.5 mr-2.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400 font-medium">or create with email</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                First name <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="pl-9 border-slate-200 focus:border-teal-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9 border-slate-200 focus:border-teal-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="pl-9 pr-10 border-slate-200 focus:border-teal-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-3 mt-1.5 flex-wrap">
                  {PASSWORD_RULES.map((rule) => (
                    <span
                      key={rule.label}
                      className={`flex items-center gap-1 text-[10px] font-medium ${
                        rule.test(password) ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className={`w-3 h-3 ${rule.test(password) ? 'text-teal-500' : 'text-slate-300'}`} />
                      {rule.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Promo code <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder="e.g. BETA3FREE"
                  className="pl-9 border-slate-200 focus:border-teal-400 font-mono uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Code <code className="text-teal-600">BETA3FREE</code> gives you 3 free analysis credits.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !passwordValid}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold mt-1"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account — it\'s free'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-600" /></div>}>
      <SignupForm />
    </Suspense>
  )
}
