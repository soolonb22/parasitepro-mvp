// @ts-nocheck
/**
 * ParaAuthChat.tsx
 * Interactive talking PARA guide for /login and /signup pages.
 * – Desktop: fills the left AuthShell panel (video + speech bubble + Q&A chips + free-form input)
 * – Mobile:  compact inline banner with tap-to-expand Q&A + free-form input
 *
 * Audio: AudioEngine (ElevenLabs MP3 → Web Speech fallback)
 * Video: cycles SIGNUP_1 → SIGNUP_2 Cloudinary clips
 */

import { useState, useEffect, useRef } from 'react';
import { AudioEngine } from './ParasiteBot';
import { getApiUrl } from '../api';

/* ── Cloudinary clips ─────────────────────────────────────────────────────── */
const CLIPS = [
  'https://res.cloudinary.com/duiehozez/video/upload/v1776379478/SIGNUP_1_revvlq.mp4',
  'https://res.cloudinary.com/duiehozez/video/upload/v1776379477/SIGNUP_2_msiiau.mp4',
];

/* ── Script ───────────────────────────────────────────────────────────────── */
const GREETING_SIGNUP =
  "G'day! I'm PARA — your AI guide for ParasitePro. I'm here to help you understand what you might be dealing with before you see your GP. Tap a question below, or just ask me anything!";

const GREETING_LOGIN =
  "Welcome back! I'm PARA — your ParasitePro AI guide. Great to see you again. Anything I can help you with today?";

type QA = { q: string; a: string };

const QA_LIST: QA[] = [
  {
    q: 'What is ParasitePro?',
    a: "ParasitePro is an AI-powered educational tool that analyses photos of samples — skin, stool, blood smears, you name it — and gives you a structured report in under 30 seconds. Built specifically for Australians who want to walk into their GP prepared.",
  },
  {
    q: 'Is it free?',
    a: "You get 3 free analyses when you sign up — just use code BETA3FREE at registration! After that, credit bundles start from $19.99. That's way more affordable than a GP visit, and it means you go in knowing what questions to ask.",
  },
  {
    q: 'How does it work?',
    a: "Dead simple. Upload a close-up photo of your sample, answer a few quick questions about your symptoms and location, and I cross-reference everything against known organisms. In under 30 seconds you get a full educational report — ready to share with your GP.",
  },
  {
    q: 'What can I upload?',
    a: "Skin rashes or lesions, stool samples, blood smears, microscopy slides, environmental samples — even pet samples! If you've found something that's got you puzzled, I can take a good look and give you my best educational assessment.",
  },
  {
    q: 'Is my data safe?',
    a: "Absolutely. Your images and data are encrypted and stored securely. We never sell your data, ever. Your privacy is non-negotiable — that's a promise from the team.",
  },
];

/* ── Keyframe CSS ─────────────────────────────────────────────────────────── */
const CSS = `
@keyframes pac-float  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
@keyframes pac-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes pac-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(13,148,136,0.4)} 50%{box-shadow:0 0 0 8px rgba(13,148,136,0)} }
@keyframes pac-blink  { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1.2)} }
`;

/* ── Typing dots ──────────────────────────────────────────────────────────── */
function Dots() {
  return (
    <span style={{ display:'inline-flex', gap:3, alignItems:'center', verticalAlign:'middle' }}>
      {[0,0.18,0.36].map((d,i) => (
        <span key={i} style={{ width:5, height:5, borderRadius:'50%', background:'#0d9488',
          display:'inline-block', animation:`pac-blink 1s ${d}s ease-in-out infinite` }} />
      ))}
    </span>
  );
}

/* ── API call ─────────────────────────────────────────────────────────────── */
async function askPara(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const res = await fetch(getApiUrl('/para-guide/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'PARA unavailable');
  }
  const { reply } = await res.json();
  return reply;
}

/* ── Send icon ────────────────────────────────────────────────────────────── */
function SendIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   DESKTOP — full left-panel component
══════════════════════════════════════════════════════════ */
export function ParaAuthPanel({ mode }: { mode: 'signup' | 'login' }) {
  const [vidIdx,        setVidIdx]        = useState(0);
  const [speaking,      setSpeaking]      = useState(false);
  const [thinking,      setThinking]      = useState(false);
  const [text,          setText]          = useState(mode === 'login' ? GREETING_LOGIN : GREETING_SIGNUP);
  const [activeQ,       setActiveQ]       = useState<string | null>(null);
  const [unlocked,      setUnlocked]      = useState(false);
  const [muted,         setMuted]         = useState(false);
  const [cssInjected,   setCssInjected]   = useState(false);
  const [input,         setInput]         = useState('');
  const [sending,       setSending]       = useState(false);
  const [history,       setHistory]       = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const sigRef  = useRef({ cancelled: false });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!cssInjected) {
      const s = document.createElement('style');
      s.textContent = CSS;
      document.head.appendChild(s);
      setCssInjected(true);
    }
    AudioEngine.init();
    return () => { AudioEngine.cancel(); sigRef.current.cancelled = true; };
  }, []);

  function speak(t: string, onDone?: () => void) {
    if (muted) { onDone?.(); return; }
    sigRef.current = { cancelled: false };
    setSpeaking(true);
    AudioEngine.speak(t, {
      rate: 0.92, pitch: 1.08,
      signal: sigRef.current,
      onDone: () => { setSpeaking(false); onDone?.(); },
    });
  }

  function unlock() {
    if (unlocked) return;
    setUnlocked(true);
    speak(mode === 'login' ? GREETING_LOGIN : GREETING_SIGNUP);
  }

  function handleQ(qa: QA) {
    if (!unlocked) setUnlocked(true);
    AudioEngine.cancel();
    sigRef.current.cancelled = true;
    setActiveQ(qa.q);
    setText('');
    setThinking(true);
    const newHistory = [...history, { role: 'user' as const, content: qa.q }];
    setTimeout(() => {
      setThinking(false);
      setText(qa.a);
      setHistory([...newHistory, { role: 'assistant' as const, content: qa.a }]);
      speak(qa.a, () => setActiveQ(null));
    }, 500);
  }

  async function handleFreeform() {
    const msg = input.trim();
    if (!msg || sending) return;
    if (!unlocked) setUnlocked(true);
    AudioEngine.cancel();
    sigRef.current.cancelled = true;
    setInput('');
    setActiveQ(msg);
    setText('');
    setThinking(true);
    setSending(true);
    const newHistory = [...history, { role: 'user' as const, content: msg }];
    try {
      const reply = await askPara(msg, history);
      setThinking(false);
      setText(reply);
      setHistory([...newHistory, { role: 'assistant' as const, content: reply }]);
      speak(reply, () => setActiveQ(null));
    } catch {
      setThinking(false);
      const fallback = "Sorry, I'm having a bit of trouble connecting right now. Try one of the quick questions below, or email us at support@notworms.com!";
      setText(fallback);
      setActiveQ(null);
    } finally {
      setSending(false);
    }
  }

  function toggleMute() {
    const nm = !muted;
    setMuted(nm);
    if (nm) { AudioEngine.cancel(); setSpeaking(false); }
  }

  return (
    <div
      onClick={unlock}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', height:'100%',
        padding:'8px 0 16px', gap:20, cursor: unlocked ? 'default' : 'pointer' }}
    >
      {/* ── Video ─────────────────────────────────────────── */}
      <div style={{
        width:190, height:228, borderRadius:20, overflow:'hidden', flexShrink:0,
        boxShadow: speaking
          ? '0 0 0 3px #0d9488, 0 0 24px rgba(13,148,136,0.5), 0 20px 48px rgba(0,0,0,0.5)'
          : '0 0 0 2px rgba(13,148,136,0.35), 0 20px 48px rgba(0,0,0,0.4)',
        background:'#0d1f1a',
        animation:'pac-float 4.5s ease-in-out infinite',
        transition:'box-shadow 0.4s',
      }}>
        <video
          key={vidIdx}
          src={CLIPS[vidIdx]}
          autoPlay muted playsInline
          onEnded={() => setVidIdx(i => (i + 1) % CLIPS.length)}
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }}
        />
      </div>

      {/* ── Speech bubble ─────────────────────────────────── */}
      <div style={{
        width:'100%', minHeight:90,
        background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.25)',
        borderRadius:16, padding:'14px 16px', position:'relative',
        animation:'pac-fadein 0.3s ease',
      }}>
        {/* caret */}
        <div style={{
          position:'absolute', top:-9, left:'50%', transform:'translateX(-50%)',
          width:0, height:0,
          borderLeft:'9px solid transparent', borderRight:'9px solid transparent',
          borderBottom:'9px solid rgba(13,148,136,0.25)',
        }} />

        {/* PARA label */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#0d9488', letterSpacing:'0.05em', textTransform:'uppercase' }}>
            PARA {speaking && '• speaking'}
          </span>
          <button
            onClick={e => { e.stopPropagation(); toggleMute(); }}
            style={{ background:'none', border:'none', cursor:'pointer', color: muted ? '#475569' : '#0d9488',
              fontSize:14, padding:2, lineHeight:1 }}
            title={muted ? 'Unmute PARA' : 'Mute PARA'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Text */}
        <p style={{ margin:0, fontSize:13, color:'var(--text-secondary)', lineHeight:1.6,
          animation:'pac-fadein 0.25s ease', minHeight:40 }}>
          {thinking ? <Dots /> : text}
        </p>

        {/* Tap hint — fades after unlock */}
        {!unlocked && (
          <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:6,
            animation:'pac-pulse 2s infinite' }}>
            <span style={{ fontSize:11, color:'#0d9488', fontWeight:600 }}>
              👆 Tap anywhere to hear me
            </span>
          </div>
        )}
      </div>

      {/* ── Q&A chips ─────────────────────────────────────── */}
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:7 }}>
        <p style={{ margin:'0 0 4px', fontSize:11, color:'var(--text-muted)', fontWeight:600,
          textTransform:'uppercase', letterSpacing:'0.06em' }}>
          Quick questions
        </p>
        {QA_LIST.map(qa => (
          <button
            key={qa.q}
            onClick={e => { e.stopPropagation(); handleQ(qa); }}
            style={{
              width:'100%', textAlign:'left', padding:'9px 13px',
              background: activeQ === qa.q
                ? 'rgba(13,148,136,0.18)'
                : 'rgba(13,148,136,0.06)',
              border: `1px solid ${activeQ === qa.q ? 'rgba(13,148,136,0.6)' : 'rgba(13,148,136,0.2)'}`,
              borderRadius:10, fontSize:12.5, color: activeQ === qa.q ? '#2dd4bf' : 'var(--text-secondary)',
              cursor:'pointer', transition:'all 0.15s', fontWeight: activeQ === qa.q ? 600 : 400,
            }}
            onMouseEnter={e => { if (activeQ !== qa.q) { e.currentTarget.style.background = 'rgba(13,148,136,0.12)'; e.currentTarget.style.color = '#5eead4'; }}}
            onMouseLeave={e => { if (activeQ !== qa.q) { e.currentTarget.style.background = 'rgba(13,148,136,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
          >
            {activeQ === qa.q ? '▶ ' : ''}{qa.q}
          </button>
        ))}
      </div>

      {/* ── Free-form input ───────────────────────────────── */}
      <div style={{ width:'100%' }}>
        <p style={{ margin:'0 0 6px', fontSize:11, color:'var(--text-muted)', fontWeight:600,
          textTransform:'uppercase', letterSpacing:'0.06em' }}>
          Or ask me anything
        </p>
        <div style={{ display:'flex', gap:6 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); handleFreeform(); } }}
            onClick={e => { e.stopPropagation(); if (!unlocked) unlock(); }}
            placeholder="e.g. Can I upload a pet sample?"
            disabled={sending || thinking}
            style={{
              flex:1, padding:'9px 12px',
              background:'rgba(13,148,136,0.06)',
              border:'1px solid rgba(13,148,136,0.25)',
              borderRadius:10, fontSize:12.5,
              color:'var(--text-primary)',
              outline:'none', transition:'border-color 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(13,148,136,0.6)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(13,148,136,0.25)'; }}
          />
          <button
            onClick={e => { e.stopPropagation(); handleFreeform(); }}
            disabled={!input.trim() || sending || thinking}
            style={{
              padding:'9px 13px', borderRadius:10, border:'none',
              background: input.trim() && !sending && !thinking
                ? 'linear-gradient(135deg,#0d9488,#0891b2)'
                : 'rgba(13,148,136,0.1)',
              color: input.trim() && !sending && !thinking ? 'white' : '#475569',
              cursor: input.trim() && !sending && !thinking ? 'pointer' : 'not-allowed',
              transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0,
            }}
          >
            {sending ? <Dots /> : <SendIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ParaAuthBanner({ mode, promoCode }: { mode: 'signup' | 'login'; promoCode?: string }) {
  const [vidIdx,    setVidIdx]    = useState(0);
  const [speaking,  setSpeaking]  = useState(false);
  const [thinking,  setThinking]  = useState(false);
  const [text,      setText]      = useState('');
  const [expanded,  setExpanded]  = useState(false);
  const [activeQ,   setActiveQ]   = useState<string | null>(null);
  const [unlocked,  setUnlocked]  = useState(false);
  const [muted,     setMuted]     = useState(false);
  const [input,     setInput]     = useState('');
  const [sending,   setSending]   = useState(false);
  const [history,   setHistory]   = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const sigRef = useRef({ cancelled: false });

  const greeting = mode === 'login' ? GREETING_LOGIN : (
    promoCode
      ? `Code ${promoCode} is ready — that's 3 free analyses on me! Let's get you set up.`
      : GREETING_SIGNUP
  );

  useEffect(() => {
    AudioEngine.init();
    return () => { AudioEngine.cancel(); sigRef.current.cancelled = true; };
  }, []);

  function speak(t: string, onDone?: () => void) {
    if (muted) { onDone?.(); return; }
    sigRef.current = { cancelled: false };
    setSpeaking(true);
    AudioEngine.speak(t, {
      rate: 0.92, pitch: 1.08,
      signal: sigRef.current,
      onDone: () => { setSpeaking(false); onDone?.(); },
    });
  }

  function handleTap() {
    if (!unlocked) {
      setUnlocked(true);
      setText(greeting);
      speak(greeting);
    }
    setExpanded(e => !e);
  }

  function handleQ(qa: QA) {
    AudioEngine.cancel();
    sigRef.current.cancelled = true;
    setActiveQ(qa.q);
    setText('');
    setThinking(true);
    const newHistory = [...history, { role: 'user' as const, content: qa.q }];
    setTimeout(() => {
      setThinking(false);
      setText(qa.a);
      setHistory([...newHistory, { role: 'assistant' as const, content: qa.a }]);
      speak(qa.a, () => setActiveQ(null));
    }, 450);
  }

  async function handleFreeform() {
    const msg = input.trim();
    if (!msg || sending) return;
    if (!unlocked) setUnlocked(true);
    AudioEngine.cancel();
    sigRef.current.cancelled = true;
    setInput('');
    setActiveQ(msg);
    setText('');
    setThinking(true);
    setSending(true);
    const newHistory = [...history, { role: 'user' as const, content: msg }];
    try {
      const reply = await askPara(msg, history);
      setThinking(false);
      setText(reply);
      setHistory([...newHistory, { role: 'assistant' as const, content: reply }]);
      speak(reply, () => setActiveQ(null));
    } catch {
      setThinking(false);
      setText("Having trouble connecting — try a quick question below or email support@notworms.com!");
      setActiveQ(null);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{
      background:'rgba(13,148,136,0.07)', border:'1px solid rgba(13,148,136,0.22)',
      borderRadius:14, overflow:'hidden',
    }}>
      {/* Top row */}
      <div
        onClick={handleTap}
        style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', cursor:'pointer' }}
      >
        <div style={{ width:52, height:62, borderRadius:10, overflow:'hidden', flexShrink:0,
          background:'#0d1f1a',
          boxShadow: speaking
            ? '0 0 0 2px #0d9488, 0 0 10px rgba(13,148,136,0.4)'
            : '0 0 0 1.5px rgba(13,148,136,0.4)',
          transition:'box-shadow 0.3s',
        }}>
          <video
            key={vidIdx}
            src={CLIPS[vidIdx]}
            autoPlay muted playsInline
            onEnded={() => setVidIdx(i => (i + 1) % CLIPS.length)}
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }}
          />
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontSize:13.5, fontWeight:700, color:'#2dd4bf', lineHeight:1.3 }}>
            G'day! I'm PARA 👋
          </p>
          <p style={{ margin:'3px 0 0', fontSize:12, color:'var(--text-muted)', lineHeight:1.45,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace: expanded ? 'normal' : 'nowrap' }}>
            {!unlocked
              ? (mode === 'login' ? 'Welcome back — tap to hear me!' : 'Tap to hear me introduce myself!')
              : (thinking ? '...' : text || greeting)
            }
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>
          <button
            onClick={e => { e.stopPropagation(); const nm=!muted; setMuted(nm); if(nm){AudioEngine.cancel();setSpeaking(false);} }}
            style={{ background:'none', border:'none', cursor:'pointer', color: muted ? '#475569' : '#0d9488', fontSize:13, padding:2, lineHeight:1 }}
          >{muted ? '🔇' : '🔊'}</button>
          <span style={{ color:'var(--text-muted)', fontSize:11, transition:'transform 0.2s',
            display:'inline-block', transform: expanded ? 'rotate(180deg)' : 'none' }}>▼</span>
        </div>
      </div>

      {/* Expanded Q&A + free-form */}
      {expanded && (
        <div style={{ padding:'0 14px 14px', borderTop:'1px solid rgba(13,148,136,0.12)',
          animation:'pac-fadein 0.2s ease' }}>

          <p style={{ margin:'12px 0 8px', fontSize:11, color:'var(--text-muted)',
            fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Quick questions
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {QA_LIST.map(qa => (
              <button
                key={qa.q}
                onClick={() => handleQ(qa)}
                style={{
                  textAlign:'left', padding:'8px 12px',
                  background: activeQ === qa.q ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.05)',
                  border:`1px solid ${activeQ === qa.q ? 'rgba(13,148,136,0.5)' : 'rgba(13,148,136,0.18)'}`,
                  borderRadius:9, fontSize:12.5,
                  color: activeQ === qa.q ? '#2dd4bf' : 'var(--text-secondary)',
                  cursor:'pointer', transition:'all 0.15s', fontWeight: activeQ === qa.q ? 600 : 400,
                }}
              >
                {activeQ === qa.q ? '▶ ' : ''}{qa.q}
              </button>
            ))}
          </div>

          {/* Free-form input */}
          <p style={{ margin:'12px 0 6px', fontSize:11, color:'var(--text-muted)',
            fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Ask me anything
          </p>
          <div style={{ display:'flex', gap:6 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleFreeform(); }}
              placeholder="Type your question…"
              disabled={sending || thinking}
              style={{
                flex:1, padding:'8px 11px',
                background:'rgba(13,148,136,0.06)',
                border:'1px solid rgba(13,148,136,0.22)',
                borderRadius:9, fontSize:12.5,
                color:'var(--text-primary)', outline:'none',
              }}
            />
            <button
              onClick={handleFreeform}
              disabled={!input.trim() || sending || thinking}
              style={{
                padding:'8px 12px', borderRadius:9, border:'none',
                background: input.trim() && !sending && !thinking
                  ? 'linear-gradient(135deg,#0d9488,#0891b2)'
                  : 'rgba(13,148,136,0.1)',
                color: input.trim() && !sending && !thinking ? 'white' : '#475569',
                cursor: input.trim() && !sending && !thinking ? 'pointer' : 'not-allowed',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}
            >
              {sending ? <Dots /> : <SendIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
