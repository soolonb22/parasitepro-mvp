import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Shield, Lock, Eye, Trash2, Mail, AlertTriangle } from 'lucide-react'

const LAST_UPDATED = '13 April 2025'
const EFFECTIVE_DATE = '13 April 2025'

export const metadata = {
  title: 'Privacy Policy — ParasitePro (notworms.com)',
  description: 'How ParasitePro collects, uses, and protects your personal information under Australian Privacy Law.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-teal-100 text-teal-800 border-teal-300">Legal</Badge>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-7 h-7 text-teal-600" />
            <h1 className="font-display text-3xl font-bold text-slate-900">Privacy Policy</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong> · Effective: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Operated by ParasitePro (notworms.com) · ABN: [Pending] · support@notworms.com
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Disclaimer callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Educational Tool Only</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                ParasitePro is an educational information service, not a medical diagnosis platform and not a registered medical device under the Therapeutic Goods Administration (TGA) Software as a Medical Device (SaMD) framework. All assessments are for educational purposes only.
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                About This Policy
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 leading-relaxed space-y-3">
                <p>
                  This Privacy Policy explains how ParasitePro (trading as notworms.com, "we", "us", "our") collects, uses, holds, and discloses personal information in accordance with the <strong>Australian Privacy Act 1988 (Cth)</strong> and the <strong>Australian Privacy Principles (APPs)</strong>.
                </p>
                <p>
                  By using ParasitePro, you consent to the collection and use of your personal information as described in this policy. If you do not agree, please do not use our service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                Information We Collect
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">2.1 Information You Provide</h3>
                  <ul className="space-y-1.5 text-slate-600 list-none pl-0">
                    {[
                      'Email address (for account creation and waitlist)',
                      'Name (optional, for personalisation)',
                      'Images uploaded for AI visual assessment',
                      'Text descriptions of symptoms or concerns submitted via chatbot',
                      'Payment information (processed securely via Stripe — we do not store card details)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">2.2 Information Collected Automatically</h3>
                  <ul className="space-y-1.5 text-slate-600 list-none pl-0">
                    {[
                      'IP address and approximate geographic location (state/territory level only)',
                      'Browser type and device information',
                      'Pages visited and time spent on site',
                      'Referring URLs',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">2.3 Sensitive Information</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Images and symptom descriptions may constitute <strong>sensitive information</strong> under the Privacy Act as they relate to health matters. We handle this information with heightened care and do not use it for purposes unrelated to providing the educational assessment service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                How We Use Your Information
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p>We use your personal information only for purposes directly related to the service:</p>
                <ul className="space-y-1.5 text-slate-600 list-none pl-0">
                  {[
                    'Providing AI-assisted educational visual assessments',
                    'Operating the PARA chatbot and educational service',
                    'Processing credit purchases and managing your account',
                    'Sending transactional emails (account confirmation, waitlist notifications)',
                    'Improving the accuracy and quality of educational assessments',
                    'Complying with legal obligations',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-slate-500 text-xs leading-relaxed mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>We do not:</strong> sell your personal information to third parties, use your health-related images for advertising targeting, or share your information with healthcare providers, insurers, or government agencies without your explicit consent or a legal requirement to do so.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                Third Party Services
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700">
                <p className="mb-3 text-slate-600">We use the following trusted third-party providers:</p>
                <div className="space-y-3">
                  {[
                    { name: 'Anthropic (Claude API)', use: 'AI analysis and chatbot responses — text and image data is processed on Anthropic\'s servers. See Anthropic\'s privacy policy.' },
                    { name: 'Cloudinary', use: 'Secure image hosting and processing. Images uploaded for analysis are stored temporarily and can be deleted upon request.' },
                    { name: 'Stripe', use: 'Secure payment processing. We do not store your card details. Stripe is PCI DSS compliant.' },
                    { name: 'Vercel', use: 'Web hosting and deployment infrastructure. Located in the United States.' },
                    { name: 'Railway', use: 'Backend API hosting. Database stored in Australia where available.' },
                  ].map((provider, i) => (
                    <div key={i} className="border border-slate-100 rounded-lg px-4 py-3">
                      <p className="font-semibold text-slate-800 text-xs">{provider.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{provider.use}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">5</span>
                Data Storage &amp; Security
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="text-slate-600 leading-relaxed">
                  We implement industry-standard security measures including TLS encryption for data in transit, encrypted database storage, and restricted access controls. Images uploaded for analysis are stored securely and are not publicly accessible.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Some data may be stored on servers outside Australia (including in the United States) due to our use of third-party cloud providers. We take reasonable steps to ensure overseas recipients handle your information consistently with the Australian Privacy Principles.
                </p>
                <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <Lock className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All uploaded images are encrypted at rest. Chat conversations are not permanently stored beyond your active session unless you are logged in, in which case they are associated with your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">6</span>
                Your Rights
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700">
                <p className="mb-4 text-slate-600">Under the Australian Privacy Act, you have the right to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Eye, title: 'Access', desc: 'Request a copy of the personal information we hold about you' },
                    { icon: Shield, title: 'Correction', desc: 'Request correction of inaccurate or incomplete information' },
                    { icon: Trash2, title: 'Deletion', desc: 'Request deletion of your account and associated data' },
                    { icon: Mail, title: 'Complaint', desc: 'Lodge a complaint if you believe we have breached your privacy' },
                  ].map((right, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <right.icon className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{right.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  To exercise any of these rights, contact us at <a href="mailto:support@notworms.com" className="text-teal-600 underline">support@notworms.com</a>. We will respond within 30 days. If you are unsatisfied with our response, you may complain to the <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Office of the Australian Information Commissioner (OAIC)</a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">7</span>
                Children's Privacy
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700">
                <p className="text-slate-600 leading-relaxed">
                  ParasitePro is not directed at children under 13. If you are a parent or guardian using the service on behalf of a child, you are responsible for the information submitted. We do not knowingly collect personal information from children under 13 without verifiable parental consent.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">8</span>
                Changes to This Policy
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700">
                <p className="text-slate-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Material changes will be communicated via email (if you have an account) or by prominent notice on the website. Continued use of the service after changes indicates your acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">9</span>
                Contact Us
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-sm">
                <p className="text-teal-800 mb-2">For privacy enquiries or requests, contact:</p>
                <p className="font-semibold text-teal-900">ParasitePro — Privacy Officer</p>
                <p className="text-teal-700">
                  Email: <a href="mailto:support@notworms.com" className="underline">support@notworms.com</a>
                </p>
                <p className="text-teal-700">Website: notworms.com</p>
              </div>
            </section>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-slate-400">
            <Link href="/terms" className="hover:text-teal-600 underline">Terms of Service</Link>
            <span>·</span>
            <Link href="/" className="hover:text-teal-600">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
