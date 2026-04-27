// src/components/Navbar.tsx
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const CreditPill = ({ credits }) => {
  const colour =
    credits === 0 ? '#ef4444' : credits <= 2 ? '#f59e0b' : '#0d9488';
  return (
    <Link
      to="/pricing"
      title="Buy more credits"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        padding: '0.28rem 0.65rem', borderRadius: '9999px',
        border: `1.5px solid ${colour}`, color: colour,
        fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      ⚡ {credits} {credits === 1 ? 'credit' : 'credits'}
    </Link>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const publicLinks = [
    { path: '/chat',          label: '💬 Chat with PARA' },
    { path: '/tips',          label: 'Free Tips' },
    { path: '/sample-report', label: 'See a Report' },
    { path: '/pricing',       label: 'Pricing' },
  ];

  const authLinks = [
    { path: '/chat',      label: '💬 Chat with PARA' },
    { path: '/upload',    label: 'Analyse' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tips',      label: 'Free Tips' },
    { path: '/pricing',   label: 'Pricing' },
  ];

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'white', borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem',
        height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '1rem',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.5rem', textDecoration:'none', flexShrink:0 }}>
          <div style={{
            width:36, height:36, borderRadius:10, background:'#0d9488',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'white', fontWeight:800, fontSize:'1.1rem',
          }}>P</div>
          <span style={{ fontWeight:700, fontSize:'1.05rem', color:'#1A365D', letterSpacing:'-0.01em' }}>
            notworms.com
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex" style={{ alignItems:'center', gap:'1.75rem', fontSize:'0.9rem', fontWeight:500 }}>
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} style={{
              textDecoration:'none',
              color: isActive(link.path) ? '#0d9488' : '#334155',
              fontWeight: isActive(link.path) ? 700 : 500,
              borderBottom: isActive(link.path) ? '2px solid #0d9488' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex" style={{ alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
          {isAuthenticated && user ? (
            <>
              <CreditPill credits={user.imageCredits ?? 0} />

              <Link to="/upload" style={{
                display:'inline-flex', alignItems:'center', gap:'0.4rem',
                padding:'0.45rem 1.1rem', borderRadius:9999,
                background:'#0d9488', color:'white', fontWeight:600,
                fontSize:'0.875rem', textDecoration:'none', whiteSpace:'nowrap',
              }}>
                📸 Analyse Photo
              </Link>

              {/* User dropdown */}
              <div ref={userMenuRef} style={{ position:'relative' }}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  style={{
                    width:36, height:36, borderRadius:'50%',
                    background:'#e0f2fe', border:'2px solid #0d9488',
                    color:'#0d9488', fontWeight:700, fontSize:'0.85rem',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}
                >
                  {user.firstName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
                </button>

                {userMenuOpen && (
                  <div style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0,
                    background:'white', border:'1px solid #e2e8f0', borderRadius:12,
                    boxShadow:'0 8px 24px rgba(0,0,0,0.12)', minWidth:200,
                    overflow:'hidden', zIndex:100,
                  }}>
                    <div style={{ padding:'0.75rem 1rem', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' }}>
                      <div style={{ fontWeight:600, fontSize:'0.875rem', color:'#1A365D' }}>
                        {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'My Account'}
                      </div>
                      <div style={{ fontSize:'0.75rem', color:'#64748b', marginTop:2 }}>{user.email}</div>
                    </div>
                    {[
                      { to:'/dashboard', icon:'📊', label:'Dashboard' },
                      { to:'/settings',  icon:'⚙️', label:'Settings' },
                      { to:'/pricing',   icon:'💳', label:'Buy Credits' },
                    ].map((item) => (
                      <Link key={item.to} to={item.to} style={{
                        display:'flex', alignItems:'center', gap:'0.6rem',
                        padding:'0.65rem 1rem', textDecoration:'none',
                        color:'#334155', fontSize:'0.875rem',
                      }}>
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop:'1px solid #f1f5f9' }}>
                      <button onClick={handleLogout} style={{
                        display:'flex', alignItems:'center', gap:'0.6rem',
                        width:'100%', padding:'0.65rem 1rem',
                        background:'none', border:'none', cursor:'pointer',
                        color:'#ef4444', fontSize:'0.875rem', textAlign:'left',
                      }}>
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding:'0.4rem 0.9rem', borderRadius:9999, color:'#1A365D',
                fontWeight:500, fontSize:'0.875rem', textDecoration:'none',
                border:'1.5px solid #cbd5e1',
              }}>
                Sign In
              </Link>
              <Link to="/signup?promo=BETA3FREE" style={{
                padding:'0.45rem 1.1rem', borderRadius:9999,
                background:'#0d9488', color:'white', fontWeight:600,
                fontSize:'0.875rem', textDecoration:'none', whiteSpace:'nowrap',
              }}>
                Get Started Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{
            background:'none', border:'none', cursor:'pointer',
            padding:'0.5rem', color:'#1A365D', fontSize:'1.4rem',
            display:'flex', alignItems:'center', flexShrink:0,
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background:'white', borderTop:'1px solid #e2e8f0', padding:'0.75rem 1.25rem 1.25rem' }}>

          {/* Logged-in strip */}
          {isAuthenticated && user && (
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'0.6rem 0.75rem', background:'#f0fdfa',
              borderRadius:10, marginBottom:'0.75rem',
            }}>
              <span style={{ fontSize:'0.85rem', color:'#0d9488', fontWeight:600 }}>
                👋 {user.firstName ?? user.email}
              </span>
              <CreditPill credits={user.imageCredits ?? 0} />
            </div>
          )}

          {/* Links */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.1rem' }}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{
                padding:'0.75rem', textDecoration:'none', fontSize:'1rem',
                fontWeight: isActive(link.path) ? 700 : 500,
                color: isActive(link.path) ? '#0d9488' : '#334155',
                borderRadius:8, background: isActive(link.path) ? '#f0fdfa' : 'transparent',
                borderBottom:'1px solid #f1f5f9', display:'block',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile auth buttons */}
          <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {isAuthenticated ? (
              <>
                <Link to="/upload" onClick={() => setMobileOpen(false)} style={{
                  display:'block', textAlign:'center', padding:'0.85rem',
                  borderRadius:12, background:'#0d9488', color:'white',
                  fontWeight:700, fontSize:'1rem', textDecoration:'none',
                }}>
                  📸 Analyse a Photo
                </Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)} style={{
                  display:'block', textAlign:'center', padding:'0.7rem',
                  borderRadius:12, border:'1.5px solid #e2e8f0',
                  color:'#334155', fontWeight:500, fontSize:'0.9rem', textDecoration:'none',
                }}>
                  ⚙️ Settings
                </Link>
                <button onClick={handleLogout} style={{
                  width:'100%', padding:'0.7rem', borderRadius:12,
                  border:'1.5px solid #fecaca', background:'none',
                  color:'#ef4444', fontWeight:500, fontSize:'0.9rem', cursor:'pointer',
                }}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signup?promo=BETA3FREE" onClick={() => setMobileOpen(false)} style={{
                  display:'block', textAlign:'center', padding:'0.85rem',
                  borderRadius:12, background:'#0d9488', color:'white',
                  fontWeight:700, fontSize:'1rem', textDecoration:'none',
                }}>
                  Get Started Free (3 credits) →
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{
                  display:'block', textAlign:'center', padding:'0.7rem',
                  borderRadius:12, border:'1.5px solid #e2e8f0',
                  color:'#334155', fontWeight:500, fontSize:'0.9rem', textDecoration:'none',
                }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
