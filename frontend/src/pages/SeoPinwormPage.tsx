// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock, Moon } from 'lucide-react';

const SeoPinwormPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: "What do pinworms look like?",
      answer: "Pinworms are small, thin, white worms that are about 1/4 to 1/2 inch long (6-13mm). They resemble small pieces of white thread or dental floss. Female pinworms are visible to the naked eye, especially at night when they emerge to lay eggs around the anal area."
    },
    {
      question: "What are the main symptoms of pinworm infection?",
      answer: "The most common symptom is intense itching around the anus, especially at night when pinworms lay their eggs. Other symptoms may include restless sleep, irritability, teeth grinding during sleep, and occasionally mild abdominal discomfort. Many people with pinworms have no symptoms at all."
    },
    {
      question: "How do pinworm infections spread?",
      answer: "Pinworms spread through the fecal-oral route. When someone scratches the itchy area, tiny eggs get on their fingers and under fingernails. These eggs can then be transferred to surfaces, food, or directly to other people. Eggs can also become airborne when shaking bedding."
    },
    {
      question: "Are pinworms dangerous?",
      answer: "Pinworm infections are usually not dangerous and are considered more of a nuisance than a serious health threat. They're the most common worm infection in developed countries, especially among children. However, persistent infections should be treated to prevent spread to others."
    },
    {
      question: "How can I check for pinworms at home?",
      answer: "The 'tape test' is commonly used: First thing in the morning, before bathing or using the toilet, press a piece of clear tape against the skin around the anus. The tape can pick up eggs that are too small to see. A healthcare provider can examine the tape under a microscope."
    },
    {
      question: "Can your AI tool diagnose pinworms?",
      answer: "No, our AI cannot diagnose any medical condition. It's designed purely as an educational resource to help you understand visual patterns and learn about possibilities. Only a healthcare professional can provide accurate diagnosis. Our tool offers informational support, not medical advice."
    },
    {
      question: "How are pinworms treated?",
      answer: "Pinworm infections are typically treated with over-the-counter or prescription antiparasitic medications. Treatment usually involves two doses, taken two weeks apart, to kill any newly hatched worms. All household members are often treated simultaneously to prevent reinfection."
    },
    {
      question: "How can I prevent pinworm reinfection?",
      answer: "Prevention includes frequent handwashing, keeping fingernails short, daily bathing, changing underwear daily, washing bedding frequently in hot water, and avoiding nail-biting or scratching the anal area. Good hygiene is the best defense against reinfection."
    }
  ];

  const symptoms = [
    { symptom: "Anal itching", description: "Especially intense at night when female pinworms lay eggs" },
    { symptom: "Restless sleep", description: "Discomfort and itching can disrupt normal sleep patterns" },
    { symptom: "Visible worms", description: "Small white thread-like worms may be visible in stool or around anus" },
    { symptom: "Irritability", description: "Sleep disruption and discomfort can cause mood changes, especially in children" },
    { symptom: "Teeth grinding", description: "Bruxism during sleep is sometimes associated with pinworm infection" },
    { symptom: "Mild stomach discomfort", description: "Some people experience vague abdominal symptoms" }
  ];

  return (
    <>
      <Helmet>
        <title>Pinworm Pictures & Symptoms - What You Need to Know | ParasitePro</title>
        <meta name="description" content="Learn about pinworm symptoms, what they look like, and how to identify them. Educational guide with supportive information for worried individuals and parents." />
        <meta name="keywords" content="pinworm pictures, pinworm symptoms, what do pinworms look like, pinworm infection, threadworm, enterobius vermicularis, pinworms in stool, pinworm treatment" />
        <link rel="canonical" href="https://parasitepro.com/pinworm-symptoms" />
        <meta property="og:title" content="Pinworm Pictures & Symptoms - Understanding Pinworm Infections | ParasitePro" />
        <meta property="og:description" content="Concerned about pinworms? Get calm, educational information about pinworm symptoms, identification, and what to do next." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://parasitepro.com/pinworm-symptoms" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pinworm Pictures & Symptoms Guide" />
        <meta name="twitter:description" content="Educational guide to understanding pinworm infections. Calm, supportive information." />
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', 
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
              <Moon size={48} style={{ opacity: 0.9 }} />
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
              Pinworm Pictures & Symptoms: What You Need to Know
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', 
              opacity: 0.95, 
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              Pinworms are the most common intestinal worm infection in developed countries. 
              Let's help you understand what you might be dealing with.
            </p>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: '#faf5ff', 
              borderRadius: '1rem', 
              padding: '2rem',
              borderLeft: '5px solid #8b5cf6'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <Heart style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.25rem' }} size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
                    First, Don't Panic — This Is Very Common
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    Pinworm infections affect an estimated 200 million people worldwide each year. 
                    They're especially common in children, but can affect anyone regardless of hygiene or cleanliness.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    If you're reading this because you or your child is experiencing symptoms, 
                    know that <strong>pinworm infections are easily treatable</strong> and typically resolve quickly with proper care.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                    This page provides calm, educational information. Remember, this is not medical advice — 
                    always consult a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Common Pinworm Symptoms
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Recognizing the signs of pinworm infection
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.25rem'
            }}>
              {symptoms.map((item, index) => (
                <div key={index} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.875rem', 
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                    <CheckCircle size={20} style={{ color: '#7c3aed' }} />
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{item.symptom}</strong>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              ))}
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2.5rem', 
              padding: '1.5rem',
              backgroundColor: '#fefce8',
              borderRadius: '0.75rem',
              border: '1px solid #fef08a'
            }}>
              <p style={{ color: '#854d0e', fontSize: '1.05rem', margin: 0 }}>
                <strong>Important:</strong> Many people with pinworms have no symptoms at all. 
                The absence of symptoms doesn't rule out infection.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              What Do Pinworms Look Like?
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Visual characteristics to help you understand
            </p>
            
            <div style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '1rem', 
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Size</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Adult female pinworms are about 8-13mm long (about 1/4 to 1/2 inch). 
                      Males are smaller at about 2-5mm.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Color</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      White or cream-colored, resembling thin white thread or dental floss.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Shape</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Thin, threadlike worms with a pointed tail (hence the name "pinworm").
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>When Visible</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Most visible at night (2-3 hours after sleep) when female worms emerge to lay eggs 
                      around the anal area. They may also be seen in stool.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#faf5ff' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Brain size={44} style={{ color: '#7c3aed' }} />
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
                Our AI visual analysis tool provides a private way to explore what you might be seeing. 
                Upload an image and receive educational information about visual patterns.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Camera style={{ color: '#7c3aed', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Visual pattern recognition for educational insights</span>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Lock style={{ color: '#7c3aed', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Bank-level encryption — complete privacy</span>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Heart style={{ color: '#7c3aed', flexShrink: 0 }} size={20} />
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
                  <strong>Disclaimer:</strong> Our tool provides educational information only. 
                  It cannot diagnose medical conditions. Always consult a healthcare provider for proper diagnosis and treatment.
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
                      <ChevronUp size={20} style={{ color: '#7c3aed', flexShrink: 0 }} /> : 
                      <ChevronDown size={20} style={{ color: '#7c3aed', flexShrink: 0 }} />
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, marginBottom: '1rem' }}>
              Want to Learn More About What You're Seeing?
            </h2>
            <p style={{ fontSize: '1.15rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.7 }}>
              Get educational insights with our AI-powered visual analysis tool.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/pricing" 
                style={{ 
                  backgroundColor: 'white', 
                  color: '#7c3aed', 
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

export default SeoPinwormPage;
