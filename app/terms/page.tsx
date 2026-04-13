import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, AlertTriangle, ShieldOff, CreditCard, Scale, Mail } from 'lucide-react'

const LAST_UPDATED = '13 April 2025'
const EFFECTIVE_DATE = '13 April 2025'

export const metadata = {
  title: 'Terms of Service — ParasitePro (notworms.com)',
  description: 'Terms of Service for ParasitePro — an Australian educational parasite identification tool. Not a medical diagnosis service.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-teal-100 text-teal-800 border-teal-300">Legal</Badge>
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-7 h-7 text-teal-600" />
            <h1 className="font-display text-3xl font-bold text-slate-900">Terms of Service</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong> · Effective: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="text-slate-500 text-sm mt-1">
            ParasitePro (notworms.com) · ABN: [Pending] · support@notworms.com
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Critical disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800 mb-1">⚠️ NOT A MEDICAL SERVICE — READ BEFORE USING</p>
              <p className="text-xs text-red-700 leading-relaxed">
                ParasitePro is an <strong>educational information tool only</strong>. It does not provide medical advice, diagnosis, treatment, or constitute a medical device under Australian law. Never use ParasitePro as a substitute for professional medical advice. In a medical emergency, call <strong>000</strong> immediately.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                Acceptance of Terms
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="leading-relaxed">
                  By accessing or using ParasitePro (notworms.com, the "Service"), you agree to be bound by these Terms of Service and our Privacy Policy. These terms constitute a legally binding agreement between you and ParasitePro under the laws of Queensland, Australia.
                </p>
                <p className="leading-relaxed">
                  If you do not agree to these terms, do not access or use the Service. By clicking "I Agree", creating an account, or otherwise using the Service, you confirm you have read, understood, and accepted these terms.
                </p>
                <p className="leading-relaxed">
                  These terms are governed by the laws of Queensland, Australia. By using the Service, you submit to the non-exclusive jurisdiction of the courts of Queensland, Australia.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                Nature of Service — Educational Tool Only
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="font-semibold text-slate-800 text-base">
                  ParasitePro is an educational information service only.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-amber-800 text-xs uppercase tracking-wider">The Service does NOT:</p>
                  {[
                    'Provide medical advice, diagnosis, or treatment',
                    'Constitute a medical device or Software as a Medical Device (SaMD) under the Therapeutic Goods Administration (TGA) framework',
                    'Replace consultation with a qualified Australian healthcare professional',
                    'Establish a patient–provider relationship between you and ParasitePro',
                    'Guarantee accuracy of any visual assessment or finding',
                    'Provide emergency medical services (in an emergency, call 000)',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
                      <ShieldOff className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <p className="leading-relaxed text-slate-600">
                  All AI-generated outputs, assessments, chatbot responses, and reports are for <strong>educational and informational purposes only</strong> to help you formulate questions for a qualified healthcare professional. They use language such as "consistent with", "visual pattern suggests", or "most likely" and do not constitute findings of fact or medical conclusions.
                </p>
                <p className="leading-relaxed text-slate-600">
                  ParasitePro complies with AHPRA advertising guidelines. No content on this platform constitutes a health claim, medical testimonial, or endorsement of any medical treatment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                User Responsibilities
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="text-slate-600 leading-relaxed">By using the Service, you agree that you will:</p>
                <ul className="space-y-2 text-slate-600">
                  {[
                    'Use the Service for educational and informational purposes only',
                    'Always consult a qualified Australian healthcare professional for medical advice, diagnosis, or treatment',
                    'Not rely solely on ParasitePro assessments to make healthcare decisions',
                    'Provide accurate information when submitting images or descriptions',
                    'Not upload images of other people without their explicit consent',
                    'Not upload images that are defamatory, obscene, or constitute child exploitation material',
                    'Not attempt to use the Service to obtain a formal medical diagnosis',
                    'Not misrepresent ParasitePro assessments to others as medical diagnoses',
                    'Be 18 years or older, or have parental/guardian consent if under 18',
                    'Comply with all applicable Australian laws in your use of the Service',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                Credits, Payments &amp; Refunds
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="leading-relaxed text-slate-600">
                  Image analysis credits ("Credits") are purchased in bundles and are non-refundable once consumed. Unused Credits do not expire and remain associated with your account.
                </p>
                <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <CreditCard className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All prices are in Australian Dollars (AUD) and include GST where applicable. Payments are processed securely by Stripe. We do not store your payment card details.
                  </p>
                </div>
                <p className="leading-relaxed text-slate-600">
                  <strong>Refund Policy:</strong> Credits are non-refundable once an analysis has been conducted. If a technical error on our part prevents delivery of an assessment, we will credit your account with equivalent credits. For billing disputes, contact support@notworms.com within 30 days of the charge.
                </p>
                <p className="leading-relaxed text-slate-600">
                  Promotional codes (such as BETA3FREE) are single-use per account and cannot be combined with other offers. We reserve the right to modify or discontinue promotional offers at any time.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Under the Australian Consumer Law (ACL), you have statutory consumer guarantees that apply to our services. Nothing in these Terms limits your rights under the ACL.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">5</span>
                Intellectual Property
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="text-slate-600 leading-relaxed">
                  All content, software, design, trademarks, and intellectual property on ParasitePro are owned by or licensed to ParasitePro. You may not reproduce, distribute, modify, or create derivative works without our written permission.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Educational reports and assessments generated for you are provided for your personal, non-commercial educational use. You may share these with your healthcare provider. You may not resell, publish commercially, or represent AI-generated assessments as your own expert opinion.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Images you upload remain your property. By uploading, you grant ParasitePro a limited licence to process them for the purpose of generating your educational assessment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">6</span>
                Limitation of Liability
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="font-semibold text-slate-800">
                  To the maximum extent permitted by law, ParasitePro and its operators expressly disclaim all liability for:
                </p>
                <ul className="space-y-1.5 text-slate-600">
                  {[
                    'Any health outcomes resulting from reliance on ParasitePro assessments',
                    'Incorrect, incomplete, or misleading AI-generated content',
                    'Delay in seeking appropriate medical treatment',
                    'Loss of data, business interruption, or consequential damages',
                    'Actions taken or not taken based on educational content provided',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <strong>Consumer Guarantee:</strong> Nothing in these Terms excludes, restricts, or modifies any guarantee, condition, warranty, or right provided under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)) that cannot lawfully be excluded.
                </p>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Where our liability cannot be excluded, our total liability to you for any claim is limited to the amount you paid for the Service in the 3 months prior to the claim arising, or AUD $100, whichever is less.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">7</span>
                Account Termination
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <p className="text-slate-600 leading-relaxed">
                  You may close your account at any time by contacting support@notworms.com. We will delete your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g. financial records).
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We reserve the right to suspend or terminate your account without notice if you violate these Terms, engage in fraudulent activity, or use the Service in a way that could harm other users or third parties.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">8</span>
                Governing Law &amp; Disputes
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                <div className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-slate-600 leading-relaxed text-xs">
                    These Terms are governed by the laws of Queensland, Australia. Any disputes will be resolved in the courts of Queensland, Australia. We encourage you to contact us first at support@notworms.com to resolve any issue informally before escalating to formal proceedings.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">9</span>
                Changes to Terms
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700">
                <p className="text-slate-600 leading-relaxed">
                  We may update these Terms periodically. Material changes will be notified via email (if you have an account) or prominent notice on the website at least 14 days before taking effect. Continued use of the Service after changes indicates your acceptance.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">10</span>
                Contact
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <p className="font-semibold text-teal-900">ParasitePro Legal Enquiries</p>
                </div>
                <p className="text-teal-700">Email: <a href="mailto:support@notworms.com" className="underline">support@notworms.com</a></p>
                <p className="text-teal-700">Website: notworms.com</p>
                <p className="text-teal-600 text-xs mt-2">Queensland, Australia</p>
              </div>
            </section>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-teal-600 underline">Privacy Policy</Link>
            <span>·</span>
            <Link href="/" className="hover:text-teal-600">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
