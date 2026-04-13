import { Microscope } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-2xl mx-auto w-full px-4">
      {/* PARA avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md shrink-0 mt-0.5">
        <Microscope className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>

      {/* Bubble */}
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm flex items-center gap-1.5">
        <span className="text-xs text-slate-400 mr-1 font-medium">PARA is thinking</span>
        <span
          className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
          style={{ animationDelay: '160ms', animationDuration: '1s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
          style={{ animationDelay: '320ms', animationDuration: '1s' }}
        />
      </div>
    </div>
  )
}
