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
import WelcomeModal from '../components/WelcomeModal';
import ReferralSection from '../components/ReferralSection';
import ParasiteInfoWidget from '../components/ParasiteInfoWidget';
import AustraliaRiskMap from '../components/AustraliaRiskMap';
import ParaChatbot from '../components/ParaChatbot';
import SymptomChecker from '../components/SymptomChecker';
import LiveStatsTicker from '../components/LiveStatsTicker';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;
const WELCOME_SHOWN_KEY = 'parasite_welcome_shown';

const SAMPLE_TYPE_LABELS = {
  stool: 'Stool',
  blood: 'Blood Smear',
  skin: 'Skin',
  environmental: 'Environmental',
  microscopy: 'Microscopy',
  other: 'Other',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshUser } = useAuthStore();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    refreshUser(); // always pull fresh credits/profile on mount
    fetchAnalyses();
    const alreadyShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!alreadyShown) {
      setTimeout(() => setShowWelcome(true), 500);
      localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    }
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

  const filteredAnalyses = analyses.filter((a) => {
    if (filter === 'all') return true;
    if (['stool', 'blood', 'skin', 'other', 'microscopy', 'environmental'].includes(filter)) return a.sampleType === filter;
    return a.status === filter;
  });

  const stats = {
    total: analyses.length,
    completed: analyses.filter((a) => a.status === 'completed').length,
    credits: user?.imageCredits || 0,
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: { label: 'Complete', style: { background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' } },
      processing: { label: 'Processing', style: { background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' } },
      failed: { label: 'Failed', style: { background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' } },
    };
    return map[status] || { label: status, style: { background: 'rgba(107,114,128,0.1)', color: '#9CA3AF', border: '1px solid rgba(107,114,128,0.2)' } };
  };

  const FILTERS = ['all', 'completed', 'processing', 'stool', 'skin', 'blood', 'environmental'];

  return (
    <div className="pp-page">
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} firstName={user?.firstName} />

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

      {/* Content */}
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
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Your specimen analysis history</p>
          </div>
        </div>

        {/* Live Stats Ticker */}
        <div className="mb-6 animate-slide-up">
          <LiveStatsTicker />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <Microscope size={18} style={{ color: 'var(--amber)' }} />,
              label: 'Total Analyses',
              value: stats.total,
              accent: false,
            },
            {
              icon: <CheckCircle size={18} style={{ color: '#10B981' }} />,
              label: 'Completed',
              value: stats.completed,
              accent: false,
            },
            {
              icon: <CreditCard size={18} style={{ color: 'var(--amber-bright)' }} />,
              label: 'Credits Remaining',
              value: stats.credits,
              accent: stats.credits === 0,
              cta: stats.credits === 0 ? { label: 'Top up →', href: '/pricing' } : null,
            },
          ].map(({ icon, label, value, accent, cta }, i) => (
            <div key={label}
              className="pp-card p-5 animate-slide-up"
              style={{
                animationDelay: `${i * 0.08}s`,
                border: accent ? '1px solid rgba(239,68,68,0.3)' : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--bg-elevated)' }}>
                  {icon}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="font-display font-bold text-3xl" style={{ color: accent ? '#EF4444' : 'var(--text-primary)' }}>{value}</span>
                {cta && (
                  <button onClick={() => navigate(cta.href)} className="mb-1 text-xs hover:underline" style={{ color: 'var(--amber)' }}>
                    {cta.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Analyses — 2 col */}
          <div className="lg:col-span-2">
            {/* Filter bar */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                {FILTERS.map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-full text-xs font-mono font-medium capitalize transition-all"
                    style={filter === f
                      ? { background: 'rgba(217,119,6,0.15)', color: 'var(--amber-bright)', border: '1px solid rgba(217,119,6,0.3)' }
                      : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }
                    }>
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className="p-2 rounded-lg transition-all"
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
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                  <FlaskConical size={28} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="font-heading font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No analyses yet</p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Upload your first specimen image to get started</p>
                <button onClick={() => navigate('/upload')} className="pp-btn-primary">
                  <Upload size={15} /> Upload Image
                </button>
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
                        {analysis.thumbnailUrl ? (
                          <img src={analysis.thumbnailUrl} alt="Sample" className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-28 flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>
                            <Microscope size={22} style={{ color: 'var(--text-muted)' }} />
                          </div>
                        )}
                        {/* Reticle overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ border: '1px solid rgba(217,119,6,0.3)' }}>
                          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: 'var(--amber)' }} />
                          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: 'var(--amber)' }} />
                          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: 'var(--amber)' }} />
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: 'var(--amber)' }} />
                        </div>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-mono" style={badge.style}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {SAMPLE_TYPE_LABELS[analysis.sampleType] || 'Unknown'}
                        </p>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                          {new Date(analysis.uploadedAt).toLocaleDateString('en-AU')}
                        </p>
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
            {/* Quick actions */}
            <div className="pp-card p-4 animate-slide-up delay-200">
              <p className="pp-section-title mb-4">Quick Actions</p>
              <div className="space-y-2">
                <button onClick={() => navigate('/upload')} className="pp-btn-primary w-full" style={{ padding: '10px 16px' }}>
                  <Upload size={15} /> New Analysis
                </button>
                <button onClick={() => navigate('/faq')} className="pp-btn-ghost w-full" style={{ padding: '10px 16px' }}>
                  <HelpCircle size={15} /> Help & FAQ
                </button>
                <button onClick={() => navigate('/settings')} className="pp-btn-ghost w-full" style={{ padding: '10px 16px' }}>
                  <Settings size={15} /> Settings
                </button>
              </div>
            </div>

            {/* Symptom Checker */}
            <div className="animate-slide-up delay-300">
              <SymptomChecker />
            </div>

            {/* Australia Risk Map */}
            <div className="animate-slide-up delay-400">
              <AustraliaRiskMap />
            </div>

            {/* Interactive parasite intelligence widget */}
            <div className="animate-slide-up delay-500">
              <ParasiteInfoWidget />
            </div>

            {/* Referral */}
            {user && (
              <div className="animate-slide-up delay-600">
                <ReferralSection userId={user.id} referralCount={0} creditsEarned={0} />
              </div>
            )}
          </div>
        </div>
      </div>
    <ParaChatbot page="dashboard" user={useAuthStore.getState().user} />
    </div>
  );
};

export default DashboardPage;
