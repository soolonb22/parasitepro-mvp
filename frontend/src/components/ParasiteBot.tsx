// @ts-nocheck
/**
 * PARA — ParasitePro AI Assistant v5
 * ─────────────────────────────────────
 * • Cinematic full-screen intro that blocks dashboard until dismissed
 * • Robot flies in from the top with spring physics
 * • Natural, conversational Australian voice (chunked, varied pace)
 * • Interactive — robot asks a question; user taps a chip reply
 * • Smooth fade-out reveals dashboard beneath
 * • Persistent floating chatbot with mood expressions
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised' | 'curious';
type Phase = 'hidden' | 'intro' | 'chat';
type Msg = { role: 'user' | 'assistant'; content: string; id: number };

/* ══════════════════════════════════════════════════════════════════
   SPEECH ENGINE
══════════════════════════════════════════════════════════════════ */
class SpeechEngine {
  private static voices: SpeechSynthesisVoice[] = [];
  private static ready = false;

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
    });
  }

  static getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.voices = window.speechSynthesis?.getVoices() || [];
    const pick = (fn: (v: SpeechSynthesisVoice) => boolean) => this.voices.find(fn) ?? null;
    return (
      pick(v => v.lang === 'en-AU' && !v.localService) ||
      pick(v => v.lang === 'en-AU') ||
      pick(v => v.lang.startsWith('en-GB') && /karen|serena|moira|female|woman/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en-GB')) ||
      pick(v => v.lang === 'en-US' && /samantha|zoe|ava/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en-US') && v.name.includes('Female')) ||
      pick(v => v.lang.startsWith('en')) ||
      null
    );
  }

  static speak(
    text: string,
    opts: {
      rate?: number;
      basePitch?: number;
      signal?: { cancelled: boolean };
      onDone?: () => void;
    } = {}
  ) {
    if (!window.speechSynthesis) { opts.onDone?.(); return; }
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
    const baseRate = opts.rate ?? 0.84;
    const basePitch = opts.basePitch ?? 1.02;
    let i = 0;

    const next = () => {
      if (opts.signal?.cancelled || i >= chunks.length) { opts.onDone?.(); return; }
      const chunk = chunks[i];
      const utt = new SpeechSynthesisUtterance(chunk);
      const isQ = chunk.trim().endsWith('?');
      const isE = chunk.trim().endsWith('!');
      utt.rate   = baseRate + (Math.random() * 0.06 - 0.03) + (isQ ? 0.02 : 0);
      utt.pitch  = basePitch + (Math.random() * 0.08 - 0.04) + (isQ ? 0.09 : 0) + (isE ? 0.05 : 0);
      utt.volume = 0.92;
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
   ROBOT SVG
══════════════════════════════════════════════════════════════════ */
function Robot({ mood, speaking, size = 1 }: { mood: Mood; speaking: boolean; size?: number }) {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState(0);
  const [antGlow, setAnt] = useState(false);
  const [armOff, setArm]  = useState(0);

  useEffect(() => {
    const next = () => {
      const delay = 2800 + Math.random() * 2200;
      const t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 110); next(); }, delay);
      return t;
    };
    const t = next();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!speaking) { setMouth(0); return; }
    const t = setInterval(() => setMouth(p => (p + 1) % 5), 130);
    return () => clearInterval(t);
  }, [speaking]);

  useEffect(() => {
    const t = setInterval(() => setAnt(v => !v), 900 + Math.random() * 300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (mood === 'waving' || mood === 'happy') {
      let dir = 1;
      const t = setInterval(() => { setArm(prev => prev + dir * 4); dir *= -1; }, 350);
      return () => clearInterval(t);
    }
    setArm(0);
  }, [mood]);

  const eyeH   = blink ? 1.5 : mood === 'surprised' ? 14 : mood === 'happy' ? 8 : mood === 'curious' ? 12 : 10;
  const eyeY   = mood === 'curious' ? 34 : 35;
  const eyeC   = mood === 'concerned' ? '#ef4444' : mood === 'happy' ? '#10b981' : mood === 'thinking' ? '#a78bfa' : mood === 'curious' ? '#38bdf8' : '#f59e0b';
  const ledC   = mood === 'thinking' ? '#a78bfa' : mood === 'happy' ? '#10b981' : mood === 'concerned' ? '#ef4444' : mood === 'curious' ? '#38bdf8' : '#f59e0b';
  const headBg = mood === 'concerned' ? '#1e3a5f' : mood === 'happy' ? '#0d2a1a' : mood === 'thinking' ? '#1a1a3e' : '#1e293b';

  const mouths = [
    'M 43 108 Q 50 111 57 108',
    'M 43 107 Q 50 115 57 107',
    'M 42 107 Q 50 118 58 107',
    'M 43 108 Q 50 113 57 108',
    'M 44 109 Q 50 112 56 109',
  ];
  const mp = speaking ? mouths[mouth] : (mood === 'concerned' ? 'M 43 110 Q 50 107 57 110' : mouths[0]);
  const armRot = (mood === 'waving' || mood === 'happy') ? -22 + armOff : 0;

  return (
    <svg width={100 * size} height={162 * size} viewBox="0 0 100 162"
      style={{ overflow:'visible', filter:`drop-shadow(0 0 ${speaking?22:10}px ${eyeC}60)`, transition:'filter 0.3s' }}>
      <line x1="50" y1="10" x2="50" y2="23" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="7" r="5.5" fill={antGlow ? ledC : '#1e293b'}
        style={{ filter:antGlow?`drop-shadow(0 0 8px ${ledC})`:'none', transition:'fill 0.4s, filter 0.4s' }} />
      <rect x="24" y="22" width="52" height="50" rx="11" fill={headBg} stroke="#334155" strokeWidth="1.5"
        style={{ transition:'fill 0.4s' }} />
      <rect x="15" y="33" width="11" height="22" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <circle cx="20.5" cy="44" r="3.5" fill={ledC} opacity="0.9" style={{ filter:`drop-shadow(0 0 5px ${ledC})`, transition:'fill 0.4s' }} />
      <rect x="74" y="33" width="11" height="22" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <circle cx="79.5" cy="44" r="3.5" fill={ledC} opacity="0.9" style={{ filter:`drop-shadow(0 0 5px ${ledC})`, transition:'fill 0.4s' }} />
      <rect x="31" y={eyeY} width="15" height={eyeH} rx="3.5" fill={eyeC}
        style={{ filter:`drop-shadow(0 0 8px ${eyeC})`, transition:'height 0.08s, fill 0.3s' }} />
      <rect x="54" y={eyeY} width="15" height={eyeH} rx="3.5" fill={eyeC}
        style={{ filter:`drop-shadow(0 0 8px ${eyeC})`, transition:'height 0.08s, fill 0.3s' }} />
      {!blink && eyeH > 3 && <>
        <circle cx="37" cy={eyeY+2} r="2.5" fill="white" opacity="0.75" />
        <circle cx="60" cy={eyeY+2} r="2.5" fill="white" opacity="0.75" />
      </>}
      {mood === 'thinking' && [0,1,2].map((k,i) => (
        <circle key={k} cx={36+i*14} cy="57" r="3.5" fill="#a78bfa"
          opacity={0.2+0.7*((mouth+i)%3===0?1:0)} style={{ transition:'opacity 0.18s' }} />
      ))}
      {mood === 'curious' && <path d="M 31 32 Q 38 29 46 32" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />}
      <path d={mp} fill="none" stroke={speaking?eyeC:'#64748b'} strokeWidth={speaking?3:2.2} strokeLinecap="round"
        style={{ filter:speaking?`drop-shadow(0 0 6px ${eyeC})`:'none', transition:'stroke 0.2s' }} />
      {(mood==='happy'||mood==='waving') && <>
        <ellipse cx="29" cy="59" rx="5.5" ry="3.5" fill="#f87171" opacity="0.38" />
        <ellipse cx="71" cy="59" rx="5.5" ry="3.5" fill="#f87171" opacity="0.38" />
      </>}
      <rect x="26" y="76" width="48" height="48" rx="9" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      {[0,1,2].map(i => (
        <circle key={i} cx={34+i*16} cy="90" r="5"
          fill={i===mouth%3?ledC:'#1e293b'}
          style={{ filter:i===mouth%3?`drop-shadow(0 0 6px ${ledC})`:'none', transition:'fill 0.14s' }} />
      ))}
      <rect x="32" y="100" width="36" height="16" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {[40,50,60].map(x => (
        <line key={x} x1={x} y1="103" x2={x} y2="113" stroke={x===50?ledC:'#334155'} strokeWidth="1.2" opacity={x===50?0.6:1} />
      ))}
      <g style={{ transformOrigin:'18px 78px', transform:`rotate(${armRot}deg)`, transition:'transform 0.32s ease-in-out' }}>
        <rect x="10" y="78" width="16" height="34" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
        <circle cx="18" cy="116" r="6.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      </g>
      <rect x="74" y="78" width="16" height="34" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <circle cx="82" cy="116" r="6.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <rect x="30" y="124" width="15" height="26" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <rect x="55" y="124" width="15" height="26" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <ellipse cx="37.5" cy="151" rx="10" ry="5.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <ellipse cx="62.5" cy="151" rx="10" ry="5.5" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INTRO SCRIPT
══════════════════════════════════════════════════════════════════ */
type ScriptLine = { text: string; mood: Mood; card?: { icon: string; title: string; desc: string } | null; pauseAfter?: number; };

const buildScript = (name: string): ScriptLine[] => [
  { text: `Hey ${name}! G'day — I'm PARA, short for Parasite Analysis and Response Assistant. Really happy you're here.`, mood: 'waving', card: null, pauseAfter: 500 },
  { text: `So — what is ParasitePro exactly? Think of it as a clinical second opinion that fits in your pocket. You upload a photo of whatever's worrying you, and our AI gives you a detailed report in about sixty seconds.`, mood: 'talking', card: { icon: '🔬', title: 'AI-Powered Clinical Analysis', desc: 'Results in ~60 seconds — from your phone' }, pauseAfter: 400 },
  { text: `We're talking stool samples, skin rashes, mysterious bites, bug tracks under the skin — anything you'd normally wait weeks to get a specialist to look at. We analyse it right now.`, mood: 'curious', card: { icon: '📸', title: 'Any Sample Type', desc: 'Stool · Skin · Environmental · Microscopy · Blood smear' }, pauseAfter: 350 },
  { text: `The report you get back is proper clinical stuff — not just a guess. It tells you what it most likely is, how urgent it is, and exactly what to do next. Whether that's heading to the GP or just keeping an eye on it.`, mood: 'thinking', card: { icon: '📋', title: 'Full Structured Report', desc: 'Diagnosis · Confidence · Urgency rating · Next steps' }, pauseAfter: 350 },
  { text: `Built right here in Australia, by the way. So the recommendations are tailored to our tropical climate, our local critters, and our healthcare system. No generic overseas advice.`, mood: 'happy', card: { icon: '🇦🇺', title: 'Made for Australians', desc: 'Tropical species · Australian GP referral pathways' }, pauseAfter: 400 },
  { text: `I'll be right here in the corner if you need me. Ask me anything — your results, what to do next, or if something looks a bit off and you're not sure where to start.`, mood: 'happy', card: null, pauseAfter: 300 },
];

const CLOSING_QUESTION = "One quick thing before we get into it — what brings you to ParasitePro today?";

const QUICK_CHIPS = [
  { label: "🪱  I think I might have worms",   reply: "I think I might have parasites or worms" },
  { label: "🐾  Worried about my pet",          reply: "I'm worried my pet might have worms or parasites" },
  { label: "✈️  Just back from travelling",      reply: "I just got back from overseas travel and want to check if I picked something up" },
  { label: "🩹  Strange rash or skin thing",     reply: "I have a strange rash or skin condition I want identified" },
  { label: "🔍  Just exploring the app",        reply: "I'm just exploring the app to see how it works" },
];

/* ══════════════════════════════════════════════════════════════════
   INTRO SCREEN
══════════════════════════════════════════════════════════════════ */
function IntroScreen({ userName, muted, onDone, onChipReply }: { userName: string; muted: boolean; onDone: () => void; onChipReply: (r: string) => void; }) {
  const script = buildScript(userName);
  const [lineIdx, setLineIdx]   = useState(0);
  const [mood, setMood]         = useState<Mood>('waving');
  const [speaking, setSpeaking] = useState(false);
  const [robotY, setRobotY]     = useState(-240);
  const [overlayIn, setOverlay] = useState(false);
  const [card, setCard]         = useState<ScriptLine['card']>(null);
  const [cardIn, setCardIn]     = useState(false);
  const [phase, setPhase]       = useState<'intro'|'question'>('intro');
  const [skippable, setSkip]    = useState(false);
  const [exitAnim, setExit]     = useState(false);
  const sig = useRef({ cancelled: false });

  useEffect(() => {
    SpeechEngine.init();
    setTimeout(() => setOverlay(true), 40);
    setTimeout(() => setRobotY(-80), 200);
    setTimeout(() => setRobotY(8),  460);
    setTimeout(() => setRobotY(-12),660);
    setTimeout(() => setRobotY(0),  840);
    setTimeout(() => setSkip(true), 3200);
    setTimeout(() => speakLine(0),  980);
    return () => { sig.current.cancelled = true; SpeechEngine.cancel(); };
  }, []);

  const speakLine = useCallback((idx: number) => {
    if (sig.current.cancelled) return;
    if (idx >= script.length) {
      setLineIdx(-1); setSpeaking(false); setCardIn(false);
      setTimeout(() => { setCard(null); setPhase('question'); }, 350);
      if (!muted) {
        setSpeaking(true); setMood('curious');
        SpeechEngine.speak(CLOSING_QUESTION, { rate: 0.84, basePitch: 1.06, signal: sig.current, onDone: () => setSpeaking(false) });
      }
      return;
    }
    const line = script[idx];
    setLineIdx(idx); setMood(line.mood); setSpeaking(true);
    setCardIn(false);
    setTimeout(() => { setCard(line.card ?? null); if (line.card) setTimeout(() => setCardIn(true), 60); }, 300);
    if (!muted) {
      SpeechEngine.speak(line.text, { rate: 0.84, basePitch: 1.02, signal: sig.current,
        onDone: () => { setSpeaking(false); setTimeout(() => { if (!sig.current.cancelled) speakLine(idx+1); }, line.pauseAfter ?? 400); }
      });
    } else {
      setTimeout(() => { if (!sig.current.cancelled) speakLine(idx+1); }, Math.max(2800, line.text.length * 32));
    }
  }, [muted, script]);

  const triggerExit = () => { setExit(true); setTimeout(onDone, 520); };
  const skip = () => { sig.current.cancelled = true; SpeechEngine.cancel(); triggerExit(); };
  const handleChip = (chip: typeof QUICK_CHIPS[0]) => { sig.current.cancelled = true; SpeechEngine.cancel(); onChipReply(chip.reply); triggerExit(); };

  const currentText = lineIdx === -1 ? CLOSING_QUESTION : (script[lineIdx]?.text ?? '');

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(10,12,16,0.97)', backdropFilter:'blur(18px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity: exitAnim?0:overlayIn?1:0, transition: exitAnim?'opacity 0.5s ease':'opacity 0.45s ease', userSelect:'none' }}>
      <div style={{ position:'absolute', top:'28%', left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(217,119,6,0.12) 0%, transparent 68%)', pointerEvents:'none' }} />

      {/* Top bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(217,119,6,0.1)', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 10px #f59e0b', animation:'para-pulse 1.8s ease-in-out infinite' }} />
          <span style={{ color:'#f59e0b', fontFamily:'monospace', fontSize:13, letterSpacing:'0.18em', fontWeight:600 }}>PARASITEPRO · PARA v5</span>
        </div>
        {skippable && (
          <button onClick={skip} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#9ca3af', borderRadius:8, padding:'6px 14px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            Skip intro ×
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:26, maxWidth:600, padding:'0 24px', position:'relative', zIndex:1, width:'100%' }}>

        {/* Robot flies in */}
        <div style={{ transform:`translateY(${robotY}px)`, transition: robotY === -240 ? 'none' : 'transform 0.36s cubic-bezier(0.34,1.6,0.64,1)', position:'relative' }}>
          <div style={{ animation:'para-float 3.4s ease-in-out infinite' }}>
            <Robot mood={mood} speaking={speaking} size={1.45} />
          </div>
          {speaking && <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:140, height:24, background:'radial-gradient(ellipse, rgba(245,158,11,0.32) 0%, transparent 70%)', animation:'para-ripple 0.9s ease-in-out infinite' }} />}
        </div>

        {/* Speech bubble */}
        <div style={{ position:'relative', background:'rgba(25,35,50,0.88)', border:`1px solid rgba(217,119,6,${speaking?'0.5':'0.25'})`, borderRadius:18, padding:'22px 30px', maxWidth:560, width:'100%', textAlign:'center', backdropFilter:'blur(10px)', boxShadow: speaking?'0 0 36px rgba(217,119,6,0.18)':'0 8px 32px rgba(0,0,0,0.4)', transition:'border-color 0.3s, box-shadow 0.4s', minHeight:80 }}>
          <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'11px solid transparent', borderRight:'11px solid transparent', borderBottom:`11px solid rgba(217,119,6,${speaking?'0.5':'0.25'})` }} />
          <p style={{ color:'#f1f5f9', fontSize:18, lineHeight:1.72, margin:0, fontWeight:400, letterSpacing:'0.01em' }}>{currentText}</p>
        </div>

        {/* Feature card */}
        <div style={{ minHeight:64, width:'100%', maxWidth:460, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {card && (
            <div style={{ display:'flex', alignItems:'center', gap:16, background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.28)', borderRadius:14, padding:'14px 22px', width:'100%', opacity: cardIn?1:0, transform: cardIn?'translateY(0) scale(1)':'translateY(10px) scale(0.97)', transition:'all 0.38s cubic-bezier(0.34,1.3,0.64,1)' }}>
              <span style={{ fontSize:30 }}>{card.icon}</span>
              <div>
                <div style={{ color:'#f59e0b', fontWeight:700, fontSize:14, marginBottom:3 }}>{card.title}</div>
                <div style={{ color:'#94a3b8', fontSize:13 }}>{card.desc}</div>
              </div>
            </div>
          )}
        </div>

        {/* Chip replies */}
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

      {/* Progress */}
      {phase === 'intro' && <>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(217,119,6,0.12)' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#d97706,#f59e0b)', width:`${Math.max(0,((lineIdx+1)/script.length)*100)}%`, boxShadow:'0 0 10px #f59e0b', transition:'width 0.7s ease' }} />
        </div>
        <div style={{ position:'absolute', bottom:14, display:'flex', gap:8 }}>
          {script.map((_,i) => (
            <div key={i} style={{ width:i===lineIdx?22:7, height:7, borderRadius:4, background:i<=lineIdx?'#f59e0b':'rgba(217,119,6,0.2)', boxShadow:i===lineIdx?'0 0 8px #f59e0b':'none', transition:'all 0.32s ease' }} />
          ))}
        </div>
      </>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════════════════════ */
function ChatPanel({ open, onClose, messages, onSend, loading }: { open:boolean; onClose:()=>void; messages:Msg[]; onSend:(t:string)=>void; loading:boolean; }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 120);
      setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [open, messages.length]);

  const submit = () => { const t=input.trim(); if(!t||loading)return; setInput(''); onSend(t); };

  const quickReplies = messages.length <= 1
    ? ['🔬 How does the analysis work?', '💰 How do credits work?', '🚨 When should I see a doctor urgently?', '🐾 Can I use this for my pet?']
    : messages.length <= 3
    ? ['📸 How do I take a good photo?', '📍 Common parasites in Queensland?']
    : [];

  return (
    <div style={{ position:'fixed', bottom:112, right:20, zIndex:9990, width:360, maxHeight:'72vh', background:'rgba(12,18,30,0.98)', border:'1px solid rgba(217,119,6,0.3)', borderRadius:18, boxShadow:'0 28px 72px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', transform:open?'translateY(0) scale(1)':'translateY(20px) scale(0.94)', opacity:open?1:0, pointerEvents:open?'all':'none', transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)', overflow:'hidden' }}>
      <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(217,119,6,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(217,119,6,0.04)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 7px #10b981' }} />
          <span style={{ color:'#f1f5f9', fontWeight:700, fontSize:14 }}>PARA</span>
          <span style={{ color:'#475569', fontSize:12 }}>· ParasitePro Assistant</span>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:5, borderRadius:7, display:'flex', alignItems:'center' }}>
          <ChevronDown size={17} />
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px 13px', display:'flex', flexDirection:'column', gap:10, scrollbarWidth:'thin', scrollbarColor:'rgba(217,119,6,0.2) transparent' }}>
        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:6 }}>
            {m.role==='assistant' && <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(217,119,6,0.15)', border:'1px solid rgba(217,119,6,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:2 }}><span style={{ fontSize:11 }}>🤖</span></div>}
            <div style={{ maxWidth:'83%', padding:'10px 14px', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.role==='user'?'rgba(217,119,6,0.16)':'rgba(30,41,59,0.9)', border:m.role==='user'?'1px solid rgba(217,119,6,0.3)':'1px solid rgba(255,255,255,0.06)', color:'#f1f5f9', fontSize:14, lineHeight:1.58, whiteSpace:'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 0' }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(217,119,6,0.15)', border:'1px solid rgba(217,119,6,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><span style={{ fontSize:11 }}>🤖</span></div>
            <div style={{ display:'flex', gap:5, padding:'10px 14px', background:'rgba(30,41,59,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px 16px 16px 4px' }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#f59e0b', animation:`para-bounce 1.1s ease-in-out ${i*0.16}s infinite` }} />)}
            </div>
          </div>
        )}
        {quickReplies.length>0 && !loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:2 }}>
            {quickReplies.map(q=>(
              <button key={q} onClick={()=>onSend(q)}
                style={{ background:'rgba(217,119,6,0.07)', border:'1px solid rgba(217,119,6,0.2)', color:'#d4a843', borderRadius:10, padding:'8px 12px', fontSize:13, cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all 0.15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(217,119,6,0.14)'; e.currentTarget.style.borderColor='rgba(217,119,6,0.4)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(217,119,6,0.07)'; e.currentTarget.style.borderColor='rgba(217,119,6,0.2)'; }}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8, alignItems:'flex-end', flexShrink:0, background:'rgba(8,14,26,0.7)' }}>
        <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();} }}
          placeholder="Ask PARA anything…" rows={1}
          style={{ flex:1, background:'rgba(25,38,58,0.9)', border:'1px solid rgba(217,119,6,0.18)', borderRadius:11, color:'#f1f5f9', fontSize:14, padding:'9px 13px', resize:'none', outline:'none', lineHeight:1.45, maxHeight:90, overflow:'auto', fontFamily:'inherit', transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='rgba(217,119,6,0.45)'}
          onBlur={e=>e.target.style.borderColor='rgba(217,119,6,0.18)'} />
        <button onClick={submit} disabled={!input.trim()||loading}
          style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:input.trim()?'#f59e0b':'rgba(245,158,11,0.14)', border:'none', cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', transform:input.trim()?'scale(1.04)':'scale(1)' }}>
          <Send size={15} color={input.trim()?'#0f172a':'#475569'} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FLOATING BOT
══════════════════════════════════════════════════════════════════ */
function FloatingBot({ mood, speaking, muted, chatOpen, onToggleChat, onToggleMute }: { mood:Mood; speaking:boolean; muted:boolean; chatOpen:boolean; onToggleChat:()=>void; onToggleMute:()=>void; }) {
  return (
    <div style={{ position:'fixed', bottom:18, right:18, zIndex:9991, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <button onClick={onToggleMute} title={muted?'Unmute PARA':'Mute PARA'}
        style={{ width:32, height:32, borderRadius:'50%', background:'rgba(12,22,40,0.95)', border:`1px solid ${muted?'rgba(255,255,255,0.08)':'rgba(217,119,6,0.4)'}`, color:muted?'#475569':'#f59e0b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
        {muted?<VolumeX size={13}/>:<Volume2 size={13}/>}
      </button>
      <div onClick={onToggleChat} title="Chat with PARA"
        style={{ cursor:'pointer', position:'relative', animation:chatOpen?'none':'para-float 3.2s ease-in-out infinite', willChange:'transform' }}>
        {speaking && <div style={{ position:'absolute', inset:-10, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(245,158,11,0.28) 0%, transparent 70%)', animation:'para-ripple 1s ease-in-out infinite', pointerEvents:'none' }} />}
        {!chatOpen && <div style={{ position:'absolute', top:4, right:4, width:10, height:10, borderRadius:'50%', background:'#10b981', border:'2px solid #0f172a', boxShadow:'0 0 7px #10b981', animation:'para-pulse 2s ease-in-out infinite', zIndex:1 }} />}
        <Robot mood={mood} speaking={speaking} size={0.72} />
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
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();
  const [phase, setPhase]       = useState<Phase>('hidden');
  const [chatOpen, setChatOpen] = useState(false);
  const [mood, setMood]         = useState<Mood>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted]       = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading]   = useState(false);
  const idRef  = useRef(0);
  const sigRef = useRef({ cancelled: false });

  const PROTECTED = ['/dashboard','/upload','/analysis','/settings','/food-diary','/treatment-tracker'];
  const isProtected = PROTECTED.some(p => location.pathname.startsWith(p));

  useEffect(() => { SpeechEngine.init(); }, []);

  useEffect(() => {
    if (!isAuthenticated || !isProtected) { setPhase('hidden'); return; }
    const key = `para_intro_${user?.id||'guest'}`;
    if (!sessionStorage.getItem(key)) {
      setPhase('intro');
    } else {
      setPhase('chat');
      if (!messages.length) {
        const hr = new Date().getHours();
        const g = hr<12?'Good morning':hr<17?"G'day":'Good evening';
        const n = user?.firstName||'there';
        addBot(`${g}, ${n}! Great to see you back. Ready to run a new analysis, or can I help with something? 🔬`);
      }
    }
  }, [isAuthenticated, isProtected, location.pathname]);

  const addBot = (content: string) => setMessages(prev => [...prev, { role:'assistant', content, id: ++idRef.current }]);

  const handleIntroDone = () => {
    sessionStorage.setItem(`para_intro_${user?.id||'guest'}`, '1');
    setPhase('chat');
    const n = user?.firstName||'there';
    setTimeout(() => addBot(`You're all set, ${n}! 🎉 Your dashboard is ready below. Hit "Start New Analysis" when you're ready — or just chat with me here anytime.`), 500);
    setTimeout(() => setChatOpen(true), 900);
  };

  const handleChipReply = (replyText: string) => {
    sessionStorage.setItem(`para_intro_${user?.id||'guest'}`, '1');
    setPhase('chat');
    setMessages([{ role:'user', content:replyText, id: ++idRef.current }]);
    setTimeout(() => { setChatOpen(true); handleSend(replyText, true); }, 700);
  };

  const handleSend = async (text: string, fromChip = false) => {
    if (!fromChip) setMessages(prev => [...prev, { role:'user', content:text, id: ++idRef.current }]);
    setLoading(true); setMood('thinking');
    try {
      const history = messages.slice(-12).map(m => ({ role:m.role, content:m.content }));
      const res = await fetch(getApiUrl('/api/chatbot/message'), {
        method:'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${accessToken}` },
        body: JSON.stringify({ message:text, conversationHistory:history }),
      });
      const data = await res.json();
      const reply = data.message || "Sorry, had a little hiccup there. Try again in a sec?";
      setLoading(false); setMood('talking'); setSpeaking(true);
      setMessages(prev => [...prev, { role:'assistant', content:reply, id: ++idRef.current }]);
      if (!muted) {
        sigRef.current = { cancelled:false };
        SpeechEngine.speak(reply, { rate:0.85, basePitch:1.02, signal:sigRef.current, onDone:()=>{ setSpeaking(false); setMood('idle'); } });
      } else { setTimeout(()=>{ setSpeaking(false); setMood('idle'); }, 500); }
    } catch {
      setLoading(false); setMood('concerned');
      setMessages(prev => [...prev, { role:'assistant', content:"Couldn't connect just then. Check your connection and try again.", id: ++idRef.current }]);
      setTimeout(()=>setMood('idle'), 2200);
    }
  };

  const toggleMute = () => {
    const nm = !muted; setMuted(nm);
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

      {phase==='intro' && <IntroScreen userName={user?.firstName||'there'} muted={muted} onDone={handleIntroDone} onChipReply={handleChipReply} />}
      {phase==='chat' && <ChatPanel open={chatOpen} onClose={()=>setChatOpen(false)} messages={messages} onSend={handleSend} loading={loading} />}
      {phase==='chat' && <FloatingBot mood={mood} speaking={speaking} muted={muted} chatOpen={chatOpen} onToggleChat={()=>setChatOpen(o=>!o)} onToggleMute={toggleMute} />}
    </>
  );
}
