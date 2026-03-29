// @ts-nocheck
/**
 * SignupAssistant.tsx — v5
 * + Microphone input (Web Speech API SpeechRecognition)
 * + Fixed TTS: voices pre-cached, proper gesture unlock via warmup
 * + Mic pulsing ring animation + live transcript feedback
 */

import { useState, useEffect, useRef, useCallback } from 'react';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'curious';

const CSS = `
@keyframes sa-flyin {
  from { opacity:0; transform:translateY(40px) scale(0.9); }
  to   { opacity:1; transform:translateY(0)    scale(1);   }
}
@keyframes sa-fadeout {
  from { opacity:1; transform:scale(1);    }
  to   { opacity:0; transform:scale(0.92); }
}
@keyframes sa-bob {
  0%,100% { transform:translateY(0px)  rotate(0deg);  }
  25%     { transform:translateY(-5px) rotate(2deg);  }
  75%     { transform:translateY(-3px) rotate(-2deg); }
}
@keyframes sa-fadein {
  from { opacity:0; transform:translateY(6px); }
  to   { opacity:1; transform:translateY(0);   }
}
@keyframes sa-dots {
  0%,80%,100% { opacity:0.2; transform:scale(0.8); }
  40%          { opacity:1;   transform:scale(1.2); }
}
@keyframes sa-saved {
  0%   { opacity:0; transform:scale(0.6) translateY(4px);  }
  40%  { opacity:1; transform:scale(1.1) translateY(-2px); }
  100% { opacity:0; transform:scale(1)   translateY(-10px);}
}
@keyframes sa-summaryin {
  from { opacity:0; transform:scale(0.97) translateY(8px); }
  to   { opacity:1; transform:scale(1)    translateY(0);   }
}
@keyframes sa-pulse {
  0%,100% { box-shadow:0 0 0 0 rgba(13,148,136,0.4); }
  50%     { box-shadow:0 0 0 6px rgba(13,148,136,0);  }
}
@keyframes sa-glow-flash {
  0%   { filter:brightness(1) drop-shadow(0 0 0px #34d399); }
  35%  { filter:brightness(1.35) drop-shadow(0 0 18px #34d399); }
  100% { filter:brightness(1) drop-shadow(0 0 0px #34d399); }
}
@keyframes sa-confetti-out {
  0%   { opacity:1; transform:translate(0,0) rotate(0deg) scale(1); }
  100% { opacity:0; transform:translate(var(--cx),var(--cy)) rotate(var(--cr)) scale(0.4); }
}
@keyframes sa-mic-ring {
  0%   { transform:scale(1);   opacity:0.8; }
  100% { transform:scale(2.4); opacity:0;   }
}
@keyframes sa-mic-throb {
  0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,0.4); }
  50%     { box-shadow:0 0 0 7px rgba(239,68,68,0);  }
}
@keyframes sa-transcript-in {
  from { opacity:0; transform:translateY(4px); }
  to   { opacity:1; transform:translateY(0);   }
}
.sa-btn {
  padding: 9px 15px;
  background: rgba(13,148,136,0.12);
  border: 1.5px solid rgba(13,148,136,0.4);
  border-radius: 999px;
  color: #2dd4bf;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, transform 0.1s, border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  white-space: nowrap;
}
.sa-btn:hover  { background:rgba(13,148,136,0.28); border-color:rgba(13,148,136,0.7); }
.sa-btn:active { background:rgba(13,148,136,0.45); transform:scale(0.95); }
.sa-cta {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg,#0d9488,#0891b2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  animation: sa-pulse 2s ease-in-out infinite;
}
.sa-cta:hover  { opacity:0.9; }
.sa-cta:active { transform:scale(0.98); opacity:1; }
`;

/* ── Voice cache ─────────────────────────────────────────────── */
let _voices: SpeechSynthesisVoice[] = [];
function cacheVoices() {
  if (window.speechSynthesis) _voices = window.speechSynthesis.getVoices();
}
function getBestVoice(): SpeechSynthesisVoice | null {
  const v = _voices.length ? _voices : (window.speechSynthesis?.getVoices() || []);
  return (
    v.find(x => /google australian/i.test(x.name)) ||
    v.find(x => /karen/i.test(x.name) && x.lang.startsWith('en')) ||
    v.find(x => x.lang === 'en-AU') ||
    v.find(x => /google uk english female/i.test(x.name)) ||
    v.find(x => x.lang.startsWith('en')) ||
    null
  );
}
function speakText(text: string, onDone?: () => void) {
  if (!window.speechSynthesis) { onDone?.(); return; }
  window.speechSynthesis.cancel();
  const clean = text.replace(/\*\*/g,'').replace(/[🎁👋🚀✦📚✅🎯🔊🔇📋👤🎂📍✈️🔍⏱️]/g,'').trim();
  if (!clean) { onDone?.(); return; }
  const utt = new SpeechSynthesisUtterance(clean);
  utt.rate = 1.05; utt.pitch = 0.95; utt.volume = 1;
  const voice = getBestVoice();
  if (voice) utt.voice = voice;
  utt.onend   = () => onDone?.();
  utt.onerror = () => onDone?.();
  window.speechSynthesis.speak(utt);
}

/* ── Confetti ─────────────────────────────────────────────────── */
function Confetti() {
  const COLORS = ['#0d9488','#34d399','#fbbf24','#f472b6','#60a5fa','#a78bfa'];
  const pieces = Array.from({length:16},(_,i)=>({
    id:i, cx:`${(Math.random()-0.5)*180}px`, cy:`${-(60+Math.random()*100)}px`,
    cr:`${(Math.random()-0.5)*720}deg`, color:COLORS[i%COLORS.length],
    shape:i%3===0?'square':'circle', size:5+Math.random()*5, delay:`${Math.random()*0.2}s`,
  }));
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible',zIndex:10}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:'absolute', top:'50%', left:'50%',
          width:p.size, height:p.size,
          borderRadius:p.shape==='circle'?'50%':'3px',
          background:p.color,
          '--cx':p.cx,'--cy':p.cy,'--cr':p.cr,
          animation:`sa-confetti-out 1.1s ${p.delay} ease-out forwards`,
        } as any}/>
      ))}
    </div>
  );
}

/* ── Robot avatar ─────────────────────────────────────────────── */
function Robot({ mood, speaking, size = 1 }) {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const next = () => { const t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 120); next(); }, 4000 + Math.random() * 2000); return t; };
    const t = next(); return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!speaking) { setMouth(0); return; }
    const t = setInterval(() => setMouth(p => (p + 1) % 4), 140); return () => clearInterval(t);
  }, [speaking]);
  useEffect(() => {
    const t = setInterval(() => setPulse(v => !v), 800 + Math.random() * 400); return () => clearInterval(t);
  }, []);

  const eyeGlow  = mood==='concerned'?'#f87171':mood==='happy'?'#34d399':mood==='thinking'?'#c4b5fd':'#60a5fa';
  const ledColor = mood==='thinking'?'#c4b5fd':mood==='happy'?'#34d399':mood==='concerned'?'#f87171':'#f97316';
  const skinBase = mood==='concerned'?'#1a6060':mood==='happy'?'#0d7070':'#1a7f7f';
  const skinMid  = mood==='concerned'?'#226666':mood==='happy'?'#12887a':'#228888';
  const skinHi   = mood==='concerned'?'#2a7a7a':mood==='happy'?'#18a090':'#2aa0a0';
  const mouthPaths=['M 38 78 Q 50 83 62 78','M 39 78 Q 50 85 61 78','M 40 77 Q 50 88 60 77','M 41 76 Q 50 91 59 76'];
  const mp  = speaking?mouthPaths[mouth]:(mood==='concerned'?'M 40 80 Q 50 77 60 80':mouthPaths[0]);
  const eyeH= blink?1:mood==='surprised'?10:mood==='happy'?7:8;

  return (
    <svg width={110*size} height={150*size} viewBox="0 0 110 150"
      style={{overflow:'visible',filter:`drop-shadow(0 0 ${speaking?20:10}px ${eyeGlow}60)`,transition:'filter 0.3s'}}>
      <rect x="40" y="112" width="30" height="22" rx="8" fill={skinBase}/>
      <rect x="44" y="112" width="22" height="14" rx="4" fill={skinMid} opacity="0.6"/>
      <ellipse cx="55" cy="145" rx="38" ry="14" fill="#0f172a" stroke="rgba(13,148,136,0.3)" strokeWidth="1.5"/>
      <path d="M 20 138 Q 55 128 90 138" fill="none" stroke="#0d9488" strokeWidth="1.5" opacity="0.7"/>
      <line x1="55" y1="128" x2="55" y2="150" stroke="rgba(13,148,136,0.25)" strokeWidth="1"/>
      <ellipse cx="55" cy="65" rx="34" ry="38" fill={skinBase} style={{filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.5))'}}/>
      <ellipse cx="48" cy="48" rx="18" ry="12" fill={skinHi} opacity="0.35"/>
      <ellipse cx="55" cy="95" rx="22" ry="9" fill={skinBase} opacity="0.8"/>
      <ellipse cx="55" cy="32" rx="33" ry="16" fill="#1a1a2e"/>
      <ellipse cx="55" cy="28" rx="30" ry="12" fill="#252540"/>
      <ellipse cx="24" cy="52" rx="10" ry="20" fill="#1a1a2e"/>
      <ellipse cx="86" cy="52" rx="10" ry="20" fill="#1a1a2e"/>
      <ellipse cx="45" cy="26" rx="12" ry="5" fill="white" opacity="0.08"/>
      <path d="M 30 35 Q 42 22 62 28 Q 72 30 78 38" fill="#252540" stroke="#1a1a2e" strokeWidth="1"/>
      <path d="M 35 32 Q 50 18 68 26" fill="none" stroke="#333355" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 32 54 Q 40 50 46 53" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" style={{transform:mood==='concerned'?'rotate(5deg)':mood==='curious'?'rotate(-3deg)':'none',transformOrigin:'39px 52px',transition:'transform 0.3s'}}/>
      <path d="M 64 53 Q 70 50 78 54" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" style={{transform:mood==='concerned'?'rotate(-5deg)':mood==='curious'?'rotate(3deg)':'none',transformOrigin:'71px 52px',transition:'transform 0.3s'}}/>
      <ellipse cx="38" cy="62" rx="11" ry={blink?1:eyeH+2} fill="#0a1520" style={{transition:'ry 0.08s'}}/>
      <ellipse cx="72" cy="62" rx="11" ry={blink?1:eyeH+2} fill="#0a1520" style={{transition:'ry 0.08s'}}/>
      {!blink&&<>
        <ellipse cx="38" cy="62" rx="8" ry={eyeH} fill={eyeGlow} opacity="0.9" style={{filter:`drop-shadow(0 0 8px ${eyeGlow})`,transition:'fill 0.3s,ry 0.08s'}}/>
        <ellipse cx="72" cy="62" rx="8" ry={eyeH} fill={eyeGlow} opacity="0.9" style={{filter:`drop-shadow(0 0 8px ${eyeGlow})`,transition:'fill 0.3s,ry 0.08s'}}/>
        <ellipse cx="38" cy="62" rx="4" ry={Math.max(eyeH-3,1)} fill="#050d18"/>
        <ellipse cx="72" cy="62" rx="4" ry={Math.max(eyeH-3,1)} fill="#050d18"/>
        <circle cx="35" cy="59" r="2.5" fill="white" opacity="0.75"/>
        <circle cx="69" cy="59" r="2.5" fill="white" opacity="0.75"/>
        <circle cx="36" cy="58" r="1" fill="white" opacity="0.5"/>
        <circle cx="70" cy="58" r="1" fill="white" opacity="0.5"/>
      </>}
      <path d="M 52 68 Q 50 76 47 78 Q 53 80 63 78 Q 60 76 58 68" fill="none" stroke={skinBase} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d={mp} fill="none" stroke={speaking?eyeGlow:'#0d4040'} strokeWidth={speaking?3:2.5} strokeLinecap="round" style={{filter:speaking?`drop-shadow(0 0 6px ${eyeGlow})`:'none',transition:'stroke 0.2s'}}/>
      {speaking&&mouth>=2&&<ellipse cx="55" cy="82" rx="7" ry="3" fill="white" opacity="0.8"/>}
      <circle cx="55" cy="100" r="2" fill={skinBase} opacity="0.4"/>
      <ellipse cx="21" cy="65" rx="6" ry="9" fill={skinBase} stroke={skinMid} strokeWidth="1"/>
      <ellipse cx="21" cy="65" rx="3" ry="5" fill={skinMid} opacity="0.5"/>
      <ellipse cx="89" cy="65" rx="6" ry="9" fill={skinBase} stroke={skinMid} strokeWidth="1"/>
      <ellipse cx="89" cy="65" rx="3" ry="5" fill={skinMid} opacity="0.5"/>
      <path d="M 18 58 Q 18 20 55 18 Q 92 20 92 58" fill="none" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round"/>
      <path d="M 18 58 Q 18 20 55 18 Q 92 20 92 58" fill="none" stroke="#333355" strokeWidth="5" strokeLinecap="round"/>
      <path d="M 20 56 Q 20 22 55 20 Q 90 22 90 56" fill="none" stroke={ledColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" style={{filter:`drop-shadow(0 0 4px ${ledColor})`}}/>
      <ellipse cx="18" cy="65" rx="9" ry="13" fill="#1a1a2e" stroke="#333355" strokeWidth="1.5"/>
      <ellipse cx="18" cy="65" rx="6" ry="9" fill="#252540"/>
      <circle cx="18" cy="65" r="3.5" fill={ledColor} opacity={pulse?0.95:0.5} style={{filter:pulse?`drop-shadow(0 0 8px ${ledColor})`:'none',transition:'opacity 0.4s,filter 0.4s'}}/>
      <ellipse cx="92" cy="65" rx="9" ry="13" fill="#1a1a2e" stroke="#333355" strokeWidth="1.5"/>
      <ellipse cx="92" cy="65" rx="6" ry="9" fill="#252540"/>
      <path d="M 92 73 Q 100 80 98 90" fill="none" stroke="#333355" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="97" cy="92" rx="4" ry="3" fill="#1a1a2e" stroke={ledColor} strokeWidth="1"/>
      <circle cx="97" cy="92" r="2" fill={ledColor} opacity="0.8" style={{filter:`drop-shadow(0 0 5px ${ledColor})`}}/>
      {mood==='thinking'&&[0,1,2].map((i)=>(<circle key={i} cx={42+i*13} cy="40" r="3.5" fill="#c4b5fd" opacity={0.2+0.8*((mouth+i)%3===0?1:0)} style={{filter:'drop-shadow(0 0 5px #c4b5fd)',transition:'opacity 0.18s'}}/>))}
      {mood==='surprised'&&<><circle cx="18" cy="42" r="2.5" fill="#fbbf24" opacity="0.9" style={{filter:'drop-shadow(0 0 6px #fbbf24)'}}/><circle cx="92" cy="42" r="2.5" fill="#fbbf24" opacity="0.9" style={{filter:'drop-shadow(0 0 6px #fbbf24)'}}/><circle cx="10" cy="55" r="1.5" fill="#f472b6" opacity="0.8"/><circle cx="100" cy="55" r="1.5" fill="#f472b6" opacity="0.8"/></>}
    </svg>
  );
}

/* ── Mic SVG icon ─────────────────────────────────────────────── */
function MicIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8"  y1="22" x2="16" y2="22"/>
    </svg>
  );
}

/* ── Script ──────────────────────────────────────────────────── */
type Step = { text: string; mood: Mood; options: string[] };

const INTRO: Step[] = [
  { text: "G'day! I'm PARA, your ParasitePro AI sidekick. Welcome to the app that finally ends those 3am \"is this worms?\" meltdowns. 👋", mood:'waving', options:["Ha! Tell me more"] },
  { text: "ParasitePro uses AI to scan photos of samples and give you a structured educational report in seconds — so you know exactly what to say when you walk into your GP.", mood:'happy', options:["Sounds good","What about privacy?"] },
  { text: "Quick heads-up: ParasitePro is an educational tool only — not medical advice. We're not doctors. Always see a real GP for proper care. In an emergency call 000. All good?", mood:'concerned', options:["Got it, let's go"] },
  { text: "Beauty! I just need 6 quick details to make your first report way more accurate. Won't take long!", mood:'curious', options:["Fire away 🚀"] },
];
const INTAKE: Step[] = [
  { text:"Who's this for?",                                         mood:'curious',  options:["Myself","My child","My dog","My cat","Other pet"] },
  { text:"Roughly how old are they?",                              mood:'thinking', options:["Under 5","5–17","18–40","41–60","60+"] },
  { text:"Where in Australia? (helps match local parasites)",      mood:'curious',  options:["QLD","NSW / ACT","VIC / TAS","WA","SA / NT"] },
  { text:"Any recent travel or bush/beach walks?",                 mood:'thinking', options:["Yes — overseas","Yes — local bush/beach","No recent travel"] },
  { text:"Main concern?",                                          mood:'curious',  options:["Itching / rash","Tummy issues","Something in stool","Fatigue / brain fog","Not sure"] },
  { text:"How long has it been going on?",                         mood:'thinking', options:["Just noticed today","A few days","1–2 weeks","Weeks to months"] },
];
const INTAKE_LABELS = ["Who for","Age","Location","Recent travel","Main concern","Duration"];
const INTAKE_EMOJI  = ["👤","🎂","📍","✈️","🔍","⏱️"];
const ALL_STEPS     = [...INTRO,...INTAKE];

/* ── Main component ──────────────────────────────────────────── */
export default function SignupAssistant() {
  const [visible,      setVisible]      = useState(false);
  const [closed,       setClosed]       = useState(false);
  const [exiting,      setExiting]      = useState(false);
  const [stepIdx,      setStepIdx]      = useState(0);
  const [messages,     setMessages]     = useState([]);
  const [mood,         setMood]         = useState('waving');
  const [speaking,     setSpeaking]     = useState(false);
  const [thinking,     setThinking]     = useState(false);
  const [intake,       setIntake]       = useState({});
  const [showSummary,  setShowSummary]  = useState(false);
  const [savedFlash,   setSavedFlash]   = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [voiceOn,      setVoiceOn]      = useState(true);
  const [gestureReady, setGestureReady] = useState(false);
  const [listening,    setListening]    = useState(false);
  const [micTranscript,setMicTranscript]= useState('');
  const [micError,     setMicError]     = useState('');
  const [micSupported, setMicSupported] = useState(false);

  const chatRef        = useRef(null);
  const cssRef         = useRef(false);
  const liveRef        = useRef(null);
  const recognitionRef = useRef(null);
  const voiceOnRef     = useRef(voiceOn);
  const gestureRef     = useRef(gestureReady);

  // Keep refs in sync so async callbacks see latest value
  useEffect(() => { voiceOnRef.current    = voiceOn;     }, [voiceOn]);
  useEffect(() => { gestureRef.current    = gestureReady; }, [gestureReady]);

  // Mic support check
  useEffect(() => {
    setMicSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  // Inject CSS once
  useEffect(() => {
    if (cssRef.current) return;
    const s = document.createElement('style'); s.textContent = CSS;
    document.head.appendChild(s); cssRef.current = true;
  }, []);

  // Pre-cache TTS voices
  useEffect(() => {
    if (!window.speechSynthesis) return;
    cacheVoices();
    window.speechSynthesis.onvoiceschanged = cacheVoices;
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Auto fly-in — first message silent (no gesture yet)
  useEffect(() => {
    setVisible(true);
    deliverStep(0, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, thinking, showSummary]);

  const announce = useCallback((text) => {
    if (!liveRef.current) return;
    liveRef.current.textContent = '';
    setTimeout(() => { if (liveRef.current) liveRef.current.textContent = text; }, 50);
  }, []);

  // ── Unlock TTS on first gesture then optionally speak ───────── //
  function ensureGestureReady(thenSpeak?: string, onDone?: () => void) {
    if (gestureRef.current) {
      if (thenSpeak && voiceOnRef.current) speakText(thenSpeak, onDone);
      else onDone?.();
      return;
    }
    setGestureReady(true);
    gestureRef.current = true;
    if (!window.speechSynthesis) { onDone?.(); return; }
    // Fire a near-silent warmup word — this unlocks speechSynthesis in the browser
    const warmup = new SpeechSynthesisUtterance('a');
    warmup.volume = 0.01; warmup.rate = 2;
    warmup.onend = warmup.onerror = () => {
      if (thenSpeak && voiceOnRef.current) speakText(thenSpeak, onDone);
      else onDone?.();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(warmup);
  }

  // ── Deliver a script step ─────────────────────────────────── //
  function deliverStep(idx: number, withVoice: boolean) {
    if (idx >= ALL_STEPS.length) return;
    const step = ALL_STEPS[idx];
    setThinking(true); setMood('thinking'); setSpeaking(false);

    setTimeout(() => {
      setThinking(false); setMood(step.mood); setSpeaking(true);
      setMessages(prev => [...prev, { text: step.text, isUser: false }]);
      announce(step.text);
      if (step.mood === 'happy') { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1400); }

      if (withVoice && voiceOnRef.current) {
        speakText(step.text, () => setSpeaking(false));
      } else {
        setTimeout(() => setSpeaking(false), Math.min(step.text.length * 35, 2500));
      }
    }, 650);
  }

  // ── Option tap ────────────────────────────────────────────── //
  function handleOption(option: string) {
    if (listening) stopMic();
    setMicTranscript(''); setMicError('');

    const next = stepIdx + 1;
    const intakeIndex = stepIdx - INTRO.length;
    const isIntake    = intakeIndex >= 0 && intakeIndex < INTAKE.length;

    if (isIntake) {
      const updated = { ...intake, [intakeIndex]: option };
      setIntake(updated);
      try { sessionStorage.setItem('para_health_context', JSON.stringify(updated)); } catch {}
      setSavedFlash(intakeIndex);
      setTimeout(() => setSavedFlash(null), 1300);
    }

    setMessages(prev => [...prev, { text: option, isUser: true, savedKey: isIntake ? intakeIndex : undefined }]);
    announce(`You selected: ${option}`);
    setStepIdx(next);

    if (next === ALL_STEPS.length) {
      const summaryMsg = "All set! This info will help make your report super accurate. Click below to finish signup.";
      // Write promo code to sessionStorage so the signup form picks it up automatically
      try { sessionStorage.setItem('para_promo_code', 'BETA3FREE'); } catch {}
      setTimeout(() => {
        setThinking(false); setShowSummary(true); setMood('happy'); setSpeaking(false);
        announce("All set! Your information has been collected.");
        // Unlock then speak summary
        ensureGestureReady(summaryMsg, () => setSpeaking(false));
      }, 500);
      return;
    }

    // Unlock TTS on first tap, then deliver next step with voice
    ensureGestureReady(undefined, () => deliverStep(next, true));
  }

  // ── Mic ──────────────────────────────────────────────────── //
  function stopMic() {
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    setListening(false);
  }

  function startMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { stopMic(); return; }
    ensureGestureReady(); // unlock speech on mic tap too
    setMicTranscript(''); setMicError('');

    const recognition = new SR();
    recognition.lang            = 'en-AU';
    recognition.interimResults  = true;
    recognition.maxAlternatives = 5;
    recognition.continuous      = false;

    recognition.onstart  = () => setListening(true);
    recognition.onend    = () => { setListening(false); recognitionRef.current = null; };
    recognition.onerror  = (e) => {
      setListening(false); recognitionRef.current = null;
      const msg = e.error === 'no-speech'       ? "No speech heard — try again"
                : e.error === 'not-allowed'     ? "Mic blocked — check browser permissions"
                : "Couldn't hear you — tap an option";
      setMicError(msg); setTimeout(() => setMicError(''), 3500);
    };

    recognition.onresult = (event) => {
      // Show interim transcript live
      const interim = Array.from(event.results).map(r => r[0].transcript).join(' ').trim();
      setMicTranscript(interim);

      const lastResult = event.results[event.results.length - 1];
      if (!lastResult.isFinal) return;

      const options = ALL_STEPS[stepIdx]?.options || [];
      const allTranscripts: string[] = [];
      for (let i = 0; i < event.results.length; i++)
        for (let j = 0; j < event.results[i].length; j++)
          allTranscripts.push(event.results[i][j].transcript.toLowerCase().trim());

      let matched: string | null = null;

      // 1. Exact match
      for (const t of allTranscripts) {
        matched = options.find(o => o.toLowerCase() === t) || null;
        if (matched) break;
      }
      // 2. Transcript contains option (or all option words)
      if (!matched) {
        for (const t of allTranscripts) {
          matched = options.find(o => {
            const ol = o.toLowerCase().replace(/[^a-z0-9 ]/g,'');
            return t.includes(ol) || ol.split(' ').every(w => w.length > 1 && t.includes(w));
          }) || null;
          if (matched) break;
        }
      }
      // 3. Option contains a spoken keyword
      if (!matched) {
        for (const t of allTranscripts) {
          const words = t.split(' ').filter(w => w.length > 2);
          matched = options.find(o => words.some(w => o.toLowerCase().includes(w))) || null;
          if (matched) break;
        }
      }

      setMicTranscript('');
      if (matched) {
        handleOption(matched);
      } else {
        setMicError(`Heard "${interim}" — tap an option instead`);
        setTimeout(() => setMicError(''), 3500);
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); }
    catch { setMicError("Couldn't start mic"); setTimeout(() => setMicError(''), 3000); }
  }

  function handleComplete() {
    if (listening) stopMic();
    const collectedData = {
      who:intake[0]||'', age:intake[1]||'', location:intake[2]||'',
      travel:intake[3]||'', concern:intake[4]||'', duration:intake[5]||'',
      timestamp: new Date().toISOString(),
    };
    console.log('[SignupAssistant] Intake complete:', collectedData);
    document.dispatchEvent(new CustomEvent('assistant:complete', { detail: collectedData }));
    setExiting(true); setTimeout(() => setClosed(true), 400);
  }

  function renderText(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/).map((p,i) =>
      p.startsWith('**')&&p.endsWith('**')
        ? <strong key={i} style={{color:'#2dd4bf'}}>{p.slice(2,-2)}</strong> : p
    );
  }

  const currentStep = ALL_STEPS[stepIdx];
  const showOptions = !thinking && !showSummary && currentStep?.options;

  if (!visible || closed) return null;

  return (
    <>
      <div ref={liveRef} aria-live="polite" aria-atomic="true"
        style={{position:'absolute',width:1,height:1,overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap'}}/>

      <div role="dialog" aria-label="PARA — ParasitePro signup assistant" aria-modal="false"
        style={{
          position:'fixed', bottom:16, right:16,
          width:'min(370px, 90vw)',
          background:'#0f172a', borderRadius:20,
          boxShadow:'0 12px 48px rgba(0,0,0,0.75), 0 0 0 1.5px rgba(13,148,136,0.25)',
          overflow:'hidden', zIndex:9999,
          fontFamily:'system-ui,-apple-system,sans-serif',
          animation:exiting?'sa-fadeout 0.4s ease forwards':'sa-flyin 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

        {/* Header */}
        <div style={{background:'linear-gradient(90deg,#0d9488,#0891b2)',padding:'10px 12px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{flexShrink:0,position:'relative',animation:`sa-bob 4s ease-in-out infinite${mood==='happy'?', sa-glow-flash 0.9s ease':''}`}}>
            {showConfetti && <Confetti/>}
            <Robot mood={mood} speaking={speaking} size={0.36}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:'white',fontWeight:700,fontSize:15}}>PARA</div>
            <div style={{color:'rgba(255,255,255,0.75)',fontSize:11,whiteSpace:'nowrap'}}>
              {thinking?'✦ Thinking...':listening?'✦ Listening...':'✦ ParasitePro AI Guide'}
            </div>
          </div>

          {/* 🔊 Voice toggle */}
          <button onClick={() => { const n=!voiceOn; setVoiceOn(n); if(!n) window.speechSynthesis?.cancel(); }}
            aria-label={voiceOn?'Turn voice off':'Turn voice on'}
            style={{background:voiceOn?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.1)',border:voiceOn?'1.5px solid rgba(255,255,255,0.6)':'1.5px solid rgba(255,255,255,0.25)',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white',fontSize:15,flexShrink:0,transition:'all 0.2s'}}
          >{voiceOn?'🔊':'🔇'}</button>

          {/* ✕ Close */}
          <button onClick={() => { window.speechSynthesis?.cancel(); stopMic(); setExiting(true); setTimeout(()=>setClosed(true),400); }}
            aria-label="Close assistant"
            style={{background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.25)',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white',fontSize:17,flexShrink:0}}
          >✕</button>
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{maxHeight:265,overflowY:'auto',padding:'12px 12px 8px',background:'#1a2332',display:'flex',flexDirection:'column',gap:7,scrollbarWidth:'thin',scrollbarColor:'rgba(13,148,136,0.2) transparent'}}>
          {messages.map((msg,i)=>(
            <div key={i} style={{position:'relative',alignSelf:msg.isUser?'flex-end':'flex-start',maxWidth:'88%',animation:'sa-fadein 0.25s ease'}}>
              <div style={{background:msg.isUser?'#0d9488':'#2d3f52',color:msg.isUser?'white':'#e0f2fe',padding:'9px 13px',borderRadius:msg.isUser?'14px 14px 4px 14px':'14px 14px 14px 4px',fontSize:13.5,lineHeight:1.55}}>
                {msg.isUser?msg.text:renderText(msg.text)}
              </div>
              {msg.isUser&&msg.savedKey!==undefined&&savedFlash===msg.savedKey&&(
                <span aria-hidden="true" style={{position:'absolute',top:-20,right:4,fontSize:11,color:'#34d399',fontWeight:700,animation:'sa-saved 1.2s ease forwards',pointerEvents:'none',whiteSpace:'nowrap'}}>Saved ✓</span>
              )}
            </div>
          ))}

          {/* Thinking dots */}
          {thinking&&(
            <div style={{alignSelf:'flex-start',background:'#2d3f52',padding:'11px 16px',borderRadius:'14px 14px 14px 4px',display:'flex',gap:5,alignItems:'center',animation:'sa-fadein 0.2s ease'}}>
              {[0,0.18,0.36].map((d,i)=>(<span key={i} style={{width:7,height:7,borderRadius:'50%',background:'#0d9488',animation:`sa-dots 1s ${d}s ease-in-out infinite`,display:'inline-block'}}/>))}
            </div>
          )}

          {/* Summary card */}
          {showSummary&&(
            <div style={{background:'linear-gradient(135deg,#0d2820,#0a1f2e)',border:'1.5px solid rgba(13,148,136,0.4)',borderRadius:14,padding:'14px',animation:'sa-summaryin 0.4s ease'}}>
              <p style={{margin:'0 0 4px',fontSize:13.5,color:'#e0f2fe',lineHeight:1.6}}>All set! This info will help make your report super accurate. Click below to finish signup. 🎯</p>
              <p style={{margin:'0 0 10px',fontSize:12,color:'#94a3b8'}}>Here's what I've saved:</p>
              <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:12}}>
                {Object.entries(intake).map(([k,v])=>(
                  <div key={k} style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontSize:14,flexShrink:0}}>{INTAKE_EMOJI[Number(k)]}</span>
                    <span style={{fontSize:12,color:'#94a3b8',flexShrink:0}}>{INTAKE_LABELS[Number(k)]}:</span>
                    <span style={{fontSize:12,color:'#e0f2fe',fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:'10px 0 0',borderTop:'1px solid rgba(13,148,136,0.2)',marginBottom:12}}>
                <p style={{margin:0,fontSize:12,color:'#94a3b8'}}>Use code <strong style={{color:'#fbbf24',fontFamily:'monospace',fontSize:13}}>BETA3FREE</strong> for 3 free analyses 🎁</p>
              </div>
              <button className="sa-cta" onClick={handleComplete}>Continue to Signup →</button>
            </div>
          )}
        </div>

        {/* Options + Mic */}
        {showOptions&&(
          <div style={{padding:'10px 12px 13px',background:'#0f172a',borderTop:'1px solid rgba(13,148,136,0.1)'}}>

            {/* Live transcript / error feedback */}
            {(micTranscript||micError)&&(
              <div style={{marginBottom:8,padding:'6px 10px',borderRadius:8,background:micError?'rgba(239,68,68,0.1)':'rgba(13,148,136,0.1)',border:`1px solid ${micError?'rgba(239,68,68,0.3)':'rgba(13,148,136,0.3)'}`,fontSize:12,color:micError?'#fca5a5':'#5eead4',animation:'sa-transcript-in 0.2s ease',display:'flex',alignItems:'center',gap:6}}>
                {micError
                  ? <span>⚠️ {micError}</span>
                  : <><span style={{width:6,height:6,borderRadius:'50%',background:'#ef4444',display:'inline-block',animation:'sa-dots 0.8s ease-in-out infinite'}}/><span>Heard: <em>"{micTranscript}"</em></span></>
                }
              </div>
            )}

            {/* Buttons row — options left, mic right */}
            <div style={{display:'flex',flexWrap:'wrap',gap:7,alignItems:'center'}}>
              {currentStep.options.map(opt=>(
                <button key={opt} className="sa-btn" onClick={()=>handleOption(opt)}>{opt}</button>
              ))}

              {/* Mic button */}
              {micSupported&&(
                <div style={{position:'relative',flexShrink:0,marginLeft:'auto'}}>
                  {/* Expanding ring while listening */}
                  {listening&&(
                    <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid #ef4444',animation:'sa-mic-ring 1.1s ease-out infinite',pointerEvents:'none'}}/>
                  )}
                  <button
                    onClick={startMic}
                    aria-label={listening?'Stop listening':'Tap to speak your answer'}
                    title={listening?'Stop':'Speak your answer'}
                    style={{
                      width:40,height:40,borderRadius:'50%',
                      border:listening?'2px solid #ef4444':'2px solid rgba(13,148,136,0.55)',
                      background:listening?'rgba(239,68,68,0.15)':'rgba(13,148,136,0.12)',
                      color:listening?'#f87171':'#2dd4bf',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      cursor:'pointer',flexShrink:0,
                      animation:listening?'sa-mic-throb 1s ease-in-out infinite':'none',
                      transition:'background 0.2s,border-color 0.2s,color 0.2s',
                    }}
                  >
                    {listening
                      ? <span style={{width:10,height:10,borderRadius:2,background:'#f87171',display:'inline-block'}}/>
                      : <MicIcon size={18}/>
                    }
                  </button>
                </div>
              )}
            </div>

            {/* Mic hint */}
            {micSupported&&(
              <p style={{margin:'6px 0 0',fontSize:10,color:listening?'#f87171':'#334155',textAlign:'right',fontWeight:listening?600:400,transition:'color 0.2s'}}>
                {listening?'🔴 Listening — speak your answer':'🎤 or tap the mic to speak'}
              </p>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{padding:'5px 14px',background:'#080c14',borderTop:'1px solid rgba(13,148,136,0.07)'}}>
          <p style={{margin:0,fontSize:10,color:'#334155',textAlign:'center'}}>📚 Educational only — not medical advice. For health concerns, consult a GP.</p>
        </div>
      </div>
    </>
  );
}
