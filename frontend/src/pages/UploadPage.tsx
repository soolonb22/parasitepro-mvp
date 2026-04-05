// UploadPage.tsx — Deep Assessment with Canvas Preprocessing + Full Onboarding Form
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AnalysingScreen from '../components/AnalysingScreen';

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

// ─── FORM OPTIONS (exact spec) ─────────────────────────────────────────────────
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

const INIT: FormState = {
  q1_sampleType: '', q2_location: '', q2_locationOther: '',
  q3_duration: '', q4_subject: '', q5_travel: [],
  q6_symptoms: [], q6_symptomsOther: '', q7_captureMethod: '', q8_size: '', q9_notes: '',
};

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
  const [form, setForm] = useState<FormState>(INIT);
  const [error, setError] = useState('');

  // ── File handling ─────────────────────────────────────────────────────────
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
    } catch {
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
    <div className="min-h-screen py-16 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Upload your photo
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Drop your image below and I'll enhance it automatically, then guide you through a quick form before the analysis starts.
          </p>
          {user && (
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--amber-bright)' }}>
              {user.imageCredits} credit{user.imageCredits !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragging ? 'var(--amber)' : 'var(--bg-border)',
            background: isDragging ? 'rgba(217,119,6,0.05)' : 'var(--bg-surface)',
          }}>
          <div className="text-5xl mb-4">📷</div>
          <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Drop your photo here, or click to browse
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            JPG or PNG · up to 10MB · well-lit close-ups work best
          </p>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        {error && (
          <p className="mt-4 text-sm text-center rounded-xl p-3"
            style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        <div className="mt-8 grid grid-cols-3 gap-3">
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

        <p className="mt-8 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          ⚠️ Educational tool only · Not a medical diagnosis · Always consult a GP for health concerns
        </p>
      </div>
    </div>
  );

  // ── Onboarding form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-2xl mx-auto">

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
            <button onClick={() => { setStep('drop'); setForm(INIT); }}
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
