// @ts-nocheck
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
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
            <p>
              The Bristol Stool Chart is a clinical reference tool developed at the University of Bristol and widely used by GPs and gastroenterologists
              to describe stool consistency. It has seven categories. Knowing which type describes what you are seeing is one of the most useful things
              you can tell your doctor — it helps them understand how quickly food is moving through your digestive system.
              This information is educational only.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">The seven types explained</h3>
            <ul className="list-none pl-0 space-y-3">
              {[
                ['Type 1', 'Separate hard lumps, like small pebbles or rabbit droppings. Hard to pass. Often associated with slow transit or low fluid intake.'],
                ['Type 2', 'Sausage-shaped but lumpy. Still firm. May be difficult to pass.'],
                ['Type 3', 'Sausage-shaped with cracks on the surface. Generally considered within the normal range.'],
                ['Type 4', 'Smooth, soft sausage or snake shape. Most commonly described as typical.'],
                ['Type 5', 'Soft blobs with clear-cut edges. Passes easily. May indicate slightly faster transit.'],
                ['Type 6', 'Fluffy, mushy pieces with ragged edges. Soft but formless.'],
                ['Type 7', 'Entirely liquid with no solid pieces. Watery diarrhoea.'],
              ].map(([type, desc]) => (
                <li key={type} className="flex gap-3">
                  <span className="text-white font-semibold flex-shrink-0 w-16">{type}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">What changes in stool type can indicate</h3>
            <p>
              A single unusual stool is rarely significant on its own. It is persistent changes — lasting more than a few days —
              that are worth discussing with your GP. Factors like diet, hydration, travel, stress, medication, and
              infections can all influence transit time and stool consistency.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Types 1–2 persisting for several days may suggest constipation or slow transit</li>
              <li>Types 6–7 persisting beyond 48 hours, or accompanied by cramping or fever, are worth a GP visit</li>
              <li>Any blood, mucus, or unusual colour (pale, very dark, or green) alongside a change in type is worth mentioning promptly</li>
              <li>Floating stools can sometimes indicate fat malabsorption — worth noting if it recurs</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">QLD-specific context</h3>
            <p>
              In tropical Queensland, gut symptoms can follow exposure to water sources, food handling differences during the wet season,
              or contact with soil and animals. Post-travel changes (particularly after Bali, SE Asia, or rural Queensland stays)
              that match Types 6–7 and persist beyond a week are worth investigating with a stool test through your GP.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">What to tell your GP</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Which Bristol type most closely matches what you are seeing — and for how long</li>
              <li>Whether the change came on suddenly or gradually</li>
              <li>Any unusual colour, odour, mucus, or visible material in the stool</li>
              <li>Recent travel, dietary changes, new medications, or pet contact</li>
              <li>Whether anyone else in the household has similar symptoms</li>
            </ul>
          </div>
        </article>

        {/* Article 7 - Skin Rash Patterns */}
        <article className="mb-16 pb-16 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🩹</span>
            <h2 className="text-2xl md:text-3xl font-semibold">Common Skin Rash Visual Patterns</h2>
          </div>
          <div className="space-y-5 text-gray-300 text-base leading-relaxed">
            <p>
              Skin changes can have many causes — parasitic, fungal, bacterial, allergic, or inflammatory. In Queensland's tropical climate,
              outdoor exposure, soil contact, flooding, and travel increase the range of possibilities. This page shares educational information
              about visual patterns people commonly notice, to help you describe what you are seeing to your GP clearly.
              It does not provide a diagnosis.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Visual patterns and what they can sometimes look like</h3>
            <ul className="list-none pl-0 space-y-4">
              <li>
                <p className="text-white font-semibold mb-1">Trailing or winding line under the skin</p>
                <p>A raised, winding track — sometimes described as a thin red or pink line moving across the skin. Often appears on the feet, ankles, or lower legs after contact with soil, sand, or grass. Can be itchy and may advance slightly each day.</p>
              </li>
              <li>
                <p className="text-white font-semibold mb-1">Ring-shaped or circular patch</p>
                <p>A round or oval area with a clearer centre and a more defined outer edge. May have scaling, redness, or slight raised texture at the border. Can appear on the torso, limbs, scalp, or groin. Multiple rings can appear at once.</p>
              </li>
              <li>
                <p className="text-white font-semibold mb-1">Intensely itchy clustered bumps — especially at night</p>
                <p>Small raised spots in groups, often between fingers, on wrists, waistband areas, or inner thighs. Nighttime itching that wakes you up is a key feature worth mentioning. May look like a rash but have a specific pattern related to skin folds.</p>
              </li>
              <li>
                <p className="text-white font-semibold mb-1">Bite marks in a row or cluster</p>
                <p>Multiple red dots in a line or group, often appearing overnight or after time outdoors. Common on exposed skin areas — arms, neck, ankles. May be flat or slightly raised with a central puncture point.</p>
              </li>
              <li>
                <p className="text-white font-semibold mb-1">Swollen, red, or weeping area around a site</p>
                <p>Localised swelling with warmth, redness spreading outward, or discharge. Can follow a bite, scratch, or soil contact. Worth same-day GP attention if the redness is spreading rapidly or accompanied by fever.</p>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">QLD and tropical context</h3>
            <p>
              North Queensland's warm, humid conditions support a wider range of skin-affecting organisms than cooler climates.
              Bare feet on creek banks, swimming in freshwater, gardening after rain, and contact with soil disturbed by flooding
              all increase potential exposure. Skin changes appearing within days to weeks of these activities are worth documenting and discussing with your GP.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">Taking a useful photo for your GP visit</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use natural daylight — avoid flash which flattens texture and colour</li>
              <li>Take one close-up of the affected area and one wider shot showing its location on the body</li>
              <li>Photograph it at its worst (e.g. after scratching, or first thing in the morning when itching is often most visible)</li>
              <li>Place a coin or ruler next to the area to give your doctor a size reference</li>
              <li>If the rash changes shape or spreads, photograph it daily so your GP can see the progression</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Helpful details to tell your GP</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>When it first appeared and whether it has changed shape, size, or colour</li>
              <li>Whether it is itchy, painful, burning, or symptom-free</li>
              <li>Any recent travel, outdoor activities (camping, beach, creek swimming, gardening), or pet contact</li>
              <li>Whether anyone else in the household has a similar rash</li>
              <li>Any recent changes to soaps, washing powder, or skincare products (to help rule out contact allergy)</li>
            </ul>
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
