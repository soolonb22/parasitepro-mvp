import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AIChatAssistant from '../components/AIChatAssistant';
import MealPlanSection from '../components/MealPlanSection';
import ShareResultsButton from '../components/ShareResultsButton';
import ResultsUpsellCard from '../components/ResultsUpsellCard';
import axios from 'axios';

const URGENCY_STYLES = {
  low: { bg: '#dcfce7', color: '#166534', icon: '✅', label: 'Low Concern' },
  moderate: { bg: '#fef3c7', color: '#92400e', icon: '⚠️', label: 'Moderate - See Doctor' },
  high: { bg: '#fee2e2', color: '#991b1b', icon: '🚨', label: 'High - See Doctor Soon' },
  emergency: { bg: '#7f1d1d', color: '#ffffff', icon: '🆘', label: 'EMERGENCY - Seek Care Now' }
};

const CONFIDENCE_LEVELS = {
  high: { color: '#10b981', label: 'High Confidence', description: 'Strong diagnostic indicators present' },
  moderate: { color: '#f59e0b', label: 'Moderate Confidence', description: 'Suggestive but not definitive' },
  low: { color: '#ef4444', label: 'Low Confidence', description: 'Further testing recommended' },
  very_low: { color: '#6b7280', label: 'Inconclusive', description: 'Unable to determine with certainty' }
};

const ConfidenceMeter = ({ confidence, size = 'medium' }) => {
  const percentage = Math.round(confidence * 100);
  const getColor = () => {
    if (confidence >= 0.85) return '#10b981';
    if (confidence >= 0.70) return '#f59e0b';
    if (confidence >= 0.50) return '#ef4444';
    return '#6b7280';
  };

  const height = size === 'large' ? '12px' : '8px';
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: size === 'large' ? '0.875rem' : '0.75rem' }}>
        <span style={{ color: '#6b7280' }}>Confidence</span>
        <span style={{ fontWeight: 600, color: getColor() }}>{percentage}%</span>
      </div>
      <div style={{
        width: '100%',
        height,
        backgroundColor: '#e5e7eb',
        borderRadius: '999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: getColor(),
          transition: 'width 0.5s ease-out'
        }} />
      </div>
    </div>
  );
};

const AnalysisMetadataBadge = ({ metadata }) => {
  if (!metadata) return null;
  
  const { confidenceLevel, flaggedForReview, consensusReached } = metadata;
  const level = CONFIDENCE_LEVELS[confidenceLevel] || CONFIDENCE_LEVELS.moderate;
  
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1rem'
    }}>
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: `${level.color}20`,
        color: level.color,
        border: `1px solid ${level.color}40`
      }}>
        {level.label}
      </span>
      
      {flaggedForReview && (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '1px solid #f59e0b40'
        }}>
          📋 Flagged for Review
        </span>
      )}
      
      {consensusReached && (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#dcfce7',
          color: '#166534',
          border: '1px solid #10b98140'
        }}>
          ✓ Consensus Reached
        </span>
      )}
    </div>
  );
};

const DifferentialDiagnosesSection = ({ differentials }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!differentials || differentials.length === 0) return null;
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔍 Differential Diagnoses
        </h2>
        <button style={{
          background: 'none',
          border: '1px solid #6b7280',
          color: '#6b7280',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          {expanded ? 'Hide' : `Show ${differentials.length} alternatives`}
        </button>
      </div>
      
      {!expanded && (
        <p style={{ color: '#6b7280', margin: '0.75rem 0 0 0', fontSize: '0.875rem' }}>
          Other conditions the AI considered based on the analysis.
        </p>
      )}
      
      {expanded && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
            These are alternative diagnoses the AI considered. Higher confidence indicates greater likelihood.
          </p>
          
          {differentials.map((diff, index) => (
            <div 
              key={index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '0.75rem',
                backgroundColor: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{diff.name}</h4>
                <span style={{
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: diff.confidence > 0.5 ? '#fef3c7' : '#f3f4f6',
                  color: diff.confidence > 0.5 ? '#92400e' : '#6b7280'
                }}>
                  {Math.round(diff.confidence * 100)}% likely
                </span>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0' }}>
                {diff.reasoning}
              </p>
              
              {diff.distinguishingTests && (
                <p style={{ fontSize: '0.75rem', color: '#0d9488', margin: '0.5rem 0 0 0' }}>
                  <strong>To confirm/rule out:</strong> {diff.distinguishingTests}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DiagnosticReasoningSection = ({ diagnosticReasoning }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!diagnosticReasoning || (!diagnosticReasoning.analysisSteps?.length && !diagnosticReasoning.observedFeatures?.length)) {
    return null;
  }
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9' }}>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1' }}>
          🧠 How We Reached This Diagnosis
        </h2>
        <button style={{
          background: 'none',
          border: '1px solid #0ea5e9',
          color: '#0ea5e9',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          {expanded ? 'Hide' : 'Show Details'}
        </button>
      </div>
      
      {expanded && (
        <div style={{ marginTop: '1rem' }}>
          {diagnosticReasoning.observedFeatures?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👁️ What We Observed in Your Image
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {diagnosticReasoning.observedFeatures.map((feature, index) => (
                  <span key={index} style={{
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    border: '1px solid #7dd3fc'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {diagnosticReasoning.analysisSteps?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📋 Step-by-Step Analysis
              </h4>
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <div style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '0.5rem',
                  bottom: '0.5rem',
                  width: '2px',
                  backgroundColor: '#7dd3fc'
                }} />
                {diagnosticReasoning.analysisSteps.map((step, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    marginBottom: '1rem',
                    paddingLeft: '1rem'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-1rem',
                      top: '0.25rem',
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {step.step || index + 1}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e0f2fe'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                        {step.description}
                      </p>
                      {step.finding && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#0369a1', fontWeight: 500 }}>
                          Finding: {step.finding}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {diagnosticReasoning.conclusionPath && (
            <div style={{ 
              backgroundColor: '#dbeafe', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #93c5fd'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1e40af' }}>
                🎯 Conclusion
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
                {diagnosticReasoning.conclusionPath}
              </p>
            </div>
          )}
          
          {diagnosticReasoning.confidenceFactors?.length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                Confidence Factors:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#6b7280' }}>
                {diagnosticReasoning.confidenceFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NaturalTreatmentsSection = ({ naturalTreatments }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!naturalTreatments) return null;
  
  const hasContent = naturalTreatments.herbalRemedies?.length > 0 ||
                     naturalTreatments.dietaryRecommendations?.length > 0 ||
                     naturalTreatments.supplements?.length > 0 ||
                     naturalTreatments.lifestyleChanges?.length > 0 ||
                     naturalTreatments.traditionalRemedies?.length > 0 ||
                     naturalTreatments.detoxProtocol;
  
  if (!hasContent) return null;
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #22c55e' }}>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534' }}>
          🌿 Natural Treatment Options
        </h2>
        <button style={{
          background: 'none',
          border: '1px solid #22c55e',
          color: '#22c55e',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          {expanded ? 'Hide' : 'Show Treatments'}
        </button>
      </div>
      
      <p style={{ color: '#166534', margin: '0.75rem 0 0 0', fontSize: '0.8rem', fontStyle: 'italic' }}>
        Holistic and natural approaches - always consult a healthcare provider before starting any treatment
      </p>
      
      {expanded && (
        <div style={{ marginTop: '1.25rem' }}>
          {naturalTreatments.herbalRemedies?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🌱 Herbal Remedies
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {naturalTreatments.herbalRemedies.map((herb, index) => (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <h5 style={{ margin: 0, fontSize: '1rem', color: '#166534', fontWeight: 600 }}>{herb.name}</h5>
                      {herb.dosage && (
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          {herb.dosage}
                        </span>
                      )}
                    </div>
                    {herb.benefits && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#374151' }}>{herb.benefits}</p>}
                    {herb.duration && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#6b7280' }}>Duration: {herb.duration}</p>}
                    {herb.cautions && (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#b45309', backgroundColor: '#fef3c7', padding: '0.5rem', borderRadius: '0.25rem' }}>
                        ⚠️ {herb.cautions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {naturalTreatments.dietaryRecommendations?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🥗 Dietary Recommendations
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {naturalTreatments.dietaryRecommendations.map((diet, index) => (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: '1rem'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{diet.recommendation}</p>
                      {diet.reason && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>{diet.reason}</p>}
                    </div>
                    {diet.duration && (
                      <span style={{ fontSize: '0.75rem', color: '#166534', whiteSpace: 'nowrap' }}>{diet.duration}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {naturalTreatments.supplements?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💊 Supplements
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {naturalTreatments.supplements.map((supp, index) => (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #bbf7d0'
                  }}>
                    <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#166534' }}>{supp.name}</h5>
                    {supp.dosage && <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#6b7280' }}>Dosage: {supp.dosage}</p>}
                    {supp.benefits && <p style={{ margin: 0, fontSize: '0.8rem', color: '#374151' }}>{supp.benefits}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {naturalTreatments.lifestyleChanges?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏃 Lifestyle Changes
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {naturalTreatments.lifestyleChanges.map((change, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                    <strong>{change.change}</strong>
                    {change.reason && <span style={{ color: '#6b7280' }}> - {change.reason}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {naturalTreatments.traditionalRemedies?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🌏 Traditional Remedies
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {naturalTreatments.traditionalRemedies.map((remedy, index) => (
                  <div key={index} style={{
                    backgroundColor: '#fefce8',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fde047'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#854d0e' }}>{remedy.name}</h5>
                      {remedy.origin && (
                        <span style={{ fontSize: '0.7rem', color: '#a16207', backgroundColor: '#fef9c3', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                          {remedy.origin}
                        </span>
                      )}
                    </div>
                    {remedy.usage && <p style={{ margin: 0, fontSize: '0.8rem', color: '#713f12' }}>{remedy.usage}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {naturalTreatments.detoxProtocol && (
            <div style={{
              backgroundColor: '#ecfdf5',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #6ee7b7'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✨ Recommended Detox Protocol
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#065f46' }}>
                {naturalTreatments.detoxProtocol}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AIReasoningSection = ({ synthesis, recommendations }) => {
  const [showReasoning, setShowReasoning] = useState(false);
  
  if (!synthesis && (!recommendations || recommendations.length === 0)) return null;
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setShowReasoning(!showReasoning)}
      >
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🧠 AI Reasoning & Recommendations
        </h2>
        <button style={{
          background: 'none',
          border: '1px solid #2563eb',
          color: '#2563eb',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          {showReasoning ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {!showReasoning && (
        <p style={{ color: '#6b7280', margin: '0.75rem 0 0 0', fontSize: '0.875rem' }}>
          See how the AI reached its conclusion and what actions you should take.
        </p>
      )}
      
      {showReasoning && (
        <div style={{ marginTop: '1rem' }}>
          {synthesis && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>
                How the AI Analyzed This
              </h3>
              
              {synthesis.imageEvidence && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#4b5563' }}>Image Analysis:</strong>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{synthesis.imageEvidence}</p>
                </div>
              )}
              
              {synthesis.symptomCorrelation && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#4b5563' }}>Symptom Correlation:</strong>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{synthesis.symptomCorrelation}</p>
                </div>
              )}
              
              {synthesis.riskFactorAlignment && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#4b5563' }}>Risk Factor Assessment:</strong>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{synthesis.riskFactorAlignment}</p>
                </div>
              )}
            </div>
          )}
          
          {recommendations && recommendations.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>
                Recommended Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: rec.priority === 'immediate' ? '#fef2f2' : 
                                       rec.priority === 'soon' ? '#fffbeb' : 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <span style={{ 
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      {rec.priority === 'immediate' ? '🚨' : rec.priority === 'soon' ? '⏰' : '📋'}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{rec.action}</p>
                      {rec.reason && (
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>{rec.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SuggestedTestsSection = ({ tests }) => {
  if (!tests || tests.length === 0) return null;
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🧪 Suggested Diagnostic Tests
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
        These tests can help confirm the diagnosis. Discuss with your healthcare provider.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tests.map((test, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{test.test}</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>{test.purpose}</p>
            </div>
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 500,
              backgroundColor: test.priority === 'high' ? '#fee2e2' : '#f3f4f6',
              color: test.priority === 'high' ? '#991b1b' : '#6b7280'
            }}>
              {test.priority} priority
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EducationalInfoSection = ({ info, parasiteName }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!info && !parasiteName) return null;
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #10b981' }}>
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534' }}>
          📚 Learn About This Condition
        </h2>
        <button style={{
          background: 'none',
          border: '1px solid #10b981',
          color: '#10b981',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          {expanded ? 'Hide' : 'Learn More'}
        </button>
      </div>
      
      {expanded && info && (
        <div style={{ marginTop: '1rem' }}>
          {info.aboutCondition && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#166534' }}>About</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{info.aboutCondition}</p>
            </div>
          )}
          
          {info.transmission && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#166534' }}>How It Spreads</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{info.transmission}</p>
            </div>
          )}
          
          {info.prevention && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#166534' }}>Prevention Tips</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{info.prevention}</p>
            </div>
          )}
          
          {info.regionalContext && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#ccfbf1', 
              borderRadius: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <strong style={{ fontSize: '0.875rem', color: '#0f766e' }}>🌍 Regional Information:</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#0f766e' }}>{info.regionalContext}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ResultsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittingAnswers, setSubmittingAnswers] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [showChatAssistant, setShowChatAssistant] = useState(true);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(() => {
      if (data?.analysis?.status === 'processing' || data?.analysis?.status === 'pending') {
        fetchResults();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, data?.analysis?.status]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`/api/analysis/analyses/${id}`);
      setData(response.data);
    } catch (err) {
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitAnswers = async () => {
    if (Object.keys(selectedAnswers).length === 0) return;
    
    setSubmittingAnswers(true);
    try {
      const response = await axios.post(`/api/analysis/analyses/${id}/answers`, {
        answers: selectedAnswers
      });
      
      setData(prev => ({
        ...prev,
        analysis: {
          ...prev.analysis,
          summary: response.data.refinedAnalysis.summary,
          urgencyLevel: response.data.refinedAnalysis.urgencyLevel,
          urgencyReason: response.data.refinedAnalysis.urgencyReason,
          disclaimer: response.data.refinedAnalysis.disclaimer
        },
        followUpQuestions: response.data.refinedAnalysis.followUpQuestions || []
      }));
      
      setSelectedAnswers({});
    } catch (err) {
      console.error('Failed to submit answers:', err);
    } finally {
      setSubmittingAnswers(false);
    }
  };

  if (loading) {
    return (
      <div>
        <SEO 
          title="Analysis Results - Parasite Identification Pro"
          description="View your health analysis results with detailed information and recommendations."
          canonical="/results"
        />
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
          Loading results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SEO 
          title="Analysis Results - Parasite Identification Pro"
          description="View your health analysis results."
          canonical="/results"
        />
        <div className="container" style={{ padding: '2rem' }}>
          <div style={{ color: '#991b1b', textAlign: 'center' }}>{error}</div>
        </div>
      </div>
    );
  }

  const { analysis, detections, followUpQuestions } = data;
  const urgencyStyle = URGENCY_STYLES[analysis.urgencyLevel] || URGENCY_STYLES.low;
  const isProcessing = analysis.status === 'processing' || analysis.status === 'pending';
  
  let enhancedData = {};
  try {
    if (analysis.fullAiJson) {
      enhancedData = typeof analysis.fullAiJson === 'string' 
        ? JSON.parse(analysis.fullAiJson) 
        : analysis.fullAiJson;
    }
  } catch (e) {
    console.log('No enhanced data available');
  }

  const {
    primaryDiagnosis,
    differentialDiagnoses,
    synthesis,
    recommendations,
    suggestedTests,
    educationalInfo,
    analysisMetadata,
    emergencyAssessment,
    confidence,
    diagnosticReasoning,
    naturalTreatments
  } = enhancedData;

  return (
    <div>
      <SEO 
        title="Analysis Results - Parasite Identification Pro"
        description="View your health analysis results with detailed information and recommendations."
        canonical="/results"
      />
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/dashboard" style={{ color: '#2563eb' }}>
            ← Back to Dashboard
          </Link>
          {analysis && analysis.status === 'completed' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ShareResultsButton analysisId={id} />
              <button
                onClick={() => {
                  window.open(`/api/meal-plan/pdf/${id}`, '_blank');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                <span>📄</span>
                Download PDF Report
              </button>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Analysis Results
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          {analysis.domain ? `${analysis.domain.charAt(0).toUpperCase() + analysis.domain.slice(1)} Analysis` : 'Health Analysis'}
        </p>

        {isProcessing ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔬</div>
            <h2>Analyzing Your Image...</h2>
            <p style={{ color: '#6b7280' }}>Our AI is carefully examining your image. This usually takes 5-15 seconds.</p>
            <div style={{ 
              width: '200px', 
              height: '4px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '999px',
              margin: '1.5rem auto',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#0d9488',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            </div>
          </div>
        ) : analysis.status === 'failed' ? (
          <div className="card" style={{ backgroundColor: '#fee2e2', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ color: '#991b1b' }}>Analysis Failed</h2>
            <p>We couldn't analyze this image. Please try uploading again with a clearer photo.</p>
            <Link to="/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Try Again
            </Link>
          </div>
        ) : (
          <>
            {emergencyAssessment?.hasEmergency && (
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#7f1d1d',
                color: 'white',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                border: '3px solid #ef4444',
                animation: 'pulse 2s infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>🆘</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>EMERGENCY - SEEK IMMEDIATE MEDICAL CARE</h2>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
                      {emergencyAssessment.message || 'This finding requires immediate medical attention. Please go to the emergency room or call emergency services NOW.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!emergencyAssessment?.hasEmergency && analysis.urgencyLevel && analysis.urgencyLevel !== 'low' && (
              <div style={{
                padding: '1rem 1.5rem',
                backgroundColor: urgencyStyle.bg,
                color: urgencyStyle.color,
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{urgencyStyle.icon}</span>
                <div>
                  <strong style={{ display: 'block' }}>
                    {analysis.urgencyLevel === 'emergency' ? 'SEEK IMMEDIATE MEDICAL ATTENTION' :
                     analysis.urgencyLevel === 'high' ? 'See a Doctor Soon' :
                     'Medical Consultation Recommended'}
                  </strong>
                  {analysis.urgencyReason && <span>{analysis.urgencyReason}</span>}
                </div>
              </div>
            )}

            <AnalysisMetadataBadge metadata={analysisMetadata} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) 1.5fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div className="card">
                <img
                  src={analysis.imageUrl}
                  alt="Sample"
                  style={{
                    width: '100%',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                  }}
                />
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Type:</strong> {analysis.domain || analysis.sampleType || 'Auto-detected'}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Uploaded:</strong> {new Date(analysis.uploadedAt).toLocaleDateString()}
                  </div>
                  {analysis.location && (
                    <div style={{ marginBottom: '0.5rem' }}><strong>Location:</strong> {analysis.location}</div>
                  )}
                </div>
                
                {confidence !== undefined && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Overall Confidence</h4>
                    <ConfidenceMeter confidence={confidence} size="large" />
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                      {confidence >= 0.85 ? 'Strong diagnostic indicators present' :
                       confidence >= 0.70 ? 'Suggestive findings - consider testing' :
                       confidence >= 0.50 ? 'Inconclusive - further evaluation needed' :
                       'Unable to determine with certainty'}
                    </p>
                  </div>
                )}
              </div>

              <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🤖 AI Analysis Summary
                </h2>
                
                {primaryDiagnosis && (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    border: '1px solid #10b981'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#166534' }}>
                          Primary Finding: {primaryDiagnosis.name}
                        </h3>
                        {primaryDiagnosis.scientificName && (
                          <p style={{ margin: '0.25rem 0 0 0', fontStyle: 'italic', color: '#6b7280', fontSize: '0.875rem' }}>
                            {primaryDiagnosis.scientificName}
                          </p>
                        )}
                      </div>
                    </div>
                    {primaryDiagnosis.reasoning && (
                      <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                        {primaryDiagnosis.reasoning}
                      </p>
                    )}
                    {primaryDiagnosis.confidence && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <ConfidenceMeter confidence={primaryDiagnosis.confidence} />
                      </div>
                    )}
                  </div>
                )}
                
                {analysis.summary ? (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '0.5rem',
                    lineHeight: 1.7,
                    marginBottom: '1rem'
                  }}>
                    {analysis.summary}
                  </div>
                ) : detections.length === 0 && !primaryDiagnosis ? (
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#dcfce7', 
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                    <p style={{ color: '#166534', fontWeight: 500 }}>No concerning findings detected</p>
                    <p style={{ color: '#15803d', fontSize: '0.875rem' }}>
                      The AI did not identify any parasites or abnormalities in this image.
                    </p>
                  </div>
                ) : null}

                {detections.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Findings ({detections.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {detections.map((detection) => (
                        <div
                          key={detection.id}
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            backgroundColor: 'white'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '0.5rem'
                          }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                                {detection.commonName}
                              </h4>
                              {detection.scientificName && (
                                <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#6b7280', margin: 0 }}>
                                  {detection.scientificName}
                                </p>
                              )}
                            </div>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              backgroundColor: URGENCY_STYLES[detection.urgencyLevel]?.bg || '#f3f4f6',
                              color: URGENCY_STYLES[detection.urgencyLevel]?.color || '#374151'
                            }}>
                              {detection.urgencyLevel}
                            </span>
                          </div>

                          <div style={{ marginTop: '0.5rem' }}>
                            <ConfidenceMeter confidence={detection.confidenceScore} />
                          </div>

                          <div style={{
                            marginTop: '0.75rem',
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.25rem'
                          }}>
                            <div><strong>Type:</strong> {detection.parasiteType}</div>
                            {detection.lifeStage && detection.lifeStage !== 'N/A' && (
                              <div><strong>Stage:</strong> {detection.lifeStage}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DiagnosticReasoningSection diagnosticReasoning={diagnosticReasoning} />
            
            <NaturalTreatmentsSection naturalTreatments={naturalTreatments} />
            
            <DifferentialDiagnosesSection differentials={differentialDiagnoses} />
            
            <AIReasoningSection synthesis={synthesis} recommendations={recommendations} />
            
            <SuggestedTestsSection tests={suggestedTests} />
            
            <EducationalInfoSection info={educationalInfo} parasiteName={primaryDiagnosis?.name} />

            {followUpQuestions && followUpQuestions.length > 0 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: showQA ? '1rem' : 0
                }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    💬 Help Us Narrow It Down
                  </h2>
                  <button
                    onClick={() => setShowQA(!showQA)}
                    style={{
                      background: 'none',
                      border: '1px solid #0d9488',
                      color: '#0d9488',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {showQA ? 'Hide Questions' : 'Answer Questions'}
                  </button>
                </div>
                
                {!showQA && (
                  <p style={{ color: '#6b7280', margin: '0.75rem 0 0 0', fontSize: '0.875rem' }}>
                    Answer a few quick questions to help the AI provide more accurate recommendations.
                  </p>
                )}

                {showQA && (
                  <div>
                    <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      Your answers help refine the analysis and provide better recommendations.
                    </p>
                    
                    {followUpQuestions.map((q, index) => (
                      <div key={q.id || index} style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                          {index + 1}. {q.question}
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {(q.options || []).map(option => (
                            <button
                              key={option}
                              onClick={() => handleAnswerSelect(q.id || `q${index}`, option)}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                border: selectedAnswers[q.id || `q${index}`] === option 
                                  ? '2px solid #0d9488' 
                                  : '1px solid #e5e7eb',
                                backgroundColor: selectedAnswers[q.id || `q${index}`] === option 
                                  ? '#f0fdfa' 
                                  : 'white',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s'
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={submitAnswers}
                      disabled={Object.keys(selectedAnswers).length === 0 || submittingAnswers}
                      className="btn btn-primary"
                      style={{ marginTop: '0.5rem' }}
                    >
                      {submittingAnswers ? 'Updating Analysis...' : 'Update Analysis with My Answers'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <MealPlanSection analysisId={id} analysisData={analysis} />

            <ResultsUpsellCard />

            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '0.75rem',
              border: '1px solid #f59e0b',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#92400e' }}>
                ⚠️ Important Medical Disclaimer
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f', lineHeight: 1.6 }}>
                {analysis.disclaimer || 
                  'This AI analysis is for educational purposes only and is not a substitute for professional medical diagnosis. Always consult with a qualified healthcare provider for medical advice, diagnosis, and treatment.'}
              </p>
            </div>
          </>
        )}
      </div>

      {showChatAssistant && data?.analysis && data.analysis.status === 'completed' && (
        <AIChatAssistant 
          analysisId={id}
          analysisData={data.analysis}
          onClose={() => setShowChatAssistant(false)}
        />
      )}
    </div>
  );
};

export default ResultsPage;
