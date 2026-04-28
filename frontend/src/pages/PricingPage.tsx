// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/SEO';
import UrgencyTimer from '../components/UrgencyTimer';
import MoneyBackGuarantee from '../components/MoneyBackGuarantee';
import MobilePurchasePrompt from '../components/MobilePurchasePrompt';
import { isNativePlatform } from '../utils/mobile';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { API_URL } from '../api';
import { Check, Zap, Shield, Clock, HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Star, RefreshCw } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #C8E6D8', padding: '1rem 0' }}>
      <button onClick={() => setOpen(!open)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', background:'none', border:'none', padding:0, cursor:'pointer', textAlign:'left' }}>
        <span style={{ fontWeight:600, color:'var(--text-primary)', fontSize:'0.95rem' }}>{question}</span>
        {open ? <ChevronUp size={18} style={{ color:'var(--amber)', flexShrink:0 }} /> : <ChevronDown size={18} style={{ color:'var(--text-muted)', flexShrink:0 }} />}
      </button>
      {open && <p style={{ marginTop:'0.75rem', color:'var(--text-secondary)', fontSize:'0.9rem', lineHeight:1.6 }}>{answer}</p>}
    </div>
  );
};

const PricingPage = () => {
  const { user } = useAuth();
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [showMobilePurchase, setShowMobilePurchase] = useState(false);

  const bundles = [
    { id:'bundle_5',  name:'5 Credits',  price:'AUD $19.99', credits:5,  perCredit:'$4.00', popular:false },
    { id:'bundle_10', name:'10 Credits', price:'AUD $34.99', credits:10, perCredit:'$3.50', popular:true  },
    { id:'bundle_25', name:'25 Credits', price:'AUD $74.99', credits:25, perCredit:'$3.00', popular:false },
  ];

  const faqs = [
    { question:'How accurate is the AI analysis?', answer:'Our AI achieves 85-95% accuracy on clear images. Confidence scores are shown with every detection.' },
    { question:'Is my data secure?', answer:'Yes — 256-bit SSL encryption protects all data. Your images and health info are never shared with third parties.' },
    { question:'What if I am not satisfied?', answer:'30-day money-back guarantee. Contact us within 30 days for a full refund, no questions asked.' },
    { question:'Do unused credits expire?', answer:'No — purchased credits never expire. Use them whenever you need an analysis.' },
    { question:'Is this a medical diagnosis?', answer:'No. This tool provides educational information and preliminary screening only. Always consult a healthcare professional.' },
    { question:'How do I get beta credits?', answer:'Use promo code BETA3FREE when signing up to receive 3 free credits.' },
  ];

  const handlePurchase = async (bundleId) => {
    if (!user) { navigate('/login'); return; }
    if (isNativePlatform()) { setShowMobilePurchase(true); return; }
    setLoading(bundleId);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/payment/create-checkout-session`, { bundleId }, { headers:{ Authorization:`Bearer ${accessToken}` } });
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed — please try again.');
      setLoading('');
    }
  };

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      setCouponMessage(`Coupon "${couponInput.trim().toUpperCase()}" will be applied at checkout`);
      setCouponInput('');
      setTimeout(() => setCouponMessage(''), 5000);
    }
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'#F2F7F4',
      '--bg-base': '#F2F7F4',
      '--bg-surface': '#FFFFFF',
      '--bg-elevated': '#FFFFFF',
      '--bg-border': '#C8E6D8',
      '--text-primary': '#1A365D',
      '--text-secondary': '#334155',
      '--text-muted': '#6B7280',
      '--amber': '#0d9488',
      '--amber-bright': '#0d9488',
      '--amber-dim': '#0f766e',
      fontFamily:'"Inter","DM Sans",system-ui,sans-serif',
    }}>
      <SEO title="Pricing — ParasitePro | Credit Bundles AUD" description="AI parasite analysis credits. Pay only for what you use — credits never expire." canonical="/pricing" />
      <div style={{ maxWidth:860, margin:'0 auto', padding:'48px 24px' }}>
        <button onClick={() => navigate(user ? '/dashboard' : '/')} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, marginBottom:32, fontFamily:'var(--font-body)' }}>
          <ArrowLeft size={15} /> {user ? 'Dashboard' : 'Home'}
        </button>

        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 14px', borderRadius:20, background:'rgba(217,119,6,0.08)', border:'1px solid rgba(217,119,6,0.2)', marginBottom:12 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--amber)', letterSpacing:'0.08em' }}>CREDIT BUNDLES — AUD</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:36, color:'var(--text-primary)', margin:'0 0 12px', letterSpacing:'-0.03em' }}>Pay only for what you use</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:15, maxWidth:420, margin:'0 auto 20px' }}>Each credit = one AI parasite analysis. Credits never expire.</p>
          <UrgencyTimer label="Beta pricing ends" initialMinutes={20} />
        </div>

        <div style={{ background:'#E1F8F4', border:'1px solid #C8E6D8', borderRadius:12, padding:'16px 20px', marginBottom:32, textAlign:'center' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'#008B7A', letterSpacing:'0.06em' }}>BETA TESTER? </span>
          <span style={{ color:'var(--text-secondary)', fontSize:14 }}>Use code <code style={{ color:'var(--amber)', fontFamily:'var(--font-mono)', background:'rgba(217,119,6,0.1)', padding:'2px 6px', borderRadius:4 }}>BETA3FREE</code> at signup for 3 free credits</span>
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'12px 16px', marginBottom:24, color:'#ef4444', fontSize:14, textAlign:'center' }}>{error}</div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:20, marginBottom:40 }}>
          {bundles.map(b => (
            <div key={b.id} className="pp-card" style={{ padding:'28px 24px', position:'relative', border:b.popular?'1px solid rgba(217,119,6,0.5)':undefined, textAlign:'center' }}>
              {b.popular && (
                <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#0d9488', color:'#FFFFFF', padding:'3px 14px', borderRadius:20, fontSize:11, fontFamily:'var(--font-mono)', fontWeight:700, letterSpacing:'0.06em', whiteSpace:'nowrap' }}>MOST POPULAR</div>
              )}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:12 }}>
                <Zap size={18} style={{ color:'var(--amber)' }} />
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-primary)' }}>{b.name}</span>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:32, color:'var(--text-primary)', marginBottom:4 }}>{b.price}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-muted)', marginBottom:20 }}>{b.perCredit} per credit</div>
              <div style={{ marginBottom:20 }}>
                {[`${b.credits} AI analyses`, 'Never expires', 'Full clinical report', 'Australian AI'].map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, fontSize:13, color:'var(--text-secondary)' }}>
                    <Check size={14} style={{ color:'#10B981', flexShrink:0 }} />{f}
                  </div>
                ))}
              </div>
              <button className={b.popular ? 'pp-btn-primary' : 'pp-btn'} onClick={() => handlePurchase(b.id)} disabled={!!loading} style={{ width:'100%', padding:'12px', fontSize:14 }}>
                {loading === b.id ? 'Processing…' : `Buy ${b.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center', marginBottom:40 }}>
          {[{icon:<Shield size={16}/>,text:'Stripe Secure Checkout'},{icon:<Clock size={16}/>,text:'Credits Never Expire'},{icon:<Zap size={16}/>,text:'Instant Delivery'},{icon:<Star size={16}/>,text:'Australian-built AI'}].map(({icon,text}) => (
            <div key={text} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-muted)' }}>
              <span style={{ color:'var(--amber)' }}>{icon}</span>{text}
            </div>
          ))}
        </div>

        <div className="pp-card" style={{ padding:'24px', marginBottom:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--text-primary)', marginBottom:16, textAlign:'center' }}>Have a Coupon Code?</h3>
          <div style={{ display:'flex', gap:8, maxWidth:380, margin:'0 auto' }}>
            <input className="pp-input" type="text" placeholder="Enter coupon code" value={couponInput} onChange={e => setCouponInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleApplyCoupon()} style={{ flex:1 }} />
            <button className="pp-btn" onClick={handleApplyCoupon} style={{ padding:'10px 18px', fontSize:13 }}>Apply</button>
          </div>
          {couponMessage && <p style={{ color:'#10B981', fontSize:13, textAlign:'center', marginTop:10 }}>✓ {couponMessage}</p>}
        </div>

        <MoneyBackGuarantee />

        <div className="pp-card" style={{ padding:'28px', marginTop:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <HelpCircle size={20} style={{ color:'var(--amber)' }} />
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:0 }}>Frequently Asked Questions</h3>
          </div>
          {faqs.map((f,i) => <FAQItem key={i} question={f.question} answer={f.answer} />)}
        </div>

        <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, marginTop:32, lineHeight:1.6 }}>
          All prices in AUD incl. GST. Educational platform only — not a substitute for professional medical advice. In an emergency, call 000.
        </p>
      </div>

      {showMobilePurchase && <MobilePurchasePrompt type="bundle" onClose={() => setShowMobilePurchase(false)} />}
    </div>
  );
};

export default PricingPage;
