import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function PromoLandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "Is this as accurate as a lab test?",
      answer: "Our AI is trained on thousands of parasite images with 98% accuracy. However, this is a screening tool, not a replacement for professional medical diagnosis. Always consult your doctor for confirmation."
    },
    {
      question: "How do I take a good sample photo?",
      answer: "Use good lighting, get close enough to see detail, and keep the camera steady. We provide photo guidelines after signup to help you get the best results."
    },
    {
      question: "Is my data private?",
      answer: "Absolutely. Your photos and results are encrypted and stored securely. We never share your data with third parties. Australian privacy laws apply."
    },
    {
      question: "What parasites can you detect?",
      answer: "We detect common parasites including Giardia, roundworms, tapeworms, pinworms, and many others found worldwide. Our database is constantly expanding."
    }
  ];

  return (
    <div className="promo-landing">
      <section className="promo-hero">
        <div className="promo-container">
          <div className="promo-hero-content">
            <h1 className="promo-hero-title">
              Identify Parasites from Your Sample Photos in Minutes
            </h1>
            <p className="promo-hero-subtitle">
              AI-powered analysis • Australian-owned • Private & secure
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="promo-btn promo-btn-primary promo-btn-lg"
            >
              Get Free Analysis Now
            </button>
          </div>
        </div>
      </section>

      <section className="promo-trust-bar">
        <div className="promo-container">
          <div className="promo-trust-grid">
            <div className="promo-trust-item">
              <div className="promo-trust-number">100+</div>
              <div className="promo-trust-label">Australians Trust Us</div>
            </div>
            <div className="promo-trust-item">
              <div className="promo-trust-number">98%</div>
              <div className="promo-trust-label">Detection Accuracy</div>
            </div>
            <div className="promo-trust-item">
              <div className="promo-trust-number">&lt;5min</div>
              <div className="promo-trust-label">Results Time</div>
            </div>
            <div className="promo-trust-item">
              <div className="promo-trust-number">100%</div>
              <div className="promo-trust-label">Money-back Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      <section className="promo-section promo-dark-bg">
        <div className="promo-container">
          <h2 className="promo-section-title">How It Works</h2>
          <div className="promo-steps-grid">
            <div className="promo-step">
              <div className="promo-step-circle">
                <span>1</span>
              </div>
              <h3 className="promo-step-title">Upload Photo</h3>
              <p className="promo-step-desc">Take a photo of your stool, blood, or skin sample</p>
            </div>
            <div className="promo-step">
              <div className="promo-step-circle">
                <span>2</span>
              </div>
              <h3 className="promo-step-title">AI Analyzes</h3>
              <p className="promo-step-desc">Our AI scans for parasites in under 5 minutes</p>
            </div>
            <div className="promo-step">
              <div className="promo-step-circle">
                <span>3</span>
              </div>
              <h3 className="promo-step-title">Get Results</h3>
              <p className="promo-step-desc">Detailed report with parasite identification</p>
            </div>
          </div>
        </div>
      </section>

      <section className="promo-section promo-gray-bg">
        <div className="promo-container">
          <h2 className="promo-section-title">Why Choose Parasite ID Pro?</h2>
          <div className="promo-benefits-grid">
            <div className="promo-benefit">
              <div className="promo-benefit-check">✓</div>
              <div className="promo-benefit-content">
                <h3>Skip the 2-Week Wait</h3>
                <p>Get results in minutes, not weeks like traditional lab testing</p>
              </div>
            </div>
            <div className="promo-benefit">
              <div className="promo-benefit-check">✓</div>
              <div className="promo-benefit-content">
                <h3>Know Before Your Appointment</h3>
                <p>Arrive at your doctor with preliminary findings</p>
              </div>
            </div>
            <div className="promo-benefit">
              <div className="promo-benefit-check">✓</div>
              <div className="promo-benefit-content">
                <h3>100% Private & Confidential</h3>
                <p>Your health data is encrypted and never shared</p>
              </div>
            </div>
            <div className="promo-benefit">
              <div className="promo-benefit-check">✓</div>
              <div className="promo-benefit-content">
                <h3>Affordable Alternative</h3>
                <p>From $4.99 per analysis vs. $50-200 lab fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="promo-section promo-dark-bg">
        <div className="promo-container">
          <h2 className="promo-section-title">Simple, Transparent Pricing</h2>
          <div className="promo-pricing-grid">
            <div className="promo-price-card">
              <h3 className="promo-price-name">First Time Free</h3>
              <div className="promo-price-amount">$0</div>
              <ul className="promo-price-features">
                <li>✓ 1 free analysis</li>
                <li>✓ Full AI report</li>
                <li>✓ No credit card required</li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="promo-btn promo-btn-secondary"
              >
                Try Free Now
              </button>
            </div>
            
            <div className="promo-price-card">
              <h3 className="promo-price-name">5-Pack</h3>
              <div className="promo-price-amount">$19.99</div>
              <ul className="promo-price-features">
                <li>✓ 5 analyses</li>
                <li>✓ Save 20%</li>
                <li>✓ Credits never expire</li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="promo-btn promo-btn-secondary"
              >
                Get Started
              </button>
            </div>

            <div className="promo-price-card promo-price-featured">
              <div className="promo-price-badge">BEST VALUE</div>
              <h3 className="promo-price-name">10-Pack</h3>
              <div className="promo-price-amount promo-price-white">$34.99</div>
              <ul className="promo-price-features promo-price-features-light">
                <li>✓ 10 analyses</li>
                <li>✓ Save 30%</li>
                <li>✓ Credits never expire</li>
                <li>✓ Priority support</li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="promo-btn promo-btn-white"
              >
                Get Best Value
              </button>
            </div>

            <div className="promo-price-card">
              <h3 className="promo-price-name">Single Analysis</h3>
              <div className="promo-price-amount">$4.99</div>
              <ul className="promo-price-features">
                <li>✓ 1 analysis credit</li>
                <li>✓ Full AI report</li>
                <li>✓ Download results</li>
              </ul>
              <button 
                onClick={() => navigate('/signup')}
                className="promo-btn promo-btn-secondary"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="promo-section promo-gray-bg">
        <div className="promo-container promo-faq-container">
          <h2 className="promo-section-title">Frequently Asked Questions</h2>
          <div className="promo-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`promo-faq-item ${openFaq === index ? 'promo-faq-open' : ''}`}
              >
                <button 
                  className="promo-faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <span className="promo-faq-icon">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="promo-faq-answer">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="promo-section promo-dark-bg promo-cta-section">
        <div className="promo-container">
          <h2 className="promo-cta-title">
            Ready to Identify What's Causing Your Symptoms?
          </h2>
          <p className="promo-cta-subtitle">
            Join 100+ Australians who've taken control of their health
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="promo-btn promo-btn-primary promo-btn-lg"
          >
            Start Free Analysis
          </button>
        </div>
      </section>

      <footer className="promo-footer">
        <div className="promo-container">
          <p className="promo-footer-copyright">
            © 2025 Parasite Identification Pro • Australian-Owned Business
          </p>
          <p className="promo-footer-disclaimer">
            <strong>Medical Disclaimer:</strong> This tool is for educational purposes only 
            and not a substitute for professional medical diagnosis.
          </p>
          <div className="promo-footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a href="mailto:support@notworms.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
