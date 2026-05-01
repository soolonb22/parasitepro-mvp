// @ts-nocheck
// HealthIntelligencePage.tsx
// PARA Health Intelligence — AI-powered educational health research engine
// Replaces SymptomJournalPage — paywall gated (subscription or 1 credit)

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: '#0A1628',
  surface: '#0F1F35',
  elevated: '#162840',
  border: 'rgba(255,255,255,0.08)',
  teal: '#1B6B5F',
  tealBright: '#5AB89A',
  amber: '#D97706',
  amberBright: '#FCD34D',
  purple: '#7C3AED',
  purpleBright: '#A78BFA',
  text: '#F1F5F9',
  muted: '#94A3B8',
  subtle: 'rgba(255,255,255,0.5)',
};

// ─── SYMPTOM OPTIONS ──────────────────────────────────────────────────────────
const SYMPTOM_GROUPS = [
  {
    group: 'Gut & Digestive',
    icon: '🫁',
    symptoms: ['Bloating', 'Gas', 'Constipation', 'Diarrhoea', 'Nausea', 'Stomach cramps', 'Mucus in stool', 'Visible worm/parasite', 'Undigested food in stool', 'Gurgling/noises', 'Alternating constipation/diarrhoea'],
  },
  {
    group: 'Energy & Brain',
    icon: '🧠',
    symptoms: ['Fatigue', 'Brain fog', 'Poor concentration', 'Memory issues', 'Mood swings', 'Anxiety', 'Depression', 'Insomnia', 'Waking at 1-3am', 'Restless legs'],
  },
  {
    group: 'Skin & Body',
    icon: '🩺',
    symptoms: ['Itchy skin', 'Rash or hives', 'Anal/rectal itching', 'Night sweats', 'Grinding teeth', 'Unexplained weight loss', 'Muscle aches', 'Joint pain', 'Swollen lymph nodes', 'Pallor/anaemia symptoms'],
  },
  {
    group: 'Immune & Systemic',
    icon: '🔬',
    symptoms: ['Frequent illness', 'Slow wound healing', 'Food intolerances', 'Chemical sensitivities', 'Histamine reactions', 'Mould sensitivity', 'Long-term post-travel symptoms', 'Unexplained iron deficiency'],
  },
];

const SLEEP_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Very poor'];
const MOOD_OPTIONS = ['Excellent', 'Good', 'Neutral', 'Low', 'Very low'];

// ─── EVIDENCE BADGE ───────────────────────────────────────────────────────────
const EvidenceBadge = ({ level }) => {
  const config = {
    'strong':      { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  color: '#4ade80',  label: 'Strong evidence' },
    'moderate':    { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.4)',  color: '#fbbf24',  label: 'Moderate evidence' },
    'emerging':    { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.4)', color: '#a5b4fc',  label: 'Emerging research' },
    'traditional': { bg: 'rgba(180,83,9,0.15)',   border: 'rgba(217,119,6,0.4)',  color: '#fcd34d',  label: 'Traditional use' },
  };
  const lc = (level || '').toLowerCase().split('/')[0].trim();
  const cfg = config[lc] || config['emerging'];
  return (
    <span style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontSize: '0.65rem', fontWeight: 700,
      padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap',
    }}>{cfg.label}</span>
  );
};

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon, title, children, accent = C.teal }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{title}</h3>
    </div>
    {children}
  </div>
);

// ─── BRIEF RENDERER ────────────────────────────────────────────────────────────
const BriefRenderer = ({ brief }) => {
  if (!brief) return null;
  return (
    <div>
      {/* Headline */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(27,107,95,0.25) 0%, rgba(99,102,241,0.15) 100%)',
        border: '1px solid rgba(90,184,154,0.3)',
        borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem',
      }}>
        <p style={{ fontSize: '1rem', color: C.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
          {brief.headline}
        </p>
      </div>

      {/* Pattern insight */}
      {brief.patternInsight && (
        <SectionCard icon="🧩" title="What researchers understand about this pattern" accent={C.tealBright}>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>{brief.patternInsight}</p>
        </SectionCard>
      )}

      {/* Conventional */}
      {brief.conventionalApproaches?.length > 0 && (
        <SectionCard icon="🏥" title="Conventional Medical Approaches" accent="#60A5FA">
          {brief.conventionalApproaches.map((a, i) => (
            <div key={i} style={{ marginBottom: i < brief.conventionalApproaches.length - 1 ? '1rem' : 0, paddingBottom: i < brief.conventionalApproaches.length - 1 ? '1rem' : 0, borderBottom: i < brief.conventionalApproaches.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <p style={{ fontWeight: 700, color: '#93C5FD', fontSize: '0.82rem', margin: '0 0 0.3rem' }}>{a.category}</p>
              <p style={{ fontSize: '0.82rem', color: C.muted, margin: '0 0 0.4rem', lineHeight: 1.65 }}>{a.summary}</p>
              {a.keyStudies && <p style={{ fontSize: '0.78rem', color: 'rgba(147,197,253,0.65)', margin: '0 0 0.3rem', fontStyle: 'italic' }}>📚 {a.keyStudies}</p>}
              {a.discussWithGP && (
                <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8, padding: '0.5rem 0.75rem', marginTop: '0.4rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#93C5FD', margin: 0 }}>💬 Ask your GP: {a.discussWithGP}</p>
                </div>
              )}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Nutritional */}
      {brief.nutritionalResearch?.length > 0 && (
        <SectionCard icon="🥦" title="Nutritional & Dietary Research" accent="#4ADE80">
          {brief.nutritionalResearch.map((n, i) => (
            <div key={i} style={{ marginBottom: i < brief.nutritionalResearch.length - 1 ? '1rem' : 0, paddingBottom: i < brief.nutritionalResearch.length - 1 ? '1rem' : 0, borderBottom: i < brief.nutritionalResearch.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <p style={{ fontWeight: 700, color: '#86EFAC', fontSize: '0.83rem', margin: 0 }}>{n.approach}</p>
                <EvidenceBadge level={n.evidence} />
              </div>
              <p style={{ fontSize: '0.8rem', color: C.muted, margin: '0 0 0.3rem', lineHeight: 1.6 }}>{n.mechanism}</p>
              {n.sources && <p style={{ fontSize: '0.76rem', color: 'rgba(134,239,172,0.7)', margin: 0, fontStyle: 'italic' }}>Key compounds: {n.sources}</p>}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Antiparasitic research — the unique high-value section */}
      {brief.antiParasiticResearch && (
        <SectionCard icon="⚗️" title="Anti-Parasitic & Anti-Pathogen Research" accent={C.amberBright}>
          <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 10, padding: '0.875rem', marginBottom: '0.875rem' }}>
            <p style={{ fontSize: '0.78rem', color: C.amberBright, fontWeight: 700, margin: '0 0 0.5rem' }}>Naturally occurring compounds studied for antiparasitic activity:</p>
            <p style={{ fontSize: '0.82rem', color: C.muted, margin: '0 0 0.75rem', lineHeight: 1.65 }}>{brief.antiParasiticResearch.naturalCompounds}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <EvidenceBadge level={brief.antiParasiticResearch.evidenceLevel?.split(' ')[0] || 'emerging'} />
            </div>
            {brief.antiParasiticResearch.historicalUse && (
              <p style={{ fontSize: '0.78rem', color: 'rgba(252,211,77,0.7)', margin: '0.5rem 0 0', fontStyle: 'italic' }}>📜 Traditional use: {brief.antiParasiticResearch.historicalUse}</p>
            )}
          </div>
          {brief.antiParasiticResearch.protocolsStudied && (
            <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.65, margin: '0 0 0.5rem' }}>
              <strong style={{ color: C.amberBright }}>Studied protocols:</strong> {brief.antiParasiticResearch.protocolsStudied}
            </p>
          )}
          {brief.antiParasiticResearch.importantNote && (
            <p style={{ fontSize: '0.75rem', color: 'rgba(252,211,77,0.6)', fontStyle: 'italic', margin: 0 }}>⚠️ {brief.antiParasiticResearch.importantNote}</p>
          )}
        </SectionCard>
      )}

      {/* Traditional & Historical */}
      {brief.traditionalAndHistorical?.length > 0 && (
        <SectionCard icon="📜" title="Traditional Medicine & Historical Approaches" accent="#F97316">
          {brief.traditionalAndHistorical.map((t, i) => (
            <div key={i} style={{ marginBottom: i < brief.traditionalAndHistorical.length - 1 ? '1rem' : 0, paddingBottom: i < brief.traditionalAndHistorical.length - 1 ? '1rem' : 0, borderBottom: i < brief.traditionalAndHistorical.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <p style={{ fontWeight: 700, color: '#FED7AA', fontSize: '0.82rem', margin: '0 0 0.3rem' }}>{t.tradition}</p>
              <p style={{ fontSize: '0.8rem', color: C.muted, margin: '0 0 0.3rem', lineHeight: 1.6 }}>{t.approach}</p>
              {t.modernResearch && <p style={{ fontSize: '0.78rem', color: 'rgba(254,215,170,0.7)', margin: '0 0 0.3rem', fontStyle: 'italic' }}>🔬 Modern research: {t.modernResearch}</p>}
              {t.compounds && <p style={{ fontSize: '0.76rem', color: 'rgba(254,215,170,0.6)', margin: 0 }}>Active compounds: {t.compounds}</p>}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Microbiome */}
      {brief.microbiomeAndGutHealth && (
        <SectionCard icon="🦠" title="Microbiome & Gut Health Research" accent={C.purpleBright}>
          <p style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.65, margin: '0 0 0.75rem' }}>{brief.microbiomeAndGutHealth.summary}</p>
          {brief.microbiomeAndGutHealth.keyResearch && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(167,139,250,0.8)', fontStyle: 'italic', margin: '0 0 0.5rem' }}>📚 {brief.microbiomeAndGutHealth.keyResearch}</p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {brief.microbiomeAndGutHealth.probioticStrains && (
              <div style={{ flex: 1, minWidth: 180, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '0.6rem 0.875rem' }}>
                <p style={{ fontSize: '0.7rem', color: C.purpleBright, fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Probiotic Strains Researched</p>
                <p style={{ fontSize: '0.76rem', color: C.muted, margin: 0 }}>{brief.microbiomeAndGutHealth.probioticStrains}</p>
              </div>
            )}
            {brief.microbiomeAndGutHealth.prebiotics && (
              <div style={{ flex: 1, minWidth: 180, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '0.6rem 0.875rem' }}>
                <p style={{ fontSize: '0.7rem', color: C.purpleBright, fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prebiotic Compounds</p>
                <p style={{ fontSize: '0.76rem', color: C.muted, margin: 0 }}>{brief.microbiomeAndGutHealth.prebiotics}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Environmental & Detox */}
      {brief.environmentalAndDetox && (
        <SectionCard icon="🌿" title="Detoxification & Environmental Burden Research" accent="#10B981">
          <p style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.65, margin: '0 0 0.75rem' }}>{brief.environmentalAndDetox.summary}</p>
          {brief.environmentalAndDetox.pathways && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(16,185,129,0.8)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>Relevant pathways: {brief.environmentalAndDetox.pathways}</p>
          )}
          {brief.environmentalAndDetox.keyCompounds && (
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '0.6rem 0.875rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase' }}>Researched compounds for clearance support</p>
              <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>{brief.environmentalAndDetox.keyCompounds}</p>
            </div>
          )}
        </SectionCard>
      )}

      {/* Hidden & Emerging — the gold section */}
      {brief.hiddenAndEmergingResearch?.length > 0 && (
        <SectionCard icon="💡" title="Lesser-Known & Emerging Research" accent="#EC4899">
          <p style={{ fontSize: '0.72rem', color: 'rgba(236,72,153,0.7)', margin: '0 0 0.875rem', fontStyle: 'italic' }}>
            Research that is often overlooked, under-discussed, or not yet mainstream
          </p>
          {brief.hiddenAndEmergingResearch.map((h, i) => (
            <div key={i} style={{
              background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.15)',
              borderRadius: 10, padding: '0.875rem', marginBottom: i < brief.hiddenAndEmergingResearch.length - 1 ? '0.75rem' : 0,
            }}>
              <p style={{ fontWeight: 800, color: '#F9A8D4', fontSize: '0.82rem', margin: '0 0 0.35rem' }}>{h.topic}</p>
              <p style={{ fontSize: '0.8rem', color: C.muted, margin: '0 0 0.35rem', lineHeight: 1.65 }}>{h.finding}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {h.source && <span style={{ fontSize: '0.7rem', color: 'rgba(249,168,212,0.6)', fontStyle: 'italic' }}>Source: {h.source}</span>}
              </div>
              {h.whyItMatters && <p style={{ fontSize: '0.76rem', color: '#F9A8D4', margin: '0.4rem 0 0', fontWeight: 600 }}>→ {h.whyItMatters}</p>}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Lifestyle */}
      {brief.lifestyleFactors?.length > 0 && (
        <SectionCard icon="🏃" title="Lifestyle Factors — Research Findings" accent="#06B6D4">
          {brief.lifestyleFactors.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < brief.lifestyleFactors.length - 1 ? '0.75rem' : 0 }}>
              <div style={{ width: 3, background: '#06B6D4', borderRadius: 4, flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, color: '#67E8F9', fontSize: '0.8rem', margin: '0 0 0.2rem' }}>{l.factor}</p>
                <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>{l.impact}</p>
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {/* GP Prep */}
      {brief.gpPrepNotes && (
        <div style={{
          background: 'rgba(27,107,95,0.15)', border: '1.5px solid rgba(90,184,154,0.4)',
          borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1rem',
        }}>
          <p style={{ fontWeight: 800, color: C.tealBright, fontSize: '0.85rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            🩺 Take this to your GP or integrative practitioner
          </p>
          <p style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>{brief.gpPrepNotes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <p style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.6)', textAlign: 'center', margin: '1rem 0 0', lineHeight: 1.6 }}>
        ⚠️ {brief.disclaimer || 'This educational brief is compiled from research literature. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.'}
      </p>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HealthIntelligencePage() {
  const navigate = useNavigate();
  const { accessToken, user, updateUser } = useAuthStore();
  const [tab, setTab] = useState('intelligence'); // 'intelligence' | 'journal' | 'timeline'

  // Intelligence tab state
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [context, setContext] = useState('');
  const [generating, setGenerating] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState('');
  const [creditsUsed, setCreditsUsed] = useState(null);
  const briefRef = useRef(null);

  // Journal tab state
  const [entries, setEntries] = useState([]);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    symptoms: [], severity: 5, energy_level: 5,
    sleep_quality: '', mood: '', bowel_movements: '',
    notes: '', diet_notes: '', supplements: '',
  });
  const [savingEntry, setSavingEntry] = useState(false);

  const headers = { Authorization: `Bearer ${accessToken}` };

  useEffect(() => {
    if (!accessToken) { navigate('/login'); return; }
    if (tab === 'journal') loadJournal();
  }, [tab]);

  const loadJournal = async () => {
    setLoadingJournal(true);
    try {
      const res = await axios.get(`${API_URL}/health-intelligence/entries`, { headers });
      setEntries(res.data.entries || []);
    } catch { } finally { setLoadingJournal(false); }
  };

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const generateBrief = async () => {
    if (selectedSymptoms.length === 0) { setError('Select at least one symptom'); return; }
    setError(''); setGenerating(true); setBrief(null);
    try {
      const res = await axios.post(`${API_URL}/health-intelligence/intelligence`,
        { symptoms: selectedSymptoms, context },
        { headers }
      );
      setBrief(res.data.brief);
      setCreditsUsed(res.data.creditsUsed);
      if (res.data.creditsRemaining !== null && res.data.creditsRemaining !== undefined) {
        updateUser({ imageCredits: res.data.creditsRemaining });
      }
      setTimeout(() => briefRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (e) {
      if (e.response?.status === 402) {
        setError('insufficient_credits');
      } else {
        setError(e.response?.data?.message || 'Failed to generate brief — please try again');
      }
    } finally { setGenerating(false); }
  };

  const saveEntry = async () => {
    setSavingEntry(true);
    try {
      const payload = {
        ...entryForm,
        bowel_movements: entryForm.bowel_movements ? parseInt(entryForm.bowel_movements) : null,
      };
      const res = await axios.post(`${API_URL}/health-intelligence/entries`, payload, { headers });
      setEntries(prev => [res.data.entry, ...prev]);
      setShowEntryForm(false);
      setEntryForm({
        entry_date: new Date().toISOString().split('T')[0],
        symptoms: [], severity: 5, energy_level: 5,
        sleep_quality: '', mood: '', bowel_movements: '',
        notes: '', diet_notes: '', supplements: '',
      });
    } catch { } finally { setSavingEntry(false); }
  };

  const isSubscriber = user?.isSubscriber;
  const credits = user?.imageCredits || 0;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0F1F35 0%, #162840 100%)', borderBottom: `1px solid ${C.border}`, padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,2rem) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
                <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#1B6B5F,#7C3AED)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🧬</div>
                <div>
                  <h1 style={{ fontSize: 'clamp(1.4rem,3.5vw,1.9rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
                    PARA Health Intelligence
                  </h1>
                  <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0 }}>AI-powered research engine · Educational use only</p>
                </div>
              </div>
              <p style={{ fontSize: '0.83rem', color: C.muted, margin: 0, maxWidth: 540, lineHeight: 1.6 }}>
                Surface peer-reviewed research, traditional medicine knowledge, and emerging science about your symptoms — compiled into a structured educational brief.
              </p>
            </div>

            {/* Access badge */}
            <div style={{
              background: isSubscriber ? 'rgba(27,107,95,0.2)' : 'rgba(217,119,6,0.12)',
              border: `1px solid ${isSubscriber ? 'rgba(90,184,154,0.4)' : 'rgba(217,119,6,0.4)'}`,
              borderRadius: 12, padding: '0.625rem 1rem', textAlign: 'center', flexShrink: 0,
            }}>
              {isSubscriber ? (
                <>
                  <p style={{ fontSize: '0.7rem', color: C.tealBright, fontWeight: 700, margin: '0 0 0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subscriber</p>
                  <p style={{ fontSize: '0.75rem', color: C.muted, margin: 0 }}>Unlimited access</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: C.amberBright, margin: '0 0 0.1rem', lineHeight: 1 }}>{credits}</p>
                  <p style={{ fontSize: '0.7rem', color: C.muted, margin: '0 0 0.4rem' }}>credits remaining</p>
                  <button onClick={() => navigate('/pricing')} style={{ background: C.amber, color: '#000', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                    1 credit per brief
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[
              { id: 'intelligence', label: '🧬 AI Research Brief' },
              { id: 'journal', label: '📓 Symptom Journal' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? C.teal : 'transparent',
                color: tab === t.id ? 'white' : C.muted,
                border: 'none', padding: '0.7rem 1.25rem',
                borderRadius: '10px 10px 0 0', fontSize: '0.83rem', fontWeight: tab === t.id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(1.25rem,3vw,2rem) clamp(1rem,3vw,1.5rem)' }}>

        {/* ── INTELLIGENCE TAB ──────────────────────────────────────── */}
        {tab === 'intelligence' && (
          <div>
            {/* Insufficient credits gate */}
            {error === 'insufficient_credits' && (
              <div style={{ background: 'rgba(217,119,6,0.1)', border: '1.5px solid rgba(217,119,6,0.4)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                <h3 style={{ color: C.amberBright, margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 800 }}>1 credit required for an AI Health Brief</h3>
                <p style={{ color: C.muted, fontSize: '0.83rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
                  Each AI intelligence brief costs 1 credit, or subscribe for $6/mo for unlimited access.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/pricing')} style={{ background: C.amber, color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
                    Get credits
                  </button>
                  <button onClick={() => navigate('/pricing#subscription')} style={{ background: 'transparent', color: C.amberBright, border: `1px solid rgba(217,119,6,0.5)`, borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                    Subscribe for $6/mo →
                  </button>
                </div>
              </div>
            )}

            {!brief && (
              <>
                {/* Symptom selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: C.text, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    1. Select your symptoms or concerns
                  </h2>
                  {SYMPTOM_GROUPS.map(group => (
                    <div key={group.group} style={{ marginBottom: '1.25rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: C.muted, margin: '0 0 0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {group.icon} {group.group}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {group.symptoms.map(s => {
                          const on = selectedSymptoms.includes(s);
                          return (
                            <button key={s} onClick={() => toggleSymptom(s)} style={{
                              background: on ? C.teal : 'rgba(255,255,255,0.04)',
                              color: on ? 'white' : C.muted,
                              border: `1px solid ${on ? C.tealBright : C.border}`,
                              borderRadius: 20, padding: '5px 13px',
                              fontSize: '0.78rem', fontWeight: on ? 700 : 500,
                              cursor: 'pointer', transition: 'all 0.12s',
                            }}>{s}</button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected summary */}
                {selectedSymptoms.length > 0 && (
                  <div style={{ background: 'rgba(27,107,95,0.1)', border: '1px solid rgba(90,184,154,0.25)', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', color: C.tealBright, fontWeight: 700, margin: '0 0 0.4rem' }}>{selectedSymptoms.length} symptoms selected:</p>
                    <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0 }}>{selectedSymptoms.join(', ')}</p>
                  </div>
                )}

                {/* Context input */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 800, color: C.text, display: 'block', margin: '0 0 0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    2. Add context (optional)
                  </label>
                  <textarea
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    placeholder="e.g. Returned from Bali 3 weeks ago. Symptoms started after a camping trip. Have a dog. Taking iron supplements..."
                    rows={3}
                    style={{
                      width: '100%', background: C.surface, color: C.text,
                      border: `1px solid ${C.border}`, borderRadius: 12,
                      padding: '0.875rem', fontSize: '0.83rem', resize: 'vertical',
                      outline: 'none', boxSizing: 'border-box', lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={generateBrief}
                  disabled={generating || selectedSymptoms.length === 0}
                  style={{
                    width: '100%', padding: '1rem',
                    background: generating || selectedSymptoms.length === 0
                      ? 'rgba(255,255,255,0.08)'
                      : 'linear-gradient(135deg,#1B6B5F,#7C3AED)',
                    color: generating || selectedSymptoms.length === 0 ? C.muted : 'white',
                    border: 'none', borderRadius: 14,
                    fontSize: '1rem', fontWeight: 900, cursor: generating || selectedSymptoms.length === 0 ? 'not-allowed' : 'pointer',
                    letterSpacing: '-0.01em', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}
                >
                  {generating ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '1.1rem' }}>⚙️</span>
                      Researching {selectedSymptoms.length} symptoms across databases…
                    </>
                  ) : (
                    <>🧬 Generate Health Intelligence Brief {!isSubscriber && credits > 0 ? `— uses 1 credit (${credits} remaining)` : isSubscriber ? '— included in subscription' : '— 1 credit required'}</>
                  )}
                </button>
                <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

                {error && error !== 'insufficient_credits' && (
                  <p style={{ color: '#F87171', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.75rem' }}>{error}</p>
                )}
              </>
            )}

            {/* Brief output */}
            {brief && (
              <div ref={briefRef}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 0.25rem', color: C.tealBright }}>
                      🧬 Health Intelligence Brief
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: C.muted, margin: 0 }}>
                      Based on: {selectedSymptoms.join(', ')}
                      {creditsUsed === 0 ? ' · Subscriber access' : ' · 1 credit used'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setBrief(null); setCreditsUsed(null); setError(''); }}
                    style={{ background: 'rgba(255,255,255,0.06)', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 10, padding: '7px 16px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    ← New search
                  </button>
                </div>
                <BriefRenderer brief={brief} />
              </div>
            )}
          </div>
        )}

        {/* ── JOURNAL TAB ────────────────────────────────────────────── */}
        {tab === 'journal' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>📓 Symptom Journal</h2>
              <button onClick={() => setShowEntryForm(v => !v)} style={{ background: C.teal, color: 'white', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                {showEntryForm ? '✕ Cancel' : '+ Log today'}
              </button>
            </div>

            {/* Entry form */}
            {showEntryForm && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Date</label>
                    <input type="date" value={entryForm.entry_date} onChange={e => setEntryForm(p => ({ ...p, entry_date: e.target.value }))}
                      style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Energy {entryForm.energy_level}/10</label>
                    <input type="range" min={1} max={10} value={entryForm.energy_level} onChange={e => setEntryForm(p => ({ ...p, energy_level: +e.target.value }))}
                      style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Severity {entryForm.severity}/10</label>
                    <input type="range" min={1} max={10} value={entryForm.severity} onChange={e => setEntryForm(p => ({ ...p, severity: +e.target.value }))}
                      style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Mood</label>
                    <select value={entryForm.mood} onChange={e => setEntryForm(p => ({ ...p, mood: e.target.value }))}
                      style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: '0.82rem' }}>
                      <option value="">Select</option>
                      {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Sleep quality</label>
                    <select value={entryForm.sleep_quality} onChange={e => setEntryForm(p => ({ ...p, sleep_quality: e.target.value }))}
                      style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: '0.82rem' }}>
                      <option value="">Select</option>
                      {SLEEP_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Bowel movements</label>
                    <input type="number" min={0} max={20} value={entryForm.bowel_movements} onChange={e => setEntryForm(p => ({ ...p, bowel_movements: e.target.value }))}
                      placeholder="Number today" style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Symptoms */}
                <div style={{ marginBottom: '0.875rem' }}>
                  <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Symptoms today</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {SYMPTOM_GROUPS.flatMap(g => g.symptoms).slice(0, 20).map(s => {
                      const on = entryForm.symptoms.includes(s);
                      return (
                        <button key={s} onClick={() => setEntryForm(p => ({ ...p, symptoms: on ? p.symptoms.filter(x => x !== s) : [...p.symptoms, s] }))}
                          style={{ background: on ? C.teal : 'rgba(255,255,255,0.04)', color: on ? 'white' : C.muted, border: `1px solid ${on ? C.tealBright : C.border}`, borderRadius: 16, padding: '4px 11px', fontSize: '0.73rem', cursor: 'pointer' }}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Notes</label>
                    <textarea value={entryForm.notes} onChange={e => setEntryForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                      placeholder="How did you feel today..."
                      style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: '0.8rem', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Supplements taken</label>
                    <textarea value={entryForm.supplements} onChange={e => setEntryForm(p => ({ ...p, supplements: e.target.value }))} rows={2}
                      placeholder="Probiotics, magnesium, wormwood..."
                      style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: '0.8rem', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <button onClick={saveEntry} disabled={savingEntry}
                  style={{ background: C.teal, color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
                  {savingEntry ? 'Saving…' : 'Save entry'}
                </button>
              </div>
            )}

            {/* Entry list */}
            {loadingJournal ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: '3rem' }}>Loading journal…</p>
            ) : entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📓</div>
                <p style={{ fontWeight: 700, color: C.text, marginBottom: '0.5rem' }}>No journal entries yet</p>
                <p style={{ fontSize: '0.82rem' }}>Start logging daily symptoms to track patterns over time — and use the AI tab to research what they might mean.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {entries.map(e => (
                  <div key={e.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: 8 }}>
                      <p style={{ fontWeight: 800, color: C.text, margin: 0, fontSize: '0.88rem' }}>
                        {new Date(e.entry_date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {e.severity && <span style={{ fontSize: '0.72rem', color: '#F87171', fontWeight: 700 }}>Severity {e.severity}/10</span>}
                        {e.energy_level && <span style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 700 }}>Energy {e.energy_level}/10</span>}
                        {e.mood && <span style={{ fontSize: '0.72rem', color: C.muted }}>{e.mood}</span>}
                      </div>
                    </div>
                    {e.symptoms?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: e.notes ? '0.5rem' : 0 }}>
                        {e.symptoms.map(s => (
                          <span key={s} style={{ background: 'rgba(27,107,95,0.15)', color: C.tealBright, border: '1px solid rgba(90,184,154,0.2)', borderRadius: 12, padding: '2px 8px', fontSize: '0.7rem' }}>{s}</span>
                        ))}
                      </div>
                    )}
                    {e.notes && <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0 }}>{e.notes}</p>}
                    {e.supplements && <p style={{ fontSize: '0.73rem', color: 'rgba(167,139,250,0.7)', margin: '0.3rem 0 0', fontStyle: 'italic' }}>Supplements: {e.supplements}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
