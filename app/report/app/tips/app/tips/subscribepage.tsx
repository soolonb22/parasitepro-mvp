// app/subscribe/page.tsx
export default function SubscribePage() {
  const handleSubscribe = () => {
    // Add your Stripe subscription checkout here
    alert("Redirecting to secure Stripe checkout for $6/month educational subscription...");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Keep your reports & tips forever</h1>
          <p className="text-2xl text-emerald-400">$6 per month</p>
          <p className="text-gray-400">No extra analysis credits needed</p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-emerald-500/30 rounded-3xl p-10">
          <ul className="space-y-6 text-lg mb-12">
            <li className="flex gap-4">✅ <span>Unlimited saved reports & history</span></li>
            <li className="flex gap-4">✅ Full access to education library</li>
            <li className="flex gap-4">✅ Monthly QLD-specific parasite tips</li>
            <li className="flex gap-4">✅ Priority email support</li>
            <li className="flex gap-4">✅ Cancel anytime</li>
          </ul>

          <button
            onClick={handleSubscribe}
            className="bg-emerald-600 hover:bg-emerald-700 w-full py-5 rounded-3xl text-xl font-semibold mb-6"
          >
            Start $6/month subscription
          </button>

          <p className="text-center text-xs text-gray-500">
            Educational subscription only. Credits for analyses are still purchased separately.
          </p>
        </div>

        <div className="mt-12 text-center text-xs text-gray-500">
          Educational tool only — not a medical diagnosis. Complies with TGA and AHPRA rules. 
          If you feel unwell, call 000 immediately.
        </div>
      </div>
    </div>
  );
}
// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 mt-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm text-gray-400">
          <a href="/tips" className="hover:text-white transition">Free Education Tips</a>
          <a href="/refer" className="hover:text-white transition">Refer a Mate</a>
          <a href="/subscribe" className="hover:text-white transition">Educational Subscription</a>
          <a href="/privacy" className="hover:text-white transition">Privacy & Photo Policy</a>
        </div>

        <div className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
          ⚠️ Educational tool only. ParasitePro provides structured educational reports to help you prepare for GP visits. 
          It does not provide medical diagnoses, prescribe treatments, or replace professional medical advice. 
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards. 
          In an emergency, call 000 immediately.
        </div>

        <p className="text-xs text-gray-600 mt-8">
          © 2026 Parasite Pro • Made in Mackay, QLD • For Australian families, travellers & pet owners
        </p>
      </div>
    </footer>
  );
}
