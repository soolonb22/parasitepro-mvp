import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, CheckCircle, AlertTriangle, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import SEO from '../components/SEO';

const DemoExperience = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('intro');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const sampleResults = {
    overallDiagnosis: 'Potential Parasitic Infection Detected',
    confidence: 78,
    urgencyLevel: 'moderate',
    findings: [
      { name: 'Possible Roundworm (Ascaris)', confidence: 78, description: 'Elongated structures consistent with adult roundworm morphology' },
      { name: 'Intestinal Inflammation Markers', confidence: 65, description: 'Visual indicators suggest possible inflammatory response' }
    ],
    recommendations: [
      'Consult a healthcare provider for proper diagnosis',
      'Consider stool sample laboratory testing',
      'Review recent travel history to endemic areas',
      'Maintain good hygiene practices'
    ],
    naturalTreatments: [
      { name: 'Garlic', description: 'Natural antimicrobial properties' },
      { name: 'Papaya Seeds', description: 'Traditional anti-parasitic remedy' },
      { name: 'Pumpkin Seeds', description: 'Contains compounds that may help expel parasites' }
    ]
  };

  const startDemo = () => {
    setStep('uploading');
    setTimeout(() => {
      setStep('analyzing');
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setStep('results'), 500);
        }
        setAnalysisProgress(Math.min(progress, 100));
      }, 300);
    }, 1500);
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'low': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <SEO 
        title="Try Demo - Parasite Identification Pro"
        description="Experience our AI-powered parasite analysis with an interactive demo. See how it works before signing up."
      />

      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Sparkles size={40} color="white" />
            </div>
            
            <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Experience AI Analysis
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              See how our advanced AI identifies potential parasites and provides personalized health recommendations - all in seconds.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem'
            }}>
              {[
                { icon: <Zap size={24} />, label: 'Instant Results' },
                { icon: <Shield size={24} />, label: 'Private & Secure' },
                { icon: <CheckCircle size={24} />, label: '95% Accuracy' }
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ color: '#0d9488', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startDemo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              <Camera size={24} />
              Try Demo Analysis
              <ArrowRight size={20} />
            </button>
            
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>
              No signup required - see results instantly
            </p>
          </div>
        )}

        {step === 'uploading' && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '1rem',
              backgroundColor: 'rgba(13, 148, 136, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '2px dashed #0d9488'
            }}>
              <Camera size={48} color="#0d9488" />
            </div>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Uploading Sample Image...</h2>
            <p style={{ color: '#94a3b8' }}>Preparing for AI analysis</p>
          </div>
        )}

        {step === 'analyzing' && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <Loader2 size={64} color="#0d9488" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>AI Analysis in Progress</h2>
            
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              margin: '0 auto 1rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${analysisProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0d9488, #0891b2)',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              {analysisProgress < 30 && 'Preprocessing image...'}
              {analysisProgress >= 30 && analysisProgress < 60 && 'Detecting patterns...'}
              {analysisProgress >= 60 && analysisProgress < 90 && 'Analyzing findings...'}
              {analysisProgress >= 90 && 'Generating report...'}
            </p>
          </div>
        )}

        {step === 'results' && (
          <div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <AlertTriangle size={32} color={getUrgencyColor(sampleResults.urgencyLevel)} />
                <div>
                  <h2 style={{ color: 'white', margin: 0 }}>{sampleResults.overallDiagnosis}</h2>
                  <p style={{ color: '#94a3b8', margin: 0 }}>
                    Confidence: {sampleResults.confidence}% | Urgency: {sampleResults.urgencyLevel}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Detected Findings</h3>
              {sampleResults.findings.map((finding, i) => (
                <div key={i} style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{finding.name}</span>
                    <span style={{ color: '#0d9488' }}>{finding.confidence}% match</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{finding.description}</p>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Natural Treatment Options</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {sampleResults.naturalTreatments.map((treatment, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={18} color="#22c55e" />
                    <div>
                      <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{treatment.name}</span>
                      <span style={{ color: '#94a3b8' }}> - {treatment.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Ready for Your Own Analysis?</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>
                Get detailed reports with personalized treatment recommendations
              </p>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0d9488',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Start Free Analysis
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DemoExperience;
