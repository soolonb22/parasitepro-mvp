import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SymptomTrendChart from '../components/SymptomTrendChart';
import InteractiveBodyMap from '../components/InteractiveBodyMap';
import HealingTimeline from '../components/HealingTimeline';
import axios from 'axios';

export default function SymptomJournalPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('journal');
  const [chartType, setChartType] = useState('combined');
  const [options, setOptions] = useState({ symptoms: [], moods: [], sleepQualities: [], stoolConsistencies: [] });
  const [bodyMapSymptoms, setBodyMapSymptoms] = useState([]);
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    symptoms: [],
    severity: 5,
    notes: '',
    mood: '',
    sleepQuality: '',
    dietNotes: '',
    medications: '',
    bowelMovements: null,
    stoolConsistency: '',
    skinCondition: '',
    energyLevel: 5
  });
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

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
      const [entriesRes, statsRes, optionsRes, analysesRes] = await Promise.all([
        axios.get('/api/journal/entries?limit=90', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/journal/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/journal/options', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/analysis/list', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { analyses: [] } }))
      ]);
      setEntries(entriesRes.data.entries);
      setStats(statsRes.data);
      setOptions(optionsRes.data);
      setAnalyses(analysesRes.data.analyses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const bodyMapNotes = bodyMapSymptoms.length > 0 
        ? `Body Map: ${bodyMapSymptoms.map(s => `${s.regionName} (${s.typeName})`).join(', ')}`
        : '';
      
      await axios.post('/api/journal/entries', {
        ...formData,
        notes: formData.notes + (bodyMapNotes ? '\n' + bodyMapNotes : '')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setBodyMapSymptoms([]);
      setFormData({
        entryDate: new Date().toISOString().split('T')[0],
        symptoms: [],
        severity: 5,
        notes: '',
        mood: '',
        sleepQuality: '',
        dietNotes: '',
        medications: '',
        bowelMovements: null,
        stoolConsistency: '',
        skinCondition: '',
        energyLevel: 5
      });
      fetchData();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/journal/analysis?days=30', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysis(res.data.analysis);
    } catch (error) {
      console.error('Error analyzing:', error);
      alert('Failed to analyze symptoms');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/journal/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity <= 3) return '#10b981';
    if (severity <= 6) return '#f59e0b';
    return '#ef4444';
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
        <title>Symptom Journal | Parasite Identification Pro</title>
        <meta name="description" content="Track your daily symptoms, visualize health trends, and monitor your healing journey" />
      </Helmet>
      <Navbar />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>Health Tracker</h1>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Track symptoms, visualize trends, and monitor your healing journey</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#0d9488',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {showForm ? 'Cancel' : '+ Log Today'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { id: 'journal', label: 'Journal', icon: '📝' },
            { id: 'trends', label: 'Trends', icon: '📊' },
            { id: 'bodymap', label: 'Body Map', icon: '🧍' },
            { id: 'timeline', label: 'Progress', icon: '🎯' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: activeTab === tab.id ? '#0d9488' : 'white',
                color: activeTab === tab.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {stats && activeTab === 'journal' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Entries</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.totalEntries}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>This Week</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.recentEntries}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Severity (30d)</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: getSeverityColor(stats.avgSeverity) }}>
                {stats.avgSeverity ? stats.avgSeverity.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Top Symptoms</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                {stats.topSymptoms?.slice(0, 3).map((s, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#e5e7eb', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>
                    {s.symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && entries.length >= 3 && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Symptom Trends</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { id: 'combined', label: 'All Metrics' },
                  { id: 'severity', label: 'Severity' },
                  { id: 'energy', label: 'Energy' },
                  { id: 'symptoms', label: 'Symptoms Count' }
                ].map(chart => (
                  <button
                    key={chart.id}
                    onClick={() => setChartType(chart.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: chartType === chart.id ? '#0d9488' : '#f3f4f6',
                      color: chartType === chart.id ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.8125rem',
                      cursor: 'pointer'
                    }}
                  >
                    {chart.label}
                  </button>
                ))}
              </div>
            </div>
            <SymptomTrendChart entries={entries} chartType={chartType} />
          </div>
        )}

        {activeTab === 'trends' && entries.length < 3 && (
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Not Enough Data Yet</h3>
            <p style={{ color: '#6b7280' }}>Log at least 3 entries to see your symptom trends</p>
          </div>
        )}

        {activeTab === 'bodymap' && (
          <div style={{ marginBottom: '2rem' }}>
            <InteractiveBodyMap 
              selectedSymptoms={bodyMapSymptoms} 
              onSymptomsChange={setBodyMapSymptoms} 
            />
            {bodyMapSymptoms.length > 0 && !showForm && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    backgroundColor: '#0d9488',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Body Map to Journal Entry
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div style={{ marginBottom: '2rem' }}>
            <HealingTimeline journalEntries={entries} analyses={analyses} />
          </div>
        )}

        {entries.length >= 5 && activeTab === 'journal' && (
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: analyzing ? 0.7 : 1
              }}
            >
              {analyzing ? 'Analyzing...' : 'Analyze My Patterns (AI)'}
            </button>
          </div>
        )}

        {analysis && activeTab === 'journal' && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#7c3aed' }}>AI Analysis</h3>
            {analysis.summary && <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{analysis.summary}</p>}
            
            {analysis.insights?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Insights</h4>
                {analysis.insights.map((insight, i) => (
                  <div key={i} style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 500 }}>{insight.title}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{insight.description}</p>
                  </div>
                ))}
              </div>
            )}

            {analysis.recommendations?.length > 0 && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Recommendations</h4>
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f59e0b' : '#10b981' }}>
                      {rec.priority === 'high' ? '!' : rec.priority === 'medium' ? '*' : '-'}
                    </span>
                    <span style={{ fontSize: '0.875rem' }}>{rec.recommendation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showForm && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Log Symptoms</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Date</label>
                  <input
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Mood</label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="">Select mood</option>
                    {options.moods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Sleep Quality</label>
                  <select
                    value={formData.sleepQuality}
                    onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="">Select quality</option>
                    {options.sleepQualities.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Energy Level (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyLevel}
                    onChange={(e) => setFormData({ ...formData, energyLevel: parseInt(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formData.energyLevel}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Symptoms (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {options.symptoms.map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '9999px',
                        border: 'none',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        backgroundColor: formData.symptoms.includes(symptom) ? '#0d9488' : '#e5e7eb',
                        color: formData.symptoms.includes(symptom) ? 'white' : '#374151'
                      }}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {bodyMapSymptoms.length > 0 && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0fdfa', borderRadius: '0.5rem', border: '1px solid #99f6e4' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Body Map Symptoms</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {bodyMapSymptoms.map((s, i) => (
                      <span key={i} style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: s.color + '20', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.875rem',
                        borderLeft: `3px solid ${s.color}`
                      }}>
                        {s.regionName} - {s.typeName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Symptom Severity (1-10): {formData.severity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Bowel Movements</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.bowelMovements || ''}
                    onChange={(e) => setFormData({ ...formData, bowelMovements: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Number today"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Stool Consistency</label>
                  <select
                    value={formData.stoolConsistency}
                    onChange={(e) => setFormData({ ...formData, stoolConsistency: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="">Select</option>
                    {options.stoolConsistencies.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Skin Condition Notes</label>
                <input
                  type="text"
                  value={formData.skinCondition}
                  onChange={(e) => setFormData({ ...formData, skinCondition: e.target.value })}
                  placeholder="Any rashes, itching, changes..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Diet Notes</label>
                <input
                  type="text"
                  value={formData.dietNotes}
                  onChange={(e) => setFormData({ ...formData, dietNotes: e.target.value })}
                  placeholder="What did you eat today?"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Natural Remedies/Supplements Taken</label>
                <input
                  type="text"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="e.g., Wormwood, probiotics, garlic..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any other observations..."
                  rows={3}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  backgroundColor: '#0d9488',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'journal' && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, padding: '1.5rem 1.5rem 1rem' }}>Recent Entries</h3>
            {entries.length === 0 ? (
              <p style={{ padding: '1.5rem', color: '#6b7280', textAlign: 'center' }}>
                No entries yet. Start tracking your symptoms!
              </p>
            ) : (
              <div>
                {entries.slice(0, 30).map(entry => (
                  <div
                    key={entry.id}
                    style={{
                      padding: '1rem 1.5rem',
                      borderTop: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600 }}>
                          {new Date(entry.entryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        {entry.severity && (
                          <span style={{
                            backgroundColor: getSeverityColor(entry.severity),
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            Severity: {entry.severity}/10
                          </span>
                        )}
                        {entry.energyLevel && (
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Energy: {entry.energyLevel}/10</span>
                        )}
                        {entry.mood && (
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Mood: {entry.mood}</span>
                        )}
                      </div>
                      {entry.symptoms?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                          {entry.symptoms.map((s, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.notes && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{entry.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Delete
                    </button>
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
