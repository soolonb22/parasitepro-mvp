import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const COMMON_SYMPTOMS = ['Bloating', 'Gas', 'Cramping', 'Nausea', 'Fatigue', 'Headache', 'Diarrhea', 'Constipation'];

export default function FoodDiaryPage() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('log');

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [entriesRes, statsRes] = await Promise.all([
        axios.get(`/api/food-diary/entries/date/${selectedDate}`, { headers }),
        axios.get('/api/food-diary/stats?days=30', { headers })
      ]);

      setEntries(entriesRes.data.entries);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch food diary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm('Delete this entry?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/food-diary/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[type] || '🍽️';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading food diary...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title="Food & Supplement Diary - Parasite Identification Pro"
        description="Track your diet and supplements to identify triggers and what helps"
      />
      <Navbar />
      
      <div className="mobile-container" style={{ maxWidth: '1000px' }}>
        <div className="page-header-flex">
          <div>
            <h1 className="page-title-mobile">Food & Supplement Diary</h1>
            <p style={{ color: '#6b7280' }}>Track what you eat and how you feel</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            + Add Entry
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('log')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'log' ? '#0d9488' : '#f3f4f6',
              color: activeTab === 'log' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Daily Log
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'insights' ? '#0d9488' : '#f3f4f6',
              color: activeTab === 'insights' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Insights
          </button>
        </div>

        {activeTab === 'log' && (
          <>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() - 1);
                    setSelectedDate(date.toISOString().split('T')[0]);
                  }}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  ←
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
                <button
                  onClick={() => {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() + 1);
                    setSelectedDate(date.toISOString().split('T')[0]);
                  }}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  →
                </button>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  Today
                </button>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No entries for this day</p>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                  Add Entry
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {MEAL_TYPES.map(mealType => {
                  const mealEntries = entries.filter(e => e.meal_type === mealType);
                  if (mealEntries.length === 0) return null;
                  
                  return (
                    <div key={mealType} className="card">
                      <h3 style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '1rem',
                        textTransform: 'capitalize'
                      }}>
                        {getMealIcon(mealType)} {mealType}
                      </h3>
                      {mealEntries.map(entry => (
                        <div key={entry.id} style={{
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              {entry.foods && entry.foods.length > 0 && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                  <strong>Foods:</strong> {entry.foods.map(f => typeof f === 'string' ? f : f.name).join(', ')}
                                </div>
                              )}
                              {entry.supplements && entry.supplements.length > 0 && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                  <strong>Supplements:</strong> {entry.supplements.map(s => typeof s === 'string' ? s : s.name).join(', ')}
                                </div>
                              )}
                              {entry.symptoms_after && entry.symptoms_after.length > 0 && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                  <strong>Symptoms after:</strong>
                                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                    {entry.symptoms_after.map((s, i) => (
                                      <span key={i} style={{
                                        padding: '0.125rem 0.5rem',
                                        backgroundColor: '#fee2e2',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem'
                                      }}>
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {entry.notes && (
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{entry.notes}</div>
                              )}
                              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                {entry.energy_level && <span>Energy: {entry.energy_level}/10</span>}
                                {entry.digestive_comfort && <span>Comfort: {entry.digestive_comfort}/10</span>}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'insights' && stats && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.daysLogged}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Days Logged</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.averageEnergy}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Energy</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.averageComfort}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Comfort</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Top Foods (Last 30 Days)</h3>
              {stats.topFoods.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Not enough data yet</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {stats.topFoods.map((food, index) => (
                    <span key={index} style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dcfce7',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}>
                      {food.name} ({food.count}x)
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Top Supplements</h3>
              {stats.topSupplements.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Not enough data yet</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {stats.topSupplements.map((supp, index) => (
                    <span key={index} style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dbeafe',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}>
                      {supp.name} ({supp.count}x)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {stats.potentialTriggers.length > 0 && (
              <div className="card" style={{ backgroundColor: '#fef3c7' }}>
                <h3 style={{ marginBottom: '1rem', color: '#92400e' }}>Potential Triggers</h3>
                <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '1rem' }}>
                  These foods appeared frequently with symptoms:
                </p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {stats.potentialTriggers.map((trigger, index) => (
                    <div key={index} style={{
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span><strong>{trigger.food}</strong> → {trigger.symptom}</span>
                      <span style={{ color: '#92400e' }}>{trigger.occurrences}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddEntryModal
          date={selectedDate}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function AddEntryModal({ date, onClose, onAdded }) {
  const [mealType, setMealType] = useState('breakfast');
  const [foods, setFoods] = useState('');
  const [supplements, setSupplements] = useState('');
  const [symptomsAfter, setSymptomsAfter] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [digestiveComfort, setDigestiveComfort] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/food-diary/entries', {
        entryDate: date,
        mealType,
        foods: foods.split(',').map(f => f.trim()).filter(Boolean),
        supplements: supplements.split(',').map(s => s.trim()).filter(Boolean),
        symptomsAfter,
        energyLevel,
        digestiveComfort,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAdded();
    } catch (error) {
      console.error('Failed to add entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setSymptomsAfter(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Add Food Entry</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Meal Type</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {MEAL_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: mealType === type ? '#0d9488' : '#f3f4f6',
                    color: mealType === type ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Foods (comma-separated)</label>
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              placeholder="e.g., chicken, rice, broccoli"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Supplements (comma-separated)</label>
            <input
              type="text"
              value={supplements}
              onChange={(e) => setSupplements(e.target.value)}
              placeholder="e.g., probiotics, vitamin D"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Symptoms After (if any)</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COMMON_SYMPTOMS.map(symptom => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: symptomsAfter.includes(symptom) ? '#fee2e2' : '#f3f4f6',
                    color: symptomsAfter.includes(symptom) ? '#991b1b' : '#374151',
                    border: `1px solid ${symptomsAfter.includes(symptom) ? '#fecaca' : '#e5e7eb'}`,
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Energy Level</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>{energyLevel}/10</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Digestive Comfort</label>
              <input
                type="range"
                min="1"
                max="10"
                value={digestiveComfort}
                onChange={(e) => setDigestiveComfort(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>{digestiveComfort}/10</div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional notes..."
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
