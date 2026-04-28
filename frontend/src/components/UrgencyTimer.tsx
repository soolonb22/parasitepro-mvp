// @ts-nocheck
// UrgencyTimer replaced with a static "Beta pricing" badge.
// The original version reset to initialMinutes on every page load — a fake-scarcity
// dark pattern that violates ACCC fair trading standards (s18 CCA 2010).
import { Tag } from 'lucide-react';

const UrgencyTimer = ({ label = 'Beta pricing', initialMinutes = 0 }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(13,148,136,0.1)',
      border: '1px solid rgba(13,148,136,0.3)',
      borderRadius: '8px',
      padding: '6px 14px',
      fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
      fontSize: 13,
      color: '#0d9488',
    }}>
      <Tag size={14} />
      {label} — prices may change after beta
    </div>
  );
};

export default UrgencyTimer;
