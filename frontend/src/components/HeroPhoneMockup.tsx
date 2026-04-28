// @ts-nocheck
import React from 'react';

// Inline phone mockup showing a result card — no external dependencies
export default function HeroPhoneMockup({ style = {} }) {
  return (
    <div style={{
      position:'relative', width:'min(260px,42vw)',
      filter:'drop-shadow(0 24px 48px rgba(15,39,51,0.35))',
      ...style,
    }}>
      {/* Phone shell */}
      <div style={{
        background:'#1A2733', borderRadius:36, padding:'10px 8px',
        border:'2px solid rgba(255,255,255,0.12)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Notch */}
        <div style={{ width:60, height:16, background:'#0F1B24', borderRadius:99, margin:'0 auto 8px', position:'relative', zIndex:2 }}/>

        {/* Screen content */}
        <div style={{ background:'#F2F7F4', borderRadius:26, overflow:'hidden', padding:'12px 10px' }}>

          {/* App header */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:'#0d9488', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:'0.65rem' }}>P</div>
            <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#1A365D' }}>notworms.com</span>
            <div style={{ marginLeft:'auto', background:'#DCFCE7', borderRadius:99, padding:'2px 6px' }}>
              <span style={{ fontSize:'0.55rem', fontWeight:700, color:'#166534' }}>✓ Ready</span>
            </div>
          </div>

          {/* Specimen thumbnail */}
          <div style={{ background:'linear-gradient(135deg,#A8D5BA,#C8E6D8)', borderRadius:12, height:68, marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
            <span style={{ fontSize:'2rem' }}>🧫</span>
            {/* Detection ring */}
            <div style={{ position:'absolute', top:'30%', left:'55%', width:18, height:18, border:'2px solid #00BFA5', borderRadius:'50%', animation:'phone-ping 2s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', bottom:'25%', left:'30%', width:13, height:13, border:'2px solid #F59E0B', borderRadius:'50%', animation:'phone-ping 2.4s ease-in-out infinite 0.4s' }}/>
            <style>{`@keyframes phone-ping{0%,100%{transform:scale(1);opacity:0.9}50%{transform:scale(1.7);opacity:0.2}}`}</style>
          </div>

          {/* Sample disclaimer label */}
          <div style={{ background:'#FFF3CD', border:'1px solid #FFC107', borderRadius:6, padding:'3px 7px', marginBottom:8, textAlign:'center' }}>
            <span style={{ fontSize:'0.52rem', fontWeight:700, color:'#856404', textTransform:'uppercase', letterSpacing:'0.04em' }}>Sample report only — educational output</span>
          </div>

          {/* Confidence row */}
          <div style={{ display:'flex', gap:6, marginBottom:8 }}>
            <div style={{ flex:1, background:'#FEF3C7', borderRadius:8, padding:'5px 7px' }}>
              <div style={{ fontSize:'0.55rem', color:'#92400E', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' }}>Urgency</div>
              <div style={{ fontSize:'0.75rem', fontWeight:800, color:'#92400E' }}>Moderate</div>
            </div>
            <div style={{ flex:1, background:'#E1F8F4', borderRadius:8, padding:'5px 7px' }}>
              <div style={{ fontSize:'0.55rem', color:'#008B7A', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' }}>Pattern Match</div>
              <div style={{ fontSize:'0.75rem', fontWeight:800, color:'#008B7A' }}>High</div>
            </div>
          </div>

          {/* Findings */}
          <div style={{ background:'white', borderRadius:10, padding:'8px 9px', marginBottom:8 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#1A365D', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.04em' }}>Visual patterns found</div>
            {['Morphology A — high similarity','Morphology B — moderate similarity'].map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#0d9488', flexShrink:0 }}/>
                <span style={{ fontSize:'0.62rem', color:'#334155' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* GP questions preview */}
          <div style={{ background:'#EBF5EE', borderRadius:10, padding:'7px 9px', marginBottom:8 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#1A365D', marginBottom:4 }}>📋 5 GP prep questions</div>
            <div style={{ fontSize:'0.6rem', color:'#334155', lineHeight:1.4, opacity:0.8 }}>"Can we test for Giardia and hookworm specifically?…"</div>
          </div>

          {/* PDF button */}
          <div style={{ background:'#1A365D', borderRadius:10, padding:'7px 9px', textAlign:'center' }}>
            <span style={{ fontSize:'0.65rem', fontWeight:700, color:'white' }}>📄 Download PDF for GP</span>
          </div>

        </div>

        {/* Home bar */}
        <div style={{ width:50, height:4, background:'rgba(255,255,255,0.3)', borderRadius:99, margin:'8px auto 0' }}/>
      </div>

      {/* Floating badge */}
      <div style={{
        position:'absolute', top:-10, right:-12,
        background:'#0d9488', color:'white', borderRadius:12,
        padding:'5px 10px', fontSize:'0.65rem', fontWeight:700,
        boxShadow:'0 4px 12px rgba(13,148,136,0.4)',
        whiteSpace:'nowrap',
      }}>
        ⚡ 60 sec result
      </div>
    </div>
  );
}
