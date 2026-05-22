// @ts-nocheck
// src/components/PWAInstallBanner.tsx
//
// Smart PWA install prompt for ParasitePro.
//   - Android Chrome: catches the beforeinstallprompt event, shows a custom CTA
//   - iOS Safari: shows an instruction modal (iOS doesn't expose a programmatic install API)
//   - Detects already-installed state and skips rendering
//   - Shows after 2 visits, snoozes dismissal for 7 days
//   - Tracks install acceptance in localStorage so we don't re-prompt
//
import { useEffect, useState } from 'react';
import { X, Share, Plus, Download, Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  VISIT_COUNT: 'pp_pwa_visit_count',
  DISMISSED_UNTIL: 'pp_pwa_dismissed_until',
  INSTALLED: 'pp_pwa_installed',
};

const VISITS_BEFORE_PROMPT = 2;
const SNOOZE_DAYS = 7;

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const isMatchMedia = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  const isInstalledFlag = localStorage.getItem(STORAGE_KEYS.INSTALLED) === '1';
  return Boolean(isMatchMedia || isIOSStandalone || isInstalledFlag);
}

function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIOS && isSafari;
}

function snoozeDismiss() {
  const until = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEYS.DISMISSED_UNTIL, String(until));
}

function isDismissed(): boolean {
  const raw = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL);
  if (!raw) return false;
  return Date.now() < Number(raw);
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    if (isStandalone()) return; // Already installed, never show

    // Bump visit count
    const visits = Number(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, String(visits));

    if (visits < VISITS_BEFORE_PROMPT || isDismissed()) return;

    // Android / Chromium: wait for the event
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent auto-prompt — we'll show our own UI
      setDeferredPrompt(e);
      setPlatform('android');
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS Safari: no event ever fires, but we can show instructions
    if (isIOSSafari()) {
      setPlatform('ios');
      // Tiny delay so it doesn't pop instantly on page load
      const t = setTimeout(() => setShow(true), 2500);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    // Listen for successful install (Android)
    const installedHandler = () => {
      localStorage.setItem(STORAGE_KEYS.INSTALLED, '1');
      setShow(false);
      // Optional: fire analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install_accepted', { method: 'banner' });
      }
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (platform === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install_prompted', { outcome });
      }
      if (outcome === 'accepted') {
        localStorage.setItem(STORAGE_KEYS.INSTALLED, '1');
      } else {
        snoozeDismiss();
      }
      setShow(false);
      setDeferredPrompt(null);
    } else if (platform === 'ios') {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    snoozeDismiss();
    setShow(false);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_install_dismissed', { method: 'banner' });
    }
  };

  if (!show && !showIOSModal) return null;

  return (
    <>
      {/* Bottom banner */}
      {show && (
        <div
          className="fixed left-3 right-3 z-50 rounded-2xl shadow-2xl"
          style={{
            bottom: 'max(12px, env(safe-area-inset-bottom))',
            background: 'linear-gradient(135deg, #1B6B5F 0%, #145048 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
            animation: 'pp-slide-up 0.35s ease-out',
          }}
        >
          <div className="flex items-start gap-3 p-4">
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <Sparkles size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-snug">Install ParasitePro</p>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                One tap to add the app to your home screen — works offline, faster than the browser.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-transform active:scale-95"
                  style={{ background: 'white', color: '#1B6B5F' }}
                >
                  {platform === 'ios' ? (
                    <>
                      <Share size={12} /> How to install
                    </>
                  ) : (
                    <>
                      <Download size={12} /> Install now
                    </>
                  )}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
              className="flex-shrink-0 p-1 rounded-md -mt-1 -mr-1"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* iOS instructions modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl shadow-2xl max-w-md w-full"
            style={{
              background: '#FFFFFF',
              animation: 'pp-slide-up 0.35s ease-out',
            }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between rounded-t-2xl"
              style={{ background: '#1B6B5F', color: 'white' }}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} />
                <p className="font-bold text-sm">Add ParasitePro to your home screen</p>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                aria-label="Close"
                className="p-1 rounded-md"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs mb-4" style={{ color: '#6B7280' }}>
                iOS Safari doesn't auto-install — but it takes 3 taps. Here's how:
              </p>

              <ol className="space-y-3">
                {[
                  { num: 1, icon: <Share size={18} />, text: 'Tap the Share button at the bottom of Safari' },
                  { num: 2, icon: <Plus size={18} />, text: 'Scroll down and tap "Add to Home Screen"' },
                  { num: 3, icon: <Sparkles size={18} />, text: 'Tap "Add" — ParasitePro will appear like any app' },
                ].map((step) => (
                  <li key={step.num} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ background: '#D6EFE4', color: '#1B6B5F' }}
                    >
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2" style={{ color: '#1B6B5F' }}>
                        {step.icon}
                        <p className="text-sm leading-snug" style={{ color: '#111827' }}>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div
                className="mt-5 rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2"
                style={{ background: '#FEF3C7', color: '#92400E' }}
              >
                <span>💡</span>
                <span>If you don't see "Add to Home Screen", make sure you're using Safari (not Chrome or Firefox on iPhone).</span>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-4 w-full py-2.5 rounded-lg font-semibold text-sm"
                style={{ background: '#1B6B5F', color: 'white' }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes — scoped inline */}
      <style>{`
        @keyframes pp-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
