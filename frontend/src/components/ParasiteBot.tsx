// @ts-nocheck
/**
 * PARA — ParasitePro AI Assistant v8.0
 * ─────────────────────────────────────────────────────────
 * Stage 1 — Landing page (pre-login):
 *   Flies in 3s after arrival, introduces app, delivers
 *   disclaimer, makes BETA3FREE offer, CTA to /signup.
 *   SessionStorage-gated (once per session).
 *
 * Stage 2 — Post-login first visit:
 *   Cinematic fly-in + comprehensive 13-question GP-style
 *   intake. Stores full health context in sessionStorage
 *   for AI analysis personalisation. Navigates to /upload.
 *
 * Stage 3 — All protected pages:
 *   Page-specific contextual guidance on /upload, /analysis,
 *   /pricing, /dashboard, results pages.
 *
 * Exports:
 *   default → ParasiteBot  (used in App.tsx)
 *   named   → LandingPARA  (used in LandingPage.tsx)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Volume2, VolumeX, ChevronDown, RotateCcw, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised' | 'curious';
type Phase = 'hidden' | 'intro' | 'chat';
type Msg = { role: 'user' | 'assistant'; content: string; id: number; suggestions?: string[] };

/* ══════════════════════════════════════════════════════════════
   SPEECH ENGINE
══════════════════════════════════════════════════════════════ */
export class SpeechEngine {
  private static voices: SpeechSynthesisVoice[] = [];
  private static unlocked = false;
  private static pendingAfterUnlock: (() => void) | null = null;

  static init(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const tryLoad = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) this.voices = v;
    };
    window.speechSynthesis.onvoiceschanged = tryLoad;
    tryLoad();
    setTimeout(tryLoad, 1000);
  }

  static unlockAndSpeak(firstText: string, opts: any = {}): void {
    if (this.unlocked) { this.speak(firstText, opts); return; }
    const warmup = new SpeechSynthesisUtterance('');
    warmup.volume = 0;
    warmup.onend = () => { this.unlocked = true; setTimeout(() => this.speak(firstText, opts), 80); };
    warmup.onerror = () => { this.unlocked = true; setTimeout(() => this.speak(firstText, opts), 80); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(warmup);
  }

  static getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.voices = window.speechSynthesis?.getVoices() || [];
    const v = this.voices;
    const pick = (fn: (v: SpeechSynthesisVoice) => boolean) => v.find(fn) ?? null;

    // ── PARA voice priority: female, young-sounding, warm ─────────────────
    // iOS 16+ — Aria is the highest quality natural female voice (very warm)
    const aria = pick(v => /aria/i.test(v.name) && v.lang.startsWith('en'));
    if (aria) return aria;

    // Android Chrome — Google AU Female is warm and clear
    const googleAU = pick(v => /google australian/i.test(v.name));
    if (googleAU) return googleAU;

    // iOS/macOS — Karen is the native Australian female voice
    const karen = pick(v => /karen/i.test(v.name) && v.lang.startsWith('en'));
    if (karen) return karen;

    // macOS Siri / enhanced AU female
    const auEnhanced = pick(v => v.lang === 'en-AU' && /enhanced|premium|siri/i.test(v.name)
      && !/lee/i.test(v.name));
    if (auEnhanced) return auEnhanced;

    // Any en-AU female (skip Lee — male voice, too deep for PARA)
    const anyAUF = pick(v => v.lang === 'en-AU' && !/lee/i.test(v.name));
    if (anyAUF) return anyAUF;

    // Android — Google UK English Female
    const googleUKF = pick(v => /google uk english female/i.test(v.name));
    if (googleUKF) return googleUKF;

    // iOS/macOS — Serena (British female, warm)
    const serena = pick(v => /serena/i.test(v.name) && v.lang.startsWith('en-GB'));
    if (serena) return serena;

    // iOS — Moira (Irish female, friendly)
    const moira = pick(v => /moira/i.test(v.name) && v.lang.startsWith('en'));
    if (moira) return moira;

    // Any en-NZ
    const anyNZ = pick(v => v.lang === 'en-NZ');
    if (anyNZ) return anyNZ;

    // iOS — Samantha (US female, clear and friendly)
    const samantha = pick(v => /samantha/i.test(v.name) && v.lang.startsWith('en'));
    if (samantha) return samantha;

    // Any en-GB enhanced/premium female
    const gbEnhanced = pick(v => v.lang === 'en-GB' && /enhanced|premium/i.test(v.name)
      && !/daniel|oliver|arthur/i.test(v.name));
    if (gbEnhanced) return gbEnhanced;

    // Google US English female
    const googleUSF = pick(v => /google us english/i.test(v.name));
    if (googleUSF) return googleUSF;

    // Windows — Zira (female, decent)
    const zira = pick(v => /zira/i.test(v.name));
    if (zira) return zira;

    // Any English — skip known male voices
    const anyEnF = pick(v => v.lang.startsWith('en')
      && !/daniel|oliver|arthur|lee|fred|alex|bruce|ralph|albert/i.test(v.name));
    if (anyEnF) return anyEnF;

    return pick(v => v.lang.startsWith('en')) ?? null;
  }

  static clearPending() { this.pendingAfterUnlock = null; }

  static speak(text: string, opts: any = {}) {
    if (!window.speechSynthesis) { opts.onDone?.(); return; }
    if (!this.unlocked) { this.pendingAfterUnlock = () => this.speak(text, opts); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/[*_`#\[\]]/g, '').replace(/\n+/g, '. ').trim();
    const rawChunks = clean.split(/(?<=[.!?])\s+/).map((s: string) => s.trim()).filter(Boolean);
    const chunks: string[] = [];
    let buf = '';
    for (const c of rawChunks) {
      buf = buf ? buf + ' ' + c : c;
      if (buf.split(' ').length >= 7 || c.match(/[.!?]$/)) { chunks.push(buf); buf = ''; }
    }
    if (buf) chunks.push(buf);
    if (!chunks.length) { opts.onDone?.(); return; }
    const voice = this.getBestVoice();
    let i = 0;
    const next = () => {
      if (opts.signal?.cancelled || i >= chunks.length) { opts.onDone?.(); return; }
      const utt = new SpeechSynthesisUtterance(chunks[i]);
      const isQ = chunks[i].endsWith('?');
      // Google TTS voices run slightly slower — nudge rate up a touch
      const isGoogle = voice && /google/i.test(voice.name);
      // Higher pitch + snappier rate = little, friendly, upbeat PARA character
      const baseRate  = opts.rate  ?? (isGoogle ? 1.08 : 1.05);
      const basePitch = opts.pitch ?? 1.38;
      utt.rate  = baseRate  + (isQ ? 0.06 : 0);
      utt.pitch = basePitch + (isQ ? 0.15 : 0);
      utt.volume = 1.0;
      if (voice) utt.voice = voice;
      utt.onstart = () => { if (i === 0) opts.onStart?.(); };
      utt.onend   = () => { i++; setTimeout(next, isQ ? 380 : 180); };
      utt.onerror = () => { i++; setTimeout(next, 80); };
      window.speechSynthesis.speak(utt);
    };
    next();
  }

  static cancel() { window.speechSynthesis?.cancel(); }
}

/* ══════════════════════════════════════════════════════════════
   AUDIO ENGINE — plays pre-recorded Mimi MP3s for scripted lines,
   falls back to SpeechEngine for anything dynamic.
══════════════════════════════════════════════════════════════ */
const PARA_AUDIO_MAP: Record<string, string> = {
  // ── Landing page intro (lines 1–4) ──────────────────────────
  "Got something that":              '/audio/para-line-01.mp3',
  "Upload a photo of anything":      '/audio/para-line-02.mp3',
  "One thing I want to be clear":    '/audio/para-line-03.mp3',
  "Okay! Now here":                  '/audio/para-line-04.mp3',
  // ── Welcome modal (line 5) ──────────────────────────────────
  "G'day! I'm PARA, your personal":  '/audio/para-line-05.mp3',
  // ── Intake questions (lines 6–13) ───────────────────────────
  "Alright, let":                    '/audio/para-line-06.mp3',
  "Got it! And how old":             '/audio/para-line-07.mp3',
  "Thanks! What's your biological":   '/audio/para-line-08.mp3',
  "Are you experiencing any of":     '/audio/para-line-09.mp3',
  "How long have those symptoms":    '/audio/para-line-10.mp3',
  "Have you travelled to any":       '/audio/para-line-11.mp3',
  "Where do you currently live":     '/audio/para-line-12.mp3',
  "Do you have pets at home":        '/audio/para-line-13.mp3',
  "Have you ever had a confirmed":    '/audio/para-line-14.mp3',
  "Are you currently taking any":     '/audio/para-line-15.mp3',
  "What type of sample or image":     '/audio/para-line-16.mp3',
  // line 17 (how clear is your image) — Web Speech fallback intentional
  "You absolute legend":             '/audio/para-line-18.mp3',
};

export class AudioEngine {
  private static current: HTMLAudioElement | null = null;

  static init(): void { SpeechEngine.init(); }

  static getFile(text: string): string | null {
    const t = text.trim();
    for (const [key, file] of Object.entries(PARA_AUDIO_MAP)) {
      if (t.startsWith(key)) return file;
    }
    return null;
  }

  static speak(text: string, opts: any = {}): void {
    const file = this.getFile(text);
    if (!file) { SpeechEngine.speak(text, opts); return; }
    this.cancel();
    const audio = new Audio(file);
    this.current = audio;
    audio.onplay  = () => opts.onStart?.();
    audio.onended = () => { this.current = null; opts.onDone?.(); };
    audio.onerror = () => { this.current = null; SpeechEngine.speak(text, opts); };
    audio.play().catch(() => { this.current = null; SpeechEngine.speak(text, opts); });
  }

  static unlockAndSpeak(text: string, opts: any = {}): void {
    this.speak(text, opts);
  }

  static cancel(): void {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.current = null;
    }
    SpeechEngine.cancel();
  }

  static clearPending(): void { SpeechEngine.clearPending(); }

  static async requestMic(): Promise<string> {
    return SpeechEngine.requestMic();
  }
}

/* ══════════════════════════════════════════════════════════════
   MARKDOWN RENDERER
══════════════════════════════════════════════════════════════ */
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: any[] = [];
  let key = 0;
  const renderInline = (str: string) =>
    str.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: '#2dd4bf', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        : p
    );
  for (const line of lines) {
    if (!line.trim()) { elements.push(<div key={key++} style={{ height: '0.5em' }} />); continue; }
    if (/^[-•*]\s/.test(line.trim())) {
      elements.push(<div key={key++} style={{ display:'flex', gap:'0.4em', alignItems:'flex-start', marginBottom:'0.15em' }}><span style={{ color:'#2dd4bf', flexShrink:0 }}>•</span><span>{renderInline(line.trim().replace(/^[-•*]\s/, ''))}</span></div>);
      continue;
    }
    elements.push(<p key={key++} style={{ margin:'0 0 0.3em 0', lineHeight:1.62 }}>{renderInline(line)}</p>);
  }
  return <div style={{ fontSize:14, color:'#f1f5f9' }}>{elements}</div>;
}

/* ══════════════════════════════════════════════════════════════
   PARA AVATAR — Pink worm image, mood animations
══════════════════════════════════════════════════════════════ */
function Robot({ mood, speaking, size = 1 }: { mood: Mood; speaking: boolean; size?: number }) {
  // Inject keyframes once
  if (typeof document !== 'undefined' && !document.getElementById('robot-kf')) {
    const s = document.createElement('style');
    s.id = 'robot-kf';
    s.textContent = `
      @keyframes rb-talk      { 0%,100%{transform:scaleY(1) rotate(0deg)} 25%{transform:scaleY(1.06) rotate(-1.5deg)} 75%{transform:scaleY(0.96) rotate(1.5deg)} }
      @keyframes rb-bobble    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
      @keyframes rb-wave      { 0%,100%{transform:rotate(0deg) scale(1)} 30%{transform:rotate(-10deg) scale(1.06)} 70%{transform:rotate(8deg) scale(1.04)} }
      @keyframes rb-celebrate { 0%,100%{transform:translateY(0) scale(1)} 25%{transform:translateY(-16px) scale(1.1) rotate(-3deg)} 75%{transform:translateY(-10px) scale(1.07) rotate(3deg)} }
      @keyframes rb-shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      @keyframes rb-pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
      @keyframes rb-think     { 0%,100%{transform:rotate(0deg) translateY(0)} 33%{transform:rotate(-4deg) translateY(-5px)} 66%{transform:rotate(3deg) translateY(-2px)} }
    `;
    document.head.appendChild(s);
  }

  const w = Math.round(110 * size);
  const h = Math.round(150 * size);

  const anim = speaking
    ? 'rb-talk 0.3s ease-in-out infinite'
    : mood === 'waving'    ? 'rb-wave 1.6s ease-in-out infinite'
    : mood === 'happy'     ? 'rb-bobble 2s ease-in-out infinite'
    : mood === 'celebrate' ? 'rb-celebrate 1.1s ease-in-out infinite'
    : mood === 'concerned' ? 'rb-shake 0.5s ease-in-out 1'
    : mood === 'thinking'  ? 'rb-think 2.2s ease-in-out infinite'
    : mood === 'surprised' ? 'rb-wave 0.8s ease-in-out 2'
    :                        'rb-bobble 2.8s ease-in-out infinite';

  const filt = speaking
    ? 'drop-shadow(0 4px 18px rgba(255,100,200,0.65)) brightness(1.08)'
    : mood === 'happy'     ? 'drop-shadow(0 4px 16px rgba(255,200,100,0.5)) brightness(1.07)'
    : mood === 'concerned' ? 'drop-shadow(0 3px 10px rgba(255,80,80,0.4)) grayscale(0.15)'
    : mood === 'celebrate' ? 'drop-shadow(0 6px 22px rgba(255,220,50,0.6)) brightness(1.12)'
    : mood === 'thinking'  ? 'drop-shadow(0 4px 14px rgba(180,100,255,0.45))'
    :                        'drop-shadow(0 4px 14px rgba(255,100,180,0.45))';

  return (
    <div style={{ width: w, height: h, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <img
        src="/para-avatar.jpg"
        alt="PARA"
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          borderRadius: '50% 50% 40% 40%',
          animation: anim,
          filter: filt,
          transformOrigin: 'bottom center',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STAGE 1 — LANDING PAGE PARA
══════════════════════════════════════════════════════════════ */
const LANDING_SCRIPT = [
  { text: "Got something that's got you puzzled? Good - that's exactly what I'm here for. I'm PARA, your personal guide to ParasitePro. Let me show you how this works!", mood: 'waving' as Mood, card: { icon: '👋', title: 'Welcome to ParasitePro', desc: 'notworms.com · Made for Australians' } },
  { text: "Upload a photo of anything worrying you - stool, a weird rash, a mystery bite, a suspicious specimen. I analyse the visual patterns and give you a structured educational report in under 60 seconds. Real information, clearly explained.", mood: 'talking' as Mood, card: { icon: '🔬', title: 'AI Visual Analysis in ~60s', desc: 'Stool · Skin · Environmental · Microscopy' } },
  { text: "One thing I want to be clear about - and I mean this: I'm an educational tool, not a doctor. Everything I give you helps you understand what you might be looking at. Always take my reports to your GP to confirm. If something feels urgent right now, don't wait - call 000 immediately.", mood: 'concerned' as Mood, card: { icon: '⚠️', title: 'Educational Tool Only', desc: 'Not a diagnosis · Always see your GP · Emergency: 000' } },
  { text: "Okay! Now here's the exciting part — because we're still in beta, your first 3 analyses are completely free. Just use the code BETA3FREE when you sign up. No credit card needed. This won't last forever — prices go up at full launch. But right now it's yours!", mood: 'happy' as Mood, card: { icon: '🎁', title: 'Beta Offer — 3 Free Analyses', desc: 'Code: BETA3FREE · No card required · Limited time' } },
];

export function LandingPARA() {
  const navigate = useNavigate();
  const [visible, setVisible]     = useState(false);
  const [dismissed, setDismiss]   = useState(false);
  const [robotY, setRobotY]       = useState(-300);
  const [overlayIn, setOverlay]   = useState(false);
  const [lineIdx, setLineIdx]     = useState(0);
  const [mood, setMood]           = useState<Mood>('waving');
  const [speaking, setSpeaking]   = useState(false);
  const [card, setCard]           = useState<any>(null);
  const [cardIn, setCardIn]       = useState(false);
  const [muted, setMuted]         = useState(false);
  const [voiceStarted, setVoiceStarted] = useState(false);
  const [showCTA, setShowCTA]     = useState(false);
  const sig = useRef({ cancelled: false });
  const speakRef = useRef<(idx: number) => void>(() => {});
  const autoAdvTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AudioEngine.init();
    if (sessionStorage.getItem('para_landing_seen')) return;
    const t = setTimeout(() => {
      setVisible(true);
      setOverlay(true);
      setTimeout(() => setRobotY(-80), 200);
      setTimeout(() => setRobotY(12),  420);
      setTimeout(() => setRobotY(-10), 600);
      setTimeout(() => setRobotY(0),   760);
      setTimeout(() => { if (!sig.current.cancelled) speakRef.current(0); }, 3200);
    }, 3000);
    return () => { clearTimeout(t); sig.current.cancelled = true; AudioEngine.cancel(); };
  }, []);

  const speakLine = useCallback((idx: number) => {
    if (sig.current.cancelled || dismissed) return;
    if (idx >= LANDING_SCRIPT.length) {
      setShowCTA(true); setSpeaking(false); setCard(null);
      return;
    }
    const line = LANDING_SCRIPT[idx];
    setLineIdx(idx); setMood(line.mood); setSpeaking(true);
    setCardIn(false);
    setTimeout(() => { setCard(line.card); setTimeout(() => setCardIn(true), 60); }, 260);

    if (!muted && voiceStarted) {
      const fallback = setTimeout(() => {
        AudioEngine.clearPending(); setSpeaking(false);
        if (!sig.current.cancelled) speakRef.current(idx + 1);
      }, Math.max(2200, line.text.length * 25));
      AudioEngine.speak(line.text, {
        rate: 0.92, pitch: 1.05, signal: sig.current,
        onStart: () => clearTimeout(fallback),
        onDone: () => { clearTimeout(fallback); setSpeaking(false); setTimeout(() => { if (!sig.current.cancelled) speakRef.current(idx + 1); }, 400); },
      });
    } else {
      if (autoAdvTimerRef.current) clearTimeout(autoAdvTimerRef.current);
      autoAdvTimerRef.current = setTimeout(() => { autoAdvTimerRef.current = null; setSpeaking(false); if (!sig.current.cancelled) speakRef.current(idx + 1); }, Math.max(2400, line.text.length * 26));
    }
  }, [muted, voiceStarted, dismissed]);

  useEffect(() => { speakRef.current = speakLine; }, [speakLine]);

  const handleTapToStart = () => {
    setVoiceStarted(true);
    if (autoAdvTimerRef.current) { clearTimeout(autoAdvTimerRef.current); autoAdvTimerRef.current = null; }
    sig.current.cancelled = false;
    AudioEngine.unlockAndSpeak(LANDING_SCRIPT[0].text, {
      rate: 0.92, pitch: 1.05, signal: sig.current,
      onStart: () => { setSpeaking(true); setMood(LANDING_SCRIPT[0].mood); },
      onDone: () => { setSpeaking(false); setTimeout(() => { if (!sig.current.cancelled) speakRef.current(1); }, 400); },
    });
    setLineIdx(0); setMood(LANDING_SCRIPT[0].mood); setSpeaking(true);
    setTimeout(() => { setCard(LANDING_SCRIPT[0].card); setTimeout(() => setCardIn(true), 60); }, 260);
  };

  const dismiss = () => {
    sig.current.cancelled = true; AudioEngine.cancel();
    sessionStorage.setItem('para_landing_seen', '1');
    setDismiss(true);
  };

  const goSignup = () => {
    sig.current.cancelled = true; AudioEngine.cancel();
    sessionStorage.setItem('para_landing_seen', '1');
    navigate('/signup');
  };

  if (!visible || dismissed) return null;
  const progress = ((lineIdx + 1) / LANDING_SCRIPT.length) * 100;

  return (
    <>
      <style>{`
        @keyframes lp-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes lp-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lp-ripple { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.15)} }
        @keyframes lp-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ position:'fixed', inset:0, zIndex:8000, background:'rgba(4,14,22,0.90)', backdropFilter:'blur(10px)', opacity:overlayIn?1:0, transition:'opacity 0.5s ease', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 20px' }}>
        <div style={{ position:'absolute', top:'28%', left:'50%', transform:'translateX(-50%)', width:480, height:480, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(13,148,136,0.16) 0%,transparent 70%)', pointerEvents:'none' }}/>
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, padding:'12px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(13,148,136,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#0d9488', boxShadow:'0 0 9px #0d9488', animation:'lp-pulse 1.8s ease-in-out infinite' }}/>
            <span style={{ color:'#2dd4bf', fontFamily:'monospace', fontSize:11, letterSpacing:'0.16em', fontWeight:600 }}>PARA · YOUR GUIDE</span>
          </div>
          <button onClick={dismiss} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#9ca3af', borderRadius:8, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 }}>
            <X size={12}/> Skip
          </button>
        </div>
        {/* Progress */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(13,148,136,0.1)' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#0d9488,#2dd4bf)', width:`${showCTA?100:progress}%`, boxShadow:'0 0 8px #0d9488', transition:'width 0.7s ease' }}/>
        </div>
        {/* Robot */}
        <div style={{ transform:`translateY(${robotY}px)`, transition:robotY===-300?'none':'transform 0.38s cubic-bezier(0.34,1.6,0.64,1)', position:'relative', zIndex:1, marginBottom:16 }}>
          <div style={{ animation:'lp-float 3.4s ease-in-out infinite' }}>
            <Robot mood={mood} speaking={speaking} size={1.4}/>
          </div>
          {speaking && <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:130, height:22, background:'radial-gradient(ellipse,rgba(13,148,136,0.3) 0%,transparent 70%)', animation:'lp-ripple 0.9s ease-in-out infinite' }}/>}
        </div>
        {/* Speech bubble */}
        {!showCTA && (
          <div style={{ position:'relative', background:'rgba(10,24,38,0.95)', border:`1px solid rgba(13,148,136,${speaking?'0.7':'0.3'})`, borderRadius:20, padding:'18px 26px', maxWidth:520, width:'100%', textAlign:'center', backdropFilter:'blur(10px)', boxShadow:speaking?'0 0 32px rgba(13,148,136,0.2)':'0 8px 28px rgba(0,0,0,0.4)', transition:'border-color 0.3s,box-shadow 0.4s', minHeight:72, zIndex:1, marginBottom:12 }}>
            <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderBottom:`10px solid rgba(13,148,136,${speaking?'0.7':'0.3'})` }}/>
            <p style={{ color:'#f1f5f9', fontSize:16, lineHeight:1.72, margin:0 }}>{LANDING_SCRIPT[lineIdx]?.text || ''}</p>
          </div>
        )}
        {/* Feature card */}
        {!showCTA && card && (
          <div style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.28)', borderRadius:14, padding:'12px 18px', maxWidth:420, width:'100%', opacity:cardIn?1:0, transform:cardIn?'translateY(0) scale(1)':'translateY(8px) scale(0.97)', transition:'all 0.36s cubic-bezier(0.34,1.3,0.64,1)', zIndex:1 }}>
            <span style={{ fontSize:26 }}>{card.icon}</span>
            <div>
              <div style={{ color:'#2dd4bf', fontWeight:700, fontSize:13, marginBottom:2 }}>{card.title}</div>
              <div style={{ color:'#94a3b8', fontSize:12 }}>{card.desc}</div>
            </div>
          </div>
        )}
        {/* CTA */}
        {showCTA && (
          <div style={{ textAlign:'center', maxWidth:460, width:'100%', zIndex:1, animation:'lp-fadein 0.5s ease' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
            <h2 style={{ color:'#f1f5f9', fontSize:22, fontWeight:700, marginBottom:8, letterSpacing:'-0.02em' }}>Ready to find out what you're looking at?</h2>
            <p style={{ color:'#94a3b8', fontSize:14, lineHeight:1.65, marginBottom:8 }}>Sign up now and use code <strong style={{ color:'#2dd4bf', fontFamily:'monospace' }}>BETA3FREE</strong> to get your first 3 analyses completely free.</p>
            <p style={{ color:'#475569', fontSize:12, fontFamily:'monospace', marginBottom:24 }}>Educational tool only · Not a medical diagnosis · Always confirm with your GP · Emergency: 000</p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={goSignup} style={{ background:'linear-gradient(135deg,#0d9488,#0891b2)', border:'none', color:'white', borderRadius:12, padding:'14px 28px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'-0.01em' }}>Claim 3 free analyses →</button>
              <button onClick={dismiss} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#64748b', borderRadius:12, padding:'14px 20px', fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>Maybe later</button>
            </div>
          </div>
        )}
        {/* Controls */}
        <div style={{ position:'absolute', bottom:16, display:'flex', alignItems:'center', gap:12 }}>
          {!voiceStarted && robotY === 0 && !showCTA && (
            <button onClick={handleTapToStart} style={{ background:'rgba(13,148,136,0.12)', border:'2px solid rgba(13,148,136,0.5)', color:'#2dd4bf', borderRadius:20, padding:'8px 16px', fontSize:13, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ fontSize:16 }}>🔊</span> Tap to hear PARA
            </button>
          )}
          {voiceStarted && (
            <button onClick={() => { const nm=!muted; setMuted(nm); if(nm) AudioEngine.cancel(); }} style={{ width:34, height:34, borderRadius:'50%', background:'rgba(13,148,136,0.1)', border:`1px solid ${muted?'rgba(255,255,255,0.1)':'rgba(13,148,136,0.4)'}`, color:muted?'#475569':'#0d9488', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
              {muted ? '🔇' : '🔊'}
            </button>
          )}
          <div style={{ display:'flex', gap:6 }}>
            {LANDING_SCRIPT.map((_, i) => (
              <div key={i} style={{ width:i===lineIdx?18:6, height:6, borderRadius:3, background:i<=lineIdx?'#0d9488':'rgba(13,148,136,0.2)', boxShadow:i===lineIdx?'0 0 7px #0d9488':'none', transition:'all 0.3s ease' }}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   STAGE 2 — GP-STYLE INTAKE (13 questions)
══════════════════════════════════════════════════════════════ */
type IntakeQ = { id: string; text: string; mood: Mood; options: string[]; multi?: boolean; final?: boolean; };

const INTAKE_QUESTIONS: IntakeQ[] = [
  { id:'reason',     text:"Alright, let's get you sorted! What's brought you to ParasitePro today?", mood:'curious', options:['Found something in my stool','Strange rash or skin issue','Worried about my pet','Just returned from travel','Ongoing unexplained symptoms','General curiosity / exploring'] },
  { id:'age',        text:"Got it! And how old are you roughly? This helps me give you more relevant information.", mood:'happy', options:['Under 18','18–34','35–54','55–74','75+','Rather not say'] },
  { id:'sex',        text:"Thanks! What's your biological sex? Some parasites present differently depending on this.", mood:'curious', options:['Male','Female','Intersex','Rather not say'] },
  { id:'symptoms',   text:"Are you experiencing any of these right now? You can pick more than one!", mood:'curious', multi:true, options:['Visible worms or segments','Itching — especially at night','Abdominal pain or cramping','Unusual fatigue or low energy','Skin rash, tracks, or sores','Nausea or vomiting','Diarrhoea or loose stools','Unexplained weight loss','No symptoms — just a visual concern'] },
  { id:'duration',   text:"How long have those symptoms or concerns been going on for?", mood:'talking', options:['Just noticed today','A few days','1–2 weeks','3–4 weeks','More than a month','On and off for a while','Not applicable'] },
  { id:'travel',     text:"Have you travelled to any tropical, rural, or regional areas in the last 3 months? Far North QLD, NT, Southeast Asia, Pacific Islands, rural properties?", mood:'curious', options:['Yes — tropical QLD or NT','Yes — overseas (tropical)','Yes — rural or remote Australia','Yes — multiple of the above','No recent travel'] },
  { id:'location',   text:"Where do you currently live? This helps with regional risk context.", mood:'happy', options:['Far North QLD / Cairns area','North or Central QLD','South East QLD','NT or remote Australia','Other state or territory','Overseas'] },
  { id:'pets',       text:"Do you have pets at home? Dogs and cats are common sources of certain parasites.", mood:'curious', options:['Yes — dog(s)','Yes — cat(s)','Yes — both dogs and cats','Yes — other pets','No pets'] },
  { id:'previous',   text:"Have you ever had a confirmed parasitic infection before — even years ago?", mood:'talking', options:['Yes — confirmed by a doctor','Yes — treated but not confirmed','Possibly, not sure','No, never','Not sure'] },
  { id:'medications',text:"Are you currently taking any medications, or do you have any immune system conditions?", mood:'concerned', options:['No medications','Yes — general medications','Yes — immunosuppressants or steroids','Yes — currently on antibiotics','I have an autoimmune condition','Rather not say'] },
  { id:'sample_type',text:"What type of sample or image are you planning to upload today?", mood:'curious', options:['Stool sample','Skin rash or lesion','Skin tracks or burrows','Microscopy slide','Pet stool sample','Environmental specimen','Not sure yet'] },
  { id:'image_confidence', text:"How clear do you think your image is? Our AI works with most phone cameras — just be honest!", mood:'happy', options:['Clear and well-lit','Reasonably clear','A bit blurry but the best I could do','Not sure — I will try my best','I have not taken it yet'] },
  { id:'done', text:"You absolute legend — that's everything I need! I've got a really clear picture of your situation now. I'm going to use all of that to make sure the AI gives you the most accurate, relevant report possible. Ready to upload your image?", mood:'waving', options:["Yes, let's upload! 🚀","Give me a sec first"], final:true },
];

type ScriptLine = { text: string; mood: Mood; card?: { icon: string; title: string; desc: string } | null; pauseAfter?: number };

const buildIntroScript = (name: string): ScriptLine[] => [
  { text:`${name}! Welcome to ParasitePro — I am SO glad you're here. I'm PARA, your personal guide, and I'll be with you every single step of the way. Let me walk you through how this all works!`, mood:'waving', card:null, pauseAfter:350 },
  { text:`You upload a photo of anything worrying you — stool samples, weird rashes, mystery bites, skin stuff, even pet specimens. Our AI analyses the visual patterns and gives you a full structured educational report in under 60 seconds!`, mood:'talking', card:{ icon:'🔬', title:'AI Analysis in ~60 seconds', desc:'Stool · Skin · Environmental · Microscopy' }, pauseAfter:320 },
  { text:`Everything is built specifically for Australia. The AI knows about our tropical climate, our local critters, Queensland-specific parasites, and our healthcare system. No generic overseas information — this is made for us!`, mood:'happy', card:{ icon:'🇦🇺', title:'Built for Australians', desc:'Queensland-aware · GP referral pathways' }, pauseAfter:320 },
  { text:`One really important thing — and I say this with genuine care: I am an educational guide, not a doctor. Everything I show you helps you understand what you might be looking at. Always take results to your GP to confirm. If something feels urgent right now, call 000 immediately. Now let me ask you a few quick questions so the AI can give you the best possible analysis!`, mood:'concerned', card:{ icon:'⚠️', title:'Educational Guide Only', desc:'Always confirm with your GP · Emergency: 000' }, pauseAfter:400 },
];

/* ══════════════════════════════════════════════════════════════
   INTRO SCREEN (post-login cinematic + GP intake)
══════════════════════════════════════════════════════════════ */
function IntroScreen({ userName, muted, onDone }: { userName: string; muted: boolean; onDone: (data: Record<string,string[]>) => void }) {
  const script = buildIntroScript(userName || 'Hey you');
  const [phase,      setPhase]     = useState<'intro'|'intake'>('intro');
  const [lineIdx,    setLineIdx]   = useState(0);
  const [mood,       setMood]      = useState<Mood>('waving');
  const [speaking,   setSpeaking]  = useState(false);
  const [robotY,     setRobotY]    = useState(-280);
  const [overlayIn,  setOverlay]   = useState(false);
  const [card,       setCard]      = useState<any>(null);
  const [cardIn,     setCardIn]    = useState(false);
  const [skippable,  setSkip]      = useState(false);
  const [exitAnim,   setExit]      = useState(false);
  const [intakeStep, setIntakeStep]= useState(0);
  const [intakeData, setIntakeData]= useState<Record<string,string[]>>({});
  const [multiSel,   setMultiSel]  = useState<string[]>([]);
  const [intakeIn,   setIntakeIn]  = useState(false);
  const [voiceOk,    setVoiceOk]   = useState(false);
  const [micStatus,  setMicStatus] = useState<'idle'|'asking'|'granted'|'denied'>('idle');
  const [showMic,    setShowMic]   = useState(false);
  const sig = useRef({ cancelled: false });
  const speakRef = useRef<(idx: number) => void>(() => {});

  useEffect(() => {
    AudioEngine.init();
    setTimeout(() => setOverlay(true), 40);
    setTimeout(() => setRobotY(-90), 200);
    setTimeout(() => setRobotY(10),  460);
    setTimeout(() => setRobotY(-14), 660);
    setTimeout(() => setRobotY(0),   840);
    setTimeout(() => setSkip(true),  2800);
    setTimeout(() => { if (!sig.current.cancelled) speakRef.current(0); }, 3000);
    return () => { sig.current.cancelled = true; AudioEngine.cancel(); };
  }, []);

  const speakLine = useCallback((idx: number) => {
    if (sig.current.cancelled) return;
    if (idx >= script.length) {
      setLineIdx(-1); setSpeaking(false); setCardIn(false);
      setTimeout(() => { setCard(null); setPhase('intake'); setIntakeIn(true); }, 380);
      if (!muted && voiceOk) { setSpeaking(true); setMood('curious'); AudioEngine.speak(INTAKE_QUESTIONS[0].text, { rate:0.92, pitch:1.08, signal:sig.current, onDone:() => setSpeaking(false) }); }
      return;
    }
    const line = script[idx];
    setLineIdx(idx); setMood(line.mood); setSpeaking(true); setCardIn(false);
    setTimeout(() => { setCard(line.card ?? null); if (line.card) setTimeout(() => setCardIn(true), 60); }, 280);
    if (!muted && voiceOk) {
      const fallback = setTimeout(() => { AudioEngine.clearPending(); setSpeaking(false); if (!sig.current.cancelled) speakRef.current(idx + 1); }, Math.max(2400, line.text.length * 28));
      AudioEngine.speak(line.text, { rate:0.92, pitch:1.05, signal:sig.current,
        onStart: () => clearTimeout(fallback),
        onDone: () => { clearTimeout(fallback); setSpeaking(false); setTimeout(() => { if (!sig.current.cancelled) speakRef.current(idx + 1); }, line.pauseAfter ?? 380); },
      });
    } else {
      setTimeout(() => { if (!sig.current.cancelled) speakRef.current(idx + 1); }, Math.max(2000, line.text.length * 26));
    }
  }, [muted, voiceOk, script]);

  useEffect(() => { speakRef.current = speakLine; }, [speakLine]);

  const triggerExit = (data: Record<string,string[]>) => {
    setExit(true); sig.current.cancelled = true; AudioEngine.cancel();
    setTimeout(() => onDone(data), 520);
  };

  const handleTapToStart = () => {
    setVoiceOk(true); sig.current.cancelled = false;
    AudioEngine.unlockAndSpeak(script[0].text, { rate:0.92, pitch:1.05, signal:sig.current,
      onStart: () => { setSpeaking(true); setMood(script[0].mood); },
      onDone:  () => { setSpeaking(false); setTimeout(() => { if (!sig.current.cancelled) speakRef.current(1); }, script[0].pauseAfter ?? 380); },
    });
    setLineIdx(0); setMood(script[0].mood); setSpeaking(true);
    setTimeout(() => { setCard(script[0].card ?? null); if (script[0].card) setTimeout(() => setCardIn(true), 60); }, 280);
  };

  const advanceIntake = (next: number, newData: Record<string,string[]>) => {
    setIntakeStep(next); setIntakeIn(false); setMultiSel([]);
    setTimeout(() => {
      setIntakeIn(true); setMood(INTAKE_QUESTIONS[next].mood);
      if (!muted && voiceOk) { setSpeaking(true); AudioEngine.unlockAndSpeak(INTAKE_QUESTIONS[next].text, { rate:0.92, pitch:1.08, signal:sig.current, onDone:() => setSpeaking(false) }); }
    }, 320);
    setIntakeData(newData);
  };

  const handleSingleAnswer = (answer: string) => {
    const q = INTAKE_QUESTIONS[intakeStep];
    const newData = { ...intakeData, [q.id]: [answer] };
    if (q.final) { triggerExit(newData); return; }
    if (intakeStep === 0 && micStatus === 'idle') { setShowMic(true); setMicStatus('asking'); }
    advanceIntake(intakeStep + 1, newData);
  };

  const handleMultiConfirm = () => {
    const q = INTAKE_QUESTIONS[intakeStep];
    const newData = { ...intakeData, [q.id]: multiSel.length > 0 ? multiSel : ['None selected'] };
    advanceIntake(intakeStep + 1, newData);
  };

  const currentLine = script[lineIdx];
  const totalSteps = script.length + INTAKE_QUESTIONS.length;
  const overallProgress = phase==='intro' ? ((lineIdx+1)/totalSteps)*100 : ((script.length+intakeStep+1)/totalSteps)*100;
  const currentQ = INTAKE_QUESTIONS[intakeStep];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(6,18,24,0.97)', backdropFilter:'blur(20px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:exitAnim?0:overlayIn?1:0, transition:exitAnim?'opacity 0.5s ease':'opacity 0.45s ease', userSelect:'none', overflowY:'auto' }}>
      <div style={{ position:'absolute', top:'24%', left:'50%', transform:'translateX(-50%)', width:580, height:580, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(13,148,136,0.12) 0%,transparent 68%)', pointerEvents:'none' }}/>
      {/* Header */}
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'13px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(13,148,136,0.09)', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#0d9488', boxShadow:'0 0 9px #0d9488', animation:'para-pulse 1.8s ease-in-out infinite' }}/>
          <span style={{ color:'#2dd4bf', fontFamily:'monospace', fontSize:12, letterSpacing:'0.17em', fontWeight:600 }}>PARA · PARASITEPRO</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={() => { const nm = !muted; if(nm) AudioEngine.cancel(); }} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.07)', border:`1px solid ${muted?'rgba(255,255,255,0.1)':'rgba(13,148,136,0.4)'}`, color:muted?'#475569':'#0d9488', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
            {muted ? '🔇' : '🔊'}
          </button>
          {skippable && <button onClick={() => triggerExit(intakeData)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', color:'#9ca3af', borderRadius:8, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>Skip ×</button>}
        </div>
      </div>
      {/* Progress */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(13,148,136,0.1)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#0d9488,#2dd4bf)', width:`${overallProgress}%`, boxShadow:'0 0 8px #0d9488', transition:'width 0.7s ease' }}/>
      </div>
      {/* Content */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18, maxWidth:540, padding:'60px 20px 50px', position:'relative', zIndex:1, width:'100%' }}>
        {/* Robot */}
        <div style={{ transform:`translateY(${robotY}px)`, transition:robotY===-280?'none':'transform 0.38s cubic-bezier(0.34,1.6,0.64,1)', position:'relative' }}>
          <div style={{ animation:'para-float 3.4s ease-in-out infinite' }}>
            <Robot mood={mood} speaking={speaking} size={1.4}/>
          </div>
          {speaking && <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:130, height:22, background:'radial-gradient(ellipse,rgba(13,148,136,0.3) 0%,transparent 70%)', animation:'para-ripple 0.9s ease-in-out infinite' }}/>}
        </div>
        {/* Intro speech bubble */}
        {phase==='intro' && lineIdx>=0 && (
          <div style={{ position:'relative', background:'rgba(10,24,38,0.92)', border:`1px solid rgba(13,148,136,${speaking?'0.7':'0.3'})`, borderRadius:18, padding:'18px 26px', maxWidth:520, width:'100%', textAlign:'center', backdropFilter:'blur(10px)', boxShadow:speaking?'0 0 32px rgba(13,148,136,0.18)':'0 8px 28px rgba(0,0,0,0.4)', transition:'border-color 0.3s,box-shadow 0.4s', minHeight:72 }}>
            <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderBottom:`10px solid rgba(13,148,136,${speaking?'0.7':'0.3'})` }}/>
            <p style={{ color:'#f1f5f9', fontSize:16, lineHeight:1.7, margin:0 }}>{currentLine?.text || ''}</p>
          </div>
        )}
        {/* Feature card */}
        <div style={{ minHeight:52, width:'100%', maxWidth:420, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {card && (
            <div style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.28)', borderRadius:14, padding:'12px 18px', width:'100%', opacity:cardIn?1:0, transform:cardIn?'translateY(0) scale(1)':'translateY(8px) scale(0.97)', transition:'all 0.36s cubic-bezier(0.34,1.3,0.64,1)' }}>
              <span style={{ fontSize:26 }}>{card.icon}</span>
              <div>
                <div style={{ color:'#2dd4bf', fontWeight:700, fontSize:13, marginBottom:2 }}>{card.title}</div>
                <div style={{ color:'#94a3b8', fontSize:12 }}>{card.desc}</div>
              </div>
            </div>
          )}
        </div>
        {/* Intake */}
        {phase==='intake' && (
          <div style={{ width:'100%', maxWidth:500, opacity:intakeIn?1:0, transform:intakeIn?'translateY(0)':'translateY(10px)', transition:'all 0.36s ease', display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ background:'rgba(10,24,38,0.92)', border:`1px solid rgba(13,148,136,${speaking?'0.7':'0.3'})`, borderRadius:18, padding:'16px 22px', textAlign:'center', position:'relative', marginBottom:4 }}>
              <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderBottom:`10px solid rgba(13,148,136,${speaking?'0.7':'0.3'})` }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:7 }}>
                <span style={{ color:'#475569', fontSize:11, fontFamily:'monospace', letterSpacing:'0.1em' }}>QUESTION {intakeStep+1} OF {INTAKE_QUESTIONS.length}</span>
                {currentQ?.multi && <span style={{ color:'#2dd4bf', fontSize:10, fontFamily:'monospace', background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.3)', borderRadius:8, padding:'2px 8px' }}>SELECT ALL THAT APPLY</span>}
              </div>
              <p style={{ color:'#f1f5f9', fontSize:15, lineHeight:1.65, margin:0 }}>{currentQ?.text}</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7, maxHeight:'42vh', overflowY:'auto', paddingRight:4 }}>
              {currentQ?.multi ? (
                <>
                  {currentQ.options.map(opt => {
                    const sel = multiSel.includes(opt);
                    return (
                      <button key={opt} onClick={() => setMultiSel(prev => sel ? prev.filter(o=>o!==opt) : [...prev, opt])}
                        style={{ background:sel?'rgba(13,148,136,0.22)':'rgba(13,148,136,0.07)', border:`1px solid ${sel?'rgba(13,148,136,0.7)':'rgba(13,148,136,0.28)'}`, color:sel?'#2dd4bf':'#94a3b8', borderRadius:12, padding:'11px 16px', fontSize:14, cursor:'pointer', textAlign:'left', fontFamily:'inherit', display:'flex', alignItems:'center', gap:10, transition:'all 0.15s' }}>
                        <span style={{ width:18, height:18, borderRadius:4, border:`2px solid ${sel?'#0d9488':'rgba(13,148,136,0.4)'}`, background:sel?'#0d9488':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11, color:'white', transition:'all 0.15s' }}>{sel?'✓':''}</span>
                        {opt}
                      </button>
                    );
                  })}
                  <button onClick={handleMultiConfirm} style={{ background:'linear-gradient(135deg,#0d9488,#0891b2)', border:'none', color:'white', borderRadius:12, padding:'13px 18px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:4 }}>
                    {multiSel.length > 0 ? `Confirm ${multiSel.length} selected →` : 'None apply — continue →'}
                  </button>
                </>
              ) : currentQ?.options.map(opt => (
                <button key={opt} onClick={() => handleSingleAnswer(opt)}
                  style={{ background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.28)', color:'#5eead4', borderRadius:13, padding:'12px 16px', fontSize:14, cursor:'pointer', textAlign:'left', fontFamily:'inherit', lineHeight:1.4, transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(13,148,136,0.20)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.65)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(13,148,136,0.08)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.28)'; }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Tap to start */}
      {!voiceOk && robotY===0 && (
        <div style={{ position:'absolute', inset:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(6,18,24,0.75)', backdropFilter:'blur(4px)', animation:'para-fadein 0.5s ease' }}>
          <button onClick={handleTapToStart} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:13, background:'rgba(13,148,136,0.12)', border:'2px solid rgba(13,148,136,0.6)', borderRadius:22, padding:'26px 38px', cursor:'pointer', fontFamily:'inherit', transition:'all 0.18s', userSelect:'none' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(13,148,136,0.22)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(13,148,136,0.12)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.6)'; }}>
            <span style={{ fontSize:40 }}>🔊</span>
            <span style={{ color:'#2dd4bf', fontSize:19, fontWeight:700 }}>Tap to meet PARA 👋</span>
            <span style={{ color:'#94a3b8', fontSize:13, textAlign:'center', lineHeight:1.5, maxWidth:210 }}>Enable voice — PARA will guide you through everything!</span>
          </button>
        </div>
      )}
      {/* Mic prompt */}
      {showMic && (
        <div style={{ position:'absolute', inset:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(6,18,24,0.88)', backdropFilter:'blur(6px)' }}>
          <div style={{ background:'rgba(10,24,38,0.98)', border:'1px solid rgba(13,148,136,0.45)', borderRadius:20, padding:'30px 26px', maxWidth:340, textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize:42, marginBottom:14 }}>🎙️</div>
            <h3 style={{ color:'#2dd4bf', fontSize:17, fontWeight:700, margin:'0 0 9px' }}>Can I use your mic?</h3>
            <p style={{ color:'#94a3b8', fontSize:14, lineHeight:1.65, margin:'0 0 22px' }}>Speak your answers instead of typing! Just needs a quick permission grant.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              <button onClick={async () => { setShowMic(false); const r=await SpeechEngine.requestMic(); setMicStatus(r); }} style={{ background:'linear-gradient(135deg,#0d9488,#0891b2)', border:'none', color:'white', borderRadius:11, padding:'12px 18px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Yes! Enable microphone 🎙️</button>
              <button onClick={() => { setShowMic(false); setMicStatus('denied'); }} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', borderRadius:11, padding:'10px 18px', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>No thanks, I'll type</button>
            </div>
          </div>
        </div>
      )}
      {/* Dot progress */}
      <div style={{ position:'absolute', bottom:14, display:'flex', gap:7 }}>
        {[...script, ...INTAKE_QUESTIONS].map((_,i) => {
          const cur = phase==='intro' ? lineIdx : script.length + intakeStep;
          return <div key={i} style={{ width:i===cur?18:6, height:6, borderRadius:3, background:i<=cur?'#0d9488':'rgba(13,148,136,0.18)', boxShadow:i===cur?'0 0 7px #0d9488':'none', transition:'all 0.32s ease' }}/>;
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUGGESTION CHIPS
══════════════════════════════════════════════════════════════ */
function SuggestionChips({ suggestions, onSelect, disabled }: any) {
  if (!suggestions?.length || disabled) return null;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:8, paddingLeft:31 }}>
      {suggestions.map((s: string, i: number) => (
        <button key={i} onClick={() => onSelect(s)}
          style={{ background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.3)', color:'#5eead4', borderRadius:20, padding:'5px 13px', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', whiteSpace:'nowrap', lineHeight:1.4 }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(13,148,136,0.20)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(13,148,136,0.08)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.3)'; }}>
          {s}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════════════════ */
function ChatPanel({ open, onClose, messages, onSend, onClear, loading }: any) {
  const [input, setInput] = useState('');
  const bottomRef   = useRef<any>(null);
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 120);
      setTimeout(() => textareaRef.current?.focus(), 220);
    }
  }, [open, messages.length]);

  const submit = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height='auto';
    onSend(t);
  };

  const lastAssistantIdx = messages.reduce((acc: number, m: any, i: number) => m.role==='assistant' ? i : acc, -1);

  return (
    <div style={{ position:'fixed', bottom:168, right:20, zIndex:9990, width:'min(400px, calc(100vw - 40px))', maxHeight:'76vh', background:'rgba(8,20,28,0.98)', border:'1px solid rgba(13,148,136,0.35)', borderRadius:20, boxShadow:'0 28px 72px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', transform:open?'translateY(0) scale(1)':'translateY(20px) scale(0.94)', opacity:open?1:0, pointerEvents:open?'all':'none', transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)', overflow:'hidden' }}>
      <div style={{ padding:'11px 15px', borderBottom:'1px solid rgba(13,148,136,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(13,148,136,0.05)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 7px #10b981' }}/>
          <span style={{ color:'#2dd4bf', fontWeight:700, fontSize:14 }}>PARA 👋</span>
          <span style={{ color:'#475569', fontSize:12 }}>· Your ParasitePro Guide</span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {messages.length > 1 && <button onClick={onClear} title="Fresh start" style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:5, borderRadius:7, display:'flex', alignItems:'center', transition:'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='#0d9488'} onMouseLeave={e => e.currentTarget.style.color='#475569'}><RotateCcw size={14}/></button>}
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:5, borderRadius:7, display:'flex', alignItems:'center' }}><ChevronDown size={17}/></button>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'13px 13px 7px', display:'flex', flexDirection:'column', gap:11, scrollbarWidth:'thin', scrollbarColor:'rgba(13,148,136,0.25) transparent' }}>
        {messages.map((m: any, idx: number) => (
          <div key={m.id}>
            <div style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:7 }}>
              {m.role==='assistant' && <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:2 }}><span style={{ fontSize:12 }}>🤖</span></div>}
              <div style={{ maxWidth:'84%' }}>
                <div style={{ padding:'10px 14px', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.role==='user'?'rgba(13,148,136,0.18)':'rgba(15,32,46,0.95)', border:m.role==='user'?'1px solid rgba(13,148,136,0.4)':'1px solid rgba(13,148,136,0.1)' }}>
                  {m.role==='user' ? <p style={{ color:'#f1f5f9', fontSize:14, lineHeight:1.58, margin:0, whiteSpace:'pre-wrap' }}>{m.content}</p> : <MarkdownText text={m.content}/>}
                </div>
                {m.role==='assistant' && <button onClick={() => AudioEngine.unlockAndSpeak(m.content, { rate:0.92, pitch:1.05 })} title="Listen" style={{ marginTop:4, marginLeft:2, background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:13, padding:'2px 6px', borderRadius:6, transition:'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='#0d9488'} onMouseLeave={e => e.currentTarget.style.color='#475569'}>🔊</button>}
              </div>
            </div>
            {m.role==='assistant' && idx===lastAssistantIdx && !loading && m.suggestions && <SuggestionChips suggestions={m.suggestions} onSelect={onSend} disabled={loading}/>}
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><span style={{ fontSize:12 }}>🤖</span></div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(15,32,46,0.95)', border:'1px solid rgba(13,148,136,0.1)', borderRadius:'16px 16px 16px 4px' }}>
              <div style={{ display:'flex', gap:5 }}>{[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#0d9488', animation:`para-bounce 1.1s ease-in-out ${i*0.16}s infinite` }}/>)}</div>
              <span style={{ color:'#64748b', fontSize:12 }}>PARA is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:'9px 11px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8, alignItems:'flex-end', flexShrink:0, background:'rgba(6,16,26,0.7)' }}>
        <textarea ref={textareaRef} value={input} onChange={e => { setInput(e.target.value); const ta=textareaRef.current; if(ta){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,120)+'px';} }} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();} }} placeholder="Ask PARA anything…" rows={1} style={{ flex:1, background:'rgba(15,32,46,0.9)', border:'1px solid rgba(13,148,136,0.25)', borderRadius:12, color:'#f1f5f9', fontSize:14, padding:'9px 13px', resize:'none', outline:'none', lineHeight:1.45, overflow:'hidden', fontFamily:'inherit', transition:'border-color 0.2s' }} onFocus={e => e.target.style.borderColor='rgba(13,148,136,0.6)'} onBlur={e => e.target.style.borderColor='rgba(13,148,136,0.25)'}/>
        <button onClick={submit} disabled={!input.trim()||loading} style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:input.trim()?'#0d9488':'rgba(13,148,136,0.12)', border:'none', cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', transform:input.trim()?'scale(1.04)':'scale(1)' }}><Send size={15} color={input.trim()?'white':'#475569'}/></button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FLOATING BOT
══════════════════════════════════════════════════════════════ */
function FloatingBot({ mood, speaking, muted, chatOpen, onToggleChat, onToggleMute }: any) {
  return (
    <div style={{ position:'fixed', bottom:76, right:16, zIndex:9991, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <button onClick={onToggleMute} title={muted?'Unmute':'Mute'} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(8,20,28,0.95)', border:`1px solid ${muted?'rgba(255,255,255,0.08)':'rgba(13,148,136,0.5)'}`, color:muted?'#475569':'#0d9488', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
        {muted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
      </button>
      <div onClick={onToggleChat} title="Chat with PARA" style={{ cursor:'pointer', position:'relative', animation:chatOpen?'none':'para-float 3.2s ease-in-out infinite', willChange:'transform' }}>
        {speaking && <div style={{ position:'absolute', inset:-10, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(13,148,136,0.25) 0%,transparent 70%)', animation:'para-ripple 1s ease-in-out infinite', pointerEvents:'none' }}/>}
        {!chatOpen && <div style={{ position:'absolute', top:4, right:4, width:10, height:10, borderRadius:'50%', background:'#10b981', border:'2px solid #0f172a', boxShadow:'0 0 7px #10b981', animation:'para-pulse 2s ease-in-out infinite', zIndex:1 }}/>}
        <Robot mood={mood} speaking={speaking} size={0.72}/>
      </div>
      {!chatOpen && <div style={{ background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.35)', borderRadius:10, padding:'4px 10px', whiteSpace:'nowrap', animation:'para-fadein 0.4s ease' }}><span style={{ color:'#2dd4bf', fontSize:11, fontFamily:'monospace', fontWeight:600 }}>Hi! I'm PARA 👋</span></div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE-SPECIFIC GUIDANCE (Stage 3)
══════════════════════════════════════════════════════════════ */
function getPageGuidance(path: string, isFirst: boolean, name: string, credits: number): { msg: string; suggestions: string[] } | null {
  if (!isFirst) return null;
  const n = name || 'there';
  const c = credits ?? 0;
  if (path === '/upload') return { msg:`Hey ${n}! Ready to upload? 📸 Here's how to get the best result: **good lighting** is the single most important thing — natural daylight or a bright torch works great. **Tap to focus** on the specimen before shooting. If you can, put a **coin next to it for scale**. The clearer the photo, the higher your confidence score. You have **${c} credit${c!==1?'s':''} ready to go!**`, suggestions:['What sample types can I upload?','How do credits work?','What makes a good photo?'] };
  if (path.startsWith('/analysis/')) return { msg:`Your image is being analysed right now! ⏱️ Our AI is checking **visual patterns** and comparing them against thousands of documented cases. This usually takes under 60 seconds. I'll be here when your results come in!`, suggestions:['What will the report show?','How accurate is the AI?'] };
  if (path.startsWith('/analysis-results') || path.includes('/results')) return { msg:`Your report is ready, ${n}! 🔬 I can help you understand **any section** of it — the confidence score, urgency level, what the findings mean, or next steps. Just ask me. And remember: always take these results to your GP to confirm.`, suggestions:['Explain the confidence score','What does urgency level mean?','Should I see a GP?','What are differential diagnoses?'] };
  if (path === '/pricing') return { msg:`Hey ${n}! Quick explainer on how credits work 💡 **1 credit = 1 full AI analysis**. Credits never expire, so buy whenever you're ready. We're still in beta — prices are lower right now than they'll be at launch. Lock them in while you can!`, suggestions:['What does a credit include?','Is there a free option?','Tell me about beta pricing'] };
  if (path === '/dashboard') {
    if (c === 0) return { msg:`Hey ${n}! You're out of credits — head to Pricing to top up. Credits never expire so grab a bundle whenever you're ready! 💳`, suggestions:['Take me to Pricing','How much do credits cost?','What does a credit include?'] };
    return { msg:`Hey ${n}! 👋 You've got **${c} credit${c!==1?'s':''} ready to go**. I can walk you through uploading your first sample, explain what the AI looks for, or answer any questions!`, suggestions:['Walk me through uploading','What can the AI detect?','How do I get the best photo?','How do credits work?'] };
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════
   MAIN — ParasiteBot (Stages 2 + 3)
══════════════════════════════════════════════════════════════ */
export default function ParasiteBot() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [phase,    setPhase]    = useState<Phase>('hidden');
  const [chatOpen, setChatOpen] = useState(false);
  const [mood,     setMood]     = useState<Mood>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading,  setLoading]  = useState(false);
  const idRef      = useRef(0);
  const sigRef     = useRef({ cancelled: false });
  const prevPageRef= useRef<string>('');

  const PROTECTED = ['/dashboard','/upload','/analysis','/settings','/food-diary','/treatment-tracker','/pricing','/encyclopedia','/symptom-journal'];
  const isProtected = PROTECTED.some(p => location.pathname.startsWith(p));
  const introKey = `para_intro_done_${user?.id || 'guest'}`;

  useEffect(() => {
    AudioEngine.init();
    // Allow any component to open PARA via custom event
    const handler = () => {
      if (phase === 'chat') setChatOpen(true);
    };
    window.addEventListener('para:open', handler);
    return () => window.removeEventListener('para:open', handler);
  }, [phase]);

  useEffect(() => {
    if (!isAuthenticated || !isProtected) { setPhase('hidden'); return; }
    const introDone = localStorage.getItem(introKey);
    const currentPath = location.pathname;
    if (!introDone) { setPhase('intro'); prevPageRef.current = currentPath; return; }
    setPhase('chat');
    if (prevPageRef.current === currentPath) return;
    prevPageRef.current = currentPath;
    const pageKey = `para_page_${user?.id||'guest'}_${currentPath.replace(/\//g,'-')}`;
    const isFirst = !sessionStorage.getItem(pageKey);
    if (isFirst) sessionStorage.setItem(pageKey, '1');
    const guidance = getPageGuidance(currentPath, isFirst, user?.firstName || '', user?.imageCredits ?? 0);
    if (guidance) {
      // Dashboard always opens chat — it's the home base
      const shouldAutoOpen = currentPath === '/dashboard' || isFirst;
      setTimeout(() => {
        addBot(guidance.msg, guidance.suggestions);
        if (shouldAutoOpen) setChatOpen(true);
      }, 700);
      return;
    }
    if (isFirst) sendToApi(`[SYSTEM: User navigated to ${currentPath}. Short warm greeting. Use name.`, [], 'PAGE_ARRIVE', true, false);
  }, [isAuthenticated, isProtected, location.pathname]);

  const addBot = (content: string, suggestions: string[] = []) =>
    setMessages(prev => [...prev, { role:'assistant', content, suggestions, id: ++idRef.current }]);

  const handleIntroDone = (intakeData: Record<string,string[]>) => {
    const ctx: any = {};
    ['reason','age','sex','symptoms','duration','travel','location','pets','previous','medications','sample_type','image_confidence'].forEach(k => { ctx[k] = (intakeData[k] || []).join(', '); });
    try { sessionStorage.setItem('para_health_context', JSON.stringify(ctx)); } catch {}
    localStorage.setItem(introKey, '1');
    const pageKey = `para_page_${user?.id||'guest'}_${location.pathname.replace(/\//g,'-')}`;
    sessionStorage.setItem(pageKey, '1');
    prevPageRef.current = location.pathname;
    setPhase('chat');
    setTimeout(() => setChatOpen(true), 400);
    const summary = Object.entries(ctx).map(([k,v]) => `${k}: ${v}`).join('. ');
    setTimeout(() => sendToApi(`[SYSTEM: Intake complete. ${summary}. Warm personalised first message. Use name. Suggest uploading if they have a concern.]`, [], 'INTAKE_COMPLETE', true, false), 550);
    const reason = (intakeData.reason || [])[0] || '';
    if (reason && !reason.toLowerCase().includes('exploring')) setTimeout(() => navigate('/upload'), 2200);
  };

  const handleSend = (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const history = messages.filter(m => !m.content.startsWith('[SYSTEM:')).map(m => ({ role:m.role, content:m.content }));
    setMessages(prev => [...prev, { role:'user', content:t, id:++idRef.current }]);
    sendToApi(t, history, 'USER_MESSAGE', false, false);
  };

  const handleClear = () => {
    AudioEngine.cancel(); setSpeaking(false); setMood('idle'); setMessages([]);
    addBot("Fresh start! What can I help you with? 🔬", ['Start a new analysis','Take me on a tour','How do credits work?']);
  };

  const sendToApi = async (text: string, history: any[], triggerType='USER_MESSAGE', isFirstVisit=false, noSpeak=false) => {
    setLoading(true); setMood('thinking');
    let healthContext = null;
    try { const raw = sessionStorage.getItem('para_health_context'); if (raw) healthContext = JSON.parse(raw); } catch {}
    const token = useAuthStore.getState().accessToken;
    const cu = useAuthStore.getState().user;
    const userState = { credits:cu?.imageCredits??0, imageCredits:cu?.imageCredits??0, firstName:cu?.firstName||'there', isFirstVisit };
    try {
      const res = await fetch(getApiUrl('/chatbot/message'), { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` }, body:JSON.stringify({ message:text, conversationHistory:history, healthContext, currentPage:location.pathname, userState, triggerType }) });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = res.status===401?'Session expired — please refresh.':res.status===402?"PARA's AI credits are low — try again shortly!":data.error||'Something went wrong. Try again?';
        setLoading(false); setMood('concerned');
        setMessages(prev => [...prev, { role:'assistant', content:errMsg, suggestions:['Try again','Go to dashboard'], id:++idRef.current }]);
        setTimeout(() => setMood('idle'), 2200); return;
      }
      const reply = data.message || "Sorry, had a hiccup. Try again?";
      const suggestions: string[] = Array.isArray(data.suggestions) ? data.suggestions : [];
      setLoading(false); setMood('talking'); setSpeaking(true);
      setMessages(prev => [...prev, { role:'assistant', content:reply, suggestions, id:++idRef.current }]);
      setTimeout(() => { setSpeaking(false); setMood('idle'); }, 400);
    } catch {
      setLoading(false); setMood('concerned');
      setMessages(prev => [...prev, { role:'assistant', content:"Couldn't connect just then. Check your connection and try again.", suggestions:['Try again'], id:++idRef.current }]);
      setTimeout(() => setMood('idle'), 2200);
    }
  };

  const toggleMute = () => {
    const nm = !muted; setMuted(nm);
    if (nm) { sigRef.current.cancelled=true; AudioEngine.cancel(); setSpeaking(false); }
  };

  const openChat = () => {
    setChatOpen(o => {
      const opening = !o;
      if (opening && messages.length === 0) {
        const name = useAuthStore.getState().user?.firstName || 'there';
        const credits = useAuthStore.getState().user?.imageCredits ?? 0;
        addBot(
          credits > 0 ? `Hey ${name}! 👋 You've got **${credits} credit${credits!==1?'s':''} ready to go**. What can I help you with?` : `Hey ${name}! 👋 You're out of credits — head to **Pricing** to top up!`,
          credits > 0 ? ['Start a new analysis','How do I upload?','What can you detect?'] : ['Take me to Pricing','How do credits work?','Show me a sample report']
        );
      }
      return opening;
    });
  };

  if (!isAuthenticated || !isProtected) return null;

  return (
    <>
      <style>{`
        @keyframes para-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes para-ripple { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes para-bounce { 0%,80%,100%{transform:translateY(0);opacity:0.3} 40%{transform:translateY(-8px);opacity:1} }
        @keyframes para-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes para-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      {phase==='intro' && <IntroScreen userName={user?.firstName || 'Hey you'} muted={muted} onDone={handleIntroDone}/>}
      {phase==='chat' && <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} messages={messages} onSend={handleSend} onClear={handleClear} loading={loading}/>}
      {phase==='chat' && <FloatingBot mood={mood} speaking={speaking} muted={muted} chatOpen={chatOpen} onToggleChat={openChat} onToggleMute={toggleMute}/>}
    </>
  );
}
