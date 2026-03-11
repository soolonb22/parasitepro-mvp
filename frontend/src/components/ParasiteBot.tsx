// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, ChevronDown, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';

/* ─────────────────────────── types ─────────────────────────── */
type Stage = 'intro' | 'disclaimer' | 'health_q' | 'idle' | 'report';
type Msg = { role: 'user' | 'assistant'; content: string; ts?: number };

interface HealthContext {
  location?: string;
  travel?: string;
  pets?: string;
  symptoms?: string[];
  duration?: string;
  occupation?: string;
}

interface ParasiteBotProps {
  reportData?: any;           // pass when on results page
  onHealthContextSaved?: (ctx: HealthContext) => void;
}

/* ─────────────────── health‑question definitions ────────────── */
const HEALTH_QUESTIONS = [
  {
    id: 'location',
    question: "First up — where in Australia are you located?",
    type: 'select',
    options: ['Queensland (Tropical)', 'Queensland (SEQ)', 'Northern Territory', 'Western Australia (North)', 'Western Australia (South)', 'New South Wales', 'Victoria', 'South Australia', 'Tasmania', 'ACT', 'Outside Australia'],
  },
  {
    id: 'travel',
    question: "Have you travelled to any tropical or overseas regions in the last 6 months?",
    type: 'select',
    options: ['No travel', 'Domestic tropical travel (QLD, NT)', 'South-East Asia', 'Africa or Middle East', 'South America', 'Pacific Islands', 'Multiple regions'],
  },
  {
    id: 'pets',
    question: "Do you have pets at home?",
    type: 'select',
    options: ['No pets', 'Dogs', 'Cats', 'Dogs and Cats', 'Farm animals', 'Reptiles or exotic pets', 'Other'],
  },
  {
    id: 'symptoms',
    question: "Are you experiencing any of the following symptoms? (Select all that apply)",
    type: 'multi',
    options: ['Abdominal pain or cramping', 'Visible worms or eggs', 'Skin rash or lesions', 'Itching (skin or anal area)', 'Fatigue or weakness', 'Nausea or vomiting', 'Diarrhoea', 'Weight loss', 'No current symptoms'],
  },
  {
    id: 'duration',
    question: "How long have you been experiencing these symptoms or concerns?",
    type: 'select',
    options: ['Just noticed today', 'A few days', '1–2 weeks', '2–4 weeks', 'Over a month', '3+ months', 'No symptoms — preventive check'],
  },
  {
    id: 'occupation',
    question: "Last one — what best describes your occupation or daily environment?",
    type: 'select',
    options: ['General public', 'Healthcare worker', 'Childcare or education', 'Agriculture or farming', 'Veterinary or animal work', 'Outdoor / fieldwork', 'Returning traveller', 'Prefer not to say'],
  },
];

/* ──────────────────────────── SVG Robot ──────────────────────── */
const RobotAvatar = ({ size = 36, pulse = false }: { size?: number; pulse?: boolean }) => (
  <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
    {pulse && (
      <div style={{
        position: 'absolute', inset: -4,
        borderRadius: '50%',
        background: 'rgba(217,119,6,0.25)',
        animation: 'para-pulse 2s ease-in-out infinite',
      }} />
    )}
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="16" y="38" width="48" height="34" rx="8" fill="#1C1D20" stroke="#D97706" strokeWidth="2"/>
      {/* Head */}
      <rect x="18" y="10" width="44" height="32" rx="10" fill="#1C1D20" stroke="#D97706" strokeWidth="2"/>
      {/* Antenna */}
      <line x1="40" y1="10" x2="40" y2="4" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="3" r="2.5" fill="#F59E0B"/>
      {/* Eyes */}
      <rect x="24" y="18" width="12" height="10" rx="3" fill="#D97706"/>
      <rect x="44" y="18" width="12" height="10" rx="3" fill="#D97706"/>
      <rect x="27" y="21" width="4" height="4" rx="1" fill="#0E0F11"/>
      <rect x="47" y="21" width="4" height="4" rx="1" fill="#0E0F11"/>
      {/* Mouth */}
      <rect x="28" y="32" width="24" height="4" rx="2" fill="#D97706" opacity="0.6"/>
      <rect x="32" y="32" width="4" height="4" rx="1" fill="#F59E0B"/>
      <rect x="40" y="32" width="4" height="4" rx="1" fill="#F59E0B"/>
      {/* Chest panel */}
      <rect x="24" y="46" width="32" height="18" rx="4" fill="#0E0F11" stroke="#D97706" strokeWidth="1" opacity="0.8"/>
      <circle cx="32" cy="55" r="3" fill="#F59E0B" opacity="0.9"/>
      <circle cx="40" cy="55" r="3" fill="#10B981" opacity="0.9"/>
      <circle cx="48" cy="55" r="3" fill="#EF4444" opacity="0.9"/>
      {/* Arms */}
      <rect x="4" y="42" width="10" height="20" rx="5" fill="#1C1D20" stroke="#D97706" strokeWidth="2"/>
      <rect x="66" y="42" width="10" height="20" rx="5" fill="#1C1D20" stroke="#D97706" strokeWidth="2"/>
    </svg>
  </div>
);

/* ─────────────────── tiny typing indicator ─────────────────── */
const Typing = () => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 14px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: '50%',
        background: '#D97706',
        animation: `para-dot 1.2s ${i * 0.2}s ease-in-out infinite`,
      }}/>
    ))}
  </div>
);

/* ──────────────────────── main component ─────────────────────── */
export default function ParasiteBot({ reportData, onHealthContextSaved }: ParasiteBotProps) {
  const { accessToken, isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('intro');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthCtx, setHealthCtx] = useState<HealthContext>({});
  const [qIndex, setQIndex] = useState(0);
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [minimised, setMinimised] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [notification, setNotification] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect if on results page
  const isReportPage = !!reportData;

  // Auto-open logic
  useEffect(() => {
    if (!isAuthenticated) return;
    const seen = localStorage.getItem('para-intro-done');
    if (!seen) {
      setTimeout(() => {
        setNotification(true);
        // Auto-open after 3s delay on first login
        setTimeout(() => {
          setOpen(true);
          setNotification(false);
        }, 4000);
      }, 2000);
    } else {
      setHasSeenIntro(true);
      setStage('idle');
      const saved = localStorage.getItem('para-health-ctx');
      if (saved) setHealthCtx(JSON.parse(saved));
    }
  }, [isAuthenticated]);

  // Report mode
  useEffect(() => {
    if (isReportPage && hasSeenIntro && open && stage === 'idle') {
      setStage('report');
      const saved = localStorage.getItem('para-health-ctx');
      if (saved) setHealthCtx(JSON.parse(saved));
      pushBot("📋 I can see your analysis results are ready! Would you like me to walk you through the findings? Just say **\"Read my report\"** or ask me anything about the results.");
    }
  }, [isReportPage, open, hasSeenIntro]);

  // Init intro messages
  useEffect(() => {
    if (open && messages.length === 0 && stage === 'intro') {
      setTimeout(() => pushBot(
        "👋 G'day! I'm **PARA** — your ParasitePro AI Assistant.\n\nI'm here to help you understand the app, answer your questions, and guide you through your results.\n\nBefore we get started, can I ask a few quick health questions? They help make your analysis much more accurate. 🎯"
      ), 400);
      setTimeout(() => pushBot(
        "We'll cover things like where you live in Australia, any recent travel, symptoms you're experiencing — nothing too personal, and all optional. Ready to go?",
        true // show cta
      ), 1800);
    }
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const pushBot = useCallback((content: string, _showCta?: boolean) => {
    setMessages(prev => [...prev, { role: 'assistant', content, ts: Date.now() }]);
  }, []);

  const pushUser = useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'user', content, ts: Date.now() }]);
  }, []);

  /* ── disclaimer ── */
  const handleAgreeDisclaimer = () => {
    setStage('health_q');
    pushBot("Thanks! Now, a few quick questions about your health context. These help tailor your analysis results.");
    setTimeout(() => askHealthQ(0), 800);
  };

  const handleSkipQuestions = () => {
    finishOnboarding();
  };

  /* ── health questions ── */
  const askHealthQ = (idx: number) => {
    const q = HEALTH_QUESTIONS[idx];
    if (!q) { finishOnboarding(); return; }
    setQIndex(idx);
    setMultiSel([]);
    setTimeout(() => {
      pushBot(`**${idx + 1}/${HEALTH_QUESTIONS.length}** — ${q.question}`);
    }, 300);
  };

  const answerHealthQ = (answer: string | string[]) => {
    const q = HEALTH_QUESTIONS[qIndex];
    const val = Array.isArray(answer) ? answer.join(', ') : answer;
    pushUser(val);

    const updated = { ...healthCtx, [q.id]: answer };
    setHealthCtx(updated);

    const next = qIndex + 1;
    if (next < HEALTH_QUESTIONS.length) {
      askHealthQ(next);
    } else {
      localStorage.setItem('para-health-ctx', JSON.stringify(updated));
      if (onHealthContextSaved) onHealthContextSaved(updated);
      pushBot("✅ Perfect — all saved! This information will make your parasite analysis more accurate.");
      setTimeout(() => finishOnboarding(updated), 1000);
    }
  };

  const finishOnboarding = (ctx?: HealthContext) => {
    localStorage.setItem('para-intro-done', '1');
    setHasSeenIntro(true);
    setStage('idle');
    setTimeout(() => {
      pushBot("You're all set! 🎉\n\nYou can now upload images for AI analysis via the **Upload** tab. I'll be right here if you need help.\n\nSome things you can ask me:\n• *\"How do I upload a sample?\"*\n• *\"What does my confidence score mean?\"*\n• *\"Read my report\"*\n• *\"What are the symptoms of tapeworm?\"*");
    }, 500);
  };

  /* ── AI Q&A ── */
  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    pushUser(msg);

    // Handle report read request
    const wantsReport = /read.*(my)?\s*report|explain.*result|walk.*through|summarise.*result/i.test(msg);

    setLoading(true);
    try {
      const saved = localStorage.getItem('para-health-ctx');
      const ctx = saved ? JSON.parse(saved) : healthCtx;

      // Keep last 10 messages for context
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

      const body: any = {
        message: msg,
        healthContext: ctx,
        conversationHistory: history,
      };

      if ((wantsReport || stage === 'report') && reportData) {
        body.reportData = reportData;
      }

      const res = await fetch(getApiUrl('/chatbot/message'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.reply) pushBot(data.reply);
      else pushBot("I'm having a bit of trouble right now. Please try again in a moment. 🤖");
    } catch {
      pushBot("Sorry, I couldn't connect. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const resetBot = () => {
    localStorage.removeItem('para-intro-done');
    localStorage.removeItem('para-health-ctx');
    setMessages([]);
    setStage('intro');
    setHealthCtx({});
    setHasSeenIntro(false);
    setQIndex(0);
  };

  /* ── render helpers ── */
  const renderMessage = (msg: Msg, i: number) => {
    const isBot = msg.role === 'assistant';
    const text = msg.content;

    // Simple markdown: **bold**, *italic*, newlines
    const formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    return (
      <div key={i} style={{
        display: 'flex',
        gap: 10,
        flexDirection: isBot ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        marginBottom: 14,
      }}>
        {isBot && <RobotAvatar size={30} />}
        <div style={{
          maxWidth: '78%',
          padding: '10px 14px',
          borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
          background: isBot ? 'rgba(30,31,35,0.95)' : 'rgba(217,119,6,0.9)',
          border: isBot ? '1px solid rgba(217,119,6,0.2)' : 'none',
          fontSize: '13.5px',
          lineHeight: 1.55,
          color: isBot ? '#E5E7EB' : '#0E0F11',
          fontFamily: "'DM Sans', sans-serif",
        }} dangerouslySetInnerHTML={{ __html: formatted }} />
      </div>
    );
  };

  const renderQuickOptions = () => {
    const q = HEALTH_QUESTIONS[qIndex];
    if (stage !== 'health_q' || !q || loading) return null;

    if (q.type === 'multi') {
      return (
        <div style={{ padding: '8px 12px 4px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {q.options.map(opt => (
              <button key={opt}
                onClick={() => {
                  setMultiSel(prev =>
                    prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
                  );
                }}
                style={{
                  padding: '5px 10px', borderRadius: 20, fontSize: 12,
                  background: multiSel.includes(opt) ? 'rgba(217,119,6,0.8)' : 'rgba(255,255,255,0.06)',
                  border: multiSel.includes(opt) ? '1px solid #D97706' : '1px solid rgba(255,255,255,0.12)',
                  color: multiSel.includes(opt) ? '#0E0F11' : '#9CA3AF',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{opt}</button>
            ))}
          </div>
          <button
            onClick={() => answerHealthQ(multiSel.length ? multiSel : ['No symptoms'])}
            style={{
              width: '100%', padding: '9px', borderRadius: 10, fontSize: 13,
              background: '#D97706', color: '#0E0F11', fontWeight: 600,
              border: 'none', cursor: 'pointer',
            }}
          >
            Continue →
          </button>
        </div>
      );
    }

    // single select
    return (
      <div style={{ padding: '8px 12px 4px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {q.options.map(opt => (
          <button key={opt}
            onClick={() => answerHealthQ(opt)}
            style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(217,119,6,0.2)',
              color: '#D1D5DB', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'rgba(217,119,6,0.15)'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  const renderDisclaimerCTA = () => {
    if (stage !== 'intro' && stage !== 'disclaimer') return null;
    if (messages.length < 2) return null;
    return (
      <div style={{ padding: '8px 12px 8px', display: 'flex', gap: 8 }}>
        <button onClick={handleAgreeDisclaimer} style={{
          flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: '#D97706', color: '#0E0F11', border: 'none', cursor: 'pointer',
        }}>
          Let's go! 🚀
        </button>
        <button onClick={handleSkipQuestions} style={{
          padding: '10px 14px', borderRadius: 10, fontSize: 13,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#9CA3AF', cursor: 'pointer',
        }}>
          Skip
        </button>
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* ── Global keyframe styles ── */}
      <style>{`
        @keyframes para-pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:1} }
        @keyframes para-dot { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }
        @keyframes para-slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes para-pop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes para-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .para-btn:hover { transform: scale(1.05) !important; }
        .para-msg-input:focus { outline: none; border-color: rgba(217,119,6,0.6) !important; }
      `}</style>

      {/* ── Floating button ── */}
      {!open && (
        <div
          onClick={() => { setOpen(true); setNotification(false); }}
          className="para-btn"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D97706, #F59E0B)',
            boxShadow: '0 4px 20px rgba(217,119,6,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s',
            animation: notification ? 'para-bounce 1s ease-in-out infinite' : 'none',
          }}
          title="Ask PARA, your AI assistant"
        >
          <svg width="30" height="30" viewBox="0 0 80 80" fill="none">
            <rect x="18" y="10" width="44" height="32" rx="10" fill="#0E0F11" stroke="#fff" strokeWidth="1.5"/>
            <rect x="24" y="18" width="12" height="10" rx="3" fill="#fff"/>
            <rect x="44" y="18" width="12" height="10" rx="3" fill="#fff"/>
            <rect x="28" y="32" width="24" height="4" rx="2" fill="#fff" opacity="0.6"/>
            <line x1="40" y1="10" x2="40" y2="4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="40" cy="3" r="2.5" fill="#fff"/>
          </svg>
          {notification && (
            <div style={{
              position: 'absolute', top: -4, right: -4,
              width: 18, height: 18, borderRadius: '50%',
              background: '#EF4444', border: '2px solid #0E0F11',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#fff', fontWeight: 700,
            }}>!</div>
          )}
        </div>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 360, borderRadius: 20,
          background: '#111214',
          border: '1px solid rgba(217,119,6,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(217,119,6,0.1)',
          display: 'flex', flexDirection: 'column',
          maxHeight: minimised ? 60 : 540,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          animation: 'para-pop 0.25s ease',
          fontFamily: "'DM Sans', sans-serif",
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: 'linear-gradient(90deg, rgba(217,119,6,0.12), transparent)',
            borderBottom: '1px solid rgba(217,119,6,0.15)',
            flexShrink: 0,
          }}>
            <RobotAvatar size={36} pulse={loading} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#F5F0E8', letterSpacing: '0.01em' }}>PARA</div>
              <div style={{ fontSize: 11, color: loading ? '#F59E0B' : '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: loading ? '#F59E0B' : '#10B981', animation: loading ? 'para-pulse 1s infinite' : 'none' }}/>
                {loading ? 'Thinking…' : 'Online'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => setMuted(!muted)} title={muted ? 'Unmute' : 'Mute'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
                {muted ? <VolumeX size={15}/> : <Volume2 size={15}/>}
              </button>
              <button onClick={resetBot} title="Reset PARA" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
                <RotateCcw size={14}/>
              </button>
              <button onClick={() => setMinimised(!minimised)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
                <ChevronDown size={16} style={{ transform: minimised ? 'rotate(180deg)' : 'none', transition: '0.2s' }}/>
              </button>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
                <X size={16}/>
              </button>
            </div>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div
                ref={scrollRef}
                style={{
                  flex: 1, overflowY: 'auto', padding: '16px 12px 8px',
                  display: 'flex', flexDirection: 'column',
                  scrollBehavior: 'smooth',
                }}
              >
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#4B5563', fontSize: 13, marginTop: 20 }}>
                    <RobotAvatar size={48} pulse/>
                    <p style={{ marginTop: 12, color: '#9CA3AF' }}>PARA is starting up…</p>
                  </div>
                )}
                {messages.map(renderMessage)}
                {loading && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 8 }}>
                    <RobotAvatar size={30}/>
                    <div style={{ background: 'rgba(30,31,35,0.95)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: '16px 16px 16px 4px' }}>
                      <Typing/>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick options (health questions) */}
              {renderQuickOptions()}
              {renderDisclaimerCTA()}

              {/* Input */}
              {(stage === 'idle' || stage === 'report') && (
                <div style={{
                  display: 'flex', gap: 8, padding: '10px 12px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(14,15,17,0.8)',
                  flexShrink: 0,
                }}>
                  <input
                    ref={inputRef}
                    className="para-msg-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask PARA anything…"
                    disabled={loading}
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, padding: '9px 13px',
                      color: '#E5E7EB', fontSize: 13,
                      transition: 'border-color 0.2s',
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: input.trim() ? '#D97706' : 'rgba(255,255,255,0.06)',
                      border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                      color: input.trim() ? '#0E0F11' : '#4B5563',
                    }}
                  >
                    <Send size={16}/>
                  </button>
                </div>
              )}

              {/* Disclaimer footer */}
              <div style={{ padding: '6px 12px 10px', fontSize: 10, color: '#4B5563', textAlign: 'center', flexShrink: 0 }}>
                ⚠️ PARA is an AI assistant — not a medical professional. Always consult a GP.
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
