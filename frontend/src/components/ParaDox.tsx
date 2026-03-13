// @ts-nocheck
/**
 * ParaDox — Educational Pattern-Analysis Chatbot
 * ─────────────────────────────────────────────────
 * • Worm mascot with idle / thinking / talking / happy / surprised animations
 * • Depth selector: Simple | Medium | Deep Dive | Visual
 * • AI-generated contextual reply chips after every message
 * • Multi-agent backend: Scout → Analyst → Teacher → Boundary Keeper
 * • Markdown rendering
 * • Mobile-responsive
 * • No login required (public educational feature)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, RotateCcw, BookOpen, Zap, Microscope, AlignLeft } from 'lucide-react';
import { getApiUrl } from '../api';

// ─── Types ────────────────────────────────────────────────────────
type Mood = 'idle' | 'thinking' | 'talking' | 'happy' | 'surprised' | 'waving';
type Depth = 'simple' | 'medium' | 'deep' | 'visual';
type Phase = 'closed' | 'launcher' | 'chat';
type Msg = { role: 'user' | 'assistant'; content: string; id: number; suggestions?: string[] };

// ─── Worm SVG Mascot ─────────────────────────────────────────────
function WormMascot({ mood, size = 48 }: { mood: Mood; size?: number }) {
  const pupilOffset = mood === 'surprised' ? -2 : mood === 'happy' ? 1 : 0;
  const bodyWiggle = mood === 'thinking' || mood === 'talking';
  const eyeWide = mood === 'surprised';
  const smile = mood === 'happy' || mood === 'talking' || mood === 'waving';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{
        display: 'block',
        animation: bodyWiggle
          ? 'paradox-wiggle 0.6s ease-in-out infinite alternate'
          : mood === 'idle'
          ? 'paradox-float 3s ease-in-out infinite'
          : mood === 'waving'
          ? 'paradox-wave 0.5s ease-in-out infinite alternate'
          : 'none',
        transformOrigin: '50% 80%',
      }}
    >
      {/* Body — segmented worm */}
      <ellipse cx="24" cy="38" rx="7" ry="5.5" fill="#D97706" opacity="0.85" />
      <ellipse cx="24" cy="30" rx="8" ry="6" fill="#F59E0B" />
      <ellipse cx="24" cy="21" rx="9" ry="7" fill="#FCD34D" />
      {/* Segment lines */}
      <line x1="16" y1="34" x2="32" y2="34" stroke="#D97706" strokeWidth="0.8" opacity="0.5" />
      <line x1="15" y1="26" x2="33" y2="26" stroke="#D97706" strokeWidth="0.8" opacity="0.5" />
      {/* Head */}
      <ellipse cx="24" cy="13" rx="10" ry="9" fill="#FDE68A" />
      {/* Eyes */}
      <ellipse cx="20" cy={11 + (eyeWide ? -0.5 : 0)} rx={eyeWide ? 3.5 : 3} ry={eyeWide ? 4 : 3.5} fill="white" />
      <ellipse cx="28" cy={11 + (eyeWide ? -0.5 : 0)} rx={eyeWide ? 3.5 : 3} ry={eyeWide ? 4 : 3.5} fill="white" />
      {/* Pupils */}
      <circle cx={20 + (mood === 'waving' ? 1 : 0)} cy={11.5 + pupilOffset} r={eyeWide ? 2 : 1.8} fill="#1C1917" />
      <circle cx={28 + (mood === 'waving' ? 1 : 0)} cy={11.5 + pupilOffset} r={eyeWide ? 2 : 1.8} fill="#1C1917" />
      {/* Eye shine */}
      <circle cx={21 + (mood === 'waving' ? 1 : 0)} cy={10.2 + pupilOffset} r="0.7" fill="white" opacity="0.9" />
      <circle cx={29 + (mood === 'waving' ? 1 : 0)} cy={10.2 + pupilOffset} r="0.7" fill="white" opacity="0.9" />
      {/* Mouth */}
      {smile ? (
        <path d="M 20.5 16.5 Q 24 19 27.5 16.5" stroke="#92400E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 21 17.5 Q 24 17 27 17.5" stroke="#92400E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      )}
      {/* Thinking bubble */}
      {mood === 'thinking' && (
        <>
          <circle cx="36" cy="8" r="1.2" fill="#F59E0B" opacity="0.6" />
          <circle cx="39" cy="5" r="1.8" fill="#F59E0B" opacity="0.5" />
          <circle cx="42" cy="2.5" r="2.5" fill="#F59E0B" opacity="0.4" />
        </>
      )}
      {/* Surprised sparkles */}
      {mood === 'surprised' && (
        <>
          <text x="34" y="10" fontSize="6" fill="#F59E0B">✦</text>
          <text x="10" y="8" fontSize="5" fill="#FCD34D">✦</text>
        </>
      )}
      {/* Wave arm */}
      {mood === 'waving' && (
        <path d="M 33 18 Q 40 12 38 8" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// ─── Markdown renderer ────────────────────────────────────────────
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { elements.push(<br key={i} />); i++; continue; }

    const isBullet = /^[-•*]\s/.test(line.trim());
    const isNumber = /^\d+\.\s/.test(line.trim());

    if (isBullet || isNumber) {
      const items: string[] = [];
      while (i < lines.length && (/^[-•*]\s/.test(lines[i].trim()) || /^\d+\.\s/.test(lines[i].trim()))) {
        items.push(lines[i].replace(/^[-•*\d.]\s+/, '').trim());
        i++;
      }
      const Tag = isNumber ? 'ol' : 'ul';
      elements.push(
        <Tag key={i} style={{ margin: '4px 0 4px 16px', padding: 0, lineHeight: 1.6 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 2 }}><InlineMarkdown text={item} /></li>
          ))}
        </Tag>
      );
    } else {
      elements.push(<p key={i} style={{ margin: '4px 0', lineHeight: 1.6 }}><InlineMarkdown text={line} /></p>);
      i++;
    }
  }
  return <>{elements}</>;
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ color: '#FCD34D' }}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ─── Depth Options ───────────────────────────────────────────────
const DEPTHS: { key: Depth; label: string; icon: any; desc: string }[] = [
  { key: 'simple', label: 'Simple', icon: AlignLeft, desc: 'Quick version' },
  { key: 'medium', label: 'Medium', icon: BookOpen, desc: 'Full story' },
  { key: 'deep', label: 'Deep Dive', icon: Microscope, desc: 'Nerdy version' },
  { key: 'visual', label: 'Visual', icon: Zap, desc: 'Diagram + notes' },
];

// ─── CSS animations injected once ────────────────────────────────
const INJECT_CSS = `
@keyframes paradox-wiggle {
  from { transform: rotate(-4deg) scaleX(0.97); }
  to   { transform: rotate(4deg)  scaleX(1.03); }
}
@keyframes paradox-float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-4px); }
}
@keyframes paradox-wave {
  from { transform: rotate(-8deg); }
  to   { transform: rotate(8deg); }
}
@keyframes paradox-fadein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes paradox-bouncein {
  0%   { opacity: 0; transform: scale(0.7); }
  60%  { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes paradox-dots {
  0%,80%,100% { opacity: 0; }
  40% { opacity: 1; }
}
`;

// ─── Main Component ──────────────────────────────────────────────
export default function ParaDox() {
  const [phase, setPhase] = useState<Phase>('launcher');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [depth, setDepth] = useState<Depth>('simple');
  const [msgId, setMsgId] = useState(0);
  const [cssInjected, setCssInjected] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inject CSS once
  useEffect(() => {
    if (!cssInjected) {
      const style = document.createElement('style');
      style.textContent = INJECT_CSS;
      document.head.appendChild(style);
      setCssInjected(true);
    }
  }, [cssInjected]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Open chat with greeting
  const openChat = useCallback(() => {
    setPhase('chat');
    if (messages.length === 0) {
      setMood('waving');
      const greeting: Msg = {
        role: 'assistant',
        id: 0,
        content: `G'day! I'm **ParaDox** — your pattern-obsessed biology guide. 🪱\n\nI explain parasites, organisms, and biological patterns in a way that's actually fun. No medical advice — just pure, nerdy learning.\n\nWhat would you like to explore today?`,
        suggestions: ['How do tapeworms work?', 'What is a fluke?', 'Explain parasite lifecycle'],
      };
      setMessages([greeting]);
      setTimeout(() => setMood('idle'), 2000);
    }
  }, [messages.length]);

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // Send message
  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput('');
    setError('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }

    const userMsg: Msg = { role: 'user', content, id: msgId + 1 };
    setMsgId(prev => prev + 2);
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setMood('thinking');

    // Build history for API
    const history = messages
      .filter(m => m.id !== 0)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${getApiUrl()}/api/paradox/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          depth,
          conversationHistory: history,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMood('talking');
      const assistantMsg: Msg = {
        role: 'assistant',
        content: data.message,
        id: msgId + 2,
        suggestions: data.suggestions,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setTimeout(() => setMood('idle'), 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again!');
      setMood('surprised');
      setTimeout(() => setMood('idle'), 2000);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, depth, msgId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMsgId(0);
    setMood('waving');
    const greeting: Msg = {
      role: 'assistant',
      id: 0,
      content: `Fresh start! What shall we explore?\n\n**ParaDox** is ready to get nerdy with you.`,
      suggestions: ['What is a nematode?', 'Explain parasite life cycles', 'Australian parasites'],
    };
    setMessages([greeting]);
    setTimeout(() => setMood('idle'), 2000);
  };

  // ─── LAUNCHER BUTTON ──────────────────────────────────────────
  if (phase === 'launcher') {
    return (
      <button
        onClick={openChat}
        aria-label="Open ParaDox educational chatbot"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(217,119,6,0.5)',
          zIndex: 1000,
          animation: 'paradox-float 3s ease-in-out infinite',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <WormMascot mood={mood} size={42} />
        <span style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#10B981',
          border: '2px solid #0E0F11',
          fontSize: 9,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}>!</span>
      </button>
    );
  }

  // ─── CHAT PANEL ───────────────────────────────────────────────
  const panelWidth = 'min(420px, calc(100vw - 24px))';

  return (
    <>
      {/* Launcher pill (while chat open) */}
      {phase === 'chat' && (
        <button
          onClick={() => setPhase('launcher')}
          aria-label="Minimise ParaDox"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#1C1917',
            border: '1.5px solid #D97706',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            color: '#D97706',
          }}
        >
          <X size={20} />
        </button>
      )}

      {/* Chat window */}
      <div
        role="dialog"
        aria-label="ParaDox educational chatbot"
        style={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          width: panelWidth,
          height: 'min(640px, calc(100vh - 120px))',
          background: '#0E0F11',
          border: '1px solid #292524',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
          animation: 'paradox-bouncein 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(217,119,6,0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #0E0F11 100%)',
          borderBottom: '1px solid #292524',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ position: 'relative' }}>
            <WormMascot mood={mood} size={44} />
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #0E0F11',
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#FDE68A', letterSpacing: 0.3 }}>ParaDox</p>
            <p style={{ margin: 0, fontSize: 11, color: '#78716C' }}>
              {loading ? '✦ Thinking...' : '✦ Educational biology guide'}
            </p>
          </div>
          <button
            onClick={clearChat}
            title="New conversation"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#78716C',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Depth Selector */}
        <div style={{
          background: '#111113',
          borderBottom: '1px solid #1C1917',
          padding: '8px 12px',
          display: 'flex',
          gap: 6,
          flexShrink: 0,
          overflowX: 'auto',
        }}>
          {DEPTHS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setDepth(key)}
              title={DEPTHS.find(d => d.key === key)?.desc}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 20,
                border: depth === key ? '1.5px solid #D97706' : '1.5px solid #292524',
                background: depth === key ? 'rgba(217,119,6,0.15)' : 'transparent',
                color: depth === key ? '#FCD34D' : '#78716C',
                fontSize: 12,
                fontWeight: depth === key ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          scrollbarWidth: 'thin',
          scrollbarColor: '#292524 transparent',
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ animation: 'paradox-fadein 0.25s ease' }}>
              {msg.role === 'user' ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                    color: '#FEF3C7',
                    borderRadius: '14px 14px 2px 14px',
                    padding: '9px 13px',
                    maxWidth: '82%',
                    fontSize: 13.5,
                    lineHeight: 1.55,
                  }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <WormMascot mood="idle" size={26} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: '#1C1917',
                      border: '1px solid #292524',
                      borderRadius: '2px 14px 14px 14px',
                      padding: '9px 13px',
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: '#F5F0E8',
                    }}>
                      <MarkdownText text={msg.content} />
                    </div>

                    {/* Suggestion chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 5,
                        marginTop: 7,
                        paddingLeft: 2,
                      }}>
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(s)}
                            disabled={loading}
                            style={{
                              background: 'rgba(217,119,6,0.08)',
                              border: '1px solid rgba(217,119,6,0.3)',
                              borderRadius: 20,
                              padding: '4px 10px',
                              color: '#FCD34D',
                              fontSize: 12,
                              cursor: loading ? 'default' : 'pointer',
                              opacity: loading ? 0.5 : 1,
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(217,119,6,0.2)'; }}}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.08)'; }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', animation: 'paradox-fadein 0.2s ease' }}>
              <WormMascot mood="thinking" size={26} />
              <div style={{
                background: '#1C1917',
                border: '1px solid #292524',
                borderRadius: '2px 14px 14px 14px',
                padding: '10px 14px',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#D97706',
                    animation: `paradox-dots 1.2s ${delay}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              padding: '8px 12px',
              color: '#FCA5A5',
              fontSize: 13,
            }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Disclaimer bar */}
        <div style={{
          background: '#0A0A0C',
          borderTop: '1px solid #1C1917',
          padding: '5px 14px',
          flexShrink: 0,
        }}>
          <p style={{ margin: 0, fontSize: 10, color: '#57534E', textAlign: 'center' }}>
            📚 Educational only — not medical advice. For health concerns, consult a GP.
          </p>
        </div>

        {/* Input area */}
        <div style={{
          background: '#111113',
          borderTop: '1px solid #1C1917',
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          flexShrink: 0,
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask ParaDox anything about parasites…"
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              background: '#1C1917',
              border: '1.5px solid #292524',
              borderRadius: 12,
              padding: '9px 12px',
              color: '#F5F0E8',
              fontSize: 13.5,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              maxHeight: 120,
              scrollbarWidth: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => (e.target.style.borderColor = '#D97706')}
            onBlur={e => (e.target.style.borderColor = '#292524')}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: loading || !input.trim()
                ? '#292524'
                : 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
              border: 'none',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: loading || !input.trim() ? '#57534E' : '#0E0F11',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
