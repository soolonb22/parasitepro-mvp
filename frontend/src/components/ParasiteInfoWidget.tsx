// @ts-nocheck
import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Camera, Info, ChevronRight, Zap, Shield } from 'lucide-react';

const PARASITES = [
  {
    name: 'Roundworm',
    sci: 'Ascaris lumbricoides',
    risk: 'HIGH',
    region: 'Tropical QLD',
    color: '#EF4444',
    desc: 'Most common intestinal parasite in tropical QLD. Eggs survive in soil for years. Transmitted via contaminated food/water.',
    signs: ['Abdominal pain', 'Nausea', 'Visible in stool'],
    tip: 'Wash hands before meals. Cook food thoroughly. Filter drinking water.',
  },
  {
    name: 'Hookworm',
    sci: 'Ancylostoma duodenale',
    risk: 'HIGH',
    region: 'North QLD',
    color: '#F59E0B',
    desc: 'Penetrates skin on contact with contaminated soil. Common in barefoot walkers and remote communities in North QLD.',
    signs: ['Iron deficiency', 'Fatigue', 'Skin itching at entry site'],
    tip: 'Wear footwear outdoors. Avoid walking barefoot on soil in tropical regions.',
  },
  {
    name: 'Pinworm',
    sci: 'Enterobius vermicularis',
    risk: 'MODERATE',
    region: 'Australia-wide',
    color: '#FBBF24',
    desc: 'Most common worm infection in children Australia-wide. Spreads through direct contact and contaminated surfaces.',
    signs: ['Anal itching at night', 'Disturbed sleep', 'Visible eggs around anus'],
    tip: 'Wash hands and bedding regularly. Keep fingernails short. Treat all household members.',
  },
  {
    name: 'Giardia',
    sci: 'Giardia intestinalis',
    risk: 'MODERATE',
    region: 'Water sources',
    color: '#8B5CF6',
    desc: 'Waterborne parasite found in contaminated water supplies and animal faeces. Common in travellers and bushwalkers.',
    signs: ['Watery diarrhoea', 'Bloating', 'Greasy stools'],
    tip: 'Boil or filter water when camping. Avoid swallowing water from streams or lakes.',
  },
  {
    name: 'Toxocara',
    sci: 'Toxocara canis/cati',
    risk: 'MODERATE',
    region: 'Pet owners / Parks',
    color: '#10B981',
    desc: 'Transmitted from dog and cat faeces. Children playing in contaminated soil or sandpits are most at risk.',
    signs: ['Fever', 'Coughing', 'Eye inflammation'],
    tip: 'Deworm pets regularly. Cover sandpits when not in use. Wash children\'s hands after outdoor play.',
  },
  {
    name: 'Scabies',
    sci: 'Sarcoptes scabiei',
    risk: 'HIGH',
    region: 'Remote communities',
    color: '#EC4899',
    desc: 'Highly contagious skin mite causing intense itching. Significant health burden in remote Indigenous Australian communities.',
    signs: ['Intense itching', 'Burrow tracks on skin', 'Rash between fingers'],
    tip: 'Treat all close contacts simultaneously. Wash clothing and bedding in hot water.',
  },
];

const PHOTO_TIPS = [
  { icon: '☀️', title: 'Good lighting', body: 'Natural light or a bright lamp works best. Avoid flash glare directly on the sample.' },
  { icon: '🔍', title: 'Macro mode', body: 'Use your phone\'s portrait or macro setting for close-up clarity. Tap to focus on the specimen.' },
  { icon: '📐', title: 'Include scale', body: 'Place a coin or ruler next to the specimen so we can estimate size accurately.' },
  { icon: '🖼️', title: 'White background', body: 'A white container, tissue, or paper background dramatically improves contrast and visibility.' },
  { icon: '📸', title: 'Multiple angles', body: 'Photograph from above and from the side. Multiple views increase identification confidence.' },
  { icon: '🧹', title: 'Isolate specimen', body: 'If possible, isolate the specimen from surrounding material for a cleaner analysis.' },
];

const riskColour = (risk) => ({
  HIGH: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  MODERATE: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#F59E0B' },
  LOW: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#10B981' },
}[risk] || { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', text: '#9CA3AF' });

export default function ParasiteInfoWidget() {
  const [tab, setTab] = useState<'alerts' | 'library' | 'tips'>('alerts');
  const [selected, setSelected] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);

  // Auto-rotate ticker
  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % PARASITES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const p = PARASITES[selected];
  const rc = riskColour(p.risk);

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 14, overflow: 'hidden' }}>

      {/* Header + tabs */}
      <div style={{ padding: '16px 20px 0', borderBottom: '1px solid var(--bg-border)', background: 'rgba(217,119,6,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Queensland Parasite Intelligence</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'alerts', label: '⚠ Regional Alerts' },
            { key: 'library', label: '🔬 Parasite Library' },
            { key: 'tips', label: '📸 Photo Tips' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              style={{
                padding: '7px 14px', fontSize: 12, fontWeight: 600, borderRadius: '8px 8px 0 0',
                border: '1px solid', borderBottom: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                background: tab === key ? 'var(--bg-base)' : 'transparent',
                borderColor: tab === key ? 'var(--bg-border)' : 'transparent',
                color: tab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>

        {/* ─── TAB: ALERTS ─── */}
        {tab === 'alerts' && (
          <div>
            {/* Live ticker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(14,15,17,0.6)', borderRadius: 8, marginBottom: 16, border: '1px solid var(--bg-border)', overflow: 'hidden' }}>
              <Zap size={12} style={{ color: 'var(--amber)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>NOW ACTIVE:</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {PARASITES[tickerIdx].name} — elevated risk in {PARASITES[tickerIdx].region}
              </span>
            </div>

            {/* Alert cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PARASITES.filter(p => p.risk === 'HIGH').map((par) => {
                const rc2 = riskColour(par.risk);
                return (
                  <div key={par.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: rc2.bg, border: `1px solid ${rc2.border}`, cursor: 'pointer' }}
                    onClick={() => { setSelected(PARASITES.indexOf(par)); setTab('library'); }}>
                    <AlertTriangle size={14} style={{ color: rc2.text, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{par.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 6px', borderRadius: 4, background: rc2.border, color: rc2.text, fontWeight: 700 }}>{par.risk}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <MapPin size={10} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{par.region}</span>
                      </div>
                    </div>
                    <ChevronRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                );
              })}
              {/* Moderate alerts (collapsed) */}
              <div style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--bg-border)', background: 'rgba(245,158,11,0.04)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  + {PARASITES.filter(p => p.risk === 'MODERATE').length} moderate-risk species currently active in QLD →
                  <button onClick={() => setTab('library')} style={{ marginLeft: 6, color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-mono)' }}>View library</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <Shield size={12} style={{ color: '#10B981', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#A7F3D0', lineHeight: 1.5 }}>
                  Alert data is compiled from Queensland Health surveillance reports. Always confirm findings with a healthcare professional.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: LIBRARY ─── */}
        {tab === 'library' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Selector column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PARASITES.map((par, i) => {
                const rc2 = riskColour(par.risk);
                const isSelected = i === selected;
                return (
                  <button key={par.name} onClick={() => setSelected(i)} style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${isSelected ? rc2.border : 'var(--bg-border)'}`,
                    background: isSelected ? rc2.bg : 'transparent',
                    transition: 'all 0.15s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: par.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{par.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{par.sci}</div>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div style={{ background: 'var(--bg-base)', border: `1px solid ${rc.border}`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 6px', borderRadius: 4, background: rc.border, color: rc.text, fontWeight: 700 }}>{p.risk}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.sci}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <MapPin size={10} style={{ color: p.color }} />
                  <span style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.region}</span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>

              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Common signs</div>
                {p.signs.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '8px 10px', borderRadius: 7, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.15)' }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--amber)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prevention tip</div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{p.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: PHOTO TIPS ─── */}
        {tab === 'tips' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Camera size={14} style={{ color: 'var(--amber)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Get the best analysis results</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PHOTO_TIPS.map((tip, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--bg-border)', transition: 'border-color 0.2s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(217,119,6,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bg-border)')}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{tip.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{tip.title}</div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{tip.body}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.2)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Info size={12} style={{ color: 'var(--amber)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--amber)', lineHeight: 1.6 }}>
                  <strong>Pro tip:</strong> Capture multiple images from different angles. Our AI averages across all submitted views for a higher confidence rating.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
