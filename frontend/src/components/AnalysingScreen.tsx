// @ts-nocheck
import { useState, useEffect } from 'react';

const STEPS = [
  "Scanning image quality — brightness, focus, contrast…",
  "Auto-correcting your photo for best analysis accuracy…",
  "Applying local contrast enhancement to reveal hidden detail…",
  "Detecting specimen area and generating precision zoom…",
  "Sending enhanced image set to the analysis engine…",
  "Examining morphological features across all versions…",
  "Cross-referencing visual patterns against organism signatures…",
  "Checking Queensland geographic context and risk factors…",
  "Compiling your GP-ready educational report — almost done!",
];

const AnalysingScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 18 + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 600);
          return 100;
        }
        return Math.min(next, 100);
      });
    }, 180);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * STEPS.length), STEPS.length - 1);
    setStepIndex(idx);
  }, [progress]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center max-w-md w-full animate-fade-in">

        {/* PARA avatar ring */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          <div className="absolute inset-0 rounded-full animate-pulse-amber"
            style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)' }} />
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden"
            style={{ background: 'var(--bg-elevated)' }}>
            <img src="/para-avatar.png" alt="PARA" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
          <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="52" fill="none" stroke="rgba(217,119,6,0.4)"
              strokeWidth="2" strokeDasharray="80 246" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          I'm on it!
        </h2>

        <p className="text-sm font-medium mb-1" style={{ color: 'var(--amber-bright)' }}>
          {STEPS[stepIndex]}
        </p>

        <p className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
          This usually takes 20–30 seconds. Worth it, I promise.
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-elevated)' }}>
          <div className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--amber), var(--amber-bright))' }} />
        </div>

        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {Math.round(progress)}%
        </p>

        <p className="text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
          ⚠️ Educational assessment only — not a medical diagnosis
        </p>
      </div>
    </div>
  );
};

export default AnalysingScreen;
