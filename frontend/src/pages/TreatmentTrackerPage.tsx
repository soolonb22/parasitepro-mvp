// @ts-nocheck
import { useState, useEffect } from 'react';
import { getApiUrl } from '../api';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';

interface Protocol {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  item_count: number;
  start_date: string;
  today_completed: number;
  protocol_name?: string;
  dosage?: string;
  [key: string]: any;
}

interface TodayItem {
  id: string;
  name: string;
  item_name: string;
  category: string;
  completed: boolean;
  log_date: string;
  protocol_name?: string;
  dosage?: string;
  time_of_day?: string;
  [key: string]: any;
}

interface TreatmentStats {
  [key: string]: any;
}

const CATEGORY_COLORS: Record<string, string> = {
  herb: '#10b981',
  supplement: '#3b82f6',
  diet: '#f59e0b',
  lifestyle: '#8b5cf6',
  other: '#6b7280'
};

export default function TreatmentTrackerPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [todayItems, setTodayItems] = useState<TodayItem[]>([]);
  const [stats, setStats] = useState<TreatmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const headers = { Authorization: `Bearer ${token}` };

      const [protocolsRes, todayRes, statsRes] = await Promise.all([
        axios.get(getApiUrl('/api/treatment/protocols'), { headers }),
        axios.get(getApiUrl('/api/treatment/today'), { headers }),
        axios.get(getApiUrl('/api/treatment/stats'), { headers })
      ]);

      setProtocols(protocolsRes.data.protocols);
      setTodayItems(todayRes.data.items);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch treatment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (item) => {
    try {
      const token = useAuthStore.getState().accessToken;
      await axios.post(getApiUrl(`/api/treatment/protocols/${item.protocol_id}/log`), {
        itemId: item.id,
        completed: !item.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTodayItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, completed: !i.completed } : i
      ));
      
      const statsRes = await axios.get(getApiUrl('/api/treatment/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to log adherence:', error);
    }
  };

  const groupByTimeOfDay = (items) => {
    const groups = { morning: [], afternoon: [], evening: [], anytime: [] };
    items.forEach(item => {
      const time = item.time_of_day?.toLowerCase() || 'anytime';
      if (groups[time]) {
        groups[time].push(item);
      } else {
        groups.anytime.push(item);
      }
    });
    return groups;
  };

  const groupedItems = groupByTimeOfDay(todayItems);

  if (loading) {
    return (
      <div>
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading your treatment protocols...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title="Treatment Protocol Tracker - Parasite Identification Pro"
        description="Track your natural treatment protocols and daily adherence"
      />
      
      <div className="mobile-container" style={{ maxWidth: '1000px' }}>
        <div className="page-header-flex">
          <div>
            <h1 className="page-title-mobile">Treatment Tracker</h1>
            <p style={{ color: '#6b7280' }}>Track your protocols and daily adherence</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            + New Protocol
          </button>
        </div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.currentStreak}</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Day Streak</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.adherenceRate}%</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Adherence Rate</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.completedCount}</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Completed Tasks</div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Today's Tasks</h2>
          
          {todayItems.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No treatment tasks for today. Create a protocol to get started!
            </p>
          ) : (
            <div>
              {Object.entries(groupedItems).map(([timeOfDay, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={timeOfDay} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ 
                      fontSize: '0.875rem', 
                      textTransform: 'uppercase', 
                      color: '#6b7280',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.05em'
                    }}>
                      {timeOfDay === 'morning' && '🌅 Morning'}
                      {timeOfDay === 'afternoon' && '☀️ Afternoon'}
                      {timeOfDay === 'evening' && '🌙 Evening'}
                      {timeOfDay === 'anytime' && '⏰ Anytime'}
                    </h3>
                    {items.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => handleToggleItem(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem',
                          backgroundColor: item.completed ? '#f0fdf4' : '#f9fafb',
                          borderRadius: '0.5rem',
                          marginBottom: '0.5rem',
                          cursor: 'pointer',
                          border: `1px solid ${item.completed ? '#86efac' : '#e5e7eb'}`,
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: `2px solid ${item.completed ? '#22c55e' : '#d1d5db'}`,
                          backgroundColor: item.completed ? '#22c55e' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {item.completed && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: '500',
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? '#6b7280' : '#111827'
                          }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {item.dosage && <span>{item.dosage}</span>}
                            {item.protocol_name && <span> • {item.protocol_name}</span>}
                          </div>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: getCategoryColor(item.category),
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          color: 'white'
                        }}>
                          {item.category || 'General'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Protocols</h2>
          
          {protocols.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No protocols yet. Create your first treatment protocol!
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {protocols.map(protocol => (
                <div 
                  key={protocol.id}
                  onClick={() => setSelectedProtocol(protocol)}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{protocol.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{protocol.description}</p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: protocol.status === 'active' ? '#dcfce7' : '#f3f4f6',
                      color: protocol.status === 'active' ? '#166534' : '#6b7280',
                      borderRadius: '9999px',
                      fontSize: '0.75rem'
                    }}>
                      {protocol.status}
                    </span>
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>{protocol.item_count || 0} items</span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span>Started {new Date(protocol.start_date).toLocaleDateString()}</span>
                    {protocol.today_completed > 0 && (
                      <>
                        <span style={{ margin: '0 0.5rem' }}>•</span>
                        <span style={{ color: '#22c55e' }}>{protocol.today_completed} done today</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateProtocolModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}

      {selectedProtocol && (
        <ProtocolDetailModal
          protocol={selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    herb: '#22c55e',
    supplement: '#3b82f6',
    diet: '#f59e0b',
    lifestyle: '#8b5cf6',
    other: '#6b7280'
  };
  return colors[category?.toLowerCase()] || colors.other;
}

function CreateProtocolModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void; }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ name: '', category: 'herb', dosage: '', frequency: 'Daily', timeOfDay: 'morning' }]);
  const [saving, setSaving] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { name: '', category: 'herb', dosage: '', frequency: 'Daily', timeOfDay: 'morning' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate) return;

    setSaving(true);
    try {
      const token = useAuthStore.getState().accessToken;
      await axios.post(getApiUrl('/api/treatment/protocols'), {
        name,
        description,
        startDate,
        items: items.filter(i => i.name.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onCreated();
    } catch (error) {
      console.error('Failed to create protocol:', error);
    } finally {
      setSaving(false);
    }
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Create Treatment Protocol</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Protocol Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Anti-Parasitic Protocol"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this protocol"
              rows={2}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Treatment Items</label>
            {items.map((item: any, index: number) => (
              <div key={index} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 100px 100px 100px 40px',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  placeholder="Item name"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
                <select
                  value={item.category}
                  onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                >
                  <option value="herb">Herb</option>
                  <option value="supplement">Supplement</option>
                  <option value="diet">Diet</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
                <input
                  type="text"
                  value={item.dosage}
                  onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                  placeholder="Dosage"
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
                <select
                  value={item.timeOfDay}
                  onChange={(e) => handleItemChange(index, 'timeOfDay', e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="anytime">Anytime</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  style={{ 
                    padding: '0.5rem', 
                    backgroundColor: '#fee2e2', 
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              + Add Item
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Creating...' : 'Create Protocol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProtocolDetailModal({ protocol, onClose, onUpdated }) {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProtocolDetails();
  }, [protocol.id]);

  const fetchProtocolDetails = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const response = await axios.get(getApiUrl(`/api/treatment/protocols/${protocol.id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.items);
      setLogs(response.data.recentLogs);
    } catch (error) {
      console.error('Failed to fetch protocol details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndProtocol = async () => {
    if (!confirm('Are you sure you want to end this protocol?')) return;
    
    try {
      const token = useAuthStore.getState().accessToken;
      await axios.put(getApiUrl(`/api/treatment/protocols/${protocol.id}`), {
        status: 'completed',
        endDate: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to end protocol:', error);
    }
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{protocol.name}</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{protocol.description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Treatment Items</h3>
              {items.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No items in this protocol</p>
              ) : (
                <div>
                  {items.map(item => (
                    <div key={item.id} style={{
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {item.dosage} • {item.time_of_day}
                        </div>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getCategoryColor(item.category),
                        color: 'white',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}>
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Recent Activity</h3>
              {logs.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No recent activity</p>
              ) : (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {logs.map(log => (
                    <div key={log.id} style={{
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>{log.completed ? '✅' : '⏳'}</span>
                      <span>{log.item_name}</span>
                      <span style={{ color: '#6b7280', marginLeft: 'auto' }}>
                        {new Date(log.log_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {protocol.status === 'active' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleEndProtocol}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  End Protocol
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
