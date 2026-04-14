// @ts-nocheck
import { Link } from 'react-router-dom';

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📖 Parasite Encyclopedia & Tips</h1>
          <p className="text-xl text-gray-400">Free, practical information for Queensland families, travellers and pet owners</p>
          <p className="text-emerald-400 mt-2 text-sm">Educational only — always discuss with your GP</p>
        </div>

        {/* Article 1 - Wet Season */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🌧️</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Wet Season Parasites in Mackay & North Queensland</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>
              Queensland's wet season brings more rain, warmer soil, and increased activity of certain parasites in both people and pets.
              This article shares general educational information about common visual patterns users sometimes notice in stool or on skin during this period.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Things people sometimes see after heavy rain</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Small white threads or rice-like pieces in stool (common in both humans and pets)</li>
              <li>Changes in stool consistency that last more than a few days</li>
              <li>Itchy skin rashes or small red spots, especially on feet or legs after flooding</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Helpful information to prepare for your GP visit</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Note the date and how long symptoms have lasted</li>
              <li>Take clear photos in good lighting if you see anything unusual</li>
              <li>Mention any recent travel, pet contact, or time spent in flood-affected areas</li>
              <li>Tell your doctor about any worming treatment given to pets in the household</li>
            </ul>
          </div>
        </article>

        {/* Article 2 - Pet Worms */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🐶</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Pet Worms & Zoonotic Risks for QLD Families</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>
              Many families in Queensland share their home with dogs or cats. Some worms can pass between pets and people — these are called zoonotic parasites.
              The information below is general and educational only.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Common things pet owners notice</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Small white segments in pet faeces or around the anus (often described as "grains of rice")</li>
              <li>Changes in the pet's appetite, energy levels, or coat condition</li>
              <li>Occasional itchy bottom in children who play with or cuddle pets regularly</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Useful points to mention to your GP</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Whether your pets are regularly wormed and with what product</li>
              <li>If children in the house play in the yard where pets toilet</li>
              <li>Any recent changes in your family's stool patterns or energy levels</li>
              <li>Whether the pet has had a recent vet check or was found as a stray</li>
            </ul>
          </div>
        </article>

        {/* Article 3 - Travel Gut Issues */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">✈️</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Gut Symptoms After Travel to Bali or SE Asia</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>
              Many Australians return from Bali or Southeast Asia with changes in bowel habits.
              This article shares general educational information about what people sometimes observe and what to tell their doctor.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Common visual patterns people notice</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Looser or more frequent stools in the weeks after travel</li>
              <li>Undigested food particles or mucus visible in stool</li>
              <li>Occasional floating or unusually coloured stools</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Helpful information to take to your GP</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Exact dates of travel and when symptoms first started</li>
              <li>Whether you drank tap water, ate street food, or swam in lakes or rivers</li>
              <li>Any medications or remedies taken while overseas</li>
              <li>Clear photos of stool if you notice anything unusual (taken in good light)</li>
            </ul>
          </div>
        </article>

        {/* Article 4 - Pinworms in Kids */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">👶</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Pinworms in Kids — What Queensland Parents Often Notice</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>
              Pinworms (threadworms) are one of the most common parasitic infections in Australian children.
              They spread easily in childcare and school settings. This information is educational only — see your GP for advice.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Signs parents commonly notice</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Intense itching around the bottom, especially at night</li>
              <li>Restless sleep or difficulty settling in young children</li>
              <li>Thin white threads visible in stool or near the anus (about 1 cm long)</li>
              <li>Irritability or reduced appetite</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">What to tell your GP or pharmacist</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>The age and weight of the child affected</li>
              <li>How long symptoms have been present</li>
              <li>Whether other children or adults in the household have similar symptoms</li>
              <li>Whether the child attends childcare or school (spread is very common in group settings)</li>
            </ul>
          </div>
        </article>

        {/* Article 5 - Camping */}
        <article className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🏕️</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Camping & Bushwalking — Parasite Awareness for Outdoor Lovers</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>
              Queensland's Whitsundays, Eungella National Park, and Cape Hillsborough attract thousands of campers each year.
              Spending time near creeks, rainforest, and wildlife increases exposure to certain parasites. This is general educational information only.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Situations that increase exposure risk</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Walking barefoot on soil or near creek beds</li>
              <li>Swimming in freshwater streams or dams</li>
              <li>Drinking untreated water from rivers or rainwater tanks</li>
              <li>Close contact with wildlife or feral animals</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">What to watch for in the weeks after camping</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Itchy rashes, especially in a linear or trailing pattern on the feet or legs</li>
              <li>Changes in stool consistency or urgency</li>
              <li>Unexplained fatigue, stomach cramps, or bloating</li>
              <li>Any visual changes in stool that seem unusual</li>
            </ul>
          </div>
        </article>

        {/* Article 6 - Bristol Stool Chart */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🟫</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Understanding the Bristol Stool Chart</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>The Bristol Stool Chart is a simple visual tool doctors use to describe stool consistency. This educational information can help you communicate more clearly with your GP during a consultation.</p>

            <h3 className="text-lg font-semibold text-white mt-6">The 7 types at a glance</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong className="text-white">Type 1–2 (Hard lumps or sausage-like):</strong> Often associated with slower movement through the gut.</li>
              <li><strong className="text-white">Type 3–4 (Sausage-shaped with cracks or smooth):</strong> Generally considered normal, well-formed stools.</li>
              <li><strong className="text-white">Type 5–7 (Soft blobs to entirely liquid):</strong> Can indicate faster transit through the gut.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Helpful information to prepare for your GP visit</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Note which type you see most often and whether it has changed recently.</li>
              <li>Take clear photos in good natural light if you want to show your doctor (use the upload tips on the analysis page).</li>
              <li>Mention how long the pattern has lasted, any associated feelings, diet changes, or travel.</li>
              <li>Bring a simple note of the type number(s) you've observed.</li>
            </ul>

            <p className="text-sm text-gray-400 mt-6">This is general educational information only. It does not replace professional medical advice.</p>
          </div>
        </article>

        {/* Article 7 - Skin Rash Patterns */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🩹</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Common Skin Rash Visual Patterns</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>Skin changes are very common and can have many different causes. This page shares general educational information about visual patterns people sometimes notice on their skin.</p>

            <h3 className="text-lg font-semibold text-white mt-6">Things people sometimes observe</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>Small red spots, dots, or raised bumps that may or may not itch.</li>
              <li>Dry, flaky, or scaly patches, especially on arms, legs, or torso.</li>
              <li>Ring-shaped or line-like marks, particularly after contact with soil, animals, or plants.</li>
              <li>Itchy areas that appear after time spent outdoors in Queensland's tropical or wet conditions.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Helpful information to prepare for your GP visit</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Note when the rash first appeared and whether anything makes it better or worse (heat, scratching, washing, etc.).</li>
              <li>Take clear, well-lit photos from a few different angles (use good natural light and the upload tips).</li>
              <li>Mention any recent travel, time spent camping/bushwalking, pet contact, or new skincare/soap products.</li>
              <li>Describe the location on the body and whether other family members or pets have similar spots.</li>
            </ul>

            <p className="text-sm text-gray-400 mt-6">This is general educational information only. It does not replace professional medical advice.</p>
          </div>
        </article>

        {/* Upsell */}
        <div className="mt-12 bg-white/5 border border-emerald-500/30 rounded-3xl p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">Enjoying these free guides?</h3>
          <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
            Save all your personal reports, unlock the full parasite encyclopedia with monthly updates,
            and get easy access to everything in one place with our $6/month educational subscription.
          </p>
          <Link
            to="/pricing"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 px-10 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Get $6/month subscription
          </Link>
          <p className="text-xs text-gray-500 mt-6">
            No extra analysis credits required · Cancel anytime · Strictly educational tool
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 text-center text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Educational information only. ParasitePro does not provide medical diagnoses or advice.
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards.
          If you feel unwell or have an emergency, call 000 immediately.
        </div>
      </div>
    </div>
  );
}
