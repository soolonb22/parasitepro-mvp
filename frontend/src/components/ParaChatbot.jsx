import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ParaCharacter from './ParaCharacter';

// ─── Health Intake Questions ─────────────────────────────────────────────────
const INTAKE_QUESTIONS = [
  {
    id: 'age',
    question: "Hey hey!! SO great to meet you! First up — how old are you roughly?",
    options: ['Under 18', '18–35', '36–55', '55+']
  },
  {
    id: 'weight',
    question: "Nice one! And roughly how much do you weigh? Kilos is totally fine!",
    options: ['Under 60 kg', '60–80 kg', '80–100 kg', '100 kg+', 'Rather not say']
  },
  {
    id: 'symptoms',
    question: "Okay cool! Are you dealing with any symptoms right now? Itching, tummy pain, weird fatigue — anything a bit unusual?",
    options: ['Yeah, a few things', 'Just one thing', 'Not really', 'Not sure']
  },
  {
    id: 'duration',
    question: "Got it! How long has that been going on for?",
    options: ['A few days', '1–2 weeks', 'Over a month', 'A while now', 'Not really applicable']
  },
  {
    id: 'done',
    question: "You absolute legend — thanks for sharing all that! That helps me give you way better info. Ready to jump in? 🚀",
    options: ["Let's go!!"],
    final: true
  }
];

// ─── Opening lines by page ────────────────────────────────────────────────────
const OPENING_MESSAGES = {
  landing: "Hey hey HEY!! Oh wow — you found us!! Welcome to ParasitePro! 🎉\n\nI'm PARA, your guide! This app uses AI to analyse photos you upload — samples, skin stuff, or anything that looks a bit suss — and gives you a real report straight away.\n\nNo more scary late-night Googling. Just upload a photo and I'll explain what the AI is seeing!\n\n⚠️ Quick heads-up though — I'm educational only, not a doctor! Your GP is always the real expert. 😊\n\nWanna take a proper look around? Hit that button and let's gooo!! ➡️",
  signup: "Ohhh you're signing up!! Best. Decision. EVER!! 🎉\n\nJust fill in a few quick things and you're in — I've got SO much to show you once you're set up!\n\nOh and hey — everything here is 100% private and encrypted. Your stuff stays yours. Promise! 🔒",
  dashboard: null, // handled by intake flow
  results: "Hey!! The report just loaded — want me to walk you through it? I can explain what everything means in plain English! Just ask 👇"
};

// ─── Suggestion chips parser ──────────────────────────────────────────────────
const SUGGESTIONS_MARKER = '|||SUGGESTIONS|||';

const parseReply = (raw) => {
  if (!raw) return { text: '', chips: [] };
  if (raw.includes(SUGGESTIONS_MARKER)) {
    const [text, rest] = raw.split(SUGGESTIONS_MARKER);
    try {
      const chips = JSON.parse(rest.trim());
      return { text: text.trim(), chips: Array.isArray(chips) ? chips : [] };
    } catch {
      return { text: text.trim(), chips: [] };
    }
  }
  return { text: raw.trim(), chips: [] };
};

// ─── Disclaimer bar ───────────────────────────────────────────────────────────
const DisclaimerBar = () => (
  <div style={{
    padding: '6px 12px',
    backgroundColor: '#fff7ed',
    borderTop: '1px solid #fed7aa',
    fontSize: '10.5px',
    color: '#9a3412',
    lineHeight: '1.4',
    flexShrink: 0
  }}>
    ⚠️ Educational only — not medical advice. Consult your GP. Emergency? Call <strong>000</strong>.
  </div>
);

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '10px',
      alignItems: 'flex-end',
      gap: '6px'
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#0F6E56', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14
        }}>🪱</div>
      )}
      <div style={{
        maxWidth: '80%',
        padding: '9px 12px',
        borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
        backgroundColor: isUser ? '#0F6E56' : '#f3f4f6',
        color: isUser ? 'white' : '#111827',
        fontSize: '13px',
        lineHeight: '1.55',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {msg.content}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * ParaChatbot — PARA the AI guide, rendered as a floating button + slide-up panel.
 *
 * Props:
 *   page         {string}  — 'landing' | 'signup' | 'dashboard' | 'results'
 *   user         {object}  — auth user object (optional, used for intake key)
 *   analysisId   {string}  — for results page
 *   analysisData {object}  — for results page
 */
const ParaChatbot = ({ page = 'dashboard', user = null, analysisId = null, analysisData = null }) => {
  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [chips, setChips]           = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isWaving, setIsWaving]     = useState(false);
  const [intakeStep, setIntakeStep] = useState(0);
  const [intakeData, setIntakeData] = useState({});
  const [intakeMode, setIntakeMode] = useState(false);
  const [hasBooted, setHasBooted]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const intakeKey = `para_intake_${user?.id || 'guest'}`;

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── Boot logic: auto-open + first message ──────────────────────────────────
  useEffect(() => {
    if (hasBooted) return;

    const boot = () => {
      setHasBooted(true);

      if (page === 'landing' || page === 'signup') {
        // Auto-open with a delay so the page has loaded
        setTimeout(() => {
          setIsWaving(true);
          setTimeout(() => {
            setIsOpen(true);
            const msg = OPENING_MESSAGES[page];
            if (msg) {
              setMessages([{ role: 'assistant', content: msg }]);
              setChips(page === 'landing'
                ? ['What can the app do?', 'How much does it cost?', 'Is it safe to use?']
                : ['Is it private?', "What's included for free?", 'How do I upload a photo?']
              );
            }
          }, 600);
        }, page === 'landing' ? 1500 : 2200);

      } else if (page === 'dashboard') {
        const intakeDone = localStorage.getItem(intakeKey);
        if (!intakeDone) {
          // First login — run intake
          setTimeout(() => {
            setIsWaving(true);
            setTimeout(() => {
              setIsOpen(true);
              setIntakeMode(true);
              setIntakeStep(0);
              setMessages([{
                role: 'assistant',
                content: INTAKE_QUESTIONS[0].question
              }]);
            }, 700);
          }, 1200);
        }

      } else if (page === 'results' && analysisData) {
        setTimeout(() => {
          setIsOpen(true);
          setMessages([{ role: 'assistant', content: OPENING_MESSAGES.results }]);
          setChips(['Walk me through the report', 'What does this mean?', 'How urgent is this?']);
        }, 2000);
      }
    };

    boot();
  }, [page, hasBooted, intakeKey, analysisData]);

  // ── Intake answer handler ─────────────────────────────────────────────────
  const handleIntakeAnswer = async (answer) => {
    const question = INTAKE_QUESTIONS[intakeStep];
    const newIntakeData = { ...intakeData, [question.id]: answer };
    setIntakeData(newIntakeData);

    // Show user's choice
    setMessages(prev => [...prev, { role: 'user', content: answer }]);

    if (question.final) {
      // Intake complete — save, switch to normal chat, send summary to API
      localStorage.setItem(intakeKey, 'true');
      setIntakeMode(false);
      setIsThinking(true);

      const summary = `Health intake complete. Details: Age: ${newIntakeData.age}, Weight: ${newIntakeData.weight}, Symptoms: ${newIntakeData.symptoms}, Duration: ${newIntakeData.duration}.`;

      try {
        const response = await axios.post('/api/chat', {
          messages: [{ role: 'user', content: summary }],
          page: 'dashboard',
          intakeData: newIntakeData
        });
        setIsThinking(false);
        const raw = response.data?.reply || response.data?.message || '';
        const { text, chips: newChips } = parseReply(raw);
        setMessages(prev => [...prev, { role: 'assistant', content: text || "Awesome — let's dive in! What do you want to know first?" }]);
        setChips(newChips.length ? newChips : ['How do I upload a photo?', 'What can the app detect?', 'What do the results mean?']);
      } catch {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Awesome — let's get started! You can upload a photo any time by hitting the Upload button up top. I'll be right here to walk you through everything! 🙌"
        }]);
        setChips(['How do I upload?', 'What can be detected?', 'How do credits work?']);
      }
    } else {
      // Next question
      const next = intakeStep + 1;
      setIntakeStep(next);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: INTAKE_QUESTIONS[next].question }]);
      }, 380);
    }
  };

  // ── Normal chat send ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setChips([]);
    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setIsThinking(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        page,
        analysisId,
        analysisData
      });

      const raw = response.data?.reply || response.data?.message || '';
      const { text: replyText, chips: newChips } = parseReply(raw);

      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      setChips(newChips);
    } catch (err) {
      console.error('ParaChatbot API error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Hmm, something went a bit sideways there! Try again in a sec? If it keeps happening, your internet might be playing up. 😅"
      }]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  }, [input, messages, isLoading, page, analysisId, analysisData]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  const currentIntakeQuestion = intakeMode ? INTAKE_QUESTIONS[intakeStep] : null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '10px'
    }}>
      {/* ── Chat Panel ── */}
      <div style={{
        width: '330px',
        height: '490px',
        backgroundColor: 'white',
        borderRadius: '18px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        transformOrigin: 'bottom right',
        transform: isOpen ? 'scale(1)' : 'scale(0.85)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0
        }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <ParaCharacter size={34} isThinking={isThinking} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '14px', lineHeight: 1.2 }}>PARA</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>
              {isThinking ? 'Thinking...' : 'Your ParasitePro guide'}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: 'white',
              width: 28, height: 28,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 12px 8px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

          {isThinking && (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingLeft: 4, marginBottom: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  backgroundColor: '#0F6E56', opacity: 0.5,
                  animation: `paraThinkDot 1.1s ease-in-out ${i * 0.22}s infinite`
                }} />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Intake options */}
        {intakeMode && currentIntakeQuestion && (
          <div style={{
            padding: '8px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            flexShrink: 0,
            borderTop: '1px solid #f3f4f6'
          }}>
            {currentIntakeQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleIntakeAnswer(opt)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  background: 'white',
                  border: '1.5px solid #0F6E56',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  color: '#0F6E56',
                  fontWeight: 500,
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.target.style.background = '#0F6E56'; e.target.style.color = 'white'; }}
                onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = '#0F6E56'; }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Suggestion chips */}
        {!intakeMode && chips.length > 0 && (
          <div style={{
            padding: '6px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            flexShrink: 0
          }}>
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                style={{
                  padding: '5px 11px',
                  fontSize: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  color: '#166534',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.target.style.background = '#dcfce7'}
                onMouseLeave={e => e.target.style.background = '#f0fdf4'}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <DisclaimerBar />

        {/* Input */}
        {!intakeMode && (
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 12px',
            borderTop: '1px solid #f3f4f6',
            flexShrink: 0
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask PARA anything..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                border: '1.5px solid #e5e7eb',
                borderRadius: '20px',
                outline: 'none',
                backgroundColor: '#f9fafb',
                color: '#111827',
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = '#0F6E56'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: input.trim() && !isLoading ? '#0F6E56' : '#e5e7eb',
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── PARA Character Button ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: 64, height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(15,110,86,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          transform: mounted ? 'scale(1)' : 'scale(0)',
          flexShrink: 0,
          position: 'relative'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with PARA"
      >
        <ParaCharacter size={46} isWaving={isWaving} />

        {/* Unread dot */}
        {!isOpen && messages.length > 0 && (
          <div style={{
            position: 'absolute', top: 2, right: 2,
            width: 13, height: 13,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid white'
          }} />
        )}
      </button>

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes paraThinkDot {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ParaChatbot;
