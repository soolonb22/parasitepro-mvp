import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock, Activity } from 'lucide-react';

const SeoParasiteSymptomsPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: "What are the most common signs of a parasitic infection?",
      answer: "Common symptoms include digestive issues (diarrhea, bloating, gas, nausea), unexplained fatigue, skin problems (rashes, itching, eczema), sleep disturbances, and unexplained weight changes. However, symptoms vary widely depending on the type of parasite and individual factors."
    },
    {
      question: "Can parasites cause fatigue?",
      answer: "Yes, fatigue is one of the most commonly reported symptoms. Parasites can affect energy levels by consuming nutrients, disrupting sleep, triggering immune responses, or causing anemia in some cases. Chronic unexplained fatigue, especially combined with digestive issues, may warrant investigation."
    },
    {
      question: "How long do parasite symptoms take to appear?",
      answer: "This varies significantly. Some parasites cause symptoms within days, while others may take weeks or months. Some infections can be asymptomatic for long periods. The incubation period depends on the parasite type, infection severity, and individual immune response."
    },
    {
      question: "Can parasites cause skin problems?",
      answer: "Yes, various parasites can cause skin manifestations including rashes, hives, eczema-like symptoms, itching, and in some cases visible marks from certain types of parasites. Skin symptoms may be direct (from skin-dwelling parasites) or indirect (immune reactions)."
    },
    {
      question: "Are digestive issues always present with parasites?",
      answer: "Not always. While digestive symptoms are common, some parasitic infections primarily affect other organ systems or cause symptoms like fatigue, muscle pain, or neurological issues. The presence or absence of digestive symptoms depends on where the parasite lives in the body."
    },
    {
      question: "Can your AI tool diagnose a parasitic infection?",
      answer: "No, our AI cannot diagnose any medical condition. It's designed as an educational resource to help you understand visual patterns and learn about possibilities. Only laboratory testing and medical evaluation can confirm parasitic infections. Our tool provides information, not diagnosis."
    },
    {
      question: "When should I see a doctor about possible parasites?",
      answer: "Consider seeing a healthcare provider if you experience persistent digestive issues, unexplained weight loss, chronic fatigue, visible worms in stool, severe symptoms, or have recently traveled to high-risk areas. Don't delay if symptoms are severe or worsening."
    },
    {
      question: "Can stress cause symptoms similar to parasites?",
      answer: "Yes, stress and anxiety can cause many symptoms that overlap with parasitic infections, including digestive issues, fatigue, and sleep problems. This is why professional evaluation is important — it can help identify the true cause of your symptoms."
    }
  ];

  const symptomCategories = [
    {
      category: "Digestive Symptoms",
      color: "#10b981",
      symptoms: ["Diarrhea or constipation", "Bloating and gas", "Nausea", "Abdominal pain or cramping", "Changes in appetite"]
    },
    {
      category: "Energy & Sleep",
      color: "#6366f1",
      symptoms: ["Chronic fatigue", "Sleep disturbances", "Waking at night", "Feeling unrefreshed after sleep", "Brain fog"]
    },
    {
      category: "Skin & Body",
      color: "#f59e0b",
      symptoms: ["Skin rashes or hives", "Itching (especially anal)", "Muscle or joint pain", "Teeth grinding", "Unexplained weight changes"]
    },
    {
      category: "Other Symptoms",
      color: "#ec4899",
      symptoms: ["Mood changes or irritability", "Anxiety or depression", "Food sensitivities", "Iron deficiency anemia", "Recurring infections"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Parasite Symptoms in Humans - Signs of Parasitic Infection | ParasitePro</title>
        <meta name="description" content="Learn about common parasite symptoms in humans including digestive issues, fatigue, skin problems, and more. Educational guide to understanding signs of parasitic infection." />
        <meta name="keywords" content="parasite symptoms, signs of parasites in humans, parasitic infection symptoms, intestinal parasite symptoms, how to know if you have parasites, parasite symptoms in adults" />
        <link rel="canonical" href="https://parasitepro.com/parasite-symptoms" />
        <meta property="og:title" content="Parasite Symptoms in Humans - Signs of Parasitic Infection | ParasitePro" />
        <meta property="og:description" content="Wondering if you have parasites? Learn about common symptoms and signs of parasitic infections in humans." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://parasitepro.com/parasite-symptoms" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Parasite Symptoms in Humans Guide" />
        <meta name="twitter:description" content="Educational guide to understanding parasite symptoms and signs of infection." />
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
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', 
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
              <Activity size={48} style={{ opacity: 0.9 }} />
            </div>
            <p style={{ 
              fontSize: '0.9rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              opacity: 0.9, 
              marginBottom: '1rem' 
            }}>
              Educational Health Guide
            </p>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 700, 
              marginBottom: '1.5rem', 
              lineHeight: 1.2 
            }}>
              Parasite Symptoms: Signs of Parasitic Infection in Humans
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', 
              opacity: 0.95, 
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              Wondering if your symptoms could be related to parasites? 
              Learn about the common signs and what they might mean.
            </p>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              borderRadius: '1rem', 
              padding: '2rem',
              borderLeft: '5px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <Heart style={{ color: '#059669', flexShrink: 0, marginTop: '0.25rem' }} size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
                    Understanding Your Symptoms
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    If you're experiencing unexplained symptoms and wondering about parasites, you're not alone. 
                    Many people search for answers when conventional explanations don't seem to fit.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    It's important to note that many parasite symptoms overlap with other conditions. 
                    This information is educational — <strong>only proper medical testing can confirm or rule out parasitic infection</strong>.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                    Use this guide to learn more, but always consult a healthcare provider for proper evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Common Parasite Symptoms by Category
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Symptoms can vary widely based on the type of parasite and individual factors
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem'
            }}>
              {symptomCategories.map((cat, index) => (
                <div key={index} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '1rem', 
                  padding: '1.75rem',
                  border: `2px solid ${cat.color}20`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: 600, 
                    marginBottom: '1rem', 
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: cat.color 
                    }} />
                    {cat.category}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cat.symptoms.map((symptom, i) => (
                      <li key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: '#334155',
                        fontSize: '0.95rem',
                        marginBottom: '0.5rem'
                      }}>
                        <CheckCircle size={16} style={{ color: cat.color, flexShrink: 0 }} />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2.5rem', 
              padding: '1.5rem',
              backgroundColor: '#fff7ed',
              borderRadius: '0.75rem',
              border: '1px solid #fed7aa'
            }}>
              <p style={{ color: '#9a3412', fontSize: '1.05rem', margin: 0 }}>
                <strong>Remember:</strong> These symptoms can have many causes. 
                The presence of these symptoms does not confirm parasitic infection, 
                and proper medical evaluation is essential for accurate diagnosis.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img 
                src="/images/health-analysis.jpg" 
                alt="Health analysis and testing" 
                style={{ 
                  width: '100%', 
                  maxWidth: '500px', 
                  borderRadius: '1rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Risk Factors to Consider
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Some factors may increase the likelihood of parasitic infection
            </p>
            
            <div style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '1rem', 
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {[
                  "Recent international travel (especially developing countries)",
                  "Consuming undercooked meat or fish",
                  "Drinking untreated water",
                  "Contact with animals or pets",
                  "Poor sanitation conditions",
                  "Weakened immune system",
                  "Walking barefoot in contaminated areas",
                  "Eating unwashed produce"
                ].map((risk, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <span style={{ color: '#334155', fontSize: '0.95rem' }}>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f0fdf4' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Brain size={44} style={{ color: '#059669' }} />
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
                If you've noticed something in your stool or have visible skin symptoms, 
                our AI visual analysis tool can provide educational insights about what you might be seeing.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Camera style={{ color: '#059669', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Upload images for educational visual pattern analysis</span>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Lock style={{ color: '#059669', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Complete privacy with bank-level encryption</span>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Heart style={{ color: '#059669', flexShrink: 0 }} size={20} />
                  <span style={{ color: '#334155' }}>Supportive, judgment-free educational experience</span>
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
                  <strong>Important:</strong> Our tool is for educational purposes only and cannot diagnose medical conditions. 
                  Always consult a healthcare provider for proper testing and diagnosis.
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
                      <ChevronUp size={20} style={{ color: '#059669', flexShrink: 0 }} /> : 
                      <ChevronDown size={20} style={{ color: '#059669', flexShrink: 0 }} />
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
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, marginBottom: '1rem' }}>
              Ready to Learn More?
            </h2>
            <p style={{ fontSize: '1.15rem', marginBottom: '2rem', opacity: 0.95, lineHeight: 1.7 }}>
              Get educational insights about what you're experiencing with our AI-powered analysis tool.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/pricing" 
                style={{ 
                  backgroundColor: 'white', 
                  color: '#059669', 
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
                to="/encyclopedia" 
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
                Browse Encyclopedia
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

export default SeoParasiteSymptomsPage;
