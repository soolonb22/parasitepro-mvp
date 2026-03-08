// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;
import axios from 'axios';
import { 
  Users, DollarSign, BarChart3, TrendingUp, Clock,
  Mail, Calendar, CreditCard, Activity, Bell, Gift, Search, Check, AlertCircle
} from 'lucide-react';

const AdminPage = () => {
  const { user, accessToken: token } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantCredits, setGrantCredits] = useState('');
  const [grantReason, setGrantReason] = useState('');
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantResult, setGrantResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/check`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.isAdmin) {
        setIsAdmin(true);
        fetchStats();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      navigate('/dashboard');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async (email) => {
    if (!email || email.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/admin/search-user?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleGrantCredits = async (e) => {
    e.preventDefault();
    if (!grantEmail || !grantCredits) return;

    setGrantLoading(true);
    setGrantResult(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/grant-credits`, {
        email: grantEmail,
        credits: parseInt(grantCredits),
        reason: grantReason || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrantResult({ success: true, data: res.data.user });
      setGrantEmail('');
      setGrantCredits('');
      setGrantReason('');
      setSearchResults([]);
      fetchStats();
    } catch (error) {
      setGrantResult({ 
        success: false, 
        error: error.response?.data?.error || 'Failed to grant credits' 
      });
    } finally {
      setGrantLoading(false);
    }
  };

  if (!isAdmin || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.25rem' }}>Loading...</div>
      </div>
    );
  }

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <BarChart3 size={32} />
          Admin Dashboard
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            icon={<Users size={24} />}
            label="Total Users"
            value={stats?.users?.total_users || 0}
            subtext={`+${stats?.users?.today || 0} today`}
            color="#10b981"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Last 7 Days"
            value={stats?.users?.last_7_days || 0}
            subtext="new signups"
            color="#3b82f6"
          />
          <StatCard
            icon={<Activity size={24} />}
            label="Analyses"
            value={stats?.analyses?.total_analyses || 0}
            subtext={`${stats?.analyses?.today || 0} today`}
            color="#8b5cf6"
          />
          <StatCard
            icon={<DollarSign size={24} />}
            label="Total Revenue"
            value={formatCurrency(stats?.revenue?.total_revenue || 0)}
            subtext={`${formatCurrency(stats?.revenue?.last_30_days || 0)} last 30d`}
            color="#f59e0b"
          />
        </div>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Gift size={20} />
            Grant Credits to User
          </h2>
          
          <form onSubmit={handleGrantCredits} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                User Email
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                  type="email"
                  value={grantEmail}
                  onChange={(e) => { setGrantEmail(e.target.value); searchUser(e.target.value); }}
                  placeholder="Enter user email..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#1e3a5f',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map(u => (
                    <div
                      key={u.id}
                      onClick={() => { setGrantEmail(u.email); setSearchResults([]); }}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ color: 'white' }}>{u.email}</span>
                      <span style={{ color: '#10b981', fontSize: '0.875rem' }}>{u.image_credits} credits</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                  Credits to Grant
                </label>
                <input
                  type="number"
                  min="1"
                  value={grantCredits}
                  onChange={(e) => setGrantCredits(e.target.value)}
                  placeholder="10"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="Beta tester bonus, refund, etc."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={grantLoading || !grantEmail || !grantCredits}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: grantLoading || !grantEmail || !grantCredits ? '#4b5563' : '#10b981',
                color: 'white',
                fontWeight: 600,
                cursor: grantLoading || !grantEmail || !grantCredits ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: 'fit-content'
              }}
            >
              {grantLoading ? 'Granting...' : <><Gift size={18} /> Grant Credits</>}
            </button>
          </form>

          {grantResult && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: grantResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${grantResult.success ? '#10b981' : '#ef4444'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {grantResult.success ? (
                <>
                  <Check size={20} color="#10b981" />
                  <div style={{ color: 'white' }}>
                    Granted <strong>{grantResult.data.creditsGranted}</strong> credits to <strong>{grantResult.data.email}</strong>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      New balance: {grantResult.data.newBalance} credits (was {grantResult.data.previousBalance})
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle size={20} color="#ef4444" />
                  <span style={{ color: '#ef4444' }}>{grantResult.error}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Users size={20} />
              Recent Signups
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.recentUsers?.map(user => (
                <div key={user.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 500 }}>
                      {user.first_name} {user.last_name}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      {user.email}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#10b981', fontSize: '0.875rem' }}>
                      {user.image_credits} credits
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {formatDate(user.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  No users yet
                </div>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CreditCard size={20} />
              Recent Transactions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.recentTransactions?.map(tx => (
                <div key={tx.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 500 }}>
                      {tx.email}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      {tx.credits} credits
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: tx.status === 'completed' ? '#10b981' : '#f59e0b', 
                      fontWeight: 600 
                    }}>
                      {formatCurrency(tx.amount)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {formatDate(tx.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  No transactions yet
                </div>
              )}
            </div>
          </div>
        </div>

        {stats?.notifications && stats.notifications.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            marginTop: '1.5rem'
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Bell size={20} />
              Recent Activity
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.75rem',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                marginLeft: '0.5rem'
              }}>
                {stats.notifications.length} new
              </span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats.notifications.map(notif => {
                const data = typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data;
                return (
                  <div key={notif.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '0.5rem',
                    borderLeft: '3px solid #10b981'
                  }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      backgroundColor: notif.type === 'new_signup' ? '#10b98120' : '#f59e0b20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {notif.type === 'new_signup' ? (
                        <Users size={14} color="#10b981" />
                      ) : (
                        <DollarSign size={14} color="#f59e0b" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontSize: '0.9rem' }}>
                        {notif.type === 'new_signup' 
                          ? `New signup: ${data.email}`
                          : `Purchase: ${data.email} - $${(data.amount/100).toFixed(2)}`
                        }
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {formatDate(notif.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext, color }) => (
  <div style={{
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.1)'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem',
      marginBottom: '1rem'
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        borderRadius: '0.75rem',
        backgroundColor: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        {icon}
      </div>
      <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{label}</span>
    </div>
    <div style={{ 
      color: 'white', 
      fontSize: '2rem', 
      fontWeight: 700,
      marginBottom: '0.25rem'
    }}>
      {value}
    </div>
    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
      {subtext}
    </div>
  </div>
);

export default AdminPage;
