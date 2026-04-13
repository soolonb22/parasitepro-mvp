'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { WaitlistModal } from '@/components/WaitlistModal'
import {
  Microscope,
  MessageCircle,
  Upload,
  Shield,
  MapPin,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Zap,
  Globe,
  Users,
  Clock,
} from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Free AI Chatbot',
    desc: 'Ask PARA anything — symptoms, identification, when to see a GP. No upload required.',
    href: '/chat',
    cta: 'Chat Now',
    badge: 'Free',
    color: 'teal',
  },
  {
    icon: Upload,
    title: 'AI Image Analyser',
    desc: 'Upload photos of stool samples, skin rashes, or bites for a structured educational assessment.',
    href: '/analyzer',
    cta: 'Join Waitlist',
    badge: 'Launching Soon',
    color: 'navy',
  },
  {
    icon: BookOpen,
    title: 'Research Library',
    desc: 'Evidence-based educational articles on Australian parasites, tropical diseases, and prevention.',
    href: '/research',
    cta: 'Explore',
    badge: 'Free',
    color: 'green',
  },
]

const trustPoints = [
  { icon: Shield, text: 'TGA SaMD Compliant — educational tool, not a medical device' },
  { icon: AlertTriangle, text: 'AHPRA advertising guidelines observed throughout' },
  { icon: CheckCircle, text: 'No diagnosis made — assessments only, always refer to GP' },
  { icon: Globe, text: 'Built specifically for Australian conditions and parasites' },
]

const pricingTiers = [
  {
    name: 'Chatbot',
    price: 'Free',
    desc: 'Always free',
    features: ['Unlimited PARA conversations', 'Symptom guidance', 'GP prep advice', 'No account needed'],
    cta: 'Start Chatting',
    href: '/chat',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$6',
    desc: '5 image analyses',
    features: ['5 AI image analyses', 'Structured PDF reports', 'Differential diagnoses', 'Urgency classification'],
    cta: 'Get Started',
    href: '/analyzer',
    highlight: false,
  },
  {
    name: 'Popular',
    price: '$10',
    desc: '10 image analyses',
    features: ['10 AI image analyses', 'Everything in Starter', 'Priority processing', 'Save & share reports'],
    cta: 'Most Popular',
    href: '/analyzer',
    highlight: true,
  },
  {
    name: 'Value',
    price: '$25',
    desc: '25 image analyses',
    features: ['25 AI image analyses', 'Everything in Popular', 'Export to GP referral notes', 'Bulk household use'],
    cta: 'Best Value',
    href: '/analyzer',
    highlight: false,
  },
]

const stats = [
  { icon: Users, value: '10,000+', label: 'Australians helped' },
  { icon: MapPin, value: 'QLD focused', label: 'Tropical region expertise' },
  { icon: Clock, value: '< 60 sec', label: 'Assessment turnaround' },
  { icon: Zap, value: '24/7', label: 'Always available' },
]

export default function HomePage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative bg-mesh min-h-[92vh] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[5%] w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-[8%] w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <Badge className="mb-4 bg-teal-100 text-teal-800 border-teal-300 font-medium px-3 py-1 animate-fade-in-up">
                🇦🇺 Built for Australians
              </Badge>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-slate-900 leading-tight mb-6 animate-fade-in-up-delay-1">
                G'day! I'm{' '}
                <span className="text-gradient">PARA</span>
                <span className="block text-3xl sm:text-4xl lg:text-[2.8rem] mt-1">
                  Your AI Parasite Guide
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg animate-fade-in-up-delay-2">
                Concerned about a rash, something in a stool sample, or a bite that's playing on your mind?
                Get a structured, educational assessment to help you <strong className="text-slate-800">prepare for your GP visit</strong> — in under 60 seconds.
              </p>

              {/* Educational disclaimer inline */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 animate-fade-in-up-delay-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Educational tool only — not a medical diagnosis.</strong>{' '}
                  Always consult a qualified healthcare professional. In an emergency, call 000.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up-delay-3">
                {/* PRIMARY: Free Chatbot — always live */}
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-7 shadow-md hover:shadow-teal-200 transition-all pulse-ring"
                  >
                    <MessageCircle className="w-4.5 h-4.5 mr-2" />
                    Try the Free AI Chatbot
                  </Button>
                </Link>

                {/* SECONDARY: Analyser waitlist */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setWaitlistOpen(true)}
                  className="w-full sm:w-auto border-teal-300 text-teal-700 hover:bg-teal-50 font-semibold px-7"
                >
                  <Upload className="w-4.5 h-4.5 mr-2" />
                  Start Free Analysis
                  <Badge className="ml-2 bg-teal-100 text-teal-700 text-[10px] px-1.5 py-0.5 border-0">
                    Soon
                  </Badge>
                </Button>
              </div>

              {/* Social proof micro-copy */}
              <p className="text-xs text-slate-400 mt-4 animate-fade-in-up-delay-3">
                No credit card required for chatbot · Use promo code{' '}
                <code className="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-mono">BETA3FREE</code>{' '}
                for 3 free analysis credits at signup
              </p>
            </div>

            {/* Right: PARA card */}
            <div className="relative animate-fade-in-up-delay-2">
              <div className="bg-white rounded-2xl shadow-2xl shadow-teal-100/60 border border-teal-100 p-6 max-w-sm mx-auto lg:ml-auto">
                {/* Chat preview header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center shadow-md">
                    <Microscope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">PARA</p>
                    <p className="text-xs text-teal-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                      Online · Educational AI
                    </p>
                  </div>
                </div>

                {/* Sample chat bubbles */}
                <div className="space-y-3">
                  <div className="bg-teal-600 text-white text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                    G'day! I'm PARA. Noticed something concerning? I can help you understand what you're looking at and whether you need to see a GP. 🦠
                  </div>
                  <div className="bg-slate-100 text-slate-700 text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] ml-auto">
                    I found something white and thread-like in my child's stool…
                  </div>
                  <div className="bg-teal-600 text-white text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[90%]">
                    That sounds like it could be pinworm (Enterobius vermicularis) — very common in Australian kids. Let me run through the key indicators with you. 📋
                  </div>
                </div>

                {/* Input hint */}
                <div className="mt-4 border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-slate-400 text-sm bg-slate-50">
                  <MessageCircle className="w-4 h-4" />
                  Ask PARA anything…
                </div>

                {/* Link */}
                <Link href="/chat">
                  <Button className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold">
                    Start Free Chat →
                  </Button>
                </Link>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust bar ─── */}
      <section className="bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5 text-slate-300">
                <point.icon className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span className="text-xs leading-relaxed">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-teal-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map((stat, i) => (
              <div key={i}>
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-teal-200" />
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-teal-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-teal-100 text-teal-800 border-teal-300">What ParasitePro Offers</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Three ways to get answers
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Whether you want to chat, upload a photo, or read evidence-based information — we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="group border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className={`w-11 h-11 rounded-xl mb-4 flex items-center justify-center ${
                    feature.color === 'teal' ? 'bg-teal-100' :
                    feature.color === 'navy' ? 'bg-slate-100' : 'bg-green-100'
                  }`}>
                    <feature.icon className={`w-5.5 h-5.5 ${
                      feature.color === 'teal' ? 'text-teal-600' :
                      feature.color === 'navy' ? 'text-slate-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-semibold text-lg text-slate-800">{feature.title}</h3>
                    <Badge className={`text-[10px] ${
                      feature.badge === 'Free' ? 'bg-green-100 text-green-700 border-green-200' :
                      'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{feature.desc}</p>
                  <Link href={feature.href}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all"
                    >
                      {feature.cta}
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              How it works
            </h2>
            <p className="text-slate-500">Simple, fast, and designed with Australian GP prep in mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe or Upload',
                desc: 'Chat with PARA about your symptoms, or upload a clear photo of the sample.',
              },
              {
                step: '02',
                title: 'AI Assessment',
                desc: 'PARA analyses visual features, provides differential findings, and classifies urgency.',
              },
              {
                step: '03',
                title: 'Prepare for Your GP',
                desc: 'Get structured notes, recommended next steps, and a shareable educational report.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px border-t-2 border-dashed border-teal-200 z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 2rem)' }} />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-display font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-200">
                    {item.step}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-teal-100 text-teal-800 border-teal-300">Simple Pricing</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Credit-based, no subscriptions
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              The chatbot is always free. Buy image analysis credits only when you need them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 border transition-all ${
                  tier.highlight
                    ? 'bg-teal-600 border-teal-500 text-white shadow-xl shadow-teal-200'
                    : 'bg-white border-slate-200 hover:border-teal-200 hover:shadow-md'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    ★ Most Popular
                  </div>
                )}
                <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${tier.highlight ? 'text-teal-200' : 'text-teal-600'}`}>
                  {tier.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`font-display text-3xl font-bold ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {tier.price}
                  </span>
                  {tier.price !== 'Free' && (
                    <span className={`text-sm mb-1 ${tier.highlight ? 'text-teal-200' : 'text-slate-400'}`}>AUD</span>
                  )}
                </div>
                <p className={`text-xs mb-5 ${tier.highlight ? 'text-teal-200' : 'text-slate-400'}`}>{tier.desc}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2 text-xs ${tier.highlight ? 'text-teal-100' : 'text-slate-600'}`}>
                      <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.highlight ? 'text-teal-200' : 'text-teal-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.href}>
                  <Button
                    className={`w-full text-sm font-semibold ${
                      tier.highlight
                        ? 'bg-white text-teal-700 hover:bg-teal-50'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Use promo code{' '}
            <code className="bg-teal-100 text-teal-700 px-2 py-1 rounded font-mono">BETA3FREE</code>{' '}
            at signup to receive 3 complimentary analysis credits. · All prices in AUD · No subscription required
          </p>
        </div>
      </section>

      {/* ─── Full disclaimer ─── */}
      <section className="py-12 bg-amber-50 border-t border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="font-display font-semibold text-amber-900 text-lg">
              Important: Educational Tool Disclosure
            </h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed max-w-3xl mx-auto">
            ParasitePro is an <strong>educational information service only</strong> and does not provide medical advice, diagnosis, or treatment.
            All assessments are for educational and informational purposes to help you prepare questions for your healthcare provider.
            ParasitePro is not a registered medical device under the TGA's Software as a Medical Device (SaMD) framework.
            Always consult a qualified Australian GP, specialist, or healthcare professional for medical advice.
            In a medical emergency, call <strong>000</strong> immediately.
          </p>
          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-amber-700">
            <Link href="/terms" className="underline hover:text-amber-900">Terms of Service</Link>
            <Link href="/privacy" className="underline hover:text-amber-900">Privacy Policy</Link>
            <Link href="/research" className="underline hover:text-amber-900">Research Library</Link>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  )
}
