// @ts-nocheck
// Trust bar — matches the pill design: PARA icon | Built in Australia • Privacy First • Educational Tool Only | lock
// Used in hero and footer sections

const TrustBar = ({ variant = 'dark' }: { variant?: 'dark' | 'light' | 'sage' }) => {
  const isDark = variant === 'dark';
  const isSage = variant === 'sage';

  const bg   = isDark ? 'rgba(15,39,51,0.72)' : isSage ? 'rgba(15,39,51,0.18)' : 'rgba(255,255,255,0.15)';
  const text = isDark ? 'rgba(255,255,255,0.90)' : isSage ? '#0F2733' : 'rgba(255,255,255,0.88)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : isSage ? 'rgba(15,39,51,0.18)' : 'rgba(255,255,255,0.22)';
  const underline = isDark ? 'rgba(255,255,255,0.55)' : isSage ? 'rgba(15,39,51,0.45)' : 'rgba(255,255,255,0.55)';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 50,
      padding: '10px 20px 10px 14px',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      {/* PARA mini avatar */}
      <div style={{ flexShrink: 0 }}>
        <ParaMiniAvatar />
      </div>

      {/* Trust text */}
      <p style={{
        margin: 0,
        fontSize: '0.88rem',
        fontWeight: 600,
        color: text,
        letterSpacing: '0.005em',
        whiteSpace: 'nowrap',
      }}>
        Built in Australia
        <span style={{ opacity: 0.55, margin: '0 6px' }}>•</span>
        <span style={{ borderBottom: `1.5px solid ${underline}` }}>Privacy First</span>
        <span style={{ opacity: 0.55, margin: '0 6px' }}>•</span>
        Educational Tool Only
      </p>

      {/* Lock icon */}
      <div style={{ flexShrink: 0, opacity: 0.7 }}>
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <rect x="2" y="9" width="14" height="11" rx="2.5" fill={text} opacity="0.9"/>
          <path d="M5 9V6.5a4 4 0 0 1 8 0V9" stroke={text} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <circle cx="9" cy="14.5" r="1.5" fill={isDark ? '#0F2733' : '#fff'}/>
        </svg>
      </div>
    </div>
  );
};

/* ─── PARA mini avatar — woman with hat, emoji-style ─────────── */
const ParaMiniAvatar = () => (
  <svg width="34" height="38" viewBox="0 0 34 38" fill="none">
    {/* Body */}
    <path d="M9 28 Q8 34 7 37 L27 37 Q26 34 25 28 Q21 31 17 31 Q13 31 9 28Z" fill="#5A8E7A"/>
    <rect x="14.5" y="21" width="5" height="8" rx="2.5" fill="#C8956A"/>
    {/* Head */}
    <ellipse cx="17" cy="16" rx="8" ry="9" fill="#D4A07A"/>
    {/* Hair */}
    <path d="M9 16 Q8 22 10 27 Q13 30 15 29 L15 21 Q11 20 9 16Z" fill="#5C3820"/>
    <path d="M25 16 Q26 22 24 27 Q21 30 19 29 L19 21 Q23 20 25 16Z" fill="#5C3820"/>
    {/* Eyes */}
    <circle cx="14" cy="15" r="1.6" fill="#3D2810"/>
    <circle cx="20" cy="15" r="1.6" fill="#3D2810"/>
    <circle cx="14.5" cy="14.2" r="0.7" fill="white"/>
    <circle cx="20.5" cy="14.2" r="0.7" fill="white"/>
    {/* Lips */}
    <path d="M14.5 20 Q17 22.5 19.5 20" fill="#C07060"/>
    {/* Cheeks */}
    <ellipse cx="11.5" cy="18" rx="3" ry="2" fill="#E8A080" opacity="0.35"/>
    <ellipse cx="22.5" cy="18" rx="3" ry="2" fill="#E8A080" opacity="0.35"/>
    {/* Hat brim */}
    <ellipse cx="17" cy="8.5" rx="13.5" ry="3" fill="#5A9070"/>
    <ellipse cx="17" cy="7.5" rx="13.5" ry="3" fill="#6AAB84"/>
    {/* Hat crown */}
    <path d="M8 8 Q9.5 1 17 0 Q24.5 1 26 8Z" fill="#7DC498"/>
    <rect x="8.5" y="6" width="17" height="3" rx="1" fill="#4A8A64"/>
  </svg>
);

export default TrustBar;
