// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, ArrowLeft, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { setSent(true); }
      else { setError(data.error || 'Request failed. Please try again.'); }
    } catch { setError('Unable to connect. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={18} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
        </div>

        {!sent ? (
          <div className="space-y-7">
            <div>
              <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Forgot password?</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter your email and we'll send you a reset link.</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-lg p-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="pp-label">Email address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required className="pp-input"
                />
              </div>
              <button type="submit" disabled={loading} className="pp-btn-primary w-full" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Sending…</span>
                  : <span className="flex items-center justify-center gap-2"><Mail size={16} />Send Reset Link <ArrowRight size={15} /></span>
                }
              </button>
            </form>

            <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={15} /> Back to sign in
            </button>
          </div>
        ) : (
          <div className="pp-card p-8 text-center space-y-5" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle size={32} style={{ color: '#10B981' }} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                If <span className="font-mono" style={{ color: 'var(--amber)' }}>{email}</span> has an account, a reset link has been sent. Check your inbox and spam folder.
              </p>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Link expires in 1 hour.</p>
            <button onClick={() => navigate('/login')} className="pp-btn-ghost w-full" style={{ padding: '10px' }}>
              <ArrowLeft size={15} /> Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
