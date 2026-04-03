// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const C = { bg:'#8AADA6', text:'#0F2733', teal:'#1B6B5F', muted:'#4A6B62', card:'rgba(255,255,255,0.85)' };

const ResourceAiVsLabPage = () => (
  <>
    <Helmet>
      <title>AI vs Traditional Lab Testing for Parasites | notworms.com</title>
      <meta name="description" content="How does AI visual analysis compare to stool microscopy, PCR, or serology? An honest comparison of each method — what they can and can't do." />
      <meta name="keywords" content="AI parasite detection, stool microscopy Australia, parasite PCR test, parasite testing methods, AI vs lab testing, digital pathology parasites" />
      <link rel="canonical" href="https://notworms.com/resources/ai-vs-lab-testing" />
      <meta property="og:title" content="AI vs Traditional Lab Testing for Parasites – An Honest Comparison" />
      <meta property="og:url" content="https://notworms.com/resources/ai-vs-lab-testing" />
      <meta name="robots" content="index, follow" />
    </Helmet>

    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:'"DM Sans","Inter",system-ui,sans-serif' }}>
      <div style={{ padding:'1rem 1.5rem', fontSize:'0.78rem', color:C.text, opacity:0.6 }}>
        <Link to="/resources" style={{ color:C.teal, textDecoration:'none', fontWeight:600 }}>← Resources</Link>
        {' '}&nbsp;/&nbsp; AI vs Lab Testing
      </div>

      <article style={{ maxWidth:760, margin:'0 auto', padding:'0 1.5rem 4rem' }}>

        <div style={{ background:C.card, borderRadius:16, padding:'2rem 2.5rem', marginBottom:'1.5rem', backdropFilter:'blur(8px)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:C.teal, margin:'0 0 0.75rem' }}>EDUCATIONAL GUIDE</p>
          <h1 style={{ fontSize:'clamp(1.75rem,4vw,2.6rem)', fontWeight:900, color:C.text, lineHeight:1.1, letterSpacing:'-0.025em', margin:'0 0 1rem' }}>
            AI vs Traditional Lab Testing for Parasites
          </h1>
          <p style={{ fontSize:'1.05rem', color:C.muted, lineHeight:1.65, margin:0 }}>
            People often ask: "Can't AI just tell me what I have?" The honest answer is: AI can be a useful first step — but it's very different from clinical laboratory testing. Here's what each method actually does, and when each one matters.
          </p>
        </div>

        {/* Comparison table */}
        <div style={{ background:C.card, borderRadius:14, padding:'1.75rem 2rem', marginBottom:'1rem', overflow:'auto' }}>
          <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:C.text, margin:'0 0 1rem' }}>Quick comparison</h2>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.82rem' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid rgba(27,107,95,0.3)' }}>
                {['Method','Cost (approx)','Speed','What it can detect','Limitations'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 10px', color:C.teal, fontWeight:700, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['AI visual analysis (like notworms.com)','Free first / $3.50','Seconds','Visual patterns suggesting parasites or other causes','Educational only — cannot diagnose; no physical sample needed'],
                ['Stool microscopy (OCP)','~$30–60 Medicare','1–3 days','Ova, cysts, parasites in stool sample','Misses low-burden infections; requires careful lab technique; single sample may miss intermittent shedding'],
                ['Stool PCR (multiplex)','~$80–150','1–3 days','DNA of Giardia, Crypto, worms, bacteria with high sensitivity','More expensive; not always bulk-billed; available through specialist labs'],
                ['Blood serology','~$40–100 per test','1–3 days','Antibodies to Strongyloides, Toxocara, hydatid, etc.','Detects exposure, not active infection; can cross-react; some parasites do not generate detectable antibodies'],
                ['Endoscopy / imaging','$300–1500+','Days–weeks','Tissue-level parasites (Giardia in duodenum, hydatid cyst)','Invasive; only for specific clinical scenarios'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom:'1px solid rgba(0,0,0,0.06)', background: i%2===0 ? 'transparent' : 'rgba(27,107,95,0.04)' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding:'9px 10px', color: j===0 ? C.text : C.muted, fontWeight: j===0 ? 700 : 400, lineHeight:1.45, verticalAlign:'top' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {[
          {
            heading: 'What AI visual analysis is actually good for',
            body: `AI tools like notworms.com analyse photos of stool, skin, or other samples to identify visual patterns consistent with parasites or common mimics. This kind of tool is good at:

- **Helping you decide whether to see a GP** — if the AI flags something worth investigating, that's useful. If it doesn't, you may be reassured — but a negative result doesn't rule out infection.
- **Helping you prepare for a GP appointment** — a structured report gives you something concrete to discuss rather than vague anxiety
- **Identifying common false alarms** — many things that look like worms aren't (mucus, undigested food, plant fibres, medication residue)
- **Fast triage** — results in under a minute, available 24/7, no appointment needed

What it cannot do: provide a diagnosis, replace laboratory testing, or guide treatment.`,
          },
          {
            heading: 'When you actually need lab testing',
            body: `AI is a starting point. Lab testing is necessary when:

- **Symptoms persist beyond 2 weeks** — diarrhoea, cramping, bloating, or unexplained weight loss warrant proper investigation
- **You've been in a high-risk environment** — remote Australia, overseas travel, freshwater swimming, contact with infected animals
- **You're immunocompromised** — Strongyloides and Crypto can be life-threatening in people on steroids, chemotherapy, or with HIV
- **Your GP needs to prescribe antiparasitic medication** — this requires a confirmed diagnosis

If you're going to a GP, it's worth requesting OCP (ova, cysts, and parasites) on at least **3 samples on separate days** — single stool samples miss a lot. For Giardia and Crypto specifically, ask about PCR testing.`,
          },
          {
            heading: 'Why stool microscopy misses things',
            body: `Traditional OCP stool microscopy is still widely used but has real limitations. The lab technician must physically spot parasite eggs, cysts or larvae under a microscope — this depends on:

- **Parasite load** — light infections shed fewer organisms and may be missed
- **Sample timing** — some parasites shed intermittently; a single sample on a bad day will be negative
- **Lab skill and equipment** — quality varies between labs
- **Preservation** — sample must be handled and stored correctly

PCR testing overcomes most of these by detecting parasite DNA rather than relying on visual identification. It's more sensitive for Giardia and Cryptosporidium in particular. The downside is cost and availability.`,
          },
          {
            heading: 'The honest role of AI in parasite detection',
            body: `AI image recognition tools are improving rapidly, but no current consumer-grade AI tool can reliably diagnose parasitic infection from a photo. That includes notworms.com. What we offer is:

- **Visual pattern recognition** — the AI has been trained on thousands of specimen images to identify visual features consistent with various parasites
- **Structured educational output** — a report framed around what you might want to discuss with a GP
- **Differential analysis** — not just "this looks like X" but "here's what else it could be and why"

The value is getting you to the right conversation faster, with better information. The diagnosis and treatment decision always belongs to a clinician.`,
          },
        ].map(({ heading, body }) => (
          <div key={heading} style={{ background:C.card, borderRadius:14, padding:'1.75rem 2rem', marginBottom:'1rem', backdropFilter:'blur(6px)' }}>
            <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:C.text, margin:'0 0 0.75rem' }}>{heading}</h2>
            {body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize:'0.9rem', color:C.muted, lineHeight:1.7, margin:'0 0 0.75rem' }}
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g,'<strong style="color:#0F2733">$1</strong>').replace(/\n/g,'<br/>') }}/>
            ))}
          </div>
        ))}

        <div style={{ background:'rgba(27,107,95,0.15)', border:'1.5px solid rgba(27,107,95,0.4)', borderRadius:14, padding:'1.5rem 2rem', marginBottom:'1.5rem' }}>
          <p style={{ fontWeight:800, color:C.text, margin:'0 0 0.5rem', fontSize:'1rem' }}>Want a structured starting point?</p>
          <p style={{ fontSize:'0.85rem', color:C.muted, margin:'0 0 1rem' }}>Upload a photo and get an educational report to take to your GP — no diagnosis, just organised information.</p>
          <Link to="/signup" style={{ display:'inline-block', background:C.teal, color:'white', padding:'11px 24px', borderRadius:10, fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>
            Start Free Analysis →
          </Link>
        </div>

        <p style={{ fontSize:'0.75rem', color:C.text, opacity:0.5, lineHeight:1.6, textAlign:'center' }}>
          ⚠️ Educational only. Not medical advice. Consult a qualified healthcare professional for testing, diagnosis and treatment.
        </p>
      </article>
    </div>
  </>
);

export default ResourceAiVsLabPage;
