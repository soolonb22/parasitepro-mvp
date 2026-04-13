// @ts-nocheck
/**
 * ChatPage.tsx — Standalone PARA Chat Page
 * Route: /chat
 * 
 * A dedicated full-page chat interface for PARA.
 * Uses the existing POST /api/chatbot/message endpoint.
 * Guest-accessible (guests just can't save conversation history).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../api';
import axios from 'axios';
import {
  Send, RotateCcw, Copy, Check, ThumbsUp, ThumbsDown,
  Bookmark, BookmarkCheck, MessageCircle, ChevronRight,
  AlertTriangle, Loader2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Msg {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  timestamp: Date;
  feedback?: 'up' | 'down' | null;
  saved?: boolean;
}

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { emoji: '👶', text: 'What are the signs of pinworm in children?' },
  { emoji: '🔬', text: 'I found white thread-like things in my stool — what could it be?' },
  { emoji: '🩹', text: 'I have a red circular rash after bushwalking. Should I worry?' },
  { emoji: '✈️', text: "I've been to Bali and now have stomach cramps. Could it be a parasite?" },
  { emoji: '🐕', text: 'My dog has worms — could my family catch them too?' },
  { emoji: '🌧️', text: 'What parasites are common in Queensland during wet season?' },
];

// ─── Markdown to plain HTML (simple, no dependency needed) ───────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:2px 5px;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/^### (.+)$/gm, '<p style="font-weight:700;color:#0f766e;margin:12px 0 4px;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em">$1</p>')
    .replace(/^## (.+)$/gm, '<p style="font-weight:700;color:#134e4a;margin:12px 0 4px">$1</p>')
    .replace(/^- (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:18px;margin:6px 0">$&</ul>')
    .replace(/\n{2,}/g, '</p><p style="margin:0 0 8px">')
    .replace(/\n/g, '<br/>');
}

// ─── Component ────────────────────────────────────────────────────────────────

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, isAuthenticated } = useAuthStore();

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: 'assistant',
      content: `G'day${user?.firstName ? `, ${user.firstName}` : ''}! I'm **PARA** — your personal parasite education guide.\n\nI can help you understand symptoms, learn about parasites common in Australia, and prepare questions for your GP. What's on your mind?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);

  // Health context from session storage (set by ParasiteBot intake)
  const healthContext = (() => {
    try { return JSON.parse(sessionStorage.getItem('paraHealthContext') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 130)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async (content: string) => {
    const text = content.trim();
    if (!text || loading) return;

    const userMsg: Msg = { id: nextId.current++, role: 'user', content: text, timestamp: new Date() };
    const assistantId = nextId.current++;
    const assistantPlaceholder: Msg = { id: assistantId, role: 'assistant', content: '', timestamp: new Date() };

    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setInput('');
    setLoading(true);

    // Build conversation history (exclude welcome message)
    const history = messages
      .slice(1)
      .concat(userMsg)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const apiBase = getApiUrl().replace('/api', '');
      const { data } = await axios.post(
        `${apiBase}/api/chatbot/message`,
        {
          message: text,
          conversationHistory: history,
          currentPage: '/chat',
          triggerType: 'USER_MESSAGE',
          userState: {
            credits: user?.imageCredits ?? 0,
            firstName: user?.firstName || 'there',
            isFirstVisit: false,
          },
          healthContext,
        },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: data.message || 'Something went wrong — please try again.', suggestions: data.suggestions }
            : m
        )
      );
    } catch (err: any) {
      const errMsg = err?.response?.status === 401
        ? "I need you to be signed in to chat. [Sign in →](/login)"
        : "I'm having a moment — please try again in a second.";
      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, content: errMsg } : m)
      );
    } finally {
      setLoading(false);
    }
  }, [messages, loading, accessToken, user, healthContext]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleCopy = async (id: number, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: number, value: 'up' | 'down') => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, feedback: m.feedback === value ? null : value } : m));
  };

  const handleSave = (id: number) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, saved: !m.saved } : m));
    // TODO: POST /api/conversations to persist when auth is wired
  };

  const handleReset = () => {
    setMessages([{
      id: 0, role: 'assistant',
      content: `G'day${user?.firstName ? `, ${user.firstName}` : ''}! I'm **PARA**. What would you like to know?`,
      timestamp: new Date(),
    }]);
    nextId.current = 1;
  };

  const showPrompts = messages.length === 1 && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', background: '#f8fafc' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* PARA avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(13,148,136,0.3)', flexShrink: 0,
            fontSize: '1.1rem',
          }}>🦠</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>PARA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#0d9488' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              AI Educational Assistant · notworms.com
            </div>
          </div>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, background: '#d1fae5',
            color: '#065f46', padding: '2px 8px', borderRadius: 20, border: '1px solid #a7f3d0',
          }}>Free</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleReset}
            title="New chat"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 8, color: '#94a3b8' }}
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => navigate('/upload')}
            style={{
              display: 'none', // show on sm+
              padding: '6px 14px', borderRadius: 10, fontSize: '0.75rem',
              fontWeight: 600, background: '#0d9488', color: 'white',
              border: 'none', cursor: 'pointer',
            }}
            className="sm-show"
          >
            AI Analyser →
          </button>
        </div>
      </div>

      {/* ── Disclaimer bar ─────────────────────────────────────────────────── */}
      <div style={{
        background: '#fffbeb', borderBottom: '1px solid #fde68a',
        padding: '0.5rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
      }}>
        <AlertTriangle size={13} color="#d97706" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.7rem', color: '#92400e', margin: 0 }}>
          <strong>Educational use only.</strong> PARA provides general information to help you prepare for a GP visit — not medical advice or diagnosis.
        </p>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1rem 0.5rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Suggested prompts */}
          {showPrompts && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '0.75rem' }}>
                Quick questions to try
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p.text)}
                    style={{
                      textAlign: 'left', background: 'white', border: '1px solid #e2e8f0',
                      borderRadius: 12, padding: '0.625rem 0.875rem', cursor: 'pointer',
                      fontSize: '0.75rem', color: '#475569', lineHeight: 1.4,
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.background = '#f0fdfa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                  >
                    <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{p.emoji}</span>
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isLast = idx === messages.length - 1;
            const isStreaming = isLast && !isUser && loading && msg.id !== 0;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                }}
              >
                {/* PARA avatar */}
                {!isUser && (
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', boxShadow: '0 1px 4px rgba(13,148,136,0.25)',
                  }}>🦠</div>
                )}

                <div style={{ maxWidth: '82%' }}>
                  {/* Bubble */}
                  <div style={{
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '0.75rem 1rem',
                    background: isUser ? '#0d9488' : 'white',
                    color: isUser ? 'white' : '#1e293b',
                    border: isUser ? 'none' : '1px solid #e2e8f0',
                    boxShadow: isUser ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                  }}>
                    {isUser ? (
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    ) : msg.content === '' && loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                        <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: '0.8rem' }}>PARA is thinking…</span>
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                        style={{ margin: 0 }}
                      />
                    )}
                  </div>

                  {/* Post-response actions — only for completed assistant messages */}
                  {!isUser && msg.content && !isStreaming && (
                    <div>
                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copy"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 8px', borderRadius: 8, border: '1px solid #e2e8f0',
                            background: 'white', cursor: 'pointer', fontSize: '0.7rem', color: '#64748b',
                          }}
                        >
                          {copiedId === msg.id
                            ? <><Check size={11} color="#0d9488" /><span style={{ color: '#0d9488' }}>Copied</span></>
                            : <><Copy size={11} />Copy</>}
                        </button>

                        {/* Save */}
                        {isAuthenticated && (
                          <button
                            onClick={() => handleSave(msg.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              padding: '3px 8px', borderRadius: 8, border: '1px solid #e2e8f0',
                              background: msg.saved ? '#f0fdfa' : 'white',
                              color: msg.saved ? '#0d9488' : '#64748b',
                              borderColor: msg.saved ? '#99f6e4' : '#e2e8f0',
                              cursor: 'pointer', fontSize: '0.7rem',
                            }}
                          >
                            {msg.saved
                              ? <><BookmarkCheck size={11} />Saved</>
                              : <><Bookmark size={11} />Save chat</>}
                          </button>
                        )}

                        {/* Thumbs */}
                        {[
                          { val: 'up' as const, icon: <ThumbsUp size={11} />, label: 'Helpful' },
                          { val: 'down' as const, icon: <ThumbsDown size={11} />, label: 'Not helpful' },
                        ].map(({ val, icon }) => (
                          <button
                            key={val}
                            onClick={() => handleFeedback(msg.id, val)}
                            style={{
                              padding: '3px 7px', borderRadius: 8, border: '1px solid',
                              borderColor: msg.feedback === val ? (val === 'up' ? '#86efac' : '#fca5a5') : 'transparent',
                              background: msg.feedback === val ? (val === 'up' ? '#f0fdf4' : '#fef2f2') : 'transparent',
                              color: msg.feedback === val ? (val === 'up' ? '#16a34a' : '#dc2626') : '#94a3b8',
                              cursor: 'pointer',
                            }}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>

                      {/* Follow-up suggestions */}
                      {isLast && msg.suggestions && msg.suggestions.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                            Ask a follow-up
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {msg.suggestions.slice(0, 3).map((s, i) => (
                              <button
                                key={i}
                                onClick={() => sendMessage(s)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  padding: '5px 10px', borderRadius: 10,
                                  background: '#f0fdfa', border: '1px solid #99f6e4',
                                  color: '#0f766e', fontSize: '0.72rem', fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {s}
                                <ChevronRight size={11} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} style={{ height: 8 }} />
        </div>
      </div>

      {/* ── Input area ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderTop: '1px solid #e2e8f0',
        padding: '0.75rem 1.25rem', flexShrink: 0,
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{
            flex: 1, background: '#f8fafc', borderRadius: 16,
            border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'flex-end',
            padding: '0.5rem 0.75rem', transition: 'border-color 0.2s',
          }}
            onFocusCapture={(e) => e.currentTarget.style.borderColor = '#0d9488'}
            onBlurCapture={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask PARA about symptoms, parasites, or when to see a GP…"
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', background: 'none', border: 'none',
                outline: 'none', fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.55,
                minHeight: 24, maxHeight: 130, overflowY: 'auto',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: loading || !input.trim() ? '#cbd5e1' : '#0d9488',
              border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            {loading
              ? <Loader2 size={16} color="white" style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={16} color="white" />}
          </button>
        </div>

        <p style={{ fontSize: '0.65rem', textAlign: 'center', color: '#94a3b8', marginTop: '0.4rem' }}>
          Enter to send · Shift+Enter for new line · Educational info only · Always consult a GP
        </p>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ChatPage;
