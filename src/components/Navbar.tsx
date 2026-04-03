// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParaGuide from './ParaGuide';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Analyse' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/resources', label: 'Resources' },
    { path: '/privacy', label: 'Privacy' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">P</div>
          <span className="text-2xl font-semibold text-navy tracking-tight">notworms</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-teal ${isActive(link.path) ? 'text-teal-600 font-semibold' : 'text-slate-700'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6">
          <ParaGuide variant="inline" />
          <Link
            to="/upload"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-3xl flex items-center gap-2 transition-all active:scale-95"
          >
            <i className="fas fa-camera"></i>
            Analyse Photo
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-3xl text-navy p-2"
          aria-label="Toggle menu"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-20 px-6 overflow-y-auto">
          <div className="flex flex-col gap-6 text-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-4 border-b ${isActive(link.path) ? 'text-teal-600 font-semibold' : 'text-slate-700'}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-8">
              <ParaGuide variant="inline" />
            </div>

            <Link
              to="/upload"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 block bg-teal-600 text-white text-center py-5 rounded-3xl text-xl font-medium"
            >
              Analyse Photo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
