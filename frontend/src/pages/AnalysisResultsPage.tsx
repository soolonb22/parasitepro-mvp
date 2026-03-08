// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Loader, Download,
  ThumbsUp, ThumbsDown, BookOpen, Pill, Shield, ArrowLeft,
  Microscope, Info, AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import JournalPromptModal from '../components/JournalPromptModal';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const URGENCY_MAP = {
  emergency: { label: '🚨 URGENT', bg: 'rgba(153,27,27,0.15)', color: '#EF4444', border: 'rgba(153,27,27,0.4)' },
  high:      { label: '🔴 HIGH', bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  moderate:  { label: '🟡 MODERATE', bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  low:       { label: '🟢 LOW', bg: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
};

const getUrgency = (level) => URGENCY_MAP[level?.toLowerCase()] || URGENCY_MAP.low;

const AnalysisResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalPromptShown, setJournalPromptShown] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => { fetchAnalysis(); }, [id]);

  useEffect(() => {
    if (!analysis) return;
    if (analysis.status === 'processing' || analysis.status === 'pending') {
      const interval = setInterval(fetchAnalysis, 5000);
      return () => clearInterval(interval);
    }
    if (analysis.status === 'completed' && !journalPromptShown) {
      const timer = setTimeout(() => { setShowJournalPrompt(true); setJournalPromptShown(true); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [analysis?.status]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setAnalysis(response.data);
    } catch { toast.error('Failed to load analysis'); }
    finally { setLoading(false); }
  };

  const submitFeedback = async (wasHelpful) => {
    try {
      await axios.post(`${API_URL}/analysis/${id}/feedback`, { wasHelpful }, { headers: { Authorization: `Bearer ${accessToken}` } });
      toast.success('Thank you for your feedback!');
      setFeedbackSubmitted(true);
    } catch { toast.error('Failed to submit feedback'); }
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const detail = analysis.parasiteDetails?.[0];
    const date = new Date(analysis.uploadedAt).toLocaleDateString('en-AU');
    const completed = analysis.processingCompletedAt ? new Date(analysis.processingCompletedAt).toLocaleDateString('en-AU') : 'N/A';
    const reportLines = [
      'PARASITEPRO — AI ANALYSIS REPORT',
      '='.repeat(45), '',
      `Analysis ID:   ${analysis.id}`,
      `Uploaded:      ${date}`,
      `Completed:     ${completed}`,
      `Sample Type:   ${analysis.sampleType || 'Not specified'}`,
      `Location:      ${analysis.location || 'Not specified'}`,
      '', '— DETECTION RESULTS —', '',
      ...(analysis.detections.length > 0
        ? analysis.detections.map((d, i) => [`Detection ${i+1}: ${d.commonName} (${d.scientificName})`, `  Confidence: ${(d.confidenceScore*100).toFixed(1)}%`, `  Urgency:    ${d.urgencyLevel.toUpperCase()}`, ''].join('\n'))
        : ['No parasites detected.']),
      '', detail ? ['— PARASITE INFORMATION —', '', detail.description || '', '', '— TREATMENTS —', '', ...(detail.standardTreatments?.map(t => `• ${t.name}`) || []), '', '— PREVENTION —', '', ...(detail.preventionMethods?.map(p => `• ${p}`) || [])].join('\n') : '',
      '', '='.repeat(45),
      'DISCLAIMER: For informational purposes only. Not medical advice.',
      'Always consult a qualified healthcare provider.',
      '', 'ParasitePro | notworms.com',
    ].join('\n');
    const blob = new Blob([reportLines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ParasitePro-${analysis.id.slice(0,8)}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  // Loading
  if (loading) {
    return (
      <div className="pp-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-amber" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Loader className="animate-spin" size={28} style={{ color: 'var(--amber)' }} />
          </div>
          <p className="font-heading text-sm" style={{ color: 'var(--text-muted)' }}>Loading analysis…</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="pp-page flex items-center justify-center min-h-screen">
        <div className="pp-card p-10 text-center max-w-md">
          <AlertTriangle size={36} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
          <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Analysis Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="pp-btn-primary mt-4">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  // Processing
  if (analysis.status === 'processing' || analysis.status === 'pending') {
    return (
      <div className="pp-page flex items-center justify-center min-h-screen">
        <div className="pp-card p-12 text-center max-w-lg w-full mx-4">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {analysis.thumbnailUrl
              ? <img src={analysis.thumbnailUrl} alt="Processing" className="w-full h-full object-cover rounded-xl opacity-50" />
              : <div className="w-full h-full rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)' }}><Microscope size={36} style={{ color: 'var(--text-muted)' }} /></div>
            }
            {/* Scanning line */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="pp-scan-line" />
            </div>
            {/* Reticle corners */}
            {['top-1 left-1 border-t-2 border-l-2', 'top-1 right-1 border-t-2 border-r-2', 'bottom-1 left-1 border-b-2 border-l-2', 'bottom-1 right-1 border-b-2 border-r-2'].map((cls, i) => (
              <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: 'var(--amber)', opacity: 0.7 }} />
            ))}
          </div>
          <p className="pp-section-title mb-2">Analysis in Progress</p>
          <h2 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>Analysing Specimen…</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>AI is processing your image. Usually 30–90 seconds.</p>
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {[0,1,2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber)', animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const primaryDetection = analysis.detections[0];
  const primaryParasite = analysis.parasiteDetails?.[0];
  const urgency = primaryDetection ? getUrgency(primaryDetection.urgencyLevel) : null;

  return (
    <div className="pp-page">
      <JournalPromptModal isOpen={showJournalPrompt} analysisId={analysis.id} parasiteName={primaryDetection?.commonName} onClose={() => setShowJournalPrompt(false)} />

      {/* Nav */}
      <nav className="pp-nav">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={15} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="font-display font-bold text-base hidden sm:block" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadReport} className="pp-btn-ghost" style={{ padding: '7px 12px', fontSize: '12px' }}>
            <Download size={14} /> <span className="hidden sm:inline">Report</span>
          </button>
          <button onClick={() => navigate('/journal')} className="pp-btn-ghost" style={{ padding: '7px 12px', fontSize: '12px' }}>
            <BookOpen size={14} /> <span className="hidden sm:inline">Journal</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12 space-y-6">

        {/* Header + meta */}
        <div className="flex items-start gap-4 animate-slide-up">
          <div>
            <p className="pp-section-title mb-1">Analysis Report</p>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              {primaryDetection?.commonName || 'No Parasite Detected'}
            </h1>
            {primaryDetection && (
              <p className="font-mono text-sm mt-1" style={{ color: 'var(--amber)' }}>
                {primaryDetection.scientificName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — image + urgency */}
          <div className="space-y-4">
            {/* Image */}
            <div className="pp-card overflow-hidden animate-slide-up">
              <div className="relative">
                <img src={analysis.imageUrl || analysis.thumbnailUrl} alt="Specimen" className="w-full object-contain max-h-72" style={{ background: 'var(--bg-elevated)' }} />
                {/* Reticle */}
                {['top-2 left-2 border-t-2 border-l-2','top-2 right-2 border-t-2 border-r-2','bottom-2 left-2 border-b-2 border-l-2','bottom-2 right-2 border-b-2 border-r-2'].map((cls,i) => (
                  <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: 'rgba(217,119,6,0.6)' }} />
                ))}
              </div>
              <div className="p-3 flex items-center gap-4 text-xs font-mono" style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
                <span>{new Date(analysis.uploadedAt).toLocaleDateString('en-AU')}</span>
                {analysis.sampleType && <><span>·</span><span className="capitalize">{analysis.sampleType}</span></>}
                {analysis.location && <><span>·</span><span>{analysis.location}</span></>}
              </div>
            </div>

            {/* Urgency */}
            {urgency && (
              <div className="pp-card p-4 animate-slide-up delay-100" style={{ background: urgency.bg, border: `1px solid ${urgency.border}` }}>
                <p className="pp-section-title mb-2">Urgency Level</p>
                <p className="font-display font-bold text-lg" style={{ color: urgency.color }}>{urgency.label}</p>
              </div>
            )}

            {/* Confidence */}
            {primaryDetection && (
              <div className="pp-card p-4 animate-slide-up delay-200">
                <p className="pp-section-title mb-3">Detection Confidence</p>
                <div className="space-y-3">
                  {analysis.detections.map((det, i) => {
                    const pct = Math.round(det.confidenceScore * 100);
                    return (
                      <div key={det.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs truncate pr-2" style={{ color: 'var(--text-secondary)' }}>{det.commonName}</span>
                          <span className="text-xs font-mono flex-shrink-0" style={{ color: i === 0 ? 'var(--amber-bright)' : 'var(--text-muted)' }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright))' : 'var(--bg-border)', transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — detail */}
          <div className="lg:col-span-2 space-y-4">

            {/* No detection */}
            {analysis.detections.length === 0 && (
              <div className="pp-card p-8 text-center animate-slide-up">
                <CheckCircle size={36} style={{ color: '#10B981', margin: '0 auto 12px' }} />
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No Parasites Detected</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Our AI found no parasites in this image. If you have ongoing concerns, consult a healthcare professional.</p>
              </div>
            )}

            {/* Primary finding */}
            {primaryParasite && (
              <div className="pp-card p-5 animate-slide-up">
                <p className="pp-section-title mb-3">Primary Finding</p>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{primaryParasite.commonName}</h3>
                    <p className="font-mono text-sm mt-0.5" style={{ color: 'var(--amber)' }}>{primaryParasite.scientificName}</p>
                  </div>
                  {primaryDetection?.lifeStage && (
                    <span className="pp-badge-amber flex-shrink-0">{primaryDetection.lifeStage}</span>
                  )}
                </div>
                <div className="pp-divider mb-4" />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{primaryParasite.description}</p>
              </div>
            )}

            {/* Risk factors */}
            {primaryDetection?.riskFactors?.length > 0 && (
              <div className="pp-card p-5 animate-slide-up delay-100" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="pp-section-title mb-3">Risk Factors</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {primaryDetection.riskFactors.map((rf, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <AlertTriangle size={13} style={{ color: 'var(--caution)', marginTop: '2px', flexShrink: 0 }} />
                      {rf}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Symptoms + Transmission */}
            {primaryParasite && (primaryParasite.symptoms?.length > 0 || primaryParasite.transmission?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up delay-200">
                {primaryParasite.symptoms?.length > 0 && (
                  <div className="pp-card p-4">
                    <p className="pp-section-title mb-3">Symptoms</p>
                    <ul className="space-y-1.5">
                      {primaryParasite.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                          <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--amber)' }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {primaryParasite.transmission?.length > 0 && (
                  <div className="pp-card p-4">
                    <p className="pp-section-title mb-3">Transmission</p>
                    <ul className="space-y-1.5">
                      {primaryParasite.transmission.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                          <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--amber)' }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Treatments */}
            {primaryParasite && (primaryParasite.standardTreatments?.length > 0 || primaryParasite.alternativeTreatments?.length > 0) && (
              <div className="pp-card p-5 animate-slide-up delay-300">
                <div className="flex items-center gap-2 mb-4">
                  <Pill size={16} style={{ color: '#10B981' }} />
                  <p className="pp-section-title">Treatment Options</p>
                </div>
                {primaryParasite.standardTreatments?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-2" style={{ color: '#10B981' }}>Standard Medical</p>
                    <div className="space-y-2">
                      {primaryParasite.standardTreatments.map((t, i) => (
                        <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                          {t.dosage && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Dosage: {t.dosage}</p>}
                          {t.duration && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Duration: {t.duration}</p>}
                          {(t.pregnancySafe === false || t.childSafe === false) && (
                            <p className="text-xs mt-1" style={{ color: 'var(--caution)' }}>
                              ⚠️ {[t.pregnancySafe===false && 'Not for pregnancy', t.childSafe===false && 'Not for children'].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {primaryParasite.alternativeTreatments?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--amber)' }}>Alternative</p>
                    <div className="space-y-2">
                      {primaryParasite.alternativeTreatments.map((t, i) => (
                        <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                          {t.evidenceLevel && <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>Evidence: {t.evidenceLevel}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 rounded-lg p-3 flex items-start gap-2 text-xs" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <AlertCircle size={13} style={{ color: 'var(--caution)', marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Always consult a qualified healthcare professional before starting any treatment.</span>
                </div>
              </div>
            )}

            {/* Prevention */}
            {primaryParasite?.preventionMethods?.length > 0 && (
              <div className="pp-card p-5 animate-slide-up delay-400">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={16} style={{ color: 'var(--amber)' }} />
                  <p className="pp-section-title">Prevention</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {primaryParasite.preventionMethods.map((method, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm rounded-lg p-3" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={13} style={{ color: 'var(--amber)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)' }}>{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Myths vs Facts */}
            {primaryParasite?.mythsFacts?.length > 0 && (
              <div className="pp-card p-5 animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={16} style={{ color: 'var(--amber)' }} />
                  <p className="pp-section-title">Myths vs Facts</p>
                </div>
                <div className="space-y-3">
                  {primaryParasite.mythsFacts.map((item, i) => (
                    <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                      <div className="flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>MYTH</span>
                        <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{item.myth}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>FACT</span>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{item.fact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {!feedbackSubmitted ? (
              <div className="pp-card p-5 text-center animate-slide-up">
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
            <div className="pp-card p-5 flex items-center justify-between animate-slide-up" style={{ border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.04)' }}>
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
              <span>This AI assessment is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional. In an emergency, call 000.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsPage;
