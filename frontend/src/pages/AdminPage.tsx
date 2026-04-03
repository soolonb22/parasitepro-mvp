// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import {
  Users, BarChart3, Gift, Search, CheckCircle,
  AlertCircle, Microscope, CreditCard, Activity,
  ArrowLeft, Loader, TrendingUp, Zap
} from 'lucide-react';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_BASE = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const StatCard = ({ icon, label, value, sub = null, color = 'var(--amber)' }) => (
  <div className="pp-card" style={{ padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value ?? '—'}</div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
  </div>
);

const AdminPage = () => {
  const { accessToken: token } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Grant credits state
  const [grantEmail, setGrantEmail] = useState('');
  const [grantCredits, setGrantCredits] = useState('');
  const [grantReason, setGrantReason] = useState('');
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantResult, setGrantResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => { checkAdminAccess(); }, []);

  const checkAdminAccess = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/check`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.isAdmin) { setIsAdmin(true); fetchStats(); }
      else navigate('/dashboard');
    } catch { navigate('/dashboard'); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const searchUser = async (email) => {
    if (!email || email.length < 2) { setSearchResults([]); setShowDropdown(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/admin/search-user?email=${encodeURIComponent(email)}`, { headers: { Authorization: `Bearer ${token}` } });
      setSearchResults(res.data.users || []);
      setShowDropdown((res.data.users || []).length > 0);
    } catch { setSearchResults([]); }
  };

  const handleGrantCredits = async (e) => {
    e.preventDefault();
    if (!grantEmail || !grantCredits) return;
    setGrantLoading(true);
    setGrantResult(null);
    try {
      const res = await axios.post(`${API_BASE}/admin/grant-credits`,
        { email: grantEmail, credits: parseInt(grantCredits), reason: grantReason || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGrantResult({ success: true, data: res.data.user });
      setGrantEmail(''); setGrantCredits(''); setGrantReason('');
      setSearchResults([]); setShowDropdown(false);
      fetchStats();
    } catch (error) {
      setGrantResult({ success: false, error: error.response?.data?.error || 'Failed to grant credits' });
    } finally { setGrantLoading(false); }
  };

  if (!isAdmin || loading) {
    return (
      <div className="pp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Loader size={24} style={{ color: 'var(--amber)', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CHECKING ACCESS</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page">
      {/* Nav */}
      <nav className="pp-nav">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'var(--font-body)' }}>
              <ArrowLeft size={15} /> Dashboard
            </button>
            <span style={{ color: 'var(--bg-border)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Microscope size={14} style={{ color: 'var(--amber)' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Admin</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', color: 'var(--amber)', letterSpacing: '0.08em' }}>RESTRICTED</span>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats grid */}
        <div style={{ marginBottom: 12 }}>
          <div className="pp-section-title" style={{ marginBottom: 16 }}>Platform overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard icon={<Users size={16} />} label="Total Users" value={stats?.totalUsers} />
            <StatCard icon={<Activity size={16} />} label="Total Analyses" value={stats?.totalAnalyses} />
            <StatCard icon={<CreditCard size={16} />} label="Total Credits Issued" value={stats?.totalCredits} color="#10B981" />
            <StatCard icon={<TrendingUp size={16} />} label="New Users (30d)" value={stats?.recentUsers} color="#F59E0B" />
          </div>
        </div>

        {/* Grant Credits */}
        <div className="pp-card" style={{ padding: 28, position: 'relative', overflow: 'visible' }}>
          {/* Amber top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent)', borderRadius: '12px 12px 0 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={16} style={{ color: 'var(--amber)' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, color: 'var(--text-primary)', margin: 0 }}>Grant Credits</h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', margin: 0, letterSpacing: '0.05em' }}>ADD CREDITS TO ANY USER ACCOUNT</p>
            </div>
          </div>

          <form onSubmit={handleGrantCredits} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email with autocomplete */}
            <div style={{ position: 'relative' }}>
              <label className="pp-label">User email</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={grantEmail}
                  onChange={(e) => { setGrantEmail(e.target.value); searchUser(e.target.value); setGrantResult(null); }}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="user@example.com"
                  required
                  className="pp-input"
                  style={{ paddingLeft: 36 }}
                />
              </div>
              {/* Autocomplete dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4,
                  background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', borderRadius: 10,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden'
                }}>
                  {searchResults.map(u => (
                    <div
                      key={u.id}
                      onMouseDown={() => { setGrantEmail(u.email); setShowDropdown(false); setSearchResults([]); }}
                      style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-border)', transition: 'background 0.1s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(217,119,6,0.06)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{u.email}</div>
                        {(u.first_name || u.last_name) && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{[u.first_name, u.last_name].filter(Boolean).join(' ')}</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={12} style={{ color: 'var(--amber)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--amber)' }}>{u.image_credits} credits</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Credits + Reason row */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
              <div>
                <label className="pp-label">Credits to add</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={grantCredits}
                  onChange={(e) => setGrantCredits(e.target.value)}
                  placeholder="10"
                  required
                  className="pp-input"
                  style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--amber)' }}
                />
              </div>
              <div>
                <label className="pp-label">Reason <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="Beta tester, refund, manual top-up…"
                  className="pp-input"
                />
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="submit"
                disabled={grantLoading || !grantEmail || !grantCredits}
                className="pp-btn-primary"
                style={{ padding: '12px 24px', opacity: (!grantEmail || !grantCredits) ? 0.5 : 1 }}
              >
                {grantLoading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Granting…</span>
                  : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Gift size={15} /> Grant {grantCredits || '—'} Credits</span>
                }
              </button>
              {grantEmail && grantCredits && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                  → {grantEmail}
                </span>
              )}
            </div>
          </form>

          {/* Result feedback */}
          {grantResult && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 10,
              background: grantResult.success ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${grantResult.success ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              {grantResult.success
                ? <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                : <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
              }
              <div>
                {grantResult.success ? (
                  <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                    ✅ Credits granted — <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>{grantResult.data?.email}</span> now has <span style={{ fontFamily: 'var(--font-mono)', color: '#10B981' }}>{grantResult.data?.image_credits} credits</span>
                  </span>
                ) : (
                  <span style={{ fontSize: 14, color: '#EF4444' }}>{grantResult.error}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent activity placeholder */}
        {stats?.recentAnalyses?.length > 0 && (
          <div className="pp-card" style={{ padding: 28, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <BarChart3 size={16} style={{ color: 'var(--amber)' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', margin: 0 }}>Recent Analyses</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.recentAnalyses.slice(0, 10).map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{a.email || 'Unknown'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.sample_type || '—'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{new Date(a.created_at).toLocaleDateString('en-AU')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
