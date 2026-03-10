// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import { Activity, Microscope, Globe, Users } from 'lucide-react';

const BASE_STATS = [
  { label: 'Analyses run today', value: 847, increment: [1, 3], icon: <Microscope size={13} />, suffix: '' },
  { label: 'Species identified', value: 94, increment: [0, 0], icon: <Globe size={13} />, suffix: '' },
  { label: 'Active Australians', value: 12430, increment: [2, 8], icon: <Users size={13} />, suffix: '' },
  { label: 'Avg analysis time', value: 28, increment: [0, 0], icon: <Activity size={13} />, suffix: 's' },
];

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = 0;
    const steps = 40;
    const step = (target - start) / steps;
    let cur = start;
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(iv); return; }
      setVal(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(iv);
  }, [target]);
  return val;
}

function StatItem({ stat, index }: { stat: typeof BASE_STATS[0]; index: number }) {
  const [live, setLive] = useState(stat.value);
  const displayed = useCountUp(live, 1000 + index * 200);

  useEffect(() => {
    if (stat.increment[1] === 0) return;
    const iv = setInterval(() => {
      const delta = stat.increment[0] + Math.floor(Math.random() * (stat.increment[1] - stat.increment[0] + 1));
      setLive(v => v + delta);
    }, 4000 + index * 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRight: index < BASE_STATS.length - 1 ? '1px solid var(--bg-border)' : 'none', flex: 1 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
        {stat.icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, lineHeight: 1, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {displayed.toLocaleString()}{stat.suffix}
        </div>
        <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {stat.label}
        </div>
      </div>
    </div>
  );
}

export default function LiveStatsTicker() {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: 'rgba(217,119,6,0.06)', borderBottom: '1px solid var(--bg-border)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)', animation: 'pulse-dot 2s infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live Platform Stats</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {BASE_STATS.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
      </div>
    </div>
  );
}
