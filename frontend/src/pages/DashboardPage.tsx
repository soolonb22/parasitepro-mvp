// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { PARA } from '../utils/para-copy';

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

  useEffect(() => {
    if (!accessToken) return;
    axios.get(`${API_URL}/analysis/user/history?limit=20`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => setAnalyses(r.data.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const credits = user?.imageCredits ?? 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
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
                  const sampleLabel = a.sampleType
                    ? a.sampleType.charAt(0).toUpperCase() + a.sampleType.slice(1) + ' sample'
                    : 'Sample analysis';
                  return (
                    <button
                      key={a.id}
                      onClick={() => navigate(`/analysis/${a.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>

                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden"
                        style={{ background: 'var(--bg-base)', border: '1px solid var(--bg-border)' }}>
                        {a.thumbnailUrl
                          ? <img src={a.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          : <span className="w-full h-full flex items-center justify-center text-xl">🔬</span>
                        }
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {sampleLabel}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(a.uploadedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {a.status === 'processing' && ' · Processing…'}
                          {a.detectionCount > 0 && ` · ${a.detectionCount} region${a.detectionCount !== 1 ? 's' : ''} flagged`}
                        </p>
                      </div>

                      {/* Urgency badge */}
                      {a.status === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                          style={{ background: u.bg, color: u.color }}>
                          {u.label}
                        </span>
                      )}
                      {a.status === 'processing' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                          style={{ background: 'rgba(217,119,6,0.12)', color: 'var(--amber-bright)' }}>
                          Processing
                        </span>
                      )}
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
