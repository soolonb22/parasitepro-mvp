// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Loader, AlertTriangle, Printer, ExternalLink, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const _BASE = import.meta.env.VITE_API_URL || 'https://parasitepro-mvp-production-b051.up.railway.app';
const API_URL = _BASE.endsWith('/api') ? _BASE : `${_BASE}/api`;

// ─── Urgency config ────────────────────────────────────────────────────────────
const URGENCY = {
  emergency: { label: 'EMERGENCY', color: '#991B1B', bg: '#FEE2E2', border: '#FCA5A5' },
  high:      { label: 'URGENT',    color: '#B91C1C', bg: '#FECACA', border: '#FCA5A5' },
  moderate:  { label: 'MODERATE',  color: '#92400E', bg: '#FEF3C7', border: '#FDE68A' },
  low:       { label: 'LOW RISK',  color: '#166534', bg: '#DCFCE7', border: '#86EFAC' },
};
const getU = (l) => URGENCY[l?.toLowerCase()] || URGENCY.low;

// ─── Detection box overlays ────────────────────────────────────────────────────
const BOX_POS = [
  [{ t:10, l:8,  w:22, h:20 }, { t:54, l:52, w:20, h:22 }],
  [{ t:8,  l:28, w:22, h:20 }, { t:50, l:6,  w:20, h:22 }, { t:62, l:50, w:18, h:18 }],
  [{ t:8,  l:8,  w:24, h:18 }, { t:44, l:50, w:20, h:22 }, { t:64, l:16, w:20, h:16 }, { t:26, l:58, w:18, h:18 }],
];

// ─── PARA woman — small clinical version ─────────────────────────────────────
const ParaFigure = ({ size = 80 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 120 168" fill="none">
    <path d="M40 118 Q38 148 36 162 L84 162 Q82 148 80 118 Q68 126 60 126 Q52 126 40 118Z" fill="#5A8E7A"/>
    <path d="M50 115 Q60 122 70 115 L73 124 Q60 130 47 124Z" fill="#3D7060"/>
    <rect x="55" y="96" width="10" height="21" rx="5" fill="#C49A7A"/>
    <path d="M40 119 Q27 132 24 152" stroke="#5A8E7A" strokeWidth="11" strokeLinecap="round" fill="none"/>
    <path d="M80 119 Q93 132 96 152" stroke="#5A8E7A" strokeWidth="11" strokeLinecap="round" fill="none"/>
    <ellipse cx="60" cy="74" rx="23" ry="25" fill="#C49A7A"/>
    <path d="M37 74 Q35 100 43 117 Q52 122 55 120 L55 96 Q43 94 37 74Z" fill="#5C3D28"/>
    <path d="M83 74 Q85 100 77 117 Q68 122 65 120 L65 96 Q77 94 83 74Z" fill="#5C3D28"/>
    <ellipse cx="53" cy="69" rx="4" ry="4.5" fill="white"/>
    <ellipse cx="67" cy="69" rx="4" ry="4.5" fill="white"/>
    <circle cx="54" cy="70" r="2.8" fill="#3D2810"/>
    <circle cx="68" cy="70" r="2.8" fill="#3D2810"/>
    <circle cx="55" cy="68" r="1" fill="white"/>
    <circle cx="69" cy="68" r="1" fill="white"/>
    <path d="M54 83 Q60 88 66 83" fill="#C0725A"/>
    <ellipse cx="47" cy="77" rx="5" ry="3" fill="#E8A090" opacity="0.4"/>
    <ellipse cx="73" cy="77" rx="5" ry="3" fill="#E8A090" opacity="0.4"/>
    <path d="M38 53 Q36 28 60 24 Q84 28 82 53" fill="#5C3D28"/>
    <ellipse cx="60" cy="52" rx="38" ry="7" fill="#4A7A5E"/>
    <ellipse cx="60" cy="50" rx="38" ry="7" fill="#5A9070"/>
    <path d="M30 51 Q33 22 60 20 Q87 22 90 51Z" fill="#6AAB84"/>
    <rect x="33" y="45" width="54" height="6" rx="2" fill="#3D7060"/>
  </svg>
);

// ─── notworms logo mark ────────────────────────────────────────────────────────
const Logo = () => (
  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#1B6B5F"/>
      <path d="M8 14 Q11 8 14 14 Q17 20 20 14" stroke="white" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
    <span style={{ fontWeight:800, fontSize:'1rem', color:'#0F2733', letterSpacing:'-0.01em' }}>notworms.com</span>
  </div>
);

// ─── Main GP Report Page ────────────────────────────────────────────────────────
const GPReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const reportRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [copying, setCopying]   = useState(false);
  const [showMHR, setShowMHR]   = useState(false);

  useEffect(() => { fetchAnalysis(); }, [id]);

  const fetchAnalysis = async () => {
    try {
      const res = await axios.get(`${API_URL}/analysis/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnalysis(res.data);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/gp-report/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopying(true);
      toast.success('Report link copied! Share it with your GP or save it for your appointment.');
      setTimeout(() => setCopying(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#2E4A52' }}>
      <Loader size={28} style={{ color:'#5A9070', animation:'spin 1s linear infinite' }} />
    </div>
  );

  if (!analysis || analysis.status !== 'completed') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#2E4A52', flexDirection:'column', gap:16 }}>
      <AlertTriangle size={32} style={{ color:'#EF4444' }} />
      <p style={{ color:'white' }}>Report not available.</p>
      <button onClick={() => navigate(-1)} style={{ color:'#9CA3AF', background:'none', border:'none', cursor:'pointer' }}>← Go back</button>
    </div>
  );

  // ── Computed values ───────────────────────────────────────────────────────────
  const urgency     = getU(analysis.urgencyLevel);
  const primary     = analysis.detections?.[0];
  const confidence  = primary ? Math.round(primary.confidenceScore * 100) : null;
  const confColor   = confidence >= 80 ? '#15803d' : confidence >= 55 ? '#b45309' : '#b91c1c';
  const confLabel   = confidence >= 80 ? 'High' : confidence >= 55 ? 'Moderate' : 'Low';
  const genDate     = new Date(analysis.processingCompletedAt || analysis.uploadedAt).toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' });
  const sampleLabel = analysis.sampleType && analysis.sampleType !== 'auto'
    ? analysis.sampleType.charAt(0).toUpperCase() + analysis.sampleType.slice(1) + ' Sample'
    : 'Clinical Sample';
  const detMethod   = analysis.sampleType === 'blood' ? 'Blood Smear Analysis'
    : analysis.sampleType === 'skin'  ? 'Dermatological Visual Assessment'
    : analysis.sampleType === 'stool' ? 'Stool Sample Microscopic Examination'
    : 'Visual Microscopic Examination';
  const boxLayout   = BOX_POS[Math.min((analysis.detections?.length || 1) - 1, BOX_POS.length - 1)];

  const diffRows = [
    ...(analysis.detections || []).map(d => ({
      name: d.commonName, sci: d.scientificName,
      probable: d.confidenceScore >= 0.55, possible: d.confidenceScore < 0.55 && d.confidenceScore >= 0.3,
    })),
    ...(analysis.differentialDiagnoses || []).map(d => ({
      name: d.condition, sci: '',
      probable: d.likelihood === 'high', possible: d.likelihood === 'moderate',
    })),
  ].slice(0, 6);

  const bullets = analysis.visualFindings
    ? analysis.visualFindings.split(/(?<=[.])\s+|[•\n]/).map(s => s.replace(/^[•\-]\s*/, '').trim()).filter(s => s.length > 10).slice(0, 4)
    : [];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background:'#2E4A52', minHeight:'100vh', fontFamily:'"DM Sans","Inter",system-ui,sans-serif' }}>

      {/* ── Print-only CSS injected ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; }
          .report-page { background: white !important; min-height: auto !important; padding: 0 !important; }
          .report-card { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
          @page { margin: 12mm; size: A4 portrait; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Top action bar (hidden on print) ── */}
      <div className="no-print" style={{ background:'rgba(0,0,0,0.25)', padding:'0.75rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <button onClick={() => navigate(`/analysis/${id}`)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'rgba(255,255,255,0.8)', padding:'7px 14px', borderRadius:8, cursor:'pointer', fontSize:'0.8rem' }}>
          <ArrowLeft size={13} /> Back to Results
        </button>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setShowMHR(true)} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)', color:'white', padding:'8px 18px', borderRadius:8, cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
            <ExternalLink size={14} /> Share to My Health Record
          </button>
          <button onClick={handlePrint} style={{ display:'flex', alignItems:'center', gap:7, background:'#1B6B5F', border:'none', color:'white', padding:'8px 18px', borderRadius:8, cursor:'pointer', fontSize:'0.85rem', fontWeight:700, boxShadow:'0 2px 12px rgba(0,0,0,0.25)' }}>
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div className="report-page" style={{ padding:'1.5rem 1rem 3rem', maxWidth:860, margin:'0 auto' }}>

        {/* ── Top disclaimer banners ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {['This report is not a diagnosis', 'Consult a medical professional for confirmation'].map(txt => (
            <div key={txt} style={{ textAlign:'center', padding:'11px 16px', borderRadius:10, border:'2.5px solid rgba(255,255,255,0.7)', color:'rgba(255,255,255,0.92)', fontSize:'0.82rem', fontWeight:700, background:'rgba(255,255,255,0.06)', letterSpacing:'0.01em' }}>
              {txt}
            </div>
          ))}
        </div>

        {/* ── White report card ── */}
        <div ref={reportRef} className="report-card" style={{ background:'#FAFAF9', borderRadius:20, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.35)' }}>

          {/* ─ Card header bar ─ */}
          <div style={{ background:'#1B6B5F', padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Logo />
            <div style={{ textAlign:'right' }}>
              <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', margin:0 }}>Educational AI Analysis Report</p>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.68rem', margin:'2px 0 0', fontFamily:'monospace' }}>ID: {id?.slice(0,8).toUpperCase()} · {genDate}</p>
            </div>
          </div>

          {/* ─ Main 2-col body ─ */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:520 }}>

            {/* LEFT — specimen image */}
            <div style={{ background:'#EAEBE8', borderRight:'1px solid #D8D9D5', padding:20, display:'flex', flexDirection:'column', gap:14 }}>

              {/* Sample meta */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#4A6B62' }}>{sampleLabel}</span>
                <span style={{ fontSize:'0.68rem', color:'#888', fontFamily:'monospace' }}>{genDate}</span>
              </div>

              {/* Annotated image */}
              <div style={{ position:'relative', borderRadius:10, overflow:'hidden', background:'#0d0d1a', aspectRatio:'4/3' }}>
                {(analysis.imageUrl || analysis.thumbnailUrl) && (
                  <img src={analysis.imageUrl || analysis.thumbnailUrl} alt="Specimen" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
                )}
                {/* Scan line */}
                <div style={{ position:'absolute', left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(34,197,94,0.9),transparent)', animation:'scan 2s ease-in-out infinite', pointerEvents:'none' }} />
                {/* Green detection boxes */}
                {boxLayout.map((box, i) => (
                  <div key={i} style={{ position:'absolute', top:`${box.t}%`, left:`${box.l}%`, width:`${box.w}%`, height:`${box.h}%`, border:'2px solid rgba(34,197,94,0.8)', background:'rgba(34,197,94,0.12)', borderRadius:2, pointerEvents:'none' }}>
                    {[{top:'-4px',left:'-4px'},{top:'-4px',right:'-4px'},{bottom:'-4px',left:'-4px'},{bottom:'-4px',right:'-4px'}].map((s,j) => (
                      <div key={j} style={{ position:'absolute', width:7, height:7, borderRadius:'50%', background:'#fff', boxShadow:'0 0 5px rgba(34,197,94,0.9)', ...s }} />
                    ))}
                    {/* Arrow marker */}
                    <div style={{ position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(255,255,255,0.7)', fontFamily:'monospace' }}>▼</div>
                  </div>
                ))}
                {/* Corner brackets */}
                {[{top:8,left:8,bt:'2px',bl:'2px'},{top:8,right:8,bt:'2px',br:'2px'},{bottom:8,left:8,bb:'2px',bl:'2px'},{bottom:8,right:8,bb:'2px',br:'2px'}].map((s,i) => {
                  const {bt,bl,br,bb,...pos} = s;
                  return <div key={i} style={{ position:'absolute', width:18, height:18, borderTop:bt, borderLeft:bl, borderRight:br, borderBottom:bb, borderColor:'rgba(245,158,11,0.85)', ...pos }} />;
                })}
                {/* Region badge */}
                <div style={{ position:'absolute', top:8, left:'50%', transform:'translateX(-50%)', background:'rgba(34,197,94,0.85)', color:'#fff', fontSize:'0.65rem', fontWeight:700, padding:'3px 10px', borderRadius:20, backdropFilter:'blur(6px)', whiteSpace:'nowrap' }}>
                  {analysis.detections?.length || 1} region{(analysis.detections?.length || 1) !== 1 ? 's' : ''} flagged
                </div>
              </div>

              {/* Image quality */}
              {analysis.imageQuality && (
                <p style={{ fontSize:'0.7rem', color:'#888', margin:0 }}>
                  Image quality: <span style={{ fontWeight:600, color: analysis.imageQuality==='poor'?'#dc2626':analysis.imageQuality==='adequate'?'#b45309':'#15803d' }}>{analysis.imageQuality}</span>
                </p>
              )}

              {/* Recommended next steps */}
              {analysis.recommendedActions?.length > 0 && (
                <div style={{ background:'#F0F5F3', borderRadius:10, padding:'12px 14px', border:'1px solid #C8DDD8', marginTop:'auto' }}>
                  <p style={{ fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'#1B6B5F', margin:'0 0 8px' }}>Recommended Next Steps</p>
                  <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:5 }}>
                    {analysis.recommendedActions.slice(0, 3).map((a, i) => {
                      const col = a.priority==='immediate'?'#dc2626':a.priority==='soon'?'#b45309':'#15803d';
                      return (
                        <li key={i} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                          <span style={{ fontSize:'0.62rem', fontWeight:700, background:`${col}18`, color:col, border:`1px solid ${col}30`, borderRadius:4, padding:'1px 5px', flexShrink:0, marginTop:1 }}>{a.priority?.toUpperCase()}</span>
                          <span style={{ fontSize:'0.72rem', color:'#374151', lineHeight:1.45 }}>{a.action}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT — clinical data */}
            <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:18 }}>

              {/* Title */}
              <div>
                <h1 style={{ fontSize:'2rem', fontWeight:900, color:'#0F2733', letterSpacing:'-0.025em', margin:'0 0 3px', lineHeight:1 }}>Parasite Analysis</h1>
                <p style={{ fontSize:'0.78rem', color:'#6B7280', margin:0, fontWeight:500 }}>Report — For Discussion with Your GP</p>
              </div>

              {/* Urgency + Confidence */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {/* Urgency */}
                <div style={{ borderRadius:10, overflow:'hidden', border:`1px solid ${urgency.border}` }}>
                  <div style={{ background:'#64748B', padding:'5px 10px', textAlign:'center' }}>
                    <p style={{ color:'white', fontSize:'0.7rem', fontWeight:700, margin:0, letterSpacing:'0.04em' }}>Urgency</p>
                  </div>
                  <div style={{ background:urgency.bg, padding:'12px 10px', textAlign:'center' }}>
                    <p style={{ color:urgency.color, fontSize:'1.5rem', fontWeight:900, margin:0, letterSpacing:'-0.02em' }}>{urgency.label}</p>
                  </div>
                </div>
                {/* Confidence */}
                <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid #86EFAC' }}>
                  <div style={{ background:'#14532D', padding:'5px 10px', textAlign:'center' }}>
                    <p style={{ color:'#86EFAC', fontSize:'0.7rem', fontWeight:700, margin:0, letterSpacing:'0.04em' }}>Confidence</p>
                  </div>
                  <div style={{ background:'#F0FDF4', padding:'12px 10px', textAlign:'center' }}>
                    <p style={{ color:confColor, fontSize:'1.9rem', fontWeight:900, margin:0 }}>{confidence !== null ? `${confidence}%` : '—'}</p>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div>
                <p style={{ fontSize:'0.82rem', fontWeight:800, color:'#0F2733', margin:'0 0 6px' }}>Findings</p>
                <div style={{ fontSize:'0.73rem', color:'#374151', lineHeight:1.6, display:'flex', flexDirection:'column', gap:2 }}>
                  <p style={{ margin:0 }}><strong>Detection Method:</strong> {detMethod}</p>
                  <p style={{ margin:0 }}><strong>Confidence Level:</strong> {confLabel}</p>
                  {primary && <p style={{ margin:0 }}><strong>Primary Finding:</strong> {primary.commonName}{primary.scientificName ? <em style={{ color:'#9CA3AF' }}> ({primary.scientificName})</em> : ''}</p>}
                </div>
                {bullets.length > 0 && (
                  <ul style={{ margin:'6px 0 0', padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:4 }}>
                    {bullets.map((b, i) => (
                      <li key={i} style={{ display:'flex', gap:6, alignItems:'flex-start', fontSize:'0.71rem', color:'#4B5563', lineHeight:1.4 }}>
                        <span style={{ color:'#16a34a', flexShrink:0, marginTop:1 }}>•</span>{b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Differential Diagnosis table */}
              {diffRows.length > 0 && (
                <div style={{ borderRadius:8, overflow:'hidden', border:'1px solid #CBD5E1' }}>
                  <div style={{ background:'#475569', padding:'6px 12px' }}>
                    <p style={{ color:'white', fontSize:'0.72rem', fontWeight:700, margin:0, letterSpacing:'0.03em' }}>Differential Diagnosis</p>
                  </div>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.71rem' }}>
                    <thead style={{ background:'#F8FAFC' }}>
                      <tr style={{ borderBottom:'1px solid #CBD5E1' }}>
                        <th style={{ textAlign:'left', padding:'7px 10px', color:'#475569', fontWeight:600 }}>Parasite Type</th>
                        <th style={{ textAlign:'center', padding:'7px 8px', color:'#475569', fontWeight:600, width:70 }}>Probable</th>
                        <th style={{ textAlign:'center', padding:'7px 8px', color:'#475569', fontWeight:600, width:70 }}>Possible</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diffRows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: i < diffRows.length-1 ? '1px solid #E2E8F0' : 'none', background: i%2===0 ? '#fff' : '#FAFAFA' }}>
                          <td style={{ padding:'7px 10px', color:'#1e293b', fontWeight:500 }}>
                            {row.name}{row.sci && <em style={{ color:'#9CA3AF', fontWeight:400 }}> ({row.sci})</em>}
                          </td>
                          <td style={{ padding:'7px 8px', textAlign:'center' }}>
                            {row.probable ? <span style={{ color:'#16a34a', fontSize:'0.9rem' }}>✔</span> : <span style={{ color:'#94a3b8' }}>✕</span>}
                          </td>
                          <td style={{ padding:'7px 8px', textAlign:'center' }}>
                            {row.possible && !row.probable ? <span style={{ color:'#16a34a', fontSize:'0.9rem' }}>✔</span> : <span style={{ color:'#94a3b8' }}>✕</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* GP Testing list */}
              {analysis.gpTestingList?.length > 0 && (
                <div style={{ background:'#F0F5F3', borderRadius:8, padding:'10px 12px', border:'1px solid #C8DDD8' }}>
                  <p style={{ fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'#1B6B5F', margin:'0 0 6px' }}>Ask Your GP for These Tests</p>
                  <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:3 }}>
                    {analysis.gpTestingList.slice(0, 4).map((t, i) => (
                      <li key={i} style={{ display:'flex', gap:6, fontSize:'0.71rem', color:'#374151', alignItems:'flex-start' }}>
                        <span style={{ color:'#1B6B5F', flexShrink:0 }}>✓</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conclusion + PARA */}
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12, paddingTop:10, borderTop:'1px solid #E5E7EB', marginTop:'auto' }}>
                <p style={{ fontSize:'0.73rem', color:'#374151', lineHeight:1.55, margin:0, flex:1 }}>
                  <strong style={{ color:'#0F2733' }}>Conclusion: </strong>
                  {analysis.overallAssessment
                    ? analysis.overallAssessment.split('.')[0] + '.'
                    : 'These are visual patterns and educational findings only. Please discuss with your GP before taking any action.'}
                </p>
                <div style={{ flexShrink:0, opacity:0.85 }}>
                  <ParaFigure size={62} />
                </div>
              </div>
            </div>
          </div>

          {/* ─ Bottom disclaimer strip ─ */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:'1px solid #D1D5DB' }}>
            {['This report is not a diagnosis', 'Consult a medical professional for confirmation'].map((txt, i) => (
              <div key={txt} style={{ padding:'10px 20px', textAlign:'center', fontSize:'0.72rem', fontWeight:700, color:'#6B7280', borderRight: i===0 ? '1px solid #D1D5DB' : 'none' }}>
                {txt}
              </div>
            ))}
          </div>

          {/* ─ Card footer ─ */}
          <div style={{ background:'#F8FAFA', borderTop:'1px solid #E5E7EB', padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <p style={{ fontSize:'0.65rem', color:'#9CA3AF', margin:0 }}>
              Generated {genDate} · Report ID {id?.slice(0,8).toUpperCase()} · notworms.com
            </p>
            <p style={{ fontSize:'0.65rem', color:'#9CA3AF', margin:0, fontWeight:600 }}>
              ⚠️ Educational tool only — not a medical diagnosis
            </p>
          </div>
        </div>

        {/* ── Prominent disclaimer below card ── */}
        <div style={{ marginTop:20, background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'14px 20px', border:'1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.78rem', lineHeight:1.65, margin:0, textAlign:'center' }}>
            ⚠️ <strong style={{ color:'rgba(255,255,255,0.9)' }}>Educational tool only.</strong> PARA has put this together to help you start the conversation with your GP — it does not constitute a medical diagnosis or treatment recommendation.
            Always consult a qualified healthcare professional. In an emergency, call <strong style={{ color:'rgba(255,255,255,0.9)' }}>000</strong>.
          </p>
        </div>

        {/* ── Mobile download buttons ── */}
        <div className="no-print" style={{ display:'flex', gap:12, justifyContent:'center', marginTop:20 }}>
          <button onClick={handlePrint} style={{ display:'flex', alignItems:'center', gap:8, background:'#1B6B5F', border:'none', color:'white', padding:'12px 28px', borderRadius:10, cursor:'pointer', fontSize:'0.9rem', fontWeight:700, boxShadow:'0 4px 16px rgba(0,0,0,0.25)' }}>
            <Printer size={16} /> Download / Print PDF
          </button>
          <button onClick={() => setShowMHR(true)} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.3)', color:'white', padding:'12px 28px', borderRadius:10, cursor:'pointer', fontSize:'0.9rem', fontWeight:600 }}>
            <ExternalLink size={16} /> Share to My Health Record
          </button>
        </div>
      </div>

      {/* My Health Record modal */}
      {showMHR && (
        <div
          onClick={e => e.target === e.currentTarget && setShowMHR(false)}
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', backdropFilter:'blur(4px)' }}
        >
          <div style={{ background:'#1A2A2E', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, width:'100%', maxWidth:480, padding:'2rem', position:'relative', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setShowMHR(false)} style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.08)', border:'none', color:'white', width:32, height:32, borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={15} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.25rem' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'rgba(27,107,95,0.2)', border:'1px solid rgba(27,107,95,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <ExternalLink size={20} style={{ color:'#5AB89A' }} />
              </div>
              <div>
                <h3 style={{ color:'white', fontWeight:800, fontSize:'1.05rem', margin:0 }}>Share to My Health Record</h3>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', margin:0 }}>Australia's national health record system</p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:'1.5rem' }}>
              {[
                { n:'1', title:'Save your PDF report', desc:'Click "Download / Print PDF" below - your report will save to your device, ready to show your doctor.' },
                { n:'2', title:'Log into My Health Record', desc:'Visit myhr.gov.au or open the My Health Record app and sign in with myGov.' },
                { n:'3', title:'Upload the document', desc:'Go to Documents → Upload a document → select the PDF you downloaded.' },
                { n:'4', title:'Share access with your GP', desc:'Your GP can now view the report at your next appointment.' },
              ].map(step => (
                <div key={step.n} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:'#1B6B5F', color:'white', fontSize:'0.75rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{step.n}</div>
                  <div>
                    <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'0.82rem', fontWeight:600, margin:'0 0 2px' }}>{step.title}</p>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', margin:0, lineHeight:1.5 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setShowMHR(false); handlePrint(); }} style={{ flex:1, padding:'12px', background:'#1B6B5F', color:'white', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:'0.85rem' }}>
                Download PDF First
              </button>
              <a href="https://www.myhealthrecord.gov.au" target="_blank" rel="noopener noreferrer"
                style={{ flex:1, padding:'12px', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, fontWeight:600, cursor:'pointer', fontSize:'0.85rem', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                Open myhr.gov.au <ExternalLink size={12} />
              </a>
            </div>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.68rem', marginTop:'1rem', textAlign:'center', lineHeight:1.5 }}>
              notworms.com is not affiliated with My Health Record or the Australian Digital Health Agency. This report is educational only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPReportPage;
