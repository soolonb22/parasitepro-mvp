// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, ChevronRight, Loader } from 'lucide-react';

interface OnboardingData {
  mainConcern: string;
  symptoms: string[];
  duration: string;
  treatmentsTried: string[];
  travelHistory: string;
  pets: string;
}

interface VoiceAssistantProps {
  mode: 'onboarding' | 'report';
  onOnboardingComplete?: (data: OnboardingData) => void;
  reportText?: string;
  onClose?: () => void;
  userName?: string;
}

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    speak: (name: string) =>
      `Hi${name ? ' ' + name : ''}, welcome to ParasitePro. I'm your AI health assistant. I specialise in helping you identify and understand parasites and skin conditions. Before you upload your image, I'd like to ask you a few quick questions to help me give you a more accurate analysis. You can speak your answers, or type them below. Let's start — what is your main concern today? For example, you might say "I found something in my stool", "I have an itchy rash", or "I'm worried about a skin condition".`,
    question: "What is your main concern today?",
    field: 'mainConcern',
    type: 'text',
  },
  {
    id: 'symptoms',
    speak: () =>
      `Thank you. Now, what symptoms are you experiencing? Common ones include itching, fatigue, stomach pain, visible worms, rashes, or unusual bowel changes. You can list as many as you like.`,
    question: "What symptoms are you experiencing?",
    field: 'symptoms',
    type: 'list',
  },
  {
    id: 'duration',
    speak: () =>
      `How long have you had these symptoms? For example, a few days, two weeks, or several months.`,
    question: "How long have you had these symptoms?",
    field: 'duration',
    type: 'text',
  },
  {
    id: 'treatments',
    speak: () =>
      `Have you tried any treatments so far? This could include antiparasitic medications, natural remedies, creams, or dietary changes. Say "none" if you haven't tried anything yet.`,
    question: "Have you tried any treatments already?",
    field: 'treatmentsTried',
    type: 'list',
  },
  {
    id: 'travel',
    speak: () =>
      `Have you travelled recently, particularly to tropical regions, developing countries, or rural Queensland? Or have you had contact with animals, soil, or fresh water?`,
    question: "Any recent travel or animal/water contact?",
    field: 'travelHistory',
    type: 'text',
  },
  {
    id: 'complete',
    speak: (_, data: OnboardingData) =>
      `Perfect, thank you. I now have a much better picture of your situation. I'll use this context to make your analysis more accurate and personalised. You can now upload your image and I'll get to work. Good luck — we'll find out what's going on together.`,
    question: null,
    field: null,
    type: 'complete',
  },
];

// Web Speech API wrapper
const speak = (text: string, onEnd?: () => void): SpeechSynthesisUtterance | null => {
  if (!('speechSynthesis' in window)) return null;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.92;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  // Prefer an Australian/British voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes('Karen') || v.name.includes('Samantha') ||
    v.name.includes('Daniel') || v.name.includes('Google UK') ||
    v.lang === 'en-AU' || v.lang === 'en-GB'
  ) || voices.find(v => v.lang.startsWith('en'));
  if (preferred) utter.voice = preferred;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
  return utter;
};

const stopSpeaking = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

export default function VoiceAssistant({ mode, onOnboardingComplete, reportText, onClose, userName }: VoiceAssistantProps) {
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState<OnboardingData>({
    mainConcern: '', symptoms: [], duration: '', treatmentsTried: [], travelHistory: '', pets: ''
  });
  const [transcript, setTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReadingReport, setIsReadingReport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVoiceSupported('speechSynthesis' in window);
    setSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }, []);

  // Auto-speak on step change (onboarding mode)
  useEffect(() => {
    if (mode !== 'onboarding' || isMuted) return;
    const s = ONBOARDING_STEPS[step];
    if (!s) return;
    setIsSpeaking(true);
    speak(s.speak(userName || '', data), () => {
      setIsSpeaking(false);
      if (s.type !== 'complete') setTimeout(() => startListening(), 300);
    });
    return () => stopSpeaking();
  }, [step, mode]);

  // Report read-out mode
  useEffect(() => {
    if (mode !== 'report' || !reportText || isMuted) return;
    setIsReadingReport(true);
    speak(reportText, () => setIsReadingReport(false));
    return () => stopSpeaking();
  }, [mode, reportText]);

  const startListening = () => {
    if (!speechSupported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
      setInputText(t);
    };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onerror = () => { setIsListening(false); };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
  };

  const handleSubmitAnswer = () => {
    const s = ONBOARDING_STEPS[step];
    if (!s || !s.field) return;
    const val = inputText.trim();
    if (!val) return;
    setData(prev => ({
      ...prev,
      [s.field]: s.type === 'list'
        ? val.split(/[,;]+/).map(x => x.trim()).filter(Boolean)
        : val,
    }));
    setInputText('');
    setTranscript('');
    stopListening();
    stopSpeaking();
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(s => s + 1);
    }
  };

  const handleComplete = () => {
    onOnboardingComplete?.(data);
    onClose?.();
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      // Re-speak current step
      const s = ONBOARDING_STEPS[step];
      if (s) { setIsSpeaking(true); speak(s.speak(userName || '', data), () => setIsSpeaking(false)); }
    } else {
      setIsMuted(true);
      stopSpeaking();
      setIsSpeaking(false);
    }
  };

  const toggleReportReading = () => {
    if (isReadingReport) {
      stopSpeaking();
      setIsReadingReport(false);
    } else {
      setIsReadingReport(true);
      speak(reportText || '', () => setIsReadingReport(false));
    }
  };

  const currentStep = ONBOARDING_STEPS[step];
  const progress = ((step) / (ONBOARDING_STEPS.length - 1)) * 100;

  // ── Report Read Mode ────────────────────────────────────────────────────────
  if (mode === 'report') {
    return (
      <div className="flex items-center gap-3 pp-card px-4 py-3" style={{ border: '1px solid rgba(217,119,6,0.3)' }}>
        <button
          onClick={toggleReportReading}
          className="flex items-center gap-2 pp-btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          {isReadingReport ? (
            <><VolumeX size={14} /> Stop Reading</>
          ) : (
            <><Volume2 size={14} /> Read Report Aloud</>
          )}
        </button>
        {isReadingReport && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-1 rounded-full animate-bounce"
                style={{ height: `${8 + i * 3}px`, background: 'var(--amber)', animationDelay: `${i * 0.1}s` }} />
            ))}
            <span className="text-xs font-mono ml-1" style={{ color: 'var(--text-muted)' }}>Reading…</span>
          </div>
        )}
      </div>
    );
  }

  // ── Onboarding Mode ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg pp-card overflow-hidden" style={{ border: '1px solid rgba(217,119,6,0.3)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid var(--bg-border)' }}>
          <div className="flex items-center gap-3">
            {/* Animated orb */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: isSpeaking ? 'rgba(217,119,6,0.3)' : 'transparent', animationDuration: '1.5s' }} />
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: isSpeaking ? 'linear-gradient(135deg, var(--amber-dim), var(--amber-bright))' : 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.4)', transition: 'all 0.3s' }}>
                <span style={{ fontSize: '18px' }}>🦠</span>
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>ParasitePro Assistant</p>
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {isSpeaking ? 'Speaking…' : isListening ? 'Listening…' : 'Ready'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="pp-btn-ghost" style={{ padding: '6px' }} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX size={16} style={{ color: 'var(--text-muted)' }} /> : <Volume2 size={16} style={{ color: 'var(--amber)' }} />}
            </button>
            <button onClick={onClose} className="pp-btn-ghost" style={{ padding: '6px' }}>
              <X size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="h-0.5" style={{ background: 'var(--bg-border)' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--amber-dim), var(--amber-bright))' }} />
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep?.type === 'complete' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <span style={{ fontSize: '28px' }}>✓</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>All set!</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                I've noted your symptoms and concerns. Your analysis will be personalised to your situation.
              </p>
              {/* Summary */}
              <div className="text-left pp-card p-4 mb-6 space-y-2">
                {data.mainConcern && <div className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Concern: </span><span style={{ color: 'var(--text-primary)' }}>{data.mainConcern}</span></div>}
                {data.symptoms?.length > 0 && <div className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Symptoms: </span><span style={{ color: 'var(--text-primary)' }}>{data.symptoms.join(', ')}</span></div>}
                {data.duration && <div className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Duration: </span><span style={{ color: 'var(--text-primary)' }}>{data.duration}</span></div>}
                {data.treatmentsTried?.length > 0 && <div className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Tried: </span><span style={{ color: 'var(--text-primary)' }}>{data.treatmentsTried.join(', ')}</span></div>}
                {data.travelHistory && <div className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Travel/Exposure: </span><span style={{ color: 'var(--text-primary)' }}>{data.travelHistory}</span></div>}
              </div>
              <button onClick={handleComplete} className="pp-btn-primary w-full flex items-center justify-center gap-2" style={{ padding: '12px' }}>
                Upload My Image <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(217,119,6,0.15)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.2)' }}>
                    {step + 1} of {ONBOARDING_STEPS.length - 1}
                  </span>
                  {isSpeaking && (
                    <div className="flex items-center gap-1">
                      {[0,1,2,3,4].map(i => (
                        <div key={i} className="w-0.5 rounded-full animate-bounce"
                          style={{ height: `${6 + Math.sin(i) * 4}px`, background: 'var(--amber)', animationDelay: `${i * 0.08}s` }} />
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-heading font-semibold" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                  {currentStep?.question}
                </p>
                {currentStep?.type === 'list' && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Separate multiple answers with commas</p>
                )}
              </div>

              {/* Input */}
              <div className="relative mb-4">
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitAnswer()}
                  placeholder={isListening ? 'Listening…' : 'Type or speak your answer…'}
                  className="pp-input w-full pr-12"
                  style={{ background: isListening ? 'rgba(217,119,6,0.05)' : undefined, border: isListening ? '1px solid rgba(217,119,6,0.4)' : undefined }}
                />
                {/* Voice input button */}
                {speechSupported && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    title={isListening ? 'Stop listening' : 'Speak answer'}
                  >
                    {isListening ? (
                      <MicOff size={16} style={{ color: '#EF4444' }} />
                    ) : (
                      <Mic size={16} style={{ color: 'var(--amber)' }} />
                    )}
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!inputText.trim()}
                  className="pp-btn-primary flex-1 flex items-center justify-center gap-2"
                  style={{ padding: '11px', opacity: inputText.trim() ? 1 : 0.4 }}
                >
                  Next <ChevronRight size={15} />
                </button>
                <button
                  onClick={() => { setInputText('none'); setTimeout(handleSubmitAnswer, 50); }}
                  className="pp-btn-ghost"
                  style={{ padding: '11px 16px', fontSize: '12px' }}
                >
                  Skip
                </button>
              </div>

              {/* Re-listen hint */}
              {!isSpeaking && !isMuted && voiceSupported && (
                <button
                  onClick={() => { setIsSpeaking(true); speak(currentStep.speak(userName || '', data), () => setIsSpeaking(false)); }}
                  className="mt-3 text-xs flex items-center gap-1.5 mx-auto"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Volume2 size={11} /> Replay question
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
