// @ts-nocheck
import { ShieldCheck } from 'lucide-react';

const MoneyBackGuarantee = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    background: 'rgba(16,185,129,0.06)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '10px',
    marginTop: '1.5rem',
  }}>
    <ShieldCheck size={32} style={{ color: '#10B981', flexShrink: 0 }} />
    <div>
      <div style={{ fontWeight: 700, color: '#10B981', fontSize: 15, marginBottom: 2 }}>
        30-Day Money-Back Guarantee
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)' }}>
        Not happy? Contact us within 30 days for a full refund — no questions asked.
      </div>
    </div>
  </div>
);

export default MoneyBackGuarantee;
