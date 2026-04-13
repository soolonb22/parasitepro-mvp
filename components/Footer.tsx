import Link from 'next/link'
import { Microscope, Shield, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Disclaimer banner */}
      <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto text-center text-xs text-amber-200/80 leading-relaxed">
          <Shield className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
          <strong className="text-amber-300">Educational Tool Only.</strong> ParasitePro provides AI-assisted visual assessments for educational purposes only.
          This is <em>not</em> a medical diagnosis service. Always consult a qualified healthcare professional.
          Not a substitute for professional medical advice. In an emergency, call{' '}
          <strong className="text-white">000</strong>.
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <Microscope className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-semibold text-white">
                Parasite<span className="text-teal-400">Pro</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              notworms.com — AI-assisted parasite identification for Australians. Educational use only.
            </p>
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
              <Heart className="w-3 h-3 text-teal-500" />
              Made in Queensland, Australia
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chat" className="hover:text-teal-400 transition-colors">Free AI Chatbot</Link></li>
              <li><Link href="/analyzer" className="hover:text-teal-400 transition-colors">AI Image Analyser</Link></li>
              <li><Link href="/assistant" className="hover:text-teal-400 transition-colors">PARA Assistant</Link></li>
              <li><Link href="/research" className="hover:text-teal-400 transition-colors">Research Library</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/research" className="hover:text-teal-400 transition-colors">Educational Articles</Link></li>
              <li>
                <a href="https://www.health.gov.au" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                  Australian Dept. of Health ↗
                </a>
              </li>
              <li>
                <a href="https://www.tga.gov.au" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                  TGA (Australia) ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li>
                <a href="mailto:support@notworms.com" className="hover:text-teal-400 transition-colors">
                  support@notworms.com
                </a>
              </li>
            </ul>
            <div className="mt-4 text-xs text-slate-500 leading-relaxed">
              TGA SaMD compliant.<br />
              AHPRA advertising guidelines observed.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} ParasitePro (notworms.com). All rights reserved.
          Educational use only. Not a medical device. Not a diagnosis service.
        </div>
      </div>
    </footer>
  )
}
