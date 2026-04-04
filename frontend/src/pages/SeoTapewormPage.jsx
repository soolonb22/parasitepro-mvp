import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock, Ruler } from 'lucide-react';

const SeoTapewormPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: "What does a tapeworm look like in stool?",
      answer: "Tapeworm segments (proglottids) in stool typically look like flat, white or cream-colored pieces resembling rice grains, cucumber seeds, or small ribbons. Fresh segments may move slightly. The segments are typically 1/2 to 3/4 inch long. You usually don't see the entire worm, which can be very long and remains in the intestine."
    },
    {
      question: "What are the symptoms of a tapeworm infection?",
      answer: "Many tapeworm infections cause no symptoms. When symptoms occur, they may include visible segments in stool or on toilet paper, abdominal discomfort, nausea, weakness, weight loss, increased appetite, vitamin deficiencies, and in rare cases, more serious complications if larvae migrate to other tissues."
    },
    {
      question: "How do people get tapeworms?",
      answer: "Tapeworms are most commonly acquired by eating raw or undercooked meat (beef, pork, or fish) that contains tapeworm larvae. Some species can also be acquired through ingesting eggs from contaminated food, water, or surfaces, or through flea ingestion (in the case of pet-related tapeworms)."
    },
    {
      question: "Are tapeworms dangerous?",
      answer: "Intestinal tapeworm infections are usually not dangerous and are easily treated. However, some species can cause more serious complications if larvae migrate outside the intestines to other organs. Cysticercosis, caused by pork tapeworm larvae, can affect the brain and is more concerning. Early treatment prevents complications."
    },
    {
      question: "Can I get tapeworms from my pet?",
      answer: "The most common pet tapeworm (Dipylidium caninum) can occasionally infect humans, usually children, if they accidentally swallow an infected flea. However, this is uncommon. You cannot get tapeworms by touching your pet or their stool directly — the lifecycle requires an intermediate host."
    },
    {
      question: "How are tapeworms diagnosed and treated?",
      answer: "Diagnosis typically involves laboratory examination of stool samples for eggs or segments. Sometimes blood tests or imaging may be needed. Treatment usually involves prescription antiparasitic medications that kill the tapeworm, which is then expelled from the body through normal digestion."
    },
    {
      question: "Can your AI tool identify tapeworms?",
      answer: "Our AI provides educational visual analysis to help you understand what you might be seeing. While it can offer insights about visual patterns, it cannot diagnose tapeworm infection or any medical condition. Only laboratory testing can confirm the presence of tapeworms."
    },
    {
      question: "How can I prevent tapeworm infection?",
      answer: "Prevention includes cooking meat to safe temperatures (145°F for whole cuts, 160°F for ground meat), freezing meat properly before consumption if eating raw, practicing good hand hygiene, treating pets for fleas regularly, and avoiding consumption of raw or undercooked freshwater fish in endemic areas."
    }
  ];

  const tapewormTypes = [
    { name: "Beef Tapeworm (Taenia saginata)", source: "Undercooked beef", size: "Up to 25 feet", risk: "Common worldwide" },
    { name: "Pork Tapeworm (Taenia solium)", source: "Undercooked pork", size: "Up to 10 feet", risk: "Can cause cysticercosis" },
    { name: "Fish Tapeworm (Diphyllobothrium)", source: "Raw freshwater fish", size: "Up to 30 feet", risk: "May cause B12 deficiency" },
    { name: "Dwarf Tapeworm (Hymenolepis nana)", source: "Fecal-oral transmission", size: "Up to 2 inches", risk: "Common in children" }
  ];

  return (
    <>
      <Helmet>
        <title>Tapeworm in Stool - Pictures, Symptoms & Information | ParasitePro</title>
        <meta name="description" content="Learn what tapeworms look like in stool, common symptoms, causes, and what to do. Educational guide with supportive information about tapeworm infections." />
        <meta name="keywords" content="tapeworm in stool, tapeworm pictures, tapeworm symptoms, what does tapeworm look like, tapeworm in poop, tapeworm infection, tapeworm segments, how to know if you have tapeworm" />
        <link rel="canonical" href="https://parasitepro.com/tapeworm-in-stool" />
        <meta property="og:title" content="Tapeworm in Stool - Pictures, Symptoms & Information | ParasitePro" />
        <meta property="og:description" content="Concerned about tapeworms? Get calm, educational information about what they look like, symptoms, and what steps to take." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://parasitepro.com/tapeworm-in-stool" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tapeworm in Stool Guide" />
        <meta name="twitter:description" content="Educational guide to understanding tapeworms, their appearance, and symptoms." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ParasitePro" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <section style={{ 
          background: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)', 
          color: 'white', 
          padding: '5rem 1rem 4rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/health-analysis.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }} />
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Ruler size={48} style={{ opacity: 0.9 }} />
            </div>
            <p style={{ 
              fontSize: '0.9rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              opacity: 0.9, 
              marginBottom: '1rem' 
            }}>
              Educational Health Information
            </p>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 700, 
              marginBottom: '1.5rem', 
              lineHeight: 1.2 
            }}>
              Tapeworm in Stool: What You Need to Know
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', 
              opacity: 0.95, 
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              Noticed something in your stool that looks like rice or small flat segments? 
              Let us help you understand what you might be seeing.
            </p>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              borderRadius: '1rem', 
              padding: '2rem',
              borderLeft: '5px solid #0ea5e9'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <Heart style={{ color: '#0369a1', flexShrink: 0, marginTop: '0.25rem' }} size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
                    First, Don't Panic — Help Is Available
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    If you've noticed something that looks like tapeworm segments, 
                    it's understandable to feel alarmed. The good news is that 
                    <strong> tapeworm infections are very treatable</strong> with proper medical care.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    Many things can resemble tapeworm segments, including undigested food, 
                    mucus strands, or other harmless substances. This guide will help you understand 
                    what to look for and when to seek help.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                    This page provides educational information — always consult a healthcare provider 
                    for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              What Do Tapeworm Segments Look Like?
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Visual characteristics to help you understand
            </p>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '1rem', 
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#0369a1', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Appearance</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Flat, white or cream-colored segments resembling grains of rice, cucumber seeds, 
                      or small ribbon-like pieces. Fresh segments may appear slightly yellowish.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#0369a1', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Size</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Individual segments are typically 1/2 to 3/4 inch long (about 1-2 cm). 
                      Dried segments may appear smaller.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#0369a1', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Movement</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Fresh segments may show slight movement or contraction when first passed. 
                      This is a distinguishing characteristic from undigested food.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#0369a1', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Location</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      May be seen in stool, on toilet paper, on underwear, or around the anal area. 
                      Segments break off from the adult worm and are passed with stool.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Types of Tapeworms
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Different species have different sources and characteristics
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tapewormTypes.map((type, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {type.name}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Source:</span>
                      <p style={{ color: '#334155', margin: '0.25rem 0 0', fontWeight: 500 }}>{type.source}</p>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Size (adult):</span>
                      <p style={{ color: '#334155', margin: '0.25rem 0 0', fontWeight: 500 }}>{type.size}</p>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Note:</span>
                      <p style={{ color: '#334155', margin: '0.25rem 0 0', fontWeight: 500 }}>{type.risk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Common False Alarms
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Things that can be mistaken for tapeworm segments
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.25rem'
            }}>
              {[
                { item: "Undigested rice or grains", description: "White rice can pass through partially undigested and resemble segments" },
                { item: "Mucus strands", description: "Intestinal mucus can form white or clear ribbon-like shapes" },
                { item: "Bean sprouts", description: "Partially digested sprouts can look similar to worm segments" },
                { item: "Coconut pieces", description: "White, flat pieces of coconut may resemble segments" },
                { item: "Sesame or pumpkin seeds", description: "Undigested seeds can look like dried tapeworm segments" },
                { item: "Medication coatings", description: "Some pill coatings may pass through and look alarming" }
              ].map((item, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#fefce8', 
                  borderRadius: '0.875rem', 
                  padding: '1.5rem',
                  border: '1px solid #fef08a'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                    <AlertCircle size={20} style={{ color: '#ca8a04' }} />
                    <strong style={{ color: '#854d0e', fontSize: '1.05rem' }}>{item.item}</strong>
                  </div>
                  <p style={{ color: '#a16207', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f0f9ff' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Brain size={44} style={{ color: '#0369a1' }} />
              </div>
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
              How Our AI-Powered Tool Can Help
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Educational visual analysis to support your understanding
            </p>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '1rem', 
              padding: '2.5rem',
              textAlign: 'left',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '2rem' }}>
                Not sure if what you're seeing is actually a tapeworm? 
                Our AI visual analysis tool can help you understand the visual characteristics 
                of what you're observing and provide educational context.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Camera style={{ color: '#0369a1', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Upload images for educational pattern analysis</span>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Lock style={{ color: '#0369a1', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Bank-level encryption for complete privacy</span>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Heart style={{ color: '#0369a1', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Supportive, judgment-free experience</span>
                </li>
              </ul>
              
              <div style={{ 
                backgroundColor: '#fff7ed', 
                borderRadius: '0.75rem', 
                padding: '1.25rem', 
                marginTop: '2rem',
                border: '1px solid #fed7aa'
              }}>
                <p style={{ color: '#9a3412', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                  <strong>Important:</strong> Our tool provides educational information only and cannot diagnose tapeworm infection. 
                  If you suspect you have tapeworms, consult a healthcare provider for proper testing and treatment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2rem', color: '#0f172a', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0'
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', paddingRight: '1rem' }}>
                      {faq.question}
                    </span>
                    {openFaq === index ? 
                      <ChevronUp size={20} style={{ color: '#0369a1', flexShrink: 0 }} /> : 
                      <ChevronDown size={20} style={{ color: '#0369a1', flexShrink: 0 }} />
                    }
                  </button>
                  {openFaq === index && (
                    <div style={{ padding: '0 1.25rem 1.25rem' }}>
                      <p style={{ color: '#64748b', lineHeight: 1.7, margin: 0 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ 
          padding: '4rem 1rem', 
          background: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, marginBottom: '1rem' }}>
              Want to Understand What You're Seeing?
            </h2>
            <p style={{ fontSize: '1.15rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.7 }}>
              Get educational insights with our AI-powered visual analysis tool.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/pricing" 
                style={{ 
                  backgroundColor: 'white', 
                  color: '#0369a1', 
                  padding: '1rem 2.5rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                Try Visual Analysis
              </Link>
              <Link 
                to="/sample-report" 
                style={{ 
                  backgroundColor: 'transparent', 
                  color: 'white', 
                  padding: '1rem 2rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '2px solid white'
                }}
              >
                See Sample Report
              </Link>
            </div>
          </div>
        </section>

        <footer style={{ 
          padding: '2rem 1rem', 
          backgroundColor: '#0f172a', 
          textAlign: 'center' 
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            <strong>Medical Disclaimer:</strong> This content is for educational purposes only and is not intended as medical advice. 
            Always consult a qualified healthcare provider for diagnosis and treatment of any medical condition.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none', marginRight: '1.5rem' }}>Home</Link>
            <Link to="/encyclopedia" style={{ color: '#64748b', textDecoration: 'none', marginRight: '1.5rem' }}>Encyclopedia</Link>
            <Link to="/blog" style={{ color: '#64748b', textDecoration: 'none' }}>Blog</Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SeoTapewormPage;
