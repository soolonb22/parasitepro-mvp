// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Microscope, CreditCard, CheckCircle,
  AlertTriangle, Loader, Grid, List, Plus,
  Settings, HelpCircle, ChevronRight, FlaskConical,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import ReferralSection from '../components/ReferralSection';
import ParasiteInfoWidget from '../components/ParasiteInfoWidget';
import AustraliaRiskMap from '../components/AustraliaRiskMap';
import SymptomChecker from '../components/SymptomChecker';
import LiveStatsTicker from '../components/LiveStatsTicker';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const SAMPLE_TYPE_LABELS = {
  stool: 'Stool', blood: 'Blood Smear', skin: 'Skin',
  environmental: 'Environmental', microscopy: 'Microscopy', other: 'Other',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshUser } = useAuthStore();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    refreshUser();
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/user/history?limit=20`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnalyses(response.data.analyses || []);
    } catch {
      toast.error('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: analyses.length,
    completed: analyses.filter(a => a.status === 'completed').length,
    credits: user?.imageCredits ?? 0,
  };

  const filteredAnalyses = filter === 'all'
    ? analyses
    : analyses.filter(a => a.status === filter || a.sampleType === filter);

  const getStatusBadge = (status) => {
    const map = {
      completed: { label: 'Done', style: { background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' } },
      processing: { label: 'Processing', style: { background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' } },
      failed: { label: 'Failed', style: { background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' } },
    };
    return map[status] || { label: status, style: { background: 'rgba(107,114,128,0.1)', color: '#9CA3AF', border: '1px solid rgba(107,114,128,0.2)' } };
  };

  const FILTERS = ['all', 'completed', 'processing', 'stool', 'skin', 'blood', 'environmental'];
  const isNewUser = !loading && analyses.length === 0;

  return (
    <div className="pp-page">

      {/* Nav */}
      <nav className="pp-nav">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={16} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/upload')} className="pp-btn-primary" style={{ padding: '8px 16px' }}>
            <Plus size={15} /> New Analysis
          </button>
          <button onClick={() => navigate('/settings')} className="pp-btn-ghost" style={{ padding: '8px 12px' }}>
            <Settings size={15} />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">

        {/* Disclaimer */}
        <div className="mb-6 flex items-start gap-2 px-4 py-3 rounded-xl text-xs animate-fade-in"
          style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', color: 'var(--text-secondary)' }}>
          <AlertTriangle size={13} style={{ color: 'var(--amber)', marginTop: '1px', flexShrink: 0 }} />
          <span>ParasitePro is an educational tool only — not a diagnostic service. Always consult a qualified healthcare professional for medical decisions.</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
              {user?.firstName ? `Hello, ${user.firstName}` : 'Dashboard'}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {isNewUser ? "Let's get your first analysis done" : 'Your specimen analysis history'}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            NEW USER — PARA-LED CONVERSATIONAL DASHBOARD
        ═══════════════════════════════════════════════════════ */}
        {isNewUser ? (
          <div className="animate-slide-up">

            {/* Credits callout */}
            <div className="pp-card p-5 mb-6" style={{ border: '1px solid rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.04)' }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)' }}>
                    <span style={{ fontSize: 20 }}>🎁</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      You have <span style={{ color: '#2dd4bf' }}>{stats.credits} {stats.credits === 1 ? 'credit' : 'credits'}</span> ready to use
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {stats.credits === 0 ? 'Head to Pricing to top up' : 'Each credit gives you one full AI analysis report'}
                    </p>
                  </div>
                </div>
                {stats.credits > 0 && (
                  <button onClick={() => navigate('/upload')} className="pp-btn-primary" style={{ padding: '10px 20px' }}>
                    <Upload size={15} /> Start your first analysis
                  </button>
                )}
                {stats.credits === 0 && (
                  <button onClick={() => navigate('/pricing')} className="pp-btn-primary" style={{ padding: '10px 20px' }}>
                    <CreditCard size={15} /> Get credits
                  </button>
                )}
              </div>
            </div>

            {/* PARA guide section — main focus for new users */}
            <div className="pp-card p-8 mb-6 text-center" style={{ border: '1px solid rgba(13,148,136,0.2)', background: 'rgba(13,148,136,0.03)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
              <h2 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                PARA is here to guide you
              </h2>
              <p className="text-sm mb-6 mx-auto" style={{ color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.7 }}>
                PARA is your personal AI guide — not just a chatbot. Tap the robot in the bottom-right corner and PARA will walk you through your first analysis step by step, answer any questions, and help you understand your results.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    // Trigger PARA to open — dispatch a custom event
                    window.dispatchEvent(new CustomEvent('para:open'));
                  }}
                  style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', border: 'none', color: 'white', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>👋</span> Chat with PARA
                </button>
                <button onClick={() => navigate('/upload')}
                  style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.3)', color: 'var(--amber)', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Upload size={15} /> Upload a sample directly
                </button>
              </div>
              {/* Arrow pointing to PARA */}
              <div className="mt-6 flex items-center justify-end gap-2 opacity-60">
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>PARA is down there →</span>
                <div style={{ fontSize: 20 }}>↘</div>
              </div>
            </div>

            {/* How it works — 3 steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { n: '01', icon: '📸', title: 'Take a photo', body: 'Photograph your specimen — stool, skin, or anything else. Good lighting is the most important thing.' },
                { n: '02', icon: '🔬', title: 'AI analyses it', body: 'Our AI compares visual patterns against thousands of documented cases and builds your report in ~60 seconds.' },
                { n: '03', icon: '📋', title: 'Get your report', body: 'Receive a confidence-rated, structured educational report with urgency classification and next steps.' },
              ].map(step => (
                <div key={step.n} className="pp-card p-5 animate-slide-up" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(217,119,6,0.35)', letterSpacing: '0.1em' }}>{step.n}</div>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{step.icon}</div>
                  <p className="font-heading font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>{step.body}</p>
                </div>
              ))}
            </div>

            {/* Live stats */}
            <div className="mb-6"><LiveStatsTicker /></div>

          </div>

        ) : (
          /* ═══════════════════════════════════════════════════════
              RETURNING USER — FULL DASHBOARD
          ═══════════════════════════════════════════════════════ */
          <>
            {/* Live Stats */}
            <div className="mb-6 animate-slide-up"><LiveStatsTicker /></div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Microscope size={18} style={{ color: 'var(--amber)' }} />, label: 'Total Analyses', value: stats.total, accent: false },
                { icon: <CheckCircle size={18} style={{ color: '#10B981' }} />, label: 'Completed', value: stats.completed, accent: false },
                { icon: <CreditCard size={18} style={{ color: 'var(--amber-bright)' }} />, label: 'Credits Remaining', value: stats.credits, accent: stats.credits === 0, cta: stats.credits === 0 ? { label: 'Top up →', href: '/pricing' } : null },
              ].map(({ icon, label, value, accent, cta }, i) => (
                <div key={label} className="pp-card p-5 animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, border: accent ? '1px solid rgba(239,68,68,0.3)' : undefined }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>{icon}</div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="font-display font-bold text-3xl" style={{ color: accent ? '#EF4444' : 'var(--text-primary)' }}>{value}</span>
                    {cta && <button onClick={() => navigate(cta.href)} className="mb-1 text-xs hover:underline" style={{ color: 'var(--amber)' }}>{cta.label}</button>}
                  </div>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analyses */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {FILTERS.map((f) => (
                      <button key={f} onClick={() => setFilter(f)}
                        className="px-3 py-1.5 rounded-full text-xs font-mono font-medium capitalize transition-all"
                        style={filter === f
                          ? { background: 'rgba(217,119,6,0.15)', color: 'var(--amber-bright)', border: '1px solid rgba(217,119,6,0.3)' }
                          : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }
                        }>{f}</button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
                      <button key={mode} onClick={() => setViewMode(mode)} className="p-2 rounded-lg transition-all"
                        style={{ background: viewMode === mode ? 'var(--bg-elevated)' : 'transparent', border: '1px solid ' + (viewMode === mode ? 'var(--bg-border)' : 'transparent'), color: 'var(--text-secondary)' }}>
                        <Icon size={15} />
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="pp-card flex items-center justify-center h-48">
                    <Loader className="animate-spin" size={28} style={{ color: 'var(--amber)' }} />
                  </div>
                ) : filteredAnalyses.length === 0 ? (
                  <div className="pp-card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      <FlaskConical size={28} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p className="font-heading font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No {filter === 'all' ? '' : filter} analyses yet</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Upload a specimen image to get started</p>
                    <button onClick={() => navigate('/upload')} className="pp-btn-primary"><Upload size={15} /> Upload Image</button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredAnalyses.map((analysis, i) => {
                      const badge = getStatusBadge(analysis.status);
                      return (
                        <button key={analysis.id} onClick={() => navigate(`/analysis/${analysis.id}`)}
                          className="pp-card overflow-hidden text-left group transition-all hover:scale-[1.02] animate-slide-up"
                          style={{ animationDelay: `${i * 0.04}s`, border: '1px solid var(--bg-border)' }}>
                          <div className="relative overflow-hidden">
                            {analysis.thumbnailUrl
                              ? <img src={analysis.thumbnailUrl} alt="Sample" className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                              : <div className="w-full h-28 flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}><Microscope size={22} style={{ color: 'var(--text-muted)' }} /></div>
                            }
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ border: '1px solid rgba(217,119,6,0.3)' }}>
                              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--amber)' }} />
                              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--amber)' }} />
                              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--amber)' }} />
                              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--amber)' }} />
                            </div>
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-mono" style={badge.style}>{badge.label}</span>
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{SAMPLE_TYPE_LABELS[analysis.sampleType] || 'Unknown'}</p>
                            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(analysis.uploadedAt).toLocaleDateString('en-AU')}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAnalyses.map((analysis, i) => {
                      const badge = getStatusBadge(analysis.status);
                      return (
                        <button key={analysis.id} onClick={() => navigate(`/analysis/${analysis.id}`)}
                          className="w-full pp-card p-4 flex items-center gap-4 text-left group transition-all hover:border-amber-500 animate-slide-up"
                          style={{ animationDelay: `${i * 0.04}s` }}>
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--bg-border)' }}>
                            {analysis.thumbnailUrl
                              ? <img src={analysis.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}><Microscope size={16} style={{ color: 'var(--text-muted)' }} /></div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{SAMPLE_TYPE_LABELS[analysis.sampleType] || 'Unknown'}</p>
                            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{new Date(analysis.uploadedAt).toLocaleDateString('en-AU')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 rounded-full text-xs font-mono" style={badge.style}>{badge.label}</span>
                            <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="pp-card p-4 animate-slide-up delay-200">
                  <p className="pp-section-title mb-4">Quick Actions</p>
                  <div className="space-y-2">
                    <button onClick={() => navigate('/upload')} className="pp-btn-primary w-full" style={{ padding: '10px 16px' }}><Upload size={15} /> New Analysis</button>
                    <button onClick={() => navigate('/faq')} className="pp-btn-ghost w-full" style={{ padding: '10px 16px' }}><HelpCircle size={15} /> Help & FAQ</button>
                    <button onClick={() => navigate('/settings')} className="pp-btn-ghost w-full" style={{ padding: '10px 16px' }}><Settings size={15} /> Settings</button>
                  </div>
                </div>
                <div className="animate-slide-up delay-300"><SymptomChecker /></div>
                <div className="animate-slide-up delay-400"><AustraliaRiskMap /></div>
                <div className="animate-slide-up delay-500"><ParasiteInfoWidget /></div>
                {user && <div className="animate-slide-up delay-600"><ReferralSection userId={user.id} referralCount={0} creditsEarned={0} /></div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
