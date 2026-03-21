// @ts-nocheck
/**
 * SignupAssistant.tsx
 * Floating AI guide widget — signup page only.
 * Uses the existing teal SVG robot. No other pages.
 */

import { useState, useEffect, useRef } from 'react';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised' | 'curious';

/* ── Robot SVG ─────────────────────────────────────────────── */
function Robot({ mood, speaking, size = 1 }: { mood: Mood; speaking: boolean; size?: number }) {
  const [blink, setBlink]   = useState(false);
  const [mouth, setMouth]   = useState(0);
  const [antGlow, setAnt]   = useState(false);
  const [armOff, setArm]    = useState(0);
  const [bobY, setBobY]     = useState(0);

  // Blink
  useEffect(() => {
    const next = () => {
      const t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 110);
        next();
      }, 2800 + Math.random() * 2200);
      return t;
    };
    const t = next(); return () => clearTimeout(t);
  }, []);

  // Mouth animation when speaking
  useEffect(() => {
    if (!speaking) { setMouth(0); return; }
    const t = setInterval(() => setMouth(p => (p + 1) % 5), 130);
    return () => clearInterval(t);
  }, [speaking]);

  // Antenna glow
  useEffect(() => {
    const t = setInterval(() => setAnt(v => !v), 900 + Math.random() * 300);
    return () => clearInterval(t);
  }, []);

  // Arm wave
  useEffect(() => {
    if (mood === 'waving' || mood === 'happy') {
      let dir = 1;
      const t = setInterval(() => { setArm(prev => prev + dir * 4); dir *= -1; }, 350);
      return () => clearInterval(t);
    }
    setArm(0);
  }, [mood]);

  // Idle float bob
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.025;
      setBobY(Math.sin(t) * 4);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const eyeH  = blink ? 2 : mood==='surprised'?16 : mood==='happy'?10 : mood==='curious'?13 : 12;
  const eyeY  = mood==='curious' ? 33 : 34;
  const eyeC  = mood==='concerned'?'#f87171' : mood==='happy'?'#34d399' : mood==='thinking'?'#c4b5fd' : mood==='curious'?'#67e8f9' : '#0d9488';
  const ledC  = mood==='thinking'?'#c4b5fd' : mood==='happy'?'#34d399' : mood==='concerned'?'#f87171' : mood==='curious'?'#67e8f9' : '#0d9488';
  const headBg= mood==='concerned'?'#1e3050' : mood==='happy'?'#0d2820' : mood==='thinking'?'#1e1b40' : '#0f2335';
  const mouths= ['M 41 108 Q 50 114 59 108','M 41 107 Q 50 116 59 107','M 40 107 Q 50 119 60 107','M 41 108 Q 50 114 59 108','M 42 109 Q 50 113 58 109'];
  const mp    = speaking ? mouths[mouth] : (mood==='concerned' ? 'M 42 111 Q 50 107 58 111' : 'M 41 108 Q 50 114 59 108');
  const armRot= (mood==='waving'||mood==='happy') ? -22+armOff : 0;
  const showCheeks = mood==='happy' || mood==='waving' || mood==='talking' || speaking;

  return (
    <div style={{ transform: `translateY(${bobY}px)`, transition: 'transform 0.05s linear' }}>
      <svg width={100*size} height={162*size} viewBox="0 0 100 162"
        style={{ overflow:'visible', filter:`drop-shadow(0 0 ${speaking?24:12}px ${eyeC}70)`, transition:'filter 0.3s' }}>
        <line x1="50" y1="9" x2="50" y2="22" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <circle cx="50" cy="6" r="6" fill={antGlow?ledC:'#0a1f2e'} stroke={antGlow?ledC:'rgba(13,148,136,0.3)'} strokeWidth="1.5"
          style={{ filter:antGlow?`drop-shadow(0 0 10px ${ledC})`:'none', transition:'fill 0.4s,filter 0.4s' }}/>
        {antGlow && <circle cx="50" cy="6" r="3" fill="white" opacity="0.6"/>}
        <rect x="20" y="20" width="60" height="56" rx="20" fill={headBg} stroke="rgba(13,148,136,0.4)" strokeWidth="1.5"
          style={{ transition:'fill 0.4s', filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}/>
        <ellipse cx="38" cy="26" rx="14" ry="6" fill="white" opacity="0.04"/>
        <rect x="11" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
        <circle cx="16" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{ filter:`drop-shadow(0 0 6px ${ledC})`, transition:'fill 0.4s' }}/>
        <rect x="79" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
        <circle cx="84" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{ filter:`drop-shadow(0 0 6px ${ledC})`, transition:'fill 0.4s' }}/>
        <rect x="28" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC} style={{ filter:`drop-shadow(0 0 10px ${eyeC})`, transition:'height 0.08s,fill 0.3s' }}/>
        <rect x="54" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC} style={{ filter:`drop-shadow(0 0 10px ${eyeC})`, transition:'height 0.08s,fill 0.3s' }}/>
        {!blink && eyeH>3 && <><circle cx="34" cy={eyeY+2.5} r="3" fill="white" opacity="0.8"/><circle cx="60" cy={eyeY+2.5} r="3" fill="white" opacity="0.8"/><circle cx="35.5" cy={eyeY+1.5} r="1.2" fill="white" opacity="0.6"/><circle cx="61.5" cy={eyeY+1.5} r="1.2" fill="white" opacity="0.6"/></>}
        {mood==='thinking' && [0,1,2].map((k,i) => <circle key={k} cx={35+i*15} cy="57" r="4" fill="#c4b5fd" opacity={0.2+0.8*((mouth+i)%3===0?1:0)} style={{ transition:'opacity 0.18s' }}/>)}
        {mood==='curious' && <path d="M 28 30 Q 37 26 46 30" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>}
        <path d={mp} fill="none" stroke={speaking?eyeC:'rgba(13,148,136,0.6)'} strokeWidth={speaking?3.5:2.5} strokeLinecap="round" style={{ filter:speaking?`drop-shadow(0 0 8px ${eyeC})`:'none', transition:'stroke 0.2s' }}/>
        <ellipse cx="27" cy="58" rx="6" ry="4" fill="#f472b6" opacity={showCheeks?0.35:0.12} style={{ transition:'opacity 0.4s' }}/>
        <ellipse cx="73" cy="58" rx="6" ry="4" fill="#f472b6" opacity={showCheeks?0.35:0.12} style={{ transition:'opacity 0.4s' }}/>
        <rect x="24" y="80" width="52" height="46" rx="14" fill="#0a1f2e" stroke="rgba(13,148,136,0.35)" strokeWidth="1.5"/>
        <rect x="30" y="85" width="40" height="3" rx="1.5" fill="white" opacity="0.04"/>
        {[0,1,2].map(i => <circle key={i} cx={34+i*16} cy="96" r="5.5" fill={i===mouth%3?ledC:'#0f2335'} style={{ filter:i===mouth%3?`drop-shadow(0 0 7px ${ledC})`:'none', transition:'fill 0.14s' }}/>)}
        <rect x="30" y="107" width="40" height="13" rx="6" fill="#0f2335" stroke="rgba(13,148,136,0.2)" strokeWidth="1"/>
        <path d="M 39 110 Q 50 115 61 110" fill="none" stroke={ledC} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <g style={{ transformOrigin:'16px 82px', transform:`rotate(${armRot}deg)`, transition:'transform 0.32s ease-in-out' }}>
          <rect x="8" y="82" width="16" height="32" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
          <circle cx="16" cy="118" r="7" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
        </g>
        <rect x="76" y="82" width="16" height="32" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
        <circle cx="84" cy="118" r="7" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
        <rect x="30" y="126" width="16" height="24" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
        <rect x="54" y="126" width="16" height="24" rx="8" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1.2"/>
        <ellipse cx="38" cy="151" rx="11" ry="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.25)" strokeWidth="1.2"/>
        <ellipse cx="62" cy="151" rx="11" ry="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.25)" strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

/* ── Conversation script ───────────────────────────────────── */
type Step = {
  text: string;
  mood: Mood;
  options?: string[];
  intake?: boolean;   // marks start of intake questions
  final?: boolean;    // marks end of conversation
};

const SCRIPT: Step[] = [
  {
    text: "G'day! I'm PARA, your ParasitePro AI sidekick. Welcome to the app that finally ends those 3am \"is this worms?\" meltdowns. 👋",
    mood: 'waving',
    options: ["Ha! Tell me more"],
  },
  {
    text: "ParasitePro uses AI to scan photos or symptoms and give you a structured educational report in seconds — so you know exactly what to say when you walk into your GP. No more Googling yourself into a spiral.",
    mood: 'happy',
    options: ["Sounds good", "What about privacy?"],
  },
  {
    text: "Quick heads-up before we go further: ParasitePro is an **educational tool only**. We are not doctors. Reports are for information purposes — always see a real GP for medical advice. In an emergency, call **000**. All good?",
    mood: 'concerned',
    options: ["Got it, let's go"],
  },
  {
    text: "Beauty! To make your first report way more accurate, I just need a few quick details. Won't take long — promise!",
    mood: 'curious',
    options: ["Let's do it"],
  },
  // Intake questions from here
  { text: "Who's this for?", mood: 'curious', intake: true, options: ["Myself", "My child", "My dog", "My cat", "Other pet"] },
  { text: "Roughly how old are they?", mood: 'thinking', options: ["Under 5", "5–17", "18–40", "41–60", "60+"] },
  { text: "Where in Australia are you? (helps match local parasites)", mood: 'curious', options: ["QLD", "NSW / ACT", "VIC / TAS", "WA", "SA / NT"] },
  { text: "Any recent travel or bush/beach walks?", mood: 'thinking', options: ["Yes — overseas", "Yes — local bush/beach", "No recent travel"] },
  { text: "What's the main concern?", mood: 'curious', options: ["Itching / rash", "Tummy issues", "Something visible in stool", "Fatigue / brain fog", "Not sure"] },
  { text: "How long has it been going on?", mood: 'thinking', options: ["A few days", "1–2 weeks", "A few weeks", "Months", "Just noticed today"] },
  {
    text: "Brilliant — I've saved all of that to personalise your first report. You're all set! Fill in your details above and hit create account. Use code **BETA3FREE** for 3 free analyses on us. 🎁",
    mood: 'happy',
    final: true,
    options: ["Thanks PARA! 🚀"],
  },
];

/* ── Main component ────────────────────────────────────────── */
export default function SignupAssistant() {
  const [open, setOpen]         = useState(false);
  const [shown, setShown]       = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [mood, setMood]         = useState<Mood>('waving');
  const [speaking, setSpeaking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const chatRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-open after 2.5s
  useEffect(() => {
    const t = setTimeout(() => {
      setOpen(true);
      setShown(true);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  // Show first message when opened
  useEffect(() => {
    if (!open || messages.length > 0) return;
    deliverMessage(0);
  }, [open]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  function deliverMessage(idx: number) {
    if (idx >= SCRIPT.length) return;
    const step = SCRIPT[idx];
    setMood('thinking');
    setSpeaking(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMood(step.mood);
      setSpeaking(true);
      setMessages(prev => [...prev, { text: step.text, isUser: false }]);
      setTimeout(() => setSpeaking(false), Math.min(step.text.length * 40, 3000));
    }, 600);
  }

  function handleOption(option: string) {
    const current = SCRIPT[stepIdx];

    // Save intake answer
    if (current.intake || stepIdx >= 4) {
      const key = current.text.replace(/[^a-zA-Z]/g, '_').slice(0, 30);
      const updated = { ...intakeData, [key]: option };
      setIntakeData(updated);
      try { sessionStorage.setItem('para_health_context', JSON.stringify(updated)); } catch {}
    }

    setMessages(prev => [...prev, { text: option, isUser: true }]);
    setMood('happy');

    if (current.final) {
      setMood('waving');
      return;
    }

    const next = stepIdx + 1;
    setStepIdx(next);
    deliverMessage(next);
  }

  function renderText(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} style={{ color: '#2dd4bf' }}>{part.slice(2, -2)}</strong>
        : part
    );
  }

  if (dismissed) return null;

  const currentStep = SCRIPT[stepIdx];

  return (
    <>
      {/* Floating toggle button (when closed) */}
      {!open && shown && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 20, right: 20,
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488, #0891b2)',
            border: 'none', cursor: 'pointer', zIndex: 9999,
            boxShadow: '0 4px 20px rgba(13,148,136,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 28 }}>🤖</span>
        </button>
      )}

      {/* Main panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 370, maxHeight: '85vh',
          background: '#0f172a',
          borderRadius: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(13,148,136,0.2)',
          overflow: 'hidden', zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          animation: 'slideUpWidget 0.35s ease-out',
        }}>
          <style>{`
            @keyframes slideUpWidget {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(90deg, #0d9488, #0891b2)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flexShrink: 0 }}>
              <Robot mood={mood} speaking={speaking} size={0.42} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>PARA</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>ParasitePro AI Guide</div>
            </div>
            <button
              onClick={() => { setOpen(false); setDismissed(true); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}
            >✕</button>
          </div>

          {/* Chat area */}
          <div
            ref={chatRef}
            style={{
              flex: 1, overflowY: 'auto', padding: '16px 14px',
              background: '#1e2937',
              display: 'flex', flexDirection: 'column', gap: 10,
              maxHeight: 320,
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{
                maxWidth: '88%',
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                background: msg.isUser ? '#0d9488' : '#2d3f52',
                color: msg.isUser ? 'white' : '#e0f2fe',
                padding: '10px 14px',
                borderRadius: msg.isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13.5,
                lineHeight: 1.55,
              }}>
                {msg.isUser ? msg.text : renderText(msg.text)}
              </div>
            ))}

            {/* Thinking dots */}
            {mood === 'thinking' && (
              <div style={{
                alignSelf: 'flex-start', background: '#2d3f52',
                padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                display: 'flex', gap: 5,
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#0d9488', opacity: 0.7,
                    animation: `bounce 1s ${i * 0.2}s infinite`,
                  }}/>
                ))}
                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
              </div>
            )}
          </div>

          {/* Options */}
          {currentStep?.options && mood !== 'thinking' && (
            <div style={{
              padding: '12px 14px 14px',
              background: '#0f172a',
              borderTop: '1px solid rgba(13,148,136,0.15)',
              display: 'flex', flexWrap: 'wrap', gap: 8,
            }}>
              {currentStep.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleOption(opt)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(13,148,136,0.15)',
                    border: '1px solid rgba(13,148,136,0.4)',
                    borderRadius: 999,
                    color: '#2dd4bf',
                    fontSize: 12.5,
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.15)')}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
