// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { PARA } from '../utils/para-copy';

/* ── New-user welcome modal ──────────────────────────────────────── */
const NewUserWelcomeModal: React.FC<{ firstName?: string; credits: number; onClose: () => void }> = ({ firstName, credits, onClose }) => (
  <div
    onClick={e => e.target === e.currentTarget && onClose()}
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
      borderRadius: 20, maxWidth: 420, width: '100%',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
      animation: 'welcomeIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {/* Accent bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg,#00BFA5,#A8D5BA,#fbbf24)' }} />

      <div style={{ padding: '28px 28px 24px' }}>
        {/* Icon + heading */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>
            You're in{firstName ? `, ${firstName}` : ''}!
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            Welcome to ParasitePro — Australia's AI-powered parasite education tool.
          </p>
        </div>

        {/* Credits badge */}
        <div style={{
          background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)',
          borderRadius: 12, padding: '14px 16px', marginBottom: 20, textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800, color: 'var(--amber-bright)' }}>
            {credits} free {credits === 1 ? 'analysis' : 'analyses'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
            ready to use — no credit card needed
          </p>
        </div>

        {/* 3-step explainer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {[
            { icon: '📸', text: 'Upload a photo of your sample — skin, stool, or environmental' },
            { icon: '🔬', text: 'Our AI gives you a structured educational assessment in seconds' },
            { icon: '🏥', text: 'Use the report to have a more informed conversation with your GP' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '13px', border: 'none', borderRadius: 12,
            background: 'var(--amber)', color: '#000',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          Start my first analysis →
        </button>

        <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
          ⚠️ Educational use only — not medical advice. Always consult a GP for health concerns.
        </p>
      </div>
    </div>
    <style>{`@keyframes welcomeIn { from{opacity:0;transform:scale(0.92) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }`}</style>
  </div>
);

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const URGENCY_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  low:       { bg: '#D1FAE5', color: '#065F46', label: 'Low risk' },
  moderate:  { bg: '#FEF3C7', color: '#92400E', label: 'Moderate' },
  high:      { bg: '#FEE2E2', color: '#991B1B', label: 'See GP' },
  emergency: { bg: '#FEE2E2', color: '#7F1D1D', label: 'Urgent' },
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome modal for brand-new users
    try {
      if (sessionStorage.getItem('para_new_user') === '1') {
        setShowWelcome(true);
        sessionStorage.removeItem('para_new_user');
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    axios.get(`${API_URL}/analysis`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => setAnalyses(r.data.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const credits = user?.imageCredits ?? 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {showWelcome && (
        <NewUserWelcomeModal
          firstName={user?.firstName}
          credits={credits}
          onClose={() => { setShowWelcome(false); navigate('/upload'); }}
        />
      )}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
              {user?.firstName ? `Hey ${user.firstName}!` : 'Welcome back!'}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {analyses.length > 0 ? PARA.dashboard.welcomeSub : 'Ready when you are.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 rounded-xl font-display font-bold text-sm flex items-center gap-2 transition-all"
            style={{ background: 'var(--amber)', color: '#000' }}>
            🔬 New analysis
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Credits card */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              Credits remaining
            </p>
            <p className="font-display font-bold text-5xl mb-1" style={{ color: 'var(--amber-bright)' }}>
              {credits}
            </p>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
              {credits === 0
                ? "You've used them all! Top up to keep going."
                : credits === 1
                ? 'One left — make it count!'
                : 'Each credit = one full deep analysis'}
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: 'rgba(217,119,6,0.12)', color: 'var(--amber-bright)', border: '1px solid rgba(217,119,6,0.3)' }}>
              Get more credits
            </button>
          </div>

          {/* Recent analyses */}
          <div className="md:col-span-2 rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <h3 className="font-display font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>
              Recent analyses
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
                ))}
              </div>
            ) : analyses.length === 0 ? (
              /* ── Empty state ── */
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🔬</div>
                <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                  {PARA.dashboard.emptyHead}
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  {PARA.dashboard.emptySub}
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-8 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: 'var(--amber)', color: '#000' }}>
                  {PARA.dashboard.emptyCta}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {analyses.map((a: any) => {
                  const u = URGENCY_STYLES[a.urgencyLevel] || URGENCY_STYLES.low;
                  return (
                    <button
                      key={a.id}
                      onClick={() => navigate(`/analysis/${a.id}`)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background: 'var(--bg-base)' }}>
                        📸
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {a.sampleType ? a.sampleType.charAt(0).toUpperCase() + a.sampleType.slice(1) + ' sample' : 'Sample analysis'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(a.uploadedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {a.status === 'processing' ? ' · Processing…' : ''}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                        style={{ background: u.bg, color: u.color }}>
                        {u.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '📚', label: 'Encyclopedia', path: '/encyclopedia' },
            { icon: '📖', label: 'Tips & Info', path: '/tips' },
            { icon: '📋', label: 'My Reports', path: '/my-reports' },
            { icon: '🗺️', label: 'Travel risk map', path: '/travel-risk' },
            { icon: '📓', label: 'Symptom journal', path: '/symptom-journal' },
            { icon: '🎯', label: 'Sample report', path: '/sample-report' },
          ].map(({ icon, label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--bg-border)' }}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
