// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { Zap, Check, ArrowLeft, Shield, RefreshCw, Loader, AlertCircle, Star } from 'lucide-react';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const PricingPage = () => {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState('');
  const [error, setError] = useState('');
  const cancelled = searchParams.get('cancelled') === '1';

  useEffect(() => {
    axios.get(`${API_URL}/payment/pricing`)
      .then(r => setBundles(r.data.options || []))
      .catch(() => setError('Failed to load pricing'))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (bundleId: string) => {
    if (!user) { navigate('/login'); return; }
    setPurchasing(bundleId);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/payment/create-checkout-session`,
        { bundleId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      window.location.href = res.data.sessionUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      setPurchasing('');
    }
  };

  const perCreditSavings = (bundle: any) => {
    if (!bundles.length) return null;
    const base = bundles[0];
    if (bundle.id === base?.id) return null;
    const pct = Math.round((1 - parseFloat(bundle.audPerCredit) / parseFloat(base.audPerCredit)) * 100);
    return pct > 0 ? `Save ${pct}%` : null;
  };

  return (
    <div className="pp-page" style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="pp-nav">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <button onClick={() => navigate(user ? '/dashboard' : '/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'var(--font-body)' }}>
            <ArrowLeft size={15} /> {user ? 'Dashboard' : 'Home'}
          </button>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--amber)' }}>
              <Zap size={13} /> {user.imageCredits ?? 0} credits remaining
            </div>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 20, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: '0.08em' }}>CREDIT BUNDLES — AUD</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Pay only for what you use
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 420, margin: '0 auto' }}>
            Each credit = one AI parasite analysis. Credits never expire. Buy more whenever you need them.
          </p>
        </div>

        {/* Cancelled notice */}
        {cancelled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 24 }}>
            <AlertCircle size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Payment cancelled — no charges were made.</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 24 }}>
            <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: '#EF4444' }}>{error}</span>
          </div>
        )}

        {/* Bundle cards */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Loader size={24} style={{ color: 'var(--amber)', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
            {bundles.map((b: any) => {
              const savings = perCreditSavings(b);
              const isPopular = b.popular;
              const isPurchasing = purchasing === b.id;
              return (
                <div key={b.id} className="pp-card" style={{ padding: 28, position: 'relative', display: 'flex', flexDirection: 'column', border: isPopular ? '1px solid rgba(217,119,6,0.4)' : undefined, transition: 'transform 0.15s, border-color 0.15s' }}>
                  {/* Popular badge */}
                  {isPopular && (
                    <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: 'var(--amber)', borderRadius: '0 0 8px 8px', padding: '3px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={10} fill="white" style={{ color: 'white' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>MOST POPULAR</span>
                    </div>
                  )}
                  {/* Amber accent */}
                  {isPopular && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--amber)', borderRadius: '12px 12px 0 0' }} />}

                  <div style={{ marginBottom: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{b.label}</span>
                      {savings && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', letterSpacing: '0.05em' }}>{savings}</span>
                      )}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, color: isPopular ? 'var(--amber)' : 'var(--text-primary)', letterSpacing: '-0.03em' }}>${b.aud}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>AUD</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        ${b.audPerCredit} per credit
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                      {[`${b.credits} AI analyses`, 'Credits never expire', 'All sample types', 'Instant delivery'].map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Check size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(b.id)}
                    disabled={!!purchasing}
                    className={isPopular ? 'pp-btn-primary' : 'pp-btn'}
                    style={{ width: '100%', padding: '12px', opacity: purchasing && !isPurchasing ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {isPurchasing
                      ? <><span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Redirecting…</>
                      : <><Zap size={14} /> Buy {b.credits} Credits</>
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust bar */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 32, padding: '24px 0', borderTop: '1px solid var(--bg-border)' }}>
          {[
            { icon: <Shield size={16} />, label: 'Stripe-secured checkout' },
            { icon: <RefreshCw size={16} />, label: 'Credits never expire' },
            { icon: <Check size={16} />, label: 'Instant credit delivery' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)', fontSize: 13 }}>
              <span style={{ color: 'var(--amber)' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
          All prices in AUD including GST. Educational reference tool — not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
