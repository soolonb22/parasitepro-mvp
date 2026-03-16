// @ts-nocheck
/**
 * PARA — ParasitePro AI Assistant v7.0
 * ──────────────────────────────────────────
 * • Auto-launches on login — NO click required
 * • Full-screen cinematic fly-in with robot character
 * • Intake questions built into the intro sequence
 * • Disclaimer delivered by voice in the intro
 * • Upbeat young boy voice throughout
 * • AI-powered guide on every page after intro
 * • Suggestion chips after every message
 * • Persistent floating guide after intro
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Volume2, VolumeX, ChevronDown, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised' | 'curious';
type Phase = 'hidden' | 'intro' | 'chat';
type Msg = { role: 'user' | 'assistant'; content: string; id: number; suggestions?: string[] };

/* ══════════════════════════════════════════════════════════════════
   SPEECH ENGINE  (autoplay-safe: queues until first user gesture)
══════════════════════════════════════════════════════════════════ */
class SpeechEngine {
  private static voices: SpeechSynthesisVoice[] = [];
  private static ready = false;
  private static unlocked = false;
  private static pendingAfterUnlock: (() => void) | null = null;

  /** Load voices. Call on mount. */
  static init(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const tryLoad = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) { this.voices = v; this.ready = true; }
    };
    window.speechSynthesis.onvoiceschanged = tryLoad;
    tryLoad();
    setTimeout(tryLoad, 1000);
  }

  /**
   * Call this directly from a user-gesture handler (onClick/onTouchStart).
   * Plays a silent warmup utterance to unlock the Web Speech API,
   * then immediately calls onUnlocked so the caller can start real speech.
   */
  static unlockAndSpeak(firstText: string, opts: any = {}): void {
    if (this.unlocked) { this.speak(firstText, opts); return; }
    // Must be called synchronously inside a user-gesture event handler
    const warmup = new SpeechSynthesisUtterance('');
    warmup.volume = 0;
    warmup.onend = () => {
      this.unlocked = true;
      setTimeout(() => this.speak(firstText, opts), 80);
    };
    warmup.onerror = () => {
      this.unlocked = true;
      setTimeout(() => this.speak(firstText, opts), 80);
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(warmup);
  }

  static getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.voices = window.speechSynthesis?.getVoices() || [];
    const pick = (fn) => this.voices.find(fn) ?? null;
    return (
      pick(v => /junior/i.test(v.name)) ||
      pick(v => /oliver/i.test(v.name) && v.lang.startsWith('en')) ||
      pick(v => /nicky|ryan|liam/i.test(v.name) && v.lang.startsWith('en')) ||
      pick(v => v.lang === 'en-AU' && /male/i.test(v.name)) ||
      pick(v => v.lang === 'en-AU') ||
      pick(v => v.lang.startsWith('en-GB') && /male|oliver/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en-US') && /male|alex|daniel/i.test(v.name)) ||
      pick(v => v.lang.startsWith('en')) ||
      null
    );
  }

  static clearPending() { this.pendingAfterUnlock = null; }

  static speak(text, opts: any = {}) {
    if (!window.speechSynthesis) { opts.onDone?.(); return; }
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
    const basePitch = opts.basePitch ?? 1.58;
    let i = 0;
    const next = () => {
      if (opts.signal?.cancelled || i >= chunks.length) { opts.onDone?.(); return; }
      const chunk = chunks[i];
      const utt = new SpeechSynthesisUtterance(chunk);
      const isQ = chunk.trim().endsWith('?');
      const isE = chunk.trim().endsWith('!');
      utt.rate   = baseRate  + (Math.random() * 0.08 - 0.04) + (isQ ? 0.04 : 0) + (isE ? 0.08 : 0);
      utt.pitch  = basePitch + (Math.random() * 0.12 - 0.06) + (isQ ? 0.16 : 0) + (isE ? 0.14 : 0);
      utt.volume = 0.95;
      if (voice) utt.voice = voice;
      const pause = isQ ? 380 : isE ? 240 : 180;
      utt.onstart = () => { if (i === 0) opts.onStart?.(); };
      utt.onend  = () => { i++; if (opts.signal?.cancelled) { opts.onDone?.(); return; } setTimeout(next, pause); };
      utt.onerror = () => { i++; setTimeout(next, 80); };
      window.speechSynthesis.speak(utt);
    };
    next();
  }

  static cancel() { window.speechSynthesis?.cancel(); }

  /** Request microphone permission. Returns 'granted' | 'denied' | 'unsupported' */
  static async requestMic(): Promise<'granted' | 'denied' | 'unsupported'> {
    if (!navigator.mediaDevices?.getUserMedia) return 'unsupported';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop all tracks — we only wanted the permission grant
      stream.getTracks().forEach(t => t.stop());
      return 'granted';
    } catch (err: any) {
      return 'denied';
    }
  }
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
        ? <strong key={i} style={{ color: '#2dd4bf', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        : p
    );
  };
  for (const line of lines) {
    if (!line.trim()) { elements.push(<div key={key++} style={{ height: '0.5em' }} />); continue; }
    if (/^[-•*]\s/.test(line.trim())) {
      elements.push(<div key={key++} style={{ display:'flex', gap:'0.4em', alignItems:'flex-start', marginBottom:'0.15em' }}><span style={{ color:'#2dd4bf', flexShrink:0, marginTop:'0.12em' }}>•</span><span>{renderInline(line.trim().replace(/^[-•*]\s/, ''))}</span></div>);
      continue;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      const num = line.trim().match(/^(\d+)\.\s/)[1];
      elements.push(<div key={key++} style={{ display:'flex', gap:'0.5em', alignItems:'flex-start', marginBottom:'0.15em' }}><span style={{ color:'#2dd4bf', flexShrink:0, fontWeight:600, minWidth:'1.2em' }}>{num}.</span><span>{renderInline(line.trim().replace(/^\d+\.\s/, ''))}</span></div>);
      continue;
    }
    elements.push(<p key={key++} style={{ margin:'0 0 0.3em 0', lineHeight:1.62 }}>{renderInline(line)}</p>);
  }
  return <div style={{ fontSize:14, color:'#f1f5f9' }}>{elements}</div>;
}

/* ══════════════════════════════════════════════════════════════════
   ROBOT SVG
══════════════════════════════════════════════════════════════════ */
function Robot({ mood, speaking, size = 1 }) {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState(0);
  const [antGlow, setAnt]  = useState(false);
  const [armOff, setArm]   = useState(0);

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

  const eyeH  = blink ? 2 : mood==='surprised'?16 : mood==='happy'?10 : mood==='curious'?13 : 12;
  const eyeY  = mood==='curious' ? 33 : 34;
  const eyeC  = mood==='concerned'?'#f87171' : mood==='happy'?'#34d399' : mood==='thinking'?'#c4b5fd' : mood==='curious'?'#67e8f9' : '#0d9488';
  const ledC  = mood==='thinking'?'#c4b5fd' : mood==='happy'?'#34d399' : mood==='concerned'?'#f87171' : mood==='curious'?'#67e8f9' : '#0d9488';
  const headBg = mood==='concerned'?'#1e3050' : mood==='happy'?'#0d2820' : mood==='thinking'?'#1e1b40' : '#0f2335';
  const mouths = ['M 41 108 Q 50 114 59 108','M 41 107 Q 50 116 59 107','M 40 107 Q 50 119 60 107','M 41 108 Q 50 114 59 108','M 42 109 Q 50 113 58 109'];
  const mp = speaking ? mouths[mouth] : (mood==='concerned' ? 'M 42 111 Q 50 107 58 111' : 'M 41 108 Q 50 114 59 108');
  const armRot = (mood==='waving'||mood==='happy') ? -22+armOff : 0;
  const showCheeks = mood==='happy' || mood==='waving' || mood==='talking' || speaking;

  return (
    <svg width={100*size} height={162*size} viewBox="0 0 100 162"
      style={{ overflow:'visible', filter:`drop-shadow(0 0 ${speaking?24:12}px ${eyeC}70)`, transition:'filter 0.3s' }}>
      {/* Antenna */}
      <line x1="50" y1="9" x2="50" y2="22" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <circle cx="50" cy="6" r="6" fill={antGlow?ledC:'#0a1f2e'} stroke={antGlow?ledC:'rgba(13,148,136,0.3)'} strokeWidth="1.5"
        style={{ filter:antGlow?`drop-shadow(0 0 10px ${ledC})`:'none', transition:'fill 0.4s,filter 0.4s' }}/>
      {antGlow && <circle cx="50" cy="6" r="3" fill="white" opacity="0.6"/>}
      {/* Head — big round friendly */}
      <rect x="20" y="20" width="60" height="56" rx="20" fill={headBg} stroke="rgba(13,148,136,0.4)" strokeWidth="1.5"
        style={{ transition:'fill 0.4s', filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}/>
      <ellipse cx="38" cy="26" rx="14" ry="6" fill="white" opacity="0.04"/>
      {/* Ear panels */}
      <rect x="11" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
      <circle cx="16" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{ filter:`drop-shadow(0 0 6px ${ledC})`, transition:'fill 0.4s' }}/>
      <rect x="79" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
      <circle cx="84" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{ filter:`drop-shadow(0 0 6px ${ledC})`, transition:'fill 0.4s' }}/>
      {/* Eyes — big round friendly */}
      <rect x="28" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC}
        style={{ filter:`drop-shadow(0 0 10px ${eyeC})`, transition:'height 0.08s,fill 0.3s' }}/>
      <rect x="54" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC}
        style={{ filter:`drop-shadow(0 0 10px ${eyeC})`, transition:'height 0.08s,fill 0.3s' }}/>
      {!blink && eyeH>3 && <>
        <circle cx="34" cy={eyeY+2.5} r="3" fill="white" opacity="0.8"/>
        <circle cx="60" cy={eyeY+2.5} r="3" fill="white" opacity="0.8"/>
        <circle cx="35.5" cy={eyeY+1.5} r="1.2" fill="white" opacity="0.6"/>
        <circle cx="61.5" cy={eyeY+1.5} r="1.2" fill="white" opacity="0.6"/>
      </>}
      {mood==='thinking' && [0,1,2].map((k,i) => <circle key={k} cx={35+i*15} cy="57" r="4" fill="#c4b5fd"
        opacity={0.2+0.8*((mouth+i)%3===0?1:0)} style={{ transition:'opacity 0.18s' }}/>)}
      {mood==='curious' && <path d="M 28 30 Q 37 26 46 30" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>}
      {/* Mouth */}
      <path d={mp} fill="none" stroke={speaking?eyeC:'rgba(13,148,136,0.6)'}
        strokeWidth={speaking?3.5:2.5} strokeLinecap="round"
        style={{ filter:speaking?`drop-shadow(0 0 8px ${eyeC})`:'none', transition:'stroke 0.2s' }}/>
      {/* Cheeks */}
      <ellipse cx="27" cy="58" rx="6" ry="4" fill="#f472b6" opacity={showCheeks?0.35:0.12} style={{ transition:'opacity 0.4s' }}/>
      <ellipse cx="73" cy="58" rx="6" ry="4" fill="#f472b6" opacity={showCheeks?0.35:0.12} style={{ transition:'opacity 0.4s' }}/>
      {/* Body */}
      <rect x="24" y="80" width="52" height="46" rx="14" fill="#0a1f2e" stroke="rgba(13,148,136,0.35)" strokeWidth="1.5"/>
      <rect x="30" y="85" width="40" height="3" rx="1.5" fill="white" opacity="0.04"/>
      {[0,1,2].map(i => <circle key={i} cx={34+i*16} cy="96" r="5.5"
        fill={i===mouth%3?ledC:'#0f2335'}
        style={{ filter:i===mouth%3?`drop-shadow(0 0 7px ${ledC})`:'none', transition:'fill 0.14s' }}/>)}
      <rect x="30" y="107" width="40" height="13" rx="6" fill="#0f2335" stroke="rgba(13,148,136,0.2)" strokeWidth="1"/>
      <path d="M 39 110 Q 50 115 61 110" fill="none" stroke={ledC} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Arms */}
      <g style={{ transformOrigin:'16px 82px', transform:`rotate(${armRot}deg)`, transition:'transform 0.32s ease-in-out' }}>
        <rect x="8" y="82" width="16" height="32" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
        <circle cx="16" cy="118" r="7" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
      </g>
      <rect x="76" y="82" width="16" height="32" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
      <circle cx="84" cy="118" r="7" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
      {/* Legs */}
      <rect x="30" y="126" width="16" height="24" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
      <rect x="54" y="126" width="16" height="24" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
      <ellipse cx="38" cy="151" rx="11" ry="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.25)" strokeWidth="1.2"/>
      <ellipse cx="62" cy="151" rx="11" ry="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.25)" strokeWidth="1.2"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INTRO SCREEN  (cinematic fly-in + intake all in one)
══════════════════════════════════════════════════════════════════ */
type ScriptLine = { text: string; mood: Mood; card?: { icon: string; title: string; desc: string } | null; pauseAfter?: number };

const buildScript = (name: string): ScriptLine[] => [
  { text: `${name}!! Oh MATE — welcome to ParasitePro! I am SO glad you are here. I am PARA, your personal guide, and I am gonna walk you through absolutely everything!`, mood: 'waving', card: null, pauseAfter: 350 },
  { text: `So here is the deal — you upload a photo of anything worrying you. Stool samples, weird rashes, mysterious bites, skin stuff — anything. Our AI analyses it and gives you a full detailed report in about 60 seconds!`, mood: 'talking', card: { icon: '🔬', title: 'AI Analysis in ~60 seconds', desc: 'Stool · Skin · Environmental · Microscopy' }, pauseAfter: 320 },
  { text: `And the best part? Everything is built for Australia. So it knows about our tropical climate, our local critters, and our healthcare system. No generic overseas stuff — this is made for us!`, mood: 'happy', card: { icon: '🇦🇺', title: 'Made for Australians', desc: 'Queensland-aware · GP referral pathways' }, pauseAfter: 320 },
  { text: `Quick important thing before we start! I am an educational guide, not an actual doctor. Everything I show you is AI analysis to help you understand what you might be looking at. Always take results to your GP to confirm and treat. And if something feels really urgent right now, call 000. No hesitation! Okay? Sweet. Now let's go!`, mood: 'concerned', card: { icon: '⚠️', title: 'Educational Guide Only', desc: 'Always confirm with your GP · Emergency: 000' }, pauseAfter: 400 },
];

type IntakeQuestion = { id: string; text: string; mood: Mood; options: string[]; final?: boolean };

const INTAKE_QUESTIONS: IntakeQuestion[] = [
  { id: 'reason', text: `Righto! First thing — what brings you to ParasitePro today?`, mood: 'curious', options: ['I think I might have worms', 'Worried about my pet', 'Just back from travelling', 'Strange rash or skin issue', 'Just exploring the app'] },
  { id: 'age',    text: `Got it! And how old are you roughly? No worries if you would rather not say!`, mood: 'happy', options: ['Under 18', '18–35', '36–55', '55+', 'Rather not say'] },
  { id: 'symptoms', text: `Okay! Are you dealing with any symptoms right now? Like itching, tummy pain, weird fatigue, anything unusual?`, mood: 'curious', options: ['Yeah, a few things', 'Just one thing', 'Not really', 'Not sure yet'] },
  { id: 'duration', text: `Good to know! How long has that been going on for?`, mood: 'talking', options: ['Just a few days', '1–2 weeks', 'Over a month', 'A while now', 'Not really applicable'] },
  { id: 'done', text: `You absolute LEGEND — thanks so much for sharing all that! That helps me give you way better info. Okay, let's get you sorted! Ready to jump in?`, mood: 'waving', options: ["Let's GO! 🚀"], final: true },
];

function IntroScreen({ userName, muted, onDone }) {
  const script = buildScript(userName || 'Hey you');
  const [phase,    setPhase]    = useState<'intro'|'intake'>('intro');
  const [lineIdx,  setLineIdx]  = useState(0);
  const [mood,     setMood]     = useState<Mood>('waving');
  const [speaking, setSpeaking] = useState(false);
  const [robotY,   setRobotY]   = useState(-280);
  const [overlayIn,setOverlay]  = useState(false);
  const [card,     setCard]     = useState<any>(null);
  const [cardIn,   setCardIn]   = useState(false);
  const [skippable,setSkip]     = useState(false);
  const [exitAnim, setExit]     = useState(false);
  const [intakeStep, setIntakeStep] = useState(0);
  const [intakeData, setIntakeData] = useState<Record<string,string>>({});
  const [intakePhraseIn, setIntakePhraseIn] = useState(false);
  const [micStatus, setMicStatus]           = useState<'idle'|'asking'|'granted'|'denied'>('idle');
  const [showMicPrompt, setShowMicPrompt]   = useState(false);
  const [voiceStarted, setVoiceStarted]     = useState(false);  // true after user taps to unlock speech

  const sig = useRef({ cancelled: false });
  const speakLineRef = useRef<(idx: number) => void>(() => {});

  useEffect(() => {
    SpeechEngine.init();  // just loads voices
    setTimeout(() => setOverlay(true), 40);
    setTimeout(() => setRobotY(-90), 200);
    setTimeout(() => setRobotY(10),  460);
    setTimeout(() => setRobotY(-14), 660);
    setTimeout(() => setRobotY(0),   840);
    setTimeout(() => setSkip(true),  2800);
    // NOTE: speakLine(0) is triggered by the user tapping "Tap to start"
    // Visual-only fallback starts after 3s if user doesn't tap
    setTimeout(() => { if (!sig.current.cancelled) speakLineRef.current(0); }, 3000);
    return () => { sig.current.cancelled = true; SpeechEngine.cancel(); };
  }, []);

  const speakLine = useCallback((idx) => {
    if (sig.current.cancelled) return;
    if (idx >= script.length) {
      // Done with intro — transition to intake
      setLineIdx(-1); setSpeaking(false); setCardIn(false);
      setTimeout(() => { setCard(null); setPhase('intake'); setIntakePhraseIn(true); }, 380);
      if (!muted) {
        setSpeaking(true); setMood('curious');
        SpeechEngine.speak(INTAKE_QUESTIONS[0].text, {
          rate: 1.38, basePitch: 1.62, signal: sig.current,
          onDone: () => setSpeaking(false)
        });
      }
      return;
    }
    const line = script[idx];
    setLineIdx(idx); setMood(line.mood); setSpeaking(true);
    setCardIn(false);
    setTimeout(() => { setCard(line.card ?? null); if (line.card) setTimeout(() => setCardIn(true), 60); }, 280);
    if (!muted) {
      // Fallback timer: if speech is blocked by autoplay policy, advance visually on a timer
      // When/if speech actually starts (onStart), cancel the fallback so onDone drives timing
      const fallbackMs = Math.max(2400, line.text.length * 28);
      const fallbackTimer = setTimeout(() => {
        SpeechEngine.clearPending(); // discard stale queued speech
        setSpeaking(false);
        if (!sig.current.cancelled) speakLineRef.current(idx + 1);
      }, fallbackMs);

      SpeechEngine.speak(line.text, {
        rate: 1.38, basePitch: 1.55, signal: sig.current,
        onStart: () => clearTimeout(fallbackTimer), // speech started — let onDone drive timing
        onDone: () => {
          clearTimeout(fallbackTimer);
          setSpeaking(false);
          setTimeout(() => { if (!sig.current.cancelled) speakLineRef.current(idx + 1); }, line.pauseAfter ?? 380);
        }
      });
    } else {
      setTimeout(() => { if (!sig.current.cancelled) speakLineRef.current(idx + 1); }, Math.max(2000, line.text.length * 26));
    }
  }, [muted, script]);

  useEffect(() => { speakLineRef.current = speakLine; }, [speakLine]);

  const handleTapToStart = () => {
    setVoiceStarted(true);
    sig.current.cancelled = false;
    // unlockAndSpeak MUST be called synchronously in this onClick handler
    // so the browser accepts it as a genuine user-gesture speech request
    SpeechEngine.unlockAndSpeak(script[0].text, {
      rate: 1.38, basePitch: 1.55, signal: sig.current,
      onStart: () => { setSpeaking(true); setMood(script[0].mood); },
      onDone: () => {
        setSpeaking(false);
        setTimeout(() => { if (!sig.current.cancelled) speakLineRef.current(1); }, script[0].pauseAfter ?? 380);
      }
    });
    setLineIdx(0); setMood(script[0].mood); setSpeaking(true);
    setTimeout(() => { setCard(script[0].card ?? null); if (script[0].card) setTimeout(() => setCardIn(true), 60); }, 280);
  };

  const handleMicRequest = async () => {
    setShowMicPrompt(false);
    const result = await SpeechEngine.requestMic();
    setMicStatus(result);
    if (result === 'granted') {
      // Mic granted — speak a quick excited confirmation
      if (!muted) {
        SpeechEngine.speak("Awesome! I can hear you now! You can speak your answers if you want!", {
          rate: 1.38, basePitch: 1.62, signal: sig.current,
          onDone: () => setSpeaking(false)
        });
        setSpeaking(true);
      }
    }
  };

  const triggerExit = (data: Record<string,string>) => {
    setExit(true);
    sig.current.cancelled = true;
    SpeechEngine.cancel();
    setTimeout(() => onDone(data), 520);
  };

  const skip = () => triggerExit(intakeData);

  const handleIntakeAnswer = (answer: string) => {
    const q = INTAKE_QUESTIONS[intakeStep];
    const newData = { ...intakeData, [q.id]: answer };
    setIntakeData(newData);

    if (q.final) { triggerExit(newData); return; }

    // On the very first intake answer, ask for mic permission
    // User has just clicked so browser will allow the getUserMedia call
    if (intakeStep === 0 && micStatus === 'idle') {
      setShowMicPrompt(true);
      setMicStatus('asking');
    }

    const next = intakeStep + 1;
    setIntakeStep(next);
    setIntakePhraseIn(false);

    setTimeout(() => {
      setIntakePhraseIn(true);
      setMood(INTAKE_QUESTIONS[next].mood);
      if (!muted) {
        setSpeaking(true);
        SpeechEngine.unlockAndSpeak(INTAKE_QUESTIONS[next].text, {
          rate: 1.38, basePitch: 1.62, signal: sig.current,
          onDone: () => setSpeaking(false)
        });
      }
    }, 320);
  };

  const currentText = phase === 'intro'
    ? (lineIdx === -1 ? '' : script[lineIdx]?.text ?? '')
    : INTAKE_QUESTIONS[intakeStep]?.text ?? '';

  const introProgress = Math.max(0, ((lineIdx + 1) / script.length) * 100);
  const totalSteps = script.length + INTAKE_QUESTIONS.length;
  const overallProgress = phase === 'intro'
    ? ((lineIdx + 1) / totalSteps) * 100
    : ((script.length + intakeStep + 1) / totalSteps) * 100;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(6,18,24,0.97)', backdropFilter:'blur(20px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:exitAnim?0:overlayIn?1:0, transition:exitAnim?'opacity 0.5s ease':'opacity 0.45s ease', userSelect:'none' }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'26%', left:'50%', transform:'translateX(-50%)', width:640, height:640, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(13,148,136,0.18) 0%,transparent 68%)', pointerEvents:'none' }}/>

      {/* Header bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'14px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(217,119,6,0.09)', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#0d9488', boxShadow:'0 0 10px #0d9488', animation:'para-pulse 1.8s ease-in-out infinite' }}/>
          <span style={{ color:'#2dd4bf', fontFamily:'monospace', fontSize:12, letterSpacing:'0.18em', fontWeight:600 }}>PARA · Your Guide</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button
            onClick={() => { const nm = !muted; if (nm) SpeechEngine.cancel(); }}
            title={muted ? 'Unmute' : 'Mute'}
            style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.07)', border:`1px solid ${muted?'rgba(255,255,255,0.1)':'rgba(217,119,6,0.4)'}`, color:muted?'#475569':'#f59e0b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
            {muted ? '🔇' : '🔊'}
          </button>
          {skippable && (
            <button onClick={skip} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', color:'#9ca3af', borderRadius:8, padding:'5px 13px', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
              Skip ×
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'rgba(217,119,6,0.1)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#0d9488,#2dd4bf)', width:`${overallProgress}%`, boxShadow:'0 0 8px #0d9488', transition:'width 0.7s ease' }}/>
      </div>

      {/* Robot + speech bubble */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:22, maxWidth:580, padding:'0 22px', position:'relative', zIndex:1, width:'100%' }}>
        <div style={{ transform:`translateY(${robotY}px)`, transition:robotY===-280?'none':'transform 0.38s cubic-bezier(0.34,1.6,0.64,1)', position:'relative' }}>
          <div style={{ animation:'para-float 3.4s ease-in-out infinite' }}>
            <Robot mood={mood} speaking={speaking} size={1.45}/>
          </div>
          {speaking && <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:140, height:24, background:'radial-gradient(ellipse,rgba(245,158,11,0.32) 0%,transparent 70%)', animation:'para-ripple 0.9s ease-in-out infinite' }}/>}
        </div>

        {phase === 'intro' && lineIdx >= 0 && (
          <div style={{ position:'relative', background:'rgba(22,32,48,0.92)', border:`1px solid rgba(13,148,136,${speaking?'0.7':'0.3'})`, borderRadius:18, padding:'20px 28px', maxWidth:540, width:'100%', textAlign:'center', backdropFilter:'blur(10px)', boxShadow:speaking?'0 0 36px rgba(13,148,136,0.25)':'0 8px 32px rgba(0,0,0,0.3)', transition:'border-color 0.3s,box-shadow 0.4s', minHeight:76 }}>
            <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'11px solid transparent', borderRight:'11px solid transparent', borderBottom:`11px solid rgba(13,148,136,${speaking?'0.7':'0.3'})` }}/>
            <p style={{ color:'#f1f5f9', fontSize:17, lineHeight:1.72, margin:0, fontWeight:400 }}>{currentText}</p>
          </div>
        )}

        {/* Feature card */}
        <div style={{ minHeight:60, width:'100%', maxWidth:440, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {card && (
            <div style={{ display:'flex', alignItems:'center', gap:16, background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.3)', borderRadius:16, padding:'13px 20px', width:'100%', opacity:cardIn?1:0, transform:cardIn?'translateY(0) scale(1)':'translateY(10px) scale(0.96)', transition:'all 0.38s cubic-bezier(0.34,1.3,0.64,1)' }}>
              <span style={{ fontSize:28 }}>{card.icon}</span>
              <div>
                <div style={{ color:'#2dd4bf', fontWeight:700, fontSize:13, marginBottom:2 }}>{card.title}</div>
                <div style={{ color:'#94a3b8', fontSize:12 }}>{card.desc}</div>
              </div>
            </div>
          )}
        </div>

        {/* Intake questions */}
        {phase === 'intake' && (
          <div style={{ width:'100%', maxWidth:480, opacity:intakePhraseIn?1:0, transform:intakePhraseIn?'translateY(0)':'translateY(12px)', transition:'all 0.38s ease', display:'flex', flexDirection:'column', gap:10 }}>
            {/* Intake question text */}
            <div style={{ background:'rgba(22,32,48,0.92)', border:`1px solid rgba(13,148,136,${speaking?'0.7':'0.3'})`, borderRadius:18, padding:'18px 24px', textAlign:'center', position:'relative', marginBottom:4 }}>
              <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'11px solid transparent', borderRight:'11px solid transparent', borderBottom:`11px solid rgba(13,148,136,${speaking?'0.7':'0.3'})` }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:8 }}>
                <span style={{ color:'#64748b', fontSize:11, fontFamily:'monospace', letterSpacing:'0.1em' }}>
                  QUESTION {intakeStep + 1} OF {INTAKE_QUESTIONS.length}
                </span>
              </div>
              <p style={{ color:'#f1f5f9', fontSize:16, lineHeight:1.65, margin:0 }}>{INTAKE_QUESTIONS[intakeStep]?.text}</p>
            </div>
            {/* Answer options */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {INTAKE_QUESTIONS[intakeStep]?.options.map(opt => (
                <button key={opt} onClick={() => handleIntakeAnswer(opt)}
                  style={{ background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.3)', color:'#5eead4', borderRadius:14, padding:'12px 18px', fontSize:14, cursor:'pointer', textAlign:'left', transition:'all 0.16s', fontFamily:'inherit', lineHeight:1.4 }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(13,148,136,0.20)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(13,148,136,0.08)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.3)'; }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TAP TO START — voice unlock overlay. Shows until user taps. */}
      {!voiceStarted && robotY === 0 && (
        <div style={{ position:'absolute', inset:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(8,12,20,0.72)', backdropFilter:'blur(4px)', animation:'para-fadein 0.5s ease' }}>
          <button
            onClick={handleTapToStart}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:14,
              background:'rgba(13,148,136,0.12)', border:'2px solid rgba(13,148,136,0.6)',
              borderRadius:24, padding:'28px 40px', cursor:'pointer', fontFamily:'inherit',
              transition:'all 0.18s', userSelect:'none'
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(13,148,136,0.22)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(13,148,136,0.12)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.6)'; }}>
            <span style={{ fontSize:42 }}>🔊</span>
            <span style={{ color:'#2dd4bf', fontSize:20, fontWeight:700, letterSpacing:'-0.01em' }}>Tap to meet PARA 👋</span>
            <span style={{ color:'#94a3b8', fontSize:13, textAlign:'center', lineHeight:1.5, maxWidth:220 }}>
              Tap once to enable voice — PARA will talk you through everything!
            </span>
          </button>
        </div>
      )}

      {/* Microphone permission prompt — friendly overlay before native browser dialog */}
      {showMicPrompt && (
        <div style={{ position:'absolute', inset:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(8,12,20,0.85)', backdropFilter:'blur(6px)' }}>
          <div style={{ background:'rgba(22,32,48,0.98)', border:'1px solid rgba(217,119,6,0.45)', borderRadius:20, padding:'32px 28px', maxWidth:360, textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize:44, marginBottom:16 }}>🎙️</div>
            <h3 style={{ color:'#2dd4bf', fontSize:18, fontWeight:700, margin:'0 0 10px' }}>Can I use your mic? 🎙️</h3>
            <p style={{ color:'#94a3b8', fontSize:14, lineHeight:1.65, margin:'0 0 24px' }}>
              So you can speak your answers instead of typing! I just need your microphone permission — it only takes a second.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={handleMicRequest}
                style={{ background:'linear-gradient(135deg,#0d9488,#0891b2)', border:'none', color:'white', borderRadius:12, padding:'13px 20px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                Yes! Enable microphone 🎙️
              </button>
              <button onClick={() => { setShowMicPrompt(false); setMicStatus('denied'); }}
                style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', borderRadius:12, padding:'11px 20px', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                No thanks, I'll type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mic status indicator — shows briefly after permission granted/denied */}
      {micStatus === 'granted' && !showMicPrompt && (
        <div style={{ position:'absolute', top:56, right:20, display:'flex', alignItems:'center', gap:7, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.4)', borderRadius:20, padding:'6px 14px', animation:'para-fadein 0.3s ease' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 7px #10b981' }}/>
          <span style={{ color:'#10b981', fontSize:12, fontWeight:600 }}>Mic on</span>
        </div>
      )}
      {micStatus === 'denied' && !showMicPrompt && (
        <div style={{ position:'absolute', top:56, right:20, display:'flex', alignItems:'center', gap:7, background:'rgba(100,116,139,0.15)', border:'1px solid rgba(100,116,139,0.3)', borderRadius:20, padding:'6px 14px', animation:'para-fadein 0.3s ease' }}>
          <span style={{ color:'#64748b', fontSize:12 }}>⌨️ Typing mode</span>
        </div>
      )}

      {/* Dot indicators */}
      <div style={{ position:'absolute', bottom:14, display:'flex', gap:7 }}>
        {[...script, ...INTAKE_QUESTIONS].map((_, i) => {
          const current = phase === 'intro' ? lineIdx : script.length + intakeStep;
          return <div key={i} style={{ width:i===current?20:6, height:6, borderRadius:3, background:i<=current?'#0d9488':'rgba(13,148,136,0.2)', boxShadow:i===current?'0 0 8px #0d9488':'none', transition:'all 0.32s ease' }}/>;
        })}
      </div>
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
          style={{ background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.3)', color:'#5eead4', borderRadius:20, padding:'5px 13px', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', whiteSpace:'nowrap', lineHeight:1.4 }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(13,148,136,0.20)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(13,148,136,0.08)'; e.currentTarget.style.borderColor='rgba(13,148,136,0.3)'; }}>
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
  const bottomRef   = useRef(null);
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
  const panelWidth = 'min(400px, calc(100vw - 40px))';

  return (
    <div style={{ position:'fixed', bottom:112, right:20, zIndex:9990, width:panelWidth, maxHeight:'76vh', background:'rgba(8,20,28,0.98)', border:'1px solid rgba(13,148,136,0.35)', borderRadius:20, boxShadow:'0 28px 72px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', transform:open?'translateY(0) scale(1)':'translateY(20px) scale(0.94)', opacity:open?1:0, pointerEvents:open?'all':'none', transition:'all 0.28s cubic-bezier(0.34,1.3,0.64,1)', overflow:'hidden' }}>
      <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(13,148,136,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(13,148,136,0.05)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 7px #10b981' }}/>
          <span style={{ color:'#2dd4bf', fontWeight:700, fontSize:14 }}>PARA 👋</span>
          <span style={{ color:'#475569', fontSize:12 }}>· ParasitePro Guide</span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {messages.length > 1 && (
            <button onClick={onClear} title="Fresh start"
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

      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 8px', display:'flex', flexDirection:'column', gap:12, scrollbarWidth:'thin', scrollbarColor:'rgba(13,148,136,0.25) transparent' }}>
        {messages.map((m, idx) => (
          <div key={m.id}>
            <div style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:7 }}>
              {m.role==='assistant' && (
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:2 }}>
                  <span style={{ fontSize:12 }}>🤖</span>
                </div>
              )}
              <div style={{ maxWidth:'84%' }}>
                <div style={{ padding:'10px 14px', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.role==='user'?'rgba(13,148,136,0.18)':'rgba(15,32,46,0.95)', border:m.role==='user'?'1px solid rgba(13,148,136,0.4)':'1px solid rgba(13,148,136,0.1)' }}>
                  {m.role==='user'
                    ? <p style={{ color:'#f1f5f9', fontSize:14, lineHeight:1.58, margin:0, whiteSpace:'pre-wrap' }}>{m.content}</p>
                    : <MarkdownText text={m.content}/>
                  }
                </div>
                {m.role==='assistant' && (
                  <button
                    onClick={() => {
                      SpeechEngine.unlockAndSpeak(m.content, { rate:1.38, basePitch:1.55 });
                    }}
                    title="Listen to this message"
                    style={{ marginTop:4, marginLeft:2, background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:13, padding:'2px 6px', borderRadius:6, transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#f59e0b'}
                    onMouseLeave={e => e.currentTarget.style.color='#475569'}>
                    🔊
                  </button>
                )}
              </div>
            </div>
            {m.role==='assistant' && idx===lastAssistantIdx && !loading && m.suggestions && (
              <SuggestionChips suggestions={m.suggestions} onSelect={onSend} disabled={loading}/>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:12 }}>🤖</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(30,41,59,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px 16px 16px 4px' }}>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#0d9488', animation:`para-bounce 1.1s ease-in-out ${i*0.16}s infinite` }}/>)}
              </div>
              <span style={{ color:'#64748b', fontSize:12 }}>PARA is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8, alignItems:'flex-end', flexShrink:0, background:'rgba(8,14,26,0.7)' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask PARA anything…"
          rows={1}
          style={{ flex:1, background:'rgba(25,38,58,0.9)', border:'1px solid rgba(13,148,136,0.25)', borderRadius:12, color:'#f1f5f9', fontSize:14, padding:'9px 13px', resize:'none', outline:'none', lineHeight:1.45, overflow:'hidden', fontFamily:'inherit', transition:'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor='rgba(13,148,136,0.6)'}
          onBlur={e => e.target.style.borderColor='rgba(13,148,136,0.25)'}
        />
        <button onClick={submit} disabled={!input.trim()||loading}
          style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:input.trim()?'#0d9488':'rgba(13,148,136,0.12)', border:'none', cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', transform:input.trim()?'scale(1.04)':'scale(1)' }}>
          <Send size={15} color={input.trim()?'white':'#475569'}/>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FLOATING BOT
══════════════════════════════════════════════════════════════════ */
function FloatingBot({ mood, speaking, muted, chatOpen, onToggleChat, onToggleMute }) {
  return (
    <div style={{ position:'fixed', bottom:18, right:18, zIndex:9991, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <button onClick={onToggleMute} title={muted?'Unmute PARA':'Mute PARA'}
        style={{ width:32, height:32, borderRadius:'50%', background:'rgba(12,22,40,0.95)', border:`1px solid ${muted?'rgba(255,255,255,0.08)':'rgba(13,148,136,0.5)'}`, color:muted?'#475569':'#0d9488', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
        {muted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
      </button>
      <div onClick={onToggleChat} title="Chat with PARA"
        style={{ cursor:'pointer', position:'relative', animation:chatOpen?'none':'para-float 3.2s ease-in-out infinite', willChange:'transform' }}>
        {speaking && <div style={{ position:'absolute', inset:-10, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(245,158,11,0.28) 0%,transparent 70%)', animation:'para-ripple 1s ease-in-out infinite', pointerEvents:'none' }}/>}
        {!chatOpen && <div style={{ position:'absolute', top:4, right:4, width:10, height:10, borderRadius:'50%', background:'#10b981', border:'2px solid #0f172a', boxShadow:'0 0 7px #10b981', animation:'para-pulse 2s ease-in-out infinite', zIndex:1 }}/>}
        <Robot mood={mood} speaking={speaking} size={0.72}/>
      </div>
      {!chatOpen && (
        <div style={{ background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.35)', borderRadius:10, padding:'4px 10px', whiteSpace:'nowrap', animation:'para-fadein 0.4s ease' }}>
          <span style={{ color:'#2dd4bf', fontSize:11, fontFamily:'monospace', fontWeight:600 }}>Hi! I'm PARA 👋</span>
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
  const location  = useLocation();
  const [phase,     setPhase]    = useState<Phase>('hidden');
  const [chatOpen,  setChatOpen] = useState(false);
  const [mood,      setMood]     = useState<Mood>('idle');
  const [speaking,  setSpeaking] = useState(false);
  const [muted,     setMuted]    = useState(false);
  const [messages,  setMessages] = useState<Msg[]>([]);
  const [loading,   setLoading]  = useState(false);
  const idRef   = useRef(0);
  const sigRef  = useRef({ cancelled: false });
  const prevPageRef = useRef<string>('');

  const PROTECTED = ['/dashboard','/upload','/analysis','/settings','/food-diary','/treatment-tracker','/pricing','/encyclopedia','/symptom-journal'];
  const isProtected = PROTECTED.some(p => location.pathname.startsWith(p));

  // Key stored in localStorage so intro only ever shows once per user account
  const introKey = `para_intro_done_${user?.id || 'guest'}`;

  useEffect(() => { SpeechEngine.init(); }, []);

  useEffect(() => {
    if (!isAuthenticated || !isProtected) { setPhase('hidden'); return; }

    const introDone = localStorage.getItem(introKey);
    const currentPath = location.pathname;

    if (!introDone) {
      // First ever login — show full cinematic intro + intake
      setPhase('intro');
      prevPageRef.current = currentPath;
      return;
    }

    // Returning user — go straight to chat, fire page-arrival greeting
    setPhase('chat');
    if (prevPageRef.current === currentPath) return;
    prevPageRef.current = currentPath;

    const pageKey = `para_page_${user?.id||'guest'}_${currentPath.replace(/\//g,'-')}`;
    const isFirstPageVisit = !sessionStorage.getItem(pageKey);
    if (isFirstPageVisit) sessionStorage.setItem(pageKey, '1');

    sendToApi(
      `[SYSTEM: User navigated to ${currentPath}. Give a short warm page-specific greeting. Use their name and credit balance.]`,
      [],
      'PAGE_ARRIVE',
      isFirstPageVisit,
      false  // DO speak — returning users have already triggered the voice unlock via intro
    );
  }, [isAuthenticated, isProtected, location.pathname]);

  const addBot = (content: string, suggestions: string[] = []) =>
    setMessages(prev => [...prev, { role:'assistant', content, suggestions, id: ++idRef.current }]);

  // Called when the intro + intake sequence completes
  const handleIntroDone = (intakeData: Record<string,string>) => {
    // Persist intake health context
    const healthContext = {
      reason:   intakeData.reason   || '',
      age:      intakeData.age      || '',
      symptoms: intakeData.symptoms || '',
      duration: intakeData.duration || '',
    };
    try { sessionStorage.setItem('para_health_context', JSON.stringify(healthContext)); } catch {}

    // Mark intro as done (localStorage = permanent)
    localStorage.setItem(introKey, '1');

    const pageKey = `para_page_${user?.id||'guest'}_${location.pathname.replace(/\//g,'-')}`;
    sessionStorage.setItem(pageKey, '1');
    prevPageRef.current = location.pathname;

    setPhase('chat');
    // Auto-open chat panel — no click required
    setTimeout(() => setChatOpen(true), 400);

    // Fire a personalised first message from PARA based on intake
    const intakeSummary = `Reason: ${healthContext.reason}. Age: ${healthContext.age}. Symptoms: ${healthContext.symptoms}. Duration: ${healthContext.duration}.`;
    setTimeout(() => sendToApi(
      `[SYSTEM: User just completed onboarding intake. ${intakeSummary}. Give a warm personalised first step. Tell them exactly what to do first based on what they shared. Use their first name.]`,
      [],
      'INTAKE_COMPLETE',
      true,
      false  // speak — user has interacted during intake so voice is unlocked
    ), 550);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const isTour = trimmed.toLowerCase().includes('tour') || trimmed.toLowerCase().includes('show me around');
    const history = messages
      .filter(m => !m.content.startsWith('[SYSTEM:'))
      .map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role:'user', content:trimmed, id: ++idRef.current }]);
    sendToApi(trimmed, history, isTour ? 'TOUR_START' : 'USER_MESSAGE', false, false);
  };

  const handleClear = () => {
    SpeechEngine.cancel(); setSpeaking(false); setMood('idle'); setMessages([]);
    addBot("Fresh start! What can I help you with? 🔬", ['Start a new analysis', 'Take me on a tour', 'How do credits work?']);
  };

  const sendToApi = async (
    text: string,
    history: {role:string;content:string}[],
    triggerType: string = 'USER_MESSAGE',
    isFirstVisit: boolean = false,
    noSpeak: boolean = false
  ) => {
    setLoading(true); setMood('thinking');

    let healthContext = null;
    try { const raw = sessionStorage.getItem('para_health_context'); if (raw) healthContext = JSON.parse(raw); } catch {}

    const token = useAuthStore.getState().accessToken;
    const currentUser = useAuthStore.getState().user;
    const userState = { credits: currentUser?.imageCredits ?? 0, imageCredits: currentUser?.imageCredits ?? 0, firstName: currentUser?.firstName || 'there', isFirstVisit };

    try {
      const res = await fetch(getApiUrl('/api/chatbot/message'), {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
        body:JSON.stringify({ message: text, conversationHistory: history, healthContext, currentPage: location.pathname, userState, triggerType }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = res.status===401 ? 'Session expired — please refresh and log in again.'
          : res.status===402 ? "PARA's AI credits are low. Fallon will top them up soon — try again shortly!"
          : data.error || 'Something went wrong on my end. Try again in a sec?';
        setLoading(false); setMood('concerned');
        setMessages(prev => [...prev, { role:'assistant', content:errMsg, suggestions:['Try again','Go to dashboard'], id:++idRef.current }]);
        setTimeout(() => setMood('idle'), 2200);
        return;
      }

      const reply = data.message || "Sorry, had a little hiccup there. Try again in a sec?";
      const suggestions: string[] = Array.isArray(data.suggestions) ? data.suggestions : [];

      setLoading(false); setMood('talking'); setSpeaking(true);
      setMessages(prev => [...prev, { role:'assistant', content:reply, suggestions, id:++idRef.current }]);

      // Voice plays only when user taps the 🔊 button on the message
      // (auto-play after async API call is blocked by all browsers)
      setTimeout(() => { setSpeaking(false); setMood('idle'); }, 400);
    } catch {
      setLoading(false); setMood('concerned');
      setMessages(prev => [...prev, { role:'assistant', content:"Couldn't connect just then. Check your connection and try again.", suggestions:['Try again'], id:++idRef.current }]);
      setTimeout(() => setMood('idle'), 2200);
    }
  };

  const toggleMute = () => {
    const nm = !muted; setMuted(nm);
    if (nm) { sigRef.current.cancelled=true; SpeechEngine.cancel(); setSpeaking(false); }
  };

  const openChat = () => {
    setChatOpen(o => {
      const opening = !o;
      if (opening && messages.length === 0) {
        const name = useAuthStore.getState().user?.firstName || 'there';
        const credits = useAuthStore.getState().user?.imageCredits ?? 0;
        addBot(
          credits > 0
            ? `Hey ${name}! 👋 You have got **${credits} credit${credits !== 1 ? 's' : ''}** ready. Ask me anything!`
            : `Hey ${name}! 👋 You are out of credits right now — head to **Pricing** to top up!`,
          credits > 0
            ? ['Start a new analysis', 'How do I upload?', 'What can you detect?']
            : ['Take me to Pricing', 'How do credits work?', 'Show me a sample report']
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

      {phase==='intro' && (
        <IntroScreen
          userName={user?.firstName || 'Hey you'}
          muted={muted}
          onDone={handleIntroDone}
        />
      )}
      {phase==='chat' && (
        <ChatPanel
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          messages={messages}
          onSend={handleSend}
          onClear={handleClear}
          loading={loading}
        />
      )}
      {phase==='chat' && (
        <FloatingBot
          mood={mood}
          speaking={speaking}
          muted={muted}
          chatOpen={chatOpen}
          onToggleChat={openChat}
          onToggleMute={toggleMute}
        />
      )}
    </>
  );
}
