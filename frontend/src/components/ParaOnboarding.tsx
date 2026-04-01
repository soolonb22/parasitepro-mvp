// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Para, { ParaWithBubble, ParaBubble } from './Para';

/* ─── PALETTE ─────────────────────────────────────── */
const T = {
  teal:    '#00BFA5',
  tealDk:  '#00897B',
  tealApp: '#004D45',
  sage:    '#A8D5BA',
  navy:    '#1A366D',
  gold:    '#D4A017',
  urg:     '#FF6B6B',
  green:   '#4CAF50',
  white:   '#FFFFFF',
  dark:    '#192E19',
};

/* ─── PHOTO GUIDE STEPS ───────────────────────────── */
const STEPS = [
  {
    paraState: 'think',
    title:     'Take a clear photo',
    bubble:    'Good lighting is everything. Natural light if you can!',
    icon:      '📸',
    dos:   ['Use natural daylight or a bright lamp', 'Keep camera steady and in focus', 'Capture the whole affected area', 'Include a coin for scale if possible'],
    donts: ['Avoid flash — it washes out detail', "Don't zoom in digitally"],
  },
  {
    paraState: 'wave',
    title:     'Upload your photo',
    bubble:    "Pick your sample type so I know what I'm looking at.",
    icon:      '⬆️',
    dos:   ['Select your sample type from the list', 'Upload the clearest photo you have', 'Multiple angles are always better'],
    donts: ["Don't worry if the photo isn't perfect — I'll let you know"],
  },
  {
    paraState: 'explain',
    title:     'Add your symptoms',
    bubble:    "Symptoms help me narrow it right down. The more you add, the better.",
    icon:      '📋',
    dos:   ['Tick all symptoms that apply', 'Add travel history if relevant', "Note how long you've had the symptoms"],
    donts: ['No need to fill everything in — do what you can'],
  },
];

/* ─── WELCOME MODAL ───────────────────────────────── */
export const ParaWelcomeModal = ({ isOpen, onClose, onStartGuide }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'paraFadeIn .2s ease both',
      }}
    >
      <div style={{
        background: T.white, borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: 460,
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        animation: 'paraSlideUp .35s cubic-bezier(.22,.68,0,1.2) both',
      }}>
        {/* Accent bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${T.teal}, ${T.sage}, ${T.gold})`, borderRadius: '20px 20px 0 0' }}/>
        <div style={{ width: 36, height: 4, background: '#E5E7EB', borderRadius: 9999, margin: '10px auto 0' }}/>

        <div style={{ padding: '16px 22px 22px' }}>
          {/* PARA header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 16 }}>
            <Para state="wave" size={70} bobble/>
            <div style={{ flex: 1, paddingBottom: 6 }}>
              <div style={{ fontSize: 19, fontWeight: 900, color: T.dark, lineHeight: 1.25 }}>
                G'day! I'm PARA 👋
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                Your parasite analysis guide
              </div>
            </div>
          </div>

          {/* Welcome text */}
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 14 }}>
            I help Australians understand what they might be seeing — by building 
            structured educational reports to bring to a GP appointment.
          </p>

          {/* Compliance callout */}
          <div style={{
            background: '#FFFBEB', border: '1px solid #FCD34D',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 18,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
              <strong>I provide educational analysis only</strong> — not a medical diagnosis. 
              Think of me as your research buddy before the GP visit.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onStartGuide}
            style={{
              width: '100%', padding: '13px',
              background: T.teal, color: 'white', border: 'none',
              borderRadius: 12, fontSize: 15, fontWeight: 800,
              cursor: 'pointer', marginBottom: 8, transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.tealDk}
            onMouseLeave={e => e.currentTarget.style.background = T.teal}
          >
            Let's get started — it's free
          </button>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '9px',
              background: 'transparent', color: '#9CA3AF',
              border: 'none', fontSize: 12, cursor: 'pointer',
            }}
          >
            Skip intro
          </button>
        </div>
      </div>

      <style>{`
        @keyframes paraFadeIn   { from { opacity:0 }            to { opacity:1 } }
        @keyframes paraSlideUp  { from { transform:translateY(60px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>
    </div>
  );
};

/* ─── PHOTO GUIDE MODAL ───────────────────────────── */
export const ParaPhotoGuide = ({ isOpen, onClose, onDone }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLast = step === STEPS.length - 1;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,77,69,0.85)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        animation: 'paraFadeIn .2s ease both',
      }}
    >
      <div style={{
        background: T.white, borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: 460,
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        animation: 'paraSlideUp .35s cubic-bezier(.22,.68,0,1.2) both',
      }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: '#E5E7EB', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: T.teal,
            width: `${((step + 1) / STEPS.length) * 100}%`,
            transition: 'width .4s ease',
          }}/>
        </div>

        <div style={{ padding: '18px 22px 22px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.teal, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Step {step + 1} of {STEPS.length}
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 }}>×</button>
          </div>

          {/* PARA + Bubble */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
            <Para state={current.paraState} size={72} bobble/>
            <ParaBubble style={{ flex: 1 }}>{current.bubble}</ParaBubble>
          </div>

          {/* Step title */}
          <h3 style={{ fontSize: 18, fontWeight: 900, color: T.dark, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{current.icon}</span> {current.title}
          </h3>

          {/* Do's */}
          <div style={{ marginBottom: 12 }}>
            {current.dos.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#DCFCE7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Don'ts */}
          <div style={{ marginBottom: 20 }}>
            {current.donts.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'flex-start' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#FEE2E2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <span style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  flex: 1, padding: '11px', background: 'transparent',
                  border: `1.5px solid ${T.teal}`, color: T.teal,
                  borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >← Back</button>
            )}
            <button
              onClick={() => isLast ? onDone() : setStep(s => s + 1)}
              style={{
                flex: 2, padding: '11px',
                background: T.teal, color: 'white',
                border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.tealDk}
              onMouseLeave={e => e.currentTarget.style.background = T.teal}
            >
              {isLast ? "Got it — upload my photo 📸" : "Next →"}
            </button>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            {STEPS.map((_, i) => (
              <div key={i} onClick={() => setStep(i)} style={{
                width: i === step ? 20 : 7, height: 7,
                borderRadius: 4, background: i === step ? T.teal : '#E5E7EB',
                transition: 'all .25s', cursor: 'pointer',
              }}/>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes paraFadeIn  { from { opacity:0 }                           to { opacity:1 } }
        @keyframes paraSlideUp { from { transform:translateY(60px);opacity:0} to { transform:translateY(0);opacity:1 } }
      `}</style>
    </div>
  );
};

/* ─── CONTEXT-AWARE PARA HELPER ───────────────────── */
/**
 * Drop this on any page — it auto-selects state + copy based on `context` prop.
 *
 * Usage:
 *   <ParaHelper context="upload" />
 *   <ParaHelper context="results" analysisStatus="completed" />
 *   <ParaHelper context="error" errorType="network" />
 *   <ParaHelper context="dashboard_empty" />
 */
const HELPER_CONFIGS = {
  upload: {
    state:   'wave',
    message: "G'day! Take a clear, well-lit photo for the best results. I'll handle the rest.",
  },
  upload_guide: {
    state:   'think',
    message: 'Need help with your photo? Tap here for my photo tips.',
    cta:     'Photo tips →',
  },
  analyzing: {
    state:   'search',
    message: "Working on it… cross-checking visual patterns right now.",
  },
  results_complete: {
    state:   'celebrate',
    message: "Here's what I found! Take this report to your GP.",
  },
  results_low_confidence: {
    state:   'think',
    message: "I couldn't get a strong read on this one. A clearer photo would help.",
  },
  dashboard_empty: {
    state:   'wave',
    message: "G'day! Nothing here yet. Your first analysis is completely free.",
  },
  zero_credits: {
    state:   'reassure',
    message: "You've used your free analysis! Top up to keep going — credits never expire.",
  },
  error_upload: {
    state:   'sad',
    message: "No worries — that didn't go through. Your credit hasn't been used.",
  },
  error_network: {
    state:   'sad',
    message: "Looks like a connection issue. Check your internet and give it another go.",
  },
  error_image: {
    state:   'think',
    message: "I couldn't quite read that image. Try better lighting or a closer angle.",
  },
};

export const ParaHelper = ({ context = 'upload', onCtaClick, style = {} }) => {
  const cfg = HELPER_CONFIGS[context] || HELPER_CONFIGS.upload;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 12,
      padding: '14px 16px',
      background: 'linear-gradient(135deg, #E1F5EE 0%, #CCE8DC 100%)',
      borderRadius: 14,
      border: '1px solid rgba(0,191,165,0.25)',
      ...style,
    }}>
      <Para state={cfg.state} size={60} bobble/>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0F3B2D', lineHeight: 1.55, margin: 0 }}>
          {cfg.message}
        </p>
        {cfg.cta && onCtaClick && (
          <button
            onClick={onCtaClick}
            style={{
              marginTop: 8, fontSize: 12, fontWeight: 700,
              color: T.teal, background: 'none', border: 'none',
              padding: 0, cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            {cfg.cta}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── EMPTY DASHBOARD STATE ───────────────────────── */
export const ParaEmptyDashboard = ({ onUpload }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
    <div style={{ display: 'inline-block', animation: 'para-bobble 2.8s ease-in-out infinite' }}>
      <Para state="wave" size={100}/>
    </div>
    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#192E19', margin: '1.25rem 0 0.5rem', letterSpacing: '-0.02em' }}>
      G'day! Nothing here yet.
    </h2>
    <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.65, maxWidth: 360, margin: '0 auto 1.75rem' }}>
      Upload your first photo and I'll build you a full educational report. 
      First analysis is <strong style={{ color: T.teal }}>completely free</strong>.
    </p>
    <button
      onClick={onUpload}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: T.teal, color: 'white', border: 'none',
        borderRadius: 12, padding: '0.875rem 2rem',
        fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'background .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = T.tealDk}
      onMouseLeave={e => e.currentTarget.style.background = T.teal}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      Upload a photo
    </button>
  </div>
);

/* ─── PARA ERROR STATE ────────────────────────────── */
export const ParaErrorState = ({ type = 'upload', onRetry }) => {
  const messages = {
    upload:  { title: "That didn't go through.", body: "No worries — your credit hasn't been used. Check your image and try again.", cta: "Try again" },
    network: { title: "Connection issue.",        body: "Looks like you're offline. Check your internet and give it another go.",  cta: "Retry" },
    image:   { title: "Can't read this image.",  body: "I need better image quality to work with. Try better lighting or a closer angle.", cta: "Upload a new photo" },
  };
  const m = messages[type] || messages.upload;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF0F0 0%, #FFE4E4 100%)',
      border: '1px solid rgba(255,107,107,0.3)',
      borderRadius: 16, padding: '1.5rem', textAlign: 'center',
    }}>
      <Para state="sad" size={72} style={{ margin: '0 auto' }}/>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#7F1D1D', margin: '1rem 0 0.5rem' }}>{m.title}</h3>
      <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.65, marginBottom: '1.25rem' }}>{m.body}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#EF4444', color: 'white', border: 'none',
            borderRadius: 10, padding: '0.75rem 2rem',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {m.cta}
        </button>
      )}
    </div>
  );
};

/* ─── FULL ONBOARDING ORCHESTRATOR ────────────────── */
/**
 * Add <ParaOnboarding> to App.jsx or a top-level provider.
 * It fires the welcome modal on first visit and manages the photo guide.
 */
export const ParaOnboarding = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGuide,   setShowGuide]   = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('para_welcomed');
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleWelcomeDone = useCallback(() => {
    localStorage.setItem('para_welcomed', 'true');
    setShowWelcome(false);
    setShowGuide(true);
  }, []);

  const handleGuideDone = useCallback(() => {
    setShowGuide(false);
    navigate('/upload');
  }, [navigate]);

  return (
    <>
      <ParaWelcomeModal
        isOpen={showWelcome}
        onClose={() => { localStorage.setItem('para_welcomed', 'true'); setShowWelcome(false); }}
        onStartGuide={handleWelcomeDone}
      />
      <ParaPhotoGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onDone={handleGuideDone}
      />
    </>
  );
};

export default Para;
