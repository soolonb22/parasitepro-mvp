// @ts-nocheck
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = (() => {
  const b = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
  return b.endsWith('/api') ? b : `${b}/api`;
})();

const URGENCY_STYLES = {
  low:      { color: '#4ade80', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  label: '🟢 Low',      badge: 'LOW' },
  moderate: { color: '#fbbf24', bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.3)',  label: '🟡 Moderate', badge: 'MODERATE' },
  high:     { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', label: '🔴 High',     badge: 'HIGH' },
  urgent:   { color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  label: '🚨 Urgent',   badge: 'URGENT' },
};

const SAMPLE_ICONS = {
  stool: '🟤', skin: '🩹', blood: '🔬', other: '🌿', auto: '❓',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyReportsPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();

  const [reports, setReports]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<'all' | 'saved'>('all');
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!accessToken) { setLoading(false); return; }
    fetchReports();
  }, [accessToken, filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50, status: 'completed' };
      if (filter === 'saved') params.saved = 'true';
      const res = await axios.get(`${API_URL}/analysis/user/history`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params,
      });
      setReports(res.data.analyses || []);
    } catch (err: any) {
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (id: string, currentlySaved: boolean) => {
    try {
      await axios.patch(`${API_URL}/analysis/${id}/save`, { saved: !currentlySaved }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setReports(prev => prev.map(r => r.id === id ? { ...r, isSaved: !currentlySaved } : r));
    } catch {
      alert('Could not update save status. Please try again.');
    }
  };

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!accessToken) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="font-display font-bold text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>My Reports</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to view and manage your saved educational reports.</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl font-bold text-lg"
          style={{ background: 'var(--amber)', color: '#000', border: 'none', cursor: 'pointer' }}>
          Sign in to continue
        </button>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--amber-bright)' }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl" style={{ color: 'var(--text-primary)' }}>
              📋 My Reports
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Your completed educational analyses, saved for GP visit preparation.
            </p>
          </div>
          <Link
            to="/upload"
            className="px-5 py-3 rounded-2xl font-semibold text-sm"
            style={{ background: 'var(--amber)', color: '#000' }}>
            + New analysis
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'saved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: filter === f ? 'var(--amber)' : 'var(--bg-surface)',
                color: filter === f ? '#000' : 'var(--text-muted)',
                border: filter === f ? 'none' : '1px solid var(--bg-border)',
                cursor: 'pointer',
              }}>
              {f === 'all' ? '📂 All reports' : '💾 Saved only'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl p-4 mb-6 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-t-transparent animate-spin mb-4"
              style={{ borderColor: 'var(--amber)', borderTopColor: 'transparent' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading your reports…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="text-center py-24 rounded-3xl"
            style={{ background: 'var(--bg-surface)', border: '1px dashed var(--bg-border)' }}>
            <div className="text-5xl mb-4">{filter === 'saved' ? '💾' : '🔬'}</div>
            <p className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              {filter === 'saved' ? 'No saved reports yet' : 'No completed reports yet'}
            </p>
            <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
              {filter === 'saved'
                ? 'Open any report and tap "💾 Save this report to my account".'
                : 'Complete an analysis and your report will appear here.'}
            </p>
            <Link to="/upload"
              className="inline-block px-8 py-3 rounded-2xl font-semibold text-sm"
              style={{ background: 'var(--amber)', color: '#000' }}>
              Start an analysis
            </Link>
          </div>
        )}

        {/* Report cards */}
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => {
              const urgency = URGENCY_STYLES[report.urgencyLevel?.toLowerCase()] || null;
              const sampleIcon = SAMPLE_ICONS[report.sampleType] || '🔬';

              return (
                <div key={report.id}
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>

                  <div className="flex gap-4 p-5">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center text-3xl"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      {report.thumbnailUrl
                        ? <img src={report.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        : sampleIcon}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(report.uploadedAt)} · {report.sampleType || 'Unknown type'}
                            {report.detectionCount > 0 && ` · ${report.detectionCount} finding${report.detectionCount !== 1 ? 's' : ''}`}
                          </p>
                          {urgency && (
                            <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2"
                              style={{ background: urgency.bg, color: urgency.color, border: `1px solid ${urgency.border}` }}>
                              {urgency.label}
                            </span>
                          )}
                        </div>
                        {/* Save toggle */}
                        <button
                          onClick={() => toggleSave(report.id, report.isSaved)}
                          title={report.isSaved ? 'Remove from saved' : 'Save report'}
                          className="flex-shrink-0 text-lg transition-transform active:scale-90"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          {report.isSaved ? '💾' : '🤍'}
                        </button>
                      </div>

                      {/* Summary snippet */}
                      {report.overallAssessment && (
                        <p className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: 'var(--text-secondary)' }}>
                          {report.overallAssessment}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-2 px-5 pb-4">
                    <button
                      onClick={() => navigate(`/analysis/${report.id}`)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: 'rgba(217,119,6,0.12)', color: 'var(--amber-bright)', border: '1px solid rgba(217,119,6,0.25)', cursor: 'pointer' }}>
                      View full report →
                    </button>
                    <button
                      onClick={() => window.open(`/gp-report/${report.id}`, '_blank', 'noopener')}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--bg-border)', cursor: 'pointer' }}>
                      📤 Export for MHR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Subscription upsell */}
        <div className="mt-14 rounded-3xl p-8 text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid rgba(27,107,95,0.35)' }}>
          <h3 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Want unlimited history + more?
          </h3>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            Upgrade to the $6/month educational subscription for unlimited saved reports and full encyclopedia access.
          </p>
          <Link to="/pricing"
            className="inline-block px-8 py-3 rounded-2xl font-semibold text-sm"
            style={{ background: '#1B6B5F', color: 'white' }}>
            View subscription options
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-xs text-center leading-relaxed pb-8" style={{ color: 'var(--text-muted)' }}>
          Educational tool only. ParasitePro does not provide medical diagnoses or advice.
          Complies with TGA and AHPRA standards. In an emergency, call 000.
        </p>
      </div>
    </div>
  );
}
