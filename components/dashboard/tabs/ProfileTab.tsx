'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  User, Mail, Lock, Download, Trash2, CheckCircle2,
  AlertTriangle, Loader2, Eye, EyeOff, Shield,
  Bell, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, desc, icon: Icon, children, accent = false }: {
  title: string
  desc?: string
  icon: React.ElementType
  children: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border overflow-hidden',
      accent ? 'border-red-200' : 'border-slate-200'
    )}>
      <div className={cn(
        'px-6 py-4 border-b',
        accent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'
      )}>
        <div className="flex items-center gap-2.5">
          <Icon className={cn('w-4.5 h-4.5', accent ? 'text-red-500' : 'text-teal-600')} />
          <div>
            <h3 className={cn('text-sm font-semibold', accent ? 'text-red-800' : 'text-slate-800')}>{title}</h3>
            {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
          </div>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

// ─── Inline feedback pill ──────────────────────────────────────────────────────
function Feedback({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={cn(
      'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm mt-3',
      type === 'success'
        ? 'bg-teal-50 border border-teal-200 text-teal-800'
        : 'bg-red-50 border border-red-200 text-red-800'
    )}>
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
        : <AlertTriangle className="w-4 h-4 shrink-0" />}
      {message}
    </div>
  )
}

export function ProfileTab() {
  const { data: session, update: updateSession } = useSession()
  const user = session?.user

  // ── Profile state ────────────────────────────────────────────────────────
  const [name, setName] = useState(user?.name ?? '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleProfileSave = async () => {
    setProfileLoading(true)
    setProfileFeedback(null)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Refresh the session so Navbar updates
      await updateSession({ name: name.trim() })
      setProfileFeedback({ type: 'success', msg: 'Profile updated successfully.' })
    } catch (err) {
      setProfileFeedback({ type: 'error', msg: (err as Error).message })
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Password state ───────────────────────────────────────────────────────
  const [currentPw, setCurrentPw]   = useState('')
  const [newPw, setNewPw]           = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw]   = useState(false)
  const [pwLoading, setPwLoading]   = useState(false)
  const [pwFeedback, setPwFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handlePasswordChange = async () => {
    setPwLoading(true)
    setPwFeedback(null)
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCurrentPw('')
      setNewPw('')
      setPwFeedback({ type: 'success', msg: 'Password updated. You may need to sign in again.' })
    } catch (err) {
      setPwFeedback({ type: 'error', msg: (err as Error).message })
    } finally {
      setPwLoading(false)
    }
  }

  // ── Export ───────────────────────────────────────────────────────────────
  const [exportLoading, setExportLoading] = useState(false)

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const res = await fetch('/api/user/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `parasitepro-export-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportLoading(false)
    }
  }

  // ── Delete account ───────────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteFeedback, setDeleteFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [showDeletePanel, setShowDeletePanel] = useState(false)

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteFeedback(null)
    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await signOut({ callbackUrl: '/?deleted=1' })
    } catch (err) {
      setDeleteFeedback({ type: 'error', msg: (err as Error).message })
    } finally {
      setDeleteLoading(false)
    }
  }

  const memberDate = user?.memberSince
    ? new Intl.DateTimeFormat('en-AU', { month: 'long', year: 'numeric' }).format(new Date(user.memberSince))
    : 'Unknown'

  return (
    <div className="space-y-5 max-w-2xl">

      {/* ── Profile info ───────────────────────────────────────────────── */}
      <Section icon={User} title="Profile" desc="Your name and account information">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center shadow-md overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white font-display">
                  {(user?.name ?? user?.email ?? 'U').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user?.name ?? 'My Account'}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">Member since {memberDate}</p>
          </div>
        </div>

        {/* Name field */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Display name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="pl-9 border-slate-200 focus:border-teal-400"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={user?.email ?? ''}
                disabled
                className="pl-9 bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
              />
            </div>
            <p className="text-xs text-slate-400">Email cannot be changed. Contact support@notworms.com if needed.</p>
          </div>

          <Button
            onClick={handleProfileSave}
            disabled={profileLoading || !name.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
          >
            {profileLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save changes
          </Button>

          {profileFeedback && <Feedback type={profileFeedback.type} message={profileFeedback.msg} />}
        </div>
      </Section>

      {/* ── Security / Password ──────────────────────────────────────────── */}
      <Section icon={Lock} title="Password" desc="Change your account password">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Current password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="pl-9 pr-10 border-slate-200 focus:border-teal-400"
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type={showNewPw ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="pl-9 pr-10 border-slate-200 focus:border-teal-400"
                placeholder="At least 8 characters"
                minLength={8}
              />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={pwLoading || !currentPw || newPw.length < 8}
            variant="outline"
            className="border-slate-300 font-medium"
          >
            {pwLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Update password
          </Button>

          {pwFeedback && <Feedback type={pwFeedback.type} message={pwFeedback.msg} />}
        </div>
      </Section>

      {/* ── Privacy & compliance ────────────────────────────────────────── */}
      <Section icon={Shield} title="Privacy & Compliance" desc="How your data is handled">
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Your images and assessments are encrypted at rest and in transit. We never share your personal health data with third parties, insurers, or government agencies without your explicit consent or a legal requirement.
          </p>
          <p>
            ParasitePro is not a registered medical device under the TGA Software as a Medical Device framework. All assessments are educational only.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a href="/privacy" className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:underline font-medium">
              Privacy Policy <ExternalLink className="w-3 h-3" />
            </a>
            <a href="/terms" className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:underline font-medium">
              Terms of Service <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Section>

      {/* ── Notifications (placeholder) ─────────────────────────────────── */}
      <Section icon={Bell} title="Notifications" desc="Manage your email preferences">
        <p className="text-sm text-slate-500 mb-3">Email notification preferences — coming soon.</p>
        <div className="space-y-2">
          {[
            { label: 'Analysis complete',            sub: 'When your AI report is ready',         locked: true },
            { label: 'Credit balance low',           sub: 'When you have 1 credit remaining',      locked: true },
            { label: 'New educational articles',     sub: 'Weekly digest from Research Library',   locked: true },
          ].map(({ label, sub }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 opacity-60">
              <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">Soon</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Data export ─────────────────────────────────────────────────── */}
      <Section icon={Download} title="Export Your Data" desc="Download all data we hold about you">
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Download a complete JSON export of your account data — including your profile, all analyzer reports, and chat history. This is provided in accordance with the Australian Privacy Act 1988.
        </p>
        <Button
          onClick={handleExport}
          disabled={exportLoading}
          variant="outline"
          className="border-slate-300 font-medium"
        >
          {exportLoading
            ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Preparing download…</>
            : <><Download className="w-4 h-4 mr-2" />Download my data (JSON)</>}
        </Button>
      </Section>

      {/* ── Danger zone ─────────────────────────────────────────────────── */}
      <Section icon={Trash2} title="Danger Zone" desc="Permanent actions — cannot be undone" accent>
        {!showDeletePanel ? (
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 mb-1">Delete your account</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Permanently deletes your account, all analyzer reports, and chat history. This action cannot be undone. Any unused credits will be forfeited.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDeletePanel(true)}
              className="border-red-300 text-red-600 hover:bg-red-50 font-medium shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />Delete account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                <strong>This is irreversible.</strong> Your account, all reports, and all chat history will be permanently deleted.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Enter your password to confirm
              </Label>
              <Input
                type="password"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Your current password"
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {deleteFeedback && <Feedback type={deleteFeedback.type} message={deleteFeedback.msg} />}

            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {deleteLoading
                  ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  : <Trash2 className="w-4 h-4 mr-2" />}
                Permanently delete my account
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setShowDeletePanel(false); setDeleteConfirm(''); setDeleteFeedback(null) }}
                className="text-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}
