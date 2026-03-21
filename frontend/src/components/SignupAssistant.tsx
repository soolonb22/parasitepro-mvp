// @ts-nocheck
/**
 * SignupAssistant.tsx
 * Full AI chat widget — signup page only.
 * Mirrors ParaDox exactly: depth selector, suggestion chips,
 * markdown rendering, auto-open. Uses teal robot SVG.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, RotateCcw, BookOpen, Zap, Microscope, AlignLeft } from 'lucide-react';
import { getApiUrl } from '../api';

type Mood   = 'idle' | 'thinking' | 'talking' | 'happy' | 'surprised' | 'waving' | 'concerned' | 'curious';
type Depth  = 'simple' | 'medium' | 'deep' | 'visual';
type Phase  = 'launcher' | 'chat';
type Msg    = { role: 'user' | 'assistant'; content: string; id: number; suggestions?: string[] };

/* ── CSS animations ─────────────────────────────────────────── */
const INJECT_CSS = `
@keyframes sa-fadein   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes sa-bouncein { 0%{opacity:0;transform:scale(0.7)} 60%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
@keyframes sa-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes sa-dots     { 0%,80%,100%{opacity:0} 40%{opacity:1} }
@keyframes sa-bob      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
`;

/* ── Teal Robot SVG ─────────────────────────────────────────── */
function Robot({ mood, size = 1 }: { mood: Mood; size?: number }) {
  const [blink, setBlink]   = useState(false);
  const [mouth, setMouth]   = useState(0);
  const [antGlow, setAnt]   = useState(false);
  const [armOff, setArm]    = useState(0);
  const speaking = mood === 'talking';

  useEffect(() => {
    const next = () => { const t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 110); next(); }, 2800 + Math.random()*2200); return t; };
    const t = next(); return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!speaking) { setMouth(0); return; }
    const t = setInterval(() => setMouth(p => (p+1)%5), 130); return () => clearInterval(t);
  }, [speaking]);
  useEffect(() => {
    const t = setInterval(() => setAnt(v => !v), 900 + Math.random()*300); return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (mood==='waving'||mood==='happy') {
      let dir=1; const t=setInterval(()=>{setArm(p=>p+dir*4);dir*=-1;},350); return()=>clearInterval(t);
    }
    setArm(0);
  }, [mood]);

  const eyeH  = blink?2 : mood==='surprised'?16 : mood==='happy'?10 : mood==='curious'?13 : 12;
  const eyeY  = mood==='curious'?33:34;
  const eyeC  = mood==='concerned'?'#f87171':mood==='happy'?'#34d399':mood==='thinking'?'#c4b5fd':mood==='curious'?'#67e8f9':'#0d9488';
  const ledC  = mood==='thinking'?'#c4b5fd':mood==='happy'?'#34d399':mood==='concerned'?'#f87171':mood==='curious'?'#67e8f9':'#0d9488';
  const headBg= mood==='concerned'?'#1e3050':mood==='happy'?'#0d2820':mood==='thinking'?'#1e1b40':'#0f2335';
  const mouths= ['M 41 108 Q 50 114 59 108','M 41 107 Q 50 116 59 107','M 40 107 Q 50 119 60 107','M 41 108 Q 50 114 59 108','M 42 109 Q 50 113 58 109'];
  const mp    = speaking?mouths[mouth]:(mood==='concerned'?'M 42 111 Q 50 107 58 111':'M 41 108 Q 50 114 59 108');
  const armRot= (mood==='waving'||mood==='happy')?-22+armOff:0;
  const showCheeks = mood==='happy'||mood==='waving'||mood==='talking'||speaking;

  return (
    <svg width={100*size} height={162*size} viewBox="0 0 100 162"
      style={{overflow:'visible',filter:`drop-shadow(0 0 ${speaking?16:8}px ${eyeC}70)`,transition:'filter 0.3s',animation:'sa-bob 3s ease-in-out infinite'}}>
      <line x1="50" y1="9" x2="50" y2="22" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <circle cx="50" cy="6" r="6" fill={antGlow?ledC:'#0a1f2e'} stroke={antGlow?ledC:'rgba(13,148,136,0.3)'} strokeWidth="1.5" style={{filter:antGlow?`drop-shadow(0 0 10px ${ledC})`:'none',transition:'fill 0.4s,filter 0.4s'}}/>
      {antGlow&&<circle cx="50" cy="6" r="3" fill="white" opacity="0.6"/>}
      <rect x="20" y="20" width="60" height="56" rx="20" fill={headBg} stroke="rgba(13,148,136,0.4)" strokeWidth="1.5" style={{transition:'fill 0.4s',filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'}}/>
      <ellipse cx="38" cy="26" rx="14" ry="6" fill="white" opacity="0.04"/>
      <rect x="11" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
      <circle cx="16" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{filter:`drop-shadow(0 0 6px ${ledC})`,transition:'fill 0.4s'}}/>
      <rect x="79" y="32" width="10" height="24" rx="6" fill="#0a1f2e" stroke="rgba(13,148,136,0.3)" strokeWidth="1"/>
      <circle cx="84" cy="44" r="3.5" fill={ledC} opacity="0.85" style={{filter:`drop-shadow(0 0 6px ${ledC})`,transition:'fill 0.4s'}}/>
      <rect x="28" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC} style={{filter:`drop-shadow(0 0 10px ${eyeC})`,transition:'height 0.08s,fill 0.3s'}}/>
      <rect x="54" y={eyeY} width="18" height={eyeH} rx="5" fill={eyeC} style={{filter:`drop-shadow(0 0 10px ${eyeC})`,transition:'height 0.08s,fill 0.3s'}}/>
      {!blink&&eyeH>3&&<><circle cx="34" cy={eyeY+2.5} r="3" fill="white" opacity="0.8"/><circle cx="60" cy={eyeY+2.5} r="3" fill="white" opacity="0.8"/><circle cx="35.5" cy={eyeY+1.5} r="1.2" fill="white" opacity="0.6"/><circle cx="61.5" cy={eyeY+1.5} r="1.2" fill="white" opacity="0.6"/></>}
      {mood==='thinking'&&[0,1,2].map((k,i)=><circle key={k} cx={35+i*15} cy="57" r="4" fill="#c4b5fd" opacity={0.2+0.8*((mouth+i)%3===0?1:0)} style={{transition:'opacity 0.18s'}}/>)}
      {mood==='curious'&&<path d="M 28 30 Q 37 26 46 30" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>}
      <path d={mp} fill="none" stroke={speaking?eyeC:'rgba(13,148,136,0.6)'} strokeWidth={speaking?3.5:2.5} strokeLinecap="round" style={{filter:speaking?`drop-shadow(0 0 8px ${eyeC})`:'none',transition:'stroke 0.2s'}}/>
      <ellipse cx="27" cy="58" rx="6" ry="4" fill="#f472b6" opacity={showCheeks?0.35:0.12} style={{transition:'opacity 0.4s'}}/>
      <ellipse cx="73" cy="58" rx="6" ry="4" fill="#f472b6" opacity={showCheeks?0.35:0.12} style={{transition:'opacity 0.4s'}}/>
      <rect x="24" y="80" width="52" height="46" rx="14" fill="#0a1f2e" stroke="rgba(13,148,136,0.35)" strokeWidth="1.5"/>
      <rect x="30" y="85" width="40" height="3" rx="1.5" fill="white" opacity="0.04"/>
      {[0,1,2].map(i=><circle key={i} cx={34+i*16} cy="96" r="5.5" fill={i===mouth%3?ledC:'#0f2335'} style={{filter:i===mouth%3?`drop-shadow(0 0 7px ${ledC})`:'none',transition:'fill 0.14s'}}/>)}
      <rect x="30" y="107" width="40" height="13" rx="6" fill="#0f2335" stroke="rgba(13,148,136,0.2)" strokeWidth="1"/>
      <path d="M 39 110 Q 50 115 61 110" fill="none" stroke={ledC} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <g style={{transformOrigin:'16px 82px',transform:`rotate(${armRot}deg)`,transition:'transform 0.32s ease-in-out'}}>
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
  );
}

/* ── Markdown renderer ──────────────────────────────────────── */
function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p,i) => p.startsWith('**')&&p.endsWith('**') ? <strong key={i} style={{color:'#2dd4bf'}}>{p.slice(2,-2)}</strong> : <span key={i}>{p}</span>)}</>;
}
function MarkdownText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { out.push(<br key={i}/>); i++; continue; }
    const isBullet = /^[-•*]\s/.test(line.trim());
    const isNum    = /^\d+\.\s/.test(line.trim());
    if (isBullet || isNum) {
      const items: string[] = [];
      while (i < lines.length && (/^[-•*]\s/.test(lines[i].trim()) || /^\d+\.\s/.test(lines[i].trim()))) {
        items.push(lines[i].replace(/^[-•*\d.]\s+/,'').trim()); i++;
      }
      const Tag = isNum ? 'ol' : 'ul';
      out.push(<Tag key={i} style={{margin:'4px 0 4px 16px',padding:0,lineHeight:1.6}}>{items.map((item,idx)=><li key={idx} style={{marginBottom:2}}><InlineMd text={item}/></li>)}</Tag>);
    } else {
      out.push(<p key={i} style={{margin:'4px 0',lineHeight:1.6}}><InlineMd text={line}/></p>); i++;
    }
  }
  return <>{out}</>;
}

/* ── Depth options ──────────────────────────────────────────── */
const DEPTHS: { key: Depth; label: string; icon: any; desc: string }[] = [
  { key:'simple', label:'Simple',    icon:AlignLeft,  desc:'Quick version'  },
  { key:'medium', label:'Medium',    icon:BookOpen,   desc:'Full story'     },
  { key:'deep',   label:'Deep Dive', icon:Microscope, desc:'Nerdy version'  },
  { key:'visual', label:'Visual',    icon:Zap,        desc:'Diagram + notes'},
];

/* ── Main component ─────────────────────────────────────────── */
export default function SignupAssistant() {
  const [phase,    setPhase]    = useState<Phase>('launcher');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [mood,     setMood]     = useState<Mood>('waving');
  const [depth,    setDepth]    = useState<Depth>('simple');
  const [msgId,    setMsgId]    = useState(0);
  const [error,    setError]    = useState('');
  const [cssInjected, setCssInjected] = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inject CSS once
  useEffect(() => {
    if (cssInjected) return;
    const s = document.createElement('style');
    s.textContent = INJECT_CSS;
    document.head.appendChild(s);
    setCssInjected(true);
  }, [cssInjected]);

  // Auto-open after 2.5s
  useEffect(() => {
    const t = setTimeout(() => openChat(), 2500);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const openChat = useCallback(() => {
    setPhase('chat');
    if (messages.length === 0) {
      setMood('waving');
      setMessages([{
        role: 'assistant', id: 0,
        content: `G'day! I'm **PARA** — your ParasitePro AI guide. 🤖\n\nI can answer any questions about parasites, gut symptoms, what the app does, or help you get ready for your first report. I'm for education only — not medical advice.\n\nWhat would you like to know?`,
        suggestions: ["What does ParasitePro do?", "How does the AI analysis work?", "Tell me about common Australian parasites"],
      }]);
      setTimeout(() => setMood('idle'), 2000);
    }
  }, [messages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');
    setError('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: Msg = { role: 'user', content, id: msgId + 1 };
    setMsgId(p => p + 2);
    setMessages(p => [...p, userMsg]);
    setLoading(true);
    setMood('thinking');

    const history = messages.filter(m => m.id !== 0).map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${getApiUrl()}/api/paradox/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, depth, conversationHistory: history }),
      });
      if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || `HTTP ${res.status}`); }
      const data = await res.json();
      setMood('talking');
      setMessages(p => [...p, { role: 'assistant', content: data.message || '', id: msgId + 2, suggestions: data.suggestions }]);
      setTimeout(() => setMood('idle'), 1500);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again!');
      setMood('concerned');
      setTimeout(() => setMood('idle'), 2000);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, depth, msgId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]);
    setMsgId(0);
    setMood('waving');
    setMessages([{
      role: 'assistant', id: 0,
      content: `Fresh start! What do you want to explore?\n\n**PARA** is ready to help.`,
      suggestions: ["What are common Australian parasites?", "How does the AI report work?", "Is ParasitePro safe to use?"],
    }]);
    setTimeout(() => setMood('idle'), 2000);
  };

  const panelWidth = 'min(420px, calc(100vw - 24px))';

  // ── Launcher button ───────────────────────────────────────────
  if (phase === 'launcher') {
    return (
      <button onClick={openChat} aria-label="Open PARA assistant"
        style={{
          position:'fixed', bottom:24, right:24,
          width:68, height:68, borderRadius:'50%',
          background:'linear-gradient(135deg,#0d9488,#0891b2)',
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 24px rgba(13,148,136,0.55)',
          zIndex:1000, animation:'sa-float 3s ease-in-out infinite',
          transition:'transform 0.15s ease',
        }}
        onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.1)')}
        onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}
      >
        <Robot mood={mood} size={0.38}/>
        <span style={{
          position:'absolute', top:-2, right:-2,
          width:18, height:18, borderRadius:'50%',
          background:'#10B981', border:'2px solid #0E0F11',
          fontSize:9, color:'white',
          display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700,
        }}>!</span>
      </button>
    );
  }

  // ── Chat panel ────────────────────────────────────────────────
  return (
    <>
      {/* Minimise button */}
      <button onClick={()=>setPhase('launcher')} aria-label="Minimise PARA"
        style={{
          position:'fixed', bottom:24, right:24,
          width:52, height:52, borderRadius:'50%',
          background:'#0f172a', border:'1.5px solid #0d9488',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1001, color:'#0d9488',
        }}
      >
        <X size={20}/>
      </button>

      {/* Chat window */}
      <div role="dialog" aria-label="PARA assistant"
        style={{
          position:'fixed', bottom:88, right:24,
          width:panelWidth,
          height:'min(640px, calc(100vh - 120px))',
          background:'#0E0F11',
          border:'1px solid rgba(13,148,136,0.2)',
          borderRadius:16,
          display:'flex', flexDirection:'column',
          overflow:'hidden', zIndex:1000,
          animation:'sa-bouncein 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(13,148,136,0.1)',
        }}
      >
        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg,#0f172a 0%,#0E0F11 100%)',
          borderBottom:'1px solid rgba(13,148,136,0.2)',
          padding:'12px 16px',
          display:'flex', alignItems:'center', gap:12, flexShrink:0,
        }}>
          <div style={{position:'relative'}}>
            <Robot mood={mood} size={0.3}/>
            <span style={{
              position:'absolute', bottom:0, right:0,
              width:10, height:10, borderRadius:'50%',
              background:'#10B981', border:'2px solid #0E0F11',
            }}/>
          </div>
          <div style={{flex:1}}>
            <p style={{margin:0, fontWeight:700, fontSize:15, color:'#2dd4bf', letterSpacing:0.3}}>PARA</p>
            <p style={{margin:0, fontSize:11, color:'#475569'}}>
              {loading ? '✦ Thinking...' : '✦ ParasitePro AI Guide'}
            </p>
          </div>
          <button onClick={clearChat} title="New conversation"
            style={{background:'none',border:'none',cursor:'pointer',color:'#475569',padding:4,borderRadius:6,display:'flex',alignItems:'center'}}
          >
            <RotateCcw size={15}/>
          </button>
        </div>

        {/* Depth selector */}
        <div style={{
          background:'#0a0f1a', borderBottom:'1px solid rgba(13,148,136,0.1)',
          padding:'8px 12px', display:'flex', gap:6, flexShrink:0, overflowX:'auto',
        }}>
          {DEPTHS.map(({key,label,icon:Icon,desc})=>(
            <button key={key} onClick={()=>setDepth(key)} title={desc}
              style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'5px 10px', borderRadius:20,
                border: depth===key ? '1.5px solid #0d9488' : '1.5px solid rgba(13,148,136,0.2)',
                background: depth===key ? 'rgba(13,148,136,0.15)' : 'transparent',
                color: depth===key ? '#2dd4bf' : '#475569',
                fontSize:12, fontWeight: depth===key ? 600 : 400,
                cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s ease',
              }}
            >
              <Icon size={12}/>{label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          flex:1, overflowY:'auto', padding:'12px 14px',
          display:'flex', flexDirection:'column', gap:10,
          scrollbarWidth:'thin', scrollbarColor:'rgba(13,148,136,0.2) transparent',
        }}>
          {messages.map(msg=>(
            <div key={msg.id} style={{animation:'sa-fadein 0.25s ease'}}>
              {msg.role==='user' ? (
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                  <div style={{
                    background:'linear-gradient(135deg,#0d9488,#0891b2)',
                    color:'white', borderRadius:'14px 14px 2px 14px',
                    padding:'9px 13px', maxWidth:'82%', fontSize:13.5, lineHeight:1.55,
                  }}>{msg.content}</div>
                </div>
              ) : (
                <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                  <div style={{flexShrink:0,marginTop:2}}>
                    <Robot mood="idle" size={0.18}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{
                      background:'#1a2332', border:'1px solid rgba(13,148,136,0.15)',
                      borderRadius:'2px 14px 14px 14px',
                      padding:'9px 13px', fontSize:13.5, lineHeight:1.6, color:'#e0f2fe',
                    }}>
                      <MarkdownText text={msg.content}/>
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:7,paddingLeft:2}}>
                        {msg.suggestions.filter(Boolean).map((s,i)=>(
                          <button key={i} onClick={()=>sendMessage(s)} disabled={loading}
                            style={{
                              background:'rgba(13,148,136,0.08)',
                              border:'1px solid rgba(13,148,136,0.3)',
                              borderRadius:20, padding:'4px 10px',
                              color:'#2dd4bf', fontSize:12,
                              cursor:loading?'default':'pointer',
                              opacity:loading?0.5:1, transition:'all 0.15s ease',
                            }}
                            onMouseEnter={e=>{ if(!loading) e.currentTarget.style.background='rgba(13,148,136,0.2)'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(13,148,136,0.08)'; }}
                          >{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing dots */}
          {loading && (
            <div style={{display:'flex',gap:8,alignItems:'flex-start',animation:'sa-fadein 0.2s ease'}}>
              <Robot mood="thinking" size={0.18}/>
              <div style={{background:'#1a2332',border:'1px solid rgba(13,148,136,0.15)',borderRadius:'2px 14px 14px 14px',padding:'10px 14px',display:'flex',gap:5,alignItems:'center'}}>
                {[0,0.2,0.4].map((delay,i)=>(
                  <span key={i} style={{width:6,height:6,borderRadius:'50%',background:'#0d9488',animation:`sa-dots 1.2s ${delay}s ease-in-out infinite`}}/>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'8px 12px',color:'#fca5a5',fontSize:13}}>
              ⚠️ {error}
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Disclaimer */}
        <div style={{background:'#080c14',borderTop:'1px solid rgba(13,148,136,0.1)',padding:'5px 14px',flexShrink:0}}>
          <p style={{margin:0,fontSize:10,color:'#334155',textAlign:'center'}}>
            📚 Educational only — not medical advice. For health concerns, consult a GP.
          </p>
        </div>

        {/* Input */}
        <div style={{background:'#0a0f1a',borderTop:'1px solid rgba(13,148,136,0.1)',padding:'10px 12px',display:'flex',gap:8,alignItems:'flex-end',flexShrink:0}}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask PARA anything about parasites…"
            rows={1}
            disabled={loading}
            style={{
              flex:1, background:'#1a2332',
              border:'1.5px solid rgba(13,148,136,0.2)',
              borderRadius:12, padding:'9px 12px',
              color:'#e0f2fe', fontSize:13.5, resize:'none',
              outline:'none', fontFamily:'inherit', lineHeight:1.5,
              maxHeight:120, scrollbarWidth:'none', transition:'border-color 0.15s ease',
            }}
            onFocus={e=>(e.target.style.borderColor='#0d9488')}
            onBlur={e=>(e.target.style.borderColor='rgba(13,148,136,0.2)')}
          />
          <button
            onClick={()=>sendMessage()}
            disabled={loading||!input.trim()}
            style={{
              width:38, height:38, borderRadius:10,
              background: loading||!input.trim() ? 'rgba(13,148,136,0.1)' : 'linear-gradient(135deg,#0d9488,#0891b2)',
              border:'none',
              cursor: loading||!input.trim() ? 'default' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              color: loading||!input.trim() ? '#334155' : 'white',
              transition:'all 0.15s ease', flexShrink:0,
            }}
          >
            <Send size={16}/>
          </button>
        </div>
      </div>
    </>
  );
}
