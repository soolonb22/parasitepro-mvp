// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock } from 'lucide-react';

const SeoCatWormsPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet>
        <title>Worms in Cats Australia — Identification & Visual Guide | ParasitePro</title>
        <meta name="description" content="Noticed worms in your cat's stool or around their bottom? Educational guide to identifying common cat worms in Australia including roundworm, tapeworm and hookworm." />
        <meta name="keywords" content="worms in cats Australia, cat worms pictures, tapeworm cats Australia, roundworm cats, worms in cat stool, cat parasites Australia, what do cat worms look like" />
        <link rel="canonical" href="https://notworms.com/worms-in-cats-australia" />
        <meta property="og:title" content="Worms in Cats Australia — Visual Identification Guide" />
        <meta property="og:description" content="Noticed worms in your cat's stool or around their bottom? Educational guide to identifying common cat worms in Australia including roundworm, tapeworm and hookworm." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://notworms.com/worms-in-cats-australia" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Worms in Cats Australia — Visual Identification Guide" />
        <meta name="twitter:description" content="Noticed worms in your cat's stool or around their bottom? Educational guide to identifying common cat worms in Australia including roundworm, tapeworm and hookworm." />
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
              Noticed Worms in Your Cat? Here's What They Could Be
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, lineHeight: 1.65, maxWidth: '650px', margin: '0 auto' }}>
              Cats are naturally curious hunters, which makes them particularly prone to intestinal worms. In Australia, three types are especially common: tapeworm, roundworm, and hookworm. Knowing the difference helps you act quickly.
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
                  Finding worms in your cat's stool or around their rear end is alarming for any pet owner. You're doing the right thing by finding out more. This guide gives you calm, clear information to help you understand what you might be seeing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content items */}
        <section style={{ padding: '3rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
              Common Worms in Australian Cats
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Educational information only — not medical advice</p>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Tapeworm (Dipylidium caninum)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>The most commonly seen worm in Australian cats. Segments appear as small, flat, rice-grain-like pieces near the cat's bottom or in fresh stool.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Transmitted via fleas. If your cat has fleas, tapeworm is very likely present too.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Roundworm (Toxocara cati)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Common in kittens. Adults are long, pale, spaghetti-like worms passed in stool. Kittens may have a pot-bellied appearance.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Transmitted via mother's milk or hunting infected prey. Can transfer to humans.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Hookworm (Ancylostoma tubaeforme)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Tiny and thread-like — rarely visible to the naked eye. Causes bloody or dark stool, especially in kittens.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>More common in North Queensland and tropical regions.</p>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Hydatid tapeworm (Echinococcus)</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>Rare but present in rural Australia. Cats can carry it after eating infected wildlife.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>Zoonotic — can transfer to humans. Important to treat promptly in rural settings.</p>
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
                    <strong style={{ color: '#854d0e' }}>Fly larvae on outdoor waste</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Maggots on cat faeces left outside — originate from flies, not from inside the cat</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Dried mucus</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Can form small, pale, elongated shapes around the rear end</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Undigested food</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Certain soft foods can pass through cats and resemble small worms</p>
                </div>

                <div style={{ backgroundColor: '#fefce8', borderRadius: '0.875rem', padding: '1.25rem', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e' }}>Skin tags or anal gland material</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.9rem', lineHeight: 1.6 }}>Can sometimes be mistaken for worm segments around the rear</p>
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
              Found Something in Your Cat's Stool?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.65 }}>
              Upload a photo for an AI-powered educational visual analysis — including Australian-specific parasite context.
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
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>How do I know if my cat has worms?</span>
                    {openFaq === 0 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 0 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Common signs include visible worm segments around the bottom or in fresh stool (tapeworm), pot-bellied appearance especially in kittens (roundworm), dull coat, vomiting, diarrhoea, scooting on the floor, weight loss despite good appetite, and lethargy. Some cats show no signs at all, which is why regular deworming is important.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Are cat worms dangerous to humans?</span>
                    {openFaq === 1 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 1 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Some can be. Toxocara cati (roundworm) eggs can infect humans through contact with contaminated soil or faeces — children are most at risk. Hydatid disease (Echinococcus) is also zoonotic. Good hygiene practices — washing hands after handling cats or cleaning litter trays, and keeping children away from cat toilet areas — significantly reduce risk.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>How often should I deworm my cat in Australia?</span>
                    {openFaq === 2 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 2 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Australian vets generally recommend deworming every 3 months for adult cats with outdoor access. Indoor-only cats may need less frequent treatment. Kittens need more frequent deworming in their first few months. Your vet can recommend the best schedule based on your cat's lifestyle and risk factors.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>What do tapeworm segments look like?</span>
                    {openFaq === 3 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 3 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Fresh tapeworm segments are flat, white or cream-coloured, and resemble grains of rice or cucumber seeds. They may move. Dried segments resemble sesame seeds — flat and yellow-brown. You'll often see them stuck to fur around the cat's rear end or on bedding.
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem', lineHeight: 1.4 }}>Can I use our AI tool to identify worms in my cat?</span>
                    {openFaq === 4 ? <ChevronUp size={20} style={{ color: '#0d9488', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />}
                  </button>
                  {openFaq === 4 && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      Our visual analysis tool can provide educational information about what different visual characteristics typically look like in cat parasite specimens. It cannot diagnose or replace veterinary assessment. If you're confident your cat has worms, contacting your vet for appropriate treatment is the right step.
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
                This page is for educational purposes only. It does not constitute veterinary advice. Always consult a licensed veterinarian for diagnosis and treatment of your pet. In an emergency, call 000.
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

export default SeoCatWormsPage;
