import { Link } from 'react-router-dom';

const links = [
  { label: 'Free Education Tips', to: '/resources' },
  { label: 'Refer a Mate', to: '/dashboard' },
  { label: 'Monthly Membership', to: '/pricing' },
  { label: 'Privacy & Photos', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--bg-border)', padding: '48px 24px 36px', marginTop: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 28px', marginBottom: 28 }}>
          {links.map(({ label, to }) => (
            <Link key={to + label} to={to}
              style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#10B981')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              {label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 620, margin: '0 auto 20px', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>⚠️ Educational tool only.</strong>{' '}
          ParasitePro provides structured educational reports to help you prepare for GP visits.
          It does not provide medical diagnoses, prescribe treatments, or replace professional medical advice.
          Complies with TGA Software as a Medical Device guidelines and AHPRA advertising standards.
          In an emergency, call 000 immediately.
        </p>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
          © {new Date().getFullYear()} Parasite Pro · Built in Australia · Made for QLD families, travellers & pet owners
        </p>
      </div>
    </footer>
  );
}
