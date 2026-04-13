'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plane, AlertTriangle, ShieldCheck, Pill, Droplets, Bug } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Region data ────────────────────────────────────────────────────────────── */

type RiskTier = 'very-high' | 'high' | 'moderate' | 'low' | 'minimal'

interface Region {
  id: string
  name: string
  risk: RiskTier
  countries: string[]
  topParasites: string[]
  keyRisks: string[]
  prevention: string[]
  onArrival: string
  australiansTip: string
}

const REGIONS: Record<string, Region> = {
  'se-asia': {
    id: 'se-asia',
    name: 'Southeast Asia (incl. Bali)',
    risk: 'very-high',
    countries: ['Indonesia', 'Thailand', 'Vietnam', 'Cambodia', 'Myanmar', 'Laos', 'Philippines', 'Malaysia'],
    topParasites: ['Giardia', 'Cryptosporidium', 'Hookworm', 'Strongyloides', 'Roundworm', 'Tapeworm'],
    keyRisks: ['Contaminated food and water', 'Barefoot walking on beaches/soil', 'Raw or undercooked seafood, pork, beef', 'Swimming in fresh water'],
    prevention: ['Drink only bottled or boiled water', 'Avoid ice in drinks', 'Wear shoes at all times outdoors', 'Eat fully cooked food from reputable sources', 'Avoid swimming in fresh water'],
    onArrival: 'If you develop persistent diarrhoea lasting more than 2 weeks after returning, see your GP and specifically request Giardia and Cryptosporidium PCR tests — routine stool tests often miss them.',
    australiansTip: '🇦🇺 "Bali belly" is often Giardia. Over 300,000 Australians visit Bali alone each year — parasitic gut infections are a very common returning-traveller diagnosis.',
  },
  'sub-saharan-africa': {
    id: 'sub-saharan-africa',
    name: 'Sub-Saharan Africa',
    risk: 'very-high',
    countries: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia', 'Nigeria', 'Ghana', 'South Africa', 'Mozambique'],
    topParasites: ['Malaria (Plasmodium)', 'Schistosomiasis', 'Sleeping sickness', 'Hookworm', 'Roundworm', 'Giardia'],
    keyRisks: ['Mosquito bites (malaria)', 'Fresh water contact (schistosomiasis)', 'Contaminated food and water', 'Soil contact barefoot'],
    prevention: ['Malaria prophylaxis — consult travel medicine doctor before departure', 'Avoid all fresh water contact (rivers, lakes)', 'Insect repellent + long sleeves at dusk/dawn', 'Water purification tablets'],
    onArrival: 'If you have a fever in the weeks after visiting sub-Saharan Africa, seek urgent medical care and specifically mention your travel history — malaria must be excluded immediately.',
    australiansTip: '🇦🇺 See a travel medicine specialist at least 4–6 weeks before departure. Malaria prophylaxis must be started before you leave.',
  },
  'south-asia': {
    id: 'south-asia',
    name: 'South Asia',
    risk: 'high',
    countries: ['India', 'Bangladesh', 'Pakistan', 'Nepal', 'Sri Lanka'],
    topParasites: ['Giardia', 'Entamoeba histolytica', 'Typhoid', 'Hookworm', 'Roundworm', 'Cryptosporidium'],
    keyRisks: ['Contaminated drinking water', 'Street food safety', 'Barefoot contact with soil', 'Crowded settings'],
    prevention: ['Strict food and water hygiene', 'Avoid raw salads, street food from uncertain sources', 'Wear shoes outdoors', 'Consider hepatitis A vaccination'],
    onArrival: 'Amoebiasis (Entamoeba histolytica) can cause severe bloody diarrhoea and liver abscesses — if you develop these symptoms after South Asia travel, see a doctor urgently.',
    australiansTip: '🇦🇺 India is a top destination for Australian backpackers and those visiting family. "Delhi belly" often has a parasitic cause — always get tested if symptoms persist.',
  },
  'central-south-america': {
    id: 'central-south-america',
    name: 'Central & South America',
    risk: 'high',
    countries: ['Brazil', 'Peru', 'Colombia', 'Bolivia', 'Ecuador', 'Venezuela', 'Guatemala', 'Honduras'],
    topParasites: ['Malaria', 'Chagas disease', 'Leishmaniasis', 'Giardia', 'Roundworm', 'Hookworm'],
    keyRisks: ['Triatomine bug bites (Chagas)', 'Mosquito bites (malaria, dengue)', 'Contaminated water', 'Raw food'],
    prevention: ['Malaria prophylaxis for relevant regions', 'Avoid sleeping in mud-walled or thatched structures (Chagas risk)', 'Insect repellent + mosquito nets', 'Water purification'],
    onArrival: 'Chagas disease (Trypanosoma cruzi) is often asymptomatic for years but can cause severe heart disease decades later. Tell your doctor about Central/South America travel if you develop heart symptoms.',
    australiansTip: '🇦🇺 Amazon adventure travel is increasingly popular with Australians. Consult a travel medicine specialist before any trip to jungle regions.',
  },
  'pacific-islands': {
    id: 'pacific-islands',
    name: 'Pacific Islands',
    risk: 'moderate',
    countries: ['Papua New Guinea', 'Fiji', 'Vanuatu', 'Solomon Islands', 'Samoa', 'Tonga'],
    topParasites: ['Malaria (PNG)', 'Filariasis', 'Strongyloides', 'Hookworm', 'Giardia'],
    keyRisks: ['Mosquito bites (malaria in PNG)', 'Contaminated water', 'Barefoot soil contact', 'Fresh water swimming'],
    prevention: ['Malaria prophylaxis for Papua New Guinea', 'Water safety vigilance', 'Shoes outdoors', 'Insect repellent'],
    onArrival: 'Papua New Guinea carries significant malaria risk. All other Pacific islands have lower but still real risks from gut parasites and water-borne infections.',
    australiansTip: '🇦🇺 Papua New Guinea is a unique high-risk destination very close to Australia. Malaria prophylaxis is essential. Fiji and other holiday islands carry moderate gut parasite risks.',
  },
  'middle-east': {
    id: 'middle-east',
    name: 'Middle East & North Africa',
    risk: 'moderate',
    countries: ['Egypt', 'Jordan', 'Lebanon', 'Morocco', 'Tunisia', 'UAE', 'Iran', 'Iraq'],
    topParasites: ['Cryptosporidium', 'Giardia', 'Leishmania', 'Entamoeba', 'Roundworm'],
    keyRisks: ['Contaminated food and water', 'Sand fly bites (Leishmaniasis)', 'Street food safety'],
    prevention: ['Bottled water only', 'Avoid raw vegetables and fruit', 'Insect repellent in rural areas'],
    onArrival: 'Traveller\'s diarrhoea is common. Seek testing if symptoms persist beyond 2 weeks.',
    australiansTip: '🇦🇺 Egypt and Morocco are popular Australian destinations. Be especially careful with water and unpeeled fruit.',
  },
  'east-asia': {
    id: 'east-asia',
    name: 'East Asia',
    risk: 'low',
    countries: ['Japan', 'South Korea', 'China', 'Taiwan', 'Hong Kong'],
    topParasites: ['Anisakis (raw fish)', 'Liver fluke', 'Clonorchis', 'Giardia'],
    keyRisks: ['Raw fish / sushi (Anisakis)', 'Raw freshwater fish', 'Contaminated water in rural areas'],
    prevention: ['Ensure sushi from reputable restaurants only', 'Avoid raw freshwater fish', 'Standard food hygiene'],
    onArrival: 'Severe stomach pain shortly after eating raw fish may indicate Anisakis — seek urgent medical attention.',
    australiansTip: '🇦🇺 Japan and Korea are very popular with Australians. Risk is low in cities. Be aware of raw fish parasites (Anisakis) if eating sushi/sashimi frequently.',
  },
  'western-europe': {
    id: 'western-europe',
    name: 'Western Europe',
    risk: 'minimal',
    countries: ['UK', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Portugal', 'Greece'],
    topParasites: ['Giardia (water)', 'Echinococcus (hydatid cyst — rare)', 'Anisakis (raw fish)'],
    keyRisks: ['Backcountry water sources', 'Raw fish in some regions', 'Dog contact in rural areas'],
    prevention: ['Standard food and water hygiene', 'Purify backcountry water', 'Wash hands after animal contact'],
    onArrival: 'Very low risk for most destinations. Standard hygiene precautions sufficient.',
    australiansTip: '🇦🇺 Extremely low risk for Australians. Standard precautions are sufficient for most Western European travel.',
  },
  'north-america': {
    id: 'north-america',
    name: 'North America & Western Countries',
    risk: 'minimal',
    countries: ['USA', 'Canada', 'New Zealand', 'Western Europe'],
    topParasites: ['Giardia (backcountry water)', 'Cryptosporidium'],
    keyRisks: ['Untreated backcountry water (hiking/camping)', 'Rare food safety incidents'],
    prevention: ['Purify all backcountry water', 'Standard food hygiene'],
    onArrival: 'Parasitic infection risk is similar to Australia. Only a concern for specific backcountry water exposure.',
    australiansTip: '🇦🇺 Negligible risk compared to other regions. Main concern is Giardia from untreated stream/lake water during hiking or camping.',
  },
}

const RISK_COLORS: Record<RiskTier, { bg: string; border: string; text: string; label: string; dot: string }> = {
  'very-high': { bg: 'bg-red-600',    border: 'border-red-700',   text: 'text-white',        label: '🔴 Very High Risk', dot: 'bg-red-600' },
  'high':      { bg: 'bg-orange-500', border: 'border-orange-600',text: 'text-white',        label: '🟠 High Risk',      dot: 'bg-orange-500' },
  'moderate':  { bg: 'bg-amber-400',  border: 'border-amber-500', text: 'text-slate-900',    label: '🟡 Moderate Risk',  dot: 'bg-amber-400' },
  'low':       { bg: 'bg-blue-400',   border: 'border-blue-500',  text: 'text-white',        label: '🔵 Low Risk',       dot: 'bg-blue-400' },
  'minimal':   { bg: 'bg-emerald-400',border: 'border-emerald-500',text: 'text-slate-900',   label: '🟢 Minimal Risk',   dot: 'bg-emerald-400' },
}

/* ─── SVG Map component ──────────────────────────────────────────────────────── */

// Simplified world region shapes as SVG paths
const REGION_PATHS: Record<string, string> = {
  'se-asia':             'M 710 180 L 760 160 L 800 180 L 820 230 L 790 270 L 750 280 L 700 250 L 690 210 Z',
  'sub-saharan-africa':  'M 490 220 L 560 200 L 590 260 L 570 340 L 520 380 L 470 350 L 450 280 L 460 240 Z',
  'south-asia':          'M 620 160 L 700 150 L 720 190 L 690 230 L 650 240 L 610 210 L 600 180 Z',
  'central-south-america':'M 220 200 L 310 190 L 330 280 L 300 370 L 240 380 L 200 320 L 190 250 Z',
  'pacific-islands':     'M 820 260 L 870 240 L 890 280 L 860 310 L 830 300 Z',
  'middle-east':         'M 560 140 L 630 130 L 650 170 L 620 200 L 570 190 L 550 165 Z',
  'east-asia':           'M 720 120 L 810 110 L 830 155 L 800 175 L 730 165 L 710 145 Z',
  'western-europe':      'M 450 90 L 520 80 L 540 120 L 510 145 L 460 135 L 440 110 Z',
  'north-america':       'M 100 80 L 230 70 L 240 160 L 200 180 L 120 170 L 90 130 Z',
}

export default function TravelRiskMapPage() {
  const [selected, setSelected] = useState<Region | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Plane className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Educational Tool</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Travel Parasite Risk Map
          </h1>
          <p className="text-slate-400 max-w-xl leading-relaxed">
            Understand parasite risks for Australian travellers by destination region. Click any region for detailed information and prevention tips.
          </p>
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mt-4 max-w-xl">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200">
              Educational reference only. Always consult a travel medicine specialist before international travel.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        {/* Risk legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.entries(RISK_COLORS) as [RiskTier, typeof RISK_COLORS[RiskTier]][]).map(([tier, cfg]) => (
            <div key={tier} className="flex items-center gap-1.5 text-xs text-slate-300">
              <div className={cn('w-3 h-3 rounded-full', cfg.dot)} />
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Interactive SVG Map */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-6">
          <svg viewBox="0 0 960 500" className="w-full" style={{ background: '#0f172a' }}>
            {/* Ocean background */}
            <rect width="960" height="500" fill="#0f172a" />

            {/* Grid lines */}
            {[100,200,300,400].map(y => (
              <line key={y} x1="0" y1={y} x2="960" y2={y} stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {[100,200,300,400,500,600,700,800,900].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="#1e293b" strokeWidth="0.5" />
            ))}

            {/* Region shapes */}
            {Object.entries(REGIONS).map(([key, region]) => {
              const path = REGION_PATHS[key]
              if (!path) return null
              const cfg = RISK_COLORS[region.risk]
              const isHovered = hovered === key
              const isSelected = selected?.id === key
              return (
                <g key={key}>
                  <path
                    d={path}
                    fill={isSelected ? '#0d9488' : isHovered ? '#1d4ed8' : cfg.dot.replace('bg-', '#').replace('-', '') }
                    fillOpacity={isHovered || isSelected ? 0.9 : 0.7}
                    stroke={isSelected ? '#0d9488' : '#1e293b'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(region)}
                  />
                  {/* Label */}
                  <text
                    x={/* centroid x approximation */ parseInt(REGION_PATHS[key].match(/M (\d+)/)?.[1] ?? '0') + 30}
                    y={parseInt(REGION_PATHS[key].match(/M \d+ (\d+)/)?.[1] ?? '0') + 25}
                    fontSize="8"
                    fill="white"
                    fillOpacity="0.9"
                    className="pointer-events-none select-none"
                    textAnchor="middle"
                  >
                    {region.name.split(' ')[0]}
                  </text>
                </g>
              )
            })}

            {/* Australia marker */}
            <g>
              <ellipse cx="800" cy="360" rx="40" ry="25" fill="#0d9488" fillOpacity="0.4" stroke="#0d9488" strokeWidth="1.5" />
              <text x="800" y="358" fontSize="8" fill="#5eead4" textAnchor="middle" className="select-none">🇦🇺 YOU ARE</text>
              <text x="800" y="368" fontSize="8" fill="#5eead4" textAnchor="middle" className="select-none">HERE</text>
            </g>
          </svg>
        </div>

        {/* Region cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(REGIONS).map((region) => {
            const cfg = RISK_COLORS[region.risk]
            const isSelected = selected?.id === region.id
            return (
              <button
                key={region.id}
                onClick={() => setSelected(isSelected ? null : region)}
                className={cn(
                  'text-left p-4 rounded-xl border transition-all',
                  isSelected
                    ? 'bg-teal-900/50 border-teal-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white leading-tight">{region.name}</p>
                  <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', cfg.dot)} />
                </div>
                <p className="text-[10px] text-slate-400 mb-2">{cfg.label}</p>
                <div className="flex flex-wrap gap-1">
                  {region.topParasites.slice(0, 3).map((p) => (
                    <span key={p} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelected(null)}>
          <div
            className="bg-slate-800 border border-slate-700 w-full sm:max-w-xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn('px-6 py-5 flex items-start justify-between', RISK_COLORS[selected.risk].bg)}>
              <div>
                <div className={cn('text-xs font-bold uppercase tracking-wider mb-1', RISK_COLORS[selected.risk].text)}>
                  {RISK_COLORS[selected.risk].label}
                </div>
                <h2 className={cn('font-display text-xl font-bold', RISK_COLORS[selected.risk].text)}>
                  {selected.name}
                </h2>
                <p className={cn('text-xs mt-1', RISK_COLORS[selected.risk].text, 'opacity-80')}>
                  {selected.countries.join(' · ')}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Top parasites */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />Main Parasite Risks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selected.topParasites.map((p) => (
                    <Badge key={p} className="bg-slate-700 text-slate-200 border-slate-600 text-xs">{p}</Badge>
                  ))}
                </div>
              </div>

              {/* Key risks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />Key risk factors
                </h3>
                <ul className="space-y-1.5">
                  {selected.keyRisks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />Prevention tips
                </h3>
                <ul className="space-y-1.5">
                  {selected.prevention.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* On return */}
              <div className="bg-teal-900/40 border border-teal-700/50 rounded-xl px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5" />When you return to Australia
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.onArrival}</p>
              </div>

              {/* Aussie tip */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3">
                <p className="text-sm text-slate-200 leading-relaxed">{selected.australiansTip}</p>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                ⚠️ Educational reference only. Always consult a travel medicine specialist before international travel. In Australia, smartraveller.gov.au has official travel health advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
