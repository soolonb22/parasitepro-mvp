// @ts-nocheck
/**
 * SignupAssistant.tsx
 *
 * Behaviour: flies in automatically on page load.
 * Runs scripted intro → disclaimer → 6 intake questions with tap buttons.
 * No click-to-open. No AI API call. Pure guided sequence.
 * Saves intake answers to sessionStorage for personalised reports.
 */

import { useState, useEffect, useRef } from 'react';

type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'curious';

/* ── CSS ────────────────────────────────────────────────────── */
const CSS = `
@keyframes sa-flyin {
  from { opacity: 0; transform: translateY(60px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}
@keyframes sa-bob {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-4px); }
}
@keyframes sa-fadein {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sa-dots {
  0%,80%,100% { opacity: 0.2; transform: scale(0.8); }
  40%          { opacity: 1;   transform: scale(1.2); }
}
`;

/* ── Robot SVG ──────────────────────────────────────────────── */
function Robot({ mood, speaking, size = 1 }: { mood: Mood; speaking: boolean; size?: number }) {
  const [blink, setBlink]  = useState(false);
  const [mouth, setMouth]  = useState(0);
  const [antGlow, setAnt]  = useState(false);
  const [armOff, setArm]   = useState(0);

  useEffect(() => {
    const next = () => { const t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 110); next(); }, 2800 + Math.random() * 2200); return t; };
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
      const t = setInterval(() => { setArm(p => p + dir * 4); dir *= -1; }, 350);
      return () => clearInterval(t);
    }
    setArm(0);
  }, [mood]);

  const eyeH   = blink ? 2 : mood === 'happy' ? 10 : mood === 'curious' ? 13 : 12;
  const eyeY   = mood === 'curious' ? 33 : 34;
  const eyeC   = mood === 'concerned' ? '#f87171' : mood === 'happy' ? '#34d399' : mood === 'thinking' ? '#c4b5fd' : mood === 'curious' ? '#67e8f9' : '#0d9488';
  const ledC   = mood === 'thinking' ? '#c4b5fd' : mood === 'happy' ? '#34d399' : mood === 'concerned' ? '#f87171' : mood === 'curious' ? '#67e8f9' : '#0d9488';
  const headBg = mood === 'concerned' ? '#1e3050' : mood === 'happy' ? '#0d2820' : mood === 'thinking' ? '#1e1b40' : '#0f2335';
  const mouths = ['M 41 108 Q 50 114 59 108','M 41 107 Q 50 116 59 107','M 40 107 Q 50 119 60 107','M 41 108 Q 50 114 59 108','M 42 109 Q 50 113 58 109'];
  const mp     = speaking ? mouths[mouth] : (mood === 'concerned' ? 'M 42 111 Q 50 107 58 111' : 'M 41 108 Q 50 114 59 108');
  const armRot = (mood === 'waving' || mood === 'happy') ? -22 + armOff : 0;
  const cheeks = mood === 'happy' || mood === 'waving' || speaking;

  return (
    <div style={{ animation: 'sa-bob 3s ease-in-out infinite' }}>
      <svg width={100 * size} height={162 * size} viewBox="0 0 100 162"
        style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${speaking ? 20 : 10}px ${eyeC}80)`, transition: 'filter 0.3s' }}>
        <line x1="50" y1="9" x2="50" y2="22" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <circle cx="50" cy="6" r="6" fill={antGlow ? ledC : '#0a1f2e'} stroke={antGlow ? ledC : 'rgba(13,148,136,0.3)'} strokeWidth="1.5" style={{ filter: antGlow ? `drop-shadow(0 0 10px ${ledC})` : 'none', transition: 'fill 0.4s,filter 0.4s' }}/>
        {antGlow && <circle cx="50" cy="6" r="3" fill="white" opacity="0.6"/>}
        <rect x="20" y="20" width="60" height="56" rx="20" fill={headBg} stroke="rgba(13,148,136,0.4)" strokeWidth="1.5" style={{ transition: 'fill 0.4s' }}/>
        <rect x="11" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
        <circle cx="16" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{ filter: `drop-shadow(0 0 6px ${ledC})`, transition: 'fill 0.4s' }}/>
        <rect x="79" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
        <circle cx="84" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{ filter: `drop-shadow(0 0 6px ${ledC})`, transition: 'fill 0.4s' }}/>
        <rect x="28" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC} style={{ filter: `drop-shadow(0 0 10px ${eyeC})`, transition: 'height 0.08s,fill 0.3s' }}/>
        <rect x="54" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC} style={{ filter: `drop-shadow(0 0 10px ${eyeC})`, transition: 'height 0.08s,fill 0.3s' }}/>
        {!blink && eyeH > 3 && <><circle cx="34" cy={eyeY + 2.5} r="3" fill="white" opacity="0.8"/><circle cx="60" cy={eyeY + 2.5} r="3" fill="white" opacity="0.8"/></>}
        {mood === 'thinking' && [0,1,2].map((k,i) => <circle key={k} cx={35+i*15} cy="57" r="4" fill="#c4b5fd" opacity={0.2 + 0.8 * ((mouth+i)%3 === 0 ? 1 : 0)} style={{ transition: 'opacity 0.18s' }}/>)}
        {mood === 'curious' && <path d="M 28 30 Q 37 26 46 30" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>}
        <path d={mp} fill="none" stroke={speaking ? eyeC : 'rgba(13,148,136,0.6)'} strokeWidth={speaking ? 3.5 : 2.5} strokeLinecap="round" style={{ filter: speaking ? `drop-shadow(0 0 8px ${eyeC})` : 'none', transition: 'stroke 0.2s' }}/>
        <ellipse cx="27" cy="58" rx="6" ry="4" fill="#f472b6" opacity={cheeks ? 0.35 : 0.1} style={{ transition: 'opacity 0.4s' }}/>
        <ellipse cx="73" cy="58" rx="6" ry="4" fill="#f472b6" opacity={cheeks ? 0.35 : 0.1} style={{ transition: 'opacity 0.4s' }}/>
        <rect x="24" y="80" width="52" height="46" rx="14" fill="#0a1f2e" stroke="rgba(13,148,136,0.35)" strokeWidth="1.5"/>
        {[0,1,2].map(i => <circle key={i} cx={34+i*16} cy="96" r="5.5" fill={i===mouth%3 ? ledC : '#0f2335'} style={{ filter: i===mouth%3 ? `drop-shadow(0 0 7px ${ledC})` : 'none', transition: 'fill 0.14s' }}/>)}
        <rect x="30" y="107" width="40" height="13" rx="6" fill="#0f2335" stroke="rgba(13,148,136,0.2)" strokeWidth="1"/>
        <path d="M 39 110 Q 50 115 61 110" fill="none" stroke={ledC} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <g style={{ transformOrigin: '16px 82px', transform: `rotate(${armRot}deg)`, transition: 'transform 0.32s ease-in-out' }}>
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

/* ── Script ─────────────────────────────────────────────────── */
type Step = { text: string; mood: Mood; options: string[]; final?: boolean };

const INTRO_STEPS: Step[] = [
  {
    text: "G'day! I'm PARA, your ParasitePro AI sidekick. Welcome to the app that finally ends those 3am \"is this worms?\" meltdowns. 👋",
    mood: 'waving',
    options: ["Ha! Tell me more"],
  },
  {
    text: "ParasitePro uses AI to scan photos of samples and give you a structured educational report in seconds — so you know exactly what to say when you walk into your GP.",
    mood: 'happy',
    options: ["Sounds good", "What about privacy?"],
  },
  {
    text: "Quick heads-up: ParasitePro is an educational tool only — not medical advice. We're not doctors. Always see a real GP for proper care. In an emergency call 000. All good?",
    mood: 'concerned',
    options: ["Got it, let's go"],
  },
  {
    text: "Beauty! I just need 6 quick details to make your first report way more accurate. Won't take long!",
    mood: 'curious',
    options: ["Fire away"],
  },
];

const INTAKE_STEPS: Step[] = [
  { text: "Who's this for?", mood: 'curious', options: ["Myself", "My child", "My dog", "My cat", "Other pet"] },
  { text: "Roughly how old are they?", mood: 'thinking', options: ["Under 5", "5–17", "18–40", "41–60", "60+"] },
  { text: "Where in Australia? (helps match local parasites)", mood: 'curious', options: ["QLD", "NSW / ACT", "VIC / TAS", "WA", "SA / NT"] },
  { text: "Any recent travel or bush/beach walks?", mood: 'thinking', options: ["Yes — overseas", "Yes — local bush/beach", "No recent travel"] },
  { text: "Main concern?", mood: 'curious', options: ["Itching / rash", "Tummy issues", "Something in stool", "Fatigue / brain fog", "Not sure"] },
  { text: "How long has it been going on?", mood: 'thinking', options: ["Just noticed today", "A few days", "1–2 weeks", "Weeks to months"] },
  {
    text: "Brilliant! I've saved all of that — it'll make your report way more accurate. Fill in your details above and hit **Create Account**. Use code **BETA3FREE** to get 3 free analyses on us. 🎁",
    mood: 'happy',
    options: ["Let's go! 🚀"],
    final: true,
  },
];

const ALL_STEPS = [...INTRO_STEPS, ...INTAKE_STEPS];

/* ── Main component ─────────────────────────────────────────── */
export default function SignupAssistant() {
  const [visible,  setVisible]  = useState(false);
  const [stepIdx,  setStepIdx]  = useState(0);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [mood,     setMood]     = useState<Mood>('waving');
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [intake,   setIntake]   = useState<Record<string, string>>({});
  const [done,     setDone]     = useState(false);
  const chatRef  = useRef<HTMLDivElement>(null);
  const cssRef   = useRef(false);

  // Inject CSS once
  useEffect(() => {
    if (cssRef.current) return;
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    cssRef.current = true;
  }, []);

  // Fly in and deliver first message on mount
  useEffect(() => {
    setVisible(true);
    deliverStep(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, thinking]);

  function deliverStep(idx: number) {
    if (idx >= ALL_STEPS.length) return;
    const step = ALL_STEPS[idx];
    setThinking(true);
    setMood('thinking');
    setSpeaking(false);

    setTimeout(() => {
      setThinking(false);
      setMood(step.mood);
      setSpeaking(true);
      setMessages(prev => [...prev, { text: step.text, isUser: false }]);
      setTimeout(() => setSpeaking(false), Math.min(step.text.length * 35, 2500));
    }, 700);
  }

  function handleOption(option: string) {
    const current = ALL_STEPS[stepIdx];

    // Save intake answers (steps 4+ are intake)
    if (stepIdx >= INTRO_STEPS.length) {
      const key = `q${stepIdx - INTRO_STEPS.length}`;
      const updated = { ...intake, [key]: option };
      setIntake(updated);
      try { sessionStorage.setItem('para_health_context', JSON.stringify(updated)); } catch {}
    }

    setMessages(prev => [...prev, { text: option, isUser: true }]);

    if (current.final) {
      setDone(true);
      setMood('happy');
      return;
    }

    const next = stepIdx + 1;
    setStepIdx(next);
    deliverStep(next);
  }

  function renderText(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} style={{ color: '#2dd4bf' }}>{part.slice(2, -2)}</strong>
        : part
    );
  }

  const currentStep = ALL_STEPS[stepIdx];
  const showOptions = !thinking && !done;

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 'min(370px, calc(100vw - 24px))',
      background: '#0f172a',
      borderRadius: 20,
      boxShadow: '0 10px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(13,148,136,0.25)',
      overflow: 'hidden',
      zIndex: 9999,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      animation: 'sa-flyin 0.5s cubic-bezier(0.34,1.56,0.64,1)',
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #0d9488, #0891b2)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{ flexShrink: 0 }}>
          <Robot mood={mood} speaking={speaking} size={0.4}/>
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>PARA</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
            {thinking ? '✦ Thinking...' : '✦ ParasitePro AI Guide'}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} style={{
        maxHeight: 280,
        overflowY: 'auto',
        padding: '14px 14px 8px',
        background: '#1a2332',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '88%',
            alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
            background: msg.isUser ? '#0d9488' : '#2d3f52',
            color: msg.isUser ? 'white' : '#e0f2fe',
            padding: '9px 13px',
            borderRadius: msg.isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            fontSize: 13.5,
            lineHeight: 1.55,
            animation: 'sa-fadein 0.25s ease',
          }}>
            {msg.isUser ? msg.text : renderText(msg.text)}
          </div>
        ))}

        {/* Thinking dots */}
        {thinking && (
          <div style={{
            alignSelf: 'flex-start',
            background: '#2d3f52',
            padding: '11px 16px',
            borderRadius: '14px 14px 14px 4px',
            display: 'flex',
            gap: 5,
            alignItems: 'center',
            animation: 'sa-fadein 0.2s ease',
          }}>
            {[0, 0.18, 0.36].map((d, i) => (
              <span key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#0d9488',
                animation: `sa-dots 1s ${d}s ease-in-out infinite`,
                display: 'inline-block',
              }}/>
            ))}
          </div>
        )}
      </div>

      {/* Option buttons */}
      {showOptions && currentStep?.options && (
        <div style={{
          padding: '10px 14px 14px',
          background: '#0f172a',
          borderTop: '1px solid rgba(13,148,136,0.12)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 7,
        }}>
          {currentStep.options.map(opt => (
            <button
              key={opt}
              onClick={() => handleOption(opt)}
              style={{
                padding: '8px 14px',
                background: 'rgba(13,148,136,0.12)',
                border: '1px solid rgba(13,148,136,0.4)',
                borderRadius: 999,
                color: '#2dd4bf',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.28)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.12)')}
            >{opt}</button>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        padding: '5px 14px',
        background: '#080c14',
        borderTop: '1px solid rgba(13,148,136,0.08)',
      }}>
        <p style={{ margin: 0, fontSize: 10, color: '#334155', textAlign: 'center' }}>
          📚 Educational only — not medical advice. For health concerns, consult a GP.
        </p>
      </div>
    </div>
  );
}
