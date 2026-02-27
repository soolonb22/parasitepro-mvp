import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Loader, Download,
  ThumbsUp, ThumbsDown, BookOpen, Pill, Shield, ArrowLeft,
  Microscope, Info, FileText, ClipboardList, MessageSquare, Activity,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import JournalPromptModal from '../components/JournalPromptModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Detection {
  id: string;
  parasiteId: string;
  commonName: string;
  scientificName: string;
  confidenceScore: number;
  boundingBox: { x: number; y: number; width: number; height: number } | null;
  lifeStage?: string;
  parasiteType: string;
  urgencyLevel: string;
}

interface DifferentialDiagnosis {
  condition: string;
  likelihood: 'low' | 'moderate' | 'high';
  reasoning: string;
}

interface RecommendedAction {
  priority: 'immediate' | 'soon' | 'routine';
  action: string;
  detail: string;
}

interface HealthRisk {
  category: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
}

interface TreatmentOption {
  type: 'medical' | 'supportive' | 'environmental';
  name: string;
  description: string;
  requiresPrescription: boolean;
}

interface Analysis {
  id: string;
  status: string;
  imageUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  sampleType?: string;
  collectionDate?: string;
  location?: string;
  processingCompletedAt?: string;
  detections: Detection[];
  // Rich AI fields
  overallAssessment?: string;
  visualFindings?: string;
  urgencyLevel?: string;
  differentialDiagnoses: DifferentialDiagnosis[];
  recommendedActions: RecommendedAction[];
  healthRisks: HealthRisk[];
  treatmentOptions: TreatmentOption[];
  gpTestingList: string[];
  gpScript: string[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const urgencyColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'emergency': return 'bg-red-600 text-white';
    case 'high': return 'bg-orange-600 text-white';
    case 'moderate': return 'bg-yellow-600 text-white';
    default: return 'bg-green-700 text-white';
  }
};

const urgencyBorder = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'emergency': return 'border-red-600';
    case 'high': return 'border-orange-600';
    case 'moderate': return 'border-yellow-600';
    default: return 'border-green-700';
  }
};

const likelihoodColor = (l: string) => {
  switch (l) {
    case 'high': return 'bg-orange-700 text-white';
    case 'moderate': return 'bg-yellow-700 text-white';
    default: return 'bg-gray-600 text-gray-200';
  }
};

const priorityColor = (p: string) => {
  switch (p) {
    case 'immediate': return 'bg-red-700 text-white';
    case 'soon': return 'bg-orange-700 text-white';
    default: return 'bg-blue-700 text-white';
  }
};

const severityBorder = (s: string) => {
  switch (s) {
    case 'high': return 'border-l-red-500';
    case 'moderate': return 'border-l-orange-500';
    default: return 'border-l-yellow-500';
  }
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const AnalysisResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalPromptShown, setJournalPromptShown] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedScript, setCopiedScript] = useState<number | null>(null);

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (!analysis) return;
    if (analysis.status === 'processing' || analysis.status === 'pending') {
      const interval = setInterval(fetchAnalysis, 5000);
      return () => clearInterval(interval);
    }
    if (analysis.status === 'completed' && !journalPromptShown) {
      const timer = setTimeout(() => {
        setShowJournalPrompt(true);
        setJournalPromptShown(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [analysis?.status]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnalysis(response.data);
    } catch {
      toast.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (wasHelpful: boolean) => {
    try {
      await axios.post(
        `${API_URL}/analysis/${id}/feedback`,
        { wasHelpful },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success('Thank you for your feedback!');
      setFeedbackSubmitted(true);
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedScript(idx);
      setTimeout(() => setCopiedScript(null), 2000);
    });
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const date = new Date(analysis.uploadedAt).toLocaleDateString('en-AU');
    const completed = analysis.processingCompletedAt
      ? new Date(analysis.processingCompletedAt).toLocaleDateString('en-AU')
      : 'N/A';

    const lines = [
      'PARASITEPRO — AI ANALYSIS REPORT',
      '='.repeat(45),
      '',
      `Analysis ID:     ${analysis.id}`,
      `Date Uploaded:   ${date}`,
      `Completed:       ${completed}`,
      `Sample Type:     ${analysis.sampleType || 'Not specified'}`,
      `Location:        ${analysis.location || 'Not specified'}`,
      `Urgency:         ${(analysis.urgencyLevel || 'Unknown').toUpperCase()}`,
      '',
      '— OVERALL ASSESSMENT —',
      analysis.overallAssessment || 'N/A',
      '',
      '— VISUAL FINDINGS —',
      analysis.visualFindings || 'N/A',
      '',
      '— DETECTIONS —',
      '',
      ...(analysis.detections.length > 0
        ? analysis.detections.map(
            (d, i) =>
              `Detection ${i + 1}: ${d.commonName} (${d.scientificName})\n` +
              `  Confidence: ${(d.confidenceScore * 100).toFixed(1)}%  Urgency: ${d.urgencyLevel?.toUpperCase()}  Stage: ${d.lifeStage || 'Unknown'}`
          )
        : ['No parasites detected.']),
      '',
      '— DIFFERENTIAL DIAGNOSES —',
      '',
      ...(analysis.differentialDiagnoses || []).map(
        (d) => `• ${d.condition} [${d.likelihood}]\n  ${d.reasoning}`
      ),
      '',
      '— RECOMMENDED ACTIONS —',
      '',
      ...(analysis.recommendedActions || []).map(
        (a) => `[${a.priority.toUpperCase()}] ${a.action}\n  ${a.detail}`
      ),
      '',
      '— GP TESTING LIST —',
      '',
      ...(analysis.gpTestingList || []).map((t) => `• ${t}`),
      '',
      '— GP SCRIPT (if dismissed) —',
      '',
      ...(analysis.gpScript || []).map((s, i) => `${i + 1}. ${s}`),
      '',
      '='.repeat(45),
      'DISCLAIMER: For informational purposes only. Not a substitute for professional medical diagnosis.',
      'ParasitePro | parasitepro.com',
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ParasitePro-Report-${analysis.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  // ── States ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-white">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-900 border border-red-600 rounded-xl p-8 text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Analysis Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (analysis.status === 'processing' || analysis.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gray-800 rounded-xl p-10 text-center">
          <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={56} />
          <h2 className="text-2xl font-bold text-white mb-2">Analysing Your Image...</h2>
          <p className="text-gray-400 mb-6">Our AI is processing your image. This usually takes 30–90 seconds.</p>
          {analysis.thumbnailUrl && (
            <img src={analysis.thumbnailUrl} alt="Processing" className="w-48 h-48 object-contain mx-auto bg-gray-900 rounded-xl opacity-60" />
          )}
        </div>
      </div>
    );
  }

  const primaryDetection = analysis.detections[0];

  // ── Main results ────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <JournalPromptModal
        isOpen={showJournalPrompt}
        analysisId={analysis.id}
        parasiteName={primaryDetection?.commonName}
        onClose={() => setShowJournalPrompt(false)}
      />

      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download Report
          </button>
          <button
            onClick={() => navigate('/journal')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <BookOpen size={16} />
            Open Journal
          </button>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Analysis Results</h1>
        {analysis.processingCompletedAt && (
          <p className="text-gray-400 text-sm">
            Completed {new Date(analysis.processingCompletedAt).toLocaleString('en-AU')}
          </p>
        )}
      </div>

      {/* Overall Assessment */}
      {analysis.overallAssessment && (
        <div className={`bg-gray-800 border-2 rounded-xl p-5 ${urgencyBorder(analysis.urgencyLevel || 'moderate')}`}>
          <div className="flex items-start gap-3">
            <Activity className="text-blue-400 flex-shrink-0 mt-0.5" size={22} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-white">Clinical Assessment</h2>
                {analysis.urgencyLevel && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${urgencyColor(analysis.urgencyLevel)}`}>
                    {analysis.urgencyLevel.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-gray-200 leading-relaxed">{analysis.overallAssessment}</p>
            </div>
          </div>
        </div>
      )}

      {/* No detections */}
      {analysis.detections.length === 0 && (
        <div className="bg-green-900 border border-green-600 rounded-xl p-6 flex items-start gap-4">
          <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={28} />
          <div>
            <h2 className="text-xl font-bold text-white mb-1">No Parasites Detected</h2>
            <p className="text-green-200 text-sm">
              Our AI did not detect any known parasites in this image. If you have ongoing symptoms, please consult a healthcare professional.
            </p>
          </div>
        </div>
      )}

      {/* Primary Detection Card */}
      {primaryDetection && (
        <div className={`bg-gray-800 border-2 rounded-xl overflow-hidden ${urgencyBorder(primaryDetection.urgencyLevel)}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div>
              <img
                src={analysis.imageUrl}
                alt="Sample analysis"
                className="w-full h-80 object-contain bg-gray-900 rounded-xl"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${urgencyColor(primaryDetection.urgencyLevel)}`}>
                  {primaryDetection.urgencyLevel.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-blue-900 rounded-full text-blue-200 text-sm">
                  {(primaryDetection.confidenceScore * 100).toFixed(1)}% Confidence
                </span>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-gray-300 text-sm capitalize">
                  {primaryDetection.parasiteType}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{primaryDetection.commonName}</h2>
                <p className="text-gray-400 italic">{primaryDetection.scientificName}</p>
                {primaryDetection.lifeStage && (
                  <p className="text-gray-400 text-sm mt-1">
                    Life stage: <span className="text-white capitalize">{primaryDetection.lifeStage}</span>
                  </p>
                )}
              </div>
              {primaryDetection.urgencyLevel === 'emergency' && (
                <div className="bg-red-900 border border-red-600 rounded-xl p-4">
                  <h3 className="font-bold text-red-100 mb-1 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    URGENT: Seek Immediate Medical Attention
                  </h3>
                  <p className="text-red-200 text-sm">
                    This parasite requires emergency care. Visit an emergency department or call 000 now.
                  </p>
                </div>
              )}
              {primaryDetection.urgencyLevel === 'high' && (
                <div className="bg-orange-900 border border-orange-600 rounded-xl p-4">
                  <h3 className="font-bold text-orange-100 mb-1 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    See a Doctor Within 24 Hours
                  </h3>
                  <p className="text-orange-200 text-sm">
                    This finding requires prompt medical evaluation. Contact your GP or an urgent care clinic today.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Detections */}
      {analysis.detections.length > 1 && (
        <div className="bg-gray-800 rounded-xl p-5">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Microscope size={20} className="text-blue-400" />
            Additional Detections
          </h3>
          <div className="space-y-2">
            {analysis.detections.slice(1).map((det) => (
              <div key={det.id} className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3">
                <div>
                  <span className="text-white font-medium">{det.commonName}</span>
                  <span className="text-gray-400 text-sm ml-2 italic">{det.scientificName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${urgencyColor(det.urgencyLevel)}`}>
                    {det.urgencyLevel.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">{(det.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Findings */}
      {analysis.visualFindings && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="text-cyan-400" size={22} />
            Visual Findings
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm">{analysis.visualFindings}</p>
        </div>
      )}

      {/* Differential Diagnoses */}
      {analysis.differentialDiagnoses?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Info className="text-purple-400" size={22} />
            Differential Diagnoses
          </h3>
          <div className="space-y-3">
            {analysis.differentialDiagnoses.map((d, i) => (
              <div key={i} className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold">{d.condition}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${likelihoodColor(d.likelihood)}`}>
                    {d.likelihood} likelihood
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{d.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {analysis.recommendedActions?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-blue-400" size={22} />
            Recommended Actions
          </h3>
          <div className="space-y-3">
            {analysis.recommendedActions.map((a, i) => (
              <div key={i} className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${priorityColor(a.priority)}`}>
                    {a.priority.toUpperCase()}
                  </span>
                  <span className="text-white font-semibold">{a.action}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Risks */}
      {analysis.healthRisks?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-400" size={22} />
            Health Risks
          </h3>
          <div className="space-y-3">
            {analysis.healthRisks.map((r, i) => (
              <div key={i} className={`bg-gray-700 rounded-xl p-4 border-l-4 ${severityBorder(r.severity)}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">{r.category}</span>
                  <span className="text-gray-400 text-xs capitalize">({r.severity} severity)</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment Options */}
      {analysis.treatmentOptions?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Pill className="text-green-400" size={22} />
            Treatment Options
          </h3>
          <div className="space-y-3">
            {analysis.treatmentOptions.map((t, i) => (
              <div key={i} className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-white font-semibold">{t.name}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <span className="px-2 py-0.5 bg-gray-600 rounded text-xs text-gray-300 capitalize">{t.type}</span>
                    {t.requiresPrescription ? (
                      <span className="px-2 py-0.5 bg-orange-900 text-orange-200 rounded text-xs">Rx required</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-900 text-green-200 rounded text-xs">No Rx needed</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-900 border border-yellow-700 rounded-lg p-3">
            <p className="text-yellow-200 text-xs">
              <strong>Disclaimer:</strong> Always consult a qualified healthcare professional before starting any treatment. This information is for educational purposes only.
            </p>
          </div>
        </div>
      )}

      {/* GP Testing List */}
      {analysis.gpTestingList?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ClipboardList className="text-teal-400" size={22} />
            Tests to Request from Your GP
          </h3>
          <ul className="space-y-2">
            {analysis.gpTestingList.map((test, i) => (
              <li key={i} className="flex items-start gap-3 bg-gray-700 rounded-lg px-4 py-3">
                <CheckCircle size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">{test}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* GP Script */}
      {analysis.gpScript?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="text-indigo-400" size={22} />
            What to Say to Your GP
          </h3>
          <p className="text-gray-400 text-sm mb-4">Exact scripts for common dismissals — tap to copy.</p>
          <div className="space-y-3">
            {analysis.gpScript.map((script, i) => (
              <div key={i} className="bg-indigo-950 border border-indigo-700 rounded-xl p-4">
                <p className="text-indigo-100 text-sm leading-relaxed mb-3">{script}</p>
                <button
                  onClick={() => copyToClipboard(script, i)}
                  className="text-xs px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  {copiedScript === i ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {!feedbackSubmitted ? (
        <div className="bg-gray-800 rounded-xl p-5 text-center">
          <p className="text-white font-medium mb-3">Was this analysis helpful?</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => submitFeedback(true)}
              className="flex items-center gap-2 px-5 py-2 bg-green-700 hover:bg-green-600 text-white rounded-xl transition-colors"
            >
              <ThumbsUp size={18} />
              Yes, helpful
            </button>
            <button
              onClick={() => submitFeedback(false)}
              className="flex items-center gap-2 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              <ThumbsDown size={18} />
              Not helpful
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-green-400 font-medium">✓ Thank you for your feedback!</p>
        </div>
      )}

      {/* Journal prompt */}
      <div className="bg-purple-900 border border-purple-700 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Track your progress</p>
          <p className="text-purple-200 text-sm">Log symptoms, upload follow-ups, and generate a doctor report.</p>
        </div>
        <button
          onClick={() => setShowJournalPrompt(true)}
          className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold flex-shrink-0 transition-colors"
        >
          Start Journal
        </button>
      </div>
    </div>
  );
};

export default AnalysisResultsPage;
