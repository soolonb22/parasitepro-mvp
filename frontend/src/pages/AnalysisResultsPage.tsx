// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Loader, ThumbsUp, ThumbsDown,
  Microscope, Info, AlertCircle, Pill, Shield, ClipboardList,
  MessageSquare, ArrowLeft, Eye, Activity, BookOpen, Volume2, Leaf,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import JournalPromptModal from '../components/JournalPromptModal';
import VoiceAssistant from '../components/VoiceAssistant';
import ParasiteProfile from '../components/ParasiteProfile';
import DeepDiveModal from '../components/DeepDiveModal';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const URGENCY_MAP = {
  emergency: { label: '🚨 URGENT — Seek emergency care immediately',  bg: 'rgba(153,27,27,0.15)', color: '#EF4444', border: 'rgba(153,27,27,0.4)' },
  high:      { label: '🔴 HIGH — See a doctor within 24–48 hours',    bg: 'rgba(239,68,68,0.1)',  color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  moderate:  { label: '🟡 MODERATE — Seek medical advice within 1–2 weeks', bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  low:       { label: '🟢 LOW — Monitor, no immediate action needed', bg: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
};
const getUrgency = (level) => URGENCY_MAP[level?.toLowerCase()] || URGENCY_MAP.low;

const SectionCard = ({ icon: Icon, title, iconColor = 'var(--amber)', children, delay = 0, accent = false }) => (
  <div className="pp-card p-5 animate-slide-up" style={accent ? { border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.03)' } : {}} >
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon size={16} style={{ color: iconColor }} />}
      <p className="pp-section-title">{title}</p>
    </div>
    {children}
  </div>
);

const AnalysisResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [readingReport, setReadingReport] = useState(false);
  const [journalPromptShown, setJournalPromptShown] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [userCredits, setUserCredits] = useState(0);

  useEffect(() => { fetchAnalysis(); }, [id]);

  useEffect(() => {
    if (!analysis) return;
    if (analysis.status === 'processing' || analysis.status === 'pending') {
      const interval = setInterval(fetchAnalysis, 4000);
      return () => clearInterval(interval);
    }
    if (analysis.status === 'completed' && !journalPromptShown) {
      const timer = setTimeout(() => { setShowJournalPrompt(true); setJournalPromptShown(true); }, 2500);
      return () => clearTimeout(timer);
    }
  }, [analysis?.status]);

  const fetchAnalysis = async () => {
    try {
      const [response, profileRes] = await Promise.all([
        axios.get(`${API_URL}/analysis/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        axios.get(`${API_URL}/auth/profile`, { headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => null),
      ]);
      setAnalysis(response.data);
      if (profileRes?.data?.imageCredits !== undefined) setUserCredits(profileRes.data.imageCredits);
    } catch {
      toast.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (wasHelpful: boolean) => {
    try {
      await axios.post(`${API_URL}/analysis/${id}/feedback`, { wasHelpful }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFeedbackSubmitted(true);
      toast.success(wasHelpful ? 'Thanks! Glad it helped.' : 'Thanks for the feedback.');
    } catch { toast.error('Failed to submit feedback'); }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  const buildReportText = (a) => {
    if (!a) return '';
    const parts = [];
    parts.push(`ParasitePro Analysis Report.`);
    if (a.overallAssessment) parts.push(`Clinical Assessment. ${a.overallAssessment}`);
    if (a.detections?.[0]) {
      const d = a.detections[0];
      parts.push(`Primary Finding. ${d.name}. Confidence ${d.confidence} percent.`);
    }
    if (a.visualFindings) parts.push(`Visual Findings. ${a.visualFindings}`);
    const urg = getUrgency(a.urgencyLevel);
    parts.push(`Urgency Level. ${urg.label}.`);
    if (a.recommendedActions?.length) {
      parts.push(`Recommended Actions.`);
      a.recommendedActions.forEach(r => parts.push(`${r.priority}: ${r.action}. ${r.detail || ''}`));
    }
    if (a.healthRisks?.length) {
      parts.push(`Health Risks.`);
      a.healthRisks.forEach(r => parts.push(`${r.name}. ${r.description}`));
    }
    if (a.naturalRemedies?.length) {
      parts.push(`Natural and Unconventional Remedies.`);
      a.naturalRemedies.forEach(r => parts.push(`${r.name}. ${r.description}. Evidence level: ${r.evidenceLevel}. Safety note: ${r.safetyNotes}`));
    }
    if (a.gpTestingList?.length) {
      parts.push(`Ask your GP for these tests.`);
      a.gpTestingList.forEach(t => parts.push(t));
    }
    parts.push('This analysis is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional. In an emergency, call triple zero.');
    return parts.join(' ');
  };

  if (loading) return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <Loader size={32} className="animate-spin mx-auto mb-4" style={{ color: 'var(--amber)' }} />
        <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Loading analysis…</p>
      </div>
    </div>
  );

  if (!analysis) return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <AlertTriangle size={32} className="mx-auto mb-4" style={{ color: '#EF4444' }} />
        <p style={{ color: 'var(--text-primary)' }}>Analysis not found.</p>
        <button onClick={() => navigate('/dashboard')} className="pp-btn-ghost mt-4">← Dashboard</button>
      </div>
    </div>
  );

  // ─── Processing ─────────────────────────────────────────────────────────────
  if (analysis.status === 'processing' || analysis.status === 'pending') return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '70vh' }}>
      <div className="text-center max-w-sm">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(217,119,6,0.15)' }} />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={32} style={{ color: 'var(--amber)' }} />
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Analysing Specimen</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          Our AI is examining your image with clinical thoroughness. This takes 10–20 seconds.
        </p>
        <div className="space-y-2 text-left pp-card p-4">
          {['Uploading to secure analysis pipeline…', 'Applying clinical vision model…', 'Cross-referencing parasite database…', 'Generating clinical report…'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <Loader size={10} className="animate-spin flex-shrink-0" style={{ color: 'var(--amber)' }} />
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Failed ──────────────────────────────────────────────────────────────────
  if (analysis.status === 'failed') return (
    <div className="pp-page flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="text-center max-w-sm">
        <AlertCircle size={36} className="mx-auto mb-4" style={{ color: '#EF4444' }} />
        <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Analysis Failed</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          The AI could not process this image. Please try again with a clearer photo.
        </p>
        <button onClick={() => navigate('/upload')} className="pp-btn-primary">Try Again</button>
      </div>
    </div>
  );

  // ─── Completed ───────────────────────────────────────────────────────────────
  const urgency = getUrgency(analysis.urgencyLevel || analysis.detections?.[0]?.urgencyLevel);
  const primaryDetection = analysis.detections?.[0];

  return (
    <div className="pp-page">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem 4rem' }}>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-6">
          <button onClick={() => navigate('/dashboard')} className="pp-btn-ghost flex items-center gap-2" style={{ padding: '8px 14px', fontSize: '13px' }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>Analysis Report</h1>
            <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {new Date(analysis.uploadedAt).toLocaleString('en-AU')}
              {analysis.sampleType && analysis.sampleType !== 'auto' && ` · ${analysis.sampleType}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ── */}
          <div className="space-y-4">

            {/* Image */}
            <div className="pp-card overflow-hidden animate-slide-up">
              <div className="relative">
                <img
                  src={analysis.imageUrl || analysis.thumbnailUrl}
                  alt="Specimen"
                  className="w-full object-contain"
                  style={{ maxHeight: '280px', background: 'var(--bg-elevated)' }}
                />
                {['top-2 left-2 border-t-2 border-l-2','top-2 right-2 border-t-2 border-r-2','bottom-2 left-2 border-b-2 border-l-2','bottom-2 right-2 border-b-2 border-r-2'].map((cls, i) => (
                  <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: 'rgba(217,119,6,0.6)' }} />
                ))}
              </div>
              {analysis.imageQuality && (
                <div className="px-4 py-2 flex items-center gap-2 text-xs font-mono" style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
                  <Eye size={11} /> Image quality: <span style={{ color: analysis.imageQuality === 'poor' ? '#EF4444' : analysis.imageQuality === 'adequate' ? '#F59E0B' : '#10B981' }}>{analysis.imageQuality}</span>
                </div>
              )}
            </div>

            {/* Urgency */}
            {urgency && (
              <div className="pp-card p-4 animate-slide-up" style={{ background: urgency.bg, border: `1px solid ${urgency.border}` }}>
                <p className="pp-section-title mb-2">Urgency Level</p>
                <p className="font-display font-bold text-sm leading-snug" style={{ color: urgency.color }}>{urgency.label}</p>
              </div>
            )}

            {/* Detection confidence */}
            {analysis.detections?.length > 0 && (
              <div className="pp-card p-4 animate-slide-up">
                <p className="pp-section-title mb-3">Detection Confidence</p>
                <div className="space-y-3">
                  {analysis.detections.map((det, i) => {
                    const pct = Math.round(det.confidenceScore * 100);
                    return (
                      <div key={det.id || i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs truncate pr-2" style={{ color: 'var(--text-secondary)' }}>{det.commonName}</span>
                          <span className="text-xs font-mono flex-shrink-0" style={{ color: i === 0 ? 'var(--amber-bright)' : 'var(--text-muted)' }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright))' : 'var(--bg-border)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Overall Assessment */}
            {analysis.overallAssessment && (
              <SectionCard icon={Activity} title="Clinical Assessment">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {analysis.overallAssessment}
                </p>
              </SectionCard>
            )}

            {/* No detection */}
            {analysis.detections?.length === 0 && !analysis.overallAssessment && (
              <div className="pp-card p-8 text-center animate-slide-up">
                <CheckCircle size={36} style={{ color: '#10B981', margin: '0 auto 12px' }} />
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No Parasites Detected</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                  Our AI found no parasites in this image. If you have ongoing concerns, please consult a healthcare professional.
                </p>
              </div>
            )}

            {/* Primary Finding */}
            {primaryDetection && (
              <SectionCard icon={Microscope} title="Primary Finding">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{primaryDetection.commonName}</h3>
                    <p className="font-mono text-sm mt-0.5" style={{ color: 'var(--amber)' }}>{primaryDetection.scientificName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {primaryDetection.lifeStage && (
                      <span className="pp-badge-amber">{primaryDetection.lifeStage}</span>
                    )}
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{primaryDetection.parasiteType}</span>
                  </div>
                </div>
                {analysis.detections.length > 1 && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--bg-border)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Additional detections</p>
                    <div className="space-y-1">
                      {analysis.detections.slice(1).map((d, i) => (
                        <div key={i} className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>{d.commonName} <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>{d.scientificName}</span></span>
                          <span className="font-mono">{Math.round(d.confidenceScore * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Visual Findings */}
            {analysis.visualFindings && (
              <SectionCard icon={Eye} title="Visual Findings">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {analysis.visualFindings}
                </p>
              </SectionCard>
            )}

            {/* Recommended Actions */}
            {analysis.recommendedActions?.length > 0 && (
              <SectionCard icon={ClipboardList} title="Recommended Actions" accent>
                <div className="space-y-3">
                  {analysis.recommendedActions.map((action, i) => {
                    const priority = action.priority;
                    const col = priority === 'immediate' ? '#EF4444' : priority === 'soon' ? '#F59E0B' : '#10B981';
                    return (
                      <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: `1px solid var(--bg-border)` }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${col}20`, color: col, border: `1px solid ${col}40` }}>
                            {priority?.toUpperCase()}
                          </span>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{action.action}</p>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{action.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* Health Risks */}
            {analysis.healthRisks?.length > 0 && (
              <SectionCard icon={AlertTriangle} title="Health Risks" iconColor="#EF4444">
                <div className="space-y-3">
                  {analysis.healthRisks.map((risk, i) => {
                    const col = risk.severity === 'high' ? '#EF4444' : risk.severity === 'moderate' ? '#F59E0B' : '#10B981';
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="w-1 rounded-full flex-shrink-0" style={{ background: col, minHeight: '40px' }} />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{risk.category}</p>
                          <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{risk.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* Parasite Profile */}
            {analysis.parasiteProfile && (
              <ParasiteProfile
                profileData={analysis.parasiteProfile}
                primaryFinding={analysis.detections?.[0]?.commonName}
                scientificName={analysis.detections?.[0]?.scientificName}
              />
            )}
            {!analysis.parasiteProfile && analysis.detections?.[0] && (
              <ParasiteProfile
                primaryFinding={analysis.detections[0].commonName}
                scientificName={analysis.detections[0].scientificName}
              />
            )}

            {/* Differential Diagnoses */}
            {analysis.differentialDiagnoses?.length > 0 && (
              <SectionCard icon={BookOpen} title="Differential Diagnoses">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
                        {['Condition', 'Likelihood', 'Key differentiator'].map(h => (
                          <th key={h} className="text-left pb-2 pr-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.differentialDiagnoses.map((d, i) => {
                        const lCol = d.likelihood === 'high' ? '#F59E0B' : d.likelihood === 'moderate' ? '#F59E0B' : '#10B981';
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="py-2.5 pr-4 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{d.condition}</td>
                            <td className="py-2.5 pr-4">
                              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${lCol}20`, color: lCol }}>{d.likelihood}</span>
                            </td>
                            <td className="py-2.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{d.reasoning}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Treatment Options */}
            {analysis.treatmentOptions?.length > 0 && (
              <SectionCard icon={Pill} title="Treatment Categories" iconColor="#10B981">
                <div className="space-y-3">
                  {analysis.treatmentOptions.map((t, i) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }}>{t.type}</span>
                          {t.requiresPrescription && (
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }}>Rx</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{t.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg p-3 flex items-start gap-2 text-xs" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <AlertCircle size={13} style={{ color: 'var(--amber)', marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Always consult a qualified healthcare professional before starting any treatment. No specific doses are provided here.</span>
                </div>
              </SectionCard>
            )}

            {/* Natural & Unconventional Remedies */}
            {analysis.naturalRemedies?.length > 0 && (
              <SectionCard icon={Leaf} title="Natural & Unconventional Remedies" iconColor="#34D399">
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                  These are natural, traditional, or integrative options that may provide symptomatic relief or complementary support. Evidence levels vary — always discuss with your healthcare provider before use.
                </p>
                <div className="space-y-3">
                  {analysis.naturalRemedies.map((r, i) => {
                    const evidenceColors = {
                      emerging: { bg: 'rgba(52,211,153,0.1)', color: '#34D399', border: 'rgba(52,211,153,0.25)' },
                      preliminary: { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: 'rgba(96,165,250,0.25)' },
                      traditional: { bg: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
                      anecdotal: { bg: 'rgba(156,163,175,0.1)', color: '#9CA3AF', border: 'rgba(156,163,175,0.25)' },
                    };
                    const catColors = {
                      herbal: '🌿', dietary: '🥗', topical: '🧴', environmental: '🌍', integrative: '⚕️'
                    };
                    const ec = evidenceColors[r.evidenceLevel] || evidenceColors.anecdotal;
                    return (
                      <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{catColors[r.category] || '🌿'}</span>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded capitalize" style={{ background: ec.bg, color: ec.color, border: `1px solid ${ec.border}` }}>{r.evidenceLevel}</span>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{r.description}</p>
                        {r.safetyNotes && (
                          <div className="flex items-start gap-1.5 rounded-lg p-2.5 mt-1" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <AlertCircle size={11} style={{ color: 'var(--amber)', marginTop: '2px', flexShrink: 0 }} />
                            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{r.safetyNotes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 rounded-lg p-3 flex items-start gap-2 text-xs" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <Leaf size={13} style={{ color: '#34D399', marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Natural remedies do not replace conventional medical treatment. Consult a healthcare professional before use, especially if pregnant, immunocompromised, or taking other medications.</span>
                </div>
              </SectionCard>
            )}

            {/* GP Testing */}
            {analysis.gpTestingList?.length > 0 && (
              <SectionCard icon={ClipboardList} title="Ask Your GP for These Tests" accent>
                <ul className="space-y-2">
                  {analysis.gpTestingList.map((test, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                      <CheckCircle size={13} style={{ color: 'var(--amber)', marginTop: '3px', flexShrink: 0 }} />
                      {test}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {/* If GP Dismisses You */}
            {analysis.gpScriptIfDismissed?.length > 0 && (
              <SectionCard icon={MessageSquare} title="If Your GP Dismisses Your Concerns" iconColor="#F59E0B">
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>These are suggested things you can say to advocate for yourself:</p>
                <ul className="space-y-2">
                  {analysis.gpScriptIfDismissed.map((line, i) => (
                    <li key={i} className="rounded-lg p-3 text-sm italic" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                      "{line}"
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {/* ── Deep Dive CTA ─────────────────────────────────────────── */}
            {analysis.detections?.length > 0 && (
              <div
                className="pp-card p-5 relative overflow-hidden"
                style={{
                  border: '1px solid rgba(245,158,11,0.3)',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(217,119,6,0.02) 100%)',
                }}
              >
                {/* Decorative glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
                    transform: 'translate(30%, -30%)',
                  }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      <BookOpen size={18} style={{ color: 'var(--amber)' }} />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        Want to know more about{' '}
                        <span style={{ color: 'var(--amber)' }}>
                          {analysis.detections[0]?.commonName || 'this parasite'}
                        </span>
                        ?
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                        Get a full AI-researched Deep Dive — lifecycle, transmission, treatment categories,
                        Australian relevance, and cited clinical sources.
                      </p>
                      <p className="text-xs mt-1.5 font-mono" style={{ color: 'rgba(245,158,11,0.7)' }}>
                        1 credit · Generated once, re-read for free
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeepDive(true)}
                    className="pp-btn-primary flex-shrink-0 flex items-center gap-1.5"
                    style={{ padding: '9px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
                  >
                    <BookOpen size={13} /> Deep Dive
                  </button>
                </div>
              </div>
            )}

            {/* Feedback */}
            {!feedbackSubmitted ? (
              <div className="pp-card p-5 text-center">
                <p className="font-heading font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Was this analysis helpful?</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => submitFeedback(true)} className="pp-btn-ghost flex items-center gap-2" style={{ padding: '9px 18px' }}>
                    <ThumbsUp size={15} /> Helpful
                  </button>
                  <button onClick={() => submitFeedback(false)} className="pp-btn-ghost flex items-center gap-2" style={{ padding: '9px 18px' }}>
                    <ThumbsDown size={15} /> Not helpful
                  </button>
                </div>
              </div>
            ) : (
              <div className="pp-card p-4 text-center">
                <p className="text-sm font-mono" style={{ color: '#10B981' }}>✓ Feedback received — thank you</p>
              </div>
            )}

            {/* Journal CTA */}
            <div className="pp-card p-5 flex items-center justify-between" style={{ border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.04)' }}>
              <div>
                <p className="font-heading font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Track your progress</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Log symptoms, track treatment, generate a doctor report.</p>
              </div>
              <button onClick={() => setShowJournalPrompt(true)} className="pp-btn-primary ml-4 flex-shrink-0" style={{ padding: '9px 16px', fontSize: '13px' }}>
                Start Journal
              </button>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <AlertTriangle size={12} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>⚠️ This AI assessment is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional. In an emergency, call 000.</span>
            </div>

          </div>
        </div>
      </div>


      {showDeepDive && analysis.detections?.length > 0 && (
        <DeepDiveModal
          analysisId={id}
          parasiteName={analysis.detections[0]?.commonName || 'Unknown Parasite'}
          scientificName={analysis.detections[0]?.scientificName}
          userCredits={userCredits}
          onClose={() => setShowDeepDive(false)}
          onCreditsUsed={() => setUserCredits(c => Math.max(0, c - 1))}
        />
      )}

      {showJournalPrompt && (
        <JournalPromptModal
          isOpen={showJournalPrompt}
          analysisId={id}
          detections={analysis.detections}
          onClose={() => setShowJournalPrompt(false)}
        />
      )}
    </div>
  );
};

export default AnalysisResultsPage;
