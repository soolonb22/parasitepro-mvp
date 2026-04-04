import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <SEO 
        title="Privacy Policy - Parasite Identification Pro"
        description="Learn how Parasite Identification Pro collects, uses, and protects your personal information."
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
          Privacy Policy
        </h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            <strong>Last Updated:</strong> December 2024
          </p>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>1. Information We Collect</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
              We collect information you provide directly to us, including:
            </p>
            <ul style={{ color: '#4b5563', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
              <li>Account information (email address, password)</li>
              <li>Images you upload for analysis</li>
              <li>Health information you voluntarily provide</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>2. How We Use Your Information</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
              We use the information we collect to:
            </p>
            <ul style={{ color: '#4b5563', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
              <li>Provide and improve our AI analysis service</li>
              <li>Process payments and manage your account</li>
              <li>Send service-related communications</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>3. Data Security</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              We implement industry-standard security measures to protect your data. All images are encrypted during transmission and storage. Uploaded images are automatically deleted after 30 days. We use secure HTTPS connections and follow best practices for data protection.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>4. Data Sharing</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              We do not sell your personal information. We may share data with trusted service providers who assist in operating our service (e.g., Stripe for payments, cloud hosting providers). We may disclose information if required by law or to protect our rights.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>5. Your Rights</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
              You have the right to:
            </p>
            <ul style={{ color: '#4b5563', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>6. Cookies and Tracking</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              We use essential cookies to maintain your session and preferences. We may use analytics tools (like Google Analytics) to understand how users interact with our service. You can control cookie settings through your browser.
            </p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>7. Contact Us</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              For privacy-related questions or to exercise your rights, contact us at{' '}
              <a href="mailto:fallonbarke4@gmail.com" style={{ color: '#0d9488' }}>fallonbarke4@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
