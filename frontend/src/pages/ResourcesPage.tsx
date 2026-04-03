// @ts-nocheck
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* ─── Shared colours ─────────────────────────────────────────── */
const C = {
  bg:      '#8AADA6',
  cardBg:  'rgba(255,255,255,0.82)',
  thumb:   'rgba(138,173,166,0.55)',
  text:    '#0F2733',
  teal:    '#1B6B5F',
  muted:   '#4A6B62',
};

/* ─── Line-art PARA sketch (top-right watermark) ──────────────── */
const ParaSketch = () => (
  <svg viewBox="0 0 260 320" fill="none" style={{ width:'100%', height:'100%', opacity:0.45 }}>
    <ellipse cx="130" cy="90" rx="88" ry="18" stroke={C.text} strokeWidth="3" fill="none" transform="rotate(-1 130 90)"/>
    <path d="M74 90 Q80 44 130 40 Q180 44 186 90Z" stroke={C.text} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M78 64 Q130 50 182 64" stroke={C.text} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"/>
    <ellipse cx="130" cy="148" rx="42" ry="46" stroke={C.text} strokeWidth="2.5" fill="none"/>
    <path d="M113 190 L113 210 M147 190 L147 210" stroke={C.text} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M100 210 Q130 220 160 210 L166 228 Q130 236 94 228Z" stroke={C.text} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M72 226 Q52 248 44 292 L216 292 Q208 248 188 226" stroke={C.text} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M72 228 Q52 256 46 295" stroke={C.text} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M188 228 Q208 254 214 294" stroke={C.text} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── AI icon for card 2 ────────────────────────────────────── */
const AiIcon = () => (
  <svg viewBox="0 0 120 100" fill="none" style={{ width:120, height:100 }}>
    <path d="M20 80 L20 40 L50 10 L50 80" stroke={C.teal} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M50 80 L80 80" stroke={C.teal} strokeWidth="3" strokeLinecap="round"/>
    <path d="M70 20 L70 80" stroke={C.teal} strokeWidth="3" strokeLinecap="round"/>
    <path d="M70 40 L100 40" stroke={C.teal} strokeWidth="3" strokeLinecap="round"/>
    <path d="M70 55 L95 55" stroke={C.teal} strokeWidth="3" strokeLinecap="round"/>
    <path d="M70 70 L90 70" stroke={C.teal} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="70" cy="40" r="4" fill={C.teal}/>
    <circle cx="95" cy="40" r="4" fill={C.teal}/>
    <circle cx="70" cy="55" r="4" fill={C.teal}/>
    <circle cx="70" cy="70" r="4" fill={C.teal}/>
    <path d="M20 20 L10 20 M20 40 L10 40 M20 60 L10 60" stroke={C.teal} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ─── Resource card ──────────────────────────────────────────── */
const ResourceCard = ({ thumb, title, excerpt, href }) => (
  <Link to={href} style={{ textDecoration:'none', display:'flex', flexDirection:'column', background:C.cardBg, borderRadius:18, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.08)', transition:'transform 0.18s, box-shadow 0.18s', backdropFilter:'blur(6px)' }}
    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.14)';}}
    onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,0.08)';}}>
    {/* Thumb area */}
    <div style={{ background:C.thumb, height:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      {thumb}
    </div>
    {/* Content */}
    <div style={{ padding:'1.5rem 1.75rem 1.75rem', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
      <h3 style={{ fontSize:'1.15rem', fontWeight:800, color:C.text, margin:0, lineHeight:1.25 }}>{title}</h3>
      <p style={{ fontSize:'0.85rem', color:C.muted, lineHeight:1.6, margin:0, flex:1 }}>{excerpt}</p>
      <span style={{ fontSize:'0.85rem', fontWeight:700, color:C.teal, marginTop:6 }}>Read More →</span>
    </div>
  </Link>
);

const PARA_LOGO = (
  <span style={{ fontSize:'4.5rem', fontWeight:900, color:C.teal, letterSpacing:'-0.04em', opacity:0.8, fontFamily:'system-ui,sans-serif' }}>PARA</span>
);

const articles = [
  {
    thumb: PARA_LOGO,
    title: 'Parasites in Tropical Australia – What You Need to Know',
    excerpt: 'Living in Queensland or tropical regions? Find out which parasites are actually common, what the real risk factors are, and when to take action.',
    href: '/resources/tropical-australia-parasites',
  },
  {
    thumb: <AiIcon />,
    title: 'AI vs Traditional Lab Testing for Parasites',
    excerpt: 'How does an AI visual assessment compare to stool microscopy or PCR testing? What each method is good for — and what they can\'t do.',
    href: '/resources/ai-vs-lab-testing',
  },
  {
    thumb: PARA_LOGO,
    title: 'When Should You Worry About Parasites? (And When Not To)',
    excerpt: 'Most things in your stool are not parasites. Here\'s a calm, evidence-based guide to knowing when concern is warranted — and when it isn\'t.',
    href: '/resources/when-to-worry-about-parasites',
  },
];

const ResourcesPage = () => {
  return (
    <>
      <Helmet>
        <title>Resources & Guides – Parasite Education for Australians | notworms.com</title>
        <meta name="description" content="Evidence-based guides on parasites in Australia — tropical risks, AI analysis, and when to see your GP. Educational content only." />
        <link rel="canonical" href="https://notworms.com/resources" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div style={{ background:C.bg, minHeight:'100vh', fontFamily:'"DM Sans","Inter",system-ui,sans-serif', padding:'clamp(2.5rem,5vw,4rem) clamp(1rem,4vw,2.5rem)' }}>
        <div style={{ maxWidth:1080, margin:'0 auto', position:'relative' }}>

          {/* PARA watermark — top right */}
          <div style={{ position:'absolute', top:'-1rem', right:'-0.5rem', width:'clamp(180px,22vw,280px)', height:'clamp(220px,28vw,340px)', pointerEvents:'none' }}>
            <ParaSketch />
          </div>

          {/* Heading */}
          <h1 style={{ fontSize:'clamp(2.4rem,5.5vw,4rem)', fontWeight:900, color:C.text, letterSpacing:'-0.03em', margin:'0 0 clamp(2rem,4vw,3.5rem)', lineHeight:1.05, position:'relative', zIndex:1, maxWidth:600 }}>
            Resources &amp; Guides
          </h1>

          {/* Cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'clamp(1rem,2.5vw,1.75rem)' }}>
            {articles.map(a => <ResourceCard key={a.href} {...a} />)}
          </div>

          {/* Footer note */}
          <p style={{ textAlign:'center', fontSize:'0.78rem', color:C.text, opacity:0.5, marginTop:'3rem', lineHeight:1.6 }}>
            ⚠️ All content is educational only and does not constitute medical advice. Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </>
  );
};

export default ResourcesPage;
