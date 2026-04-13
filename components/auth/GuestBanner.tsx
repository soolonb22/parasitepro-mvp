'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X, Bookmark } from 'lucide-react'

interface GuestBannerProps {
  /** The page the user is on — affects banner copy */
  page?: 'chat' | 'analyzer'
}

export function GuestBanner({ page = 'chat' }: GuestBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-teal-700 text-white px-4 py-2.5 flex items-center gap-3 shrink-0">
      <Bookmark className="w-4 h-4 text-teal-300 shrink-0" />
      <p className="text-xs flex-1 leading-snug">
        {page === 'chat'
          ? 'You\'re chatting as a guest — your conversation won\'t be saved. '
          : 'Sign in to use the analyser and save your reports. '}
        <Link href="/signup" className="font-semibold underline underline-offset-2 hover:text-teal-200">
          Create a free account
        </Link>
        {' '}or{' '}
        <Link href="/login" className="font-semibold underline underline-offset-2 hover:text-teal-200">
          sign in
        </Link>.
      </p>
      {page === 'chat' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          className="text-teal-300 hover:text-white hover:bg-teal-600 h-6 w-6 shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  )
}
