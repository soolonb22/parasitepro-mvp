import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock } from 'lucide-react';

const SeoWormInStoolPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: "Is it normal to notice something unusual in my stool?",
      answer: "Yes, it's more common than you might think. Many everyday foods and natural body substances can create shapes that look concerning but are completely harmless. Banana fibers, bean sprouts, mucus strands, and undigested vegetables are frequent culprits. While your concern is completely valid, many people discover that what worried them was simply undigested food or natural intestinal matter."
    },
    {
      question: "What steps should I take if I see something that looks like a worm?",
      answer: "First, take a moment to breathe. It's natural to feel alarmed. If you're comfortable doing so, take a clear photo for your own reference. Then, think back to what you've eaten in the past day or two, as many foods can mimic worm-like appearances. Our AI educational tool can help you explore what you might be seeing. If you remain concerned, speaking with a healthcare provider is always a supportive next step."
    },
    {
      question: "Can your AI tool diagnose parasites or medical conditions?",
      answer: "No, our AI cannot and does not diagnose any medical conditions. It's designed purely as an educational resource to help you understand visual patterns and learn about different possibilities. Think of it as an informational guide, not a medical opinion. Only a licensed healthcare professional can provide actual medical diagnoses after proper examination and testing."
    },
    {
      question: "How does the AI image analysis work?",
      answer: "Our AI uses advanced visual pattern recognition to identify characteristics in uploaded images. It then provides educational information about what those visual features might represent based on its training data. The tool offers insights and possibilities for learning purposes, but it's important to remember that visual analysis alone cannot determine what something actually is. Professional laboratory testing is the only way to confirm any concerns."
    },
    {
      question: "Is my privacy protected when I use your platform?",
      answer: "Absolutely. We understand this is a sensitive and personal matter. Your images are processed with bank-level encryption, never shared with third parties, and handled with complete confidentiality. We've designed our platform with your privacy as a top priority because we know how important discretion is when dealing with health-related concerns."
    },
    {
      question: "What if I'm feeling anxious or overwhelmed about what I found?",
      answer: "Your feelings are completely valid, and you're not alone in experiencing this anxiety. Many people feel worried or even embarrassed when they notice something unexpected. Our platform is designed to be a calm, judgment-free space where you can learn and explore. If anxiety persists or becomes overwhelming, reaching out to a healthcare provider can offer both medical guidance and emotional reassurance. Taking care of your mental wellbeing is just as important as your physical health."
    },
    {
      question: "Why do some foods look like worms in stool?",
      answer: "The digestive system doesn't break down all foods equally. Fibrous foods like bananas, bean sprouts, and leafy greens often pass through partially undigested. Their elongated, string-like fibers can closely resemble worms in color, shape, and texture. Similarly, tomato skins, mushroom stems, and even some medications can create alarming appearances. This is completely normal and happens to many people."
    },
    {
      question: "Should I see a doctor even if I think it's probably nothing?",
      answer: "If you're feeling worried or uncertain, consulting a healthcare provider is always a reasonable choice. There's no such thing as an 'unnecessary' doctor visit when it comes to your peace of mind. Medical professionals are there to help, and they'd rather you come in and receive reassurance than stay home feeling anxious. Trust your instincts about your own body."
    }
  ];

  const falseAlarms = [
    { item: "Banana fibers", description: "Dark strings and threads from bananas are one of the most common false alarms, often appearing thin and worm-like" },
    { item: "Bean sprouts", description: "Partially digested sprouts retain their elongated shape and pale color" },
    { item: "Tomato skins", description: "Red, curved pieces that can look concerning but are simply undigested produce" },
    { item: "Mushroom stems", description: "Pale, elongated pieces that don't break down easily during digestion" },
    { item: "Mucus strands", description: "Natural intestinal mucus can form string-like shapes that look alarming but are normal" },
    { item: "Leafy greens", description: "Spinach, kale, and lettuce fibers often pass through as long green strands" }
  ];

  return (
    <>
      <Helmet>
        <title>Worm in Stool Picture - What You Might Be Seeing | ParasitePro</title>
        <meta name="description" content="Found something in your stool that looks like a worm? Get calm, supportive information about what you might be seeing. Educational AI analysis for peace of mind. No medical advice." />
        <meta name="keywords" content="worm in stool picture, what does a worm look like in stool, worm in poop picture, parasite in stool, stool analysis, intestinal worms pictures, white worm in stool, thin worm in stool" />
        <link rel="canonical" href="https://parasitepro.com/worm-in-stool-picture" />
        <meta property="og:title" content="Worm in Stool Picture - Understanding What You See | ParasitePro" />
        <meta property="og:description" content="Concerned about something in your stool? Get calm, educational information and AI-powered visual analysis to help you understand what you might be seeing." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://parasitepro.com/worm-in-stool-picture" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Worm in Stool Picture - What You Might Be Seeing" />
        <meta name="twitter:description" content="Calm, supportive guidance for understanding stool observations. Educational AI analysis." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ParasitePro" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Worm in Stool Picture - Understanding What You See",
            "description": "Educational resource helping people understand stool observations with supportive, trauma-informed guidance and AI-powered visual analysis",
            "url": "https://parasitepro.com/worm-in-stool-picture",
            "publisher": {
              "@type": "Organization",
              "name": "ParasitePro",
              "url": "https://parasitepro.com"
            },
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Worm in Stool Picture: Understanding What You Might Be Seeing",
            "description": "A calm, supportive guide to understanding stool observations, common false alarms, and when to seek professional guidance.",
            "author": {
              "@type": "Organization",
              "name": "ParasitePro"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ParasitePro",
              "url": "https://parasitepro.com"
            },
            "datePublished": "2024-01-15",
            "dateModified": new Date().toISOString().split('T')[0]
          })}
        </script>
      </Helmet>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <section style={{ 
          background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', 
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
            opacity: 0.15
          }} />
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <p style={{ 
              fontSize: '0.9rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              opacity: 0.9, 
              marginBottom: '1rem' 
            }}>
              You're Not Alone in This
            </p>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 700, 
              marginBottom: '1.5rem', 
              lineHeight: 1.2 
            }}>
              Found Something in Your Stool That Looks Like a Worm?
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', 
              opacity: 0.95, 
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              We understand how unsettling this can be. Take a breath. 
              You've come to a safe, supportive place to learn more.
            </p>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: '#f0fdfa', 
              borderRadius: '1rem', 
              padding: '2rem',
              borderLeft: '5px solid #14b8a6'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <Heart style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.25rem' }} size={32} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
                    First, Know That Your Feelings Are Valid
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    Discovering something unexpected in your stool can trigger real fear and anxiety. 
                    Maybe your heart is racing. Maybe you've been searching online for hours trying to find answers. 
                    These reactions are completely normal, and we want you to know that <strong>you're taking a positive step</strong> by seeking information.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    The truth is, the vast majority of concerning stool observations turn out to be harmless. 
                    Undigested food, natural body substances, and everyday items frequently create shapes that look alarming but are nothing to worry about.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                    This page offers calm, judgment-free information to help you understand what you might be seeing. 
                    We're here to support you, not to diagnose or replace professional medical care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              What This Might Be
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Educational Information Only — Not Medical Advice
            </p>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '1rem', 
              padding: '2.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '2rem' }}>
                When someone searches for a "worm in stool picture," they're usually trying to compare what they've found to known images. 
                While we cannot tell you what's in your stool, understanding the common categories of stool observations may help put your mind at ease:
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Undigested Food</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      The digestive system doesn't break down everything equally. Fibrous foods like bananas, corn, leafy greens, and seeds often appear in stool looking very different from when they were eaten. Their string-like, elongated shapes frequently resemble worms.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Natural Body Substances</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Your intestines naturally produce mucus to help move waste through. This mucus can form string-like strands that look alarming but are a normal part of digestion. Shedding intestinal lining is also normal and can create unusual appearances.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Environmental Elements</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Sometimes things from our environment, like hair, fibers from clothing or toilet paper, or even small insects in the water, can appear in the toilet and seem to be part of stool when they're not.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <HelpCircle style={{ color: '#f59e0b', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Intestinal Organisms</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      In some cases, actual organisms may be present. While this possibility exists, it's important to know that professional medical testing is the only reliable way to confirm this. A healthcare provider can order appropriate tests if you're concerned.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img 
                src="/images/healthy-food.jpg" 
                alt="Healthy foods that can be mistaken for parasites" 
                style={{ 
                  width: '100%', 
                  maxWidth: '500px', 
                  borderRadius: '1rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Common False Alarms
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              These everyday items cause concern for many people but are completely harmless
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.25rem'
            }}>
              {falseAlarms.map((item, index) => (
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
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2.5rem', 
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.75rem',
              border: '1px solid #bbf7d0'
            }}>
              <p style={{ color: '#166534', fontSize: '1.05rem', margin: 0 }}>
                <strong>Helpful tip:</strong> Think back to your recent meals. Could any of these foods explain what you're seeing? 
                Many false alarms are solved simply by recalling what was eaten in the past 24-48 hours.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f0fdfa' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Brain size={44} style={{ color: '#0d9488' }} />
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
                Our AI visual analysis tool provides a calm, private way to explore what you might be seeing. 
                It's designed to offer educational support and help you feel more informed as you decide on next steps.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Camera style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Visual Pattern Recognition</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Upload a photo and receive educational information about visual characteristics the AI identifies. 
                      Learn about what different features might represent.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Brain style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Educational Insights</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Gain knowledge about different possibilities, common false alarms, and general wellness information 
                      to help you feel more informed and less anxious.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Lock style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Complete Privacy and Security</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      We understand this is deeply personal. Your images are processed with bank-level encryption, 
                      never shared with anyone, and handled with absolute confidentiality.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Heart style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Supportive, Judgment-Free Experience</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Our platform is designed to be a calm, supportive space. No judgment, no embarrassment — 
                      just helpful information delivered with care and understanding.
                    </p>
                  </div>
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
                  <strong>Please understand:</strong> Our tool provides educational information only. 
                  It cannot diagnose medical conditions, identify actual parasites, or replace professional healthcare advice. 
                  If you have health concerns, please consult a qualified healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ 
          padding: '4rem 1rem', 
          background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, marginBottom: '1rem' }}>
              Ready to Explore What You're Seeing?
            </h2>
            <p style={{ fontSize: '1.15rem', marginBottom: '0.75rem', opacity: 0.95, lineHeight: 1.7 }}>
              Get educational insights with our AI-powered visual analysis tool.
            </p>
            <p style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.85 }}>
              Private. Supportive. Informative. No medical advice.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/pricing" 
                style={{ 
                  backgroundColor: 'white', 
                  color: '#0d9488', 
                  padding: '1rem 2.5rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s'
                }}
              >
                Start Your Analysis
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
                  fontSize: '1.1rem',
                  border: '2px solid rgba(255,255,255,0.8)'
                }}
              >
                View Sample Report
              </Link>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Subscription required. Starting at $12.99/month with 3 analysis credits.
            </p>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: '#0f172a', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  style={{ 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '0.875rem',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '1.05rem', paddingRight: '1rem', lineHeight: 1.4 }}>
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={22} style={{ color: '#0d9488', flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={22} style={{ color: '#64748b', flexShrink: 0 }} />
                    )}
                  </button>
                  {openFaq === index && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#64748b', lineHeight: 1.8, fontSize: '1rem' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '2.5rem 1rem', backgroundColor: '#fef2f2' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '1rem', 
              padding: '2rem',
              border: '1px solid #fecaca'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#991b1b' }}>
                Important Medical Disclaimer
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '1rem' }}>
                The information provided on this page and through our AI-powered tool is for <strong>educational purposes only</strong>. 
                It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
                Our AI tool cannot diagnose parasites, infections, or any medical condition.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '1rem' }}>
                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
                Never disregard professional medical advice or delay in seeking it because of something you have read or seen on this website.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '1rem' }}>
                If you believe you may have a medical emergency, call your doctor, go to the emergency department, or contact emergency services immediately. 
                ParasitePro does not recommend or endorse any specific tests, physicians, products, procedures, or opinions.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, margin: 0 }}>
                Visual analysis of images cannot replace laboratory testing or clinical examination. 
                Only a licensed healthcare professional can provide accurate medical diagnoses after proper testing and evaluation.
              </p>
            </div>
          </div>
        </section>

        <footer style={{ padding: '2rem 1rem', backgroundColor: '#1e293b', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
              ParasitePro
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.75rem' }}>
              Educational AI-powered visual analysis for peace of mind
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Terms of Service</Link>
              <Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Contact Us</Link>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '1.5rem' }}>
              © {new Date().getFullYear()} ParasitePro. All rights reserved. Not a medical service.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SeoWormInStoolPage;
