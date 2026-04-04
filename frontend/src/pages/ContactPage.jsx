import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:fallonbarke4@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact from ParasitePro')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <SEO 
        title="Contact Us - Parasite Identification Pro"
        description="Get in touch with the Parasite Identification Pro team. We're here to help with questions about our AI parasite detection service."
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
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          Contact Us
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem' }}>
          Have questions? We'd love to hear from you.
        </p>
        
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                backgroundColor: '#dcfce7', 
                borderRadius: '0.5rem', 
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={24} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>Email Us</h2>
                <a href="mailto:fallonbarke4@gmail.com" style={{ color: '#0d9488', textDecoration: 'none' }}>
                  fallonbarke4@gmail.com
                </a>
              </div>
            </div>
            
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              We typically respond within 24-48 hours. For urgent matters, please include "URGENT" in your subject line.
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                backgroundColor: '#dbeafe', 
                borderRadius: '0.5rem', 
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquare size={24} style={{ color: '#2563eb' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>FAQ</h2>
                <Link to="/faq" style={{ color: '#0d9488', textDecoration: 'none' }}>
                  View Common Questions
                </Link>
              </div>
            </div>
            
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              Many questions are already answered in our FAQ section. Check there first for quick answers!
            </p>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>
            Send a Message
          </h2>
          
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={48} style={{ color: '#16a34a', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                Thanks for reaching out!
              </h3>
              <p style={{ color: '#6b7280' }}>
                Your email client should have opened with a pre-filled message. If not, please email us directly at{' '}
                <a href="mailto:fallonbarke4@gmail.com" style={{ color: '#0d9488' }}>fallonbarke4@gmail.com</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  fontWeight: 600,
                  padding: '0.875rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
