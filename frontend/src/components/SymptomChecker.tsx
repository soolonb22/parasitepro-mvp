// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, RefreshCw, AlertTriangle, Upload } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'location',
    q: 'Where did you notice it?',
    options: [
      { label: 'Stool / toilet bowl', value: 'stool', icon: '🔬' },
      { label: 'Skin / rash', value: 'skin', icon: '🩹' },
      { label: 'Around the anus', value: 'anal', icon: '⚠️' },
      { label: 'Vomit', value: 'vomit', icon: '🤢' },
    ],
  },
  {
    id: 'appearance',
    q: 'What does it look like?',
    options: [
      { label: 'Moving / wriggling', value: 'moving', icon: '〰️' },
      { label: 'White/cream coloured', value: 'white', icon: '⬜' },
      { label: 'Small and thread-like', value: 'thread', icon: '🧵' },
      { label: 'Flat / ribbon-like', value: 'flat', icon: '🎗️' },
      { label: 'Egg-shaped / round', value: 'egg', icon: '🥚' },
      { label: 'Lesion or track in skin', value: 'skin_track', icon: '〰️' },
    ],
  },
  {
    id: 'symptoms',
    q: 'Any associated symptoms?',
    options: [
      { label: 'Itching / scratching', value: 'itch', icon: '🤚' },
      { label: 'Stomach cramps', value: 'cramps', icon: '😖' },
      { label: 'Fatigue / anaemia', value: 'fatigue', icon: '😴' },
      { label: 'Weight loss', value: 'weight', icon: '⚖️' },
      { label: 'None / unsure', value: 'none', icon: '❓' },
    ],
  },
];

const RESULTS: Record<string, { title: string; sci: string; urgency: 'LOW' | 'MODERATE' | 'HIGH'; color: string; body: string }> = {
  'stool|thread|itch':     { title: 'Pinworm likely', sci: 'Enterobius vermicularis', urgency: 'MODERATE', color: '#FBBF24', body: 'Very common in children. Highly treatable with antiparasitic medication. The whole household is typically treated simultaneously.' },
  'stool|flat|none':       { title: 'Tapeworm possible', sci: 'Taenia sp.', urgency: 'MODERATE', color: '#FBBF24', body: 'Flat, ribbon-like segments in stool suggest tapeworm. Associated with undercooked meat. See your GP for stool testing and treatment.' },
  'stool|moving|cramps':   { title: 'Roundworm possible', sci: 'Ascaris lumbricoides', urgency: 'HIGH', color: '#F97316', body: 'Active worms in stool with cramping indicates moderate infection. See a GP promptly. Common in tropical QLD, highly treatable.' },
  'skin|skin_track|itch':  { title: 'Larva migrans possible', sci: 'Ancylostoma braziliense', urgency: 'HIGH', color: '#F97316', body: 'The snake-like track through skin is classic cutaneous larva migrans (hookworm). Seek medical attention within 48 hours for antiparasitic treatment.' },
  'skin|egg|itch':         { title: 'Scabies possible', sci: 'Sarcoptes scabiei', urgency: 'HIGH', color: '#F97316', body: 'Intense itching with small raised lesions suggests scabies mite infestation. Contagious — all close contacts must be treated simultaneously.' },
  'anal|thread|itch':      { title: 'Pinworm very likely', sci: 'Enterobius vermicularis', urgency: 'MODERATE', color: '#FBBF24', body: 'Anal itching, especially at night, combined with thread-like worms is the classic presentation of pinworm. Common in children. Treat the whole household.' },
  'stool|white|none':      { title: 'Could be pinworm or tapeworm', sci: 'Multiple possibilities', urgency: 'MODERATE', color: '#FBBF24', body: 'White material in stool could be pinworm segments or tapeworm proglottids. Upload an image for AI-assisted identification.' },
  'vomit|moving|fatigue':  { title: 'Roundworm — seek care', sci: 'Ascaris lumbricoides', urgency: 'HIGH', color: '#EF4444', body: 'Worms visible in vomit indicates heavy infection. Seek medical attention today. This level of infection requires prompt antiparasitic treatment.' },
  default:                 { title: 'Uncertain — image analysis recommended', sci: 'Unknown', urgency: 'MODERATE', color: '#FBBF24', body: 'Based on your symptoms we cannot make a confident assessment without a photo. Upload an image for our AI to analyse the visual features.' },
};

function getResult(answers: string[]) {
  const key = answers.join('|');
  return RESULTS[key] || RESULTS.default;
}

const URGENCY_STYLE = {
  LOW:      { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  color: '#22C55E' },
  MODERATE: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: '#FBBF24' },
  HIGH:     { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: '#EF4444' },
};

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const current = QUESTIONS[step];
  const result = done ? getResult(answers) : null;

  function select(val: string) {
    const next = [...answers, val];
    setAnswers(next);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  return (
    <div className="pp-card" style={{ padding: '20px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', gap: 8, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={14} style={{ color: 'var(--amber)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber)' }}>
            Quick Symptom Check
          </span>
        </div>
        {(step > 0 || done) && (
          <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <RefreshCw size={10} /> Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!done && (
        <div style={{ height: 2, background: 'var(--bg-border)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((step) / QUESTIONS.length) * 100}%`, background: 'var(--amber)', borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
      )}

      {!done ? (
        <div key={step} style={{ animation: 'slideIn 0.25s ease' }}>
          <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:none } }`}</style>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.4 }}>
            {current.q}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {current.options.map(opt => (
              <button key={opt.value} onClick={() => select(opt.value)}
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)',
                  borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                  transition: 'all 0.15s',
                  color: 'var(--text-secondary)', fontSize: 12,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(217,119,6,0.4)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-border)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }}
              >
                <span style={{ fontSize: 14 }}>{opt.icon}</span>
                <span style={{ flex: 1 }}>{opt.label}</span>
                <ChevronRight size={12} style={{ opacity: 0.4 }} />
              </button>
            ))}
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10, fontFamily: 'monospace' }}>
            Step {step + 1} of {QUESTIONS.length}
          </p>
        </div>
      ) : result ? (
        <div style={{ animation: 'slideIn 0.25s ease' }}>
          <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
          <div style={{
            padding: '12px 14px', borderRadius: 8, marginBottom: 12,
            background: URGENCY_STYLE[result.urgency].bg,
            border: `1px solid ${URGENCY_STYLE[result.urgency].border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <AlertTriangle size={12} style={{ color: URGENCY_STYLE[result.urgency].color }} />
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: URGENCY_STYLE[result.urgency].color, letterSpacing: '0.1em' }}>
                {result.urgency} URGENCY
              </span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{result.title}</p>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: 8 }}>({result.sci})</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.body}</p>
          </div>
          <button onClick={() => navigate('/upload')} className="pp-btn-primary" style={{ width: '100%', padding: '10px 16px', fontSize: 12 }}>
            <Upload size={13} /> Upload Image for AI Analysis
          </button>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, fontFamily: 'monospace', lineHeight: 1.5 }}>
            ⚠️ This is a screening tool only. Always consult a healthcare professional.
          </p>
        </div>
      ) : null}
    </div>
  );
}
