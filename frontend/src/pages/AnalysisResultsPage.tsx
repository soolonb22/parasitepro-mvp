// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader, AlertTriangle, CheckCircle, AlertCircle,
  Microscope, ClipboardList, BookOpen, Pill, Leaf, MessageSquare,
  ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Activity,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import JournalPromptModal from '../components/JournalPromptModal';
import DeepDiveModal from '../components/DeepDiveModal';
import ParasiteBot from '../components/ParasiteBot';
import ParasiteProfile from '../components/ParasiteProfile';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

// ─── Urgency config ──────────────────────────────────────────────────────────
const URGENCY_MAP = {
  emergency: { label: 'Emergency', sublabel: 'Seek emergency care immediately',      bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', hBg: '#991B1B', hText: '#fff' },
  high:      { label: 'Urgent',    sublabel: 'See a doctor within 24-48 hours',      bg: '#FECACA', color: '#B91C1C', border: '#FCA5A5', hBg: '#64748B', hText: '#fff' },
  moderate:  { label: 'Moderate',  sublabel: 'Seek medical advice within 1-2 weeks', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', hBg: '#64748B', hText: '#fff' },
  low:       { label: 'Low Risk',  sublabel: 'Monitor, no immediate action needed',  bg: '#DCFCE7', color: '#166534', border: '#86EFAC', hBg: '#64748B', hText: '#fff' },
};
const getUrgency = (level) => URGENCY_MAP[level?.toLowerCase()] || URGENCY_MAP.low;

// Decorative detection box layouts (% positions)
const BOX_LAYOUTS = [
  [{ t: 12, l: 8,  w: 24, h: 20 }, { t: 55, l: 52, w: 20, h: 22 }],
  [{ t: 10, l: 30, w: 22, h: 20 }, { t: 50, l: 8,  w: 20, h: 22 }, { t: 62, l: 50, w: 18, h: 18 }],
  [{ t: 8,  l: 10, w: 26, h: 18 }, { t: 45, l: 50, w: 20, h: 22 }, { t: 65, l: 18, w: 20, h: 16 }, { t: 28, l: 58, w: 18, h: 18 }],
];

// ─── Annotated specimen image ─────────────────────────────────────────────────
const AnnotatedImage = ({ imageUrl, detectionCount = 1 }) => {
  const layout = BOX_LAYOUTS[Math.min(detectionCount - 1, BOX_LAYOUTS.length - 1)];
  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ background: '#0d0d1a', aspectRatio: '4/3' }}>
      {imageUrl && <img src={imageUrl} alt="Specimen" className="w-full h-full object-contain" />}

      {/* Scan line */}
      <div className="absolute inset-x-0 h-px pointer-events-none animate-scan"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.9), transparent)' }} />

      {/* Detection boxes */}
      {layout.map((box, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{ top: `${box.t}%`, left: `${box.l}%`, width: `${box.w}%`, height: `${box.h}%`,
            border: '2px solid rgba(34,197,94,0.75)', background: 'rgba(34,197,94,0.10)', borderRadius: '2px' }}>
          {[{ top: '-4px', left: '-4px' }, { top: '-4px', right: '-4px' },
            { bottom: '-4px', left: '-4px' }, { bottom: '-4px', right: '-4px' }].map((s, j) => (
            <div key={j} className="absolute w-2 h-2 rounded-full"
              style={{ ...s, background: '#fff', boxShadow: '0 0 5px rgba(34,197,94,0.9)' }} />
          ))}
        </div>
      ))}

      {/* Amber corner brackets */}
      {['top-2 left-2 border-t-2 border-l-2','top-2 right-2 border-t-2 border-r-2',
        'bottom-2 left-2 border-b-2 border-l-2','bottom-2 right-2 border-b-2 border-r-2'].map((cls, i) => (
        <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(245,158,11,0.85)' }} />
      ))}

      {/* Detection badge */}
      {detectionCount > 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-semibold"
          style={{ background: 'rgba(34,197,94,0.85)', color: '#fff', backdropFilter: 'blur(6px)' }}>
          {detectionCount} region{detectionCount !== 1 ? 's' : ''} flagged
        </div>
      )}
    </div>
  );
};

// ─── Disclaimer banner ────────────────────────────────────────────────────────
const DisclaimerBanner = () => (
  <div className="grid grid-cols-2 gap-3 mb-5">
    {['This report is not a diagnosis', 'Consult a medical professional for confirmation'].map(text => (
      <div key={text} className="text-center py-2.5 px-4 rounded-lg text-xs font-bold"
        style={{ border: '2px solid rgba(255,255,255,0.55)', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
        {text}
      </div>
    ))}
  </div>
);

// ─── White GP Report Card ─────────────────────────────────────────────────────
const ReportCard = ({ analysis }) => {
  const urgency    = getUrgency(analysis.urgencyLevel);
  const primaryDet = analysis.detections?.[0];
  const confidence = primaryDet ? Math.round(primaryDet.confidenceScore * 100) : null;
  const confColor  = confidence >= 80 ? '#15803d' : confidence >= 55 ? '#b45309' : '#b91c1c';
  const confLabel  = confidence >= 80 ? 'High' : confidence >= 55 ? 'Moderate' : 'Low';

  const diffRows = [
    ...(analysis.detections || []).map(d => ({
      name: d.commonName, scientific: d.scientificName,
      probable: d.confidenceScore >= 0.55, possible: d.confidenceScore < 0.55 && d.confidenceScore >= 0.3,
    })),
    ...(analysis.differentialDiagnoses || []).map(d => ({
      name: d.condition, scientific: '',
      probable: d.likelihood === 'high', possible: d.likelihood === 'moderate',
    })),
  ].slice(0, 6);

  const findingBullets = analysis.visualFindings
    ? analysis.visualFindings.split(/(?<=[.])\s+|[•\n]/).map(s => s.replace(/^[•\-]\s*/, '').trim()).filter(s => s.length > 12).slice(0, 3)
    : [];

  const detectionMethod =
    analysis.sampleType === 'blood' ? 'Blood Smear Analysis' :
    analysis.sampleType === 'skin'  ? 'Dermatological Visual Assessment' :
    analysis.sampleType === 'stool' ? 'Stool Sample Examination' :
    'Visual Microscopic Examination';

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl animate-slide-up" style={{ background: '#FAFAF9' }}>

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* LEFT — image */}
        <div className="p-5 flex flex-col gap-3" style={{ background: '#F1F1EF', borderRight: '1px solid #E0E0DC' }}>
          <AnnotatedImage imageUrl={analysis.imageUrl || analysis.thumbnailUrl} detectionCount={analysis.detections?.length || 1} />
          <div className="flex items-center justify-between text-xs" style={{ color: '#888' }}>
            <span className="font-medium">
              {analysis.sampleType && analysis.sampleType !== 'auto'
                ? analysis.sampleType.charAt(0).toUpperCase() + analysis.sampleType.slice(1) + ' Sample'
                : 'Sample'}
              {analysis.imageQuality && (
                <span className="ml-2" style={{ color: analysis.imageQuality === 'poor' ? '#dc2626' : analysis.imageQuality === 'adequate' ? '#b45309' : '#15803d' }}>
                  · Image: {analysis.imageQuality}
                </span>
              )}
            </span>
            <span>{new Date(analysis.uploadedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* RIGHT — report */}
        <div className="p-6 flex flex-col gap-5">

          {/* Title */}
          <div>
            <h1 className="font-display font-bold leading-tight" style={{ fontSize: '1.75rem', color: '#111827' }}>Parasite Analysis</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#6B7280' }}>Report — For Discussion with Your GP</p>
          </div>

          {/* Urgency + Confidence */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${urgency.border}` }}>
              <div className="px-3 py-1.5 text-center text-xs font-semibold" style={{ background: urgency.hBg, color: urgency.hText }}>Urgency</div>
              <div className="px-3 py-4 text-center" style={{ background: urgency.bg }}>
                <p className="font-display font-bold text-2xl leading-none" style={{ color: urgency.color }}>{urgency.label}</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #86EFAC' }}>
              <div className="px-3 py-1.5 text-center text-xs font-semibold" style={{ background: '#14532D', color: '#86EFAC' }}>Confidence</div>
              <div className="px-3 py-4 text-center" style={{ background: '#F0FDF4' }}>
                <p className="font-display font-bold leading-none" style={{ fontSize: '2rem', color: confColor }}>
                  {confidence !== null ? `${confidence}%` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div>
            <p className="font-bold text-sm mb-2" style={{ color: '#111827' }}>Findings</p>
            <div className="text-xs space-y-1" style={{ color: '#374151' }}>
              <p><span className="font-semibold">Detection Method:</span> {detectionMethod}</p>
              <p><span className="font-semibold">Confidence Level:</span> {confLabel}</p>
              {primaryDet && (
                <p><span className="font-semibold">Primary Finding:</span>{' '}
                  {primaryDet.commonName}
                  {primaryDet.scientificName && <em className="text-gray-400 ml-1">({primaryDet.scientificName})</em>}
                </p>
              )}
            </div>
            {findingBullets.length > 0 && (
              <ul className="mt-2.5 space-y-1.5">
                {findingBullets.map((point, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed" style={{ color: '#4B5563' }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#16a34a' }}>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Differential table */}
          {diffRows.length > 0 && (
            <div>
              <div className="rounded-t-lg px-3 py-1.5" style={{ background: '#475569' }}>
                <p className="text-white text-xs font-bold tracking-wide">Differential Diagnosis</p>
              </div>
              <div className="overflow-hidden rounded-b-lg" style={{ border: '1px solid #CBD5E1', borderTop: 'none' }}>
                <table className="w-full text-xs">
                  <thead style={{ background: '#F8FAFC' }}>
                    <tr style={{ borderBottom: '1px solid #CBD5E1' }}>
                      <th className="text-left px-3 py-2 font-semibold" style={{ color: '#475569' }}>Parasite Type</th>
                      <th className="text-center px-2 py-2 font-semibold" style={{ color: '#475569', width: '75px' }}>Probable</th>
                      <th className="text-center px-2 py-2 font-semibold" style={{ color: '#475569', width: '75px' }}>Possible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diffRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < diffRows.length - 1 ? '1px solid #E2E8F0' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td className="px-3 py-2.5 font-medium" style={{ color: '#1e293b' }}>
                          {row.name}
                          {row.scientific && <span className="font-normal italic text-gray-400 ml-1">({row.scientific})</span>}
                        </td>
                        <td className="px-2 py-2.5 text-center text-sm">
                          {row.probable ? <span style={{ color: '#16a34a' }}>✔</span> : <span style={{ color: '#94a3b8' }}>✕</span>}
                        </td>
                        <td className="px-2 py-2.5 text-center text-sm">
                          {row.possible && !row.probable ? <span style={{ color: '#16a34a' }}>✔</span> : <span style={{ color: '#94a3b8' }}>✕</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Conclusion + PARA avatar */}
          <div className="flex items-end gap-3 pt-2" style={{ borderTop: '1px solid #E5E7EB' }}>
            <div className="flex-1">
              <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                <span className="font-bold" style={{ color: '#111827' }}>Conclusion: </span>
                {urgency.sublabel}.{' '}
                {analysis.overallAssessment ? analysis.overallAssessment.split('.')[0] + '.' : 'This report should be discussed with a qualified healthcare professional.'}
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(217,119,6,0.08)', border: '2px solid rgba(217,119,6,0.25)' }}>
              🔬
            </div>
          </div>
        </div>
      </div>

      {/* Bottom disclaimer strip */}
      <div className="grid grid-cols-2" style={{ borderTop: '1px solid #D1D5DB' }}>
        <div className="py-3 px-5 text-center text-xs font-semibold" style={{ color: '#6B7280', borderRight: '1px solid #D1D5DB' }}>
          This report is not a diagnosis
        </div>
        <div className="py-3 px-5 text-center text-xs font-semibold" style={{ color: '#6B7280' }}>
          Consult a medical professional for confirmation
        </div>
      </div>
    </div>
  );
};

// ─── Collapsible detail section ───────────────────────────────────────────────
const DetailSection = ({ icon: Icon, title, iconColor = 'var(--amber)', children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pp-card overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={15} style={{ color: iconColor }} />}
          <span className="font-heading font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--bg-border)' }}>{children}</div>}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const AnalysisResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [analysis, setAnalysis]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [showJournalPrompt, setJournal] = useState(false);
  const [journalShown, setJournalShown] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [showDeepDive, setDeepDive]     = useState(false);
  const [userCredits, setUserCredits]   = useState(0);

  useEffect(() => { fetchAnalysis(); }, [id]);

  useEffect(() => {
    if (!analysis) return;
    if (analysis.status === 'processing' || analysis.status === 'pending') {
      const t = setInterval(fetchAnalysis, 4000); return () => clearInterval(t);
    }
    if (analysis.status === 'completed' && !journalShown) {
      const t = setTimeout(() => { setJournal(true); setJournalShown(true); }, 3000); return () => clearTimeout(t);
    }
  }, [analysis?.status]);

  const fetchAnalysis = async () => {
    try {
      const [res, profileRes] = await Promise.all([
        axios.get(`${API_URL}/analysis/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(`${API_URL}/auth/profile`,   { headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => null),
      ]);
      setAnalysis(res.data);
      if (profileRes?.data?.imageCredits !== undefined) setUserCredits(profileRes.data.imageCredits);
    } catch { toast.error('Failed to load analysis'); }
    finally { setLoading(false); }
  };

  const submitFeedback = async (helpful) => {
    try {
      await axios.post(`${API_URL}/analysis/${id}/feedback`, { wasHelpful: helpful }, { headers: { Authorization: `Bearer ${accessToken}` } });
      setFeedbackDone(true);
      toast.success(helpful ? 'Glad it helped.' : 'Thanks for the feedback.');
    } catch { toast.error('Failed to submit feedback'); }
  };

  // Loading
  if (loading) return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <Loader size={28} className="animate-spin mx-auto mb-3" style={{ color: 'var(--amber)' }} />
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Loading report…</p>
      </div>
    </div>
  );

  if (!analysis) return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <AlertTriangle size={28} className="mx-auto mb-3" style={{ color: '#EF4444' }} />
        <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Analysis not found.</p>
        <button onClick={() => navigate('/dashboard')} className="pp-btn-ghost">Back to Dashboard</button>
      </div>
    </div>
  );

  // Processing
  if (analysis.status === 'processing' || analysis.status === 'pending') return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '70vh' }}>
      <div className="text-center max-w-sm px-4">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(217,119,6,0.12)' }} />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={28} style={{ color: 'var(--amber)' }} />
          </div>
        </div>
        <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Analysing Specimen</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Our AI is examining your image. This takes 10–20 seconds.</p>
        <div className="pp-card p-4 space-y-2 text-left">
          {['Uploading to secure analysis pipeline…','Applying clinical vision model…','Cross-referencing parasite database…','Generating clinical report…'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <Loader size={10} className="animate-spin flex-shrink-0" style={{ color: 'var(--amber)' }} />{step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Failed
  if (analysis.status === 'failed') return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center max-w-sm px-4">
        <AlertCircle size={32} className="mx-auto mb-4" style={{ color: '#EF4444' }} />
        <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Analysis Failed</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>The AI couldn't process this image. Try again with a clearer, well-lit photo.</p>
        <button onClick={() => navigate('/upload')} className="pp-btn-primary">Try Again</button>
      </div>
    </div>
  );

  // Completed
  return (
    <div className="pp-page" style={{ paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '940px', margin: '0 auto', padding: '0 1rem' }}>

        {/* Nav */}
        <div className="flex items-center gap-4 pt-6 pb-5">
          <button onClick={() => navigate('/dashboard')} className="pp-btn-ghost flex items-center gap-1.5" style={{ padding: '7px 13px', fontSize: '12px' }}>
            <ArrowLeft size={13} /> Dashboard
          </button>
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            #{id?.slice(0, 8)} · {new Date(analysis.uploadedAt).toLocaleString('en-AU')}
          </p>
        </div>

        {/* Disclaimer banners */}
        <DisclaimerBanner />

        {/* White GP report card */}
        <ReportCard analysis={analysis} />

        {/* Extended details */}
        <div className="mt-6 space-y-3">

          {analysis.overallAssessment && (
            <DetailSection icon={Activity} title="Full Clinical Assessment" defaultOpen>
              <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>{analysis.overallAssessment}</p>
            </DetailSection>
          )}

          {analysis.recommendedActions?.length > 0 && (
            <DetailSection icon={ClipboardList} title="Recommended Actions" defaultOpen>
              <div className="space-y-3 mt-3">
                {analysis.recommendedActions.map((action, i) => {
                  const col = action.priority === 'immediate' ? '#EF4444' : action.priority === 'soon' ? '#F59E0B' : '#10B981';
                  return (
                    <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${col}20`, color: col, border: `1px solid ${col}30` }}>{action.priority?.toUpperCase()}</span>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{action.action}</p>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{action.detail}</p>
                    </div>
                  );
                })}
              </div>
            </DetailSection>
          )}

          {analysis.healthRisks?.length > 0 && (
            <DetailSection icon={AlertTriangle} title="Health Risks" iconColor="#EF4444">
              <div className="space-y-3 mt-3">
                {analysis.healthRisks.map((risk, i) => {
                  const col = risk.severity === 'high' ? '#EF4444' : risk.severity === 'moderate' ? '#F59E0B' : '#10B981';
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="w-1 rounded-full flex-shrink-0" style={{ background: col, minHeight: '40px' }} />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{risk.category}</p>
                        <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>{risk.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DetailSection>
          )}

          {(analysis.parasiteProfile || analysis.detections?.[0]) && (
            <DetailSection icon={Microscope} title="Parasite Profile">
              <div className="mt-3">
                <ParasiteProfile profileData={analysis.parasiteProfile} primaryFinding={analysis.detections?.[0]?.commonName} scientificName={analysis.detections?.[0]?.scientificName} />
              </div>
            </DetailSection>
          )}

          {analysis.treatmentOptions?.length > 0 && (
            <DetailSection icon={Pill} title="Treatment Categories" iconColor="#10B981">
              <div className="space-y-3 mt-3">
                {analysis.treatmentOptions.map((t, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }}>{t.type}</span>
                        {t.requiresPrescription && <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }}>Rx</span>}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
                  </div>
                ))}
                <div className="rounded-lg p-3 flex items-start gap-2 text-xs" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <AlertCircle size={12} style={{ color: 'var(--amber)', marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Always consult a qualified healthcare professional before starting any treatment. No specific doses are provided.</span>
                </div>
              </div>
            </DetailSection>
          )}

          {analysis.naturalRemedies?.length > 0 && (
            <DetailSection icon={Leaf} title="Natural & Unconventional Remedies" iconColor="#34D399">
              <p className="text-xs mt-3 mb-3" style={{ color: 'var(--text-muted)' }}>Evidence levels vary — discuss with your healthcare provider before use.</p>
              <div className="space-y-3">
                {analysis.naturalRemedies.map((r, i) => {
                  const ep = { emerging: { bg: 'rgba(52,211,153,0.1)', color: '#34D399', border: 'rgba(52,211,153,0.3)' }, preliminary: { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: 'rgba(96,165,250,0.3)' }, traditional: { bg: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: 'rgba(167,139,250,0.3)' }, anecdotal: { bg: 'rgba(156,163,175,0.1)', color: '#9CA3AF', border: 'rgba(156,163,175,0.3)' } };
                  const ci = { herbal: '🌿', dietary: '🥗', topical: '🧴', environmental: '🌍', integrative: '⚕️' };
                  const ec = ep[r.evidenceLevel] || ep.anecdotal;
                  return (
                    <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span>{ci[r.category] || '🌿'}</span>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                        </div>
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded capitalize flex-shrink-0" style={{ background: ec.bg, color: ec.color, border: `1px solid ${ec.border}` }}>{r.evidenceLevel}</span>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{r.description}</p>
                      {r.safetyNotes && (
                        <div className="flex items-start gap-1.5 rounded-lg p-2.5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                          <AlertCircle size={11} style={{ color: 'var(--amber)', marginTop: '2px', flexShrink: 0 }} />
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.safetyNotes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </DetailSection>
          )}

          {analysis.gpTestingList?.length > 0 && (
            <DetailSection icon={ClipboardList} title="Ask Your GP for These Tests">
              <ul className="mt-3 space-y-2">
                {analysis.gpTestingList.map((test, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={13} style={{ color: 'var(--amber)', marginTop: '3px', flexShrink: 0 }} />{test}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {analysis.gpScriptIfDismissed?.length > 0 && (
            <DetailSection icon={MessageSquare} title="If Your GP Dismisses Your Concerns" iconColor="#F59E0B">
              <p className="text-xs mt-3 mb-3" style={{ color: 'var(--text-muted)' }}>Suggested phrases to help you advocate for yourself:</p>
              <ul className="space-y-2">
                {analysis.gpScriptIfDismissed.map((line, i) => (
                  <li key={i} className="rounded-lg p-3 text-sm italic leading-relaxed" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }}>"{line}"</li>
                ))}
              </ul>
            </DetailSection>
          )}

          {/* Deep Dive CTA */}
          {analysis.detections?.length > 0 && (
            <div className="pp-card p-5 relative overflow-hidden" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(217,119,6,0.02) 100%)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <BookOpen size={17} style={{ color: 'var(--amber)' }} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      Want a deeper look at <span style={{ color: 'var(--amber)' }}>{analysis.detections[0]?.commonName || 'this finding'}</span>?
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Lifecycle, transmission, treatment, Australian relevance, cited clinical sources.</p>
                    <p className="text-xs mt-1 font-mono" style={{ color: 'rgba(245,158,11,0.7)' }}>1 credit · Generated once, re-read for free</p>
                  </div>
                </div>
                <button onClick={() => setDeepDive(true)} className="pp-btn-primary flex-shrink-0 flex items-center gap-1.5" style={{ padding: '9px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  <BookOpen size={12} /> Deep Dive
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {!feedbackDone ? (
            <div className="pp-card p-5 text-center">
              <p className="font-heading font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Was this report helpful?</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => submitFeedback(true)} className="pp-btn-ghost flex items-center gap-2" style={{ padding: '8px 16px' }}><ThumbsUp size={14} /> Helpful</button>
                <button onClick={() => submitFeedback(false)} className="pp-btn-ghost flex items-center gap-2" style={{ padding: '8px 16px' }}><ThumbsDown size={14} /> Not helpful</button>
              </div>
            </div>
          ) : (
            <div className="pp-card p-4 text-center"><p className="text-xs font-mono" style={{ color: '#10B981' }}>✓ Feedback received</p></div>
          )}

          {/* Journal CTA */}
          <div className="pp-card p-5 flex items-center justify-between" style={{ border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.04)' }}>
            <div>
              <p className="font-heading font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Track your progress</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Log symptoms, track treatment, generate a doctor report.</p>
            </div>
            <button onClick={() => setJournal(true)} className="pp-btn-primary ml-4 flex-shrink-0" style={{ padding: '9px 16px', fontSize: '13px' }}>Start Journal</button>
          </div>

          {/* Final disclaimer */}
          <div className="flex items-start gap-2 text-xs px-1" style={{ color: 'var(--text-muted)' }}>
            <AlertTriangle size={11} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>⚠️ This AI assessment is for educational and informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for confirmation and treatment. In an emergency, call 000.</span>
          </div>
        </div>
      </div>

      {showDeepDive && analysis.detections?.length > 0 && (
        <DeepDiveModal analysisId={id} parasiteName={analysis.detections[0]?.commonName || 'Unknown'} scientificName={analysis.detections[0]?.scientificName} userCredits={userCredits} onClose={() => setDeepDive(false)} onCreditsUsed={() => setUserCredits(c => Math.max(0, c - 1))} />
      )}
      {showJournalPrompt && (
        <JournalPromptModal isOpen={showJournalPrompt} analysisId={id} detections={analysis.detections} onClose={() => setJournal(false)} />
      )}
      <ParasiteBot />
    </div>
  );
};

export default AnalysisResultsPage;
