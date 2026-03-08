/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ParasitePro Design System — Microscopy Dark
        obsidian: '#0E0F11',
        slate: '#161820',
        charcoal: '#1E2028',
        glass: '#2D2F3A',
        // Amber / Gold accent family
        amber: {
          DEFAULT: '#D97706',
          bright: '#F59E0B',
          dim: '#92400E',
          glow: '#FCD34D',
        },
        // Text
        ivory: '#F5F0E8',
        ash: '#9CA3AF',
        smoke: '#6B7280',
        // Urgency states
        safe: '#10B981',
        caution: '#F59E0B',
        danger: '#EF4444',
        urgent: '#991B1B',
        // Legacy compat
        primary: {
          DEFAULT: '#D97706',
          dark: '#92400E',
          light: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        heading: ['DM Sans', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'amber-glow': 'radial-gradient(ellipse at center, rgba(217,119,6,0.15) 0%, transparent 70%)',
        'amber-edge': 'radial-gradient(ellipse at top right, rgba(217,119,6,0.08) 0%, transparent 60%)',
        'specimen-grid': 'linear-gradient(rgba(45,47,58,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(45,47,58,0.4) 1px, transparent 1px)',
      },
      boxShadow: {
        'amber': '0 0 20px rgba(217,119,6,0.3)',
        'amber-sm': '0 0 8px rgba(217,119,6,0.2)',
        'glass': '0 1px 0 rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'scan': 'scan 2s ease-in-out infinite',
        'pulse-amber': 'pulse-amber 2s ease-in-out infinite',
        'reticle': 'reticle 1.5s ease-in-out infinite',
        'count-up': 'count-up 0.8s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'pulse-amber': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217,119,6,0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(217,119,6,0.15)' },
        },
        reticle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'slide-up': {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
