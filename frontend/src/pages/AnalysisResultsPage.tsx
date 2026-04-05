// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader, AlertTriangle, CheckCircle, AlertCircle,
  Microscope, ClipboardList, BookOpen, Pill, Leaf, MessageSquare,
  ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Activity, FileText, X, ExternalLink,
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
  emergency: { label: 'Seek care now',  sublabel: 'Please seek medical care immediately — call 000 or go to your nearest emergency department. Do not wait.',                                                                                                       bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', hBg: '#991B1B', hText: '#fff' },
  high:      { label: 'See your GP',    sublabel: "Heads up — based on what I'm seeing, I'd encourage you not to wait on this one. Please see a GP or medical professional as soon as you can. I've prepared a summary you can take with you right now.", bg: '#FECACA', color: '#B91C1C', border: '#FCA5A5', hBg: '#64748B', hText: '#fff' },
  moderate:  { label: 'Moderate',  sublabel: 'Worth seeing your GP within the next 1-2 weeks. I have prepared a summary to take with you.', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', hBg: '#64748B', hText: '#fff' },
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
    {['This assessment is for educational purposes only', 'Consult a medical professional for confirmation'].map(text => (
      <div key={text} className="text-center py-3 px-4 rounded-xl font-bold"
        style={{ border: '2.5px solid rgba(255,255,255,0.7)', color: 'rgba(255,255,255,0.92)',
                 fontSize: '0.85rem', letterSpacing: '0.01em', background: 'rgba(255,255,255,0.05)' }}>
        {text}
      </div>
    ))}
  </div>
);


// ─── PARA woman avatar — small version for report card corner ────────────────
const ParaWomanSmall = () => (
  <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="96">
    {/* Body */}
    <path d="M40 115 Q38 145 36 158 L84 158 Q82 145 80 115 Q68 122 60 122 Q52 122 40 115Z" fill="#5A8E7A"/>
    {/* Collar */}
    <path d="M50 112 Q60 118 70 112 L73 120 Q60 126 47 120Z" fill="#3D7060"/>
    {/* Neck */}
    <rect x="55" y="94" width="10" height="20" rx="5" fill="#C49A7A"/>
    {/* Left arm */}
    <path d="M40 116 Q28 128 25 148" stroke="#5A8E7A" strokeWidth="10" strokeLinecap="round" fill="none"/>
    {/* Right arm */}
    <path d="M80 116 Q92 128 95 148" stroke="#5A8E7A" strokeWidth="10" strokeLinecap="round" fill="none"/>
    {/* Head */}
    <ellipse cx="60" cy="72" rx="22" ry="24" fill="#C49A7A"/>
    {/* Hair */}
    <path d="M38 72 Q36 96 44 114 Q52 118 55 116 L55 94 Q44 92 38 72Z" fill="#5C3D28"/>
    <path d="M82 72 Q84 96 76 114 Q68 118 65 116 L65 94 Q76 92 82 72Z" fill="#5C3D28"/>
    {/* Eyes */}
    <ellipse cx="53" cy="68" rx="4" ry="4.5" fill="white"/>
    <ellipse cx="67" cy="68" rx="4" ry="4.5" fill="white"/>
    <circle cx="54" cy="69" r="2.8" fill="#3D2810"/>
    <circle cx="68" cy="69" r="2.8" fill="#3D2810"/>
    <circle cx="55" cy="67.5" r="1" fill="white"/>
    <circle cx="69" cy="67.5" r="1" fill="white"/>
    {/* Lips */}
    <path d="M55 82 Q60 87 65 82" fill="#C0725A"/>
    {/* Cheeks */}
    <ellipse cx="47" cy="76" rx="5" ry="3.5" fill="#E8A090" opacity="0.4"/>
    <ellipse cx="73" cy="76" rx="5" ry="3.5" fill="#E8A090" opacity="0.4"/>
    {/* Hat brim */}
    <ellipse cx="60" cy="51" rx="38" ry="7" fill="#4A7A5E"/>
    <ellipse cx="60" cy="49" rx="38" ry="7" fill="#5A9070"/>
    {/* Hat crown */}
    <path d="M30 50 Q33 22 60 20 Q87 22 90 50Z" fill="#6AAB84"/>
    {/* Hat band */}
    <rect x="33" y="44" width="54" height="6" rx="2" fill="#3D7060"/>
  </svg>
);

// ─── White GP Report Card ─────────────────────────────────────────────────────
const ReportCard = ({ analysis }) => {
  const urgency    = getUrgency(analysis.urgencyLevel);
  const primaryDet = analysis.detections?.[0];
  const confidence = primaryDet ? Math.round(primaryDet.confidenceScore * 100) : null;
  const confColor  = confidence >= 80 ? '#15803d' : confidence >= 55 ? '#b45309' : '#b91c1c';
  const confLabel  = confidence >= 80 ? 'Strong match' : confidence >= 55 ? 'Moderate confidence' : 'Harder to be certain';

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
        <div className="p-5 flex flex-col gap-3" style={{ background: '#EAEBE8', borderRight: '1px solid #D8D9D5' }}>
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
            <h1 className="font-display font-bold leading-tight" style={{ fontSize: '2.1rem', color: '#111827', letterSpacing: '-0.02em' }}>Parasite Analysis</h1>
            <p className="text-sm font-medium mt-1" style={{ color: '#6B7280' }}>Report — For Discussion with Your GP</p>
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
              <div className="px-3 py-1.5 text-center text-xs font-semibold" style={{ background: '#14532D', color: '#86EFAC' }}>Match strength</div>
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
            <div className="flex-shrink-0">
              <ParaWomanSmall />
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
  const [showMHR, setShowMHR]           = useState(false);

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
    <div style={{ background: '#2E4A52', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <Loader size={28} className="animate-spin mx-auto mb-3" style={{ color: 'var(--amber)' }} />
        <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Fetching your report…</p>
      </div>
    </div>
  );

  if (!analysis) return (
    <div style={{ background: '#2E4A52', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <AlertTriangle size={28} className="mx-auto mb-3" style={{ color: '#EF4444' }} />
        <p className="mb-4" style={{ color: 'var(--text-primary)' }}>I couldn't find that report. It may still be processing — try refreshing in a moment.</p>
        <button onClick={() => navigate('/dashboard')} className="pp-btn-ghost">Back to Dashboard</button>
      </div>
    </div>
  );

  // Processing
  if (analysis.status === 'processing' || analysis.status === 'pending') return (
    <div style={{ background: '#2E4A52', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          {['Uploading to PARA…','I\'m examining your image now…','Cross-referencing patterns and organisms…','Pulling your report together…'].map((step, i) => (
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
    <div style={{ background: '#2E4A52', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    <div style={{ background: '#2E4A52', minHeight: '100vh', paddingBottom: '4rem' }}>
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

        {/* ── GP Action Panel — prominent, right below the card ── */}
        <div style={{
          background: 'rgba(27,107,95,0.15)',
          border: '1.5px solid rgba(27,107,95,0.45)',
          borderRadius: 16,
          padding: '20px 22px',
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          {/* Label row */}
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(27,107,95,0.25)', border: '1px solid rgba(27,107,95,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={17} style={{ color: '#5AB89A' }} />
            </div>
            <div>
              <p className="font-heading font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Your GP report is ready</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>This summarises everything I found in a format your doctor can actually use. Bring it to your next appointment — it gives them a head start.</p>
            </div>
          </div>

          {/* Two action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Primary — Download PDF */}
            <button
              onClick={() => navigate(`/gp-report/${id}`)}
              style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 20px', background: '#1B6B5F', color: 'white', border: 'none', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(27,107,95,0.4)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#145047'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1B6B5F'; e.currentTarget.style.transform = 'none'; }}
            >
              <FileText size={15} /> Download PDF for GP
            </button>

            {/* Secondary — My Health Record */}
            <button
              onClick={() => setShowMHR(true)}
              style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 20px', background: 'transparent', color: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            >
              <ExternalLink size={15} /> Share to My Health Record
            </button>
          </div>

          {/* Disclaimer inline */}
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
            ⚠️ This report is for educational purposes only and does not constitute a medical diagnosis. Always consult a qualified healthcare professional.
          </p>
        </div>

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
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Want to track how you\'re feeling over the next few days? Takes 30 seconds and gives your GP more to work with.</p>
            </div>
            <button onClick={() => setJournal(true)} className="pp-btn-primary ml-4 flex-shrink-0" style={{ padding: '9px 16px', fontSize: '13px' }}>Start tracking</button>
          </div>

          {/* Final disclaimer */}
          <div className="flex items-start gap-2 text-xs px-1" style={{ color: 'var(--text-muted)' }}>
            <AlertTriangle size={11} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>⚠️ This AI assessment is for educational and informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for confirmation and treatment. In an emergency, call 000.</span>
          </div>
        </div>
      </div>

      {/* My Health Record instructions modal */}
      {showMHR && (
        <div
          onClick={e => e.target === e.currentTarget && setShowMHR(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}
        >
          <div style={{ background: '#1A2A2E', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, width: '100%', maxWidth: 480, padding: '2rem', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            {/* Close */}
            <button onClick={() => setShowMHR(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={15} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(27,107,95,0.2)', border: '1px solid rgba(27,107,95,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ExternalLink size={20} style={{ color: '#5AB89A' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>Share to My Health Record</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>Australia's national health record system</p>
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
              {[
                { n: '1', title: 'Download your PDF', desc: 'Hit "Download PDF for GP" below — your report will save to your device, ready to share.' },
                { n: '2', title: 'Log into My Health Record', desc: 'Visit myhr.gov.au or open the My Health Record app and sign in with myGov.' },
                { n: '3', title: 'Upload the document', desc: 'Go to Documents → Upload a document → select the PDF you downloaded.' },
                { n: '4', title: 'Share access with your GP', desc: 'Your GP can now view the report at your next appointment.' },
              ].map(step => (
                <div key={step.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1B6B5F', color: 'white', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{step.n}</div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 2px' }}>{step.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setShowMHR(false); navigate(`/gp-report/${id}`); }}
                style={{ flex: 1, padding: '12px', background: '#1B6B5F', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Download PDF First
              </button>
              <a
                href="https://www.myhealthrecord.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                Open myhr.gov.au <ExternalLink size={12} />
              </a>
            </div>

            {/* Disclaimer */}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', marginTop: '1rem', textAlign: 'center', lineHeight: 1.5 }}>
              notworms.com is not affiliated with My Health Record or the Australian Digital Health Agency.
              This report is educational only and is not a medical record or diagnosis.
            </p>
          </div>
        </div>
      )}

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
