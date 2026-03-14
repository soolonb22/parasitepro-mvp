// @ts-nocheck
/**
 * PARA — ParasitePro AI Assistant v6.1
 * ──────────────────────────────────────────
 * • Cinematic intro (robot fly-in, feature cards, closing question)
 * • AI-generated contextual reply chips after EVERY message
 * • Full markdown rendering (bold, bullets, numbered lists)
 * • Mobile-responsive chat panel
 * • Auto-growing textarea
 * • Clear conversation button
 * • Fixed: no side-effects inside setMessages updater
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Volume2, VolumeX, ChevronDown, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised' | 'curious';
type Phase = 'hidden' | 'intro' | 'chat';
type Msg = { role: 'user' | 'assistant'; content: string; id: number; suggestions?: string[] };

/* ══════════════════════════════════════════════════════════════════
   SPEECH ENGINE
══════════════════════════════════════════════════════════════════ */
class SpeechEngine {
  private static voices: SpeechSynthesisVoice[] = [];
  private static ready = false;
  // Autoplay unlock — browsers block speechSynthesis until a user gesture fires
  private static unlocked = false;
  private static pendingAfterUnlock: (() => void) | null = null;

  /** Call once on app load. Registers a one-time gesture listener to unlock speech. */
  static init(): Promise<void> {
    return new Promise(resolve => {
      if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
      const tryLoad = () => {
        const v = window.speechSynthesis.getVoices();
        if (v.length) { this.voices = v; this.ready = true; resolve(); }
      };
      window.speechSynthesis.onvoiceschanged = tryLoad;
      tryLoad();
      setTimeout(() => { if (!this.ready) { tryLoad(); resolve(); } }, 1500);

      // Register unlock listener for autoplay policy
      const unlock = () => {
        if (this.unlocked) return;
        this.unlocked = true;
        // Fire a zero-volume utterance to warm up the speech synthesis context
        const warmup = new SpeechSynthesisUtterance('');
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
        // Fire any queued speech immediately
        if (this.pendingAfterUnlock) {
          const fn = this.pendingAfterUnlock;
          this.pendingAfterUnlock = null;
          setTimeout(fn, 120);
        }
        document.removeEventListener('click',      unlock, true);
        document.removeEventListener('touchstart', unlock, true);
        document.removeEventListener('keydown',    unlock, true);
      };
      document.addEventListener('click',      unlock, { capture: true, once: true });
      document.addEventListener('touchstart', unlock, { capture: true, once: true });
      document.addEventListener('keydown',    unlock, { capture: true, once: true });
    });
  }

  static getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.voices = window.speechSynthesis?.getVoices() || [];
    const pick = (fn) => this.voices.find(fn) ?? null;
    return (
      pick(v => /junior/i.test(v.name)) ||
      pick(v => /oliver/i.test(v.name) && v.lang.startsWith('en')) ||
      pick(v => /nicky|ryan|liam/i.test(v.name) && v.lang.startsWith('en')) ||
      pick(v => v.lang === 'en-AU' && /male|guy|boy/i.test(v.name)) ||
      pick(v => v.lang === 'en-AU' && !v.localService) ||
      pick(v => v.lang === 'en-AU') ||
      pick(v => v.lang.startsWith('en-GB') && /male|oliver/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en-US') && /male|guy|boy/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en-GB')) ||
      pick(v => v.lang.startsWith('en-US') && /alex|daniel/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en')) ||
      null
    );
  }

  static speak(text, opts: any = {}) {
    if (!window.speechSynthesis) { opts.onDone?.(); return; }
    // If speech hasn't been unlocked by a user gesture yet, queue it
    if (!this.unlocked) {
      this.pendingAfterUnlock = () => this.speak(text, opts);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[*_`#\[\]]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const rawChunks = clean.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    const chunks: string[] = [];
    let buf = '';
    for (const c of rawChunks) {
      buf = buf ? buf + ' ' + c : c;
      if (buf.split(' ').length >= 7 || c.match(/[.!?]$/)) { chunks.push(buf); buf = ''; }
    }
    if (buf) chunks.push(buf);
    if (!chunks.length) { opts.onDone?.(); return; }
    const voice = this.getBestVoice();
    const baseRate = opts.rate ?? 1.38;
    const basePitch = opts.basePitch ?? 1.55;
    let i = 0;
    const next = () => {
      if (opts.signal?.cancelled || i >= chunks.length) { opts.onDone?.(); return; }
      const chunk = chunks[i];
      const utt = new SpeechSynthesisUtterance(chunk);
      const isQ = chunk.trim().endsWith('?');
      const isE = chunk.trim().endsWith('!');
      utt.rate   = baseRate  + (Math.random() * 0.08 - 0.04) + (isQ ? 0.04 : 0) + (isE ? 0.06 : 0);
      utt.pitch  = basePitch + (Math.random() * 0.10 - 0.05) + (isQ ? 0.14 : 0) + (isE ? 0.12 : 0);
      utt.volume = 0.95;
      if (voice) utt.voice = voice;
      const pause = isQ ? 380 : isE ? 260 : 200;
      utt.onend  = () => { i++; if (opts.signal?.cancelled) { opts.onDone?.(); return; } setTimeout(next, pause); };
      utt.onerror = () => { i++; setTimeout(next, 80); };
      window.speechSynthesis.speak(utt);
    };
    next();
  }

  static cancel() { window.speechSynthesis?.cancel(); }
}

/* ══════════════════════════════════════════════════════════════════
   MARKDOWN RENDERER
══════════════════════════════════════════════════════════════════ */
function MarkdownText({ text }) {
  const lines = text.split('\n');
  const elements: any[] = [];
  let key = 0;

  const renderInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: '#f59e0b', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  for (const line of lines) {
    if (!line.trim()) {
      elements.push(<div key={key++} style={{ height: '0.5em' }} />);
      continue;
    }
    if (/^[-•*]\s/.test(line.trim())) {
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: '0.4em', alignItems: 'flex-start', marginBottom: '0.15em' }}>
          <span style={{ color: '#f59e0b', flexShrink: 0, marginTop: '0.12em' }}>•</span>
          <span>{renderInline(line.trim().replace(/^[-•*]\s/, ''))}</span>
        </div>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      const num = line.trim().match(/^(\d+)\.\s/)[1];
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: '0.5em', alignItems: 'flex-start', marginBottom: '0.15em' }}>
          <span style={{ color: '#f59e0b', flexShrink: 0, fontWeight: 600, minWidth: '1.2em' }}>{num}.</span>
          <span>{renderInline(line.trim().replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
      continue;
    }
    elements.push(<p key={key++} style={{ margin: '0 0 0.3em 0', lineHeight: 1.62 }}>{renderInline(line)}</p>);
  }

  return <div style={{ fontSize: 14, color: '#f1f5f9' }}>{elements}</div>;
}

/* ══════════════════════════════════════════════════════════════════
   ROBOT SVG
══════════════════════════════════════════════════════════════════ */
function Robot({ mood, speaking, size = 1 }) {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState(0);
  const [antGlow, setAnt] = useState(false);
  const [armOff, setArm]  = useState(0);

  useEffect(() => {
    const next = () => {
      const t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 110); next(); }, 2800 + Math.random() * 2200);
      return t;
    };
    const t = next(); return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!speaking) { setMouth(0); return; }
    const t = setInterval(() => setMouth(p => (p + 1) % 5), 130); return () => clearInterval(t);
  }, [speaking]);
  useEffect(() => {
    const t = setInterval(() => setAnt(v => !v), 900 + Math.random() * 300); return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (mood === 'waving' || mood === 'happy') {
      let dir = 1;
      const t = setInterval(() => { setArm(prev => prev + dir * 4); dir *= -1; }, 350);
      return () => clearInterval(t);
    }
    setArm(0);
  }, [mood]);

  const eyeH  = blink ? 1.5 : mood==='surprised'?14 : mood==='happy'?8 : mood==='curious'?12 : 10;
  const eyeY  = mood==='curious' ? 34 : 35;
  const eyeC  = mood==='concerned'?'#ef4444' : mood==='happy'?'#10b981' : mood==='thinking'?'#a78bfa' : mood==='curious'?'#38bdf8' : '#f59e0b';
  const ledC  = mood==='thinking'?'#a78bfa' : mood==='happy'?'#10b981' : mood==='concerned'?'#ef4444' : mood==='curious'?'#38bdf8' : '#f59e0b';
  const headBg = mood==='concerned'?'#1e3a5f' : mood==='happy'?'#0d2a1a' : mood==='thinking'?'#1a1a3e' : '#1e293b';
  const mouths = ['M 43 108 Q 50 111 57 108','M 43 107 Q 50 115 57 107','M 42 107 Q 50 118 58 107','M 43 108 Q 50 113 57 108','M 44 109 Q 50 112 56 109'];
  const mp = speaking ? mouths[mouth] : (mood==='concerned' ? 'M 43 110 Q 50 107 57 110' : mouths[0]);
  const armRot = (mood==='waving'||mood==='happy') ? -22+armOff : 0;

  return (
    <svg width={100*size} height={162*size} viewBox="0 0 100 162"
      style={{ overflow:'visible', filter:`drop-shadow(0 0 ${speaking?22:10}px ${eyeC}60)`, transition:'filter 0.3s' }}>
      <line x1="50" y1="10" x2="50" y2="23" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="50" cy="7" r="5.5" fill={antGlow?ledC:'#1e293b'} style={{ filter:antGlow?`drop-shadow(0 0 8px ${ledC})`:'none', transition:'fill 0.4s,filter 0.4s' }}/>
      <rect x="24" y="22" width="52" height="50" rx="11" fill={headBg} stroke="#334155" strokeWidth="1.5" style={{ transition:'fill 0.4s' }}/>
      <rect x="15" y="33" width="11" height="22" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <circle cx="20.5" cy="44" r="3.5" fill={ledC} opacity="0.9" style={{ filter:`drop-shadow(0 0 5px ${ledC})`, transition:'fill 0.4s' }}/>
      <rect x="74" y="33" width="11" height="22" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <circle cx="79.5" cy="44" r="3.5" fill={ledC} opacity="0.9" style={{ filter:`drop-shadow(0 0 5px ${ledC})`, transition:'fill 0.4s' }}/>
      <rect x="31" y={eyeY} width="15" height={eyeH} rx="3.5" fill={eyeC} style={{ filter:`drop-shadow(0 0 8px ${eyeC})`, transition:'height 0.08s,fill 0.3s' }}/>
      <rect x="54" y={eyeY} width="15" height={eyeH} rx="3.5" fill={eyeC} style={{ filter:`drop-shadow(0 0 8px ${eyeC})`, transition:'height 0.08s,fill 0.3s' }}/>
      {!blink && eyeH>3 && <><circle cx="37" cy={eyeY+2} r="2.5" fill="white" opacity="0.75"/><circle cx="60" cy={eyeY+2} r="2.5" fill="white" opacity="0.75"/></>}
      {mood==='thinking' && [0,1,2].map((k,i) => <circle key={k} cx={36+i*14} cy="57" r="3.5" fill="#a78bfa" opacity={0.2+0.7*((mouth+i)%3===0?1:0)} style={{ transition:'opacity 0.18s' }}/>)}
      {mood==='curious' && <path d="M 31 32 Q 38 29 46 32" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>}
      <path d={mp} fill="none" stroke={speaking?eyeC:'#64748b'} strokeWidth={speaking?3:2.2} strokeLinecap="round" style={{ filter:speaking?`drop-shadow(0 0 6px ${eyeC})`:'none', transition:'stroke 0.2s' }}/>
      {(mood==='happy'||mood==='waving') && <><ellipse cx="29" cy="59" rx="5.5" ry="3.5" fill="#f87171" opacity="0.38"/><ellipse cx="71" cy="59" rx="5.5" ry="3.5" fill="#f87171" opacity="0.38"/></>}
      <rect x="26" y="76" width="48" height="48" rx="9" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
      {[0,1,2].map(i => <circle key={i} cx={34+i*16} cy="90" r="5" fill={i===mouth%3?ledC:'#1e293b'} style={{ filter:i===mouth%3?`drop-shadow(0 0 6px ${ledC})`:'none', transition:'fill 0.14s' }}/>)}
      <rect x="32" y="100" width="36" height="16" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
      {[40,50,60].map(x => <line key={x} x1={x} y1="103" x2={x} y2="113" stroke={x===50?ledC:'#334155'} strokeWidth="1.2" opacity={x===50?0.6:1}/>)}
      <g style={{ transformOrigin:'18px 78px', transform:`rotate(${armRot}deg)`, transition:'transform 0.32s ease-in-out' }}>
        <rect x="10" y="78" width="16" height="34" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
        <circle cx="18" cy="116" r="6.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
      </g>
      <rect x="74" y="78" width="16" height="34" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
      <circle cx="82" cy="116" r="6.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
      <rect x="30" y="124" width="15" height="26" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
      <rect x="55" y="124" width="15" height="26" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
      <ellipse cx="37.5" cy="151" rx="10" ry="5.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
      <ellipse cx="62.5" cy="151" rx="10" ry="5.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INTRO SCREEN
══════════════════════════════════════════════════════════════════ */
type ScriptLine = { text: string; mood: Mood; card?: { icon: string; title: string; desc: string } | null; pauseAfter?: number };

const buildScript = (name: string): ScriptLine[] => [
  { text: `Hey ${name}! G'day — I'm PARA, your ParasitePro assistant. Really stoked you're here.`, mood: 'waving', card: null, pauseAfter: 400 },
  { text: `So ParasitePro is basically a clinical second opinion that fits in your pocket. You upload a photo of whatever's worrying you, and our AI gives you a detailed report in about 60 seconds.`, mood: 'talking', card: { icon: '🔬', title: 'AI-Powered Analysis', desc: 'Detailed report in ~60 seconds' }, pauseAfter: 350 },
  { text: `Stool samples, skin rashes, mysterious bites, bug tracks under the skin — anything you'd normally wait weeks to get a specialist to look at. We do it right now.`, mood: 'curious', card: { icon: '📸', title: 'Any Sample Type', desc: 'Stool · Skin · Environmental · Microscopy' }, pauseAfter: 300 },
  { text: `Built right here in Australia, so everything's tailored to our tropical climate, our local critters, and our healthcare system. No generic overseas advice.`, mood: 'happy', card: { icon: '🇦🇺', title: 'Made for Australians', desc: 'Queensland-aware · GP referral pathways' }, pauseAfter: 350 },
  { text: `I'll be right here whenever you need me. Ask me anything — what your results mean, what to do next, or what's actually going on.`, mood: 'happy', card: null, pauseAfter: 300 },
];

const CLOSING_QUESTION = "One quick thing — what brings you to ParasitePro today?";

const QUICK_CHIPS = [
  { label: "🪱  I think I might have worms",   reply: "I think I might have parasites or worms and I'm not sure what to do" },
  { label: "🐾  Worried about my pet",          reply: "I'm worried my pet might have worms or parasites" },
  { label: "✈️  Just back from travelling",      reply: "I just got back from overseas travel and want to check if I picked something up" },
  { label: "🩹  Strange rash or skin issue",     reply: "I have a strange rash or skin condition I want to get identified" },
  { label: "🔍  Just exploring the app",        reply: "I'm just exploring ParasitePro to see how it works" },
];

function IntroScreen({ userName, muted, onDone, onChipReply }) {
  const script = buildScript(userName);
  const [lineIdx, setLineIdx]   = useState(0);
  const [mood, setMood]         = useState<Mood>('waving');
  const [speaking, setSpeaking] = useState(false);
  const [robotY, setRobotY]     = useState(-240);
  const [overlayIn, setOverlay] = useState(false);
  const [card, setCard]         = useState(null);
  const [cardIn, setCardIn]     = useState(false);
  const [phase, setPhase]       = useState<'intro'|'question'>('intro');
  const [skippable, setSkip]    = useState(false);
  const [exitAnim, setExit]     = useState(false);
  const sig = useRef({ cancelled: false });
  const speakLineRef = useRef<(idx: number) => void>(() => {});

  useEffect(() => {
    SpeechEngine.init();
    setTimeout(() => setOverlay(true), 40);
    setTimeout(() => setRobotY(-80), 200);
    setTimeout(() => setRobotY(8),  460);
    setTimeout(() => setRobotY(-12),660);
    setTimeout(() => setRobotY(0),  840);
    setTimeout(() => setSkip(true), 2500);
    setTimeout(() => speakLineRef.current(0), 980);
    return () => { sig.current.cancelled = true; SpeechEngine.cancel(); };
  }, []);

  const speakLine = useCallback((idx) => {
    if (sig.current.cancelled) return;
    if (idx >= script.length) {
      setLineIdx(-1); setSpeaking(false); setCardIn(false);
      setTimeout(() => { setCard(null); setPhase('question'); }, 350);
      if (!muted) {
        setSpeaking(true); setMood('curious');
        SpeechEngine.speak(CLOSING_QUESTION, { rate:1.38, basePitch:1.62, signal:sig.current, onDone:()=>setSpeaking(false) });
      }
      return;
    }
    const line = script[idx];
    setLineIdx(idx); setMood(line.mood); setSpeaking(true);
    setCardIn(false);
    setTimeout(() => { setCard(line.card ?? null); if (line.card) setTimeout(() => setCardIn(true), 60); }, 300);
    if (!muted) {
      SpeechEngine.speak(line.text, { rate:1.38, basePitch:1.55, signal:sig.current,
        onDone: () => { setSpeaking(false); setTimeout(() => { if (!sig.current.cancelled) speakLineRef.current(idx+1); }, line.pauseAfter??400); }
      });
    } else {
      setTimeout(() => { if (!sig.current.cancelled) speakLineRef.current(idx+1); }, Math.max(2200, line.text.length * 28));
    }
  }, [muted, script]);

  useEffect(() => { speakLineRef.current = speakLine; }, [speakLine]);

  const triggerExit = () => { setExit(true); setTimeout(onDone, 520); };
  const skip = () => { sig.current.cancelled = true; SpeechEngine.cancel(); triggerExit(); };
  const handleChip = (chip) => { sig.current.cancelled = true; SpeechEngine.cancel(); onChipReply(chip.reply); triggerExit(); };
  const currentText = lineIdx === -1 ? CLOSING_QUESTION : (script[lineIdx]?.text ?? '');

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(10,12,16,0.97)', backdropFilter:'blur(18px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:exitAnim?0:overlayIn?1:0, transition:exitAnim?'opacity 0.5s ease':'opacity 0.45s ease', userSelect:'none' }}>
      <div style={{ position:'absolute', top:'28%', left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(217,119,6,0.12) 0%,transparent 68%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(217,119,6,0.1)', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 10px #f59e0b', animation:'para-pulse 1.8s ease-in-out infinite' }}/>
          <span style={{ color:'#f59e0b', fontFamily:'monospace', fontSize:13, letterSpacing:'0.18em', fontWeight:600 }}>PARASITEPRO · PARA v6</span>
        </div>
        {skippable && (
          <button onClick={skip} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#9ca3af', borderRadius:8, padding:'6px 14px', fontSize:13, cursor:'pointer' }}>
            Skip intro ×
          </button>
        )}
      </div>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, maxWidth:600, padding:'0 24px', position:'relative', zIndex:1, width:'100%' }}>
        <div style={{ transform:`translateY(${robotY}px)`, transition:robotY===-240?'none':'transform 0.36s cubic-bezier(0.34,1.6,0.64,1)', position:'relative' }}>
          <div style={{ animation:'para-float 3.4s ease-in-out infinite' }}>
            <Robot mood={mood} speaking={speaking} size={1.45}/>
          </div>
          {speaking && <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:140, height:24, background:'radial-gradient(ellipse,rgba(245,158,11,0.32) 0%,transparent 70%)', animation:'para-ripple 0.9s ease-in-out infinite' }}/>}
        </div>

        <div style={{ position:'relative', background:'rgba(25,35,50,0.88)', border:`1px solid rgba(217,119,6,${speaking?'0.5':'0.25'})`, borderRadius:18, padding:'22px 30px', maxWidth:560, width:'100%', textAlign:'center', backdropFilter:'blur(10px)', boxShadow:speaking?'0 0 36px rgba(217,119,6,0.18)':'0 8px 32px rgba(0,0,0,0.4)', transition:'border-color 0.3s,box-shadow 0.4s', minHeight:80 }}>
          <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'11px solid transparent', borderRight:'11px solid transparent', borderBottom:`11px solid rgba(217,119,6,${speaking?'0.5':'0.25'})` }}/>
          <p style={{ color:'#f1f5f9', fontSize:18, lineHeight:1.72, margin:0, fontWeight:400 }}>{currentText}</p>
        </div>

        <div style={{ minHeight:64, width:'100%', maxWidth:460, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {card && (
            <div style={{ display:'flex', alignItems:'center', gap:16, background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.28)', borderRadius:14, padding:'14px 22px', width:'100%', opacity:cardIn?1:0, transform:cardIn?'translateY(0) scale(1)':'translateY(10px) scale(0.97)', transition:'all 0.38s cubic-bezier(0.34,1.3,0.64,1)' }}>
              <span style={{ fontSize:30 }}>{card.icon}</span>
              <div>
                <div style={{ color:'#f59e0b', fontWeight:700, fontSize:14, marginBottom:3 }}>{card.title}</div>
                <div style={{ color:'#94a3b8', fontSize:13 }}>{card.desc}</div>
              </div>
            </div>
          )}
        </div>

        {phase === 'question' && (
          <div style={{ display:'flex', flexDirection:'column', gap:9, width:'100%', maxWidth:460, animation:'para-fadein 0.45s ease forwards', opacity:0 }}>
            <div style={{ textAlign:'center', color:'#64748b', fontSize:12, marginBottom:2, fontFamily:'monospace', letterSpacing:'0.1em' }}>TAP TO REPLY</div>
            {QUICK_CHIPS.map(chip => (
              <button key={chip.label} onClick={() => handleChip(chip)}
                style={{ background:'rgba(217,119,6,0.07)', border:'1px solid rgba(217,119,6,0.22)', color:'#e5c77a', borderRadius:12, padding:'13px 18px', fontSize:15, cursor:'pointer', textAlign:'left', transition:'all 0.18s', fontFamily:'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(217,119,6,0.15)'; e.currentTarget.style.borderColor='rgba(217,119,6,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(217,119,6,0.07)'; e.currentTarget.style.borderColor='rgba(217,119,6,0.22)'; }}>
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {phase === 'intro' && <>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(217,119,6,0.12)' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#d97706,#f59e0b)', width:`${Math.max(0,((lineIdx+1)/script.length)*100)}%`, boxShadow:'0 0 10px #f59e0b', transition:'width 0.7s ease' }}/>
        </div>
        <div style={{ position:'absolute', bottom:14, display:'flex', gap:8 }}>
          {script.map((_,i) => (
            <div key={i} style={{ width:i===lineIdx?22:7, height:7, borderRadius:4, background:i<=lineIdx?'#f59e0b':'rgba(217,119,6,0.2)', boxShadow:i===lineIdx?'0 0 8px #f59e0b':'none', transition:'all 0.32s ease' }}/>
          ))}
        </div>
      </>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SUGGESTION CHIPS
══════════════════════════════════════════════════════════════════ */
function SuggestionChips({ suggestions, onSelect, disabled }) {
  if (!suggestions || suggestions.length === 0 || disabled) return null;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:8, paddingLeft:31 }}>
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelect(s)}
          style={{ background:'rgba(217,119,6,0.07)', border:'1px solid rgba(217,119,6,0.25)', color:'#d4a843', borderRadius:20, padding:'5px 13px', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', whiteSpace:'nowrap', lineHeight:1.4 }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(217,119,6,0.18)'; e.currentTarget.style.borderColor='rgba(217,119,6,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(217,119,6,0.07)'; e.currentTarget.style.borderColor='rgba(217,119,6,0.25)'; }}>
          {s}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════════════════════ */
function ChatPanel({ open, onClose, messages, onSend, onClear, loading }) {
  const [input, setInput] = useState('');
  const bottomRef  = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 120);
      setTimeout(() => textareaRef.current?.focus(), 220);
    }
  }, [open, messages.length]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height='auto'; ta.style.height = Math.min(ta.scrollHeight, 120)+'px'; }
  };

  const submit = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height='auto';
    onSend(t);
  };

  const lastAssistantIdx = messages.reduce((acc, m, i) => m.role==='assistant' ? i : acc, -1);

  // Responsive width: full on mobile, 400px on desktop
  const panelWidth = 'min(400px, calc(100vw - 40px))';

  return (
    <div style={{ position:'fixed', bottom:112, right:20, zIndex:9990, width:panelWidth, maxHeight:'76vh', background:'rgba(12,18,30,0.98)', border:'1px solid rgba(217,119,6,0.3)', borderRadius:18, boxShadow:'0 28px 72px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', transform:open?'translateY(0) scale(1)':'translateY(20px) scale(0.94)', opacity:open?1:0, pointerEvents:open?'all':'none', transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(217,119,6,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(217,119,6,0.04)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 7px #10b981' }}/>
          <span style={{ color:'#f1f5f9', fontWeight:700, fontSize:14 }}>PARA</span>
          <span style={{ color:'#475569', fontSize:12 }}>· ParasitePro Assistant</span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {messages.length > 1 && (
            <button onClick={onClear} title="Start fresh"
              style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:5, borderRadius:7, display:'flex', alignItems:'center', transition:'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='#f59e0b'}
              onMouseLeave={e => e.currentTarget.style.color='#475569'}>
              <RotateCcw size={14}/>
            </button>
          )}
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:5, borderRadius:7, display:'flex', alignItems:'center' }}>
            <ChevronDown size={17}/>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 8px', display:'flex', flexDirection:'column', gap:12, scrollbarWidth:'thin', scrollbarColor:'rgba(217,119,6,0.2) transparent' }}>
        {messages.map((m, idx) => (
          <div key={m.id}>
            <div style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:7 }}>
              {m.role==='assistant' && (
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(217,119,6,0.15)', border:'1px solid rgba(217,119,6,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:2 }}>
                  <span style={{ fontSize:12 }}>🤖</span>
                </div>
              )}
              <div style={{ maxWidth:'84%', padding:'10px 14px', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.role==='user'?'rgba(217,119,6,0.16)':'rgba(30,41,59,0.9)', border:m.role==='user'?'1px solid rgba(217,119,6,0.3)':'1px solid rgba(255,255,255,0.06)' }}>
                {m.role==='user'
                  ? <p style={{ color:'#f1f5f9', fontSize:14, lineHeight:1.58, margin:0, whiteSpace:'pre-wrap' }}>{m.content}</p>
                  : <MarkdownText text={m.content}/>
                }
              </div>
            </div>
            {m.role==='assistant' && idx===lastAssistantIdx && !loading && m.suggestions && (
              <SuggestionChips suggestions={m.suggestions} onSelect={onSend} disabled={loading}/>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(217,119,6,0.15)', border:'1px solid rgba(217,119,6,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:12 }}>🤖</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(30,41,59,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px 16px 16px 4px' }}>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#f59e0b', animation:`para-bounce 1.1s ease-in-out ${i*0.16}s infinite` }}/>)}
              </div>
              <span style={{ color:'#64748b', fontSize:12 }}>PARA is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8, alignItems:'flex-end', flexShrink:0, background:'rgba(8,14,26,0.7)' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask PARA anything… (Enter to send)"
          rows={1}
          style={{ flex:1, background:'rgba(25,38,58,0.9)', border:'1px solid rgba(217,119,6,0.18)', borderRadius:11, color:'#f1f5f9', fontSize:14, padding:'9px 13px', resize:'none', outline:'none', lineHeight:1.45, overflow:'hidden', fontFamily:'inherit', transition:'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor='rgba(217,119,6,0.45)'}
          onBlur={e => e.target.style.borderColor='rgba(217,119,6,0.18)'}
        />
        <button onClick={submit} disabled={!input.trim()||loading}
          style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:input.trim()?'#f59e0b':'rgba(245,158,11,0.14)', border:'none', cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', transform:input.trim()?'scale(1.04)':'scale(1)' }}>
          <Send size={15} color={input.trim()?'#0f172a':'#475569'}/>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FLOATING BOT BUTTON
══════════════════════════════════════════════════════════════════ */
function FloatingBot({ mood, speaking, muted, chatOpen, onToggleChat, onToggleMute }) {
  return (
    <div style={{ position:'fixed', bottom:18, right:18, zIndex:9991, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <button onClick={onToggleMute} title={muted?'Unmute PARA':'Mute PARA'}
        style={{ width:32, height:32, borderRadius:'50%', background:'rgba(12,22,40,0.95)', border:`1px solid ${muted?'rgba(255,255,255,0.08)':'rgba(217,119,6,0.4)'}`, color:muted?'#475569':'#f59e0b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
        {muted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
      </button>
      <div onClick={onToggleChat} title="Chat with PARA"
        style={{ cursor:'pointer', position:'relative', animation:chatOpen?'none':'para-float 3.2s ease-in-out infinite', willChange:'transform' }}>
        {speaking && <div style={{ position:'absolute', inset:-10, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(245,158,11,0.28) 0%,transparent 70%)', animation:'para-ripple 1s ease-in-out infinite', pointerEvents:'none' }}/>}
        {!chatOpen && <div style={{ position:'absolute', top:4, right:4, width:10, height:10, borderRadius:'50%', background:'#10b981', border:'2px solid #0f172a', boxShadow:'0 0 7px #10b981', animation:'para-pulse 2s ease-in-out infinite', zIndex:1 }}/>}
        <Robot mood={mood} speaking={speaking} size={0.72}/>
      </div>
      {!chatOpen && (
        <div style={{ background:'rgba(217,119,6,0.12)', border:'1px solid rgba(217,119,6,0.3)', borderRadius:8, padding:'3px 8px', whiteSpace:'nowrap', animation:'para-fadein 0.4s ease' }}>
          <span style={{ color:'#f59e0b', fontSize:11, fontFamily:'monospace', fontWeight:600 }}>PARA</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
export default function ParasiteBot() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [phase, setPhase]         = useState<Phase>('hidden');
  const [chatOpen, setChatOpen]   = useState(false);
  const [mood, setMood]           = useState<Mood>('idle');
  const [speaking, setSpeaking]   = useState(false);
  const [muted, setMuted]         = useState(false);
  const [messages, setMessages]   = useState<Msg[]>([]);
  const [loading, setLoading]     = useState(false);
  const idRef  = useRef(0);
  const sigRef = useRef({ cancelled: false });

  const PROTECTED = ['/dashboard','/upload','/analysis','/settings','/food-diary','/treatment-tracker','/pricing','/encyclopedia','/symptom-journal','/treatment-tracker'];
  const isProtected = PROTECTED.some(p => location.pathname.startsWith(p));
  const prevPageRef = useRef<string>('');

  useEffect(() => { SpeechEngine.init(); }, []);

  // ── Page-arrival guide: fires AI greeting when user navigates to a new protected page ──
  useEffect(() => {
    if (!isAuthenticated || !isProtected) { setPhase('hidden'); return; }

    const introKey = `para_intro_${user?.id||'guest'}`;
    const currentPath = location.pathname;

    if (!sessionStorage.getItem(introKey)) {
      setPhase('intro');
      prevPageRef.current = currentPath;
      return;
    }

    setPhase('chat');

    // Only fire a page-arrival message when the page actually changed
    if (prevPageRef.current === currentPath) return;
    prevPageRef.current = currentPath;

    // Determine if this is the user's first ever session greeting
    const greetedKey = `para_greeted_${user?.id||'guest'}`;
    const isFirstSession = !sessionStorage.getItem(greetedKey);
    if (isFirstSession) sessionStorage.setItem(greetedKey, '1');

    // Has this page been visited before this session?
    const pageKey = `para_page_${user?.id||'guest'}_${currentPath.replace(/\//g,'-')}`;
    const isFirstPageVisit = !sessionStorage.getItem(pageKey);
    if (isFirstPageVisit) sessionStorage.setItem(pageKey, '1');

    // Fire a page-arrival AI message (no speech — browser blocks auto-play without user gesture)
    sendToApi(
      `[SYSTEM: User just navigated to ${currentPath}. Give a short, warm, page-specific guide greeting. Use their credit balance and name.]`,
      [],
      'PAGE_ARRIVE',
      isFirstPageVisit,
      true  // noSpeak — auto-triggered, no user gesture
    );
  }, [isAuthenticated, isProtected, location.pathname]);

  const addBot = (content: string, suggestions: string[] = []) =>
    setMessages(prev => [...prev, { role:'assistant', content, suggestions, id: ++idRef.current }]);

  const handleIntroDone = () => {
    sessionStorage.setItem(`para_intro_${user?.id||'guest'}`, '1');
    sessionStorage.setItem(`para_greeted_${user?.id||'guest'}`, '1');
    const pageKey = `para_page_${user?.id||'guest'}_${location.pathname.replace(/\//g,'-')}`;
    sessionStorage.setItem(pageKey, '1');
    setPhase('chat');
    prevPageRef.current = location.pathname;
    setTimeout(() => setChatOpen(true), 400);
    setTimeout(() => sendToApi(
      `[SYSTEM: User just completed onboarding and arrived at the dashboard for the first time. Give them a warm welcome and tell them their first step.]`,
      [],
      'PAGE_ARRIVE',
      true,
      true  // noSpeak
    ), 600);
  };

  const handleChipReply = (replyText: string) => {
    sessionStorage.setItem(`para_intro_${user?.id||'guest'}`, '1');
    setPhase('chat');
    setChatOpen(true);
    const isTour = replyText.toLowerCase().includes('tour') || replyText.toLowerCase().includes('show me around');
    const userMsg: Msg = { role:'user', content:replyText, id: ++idRef.current };
    setMessages([userMsg]);
    sendToApi(replyText, [], isTour ? 'TOUR_START' : 'USER_MESSAGE', false);
  };

  const handleSend = (text: string) => {
    const isTour = text.toLowerCase().includes('tour') || text.toLowerCase().includes('show me around');
    const userMsg: Msg = { role:'user', content:text, id: ++idRef.current };
    setMessages(prev => [...prev, userMsg]);
    setMessages(current => {
      const history = current.map(m => ({ role: m.role, content: m.content }));
      sendToApi(text, history.slice(0, -1), isTour ? 'TOUR_START' : 'USER_MESSAGE', false);
      return current;
    });
  };

  const handleClear = () => {
    SpeechEngine.cancel();
    setSpeaking(false);
    setMood('idle');
    setMessages([]);
    addBot(
      "Fresh start! What can I help you with? 🔬",
      ['Start a new analysis', 'Show me around the app', 'How do credits work?']
    );
  };

  const sendToApi = async (
    text: string,
    history: {role:string;content:string}[],
    triggerType: string = 'USER_MESSAGE',
    isFirstVisit: boolean = false,
    noSpeak: boolean = false
  ) => {
    setLoading(true);
    setMood('thinking');

    let healthContext = null;
    try {
      const raw = sessionStorage.getItem('para_health_context');
      if (raw) healthContext = JSON.parse(raw);
    } catch { /* ignore */ }

    const token = useAuthStore.getState().accessToken;

    // Build userState from auth store
    const currentUser = useAuthStore.getState().user;
    const userState = {
      credits: currentUser?.imageCredits ?? 0,
      imageCredits: currentUser?.imageCredits ?? 0,
      firstName: currentUser?.firstName || 'there',
      isFirstVisit,
    };

    try {
      const res = await fetch(getApiUrl('/api/chatbot/message'), {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
        body:JSON.stringify({
          message: text,
          conversationHistory: history,
          healthContext,
          currentPage: location.pathname,
          userState,
          triggerType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = res.status===401
          ? 'Session expired — please refresh and log in again.'
          : res.status===402
          ? "PARA's AI credits are low. Fallon will top them up soon — try again shortly!"
          : data.error || 'Something went wrong on my end. Try again in a sec?';
        setLoading(false);
        setMood('concerned');
        setMessages(prev => [...prev, { role:'assistant', content:errMsg, suggestions:['Try again','Go to dashboard'], id:++idRef.current }]);
        setTimeout(() => setMood('idle'), 2200);
        return;
      }

      const reply = data.message || "Sorry, had a little hiccup there. Try again in a sec?";
      const suggestions: string[] = Array.isArray(data.suggestions) ? data.suggestions : [];

      setLoading(false);
      setMood('talking');
      setSpeaking(true);
      setMessages(prev => [...prev, { role:'assistant', content:reply, suggestions, id:++idRef.current }]);

      if (!muted && !noSpeak) {
        sigRef.current = { cancelled:false };
        SpeechEngine.speak(reply, { rate:1.38, basePitch:1.55, signal:sigRef.current, onDone:()=>{ setSpeaking(false); setMood('idle'); } });
      } else {
        setTimeout(() => { setSpeaking(false); setMood('idle'); }, 500);
      }
    } catch {
      setLoading(false);
      setMood('concerned');
      setMessages(prev => [...prev, { role:'assistant', content:"Couldn't connect just then. Check your connection and try again.", suggestions:['Try again'], id:++idRef.current }]);
      setTimeout(() => setMood('idle'), 2200);
    }
  };

  const toggleMute = () => {
    const nm = !muted;
    setMuted(nm);
    if (nm) { sigRef.current.cancelled=true; SpeechEngine.cancel(); setSpeaking(false); }
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

      {phase==='intro' && <IntroScreen userName={user?.firstName||'there'} muted={muted} onDone={handleIntroDone} onChipReply={handleChipReply}/>}
      {phase==='chat' && <ChatPanel open={chatOpen} onClose={()=>setChatOpen(false)} messages={messages} onSend={handleSend} onClear={handleClear} loading={loading}/>}
      {phase==='chat' && <FloatingBot mood={mood} speaking={speaking} muted={muted} chatOpen={chatOpen} onToggleChat={()=>setChatOpen(o=>!o)} onToggleMute={toggleMute}/>}
    </>
  );
}
