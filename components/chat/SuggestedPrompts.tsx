import { MessageCircle, Bug, Plane, Users, Dog, Leaf } from 'lucide-react'

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

const PROMPTS = [
  {
    icon: Users,
    category: 'Children',
    text: 'What are the signs of pinworm in children?',
    color: 'text-pink-600',
    bg: 'bg-pink-50 hover:bg-pink-100 border-pink-200 hover:border-pink-300',
  },
  {
    icon: Bug,
    category: 'Stool',
    text: 'I found white thread-like things in my stool — what could it be?',
    color: 'text-slate-600',
    bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300',
  },
  {
    icon: Leaf,
    category: 'Skin',
    text: 'I have a red, itchy circular rash after bushwalking — should I worry?',
    color: 'text-green-600',
    bg: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300',
  },
  {
    icon: Plane,
    category: 'Travel',
    text: "I've been to Bali and now have stomach cramps. Could it be a parasite?",
    color: 'text-purple-600',
    bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300',
  },
  {
    icon: Dog,
    category: 'Pets',
    text: 'My dog has worms — could my family catch them too?',
    color: 'text-orange-600',
    bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-300',
  },
  {
    icon: MessageCircle,
    category: 'Queensland',
    text: 'What parasites are most common in Queensland during wet season?',
    color: 'text-teal-600',
    bg: 'bg-teal-50 hover:bg-teal-100 border-teal-200 hover:border-teal-300',
  },
]

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-2 pb-6">
      {/* PARA welcome */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
          <span className="text-3xl">🦠</span>
        </div>
        <h2 className="font-display text-xl font-bold text-slate-800 mb-1">
          G'day! I'm <span className="text-teal-600">PARA</span>
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Your personal guide to ParasitePro. Ask me anything about parasites, symptoms, or when to see a GP.
        </p>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 text-center mb-4">
        Quick questions to get started
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => !disabled && onSelect(prompt.text)}
            disabled={disabled}
            className={`
              group text-left px-4 py-3.5 rounded-xl border transition-all duration-200
              ${prompt.bg}
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`shrink-0 mt-0.5 ${prompt.color}`}>
                <prompt.icon className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${prompt.color} block mb-0.5`}>
                  {prompt.category}
                </span>
                <span className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                  {prompt.text}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
