import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Microscope, Menu, X, LogOut, LayoutDashboard, Upload, Settings, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="pp-nav sticky top-0 z-50" style={{ borderBottom: '1px solid var(--bg-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
              <Microscope size={16} style={{ color: 'var(--amber)' }} />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              ParasitePro
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/upload" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Upload size={14} /> New Analysis
                </Link>
                <Link to="/scientific-library" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}>
                  <BookOpen size={14} /> Scientific Library
                </Link>
                <Link to="/settings" className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Settings size={14} /> Settings
                </Link>
                <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid var(--bg-border)' }}>
                  <span className="text-xs font-mono px-2 py-1 rounded"
                    style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--amber-bright)', border: '1px solid rgba(217,119,6,0.2)' }}>
                    {user?.imageCredits ?? 0} credits
                  </span>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/faq" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>FAQ</Link>
                <Link to="/pricing" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
                <Link to="/login" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Sign in</Link>
                <Link to="/signup" className="pp-btn-primary text-sm px-4 py-2">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--text-secondary)' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-2" style={{ borderTop: '1px solid var(--bg-border)' }}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/upload" className="block px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>New Analysis</Link>
                <Link to="/scientific-library" className="block px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>Scientific Library</Link>
                <Link to="/settings" className="block px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                  style={{ color: 'var(--text-muted)' }}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/faq" className="block px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>FAQ</Link>
                <Link to="/pricing" className="block px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>Pricing</Link>
                <Link to="/login" className="block px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="block px-3 py-2 text-sm font-medium" style={{ color: 'var(--amber)' }} onClick={() => setMenuOpen(false)}>Get started free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
