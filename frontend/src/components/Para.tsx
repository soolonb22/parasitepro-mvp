// @ts-nocheck
import React from 'react';

/* ─── PALETTE ─────────────────────────────────────── */
const BODY   = '#00BFA5';
const BODY_DK= '#00A896';
const HAT_BM = '#3D5A20';
const HAT_CR = '#4D7228';
const HAT_BD = '#293F10';
const PUPIL  = '#0D2218';

/* ─── EYES ────────────────────────────────────────── */
const Eyes = {
  norm: () => <>
    <circle cx="37" cy="58" r="7.5" fill="white"/>
    <circle cx="38.5" cy="59" r="5" fill={PUPIL}/>
    <circle cx="40" cy="57" r="2" fill="white"/>
    <circle cx="63" cy="58" r="7.5" fill="white"/>
    <circle cx="64.5" cy="59" r="5" fill={PUPIL}/>
    <circle cx="66" cy="57" r="2" fill="white"/>
  </>,
  happy: () => <>
    <ellipse cx="37" cy="59" rx="7.5" ry="8" fill="white"/>
    <circle cx="38.5" cy="60" r="5.2" fill={PUPIL}/>
    <circle cx="40" cy="57.5" r="2.2" fill="white"/>
    <ellipse cx="63" cy="59" rx="7.5" ry="8" fill="white"/>
    <circle cx="64.5" cy="60" r="5.2" fill={PUPIL}/>
    <circle cx="66" cy="57.5" r="2.2" fill="white"/>
  </>,
  squint: () => <>
    <ellipse cx="37" cy="60" rx="7.5" ry="5" fill="white"/>
    <ellipse cx="38.5" cy="61" rx="4.8" ry="3.2" fill={PUPIL}/>
    <circle cx="40" cy="59" r="1.5" fill="white"/>
    <ellipse cx="63" cy="60" rx="7.5" ry="5" fill="white"/>
    <ellipse cx="64.5" cy="61" rx="4.8" ry="3.2" fill={PUPIL}/>
    <circle cx="66" cy="59" r="1.5" fill="white"/>
  </>,
  sad: () => <>
    <circle cx="37" cy="60" r="7.5" fill="white"/>
    <circle cx="38.5" cy="61" r="5" fill={PUPIL}/>
    <circle cx="40" cy="59" r="2" fill="white"/>
    <circle cx="63" cy="60" r="7.5" fill="white"/>
    <circle cx="64.5" cy="61" r="5" fill={PUPIL}/>
    <circle cx="66" cy="59" r="2" fill="white"/>
    {/* Furrowed brows */}
    <path d="M30 50 Q37 46 44 50" stroke={PUPIL} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M56 50 Q63 46 70 50" stroke={PUPIL} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
  </>,
};

/* ─── MOUTHS ──────────────────────────────────────── */
const Mouths = {
  happy:   () => <><path d="M40 74 Q50 86 60 74" fill="#C45050" stroke={PUPIL} strokeWidth="1"/><path d="M42 76 Q50 84 58 76 L56 78 Q50 83 44 78Z" fill="white"/></>,
  smile:   () => <path d="M41 74 Q50 82 59 74" stroke={PUPIL} strokeWidth="1.5" strokeLinecap="round" fill="none"/>,
  calm:    () => <path d="M43 73 Q50 79 57 73" stroke={PUPIL} strokeWidth="1.3" strokeLinecap="round" fill="none"/>,
  frown:   () => <path d="M41 77 Q50 70 59 77" stroke={PUPIL} strokeWidth="1.5" strokeLinecap="round" fill="none"/>,
  smug:    () => <path d="M43 73 Q52 80 58 72" stroke={PUPIL} strokeWidth="1.3" strokeLinecap="round" fill="none"/>,
};

/* ─── STATE CONFIG ────────────────────────────────── */
const STATE_CONFIG = {
  wave: {
    eyes: 'happy', mouth: 'happy',
    lArm: 'M22 64 Q10 68 8 79', lHand: [8, 81],
    rArm: 'M78 58 Q90 44 88 32', rHand: [87, 30],
    extras: (
      <>
        <path d="M86 22 Q91 17 89 13" stroke={BODY} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M91 25 Q97 21 96 17" stroke={BODY} strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ),
  },
  search: {
    eyes: 'squint', mouth: 'smug',
    lArm: 'M22 65 Q18 55 24 48', lHand: [25, 46],
    rArm: 'M78 60 Q82 52 74 46', rHand: [73, 44],
    extras: (
      <>
        <circle cx="50" cy="41" r="11" stroke="rgba(180,180,180,0.8)" strokeWidth="2.5" fill="rgba(180,220,255,0.2)"/>
        <line x1="57" y1="49" x2="64" y2="56" stroke="rgba(180,180,180,0.8)" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ),
  },
  explain: {
    eyes: 'norm', mouth: 'smile',
    lArm: 'M22 65 Q16 74 18 84', lHand: [18, 86],
    rArm: 'M78 65 Q84 70 84 80', rHand: [84, 82],
    extras: null,
  },
  reassure: {
    eyes: 'happy', mouth: 'calm',
    lArm: 'M22 68 Q14 76 14 86', lHand: [14, 88],
    rArm: 'M78 68 Q86 76 86 86', rHand: [86, 88],
    extras: null,
  },
  celebrate: {
    eyes: 'happy', mouth: 'happy',
    lArm: 'M22 62 Q10 48 10 36', lHand: [10, 34],
    rArm: 'M78 62 Q90 48 90 36', rHand: [90, 34],
    extras: null,
  },
  sad: {
    eyes: 'sad', mouth: 'frown',
    lArm: 'M22 70 Q16 78 18 88', lHand: [18, 90],
    rArm: 'M78 70 Q84 78 82 88', rHand: [82, 90],
    extras: null,
  },
  think: {
    eyes: 'squint', mouth: 'smug',
    lArm: 'M22 68 Q14 76 16 84', lHand: [16, 86],
    rArm: 'M78 60 Q88 50 86 40', rHand: [86, 38],
    extras: (
      <>
        <circle cx="92" cy="32" r="3.5" fill="rgba(255,255,255,0.65)"/>
        <circle cx="96" cy="25" r="4.5" fill="rgba(255,255,255,0.65)"/>
        <circle cx="99" cy="17" r="5.5" fill="rgba(255,255,255,0.65)"/>
      </>
    ),
  },
};

/* ─── PARA COMPONENT ──────────────────────────────── */
/**
 * Para character component.
 *
 * Usage:
 *   <Para state="wave" size={80} bobble />
 *
 * States: wave | search | explain | reassure | celebrate | sad | think
 */
const Para = ({ state = 'wave', size = 90, bobble = false, className = '', style = {} }) => {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.explain;
  const EyeComp   = Eyes[cfg.eyes]   || Eyes.norm;
  const MouthComp = Mouths[cfg.mouth] || Mouths.smile;
  const [lhx, lhy] = cfg.lHand;
  const [rhx, rhy] = cfg.rHand;
  const h = Math.round(size * 1.22);

  return (
    <svg
      width={size} height={h}
      viewBox="0 0 100 122"
      fill="none"
      className={className}
      style={{
        ...style,
        ...(bobble ? { animation: 'para-bobble 2.8s ease-in-out infinite' } : {}),
        flexShrink: 0,
      }}
      aria-label={`PARA is ${state}`}
    >
      {/* Drop shadow */}
      <ellipse cx="50" cy="118" rx="22" ry="3.5" fill="rgba(0,0,0,0.10)"/>

      {/* Left arm (behind body) */}
      <path d={cfg.lArm} stroke={BODY} strokeWidth="10" strokeLinecap="round" fill="none"/>
      <circle cx={lhx} cy={lhy} r="7" fill={BODY}/>

      {/* Body blob */}
      <path
        d="M19 42 C14 54 12 72 16 88 C20 102 34 114 50 114 C66 114 80 102 84 88 C88 72 86 54 81 42 C77 32 65 27 50 27 C35 27 23 32 19 42Z"
        fill={BODY}
      />
      {/* Body highlight */}
      <path d="M27 44 C23 58 21 74 25 88" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeLinecap="round" fill="none"/>

      {/* Feet */}
      <ellipse cx="40" cy="113" rx="11" ry="4.5" fill={BODY_DK}/>
      <ellipse cx="60" cy="113" rx="11" ry="4.5" fill={BODY_DK}/>

      {/* Right arm (in front of body) */}
      <path d={cfg.rArm} stroke={BODY} strokeWidth="10" strokeLinecap="round" fill="none"/>
      <circle cx={rhx} cy={rhy} r="7" fill={BODY}/>

      {/* Hat brim */}
      <ellipse cx="50" cy="29" rx="38" ry="7" fill={HAT_BM}/>
      {/* Hat brim highlight */}
      <path d="M15 27 Q50 34 85 27" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none"/>

      {/* Hat crown */}
      <path d="M15 29 C15 29 17 6 50 6 C83 6 85 29 85 29Z" fill={HAT_CR}/>
      {/* Crown crease */}
      <path d="M30 29 Q50 21 70 29" stroke={HAT_BM} strokeWidth="2" fill="none"/>

      {/* Hat band */}
      <path d="M15 29 Q50 37 85 29" stroke={HAT_BD} strokeWidth="5" strokeLinecap="round" fill="none"/>

      {/* Eyes */}
      <EyeComp/>

      {/* Cheeks */}
      <ellipse cx="26" cy="67" rx="6" ry="3.8" fill="rgba(0,160,148,0.48)"/>
      <ellipse cx="74" cy="67" rx="6" ry="3.8" fill="rgba(0,160,148,0.48)"/>

      {/* Mouth */}
      <MouthComp/>

      {/* State-specific extras (magnifying glass, wave fingers, thought bubbles) */}
      {cfg.extras}
    </svg>
  );
};

/* ─── SPEECH BUBBLE ───────────────────────────────── */
export const ParaBubble = ({ children, direction = 'right', style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.93)',
    borderRadius: direction === 'right' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
    padding: '10px 14px',
    boxShadow: '0 3px 14px rgba(0,0,0,0.13)',
    maxWidth: 220,
    ...style,
  }}>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#192E19', lineHeight: 1.45 }}>
      {children}
    </p>
  </div>
);

/* ─── PARA + BUBBLE COMBO ─────────────────────────── */
export const ParaWithBubble = ({
  state = 'wave',
  size = 80,
  message,
  bubbleStyle = {},
  style = {},
  bobble = true,
}) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, ...style }}>
    <Para state={state} size={size} bobble={bobble}/>
    {message && (
      <ParaBubble style={bubbleStyle}>{message}</ParaBubble>
    )}
  </div>
);

/* ─── INLINE KEYFRAME INJECTION ───────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('para-keyframes')) {
  const style = document.createElement('style');
  style.id = 'para-keyframes';
  style.textContent = `
    @keyframes para-bobble {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
  `;
  document.head.appendChild(style);
}

export default Para;
