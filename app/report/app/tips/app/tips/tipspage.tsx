export default function EncyclopediaPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">📖 Parasite Encyclopedia & Tips</h1>
          <p className="text-2xl text-gray-400">Free, practical information for Queensland families, travellers and pet owners</p>
          <p className="text-emerald-400 mt-2">Educational only — always discuss with your GP</p>
        </div>

        {/* Article 1 - Wet Season */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🌧️</span>
            <h2 className="text-3xl font-semibold">Wet Season Parasites in Mackay & North Queensland</h2>
          </div>
          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <p>Queensland’s wet season brings more rain, warmer soil, and increased risk of certain parasites in both people and pets. This page gives general information about common visual patterns users sometimes notice in stool or on skin.</p>
            
            <h3 className="text-xl font-semibold mt-8 mb-3">Things people sometimes see after heavy rain</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Small white threads or rice-like pieces in stool (common in both humans and pets)</li>
              <li>Changes in stool consistency that last more than a few days</li>
              <li>Itchy skin rashes or small red spots, especially on feet or legs after flooding</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-3">Helpful information to prepare for your GP visit</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Note the date and how long symptoms have lasted</li>
              <li>Take clear photos in good light if you see anything unusual</li>
              <li>Mention any recent travel, pet contact, or time spent in flood-affected areas</li>
              <li>Tell your doctor about any worming treatment given to pets in the household</li>
            </ul>
          </div>
        </div>

        {/* Article 2 - Pet Worms */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🐶</span>
            <h2 className="text-3xl font-semibold">Pet Worms & Zoonotic Risks for QLD Families</h2>
          </div>
          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <p>Many families in Queensland have dogs or cats. Some worms can pass between pets and people (called zoonotic). This is general educational information only.</p>
            
            <h3 className="text-xl font-semibold mt-8 mb-3">Common things pet owners notice</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Small white segments in pet faeces or around the anus</li>
              <li>Changes in the pet’s appetite or energy levels</li>
              <li>Occasional itchy bottom in children who play with pets</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-3">Useful points to mention to your GP</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Whether your pets are regularly wormed and with what product</li>
              <li>If children in the house play in the yard where pets toilet</li>
              <li>Any recent changes in the family’s stool patterns</li>
              <li>Whether the pet has had any recent vet checks</li>
            </ul>
          </div>
        </div>

        {/* Article 3 - Travel Gut Issues */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">✈️</span>
            <h2 className="text-3xl font-semibold">Gut Symptoms After Travel to Bali or SE Asia</h2>
          </div>
          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <p>Many Australians return from Bali or Southeast Asia with changes in bowel habits. This page shares general educational information about what people sometimes observe.</p>
            
            <h3 className="text-xl font-semibold mt-8 mb-3">Common visual patterns people notice</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Looser or more frequent stools in the weeks after travel</li>
              <li>Undigested food particles or mucus in stool</li>
              <li>Occasional floating or unusually coloured stools</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-3">Helpful information to take to your GP</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Exact dates of travel and when symptoms started</li>
              <li>Whether you drank tap water, ate street food, or swam in certain areas</li>
              <li>Any medications or remedies taken while overseas</li>
              <li>Clear photos of stool if you see anything unusual (taken in good light)</li>
            </ul>
          </div>
        </div>

        {/* Gentle subscription upsell after free value */}
        <div className="mt-20 bg-white/5 border border-emerald-500/30 rounded-3xl p-10 text-center">
          <h3 className="text-3xl font-semibold mb-4">Enjoying these free guides?</h3>
          <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
            Save all your personal reports, unlock the full encyclopedia with monthly updates, 
            and get easy access to everything in one place with our $6 per month educational subscription.
          </p>
          <a 
            href="/subscribe"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 px-12 py-5 rounded-3xl text-xl font-semibold transition"
          >
            Get $6/month subscription
          </a>
          <p className="text-xs text-gray-500 mt-8">
            No extra analysis credits required • Cancel anytime • Strictly educational tool
          </p>
        </div>

        {/* Strong disclaimer */}
        <div className="mt-16 text-center text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Educational information only. ParasitePro does not provide medical diagnoses or advice. 
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards. 
          If you feel unwell, call 000 immediately.
        </div>
      </div>
    </div>
  );
}
