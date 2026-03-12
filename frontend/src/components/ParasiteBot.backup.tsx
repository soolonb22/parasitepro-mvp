// @ts-nocheck
/**
 * PARA — ParasitePro AI Assistant
 * A living, talking, autonomous robot character that appears after login,
 * speaks out loud, leads conversations, and reacts with animated expressions.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

/* ─── Types ──────────────────────────────────────────────────────── */
type Mood = 'idle' | 'talking' | 'thinking' | 'happy' | 'concerned' | 'waving' | 'surprised';
type Stage = 'entering' | 'intro' | 'health_q' | 'idle' | 'report';
type Msg = { role: 'user' | 'assistant'; content: string; id: number };

/* ─── Health Questions ───────────────────────────────────────────── */
const HQS = [
  { id: 'location', q: "First up — whereabouts in Australia are you located? 📍", type: 'select',
    opts: ['Queensland (Tropical North)', 'Queensland (South East)', 'Northern Territory', 'Western Australia (North)', 'Western Australia (South)', 'New South Wales', 'Victoria', 'South Australia', 'Tasmania', 'Outside Australia'] },
  { id: 'travel', q: "Any travel to tropical or overseas regions in the last 6 months? ✈️", type: 'select',
    opts: ['Nope, stayed local', 'Domestic tropical (QLD/NT)', 'South-East Asia', 'Africa or Middle East', 'South America', 'Pacific Islands', 'Multiple regions'] },
  { id: 'pets', q: "Do you have any furry (or scaly) friends at home? 🐾", type: 'select',
    opts: ['No pets', 'Dogs', 'Cats', 'Dogs & Cats', 'Farm animals', 'Reptiles or exotic pets', 'Other'] },
  { id: 'symptoms', q: "Any symptoms at the moment? Tap all that apply! 🩺", type: 'multi',
    opts: ['Abdominal pain', 'Visible worms or eggs', 'Skin rash or lesions', 'Itching (skin or anal area)', 'Unusual fatigue', 'Nausea or vomiting', 'Diarrhoea', 'Unexplained weight loss', 'No symptoms — just checking'] },
  { id: 'duration', q: "How long have these concerns been going on? ⏱️", type: 'select',
    opts: ['Just noticed today', 'A few days', '1–2 weeks', '2–4 weeks', 'Over a month', '3+ months', 'No symptoms — preventive check'] },
  { id: 'occupation', q: "Last one! What best describes your work or daily environment? 💼", type: 'select',
    opts: ['General public', 'Healthcare worker', 'Childcare / education', 'Agriculture / farming', 'Vet or animal work', 'Outdoor / fieldwork', 'Returning traveller', 'Prefer not to say'] },
];

/* ─── Speech Engine ──────────────────────────────────────────────── */
class SpeechEngine {
  private static voices: SpeechSynthesisVoice[] = [];
  private static ready = false;

  static init(): Promise<void> {
    return new Promise(resolve => {
      if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
      const load = () => {
        this.voices = window.speechSynthesis.getVoices();
        this.ready = this.voices.length > 0;
        resolve();
      };
      if (window.speechSynthesis.getVoices().length > 0) { load(); }
      else { window.speechSynthesis.onvoiceschanged = load; setTimeout(load, 1000); }
    });
  }

  static speak(text: string, opts?: { rate?: number; pitch?: number; onStart?: () => void; onEnd?: () => void }) {
    if (!window.speechSynthesis) { opts?.onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/[*_`#[\]]/g, '').replace(/\n/g, '. ').slice(0, 320);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = opts?.rate ?? 1.05;
    utt.pitch = opts?.pitch ?? 1.1;
    utt.volume = 0.95;
    const preferred = this.voices.find(v => v.lang === 'en-AU')
      || this.voices.find(v => v.lang.startsWith('en-GB') && v.name.includes('Female'))
      || this.voices.find(v => v.lang.startsWith('en-GB'))
      || this.voices.find(v => v.lang.startsWith('en'));
    if (preferred) utt.voice = preferred;
    utt.onstart = () => opts?.onStart?.();
    utt.onend = () => opts?.onEnd?.();
    utt.onerror = () => opts?.onEnd?.();
    window.speechSynthesis.speak(utt);
  }

  static cancel() { window.speechSynthesis?.cancel(); }
}

/* ─── Animated Robot SVG ─────────────────────────────────────────── */
function Robot({ mood, speaking, waving, size = 1 }: { mood: Mood; speaking: boolean; waving: boolean; size?: number }) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [antennaGlow, setAntennaGlow] = useState(false);

  // Random blinking
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 100 + Math.random() * 60);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(t);
  }, []);

  // Mouth animation when speaking
  useEffect(() => {
    if (!speaking) { setMouthOpen(0); return; }
    const t = setInterval(() => {
      setMouthOpen(Math.random() * 10 + 2);
    }, 120);
    return () => { clearInterval(t); setMouthOpen(0); };
  }, [speaking]);

  // Antenna glow
  useEffect(() => {
    const t = setInterval(() => setAntennaGlow(a => !a), speaking ? 300 : 2000);
    return () => clearInterval(t);
  }, [speaking]);

  const s = size;
  const eyeH = blink ? 1 : (mood === 'happy' ? 6 : mood === 'surprised' ? 12 : 8);
  const eyeColor = mood === 'concerned' ? '#FF6B6B' : mood === 'happy' ? '#34D399' : mood === 'thinking' ? '#60A5FA' : '#FBBF24';
  const eyeY = blink ? 27 : (mood === 'surprised' ? 22 : 25);

  return (
    <svg width={90 * s} height={160 * s} viewBox="0 0 90 160" style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 24px rgba(217,119,6,0.35))' }}>
      {/* Antenna */}
      <line x1="45" y1="14" x2="45" y2="4" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="45" cy="3" r="4" fill={antennaGlow ? '#F59E0B' : '#D97706'}
        style={{ filter: antennaGlow ? 'drop-shadow(0 0 6px #F59E0B)' : 'none', transition: 'all 0.3s' }}/>
      {/* Ear left */}
      <rect x="8" y="22" width="8" height="20" rx="4" fill="#1A1C20" stroke="#D97706" strokeWidth="1.5"/>
      <rect x="10" y="26" width="4" height="8" rx="2" fill={eyeColor} opacity="0.6"/>
      {/* Ear right */}
      <rect x="74" y="22" width="8" height="20" rx="4" fill="#1A1C20" stroke="#D97706" strokeWidth="1.5"/>
      <rect x="76" y="26" width="4" height="8" rx="2" fill={eyeColor} opacity="0.6"/>
      {/* HEAD */}
      <rect x="14" y="12" width="62" height="58" rx="16" fill="#15181E" stroke="#D97706" strokeWidth="2.5"/>
      {/* Head gloss */}
      <rect x="16" y="14" width="58" height="20" rx="14" fill="rgba(255,255,255,0.04)"/>
      {/* Left eye socket */}
      <rect x="20" y="21" width="20" height="18" rx="6" fill="#0A0C10" stroke="#D97706" strokeWidth="1.5"/>
      {/* Right eye socket */}
      <rect x="50" y="21" width="20" height="18" rx="6" fill="#0A0C10" stroke="#D97706" strokeWidth="1.5"/>
      {/* Left eye pupil */}
      <rect
        x={mood === 'thinking' ? 22 : 24}
        y={eyeY}
        width={mood === 'thinking' ? 12 : 8}
        height={eyeH}
        rx="3"
        fill={eyeColor}
        style={{ filter: `drop-shadow(0 0 4px ${eyeColor})`, transition: 'all 0.08s ease' }}
      />
      {/* Right eye pupil */}
      <rect
        x={mood === 'thinking' ? 52 : 54}
        y={eyeY}
        width={mood === 'thinking' ? 12 : 8}
        height={eyeH}
        rx="3"
        fill={eyeColor}
        style={{ filter: `drop-shadow(0 0 4px ${eyeColor})`, transition: 'all 0.08s ease' }}
      />
      {/* Eye shines */}
      {!blink && <>
        <circle cx={mood === 'thinking' ? 27 : 27} cy={eyeY + 1} r="2" fill="rgba(255,255,255,0.55)"/>
        <circle cx={mood === 'thinking' ? 57 : 57} cy={eyeY + 1} r="2" fill="rgba(255,255,255,0.55)"/>
      </>}
      {/* Cheek blush (happy) */}
      {(mood === 'happy' || mood === 'waving') && <>
        <ellipse cx="22" cy="46" rx="6" ry="4" fill="#FF6B6B" opacity="0.2"/>
        <ellipse cx="68" cy="46" rx="6" ry="4" fill="#FF6B6B" opacity="0.2"/>
      </>}
      {/* Mouth housing */}
      <rect x="22" y="42" width="46" height="22" rx="8" fill="#0A0C10" stroke="#D97706" strokeWidth="1.5"/>
      {/* Mouth expression */}
      {mood === 'happy' && !speaking &&
        <path d="M30 56 Q45 66 60 56" stroke="#34D399" strokeWidth="3" fill="none" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px #34D399)' }}/>}
      {mood === 'concerned' && !speaking &&
        <path d="M30 60 Q45 52 60 60" stroke="#FF6B6B" strokeWidth="3" fill="none" strokeLinecap="round"/>}
      {mood === 'thinking' && !speaking &&
        <path d="M32 54 Q42 52 58 56" stroke="#60A5FA" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
      {(mood === 'idle' || mood === 'waving') && !speaking &&
        <rect x="32" y="51" width="26" height="5" rx="2.5" fill="#D97706" opacity="0.5"/>}
      {mood === 'surprised' && !speaking &&
        <ellipse cx="45" cy="54" rx="8" ry="7" fill="#FBBF24" opacity="0.8"/>}
      {speaking && (
        <ellipse cx="45" cy="54" rx="10" ry={Math.max(mouthOpen, 2)}
          fill="#F59E0B" opacity="0.9"
          style={{ filter: 'drop-shadow(0 0 5px #F59E0B)', transition: 'ry 0.1s' }}/>
      )}
      {/* Thinking dots */}
      {mood === 'thinking' && [0,1,2].map(i => (
        <circle key={i} cx={62 + i * 6} cy={24 - i * 5} r={2.5 - i * 0.5} fill="#60A5FA"
          opacity={0.9 - i * 0.25}
          style={{ animation: `para-dot 1s ${i * 0.18}s ease-in-out infinite` }}/>
      ))}

      {/* BODY */}
      {/* Left arm */}
      <rect
        x="2" y="80" width="14" height="38" rx="7"
        fill="#15181E" stroke="#D97706" strokeWidth="1.5"
        style={{
          transformOrigin: '9px 80px',
          animation: waving ? 'para-wave 0.45s ease-in-out infinite alternate' : 'none',
        }}
      />
      {/* Left hand */}
      <circle cx="9" cy="120" r="5.5" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
      {/* Right arm */}
      <rect x="74" y="80" width="14" height="38" rx="7" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
      {/* Right hand */}
      <circle cx="81" cy="120" r="5.5" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
      {/* Torso */}
      <rect x="16" y="72" width="58" height="68" rx="14" fill="#15181E" stroke="#D97706" strokeWidth="2"/>
      {/* Chest panel */}
      <rect x="24" y="80" width="42" height="38" rx="9" fill="#0A0C10" stroke="#D97706" strokeWidth="1.5"/>
      {/* Status LEDs */}
      <circle cx="34" cy="95" r="6" fill={speaking ? '#F59E0B' : '#1F2937'}
        style={{ filter: speaking ? 'drop-shadow(0 0 6px #F59E0B)' : 'none',
          animation: speaking ? 'para-glow 0.3s ease-in-out infinite alternate' : 'none', transition: 'all 0.2s' }}/>
      <circle cx="45" cy="95" r="6"
        fill={mood === 'thinking' ? '#60A5FA' : mood === 'happy' ? '#34D399' : '#1F2937'}
        style={{ filter: (mood === 'thinking' || mood === 'happy') ? `drop-shadow(0 0 6px ${mood === 'thinking' ? '#60A5FA' : '#34D399'})` : 'none', transition: 'all 0.2s' }}/>
      <circle cx="56" cy="95" r="6"
        fill={mood === 'concerned' ? '#FF6B6B' : '#1F2937'}
        style={{ filter: mood === 'concerned' ? 'drop-shadow(0 0 6px #FF6B6B)' : 'none', transition: 'all 0.2s' }}/>
      {/* Chest display bar */}
      <rect x="24" y="108" width="42" height="6" rx="3" fill="#0A0C10"/>
      <rect x="25" y="109" width={speaking ? 38 : mood === 'thinking' ? 20 : 6} height="4" rx="2"
        fill="#D97706" style={{ transition: 'width 0.5s ease' }}/>
      {/* Waist */}
      <rect x="16" y="136" width="58" height="10" rx="4" fill="#D97706" opacity="0.12"/>
      <circle cx="45" cy="141" r="5" fill="#D97706" opacity="0.4"/>
      {/* Legs */}
      <rect x="22" y="144" width="18" height="10" rx="5" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
      <rect x="50" y="144" width="18" height="10" rx="5" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
      {/* Feet */}
      <ellipse cx="31" cy="155" rx="10" ry="5" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
      <ellipse cx="59" cy="155" rx="10" ry="5" fill="#15181E" stroke="#D97706" strokeWidth="1.5"/>
    </svg>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 20) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<any>();
  useEffect(() => {
    setShown(''); setDone(false);
    if (!text) return;
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(ref.current); setDone(true); }
    }, speed);
    return () => clearInterval(ref.current);
  }, [text, speed]);
  return { shown, done };
}

/* ─── Speech Bubble ──────────────────────────────────────────────── */
function Bubble({ text, onDone }: { text: string; onDone?: () => void }) {
  const { shown, done } = useTypewriter(text, 18);
  useEffect(() => { if (done) onDone?.(); }, [done]);
  const html = shown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(16, 18, 22, 0.97)',
      border: '2px solid rgba(217,119,6,0.6)',
      borderRadius: '20px 20px 20px 4px',
      padding: '14px 18px',
      maxWidth: 280,
      fontSize: 14,
      lineHeight: 1.65,
      color: '#F1F0EE',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(217,119,6,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      animation: 'para-bubble-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <span dangerouslySetInnerHTML={{ __html: html }}/>
      {!done && <span style={{ animation: 'para-cursor 0.6s step-end infinite', marginLeft: 2, color: '#D97706' }}>▊</span>}
      {/* Tail */}
      <div style={{
        position: 'absolute', bottom: -12, left: 18,
        borderLeft: '12px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '12px solid rgba(217,119,6,0.6)',
      }}/>
      <div style={{
        position: 'absolute', bottom: -9, left: 20,
        borderLeft: '10px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '10px solid rgba(16, 18, 22, 0.97)',
      }}/>
    </div>
  );
}

/* ─── Chat Panel ─────────────────────────────────────────────────── */
function ChatPanel({
  messages, loading, stage, qIndex, multiSel, setMultiSel,
  onAnswer, onStartQs, onSkipQs, input, setInput, onSend, onClose, muted, onToggleMute, speaking
}: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const currentQ = stage === 'health_q' ? HQS[qIndex] : null;
  const showInput = stage === 'idle' || stage === 'report';

  return (
    <div style={{
      width: 330, background: 'rgba(10,11,14,0.98)',
      border: '2px solid rgba(217,119,6,0.3)',
      borderRadius: 22,
      boxShadow: '0 28px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(217,119,6,0.06)',
      overflow: 'hidden', backdropFilter: 'blur(24px)',
      animation: 'para-panel-in 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      display: 'flex', flexDirection: 'column',
      maxHeight: 480,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 16px',
        background: 'linear-gradient(90deg, rgba(217,119,6,0.12), rgba(217,119,6,0.04))',
        borderBottom: '1px solid rgba(217,119,6,0.15)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: loading ? '#F59E0B' : speaking ? '#60A5FA' : '#10B981',
          boxShadow: `0 0 8px ${loading ? '#F59E0B' : speaking ? '#60A5FA' : '#10B981'}`,
          animation: (loading || speaking) ? 'para-glow 0.5s ease-in-out infinite alternate' : 'none',
        }}/>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#F5F0E8', fontFamily: "'Syne', sans-serif", letterSpacing: '0.05em' }}>PARA</span>
          <span style={{ fontSize: 11, marginLeft: 8, color: loading ? '#F59E0B' : speaking ? '#60A5FA' : '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>
            {loading ? 'thinking…' : speaking ? 'speaking' : 'online'}
          </span>
        </div>
        <button onClick={onToggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted ? '#EF4444' : '#6B7280', padding: 4 }}>
          {muted ? <VolumeX size={14}/> : <Volume2 size={14}/>}
        </button>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
          <ChevronDown size={16}/>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m: Msg) => {
          const html = m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '84%', padding: '9px 14px',
                borderRadius: m.role === 'user' ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                background: m.role === 'user' ? 'rgba(217,119,6,0.85)' : 'rgba(255,255,255,0.05)',
                border: m.role === 'assistant' ? '1px solid rgba(217,119,6,0.2)' : 'none',
                fontSize: 13, color: m.role === 'user' ? '#0A0B0D' : '#E5E7EB',
                lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif",
              }} dangerouslySetInnerHTML={{ __html: html }}/>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: 'flex', gap: 5, padding: '8px 4px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#D97706',
                animation: `para-dot 1.1s ${i * 0.18}s ease-in-out infinite` }}/>
            ))}
          </div>
        )}
      </div>

      {/* Options for health Qs */}
      {!loading && currentQ && (
        <div style={{ padding: '8px 12px', maxHeight: 200, overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          {currentQ.type === 'select' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {currentQ.opts.map((o: string) => (
                <button key={o} onClick={() => onAnswer(o)}
                  style={{
                    textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 12.5,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(217,119,6,0.18)',
                    color: '#D1D5DB', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(217,119,6,0.15)'; (e.currentTarget as HTMLElement).style.color = '#F59E0B'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#D1D5DB'; }}
                >{o}</button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                {currentQ.opts.map((o: string) => (
                  <button key={o} onClick={() => setMultiSel((p: string[]) => p.includes(o) ? p.filter((x: string) => x !== o) : [...p, o])}
                    style={{
                      padding: '5px 10px', borderRadius: 18, fontSize: 12,
                      background: multiSel.includes(o) ? 'rgba(217,119,6,0.75)' : 'rgba(255,255,255,0.04)',
                      border: multiSel.includes(o) ? '1px solid #D97706' : '1px solid rgba(255,255,255,0.1)',
                      color: multiSel.includes(o) ? '#0A0B0D' : '#9CA3AF', cursor: 'pointer', transition: 'all 0.12s',
                    }}>{o}</button>
                ))}
              </div>
              <button onClick={() => onAnswer(multiSel.length ? multiSel : ['No symptoms'])}
                style={{ width: '100%', padding: '9px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: '#D97706', color: '#0A0B0D', border: 'none', cursor: 'pointer' }}>
                Continue →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Intro CTA */}
      {!loading && stage === 'intro' && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <button onClick={onStartQs} style={{ flex: 1, padding: '10px', borderRadius: 11, fontSize: 13, fontWeight: 700,
            background: 'linear-gradient(135deg, #D97706, #F59E0B)', color: '#0A0B0D', border: 'none', cursor: 'pointer' }}>
            Sure, let's go! 🚀
          </button>
          <button onClick={onSkipQs} style={{ padding: '10px 14px', borderRadius: 11, fontSize: 13,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#6B7280', cursor: 'pointer' }}>Skip</button>
        </div>
      )}

      {/* Text input */}
      {showInput && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,7,9,0.6)', flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Ask PARA anything…"
            disabled={loading}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '9px 13px', color: '#E5E7EB', fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(217,119,6,0.55)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          <button onClick={onSend} disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0, border: 'none',
              background: input.trim() ? 'linear-gradient(135deg, #D97706, #F59E0B)' : 'rgba(255,255,255,0.05)',
              color: input.trim() ? '#0A0B0D' : '#4B5563', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}>
            <Send size={16}/>
          </button>
        </div>
      )}

      <div style={{ padding: '4px 14px 10px', fontSize: 10, color: '#2A2E38', textAlign: 'center' }}>
        ⚠️ AI assistant only — not a medical professional. Always consult your GP.
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
let msgId = 0;

export default function ParasiteBot({ reportData }: { reportData?: any }) {
  const { accessToken, isAuthenticated, user } = useAuthStore();

  // Visibility
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [muted, setMuted] = useState(false);

  // Robot state
  const [mood, setMood] = useState<Mood>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [waving, setWaving] = useState(false);

  // Current spoken text shown in bubble
  const [bubble, setBubble] = useState('');
  const [bubbleDone, setBubbleDone] = useState(false);
  const [afterBubble, setAfterBubble] = useState<(() => void) | null>(null);

  // Conversation
  const [stage, setStage] = useState<Stage>('entering');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthCtx, setHealthCtx] = useState<Record<string, any>>({});
  const [qIndex, setQIndex] = useState(0);
  const [multiSel, setMultiSel] = useState<string[]>([]);

  const speakQueue = useRef<Array<{ text: string; mood: Mood; after?: () => void }>>([]);
  const isSpeakingRef = useRef(false);

  /* ── Speak queue processor ── */
  const processQueue = useCallback(() => {
    if (isSpeakingRef.current || speakQueue.current.length === 0) return;
    const { text, mood: m, after } = speakQueue.current.shift()!;
    isSpeakingRef.current = true;
    setBubble(text);
    setBubbleDone(false);
    setMood(m);
    setAfterBubble(after ? () => after : null);
    if (!muted) {
      SpeechEngine.speak(text, {
        onStart: () => setSpeaking(true),
        onEnd: () => { setSpeaking(false); isSpeakingRef.current = false; setTimeout(processQueue, 400); },
      });
    } else {
      setSpeaking(false);
      isSpeakingRef.current = false;
      setTimeout(processQueue, 80);
    }
    addMsg('assistant', text);
  }, [muted]);

  const say = useCallback((text: string, m: Mood = 'talking', after?: () => void) => {
    speakQueue.current.push({ text, mood: m, after });
    if (!isSpeakingRef.current) processQueue();
  }, [processQueue]);

  const addMsg = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content, id: ++msgId }]);
  };

  /* ── Boot ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    SpeechEngine.init().then(() => {
      setTimeout(() => {
        setVisible(true);
        setWaving(true);
        setTimeout(() => setWaving(false), 3000);
      }, 800);
    });
  }, [isAuthenticated]);

  /* ── Start talking after appearing ── */
  useEffect(() => {
    if (!visible) return;
    const seen = localStorage.getItem('para-intro-done');
    const savedCtx = localStorage.getItem('para-health-ctx');
    if (savedCtx) try { setHealthCtx(JSON.parse(savedCtx)); } catch {}

    if (seen) {
      setStage('idle');
      const firstName = user?.name?.split(' ')[0] || 'there';
      setTimeout(() => {
        if (reportData) {
          setStage('report');
          say(`Hey ${firstName}! 👋 Your analysis results just came in. Want me to walk you through what was found?`, 'happy', () => {
            setTimeout(() => setChatOpen(true), 1200);
          });
        } else {
          say(`Hey ${firstName}! 👋 I'm PARA. Tap me anytime you need help!`, 'waving');
        }
      }, 600);
    } else {
      setStage('intro');
      setTimeout(() => {
        // Auto-open chat after intro
        setTimeout(() => setChatOpen(true), 2000);
        say("G'day! 👋 I'm PARA, your ParasitePro assistant!", 'waving', () => {
          say("I'm here to help you get accurate results and understand your findings.", 'happy', () => {
            say("Can I ask you a few quick health questions first? It only takes a minute!", 'happy');
          });
        });
      }, 600);
    }
  }, [visible]);

  /* ── Bubble done callback ── */
  const handleBubbleDone = useCallback(() => {
    setBubbleDone(true);
    if (afterBubble) { afterBubble(); setAfterBubble(null); }
  }, [afterBubble]);

  /* ── Health Q flow ── */
  const startQs = useCallback(() => {
    setStage('health_q');
    setQIndex(0);
    SpeechEngine.cancel();
    speakQueue.current = [];
    isSpeakingRef.current = false;
    setTimeout(() => {
      say(HQS[0].q, 'talking');
    }, 200);
  }, [say]);

  const skipQs = useCallback(() => {
    localStorage.setItem('para-intro-done', '1');
    setStage('idle');
    SpeechEngine.cancel();
    speakQueue.current = [];
    isSpeakingRef.current = false;
    say("No worries! Just ask me anything whenever you need. 😊", 'happy');
  }, [say]);

  const answerQ = useCallback((answer: string | string[]) => {
    const val = Array.isArray(answer) ? answer.join(', ') : answer;
    addMsg('user', val);
    setMultiSel([]);
    const updated = { ...healthCtx, [HQS[qIndex].id]: answer };
    setHealthCtx(updated);
    const next = qIndex + 1;
    if (next < HQS.length) {
      setQIndex(next);
      setTimeout(() => say(HQS[next].q, 'talking'), 300);
    } else {
      localStorage.setItem('para-health-ctx', JSON.stringify(updated));
      localStorage.setItem('para-intro-done', '1');
      setStage('idle');
      say("That's everything! ✅ Your health profile is saved.", 'happy', () => {
        say("Now head to the Upload page to submit your first sample — or ask me anything!", 'happy');
      });
    }
  }, [healthCtx, qIndex, say]);

  /* ── AI Q&A ── */
  const sendMessage = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    addMsg('user', msg);
    SpeechEngine.cancel();
    speakQueue.current = [];
    isSpeakingRef.current = false;
    setSpeaking(false);
    setBubble('');
    setMood('thinking');
    setLoading(true);
    try {
      const saved = localStorage.getItem('para-health-ctx');
      const ctx = saved ? JSON.parse(saved) : healthCtx;
      const wantsReport = /read.*(my)?\s*report|explain.*result|walk.*through|summarise/i.test(msg);
      const body: any = { message: msg, healthContext: ctx, conversationHistory: messages.slice(-10) };
      if ((wantsReport || stage === 'report') && reportData) body.reportData = reportData;

      const res = await fetch(getApiUrl('/chatbot/message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I had a glitch! Try again in a moment. 🤖";
      const m: Mood = /sorry|error|trouble|can't/i.test(reply) ? 'concerned' : 'talking';
      say(reply, m);
    } catch {
      say("I couldn't connect right now — please check your internet. 📡", 'concerned');
    } finally {
      setLoading(false);
    }
  }, [input, loading, healthCtx, messages, stage, reportData, accessToken, say]);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      if (!m) { SpeechEngine.cancel(); setSpeaking(false); }
      return !m;
    });
  }, []);

  if (!isAuthenticated || !visible || dismissed) return null;

  return (
    <>
      <style>{`
        @keyframes para-enter {
          0%  { transform: translateY(200px) rotate(-8deg) scale(0.6); opacity: 0; }
          55% { transform: translateY(-14px) rotate(2deg) scale(1.06); opacity: 1; }
          75% { transform: translateY(6px) rotate(-1deg) scale(0.97); }
          90% { transform: translateY(-4px) rotate(0.5deg) scale(1.01); }
          100%{ transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes para-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-7px) rotate(0.5deg); }
          66%      { transform: translateY(-4px) rotate(-0.5deg); }
        }
        @keyframes para-glow { from{opacity:0.55} to{opacity:1} }
        @keyframes para-dot { 0%,100%{transform:translateY(0);opacity:0.3} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes para-wave { 0%{transform:rotate(-10deg) translateY(-2px)} 100%{transform:rotate(32deg) translateY(-8px)} }
        @keyframes para-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes para-bubble-in { from{opacity:0;transform:translateY(8px) scale(0.93)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes para-panel-in { from{opacity:0;transform:translateY(14px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes para-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }

        .para-robot {
          animation: para-enter 1s cubic-bezier(0.34,1.56,0.64,1) both,
                     para-float 5s 1.5s ease-in-out infinite;
          cursor: pointer;
        }
        .para-robot:active { transform: scale(0.95) !important; }
      `}</style>

      <div style={{
        position: 'fixed', bottom: 14, right: 14, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        gap: 12, pointerEvents: 'none',
      }}>

        {/* Chat panel */}
        {chatOpen && (
          <div style={{ pointerEvents: 'all' }}>
            <ChatPanel
              messages={messages} loading={loading} stage={stage}
              qIndex={qIndex} multiSel={multiSel} setMultiSel={setMultiSel}
              onAnswer={answerQ} onStartQs={startQs} onSkipQs={skipQs}
              input={input} setInput={setInput} onSend={sendMessage}
              onClose={() => setChatOpen(false)}
              muted={muted} onToggleMute={toggleMute} speaking={speaking}
            />
          </div>
        )}

        {/* Speech bubble (when chat closed) */}
        {!chatOpen && bubble && (
          <div style={{ pointerEvents: 'all', animation: 'para-bubble-in 0.3s ease' }}>
            <Bubble text={bubble} onDone={handleBubbleDone}/>
            {/* CTA buttons under bubble */}
            {bubbleDone && stage === 'intro' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={startQs} style={{
                  flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  background: 'linear-gradient(135deg, #D97706, #F59E0B)', color: '#0A0B0D', border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(217,119,6,0.4)',
                }}>Sure! 🚀</button>
                <button onClick={skipQs} style={{
                  padding: '10px 14px', borderRadius: 12, fontSize: 13,
                  background: 'rgba(14,15,17,0.95)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#6B7280', cursor: 'pointer',
                }}>Skip</button>
              </div>
            )}
            {bubbleDone && (stage === 'idle' || stage === 'report') && !chatOpen && (
              <button onClick={() => setChatOpen(true)} style={{
                marginTop: 8, width: '100%', padding: '9px', borderRadius: 12,
                background: 'rgba(217,119,6,0.12)', border: '1.5px solid rgba(217,119,6,0.35)',
                color: '#F59E0B', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>💬 Open chat with PARA</button>
            )}
          </div>
        )}

        {/* Robot + controls */}
        <div style={{ pointerEvents: 'all', position: 'relative' }}>
          {/* Top controls */}
          <div style={{ position: 'absolute', top: -38, right: 0, display: 'flex', gap: 6 }}>
            <button onClick={toggleMute} title={muted ? 'Unmute PARA' : 'Mute PARA'} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(10,11,14,0.95)', border: `1.5px solid ${muted ? 'rgba(239,68,68,0.5)' : 'rgba(217,119,6,0.3)'}`,
              cursor: 'pointer', color: muted ? '#EF4444' : '#9CA3AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}>{muted ? <VolumeX size={12}/> : <Volume2 size={12}/>}</button>
            <button onClick={() => setDismissed(true)} title="Hide PARA" style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(10,11,14,0.95)', border: '1.5px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', color: '#6B7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><X size={12}/></button>
          </div>

          {/* THE ROBOT */}
          <div className="para-robot"
            onClick={() => setChatOpen(o => !o)}
            title={chatOpen ? 'Hide chat' : 'Chat with PARA'}
          >
            <Robot mood={mood} speaking={speaking} waving={waving}/>
          </div>

          {/* Name tag */}
          <div style={{
            textAlign: 'center', marginTop: 5,
            fontSize: 10, fontWeight: 800, letterSpacing: '0.22em',
            color: 'rgba(217,119,6,0.7)',
            fontFamily: 'JetBrains Mono, monospace',
            textShadow: '0 0 12px rgba(217,119,6,0.3)',
          }}>P A R A</div>
        </div>

      </div>
    </>
  );
}
