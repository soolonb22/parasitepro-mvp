import React, { useEffect, useState } from 'react';

/**
 * PARA — round white robot mascot matching the ParasitePro brand.
 * Spherical white head, large glowing amber eyes, orange accents.
 *
 * Props:
 *   size       {number}  — overall size in px (default 80)
 *   isThinking {bool}    — eyes pulse amber, chest light flickers
 *   isWaving   {bool}    — left arm raises and waves
 *   style      {object}  — extra styles on outer <svg>
 */
const ParaCharacter = ({ size = 80, isThinking = false, isWaving = false, style = {} }) => {
  const [blink,    setBlink]    = useState(false);
  const [wave,     setWave]     = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);

  // Random blink every ~3–5s
  useEffect(() => {
    let t;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); loop(); }, 100);
      }, 3000 + Math.random() * 2000);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  // Wave oscillation
  useEffect(() => {
    if (!isWaving) { setWave(false); return; }
    let count = 0;
    const iv = setInterval(() => {
      setWave(w => !w);
      if (++count > 7) clearInterval(iv);
    }, 240);
    return () => clearInterval(iv);
  }, [isWaving]);

  // Glow pulse when thinking
  useEffect(() => {
    if (!isThinking) { setGlowPulse(false); return; }
    const iv = setInterval(() => setGlowPulse(g => !g), 500);
    return () => clearInterval(iv);
  }, [isThinking]);

  const s  = size;
  const cx = s * 0.50;

  // ── Head (large sphere) ────────────────────────────────────────────────
  const headR  = s * 0.36;
  const headCx = cx;
  const headCy = s * 0.40;

  // ── Dark visor cap (top arc of head) ──────────────────────────────────
  // Clip arc for the dark top band
  const visorH = headR * 0.30;

  // ── Eyes (large circles with amber glow rings) ─────────────────────────
  const eyeOuterR = s * 0.115;
  const eyeRingR  = s * 0.092;
  const eyeInnerR = s * 0.062;
  const eyePupilR = s * 0.038;
  const eyeShineR = s * 0.016;

  const eyeLCx = cx - s * 0.155;
  const eyeRCx = cx + s * 0.155;
  const eyeCy  = headCy + s * 0.012;

  // collapsed when blinking
  const eyeScaleY = blink ? 0.08 : 1;

  // amber glow colour — pulses when thinking
  const amberBright = '#FF9500';
  const amberDim    = '#CC7200';
  const amberColor  = isThinking ? (glowPulse ? amberBright : amberDim) : amberBright;

  // ── Nose dot ──────────────────────────────────────────────────────────
  const noseCx = cx;
  const noseCy = headCy + s * 0.115;
  const noseR  = s * 0.022;

  // ── Smile ──────────────────────────────────────────────────────────────
  const smileY  = headCy + s * 0.155;
  const smileW  = s * 0.16;

  // ── Orange neck glow collar ───────────────────────────────────────────
  const neckY  = headCy + headR - s * 0.04;
  const neckW  = s * 0.38;
  const neckH  = s * 0.055;
  const neckRx = s * 0.027;

  // ── Body (rounded rectangle) ──────────────────────────────────────────
  const bodyW  = s * 0.56;
  const bodyH  = s * 0.24;
  const bodyX  = cx - bodyW / 2;
  const bodyY  = neckY + neckH - s * 0.01;
  const bodyRx = s * 0.08;

  // ── Chest display panel ───────────────────────────────────────────────
  const panelW  = s * 0.30;
  const panelH  = s * 0.065;
  const panelX  = cx - panelW / 2;
  const panelY  = bodyY + bodyH * 0.58;
  const panelRx = s * 0.022;

  // ── Arms ──────────────────────────────────────────────────────────────
  const armW  = s * 0.10;
  const armH  = s * 0.19;
  const armRx = s * 0.05;
  const armY  = bodyY + bodyH * 0.08;

  const armLX = bodyX - armW + s * 0.01;
  const armRX = bodyX + bodyW - s * 0.01;

  // left arm waves
  const armLAngle = isWaving ? (wave ? -55 : -30) : -12;
  const armLPX    = armLX + armW / 2;
  const armLPY    = armY;

  // right arm static (slightly forward)
  const armRAngle = 14;
  const armRPX    = armRX + armW / 2;
  const armRPY    = armY;

  // ── Hands ─────────────────────────────────────────────────────────────
  const handR = s * 0.055;

  // ── Legs ──────────────────────────────────────────────────────────────
  const legW  = s * 0.13;
  const legH  = s * 0.13;
  const legRx = s * 0.048;
  const legY  = bodyY + bodyH - s * 0.005;
  const legLX = cx - s * 0.20;
  const legRX = cx + s * 0.07;

  // ── Feet ──────────────────────────────────────────────────────────────
  const footW  = s * 0.18;
  const footH  = s * 0.058;
  const footRx = s * 0.029;
  const footY  = legY + legH - s * 0.005;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        {/* Outer glow for eyes */}
        <radialGradient id={`eyeGlow_${s}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={amberColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={amberColor} stopOpacity="0"    />
        </radialGradient>

        {/* Head sphere gradient — light top-left like the logo */}
        <radialGradient id={`headGrad_${s}`} cx="38%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="55%"  stopColor="#D8ECF0" />
          <stop offset="100%" stopColor="#9BBFCC" />
        </radialGradient>

        {/* Body gradient */}
        <radialGradient id={`bodyGrad_${s}`} cx="40%" cy="28%" r="68%">
          <stop offset="0%"   stopColor="#E8F4F8" />
          <stop offset="100%" stopColor="#8AAEBB" />
        </radialGradient>

        {/* Neck/collar orange glow */}
        <radialGradient id={`neckGlow_${s}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FF9500" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#CC5500" stopOpacity="0.7" />
        </radialGradient>

        {/* Clip for dark visor cap on head */}
        <clipPath id={`visorClip_${s}`}>
          <rect
            x={headCx - headR}
            y={headCy - headR}
            width={headR * 2}
            height={visorH + headR * 0.15}
          />
        </clipPath>
      </defs>

      {/* ── Body ── */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyRx}
        fill={`url(#bodyGrad_${s})`} stroke="#6A96A8" strokeWidth={s * 0.010} />

      {/* Body panel lines */}
      <line x1={bodyX + s*0.07} y1={bodyY + s*0.035}
            x2={bodyX + bodyW - s*0.07} y2={bodyY + s*0.035}
            stroke="#6A96A8" strokeWidth={s*0.012} strokeLinecap="round" opacity={0.5} />
      <line x1={bodyX + s*0.07} y1={bodyY + bodyH - s*0.030}
            x2={bodyX + bodyW - s*0.07} y2={bodyY + bodyH - s*0.030}
            stroke="#6A96A8" strokeWidth={s*0.012} strokeLinecap="round" opacity={0.5} />

      {/* Chest display panel */}
      <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={panelRx}
        fill="#1A2830" stroke="#FF9500" strokeWidth={s * 0.008} />
      {/* Panel dots — like the logo's "‹e o 1o›" display */}
      {[0,1,2,3,4].map(i => (
        <circle
          key={i}
          cx={panelX + panelW * 0.15 + i * (panelW * 0.175)}
          cy={panelY + panelH * 0.50}
          r={panelH * 0.20}
          fill={i === 1 || i === 3 ? '#FF9500' : '#4A7A8A'}
          opacity={isThinking && (i === 1 || i === 3) ? (glowPulse ? 1 : 0.4) : 0.9}
        />
      ))}

      {/* ── Left arm (waves) ── */}
      <rect
        x={armLX} y={armY}
        width={armW} height={armH} rx={armRx}
        fill={`url(#bodyGrad_${s})`}
        stroke="#6A96A8" strokeWidth={s * 0.009}
        transform={`rotate(${armLAngle}, ${armLPX}, ${armLPY})`}
        style={{ transition: 'transform 0.22s ease-in-out' }}
      />
      <circle
        cx={armLX + armW * 0.5 + Math.sin(armLAngle * Math.PI / 180) * (armH + handR * 0.5)}
        cy={armY + armH * Math.cos(armLAngle * Math.PI / 180) + handR * 0.5}
        r={handR}
        fill={`url(#bodyGrad_${s})`}
        stroke="#6A96A8" strokeWidth={s * 0.009}
      />

      {/* ── Right arm (static) ── */}
      <rect
        x={armRX} y={armY}
        width={armW} height={armH} rx={armRx}
        fill={`url(#bodyGrad_${s})`}
        stroke="#6A96A8" strokeWidth={s * 0.009}
        transform={`rotate(${armRAngle}, ${armRPX}, ${armRPY})`}
      />
      <circle
        cx={armRX + armW * 0.5 + Math.sin(armRAngle * Math.PI / 180) * (armH + handR * 0.4)}
        cy={armY + armH + handR * 0.55}
        r={handR}
        fill={`url(#bodyGrad_${s})`}
        stroke="#6A96A8" strokeWidth={s * 0.009}
      />

      {/* ── Orange neck glow collar ── */}
      <rect
        x={cx - neckW / 2} y={neckY}
        width={neckW} height={neckH} rx={neckRx}
        fill={`url(#neckGlow_${s})`}
        opacity={isThinking ? (glowPulse ? 1.0 : 0.6) : 0.88}
        style={{ transition: 'opacity 0.4s' }}
      />

      {/* ── Head sphere ── */}
      <circle cx={headCx} cy={headCy} r={headR} fill={`url(#headGrad_${s})`}
        stroke="#8AAEBB" strokeWidth={s * 0.010} />

      {/* Head specular highlight (top-left shine like the logo) */}
      <ellipse
        cx={headCx - headR * 0.28}
        cy={headCy - headR * 0.38}
        rx={headR * 0.32}
        ry={headR * 0.18}
        fill="white"
        opacity={0.38}
        transform={`rotate(-28, ${headCx - headR * 0.28}, ${headCy - headR * 0.38})`}
      />

      {/* Dark visor cap on top of head */}
      <circle cx={headCx} cy={headCy} r={headR}
        fill="#1A2830"
        clipPath={`url(#visorClip_${s})`}
        opacity={0.82}
      />
      {/* Small orange dot on visor (like the logo) */}
      <circle cx={headCx} cy={headCy - headR + visorH * 0.55} r={s * 0.018}
        fill="#FF9500" opacity={0.9} />

      {/* ── Eye glow halos ── */}
      <circle cx={eyeLCx} cy={eyeCy} r={eyeOuterR * 1.6}
        fill={`url(#eyeGlow_${s})`} opacity={isThinking ? (glowPulse ? 0.9 : 0.5) : 0.75} />
      <circle cx={eyeRCx} cy={eyeCy} r={eyeOuterR * 1.6}
        fill={`url(#eyeGlow_${s})`} opacity={isThinking ? (glowPulse ? 0.9 : 0.5) : 0.75} />

      {/* ── Eyes — outer dark socket ── */}
      <circle cx={eyeLCx} cy={eyeCy} r={eyeOuterR}
        fill="#1A2830" stroke={amberColor} strokeWidth={s * 0.008} />
      <circle cx={eyeRCx} cy={eyeCy} r={eyeOuterR}
        fill="#1A2830" stroke={amberColor} strokeWidth={s * 0.008} />

      {/* ── Eyes — amber ring ── */}
      {!blink && (
        <>
          <circle cx={eyeLCx} cy={eyeCy} r={eyeRingR}
            fill="none" stroke={amberColor} strokeWidth={s * 0.022}
            opacity={isThinking ? (glowPulse ? 1 : 0.5) : 0.95}
          />
          <circle cx={eyeRCx} cy={eyeCy} r={eyeRingR}
            fill="none" stroke={amberColor} strokeWidth={s * 0.022}
            opacity={isThinking ? (glowPulse ? 1 : 0.5) : 0.95}
          />

          {/* ── Eyes — inner amber fill ── */}
          <circle cx={eyeLCx} cy={eyeCy} r={eyeInnerR} fill={amberColor} opacity={0.92} />
          <circle cx={eyeRCx} cy={eyeCy} r={eyeInnerR} fill={amberColor} opacity={0.92} />

          {/* ── Eyes — dark pupils ── */}
          <circle cx={eyeLCx} cy={eyeCy} r={eyePupilR} fill="#1A1A1A" />
          <circle cx={eyeRCx} cy={eyeCy} r={eyePupilR} fill="#1A1A1A" />

          {/* ── Eyes — shine dots ── */}
          <circle cx={eyeLCx - s*0.022} cy={eyeCy - s*0.022} r={eyeShineR} fill="white" opacity={0.7} />
          <circle cx={eyeRCx - s*0.022} cy={eyeCy - s*0.022} r={eyeShineR} fill="white" opacity={0.7} />
        </>
      )}

      {/* Blink — flat line */}
      {blink && (
        <>
          <line x1={eyeLCx - eyeRingR} y1={eyeCy} x2={eyeLCx + eyeRingR} y2={eyeCy}
            stroke={amberColor} strokeWidth={s * 0.018} strokeLinecap="round" />
          <line x1={eyeRCx - eyeRingR} y1={eyeCy} x2={eyeRCx + eyeRingR} y2={eyeCy}
            stroke={amberColor} strokeWidth={s * 0.018} strokeLinecap="round" />
        </>
      )}

      {/* ── Nose dot ── */}
      <circle cx={noseCx} cy={noseCy} r={noseR} fill="#8AAEBB" opacity={0.65} />

      {/* ── Smile ── */}
      <path
        d={`M ${cx - smileW} ${smileY} Q ${cx} ${smileY + s * 0.045} ${cx + smileW} ${smileY}`}
        fill="none"
        stroke="#5A7A88"
        strokeWidth={s * 0.022}
        strokeLinecap="round"
      />

      {/* ── Legs ── */}
      <rect x={legLX} y={legY} width={legW} height={legH} rx={legRx}
        fill={`url(#bodyGrad_${s})`} stroke="#6A96A8" strokeWidth={s * 0.009} />
      <rect x={legRX} y={legY} width={legW} height={legH} rx={legRx}
        fill={`url(#bodyGrad_${s})`} stroke="#6A96A8" strokeWidth={s * 0.009} />

      {/* ── Feet ── */}
      <rect x={legLX - s*0.022} y={footY} width={footW} height={footH} rx={footRx}
        fill="#6A96A8" />
      <rect x={legRX - s*0.022} y={footY} width={footW} height={footH} rx={footRx}
        fill="#6A96A8" />

      {/* ── Thinking dots (float beside head) ── */}
      {isThinking && [0, 1, 2].map(i => (
        <circle
          key={i}
          cx={headCx + headR + s * 0.07 + i * s * 0.10}
          cy={headCy - headR * 0.3}
          r={s * 0.028}
          fill="#FF9500"
        >
          <animate
            attributeName="opacity"
            values="0.25;1;0.25"
            dur="1s"
            begin={`${i * 0.22}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
};

export default ParaCharacter;
