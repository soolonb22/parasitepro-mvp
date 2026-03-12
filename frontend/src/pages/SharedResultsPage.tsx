import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';


interface SharedData {
  analysis: any;
  expiresAt: string;
  viewCount: number;
}
export default function SharedResultsPage() {
  const { token } = useParams();
  const [data, setData] = useState<SharedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedResult();
  }, [token]);

  const fetchSharedResult = async () => {
    try {
      const response = await axios.get(`/api/share/view/${token}`);
      setData(response.data);
    } catch (err) {
      setError((err as any)?.response?.data?.error || 'Failed to load shared result');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level: string): Record<string, string> => {
    const colors: Record<string, Record<string, string>> = {
      low: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
      moderate: { bg: '#fef9c3', border: '#eab308', text: '#854d0e' },
      high: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
      critical: { bg: '#fecaca', border: '#dc2626', text: '#7f1d1d' }
    };
    return colors[level] || colors.low;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <p>Loading shared analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SEO title="Shared Analysis - Parasite Identification Pro" />
        <Navbar />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Unable to View Analysis</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { analysis, expiresAt, viewCount } = data;
  const urgencyColors = getUrgencyColor(analysis.urgencyLevel);

  return (
    <div>
      <SEO 
        title="Shared Analysis - Parasite Identification Pro"
        description="View shared health analysis results"
      />
      <Navbar />
      
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
        <div style={{ 
          padding: '1rem 1.5rem', 
          backgroundColor: '#dbeafe', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔗</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500' }}>Shared Analysis</div>
            <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
              This link expires on {new Date(expiresAt).toLocaleDateString()} • Viewed {viewCount} times
            </div>
          </div>
        </div>

        {analysis.urgencyLevel && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: urgencyColors.bg,
            borderLeft: `4px solid ${urgencyColors.border}`,
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              color: urgencyColors.text
            }}>
              <span style={{ fontSize: '1.5rem' }}>
                {analysis.urgencyLevel === 'critical' ? '🚨' : 
                 analysis.urgencyLevel === 'high' ? '⚠️' : 
                 analysis.urgencyLevel === 'moderate' ? '📋' : '✅'}
              </span>
              <div>
                <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                  {analysis.urgencyLevel} Urgency
                </div>
                {analysis.urgencyReason && (
                  <div style={{ fontSize: '0.875rem' }}>{analysis.urgencyReason}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {analysis.imageUrl && (
              <div style={{ width: '200px', flexShrink: 0 }}>
                <img 
                  src={analysis.imageUrl} 
                  alt="Analysis sample"
                  style={{ 
                    width: '100%', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}
                />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {analysis.overallDiagnosis || 'Analysis Results'}
              </h2>
              {analysis.sampleType && (
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Sample Type: {analysis.sampleType}
                </p>
              )}
              {analysis.completedAt && (
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Analyzed: {new Date(analysis.completedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {analysis.aiSummary && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Analysis Summary</h3>
            <p style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{analysis.aiSummary}</p>
          </div>
        )}

        {analysis.fullAnalysis && (
          <>
            {analysis.fullAnalysis.differentialDiagnoses && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Differential Diagnoses</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {analysis.fullAnalysis.differentialDiagnoses.map((dx: any, index: number) => (
                    <div key={index} style={{
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '500' }}>{dx.diagnosis || dx.name}</span>
                        {dx.confidence && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '9999px',
                            fontSize: '0.875rem'
                          }}>
                            {dx.confidence}%
                          </span>
                        )}
                      </div>
                      {dx.reasoning && (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                          {dx.reasoning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.fullAnalysis.naturalTreatments && (
              <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#166534' }}>
                  Natural Treatment Recommendations
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {analysis.fullAnalysis.naturalTreatments.map((treatment: any, index: number) => (
                    <div key={index} style={{
                      padding: '1rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #bbf7d0'
                    }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{treatment.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {treatment.dosage && <span>Dosage: {treatment.dosage}</span>}
                        {treatment.duration && <span> • Duration: {treatment.duration}</span>}
                      </div>
                      {treatment.notes && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem', fontStyle: 'italic' }}>
                          {treatment.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {analysis.disclaimer && (
          <div style={{ 
            padding: '1rem 1.5rem', 
            backgroundColor: '#fef3c7', 
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
              <strong>Medical Disclaimer:</strong> {analysis.disclaimer}
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Need your own analysis?
          </p>
          <Link to="/signup" className="btn btn-primary">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
