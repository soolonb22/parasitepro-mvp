
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <SEO 
        title="Medical Disclaimer - Parasite Identification Pro"
        description="Important medical disclaimer about the educational nature of Parasite Identification Pro's AI analysis service."
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
          Medical Disclaimer
        </h1>
        
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '2px solid #f59e0b', 
          borderRadius: '0.75rem', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={28} style={{ color: '#d97706', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
              Important: This is NOT a Medical Diagnosis Tool
            </p>
            <p style={{ color: '#92400e' }}>
              Parasite Identification Pro is designed for educational and informational purposes only. 
              It should never be used as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Educational Purpose Only</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              The AI analysis provided by Parasite Identification Pro is intended solely for educational purposes. Our service uses artificial intelligence to analyze images and provide informational content about potential parasites. The results should be used to facilitate informed discussions with qualified healthcare professionals.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Not Medical Advice</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              The information provided through our service does not constitute medical advice and should not be relied upon as such. Our AI analysis cannot replace the expertise of licensed healthcare providers who can conduct proper examinations, order laboratory tests, and provide accurate diagnoses.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Accuracy Limitations</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              While we strive for high accuracy (85-95% for common species), our AI system has limitations. Image quality, lighting conditions, and other factors can affect results. False positives and false negatives can occur. Laboratory testing remains the gold standard for parasite detection.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>When to Seek Medical Help</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
              You should consult a healthcare provider immediately if you experience:
            </p>
            <ul style={{ color: '#4b5563', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
              <li>Severe abdominal pain or cramping</li>
              <li>Blood in stool or urine</li>
              <li>High fever or chills</li>
              <li>Significant unexplained weight loss</li>
              <li>Persistent diarrhea or vomiting</li>
              <li>Signs of dehydration</li>
              <li>Any symptoms that concern you</li>
            </ul>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Treatment Recommendations</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              Any natural treatment or remedy suggestions provided are for informational purposes only. Never begin any treatment protocol without first consulting a qualified healthcare provider. Some parasitic infections require prescription medication and professional medical supervision.
            </p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Your Responsibility</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              By using Parasite Identification Pro, you acknowledge and accept that the service is for educational purposes only. You agree to seek professional medical advice for any health concerns. You take full responsibility for how you use the information provided.
            </p>
          </section>
        </div>
        
        <div style={{ 
          backgroundColor: '#dcfce7', 
          borderRadius: '0.75rem', 
          padding: '1.5rem', 
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#166534', fontWeight: 500 }}>
            Have questions? Contact us at{' '}
            <a href="mailto:fallonbarke4@gmail.com" style={{ color: '#0d9488' }}>fallonbarke4@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
