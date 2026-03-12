// @ts-nocheck
/**
 * PARA — ParasitePro AI Assistant v4
 * - Cinematic full-screen intro before dashboard
 * - Robot flies in with spring animation
 * - Natural chunked speech (sentence-by-sentence with pauses)
 * - Animated SVG robot with expressive moods
 * - Smooth transition from intro → persistent corner chatbot
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Volume2, VolumeX, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised';
type Phase = 'hidden' | 'intro' | 'chat';
type Msg = { role: 'user' | 'assistant'; content: string; id: number };

/* ─── Speech Engine ──────────────────────────────────────────────── */
class SpeechEngine {
  private static voices: SpeechSynthesisVoice[] = [];

  static init(): Promise<void> {
    return new Promise(resolve => {
      if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
      const load = () => {
        this.voices = window.speechSynthesis.getVoices();
        resolve();
      };
      if (window.speechSynthesis.getVoices().length > 0) { load(); return; }
      window.speechSynthesis.onvoiceschanged = load;
      setTimeout(load, 1200);
    });
  }

  static getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.voices = window.speechSynthesis?.getVoices() || [];
    return (
      this.voices.find(v => v.lang === 'en-AU') ||
      this.voices.find(v => v.lang.startsWith('en-GB') && /female|woman|karen|serena|moira/i.test(v.name)) ||
      this.voices.find(v => v.lang.startsWith('en-GB')) ||
      this.voices.find(v => v.lang.startsWith('en-US') && /female|woman|samantha/i.test(v.name)) ||
      this.voices.find(v => v.lang.startsWith('en')) ||
      null
    );
  }

  /** Speak text naturally, sentence by sentence with pauses between */
  static speakChunked(
    text: string,
    opts: {
      rate?: number;
      pitch?: number;
      pauseMs?: number;
      onChunkStart?: (i: number) => void;
      onAllDone?: () => void;
      signal?: { cancelled: boolean };
    } = {}
  ) {
    if (!window.speechSynthesis) { opts.onAllDone?.(); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/[*_`#\[\]]/g, '').replace(/\n+/g, '. ').replace(/\s+/g, ' ').trim();
    const chunks = clean.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    if (!chunks.length) { opts.onAllDone?.(); return; }
    const voice = this.getBestVoice();
    let i = 0;
    const next = () => {
      if (opts.signal?.cancelled || i >= chunks.length) { opts.onAllDone?.(); return; }
      const utt = new SpeechSynthesisUtterance(chunks[i]);
      utt.rate = opts.rate ?? 0.87;
      utt.pitch = opts.pitch ?? 1.03;
      utt.volume = 0.95;
      if (voice) utt.voice = voice;
      utt.onstart = () => opts.onChunkStart?.(i);
      utt.onend = () => { i++; if (opts.signal?.cancelled) { opts.onAllDone?.(); return; } setTimeout(next, opts.pauseMs ?? 200); };
      utt.onerror = () => { i++; setTimeout(next, 80); };
      window.speechSynthesis.speak(utt);
    };
    next();
  }

  static cancel() { window.speechSynthesis?.cancel(); }
}

/* ─── Robot SVG ─────────────────────────────────────────────────── */
function Robot({ mood, speaking, size = 1 }: { mood: Mood; speaking: boolean; size?: number }) {
  const [blink, setBlink] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);
  const [antennaOn, setAntennaOn] = useState(false);

  useEffect(() => {
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 3200 + Math.random() * 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!speaking) { setMouthPhase(0); return; }
    const t = setInterval(() => setMouthPhase(p => (p + 1) % 4), 145);
    return () => clearInterval(t);
  }, [speaking]);

  useEffect(() => {
    const t = setInterval(() => setAntennaOn(g => !g), 1100);
    return () => clearInterval(t);
  }, []);

  const eyeH = blink ? 2 : mood === 'surprised' ? 13 : mood === 'happy' ? 8 : 10;
  const mouths = [
    'M 44 108 Q 50 110 56 108',
    'M 44 107 Q 50 114 56 107',
    'M 43 107 Q 50 116 57 107',
    'M 44 109 Q 50 112 56 109',
  ];
  const mp = speaking ? mouths[mouthPhase] : mouths[0];
  const eyeC = mood === 'concerned' ? '#ef4444' : mood === 'happy' ? '#10b981' : mood === 'thinking' ? '#a78bfa' : '#f59e0b';
  const ledC = mood === 'thinking' ? '#a78bfa' : mood === 'happy' ? '#10b981' : mood === 'concerned' ? '#ef4444' : '#f59e0b';
  const headBg = mood === 'concerned' ? '#1e3a5f' : mood === 'happy' ? '#1a4a2e' : '#1e293b';

  return (
    <svg width={100 * size} height={160 * size} viewBox="0 0 100 160"
      style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${speaking ? 18 : 8}px ${eyeC}55)` }}>
      {/* Antenna */}
      <line x1="50" y1="12" x2="50" y2="24" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="9" r="5" fill={antennaOn ? ledC : '#334155'}
        style={{ filter: antennaOn ? `drop-shadow(0 0 7px ${ledC})` : 'none', transition: 'fill 0.35s' }} />
      {/* Head */}
      <rect x="26" y="22" width="48" height="48" rx="10" fill={headBg} stroke="#334155" strokeWidth="1.5"
        style={{ transition: 'fill 0.4s' }} />
      {/* Ears */}
      <rect x="18" y="34" width="10" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <circle cx="23" cy="44" r="3" fill={ledC} opacity="0.8" style={{ filter: `drop-shadow(0 0 4px ${ledC})` }} />
      <rect x="72" y="34" width="10" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <circle cx="77" cy="44" r="3" fill={ledC} opacity="0.8" style={{ filter: `drop-shadow(0 0 4px ${ledC})` }} />
      {/* Eyes */}
      <rect x="32" y="35" width="14" height={eyeH} rx="3" fill={eyeC}
        style={{ filter: `drop-shadow(0 0 7px ${eyeC})`, transition: 'height 0.08s, fill 0.3s' }} />
      <rect x="54" y="35" width="14" height={eyeH} rx="3" fill={eyeC}
        style={{ filter: `drop-shadow(0 0 7px ${eyeC})`, transition: 'height 0.08s, fill 0.3s' }} />
      {!blink && <><circle cx="38" cy="37" r="2.2" fill="white" opacity="0.7" /><circle cx="60" cy="37" r="2.2" fill="white" opacity="0.7" /></>}
      {/* Thinking dots */}
      {mood === 'thinking' && [0,1,2].map((k,i) => (
        <circle key={k} cx={38+i*12} cy="56" r="3" fill="#a78bfa"
          opacity={0.25 + 0.6*((mouthPhase+i)%3===0?1:0)} style={{ transition: 'opacity 0.15s' }} />
      ))}
      {/* Mouth */}
      <path d={mp} fill="none" stroke={speaking ? eyeC : '#64748b'}
        strokeWidth={speaking ? 2.8 : 2} strokeLinecap="round"
        style={{ filter: speaking ? `drop-shadow(0 0 5px ${eyeC})` : 'none', transition: 'stroke 0.2s, d 0.1s' }} />
      {/* Cheeks */}
      {(mood === 'happy' || mood === 'waving') && (<>
        <ellipse cx="31" cy="60" rx="5.5" ry="3.5" fill="#f87171" opacity="0.35" />
        <ellipse cx="69" cy="60" rx="5.5" ry="3.5" fill="#f87171" opacity="0.35" />
      </>)}
      {/* Body */}
      <rect x="28" y="74" width="44" height="46" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      {/* Chest LEDs */}
      {[0,1,2].map(i => (
        <circle key={i} cx={36+i*14} cy="88" r="4.5"
          fill={i===mouthPhase%3 ? ledC : '#1e293b'}
          style={{ filter: i===mouthPhase%3 ? `drop-shadow(0 0 5px ${ledC})` : 'none', transition: 'fill 0.15s' }} />
      ))}
      {/* Panel */}
      <rect x="34" y="97" width="32" height="15" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {[40,50,60].map(x => <line key={x} x1={x} y1="100" x2={x} y2="109" stroke="#334155" strokeWidth="1" />)}
      {/* Arms */}
      <rect x="10" y="76" width="16" height="32" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2"
        style={{ transformOrigin:'18px 76px', transform: mood==='waving'?'rotate(-28deg)':'none', transition:'transform 0.5s cubic-bezier(0.34,1.5,0.64,1)' }} />
      <circle cx="18" cy="112" r="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <rect x="74" y="76" width="16" height="32" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <circle cx="82" cy="112" r="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      {/* Legs */}
      <rect x="32" y="120" width="14" height="28" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <rect x="54" y="120" width="14" height="28" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      {/* Feet */}
      <ellipse cx="39" cy="150" rx="9" ry="5" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
      <ellipse cx="61" cy="150" rx="9" ry="5" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
    </svg>
  );
}

/* ─── Intro Script Lines ─────────────────────────────────────────── */
const INTRO = [
  { text: "G'day! I'm PARA — your personal parasite identification assistant. Welcome to ParasitePro!", mood: 'waving' as Mood, card: null },
  { text: "ParasitePro uses cutting-edge AI to help you identify parasites, skin conditions, and other health concerns — quickly, privately, and without the usual waiting weeks to see a specialist.", mood: 'happy' as Mood, card: { icon: '🔬', title: 'AI-Powered Analysis', desc: 'Clinical-grade identification — results in about 60 seconds' } },
  { text: "It works like this: you take a clear photo of whatever's concerning you. Could be a stool sample, a skin rash, a suspicious bite mark, or anything that looks a bit off.", mood: 'talking' as Mood, card: { icon: '📸', title: 'Just Upload a Photo', desc: 'Stool · Skin rash · Bug bites · Environmental samples' } },
  { text: "Our AI then analyses your photo against thousands of clinical cases. It gives you a full structured report — what it most likely is, how urgent the situation is, and exactly what to do next.", mood: 'thinking' as Mood, card: { icon: '📋', title: 'Full Clinical Report', desc: 'Identification · Urgency rating · Recommended action steps' } },
  { text: "I'll be right here in the corner whenever you need me. Just tap my icon to ask questions, talk through your results, or if you're just not sure where to start.", mood: 'happy' as Mood, card: { icon: '💬', title: "I'm Always Here", desc: 'Ask me anything — results, next steps, or general health questions' } },
  { text: "Alright! Your dashboard is ready. Whenever you are, hit Start New Analysis and let's see what we're working with. I'm with you every step of the way.", mood: 'waving' as Mood, card: null },
];

/* ─── Intro Screen ───────────────────────────────────────────────── */
function IntroScreen({ userName, muted, onDone }: { userName: string; muted: boolean; onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [mood, setMood] = useState<Mood>('waving');
  const [speaking, setSpeaking] = useState(false);
  const [robotIn, setRobotIn] = useState(false);
  const [overlayIn, setOverlayIn] = useState(false);
  const [card, setCard] = useState<{icon:string;title:string;desc:string}|null>(null);
  const [cardIn, setCardIn] = useState(false);
  const [skippable, setSkippable] = useState(false);
  const sig = useRef({ cancelled: false });

  useEffect(() => {
    setTimeout(() => setOverlayIn(true), 50);
    setTimeout(() => setRobotIn(true), 380);
    setTimeout(() => setSkippable(true), 1800);
    setTimeout(() => speakLine(0), 850);
    return () => { sig.current.cancelled = true; SpeechEngine.cancel(); };
  }, []);

  const speakLine = useCallback((idx: number) => {
    if (sig.current.cancelled || idx >= INTRO.length) { setSpeaking(false); return; }
    const line = INTRO[idx];
    setLineIdx(idx);
    setMood(line.mood);
    setSpeaking(true);
    // Card transition
    setCardIn(false);
    setTimeout(() => {
      setCard(line.card);
      if (line.card) setCardIn(true);
    }, 350);

    if (!muted) {
      SpeechEngine.speakChunked(line.text, {
        rate: 0.87, pitch: 1.03, pauseMs: 210,
        signal: sig.current,
        onChunkStart: () => setSpeaking(true),
        onAllDone: () => {
          setSpeaking(false);
          setTimeout(() => {
            if (sig.current.cancelled) return;
            if (idx + 1 < INTRO.length) speakLine(idx + 1);
            else setTimeout(onDone, 700);
          }, 550);
        },
      });
    } else {
      const dur = Math.max(2600, line.text.length * 36);
      setTimeout(() => {
        if (sig.current.cancelled) return;
        if (idx + 1 < INTRO.length) speakLine(idx + 1);
        else setTimeout(onDone, 600);
      }, dur);
    }
  }, [muted, onDone]);

  const skip = () => { sig.current.cancelled = true; SpeechEngine.cancel(); onDone(); };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(14,15,17,0.96)',
      backdropFilter:'blur(14px)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      opacity: overlayIn ? 1 : 0, transition:'opacity 0.5s ease',
    }}>
      {/* Amber glow */}
      <div style={{ position:'absolute', top:'28%', left:'50%', transform:'translateX(-50%)', width:700, height:700, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(217,119,6,0.13) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Top bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'18px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(217,119,6,0.1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 8px #f59e0b', animation:'para-pulse 2s infinite' }} />
          <span style={{ color:'#f59e0b', fontFamily:'monospace', fontSize:13, letterSpacing:2 }}>PARASITEPRO · PARA v4</span>
        </div>
        {skippable && (
          <button onClick={skip} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'#9ca3af', borderRadius:8, padding:'6px 14px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            Skip intro <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:32, maxWidth:620, padding:'0 24px', position:'relative', zIndex:1 }}>
        {/* Robot */}
        <div style={{ transform: robotIn ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.65)', opacity: robotIn ? 1 : 0, transition:'transform 0.75s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease', position:'relative' }}>
          <div style={{ animation:'para-float 3.2s ease-in-out infinite' }}>
            <Robot mood={mood} speaking={speaking} size={1.4} />
          </div>
          {speaking && (
            <div style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%)', width:130, height:22, background:'radial-gradient(ellipse, rgba(245,158,11,0.28) 0%, transparent 70%)', animation:'para-ripple 1s ease-in-out infinite' }} />
          )}
        </div>

        {/* Speech bubble */}
        <div style={{ background:'rgba(30,41,59,0.75)', border:'1px solid rgba(217,119,6,0.28)', borderRadius:16, padding:'20px 28px', maxWidth:560, textAlign:'center', backdropFilter:'blur(8px)', transform: robotIn?'translateY(0)':'translateY(16px)', opacity: robotIn?1:0, transition:'all 0.5s ease 0.25s', position:'relative' }}>
          <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderBottom:'10px solid rgba(217,119,6,0.28)' }} />
          <p style={{ color:'#f1f5f9', fontSize:17, lineHeight:1.68, margin:0, fontWeight:400 }}>
            {INTRO[lineIdx].text}
          </p>
        </div>

        {/* Feature card */}
        {card && (
          <div style={{ display:'flex', alignItems:'center', gap:16, background:'rgba(217,119,6,0.09)', border:'1px solid rgba(217,119,6,0.3)', borderRadius:12, padding:'14px 22px', maxWidth:400, width:'100%', opacity: cardIn?1:0, transform: cardIn?'translateY(0)':'translateY(12px)', transition:'all 0.4s ease' }}>
            <span style={{ fontSize:28 }}>{card.icon}</span>
            <div>
              <div style={{ color:'#f59e0b', fontWeight:600, fontSize:14, marginBottom:2 }}>{card.title}</div>
              <div style={{ color:'#94a3b8', fontSize:13 }}>{card.desc}</div>
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(217,119,6,0.15)' }}>
        <div style={{ height:'100%', background:'#f59e0b', width:`${((lineIdx+1)/INTRO.length)*100}%`, boxShadow:'0 0 8px #f59e0b', transition:'width 0.6s ease' }} />
      </div>
      <div style={{ position:'absolute', bottom:14, display:'flex', gap:8 }}>
        {INTRO.map((_,i) => (
          <div key={i} style={{ width:i===lineIdx?20:6, height:6, borderRadius:3, background:i<=lineIdx?'#f59e0b':'rgba(217,119,6,0.25)', boxShadow:i===lineIdx?'0 0 6px #f59e0b':'none', transition:'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Chat Panel ─────────────────────────────────────────────────── */
function ChatPanel({ open, onClose, messages, onSend, loading }: {
  open: boolean; onClose: () => void; messages: Msg[]; onSend: (t: string) => void; loading: boolean;
}) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 100);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages.length]);

  const submit = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput('');
    onSend(t);
  };

  const quickReplies = messages.length <= 1
    ? ['🔬 How does the analysis work?', '📋 What sample types can you analyse?', '🚨 When should I see a doctor urgently?', '💰 How do credits work?']
    : [];

  return (
    <div style={{ position:'fixed', bottom:106, right:20, zIndex:9990, width:350, maxHeight:'68vh', background:'rgba(15,23,42,0.97)', border:'1px solid rgba(217,119,6,0.28)', borderRadius:16, boxShadow:'0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(217,119,6,0.08)', display:'flex', flexDirection:'column', transform: open?'translateY(0) scale(1)':'translateY(18px) scale(0.95)', opacity: open?1:0, pointerEvents: open?'all':'none', transition:'all 0.25s cubic-bezier(0.34,1.3,0.64,1)', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'13px 16px', borderBottom:'1px solid rgba(217,119,6,0.13)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(217,119,6,0.05)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }} />
          <span style={{ color:'#f1f5f9', fontWeight:600, fontSize:14 }}>PARA</span>
          <span style={{ color:'#475569', fontSize:12 }}>ParasitePro Assistant</span>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', padding:4, borderRadius:6, display:'flex', alignItems:'center' }}>
          <ChevronDown size={17} />
        </button>
      </div>
      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 13px', display:'flex', flexDirection:'column', gap:9, scrollbarWidth:'thin' }}>
        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start' }}>
            <div style={{ maxWidth:'86%', padding:'9px 13px', borderRadius: m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px', background: m.role==='user'?'rgba(217,119,6,0.18)':'rgba(30,41,59,0.9)', border: m.role==='user'?'1px solid rgba(217,119,6,0.32)':'1px solid rgba(255,255,255,0.06)', color:'#f1f5f9', fontSize:14, lineHeight:1.54, whiteSpace:'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:5, padding:'7px 13px', alignItems:'center' }}>
            {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#f59e0b', animation:`para-bounce 1s ease-in-out ${i*0.15}s infinite` }} />)}
          </div>
        )}
        {quickReplies.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:4 }}>
            {quickReplies.map(q => (
              <button key={q} onClick={() => onSend(q)} style={{ background:'rgba(217,119,6,0.07)', border:'1px solid rgba(217,119,6,0.2)', color:'#d4a843', borderRadius:9, padding:'7px 11px', fontSize:13, cursor:'pointer', textAlign:'left' }}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div style={{ padding:'9px 11px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:7, alignItems:'flex-end', flexShrink:0, background:'rgba(10,16,30,0.6)' }}>
        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask PARA anything..." rows={1}
          style={{ flex:1, background:'rgba(30,41,59,0.8)', border:'1px solid rgba(217,119,6,0.18)', borderRadius:10, color:'#f1f5f9', fontSize:14, padding:'8px 11px', resize:'none', outline:'none', lineHeight:1.4, maxHeight:90, overflow:'auto', fontFamily:'inherit' }} />
        <button onClick={submit} disabled={!input.trim() || loading} style={{ width:36, height:36, borderRadius:9, flexShrink:0, background: input.trim()?'#f59e0b':'rgba(245,158,11,0.18)', border:'none', cursor: input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
          <Send size={15} color={input.trim()?'#0f172a':'#64748b'} />
        </button>
      </div>
    </div>
  );
}

/* ─── Floating Bot Trigger ───────────────────────────────────────── */
function FloatingBot({ mood, speaking, muted, chatOpen, onToggleChat, onToggleMute }: {
  mood: Mood; speaking: boolean; muted: boolean; chatOpen: boolean;
  onToggleChat: () => void; onToggleMute: () => void;
}) {
  return (
    <div style={{ position:'fixed', bottom:20, right:20, zIndex:9991, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <button onClick={onToggleMute} title={muted?'Unmute PARA':'Mute PARA'} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(15,23,42,0.9)', border:`1px solid ${muted?'rgba(255,255,255,0.08)':'rgba(217,119,6,0.35)'}`, color: muted?'#475569':'#f59e0b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
      </button>
      <div onClick={onToggleChat} title="Chat with PARA" style={{ cursor:'pointer', position:'relative', animation: chatOpen?'none':'para-float 3.2s ease-in-out infinite', transition:'transform 0.25s', willChange:'transform' }}>
        {/* Pulse ring */}
        <div style={{ position:'absolute', inset:-8, borderRadius:'50%', background: speaking?'radial-gradient(ellipse, rgba(245,158,11,0.32) 0%, transparent 70%)':'none', animation: speaking?'para-ripple 1s ease-in-out infinite':'none', transition:'background 0.3s', pointerEvents:'none' }} />
        {/* Notification dot */}
        {!chatOpen && <div style={{ position:'absolute', top:2, right:2, width:11, height:11, borderRadius:'50%', background:'#10b981', border:'2px solid #0f172a', boxShadow:'0 0 6px #10b981', animation:'para-pulse 2s infinite', zIndex:1 }} />}
        <Robot mood={mood} speaking={speaking} size={0.7} />
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────── */
export default function ParasiteBot() {
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('hidden');
  const [chatOpen, setChatOpen] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const idRef = useRef(0);
  const sigRef = useRef({ cancelled: false });

  const isProtected = ['/dashboard','/upload','/analysis','/settings','/food-diary','/treatment-tracker'].some(p => location.pathname.startsWith(p));

  useEffect(() => { SpeechEngine.init(); }, []);

  useEffect(() => {
    if (!isAuthenticated || !isProtected) { setPhase('hidden'); return; }
    const key = `para_intro_${user?.id || 'g'}`;
    if (!sessionStorage.getItem(key)) {
      setPhase('intro');
    } else {
      setPhase('chat');
      if (!messages.length) {
        const hr = new Date().getHours();
        const g = hr<12?'Good morning':hr<17?"G'day":'Good evening';
        const n = user?.firstName || 'there';
        addBot(`${g}, ${n}! Great to see you back. 🔬 Ready to run a new analysis, or can I help with something?`);
      }
    }
  }, [isAuthenticated, isProtected, location.pathname]);

  const addBot = (content: string) => {
    idRef.current++;
    setMessages(prev => [...prev, { role:'assistant', content, id: idRef.current }]);
  };

  const handleIntroDone = () => {
    sessionStorage.setItem(`para_intro_${user?.id||'g'}`, '1');
    setPhase('chat');
    const n = user?.firstName || 'there';
    setTimeout(() => addBot(`You're all set, ${n}! 🎉 Your dashboard is ready below. Hit "Start New Analysis" whenever you want to upload a sample, or just chat with me here — I'm always around.`), 700);
    setTimeout(() => setChatOpen(true), 1100);
  };

  const handleSend = async (text: string) => {
    idRef.current++;
    setMessages(prev => [...prev, { role:'user', content:text, id: idRef.current }]);
    setLoading(true); setMood('thinking');
    try {
      const history = messages.slice(-10).map(m => ({ role:m.role, content:m.content }));
      const res = await fetch(getApiUrl('/api/chatbot/message'), {
        method:'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${accessToken}` },
        body: JSON.stringify({ message:text, conversationHistory:history }),
      });
      const data = await res.json();
      const reply = data.message || "Sorry, I had a hiccup there. Try again in a moment?";
      setLoading(false); setMood('talking'); setSpeaking(true);
      idRef.current++;
      setMessages(prev => [...prev, { role:'assistant', content:reply, id: idRef.current }]);
      if (!muted) {
        sigRef.current = { cancelled: false };
        SpeechEngine.speakChunked(reply, { rate:0.87, pitch:1.03, signal:sigRef.current, onChunkStart:()=>setSpeaking(true), onAllDone:()=>{ setSpeaking(false); setMood('idle'); } });
      } else { setTimeout(()=>{ setSpeaking(false); setMood('idle'); }, 600); }
    } catch {
      setLoading(false); setMood('concerned');
      idRef.current++;
      setMessages(prev => [...prev, { role:'assistant', content:"Sorry, couldn't connect. Check your connection and try again.", id: idRef.current }]);
      setTimeout(()=>setMood('idle'), 2000);
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
        @keyframes para-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes para-ripple { 0%,100%{opacity:0.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.18)} }
        @keyframes para-bounce { 0%,80%,100%{transform:translateY(0);opacity:0.35} 40%{transform:translateY(-7px);opacity:1} }
        @keyframes para-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>

      {phase === 'intro' && (
        <IntroScreen userName={user?.firstName || 'there'} muted={muted} onDone={handleIntroDone} />
      )}

      {phase === 'chat' && (
        <ChatPanel open={chatOpen} onClose={()=>setChatOpen(false)} messages={messages} onSend={handleSend} loading={loading} />
      )}

      {phase === 'chat' && (
        <FloatingBot mood={mood} speaking={speaking} muted={muted} chatOpen={chatOpen} onToggleChat={()=>setChatOpen(o=>!o)} onToggleMute={toggleMute} />
      )}
    </>
  );
}
