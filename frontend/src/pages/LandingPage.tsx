// @ts-nocheck
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Microscope, Upload, Zap, Shield, ArrowRight, CheckCircle,
  MapPin, Clock, Star, ChevronDown, Eye
} from 'lucide-react';
import LiveStatsTicker from '../components/LiveStatsTicker';
import AustraliaRiskMap from '../components/AustraliaRiskMap';
import SymptomChecker from '../components/SymptomChecker';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const heroRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated]);

  // Intersection observer for section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const steps = [
    { n: '01', icon: <Upload size={20} />, title: 'Capture a sample', body: 'Photograph a stool sample, skin presentation, or any suspicious specimen. Works with standard smartphone cameras.' },
    { n: '02', icon: <Eye size={20} />, title: 'AI analysis in seconds', body: 'Our model — trained on clinical parasitology data — evaluates visual features against thousands of documented cases.' },
    { n: '03', icon: <Shield size={20} />, title: 'Structured clinical report', body: 'Receive a confidence-rated finding with differential diagnoses, urgency classification, and clear next steps.' },
  ];

  const parasites = [
    { name: 'Roundworm', sci: 'Ascaris lumbricoides', region: 'Tropical QLD' },
    { name: 'Hookworm', sci: 'Ancylostoma duodenale', region: 'North QLD' },
    { name: 'Pinworm', sci: 'Enterobius vermicularis', region: 'Australia-wide' },
    { name: 'Tapeworm', sci: 'Taenia saginata', region: 'Nationwide' },
    { name: 'Giardia', sci: 'Giardia intestinalis', region: 'Water sources' },
    { name: 'Scabies', sci: 'Sarcoptes scabiei', region: 'Tropical regions' },
    { name: 'Threadworm', sci: 'Strongyloides stercoralis', region: 'North QLD' },
    { name: 'Toxocara', sci: 'Toxocara canis', region: 'Australia-wide' },
  ];

  const stats = [
    { value: '90+', label: 'Parasite species in database' },
    { value: '<30s', label: 'Average analysis time' },
    { value: '9', label: 'Urgency levels assessed' },
    { value: '100%', label: 'Australian-built' },
  ];

  const faqs = [
    { q: 'Is this a medical diagnosis?', a: 'No. ParasitePro is a visual reference tool. Our AI provides evidence-based assessments to help you understand what you might be looking at. Always confirm findings with a qualified healthcare professional.' },
    { q: 'What kinds of images can I submit?', a: 'Stool samples, skin presentations, microscopy slides, and environmental specimens. The clearer the photo, the higher the confidence rating.' },
    { q: 'Is my data private?', a: 'Yes. Images are processed securely and never shared or used for third-party training. Your data is handled in accordance with Australian Privacy Principles.' },
    { q: 'Who is this built for?', a: "Concerned Australians, rural and remote residents, travellers returning from tropical regions, pet owners, and anyone who wants an expert second opinion before (or after) seeing a doctor." },
  ];

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      <style>{`
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.in-view { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }
        .reveal-d5 { transition-delay: 0.5s; }
        .reveal-d6 { transition-delay: 0.6s; }
        .reveal-d7 { transition-delay: 0.7s; }
        .reveal-d8 { transition-delay: 0.8s; }
        .scan-beam {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), rgba(245,158,11,0.9), rgba(217,119,6,0.6), transparent);
          animation: scan-hero 4s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(217,119,6,0.5), 0 0 60px rgba(217,119,6,0.2);
        }
        @keyframes scan-hero {
          0% { top: 0; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .reticle-corner {
          position: absolute; width: 18px; height: 18px;
          border-color: rgba(217,119,6,0.7); border-style: solid; border-width: 0;
        }
        .rc-tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; }
        .rc-tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; }
        .rc-bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; }
        .rc-br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; }
        .grid-overlay {
          background-image:
            linear-gradient(rgba(217,119,6,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217,119,6,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .glow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--amber); box-shadow: 0 0 12px rgba(217,119,6,0.8);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.6; } }
        .parasite-card:hover { border-color: rgba(217,119,6,0.4) !important; transform: translateY(-2px); }
        .parasite-card { transition: all 0.2s ease; }
        .faq-item summary { cursor: pointer; list-style: none; }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item[open] summary .faq-chevron { transform: rotate(180deg); }
        .faq-chevron { transition: transform 0.3s ease; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--amber); color: #000; font-weight: 700;
          padding: 14px 28px; border-radius: 10px; font-size: 15px;
          border: none; cursor: pointer; transition: all 0.2s ease;
          font-family: var(--font-ui); letter-spacing: 0.01em;
        }
        .cta-btn:hover { background: var(--amber-bright); transform: translateY(-1px); box-shadow: 0 8px 32px rgba(217,119,6,0.4); }
        .cta-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--text-primary); font-weight: 600;
          padding: 14px 28px; border-radius: 10px; font-size: 15px;
          border: 1px solid rgba(245,240,232,0.15); cursor: pointer; transition: all 0.2s ease;
          font-family: var(--font-ui);
        }
        .cta-btn-ghost:hover { border-color: rgba(245,240,232,0.4); background: rgba(245,240,232,0.05); }
        .section-label {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--amber); margin-bottom: 12px;
        }
        .amber-text { color: var(--amber); }
        .noise-overlay {
          position: absolute; inset: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: 'blur(12px)', background: 'rgba(14,15,17,0.85)', borderBottom: '1px solid var(--bg-border)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
              <Microscope size={16} style={{ color: 'var(--amber)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>ParasitePro</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginLeft: 4, letterSpacing: '0.1em' }}>notworms.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/login')} className="cta-btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }}>Sign in</button>
            <button onClick={() => navigate('/signup')} className="cta-btn" style={{ padding: '8px 18px', fontSize: 14 }}>Get started free</button>
          </div>
        </div>
      </nav>

      {/* HERO — full-bleed ad image with content overlay */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>

        {/* Full-bleed background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero-ad.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Dark gradient overlay — left-heavy for readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(10,11,13,0.93) 0%, rgba(10,11,13,0.80) 45%, rgba(10,11,13,0.25) 75%, rgba(10,11,13,0.10) 100%)',
        }} />

        {/* Animated scan line over full hero */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="scan-beam" style={{ top: 0 }} />
        </div>

        {/* Grid overlay */}
        <div className="grid-overlay noise-overlay" style={{ position: 'absolute', inset: 0 }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(80px, 12vw, 120px) clamp(24px, 6vw, 80px)',
          maxWidth: 700,
          minHeight: '100vh',
        }}>

          {/* Source tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>NOTWORMS.COM</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>//</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI ANALYSIS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.7)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#EF4444', letterSpacing: '0.12em' }}>LIVE</span>
            </div>
          </div>

          {/* Main headline — matches the ad creative */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(42px, 8vw, 80px)', lineHeight: 1.0,
            letterSpacing: '-0.04em', margin: '0 0 8px',
            color: 'var(--text-primary)',
          }}>
            FOUND SOMETHING
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(42px, 8vw, 80px)', lineHeight: 1.0,
            letterSpacing: '-0.04em', margin: '0 0 24px',
            color: 'var(--amber)',
          }}>
            IN YOUR STOOL?
          </h1>

          {/* Sub-headline */}
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.65, marginBottom: 32, fontWeight: 500 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Clinical AI analysis in 60 seconds.</strong> Upload a photo. Get a structured, confidence-rated parasite assessment — no lab visit required.
          </p>

          {/* Tick list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
            {[
              'Parasite & worm identification',
              'Urgency level assessment',
              'Recommended next steps',
              'Built for Australians',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <button onClick={() => navigate('/signup')} className="cta-btn" style={{ fontSize: 15, padding: '14px 28px', letterSpacing: '0.02em' }}>
              ANALYSE FREE <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} className="cta-btn-ghost" style={{ fontSize: 14 }}>
              Sign in
            </button>
          </div>

          {/* Disclaimer & trust */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {['No credit card required', 'Australian-built', 'Privacy-first'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <CheckCircle size={11} style={{ color: '#10B981' }} /> {t}
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              notworms.com | AI-assisted reference only. Not medical diagnosis.
            </p>
            {/* Beta pricing urgency — genuine, ACL-compliant */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, padding: '8px 12px', borderRadius: 7, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.18)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>BETA PRICING</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>—</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Prices increase at full launch. Lock in your credits now.</span>
            </div>
          </div>
        </div>

        {/* Right-side reticle decoration (desktop only) */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.25, pointerEvents: 'none' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', border: '1px solid var(--amber)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', border: '1px dashed rgba(217,119,6,0.6)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'rgba(217,119,6,0.5)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: 1, left: '50%', background: 'rgba(217,119,6,0.5)' }} />
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', opacity: 0.35 }}>
          <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }`}</style>
          <div style={{ animation: 'bounce 2s infinite' }}><ChevronDown size={20} style={{ color: 'var(--text-muted)' }} /></div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ borderTop: '1px solid var(--bg-border)', borderBottom: '1px solid var(--bg-border)', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {stats.map((s, i) => (
            <div key={i} className="reveal" style={{ textAlign: 'center', padding: '0 16px', borderRight: i < 3 ? '1px solid var(--bg-border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--amber)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '96px 24px 80px' }}>
        <div className="reveal" style={{ marginBottom: 52 }}>
          <div className="section-label">How it works</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1.15, maxWidth: 440 }}>
            From photo to clinical report in three steps
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} className={`reveal reveal-d${i + 1} pp-card`} style={{ padding: 28, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(217,119,6,0.4)', letterSpacing: '0.1em' }}>{s.n}</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--amber)' }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, marginBottom: 10, color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE DETECT */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--bg-border)', borderBottom: '1px solid var(--bg-border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
          <div className="reveal" style={{ marginBottom: 40 }}>
            <div className="section-label">Detection library</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.02em' }}>
              Identified in Australia & the tropics
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {parasites.map((p, i) => (
              <div key={i} className={`reveal reveal-d${(i % 4) + 1} parasite-card pp-card`} style={{ padding: '16px 18px', cursor: 'default' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 8 }}>{p.sci}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(217,119,6,0.8)', fontFamily: 'var(--font-mono)' }}>
                  <MapPin size={10} /> {p.region}
                </div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.05em' }}>
            + 80 more species · fungi · environmental specimens
          </div>
        </div>
      </section>

      {/* URGENCY SYSTEM */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="reveal section-label">Clinical grading</div>
            <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 3.5vw, 38px)', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>
              Know exactly how urgent it is
            </h2>
            <p className="reveal reveal-d2" style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Every report includes an urgency classification. Not sure if it can wait or needs a same-day GP visit? We make the call clear.
            </p>
            <div className="reveal reveal-d3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { e: '🟢', label: 'LOW', desc: 'Monitor, no immediate action needed' },
                { e: '🟡', label: 'MODERATE', desc: 'Seek medical advice within 1–2 weeks' },
                { e: '🔴', label: 'HIGH', desc: 'See a doctor within 24–48 hours' },
                { e: '🚨', label: 'URGENT', desc: 'Seek emergency care immediately' },
              ].map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                  <span style={{ fontSize: 16 }}>{u.e}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: '0.08em', minWidth: 72 }}>{u.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal reveal-d2">
            {/* Sample report card */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', borderRadius: 12, padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Microscope size={13} style={{ color: 'var(--amber)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>SAMPLE REPORT</span>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Hookworm</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 16 }}>Ancylostoma braziliense</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>CONFIDENCE</div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '82%', borderRadius: 3, background: 'linear-gradient(90deg, var(--amber), var(--amber-bright))' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', marginTop: 4 }}>82% — High</div>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🔴</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#EF4444', letterSpacing: '0.08em' }}>HIGH URGENCY</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>See a doctor within 24–48 hours</div>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--bg-border)', display: 'flex', gap: 8 }}>
                {['Stool', 'QLD Tropics', 'Antiparasitic'].map(tag => (
                  <span key={tag} style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.15)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(217,119,6,0.7)', letterSpacing: '0.05em' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOOLS SECTION */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 60px' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <div className="section-label">Tools & Intelligence</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.02em', maxWidth: 500 }}>
            Know before you panic
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 480, lineHeight: 1.65 }}>
            Use our free tools to get a preliminary sense of what you might be dealing with — before you submit an image.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Symptom Checker */}
          <div className="reveal reveal-d1">
            <SymptomChecker />
          </div>
          {/* Risk Map */}
          <div className="reveal reveal-d2">
            <AustraliaRiskMap />
          </div>
        </div>

        {/* Live stats */}
        <div className="reveal reveal-d3" style={{ marginTop: 24 }}>
          <LiveStatsTicker />
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--bg-border)', borderBottom: '1px solid var(--bg-border)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
          <div className="reveal section-label" style={{ textAlign: 'center' }}>Common questions</div>
          <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 40 }}>Straight answers</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {faqs.map((f, i) => (
              <details key={i} className={`faq-item reveal reveal-d${i + 1}`} style={{ border: '1px solid var(--bg-border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                <summary style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                  {f.q}
                  <ChevronDown size={16} className="faq-chevron" style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: 12 }} />
                </summary>
                <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, borderTop: '1px solid var(--bg-border)' }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <div className="reveal" style={{ textAlign: 'center', padding: '64px 40px', borderRadius: 16, background: 'var(--bg-elevated)', border: '1px solid rgba(217,119,6,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(217,119,6,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-label" style={{ marginBottom: 12 }}>Start free · No card required</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
            The longer you wait,<br /><span className="amber-text">the longer you wonder.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 12px', lineHeight: 1.65 }}>
            Use code <strong style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>BETA3FREE</strong> at signup and get 3 analyses on us. See exactly what ParasitePro can do before you spend a cent.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 28px', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
            We&apos;re in beta — prices will rise at full launch. Your credits never expire.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/signup')} className="cta-btn" style={{ fontSize: 16, padding: '16px 32px' }}>
              Claim free credits <ArrowRight size={17} />
            </button>
            <button onClick={() => navigate('/login')} className="cta-btn-ghost" style={{ fontSize: 16, padding: '16px 32px' }}>
              Sign in
            </button>
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Clock size={12} /> Analysis in under 30 seconds
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--bg-border)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)' }}>
              <Microscope size={14} style={{ color: 'var(--amber)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>ParasitePro</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Mackay, QLD · Australia</span>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Disclaimer', '/disclaimer'], ['FAQ', '/faq'], ['Contact', '/contact']].map(([label, href]) => (
              <button key={label} onClick={() => navigate(href)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0 }}
                onMouseOver={e => e.target.style.color = 'var(--text-secondary)'}
                onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</button>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            ⚠️ Not a medical diagnosis service
          </div>
        </div>
      </footer>
      {/* Stage 1 — PARA landing guide (unauthenticated visitors, once per session) */}
    </div>
    <LandingPARA />
  );
};

export default LandingPage;
