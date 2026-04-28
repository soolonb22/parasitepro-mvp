// @ts-nocheck
import React, { useState } from 'react';

const C = {
  pageBg: '#F2F7F4', teal: '#00BFA5', tealDark: '#008B7A', tealSoft: '#E1F8F4',
  navy: '#1A365D', border: '#C8E6D8', gray: '#6B7280', white: '#FFFFFF',
};

const FAQS = [
  {
    q: "What actually happens to my photos?",
    a: "Your images are uploaded over encrypted HTTPS, processed by our AI model, then stored on Cloudinary's secure Australian infrastructure. We never share them with third parties, never use them for advertising, and you can request deletion any time from your account settings. Photos are used solely to generate your educational report.",
  },
  {
    q: "Is this a medical diagnosis?",
    a: "No — and we're transparent about that throughout the app. ParasitePro generates structured educational reports that identify visual patterns and help you prepare for a GP appointment. Every report clearly states it is not a substitute for professional medical advice. Think of it as going into your appointment informed rather than going in blind.",
  },
  {
    q: "What if my GP disagrees with the report?",
    a: "Your GP's clinical judgment always takes precedence — full stop. The report exists to start the conversation, not to replace it. If your doctor has a different view, that's the right outcome. Our job is to help you ask better questions and understand what you're looking at.",
  },
  {
    q: "Can I use it for my kids or pets?",
    a: "Yes to both. We have a lot of Queensland parents using the app for pinworm and threadworm concerns in kids, and pet owners checking samples for zoonotic risk (worms that can transfer from animals to humans). The educational report works the same way — visual pattern analysis with GP prep notes.",
  },
  {
    q: "Is this legal in Australia?",
    a: "Yes. ParasitePro is designed and operated as an educational software tool, not a medical device. We comply with TGA Software as a Medical Device guidelines by clearly positioning all output as educational and non-diagnostic. We also follow AHPRA advertising standards — you won't see us making clinical claims we can't substantiate.",
  },
  {
    q: "How accurate is the AI?",
    a: "We don't publish a single accuracy percentage because it varies significantly by image quality, sample type, and organism. What we do show is a confidence score on every individual analysis based on image clarity, pattern specificity, and how well the visual evidence correlates with reported symptoms. Lower confidence = the report says so plainly.",
  },
  {
    q: "I live in rural Queensland — can I still use this?",
    a: "This is actually one of the main reasons we built it. If you're 3 hours from the nearest GP or specialist, knowing whether something warrants that trip — or can wait for your next in-town visit — has real value. Several regional QLD residents are regular users for exactly this reason.",
  },
  {
    q: "Do the credits expire?",
    a: "Never. Once you buy credits, they're yours. The wet season in Queensland doesn't follow a subscription billing cycle, and neither should your peace of mind. Buy when you need them, use them whenever.",
  },
];

const FAQItem = ({ q, a, open, onToggle }) => (
  <div style={{ borderBottom:`1px solid ${C.border}` }}>
    <button
      onClick={onToggle}
      style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:16, padding:'1.1rem 0', background:'none', border:'none', cursor:'pointer', textAlign:'left',
      }}
    >
      <span style={{ fontWeight:600, fontSize:'0.95rem', color:C.navy, lineHeight:1.4 }}>{q}</span>
      <span style={{
        width:24, height:24, borderRadius:'50%', background: open ? C.teal : C.tealSoft,
        border:`1.5px solid ${open ? C.teal : C.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: open ? 'white' : C.tealDark, fontSize:'1rem', fontWeight:700, flexShrink:0,
        transition:'all 0.18s',
      }}>
        {open ? '−' : '+'}
      </span>
    </button>
    {open && (
      <div style={{ paddingBottom:'1.1rem' }}>
        <p style={{ margin:0, fontSize:'0.9rem', color:'#334155', lineHeight:1.7 }}>{a}</p>
      </div>
    )}
  </div>
);

export default function HomepageFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section style={{ background:'white', padding:'clamp(3rem,8vw,5rem) clamp(1rem,4vw,2rem)', borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:780, margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:'clamp(2rem,5vw,3rem)' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:C.tealSoft, border:`1.5px solid ${C.border}`,
            borderRadius:99, padding:'5px 16px',
            fontSize:'0.8rem', fontWeight:600, color:C.tealDark, marginBottom:'1rem',
          }}>
            ❓ Common questions
          </div>
          <h2 style={{
            fontSize:'clamp(1.75rem,4vw,2.4rem)', fontWeight:800,
            color:C.navy, lineHeight:1.15, letterSpacing:'-0.025em', margin:'0 0 0.75rem',
          }}>
            Things people ask before their first analysis
          </h2>
          <p style={{ color:C.gray, fontSize:'clamp(0.9rem,2vw,1rem)', maxWidth:480, margin:'0 auto', lineHeight:1.6 }}>
            Privacy, accuracy, legality, kids, pets, rural Queensland — covered.
          </p>
        </div>

        <div style={{ background:C.pageBg, borderRadius:20, border:`1.5px solid ${C.border}`, padding:'0 1.5rem' }}>
          {FAQS.map((f, i) => (
            <FAQItem
              key={i} q={f.q} a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.83rem', color:C.gray }}>
          Still have questions?{' '}
          <a href="/contact" style={{ color:C.tealDark, fontWeight:600, textDecoration:'none' }}>Contact us</a>
          {' '}or{' '}
          <a href="/chat" style={{ color:C.tealDark, fontWeight:600, textDecoration:'none' }}>chat with PARA</a>.
        </p>
      </div>
    </section>
  );
}
