import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '0.75rem', 
    marginBottom: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  }}>
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <span style={{ fontWeight: 600, color: '#111827', fontSize: '1rem', paddingRight: '1rem' }}>
        {question}
      </span>
      {isOpen ? <ChevronUp size={20} style={{ color: '#6b7280', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: '#6b7280', flexShrink: 0 }} />}
    </button>
    {isOpen && (
      <div style={{ padding: '0 1.25rem 1.25rem', color: '#4b5563', lineHeight: 1.7 }}>
        {answer}
      </div>
    )}
  </div>
);

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does Parasite Identification Pro work?",
      answer: "Simply upload a clear photo of your sample (stool, skin, or other) through our secure platform. Our AI technology analyzes the image using advanced pattern recognition to identify potential parasites. You'll receive detailed results within 30 seconds, including confidence scores and educational information about any findings."
    },
    {
      question: "Is this a medical diagnosis?",
      answer: "No. Parasite Identification Pro is an educational screening tool designed to help you have informed conversations with healthcare providers. It is NOT a substitute for professional medical diagnosis. Always consult a qualified healthcare provider for proper diagnosis and treatment of any health concerns."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI achieves 85-95% accuracy for common parasite species when provided with clear, well-lit images. However, accuracy depends on image quality, lighting conditions, and other factors. Laboratory testing remains the gold standard for definitive parasite detection."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We take privacy seriously. All images are encrypted during upload and transmission. Your images are automatically deleted after 30 days. We never sell or share your personal data with third parties for marketing purposes. We comply with Australian Privacy Principles."
    },
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing: Single Analysis ($4.99), Starter Pack of 3 analyses ($7.99 - best for individuals), and Family Pack of 6 analyses ($14.99 - best value). Credits never expire, and there are no recurring subscription fees."
    },
    {
      question: "Do credits expire?",
      answer: "No! Your purchased credits never expire. Use them whenever you need an analysis, with no time pressure."
    },
    {
      question: "What types of samples can I analyze?",
      answer: "You can upload images of stool samples, skin rashes, or other specimens where parasites may be visible. For best results, ensure good lighting, focus, and a clear view of the area of concern."
    },
    {
      question: "How long does analysis take?",
      answer: "Most analyses complete within 30 seconds. Occasionally, complex images may take up to a minute. You'll receive your results directly in the app as soon as the analysis is complete."
    },
    {
      question: "Can I share results with my doctor?",
      answer: "Yes! You can generate a shareable link to send to your healthcare provider. This link is secure and time-limited. You can also download a PDF report of your analysis to bring to appointments."
    },
    {
      question: "What if the AI doesn't find anything?",
      answer: "A negative result means our AI didn't detect recognizable parasites in your sample. However, this doesn't guarantee you're parasite-free. Some parasites are difficult to detect visually. If you have concerning symptoms, please consult a healthcare provider for laboratory testing."
    },
    {
      question: "Do you offer refunds?",
      answer: "Due to the nature of our digital service, credits are generally non-refundable once purchased. However, if you experience technical issues preventing you from using the service, please contact us at fallonbarke4@gmail.com and we'll work to resolve the issue or provide appropriate compensation."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us at fallonbarke4@gmail.com. We typically respond within 24-48 hours. For urgent matters, include 'URGENT' in your subject line."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <SEO 
        title="FAQ - Parasite Identification Pro"
        description="Find answers to frequently asked questions about Parasite Identification Pro's AI parasite detection service, pricing, privacy, and more."
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
          Frequently Asked Questions
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem' }}>
          Find answers to common questions about our service.
        </p>
        
        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
        
        <div style={{ 
          backgroundColor: '#dcfce7', 
          borderRadius: '0.75rem', 
          padding: '1.5rem', 
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#166534', fontWeight: 500, marginBottom: '0.5rem' }}>
            Still have questions?
          </p>
          <p style={{ color: '#166534' }}>
            Contact us at{' '}
            <a href="mailto:fallonbarke4@gmail.com" style={{ color: '#0d9488', fontWeight: 600 }}>fallonbarke4@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
