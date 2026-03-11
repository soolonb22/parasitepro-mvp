// @ts-nocheck
import { useState, useEffect } from 'react';
import {
  X, Microscope, BookOpen, Globe, Shield, Stethoscope,
  AlertTriangle, MapPin, Zap, ChevronDown, ChevronUp,
  ExternalLink, Loader, CheckCircle, Lock, Coins,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

interface DeepDiveReport {
  parasiteName: string;
  scientificName: string;
  overview: string;
  taxonomy: string;
  lifecycle: string;
  transmission: string;
  symptomsAndProgression: string;
  diagnosis: string;
  treatment: string;
  prevention: string;
  australianRelevance: string;
  keyFacts: string[];
  sources: { title: string; organisation: string; year?: string }[];
}

interface Props {
  analysisId: string;
  parasiteName: string;
  scientificName?: string;
  userCredits: number;
  onClose: () => void;
  onCreditsUsed: () => void;
}

// ─── Section accordion ───────────────────────────────────────────────────────
const SECTIONS = [
  { key: 'overview',              icon: BookOpen,      title: 'Overview',                 color: '#F59E0B' },
  { key: 'taxonomy',              icon: Microscope,    title: 'Taxonomy & Classification', color: '#60A5FA' },
  { key: 'lifecycle',             icon: Zap,           title: 'Lifecycle',                 color: '#A78BFA' },
  { key: 'transmission',          icon: Globe,         title: 'How You Get Infected',      color: '#F87171' },
  { key: 'symptomsAndProgression',icon: AlertTriangle, title: 'Symptoms & Progression',   color: '#FB923C' },
  { key: 'diagnosis',             icon: Stethoscope,   title: 'Diagnosis',                 color: '#34D399' },
  { key: 'treatment',             icon: Shield,        title: 'Treatment',                 color: '#818CF8' },
  { key: 'prevention',            icon: CheckCircle,   title: 'Prevention',                color: '#6EE7B7' },
  { key: 'australianRelevance',   icon: MapPin,        title: 'Australian Relevance',      color: '#FCD34D' },
];

const SectionBlock = ({ icon: Icon, title, color, content, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--bg-border)', background: 'var(--bg-card)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left"
        style={{ background: open ? 'rgba(255,255,255,0.03)' : 'transparent' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <Icon size={15} style={{ color }} />
          </div>
          <span className="font-heading font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="pt-2" style={{ borderTop: '1px solid var(--bg-border)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              {content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Paywall gate ─────────────────────────────────────────────────────────────
const PaywallGate = ({ parasiteName, scientificName, userCredits, onConfirm, loading }) => (
  <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
    {/* Animated icon */}
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)' }}>
        <Microscope size={36} style={{ color: 'var(--amber)' }} />
      </div>
      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: 'var(--bg-elevated)', border: '2px solid rgba(245,158,11,0.4)' }}>
        <Lock size={12} style={{ color: 'var(--amber)' }} />
      </div>
    </div>

    <h2 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
      Deep Dive Report
    </h2>
    <p className="text-sm mb-1 font-semibold" style={{ color: 'var(--amber)' }}>{parasiteName}</p>
    {scientificName && (
      <p className="text-xs italic mb-6" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {scientificName}
      </p>
    )}

    <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
      Get an in-depth, AI-researched clinical report on this parasite — including its lifecycle, transmission routes,
      symptoms, diagnosis methods, treatment categories, and Australian-specific context.
    </p>

    {/* What's included */}
    <div className="w-full max-w-sm mb-8 rounded-xl p-4 text-left space-y-2"
      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
      {[
        '🔬 Full taxonomy & lifecycle',
        '🦠 Transmission routes & risk factors',
        '🩺 Symptoms, diagnosis & treatment',
        '🛡️ Prevention for Australians',
        '📍 Queensland & tropical relevance',
        '📚 Cited authoritative sources',
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>{item}</span>
        </div>
      ))}
    </div>

    {/* Credit cost */}
    <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
      <Coins size={14} style={{ color: 'var(--amber)' }} />
      <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
        Cost: <strong style={{ color: 'var(--text-primary)' }}>1 credit</strong>
        &nbsp;·&nbsp; Your balance:{' '}
        <strong style={{ color: userCredits > 0 ? '#34D399' : '#EF4444' }}>{userCredits} credits</strong>
      </span>
    </div>

    {userCredits < 1 ? (
      <div className="space-y-3 w-full max-w-xs">
        <div className="text-sm text-center py-3 px-4 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
          You don't have enough credits to generate this report.
        </div>
        <a href="/pricing" className="pp-btn-primary w-full flex items-center justify-center gap-2"
          style={{ textDecoration: 'none' }}>
          <Coins size={15} /> Get More Credits
        </a>
      </div>
    ) : (
      <button
        onClick={onConfirm}
        disabled={loading}
        className="pp-btn-primary flex items-center gap-2 px-8"
        style={{ fontSize: '15px', padding: '12px 28px', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? (
          <><Loader size={15} className="animate-spin" /> Researching…</>
        ) : (
          <><Microscope size={15} /> Generate Deep Dive — 1 Credit</>
        )}
      </button>
    )}

    <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
      Report is generated once and saved — re-reading is always free.
    </p>
  </div>
);

// ─── Report view ──────────────────────────────────────────────────────────────
const ReportView = ({ report }: { report: DeepDiveReport }) => (
  <div className="px-4 pb-8 max-w-2xl mx-auto w-full">
    {/* Header */}
    <div className="py-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-mono uppercase tracking-wider"
        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--amber)' }}>
        <Microscope size={11} /> Deep Dive Report
      </div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {report.parasiteName}
      </h1>
      {report.scientificName && (
        <p className="text-sm italic" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {report.scientificName}
        </p>
      )}
    </div>

    {/* Key facts pill strip */}
    {report.keyFacts?.length > 0 && (
      <div className="mb-5 p-4 rounded-xl space-y-2"
        style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--amber)' }}>Key Facts</p>
        <ul className="space-y-2">
          {report.keyFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              <CheckCircle size={13} style={{ color: 'var(--amber)', marginTop: '2px', flexShrink: 0 }} />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Accordion sections */}
    <div className="space-y-2">
      {SECTIONS.map((s, i) => (
        report[s.key] ? (
          <SectionBlock
            key={s.key}
            icon={s.icon}
            title={s.title}
            color={s.color}
            content={report[s.key]}
            defaultOpen={i < 2}
          />
        ) : null
      ))}
    </div>

    {/* Sources */}
    {report.sources?.length > 0 && (
      <div className="mt-5 rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-border)' }}>
        <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Sources & References
        </p>
        <ul className="space-y-2">
          {report.sources.map((src, i) => (
            <li key={i} className="flex items-start gap-2">
              <ExternalLink size={11} style={{ color: 'var(--text-muted)', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{src.organisation}</span>
                {src.title && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}> — {src.title}</span>
                )}
                {src.year && (
                  <span className="text-xs font-mono ml-1" style={{ color: 'var(--text-muted)' }}>({src.year})</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Disclaimer */}
    <div className="mt-5 flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
      <AlertTriangle size={11} style={{ marginTop: '2px', flexShrink: 0 }} />
      <span>
        This AI-generated report is for educational purposes only and does not constitute medical advice.
        Consult a qualified healthcare professional for diagnosis and treatment. In an emergency, call 000.
      </span>
    </div>
  </div>
);

// ─── Main modal ───────────────────────────────────────────────────────────────
const DeepDiveModal = ({ analysisId, parasiteName, scientificName, userCredits, onClose, onCreditsUsed }: Props) => {
  const { accessToken } = useAuthStore();
  const [phase, setPhase] = useState<'gate' | 'loading' | 'report'>('gate');
  const [report, setReport] = useState<DeepDiveReport | null>(null);
  const [generating, setGenerating] = useState(false);

  // Try to load cached report on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/analysis/${analysisId}/deep-dive`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data.report) {
          setReport(res.data.report);
          setPhase('report');
        }
      } catch {
        // No cached report — show paywall gate
      }
    })();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(
        `${API_URL}/analysis/${analysisId}/deep-dive`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setReport(res.data.report);
      setPhase('report');
      if (!res.data.cached) {
        onCreditsUsed();
        toast.success('Deep Dive report generated! 1 credit used.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to generate report';
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl my-4 mx-4 rounded-2xl overflow-hidden animate-slide-up"
        style={{
          background: 'var(--bg-base)',
          border: '1px solid rgba(245,158,11,0.2)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1)',
          minHeight: '60vh',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}
        >
          <X size={14} />
        </button>

        {/* Amber top bar */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--amber), transparent)' }} />

        {phase === 'gate' && (
          <PaywallGate
            parasiteName={parasiteName}
            scientificName={scientificName}
            userCredits={userCredits}
            onConfirm={handleGenerate}
            loading={generating}
          />
        )}

        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader size={32} className="animate-spin" style={{ color: 'var(--amber)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Researching from authoritative sources…</p>
          </div>
        )}

        {phase === 'report' && report && <ReportView report={report} />}
      </div>
    </div>
  );
};

export default DeepDiveModal;
