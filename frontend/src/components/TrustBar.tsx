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

/* ─── PARA mini avatar ─────────────────────────────────────────── */
const ParaMiniAvatar = () => (
  <img
    src="/para-avatar-small.png"
    alt="PARA"
    style={{
      width: 34, height: 34,
      borderRadius: '50%',
      objectFit: 'cover',
      objectPosition: 'center top',
      flexShrink: 0,
    }}
  />
);


export default TrustBar;
