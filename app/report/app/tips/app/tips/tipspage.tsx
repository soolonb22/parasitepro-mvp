// app/tips/page.tsx  ← Replace or update your current one with this

export default function EncyclopediaPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">📖 Parasite Encyclopedia & Tips</h1>
          <p className="text-2xl text-gray-400">Free, plain-English knowledge for QLD families, travellers & pet owners</p>
          <p className="text-emerald-400 mt-2">Educational only — always discuss with your GP</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Article 1 */}
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition group">
            <div className="text-5xl mb-6">🌧️</div>
            <h3 className="text-2xl font-semibold mb-4 group-hover:text-emerald-400">Wet Season Parasites in Mackay & North QLD</h3>
            <p className="text-gray-400 mb-6">What increases after heavy rain, common signs to watch for, and how to prepare useful info for your GP visit.</p>
            <a href="#" className="text-emerald-400 font-medium flex items-center gap-2">Read full guide →</a>
          </div>

          {/* Article 2 */}
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition group">
            <div className="text-5xl mb-6">🐶</div>
            <h3 className="text-2xl font-semibold mb-4 group-hover:text-emerald-400">Pet Worms & Zoonotic Risks for QLD Families</h3>
            <p className="text-gray-400 mb-6">Understanding the link between dog/cat worms and human health — simple facts, no scare tactics.</p>
            <a href="#" className="text-emerald-400 font-medium flex items-center gap-2">Read full guide →</a>
          </div>

          {/* Article 3 */}
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 hover:border-emerald-500 transition group">
            <div className="text-5xl mb-6">✈️</div>
            <h3 className="text-2xl font-semibold mb-4 group-hover:text-emerald-400">Travel Gut Issues After Bali or SE Asia</h3>
            <p className="text-gray-400 mb-6">Common visual patterns and what information is useful to share with your doctor on return.</p>
            <a href="#" className="text-emerald-400 font-medium flex items-center gap-2">Read full guide →</a>
          </div>

          {/* Add more cards here as you write articles */}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center text-xs text-gray-500 max-w-2xl mx-auto">
          Educational information only. ParasitePro does not provide medical diagnoses or advice. 
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards. 
          If you feel unwell, call 000 immediately.
        </div>
      </div>
    </div>
  );
}
