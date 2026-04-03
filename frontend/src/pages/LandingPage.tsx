// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';

/* ─── Brand tokens — Image 4 reference ─────────────────────────────── */
const C = {
  heroBg:    '#8AADA6', heroText:  '#0F2733', heroBtnTeal:'#1B6B5F',
  teal:      '#00BFA5', tealDark:  '#008B7A', tealDeep:  '#006B62',
  tealSoft:  '#E1F8F4', tealBtn:   '#00A896', sage:      '#A8D5BA',
  sageSoft:  '#EBF5EE', sageLight: '#F4FAF6', pageBg:    '#F2F7F4',
  navy:      '#1A365D', navyDark:  '#0F2440', urgency:   '#FF6B6B',
  white:     '#FFFFFF', offWhite:  '#F8FAF8', gray:      '#6B7280',
  grayMid:   '#9CA3AF', border:    '#C8E6D8', dark:      '#192E19',
  green:     '#22C55E', greenDk:   '#16A34A', modalBg:   '#2D5A55',
};

/* ─── PARA — line-art sketch figure with wide-brim hat (exact match to mockup) ── */
const ParaWoman = ({ style = {} }) => (
  <svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', width: '100%', height: '100%', ...style }}>

    {/* Wide brim hat — flat, sketchy, with slight tilt */}
    {/* Brim — wide oval */}
    <ellipse cx="168" cy="122" rx="105" ry="14" stroke="#0F2733" strokeWidth="3.5" fill="none"
      strokeLinecap="round" transform="rotate(-3 168 122)"/>
    {/* Crown — trapezoidal top */}
    <path d="M105 122 Q112 72 168 68 Q224 72 232 122"
      stroke="#0F2733" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Hat crown top */}
    <path d="M112 75 Q168 60 225 75" stroke="#0F2733" strokeWidth="2.5" fill="none"
      strokeLinecap="round" opacity="0.5"/>
    {/* Hat indent crease */}
    <path d="M130 95 Q168 88 206 95" stroke="#0F2733" strokeWidth="2" fill="none"
      strokeLinecap="round" strokeDasharray="4 3" opacity="0.4"/>

    {/* Head / face — simple oval, no face features per mockup */}
    <ellipse cx="168" cy="178" rx="44" ry="50" stroke="#0F2733" strokeWidth="3"
      fill="none" strokeLinecap="round"/>

    {/* Neck */}
    <path d="M152 225 L152 248 M184 225 L184 248"
      stroke="#0F2733" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

    {/* Collar / shirt top */}
    <path d="M140 248 Q168 256 196 248 L208 272 Q168 278 128 272 Z"
      stroke="#0F2733" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Shoulders & body */}
    <path d="M108 270 Q88 278 75 310 Q68 340 72 380 L265 380 Q268 340 260 310 Q248 278 228 270"
      stroke="#0F2733" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Left arm */}
    <path d="M108 272 Q82 300 74 350"
      stroke="#0F2733" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Left hand hint */}
    <path d="M70 352 Q68 362 74 365 Q80 360 78 350"
      stroke="#0F2733" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Right arm */}
    <path d="M228 272 Q254 300 262 348"
      stroke="#0F2733" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Right hand hint */}
    <path d="M264 350 Q266 360 260 364 Q254 358 256 348"
      stroke="#0F2733" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Shirt buttons line */}
    <path d="M168 278 L168 376" stroke="#0F2733" strokeWidth="1.5"
      fill="none" strokeLinecap="round" strokeDasharray="3 5" opacity="0.35"/>
  </svg>
);

/* Legacy blob — keep for modal only */
const ParaFig = ({ size = 110, waving = false, style = {} }) => (
  <svg width={size} height={Math.round(size * 1.18)} viewBox="0 0 100 118"
    fill="none" style={{ display: 'block', ...style }}>
    <ellipse cx="50" cy="114" rx="28" ry="5" fill="rgba(0,0,0,0.10)"/>
    <ellipse cx="50" cy="80" rx="30" ry="33" fill={C.teal}/>
    {waving
      ? <ellipse cx="17" cy="52" rx="11" ry="8" fill={C.teal} transform="rotate(-50 17 52)"/>
      : <ellipse cx="21" cy="74" rx="11" ry="8" fill={C.teal} transform="rotate(-18 21 74)"/>}
    <ellipse cx="79" cy="74" rx="11" ry="8" fill={C.teal} transform="rotate(18 79 74)"/>
    <ellipse cx="37" cy="108" rx="12" ry="7" fill={C.tealDark}/>
    <ellipse cx="63" cy="108" rx="12" ry="7" fill={C.tealDark}/>
    <ellipse cx="50" cy="52" rx="30" ry="29" fill={C.teal}/>
    <ellipse cx="50" cy="54" rx="22" ry="20" fill="rgba(255,255,255,0.09)"/>
    <ellipse cx="37" cy="48" rx="9.5" ry="10.5" fill="white"/>
    <ellipse cx="63" cy="48" rx="9.5" ry="10.5" fill="white"/>
    <circle cx="38.5" cy="50" r="5.8" fill="#0D2218"/>
    <circle cx="64.5" cy="50" r="5.8" fill="#0D2218"/>
    <circle cx="41" cy="46" r="2.3" fill="white"/>
    <circle cx="67" cy="46" r="2.3" fill="white"/>
    <ellipse cx="26" cy="58" rx="6" ry="4" fill="#FF9999" opacity="0.28"/>
    <ellipse cx="74" cy="58" rx="6" ry="4" fill="#FF9999" opacity="0.28"/>
    <path d="M37 63 Q50 76 63 63" fill="#0D2218"/>
    <path d="M39 65 Q50 74 61 65" fill="#E87070"/>
    <ellipse cx="50" cy="25" rx="39" ry="9.5" fill="#4D6B3C"/>
    <path d="M22 25 Q26 3 50 3 Q74 3 78 25Z" fill="#5E8048"/>
    <rect x="24" y="19" width="52" height="7.5" rx="2.5" fill="#3A5228"/>
    <path d="M30 21 Q48 15 64 18" stroke="rgba(255,255,255,0.17)" strokeWidth="2.5"
      fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── PARA Welcome Modal — Image 1 reference ─────────────────────────── */
const ParaModal = ({ onClose, onStart }) => {
  const [speaking, setSpeaking] = useState(false);
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      "G'day! I'm PARA, your personal guide to ParasitePro! Found something weird and not sure what it is? You're in exactly the right place. Let me show you what we're all about."
    );
    u.rate = 0.96; u.pitch = 1.05;
    const pick = window.speechSynthesis.getVoices().find(v => v.lang === 'en-AU')
      || window.speechSynthesis.getVoices().find(v => v.lang.startsWith('en'));
    if (pick) u.voice = pick;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.52)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
      backdropFilter:'blur(4px)', animation:'pmFadeIn 0.2s ease both',
    }}>
      <div style={{
        background:C.modalBg, borderRadius:24, width:'100%', maxWidth:380,
        padding:'2rem 1.75rem 1.5rem', position:'relative',
        animation:'pmSlide 0.32s cubic-bezier(0.22,0.68,0,1.2) both',
        boxShadow:'0 24px 64px rgba(0,0,0,0.45)',
      }}>
        <button onClick={onClose} style={{
          position:'absolute', top:14, right:14, width:36, height:36,
          borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          color:'white', fontSize:18, fontWeight:700,
        }}>✕</button>

        <div style={{
          width:120, height:120, borderRadius:'50%',
          background:'rgba(255,255,255,0.12)', border:'2px solid rgba(255,255,255,0.10)',
          margin:'0 auto 1.25rem', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <ParaFig size={86} waving/>
        </div>

        <h2 style={{
          color:'white', fontSize:'1.35rem', fontWeight:800, textAlign:'center',
          margin:'0 0 0.75rem', lineHeight:1.35, letterSpacing:'-0.01em',
        }}>G&apos;day! I&apos;m PARA — your personal guide to ParasitePro!</h2>

        <p style={{
          color:'rgba(255,255,255,0.80)', fontSize:'0.9rem',
          textAlign:'center', lineHeight:1.65, margin:'0 0 1.5rem',
        }}>Found something weird and not sure what it is? You are in exactly the right place.
          Let me show you what we&apos;re all about.</p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <button onClick={handleSpeak} style={{
            display:'flex', alignItems:'center', gap:8, background:'none', border:'none',
            cursor:'pointer', color:'rgba(255,255,255,0.85)', fontSize:'0.875rem', fontWeight:500,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              {speaking && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
            </svg>
            Tap to hear PARA
          </button>
          <button onClick={onClose} style={{
            padding:'8px 22px', background:'rgba(255,255,255,0.10)',
            border:'1.5px solid rgba(255,255,255,0.22)', borderRadius:20,
            cursor:'pointer', color:'white', fontSize:'0.875rem', fontWeight:500,
          }}>Skip</button>
        </div>

        <button onClick={onStart} style={{
          width:'100%', padding:'14px', background:C.green, border:'none',
          borderRadius:14, cursor:'pointer', color:'white',
          fontSize:'1rem', fontWeight:800, letterSpacing:'0.01em',
        }}>Start Free Analysis</button>

        <p style={{
          color:'rgba(255,255,255,0.40)', fontSize:'0.72rem',
          textAlign:'center', marginTop:'0.875rem', lineHeight:1.5,
        }}>Educational tool only — not a medical diagnosis</p>
      </div>
      <style>{`
        @keyframes pmFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pmSlide{from{transform:translateY(48px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
    </div>
  );
};

/* ─── Sample preview card (compliant — no accuracy % claims) ────────── */
const SamplePreview = () => (
  <div style={{
    background:'white', borderRadius:16, overflow:'hidden',
    border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
    flex:1, minWidth:0,
  }}>
    <div style={{
      background:'#E2EDE2', position:'relative',
      aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 280 210" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="mbg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8DCC4"/>
            <stop offset="100%" stopColor="#A8C8A4"/>
          </radialGradient>
          <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="white"/>
          </marker>
        </defs>
        <rect width="280" height="210" fill="url(#mbg)"/>
        <ellipse cx="85" cy="105" rx="58" ry="68" fill="rgba(80,120,80,0.48)"/>
        <ellipse cx="115" cy="88" rx="42" ry="52" fill="rgba(100,145,100,0.40)"/>
        <ellipse cx="195" cy="125" rx="48" ry="56" fill="rgba(70,115,70,0.44)"/>
        <ellipse cx="155" cy="150" rx="36" ry="42" fill="rgba(90,130,90,0.38)"/>
        <circle cx="88" cy="95" r="30" stroke="#00BFA5" strokeWidth="2.5" fill="none"/>
        <circle cx="190" cy="118" r="28" stroke="#00BFA5" strokeWidth="2.5" fill="none"/>
        <circle cx="150" cy="152" r="22" stroke="#00BFA5" strokeWidth="2.5" fill="none"/>
        <line x1="135" y1="58" x2="104" y2="78" stroke="white" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <line x1="225" y1="78" x2="205" y2="105" stroke="white" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <line x1="178" y1="172" x2="162" y2="162" stroke="white" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x="14" y="26" fontFamily="system-ui,sans-serif" fontSize="11"
          fill="rgba(0,0,0,0.6)" fontWeight="500">Sample image — PARA annotated</text>
      </svg>
    </div>
    <div style={{ padding:'12px 14px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
        <span style={{
          fontSize:'0.75rem', fontWeight:700, padding:'3px 10px',
          background:'#FEF3C7', color:'#92400E', borderRadius:20,
        }}>🟡 Moderate urgency</span>
        <span style={{ fontSize:'0.75rem', color:C.gray }}>3 areas flagged</span>
      </div>
      <p style={{ fontSize:'0.75rem', color:C.gray, margin:0, lineHeight:1.5 }}>
        Report includes differential diagnoses and GP next steps
      </p>
    </div>
    <div style={{ background:C.navy, padding:'8px 14px', textAlign:'center' }}>
      <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.75rem', fontWeight:600 }}>
        Educational report only — not a diagnosis
      </span>
    </div>
  </div>
);

/* ─── ParaTeaser removed — replaced by split hero layout ─── */
const ParaTeaser = ({ onClick }) => null;

/* ─── Logo mark ─────────────────────────────────────────────────────── */
const Logo = () => (
  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
    <div style={{
      width:32, height:32, borderRadius:8, background:C.teal,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <span style={{ fontWeight:800, fontSize:'1.05rem', color:C.navy, letterSpacing:'-0.01em' }}>
      notworms.com
    </span>
  </div>
);

/* ─── LANDING PAGE ───────────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { user }  = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('para_welcome_shown');
    if (!seen) { const t = setTimeout(() => setShowModal(true), 800); return () => clearTimeout(t); }
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleStart = () => {
    sessionStorage.setItem('para_welcome_shown', '1');
    setShowModal(false);
    navigate(user ? '/upload' : '/signup?promo=BETA3FREE');
  };
  const openModal = () => { sessionStorage.setItem('para_welcome_shown', '1'); setShowModal(true); };

  return (
    <div style={{ background:C.pageBg, minHeight:'100vh',
      fontFamily:'"Inter","DM Sans",system-ui,sans-serif' }}>
      <SEO
        title="notworms.com — AI parasite education for Australians"
        description="Found something weird? Upload a photo and get a structured educational report in 60 seconds. For Queensland parents, travellers, and pet owners."
      />

      {showModal && (
        <ParaModal
          onClose={() => { sessionStorage.setItem('para_welcome_shown','1'); setShowModal(false); }}
          onStart={handleStart}
        />
      )}

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background: scrolled ? 'rgba(242,247,244,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition:'all 0.2s ease', padding:'0 1.5rem',
      }}>
        <div style={{
          maxWidth:1120, margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between', height:64,
        }}>
          <Link to="/" style={{ textDecoration:'none' }}><Logo/></Link>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {user ? (
              <Link to="/dashboard" style={{
                padding:'8px 18px', borderRadius:20, background:C.teal, color:'white',
                textDecoration:'none', fontSize:'0.875rem', fontWeight:700,
              }}>Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" style={{
                  padding:'8px 16px', borderRadius:20, fontSize:'0.875rem',
                  color:C.navy, textDecoration:'none', fontWeight:500,
                }}>Sign in</Link>
                <button onClick={openModal} style={{
                  padding:'8px 18px', borderRadius:20, background:C.teal, color:'white',
                  border:'none', cursor:'pointer', fontSize:'0.875rem', fontWeight:700,
                }}>Upload Free →</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO — exact match to mockup ──────────────────────────────── */}
      <section style={{
        background: C.heroBg,
        borderRadius: 24,
        margin: '0 1rem 0',
        padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3.5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle texture overlay */}
        <div style={{
          position:'absolute', inset:0, borderRadius:24,
          background:'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          pointerEvents:'none',
        }}/>

        <div style={{
          position:'relative',
          display:'grid',
          gridTemplateColumns:'1fr auto',
          gap:'clamp(1rem,4vw,3rem)',
          alignItems:'center',
          maxWidth:1040,
          margin:'0 auto',
        }}>

          {/* LEFT col */}
          <div>

            {/* Big headline — 2 lines like mockup */}
            <h1 style={{
              fontSize:'clamp(2.4rem,5.5vw,4rem)', fontWeight:800, color:C.heroText,
              lineHeight:1.08, letterSpacing:'-0.03em', margin:'0 0 1rem',
              maxWidth:560,
            }}>
              Found something concerning in your stool?
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize:'clamp(1rem,2vw,1.25rem)', color:C.heroText,
              opacity:0.75, margin:'0 0 2rem', lineHeight:1.5,
              maxWidth:480, fontWeight:400,
            }}>
              Get fast AI-powered analysis in 60 seconds — no lab visit required
            </p>

            {/* CTA buttons — row */}
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', marginBottom:'2rem' }}>

              {/* Primary — teal fill */}
              <button
                onClick={() => navigate(user ? '/upload' : '/signup?promo=BETA3FREE')}
                style={{
                  padding:'16px 32px',
                  background: C.heroBtnTeal,
                  color:'white',
                  border:'none',
                  borderRadius:14,
                  fontSize:'1.05rem',
                  fontWeight:700,
                  cursor:'pointer',
                  letterSpacing:'0.01em',
                  transition:'all 0.15s',
                  boxShadow:'0 4px 20px rgba(0,0,0,0.18)',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='#145047';e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.heroBtnTeal;e.currentTarget.style.transform='none';}}
              >
                Upload Photo for Analysis
              </button>

              {/* Secondary — outlined */}
              <button
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                style={{
                  padding:'15px 32px',
                  background:'transparent',
                  color: C.heroText,
                  border:`2px solid ${C.heroText}`,
                  borderRadius:14,
                  fontSize:'1.05rem',
                  fontWeight:700,
                  cursor:'pointer',
                  transition:'all 0.15s',
                  opacity:0.85,
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(15,39,51,0.1)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.opacity='1';}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.transform='none';e.currentTarget.style.opacity='0.85';}}
              >
                Export to My Health Record
              </button>
            </div>

            {/* Trust bar — inline dots */}
            <p style={{
              fontSize:'0.85rem', color:C.heroText, opacity:0.6,
              margin:0, fontWeight:500, letterSpacing:'0.01em',
            }}>
              Built in Australia &nbsp;•&nbsp; Privacy First &nbsp;•&nbsp; Educational Tool Only
            </p>
          </div>

          {/* RIGHT col — line-art figure */}
          <div style={{
            width:'clamp(160px,24vw,300px)',
            height:'clamp(220px,34vw,420px)',
            flexShrink:0,
          }}>
            <ParaWoman/>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{
        background:'white', padding:'clamp(3rem,6vw,5rem) 1.5rem',
        borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <p style={{
            textAlign:'center', textTransform:'uppercase', letterSpacing:'0.1em',
            fontSize:'0.72rem', fontWeight:700, color:C.teal, marginBottom:'0.5rem',
          }}>How it works</p>
          <h2 style={{
            textAlign:'center', fontSize:'clamp(1.5rem,3vw,2.1rem)',
            fontWeight:800, color:C.navy, margin:'0 0 3rem', letterSpacing:'-0.02em',
          }}>Three steps. Sixty seconds.</h2>
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.5rem',
          }}>
            {[
              { step:'01', icon:'📸', title:'Take or upload a photo',
                desc:"Stool sample, skin rash, anything that's got you worried. Clear photo in good light." },
              { step:'02', icon:'🔬', title:'PARA analyses it',
                desc:'Our AI identifies visual patterns, flags urgency level, and lists what could be worth investigating.' },
              { step:'03', icon:'📋', title:'You get a structured report',
                desc:'Share with your GP. Know exactly what to say before you walk in the door.' },
            ].map(s => (
              <div key={s.step} style={{
                background:C.sageLight, borderRadius:16, padding:'1.75rem 1.5rem',
                border:`1px solid ${C.border}`, position:'relative',
              }}>
                <span style={{
                  position:'absolute', top:14, right:14,
                  fontSize:'0.7rem', fontWeight:800, color:C.sage, letterSpacing:'0.05em',
                }}>{s.step}</span>
                <div style={{ fontSize:36, marginBottom:'0.875rem' }}>{s.icon}</div>
                <h3 style={{ fontSize:'1rem', fontWeight:700, color:C.navy, margin:'0 0 0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize:'0.875rem', color:C.gray, lineHeight:1.6, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section style={{ padding:'clamp(3rem,6vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <p style={{
            textAlign:'center', textTransform:'uppercase', letterSpacing:'0.1em',
            fontSize:'0.72rem', fontWeight:700, color:C.teal, marginBottom:'0.5rem',
          }}>Who uses ParasitePro</p>
          <h2 style={{
            textAlign:'center', fontSize:'clamp(1.5rem,3vw,2.1rem)',
            fontWeight:800, color:C.navy, margin:'0 0 3rem', letterSpacing:'-0.02em',
          }}>You&apos;re not overreacting. You&apos;re under-informed.</h2>
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.25rem',
          }}>
            {[
              { emoji:'👨‍👩‍👧‍👦', title:'Queensland parents', color:C.tealSoft,
                desc:"You worm the dog every 3 months. When did you last think about the kids? Tropical QLD has real parasite exposure risk most families underestimate." },
              { emoji:'✈️', title:'Post-travel Australians', color:'#FEF9EE',
                desc:"Gut symptoms after SE Asia or Bali that won't quit? You need organised information before your GP appointment, not a 2am Google spiral." },
              { emoji:'🐕', title:'Pet owners', color:'#F5EEFF',
                desc:"Your vet just found worms in your dog. Some are zoonotic — they transfer to humans. Worth a quick check before assuming everyone's fine." },
            ].map(c => (
              <div key={c.title} style={{
                background:c.color, borderRadius:16, padding:'1.75rem 1.5rem',
                border:'1px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize:36, marginBottom:'0.875rem' }}>{c.emoji}</div>
                <h3 style={{ fontSize:'1rem', fontWeight:700, color:C.navy, margin:'0 0 0.5rem' }}>{c.title}</h3>
                <p style={{ fontSize:'0.875rem', color:C.gray, lineHeight:1.6, margin:0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ANCHOR ───────────────────────────────────────────── */}
      <section style={{ background:C.navy, padding:'clamp(3rem,6vw,4.5rem) 1.5rem' }}>
        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{
            fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:800, color:'white',
            margin:'0 0 1rem', letterSpacing:'-0.02em',
          }}>
            A GP visit costs $80.<br/>
            <span style={{ color:C.teal }}>Each analysis costs $3.50.</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'1rem', lineHeight:1.65, margin:'0 0 2rem' }}>
            First analysis completely free. Credits in bundles — no subscription, no monthly fee.
          </p>
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
            gap:'1rem', marginBottom:'2rem',
          }}>
            {[
              { credits:5,  price:'$19.99', ppc:'$4.00 each' },
              { credits:10, price:'$34.99', ppc:'$3.50 each', hot:true },
              { credits:25, price:'$74.99', ppc:'$3.00 each' },
            ].map(b => (
              <div key={b.credits} style={{
                background: b.hot ? C.teal : 'rgba(255,255,255,0.08)',
                border: b.hot ? 'none' : '1px solid rgba(255,255,255,0.12)',
                borderRadius:12, padding:'1.25rem', position:'relative',
              }}>
                {b.hot && <div style={{
                  position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
                  background:C.green, color:'white', fontSize:'0.65rem', fontWeight:800,
                  padding:'2px 10px', borderRadius:20, letterSpacing:'0.06em', whiteSpace:'nowrap',
                }}>BEST VALUE</div>}
                <div style={{ fontSize:'1.75rem', fontWeight:900, color:'white', marginBottom:2 }}>{b.credits}</div>
                <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.65)', marginBottom:4 }}>analyses</div>
                <div style={{ fontSize:'1.15rem', fontWeight:800, color:'white' }}>{b.price}</div>
                <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.6)' }}>{b.ppc}</div>
              </div>
            ))}
          </div>
          <button onClick={openModal} style={{
            padding:'14px 40px', background:C.green, color:'white',
            border:'none', borderRadius:12, fontSize:'1rem', fontWeight:800, cursor:'pointer',
          }}>Start free — no credit card needed</button>
          <p style={{ color:'rgba(255,255,255,0.40)', fontSize:'0.78rem', marginTop:'0.75rem' }}>
            Credits never expire · 30-day money-back guarantee · Secured by Stripe
          </p>
        </div>
      </section>

      {/* ── COMPLIANCE STRIP ─────────────────────────────────────────── */}
      <section style={{
        background:'#FFF8E7', borderTop:'2px solid #F59E0B',
        padding:'1.5rem', textAlign:'center',
      }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <p style={{ fontSize:'0.82rem', color:'#78350F', lineHeight:1.7, margin:0 }}>
            ⚠️ <strong>Educational tool only.</strong> ParasitePro provides structured educational
            reports to help you prepare for GP visits. It does not provide medical diagnoses,
            prescribe treatments, or replace professional medical advice. Complies with TGA Software
            as a Medical Device guidelines and AHPRA advertising standards.{' '}
            <strong>In an emergency, call 000.</strong>
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ background:C.navyDark, padding:'2.5rem 1.5rem 2rem' }}>
        <div style={{
          maxWidth:900, margin:'0 auto',
          display:'flex', flexWrap:'wrap', justifyContent:'space-between',
          alignItems:'flex-start', gap:'1.5rem',
        }}>
          <div>
            <Logo/>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', marginTop:'0.6rem', maxWidth:200 }}>
              AI-powered parasite education for Australians.
            </p>
          </div>
          <div style={{ display:'flex', gap:'3rem', flexWrap:'wrap' }}>
            <div>
              <p style={{
                color:'rgba(255,255,255,0.45)', fontSize:'0.72rem', fontWeight:700,
                letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.75rem',
              }}>Product</p>
              {[['/upload','Upload Photo'],['/scientific-library','Scientific Library'],['/pricing','Pricing'],['/sample-report','Sample Report']].map(([h,l]) => (
                <Link key={h} to={h} style={{
                  display:'block', color:'rgba(255,255,255,0.6)',
                  textDecoration:'none', fontSize:'0.82rem', marginBottom:'0.4rem',
                }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{
                color:'rgba(255,255,255,0.45)', fontSize:'0.72rem', fontWeight:700,
                letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.75rem',
              }}>Legal</p>
              {[['/privacy','Privacy Policy'],['/terms','Terms of Service'],['/disclaimer','Disclaimer'],['/contact','Contact']].map(([h,l]) => (
                <Link key={h} to={h} style={{
                  display:'block', color:'rgba(255,255,255,0.6)',
                  textDecoration:'none', fontSize:'0.82rem', marginBottom:'0.4rem',
                }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{
          maxWidth:900, margin:'2rem auto 0',
          borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'1.25rem',
          display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem',
        }}>
          <p style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.75rem', margin:0 }}>
            © 2026 notworms.com · Made in Mackay, Queensland 🇦🇺
          </p>
          <p style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.75rem', margin:0 }}>
            support@notworms.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
