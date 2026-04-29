// UploadPage.tsx — Deep Assessment with Canvas Preprocessing + Full Onboarding Form
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AnalysingScreen from '../components/AnalysingScreen';
import { PARA } from '../utils/para-copy';

const API_URL = (() => {
  const b = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return b.endsWith('/api') ? b : `${b}/api`;
})();

// ─── CANVAS PREPROCESSING ─────────────────────────────────────────────────────
async function preprocessImage(file: File): Promise<{
  original: File; enhanced: File; previewUrl: string; enhancedPreviewUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const minDim = 900;
        let w = img.width, h = img.height;
        if (Math.min(w, h) < minDim) {
          const scale = minDim / Math.min(w, h);
          w = Math.round(w * scale); h = Math.round(h * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);

        // Auto-contrast via histogram stretch
        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;
        let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
        for (let i = 0; i < d.length; i += 4) {
          rMin = Math.min(rMin, d[i]);   rMax = Math.max(rMax, d[i]);
          gMin = Math.min(gMin, d[i+1]); gMax = Math.max(gMax, d[i+1]);
          bMin = Math.min(bMin, d[i+2]); bMax = Math.max(bMax, d[i+2]);
        }
        for (let i = 0; i < d.length; i += 4) {
          d[i]   = rMax > rMin ? Math.min(255, ((d[i]   - rMin) / (rMax - rMin)) * 245) : d[i];
          d[i+1] = gMax > gMin ? Math.min(255, ((d[i+1] - gMin) / (gMax - gMin)) * 245) : d[i+1];
          d[i+2] = bMax > bMin ? Math.min(255, ((d[i+2] - bMin) / (bMax - bMin)) * 245) : d[i+2];
        }
        ctx.putImageData(imageData, 0, 0);

        // Unsharp mask sharpening
        const sharp = ctx.getImageData(0, 0, w, h);
        const src = new Uint8ClampedArray(sharp.data);
        const amt = 0.7;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            for (let c = 0; c < 3; c++) {
              const blur = (
                src[((y-1)*w+(x-1))*4+c] + src[((y-1)*w+x)*4+c] + src[((y-1)*w+(x+1))*4+c] +
                src[(y*w+(x-1))*4+c]     + src[idx+c]            + src[(y*w+(x+1))*4+c] +
                src[((y+1)*w+(x-1))*4+c] + src[((y+1)*w+x)*4+c] + src[((y+1)*w+(x+1))*4+c]
              ) / 9;
              sharp.data[idx+c] = Math.min(255, Math.max(0, src[idx+c] + amt * (src[idx+c] - blur)));
            }
          }
        }
        ctx.putImageData(sharp, 0, 0);

        const enhancedPreviewUrl = canvas.toDataURL('image/jpeg', 0.92);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas toBlob failed'));
          const enhanced = new File([blob], `enhanced_${file.name}`, { type: 'image/jpeg' });
          resolve({ original: file, enhanced, previewUrl: URL.createObjectURL(file), enhancedPreviewUrl });
        }, 'image/jpeg', 0.92);
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

// ─── IMAGE QUALITY ANALYSIS ───────────────────────────────────────────────────
interface QualityResult {
  brightness: number;   // 0–255
  resolution: { w: number; h: number };
  blurScore: number;    // lower = blurrier (Laplacian variance)
  status: 'good' | 'warn' | 'poor';
  tips: string[];
}

function analyzeQuality(file: File): Promise<QualityResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const canvas = document.createElement('canvas');
      // Sample at max 400px for speed
      const scale = Math.min(1, 400 / Math.max(w, h));
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      const len = d.length / 4;

      // Brightness (luminance average)
      let lumSum = 0;
      for (let i = 0; i < d.length; i += 4) {
        lumSum += 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
      }
      const brightness = lumSum / len;

      // Blur score — Laplacian variance (higher = sharper)
      const cw = canvas.width, ch = canvas.height;
      let lapSum = 0, lapSumSq = 0, lapN = 0;
      for (let y = 1; y < ch - 1; y++) {
        for (let x = 1; x < cw - 1; x++) {
          const idx = (y * cw + x) * 4;
          const lap =
            -d[((y-1)*cw+x)*4] - d[(y*cw+(x-1))*4] +
            4*d[idx] -
            d[(y*cw+(x+1))*4] - d[((y+1)*cw+x)*4];
          lapSum += lap; lapSumSq += lap * lap; lapN++;
        }
      }
      const lapMean = lapSum / lapN;
      const blurScore = (lapSumSq / lapN) - (lapMean * lapMean);

      // Build tips + status
      const tips: string[] = [];
      let badCount = 0;

      if (brightness < 60) {
        tips.push('🌧️ Too dark — common in Mackay wet season indoors. Move to a window or step outside.');
        badCount++;
      } else if (brightness < 100) {
        tips.push('💡 A bit dim — brighter light will improve detail. Try natural light if you can.');
        badCount += 0.5;
      } else if (brightness > 220) {
        tips.push('☀️ Slightly overexposed — step back from direct sunlight or turn off flash.');
        badCount += 0.5;
      }

      if (w < 600 || h < 600) {
        tips.push('📐 Low resolution — move your camera closer or use a higher-res setting.');
        badCount++;
      } else if (w < 900 || h < 900) {
        tips.push('📐 Moderate resolution — closer is better for small subjects.');
        badCount += 0.3;
      }

      if (blurScore < 50) {
        tips.push('🔍 Image looks blurry — tap to focus before shooting, or wipe your camera lens.');
        badCount++;
      } else if (blurScore < 150) {
        tips.push('🔍 Slightly out of focus — try tapping the subject on your screen before taking the shot.');
        badCount += 0.3;
      }

      if (tips.length === 0) tips.push('✅ Great photo! Clear, well-lit, and in focus — ready for analysis.');

      const status: QualityResult['status'] = badCount >= 1.5 ? 'poor' : badCount >= 0.5 ? 'warn' : 'good';
      resolve({ brightness, resolution: { w, h }, blurScore, status, tips });
    };
    img.onerror = () => resolve({ brightness: 128, resolution: { w: 0, h: 0 }, blurScore: 200, status: 'good', tips: [] });
    img.src = url;
  });
}


const Q1_OPTIONS = [
  { value: 'stool', label: 'Stool / faecal matter' },
  { value: 'skin', label: 'Skin, rash, or lesion' },
  { value: 'pet_env', label: 'Pet fur or environment' },
  { value: 'wound', label: 'Wound or bite site' },
  { value: 'blood', label: 'Blood smear / microscopy slide' },
  { value: 'vomit', label: 'Vomit' },
  { value: 'environmental', label: 'Something I found (environmental)' },
  { value: 'auto', label: "I'm not sure" },
];

const Q2_OPTIONS = [
  { value: 'toilet', label: 'Toilet / after bowel movement' },
  { value: 'skin_body', label: 'On my skin or body' },
  { value: 'pet', label: 'On my pet' },
  { value: 'home_yard', label: 'In my house or yard' },
  { value: 'other', label: 'Other' },
];

const Q3_OPTIONS = [
  'Just today', 'A few days', '1–2 weeks', 'More than 2 weeks', 'Recurring over months',
];

const Q4_OPTIONS = [
  'Me (adult)', 'My child (under 12)', 'My child (12–17)',
  'My pet (dog)', 'My pet (cat)', 'My pet (other)',
];

const Q5_OPTIONS = [
  'Regional or rural Queensland', 'Northern Territory', 'Other Australian states',
  'Southeast Asia', 'Africa or South America', 'No recent travel',
];

const Q6_OPTIONS = [
  'Itching (skin or anal area)', 'Stomach cramps or bloating', 'Nausea or vomiting',
  'Unexplained fatigue', 'Visible worm or parasite',
  'No symptoms — just concerned about what I saw',
];

const Q7_OPTIONS = ['Smartphone camera', 'Microscope or magnifier', 'Macro lens'];

const Q8_OPTIONS = [
  'Smaller than a grain of rice', 'Rice to fingernail size',
  'Fingernail to 5cm', 'Larger than 5cm', "I don't know",
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Step = 'drop' | 'enhancing' | 'form' | 'analysing';

interface FormState {
  q1_sampleType: string;
  q2_location: string;
  q2_locationOther: string;
  q3_duration: string;
  q4_subject: string;
  q5_travel: string[];
  q6_symptoms: string[];
  q6_symptomsOther: string;
  q7_captureMethod: string;
  q8_size: string;
  q9_notes: string;
}

const STORAGE_KEY = 'para_onboarding_form';

function loadForm(): FormState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    q1_sampleType: '', q2_location: '', q2_locationOther: '',
    q3_duration: '', q4_subject: '', q5_travel: [],
    q6_symptoms: [], q6_symptomsOther: '', q7_captureMethod: '', q8_size: '', q9_notes: '',
  };
}

function saveForm(f: FormState) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(f)); } catch {}
}

function clearForm() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const PillBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className="px-4 py-2 rounded-full text-sm font-medium transition-all text-left"
    style={{
      background: active ? 'rgba(217,119,6,0.14)' : 'var(--bg-elevated)',
      border: `1.5px solid ${active ? 'var(--amber)' : 'var(--bg-border)'}`,
      color: active ? 'var(--amber-bright)' : 'var(--text-secondary)',
    }}>
    {active ? <span className="mr-1">✓</span> : null}{children}
  </button>
);

const CardBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all"
    style={{
      background: active ? 'rgba(217,119,6,0.14)' : 'var(--bg-elevated)',
      border: `1.5px solid ${active ? 'var(--amber)' : 'var(--bg-border)'}`,
      color: active ? 'var(--amber-bright)' : 'var(--text-secondary)',
    }}>
    {active ? <span className="mr-1.5">✓</span> : <span className="mr-1.5 opacity-30">○</span>}{children}
  </button>
);

const SectionHeader: React.FC<{ label: string; title: string }> = ({ label, title }) => (
  <div className="flex items-center gap-3 pt-2">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
      style={{ background: 'rgba(217,119,6,0.12)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.3)' }}>
      {label}
    </div>
    <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{title}</p>
    <div className="flex-1 h-px" style={{ background: 'var(--bg-border)' }} />
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function UploadPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('drop');
  const [isDragging, setIsDragging] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [enhancedFile, setEnhancedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [enhancedPreviewUrl, setEnhancedPreviewUrl] = useState('');
  const [form, setForm] = useState<FormState>(loadForm);
  const [error, setError] = useState('');
  const [quality, setQuality] = useState<QualityResult | null>(null);

  // Persist form to sessionStorage on every change
  React.useEffect(() => { saveForm(form); }, [form]);

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG or PNG).'); return; }
    setError('');
    setStep('enhancing');
    // Run quality check in parallel with preprocessing
    const [result, qual] = await Promise.all([
      preprocessImage(file).catch(() => null),
      analyzeQuality(file),
    ]);
    setQuality(qual);
    if (result) {
      setOriginalFile(result.original);
      setEnhancedFile(result.enhanced);
      setPreviewUrl(result.previewUrl);
      setEnhancedPreviewUrl(result.enhancedPreviewUrl);
    } else {
      setOriginalFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    setStep('form');
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const toggleMulti = (key: 'q5_travel' | 'q6_symptoms', val: string) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!originalFile || !form.q1_sampleType) return;
    setStep('analysing');
    setError('');

    const fd = new FormData();
    fd.append('image', originalFile);
    if (enhancedFile) fd.append('enhancedImage', enhancedFile);

    // Map form values to sampleType for backend
    const sampleTypeMap: Record<string, string> = {
      stool: 'stool', skin: 'skin', wound: 'skin', blood: 'blood',
      vomit: 'stool', environmental: 'other', pet_env: 'other', auto: 'auto',
    };
    fd.append('sampleType', sampleTypeMap[form.q1_sampleType] || 'auto');

    const q2Location = form.q2_location === 'other' && form.q2_locationOther
      ? form.q2_locationOther : Q2_OPTIONS.find(o => o.value === form.q2_location)?.label || form.q2_location;

    const symptoms = form.q6_symptomsOther
      ? [...form.q6_symptoms, `Other: ${form.q6_symptomsOther}`]
      : form.q6_symptoms;

    const userContext = {
      sampleType: Q1_OPTIONS.find(o => o.value === form.q1_sampleType)?.label || form.q1_sampleType,
      sampleLocation: q2Location,
      duration: form.q3_duration,
      subject: form.q4_subject,
      recentTravel: form.q5_travel,
      symptoms,
      captureMethod: form.q7_captureMethod,
      estimatedSize: form.q8_size,
      additionalNotes: form.q9_notes || undefined,
    };
    fd.append('userContext', JSON.stringify(userContext));

    try {
      const res = await fetch(`${API_URL}/analysis/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      clearForm();
      navigate(`/analysis/${data.analysisId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('form');
    }
  };

  // ── Enhancing screen ───────────────────────────────────────────────────────
  if (step === 'enhancing') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--amber)', borderTopColor: 'transparent' }} />
        <p className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Enhancing your image…</p>
        <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Auto-contrast, sharpening, colour normalisation. Takes a second — makes a real difference.
        </p>
      </div>
    </div>
  );

  if (step === 'analysing') return <AnalysingScreen onComplete={() => {}} />;

  // ── Drop zone ──────────────────────────────────────────────────────────────
  if (step === 'drop') return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="font-display font-bold text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
            📸 Upload your photo
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Take or upload a clear, well-lit close-up for the best educational report.
          </p>
          {user && (
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--amber-bright)' }}>
              {user.imageCredits} credit{user.imageCredits !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* Mobile camera + gallery buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              const inp = document.createElement('input');
              inp.type = 'file'; inp.accept = 'image/*'; inp.capture = 'environment';
              inp.onchange = (e: any) => { const f = e.target.files?.[0]; if (f) handleFile(f); };
              inp.click();
            }}
            className="rounded-2xl py-5 flex flex-col items-center gap-2 font-semibold transition-all active:scale-95"
            style={{ background: 'var(--amber)', color: '#000', border: 'none' }}>
            <span className="text-3xl">📷</span>
            <span className="text-sm">Take a photo</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl py-5 flex flex-col items-center gap-2 font-semibold transition-all active:scale-95"
            style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1.5px solid var(--bg-border)' }}>
            <span className="text-3xl">🖼️</span>
            <span className="text-sm">Choose from gallery</span>
          </button>
        </div>

        {/* Drag & drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition-all hidden md:block"
          style={{
            borderColor: isDragging ? 'var(--amber)' : 'var(--bg-border)',
            background: isDragging ? 'rgba(217,119,6,0.05)' : 'var(--bg-surface)',
          }}>
          <div className="text-4xl mb-3">⬆️</div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Or drag and drop here
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            JPG or PNG · up to 10 MB
          </p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {/* Privacy reassurance — removes the #1 abandonment trigger for health apps */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          background: 'rgba(27,107,95,0.06)',
          border: '1px solid rgba(27,107,95,0.18)',
          borderRadius: 12, padding: '10px 14px',
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>🔒</span>
          <p style={{ fontSize: '0.74rem', color: '#4A6B62', margin: 0, lineHeight: 1.55 }}>
            <strong>Your photos are private.</strong> Images are processed securely and are not
            stored on our servers beyond your session. We never use your photos to train AI models,
            and we don't know who you are unless you tell us.
          </p>
        </div>

        {error && (
          <p className="text-sm text-center rounded-xl p-3"
            style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        {/* Good / Bad photo examples */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            📚 What makes a good photo?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="rounded-xl overflow-hidden mb-2 aspect-square flex items-center justify-center text-5xl"
                style={{ background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.3)' }}>
                🟢
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#4ade80' }}>✅ Good</p>
              <ul className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                <li>• Natural daylight</li>
                <li>• Subject fills the frame</li>
                <li>• Sharp &amp; in focus</li>
                <li>• No flash glare</li>
              </ul>
            </div>
            <div>
              <div className="rounded-xl overflow-hidden mb-2 aspect-square flex items-center justify-center text-5xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.3)' }}>
                🔴
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#f87171' }}>❌ Avoid</p>
              <ul className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                <li>• Dark or dimly lit</li>
                <li>• Blurry or shaky</li>
                <li>• Subject too small</li>
                <li>• Heavy flash glare</li>
              </ul>
            </div>
          </div>
        </div>

        {/* QLD-specific tip */}
        <div className="rounded-2xl p-4 flex gap-3"
          style={{ background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.25)' }}>
          <span className="text-xl flex-shrink-0">🌴</span>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--amber-bright)' }}>Mackay &amp; North QLD tip:</strong>{' '}
            During the wet season, indoor light can be too dim for clear photos. Step outside under a covered verandah
            or near a window — even 30 seconds of natural light makes a big difference to the report quality.
          </p>
        </div>

        {/* Feature chips */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '✨', label: 'Auto-enhanced', detail: 'Sharpened + colour corrected before analysis' },
            { icon: '🧠', label: 'Deep AI', detail: 'Claude Vision examines every pixel' },
            { icon: '📋', label: 'GP-ready report', detail: 'Findings formatted for your doctor' },
          ].map(({ icon, label, detail }) => (
            <div key={label} className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{detail}</p>
            </div>
          ))}
        </div>

        {/* Full disclaimer */}
        <p className="text-xs text-center leading-relaxed pb-4" style={{ color: 'var(--text-muted)' }}>
          ⚠️ Educational tool only. ParasitePro provides structured educational reports to help you prepare for GP visits.
          It does not provide medical diagnoses, prescribe treatments, or replace professional medical advice.
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards.
          In an emergency, call 000 immediately.
        </p>
      </div>
    </div>
  );

  // ── Onboarding form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Quality feedback banner */}
        {quality && (
          <div className="rounded-2xl p-4"
            style={{
              background: quality.status === 'good'
                ? 'rgba(34,197,94,0.07)' : quality.status === 'warn'
                ? 'rgba(234,179,8,0.07)' : 'rgba(239,68,68,0.07)',
              border: `1.5px solid ${quality.status === 'good' ? 'rgba(34,197,94,0.3)' : quality.status === 'warn' ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {quality.status === 'good' ? '✅' : quality.status === 'warn' ? '⚠️' : '🔴'}
              </span>
              <p className="text-sm font-semibold"
                style={{ color: quality.status === 'good' ? '#4ade80' : quality.status === 'warn' ? '#fbbf24' : '#f87171' }}>
                Photo quality: {quality.status === 'good' ? 'Good' : quality.status === 'warn' ? 'Fair — could be better' : 'Poor — retake recommended'}
              </p>
              <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                {quality.resolution.w > 0 ? `${quality.resolution.w}×${quality.resolution.h}px` : ''}
              </span>
            </div>
            <ul className="space-y-1">
              {quality.tips.map((tip, i) => (
                <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</li>
              ))}
            </ul>
            {quality.status !== 'good' && (
              <button
                onClick={() => { setStep('drop'); setQuality(null); }}
                className="mt-3 text-xs font-semibold underline"
                style={{ color: 'var(--amber-bright)', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Retake photo
              </button>
            )}
          </div>
        )}

        {/* PARA intro */}
        <div className="rounded-2xl p-5 mb-8 flex gap-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
          {/* Preview thumbnail */}
          {(enhancedPreviewUrl || previewUrl) && (
            <div className="flex-shrink-0 relative">
              <img src={enhancedPreviewUrl || previewUrl} alt="Preview"
                className="w-20 h-20 rounded-xl object-cover"
                style={{ border: '2px solid var(--amber)' }} />
              {enhancedPreviewUrl && (
                <span className="absolute -top-1 -right-1 text-xs px-1.5 rounded-full font-bold"
                  style={{ background: 'var(--amber)', color: '#000' }}>✨</span>
              )}
            </div>
          )}
          <div>
            <p className="font-display font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Before I take a look…
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A few quick questions will help me give you a much sharper report. Takes less than a minute — and it genuinely makes a difference.
            </p>
          </div>
        </div>

        <div className="space-y-8">

          {/* ── SECTION A: About the Sample ──────────────────────────────── */}
          <SectionHeader label="A" title="About the Sample" />

          {/* Q1 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Q1 — What type of sample is this? <span style={{ color: 'var(--amber)' }}>*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Q1_OPTIONS.map(opt => (
                <CardBtn key={opt.value}
                  active={form.q1_sampleType === opt.value}
                  onClick={() => setForm(f => ({ ...f, q1_sampleType: opt.value }))}>
                  {opt.label}
                </CardBtn>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Q2 — Where did you find or collect this?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Q2_OPTIONS.map(opt => (
                <CardBtn key={opt.value}
                  active={form.q2_location === opt.value}
                  onClick={() => setForm(f => ({ ...f, q2_location: opt.value }))}>
                  {opt.label}
                </CardBtn>
              ))}
            </div>
            {form.q2_location === 'other' && (
              <input
                type="text" placeholder="Please describe..."
                value={form.q2_locationOther} maxLength={100}
                onChange={e => setForm(f => ({ ...f, q2_locationOther: e.target.value }))}
                className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }} />
            )}
          </div>

          {/* Q3 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Q3 — How long have you been noticing this?
            </p>
            <div className="flex flex-wrap gap-2">
              {Q3_OPTIONS.map(opt => (
                <PillBtn key={opt} active={form.q3_duration === opt}
                  onClick={() => setForm(f => ({ ...f, q3_duration: opt }))}>
                  {opt}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* ── SECTION B: About the Person or Pet ───────────────────────── */}
          <SectionHeader label="B" title="About the Person or Pet" />

          {/* Q4 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Q4 — Who is this sample from?
            </p>
            <div className="flex flex-wrap gap-2">
              {Q4_OPTIONS.map(opt => (
                <PillBtn key={opt} active={form.q4_subject === opt}
                  onClick={() => setForm(f => ({ ...f, q4_subject: opt }))}>
                  {opt}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* Q5 */}
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Q5 — Any recent travel?
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {Q5_OPTIONS.map(opt => (
                <PillBtn key={opt} active={form.q5_travel.includes(opt)}
                  onClick={() => toggleMulti('q5_travel', opt)}>
                  {opt}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* Q6 */}
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Q6 — Current symptoms?
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Select all that apply</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {Q6_OPTIONS.map(opt => (
                <PillBtn key={opt} active={form.q6_symptoms.includes(opt)}
                  onClick={() => toggleMulti('q6_symptoms', opt)}>
                  {opt}
                </PillBtn>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <PillBtn active={!!form.q6_symptomsOther}
                onClick={() => { if (form.q6_symptomsOther) setForm(f => ({ ...f, q6_symptomsOther: '' })); }}>
                Other
              </PillBtn>
              <input type="text" placeholder="Describe other symptom..."
                value={form.q6_symptomsOther} maxLength={100}
                onChange={e => setForm(f => ({ ...f, q6_symptomsOther: e.target.value }))}
                className="flex-1 rounded-xl px-4 py-2 text-sm"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          {/* ── SECTION C: About the Image ───────────────────────────────── */}
          <SectionHeader label="C" title="About the Image" />

          {/* Q7 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Q7 — How was the photo taken?
            </p>
            <div className="flex flex-wrap gap-2">
              {Q7_OPTIONS.map(opt => (
                <PillBtn key={opt} active={form.q7_captureMethod === opt}
                  onClick={() => setForm(f => ({ ...f, q7_captureMethod: opt }))}>
                  {opt}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* Q8 */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Q8 — Roughly how big is the subject in real life?
            </p>
            <div className="flex flex-wrap gap-2">
              {Q8_OPTIONS.map(opt => (
                <PillBtn key={opt} active={form.q8_size === opt}
                  onClick={() => setForm(f => ({ ...f, q8_size: opt }))}>
                  {opt}
                </PillBtn>
              ))}
            </div>
          </div>

          {/* Q9 */}
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Q9 — Anything else PARA should know?{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              e.g. pet is on regular worming, found after travel to Cairns, recurs every full moon
            </p>
            <textarea rows={3} maxLength={200} placeholder="Optional — max 200 characters"
              value={form.q9_notes}
              onChange={e => setForm(f => ({ ...f, q9_notes: e.target.value }))}
              className="w-full rounded-xl p-3 text-sm resize-none"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }} />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
              {form.q9_notes.length}/200
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl p-4 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pb-12">
            <button onClick={() => { setStep('drop'); const blank: FormState = { q1_sampleType: '', q2_location: '', q2_locationOther: '', q3_duration: '', q4_subject: '', q5_travel: [], q6_symptoms: [], q6_symptomsOther: '', q7_captureMethod: '', q8_size: '', q9_notes: '' }; setForm(blank); clearForm(); }}
              className="px-5 py-4 rounded-2xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }}>
              ← Change photo
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.q1_sampleType}
              className="flex-1 py-4 rounded-2xl font-display font-bold text-lg transition-all flex items-center justify-center gap-2"
              style={{
                background: form.q1_sampleType ? 'var(--amber)' : 'var(--bg-elevated)',
                color: form.q1_sampleType ? '#000' : 'var(--text-muted)',
                cursor: form.q1_sampleType ? 'pointer' : 'not-allowed',
              }}>
              🔬 Start deep analysis
            </button>
          </div>

          <p className="text-xs text-center pb-8 -mt-6" style={{ color: 'var(--text-muted)' }}>
            ⚠️ Educational assessment only · Not a medical diagnosis · Always consult a GP for health concerns
          </p>
        </div>
      </div>
    </div>
  );
}
