// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock } from 'lucide-react';

const SeoGiardiaPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet>
        <title>Giardia Symptoms in Australia — What to Look For | ParasitePro</title>
        <meta name="description" content="Learn about giardia symptoms in Australia, how it's contracted, what it looks like in stool, and what to do next. Calm educational guide for Australians." />
        <meta name="keywords" content="giardia symptoms Australia, giardia infection Australia, giardia in stool, giardia water Australia, giardia diarrhoea, giardia intestinalis Australia, giardia treatment" />
        <link rel="canonical" href="https://notworms.com/giardia-symptoms-australia" />
        <meta property="og:title" content="Giardia Symptoms in Australia — Educational Guide" />
        <meta property="og:description" content="Learn about giardia symptoms in Australia, how it's contracted, what it looks like in stool, and what to do next. Calm educational guide for Australians." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://notworms.com/giardia-symptoms-australia" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Giardia Symptoms in Australia — Educational Guide" />
        <meta name="twitter:description" content="Learn about giardia symptoms in Australia, how it's contracted, what it looks like in stool, and what to do next. Calm educational guide for Australians." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ParasitePro" />
      </Helmet>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', color: 'white', padding: '5rem 1rem 4rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Shield size={48} style={{ opacity: 0.9 }} />
            </div>
            <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.85, marginBottom: '1rem' }}>Educational Guide · notworms.com</p>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Giardia in Australia — Symptoms, Sources, and What to Do
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, lineHeight: 1.65, maxWidth: '650px', margin: '0 auto' }}>
              Giardia (Giardia intestinalis) is one of Australia's most commonly diagnosed intestinal parasites. It's found in contaminated water sources across the country — from remote waterways to suburban streams — and its symptoms can be mistaken for ordinary gastro.
            </p>
          </div>
        </section>

        {/* Empathy block */}
        <section style={{ padding: '3rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#f0fdfa', borderRadius: '1rem', padding: '2rem', borderLeft: '5px solid #14b8a6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <Heart style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.25rem' }} size={30} />
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', margin: 0 }}>
                  Ongoing digestive symptoms that don't seem to resolve can be really draining. If you've been unwell for weeks with diarrhoea, bloating or fatigue — especially after drinking from a natural water source or after overseas travel — giardia is worth knowing about.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content items */}
        <section style={{ padding: '3rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
              Key Facts About Giardia in Australia
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Educational information only — not medical advice</p>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>How it spreads</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Primarily via contaminated water. Giardia cysts survive in cold water for months. Swallowing even small amounts of contaminated water from rivers, lakes, or streams is sufficient.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Also spreads person-to-person via faecal-oral route in childcare and household settings.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Incubation period</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>1–3 weeks from exposure to first symptoms. This delay is why people often cannot trace where they were infected.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Symptoms typically begin 7–14 days after exposure.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Characteristic symptoms</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Prolonged, foul-smelling, greasy or frothy diarrhoea; extreme bloating and gas; nausea; abdominal cramping; fatigue; and sometimes weight loss. No fever typically.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Duration without treatment: weeks to months. It does not resolve on its own reliably.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>What it looks like in stool</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Giardia cysts are microscopic — not visible to the naked eye. Stool may appear pale, greasy, and foul-smelling. No worms are visible.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Diagnosis requires laboratory stool microscopy or antigen testing — not visual analysis.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Who is at risk in Australia</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Bushwalkers, campers, and anyone drinking from untreated natural water. Travellers returning from developing countries. Children in childcare. People in remote communities with limited water treatment.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Very common in the Snowy Mountains, Blue Mountains, and Far North QLD waterways.</p>
                  </div>
            </div>
          </div>
        </section>

        {/* False alarms */}
        <section style={{ padding: '3rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>Common False Alarms</h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Not everything that looks concerning actually is</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              
                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Viral gastroenteritis</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Gastro is more sudden and usually resolves in days — giardia lingers for weeks</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Irritable bowel syndrome (IBS)</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Giardia can trigger IBS-like symptoms and is sometimes misdiagnosed as IBS</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Food intolerance</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Greasy, foul-smelling stool and bloating can also result from lactose intolerance or other food sensitivities</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Other intestinal parasites</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Cryptosporidium causes similar symptoms and is also acquired from water</p>
                </div>
            </div>
          </div>
        </section>

        {/* AI tool section */}
        <section style={{ padding: '3rem 1rem', backgroundColor: '#f0fdfa' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Brain size={44} style={{ color: '#0d9488', marginBottom: '1.25rem' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>How Our AI Tool Can Help</h2>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Camera style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={20} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Visual pattern recognition</strong>
                    <p style={{ color: '#64748b', marginTop: '0.25rem', lineHeight: 1.7, fontSize: '0.95rem' }}>Upload a photo and receive educational information about visual characteristics — skin, stool, microscopy, and environmental samples all accepted.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Shield style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={20} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Australian-specific context</strong>
                    <p style={{ color: '#64748b', marginTop: '0.25rem', lineHeight: 1.7, fontSize: '0.95rem' }}>Every report includes geographic relevance for Australia and Queensland — built for Australians, by Australians.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Lock style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={20} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Private and secure</strong>
                    <p style={{ color: '#64748b', marginTop: '0.25rem', lineHeight: 1.7, fontSize: '0.95rem' }}>Bank-level encryption. Your images are never shared. Handled in accordance with Australian Privacy Principles.</p>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#fff7ed', borderRadius: '0.75rem', padding: '1rem', marginTop: '1.5rem', border: '1px solid #fed7aa' }}>
                <p style={{ color: '#9a3412', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                  <strong>Important:</strong> Our tool provides educational information only and cannot diagnose any medical condition. Always consult a qualified healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '4rem 1rem', background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', textAlign: 'center', color: 'white' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 600, marginBottom: '1rem' }}>
              Concerned About Ongoing Digestive Symptoms?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.65 }}>
              Our AI tool can help you understand what you're seeing in stool images — and what might need further investigation.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ backgroundColor: 'white', color: '#0d9488', padding: '0.9rem 2.25rem', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem' }}>
                Try Free Analysis
              </Link>
              <Link to="/sample-report" style={{ backgroundColor: 'transparent', color: 'white', padding: '0.9rem 2rem', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', border: '2px solid rgba(255,255,255,0.8)' }}>
                View Sample Report
              </Link>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>Start free — use code BETA3FREE for 3 free analyses</p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '2.5rem', color: '#0f172a', textAlign: 'center' }}>Frequently Asked Questions</h2>
            
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>How is giardia diagnosed?</span>
                    {openFaq === 0 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 0 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Giardia is diagnosed by stool testing — either stool microscopy (looking for cysts under a microscope) or stool antigen testing (more sensitive). A GP will arrange this. Because giardia cysts are shed intermittently, sometimes multiple stool samples taken on different days are needed. A single negative result does not rule it out.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can you get giardia from drinking tap water in Australia?</span>
                    {openFaq === 1 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 1 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Town water supplies in Australia are treated and filtered, making giardia from tap water extremely rare in urban areas. The risk comes from untreated natural water sources — rivers, streams, lakes, and springs — especially in popular bushwalking areas. Always purify water from natural sources by boiling, filtering with a giardia-rated filter, or using appropriate chemical treatment.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Does giardia go away on its own?</span>
                    {openFaq === 2 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 2 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Sometimes, but often it does not — particularly in adults. Without treatment, symptoms can persist for weeks or months, and the person remains infectious to others during this time. Most GPs will prescribe a short course of antiparasitic medication, which is highly effective. Treatment is recommended rather than waiting for spontaneous resolution.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can I see giardia in my stool?</span>
                    {openFaq === 3 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 3 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      No. Giardia is microscopic — the cysts and trophozoites (active form) cannot be seen with the naked eye. If you can see something in your stool, it is not giardia. Giardia causes characteristic symptoms (greasy, foul-smelling diarrhoea, bloating, fatigue) but produces no visible worms or particles. A laboratory stool test is the only way to confirm it.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can our AI tool help with giardia?</span>
                    {openFaq === 4 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 4 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Because giardia is microscopic, our visual analysis tool cannot directly identify it in stool images. However, it can help you understand what you are or aren't seeing — for example, ruling out visible worms. If you suspect giardia based on symptoms and exposure history, the right step is a GP appointment and stool testing.
                    </div>
                  )}
                </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section style={{ padding: '2.5rem 1rem', backgroundColor: '#fef2f2' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.75rem', border: '1px solid #fecaca' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#991b1b' }}>Important Disclaimer</h3>
              <p style={{ fontSize: '0.9rem', color: '#7f1d1d', lineHeight: 1.7, margin: 0 }}>
                This page provides educational information about giardia only. It does not constitute medical advice. Consult a qualified healthcare professional for diagnosis and treatment. In an emergency, call 000.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '2rem 1rem', backgroundColor: '#1e293b', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem' }}>ParasitePro · notworms.com</Link>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem' }}>Educational AI-powered visual analysis for Australians</p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>Terms of Service</Link>
              <Link to="/disclaimer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>Disclaimer</Link>
              <Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>Contact</Link>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '1.25rem' }}>© {new Date().getFullYear()} ParasitePro. Not a medical or veterinary service.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SeoGiardiaPage;
