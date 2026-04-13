'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Zap, CreditCard } from 'lucide-react'
import { CREDIT_BUNDLES } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface CreditBundlesProps {
  currentCredits: number
}

export function CreditBundles({ currentCredits }: CreditBundlesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handlePurchase = async (bundleId: string, priceId: string) => {
    setLoadingId(bundleId)
    try {
      // TODO: POST /api/stripe/checkout to create a Stripe Checkout session
      // const res = await fetch('/api/stripe/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId }),
      // })
      // const { url } = await res.json()
      // window.location.href = url

      // Placeholder: alert until Stripe is wired
      alert(`Stripe checkout for ${bundleId} coming soon.\nPrice ID: ${priceId}`)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-teal-600" />
        <h3 className="text-sm font-semibold text-slate-800">Buy More Credits</h3>
      </div>

      {/* Current balance */}
      <div className="px-5 py-3 bg-teal-50 border-b border-teal-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-teal-700">Current balance</span>
          <span className="text-sm font-bold text-teal-700">{currentCredits} credits</span>
        </div>
        <div className="h-1.5 bg-teal-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (currentCredits / 25) * 100)}%` }}
          />
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        {CREDIT_BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className={cn(
              'relative flex items-center justify-between rounded-xl border px-4 py-3 transition-all',
              bundle.highlight
                ? 'border-teal-400 bg-teal-50 ring-1 ring-teal-400/30'
                : 'border-slate-200 hover:border-teal-200 bg-white'
            )}
          >
            {bundle.badge && (
              <span className={cn(
                'absolute -top-2.5 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full',
                bundle.highlight
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              )}>
                {bundle.badge}
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                bundle.highlight ? 'bg-teal-600' : 'bg-slate-100'
              )}>
                <Zap className={cn('w-4 h-4', bundle.highlight ? 'text-white' : 'text-slate-500')} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{bundle.credits} credits</p>
                <p className="text-[11px] text-slate-400">{bundle.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-teal-600">${bundle.price}</span>
              <Button
                size="sm"
                onClick={() => handlePurchase(bundle.id, bundle.priceId)}
                disabled={loadingId === bundle.id}
                className={cn(
                  'h-7 px-3 text-xs font-semibold',
                  bundle.highlight
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                )}
              >
                {loadingId === bundle.id
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : 'Buy'}
              </Button>
            </div>
          </div>
        ))}

        <p className="text-[10px] text-center text-slate-400 mt-1">
          All prices AUD · Secure payment via Stripe · No subscription
        </p>
      </div>
    </div>
  )
}
