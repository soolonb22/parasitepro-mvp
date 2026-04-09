// app/refer/page.tsx
export default function ReferPage() {
  const referralLink = "https://notworms.com/?ref=YOURCODE123"; // Replace with real dynamic code later

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Link copied! Share safely — credits are for educational use only.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-8">🤝</div>
        <h1 className="text-4xl font-bold mb-6">Help a mate & earn free credits</h1>
        <p className="text-xl text-gray-400 mb-10">
          When your friend does their first free analysis using your link, you both get 1 extra educational credit.
        </p>

        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 mb-10">
          <p className="text-sm text-gray-400 mb-3">Your referral link</p>
          <div className="bg-black p-4 rounded-2xl font-mono text-sm break-all mb-6">
            {referralLink}
          </div>
          <button
            onClick={copyLink}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 rounded-2xl text-lg font-semibold"
          >
            Copy share link
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Educational tool only. No guarantees. Complies with AHPRA advertising standards.
        </p>
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
