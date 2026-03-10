import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <SEO 
        title="Terms of Service - Parasite Identification Pro"
        description="Read our Terms of Service to understand your rights and responsibilities when using Parasite Identification Pro."
      />
      
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: '#0d9488', 
            textDecoration: 'none',
            marginBottom: '2rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>
          Terms of Service
        </h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            <strong>Last Updated:</strong> December 2024
          </p>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              By accessing or using Parasite Identification Pro ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>2. Service Description</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              Parasite Identification Pro provides AI-powered image analysis for educational purposes only. Our service uses artificial intelligence to analyze uploaded images and provide informational content about potential parasites. This service is NOT a medical diagnostic tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>3. User Accounts</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when creating an account and to update your information as necessary. You are responsible for all activities that occur under your account.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>4. Credits and Payments</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              Analysis credits are non-refundable once purchased. Credits do not expire. Pricing is subject to change with prior notice. All payments are processed securely through Stripe.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>5. Acceptable Use</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              You agree not to misuse the Service, including but not limited to: uploading inappropriate or offensive content, attempting to reverse engineer the AI system, using the service for illegal purposes, or sharing your account with others.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>6. Limitation of Liability</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              To the maximum extent permitted by law, Parasite Identification Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>7. Changes to Terms</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              We reserve the right to modify these terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>8. Contact</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:fallonbarke4@gmail.com" style={{ color: '#0d9488' }}>fallonbarke4@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
