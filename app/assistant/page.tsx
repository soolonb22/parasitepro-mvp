import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Microscope,
  MessageCircle,
  Brain,
  MapPin,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Globe,
  Stethoscope,
  AlertTriangle,
} from 'lucide-react'

const PARA_CAPABILITIES = [
  {
    icon: Brain,
    title: 'Symptom Assessment',
    desc: 'Describe what you're experiencing in plain language — PARA interprets symptoms and provides structured findings based on clinical parasitology.',
    examples: ['Thread-like worms in stool', 'Itchy crawling sensation at night', 'Raised red tracks on skin after travel'],
  },
  {
    icon: MapPin,
    title: 'Australian Geographic Context',
    desc: 'PARA is trained on Australian endemic species, Queensland tropical conditions, and parasites common after travel to SE Asia and the Pacific.',
    examples: ['Queensland wet season risks', 'Bali belly vs parasitic infection', 'Northern Australian hookworm prevalence'],
  },
  {
    icon: Stethoscope,
    title: 'GP Preparation',
    desc: 'Get structured notes on what to tell your GP, what tests to ask about, and how to describe your symptoms clearly.',
    examples: ['What to say about stool observations', 'Which specialist to request', 'Tests your GP might order'],
  },
  {
    icon: Globe,
    title: 'Travel Health',
    desc: 'Concerned about something picked up overseas? PARA understands common travel-related parasitic infections affecting Australians.',
    examples: ['Post-Bali gut symptoms', 'Southeast Asia soil-transmitted helminths', 'Tropical fish tank risks'],
  },
  {
    icon: ShieldCheck,
    title: 'Pet Zoonotic Risks',
    desc: 'Learn which pet parasites can affect humans (zoonotic transmission) and when you need to act.',
    examples: ['Dog roundworm transmission to kids', 'Cat toxoplasmosis risks during pregnancy', 'Flea tapeworm in children'],
  },
  {
    icon: BookOpen,
    title: 'Evidence-Based Education',
    desc: 'Every response is grounded in clinical parasitology literature and Australian health guidelines — not internet forum speculation.',
    examples: ['CDC and WHO parasite guidelines', 'Australian Government health resources', 'Tropical medicine evidence base'],
  },
]

const SAMPLE_RESPONSES = [
  {
    q: 'What are the signs my child might have pinworm?',
    a: '**Pinworm (Enterobius vermicularis)** is the most common worm infection in Australian children. Key signs include intense perianal itching (especially at night), disturbed sleep, irritability, and occasionally visible thin white threads around the anus or in underwear after sleep. The "sticky tape test" done first thing in the morning is the standard confirmatory method — ask your GP about this.',
    urgency: '🟡 MODERATE',
  },
  {
    q: 'I\'ve come back from Bali with severe stomach cramps for 3 weeks',
    a: 'Three weeks of persistent gut symptoms post-Bali raises concern for **Giardia lamblia** (a common waterborne protozoan), Cryptosporidium, or less commonly intestinal helminths. Giardia often presents as bloating, greasy floating stools, and fatigue lasting weeks. This warrants **stool microscopy testing via your GP** — a simple stool sample test can confirm this.',
    urgency: '🟡 MODERATE',
  },
]

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-slate-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Microscope className="w-8 h-8 text-teal-300" />
          </div>
          <Badge className="mb-4 bg-teal-500/20 text-teal-200 border-teal-500/30">Meet PARA</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Your AI Parasite <br />
            <span className="text-teal-400">Educational Guide</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            PARA is trained in clinical parasitology, tropical medicine, and Australian endemic conditions.
            Get evidence-based educational information to help you understand your concerns and prepare for your GP.
          </p>
          <Link href="/chat">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 shadow-lg">
              <MessageCircle className="w-4.5 h-4.5 mr-2" />
              Chat with PARA — Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mx-auto" />
          <p className="text-xs text-amber-800 text-center w-full">
            <strong>Educational tool only.</strong> PARA does not provide medical diagnosis. Always consult a qualified Australian GP or specialist for health concerns.
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">What PARA can help with</h2>
            <p className="text-slate-500">Six core areas of educational support</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARA_CAPABILITIES.map((cap, i) => (
              <Card key={i} className="border-slate-200 hover:border-teal-200 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                    <cap.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{cap.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{cap.desc}</p>
                  <ul className="space-y-1">
                    {cap.examples.map((ex, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3 h-3 text-teal-500 mt-0.5 shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample responses */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Example responses</h2>
            <p className="text-slate-500 text-sm">The kind of clear, structured answers PARA provides.</p>
          </div>
          <div className="space-y-6">
            {SAMPLE_RESPONSES.map((sample, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* User question */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-white font-bold">Q</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium italic">"{sample.q}"</p>
                </div>
                {/* PARA answer */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                      <Microscope className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-teal-700">PARA</span>
                    <Badge className="text-[10px] bg-slate-100 text-slate-500 border-0">{sample.urgency}</Badge>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sample.a.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                  <p className="text-xs text-slate-400 mt-3 italic">
                    ⚠️ Educational assessment only — always consult a qualified healthcare professional.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold mb-3">Ready to ask PARA?</h2>
          <p className="text-teal-100 text-sm mb-6">
            Free, no account required. Get educational information to help you prepare for your GP visit.
          </p>
          <Link href="/chat">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-8">
              <MessageCircle className="w-4.5 h-4.5 mr-2" />
              Start Free Chat
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
