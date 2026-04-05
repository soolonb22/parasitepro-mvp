// UploadPage.tsx — Deep Assessment with Canvas Preprocessing + Onboarding Form
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AnalysingScreen from '../components/AnalysingScreen';

const API_URL = (() => {
  const b = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return b.endsWith('/api') ? b : `${b}/api`;
})();

// ─── CANVAS PREPROCESSING ─────────────────────────────────────────────────────
async function preprocessImage(file: File): Promise<{ original: File; enhanced: File; previewUrl: string; enhancedPreviewUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        // Scale up if too small
        const minDim = 900;
        let w = img.width, h = img.height;
        if (Math.min(w, h) < minDim) {
          const scale = minDim / Math.min(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);

        // --- Enhancements ---
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // 1. Find histogram min/max for auto-contrast
        let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
        for (let i = 0; i < data.length; i += 4) {
          rMin = Math.min(rMin, data[i]);   rMax = Math.max(rMax, data[i]);
          gMin = Math.min(gMin, data[i+1]); gMax = Math.max(gMax, data[i+1]);
          bMin = Math.min(bMin, data[i+2]); bMax = Math.max(bMax, data[i+2]);
        }

        // 2. Apply auto-contrast + brightness lift + colour normalisation
        for (let i = 0; i < data.length; i += 4) {
          data[i]   = rMax > rMin ? Math.min(255, ((data[i]   - rMin) / (rMax - rMin)) * 245) : data[i];
          data[i+1] = gMax > gMin ? Math.min(255, ((data[i+1] - gMin) / (gMax - gMin)) * 245) : data[i+1];
          data[i+2] = bMax > bMin ? Math.min(255, ((data[i+2] - bMin) / (bMax - bMin)) * 245) : data[i+2];
        }

        ctx.putImageData(imageData, 0, 0);

        // 3. Sharpening via unsharp mask (convolution)
        const sharpened = ctx.getImageData(0, 0, w, h);
        const src = new Uint8ClampedArray(sharpened.data);
        const amount = 0.7;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            for (let c = 0; c < 3; c++) {
              const blur = (
                src[((y-1)*w+(x-1))*4+c] + src[((y-1)*w+x)*4+c] + src[((y-1)*w+(x+1))*4+c] +
                src[(y*w+(x-1))*4+c]     + src[idx+c]            + src[(y*w+(x+1))*4+c] +
                src[((y+1)*w+(x-1))*4+c] + src[((y+1)*w+x)*4+c] + src[((y+1)*w+(x+1))*4+c]
              ) / 9;
              sharpened.data[idx+c] = Math.min(255, Math.max(0, src[idx+c] + amount * (src[idx+c] - blur)));
            }
          }
        }
        ctx.putImageData(sharpened, 0, 0);

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

// ─── FORM QUESTIONS ───────────────────────────────────────────────────────────
const SAMPLE_TYPE_OPTIONS = [
  { value: 'stool', label: '🧪 Stool / bowel motion', desc: 'After going to the toilet' },
  { value: 'skin', label: '🩹 Skin, rash or lesion', desc: 'On my body' },
  { value: 'pet', label: '🐾 My pet (fur or environment)', desc: 'Dog, cat, or other animal' },
  { value: 'wound', label: '🩸 Wound or bite site', desc: 'Cut, scrape, or bite' },
  { value: 'blood', label: '🔬 Blood smear / microscopy', desc: 'Lab slide' },
  { value: 'environmental', label: '🏡 Found in my home or yard', desc: 'Environmental sample' },
  { value: 'auto', label: '❓ Not sure', desc: "Let PARA figure it out" },
];

const SUBJECT_OPTIONS = ['Me (adult)', 'My child (under 12)', 'My child (12–17)', 'My dog', 'My cat', 'Other pet'];

const TRAVEL_OPTIONS = [
  'Regional / rural Queensland', 'Northern Territory', 'Other Australian states',
  'Southeast Asia', 'Africa or South America', 'No recent travel',
];

const SYMPTOM_OPTIONS = [
  'Itching (skin or anal area)', 'Stomach cramps or bloating', 'Nausea or vomiting',
  'Unexplained fatigue', 'Visible worm or parasite', 'Weight loss',
  'No symptoms — just curious about what I saw',
];

const DURATION_OPTIONS = ['Just today', 'A few days', '1–2 weeks', 'More than 2 weeks', 'Recurring over months'];

const SIZE_OPTIONS = [
  'Smaller than a grain of rice', 'Rice to fingernail size',
  'Fingernail to 5cm', 'Larger than 5cm', "I don't know",
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
type Step = 'drop' | 'form' | 'enhancing' | 'analysing';

interface FormState {
  sampleType: string; subject: string; duration: string;
  travel: string[]; symptoms: string[]; estimatedSize: string;
  captureMethod: string; additionalNotes: string;
}

const INIT_FORM: FormState = {
  sampleType: '', subject: '', duration: '', travel: [], symptoms: [],
  estimatedSize: '', captureMethod: 'Smartphone camera', additionalNotes: '',
};

export default function UploadPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('drop');
  const [isDragging, setIsDragging] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [enhancedFile, setEnhancedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [enhancedPreviewUrl, setEnhancedPreviewUrl] = useState<string>('');
  const [form, setForm] = useState<FormState>(INIT_FORM);
  const [error, setError] = useState('');

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG or PNG).'); return; }
    setError('');
    setStep('enhancing');
    try {
      const result = await preprocessImage(file);
      setOriginalFile(result.original);
      setEnhancedFile(result.enhanced);
      setPreviewUrl(result.previewUrl);
      setEnhancedPreviewUrl(result.enhancedPreviewUrl);
      setStep('form');
    } catch {
      setOriginalFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep('form');
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Form helpers ────────────────────────────────────────────────────────────
  const toggleMulti = (key: 'travel' | 'symptoms', val: string) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!originalFile) return;
    setStep('analysing');
    setError('');

    const fd = new FormData();
    fd.append('image', originalFile);
    if (enhancedFile) fd.append('enhancedImage', enhancedFile);
    if (form.sampleType) fd.append('sampleType', form.sampleType);

    const userContext = {
      sampleType: SAMPLE_TYPE_OPTIONS.find(o => o.value === form.sampleType)?.label || form.sampleType,
      subject: form.subject,
      duration: form.duration,
      recentTravel: form.travel,
      symptoms: form.symptoms,
      estimatedSize: form.estimatedSize,
      captureMethod: form.captureMethod,
      additionalNotes: form.additionalNotes || undefined,
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
      navigate(`/analysis/${data.analysisId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('form');
    }
  };

  // ── Render: enhancing ───────────────────────────────────────────────────────
  if (step === 'enhancing') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--amber)', borderTopColor: 'transparent' }} />
          <p className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Enhancing your image…</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sharpening, adjusting contrast, normalising colour. Takes a second.</p>
        </div>
      </div>
    );
  }

  if (step === 'analysing') return <AnalysingScreen onComplete={() => {}} />;

  // ── Render: drop zone ───────────────────────────────────────────────────────
  if (step === 'drop') {
    return (
      <div className="min-h-screen py-16 px-4" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-2xl mx-auto">
          {/* PARA intro */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl px-5 py-3 mb-6"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
              <span className="text-2xl">🔬</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Got something that's got you puzzled? Good — that's exactly what I'm here for.
              </p>
            </div>
            <h1 className="font-display font-bold text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
              Upload your photo
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              I'll enhance it automatically, then ask you a few quick questions before I get to work.
            </p>
            {user && (
              <p className="mt-2 text-sm" style={{ color: 'var(--amber-bright)' }}>
                {user.imageCredits} credit{user.imageCredits !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer transition-all"
            style={{
              borderColor: isDragging ? 'var(--amber)' : 'var(--bg-border)',
              background: isDragging ? 'rgba(217,119,6,0.05)' : 'var(--bg-surface)',
            }}
          >
            <div className="text-5xl mb-4">📷</div>
            <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Drop your photo here, or click to browse
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              JPG or PNG · up to 10MB · well-lit and close-up gets the best result
            </p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          {error && (
            <div className="mt-4 rounded-xl p-4 text-sm text-center"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* What PARA does */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: '🖼️', title: 'Auto-enhances', desc: 'Sharpens and colour-corrects your image before analysis' },
              { icon: '🧠', title: 'Deep AI assessment', desc: 'Claude Vision examines every pixel for patterns' },
              { icon: '📋', title: 'GP-ready report', desc: 'Structured findings you can take to your doctor' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-4 text-center"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            ⚠️ Educational tool only · Not a medical diagnosis · Always consult a GP for health concerns
          </p>
        </div>
      </div>
    );
  }

  // ── Render: onboarding form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-16 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            {previewUrl && (
              <div className="relative">
                <img src={enhancedPreviewUrl || previewUrl} alt="Preview"
                  className="w-20 h-20 rounded-xl object-cover"
                  style={{ border: '2px solid var(--amber)', boxShadow: '0 0 12px rgba(217,119,6,0.3)' }} />
                <div className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{ background: 'var(--amber)', color: '#000' }}>
                  ✨
                </div>
              </div>
            )}
            <div>
              <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                Almost ready!
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                A few quick questions will sharpen my analysis. Takes less than a minute — and it genuinely makes a difference.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">

          {/* Q1: Sample type */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              What type of sample is this? <span style={{ color: 'var(--amber)' }}>*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_TYPE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setForm(f => ({ ...f, sampleType: opt.value }))}
                  className="text-left rounded-xl p-3 text-sm transition-all"
                  style={{
                    background: form.sampleType === opt.value ? 'rgba(217,119,6,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.sampleType === opt.value ? 'var(--amber)' : 'var(--bg-border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  <span className="font-medium">{opt.label}</span>
                  <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Subject */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Who is this sample from?</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setForm(f => ({ ...f, subject: opt }))}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: form.subject === opt ? 'rgba(217,119,6,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.subject === opt ? 'var(--amber)' : 'var(--bg-border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q3: Duration */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>How long have you been noticing this?</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setForm(f => ({ ...f, duration: opt }))}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: form.duration === opt ? 'rgba(217,119,6,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.duration === opt ? 'var(--amber)' : 'var(--bg-border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q4: Travel */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Any recent travel?</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Select all that apply — this affects which parasites I weight higher</p>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleMulti('travel', opt)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: form.travel.includes(opt) ? 'rgba(217,119,6,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.travel.includes(opt) ? 'var(--amber)' : 'var(--bg-border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  {form.travel.includes(opt) ? '✓ ' : ''}{opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q5: Symptoms */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Current symptoms?</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Select all that apply — or just pick "no symptoms" if you're just curious</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleMulti('symptoms', opt)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: form.symptoms.includes(opt) ? 'rgba(217,119,6,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.symptoms.includes(opt) ? 'var(--amber)' : 'var(--bg-border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  {form.symptoms.includes(opt) ? '✓ ' : ''}{opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q6: Size + Notes */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Roughly how big is the subject in real life?</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {SIZE_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setForm(f => ({ ...f, estimatedSize: opt }))}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: form.estimatedSize === opt ? 'rgba(217,119,6,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.estimatedSize === opt ? 'var(--amber)' : 'var(--bg-border)'}`,
                    color: 'var(--text-primary)',
                  }}>
                  {opt}
                </button>
              ))}
            </div>
            <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Anything else I should know? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </p>
            <textarea
              rows={3} maxLength={200} placeholder="e.g. Found after travel to Cairns, dog is on regular worming treatment..."
              value={form.additionalNotes}
              onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))}
              className="w-full rounded-xl p-3 text-sm resize-none"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{form.additionalNotes.length}/200</p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl p-4 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button onClick={() => setStep('drop')}
              className="px-6 py-4 rounded-2xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }}>
              ← Change photo
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.sampleType}
              className="flex-1 py-4 rounded-2xl font-display font-bold text-lg transition-all flex items-center justify-center gap-3"
              style={{
                background: form.sampleType ? 'var(--amber)' : 'var(--bg-elevated)',
                color: form.sampleType ? '#000' : 'var(--text-muted)',
                cursor: form.sampleType ? 'pointer' : 'not-allowed',
              }}>
              🔬 Start deep analysis
            </button>
          </div>

          <p className="text-xs text-center pb-8" style={{ color: 'var(--text-muted)' }}>
            ⚠️ Educational assessment only · Not a medical diagnosis · Always consult a GP for health concerns
          </p>
        </div>
      </div>
    </div>
  );
}
