// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock } from 'lucide-react';

const SeoSkinParasitePage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet>
        <title>Skin Parasite Identification — Visual Guide for Australians | ParasitePro</title>
        <meta name="description" content="Noticed something unusual on your skin? Educational guide to identifying common skin parasites in Australia including scabies, CLM, and skin larvae." />
        <meta name="keywords" content="skin parasite identification, skin parasites Australia, scabies identification, cutaneous larva migrans, skin worm Australia, parasite tracks on skin, skin crawling sensation parasites" />
        <link rel="canonical" href="https://notworms.com/skin-parasite-identification" />
        <meta property="og:title" content="Skin Parasite Identification — Visual Guide for Australians" />
        <meta property="og:description" content="Noticed something unusual on your skin? Educational guide to identifying common skin parasites in Australia including scabies, CLM, and skin larvae." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://notworms.com/skin-parasite-identification" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Skin Parasite Identification — Visual Guide for Australians" />
        <meta name="twitter:description" content="Noticed something unusual on your skin? Educational guide to identifying common skin parasites in Australia including scabies, CLM, and skin larvae." />
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
              Something Unusual on Your Skin? Here's What It Could Be
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, lineHeight: 1.65, maxWidth: '650px', margin: '0 auto' }}>
              Skin parasites present very differently to intestinal ones — and in Australia, the most common ones are directly tied to our outdoor lifestyle and tropical climate. This guide covers the key ones to know.
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
                  Skin symptoms are often more alarming than intestinal ones because they're visible and constantly in your awareness. Whatever you're experiencing, you're right to find out more. This guide gives you calm, clear information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content items */}
        <section style={{ padding: '3rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
              Common Skin Parasites in Australia
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Educational information only — not medical advice</p>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Cutaneous Larva Migrans (CLM)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Hookworm larvae from animal faeces penetrate bare skin, creating raised, red, intensely itchy, winding tracks. Very common on QLD and tropical beaches.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Visually distinctive: a visible winding trail moving 1–2cm per day. Usually on feet, legs, buttocks.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Scabies (Sarcoptes scabiei)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Microscopic mites burrow into the top skin layer. Causes intensely itchy rash, especially at night. Burrow tracks may be visible as tiny grey lines.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Highly contagious by skin-to-skin contact. Common in crowded settings and remote communities.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Tungiasis (Sand Flea)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Pregnant sand fleas burrow into skin (usually under toenails or on feet) and cause a painful, white, ring-shaped lesion. Rare but present in tropical QLD.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Visually: white dome with dark centre. Usually single lesion on foot.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Myiasis (Fly Larvae)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Fly larvae (maggots) can infest wounds or skin breaks, particularly in tropical climates. Larvae are visible in the wound.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Rare in healthy individuals. More common in wounds left untreated outdoors.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Delusional Parasitosis</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>A real and recognised condition where a person genuinely believes they have skin parasites when none are present. Not something to dismiss — worth discussing with a GP.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>A crawling or biting sensation with no visible cause should be discussed with a healthcare professional.</p>
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
                    <strong style={{ color: '#854d0e' }}>Dry skin or eczema</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Itchy, track-like patterns can appear from scratching dry skin or eczema — not parasites</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Prickly heat rash</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Very common in QLD — red, itchy rash from blocked sweat glands, not a parasite</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Contact dermatitis</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Reaction to plants, chemicals or fabrics can leave winding, track-like marks on skin</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Stretch marks or old scars</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Can occasionally be mistaken for worm tracks, especially in poor lighting</p>
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
              Have a Skin Presentation You Want to Understand?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.65 }}>
              Upload a skin photo for educational AI visual analysis. Our tool supports skin, stool, microscopy and environmental samples.
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
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>What does cutaneous larva migrans look like?</span>
                    {openFaq === 0 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 0 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      CLM appears as a raised, red, intensely itchy, winding track in the skin — like a thin, twisting line. It progresses a few centimetres per day as the larvae migrate. It's usually on the feet, lower legs, or buttocks. The track is often the most visible just behind the leading edge of the larvae's migration.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>How do I know if I have scabies?</span>
                    {openFaq === 1 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 1 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Scabies causes intense itching, especially at night. Look for: burrow tracks (tiny, grey-white, thread-like lines), a pimple-like rash in characteristic locations (between fingers, wrists, elbows, armpits, genital area, buttocks). In infants, it can affect the head, face and palms. Scabies is highly contagious — a GP should examine and prescribe treatment for all household members.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can I get skin parasites from a Queensland beach?</span>
                    {openFaq === 2 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 2 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Yes — cutaneous larva migrans (CLM) is commonly acquired on Queensland beaches. Hookworm larvae from dog or cat faeces live in warm sand and can penetrate bare skin. Walking barefoot or lying directly on contaminated sand are the main risks. It's not dangerous but is very itchy and needs treatment with antiparasitic medication from a GP.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>What should I do if I think I have a skin parasite?</span>
                    {openFaq === 3 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 3 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Take a clear photo in good lighting — this is extremely helpful for your GP. Note when it started, where you've been, and any outdoor activities. See a GP promptly — most skin parasites are very treatable but the sooner the better. Do not try to remove anything yourself from the skin.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can your AI tool analyse skin presentations?</span>
                    {openFaq === 4 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 4 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Yes — our AI tool accepts skin presentations as a sample type. It can provide educational context about what visual features are consistent with common skin parasites. This may help you understand what you're looking at before your GP visit. It cannot provide a diagnosis.
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
                This page provides educational information about skin parasites only. It does not constitute medical advice or diagnosis. Consult a qualified healthcare professional for assessment and treatment. In an emergency, call 000.
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

export default SeoSkinParasitePage;
