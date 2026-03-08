// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { CheckCircle, Zap, ArrowRight, Loader } from 'lucide-react';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken, refreshUser } = useAuthStore();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { navigate('/pricing'); return; }

    // Poll until webhook has processed (up to 15s)
    let attempts = 0;
    const poll = async () => {
      try {
        const res = await axios.get(`${API_URL}/payment/verify-session?session_id=${sessionId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.data.paid) {
          await refreshUser(); // Update credits in store
          setCredits(res.data.credits);
          setStatus('success');
        } else if (attempts < 5) {
          attempts++;
          setTimeout(poll, 2500);
        } else {
          setStatus('error');
        }
      } catch {
        if (attempts < 5) { attempts++; setTimeout(poll, 2500); }
        else setStatus('error');
      }
    };
    poll();
  }, []);

  if (status === 'verifying') return (
    <div className="pp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size={28} style={{ color: 'var(--amber)', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CONFIRMING PAYMENT…</div>
      </div>
    </div>
  );

  if (status === 'error') return (
    <div className="pp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="pp-card" style={{ padding: 40, maxWidth: 440, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Payment confirmed but credits may take a moment to appear. Check your dashboard.</p>
        <button onClick={() => navigate('/dashboard')} className="pp-btn-primary" style={{ padding: '10px 24px' }}>Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="pp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="pp-card" style={{ padding: 48, maxWidth: 480, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #10B981, transparent)' }} />
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={28} style={{ color: '#10B981' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Payment confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28 }}>Your credits are ready to use.</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', marginBottom: 32 }}>
          <Zap size={16} style={{ color: 'var(--amber)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>{credits} credits available</span>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/upload')} className="pp-btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
            Start Analysis <ArrowRight size={15} />
          </button>
          <button onClick={() => navigate('/dashboard')} className="pp-btn" style={{ padding: '12px 20px' }}>Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
