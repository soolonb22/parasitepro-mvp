// @ts-nocheck
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const UrgencyTimer = ({ label = 'Offer ends in', initialMinutes = 15 }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  if (seconds === 0) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '8px',
      padding: '6px 14px',
      fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
      fontSize: 13,
      color: '#ef4444',
    }}>
      <Clock size={14} />
      {label}: {mins}:{secs}
    </div>
  );
};

export default UrgencyTimer;
