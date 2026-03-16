// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock } from 'lucide-react';

const SeoBlackSpecksStoolPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet>
        <title>Black Specks in Stool — What Could They Be? | ParasitePro</title>
        <meta name="description" content="Noticed black specks in your stool? Most are harmless but some warrant attention. Calm, educational guide to what black specks in stool could mean." />
        <meta name="keywords" content="black specks in stool, black dots in stool, dark specks in poop, black particles stool, black flecks in stool adults, black stuff in stool" />
        <link rel="canonical" href="https://notworms.com/black-specks-in-stool" />
        <meta property="og:title" content="Black Specks in Stool — What Could They Be?" />
        <meta property="og:description" content="Noticed black specks in your stool? Most are harmless but some warrant attention. Calm, educational guide to what black specks in stool could mean." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://notworms.com/black-specks-in-stool" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Black Specks in Stool — What Could They Be?" />
        <meta name="twitter:description" content="Noticed black specks in your stool? Most are harmless but some warrant attention. Calm, educational guide to what black specks in stool could mean." />
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
              Black Specks in Your Stool — Most Common Causes
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, lineHeight: 1.65, maxWidth: '650px', margin: '0 auto' }}>
              Finding black specks in your stool is unsettling. The good news: the vast majority of cases have a completely harmless explanation — usually food. But some causes do warrant attention, so it's worth understanding what you're looking at.
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
                  You're doing the right thing by looking into it. This guide gives you calm, clear information about what black specks typically are — so you can decide whether this needs a GP visit or whether it's time to stop worrying.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content items */}
        <section style={{ padding: '3rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
              What Black Specks in Stool Can Be
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Educational information only — not medical advice</p>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Food — most common cause</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Blueberries, blackberries, dark grapes, poppy seeds, sesame seeds, black pepper, and dark chocolate all commonly produce black specks.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Think back to what you ate in the last 24–48 hours — this resolves most cases immediately.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Iron supplements or bismuth</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Iron tablets and bismuth-containing medications (e.g. Pepto-Bismol) reliably cause black or very dark stools and black specks.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>If you take either of these, that is almost certainly the cause.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Dried blood from upper GI tract</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Blood that has been digested turns black (called melaena). This is a cause that warrants GP assessment, especially if accompanied by other symptoms.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Unlike food-related specks, melaena often has a distinctive tarry smell.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Gut bacteria and digestive byproducts</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Certain gut bacteria produce dark pigments. This is normal variation in many people.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Usually consistent across multiple bowel movements and not a new finding.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Parasites — rare and unlikely</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Certain parasite eggs or debris can appear as dark specks, but this is far less common than food or medication causes.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Parasite eggs are generally not visible to the naked eye. Microscopy is needed to confirm.</p>
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
                    <strong style={{ color: '#854d0e' }}>Blueberries / blackberries</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Most common cause — produces unmistakeable dark specks</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Poppy seeds</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Pass through almost completely intact and look exactly like black specks</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Iron tablets</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Consistently darken stool and produce black particles</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Dark chocolate</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Cocoa particles can appear as dark brown-black specks</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Activated charcoal</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Produces jet black stools and specks — entirely harmless</p>
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
              Want a Second Opinion on What You Found?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.65 }}>
              Upload a photo for an educational AI visual analysis. Understand what you're looking at before your GP visit.
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
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>When should I see a doctor about black specks in stool?</span>
                    {openFaq === 0 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 0 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      See a GP if: the specks persist for more than a few days with no obvious food/medication cause, the stool is also very dark or tarry overall (not just specks), you have accompanying symptoms like abdominal pain, nausea, unexplained weight loss, or fatigue, or you notice blood elsewhere. Black specks alone with a clear food explanation rarely need medical attention.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Could black specks be parasite eggs?</span>
                    {openFaq === 1 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 1 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      It's possible but unlikely if you're seeing them with the naked eye. Most parasite eggs are microscopic — invisible without a microscope. What people usually see as 'black specks' are food particles. Worm eggs require a laboratory stool test to identify. If you're concerned about parasites specifically, a GP can arrange a stool microscopy test.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Do black specks in stool mean there is bleeding?</span>
                    {openFaq === 2 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 2 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Not necessarily. Black specks are most commonly food. However, digested blood (melaena) can appear as black, tarry stool. Melaena has a distinctive smell and usually produces more than just specks — the whole stool tends to be very dark. If you're unsure, a GP can do a simple faecal occult blood test.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>My child has black specks in their stool — should I worry?</span>
                    {openFaq === 3 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 3 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      In children, the cause is almost always food — especially blueberries, grapes, or dark-coloured snacks. Iron-fortified baby formula and iron drops are also very common causes in infants. If your child is otherwise well and eating normally, food is almost certainly the cause. See a GP if it persists, the child is unwell, or the stool is very dark overall.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can your AI tool help identify black specks?</span>
                    {openFaq === 4 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 4 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Our visual analysis tool can provide educational context about what different visual characteristics typically represent. It can help you explore whether what you're seeing is consistent with food particles, digestive byproducts, or other causes. It cannot diagnose any medical condition — always consult a GP if you're concerned.
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
                This page provides general educational information only and does not constitute medical advice. If you are concerned about symptoms, consult a qualified healthcare professional. In an emergency, call 000.
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

export default SeoBlackSpecksStoolPage;
