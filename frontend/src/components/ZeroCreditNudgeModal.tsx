// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const _BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

const BUNDLES = [
  { id: 'bundle_5',  credits: 5,  price: '$19.99', ppc: '$4.00 / analysis' },
  { id: 'bundle_10', credits: 10, price: '$34.99', ppc: '$3.50 / analysis', popular: true },
  { id: 'bundle_25', credits: 25, price: '$74.99', ppc: '$3.00 / analysis' },
];

const COPY = {
  results: {
    hook: "Your report's ready. Your credits aren't.",
    sub: "That analysis just showed you what's worth investigating. Don't stop now — check the rest of the family.",
    proofLabel: 'Analysis just completed',
    proofSub:   'Your educational report is ready to review',
  },
  upload: {
    hook: "You're out of credits.",
    sub: "You came back — that means the first report was worth it. Top up and keep going.",
    proofLabel: 'Previous analysis on file',
    proofSub:   'Your report history is saved and waiting',
  },
};

const ParaAvatar = () => (
  <div style={{
    width:52,height:52,borderRadius:'50%',
    background:'linear-gradient(135deg,#00BFA5,#008B7A)',
    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
    boxShadow:'0 0 0 3px #fff,0 0 0 5px rgba(0,191,165,.4)',
  }}>
    <svg width="28" height="28" viewBox="0 0 100 122" fill="none">
      <ellipse cx="50" cy="118" rx="22" ry="3.5" fill="rgba(0,0,0,.1)"/>
      <path d="M22 64 Q10 68 8 79" stroke="#00BFA5" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <circle cx="8" cy="81" r="7" fill="#00BFA5"/>
      <path d="M19 42 C14 54 12 72 16 88 C20 102 34 114 50 114 C66 114 80 102 84 88 C88 72 86 54 81 42 C77 32 65 27 50 27 C35 27 23 32 19 42Z" fill="#00BFA5"/>
      <ellipse cx="40" cy="113" rx="11" ry="4.5" fill="#00A896"/>
      <ellipse cx="60" cy="113" rx="11" ry="4.5" fill="#00A896"/>
      <path d="M78 58 Q90 44 88 32" stroke="#00BFA5" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <circle cx="87" cy="30" r="7" fill="#00BFA5"/>
      <ellipse cx="50" cy="29" rx="38" ry="7" fill="#3D5A20"/>
      <path d="M15 29 C15 29 17 6 50 6 C83 6 85 29 85 29Z" fill="#4D7228"/>
      <path d="M15 29 Q50 37 85 29" stroke="#293F10" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <ellipse cx="37" cy="59" rx="7.5" ry="8" fill="white"/>
      <circle cx="38.5" cy="60" r="5.2" fill="#0D2218"/>
      <circle cx="40" cy="57.5" r="2.2" fill="white"/>
      <ellipse cx="63" cy="59" rx="7.5" ry="8" fill="white"/>
      <circle cx="64.5" cy="60" r="5.2" fill="#0D2218"/>
      <circle cx="66" cy="57.5" r="2.2" fill="white"/>
      <ellipse cx="26" cy="67" rx="6" ry="3.8" fill="rgba(0,160,148,.48)"/>
      <ellipse cx="74" cy="67" rx="6" ry="3.8" fill="rgba(0,160,148,.48)"/>
      <path d="M40 74 Q50 86 60 74" fill="#C45050" stroke="#0D2218" strokeWidth="1"/>
      <path d="M42 76 Q50 84 58 76 L56 78 Q50 83 44 78Z" fill="white"/>
    </svg>
  </div>
);

const ZeroCreditNudgeModal = ({ isOpen, onClose, context = 'results', accessToken = '' }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('bundle_10');
  const [loading, setLoading]   = useState(false);
  const copy = COPY[context] || COPY.results;
  const selectedBundle = BUNDLES.find(b => b.id === selected);

  useEffect(() => {
    if (isOpen) { setSelected('bundle_10'); setLoading(false); document.body.style.overflow = 'hidden'; }
    else         { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/payment/create-checkout-session`,
        { type: selected, couponCode: '' },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      window.location.href = res.data.sessionUrl;
    } catch {
      setLoading(false);
      alert('Unable to start checkout. Please try again.');
    }
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed',inset:0,zIndex:9999,
        background:'rgba(0,0,0,.45)',
        display:'flex',alignItems:'flex-end',justifyContent:'center',
        backdropFilter:'blur(2px)',
        animation:'paraFadeIn .2s ease both',
      }}
    >
      <div style={{
        background:'#fff',borderRadius:'16px 16px 0 0',
        width:'100%',maxWidth:440,
        paddingBottom:'env(safe-area-inset-bottom,0)',
        animation:'paraSlideUp .35s cubic-bezier(.22,.68,0,1.2) both',
      }}>
        {/* Accent bar */}
        <div style={{height:4,background:'linear-gradient(90deg,#00BFA5,#A8D5BA,#D4A017)',borderRadius:'16px 16px 0 0'}}/>
        <div style={{width:36,height:4,background:'#E5E7EB',borderRadius:9999,margin:'10px auto 0'}}/>

        <div style={{padding:'14px 20px 20px'}}>
          {/* Header */}
          <div style={{display:'flex',alignItems:'flex-end',gap:12,marginBottom:10}}>
            <ParaAvatar/>
            <p style={{fontSize:15,fontWeight:800,color:'#192E19',lineHeight:1.4}}>{copy.hook}</p>
          </div>
          <p style={{fontSize:12,color:'#6B7280',lineHeight:1.6,marginBottom:13}}>{copy.sub}</p>

          {/* Proof bar */}
          <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:9,padding:'8px 12px',display:'flex',gap:9,alignItems:'center',marginBottom:13}}>
            <div style={{width:26,height:26,background:'#00BFA5',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'#166534'}}>{copy.proofLabel}</div>
              <div style={{fontSize:10,color:'#166534',opacity:.75}}>{copy.proofSub}</div>
            </div>
          </div>

          {/* Bundle cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7,marginBottom:8}}>
            {BUNDLES.map(b => (
              <div
                key={b.id}
                onClick={() => setSelected(b.id)}
                style={{
                  border:selected===b.id?'2px solid #00BFA5':'1px solid #E5E7EB',
                  borderRadius:9,padding:'10px 5px',textAlign:'center',
                  cursor:'pointer',position:'relative',
                  background:selected===b.id?'#F0FDF4':'#F9FAFB',
                  transition:'all .15s',
                }}
              >
                {b.popular && (
                  <div style={{position:'absolute',top:-9,left:'50%',transform:'translateX(-50%)',background:'#00BFA5',color:'#fff',fontSize:8.5,fontWeight:800,padding:'2px 8px',borderRadius:9999,whiteSpace:'nowrap',letterSpacing:'.04em'}}>POPULAR</div>
                )}
                <div style={{fontSize:20,fontWeight:900,color:'#192E19'}}>{b.credits}</div>
                <div style={{fontSize:12.5,fontWeight:700,color:'#00BFA5',margin:'2px 0 1px'}}>{b.price}</div>
                <div style={{fontSize:9,color:'#9CA3AF'}}>{b.ppc}</div>
              </div>
            ))}
          </div>

          {/* Buy */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            style={{
              width:'100%',padding:'12px',
              background:loading?'#6b9e8c':'#00BFA5',color:'#fff',
              border:'none',borderRadius:10,fontSize:13,fontWeight:800,
              cursor:loading?'not-allowed':'pointer',transition:'background .15s',marginBottom:7,
            }}
          >
            {loading ? 'Redirecting to checkout…' : `Get ${selectedBundle?.credits} credits — ${selectedBundle?.price}`}
          </button>
          <button
            onClick={onClose}
            style={{width:'100%',padding:'8px',background:'transparent',color:'#9CA3AF',border:'none',fontSize:12,cursor:'pointer'}}
          >
            Not right now
          </button>

          {/* Trust */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,marginTop:7}}>
            <svg width="11" height="11" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{fontSize:10,color:'#9CA3AF'}}>30-day money-back · Credits never expire · Secured by Stripe</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes paraFadeIn  { from{opacity:0}          to{opacity:1} }
        @keyframes paraSlideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
};

export default ZeroCreditNudgeModal;
