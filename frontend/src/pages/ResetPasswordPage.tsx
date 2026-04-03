// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Microscope, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) setError('Invalid reset link. Please request a new one.');
  }, [token]);

  const strength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981', '#10B981'];
  const s = strength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) { setDone(true); }
      else { setError(data.error || 'Reset failed. Please request a new link.'); }
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

        {!done ? (
          <div className="space-y-7">
            <div>
              <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Set new password</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose a strong password for your account.</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-lg p-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="pp-label">New password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters" required className="pp-input pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= s ? strengthColor[s] : 'var(--bg-border)' }} />
                      ))}
                    </div>
                    <p className="text-xs font-mono" style={{ color: strengthColor[s] }}>{strengthLabel[s]}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="pp-label">Confirm password</label>
                <input
                  type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password" required className="pp-input"
                />
                {confirm && password !== confirm && (
                  <p className="text-xs mt-1 font-mono" style={{ color: '#EF4444' }}>Passwords don't match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !token || password !== confirm || password.length < 8}
                className="pp-btn-primary w-full"
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Resetting…</span>
                  : <span className="flex items-center justify-center gap-2"><Lock size={15} />Set New Password <ArrowRight size={15} /></span>
                }
              </button>
            </form>
          </div>
        ) : (
          <div className="pp-card p-8 text-center space-y-5" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle size={32} style={{ color: '#10B981' }} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Password updated</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your password has been reset successfully. You can now sign in.</p>
            </div>
            <button onClick={() => navigate('/login')} className="pp-btn-primary w-full" style={{ padding: '12px' }}>
              Sign in <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
