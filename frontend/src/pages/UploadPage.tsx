// @ts-nocheck
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Camera, FileImage, AlertCircle, Loader, X,
  Calendar, MapPin, Sun, Focus, Ruler, ArrowLeft,
  Microscope, ChevronDown, ChevronUp,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import PrivacyConsentModal from '../components/PrivacyConsentModal';
import VoiceAssistant from '../components/VoiceAssistant';
import PricingConfirmModal from '../components/PricingConfirmModal';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;
const PRIVACY_CONSENT_KEY = 'parasite_privacy_accepted';

const CAPTURE_TIPS = [
  { icon: Sun, title: 'Good lighting', detail: 'Natural daylight or bright torch.' },
  { icon: Focus, title: 'Sharp focus', detail: 'Tap to focus on the specimen.' },
  { icon: Ruler, title: 'Include scale', detail: 'Coin or ruler next to sample.' },
];

const SAMPLE_TYPES = [
  { value: 'stool', label: 'Stool Sample' },
  { value: 'skin', label: 'Skin / Dermal' },
  { value: 'blood', label: 'Blood Smear' },
  { value: 'microscopy', label: 'Microscopy Slide' },
  { value: 'environmental', label: 'Environmental' },
  { value: 'other', label: 'Other' },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [sampleType, setSampleType] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [location, setLocation] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [showPricingConfirm, setShowPricingConfirm] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(false);

  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);
  const hasCredits = (user?.imageCredits || 0) > 0;

  const handleUpload = () => {
    if (!selectedFile) { toast.error('Please select an image first'); return; }
    if (!hasCredits) { toast.error('You need credits to analyse images'); navigate('/pricing'); return; }
    const privacyAccepted = localStorage.getItem(PRIVACY_CONSENT_KEY);
    if (!privacyAccepted) { setShowPrivacyConsent(true); setPendingUpload(true); return; }
    setShowPricingConfirm(true);
  };

  const handlePrivacyAccept = (consents) => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify({ ...consents, accepted: true, date: new Date().toISOString() }));
    setShowPrivacyConsent(false);
    if (pendingUpload) { setPendingUpload(false); setShowPricingConfirm(true); }
  };

  const handleUploadConfirmed = async () => {
    setShowPricingConfirm(false);
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (sampleType) formData.append('sampleType', sampleType);
      if (collectionDate) formData.append('collectionDate', collectionDate);
      if (location) formData.append('location', location);
      if (onboardingData) formData.append('onboardingContext', JSON.stringify(onboardingData));
      const response = await axios.post(`${API_URL}/analysis/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${accessToken}` },
        onUploadProgress: (e) => setUploadProgress(e.total ? Math.round((e.loaded * 100) / e.total) : 0),
      });
      if (user) await updateUser({ imageCredits: (user.imageCredits || 0) - 1 });
      toast.success('Upload successful! Analysing your specimen…');
      setTimeout(() => navigate(`/analysis/${response.data.analysisId}`), 800);
    } catch (error) {
      if (error.response?.status === 402) { toast.error('Insufficient credits.'); setTimeout(() => navigate('/pricing'), 2000); }
      else if (error.response?.status === 400) toast.error(error.response.data.error || 'Invalid file.');
      else toast.error('Upload failed. Please try again.');
      setUploading(false); setUploadProgress(0);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File size must be less than 10MB'); return; }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) { toast.error('Only JPEG and PNG allowed'); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null); setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  return (
    <div className="pp-page">
      <PrivacyConsentModal isOpen={showPrivacyConsent} onAccept={handlePrivacyAccept} onDecline={() => { setShowPrivacyConsent(false); setPendingUpload(false); }} />
      <PricingConfirmModal isOpen={showPricingConfirm} imagePreview={preview} creditBalance={user?.imageCredits || 0} onConfirm={handleUploadConfirmed} onCancel={() => setShowPricingConfirm(false)} />

      {/* Nav */}
      <nav className="pp-nav">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
            <Microscope size={15} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>ParasitePro</span>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: 'var(--bg-elevated)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.2)' }}>
          {user?.imageCredits || 0} credits
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="pp-section-title mb-2">Specimen Upload</p>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>Upload Sample Image</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Upload a clear photo for AI-powered specimen identification.
          </p>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up delay-100">
          {CAPTURE_TIPS.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="pp-card p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)' }}>
                <Icon size={15} style={{ color: 'var(--amber)' }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No credits warning */}
        {!hasCredits && (
          <div className="pp-card p-4 mb-6 flex items-start gap-3 animate-slide-up" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#EF4444' }}>No Credits Available</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Each analysis costs 1 credit. Purchase credits to continue.</p>
              <button onClick={() => navigate('/pricing')} className="pp-btn-primary" style={{ padding: '7px 14px', fontSize: '12px' }}>Buy Credits →</button>
            </div>
          </div>
        )}

        {!preview ? (
          <div className="space-y-4 animate-slide-up delay-200">
            {/* Drop zone */}
            <div
              ref={dropRef}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className="pp-card relative overflow-hidden cursor-pointer transition-all"
              style={{
                padding: '60px 32px',
                textAlign: 'center',
                border: dragOver ? '2px solid var(--amber)' : '2px dashed var(--bg-border)',
                background: dragOver ? 'rgba(217,119,6,0.05)' : 'var(--bg-surface)',
              }}
            >
              {/* Grid bg */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(45,47,58,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(45,47,58,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              {/* Corner reticles */}
              {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((cls, i) => (
                <div key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: dragOver ? 'var(--amber)' : 'var(--bg-border)' }} />
              ))}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all"
                  style={{ background: dragOver ? 'rgba(217,119,6,0.15)' : 'var(--bg-elevated)', border: `1px solid ${dragOver ? 'rgba(217,119,6,0.4)' : 'var(--bg-border)'}` }}>
                  <Upload size={28} style={{ color: dragOver ? 'var(--amber)' : 'var(--text-muted)' }} />
                </div>
                <p className="font-heading font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                  {dragOver ? 'Release to upload' : 'Drop specimen image here'}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>or click to browse files</p>
                <p className="text-xs mt-3 font-mono" style={{ color: 'var(--text-muted)' }}>JPEG · PNG · Max 10MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="pp-btn-ghost flex items-center justify-center gap-2" style={{ padding: '14px' }}>
                <FileImage size={18} /> Gallery
              </button>
              <button onClick={() => cameraInputRef.current?.click()} className="pp-btn-primary flex items-center justify-center gap-2" style={{ padding: '14px' }}>
                <Camera size={18} /> Camera
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={(e) => processFile(e.target.files?.[0])} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => processFile(e.target.files?.[0])} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {/* Preview */}
            <div className="pp-card overflow-hidden">
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <div>
                  <p className="pp-section-title">Specimen Preview</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                    {selectedFile?.name} · {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
                <button onClick={clearSelection} disabled={uploading} className="pp-btn-ghost" style={{ padding: '6px 10px' }}>
                  <X size={15} />
                </button>
              </div>
              <div className="relative" style={{ background: 'var(--bg-elevated)' }}>
                <img src={preview} alt="Specimen preview" className="w-full max-h-80 object-contain" />
                {/* Reticle overlay */}
                {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: 'rgba(217,119,6,0.5)' }} />
                ))}
              </div>
            </div>

            {/* Optional metadata */}
            <div className="pp-card">
              <button onClick={() => setShowMetadata(!showMetadata)} className="w-full flex items-center justify-between p-4">
                <div>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Sample Information</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>Optional — improves AI accuracy</span>
                </div>
                {showMetadata ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
              </button>

              {showMetadata && (
                <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '16px' }}>
                  <div>
                    <label className="pp-label">Sample Type</label>
                    <select value={sampleType} onChange={(e) => setSampleType(e.target.value)} className="pp-input">
                      <option value="">Select type…</option>
                      {SAMPLE_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="pp-label"><Calendar size={11} className="inline mr-1" />Collection Date</label>
                      <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} max={getTodayDate()} className="pp-input" />
                    </div>
                    <div>
                      <label className="pp-label"><MapPin size={11} className="inline mr-1" />Location</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mackay, QLD" className="pp-input" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload progress */}
            {uploading && uploadProgress > 0 && (
              <div className="pp-card p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {uploadProgress < 100 ? 'Uploading specimen…' : 'Processing with AI…'}
                  </span>
                  <span className="text-sm font-mono" style={{ color: 'var(--amber)' }}>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright))' }} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={clearSelection} disabled={uploading} className="pp-btn-ghost" style={{ padding: '13px' }}>
                Choose Different
              </button>
              <button onClick={handleUpload} disabled={uploading || !hasCredits} className="pp-btn-primary" style={{ padding: '13px' }}>
                {uploading
                  ? <span className="flex items-center justify-center gap-2"><Loader className="animate-spin" size={17} />{uploadProgress < 100 ? 'Uploading…' : 'Processing…'}</span>
                  : <span className="flex items-center justify-center gap-2"><Upload size={17} />Analyse · 1 credit</span>
                }
              </button>
            </div>

            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              ⚠️ Results are for informational purposes only and are not a substitute for professional medical diagnosis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
