// @ts-nocheck
/**
 * StripeBuyButton — embedded checkout for credit bundles.
 *
 * Each bundle's Stripe Buy Button is a single ID + the live publishable key.
 * The user's ID rides along as `client-reference-id` so the webhook can credit
 * the right account.
 *
 * Mobile (Capacitor) can't reliably render the web component, so we fall back
 * to a normal button that delegates to whatever the parent does on native
 * (typically opening a "visit the web app to purchase" prompt).
 *
 * Loads `js.stripe.com/v3/buy-button.js` once per page lifecycle.
 */
import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isNativePlatform } from '../utils/mobile';

const STRIPE_BUY_BUTTON_SRC = 'https://js.stripe.com/v3/buy-button.js';

// Live publishable key — matches the Stripe account where the Buy Buttons live.
// Distinct from the api.ts pk_live used for legacy Checkout Sessions.
const STRIPE_PUBLISHABLE_KEY =
  'pk_live_51TSrn2JVcqhzyDhek4ilj0NuzHn2v2ITBezd5ISjfiVeqt2FH4s0g6q17Ub1ASqV1mp8IDTAwdWv1pJAf7MTsWVo00b9Xz8yhi';

let scriptInjected = false;

function ensureStripeBuyButtonScript() {
  if (scriptInjected) return;
  if (typeof document === 'undefined') return;
  // Avoid double-inject if another component already did it
  if (document.querySelector(`script[src="${STRIPE_BUY_BUTTON_SRC}"]`)) {
    scriptInjected = true;
    return;
  }
  const s = document.createElement('script');
  s.src = STRIPE_BUY_BUTTON_SRC;
  s.async = true;
  document.head.appendChild(s);
  scriptInjected = true;
}

interface Props {
  buyButtonId: string;
  /**
   * Called when on a native platform where the web component can't render.
   * Typically opens a "purchase on the web" prompt.
   */
  onNativeClick?: () => void;
  /** Visible label used only on the native fallback button. */
  nativeLabel?: string;
  /** Style for the native fallback button only. */
  nativeStyle?: React.CSSProperties;
  /** Extra style for the wrapper around the Stripe button. */
  wrapperStyle?: React.CSSProperties;
}

const StripeBuyButton = ({
  buyButtonId,
  onNativeClick,
  nativeLabel = 'Buy on web',
  nativeStyle,
  wrapperStyle,
}: Props) => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Inject Stripe script once.
  useEffect(() => {
    ensureStripeBuyButtonScript();
  }, []);

  // Native — Stripe web component won't render reliably inside Capacitor's
  // WebView for in-app checkout. Show a parent-controlled fallback instead.
  if (isNativePlatform()) {
    return (
      <button
        type="button"
        onClick={onNativeClick}
        style={{
          width: '100%',
          padding: '12px',
          background: '#00BFA5',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 800,
          cursor: 'pointer',
          ...nativeStyle,
        }}
      >
        {nativeLabel}
      </button>
    );
  }

  if (!buyButtonId) {
    return null;
  }

  // Web — render the Stripe Buy Button as a custom element. We render via
  // dangerouslySetInnerHTML because React can't yet pass kebab-case attrs to
  // custom elements without warnings, and the Buy Button needs them.
  const userId = user?.id ? String(user.id) : '';
  const clientRefAttr = userId ? `client-reference-id="${userId}"` : '';
  const html = `<stripe-buy-button buy-button-id="${buyButtonId}" publishable-key="${STRIPE_PUBLISHABLE_KEY}" ${clientRefAttr}></stripe-buy-button>`;

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', justifyContent: 'center', width: '100%', ...wrapperStyle }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default StripeBuyButton;
