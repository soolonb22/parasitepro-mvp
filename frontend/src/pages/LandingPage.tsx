// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const C = {
  pageBg:    '#EBF2EA',
  heroBg:    '#E8F2E7',
  dark:      '#192E19',
  darkMid:   '#2D4A2D',
  teal:      '#1D9E75',
  tealDark:  '#0F6E56',
  tealSoft:  '#E1F5EE',
  green:     '#4DBD56',
  greenDk:   '#329B3C',
  amber:     '#EF9F27',
  amberBg:   '#FFFBEB',
  coral:     '#D85A30',
  white:     '#FFFFFF',
  gray:      '#4B5563',
  grayLight: '#F3F4F6',
  border:    '#D1D5DB',
};

/* ─── TROPICAL LEAF SVG ──────────────────────────────────────── */
const Leaf = ({ w = 160, style = {}, flip = false, opacity = 0.65 }) => (
  <svg
    width={w} viewBox="0 0 160 340" fill="none"
    style={{ display:'block', ...style, transform:`${flip ? 'scaleX(-1)' : ''} ${style.transform||''}` }}
  >
    <path d="M80 8 C48 70 12 168 32 258 C48 318 80 334 80 334 C80 334 112 318 128 258 C148 168 112 70 80 8Z"
      fill={`rgba(20,90,30,${opacity * 0.22})`}/>
    <path d="M80 8 L80 334" stroke={`rgba(20,90,30,${opacity * 0.28})`} strokeWidth="1.4"/>
    {[85,148,210].map((y,i)=>[
      <path key={`L${i}`} d={`M80 ${y} Q${55-i*5} ${y-8} ${35-i*4} ${y+18}`} stroke={`rgba(20,90,30,${opacity*0.2})`} strokeWidth="1" fill="none"/>,
      <path key={`R${i}`} d={`M80 ${y} Q${105+i*5} ${y-8} ${125+i*4} ${y+18}`} stroke={`rgba(20,90,30,${opacity*0.2})`} strokeWidth="1" fill="none"/>
    ])}
  </svg>
);

/* ─── PARA EXPLORER CHARACTER ────────────────────────────────── */
const Para = ({ size = 140 }) => {
  const h = size * 1.4;
  return (
    <svg width={size} height={h} viewBox="0 0 110 155" fill="none">
      {/* shadow */}
      <ellipse cx="55" cy="150" rx="26" ry="4" fill="rgba(0,0,0,0.09)"/>
      {/* legs */}
      <rect x="40" y="120" width="11" height="22" rx="5.5" fill="#5A7A45"/>
      <rect x="59" y="120" width="11" height="22" rx="5.5" fill="#4A6A35"/>
      {/* shoes */}
      <ellipse cx="46" cy="142" rx="9" ry="4.5" fill="#2E1E0A"/>
      <ellipse cx="64" cy="142" rx="9" ry="4.5" fill="#2E1E0A"/>
      {/* body */}
      <rect x="30" y="85" width="50" height="42" rx="13" fill="#6A9050"/>
      {/* shirt v */}
      <path d="M47 85 L55 97 L63 85" fill="#5A8040"/>
      {/* right arm raised/waving */}
      <path d="M79 93 Q96 78 91 64" stroke="#6A9050" strokeWidth="10" strokeLinecap="round"/>
      {/* right hand */}
      <circle cx="90" cy="61" r="7.5" fill="#D4935A"/>
      {/* finger waves */}
      <path d="M90 53.5 Q95 48 93 44" stroke="#D4935A" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M95 57 Q101 53 100 48" stroke="#D4935A" strokeWidth="2.5" strokeLinecap="round"/>
      {/* left arm down */}
      <path d="M31 93 Q17 108 19 126" stroke="#6A9050" strokeWidth="10" strokeLinecap="round"/>
      {/* left hand */}
      <circle cx="20" cy="128" r="7" fill="#D4935A"/>
      {/* neck */}
      <rect x="48" y="76" width="14" height="13" rx="6.5" fill="#D4935A"/>
      {/* head */}
      <ellipse cx="55" cy="63" rx="25" ry="23" fill="#E8A870"/>
      {/* hair back */}
      <path d="M30 62 Q32 42 55 40 Q78 42 80 62" fill="#5C3A20"/>
      {/* hat brim */}
      <ellipse cx="55" cy="46" rx="33" ry="6.5" fill="#9B7B20"/>
      {/* hat crown */}
      <path d="M26 46 Q28 26 55 24 Q82 26 84 46Z" fill="#B8921A"/>
      {/* hat band */}
      <rect x="26" y="43" width="58" height="6" rx="2" fill="#7A5510"/>
      {/* hat badge */}
      <circle cx="55" cy="46" r="3" fill="#EF9F27"/>
      {/* eyes whites */}
      <ellipse cx="45" cy="62" rx="6.5" ry="7" fill="white"/>
      <ellipse cx="65" cy="62" rx="6.5" ry="7" fill="white"/>
      {/* pupils */}
      <circle cx="46" cy="63" r="4" fill="#2D1B0E"/>
      <circle cx="66" cy="63" r="4" fill="#2D1B0E"/>
      {/* eye shine */}
      <circle cx="47.5" cy="61" r="1.6" fill="white"/>
      <circle cx="67.5" cy="61" r="1.6" fill="white"/>
      {/* eyebrows */}
      <path d="M39 55 Q45 52 51 55" stroke="#5C3A20" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M59 55 Q65 52 71 55" stroke="#5C3A20" strokeWidth="1.4" strokeLinecap="round"/>
      {/* cheeks */}
      <ellipse cx="37" cy="68" rx="5.5" ry="3.5" fill="#E8785A" opacity="0.42"/>
      <ellipse cx="73" cy="68" rx="5.5" ry="3.5" fill="#E8785A" opacity="0.42"/>
      {/* nose */}
      <ellipse cx="55" cy="67" rx="3.5" ry="2.5" fill="#D4835A" opacity="0.55"/>
      {/* smile */}
      <path d="M47 73 Q55 81 63 73" stroke="#5C3A20" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* teeth */}
      <path d="M50 74.5 Q55 79.5 60 74.5" fill="white"/>
    </svg>
  );
};

/* ─── MOCK MICROSCOPY IMAGE ──────────────────────────────────── */
const MockSlide = () => (
  <div style={{
    width:'100%', height:170,
    background:'radial-gradient(circle at 38% 38%, #3a1e06 0%, #170d03 55%, #0d0802 100%)',
    borderRadius:10, position:'relative', overflow:'hidden',
    display:'flex', alignItems:'center', justifyContent:'center',
  }}>
    {/* grain */}
    <div style={{
      position:'absolute', inset:0, opacity:0.4,
      backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
      backgroundSize:'7px 7px',
    }}/>
    {/* organism */}
    <div style={{
      width:86, height:76,
      borderRadius:'50% 46% 54% 50% / 46% 54% 50% 56%',
      background:'radial-gradient(ellipse at 42% 36%, #CC7A38 0%, #8A4515 55%, #5A2C08 100%)',
      position:'relative', boxShadow:'0 0 18px rgba(200,120,56,0.28)',
    }}>
      <div style={{
        position:'absolute', top:'22%', left:'18%', width:'64%', height:'58%',
        borderRadius:'50%', border:'2px solid rgba(255,195,90,0.55)',
        boxShadow:'inset 0 0 10px rgba(255,140,45,0.35)',
      }}/>
      <div style={{
        position:'absolute', top:'35%', left:'30%', width:'40%', height:'34%',
        borderRadius:'50%', background:'rgba(255,175,70,0.30)',
      }}/>
    </div>
    {/* scale bar */}
    <div style={{ position:'absolute', bottom:9, right:12, display:'flex', alignItems:'center', gap:4 }}>
      <div style={{ width:22, height:1.5, background:'rgba(255,255,255,0.65)' }}/>
      <span style={{ fontSize:8.5, color:'rgba(255,255,255,0.6)', fontFamily:'monospace' }}>100μm</span>
    </div>
    <span style={{ position:'absolute', top:8, left:10, fontSize:8, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', letterSpacing:'0.06em' }}>SAMPLE IMAGE</span>
  </div>
);

/* ─── HERO MOCK RESULT CARD ──────────────────────────────────── */
const HeroCard = () => (
  <div style={{
    background:'white', borderRadius:16, padding:16,
    boxShadow:'0 8px 40px rgba(0,0,0,0.13)', maxWidth:272, width:'100%',
  }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:11 }}>
      <span style={{ fontSize:10.5, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.07em' }}>Sample Report</span>
      <span style={{ fontSize:9.5, background:'#FEF3C7', color:'#92400E', padding:'2px 8px', borderRadius:9999, fontWeight:600 }}>EXAMPLE</span>
    </div>
    <MockSlide/>
    <div style={{ marginTop:11 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
        <span style={{ fontSize:13.5, fontWeight:700, color:C.dark }}>Pattern detected</span>
        <span style={{ fontSize:9.5, background:'#FEF3C7', color:'#92400E', padding:'2px 8px', borderRadius:9999 }}>🟡 Moderate</span>
      </div>
      <p style={{ fontSize:11.5, color:C.gray, margin:'0 0 9px', lineHeight:1.55 }}>
        Characteristics consistent with <em>Ascaris lumbricoides</em>. Further investigation recommended.
      </p>
      {/* confidence bar */}
      <div style={{ marginBottom:9 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
          <span style={{ fontSize:10, color:C.gray }}>AI confidence</span>
          <span style={{ fontSize:10, fontWeight:600, color:C.tealDark }}>High</span>
        </div>
        <div style={{ height:5, background:'#E5E7EB', borderRadius:9999 }}>
          <div style={{ width:'81%', height:'100%', background:C.teal, borderRadius:9999 }}/>
        </div>
      </div>
      {/* next step */}
      <div style={{ background:C.tealSoft, borderRadius:8, padding:'8px 10px', display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ fontSize:15 }}>👩‍⚕️</span>
        <div>
          <div style={{ fontSize:10.5, fontWeight:600, color:C.tealDark }}>Recommended next step</div>
          <div style={{ fontSize:10.5, color:C.tealDark }}>Book a GP appointment (1–2 weeks)</div>
        </div>
      </div>
    </div>
    <p style={{ fontSize:9, color:'#9CA3AF', textAlign:'center', margin:'9px 0 0' }}>
      ⚠️ Sample educational output only — not a diagnosis
    </p>
  </div>
);

/* ─── SECTION LABEL ──────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <span style={{
    display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'0.13em',
    color:C.teal, textTransform:'uppercase', marginBottom:12,
  }}>{children}</span>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
const LandingPage = () => {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goUpload = () => navigate(user ? '/upload' : '/signup?promo=BETA3FREE');

  return (
    <div style={{ minHeight:'100vh', background:C.pageBg, fontFamily:'"Nunito", system-ui, -apple-system, sans-serif' }}>

      <SEO
        title="Found something weird? AI analysis in 60 seconds — notworms.com"
        description="Upload a photo and get an AI-powered educational report on parasites, rashes, and skin conditions — designed to help you prepare for a GP visit. First analysis free."
        canonical="/"
      />

      {/* ── GOOGLE FONT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes leafSway {
          0%,100% { transform: rotate(-2deg) translateY(0); }
          50%     { transform: rotate(2deg)  translateY(-8px); }
        }
        @keyframes bobble {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-7px); }
        }
        @keyframes scrollDot {
          0%,100% { opacity: 1; transform: translateY(0); }
          50%     { opacity: 0.4; transform: translateY(6px); }
        }
        .cta-green:hover  { background: #329B3C !important; transform: translateY(-2px) !important; box-shadow: 0 10px 36px rgba(77,189,86,0.52) !important; }
        .cta-teal:hover   { background: #0F6E56 !important; transform: translateY(-2px) !important; }
        .bundle-card:hover{ transform: translateY(-3px); box-shadow: 0 6px 28px rgba(0,0,0,0.10) !important; }

        @media (max-width: 640px) {
          .hide-sm { display: none !important; }
          .hero-flex { flex-direction: column !important; align-items: center !important; }
          .hero-left { align-items: center !important; }
          .hero-card { max-width: 100% !important; }
          .bundles-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* ══════════════ NAV ══════════════ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding:'0.9rem 1.75rem',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.07)' : 'none',
        transition:'all 0.3s ease',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
          <div style={{
            width:34, height:34, borderRadius:9, background:C.teal,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
          }}>🔬</div>
          <span style={{ fontWeight:900, fontSize:'1.1rem', color:C.dark, letterSpacing:'-0.02em' }}>notworms.com</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
          {[
            ['How it works', '#how-it-works'],
            ['Sample report', '/sample-report'],
            ['Pricing', '/pricing'],
            ['Blog', '/blog'],
          ].map(([label, href]) => (
            <a key={label} href={href}
              onClick={!href.startsWith('/') ? e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior:'smooth' }); } : undefined}
              style={{ fontSize:'0.9rem', color:C.dark, textDecoration:'none', fontWeight:600, opacity:0.7 }}
            >{label}</a>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          {user ? (
            <Link to="/dashboard" className="cta-teal" style={{
              fontSize:'0.875rem', fontWeight:700, color:'white', background:C.teal,
              padding:'0.5rem 1.25rem', borderRadius:9999, textDecoration:'none',
              transition:'all 0.2s',
            }}>Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="hide-sm" style={{ fontSize:'0.875rem', color:C.dark, textDecoration:'none', fontWeight:600, opacity:0.65 }}>Sign in</Link>
              <Link to="/signup?promo=BETA3FREE" className="cta-teal" style={{
                fontSize:'0.875rem', fontWeight:800, color:'white', background:C.teal,
                padding:'0.5rem 1.375rem', borderRadius:9999, textDecoration:'none',
                transition:'all 0.2s',
              }}>Get started free</Link>
            </>
          )}
        </div>
      </nav>


      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        position:'relative', minHeight:'100vh',
        background:C.heroBg, overflow:'hidden',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        paddingTop:'5.5rem', paddingBottom:'5rem',
      }}>
        {/* leaf decorations */}
        <div style={{ position:'absolute', top:-10, left:-12, animation:'leafSway 6s ease-in-out infinite', transformOrigin:'bottom center' }}>
          <Leaf w={170} opacity={0.8}/>
        </div>
        <div style={{ position:'absolute', top:-10, right:-12, animation:'leafSway 7s ease-in-out infinite 1s', transformOrigin:'bottom center' }}>
          <Leaf w={160} flip opacity={0.75}/>
        </div>
        <div style={{ position:'absolute', bottom:-20, right:-8, animation:'leafSway 8s ease-in-out infinite 2s', transformOrigin:'top center' }}>
          <Leaf w={140} opacity={0.55}/>
        </div>
        <div style={{ position:'absolute', bottom:-20, left:80, animation:'leafSway 9s ease-in-out infinite 0.5s', transformOrigin:'top center' }}>
          <Leaf w={110} opacity={0.35}/>
        </div>

        {/* content */}
        <div style={{ position:'relative', zIndex:2, maxWidth:1020, width:'100%', padding:'0 1.5rem', textAlign:'center' }}>

          {/* HEADLINE */}
          <h1 style={{
            fontSize:'clamp(2rem, 5.5vw, 3.8rem)',
            fontWeight:900, color:C.dark, lineHeight:1.13,
            margin:'0 auto 2.25rem', maxWidth:820,
            letterSpacing:'-0.025em',
          }}>
            Found something weird in your stool?<br/>
            Get AI analysis in 60 seconds<br/>
            <span style={{ color:C.teal }}>— no lab, no wait.</span>
          </h1>

          {/* PARA + CARD ROW */}
          <div className="hero-flex" style={{
            display:'flex', flexWrap:'wrap',
            alignItems:'flex-end', justifyContent:'center', gap:'2.5rem',
          }}>

            {/* LEFT: Para + CTA */}
            <div className="hero-left" style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', minWidth:260, maxWidth:340 }}>
              <span style={{ fontSize:12.5, fontWeight:700, color:C.gray, marginBottom:10, letterSpacing:'0.05em', alignSelf:'center' }}>
                PARA, your friendly guide, is ready
              </span>

              {/* character + bubble row */}
              <div style={{ display:'flex', alignItems:'flex-end', gap:12, marginBottom:22, alignSelf:'center' }}>
                <div style={{ animation:'bobble 3s ease-in-out infinite', flexShrink:0 }}>
                  <Para size={128}/>
                </div>
                {/* speech bubble */}
                <div style={{
                  background:'rgba(255,255,255,0.93)',
                  borderRadius:'18px 18px 18px 4px',
                  padding:'13px 16px',
                  boxShadow:'0 4px 18px rgba(0,0,0,0.10)',
                  maxWidth:160, position:'relative', bottom:14,
                }}>
                  <p style={{ margin:0, fontSize:14.5, fontWeight:700, color:C.dark, lineHeight:1.45 }}>
                    G'day! Upload your<br/>photo — it's free
                  </p>
                </div>
              </div>

              {/* PRIMARY CTA */}
              <button
                className="cta-green"
                onClick={goUpload}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  width:'100%', background:C.green, color:'white',
                  border:'none', borderRadius:14, padding:'1rem 1.5rem',
                  fontSize:'1.08rem', fontWeight:900, cursor:'pointer',
                  boxShadow:'0 6px 24px rgba(77,189,86,0.38)',
                  transition:'all 0.2s', letterSpacing:'-0.01em',
                }}
              >
                {/* add-person icon */}
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="16" y1="11" x2="22" y2="11"/>
                </svg>
                Upload Photo Now
              </button>

              {/* secondary */}
              <p style={{ fontSize:12.5, color:C.gray, textAlign:'center', width:'100%', marginTop:10, lineHeight:1.6 }}>
                Use code{' '}
                <Link to="/signup?promo=BETA3FREE" style={{ color:C.teal, fontWeight:700, textDecoration:'none' }}>
                  BETA3FREE
                </Link>
                {' '}for 3 free credits on signup
              </p>
            </div>

            {/* RIGHT: mock card */}
            <div className="hero-card" style={{ maxWidth:272, width:'100%', flexShrink:0 }}>
              <HeroCard/>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div style={{
          position:'absolute', bottom:26, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:5,
        }}>
          <span style={{ fontSize:11, color:C.darkMid, opacity:0.45, letterSpacing:'0.05em' }}>scroll to learn more</span>
          <svg style={{ animation:'scrollDot 1.8s ease-in-out infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2" opacity="0.4">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </section>


      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" style={{ background:C.white, padding:'5.5rem 1.5rem' }}>
        <div style={{ maxWidth:840, margin:'0 auto', textAlign:'center' }}>
          <SectionLabel>Simple process</SectionLabel>
          <h2 style={{ fontSize:'clamp(1.75rem, 4vw, 2.6rem)', fontWeight:900, color:C.dark, marginBottom:'0.75rem', letterSpacing:'-0.02em' }}>
            Three steps. Sixty seconds.
          </h2>
          <p style={{ color:C.gray, fontSize:'1.05rem', maxWidth:520, margin:'0 auto 3.5rem', lineHeight:1.7 }}>
            Our AI reads visual patterns the way a clinician does — then builds a structured educational report to bring to your GP.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(230px, 1fr))', gap:'1.5rem' }}>
            {[
              {
                step:'01', emoji:'📸', bg:C.tealSoft,
                title:'Take a clear photo',
                body:'Good lighting, steady hand, whole area in frame. Works with any phone camera. Takes 30 seconds.',
              },
              {
                step:'02', emoji:'🔬', bg:'#FFF8E7',
                title:'Upload + add symptoms',
                body:"Select your sample type, tick any symptoms you're experiencing. The more context you add, the better the report.",
              },
              {
                step:'03', emoji:'📋', bg:'#FFF0EC',
                title:'Get your educational report',
                body:'Urgency level, visual findings, differential possibilities, and GP prep notes — structured and ready instantly.',
              },
            ].map((s,i) => (
              <div key={i} style={{
                background:s.bg, borderRadius:18, padding:'2rem 1.75rem',
                textAlign:'left', position:'relative', overflow:'hidden',
              }}>
                <span style={{ position:'absolute', top:10, right:16, fontSize:'3.5rem', fontWeight:900, color:'rgba(0,0,0,0.05)', lineHeight:1 }}>{s.step}</span>
                <span style={{ fontSize:'2.25rem', display:'block', marginBottom:14 }}>{s.emoji}</span>
                <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:C.dark, marginBottom:9, lineHeight:1.35 }}>{s.title}</h3>
                <p style={{ fontSize:'0.885rem', color:C.gray, lineHeight:1.7, margin:0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════ EXPANDED MOCK REPORT ══════════════ */}
      <section style={{ background:C.grayLight, padding:'5.5rem 1.5rem' }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'2.75rem' }}>
            <SectionLabel>What you actually get</SectionLabel>
            <h2 style={{ fontSize:'clamp(1.75rem, 4vw, 2.6rem)', fontWeight:900, color:C.dark, marginBottom:8, letterSpacing:'-0.02em' }}>
              A real structured report — not a guess
            </h2>
            <p style={{ color:C.gray, maxWidth:540, margin:'0 auto', lineHeight:1.7 }}>
              Every report follows a clinical framework — the same structure a clinician uses — so you walk into your GP appointment prepared.
            </p>
          </div>

          {/* Report card */}
          <div style={{ background:'white', borderRadius:20, boxShadow:'0 4px 48px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            {/* header */}
            <div style={{
              background:'linear-gradient(135deg, #0A1F12 0%, #1D9E75 100%)',
              padding:'1.5rem 2rem',
              display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem',
            }}>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.09em', marginBottom:4 }}>EDUCATIONAL ANALYSIS REPORT</div>
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:'white' }}>Sample Report — Stool Analysis</div>
              </div>
              <span style={{ fontSize:11, background:'#FEF3C7', color:'#92400E', padding:'4px 14px', borderRadius:9999, fontWeight:700 }}>SAMPLE ONLY — NOT A DIAGNOSIS</span>
            </div>

            <div style={{ padding:'2rem', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(270px, 1fr))', gap:'2rem' }}>
              {/* Left */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.gray, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'1rem' }}>Visual assessment</div>

                {/* Image quality */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12.5, color:C.gray, marginBottom:6 }}>Image quality</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {[['Good','#DCFCE7','#166534'],['Adequate',C.border,C.gray],['Poor',C.border,C.gray]].map(([q,bg,col])=>(
                      <span key={q} style={{ fontSize:11.5, padding:'3px 11px', borderRadius:9999, background:bg, color:col, fontWeight: q==='Good'?700:400 }}>{q}</span>
                    ))}
                  </div>
                </div>

                {/* Primary finding */}
                <div style={{ background:C.tealSoft, borderRadius:12, padding:'1rem', marginBottom:16 }}>
                  <div style={{ fontSize:10.5, fontWeight:700, color:C.tealDark, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Primary finding</div>
                  <div style={{ fontSize:'1rem', fontWeight:800, color:C.dark }}>Possible roundworm</div>
                  <div style={{ fontSize:12, color:C.tealDark, fontStyle:'italic', marginTop:2 }}>(Ascaris lumbricoides)</div>
                </div>

                {/* Visual evidence */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:C.dark, marginBottom:9 }}>Visual evidence</div>
                  {[
                    'Elongated cylindrical body structure',
                    'Smooth cuticle surface appearance',
                    'Tapered anterior and posterior ends',
                    'Estimated size: 15–35cm range',
                  ].map((e,i)=>(
                    <div key={i} style={{ display:'flex', gap:9, marginBottom:6, alignItems:'flex-start' }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background:C.teal, marginTop:7, flexShrink:0 }}/>
                      <span style={{ fontSize:12.5, color:C.gray, lineHeight:1.55 }}>{e}</span>
                    </div>
                  ))}
                </div>

                {/* Geographic relevance */}
                <div style={{ background:'#F0F9FF', borderRadius:10, padding:'0.75rem 1rem', display:'flex', gap:8, alignItems:'flex-start' }}>
                  <span style={{ fontSize:16 }}>🌏</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#075985', marginBottom:2 }}>Geographic relevance</div>
                    <p style={{ fontSize:11.5, color:'#0369A1', margin:0, lineHeight:1.55 }}>
                      Common in tropical Queensland and northern Australia. Higher prevalence in regional communities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.gray, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'1rem' }}>Assessment & guidance</div>

                {/* Confidence */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12.5, color:C.gray, marginBottom:6 }}>Confidence level</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ flex:1, height:8, background:'#E5E7EB', borderRadius:9999 }}>
                      <div style={{ width:'79%', height:'100%', background:C.teal, borderRadius:9999 }}/>
                    </div>
                    <span style={{ fontSize:12.5, fontWeight:700, color:C.tealDark, flexShrink:0 }}>High</span>
                  </div>
                </div>

                {/* Urgency */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12.5, color:C.gray, marginBottom:6 }}>Urgency level</div>
                  <div style={{ background:'#FEF3C7', borderRadius:12, padding:'0.875rem 1rem', display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ fontSize:20 }}>🟡</span>
                    <div>
                      <div style={{ fontSize:12.5, fontWeight:800, color:'#92400E' }}>MODERATE</div>
                      <div style={{ fontSize:12, color:'#78350F' }}>Seek medical advice within 1–2 weeks</div>
                    </div>
                  </div>
                </div>

                {/* Differential table */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:C.dark, marginBottom:9 }}>Differential diagnoses</div>
                  <table style={{ width:'100%', fontSize:12, borderCollapse:'collapse' }}>
                    <thead>
                      <tr>{['Condition','Likelihood','Key differentiator'].map(h=>(
                        <th key={h} style={{ textAlign:'left', padding:'4px 6px', color:C.gray, fontWeight:600, fontSize:10.5, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {[
                        ['Tapeworm segment','Low','No proglottid segments visible'],
                        ['Mucus strand','Low','Organised structure present'],
                        ['Undigested food','Very low','Bilateral symmetry observed'],
                      ].map(([c,l,k],i)=>(
                        <tr key={i}>
                          <td style={{ padding:'5px 6px', color:C.dark, borderBottom:`1px solid ${C.border}` }}>{c}</td>
                          <td style={{ padding:'5px 6px', color:C.gray, borderBottom:`1px solid ${C.border}` }}>{l}</td>
                          <td style={{ padding:'5px 6px', color:C.gray, borderBottom:`1px solid ${C.border}`, fontSize:10.5 }}>{k}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recommended action */}
                <div style={{ background:C.tealSoft, borderRadius:12, padding:'1rem' }}>
                  <div style={{ fontSize:10.5, fontWeight:700, color:C.tealDark, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:7 }}>Recommended action</div>
                  <p style={{ fontSize:12.5, color:C.tealDark, margin:0, lineHeight:1.65 }}>
                    Book a GP appointment within 1–2 weeks and bring this report. Antiparasitic treatment is likely — your doctor will confirm and prescribe appropriately. Do not self-medicate.
                  </p>
                </div>
              </div>
            </div>

            {/* disclaimer footer */}
            <div style={{ background:'#FFFBEB', borderTop:'1px solid #FCD34D', padding:'1rem 2rem', display:'flex', alignItems:'flex-start', gap:10 }}>
              <span style={{ fontSize:17, flexShrink:0 }}>⚠️</span>
              <p style={{ fontSize:11.5, color:'#92400E', margin:0, lineHeight:1.65 }}>
                <strong>This is a sample educational report only.</strong> All analysis from notworms.com is for educational and GP-preparation purposes. It does not constitute a medical diagnosis. Always consult a qualified healthcare professional. In an emergency, call <strong>000</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════ WHO IT'S FOR ══════════════ */}
      <section style={{ background:C.white, padding:'5.5rem 1.5rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <SectionLabel>Built for Australians</SectionLabel>
          <h2 style={{ fontSize:'clamp(1.75rem, 4vw, 2.6rem)', fontWeight:900, color:C.dark, marginBottom:6, letterSpacing:'-0.02em' }}>
            You're not overreacting.<br/>You're under-informed.
          </h2>
          <p style={{ color:C.gray, marginBottom:'3.25rem', lineHeight:1.7 }}>
            This tool was built for the exact moment you're in right now.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(256px, 1fr))', gap:'1.5rem' }}>
            {[
              {
                emoji:'👶', audience:'Queensland parents',
                headline:'You worm the dog. Who worms the kids?',
                body:'Kids pick up parasites from soil, pets, and sandpits year-round in Queensland. A photo of a rash or finding gets you an educational report before the GP call.',
              },
              {
                emoji:'✈️', audience:'Post-travel Australians',
                headline:"Something's not right since you got back.",
                body:'Gut symptoms, skin rashes, and fatigue after overseas travel are classic signs. Know exactly what to ask about before you walk into the clinic.',
              },
              {
                emoji:'🐕', audience:'Pet owners',
                headline:'The dog tested positive. Now what about the family?',
                body:"Some pet parasites are zoonotic — they transfer to humans. Get educated before you assume everyone's in the clear.",
              },
            ].map((c,i)=>(
              <div key={i} style={{ background:C.grayLight, borderRadius:18, padding:'1.875rem', textAlign:'left' }}>
                <span style={{ fontSize:'2.5rem', display:'block', marginBottom:13 }}>{c.emoji}</span>
                <div style={{ fontSize:10.5, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:8 }}>{c.audience}</div>
                <h3 style={{ fontSize:'1.025rem', fontWeight:800, color:C.dark, marginBottom:9, lineHeight:1.4 }}>{c.headline}</h3>
                <p style={{ fontSize:'0.875rem', color:C.gray, lineHeight:1.7, margin:0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════ PRICING ══════════════ */}
      <section style={{ background:C.pageBg, padding:'5.5rem 1.5rem' }}>
        <div style={{ maxWidth:820, margin:'0 auto', textAlign:'center' }}>
          <SectionLabel>Simple pricing</SectionLabel>
          <h2 style={{ fontSize:'clamp(1.75rem, 4vw, 2.6rem)', fontWeight:900, color:C.dark, marginBottom:6, letterSpacing:'-0.02em' }}>
            First analysis free. Credits never expire.
          </h2>
          <p style={{ color:C.gray, marginBottom:'2.5rem', lineHeight:1.7 }}>
            No subscription. No lock-in. Pay only when you need another analysis.
          </p>

          {/* Free highlight */}
          <div style={{
            background:'linear-gradient(135deg, #E1F5EE 0%, #CCE8DC 100%)',
            border:`2px solid ${C.teal}`, borderRadius:18,
            padding:'1.5rem 2rem', marginBottom:'1.75rem',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem',
          }}>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:'1.2rem', fontWeight:900, color:C.dark }}>🎉 First analysis — completely free</div>
              <div style={{ fontSize:13, color:C.tealDark, marginTop:4 }}>Signup in 30 seconds. No credit card required. Use code BETA3FREE for 3 free credits.</div>
            </div>
            <button onClick={goUpload} className="cta-teal" style={{
              background:C.teal, color:'white', border:'none', borderRadius:12,
              padding:'0.8rem 2rem', fontSize:'0.95rem', fontWeight:800, cursor:'pointer',
              whiteSpace:'nowrap', transition:'all 0.2s',
            }}>Start free →</button>
          </div>

          {/* Bundles */}
          <div className="bundles-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
            {[
              { name:'5 credits', price:'$19.99', ppc:'$4.00 per analysis', pop:false },
              { name:'10 credits', price:'$34.99', ppc:'$3.50 per analysis', pop:true },
              { name:'25 credits', price:'$74.99', ppc:'$3.00 per analysis', pop:false },
            ].map((b,i)=>(
              <div key={i} className="bundle-card" style={{
                background:C.white,
                border:`${b.pop ? 2 : 1}px solid ${b.pop ? C.teal : C.border}`,
                borderRadius:14, padding:'1.5rem', position:'relative',
                transition:'all 0.2s', cursor:'default',
              }}>
                {b.pop && (
                  <div style={{
                    position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)',
                    background:C.teal, color:'white', fontSize:9.5, fontWeight:800,
                    padding:'3px 12px', borderRadius:9999, letterSpacing:'0.05em', whiteSpace:'nowrap',
                  }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize:'1.7rem', fontWeight:900, color:C.dark, letterSpacing:'-0.02em' }}>{b.price}</div>
                <div style={{ fontSize:'0.9rem', fontWeight:700, color:C.teal, margin:'4px 0 3px' }}>{b.name}</div>
                <div style={{ fontSize:12, color:C.gray, marginBottom:14 }}>{b.ppc}</div>
                <Link to="/pricing" style={{
                  display:'block', textAlign:'center',
                  background: b.pop ? C.teal : 'transparent',
                  color: b.pop ? 'white' : C.teal,
                  border:`1.5px solid ${C.teal}`,
                  borderRadius:9, padding:'8px',
                  fontSize:13, fontWeight:700, textDecoration:'none',
                }}>Buy credits →</Link>
              </div>
            ))}
          </div>

          <p style={{ fontSize:12.5, color:C.gray }}>
            Credits never expire · 30-day money-back guarantee · Secure payment via Stripe · All prices in AUD
          </p>
        </div>
      </section>


      {/* ══════════════ FINAL CTA ══════════════ */}
      <section style={{
        background:'linear-gradient(135deg, #0A1F12 0%, #103520 50%, #1D9E75 100%)',
        padding:'6rem 1.5rem', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* subtle leaf bg */}
        <div style={{ position:'absolute', top:-20, right:-20, opacity:0.08 }}>
          <Leaf w={220} opacity={1}/>
        </div>
        <div style={{ maxWidth:620, margin:'0 auto', position:'relative', zIndex:1 }}>
          <h2 style={{
            fontSize:'clamp(2rem, 5vw, 3.25rem)', fontWeight:900, color:'white',
            marginBottom:'0.875rem', lineHeight:1.18, letterSpacing:'-0.025em',
          }}>
            Stop wondering.<br/>
            <span style={{ color:'#5DCAA5' }}>Start knowing.</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'1.05rem', marginBottom:'2.25rem', lineHeight:1.7 }}>
            You're not a hypochondriac. You're under-informed.<br/>
            Get an educational analysis in 60 seconds. First one's free.
          </p>
          <button onClick={goUpload} className="cta-green" style={{
            display:'inline-flex', alignItems:'center', gap:11,
            background:C.green, color:'white', border:'none',
            borderRadius:16, padding:'1.1rem 2.75rem',
            fontSize:'1.125rem', fontWeight:900, cursor:'pointer',
            boxShadow:'0 8px 32px rgba(77,189,86,0.42)',
            transition:'all 0.2s', letterSpacing:'-0.01em',
          }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Photo Now — Free
          </button>
          <p style={{ color:'rgba(255,255,255,0.38)', marginTop:14, fontSize:12.5 }}>
            No credit card required · Promo code BETA3FREE = 3 free analyses
          </p>
        </div>
      </section>


      {/* ══════════════ DISCLAIMER ══════════════ */}
      <section style={{ background:C.amberBg, borderTop:'1px solid #FCD34D', padding:'2.75rem 1.5rem' }}>
        <div style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontWeight:800, color:'#92400E', marginBottom:7, fontSize:'0.95rem' }}>
            ⚠️ Educational tool — not a medical diagnostic service
          </p>
          <p style={{ fontSize:'0.855rem', color:'#B45309', lineHeight:1.75 }}>
            notworms.com provides <strong>educational information and AI-assisted visual pattern recognition only</strong>,
            designed to help you prepare for a GP visit. It does not constitute a medical diagnosis, medical advice, or
            clinical assessment and is not a substitute for professional healthcare. Always consult a qualified healthcare
            professional for diagnosis and treatment. This platform operates in accordance with TGA Software as a Medical
            Device guidelines and AHPRA advertising standards. In an emergency, call <strong>000</strong>.
          </p>
        </div>
      </section>


      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background:'#091410', color:'#9CA3AF', padding:'3.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth:940, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2.5rem', marginBottom:'2.5rem' }}>
            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:13 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:C.teal, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🔬</div>
                <span style={{ fontWeight:900, color:'white', fontSize:'1.05rem' }}>notworms.com</span>
              </div>
              <p style={{ fontSize:13, lineHeight:1.65, maxWidth:230, margin:0 }}>
                AI-powered educational parasite pattern analysis. Helping Australians prepare for GP visits — not replace them.
              </p>
              <p style={{ fontSize:12, marginTop:10 }}>Mackay, Queensland, Australia 🦘</p>
            </div>

            {/* Link columns */}
            {[
              ['Platform', [['How it works','#how-it-works'],['Pricing','/pricing'],['Sample report','/sample-report'],['FAQ','/faq'],['Blog','/blog']]],
              ['Educational', [['Worm in stool guide','/worm-in-stool-picture'],['Dog worms guide','/dog-worms'],['Parasite encyclopedia','/encyclopedia'],['Pinworm guide','/pinworm'],['Tapeworm guide','/tapeworm']]],
              ['Legal', [['Privacy policy','/privacy'],['Terms of service','/terms'],['Medical disclaimer','/disclaimer'],['Contact','/contact']]],
            ].map(([heading, links])=>(
              <div key={heading}>
                <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.11em', marginBottom:13 }}>{heading}</div>
                {links.map(([label, href])=>(
                  <div key={label} style={{ marginBottom:9 }}>
                    {href.startsWith('/') ? (
                      <Link to={href} style={{ color:'#9CA3AF', textDecoration:'none', fontSize:13 }}>{label}</Link>
                    ) : (
                      <a href={href} onClick={e=>{e.preventDefault();document.querySelector(href)?.scrollIntoView({behavior:'smooth'});}} style={{ color:'#9CA3AF', textDecoration:'none', fontSize:13, cursor:'pointer' }}>{label}</a>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
            <p style={{ fontSize:12, margin:0 }}>© 2025 ParasitePro · notworms.com · ABN pending</p>
            <p style={{ fontSize:12, margin:0 }}>Educational purposes only · Always consult a healthcare professional</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
