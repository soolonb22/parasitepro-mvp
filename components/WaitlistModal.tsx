'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Mail, CheckCircle2, Loader2 } from 'lucide-react'

interface WaitlistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      if (!res.ok) throw new Error('Failed to join waitlist')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again or email support@notworms.com')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after close animation
    setTimeout(() => {
      setSuccess(false)
      setEmail('')
      setName('')
      setError('')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!success ? (
          <>
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <DialogTitle className="font-display text-xl text-slate-800">
                  AI Analyser — Coming Soon
                </DialogTitle>
              </div>
              <DialogDescription className="text-slate-600 leading-relaxed">
                Our full AI image analyser is launching in the next few days.
                Join the waitlist for <strong className="text-teal-700">early access + 3 free credits</strong> when we go live.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800 mt-1">
              💬 In the meantime, try our{' '}
              <a href="/chat" className="font-semibold underline underline-offset-2 hover:text-teal-600" onClick={handleClose}>
                free AI chatbot
              </a>{' '}
              — ask PARA anything about parasites, symptoms, or when to see a GP.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="waitlist-name" className="text-sm font-medium text-slate-700">
                  First name <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="waitlist-name"
                  type="text"
                  placeholder="e.g. Sarah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="waitlist-email" className="text-sm font-medium text-slate-700">
                  Email address <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="waitlist-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining waitlist…
                  </>
                ) : (
                  'Join the Waitlist — Get Early Access'
                )}
              </Button>

              <p className="text-xs text-center text-slate-400">
                No spam. One email when we launch. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-teal-600" />
            </div>
            <DialogTitle className="font-display text-xl text-slate-800 mb-2">
              You're on the list!
            </DialogTitle>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We'll email <strong className="text-slate-800">{email}</strong> the moment the AI Analyser goes live.
              You'll get <strong className="text-teal-700">3 free credits</strong> as an early access member.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800 mb-4">
              While you wait —{' '}
              <a
                href="/chat"
                className="font-semibold underline underline-offset-2 hover:text-teal-600"
                onClick={handleClose}
              >
                try the free PARA chatbot ↗
              </a>
            </div>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
