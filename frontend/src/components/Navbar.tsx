import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/resources', label: 'Free Tips' },
  { to: '/dashboard', label: 'Refer a Mate' },
  { to: '/pricing',   label: 'Subscription' },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const close = () => setOpen(false);

  return (
    <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ fontSize: 26 }}>🔬</span>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Parasite Pro</span>
            <p style={{ fontSize: 10, color: '#10B981', margin: '2px 0 0', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>by PARA</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: 28 }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to + label} to={to}
              style={{
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
                color: pathname === to ? 'var(--amber-bright)' : 'var(--text-secondary)',
                borderBottom: pathname === to ? '2px solid var(--amber)' : '2px solid transparent',
                paddingBottom: 2,
              }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex" style={{ gap: 10, alignItems: 'center' }}>
          <Link to="/pricing"
            style={{ background: '#10B981', color: '#fff', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            $6/mo Plan
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => { navigate('/dashboard'); close(); }}
              style={{ border: '1px solid var(--bg-border)', background: 'none', color: 'var(--text-secondary)', padding: '8px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Dashboard
            </button>
          ) : (
            <Link to="/login"
              style={{ border: '1px solid var(--bg-border)', color: 'var(--text-secondary)', padding: '8px 18px', borderRadius: 20, fontSize: 13, textDecoration: 'none' }}>
              Sign in
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 }}
          aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--bg-border)', padding: '20px 24px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to + label} to={to} onClick={close}
                style={{ fontSize: 15, fontWeight: 500, textDecoration: 'none', color: pathname === to ? 'var(--amber-bright)' : 'var(--text-primary)' }}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/pricing" onClick={close}
              style={{ background: '#10B981', color: '#fff', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
              $6/mo Plan
            </Link>
            {isAuthenticated ? (
              <button onClick={() => { navigate('/dashboard'); close(); }}
                style={{ border: '1px solid var(--bg-border)', background: 'none', color: 'var(--text-secondary)', padding: '12px', borderRadius: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Dashboard
              </button>
            ) : (
              <Link to="/login" onClick={close}
                style={{ border: '1px solid var(--bg-border)', color: 'var(--text-secondary)', padding: '12px', borderRadius: 12, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
