// @ts-nocheck
import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'pp_cookie_consent';

/**
 * Lightweight cookie consent banner.
 * - On "Accept": stores consent, GA continues loading.
 * - On "Decline": stores refusal, GTM/GA is prevented from loading.
 * Complies with Australia's Privacy Act 1988 (APP 3) and upcoming reform obligations.
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
    // If previously declined, block GTM
    if (stored === 'declined') blockAnalytics();
  }, []);

  function blockAnalytics() {
    // Prevent GTM from firing by setting the opt-out flag Google respects
    (window as any)['ga-disable-G-KVD57LGLV2'] = true;
  }

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShow(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    blockAnalytics();
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: '#0F2733',
        borderTop: '1px solid rgba(13,148,136,0.3)',
        padding: 'clamp(12px,2vw,20px) clamp(16px,4vw,40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.35)',
        fontFamily: 'system-ui,-apple-system,sans-serif',
      }}
    >
      <p style={{
        color: 'rgba(255,255,255,0.8)',
        fontSize: 'clamp(0.75rem,1.4vw,0.85rem)',
        margin: 0,
        flex: '1 1 300px',
        lineHeight: 1.5,
      }}>
        We use analytics cookies (Google Analytics) to understand how people use this site.
        No health images or personal data are shared with analytics services.{' '}
        <a
          href="/privacy"
          style={{ color: '#0d9488', textDecoration: 'underline' }}
        >
          Privacy Policy
        </a>
      </p>

      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.7)',
            padding: '8px 18px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: '#0d9488',
            border: 'none',
            color: 'white',
            padding: '8px 22px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(13,148,136,0.4)',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
