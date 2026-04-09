// PostAnalysisUpsell — shown once after a completed analysis when user has 0 credits.
// Uses the same Stripe checkout endpoint as PricingPage (bundle_5 = 5 credits / AUD $19.99).
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../api';

interface Props {
  onClose: () => void;
}

export default function PostAnalysisUpsell({ onClose }: Props) {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${API_URL}/payment/create-checkout-session`,
        { bundleId: 'bundle_5' },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      window.location.href = res.data.sessionUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed — please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 text-center"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}
      >
        <div className="text-4xl mb-3">🔬</div>

        <h3
          className="font-display font-bold text-xl mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Great report! Want to keep going?
        </h3>

        <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Your credit has been used. Grab 5 more for{' '}
          <strong style={{ color: 'var(--amber-bright)' }}>AUD $19.99</strong> — cheaper than a
          single GP visit, and credits never expire.
        </p>

        {/* Bundle card */}
        <div
          className="rounded-2xl p-4 mb-4 text-left"
          style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-bold text-base" style={{ color: 'var(--amber-bright)' }}>
              5 Credits — AUD $19.99
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              $4.00 each
            </span>
          </div>
          {[
            '5 full AI analyses',
            'Credits never expire',
            'GP-ready PDF reports',
            'Australian-built AI',
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 text-xs mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span style={{ color: 'var(--amber)' }}>✓</span> {f}
            </div>
          ))}
        </div>

        {error && (
          <p
            className="text-xs mb-3 rounded-xl px-3 py-2"
            style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-display font-bold text-base mb-3 transition-all"
          style={{
            background: loading ? 'var(--bg-elevated)' : 'var(--amber)',
            color: loading ? 'var(--text-muted)' : '#000',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Redirecting to checkout…' : 'Get 5 analyses for $19.99 →'}
        </button>

        <button
          onClick={onClose}
          className="text-sm block mx-auto"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Maybe later
        </button>

        <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          🔒 Stripe secure checkout · 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
