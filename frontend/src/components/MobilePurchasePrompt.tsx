// @ts-nocheck
import { X, ExternalLink } from 'lucide-react';

const MobilePurchasePrompt = ({ type = 'bundle', onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 9999, padding: '0 0 env(safe-area-inset-bottom,0)',
  }}>
    <div style={{
      background: 'var(--bg-card, #1a1b1e)',
      borderRadius: '16px 16px 0 0',
      padding: '24px',
      width: '100%',
      maxWidth: 480,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <strong style={{ fontSize: 16, color: 'var(--text-primary, #fff)' }}>Complete Purchase</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #9ca3af)' }}>
          <X size={20} />
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary, #9ca3af)', fontSize: 14, marginBottom: 20 }}>
        You'll be taken to our secure checkout page to complete your purchase.
      </p>
      <button
        onClick={() => { window.location.href = '/pricing'; onClose(); }}
        style={{
          width: '100%', padding: '14px',
          background: 'var(--amber, #D97706)', color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        <ExternalLink size={16} /> Open Checkout
      </button>
    </div>
  </div>
);

export default MobilePurchasePrompt;
