import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import axios from 'axios';
import { Check, Zap, Package, Shield, RefreshCw, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import UrgencyTimer from '../components/UrgencyTimer';
import MoneyBackGuarantee from '../components/MoneyBackGuarantee';
import MobilePurchasePrompt from '../components/MobilePurchasePrompt';
import { isNativePlatform, openPurchasePage } from '../utils/mobile';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>{question}</span>
        {isOpen ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
      </button>
      {isOpen && (
        <p style={{ 
          marginTop: '0.75rem', 
          color: '#6b7280', 
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          {answer}
        </p>
      )}
    </div>
  );
};

const PricingPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [showMobilePurchase, setShowMobilePurchase] = useState(false);
  const [purchaseType, setPurchaseType] = useState('bundle');
  
  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI achieves 85-95% accuracy in parasite identification. For best results, ensure good lighting and a clear, focused image. The AI provides confidence scores with each detection to help you understand result reliability."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use bank-level encryption (256-bit SSL) to protect all your data. Your images and health information are never shared with third parties and are processed securely."
    },
    {
      question: "What if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with our service, contact us within 30 days of your purchase for a full refund."
    },
    {
      question: "Do unused credits expire?",
      answer: "No, your purchased credits never expire. Use them whenever you need an analysis."
    },
    {
      question: "Is this a medical diagnosis?",
      answer: "No, our tool provides educational information and preliminary screening only. It is not a substitute for professional medical diagnosis. Always consult a healthcare provider for proper diagnosis and treatment."
    },
    {
      question: "How do I get free beta credits?",
      answer: "Use promo code BETA3FREE when signing up to receive 3 free analysis credits. We're currently in beta testing and appreciate your feedback!"
    }
  ];


  const bundles = [
    {
      id: 'bundle_5',
      name: '5 Credits',
      price: '$19.99',
      credits: 5,
      pricePerCredit: '$4.00',
      color: '#6b7280'
    },
    {
      id: 'bundle_10',
      name: '10 Credits',
      price: '$34.99',
      credits: 10,
      pricePerCredit: '$3.50',
      popular: true,
      color: '#7c3aed'
    },
    {
      id: 'bundle_25',
      name: '25 Credits',
      price: '$74.99',
      credits: 25,
      pricePerCredit: '$3.00',
      color: '#059669'
    }
  ];

  const handlePurchase = async (planId, coupon = '') => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }

    if (isNativePlatform()) {
      setPurchaseType('bundle');
      setShowMobilePurchase(true);
      return;
    }

    setLoading(planId);
    try {
      const response = await axios.post('/api/payment/create-checkout-session', { 
        type: planId, 
        couponCode: coupon 
      });
      window.location.href = response.data.sessionUrl;
    } catch (error) {
      alert('Payment session failed. Please try again.');
      setLoading('');
    }
  };

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      setAppliedCoupon(couponInput);
      setCouponMessage(`Coupon "${couponInput}" will be applied at checkout`);
      setCouponInput('');
      setTimeout(() => setCouponMessage(''), 4000);
    }
  };

  return (
    <div>
      <SEO 
        title="Pricing - Parasite Identification Pro | Credit Bundles"
        description="Purchase AI-powered health analysis credits. Pay only for what you use with our flexible credit bundles."
        canonical="/pricing"
      />
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            BETA TESTING PHASE
          </div>
          <h1 style={{ marginBottom: '0.75rem', fontSize: '2.25rem', fontWeight: 700 }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Pay only for what you use - no subscription required
          </p>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '0.625rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.95rem',
            fontWeight: 500
          }}>
            <RefreshCw size={18} />
            30-Day Money-Back Guarantee
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
            Beta Tester? Use code BETA3FREE at signup for 3 free analyses!
          </h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
            Help us improve by testing the app and sharing your feedback
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          padding: '1.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
            <Shield size={22} style={{ color: '#16a34a' }} />
            <span style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>Bank-Level Security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
            <Clock size={22} style={{ color: '#16a34a' }} />
            <span style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>Cancel Anytime</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
            <Zap size={22} style={{ color: '#16a34a' }} />
            <span style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>Instant AI Results</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Package size={24} style={{ color: '#7c3aed' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Credit Bundles</h2>
            </div>
            <p style={{ color: '#6b7280' }}>
              Purchase credits to analyze your health images with our AI
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {bundles.map((bundle) => (
              <div 
                key={bundle.id}
                className="card" 
                style={{
                  border: bundle.popular ? `2px solid ${bundle.color}` : '1px solid #e5e7eb',
                  position: 'relative',
                  textAlign: 'center',
                  padding: '1.5rem'
                }}
              >
                {bundle.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: bundle.color,
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Best Value
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <Zap size={20} style={{ color: bundle.color }} />
                  <h3 style={{ margin: 0, color: bundle.color }}>{bundle.name}</h3>
                </div>
                
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: '#111827', 
                  marginBottom: '0.25rem' 
                }}>
                  {bundle.price}
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {bundle.pricePerCredit} per credit
                </p>
                
                <button
                  onClick={() => handlePurchase(bundle.id, appliedCoupon)}
                  disabled={loading === bundle.id}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%',
                    backgroundColor: bundle.popular ? bundle.color : undefined,
                    borderColor: bundle.popular ? bundle.color : undefined
                  }}
                >
                  {loading === bundle.id ? 'Processing...' : 'Buy Credits'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.75rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
            Have a Coupon Code?
          </h3>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            maxWidth: '400px',
            margin: '0 auto 1rem',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={handleApplyCoupon}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0, textAlign: 'center' }}>
                {couponMessage}
              </p>
            )}
          </div>
        </div>

        <MoneyBackGuarantee />

        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            How It Works
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                backgroundColor: '#e0f2fe',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>1</div>
              <h4 style={{ marginBottom: '0.25rem' }}>Sign Up Free</h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Create your account in seconds
              </p>
            </div>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                backgroundColor: '#e0f2fe',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>2</div>
              <h4 style={{ marginBottom: '0.25rem' }}>Buy Credits</h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Purchase a credit bundle that fits your needs
              </p>
            </div>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                backgroundColor: '#e0f2fe',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>3</div>
              <h4 style={{ marginBottom: '0.25rem' }}>Analyze</h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Upload images and get AI-powered insights
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <HelpCircle size={24} style={{ color: '#0d9488' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
              Frequently Asked Questions
            </h3>
          </div>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          All prices in USD. This is an educational platform only - always consult a healthcare professional.
        </div>
      </div>

      {showMobilePurchase && (
        <MobilePurchasePrompt 
          type={purchaseType}
          onClose={() => setShowMobilePurchase(false)}
        />
      )}
    </div>
  );
};

export default PricingPage;
