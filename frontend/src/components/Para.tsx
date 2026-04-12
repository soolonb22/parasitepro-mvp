// @ts-nocheck
/**
 * Para.tsx — Pink worm avatar with talking, bobble, and mood animations.
 * Replaces the old SVG teal worm. Same public API so nothing else needs changes.
 *
 * States: wave | search | explain | reassure | celebrate | sad | think
 * <Para state="wave" size={90} bobble talking />
 */
import React, { useEffect, useRef } from 'react';

/* ── Inject keyframes once ── */
if (typeof document !== 'undefined' && !document.getElementById('para-keyframes')) {
  const s = document.createElement('style');
  s.id = 'para-keyframes';
  s.textContent = `
    @keyframes para-bobble   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(1.5deg)} }
    @keyframes para-talk     { 0%,100%{transform:scaleY(1) rotate(0deg)} 25%{transform:scaleY(1.04) rotate(-1deg)} 75%{transform:scaleY(0.97) rotate(1deg)} }
    @keyframes para-wave     { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-8deg) scale(1.04)} 75%{transform:rotate(6deg) scale(1.02)} }
    @keyframes para-celebrate{ 0%,100%{transform:translateY(0) scale(1) rotate(0deg)} 25%{transform:translateY(-14px) scale(1.07) rotate(-3deg)} 75%{transform:translateY(-10px) scale(1.05) rotate(3deg)} }
    @keyframes para-shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes para-pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    @keyframes para-think    { 0%,100%{transform:rotate(0deg) translateY(0)} 33%{transform:rotate(-3deg) translateY(-4px)} 66%{transform:rotate(2deg) translateY(-2px)} }
  `;
  document.head.appendChild(s);
}

/* ── Map state → animation ── */
const STATE_ANIM = {
  wave:      'para-wave 1.6s ease-in-out infinite',
  search:    'para-think 2.2s ease-in-out infinite',
  explain:   'para-bobble 2.8s ease-in-out infinite',
  reassure:  'para-pulse 2s ease-in-out infinite',
  celebrate: 'para-celebrate 1.2s ease-in-out infinite',
  sad:       'para-shake 0.6s ease-in-out 1',
  think:     'para-think 2.2s ease-in-out infinite',
};

/* ── Map state → filter (mood tinting) ── */
const STATE_FILTER = {
  wave:      'drop-shadow(0 4px 12px rgba(255,100,180,0.45))',
  search:    'drop-shadow(0 4px 8px rgba(100,100,255,0.3)) brightness(1.0)',
  explain:   'drop-shadow(0 4px 8px rgba(255,100,180,0.3))',
  reassure:  'drop-shadow(0 4px 12px rgba(100,220,100,0.4)) brightness(1.05)',
  celebrate: 'drop-shadow(0 6px 18px rgba(255,215,0,0.55)) brightness(1.1)',
  sad:       'drop-shadow(0 2px 6px rgba(0,0,0,0.2)) grayscale(0.2) brightness(0.9)',
  think:     'drop-shadow(0 4px 8px rgba(200,100,255,0.35))',
};

/* ─────────────────────────────────────────────────────
   Main Para component
───────────────────────────────────────────────────── */
const Para = ({
  state    = 'wave',
  size     = 90,
  bobble   = false,
  talking  = false,
  className = '',
  style    = {},
}) => {
  const h     = Math.round(size * 1.18);
  const anim  = talking
    ? 'para-talk 0.35s ease-in-out infinite'
    : (bobble ? 'para-bobble 2.8s ease-in-out infinite' : STATE_ANIM[state] || STATE_ANIM.explain);
  const filt  = STATE_FILTER[state] || STATE_FILTER.explain;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: h,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <img
        src="/para-avatar.jpg"
        alt="PARA"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '50% 50% 40% 40%',
          animation: anim,
          filter: filt,
          imageRendering: 'auto',
          userSelect: 'none',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
};

/* ─── Speech bubble ─────────────────────────────── */
export const ParaBubble = ({ children, direction = 'right', style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.95)',
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

/* ─── Para + Bubble combo ───────────────────────── */
export const ParaWithBubble = ({
  state      = 'wave',
  size       = 80,
  message,
  talking    = false,
  bubbleStyle = {},
  style      = {},
  bobble     = true,
}) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, ...style }}>
    <Para state={state} size={size} bobble={bobble} talking={talking} />
    {message && <ParaBubble style={bubbleStyle}>{message}</ParaBubble>}
  </div>
);

export default Para;
