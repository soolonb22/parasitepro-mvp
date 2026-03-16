// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock } from 'lucide-react';

const SeoQueenslandParasitesPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet>
        <title>Parasites in Queensland - Tropical Region Risk Guide | ParasitePro</title>
        <meta name="description" content="Living in Queensland? Learn which parasites are endemic to tropical and subtropical regions and what to look for. Educational guide for Queenslanders." />
        <meta name="keywords" content="Queensland parasites, tropical parasites Australia, North Queensland worms, tropical worm infection Queensland, parasites Far North QLD, Cairns parasites, Townsville parasites" />
        <link rel="canonical" href="https://notworms.com/queensland-parasites" />
        <meta property="og:title" content="Parasites in Queensland — Tropical Region Risk Guide" />
        <meta property="og:description" content="Living in Queensland? Learn which parasites are endemic to tropical and subtropical regions and what to look for. Educational guide for Queenslanders." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://notworms.com/queensland-parasites" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Parasites in Queensland — Tropical Region Risk Guide" />
        <meta name="twitter:description" content="Living in Queensland? Learn which parasites are endemic to tropical and subtropical regions and what to look for. Educational guide for Queenslanders." />
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
              Queensland's Tropical Climate Creates Unique Parasite Risks
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, lineHeight: 1.65, maxWidth: '650px', margin: '0 auto' }}>
              Queensland's warm, humid climate makes it one of the highest-risk regions in Australia for parasitic exposure. From the rainforests of Far North QLD to the coastal communities of the Whitsundays, certain parasites thrive here year-round.
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
                  If you've noticed something unusual after spending time outdoors in Queensland — or after returning from a tropical trip — you're right to pay attention. This guide covers the parasites most commonly encountered in the region.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content items */}
        <section style={{ padding: '3rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
              Parasites Endemic to Queensland
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Educational information only — not medical advice</p>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Strongyloides stercoralis (Threadworm)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Endemic in parts of North QLD and remote communities. Larvae penetrate bare skin. Can persist for decades via auto-infection.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Visually: tiny, thread-like. Often not visible to the naked eye in stool.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Ancylostoma braziliense (Hookworm / CLM)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Common on QLD beaches and in sandy soil. Larvae cause cutaneous larva migrans — winding, itchy tracks under the skin.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Visually: raised, red serpiginous tracks on skin, typically on feet or legs.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Giardia intestinalis</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Found in contaminated waterways across QLD, particularly after flooding. Causes prolonged diarrhea and bloating.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Microscopic — not visible in stool without lab testing.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Toxocara canis (Roundworm from dogs)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Common in QLD due to high dog ownership and warm soil conditions. Can transfer to humans via contaminated soil.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Visually: spaghetti-like white worms, 3–15cm, in dog stool.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Scabies (Sarcoptes scabiei)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Highly prevalent in remote and Indigenous communities in QLD. Transmitted by skin-to-skin contact.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Visually: tiny burrow tracks, intense itching especially at night.</p>
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
                    <strong style={{ color: '#854d0e' }}>Soil nematodes</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Free-living worms in garden soil — harmless and extremely common in QLD gardens</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Fly larvae on outdoor waste</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Maggots in bins or outdoor waste — not from inside the body</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Undigested plant fibres</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Tropical fruits and vegetables can leave fibrous strands in stool</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Sand or dirt particles on skin</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Sometimes mistaken for burrow tracks, especially in children</p>
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
              Think You May Have Been Exposed in Queensland?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.65 }}>
              Our AI visual analysis tool is built for Australians — including Queensland-specific parasite context in every report.
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
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Why is Queensland higher risk for parasites than southern Australia?</span>
                    {openFaq === 0 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 0 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Queensland's tropical and subtropical climate — warm temperatures, high humidity, and frequent rainfall — creates ideal conditions for parasite larvae to survive in soil and water. Many parasites that die in southern winters remain active in QLD year-round.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can I get parasites from Queensland beaches?</span>
                    {openFaq === 1 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 1 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Yes, cutaneous larva migrans (CLM) is commonly acquired on Queensland beaches, particularly in sandy areas frequented by dogs. The hookworm larvae (Ancylostoma braziliense) live in sand contaminated by animal faeces and can penetrate bare skin. Wearing shoes and avoiding lying directly on sand in dog-frequented areas reduces risk.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>What should I do if I think I picked up a parasite in QLD?</span>
                    {openFaq === 2 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 2 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Take a photo of any visible symptoms or specimens — this can be useful for your GP. Note where you've been, any outdoor activities, and whether you walked barefoot or swam in natural waterways. Your GP can arrange appropriate testing. Our AI tool can provide educational context about what you might be looking at.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Are remote QLD communities at higher risk?</span>
                    {openFaq === 3 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 3 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Yes. Strongyloides stercoralis and scabies are significantly more prevalent in remote and Indigenous communities in Queensland and the NT, often due to overcrowded housing and limited access to healthcare. These conditions require specific treatment and public health approaches.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can our AI tool help identify QLD-specific parasites?</span>
                    {openFaq === 4 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 4 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Our AI visual analysis tool provides educational information about parasite visual characteristics including those common in Queensland. It can help you understand what you might be looking at, but cannot provide a diagnosis. Always consult a GP or travel medicine specialist for proper assessment.
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
                This page provides educational information about parasites in Queensland. It is not medical advice and does not constitute a diagnosis. Consult a qualified healthcare professional for any health concerns. In an emergency, call 000.
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

export default SeoQueenslandParasitesPage;
