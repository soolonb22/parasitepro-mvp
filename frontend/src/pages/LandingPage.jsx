import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/SEO';
import TrustBar from '../components/TrustBar';
import TrustBadges from '../components/TrustBadges';
import UrgencyTimer from '../components/UrgencyTimer';
import TestimonialsSection from '../components/TestimonialsSection';
import { 
  Star, Shield, Zap, Camera, Brain, FileText, Clock, 
  DollarSign, Target, CheckCircle, ArrowRight, Play,
  MessageCircle, Download, Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spotsRemaining, setSpotsRemaining] = useState(23);

  useEffect(() => {
    const stored = localStorage.getItem('betaSpotsRemaining');
    if (stored) {
      setSpotsRemaining(parseInt(stored, 10));
    } else {
      const randomSpots = Math.floor(Math.random() * 15) + 15;
      setSpotsRemaining(randomSpots);
      localStorage.setItem('betaSpotsRemaining', randomSpots.toString());
    }
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <SEO 
        title="Parasite Identification Pro - AI-Powered Parasite Identification | Fast & Accurate Detection"
        description="Upload health images and get instant AI-powered parasite detection with natural treatment recommendations. Trusted globally. Plans from $5."
        canonical="/"
      />

      {/* Top Navigation Bar */}
      <nav className="landing-nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <img 
            src="/hero-image.png" 
            alt="Parasite Identification Pro"
            className="landing-nav-logo"
            style={{ height: '2rem', width: 'auto', borderRadius: '0.375rem' }}
          />
          <span className="landing-nav-brand" style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Parasite ID Pro</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <Link to="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.15)',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/signup" style={{
                color: '#0d9488',
                backgroundColor: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d9488 0%, #1d4ed8 50%, #7c3aed 100%)'
      }}>
        {/* Animated Background Blobs */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '24rem',
            height: '24rem',
            backgroundColor: '#5eead4',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '24rem',
            height: '24rem',
            backgroundColor: '#93c5fd',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'pulse 4s ease-in-out infinite 1s'
          }}></div>
        </div>

        <div className="landing-hero" style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '4rem 1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* Pre-headline Badge */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#a7f3d0',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '1.5rem'
            }}>
              <span style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }}></span>
              Trusted by 1,000+ Users Worldwide
            </div>

            {/* Main Headline - Question Hook */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 7vw, 3.5rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '1.25rem'
            }}>
              Found Something Strange
              <br />
              <span style={{
                background: 'linear-gradient(90deg, #fcd34d, #fb923c, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                In Your Stool?
              </span>
            </h1>
            
            {/* Subheadline - Clear Value Prop */}
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
              color: '#ccfbf1',
              maxWidth: '38rem',
              margin: '0 auto 1.5rem',
              fontWeight: 300,
              lineHeight: 1.6,
              padding: '0 0.5rem'
            }}>
              AI identifies parasites from your phone in <span style={{ color: '#10b981', fontWeight: 600 }}>3 minutes</span>. 
              No doctor visit. No lab wait times. Just answers.
            </p>

            {/* Trust Indicators Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex' }}>{[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#facc15" color="#facc15" />)}</div>
                <span style={{ color: 'white', fontWeight: 500, fontSize: '0.9rem' }}>4.9/5 Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="#86efac" />
                <span style={{ color: 'white', fontWeight: 500, fontSize: '0.9rem' }}>Bank-Level Security</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} color="#fcd34d" />
                <span style={{ color: 'white', fontWeight: 500, fontSize: '0.9rem' }}>Results in 30 Seconds</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={handleGetStarted}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  padding: '1.1rem 2.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s',
                  transform: 'scale(1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                Get Your First Analysis FREE
                <ArrowRight size={22} />
              </button>
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '1.5rem'
            }}>
              No credit card required • Takes 2 minutes
            </p>

            {/* Urgency Timer */}
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <UrgencyTimer 
                variant="bold" 
                offerName="BETA 50% OFF" 
              />
            </div>

            {/* Secondary CTA */}
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => scrollToSection('how-it-works')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  border: '2px solid rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
              >
                <Play size={18} />
                See How It Works
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <div style={{
            width: '1.5rem',
            height: '2.5rem',
            border: '2px solid white',
            borderRadius: '9999px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '0.5rem'
          }}>
            <div style={{
              width: '0.25rem',
              height: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '9999px',
              animation: 'scroll 2s infinite'
            }}></div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Problem Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)'
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              fontSize: '1rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 500,
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              The Problem
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1rem'
            }}>
              You Found Something Suspicious...
              <br />
              <span style={{ color: '#dc2626' }}>Now What?</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: <Clock size={32} color="#dc2626" />,
                title: "Hours of Panic",
                description: "Searching online leads to confusing, often scary results that may not even be relevant"
              },
              {
                icon: <DollarSign size={32} color="#dc2626" />,
                title: "Expensive Doctor Visits",
                description: "Wait days for appointments, pay high fees, only to be told 'it's probably nothing'"
              },
              {
                icon: <Target size={32} color="#dc2626" />,
                title: "Uncertainty & Fear",
                description: "Not knowing if it's serious or harmless keeps you up at night worrying"
              }
            ].map((problem, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                border: '2px solid #fecaca',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                transition: 'box-shadow 0.3s',
                cursor: 'default'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#fee2e2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  {problem.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                  {problem.title}
                </h3>
                <p style={{ color: '#6b7280' }}>{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #eff6ff 100%)'
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              backgroundColor: '#ccfbf1',
              color: '#0f766e',
              fontSize: '1rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 500,
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              The Solution
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Get Answers in
              <span style={{
                display: 'block',
                background: 'linear-gradient(90deg, #0d9488, #1d4ed8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Under 60 Seconds
              </span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '48rem', margin: '0 auto' }}>
              Our AI analyzes your photo instantly and gives you detailed identification, 
              medical guidance, and peace of mind.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <img 
                src="/hero-image.png" 
                alt="AI Analysis Demo"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  borderRadius: '1.5rem',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  icon: <Camera size={24} color="#0d9488" />,
                  title: "1. Take a Photo",
                  description: "Use your phone camera or upload an existing image. That's it."
                },
                {
                  icon: <Brain size={24} color="#0d9488" />,
                  title: "2. AI Analyzes",
                  description: "Our advanced AI identifies the organism in seconds with 95%+ accuracy."
                },
                {
                  icon: <FileText size={24} color="#0d9488" />,
                  title: "3. Get Results",
                  description: "Receive detailed identification, treatment info, and when to see a doctor."
                }
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#ccfbf1',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#6b7280' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)'
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              backgroundColor: 'rgba(13, 148, 136, 0.2)',
              color: '#5eead4',
              fontSize: '1rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 500,
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              See It In Action
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: 'white',
              marginBottom: '1rem'
            }}>
              AI-Powered Health Analysis
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#9ca3af', maxWidth: '48rem', margin: '0 auto' }}>
              Watch how our cutting-edge technology analyzes health samples in real-time
            </p>
          </div>

          <div className="video-showcase-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
              >
                <source src="/videos/health_analysis_app_promo.mp4" type="video/mp4" />
              </video>
              <div style={{ padding: '0.875rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>Smart Interface</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Clean, intuitive health dashboard</p>
              </div>
            </div>

            <div style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
              >
                <source src="/videos/microscopic_ai_scanning_scene.mp4" type="video/mp4" />
              </video>
              <div style={{ padding: '0.875rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>AI Detection</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Advanced microscopic analysis</p>
              </div>
            </div>

            <div style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
              >
                <source src="/videos/analysis_results_success_scene.mp4" type="video/mp4" />
              </video>
              <div style={{ padding: '0.875rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>Instant Results</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Get answers in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Limited Time Offers - Promotions Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#ff6b6b',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              marginBottom: '1rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              🎉 LIMITED TIME OFFERS
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Unlock Extra Savings Today
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '50rem',
              margin: '0 auto'
            }}>
              Use these exclusive coupon codes when you sign up
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            maxWidth: '500px',
            margin: '0 auto 3rem'
          }}>
            {/* First Month Free */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '3px solid #10b981',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.3s',
              transform: 'scale(1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(16, 185, 129, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(16, 185, 129, 0.15)';
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                💳
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                First Month Free
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Get your first 1 month completely free
              </p>
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '2px solid #10b981',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Coupon Code
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#10b981',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  FREEMONTH25
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                }}
              >
                Claim Offer →
              </button>
            </div>

          </div>

          <div style={{
            backgroundColor: '#fff7ed',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            border: '2px solid #fed7aa'
          }}>
            <p style={{ color: '#7c2d12', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              💡 Pro Tip:
            </p>
            <p style={{ color: '#9a3412', fontSize: '1rem', margin: 0 }}>
              Copy either coupon code above and apply it at checkout to unlock your exclusive savings. These offers are available for new signups only!
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #eff6ff 100%)'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '40rem', margin: '0 auto' }}>
              Comprehensive tools to identify, track, and manage parasite concerns
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: <Brain size={32} color="#0d9488" />, title: "AI Identification", description: "95%+ accuracy powered by GPT-4o Vision" },
              { icon: <FileText size={32} color="#0d9488" />, title: "Detailed Reports", description: "Comprehensive analysis you can share with doctors" },
              { icon: <Camera size={32} color="#0d9488" />, title: "Easy Upload", description: "Take photos directly or upload existing images" },
              { icon: <MessageCircle size={32} color="#0d9488" />, title: "Urgency Levels", description: "Know immediately if you need medical attention" },
              { icon: <Download size={32} color="#0d9488" />, title: "Analysis History", description: "Track all your analyses in one secure dashboard" },
              { icon: <Shield size={32} color="#0d9488" />, title: "Secure & Private", description: "Your health data is encrypted and protected" }
            ].map((feature, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center',
                border: '2px solid #e5e7eb',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#0d9488';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              >
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, #ccfbf1, #dbeafe)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%)'
      }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              backgroundColor: '#fbbf24',
              color: '#111827',
              fontSize: '1.1rem',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              display: 'inline-block',
              marginBottom: '1.5rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              START WITH 1 FREE ANALYSIS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Try Risk-Free, Pay Once
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#ccfbf1' }}>
              Your first analysis is completely FREE • No credit card required
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '3rem',
            maxWidth: '45rem',
            margin: '0 auto',
            border: '4px solid #5eead4',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            {/* Free Trial Box */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎁</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                Try It FREE First!
              </h3>
              <p style={{ color: '#374151' }}>
                Get your first parasite analysis completely free. No credit card required.
              </p>
            </div>

            {/* Pricing */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{
                backgroundColor: '#ccfbf1',
                color: '#0f766e',
                fontSize: '1rem',
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: 500,
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                Flexible Pricing Options
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#111827' }}>From $5</div>
              <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>per analysis</div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem', 
                flexWrap: 'wrap',
                marginTop: '1rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <span>Single $5</span>
                <span>|</span>
                <span>Starter $12.99</span>
                <span>|</span>
                <span>Premium $29.99</span>
                <span>|</span>
                <span>Family $49.99</span>
              </div>
            </div>

            {/* Features List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}>
              {[
                "1 FREE analysis to start",
                "Full AI parasite detection",
                "Detailed medical reports",
                "Urgency level assessment",
                "Analysis history tracking",
                "Secure & private",
                "Credits never expire",
                "No subscription needed"
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={20} color="#10b981" />
                  <span style={{ color: '#374151' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                background: 'linear-gradient(90deg, #0d9488, #1d4ed8)',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 600,
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
            >
              {user ? 'Go to Dashboard' : 'Start FREE Trial'}
              <ArrowRight size={24} />
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', marginTop: '1.5rem' }}>
              Secured by Stripe • One-time payment • No subscription
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '50rem', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            fontSize: '1rem',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 500,
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            No Risk • No Credit Card • Just Try It
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Stop Wondering.
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #0d9488, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Start Knowing.
            </span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '40rem', margin: '0 auto 2rem' }}>
            Join 1000+ people who got peace of mind with instant parasite identification.
            <br />
            <strong style={{ color: '#0d9488' }}>Try your first analysis completely FREE!</strong>
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(90deg, #0d9488, #1d4ed8)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 600,
              padding: '1.25rem 3rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
            }}
          >
            <Sparkles size={28} />
            Get FREE Analysis Now
          </button>
          <p style={{ color: '#9ca3af', marginTop: '1.5rem' }}>
            1 FREE analysis • Plans from $5 • Credits never expire
          </p>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section style={{
        padding: '3rem 1rem',
        backgroundColor: '#fffbeb',
        borderTop: '1px solid #fcd34d'
      }}>
        <div style={{ maxWidth: '50rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
            Medical Disclaimer
          </p>
          <p style={{ fontSize: '0.875rem', color: '#b45309' }}>
            This tool provides informational identification only and is not a medical diagnosis. 
            Always consult a qualified healthcare provider for professional diagnosis and treatment.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1rem',
        backgroundColor: '#111827',
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <img 
            src="/hero-image.png" 
            alt="Parasite Identification Pro" 
            style={{ height: '4rem', width: 'auto', margin: '0 auto 1rem', opacity: 0.8, borderRadius: '0.5rem' }}
          />
          <p>&copy; 2024 Parasite Identification Pro. Educational purposes only.</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Login</Link>
            <Link to="/signup" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Sign Up</Link>
            <Link to="/pricing" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Pricing</Link>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link to="/terms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Terms of Service</Link>
            <Link to="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy Policy</Link>
            <Link to="/disclaimer" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Medical Disclaimer</Link>
            <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Contact</Link>
            <Link to="/faq" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>FAQ</Link>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #374151', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: '#6b7280' }}>Educational Resources</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <Link to="/worm-in-stool-picture" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Worm in Stool Guide</Link>
              <Link to="/dog-worms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Dog Worms Guide</Link>
              <Link to="/encyclopedia" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Parasite Encyclopedia</Link>
              <Link to="/blog" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Health Blog</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
