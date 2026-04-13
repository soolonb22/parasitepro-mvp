'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search, X, ChevronRight, Microscope, Globe,
  AlertTriangle, ShieldCheck, BookOpen, Bug,
  Info, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Data ──────────────────────────────────────────────────────────────────── */

type RiskLevel = 'low' | 'moderate' | 'high'

interface Parasite {
  slug: string
  commonName: string
  scientificName: string
  category: 'worm' | 'protozoa' | 'ectoparasite' | 'fungal' | 'other'
  australiaRisk: RiskLevel
  travelRisk: boolean
  overview: string
  transmission: string[]
  symptoms: string[]
  australianContext: string
  gpAdvice: string
  imageEmoji: string
  tags: string[]
}

const PARASITES: Parasite[] = [
  {
    slug: 'pinworm',
    commonName: 'Pinworm (Threadworm)',
    scientificName: 'Enterobius vermicularis',
    category: 'worm',
    australiaRisk: 'high',
    travelRisk: false,
    overview: 'The most common worm infection in Australia, particularly in school-age children. Tiny white worms that live in the large intestine and lay eggs around the anus at night.',
    transmission: ['Person-to-person via contaminated hands', 'Touching contaminated surfaces then mouth', 'Sharing bedding, clothing or towels', 'Reinfection from scratching and nail contamination'],
    symptoms: ['Intense anal itching — especially at night', 'Disturbed sleep and irritability in children', 'Visible white threads around anus or in stool', 'Occasional abdominal discomfort'],
    australianContext: 'Extremely common in Australian primary schools. Up to 50% of children may be infected at some point. Whole-household treatment is standard practice.',
    gpAdvice: 'Ask your GP about the "sticky tape test" to confirm diagnosis. Single-dose treatment is available for the whole family. Wash all bedding and wash hands thoroughly.',
    imageEmoji: '🔬',
    tags: ['children', 'school', 'household', 'common'],
  },
  {
    slug: 'roundworm',
    commonName: 'Roundworm',
    scientificName: 'Ascaris lumbricoides',
    category: 'worm',
    australiaRisk: 'low',
    travelRisk: true,
    overview: 'Large intestinal worms that can grow up to 35cm long. More common in developing countries with poor sanitation. Rare in Australia but seen in returning travellers.',
    transmission: ['Ingesting soil contaminated with eggs (geophagy)', 'Unwashed raw vegetables or fruit from contaminated soil', 'Children playing in contaminated dirt'],
    symptoms: ['Often asymptomatic in light infections', 'Abdominal cramps and bloating', 'Visible worms in stool (large, pinkish-brown)', 'In heavy infections: malnutrition, bowel obstruction'],
    australianContext: 'Rare in Australian-born residents. Most cases in Australia are imported. Higher risk in Indigenous communities in remote areas with sanitation challenges.',
    gpAdvice: 'Stool microscopy confirms diagnosis. Antiparasitic treatment is very effective. Tell your GP about any recent travel to endemic regions.',
    imageEmoji: '🪱',
    tags: ['travel', 'stool', 'rare-in-australia'],
  },
  {
    slug: 'hookworm',
    commonName: 'Hookworm',
    scientificName: 'Ancylostoma duodenale / Necator americanus',
    category: 'worm',
    australiaRisk: 'moderate',
    travelRisk: true,
    overview: 'Blood-sucking intestinal worms that enter through the skin, usually the feet. A significant health issue in remote northern Australian communities and among travellers to tropical regions.',
    transmission: ['Larvae penetrate bare skin walking on contaminated soil', 'Most common via feet — "ground itch" is an early sign', 'Can also be ingested'],
    symptoms: ['Ground itch — red itchy rash at entry site', 'Fatigue and weakness (from blood loss)', 'Iron deficiency anaemia', 'Abdominal pain, diarrhoea'],
    australianContext: 'Remains a significant public health issue in remote Indigenous communities in northern Australia and Queensland. The Tropical Australian Academic Health Centre actively monitors this.',
    gpAdvice: 'Blood test for anaemia and stool microscopy. Request iron studies. Antiparasitic treatment is very effective. Wear shoes in endemic areas.',
    imageEmoji: '🦠',
    tags: ['skin', 'remote-qld', 'anaemia', 'barefoot', 'indigenous-health'],
  },
  {
    slug: 'tapeworm',
    commonName: 'Tapeworm',
    scientificName: 'Taenia saginata / Taenia solium',
    category: 'worm',
    australiaRisk: 'low',
    travelRisk: true,
    overview: 'Flat ribbon-like worms that live in the intestine and can grow several metres long. Segments (proglottids) are passed in stool. Usually contracted by eating undercooked meat.',
    transmission: ['Eating undercooked or raw beef (T. saginata)', 'Eating undercooked or raw pork (T. solium)', 'Travel to endemic regions'],
    symptoms: ['Often asymptomatic', 'Visible flat white segments in stool', 'Abdominal discomfort', 'Weight loss in heavy infections'],
    australianContext: 'Rare in Australia due to high food safety standards. Occasional cases from imported food or international travel. Beef tapeworm more common than pork tapeworm.',
    gpAdvice: 'Bring a segment to your GP if possible. Stool microscopy confirms diagnosis. Single-dose treatment is highly effective.',
    imageEmoji: '🪱',
    tags: ['stool', 'meat', 'travel', 'rare-australia'],
  },
  {
    slug: 'giardia',
    commonName: 'Giardia',
    scientificName: 'Giardia lamblia (G. intestinalis)',
    category: 'protozoa',
    australiaRisk: 'moderate',
    travelRisk: true,
    overview: 'A microscopic protozoan parasite that causes "Giardiasis" — one of the most common causes of persistent gut symptoms in Australian travellers returning from Asia, the Pacific, and developing countries.',
    transmission: ['Contaminated drinking water (even filtered backcountry water)', 'Contaminated food', 'Person-to-person via unwashed hands', 'Swallowing water while swimming'],
    symptoms: ['Explosive, watery, foul-smelling diarrhoea', 'Bloating and excessive flatulence', 'Greasy, pale, floating stools', 'Fatigue lasting weeks to months', 'Nausea and abdominal cramps'],
    australianContext: 'One of the most common travel-related parasitic infections in Australians. Also found in untreated water in national parks and bushland. "Bali belly" is often Giardia.',
    gpAdvice: 'Request stool microscopy or PCR test for Giardia specifically — routine stool tests may miss it. Antibiotic/antiparasitic treatment is very effective. Stay well hydrated.',
    imageEmoji: '🦠',
    tags: ['travel', 'bali', 'water', 'diarrhoea', 'camping'],
  },
  {
    slug: 'scabies',
    commonName: 'Scabies',
    scientificName: 'Sarcoptes scabiei',
    category: 'ectoparasite',
    australiaRisk: 'high',
    travelRisk: true,
    overview: 'Tiny mites that burrow under the skin and cause intense itching. A significant public health problem in Australia, particularly in remote and overcrowded communities.',
    transmission: ['Prolonged skin-to-skin contact', 'Shared bedding, clothing, or towels', 'Healthcare and household settings', 'Sexual contact'],
    symptoms: ['Intense itching — worse at night', 'Thin burrow lines on skin (often between fingers, wrists)', 'Red, pimple-like rash', 'Crusted (Norwegian) scabies in immunocompromised'],
    australianContext: 'A major health burden in remote Indigenous Australian communities where rates are among the highest in the world. Also seen frequently in childcare, aged care, and other close-contact settings.',
    gpAdvice: 'Topical permethrin cream is first-line treatment. ALL household contacts must be treated simultaneously. Wash all clothing and bedding. Itching may persist for weeks after successful treatment.',
    imageEmoji: '🩹',
    tags: ['skin', 'itching', 'remote-qld', 'household', 'childcare'],
  },
  {
    slug: 'head-lice',
    commonName: 'Head Lice (Nits)',
    scientificName: 'Pediculus humanus capitis',
    category: 'ectoparasite',
    australiaRisk: 'high',
    travelRisk: false,
    overview: 'Tiny insects that live on the human scalp and hair. Extremely common in Australian schoolchildren. Itching is caused by the reaction to louse saliva.',
    transmission: ['Direct head-to-head contact', 'Sharing hats, hair brushes, pillows (less common)'],
    symptoms: ['Itching scalp — particularly behind ears and nape of neck', 'Visible lice or nits (eggs) cemented to hair shafts', 'Small white specks that do not brush off (unlike dandruff)'],
    australianContext: 'One of the most common conditions in Australian primary schools. Schools often have "no nit" policies. Not related to poor hygiene — can affect anyone with hair.',
    gpAdvice: 'Treat with registered pyrethrin or permethrin-based shampoo/conditioner. Wet combing with a fine-tooth lice comb is effective. Treat all household members with live lice simultaneously. Repeat treatment after 7–10 days.',
    imageEmoji: '🪲',
    tags: ['children', 'school', 'hair', 'very-common'],
  },
  {
    slug: 'cryptosporidium',
    commonName: 'Cryptosporidium',
    scientificName: 'Cryptosporidium parvum',
    category: 'protozoa',
    australiaRisk: 'moderate',
    travelRisk: true,
    overview: 'A microscopic parasite that causes profuse, watery diarrhoea. Resistant to chlorine-based water treatment. Notable outbreaks have occurred in Australian public swimming pools.',
    transmission: ['Swallowing contaminated water (pools, lakes, streams)', 'Contact with infected animals (particularly calves)', 'Person-to-person via faecal-oral route'],
    symptoms: ['Profuse watery diarrhoea', 'Stomach cramps', 'Nausea and vomiting', 'Fever', 'Self-limiting in healthy adults (1–2 weeks)'],
    australianContext: 'Australia has had notable Cryptosporidium outbreaks linked to public swimming pools and childcare centres. Immunocompromised individuals are at high risk of severe illness.',
    gpAdvice: 'Stool PCR test can detect Cryptosporidium. Stay well hydrated. Usually resolves without treatment in healthy adults. Immunocompromised patients need specialist care.',
    imageEmoji: '🏊',
    tags: ['water', 'swimming-pool', 'diarrhoea', 'children'],
  },
  {
    slug: 'toxoplasmosis',
    commonName: 'Toxoplasmosis',
    scientificName: 'Toxoplasma gondii',
    category: 'protozoa',
    australiaRisk: 'moderate',
    travelRisk: false,
    overview: 'A parasitic infection transmitted by cats, undercooked meat, and soil. Usually mild in healthy adults but can cause serious harm to unborn babies if a pregnant woman is first infected during pregnancy.',
    transmission: ['Contact with cat faeces (especially cleaning litter boxes)', 'Eating undercooked or raw meat', 'Unwashed fruit and vegetables', 'Soil contact'],
    symptoms: ['Often asymptomatic in healthy adults', 'Flu-like symptoms, swollen lymph nodes', 'Serious complications in pregnancy (miscarriage, birth defects)', 'Severe illness in immunocompromised'],
    australianContext: 'Approximately 30–40% of Australians are estimated to have been exposed. Particularly important for pregnant women and immunocompromised individuals to be aware of.',
    gpAdvice: 'Pregnant women should have a blood test if concerned about exposure. Avoid cleaning cat litter during pregnancy. Cook meat to safe temperatures. Wear gloves when gardening.',
    imageEmoji: '🐱',
    tags: ['pregnancy', 'cats', 'meat', 'immunocompromised'],
  },
  {
    slug: 'cutaneous-larva-migrans',
    commonName: 'Cutaneous Larva Migrans (CLM)',
    scientificName: 'Ancylostoma braziliense',
    category: 'worm',
    australiaRisk: 'moderate',
    travelRisk: true,
    overview: 'A skin condition caused by hookworm larvae (usually from dogs or cats) burrowing under human skin. Produces a characteristic, intensely itchy, winding red track.',
    transmission: ['Walking barefoot on contaminated soil or sand', 'Beaches or sandpits contaminated by dog/cat faeces', 'Tropical and subtropical regions'],
    symptoms: ['Intensely itchy, winding red track on skin', 'Track advances several mm per day', 'Common on feet, buttocks, hands', 'Raised, red, serpiginous line'],
    australianContext: 'Seen in Queensland, especially in tropical/subtropical regions. Can be contracted on Australian beaches where dogs defecate. Common in returning travellers from SE Asia, Bali, the Pacific.',
    gpAdvice: 'Show your GP the track — visual diagnosis is usually straightforward. Topical or oral antiparasitic treatment is very effective. Do not squeeze or freeze the track.',
    imageEmoji: '🩹',
    tags: ['skin', 'beach', 'travel', 'qld', 'barefoot', 'dogs'],
  },
  {
    slug: 'strongyloides',
    commonName: 'Strongyloides',
    scientificName: 'Strongyloides stercoralis',
    category: 'worm',
    australiaRisk: 'moderate',
    travelRisk: true,
    overview: 'A unique threadworm that can self-replicate inside the human body for decades. Particularly important in remote Aboriginal and Torres Strait Islander communities, and in travellers to tropical regions.',
    transmission: ['Larvae penetrate skin from contaminated soil', 'Walking barefoot in endemic areas', 'Can auto-infect — worms breed inside the host'],
    symptoms: ['Often asymptomatic for years', 'Intermittent abdominal pain and diarrhoea', 'Larva currens — a fast-moving itchy rash on skin', 'Life-threatening hyperinfection syndrome in immunocompromised'],
    australianContext: 'A significant health issue in remote Indigenous communities in northern and central Australia. Can remain dormant for decades and reactivate if the host becomes immunocompromised (e.g., steroid use, cancer).',
    gpAdvice: 'Tell your GP if you have ever lived in or spent time in remote endemic areas, even if it was years ago. Blood test (Strongyloides serology) is available. Treatment is very effective.',
    imageEmoji: '🔬',
    tags: ['skin', 'remote-qld', 'indigenous-health', 'barefoot', 'chronic'],
  },
  {
    slug: 'bed-bugs',
    commonName: 'Bed Bugs',
    scientificName: 'Cimex lectularius',
    category: 'ectoparasite',
    australiaRisk: 'moderate',
    travelRisk: true,
    overview: 'Small, flat insects that feed on human blood at night. Not known to transmit disease but cause significant skin reactions, anxiety, and sleep disturbance.',
    transmission: ['Hitchhiking in luggage, clothing, second-hand furniture', 'Hotels, hostels, and shared accommodation', 'Used mattresses and bedding'],
    symptoms: ['Clusters of red, itchy bite marks — often in a line', 'Bites appear on exposed skin while sleeping', 'Visible insects or dark spots on mattress seams', 'Anxiety and sleep disturbance'],
    australianContext: 'Increasingly common in Australian hotels, backpacker hostels, and apartments. Not a sign of poor hygiene. Strict pest control required for elimination.',
    gpAdvice: 'Antihistamines and topical corticosteroids for bite reactions. Pest control is needed for the infestation itself — not a medical treatment issue. Notify your accommodation provider.',
    imageEmoji: '🛏️',
    tags: ['skin', 'travel', 'bites', 'accommodation'],
  },
]

/* ─── Config ─────────────────────────────────────────────────────────────────── */

const CATEGORIES = ['all', 'worm', 'protozoa', 'ectoparasite'] as const
type CategoryFilter = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: 'All',
  worm: 'Worms',
  protozoa: 'Protozoa',
  ectoparasite: 'Ectoparasites',
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  low:      { label: 'Low risk in AUS',      color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  moderate: { label: 'Moderate risk in AUS', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  high:     { label: 'Common in AUS',        color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/* ─── Component ──────────────────────────────────────────────────────────────── */

export default function EncyclopediaPage() {
  const [search, setSearch]           = useState('')
  const [category, setCategory]       = useState<CategoryFilter>('all')
  const [letterFilter, setLetterFilter] = useState('')
  const [selected, setSelected]       = useState<Parasite | null>(null)

  const filtered = useMemo(() => {
    return PARASITES.filter((p) => {
      const matchSearch = !search.trim() ||
        p.commonName.toLowerCase().includes(search.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.includes(search.toLowerCase()))
      const matchCat = category === 'all' || p.category === category
      const matchLetter = !letterFilter || p.commonName.toUpperCase().startsWith(letterFilter)
      return matchSearch && matchCat && matchLetter
    })
  }, [search, category, letterFilter])

  const lettersPresent = useMemo(
    () => new Set(PARASITES.map((p) => p.commonName[0].toUpperCase())),
    []
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-900 text-white px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-300" />
            </div>
            <span className="text-teal-300 text-sm font-semibold uppercase tracking-wider">
              Educational Reference
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Parasite Encyclopedia
          </h1>
          <p className="text-slate-300 max-w-2xl leading-relaxed">
            Evidence-based educational profiles for parasites relevant to Australians — from common schoolyard infections to tropical travel risks. Use this to understand, not diagnose.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setLetterFilter('') }}
              placeholder="Search by name, symptom, or tag…"
              className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 focus:border-teal-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                category === cat
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* A–Z filter */}
        <div className="flex flex-wrap gap-1 mb-6">
          {ALPHABET.map((letter) => {
            const hasEntries = lettersPresent.has(letter)
            return (
              <button
                key={letter}
                onClick={() => setLetterFilter(letterFilter === letter ? '' : letter)}
                disabled={!hasEntries}
                className={cn(
                  'w-7 h-7 rounded-lg text-xs font-semibold transition-all',
                  letterFilter === letter
                    ? 'bg-teal-600 text-white'
                    : hasEntries
                    ? 'bg-white border border-slate-200 text-slate-700 hover:border-teal-300'
                    : 'text-slate-300 cursor-default'
                )}
              >
                {letter}
              </button>
            )
          })}
          {letterFilter && (
            <button onClick={() => setLetterFilter('')} className="text-xs text-teal-600 hover:underline px-2">
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-400 mb-4">
          Showing {filtered.length} of {PARASITES.length} entries
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((parasite) => {
            const risk = RISK_CONFIG[parasite.australiaRisk]
            return (
              <button
                key={parasite.slug}
                onClick={() => setSelected(parasite)}
                className="text-left bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all p-5 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">{parasite.imageEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                          {parasite.commonName}
                        </p>
                        <p className="text-xs italic text-slate-400 mt-0.5">{parasite.scientificName}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {parasite.overview}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border', risk.color, risk.bg, risk.border)}>
                        🇦🇺 {risk.label}
                      </span>
                      {parasite.travelRisk && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          ✈️ Travel risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bug className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No entries match your search.</p>
            <button onClick={() => { setSearch(''); setCategory('all'); setLetterFilter('') }} className="text-teal-600 text-sm hover:underline mt-1">
              Clear filters
            </button>
          </div>
        )}

        <p className="text-xs text-center text-slate-400 mt-8 leading-relaxed">
          ⚠️ Educational reference only — not a medical diagnosis. Always consult a qualified Australian healthcare professional.
        </p>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-gradient-to-br from-slate-900 to-teal-900 px-6 py-5 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{selected.imageEmoji}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-white leading-tight">{selected.commonName}</h2>
                  <p className="text-teal-300 text-sm italic mt-0.5">{selected.scientificName}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full border', RISK_CONFIG[selected.australiaRisk].color, RISK_CONFIG[selected.australiaRisk].bg, RISK_CONFIG[selected.australiaRisk].border)}>
                      🇦🇺 {RISK_CONFIG[selected.australiaRisk].label}
                    </span>
                    {selected.travelRisk && (
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">✈️ Travel risk</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <p className="text-sm text-slate-700 leading-relaxed">{selected.overview}</p>

              {/* Symptoms */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />Key symptoms
                </h3>
                <ul className="space-y-1.5">
                  {selected.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transmission */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-teal-500" />How it spreads
                </h3>
                <ul className="space-y-1.5">
                  {selected.transmission.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Australian context */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1.5 flex items-center gap-1.5">
                  <span>🇦🇺</span>Australian context
                </h3>
                <p className="text-sm text-teal-800 leading-relaxed">{selected.australianContext}</p>
              </div>

              {/* GP advice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />For your GP visit
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.gpAdvice}</p>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-1 border-t border-slate-100">
                ⚠️ Educational information only — not a medical diagnosis. Always consult a qualified Australian GP or healthcare professional.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
