// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';
import TrustBar from '../components/TrustBar';
import TestimonialsSection from '../components/TestimonialsSection';
import HomepageFAQ from '../components/HomepageFAQ';
import HeroPhoneMockup from '../components/HeroPhoneMockup';
import SignupAssistant from '../components/SignupAssistant';

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
  <img
    src="/para-avatar.jpg"
    alt="PARA"
    draggable={false}
    style={{
      display: 'block', width: '100%', height: '100%',
      objectFit: 'contain', objectPosition: 'bottom center',
      borderRadius: '50% 50% 40% 40%',
      filter: 'drop-shadow(0 8px 32px rgba(255,100,200,0.5))',
      animation: 'para-hero-float 3s ease-in-out infinite',
      ...style,
    }}
  />
);

/* Hero float keyframe */
if (typeof document !== 'undefined' && !document.getElementById('para-hero-kf')) {
  const s = document.createElement('style');
  s.id = 'para-hero-kf';
  s.textContent = `@keyframes para-hero-float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(1.5deg)} }`;
  document.head.appendChild(s);
}

/* ParaFig — intro modal avatar */
const ParaFig = ({ size = 110, waving = false, style = {} }) => {
  const anim = waving
    ? 'rb-wave 1.6s ease-in-out infinite'
    : 'rb-talk 0.35s ease-in-out infinite';
  return (
    <div style={{ width: size, height: Math.round(size * 1.18), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}>
      <img
        src="/para-avatar.jpg"
        alt="PARA"
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          borderRadius: '50% 50% 40% 40%',
          animation: anim,
          filter: 'drop-shadow(0 4px 16px rgba(255,100,200,0.5))',
          transformOrigin: 'bottom center',
          userSelect: 'none',
        }}
      />
    </div>
  );
};

/* ─── PARA Welcome Modal — Image 1 reference ─────────────────────────── */
const ParaModal = ({ onClose, onStart }) => {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = React.useRef(null);
  const handleSpeak = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const audio = new Audio('/audio/para-line-05.mp3');
    audioRef.current = audio;
    audio.onplay  = () => setSpeaking(true);
    audio.onended = () => { setSpeaking(false); audioRef.current = null; };
    audio.onerror = () => {
      setSpeaking(false); audioRef.current = null;
      // fallback to Web Speech
      if (!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(
        "G'day! I'm PARA, your personal guide to ParasitePro! Found something weird and not sure what it is? You're in exactly the right place. Let me show you what we're all about."
      );
      u.rate = 1.05; u.pitch = 1.38;
      u.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    };
    audio.play().catch(() => audioRef.current?.dispatchEvent(new Event('error')));
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
        <button type="button" onClick={onClose} style={{
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
          <button type="button" onClick={handleSpeak} style={{
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
          <button type="button" onClick={onClose} style={{
            padding:'8px 22px', background:'rgba(255,255,255,0.10)',
            border:'1.5px solid rgba(255,255,255,0.22)', borderRadius:20,
            cursor:'pointer', color:'white', fontSize:'0.875rem', fontWeight:500,
          }}>Skip</button>
        </div>

        <button type="button" onClick={onStart} style={{
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
  const { user, isAuthenticated }  = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('para_welcome_shown');
    if (!seen) { const t = setTimeout(() => setShowModal(true), 800); return () => clearTimeout(t); }
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
        canonical="/"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Parasite ID Pro",
            "url": "https://notworms.com",
            "description": "AI-powered parasite education for Australians",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://notworms.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ParasitePro",
            "operatingSystem": "Web",
            "applicationCategory": "HealthApplication",
            "description": "AI-powered parasite education platform for Australians. Upload a photo and receive a structured educational report to help prepare for GP visits.",
            "url": "https://notworms.com",
            "offers": [
              { "@type": "Offer", "price": "0", "priceCurrency": "AUD", "name": "First analysis free" },
              { "@type": "Offer", "price": "19.99", "priceCurrency": "AUD", "name": "5 Analysis Credits" },
              { "@type": "Offer", "price": "34.99", "priceCurrency": "AUD", "name": "10 Analysis Credits" },
              { "@type": "Offer", "price": "74.99", "priceCurrency": "AUD", "name": "25 Analysis Credits" }
            ]
          }
        ]}
      />

      {showModal && (
        <ParaModal
          onClose={() => { sessionStorage.setItem('para_welcome_shown','1'); setShowModal(false); }}
          onStart={handleStart}
        />
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        background: C.heroBg,
        borderRadius: 24,
        margin: '0 1rem 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(360px, 55vw, 560px)',
      }}>
        {/* ── PARA woman — absolute right, large watermark ── */}
        <div style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 'clamp(280px, 52%, 580px)',
          height: '100%',
          opacity: 0.28,
          pointerEvents: 'none',
        }}>
          <ParaWoman style={{ width:'100%', height:'100%', objectFit:'contain', objectPosition:'bottom right' }}/>
        </div>

        {/* ── Phone mockup — bottom right, above PARA watermark ── */}
        <div style={{
          position: 'absolute',
          right: 'clamp(1rem, 6vw, 5rem)',
          bottom: 'clamp(1.5rem, 4vw, 3rem)',
          zIndex: 2,
          display: 'none',
        }} className="hero-phone-mockup">
          <HeroPhoneMockup />
        </div>

        {/* ── Text + CTAs — positioned over the full width ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: 'clamp(2.5rem,5vw,4rem) clamp(1.75rem,4vw,3.5rem)',
          maxWidth: 1040,
          margin: '0 auto',
        }}>
          {/* Headline — full width, very large */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)',
            fontWeight: 800,
            color: C.heroText,
            lineHeight: 1.06,
            letterSpacing: '-0.035em',
            margin: '0 0 clamp(1.5rem,3vw,2.5rem)',
            maxWidth: 820,
          }}>
            You worm the dog.<br/>
            Who worms the kids?
            <span style={{ fontSize:'clamp(1.4rem,3.2vw,2.2rem)', fontWeight:600, opacity:0.82, lineHeight:1.4, display:'block', marginTop:'0.6rem' }}>
              Upload a photo. Get a structured educational report in 60 seconds.
              Take it to your GP with confidence — not panic.
            </span>
          </h1>

          {/* Two dark buttons — left and right spaced */}
          <div style={{
            display: 'flex',
            gap: 'clamp(0.75rem,2vw,1.25rem)',
            flexWrap: 'wrap',
            marginBottom: 'clamp(1.5rem,3vw,2rem)',
          }}>
            {/* Primary — dark black */}
            <button type="button"
              onClick={() => navigate(user ? '/upload' : '/signup?promo=BETA3FREE')}
              style={{
                padding: 'clamp(13px,1.8vw,18px) clamp(22px,3vw,40px)',
                background: '#0F2733',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                fontSize: 'clamp(0.9rem,1.6vw,1.05rem)',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'all 0.15s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#1A3D4F';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#0F2733';e.currentTarget.style.transform='none';}}
            >
              Upload Your Photo — First One's Free
            </button>

            {/* Secondary — "See a Sample Report" navigates to sample report page */}
            <button type="button"
              onClick={() => navigate('/sample-report')}
              style={{
                padding: 'clamp(13px,1.8vw,18px) clamp(22px,3vw,40px)',
                background: '#0F2733',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                fontSize: 'clamp(0.9rem,1.6vw,1.05rem)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#1A3D4F';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#0F2733';e.currentTarget.style.transform='none';}}
            >
              See a Sample GP Report
            </button>
          </div>

          {/* Trust bar — pill component */}
          <TrustBar variant="sage" />
        </div>
      </section>

      {/* ── TRUST STATS STRIP ────────────────────────────────────────── */}
      <section style={{ background: '#0F2733', padding: 'clamp(1.5rem,3vw,2.5rem) 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.4)',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '1.5rem',
          }}>
            Built for Australians · Australian Privacy Act Compliant
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
            gap: '1rem', marginBottom: '1.5rem',
          }}>
            {[
              { num: '44',   label: 'Organisms in Scientific Library', icon: '🔬' },
              { num: 'QLD',  label: 'Geographic context in every report', icon: '🗺️' },
              { num: '60s',  label: 'Average report generation time', icon: '⚡' },
              { num: 'FREE', label: 'First analysis — no credit card', icon: '🎁' },
            ].map(({ num, label, icon }) => (
              <div key={num} style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14, padding: '1.25rem 1rem',
              }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#5AB89A', letterSpacing: '-0.03em', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              '🔒 Educational Use Only — Not a Medical Device',
              '🛡️ Images Not Stored Beyond Your Session',
              '📋 GP-Ready Report Format',
            ].map(badge => (
              <span key={badge} style={{
                fontSize: '0.68rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '9999px', padding: '5px 13px',
                color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap',
              }}>
                {badge}
              </span>
            ))}
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

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <HomepageFAQ />

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
          <button type="button" onClick={openModal} style={{
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
              {[['/upload','Upload Photo'],['/tips','Free Tips'],['/scientific-library','Scientific Library'],['/pricing','Pricing'],['/sample-report','Sample Report']].map(([h,l]) => (
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
              }}>Learn</p>
              {[
                ['/worm-in-stool','Worm in Stool?'],
                ['/giardia-symptoms-australia','Giardia Symptoms'],
                ['/queensland-parasites','QLD Parasites'],
                ['/dog-worms','Dog Worms'],
                ['/tapeworm-symptoms','Tapeworm Signs'],
                ['/pinworm-treatment','Pinworm Treatment'],
              ].map(([h,l]) => (
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
      {/* PARA signup assistant — shown to unauthenticated visitors only */}
      {!isAuthenticated && !showModal && <SignupAssistant />}
    </div>
  );
};

export default LandingPage;
