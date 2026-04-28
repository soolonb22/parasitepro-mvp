// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const C = {
  pageBg: '#F2F7F4', teal: '#00BFA5', tealDark: '#008B7A', tealSoft: '#E1F8F4',
  navy: '#1A365D', border: '#C8E6D8', gray: '#6B7280', white: '#FFFFFF',
  amber: '#F59E0B', red: '#EF4444', orange: '#F97316',
};

const UrgencyBadge = ({ level }) => {
  const colours = {
    Low:      { bg:'#DCFCE7', text:'#166534', dot:'#22C55E' },
    Moderate: { bg:'#FEF3C7', text:'#92400E', dot:'#F59E0B' },
    High:     { bg:'#FEE2E2', text:'#991B1B', dot:'#EF4444' },
  };
  const c = colours[level] || colours.Moderate;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:99, background:c.bg, color:c.text, fontSize:'0.8rem', fontWeight:700 }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background:c.dot, display:'inline-block' }}/>
      {level} urgency
    </span>
  );
};

const ConfidenceBar = ({ pct, label }) => (
  <div style={{ marginBottom:'0.75rem' }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
      <span style={{ fontSize:'0.83rem', color:C.navy, fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'0.83rem', fontWeight:700, color:C.tealDark }}>{pct}%</span>
    </div>
    <div style={{ height:8, borderRadius:99, background:'#E2E8F0', overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${pct}%`, borderRadius:99, background:`linear-gradient(90deg, ${C.teal}, ${C.tealDark})`, transition:'width 0.8s ease' }} />
    </div>
  </div>
);

const Section = ({ title, icon, children, accent = C.tealSoft }) => (
  <div style={{ background:accent, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.5rem', marginBottom:'1.25rem' }}>
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem' }}>
      <span style={{ fontSize:'1.1rem' }}>{icon}</span>
      <h3 style={{ margin:0, fontSize:'0.95rem', fontWeight:700, color:C.navy }}>{title}</h3>
    </div>
    {children}
  </div>
);

const GPQuestion = ({ q, i }) => (
  <div style={{ display:'flex', gap:10, padding:'0.65rem 0', borderBottom:`1px solid ${C.border}` }}>
    <span style={{ background:C.teal, color:'white', width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, flexShrink:0, marginTop:1 }}>{i}</span>
    <p style={{ margin:0, fontSize:'0.875rem', color:'#334155', lineHeight:1.55 }}>{q}</p>
  </div>
);

export default function SampleReportPage() {
  const [pdfClicked, setPdfClicked] = useState(false);

  return (
    <div style={{ background:C.pageBg, minHeight:'100vh', fontFamily:'"Inter","DM Sans",system-ui,sans-serif' }}>
      <SEO
        title="Sample AI Analysis Report — notworms.com"
        description="See exactly what a ParasitePro educational analysis report looks like — visual pattern findings, confidence levels, urgency classification, and GP prep notes."
        canonical="/sample-report"
      />

      <div style={{ maxWidth:860, margin:'0 auto', padding:'clamp(1.5rem,4vw,3rem) clamp(1rem,3vw,1.5rem)' }}>

        {/* ── Banner ── */}
        <div style={{ background:'#FEF3C7', border:'1.5px solid #FDE68A', borderRadius:12, padding:'0.75rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:'1rem' }}>👁️</span>
          <p style={{ margin:0, fontSize:'0.83rem', color:'#92400E', lineHeight:1.5 }}>
            <strong>This is a sample report only.</strong> All case details are fictional and for demonstration purposes. Not a real analysis — not medical advice.
          </p>
        </div>

        {/* ── Header ── */}
        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:20, padding:'clamp(1.5rem,4vw,2rem)', marginBottom:'1.25rem' }}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'1.25rem' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:C.teal, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:'1rem' }}>P</div>
                <span style={{ fontWeight:700, fontSize:'0.95rem', color:C.navy }}>notworms.com</span>
              </div>
              <h1 style={{ margin:'0 0 4px', fontSize:'clamp(1.3rem,3vw,1.6rem)', fontWeight:800, color:C.navy, letterSpacing:'-0.02em' }}>Educational Analysis Report</h1>
              <p style={{ margin:0, fontSize:'0.82rem', color:C.gray }}>Case ref: DEMO-2026-QLD-004 · Post-travel gastrointestinal concern · Queensland, AU</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
              <UrgencyBadge level="Moderate" />
              <span style={{ fontSize:'0.75rem', color:C.gray }}>Processed: 2 Apr 2026, 09:14 AEST</span>
            </div>
          </div>

          {/* Confidence score */}
          <div style={{ background:C.tealSoft, borderRadius:12, padding:'1rem 1.25rem', display:'flex', flexWrap:'wrap', gap:'1.5rem', alignItems:'center' }}>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'0.75rem', fontWeight:600, color:C.tealDark, textTransform:'uppercase', letterSpacing:'0.06em' }}>Overall confidence</p>
              <p style={{ margin:0, fontSize:'2.2rem', fontWeight:800, color:C.tealDark, lineHeight:1 }}>87%</p>
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <ConfidenceBar pct={87} label="Image quality assessment" />
              <ConfidenceBar pct={79} label="Morphological pattern match" />
              <ConfidenceBar pct={92} label="Symptom–finding correlation" />
            </div>
          </div>
        </div>

        {/* ── Sample images ── */}
        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:20, padding:'clamp(1.25rem,3vw,1.75rem)', marginBottom:'1.25rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.95rem', fontWeight:700, color:C.navy }}>🔬 Submitted sample</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
            {/* Simulated specimen card */}
            <div style={{ borderRadius:14, overflow:'hidden', border:`1.5px solid ${C.border}`, position:'relative' }}>
              <div style={{ background:'linear-gradient(135deg,#c8e6d8,#a8d5ba)', height:160, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', position:'relative' }}>
                🧫
                {/* AI detection rings */}
                <div style={{ position:'absolute', top:'35%', left:'42%', width:32, height:32, borderRadius:'50%', border:'2.5px solid #00BFA5', animation:'ping 2s ease-in-out infinite', opacity:0.8 }}/>
                <div style={{ position:'absolute', top:'55%', left:'28%', width:22, height:22, borderRadius:'50%', border:'2.5px solid #F59E0B', animation:'ping 2.4s ease-in-out infinite 0.4s', opacity:0.8 }}/>
              </div>
              <div style={{ padding:'0.6rem 0.75rem', background:C.white }}>
                <p style={{ margin:0, fontSize:'0.75rem', fontWeight:600, color:C.navy }}>Stool specimen — Day 6 post-return</p>
                <p style={{ margin:'2px 0 0', fontSize:'0.7rem', color:C.gray }}>Bali, Indonesia travel history</p>
              </div>
            </div>
            <div style={{ borderRadius:14, overflow:'hidden', border:`1.5px solid ${C.border}` }}>
              <div style={{ background:'linear-gradient(135deg,#e0f2fe,#bae6fd)', height:160, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', position:'relative' }}>
                🔭
                <div style={{ position:'absolute', top:'40%', left:'50%', width:28, height:28, borderRadius:'50%', border:'2.5px solid #00BFA5', animation:'ping 1.8s ease-in-out infinite 0.2s', opacity:0.8 }}/>
              </div>
              <div style={{ padding:'0.6rem 0.75rem', background:C.white }}>
                <p style={{ margin:0, fontSize:'0.75rem', fontWeight:600, color:C.navy }}>Enhanced image — AI-processed</p>
                <p style={{ margin:'2px 0 0', fontSize:'0.7rem', color:C.gray }}>Contrast boosted for analysis</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.6);opacity:0.2} }`}</style>

        {/* ── PARA summary ── */}
        <div style={{ background:'linear-gradient(135deg,#2D5A55,#1B3A35)', borderRadius:20, padding:'clamp(1.25rem,3vw,1.75rem)', marginBottom:'1.25rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(0,191,165,0.12)', pointerEvents:'none' }}/>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', position:'relative', zIndex:1 }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(0,191,165,0.2)', border:'2px solid rgba(0,191,165,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>🌿</div>
            <div>
              <p style={{ margin:'0 0 4px', fontSize:'0.75rem', fontWeight:700, color:'rgba(0,191,165,0.9)', textTransform:'uppercase', letterSpacing:'0.08em' }}>PARA's educational summary</p>
              <p style={{ margin:0, fontSize:'0.93rem', color:'rgba(255,255,255,0.9)', lineHeight:1.65 }}>
                G'day — based on what I can see in your images and the symptoms you described, there are a couple of visual patterns worth discussing with your GP. 
                The specimen shows elongated structures consistent with helminth eggs, and your post-travel timeline from Bali makes this worth investigating promptly. 
                This isn't a diagnosis — but the findings below should give your doctor something concrete to work with. Moderate urgency means see your GP within a few days, not tonight at emergency.
              </p>
            </div>
          </div>
        </div>

        {/* ── Morphological findings ── */}
        <Section title="Morphological observations" icon="🔍" accent={C.tealSoft}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.75rem' }}>
            {[
              { label:'Structure type', value:'Elongated oval bodies', highlight:true },
              { label:'Approximate size', value:'55–65 µm (estimated)', highlight:false },
              { label:'Shell appearance', value:'Thin-walled, smooth', highlight:true },
              { label:'Internal detail', value:'Segmented contents visible', highlight:false },
              { label:'Colour range', value:'Golden-brown hue', highlight:false },
              { label:'Quantity observed', value:'Multiple (3–5 in frame)', highlight:true },
            ].map(f => (
              <div key={f.label} style={{ background: f.highlight ? 'rgba(0,191,165,0.12)' : C.white, borderRadius:10, padding:'0.75rem', border:`1px solid ${C.border}` }}>
                <p style={{ margin:'0 0 3px', fontSize:'0.72rem', color:C.gray, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.label}</p>
                <p style={{ margin:0, fontSize:'0.875rem', fontWeight:600, color:C.navy }}>{f.value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Differential visual patterns ── */}
        <Section title="Differential visual patterns" icon="⚖️" accent="#FFFBEB">
          <p style={{ margin:'0 0 1rem', fontSize:'0.83rem', color:C.gray, lineHeight:1.5 }}>
            The following patterns are visually consistent with the specimen. This is not a diagnosis — laboratory testing is required for confirmation.
          </p>
          {[
            { name:'Hookworm (Ancylostoma duodenale)', match:71, note:'Consistent egg morphology. Common in returned Bali travellers.', tag:'Discuss with GP' },
            { name:'Giardia lamblia cysts', match:58, note:'Oval cyst structure possible. Symptom profile aligns.', tag:'Request stool PCR' },
            { name:'Ascaris lumbricoides', match:34, note:'Some morphological overlap. Less likely given size range.', tag:'Lower priority' },
          ].map((d, i) => (
            <div key={i} style={{ background:C.white, borderRadius:12, padding:'0.9rem 1rem', marginBottom:'0.6rem', border:`1.5px solid ${C.border}` }}>
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:'0.875rem', color:C.navy }}>{d.name}</span>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:'0.75rem', background:C.tealSoft, color:C.tealDark, padding:'2px 8px', borderRadius:99, fontWeight:600 }}>{d.tag}</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:C.tealDark }}>{d.match}% match</span>
                </div>
              </div>
              <div style={{ height:6, borderRadius:99, background:'#E2E8F0', overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', width:`${d.match}%`, borderRadius:99, background:d.match > 60 ? C.teal : d.match > 40 ? C.amber : C.gray }} />
              </div>
              <p style={{ margin:0, fontSize:'0.8rem', color:C.gray, lineHeight:1.45 }}>{d.note}</p>
            </div>
          ))}
        </Section>

        {/* ── GP prep questions ── */}
        <Section title="Questions to bring to your GP" icon="📋" accent="#F0FDF4">
          <p style={{ margin:'0 0 0.75rem', fontSize:'0.83rem', color:C.gray }}>Based on the visual findings and your travel history, these are worth raising directly:</p>
          {[
            '"I returned from Bali 6 days ago and I\'ve had loose stools since day 3 — can we test for Giardia and hookworm specifically?"',
            '"Can we do a stool PCR or ova & parasite exam? I have a report from an AI educational tool that identified visual patterns."',
            '"Should I be concerned about passing anything to family members while we wait for results?"',
            '"What are the first-line treatment options if hookworm or Giardia is confirmed?"',
            '"Are there any foods or activities I should avoid until this is resolved?"',
          ].map((q, i) => <GPQuestion key={i} q={q} i={i + 1} />)}
        </Section>

        {/* ── Urgency classification ── */}
        <Section title="Urgency classification" icon="🚦" accent="#FFFBEB">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'0.75rem' }}>
            {[
              { level:'Low', desc:'Monitor at home, see GP at next convenience', active:false, color:'#DCFCE7', textColor:'#166534' },
              { level:'Moderate', desc:'See your GP within 2–3 days. Not emergency.', active:true, color:'#FEF3C7', textColor:'#92400E' },
              { level:'High', desc:'Same-day GP or urgent care appointment', active:false, color:'#FEE2E2', textColor:'#991B1B' },
            ].map(u => (
              <div key={u.level} style={{ borderRadius:12, padding:'1rem', border: u.active ? `2px solid ${C.amber}` : `1.5px solid ${C.border}`, background: u.active ? u.color : C.white, opacity: u.active ? 1 : 0.5, position:'relative' }}>
                {u.active && <span style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:C.amber, color:'white', fontSize:'0.65rem', fontWeight:700, padding:'2px 10px', borderRadius:99, whiteSpace:'nowrap' }}>THIS RESULT</span>}
                <p style={{ margin:'0 0 4px', fontWeight:800, fontSize:'0.95rem', color: u.active ? u.textColor : C.gray }}>{u.level}</p>
                <p style={{ margin:0, fontSize:'0.75rem', color: u.active ? u.textColor : C.gray, lineHeight:1.4 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Report actions ── */}
        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:20, padding:'clamp(1.25rem,3vw,1.75rem)', marginBottom:'2rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.95rem', fontWeight:700, color:C.navy }}>📤 Export & share</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.75rem' }}>
            <button
              onClick={() => { setPdfClicked(true); setTimeout(()=>setPdfClicked(false),2000); }}
              style={{ padding:'0.9rem 1rem', borderRadius:12, background:C.navy, color:'white', border:'none', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', transition:'all 0.15s', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}
            >
              <span style={{ fontSize:'1.2rem' }}>📄</span>
              <div>
                <div>{pdfClicked ? '✓ Downloading...' : 'Download PDF Report'}</div>
                <div style={{ fontSize:'0.7rem', opacity:0.75, fontWeight:400 }}>For My Health Record or GP</div>
              </div>
            </button>
            <button
              style={{ padding:'0.9rem 1rem', borderRadius:12, background:C.tealSoft, color:C.tealDark, border:`1.5px solid ${C.border}`, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}
            >
              <span style={{ fontSize:'1.2rem' }}>🏥</span>
              <div>
                <div>Add to My Health Record</div>
                <div style={{ fontSize:'0.7rem', opacity:0.75, fontWeight:400 }}>Australian government record</div>
              </div>
            </button>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ background:'linear-gradient(135deg,#0F2733,#1B3A35)', borderRadius:20, padding:'clamp(1.5rem,4vw,2.5rem)', textAlign:'center', marginBottom:'2rem' }}>
          <p style={{ margin:'0 0 6px', fontSize:'0.8rem', fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.08em' }}>Get your own report</p>
          <h2 style={{ margin:'0 0 0.75rem', fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:800, color:'white', letterSpacing:'-0.025em' }}>
            Found something that concerns you?
          </h2>
          <p style={{ margin:'0 0 1.5rem', fontSize:'0.93rem', color:'rgba(255,255,255,0.75)', lineHeight:1.6, maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>
            Upload a photo and get a full structured educational report in under 60 seconds. First analysis is free — no credit card needed.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <Link to="/signup?promo=BETA3FREE" style={{ padding:'0.9rem 2rem', borderRadius:14, background:C.teal, color:'white', fontWeight:700, fontSize:'0.95rem', textDecoration:'none', display:'inline-block', transition:'all 0.15s' }}>
              Start free analysis →
            </Link>
            <Link to="/pricing" style={{ padding:'0.9rem 1.5rem', borderRadius:14, background:'rgba(255,255,255,0.1)', color:'white', fontWeight:600, fontSize:'0.875rem', textDecoration:'none', border:'1.5px solid rgba(255,255,255,0.2)', display:'inline-block' }}>
              View pricing
            </Link>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:'0.72rem', color:C.gray, lineHeight:1.6, maxWidth:560, margin:'0 auto' }}>
          ParasitePro is an educational tool only and does not constitute medical advice, diagnosis, or treatment.
          Always consult a qualified healthcare professional. In an emergency, call 000.
        </p>
      </div>
    </div>
  );
}
