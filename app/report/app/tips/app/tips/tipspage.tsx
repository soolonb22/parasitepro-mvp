// app/tips/page.tsx
export default function TipsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">📚 Free Parasite Education Library</h1>
          <p className="text-xl text-gray-400">Helpful, plain-English info for QLD families, travellers and pet owners</p>
          <p className="text-sm text-emerald-400 mt-2">Educational only — always see your GP for personal advice</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add as many cards as you like — here are 4 starters */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition">
            <div className="text-4xl mb-4">🌧️</div>
            <h3 className="font-semibold text-2xl mb-3">Parasites in Tropical Queensland After Heavy Rain</h3>
            <p className="text-gray-400 mb-6">What to watch for in Mackay and North QLD during wet season. Common signs and when it’s smart to get checked.</p>
            <a href="#" className="text-emerald-400 font-medium">Read full article →</a>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition">
            <div className="text-4xl mb-4">🐕</div>
            <h3 className="font-semibold text-2xl mb-3">Pet Worms vs Human Worms – Zoonotic Risks</h3>
            <p className="text-gray-400 mb-6">Your dog has worms… could it affect the kids? Simple facts for responsible pet owners in QLD.</p>
            <a href="#" className="text-emerald-400 font-medium">Read full article →</a>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="font-semibold text-2xl mb-3">Gut Symptoms After Bali or SE Asia Travel</h3>
            <p className="text-gray-400 mb-6">What to look for and how to prepare useful information before your GP visit.</p>
            <a href="#" className="text-emerald-400 font-medium">Read full article →</a>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition">
            <div className="text-4xl mb-4">🪱</div>
            <h3 className="font-semibold text-2xl mb-3">Understanding the Bristol Stool Chart</h3>
            <p className="text-gray-400 mb-6">A simple visual guide to what different stool types can mean (educational only).</p>
            <a href="#" className="text-emerald-400 font-medium">Read full article →</a>
          </div>
        </div>

        {/* Strong disclaimer */}
        <div className="mt-16 text-center text-xs text-gray-500 max-w-2xl mx-auto">
          Educational information only. ParasitePro does not provide medical diagnoses or advice. 
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards. 
          If you feel unwell, call 000 immediately.
        </div>
      </div>
    </div>
  );
}// src/components/Footer.tsx
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
