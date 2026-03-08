import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { Microscope, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import SettingsPage from './pages/SettingsPage';
import FAQPage from './pages/FAQPage';
import AdminPage from './pages/AdminPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <div
        className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--bg-border)' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(217,119,6,0.12) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(45,47,58,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(45,47,58,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
              <Microscope size={20} style={{ color: 'var(--amber)' }} />
            </div>
            <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono"
            style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)', color: 'var(--amber-bright)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse 2s infinite' }} />
            AI Assessment Engine Active
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            We don't flinch.<br /><span style={{ color: 'var(--amber)' }}>We find out.</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Upload a photo. Get a structured, evidence-based parasite identification in seconds. Built for Australians who live where the wildlife bites back.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[{ label: 'Sample Types', value: '6+' }, { label: 'AI Accuracy', value: '94%' }, { label: 'Avg. Response', value: '<30s' }].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <div className="font-display font-bold text-2xl" style={{ color: 'var(--amber-bright)' }}>{value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs" style={{ color: 'var(--text-muted)' }}>⚠️ For educational reference only. Not a substitute for medical advice.</div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Microscope size={18} style={{ color: 'var(--amber)' }} />
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (res.ok) { login(data.user, data.accessToken, data.refreshToken); window.location.href = '/dashboard'; }
      else setError(data.error || 'Login failed. Check your credentials.');
    } catch { setError('Unable to connect. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell>
      <div className="animate-slide-up space-y-7">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Sign in</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Welcome back. Access your assessments.</p>
        </div>
        {error && (
          <div className="flex items-start gap-3 rounded-lg p-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
            <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="pp-label">Email address</label>
            <input name="email" type="email" placeholder="you@example.com" required className="pp-input" />
          </div>
          <div>
            <label className="pp-label">Password</label>
            <div className="relative">
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" required className="pp-input pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a href="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>Forgot password?</a>
            </div>
          </div>
          <button type="submit" disabled={loading} className="pp-btn-primary w-full" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Signing in…</span>
              : <span className="flex items-center justify-center gap-2">Sign in <ArrowRight size={16} /></span>}
          </button>
        </form>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          No account?{' '}<a href="/signup" style={{ color: 'var(--amber-bright)' }} className="hover:underline font-medium">Create one free</a>
        </p>
      </div>
    </AuthShell>
  );
}

function SignupPage() {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
    try {
      const res = await fetch(`${API_URL}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, firstName, lastName }) });
      const data = await res.json();
      if (res.ok) { login(data.user, data.accessToken, data.refreshToken); window.location.href = '/dashboard'; }
      else setError(data.error || 'Sign up failed. Please try again.');
    } catch { setError('Unable to connect. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell>
      <div className="animate-slide-up space-y-7">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Create account</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start with 3 free analyses. No credit card required.</p>
        </div>
        {error && (
          <div className="flex items-start gap-3 rounded-lg p-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
            <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="pp-label">First name</label><input name="firstName" type="text" placeholder="Jane" className="pp-input" /></div>
            <div><label className="pp-label">Last name</label><input name="lastName" type="text" placeholder="Smith" className="pp-input" /></div>
          </div>
          <div>
            <label className="pp-label">Email address</label>
            <input name="email" type="email" placeholder="you@example.com" required className="pp-input" />
          </div>
          <div>
            <label className="pp-label">Password</label>
            <div className="relative">
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Minimum 8 characters" required className="pp-input pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="pp-btn-primary w-full" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Creating account…</span>
              : <span className="flex items-center justify-center gap-2">Create free account <ArrowRight size={16} /></span>}
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            By signing up you agree to our <a href="/terms" style={{ color: 'var(--amber)' }}>Terms</a> and <a href="/privacy" style={{ color: 'var(--amber)' }}>Privacy Policy</a>.
          </p>
        </form>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}<a href="/login" style={{ color: 'var(--amber-bright)' }} className="hover:underline font-medium">Sign in</a>
        </p>
      </div>
    </AuthShell>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--bg-border)', fontFamily: 'var(--font-heading)', fontSize: '14px' },
        success: { iconTheme: { primary: '#10B981', secondary: 'var(--bg-elevated)' } },
        error: { iconTheme: { primary: '#EF4444', secondary: 'var(--bg-elevated)' } },
      }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisResultsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
