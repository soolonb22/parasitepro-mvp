// @ts-nocheck
import { useState } from 'react';
import { MapPin, AlertTriangle, Info, X } from 'lucide-react';

const REGIONS = [
  {
    id: 'nth-qld',
    label: 'North QLD',
    x: 76, y: 30,
    risk: 'EXTREME',
    color: '#EF4444',
    parasites: ['Hookworm', 'Threadworm', 'Roundworm', 'Scabies', 'Dirofilaria'],
    detail: 'Highest parasite burden in Australia. Tropical humidity and heat accelerate larval development in soil. Remote communities face elevated risk due to limited healthcare access.',
  },
  {
    id: 'tropical-qld',
    label: 'Tropical QLD',
    x: 74, y: 42,
    risk: 'HIGH',
    color: '#F97316',
    parasites: ['Giardia', 'Cryptosporidium', 'Toxocara', 'Pinworm'],
    detail: 'Wet season flooding increases waterborne parasite transmission. Cairns, Townsville and surrounding areas see seasonal spikes in Giardia and Cryptosporidium cases.',
  },
  {
    id: 'nt',
    label: 'Northern Territory',
    x: 52, y: 28,
    risk: 'EXTREME',
    color: '#EF4444',
    parasites: ['Strongyloides', 'Hookworm', 'Roundworm', 'Scabies'],
    detail: 'Some of the highest Strongyloides stercoralis prevalence globally. Remote Aboriginal communities carry significant burden. Hyperinfection risk in immunocompromised individuals.',
  },
  {
    id: 'wa-north',
    label: 'North WA',
    x: 24, y: 28,
    risk: 'HIGH',
    color: '#F97316',
    parasites: ['Hookworm', 'Scabies', 'Loa loa (travellers)', 'Giardia'],
    detail: 'Kimberley and Pilbara regions have elevated hookworm and scabies rates, particularly in remote communities. Fly-in/fly-out workers returning from PNG face additional risks.',
  },
  {
    id: 'se-qld',
    label: 'South East QLD',
    x: 82, y: 58,
    risk: 'MODERATE',
    color: '#FBBF24',
    parasites: ['Pinworm', 'Toxocara', 'Giardia', 'Tapeworm'],
    detail: 'Brisbane region sees high rates of Enterobius (pinworm) in school-aged children, and Toxocara in pet-owning households. Subtropical climate extends transmission season.',
  },
  {
    id: 'nsw',
    label: 'NSW',
    x: 76, y: 68,
    risk: 'LOW-MOD',
    color: '#84CC16',
    parasites: ['Pinworm', 'Giardia', 'Toxoplasma', 'Tapeworm'],
    detail: 'Temperate climate limits most tropical parasites but childcare-associated Giardia and pinworm remain common. Sydney Water occasionally reports Cryptosporidium in catchments.',
  },
  {
    id: 'vic',
    label: 'Victoria',
    x: 70, y: 78,
    risk: 'LOW',
    color: '#22D3EE',
    parasites: ['Giardia', 'Pinworm', 'Toxoplasma'],
    detail: 'Lower risk due to cooler climate. Most cases involve pinworm in children, Giardia from water sources, or Toxoplasma from undercooked meat or cat exposure.',
  },
  {
    id: 'sa',
    label: 'South Australia',
    x: 55, y: 68,
    risk: 'LOW',
    color: '#22D3EE',
    parasites: ['Giardia', 'Pinworm', 'Tapeworm'],
    detail: 'Generally low parasite burden. Tapeworm cases occasionally linked to consumption of undercooked beef or pork from regional areas.',
  },
];

const RISK_COLORS: Record<string, string> = {
  EXTREME: '#EF4444',
  HIGH: '#F97316',
  MODERATE: '#FBBF24',
  'LOW-MOD': '#84CC16',
  LOW: '#22D3EE',
};

export default function AustraliaRiskMap() {
  const [active, setActive] = useState<typeof REGIONS[0] | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="pp-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <MapPin size={14} style={{ color: 'var(--amber)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber)' }}>
          Australia Parasite Risk Map
        </span>
      </div>

      {/* MAP + DETAIL LAYOUT */}
      <div style={{ display: 'flex', gap: 16 }}>

        {/* SVG MAP */}
        <div style={{ position: 'relative', flex: '0 0 auto', width: 200 }}>
          {/* Simple Australia silhouette SVG */}
          <svg viewBox="0 0 110 100" style={{ width: '100%', height: 'auto' }}>
            {/* Australia outline - simplified polygon */}
            <path
              d="M20,20 L28,14 L38,12 L48,10 L60,8 L72,10 L82,14 L88,20 L92,28 L94,36 L92,44 L88,50 L90,58 L88,66 L84,72 L78,76 L72,80 L66,84 L60,86 L54,84 L50,80 L46,76 L40,72 L36,68 L30,64 L24,58 L20,52 L16,44 L14,36 L16,28 Z"
              fill="rgba(30,31,36,0.8)"
              stroke="rgba(217,119,6,0.25)"
              strokeWidth="0.8"
            />
            {/* Tasmania */}
            <ellipse cx="72" cy="90" rx="5" ry="4" fill="rgba(30,31,36,0.8)" stroke="rgba(217,119,6,0.2)" strokeWidth="0.6" />

            {/* Region dots */}
            {REGIONS.map(r => (
              <g key={r.id} style={{ cursor: 'pointer' }}
                onClick={() => setActive(active?.id === r.id ? null : r)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Pulse ring */}
                {(active?.id === r.id || hovered === r.id) && (
                  <circle cx={r.x} cy={r.y} r="8" fill="none" stroke={r.color} strokeWidth="0.8" opacity="0.4">
                    <animate attributeName="r" values="5;11;5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Main dot */}
                <circle
                  cx={r.x} cy={r.y} r={active?.id === r.id ? 5 : 4}
                  fill={r.color}
                  stroke={active?.id === r.id ? '#fff' : 'rgba(0,0,0,0.4)'}
                  strokeWidth={active?.id === r.id ? 1.5 : 0.8}
                  opacity={active && active.id !== r.id ? 0.5 : 1}
                />
                {/* Label */}
                <text
                  x={r.x} y={r.y + 10}
                  textAnchor="middle"
                  style={{ fontSize: '4px', fontFamily: 'monospace', fill: active?.id === r.id ? '#fff' : 'rgba(255,255,255,0.55)', pointerEvents: 'none' }}
                >
                  {r.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8 }}>
            {Object.entries(RISK_COLORS).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: v, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {active ? (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:none } }`}</style>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 10, fontWeight: 700, letterSpacing: '0.05em',
                      background: `${active.color}22`, color: active.color, border: `1px solid ${active.color}44`
                    }}>{active.risk}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{active.label}</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{active.detail}</p>
                </div>
                <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, padding: 2 }}>
                  <X size={12} />
                </button>
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Common species</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {active.parasites.map(p => (
                    <span key={p} style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 8,
                      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                      border: '1px solid var(--bg-border)', fontFamily: 'monospace'
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
              <Info size={18} style={{ opacity: 0.4 }} />
              <p style={{ fontSize: 11, lineHeight: 1.5 }}>Tap a region to see parasite risk data for that area of Australia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
