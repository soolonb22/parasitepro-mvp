'use client';
import ParasiteBible from '@/components/ParasiteBible'; // update path if needed

export default function ResearchPage() {
  return (
    <div style={{display:"flex", minHeight:"100vh", background:"#f8f9fa"}}>
      {/* Bible - left side (larger) */}
      <div style={{flex:"2", overflow:"auto", padding:"20px 30px"}}>
        <ParasiteBible />
      </div>

      {/* AI Sidebar - right side */}
      <div style={{flex:"1", borderLeft:`3px solid ${TEAL[200]}`, background:"#fff", padding:"20px", display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:20}}>
          <img src="/mascot.png" alt="Doc Wormly" style={{width:52, height:52, borderRadius:"50%", border:`2px solid ${TEAL[400]}`}} />
          <div>
            <div style={{fontSize:18, fontWeight:700, color:TEAL[800]}}>Ask Doc Wormly AI</div>
            <div style={{fontSize:13, color:TEAL[600]}}>Upload images • Ask questions • Get instant explanations</div>
          </div>
        </div>
        
        {/* Your AI chatbot component here — connect to OpenAI + vector DB with parasite context */}
        <div style={{flex:1, border:`1px solid ${TEAL[100]}`, borderRadius:16, overflow:"hidden", background:"#fafafa"}}>
          {/* Paste your chat UI / streaming component */}
        </div>
      </div>
    </div>
  );
}
