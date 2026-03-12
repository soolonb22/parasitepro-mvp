import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';

const SAMPLE_REPORT = {
  id: 'SAMPLE-2024-001',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  imageType: 'Stool Sample',
  aiProvider: 'Claude Vision AI',
  
  primaryFinding: {
    name: 'Potential Intestinal Parasite Indicators',
    confidence: 78,
    category: 'Helminth (Roundworm Family)',
    description: 'The AI has detected visual patterns that may be consistent with intestinal parasitic organisms. The observed characteristics include elongated structures and distinctive segmentation patterns that warrant further professional evaluation.'
  },
  
  differentialFindings: [
    {
      name: 'Ascaris-like Structures',
      confidence: 72,
      description: 'Visual patterns resembling roundworm morphology detected in the sample.'
    },
    {
      name: 'Undigested Food Particles',
      confidence: 45,
      description: 'Some observed elements may be dietary remnants rather than parasitic organisms.'
    },
    {
      name: 'Mucus Strands',
      confidence: 38,
      description: 'Fibrous structures that could indicate digestive irregularities or normal mucus secretion.'
    }
  ],
  
  visualFeatures: [
    'Elongated cylindrical structures observed',
    'Segmentation patterns detected in multiple areas',
    'Color variations suggesting organic material',
    'Size estimation: 2-5mm visible structures',
    'Texture analysis indicates biological origin'
  ],
  
  educationalInfo: {
    overview: 'Intestinal parasites are organisms that live in the digestive tract. They are more common than many people realize and can be found worldwide. Understanding these organisms helps in maintaining good digestive health.',
    commonSymptoms: [
      'Digestive discomfort or bloating',
      'Changes in appetite or unexplained weight changes',
      'Fatigue or low energy levels',
      'Digestive irregularities',
      'Abdominal discomfort'
    ],
    prevention: [
      'Wash hands thoroughly before meals and after using the bathroom',
      'Ensure food is properly cooked, especially meats',
      'Drink clean, filtered water',
      'Wash fruits and vegetables before consumption',
      'Practice good hygiene when traveling'
    ],
    naturalSupport: [
      'Pumpkin seeds (traditional digestive support)',
      'Garlic (natural antimicrobial properties)',
      'Papaya seeds (traditional remedy in many cultures)',
      'Probiotic-rich foods for gut health',
      'Fiber-rich diet for digestive regularity'
    ]
  },
  
  urgencyLevel: 'moderate',
  urgencyMessage: 'Consider consulting a healthcare provider for proper evaluation'
};

export default function SampleReportPage() {
  const [activeSection, setActiveSection] = useState('findings');

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return '#059669';
    if (confidence >= 50) return '#d97706';
    return '#6b7280';
  };

  const getUrgencyStyles = (level: string) => {
    const styles: Record<string, any> = {
      low: { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '✓' },
      moderate: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⚠️' },
      high: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '⚠️' },
      emergency: { bg: '#fecaca', border: '#dc2626', text: '#7f1d1d', icon: '🚨' }
    };
    return styles[level] || styles.moderate;
  };

  const urgencyStyles = getUrgencyStyles(SAMPLE_REPORT.urgencyLevel);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Helmet>
        <title>Sample Report Preview | Parasite Identification Pro</title>
        <meta name="description" content="See what a ParasitePro analysis report looks like before you upload" />
      </Helmet>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ backgroundColor: '#0d9488', color: 'white', padding: '1rem', borderRadius: '0.75rem 0.75rem 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '0.25rem' }}>Sample Report Preview</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>ParasitePro Analysis Report</h1>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            Report ID: {SAMPLE_REPORT.id}
          </div>
        </div>

        <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderLeft: '4px solid #f59e0b', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
          <div>
            <strong style={{ color: '#92400e' }}>This is a sample report for demonstration purposes only.</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#78350f' }}>
              The findings shown below are fictional examples to illustrate what you'll receive after uploading your image. No actual analysis has been performed.
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0 0 0.75rem 0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Date</div>
                <div style={{ fontWeight: 600 }}>{SAMPLE_REPORT.date}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Sample Type</div>
                <div style={{ fontWeight: 600 }}>{SAMPLE_REPORT.imageType}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>AI Engine</div>
                <div style={{ fontWeight: 600 }}>{SAMPLE_REPORT.aiProvider}</div>
              </div>
            </div>
          </div>

          <div style={{ ...urgencyStyles, backgroundColor: urgencyStyles.bg, borderLeft: `4px solid ${urgencyStyles.border}`, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{urgencyStyles.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: urgencyStyles.text, textTransform: 'uppercase', fontSize: '0.875rem' }}>
                {SAMPLE_REPORT.urgencyLevel === 'moderate' ? 'Moderate Priority' : SAMPLE_REPORT.urgencyLevel}
              </div>
              <div style={{ color: urgencyStyles.text }}>{SAMPLE_REPORT.urgencyMessage}</div>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
            {['findings', 'differential', 'education', 'guidance'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  color: activeSection === section ? '#0d9488' : '#6b7280',
                  borderBottom: activeSection === section ? '2px solid #0d9488' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                {section === 'findings' && '🔬 Primary Findings'}
                {section === 'differential' && '📊 Other Possibilities'}
                {section === 'education' && '📚 Educational Info'}
                {section === 'guidance' && '🩺 Next Steps'}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.5rem' }}>
            {activeSection === 'findings' && (
              <div>
                <div style={{ backgroundColor: '#f0fdfa', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f766e', margin: 0 }}>{SAMPLE_REPORT.primaryFinding.name}</h3>
                      <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{SAMPLE_REPORT.primaryFinding.category}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: getConfidenceColor(SAMPLE_REPORT.primaryFinding.confidence) }}>
                        {SAMPLE_REPORT.primaryFinding.confidence}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Confidence</div>
                    </div>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>{SAMPLE_REPORT.primaryFinding.description}</p>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Visual Features Detected</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {SAMPLE_REPORT.visualFeatures.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <span style={{ color: '#0d9488' }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'differential' && (
              <div>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                  The AI considers multiple possibilities to provide a comprehensive analysis. Here are other findings that may explain the visual patterns:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {SAMPLE_REPORT.differentialFindings.map((finding, i) => (
                    <div key={i} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: 600, margin: 0 }}>{finding.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '80px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${finding.confidence}%`, height: '100%', backgroundColor: getConfidenceColor(finding.confidence), borderRadius: '4px' }} />
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: getConfidenceColor(finding.confidence) }}>{finding.confidence}%</span>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{finding.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📖</span> Overview
                  </h4>
                  <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>{SAMPLE_REPORT.educationalInfo.overview}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ backgroundColor: '#fef3c7', padding: '1.25rem', borderRadius: '0.75rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#92400e' }}>Common Symptoms to Watch</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {SAMPLE_REPORT.educationalInfo.commonSymptoms.map((s, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', color: '#78350f' }}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#dcfce7', padding: '1.25rem', borderRadius: '0.75rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#166534' }}>Prevention Tips</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {SAMPLE_REPORT.educationalInfo.prevention.map((p, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', color: '#14532d' }}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#e0f2fe', padding: '1.25rem', borderRadius: '0.75rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#0369a1' }}>Natural Digestive Support</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {SAMPLE_REPORT.educationalInfo.naturalSupport.map((n, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', color: '#0c4a6e' }}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'guidance' && (
              <div>
                <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🩺</span> When to Seek Professional Help
                  </h4>
                  <p style={{ margin: '0 0 1rem', color: '#374151' }}>
                    While this AI analysis provides educational insights, we always recommend consulting with a qualified healthcare provider for:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Persistent or worsening symptoms lasting more than a few days</li>
                    <li style={{ marginBottom: '0.5rem' }}>Visible blood or unusual changes in stool</li>
                    <li style={{ marginBottom: '0.5rem' }}>Unexplained weight loss or severe fatigue</li>
                    <li style={{ marginBottom: '0.5rem' }}>Fever accompanying digestive symptoms</li>
                    <li style={{ marginBottom: '0.5rem' }}>Recent international travel to tropical regions</li>
                    <li>Any symptoms causing significant concern or discomfort</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📋</span> Suggested Next Steps
                  </h4>
                  <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#78350f' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Document your symptoms</strong> - Keep track of what you're experiencing using our Health Tracker</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Research and educate</strong> - Browse our Parasite Encyclopedia to learn more</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Consider professional testing</strong> - A healthcare provider can order laboratory tests for definitive diagnosis</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Maintain good hygiene</strong> - Follow prevention tips to protect yourself and others</li>
                    <li><strong>Monitor and follow up</strong> - Track any changes and follow professional recommendations</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Important Disclaimers</h4>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 0.75rem' }}>
                <strong>Educational Purpose Only:</strong> This AI-powered analysis is designed for educational and informational purposes only. It is NOT intended to diagnose, treat, cure, or prevent any disease or health condition.
              </p>
              <p style={{ margin: '0 0 0.75rem' }}>
                <strong>Not Medical Advice:</strong> The information provided should not be considered medical advice. Always consult with qualified healthcare professionals for proper diagnosis and treatment of any health concerns.
              </p>
              <p style={{ margin: '0 0 0.75rem' }}>
                <strong>AI Limitations:</strong> Artificial intelligence has inherent limitations. Results may vary in accuracy and should be verified by laboratory testing and professional medical evaluation.
              </p>
              <p style={{ margin: 0 }}>
                <strong>No Doctor-Patient Relationship:</strong> Use of this service does not create a doctor-patient relationship. By using ParasitePro, you acknowledge these limitations and agree to seek appropriate professional care.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Ready to get your own personalized analysis?</p>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Get Started Free
          </Link>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.75rem' }}>First analysis is free - no credit card required</p>
        </div>
      </div>
    </div>
  );
}
