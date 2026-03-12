// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Camera, Brain, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Heart, Lock, PawPrint } from 'lucide-react';

const SeoDogWormsPage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      question: "What are the most common types of worms in dogs?",
      answer: "Dogs can be affected by several types of intestinal worms. The most common include roundworms (which look like spaghetti), hookworms (tiny and thread-like), whipworms (whip-shaped), and tapeworms (flat, segmented, rice-like pieces). Each type has different characteristics and may require different approaches. A veterinarian can identify the specific type through testing."
    },
    {
      question: "How do I know if my dog has worms?",
      answer: "Common signs that may indicate worms include visible worms or segments in stool or around the rear end, scooting behavior, increased appetite with weight loss, dull coat, bloated belly (especially in puppies), diarrhea or vomiting, and lethargy. However, many dogs with worms show no obvious symptoms at all, which is why regular veterinary checkups are important."
    },
    {
      question: "Can your AI tool diagnose worms in my dog?",
      answer: "No, our AI cannot diagnose any medical condition in pets or humans. It's designed purely as an educational resource to help you understand visual patterns and learn about possibilities. Only a licensed veterinarian can provide accurate diagnosis after proper examination and fecal testing. Our tool offers informational support, not veterinary advice."
    },
    {
      question: "Are dog worms contagious to humans?",
      answer: "Some types of dog worms can potentially be transmitted to humans, which is called zoonotic transmission. Roundworms and hookworms are the most common concerns. This is why proper hygiene, regular deworming of pets, and prompt cleanup of pet waste are important. Children are particularly vulnerable. If you have concerns about potential exposure, consult a healthcare provider."
    },
    {
      question: "What do tapeworm segments look like in dog stool?",
      answer: "Tapeworm segments often look like small grains of rice or cucumber seeds. They may appear white or cream-colored and can sometimes be seen moving. You might notice them in fresh stool, stuck to fur around your dog's rear end, or on bedding where your dog sleeps. Dried segments may look like sesame seeds."
    },
    {
      question: "How do dogs get worms in the first place?",
      answer: "Dogs can get worms in many ways: ingesting contaminated soil or feces, eating infected prey animals (mice, rabbits, birds), flea infestations (which can transmit tapeworms), mosquito bites (which can transmit heartworms), from their mother during pregnancy or nursing, or eating raw or undercooked meat. Regular prevention is the best approach."
    },
    {
      question: "Should I see a vet if I find worms in my dog's stool?",
      answer: "Yes, consulting a veterinarian is always recommended if you notice worms or anything unusual in your dog's stool. A vet can properly identify the type of worm through fecal testing and prescribe appropriate treatment. Over-the-counter dewormers don't treat all types of worms, so professional guidance ensures your pet gets the right care."
    },
    {
      question: "How often should dogs be dewormed?",
      answer: "Deworming schedules vary based on your dog's age, lifestyle, and risk factors. Puppies typically need more frequent deworming during their first few months. Adult dogs may be dewormed every 3-6 months depending on their exposure risk. Dogs that hunt, eat raw food, or have frequent contact with other animals may need more frequent prevention. Your veterinarian can recommend the best schedule for your specific pet."
    }
  ];

  const falseAlarms = [
    { item: "Mucus strands", description: "Normal intestinal mucus can form string-like shapes that look concerning but are often harmless" },
    { item: "Undigested food", description: "Certain foods like bean sprouts, noodles, or rice can pass through and resemble worms" },
    { item: "Grass or plant fibers", description: "If your dog eats grass, the fibers may appear worm-like in stool" },
    { item: "Fly larvae (maggots)", description: "If stool sits outside, flies may lay eggs that hatch into larvae, not from inside the dog" },
    { item: "Hair or fur", description: "Ingested fur from grooming can form elongated shapes in stool" },
    { item: "Environmental debris", description: "String, thread, or small items your dog may have eaten" }
  ];

  const wormTypes = [
    { name: "Roundworms", appearance: "Long, spaghetti-like worms, 3-5 inches, cream/tan colored", notes: "Most common in puppies, can cause pot-bellied appearance" },
    { name: "Tapeworms", appearance: "Flat, segmented, rice or cucumber seed-like pieces", notes: "Often seen near rear end or in fresh stool, associated with fleas" },
    { name: "Hookworms", appearance: "Very small, thin, not usually visible to naked eye", notes: "May cause bloody stool, anemia, especially in puppies" },
    { name: "Whipworms", appearance: "Thin with thicker end, whip-shaped, rarely seen", notes: "Live in large intestine, can cause watery, bloody diarrhea" }
  ];

  return (
    <>
      <Helmet>
        <title>Dog Worms - What Pet Owners Need to Know | ParasitePro</title>
        <meta name="description" content="Worried about worms in your dog's stool? Get calm, supportive information about what you might be seeing. Learn common types and when to visit your vet." />
        <meta name="keywords" content="dog worms, worms in dog stool, dog worm pictures, roundworms in dogs, tapeworms in dogs, worms in dog poop, dog parasites, puppy worms, what do dog worms look like" />
        <link rel="canonical" href="https://parasitepro.com/dog-worms" />
        <meta property="og:title" content="Dog Worms - Understanding Worms in Your Dog's Stool | ParasitePro" />
        <meta property="og:description" content="Concerned about something in your dog's stool? Get supportive, educational information about dog worms and AI-powered visual analysis." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://parasitepro.com/dog-worms" />
        <meta property="og:site_name" content="ParasitePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dog Worms - What Pet Owners Need to Know" />
        <meta name="twitter:description" content="Educational guide to understanding worms in dogs. Calm, supportive information for worried pet owners." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ParasitePro" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Dog Worms - Identifying Worms in Dog Stool",
            "description": "Educational resource helping pet owners understand worms in dogs with supportive guidance and AI-powered visual analysis",
            "url": "https://parasitepro.com/dog-worms",
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
            "headline": "Dog Worms: Understanding What You Might Be Seeing in Your Pet's Stool",
            "description": "A calm, supportive guide to understanding worms in dogs, common types, false alarms, and when to seek veterinary care.",
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
            backgroundImage: 'url(/images/healthy-dog.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }} />
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <PawPrint size={48} style={{ opacity: 0.9 }} />
            </div>
            <p style={{ 
              fontSize: '0.9rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              opacity: 0.9, 
              marginBottom: '1rem' 
            }}>
              For Worried Pet Parents
            </p>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 700, 
              marginBottom: '1.5rem', 
              lineHeight: 1.2 
            }}>
              Noticed Something in Your Dog's Stool That Looks Like Worms?
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', 
              opacity: 0.95, 
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              We understand how worrying this can be. Your furry friend can't tell you what's wrong, 
              and that uncertainty is stressful. Let's help you understand what you might be seeing.
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
                    First, Take a Breath — You're Being a Good Pet Parent
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    Finding something unexpected in your dog's stool can trigger immediate concern. 
                    Maybe you're worried about your pet's health. Maybe you're concerned about your family's safety. 
                    These feelings are completely natural, and <strong>seeking information is exactly the right thing to do</strong>.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
                    The good news is that intestinal worms in dogs, while common, are usually very treatable. 
                    Many dogs will experience worms at some point in their lives, especially puppies. 
                    With proper veterinary care, most worm infestations are resolved quickly and completely.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                    This page provides calm, educational information to help you understand what you might be seeing. 
                    Remember, this is not veterinary advice — always consult your vet for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              What This Might Be
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Educational Information Only — Not Veterinary Advice
            </p>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '1rem', 
              padding: '2.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#334155', marginBottom: '2rem' }}>
                When pet owners search for "dog worms," they're usually trying to identify what they've found. 
                Here are the most common types of intestinal worms that can affect dogs:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {wormTypes.map((worm, index) => (
                  <div key={index} style={{ 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '0.75rem', 
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <HelpCircle size={20} style={{ color: '#0d9488' }} />
                      <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{worm.name}</strong>
                    </div>
                    <p style={{ color: '#334155', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                      <strong>Appearance:</strong> {worm.appearance}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {worm.notes}
                    </p>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                backgroundColor: '#eff6ff', 
                borderRadius: '0.75rem', 
                padding: '1.25rem', 
                marginTop: '2rem',
                border: '1px solid #bfdbfe'
              }}>
                <p style={{ color: '#1e40af', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                  <strong>Remember:</strong> Visual identification alone cannot confirm worm type. 
                  A veterinarian can perform fecal testing to accurately identify parasites and recommend appropriate treatment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '2rem'
            }}>
              <img 
                src="/images/healthy-dog.jpg" 
                alt="Happy healthy dog" 
                style={{ 
                  width: '100%', 
                  maxWidth: '450px', 
                  borderRadius: '1rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0f172a', textAlign: 'center' }}>
              Common False Alarms
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Not everything that looks like a worm is actually a worm
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
                <strong>Pro tip:</strong> If you're not sure, take a clear photo of what you found. 
                This can be helpful for your veterinarian to review, even if it turns out to be nothing concerning.
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
                Our AI visual analysis tool provides a private way to explore what you might be seeing in your pet's stool. 
                It's designed to offer educational support and help you feel more informed before visiting the vet.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Camera style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Visual Pattern Recognition</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Upload a photo and receive educational information about visual characteristics. 
                      Our AI can help you understand what different types of parasites typically look like.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Brain style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Educational Insights</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Learn about different possibilities, common false alarms, and general wellness information 
                      to help you have more informed conversations with your veterinarian.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Lock style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Private and Secure</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Your images are processed with bank-level encryption and never shared. 
                      We understand this can be an embarrassing topic — your privacy is our priority.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <PawPrint style={{ color: '#0d9488', flexShrink: 0, marginTop: '0.3rem' }} size={22} />
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>Peace of Mind for Pet Parents</strong>
                    <p style={{ color: '#64748b', marginTop: '0.35rem', lineHeight: 1.7 }}>
                      Get initial insights while you wait for a vet appointment. 
                      Understanding possibilities can help reduce anxiety and prepare you for the visit.
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
                  <strong>Important:</strong> Our tool provides educational information only. 
                  It cannot diagnose parasites or any condition in pets. Always consult a licensed veterinarian for proper diagnosis and treatment of your pet.
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
              Want to Learn More About What You're Seeing?
            </h2>
            <p style={{ fontSize: '1.15rem', marginBottom: '0.75rem', opacity: 0.95, lineHeight: 1.7 }}>
              Get educational insights with our AI-powered visual analysis tool.
            </p>
            <p style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.85 }}>
              Private. Supportive. Informative. Not veterinary advice.
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
                  fontSize: '1.1rem',
                  border: '2px solid rgba(255,255,255,0.8)'
                }}
              >
                View Sample Report
              </Link>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Starting at $12.99/month with 3 analysis credits included.
            </p>
          </div>
        </section>

        <section style={{ padding: '3.5rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: '#0f172a', textAlign: 'center' }}>
              Frequently Asked Questions About Dog Worms
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
                Important Disclaimer
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '1rem' }}>
                The information provided on this page and through our AI-powered tool is for <strong>educational purposes only</strong>. 
                It is not intended to replace professional veterinary advice, diagnosis, or treatment. 
                Our AI tool cannot diagnose parasites or any medical condition in pets.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '1rem' }}>
                Always consult a licensed veterinarian for any concerns about your pet's health. 
                Never delay seeking veterinary care because of something you have read on this website. 
                If you believe your pet has a medical emergency, contact your veterinarian or emergency animal hospital immediately.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '1rem' }}>
                Visual analysis of images cannot replace laboratory fecal testing or veterinary examination. 
                Many parasites require microscopic examination or specific tests to accurately identify.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#7f1d1d', lineHeight: 1.7, margin: 0 }}>
                ParasitePro does not recommend or endorse any specific treatments, medications, or veterinary services. 
                Treatment should only be administered under the guidance of a qualified veterinary professional.
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
              © {new Date().getFullYear()} ParasitePro. All rights reserved. Not a veterinary or medical service.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SeoDogWormsPage;
