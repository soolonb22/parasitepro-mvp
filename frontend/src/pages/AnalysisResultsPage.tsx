import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Loader, Download,
  ThumbsUp, ThumbsDown, BookOpen, Pill, Shield, ArrowLeft,
  Microscope, Info,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import JournalPromptModal from '../components/JournalPromptModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  riskFactors?: string[];
}

interface ParasiteDetail {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  urgencyLevel: string;
  transmission?: string[];
  symptoms?: string[];
  standardTreatments: any[];
  alternativeTreatments: any[];
  preventionMethods?: string[];
  mythsFacts: Array<{ myth: string; fact: string }>;
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
  detections: Detection[];
  parasiteDetails?: ParasiteDetail[];
  processingCompletedAt?: string;
}

const AnalysisResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalPromptShown, setJournalPromptShown] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Poll while processing
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
    // Show journal prompt 2 seconds after results load (once)
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
    } catch (error: any) {
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

  const handleDownloadReport = () => {
    if (!analysis) return;
    const detail = analysis.parasiteDetails?.[0];

    const date = new Date(analysis.uploadedAt).toLocaleDateString('en-AU');
    const completed = analysis.processingCompletedAt
      ? new Date(analysis.processingCompletedAt).toLocaleDateString('en-AU')
      : 'N/A';

    const reportLines = [
      'NOTWORMS — AI ANALYSIS REPORT',
      '='.repeat(45),
      '',
      `Analysis ID:     ${analysis.id}`,
      `Date Uploaded:   ${date}`,
      `Completed:       ${completed}`,
      `Sample Type:     ${analysis.sampleType || 'Not specified'}`,
      `Location:        ${analysis.location || 'Not specified'}`,
      '',
      '— DETECTION RESULTS —',
      '',
      ...(analysis.detections.length > 0
        ? analysis.detections.map(
            (d, i) => [
              `Detection ${i + 1}: ${d.commonName} (${d.scientificName})`,
              `  Confidence:    ${(d.confidenceScore * 100).toFixed(1)}%`,
              `  Type:          ${d.parasiteType}`,
              `  Urgency:       ${d.urgencyLevel.toUpperCase()}`,
              `  Life Stage:    ${d.lifeStage || 'Unknown'}`,
              '',
            ].join('\n')
          )
        : ['No parasites detected.']),
      '',
      detail
        ? [
            '— PARASITE INFORMATION —',
            '',
            detail.description || '',
            '',
            '— TREATMENT OPTIONS —',
            '',
            ...(detail.standardTreatments?.map((t: any) => `• ${t.name}${t.dosage ? ` — ${t.dosage}` : ''}`) || []),
            '',
            '— PREVENTION —',
            '',
            ...(detail.preventionMethods?.map((p: string) => `• ${p}`) || []),
          ].join('\n')
        : '',
      '',
      '='.repeat(45),
      'IMPORTANT DISCLAIMER',
      'This report is for informational purposes only.',
      'It is NOT a substitute for professional medical diagnosis.',
      'Please consult a qualified healthcare provider to confirm these findings.',
      '',
      'NotWorms | notworms.com | support@notworms.com',
    ].join('\n');

    const blob = new Blob([reportLines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NotWorms-Report-${analysis.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  const getUrgencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'moderate': return 'bg-yellow-600 text-white';
      default: return 'bg-green-700 text-white';
    }
  };

  const getUrgencyBorder = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'emergency': return 'border-red-600';
      case 'high': return 'border-orange-600';
      case 'moderate': return 'border-yellow-600';
      default: return 'border-green-700';
    }
  };

  // --- Loading ---
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

  // --- Still processing ---
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
  const primaryParasite = analysis.parasiteDetails?.[0];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Journal Prompt */}
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
        <div className={`bg-gray-800 border-2 rounded-xl overflow-hidden ${getUrgencyBorder(primaryDetection.urgencyLevel)}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Image */}
            <div>
              <img
                src={analysis.imageUrl}
                alt="Sample analysis"
                className="w-full h-80 object-contain bg-gray-900 rounded-xl"
              />
            </div>

            {/* Detection info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getUrgencyColor(primaryDetection.urgencyLevel)}`}>
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
                  <p className="text-gray-400 text-sm mt-1">Life stage: <span className="text-white capitalize">{primaryDetection.lifeStage}</span></p>
                )}
              </div>

              {primaryParasite?.description && (
                <p className="text-gray-300 text-sm leading-relaxed">{primaryParasite.description}</p>
              )}

              {/* Emergency alert */}
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

      {/* Additional detections */}
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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getUrgencyColor(det.urgencyLevel)}`}>
                    {det.urgencyLevel.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">{(det.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed info */}
      {primaryParasite && (
        <div className="space-y-4">
          {/* Treatments */}
          {(primaryParasite.standardTreatments?.length > 0 || primaryParasite.alternativeTreatments?.length > 0) && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Pill className="text-green-400" size={22} />
                Treatment Options
              </h3>
              {primaryParasite.standardTreatments?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-green-300 font-medium mb-3">Standard Medical Treatments</h4>
                  <div className="space-y-3">
                    {primaryParasite.standardTreatments.map((t: any, i: number) => (
                      <div key={i} className="bg-gray-700 rounded-lg p-4">
                        <p className="text-white font-medium">{t.name}</p>
                        {t.dosage && <p className="text-gray-300 text-sm mt-1"><span className="text-gray-400">Dosage:</span> {t.dosage}</p>}
                        {t.duration && <p className="text-gray-300 text-sm"><span className="text-gray-400">Duration:</span> {t.duration}</p>}
                        {t.pregnancySafe === false && <p className="text-orange-300 text-xs mt-2">⚠️ Not recommended during pregnancy</p>}
                        {t.childSafe === false && <p className="text-orange-300 text-xs">⚠️ Not recommended for children</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {primaryParasite.alternativeTreatments?.length > 0 && (
                <div>
                  <h4 className="text-blue-300 font-medium mb-3">Alternative Treatments</h4>
                  <div className="space-y-3">
                    {primaryParasite.alternativeTreatments.map((t: any, i: number) => (
                      <div key={i} className="bg-gray-700 rounded-lg p-4">
                        <p className="text-white font-medium">{t.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Evidence level: {t.evidenceLevel}</p>
                        {t.dosage && <p className="text-gray-300 text-sm mt-1">{t.dosage}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 bg-yellow-900 border border-yellow-700 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                  <strong>Disclaimer:</strong> Always consult a qualified healthcare professional before starting any treatment. This information is for educational purposes only.
                </p>
              </div>
            </div>
          )}

          {/* Myths vs Facts */}
          {primaryParasite.mythsFacts?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="text-purple-400" size={22} />
                Myths vs Facts
              </h3>
              <div className="space-y-3">
                {primaryParasite.mythsFacts.map((item: any, i: number) => (
                  <div key={i} className="bg-gray-700 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-red-900 text-red-200 text-xs font-bold rounded flex-shrink-0 mt-0.5">MYTH</span>
                      <p className="text-gray-300 text-sm">{item.myth}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-0.5 bg-green-900 text-green-200 text-xs font-bold rounded flex-shrink-0 mt-0.5">FACT</span>
                      <p className="text-white text-sm">{item.fact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prevention */}
          {primaryParasite.preventionMethods && primaryParasite.preventionMethods.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="text-blue-400" size={22} />
                Prevention Methods
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {primaryParasite.preventionMethods.map((method: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm bg-gray-700 rounded-lg p-3">
                    <CheckCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          )}
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

      {/* Journal prompt button */}
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
