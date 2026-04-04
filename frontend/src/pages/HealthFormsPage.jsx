import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

export default function HealthFormsPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [completedForms, setCompletedForms] = useState([]);
  const [showResults, setShowResults] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [formsRes, profileRes, responsesRes] = await Promise.all([
        axios.get('/api/health/forms', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/health/profile', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/health/responses', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setForms(formsRes.data.forms);
      setProfile(profileRes.data.profile);
      setCompletedForms(responsesRes.data.responses);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadForm = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/health/forms/${formId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedForm(res.data);
      setResponses(res.data.previousResponse?.responses || {});
    } catch (error) {
      console.error('Error loading form:', error);
    }
  };

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelectToggle = (questionId, value) => {
    setResponses(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/health/forms/${selectedForm.id}/submit`, 
        { responses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowResults(res.data.analysis);
      fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const value = responses[question.id];

    switch (question.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
          />
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
          >
            <option value="">Select an option</option>
            {question.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {question.options?.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMultiSelectToggle(question.id, opt)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  backgroundColor: (value || []).includes(opt) ? '#0d9488' : '#e5e7eb',
                  color: (value || []).includes(opt) ? 'white' : '#374151'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
          />
        );
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Helmet>
        <title>Health Forms | Parasite Identification Pro</title>
        <meta name="description" content="Complete health questionnaires for personalized analysis" />
      </Helmet>
      <Navbar />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>Health Questionnaires</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Complete these forms to help our AI provide better personalized analysis</p>
        </div>

        {profile && (
          <div style={{ backgroundColor: '#ecfdf5', padding: '1rem 1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #a7f3d0' }}>
            <p style={{ color: '#065f46', fontWeight: 500 }}>
              Health profile active - Your information is being used to personalize your analyses.
            </p>
          </div>
        )}

        {showResults ? (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#7c3aed' }}>Your Health Analysis</h2>
              <button
                onClick={() => { setShowResults(null); setSelectedForm(null); }}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
              >
                Back to Forms
              </button>
            </div>

            {showResults.summary && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                <p style={{ color: '#374151' }}>{showResults.summary}</p>
              </div>
            )}

            {showResults.riskFactors?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Risk Factors Identified</h3>
                {showResults.riskFactors.map((rf, i) => (
                  <div key={i} style={{ 
                    padding: '0.75rem', 
                    marginBottom: '0.5rem',
                    backgroundColor: rf.severity === 'high' ? '#fef2f2' : rf.severity === 'moderate' ? '#fffbeb' : '#f0fdf4',
                    borderRadius: '0.5rem',
                    borderLeft: `4px solid ${rf.severity === 'high' ? '#ef4444' : rf.severity === 'moderate' ? '#f59e0b' : '#10b981'}`
                  }}>
                    <p style={{ fontWeight: 500 }}>{rf.factor}</p>
                    {rf.mitigations?.length > 0 && (
                      <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {rf.mitigations.map((m, j) => <li key={j}>{m}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showResults.healthStrengths?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Health Strengths</h3>
                {showResults.healthStrengths.map((hs, i) => (
                  <div key={i} style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 500, color: '#065f46' }}>{hs.strength}</p>
                    <p style={{ fontSize: '0.875rem', color: '#047857' }}>{hs.recommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {showResults.recommendations?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Recommendations</h3>
                {showResults.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: '#e0e7ff',
                      color: '#4338ca'
                    }}>
                      {rec.category}
                    </span>
                    <div>
                      <p style={{ fontWeight: 500 }}>{rec.recommendation}</p>
                      <span style={{ 
                        fontSize: '0.75rem',
                        color: rec.priority === 'high' ? '#dc2626' : rec.priority === 'medium' ? '#d97706' : '#16a34a'
                      }}>
                        Priority: {rec.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showResults.screeningsSuggested?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Suggested Screenings</h3>
                {showResults.screeningsSuggested.map((s, i) => (
                  <div key={i} style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 500, color: '#1e40af' }}>{s.screening}</p>
                    <p style={{ fontSize: '0.875rem', color: '#3b82f6' }}>{s.reason}</p>
                    {s.frequency && <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Frequency: {s.frequency}</p>}
                  </div>
                ))}
              </div>
            )}

            {showResults.nextSteps?.length > 0 && (
              <div style={{ backgroundColor: '#faf5ff', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#7c3aed' }}>Next Steps</h3>
                <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {showResults.nextSteps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
              This analysis is for educational purposes only. Please consult a healthcare professional for medical advice.
            </p>
          </div>
        ) : selectedForm ? (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{selectedForm.title}</h2>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{selectedForm.description}</p>
              </div>
              <button
                onClick={() => setSelectedForm(null)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {selectedForm.questions?.map((question, index) => (
                <div key={question.id} style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {index + 1}. {question.question}
                    {question.required && <span style={{ color: '#ef4444' }}> *</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: '#0d9488',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Analyzing...' : 'Submit & Get Analysis'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {forms.map(form => {
                const completed = completedForms.find(cf => cf.formId === form.id);
                return (
                  <div
                    key={form.id}
                    style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{form.title}</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{form.description}</p>
                      {completed && (
                        <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                          Last completed: {new Date(completed.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => loadForm(form.id)}
                      style={{
                        backgroundColor: completed ? '#e5e7eb' : '#0d9488',
                        color: completed ? '#374151' : 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      {completed ? 'Update' : 'Start'}
                    </button>
                  </div>
                );
              })}
            </div>

            {completedForms.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, padding: '1.5rem 1.5rem 1rem' }}>Your Form History</h3>
                {completedForms.map(cf => (
                  <div
                    key={cf.id}
                    style={{
                      padding: '1rem 1.5rem',
                      borderTop: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 500 }}>{cf.formTitle}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Completed {new Date(cf.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {cf.aiRecommendations && (
                      <button
                        onClick={() => setShowResults(cf.aiRecommendations)}
                        style={{
                          backgroundColor: '#7c3aed',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        View Analysis
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
