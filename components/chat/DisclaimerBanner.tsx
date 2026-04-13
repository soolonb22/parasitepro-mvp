import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2.5 shrink-0">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 leading-snug flex-1">
        <strong className="font-semibold">Educational tool only — not medical advice.</strong>
        {' '}PARA provides general information to help you prepare for a GP visit. Always consult a qualified healthcare professional for diagnosis or treatment.
        {' '}<strong>In an emergency, call 000.</strong>
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-500 hover:text-amber-700 shrink-0 ml-1 transition-colors"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
