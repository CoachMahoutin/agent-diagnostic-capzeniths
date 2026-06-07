import { useState, useRef, useCallback, useEffect } from "react";

const injectStyles = () => {
  if (document.getElementById("cz3-s")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.id = "cz3-s";
  s.textContent = `
    .cz3*{box-sizing:border-box;}
    .cz3{font-family:'Outfit',sans-serif;background:#FAF8F5;min-height:100vh;color:#2D1B4E;}
    .cz3-serif{font-family:'DM Serif Display',serif;}
    .cz3-card{background:#fff;border-radius:18px;border:1px solid rgba(45,10,62,.08);box-shadow:0 1px 4px rgba(45,10,62,.06),0 6px 20px rgba(45,10,62,.04);}
    .cz3-inp{width:100%;padding:11px 15px;border:1.5px solid rgba(45,10,62,.15);border-radius:10px;background:#fff;color:#2D1B4E;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:all .2s;}
    .cz3-inp:focus{border-color:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.12);}
    .cz3-sel{appearance:none;width:100%;padding:11px 15px;border:1.5px solid rgba(45,10,62,.15);border-radius:10px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23F5A623' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;color:#2D1B4E;font-family:'Outfit',sans-serif;font-size:14px;outline:none;cursor:pointer;}
    .cz3-btn{background:#F5A623;color:#2D0A3E;border:none;border-radius:13px;padding:14px 28px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;width:100%;}
    .cz3-btn:hover:not(:disabled){background:#E09A1A;box-shadow:0 4px 18px rgba(245,166,35,.32);transform:translateY(-1px);}
    .cz3-btn:disabled{opacity:.38;cursor:not-allowed;}
    .cz3-btn-sm{background:transparent;color:#7C6A8E;border:1px solid rgba(45,10,62,.15);border-radius:8px;padding:5px 12px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap;}
    .cz3-btn-sm:hover{border-color:#F5A623;color:#F5A623;}
    .cz3-mod-tab{padding:8px 14px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:none;background:transparent;color:rgba(45,10,62,.45);transition:all .2s;white-space:nowrap;display:flex;align-items:center;gap:6px;flex-shrink:0;}
    .cz3-mod-tab:hover{color:#2D0A3E;background:rgba(45,10,62,.06);}
    .cz3-mod-tab.sel{background:#2D0A3E;color:#F5A623;font-weight:600;}
    .cz3-tab{padding:8px 16px;border-radius:100px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid transparent;transition:all .2s;background:transparent;color:#7C6A8E;white-space:nowrap;flex-shrink:0;}
    .cz3-tab:hover{color:#F5A623;background:rgba(245,166,35,.07);}
    .cz3-tab.sel{background:#F5A623;color:#2D0A3E;font-weight:700;}
    .cz3-pillar{border:1.5px solid rgba(45,10,62,.12);border-radius:12px;padding:12px 6px 9px;cursor:pointer;text-align:center;background:#fff;transition:all .2s;}
    .cz3-pillar:hover{border-color:#F5A623;transform:translateY(-2px);}
    .cz3-pillar.sel{border-color:#F5A623;background:#FFFBF0;box-shadow:0 4px 14px rgba(245,166,35,.18);}
    .cz3-answer{padding:10px 13px;border-radius:10px;border:1.5px solid rgba(45,10,62,.1);background:#FAFAF8;font-size:13px;color:#2D1B4E;line-height:1.5;}
    .cz3-answer.ok{border-color:#10B981;background:#ECFDF5;color:#065F46;font-weight:600;}
    .cz3-tabs-scroll{display:flex;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px;}
    .cz3-tabs-scroll::-webkit-scrollbar{display:none;}
    @keyframes cz3Up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cz3Spin{to{transform:rotate(360deg)}}
    .cz3-up{animation:cz3Up .4s ease forwards;}
    .cz3-up1{animation:cz3Up .4s .08s ease both;}
    .cz3-up2{animation:cz3Up .4s .18s ease both;}
    @media(max-width:640px){
      .cz3-btn{font-size:14px;padding:12px 20px;}
      .cz3-mod-tab{font-size:12px;padding:7px 10px;}
      .cz3-pillar{padding:10px 4px 8px;}
    }
    @media print{.no-print{display:none!important}.cz3{background:#fff}.cz3-card{box-shadow:none;border:1px solid #e0d8f0;}}
  `;
  document.head.appendChild(s);
};

// ── SYNC SUPABASE ─────────────────────────────────────────────────────────────
const syncToSupabase = async (table, data, agent) => {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, action: 'insert', data, agent }),
    });
  } catch (e) {
    console.warn('Sync Supabase échouée:', e.message);
  }
};

const Logo = ({ height=34 }) => (
  <svg viewBox="0 0 210 60" height={height} style={{display:"block",flexShrink:0}} xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#2D0A3E"/>
    <rect x="14" y="37" width="9" height="9"  rx="1.5" fill="#F5A623"/>
    <rect x="26" y="28" width="9" height="18" rx="1.5" fill="#F5A623"/>
    <rect x="38" y="18" width="9" height="28" rx="1.5" fill="#F5A623"/>
    <polygon points="42.5,6.5 43.8,10.2 47.7,10.3 44.6,12.7 45.7,16.5 42.5,14.2 39.3,16.5 40.4,12.7 37.3,10.3 41.2,10.2" fill="#F5A623"/>
    <text x="66" y="41" fontFamily="'Outfit',sans-serif" fontSize="25" fontWeight="700" fill="#F5A623">Cap</text>
    <text x="109" y="41" fontFamily="'Outfit',sans-serif" fontSize="25" fontWeight="700" fill="#9B8ED4">Zeniths</text>
  </svg>
);

const callAPI = async (system, content) => {
  const res = await fetch("/api/analyze", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system,messages:[{role:"user",content}]})});
  const data = await res.json();
  return JSON.parse((data.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
};
const CopyBtn = ({text}) => { const [ok,setOk]=useState(false); return <button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000);}} className="cz3-btn-sm" style={ok?{borderColor:"#10B981",color:"#10B981"}:{}}>{ok?"✓":"Copier"}</button>; };
const Spin = ({msg}) => <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0"}}><div style={{width:16,height:16,border:"2px solid #F5A623",borderTopColor:"transparent",borderRadius:"50%",animation:"cz3Spin .8s linear infinite"}}/><span style={{fontSize:13,color:"#7C6A8E"}}>{msg}</span></div>;
const SL = ({t,opt}) => <div style={{fontSize:10,fontWeight:700,letterSpacing:".12em",color:"#B8A898",marginBottom:8,textTransform:"uppercase"}}>{t}{opt&&<span style={{fontWeight:400,opacity:.6,marginLeft:6,textTransform:"none"}}>(optionnel)</span>}</div>;

const useM = () => {
  const [m,setM] = useState(typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => { const h=()=>setM(window.innerWidth<640); window.addEventListener('resize',h); return()=>window.removeEventListener('resize',h); },[]);
  return m;
};

// ── DIAGNOSTIC ──────────────────────────────────────────────────
const DSYS=`Tu es l'Agent Diagnostic de CapZeniths, spécialiste prévention défaillance business. Analyse le PDF Cap-Diag ou les réponses et génère un rapport L1.1. 7 piliers : Cash, Stratégie, Clients, Équipe, Risques, Croissance, Résilience. Score 1-3=ROUGE, 4-6=ORANGE, 7-10=VERT. Style direct, anti-bullshit. RÉPONDS EN JSON VALIDE sans backticks.
{"clientExtrait":{"nom":"","entreprise":"","secteur":"","type":"","ca":"","anciennete":""},"scoreGlobal":0,"niveauRisque":"MODÉRÉ","synthese":"","pilliers":[{"nom":"Cash","score":0,"statut":"ORANGE","diagnostic":""}],"pointsCritiques":[{"titre":"","description":"","impact":""}],"planAction":{"j30":[],"j60":[],"j90":[]},"prochainesEtapes":""}`;
const PI={Cash:"💰",Stratégie:"🎯",Clients:"🤝",Équipe:"👥",Risques:"⚠️",Croissance:"📈",Résilience:"🛡️"};
const SS={ROUGE:{bg:"#FEE2E2",text:"#991B1B",border:"#FCA5A5",dot:"#EF4444"},ORANGE:{bg:"#FEF3C7",text:"#92400E",border:"#FCD34D",dot:"#F59E0B"},VERT:{bg:"#D1FAE5",text:"#065F46",border:"#6EE7B7",dot:"#10B981"}};
const RS={CRITIQUE:{bg:"#7F1D1D",text:"#FEE2E2"},ÉLEVÉ:{bg:"#78350F",text:"#FEF3C7"},MODÉRÉ:{bg:"#713F12",text:"#FEF9C3"},FAIBLE:{bg:"#064E3B",text:"#D1FAE5"}};

function AgentDiagnostic() {
  const m=useM();
  const [pdf,setPdf]=useState(null);const [b64,setB64]=useState(null);const [ctx,setCtx]=useState("");
  const [loading,setLoading]=useState(false);const [msg,setMsg]=useState("");const [pct,setPct]=useState(0);
  const [rep,setRep]=useState(null);const [err,setErr]=useState("");const [drag,setDrag]=useState(false);
  const ref=useRef(null);
  const MSGS=["Lecture du rapport…","Analyse des 7 piliers…","Évaluation des risques…","Construction du plan…","Finalisation…"];
  const readPdf=f=>new Promise((r,j)=>{const rd=new FileReader();rd.onload=()=>r(rd.result.split(",")[1]);rd.onerror=j;rd.readAsDataURL(f);});
  const hFile=useCallback(async f=>{if(!f)return;if(f.type!=="application/pdf"){setErr("PDF uniquement.");return;}setErr("");setPdf(f);setB64(await readPdf(f));},[]);
  const gen=async()=>{
    if(!b64&&!ctx.trim()){setErr("Importe un PDF ou ajoute du contexte.");return;}
    setErr("");setLoading(true);setPct(8);let mi=0;setMsg(MSGS[0]);
    const iv=setInterval(()=>{mi=Math.min(mi+1,MSGS.length-1);setMsg(MSGS[mi]);setPct(Math.round((mi/(MSGS.length-1))*85));},2000);
    try{
      const uc=[];if(b64)uc.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}});uc.push({type:"text",text:"Génère le rapport L1.1."+(ctx.trim()?"\n\nContexte : "+ctx:"")});
      const d=await callAPI(DSYS,uc);
      clearInterval(iv);setPct(100);setRep(d);
      // SYNC SUPABASE
      const c=d.clientExtrait||{};
      const scores={};
      (d.pilliers||[]).forEach(p=>{ scores[p.nom]=p.score; });
      await syncToSupabase('diagnostics', {
        client_nom: [c.entreprise,c.nom].filter(v=>v&&!v.includes("trouvé")).join(" — ") || 'Non renseigné',
        secteur: c.secteur || '',
        date_diag: new Date().toISOString().slice(0,10),
        statut: 'rapport_envoyé',
        rapport_genere: true,
        score_cash:        parseFloat(scores['Cash'])        || 0,
        score_strategie:   parseFloat(scores['Stratégie'])   || 0,
        score_clients:     parseFloat(scores['Clients'])     || 0,
        score_equipe:      parseFloat(scores['Équipe'])      || 0,
        score_risques:     parseFloat(scores['Risques'])     || 0,
        score_croissance:  parseFloat(scores['Croissance'])  || 0,
        score_resilience:  parseFloat(scores['Résilience'])  || 0,
      }, 'diagnostic');
    }
    catch(e){clearInterval(iv);setErr("Erreur. Réessaie.");}finally{setLoading(false);}
  };
  const reset=()=>{setRep(null);setPdf(null);setB64(null);setCtx("");setErr("");setPct(0);};
  const SBar=({s})=>(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:5,background:"rgba(45,10,62,.08)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${s*10}%`,height:"100%",borderRadius:3,background:s<=3?"#EF4444":s<=6?"#F59E0B":"#10B981"}}/></div><span style={{fontSize:13,fontWeight:600,minWidth:18}}>{s}</span></div>);

  if(rep){
    const c=rep.clientExtrait||{};const risk=RS[rep.niveauRisque]||RS["MODÉRÉ"];
    const date=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
    const cl=[c.entreprise,c.nom].filter(v=>v&&!v.includes("trouvé")).join(" — ");
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(45,10,62,.08)",flexWrap:"wrap",gap:12}}>
        <div><div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",color:"#B8A898",marginBottom:6,textTransform:"uppercase"}}>{date.toUpperCase()}</div>
          <div className="cz3-serif" style={{fontSize:m?22:28,color:"#2D0A3E",lineHeight:1.2}}>{cl||"Rapport Diagnostic"}</div>
          {[c.secteur,c.type].filter(v=>v&&!v.includes("trouvé")).join(" · ")&&<div style={{fontSize:12,color:"#7C6A8E",marginTop:3}}>{[c.secteur,c.type].filter(v=>v&&!v.includes("trouvé")).join(" · ")}</div>}
        </div>
        <div style={{textAlign:"right"}}>
          <div className="cz3-serif" style={{fontSize:m?30:38,color:"#2D0A3E",lineHeight:1}}>{rep.scoreGlobal}<span style={{fontSize:14,color:"#B8A898"}}>/10</span></div>
          <div style={{marginTop:6,display:"inline-block",padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:risk.bg,color:risk.text}}>RISQUE {rep.niveauRisque}</div>
        </div>
      </div>
      <div className="cz3-card" style={{padding:"20px 22px",marginBottom:12,borderTop:"4px solid #F5A623"}}><SL t="Synthèse"/><p style={{margin:0,fontSize:14,lineHeight:1.8}}>{rep.synthese}</p></div>
      <div style={{marginBottom:12}}><SL t="7 Piliers"/>
        {(rep.pilliers||[]).map(p=>{const s=SS[p.statut]||SS.ORANGE;return(
          <div key={p.nom} className="cz3-card" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:5,flexWrap:m?"wrap":"nowrap"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.dot,flexShrink:0}}/>
            <span style={{fontSize:15,flexShrink:0}}>{PI[p.nom]}</span>
            <span style={{width:m?70:88,fontSize:13,fontWeight:600,flexShrink:0}}>{p.nom}</span>
            {!m&&<div style={{width:110,flexShrink:0}}><SBar s={p.score}/></div>}
            {m&&<span style={{fontSize:14,fontWeight:700,color:s.dot}}>{p.score}/10</span>}
            <div style={{fontSize:12,color:"#7C6A8E",flex:1,lineHeight:1.5,minWidth:0}}>{p.diagnostic}</div>
            <div style={{flexShrink:0,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:s.bg,color:s.text}}>{p.statut}</div>
          </div>
        );})}
      </div>
      <div style={{marginBottom:12}}><SL t="Points critiques"/>
        {(rep.pointsCritiques||[]).map((p,i)=>(<div key={i} style={{padding:"13px 16px",borderRadius:12,border:"1.5px solid #FCA5A5",background:"#FFF5F5",marginBottom:7}}><div style={{fontSize:13,fontWeight:700,color:"#7F1D1D",marginBottom:4}}><span style={{opacity:.4,marginRight:7}}>{i+1}.</span>{p.titre}</div><div style={{fontSize:12,color:"#7F1D1D",lineHeight:1.65,marginBottom:4}}>{p.description}</div><div style={{fontSize:11,color:"#991B1B",display:"flex",gap:5}}><span style={{opacity:.6}}>Impact :</span><span>{p.impact}</span></div></div>))}
      </div>
      <div style={{marginBottom:12}}><SL t="Plan d'action"/>
        <div style={{display:"grid",gridTemplateColumns:m?"1fr":"repeat(3,1fr)",gap:10}}>
          {[{label:"J+30",a:rep.planAction?.j30,c:"#F5A623"},{label:"J+60",a:rep.planAction?.j60,c:"#9B8ED4"},{label:"J+90",a:rep.planAction?.j90,c:"#10B981"}].map(({label,a,c})=>(
            <div key={label} className="cz3-card" style={{padding:"13px 15px"}}><div style={{fontSize:12,fontWeight:700,color:c,marginBottom:7,paddingBottom:6,borderBottom:"1px solid rgba(45,10,62,.06)"}}>{label}</div>{(a||[]).map((x,i)=><div key={i} style={{fontSize:12,color:"#3D2A5C",marginBottom:5,display:"flex",gap:6,lineHeight:1.5}}><span style={{color:c,flexShrink:0,fontWeight:700}}>→</span><span>{x}</span></div>)}</div>
          ))}
        </div>
      </div>
      <div className="cz3-card" style={{padding:"16px 20px",borderTop:"4px solid #F5A623",marginBottom:18}}><SL t="Recommandation CapZeniths"/><p style={{margin:0,fontSize:13,lineHeight:1.8}}>{rep.prochainesEtapes}</p></div>
      <div style={{display:"flex",gap:10}} className="no-print"><button onClick={reset} className="cz3-btn-sm">← Nouveau</button><button onClick={()=>window.print()} className="cz3-btn-sm">🖨 PDF</button></div>
    </div>);
  }

  return(<div>
    <div style={{background:"linear-gradient(135deg,#2D0A3E 0%,#1A0652 100%)",borderRadius:14,padding:m?"24px 20px 30px":"34px 30px 40px",marginBottom:20}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".16em",color:"rgba(245,166,35,.55)",textTransform:"uppercase",marginBottom:10}}>Agent Diagnostic</div>
      <div className="cz3-serif" style={{fontSize:m?26:32,color:"#F0E8FC",lineHeight:1.2,marginBottom:8}}>Générer votre rapport<br/><span style={{fontStyle:"italic",color:"rgba(245,166,35,.75)"}}>diagnostic L1.1</span></div>
      <div style={{fontSize:13,color:"rgba(240,232,252,.5)",lineHeight:1.7}}>Importez le PDF Cap-Diag — rapport complet automatiquement.</div>
    </div>
    <div style={{marginBottom:18}}><SL t="Rapport Cap-Diag (PDF)"/>
      {!pdf?(
        <div onDrop={e=>{e.preventDefault();setDrag(false);hFile(e.dataTransfer.files[0]);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onClick={()=>ref.current?.click()}
          style={{border:`2px dashed ${drag?"#F5A623":"rgba(45,10,62,.15)"}`,borderRadius:13,padding:m?"24px 16px":"30px",textAlign:"center",cursor:"pointer",background:drag?"#FFFBF0":"#FAFAF8",transition:"all .15s"}}>
          <div style={{fontSize:26,marginBottom:7}}>📄</div>
          <div className="cz3-serif" style={{fontSize:15,color:"#2D1B4E",fontStyle:"italic",marginBottom:5}}>Glisse-dépose le PDF ici</div>
          <div style={{fontSize:13,color:"#7C6A8E",marginBottom:12}}>ou clique pour sélectionner</div>
          <span style={{fontSize:12,padding:"6px 14px",borderRadius:20,border:"1.5px solid rgba(45,10,62,.15)",color:"#7C6A8E"}}>Parcourir…</span>
          <input ref={ref} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>hFile(e.target.files[0])}/>
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderRadius:12,border:"1.5px solid #10B981",background:"#ECFDF5"}}>
          <span style={{fontSize:20}}>✅</span>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:"#065F46",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pdf.name}</div><div style={{fontSize:11,color:"#047857",marginTop:1}}>{(pdf.size/1024).toFixed(0)} Ko</div></div>
          <button onClick={()=>{setPdf(null);setB64(null);}} className="cz3-btn-sm" style={{color:"#065F46",borderColor:"#6EE7B7"}}>Changer</button>
        </div>
      )}
    </div>
    <div style={{marginBottom:20}}><SL t="Contexte complémentaire" opt/><textarea className="cz3-inp" value={ctx} onChange={e=>setCtx(e.target.value)} rows={3} placeholder="Notes de l'appel découverte…" style={{resize:"vertical",lineHeight:1.6}}/></div>
    {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
    {loading?(<div><div style={{height:3,background:"rgba(245,166,35,.15)",borderRadius:2,overflow:"hidden",marginBottom:8}}><div style={{height:"100%",background:"#F5A623",width:`${pct}%`,transition:"width .6s ease"}}/></div><Spin msg={msg}/></div>):<button className="cz3-btn" onClick={gen} disabled={!b64&&!ctx.trim()}>→ Générer le rapport L1.1</button>}
  </div>);
}

// ── ÉDITORIAL ───────────────────────────────────────────────────
const PED=[{id:"cash",icon:"💰",label:"Cash"},{id:"strategie",icon:"🎯",label:"Stratégie"},{id:"clients",icon:"🤝",label:"Clients"},{id:"equipe",icon:"👥",label:"Équipe"},{id:"risques",icon:"⚠️",label:"Risques"},{id:"croissance",icon:"📈",label:"Croissance"},{id:"resilience",icon:"🛡️",label:"Résilience"}];
const TONS=[{id:"antibullshit",label:"Anti-bullshit"},{id:"pedagogique",label:"Pédagogique"},{id:"provocateur",label:"Provocateur"},{id:"narratif",label:"Storytelling"}];
const DTABS=[{id:"linkedin",label:"LinkedIn"},{id:"newsletter",label:"Newsletter"},{id:"video",label:"Vidéo 60s"},{id:"carousel",label:"Carousel"},{id:"instagram",label:"Instagram"}];
const ASYS=`Tu es l'Agent Éditorial de CapZeniths. Style direct, anti-bullshit, tutoiement. RÉPONDS EN JSON VALIDE sans backticks.
{"titre":"<max 70c>","accroche":"<2-3 phrases>","sections":[{"h2":"","contenu":""},{"h2":"","contenu":""},{"h2":"","contenu":""}],"conclusion":"","cta":""}`;
const DSYS_ED=`Tu es l'Agent Éditorial de CapZeniths. 5 déclinaisons de l'article. Direct, anti-bullshit. RÉPONDS EN JSON VALIDE sans backticks.
{"linkedin":"<post complet>","newsletter":"<titre + 3-4 lignes>","video":"<script 60s>","carousel":["<S1>","<S2>","<S3>","<S4>","<S5>"],"instagram":"<2-3 lignes + hashtags>"}`;

function AgentEditorial() {
  const m=useM();
  const [form,setForm]=useState({sujet:"",pilier:"",angle:"",probleme:"",motscles:"",ton:"antibullshit"});
  const [art,setArt]=useState(null);const [decl,setDecl]=useState(null);
  const [loading,setLoading]=useState(false);const [msg,setMsg]=useState("");
  const [tab,setTab]=useState("linkedin");const [err,setErr]=useState("");
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const MSGS=["Analyse du pilier…","Rédaction de l'article…","Génération des déclinaisons…","Post LinkedIn…","Finalisation…"];
  const gen=async()=>{
    if(!form.sujet.trim()){setErr("Renseigne un sujet.");return;}if(!form.pilier){setErr("Sélectionne un pilier.");return;}
    setErr("");setLoading(true);let mi=0;setMsg(MSGS[0]);
    const iv=setInterval(()=>{mi=Math.min(mi+1,MSGS.length-1);setMsg(MSGS[mi]);},2200);
    try{const p=PED.find(x=>x.id===form.pilier);const t=TONS.find(x=>x.id===form.ton);
      const a=await callAPI(ASYS,`Sujet:${form.sujet}\nPilier:${p?.label}\nAngle:${form.angle||"Non précisé"}\nProblème:${form.probleme||"Non précisé"}\nMots-clés:${form.motscles||"Non précisé"}\nTon:${t?.label}`);
      setArt(a);
      const d=await callAPI(DSYS_ED,`Titre:${a.titre}\nAccroche:${a.accroche}\nPilier:${p?.label}`);
      clearInterval(iv);setDecl(d);
      // SYNC SUPABASE
      await syncToSupabase('contenus', {
        titre: a.titre || form.sujet,
        type_contenu: 'article',
        canal: 'linkedin',
        pilier: p?.label || '',
        date_pub: new Date().toISOString().slice(0,10),
        texte_genere: true,
        source_agent: 'editorial',
      }, 'diagnostic');
    }catch(e){clearInterval(iv);setErr("Erreur. Réessaie.");}finally{setLoading(false);}
  };
  const reset=()=>{setArt(null);setDecl(null);setErr("");};
  const artTxt=art?`# ${art.titre}\n\n${art.accroche}\n\n${(art.sections||[]).map(s=>`## ${s.h2}\n${s.contenu}`).join("\n\n")}\n\n${art.conclusion}\n\n${art.cta}`:"";
  const getDt=id=>id==="carousel"?(decl?.carousel||[]).map((s,i)=>`Slide ${i+1}: ${s}`).join("\n"):decl?.[id]||"";

  if(art&&decl){
    const p=PED.find(x=>x.id===form.pilier);
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,paddingBottom:14,borderBottom:"1px solid rgba(45,10,62,.08)"}}>
        <div><span style={{background:"#F5A623",color:"#2D0A3E",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20}}>{p?.icon} {p?.label?.toUpperCase()}</span><div className="cz3-serif" style={{fontSize:m?18:22,color:"#2D0A3E",marginTop:5}}>{art.titre}</div></div>
        <button onClick={reset} className="cz3-btn-sm">← Nouveau</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:14}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><SL t="Article"/><CopyBtn text={artTxt}/></div>
          <div className="cz3-card" style={{padding:"14px 16px",fontSize:13,lineHeight:1.75}}>
            <div style={{fontWeight:600,marginBottom:7,fontSize:14}}>{art.titre}</div>
            <div style={{color:"#F5A623",fontStyle:"italic",marginBottom:9,paddingBottom:9,borderBottom:"1px solid rgba(45,10,62,.06)",fontSize:12}}>{art.accroche}</div>
            {(art.sections||[]).map((s,i)=><div key={i} style={{marginBottom:9}}><div style={{fontWeight:600,marginBottom:3}}>{s.h2}</div><div style={{fontSize:12,color:"#7C6A8E",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.contenu}</div></div>)}
            <div style={{paddingTop:9,borderTop:"1px solid rgba(45,10,62,.06)"}}><div style={{fontSize:12,color:"#7C6A8E",marginBottom:5,lineHeight:1.7}}>{art.conclusion}</div><div style={{fontSize:12,fontWeight:600,color:"#F5A623"}}>{art.cta}</div></div>
          </div>
        </div>
        <div>
          <SL t="5 Déclinaisons"/>
          <div className="cz3-tabs-scroll" style={{marginBottom:9}}>{DTABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`cz3-tab${tab===t.id?" sel":""}`} style={{fontSize:11,padding:"5px 10px"}}>{t.label}</button>)}</div>
          <div className="cz3-card" style={{padding:"13px 15px",minHeight:220}}>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><CopyBtn text={getDt(tab)}/></div>
            {tab!=="carousel"?<div style={{fontSize:12,color:"#2D1B4E",lineHeight:1.8,whiteSpace:"pre-line"}}>{decl[tab]||""}</div>:
            <div>{(decl.carousel||[]).map((s,i)=><div key={i} style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:4}}><span style={{fontSize:10,fontWeight:700,color:"#F5A623",marginRight:7}}>S{i+1}</span><span style={{fontSize:12}}>{s}</span></div>)}</div>}
          </div>
        </div>
      </div>
    </div>);
  }

  return(<div>
    <div style={{background:"linear-gradient(135deg,#2D0A3E 0%,#1A0652 100%)",borderRadius:14,padding:m?"24px 20px 30px":"34px 30px 40px",marginBottom:20}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".16em",color:"rgba(245,166,35,.55)",textTransform:"uppercase",marginBottom:10}}>Agent Éditorial</div>
      <div className="cz3-serif" style={{fontSize:m?26:32,color:"#F0E8FC",lineHeight:1.2,marginBottom:8}}>Générer votre article<br/><span style={{fontStyle:"italic",color:"rgba(245,166,35,.75)"}}>+ 5 déclinaisons</span></div>
    </div>
    <div style={{marginBottom:14}}><SL t="Pilier CapZeniths"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
        {PED.map(p=><div key={p.id} onClick={()=>sf("pilier",p.id)} className={`cz3-pillar${form.pilier===p.id?" sel":""}`}><div style={{fontSize:m?18:20,marginBottom:3}}>{p.icon}</div><div style={{fontSize:m?10:11,fontWeight:600,color:form.pilier===p.id?"#F5A623":"#7C6A8E"}}>{p.label}</div></div>)}
      </div>
    </div>
    <div style={{marginBottom:12}}><SL t="Sujet"/><input className="cz3-inp" value={form.sujet} onChange={e=>sf("sujet",e.target.value)} placeholder="Ex. : Les 3 erreurs de trésorerie qui tuent une entreprise"/></div>
    <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:10,marginBottom:12}}>
      <div><SL t="Angle" opt/><input className="cz3-inp" value={form.angle} onChange={e=>sf("angle",e.target.value)} placeholder="Ex. : Les chiffres que personne ne dit"/></div>
      <div><SL t="Problème" opt/><input className="cz3-inp" value={form.probleme} onChange={e=>sf("probleme",e.target.value)} placeholder="Ex. : Ne sait pas lire son bilan"/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:10,marginBottom:22}}>
      <div><SL t="Mots-clés SEO" opt/><input className="cz3-inp" value={form.motscles} onChange={e=>sf("motscles",e.target.value)} placeholder="Ex. : trésorerie PME, BFR"/></div>
      <div><SL t="Ton"/><select className="cz3-sel" value={form.ton} onChange={e=>sf("ton",e.target.value)}>{TONS.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
    </div>
    {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
    {loading?<Spin msg={msg}/>:<button className="cz3-btn" onClick={gen} disabled={!form.sujet||!form.pilier}>→ Générer l'article + 5 déclinaisons</button>}
  </div>);
}

// ── ADMIN ────────────────────────────────────────────────────────
const fmt=n=>Number(n||0).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});
const today=()=>new Date().toLocaleDateString("fr-FR");
const newNum=pfx=>`${pfx}-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;
const RSYS=`Tu es l'Agent Admin de CapZeniths. Email de relance professionnel pour facture impayée. RÉPONDS EN JSON VALIDE sans backticks.
{"objet":"","corps":"<email complet>","conseil":"<note interne>"}`;
const RCSYS=`Tu es l'Agent Admin de CapZeniths. Récapitulatif mensuel direct et actionnable. RÉPONDS EN JSON VALIDE sans backticks.
{"synthese":"<3-4 phrases>","indicateurs":[{"label":"CA du mois","valeur":"","tendance":"hausse"},{"label":"Clients actifs","valeur":"","tendance":"stable"},{"label":"Séances","valeur":"","tendance":"stable"},{"label":"Taux renouvellement","valeur":"","tendance":"stable"}],"alertes":[""],"actions":["","",""]}`;

function DocPreview({type,form,totals,onBack}) {
  const {totalHT,totalTVA,totalTTC}=totals;
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:16}} className="no-print"><button onClick={onBack} className="cz3-btn-sm">← Modifier</button><button onClick={()=>window.print()} className="cz3-btn" style={{width:"auto"}}>🖨 Imprimer / PDF</button></div>
    <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"24px",fontFamily:"Georgia,serif",color:"#111"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:"3px solid #F5A623",flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:16,fontWeight:700,color:"#2D0A3E",marginBottom:2}}>CapZeniths</div><div style={{fontSize:10,color:"#555"}}>Conseil Prévention Défaillance · ogan@capzeniths.com</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700}}>{type==="devis"?"DEVIS":"FACTURE"}</div><div style={{fontSize:11,color:"#555"}}>N° {form.numero} · {form.date}</div>{type==="devis"&&<div style={{fontSize:11,color:"#555"}}>Valide {form.validite} jours</div>}{type==="facture"&&form.echeance&&<div style={{fontSize:11,color:"#555"}}>Échéance : {form.echeance}</div>}</div>
      </div>
      <div style={{marginBottom:16}}><div style={{fontSize:14,fontWeight:700}}>{form.client.nom||"—"}</div>{form.client.email&&<div style={{fontSize:12,color:"#555"}}>{form.client.email}</div>}</div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
        <thead><tr style={{background:"#2D0A3E",color:"#F5A623"}}><th style={{padding:"7px 10px",textAlign:"left",fontSize:10,width:35}}>QTÉ</th><th style={{padding:"7px 10px",textAlign:"left",fontSize:10}}>DÉSIGNATION</th><th style={{padding:"7px 10px",textAlign:"right",fontSize:10,width:90}}>P.U. (€)</th><th style={{padding:"7px 10px",textAlign:"right",fontSize:10,width:100}}>MONTANT</th></tr></thead>
        <tbody>{form.prestations.map((p,i)=>(<tr key={i} style={{background:i%2===0?"#FFFBF0":"#fff",borderBottom:"1px solid #EDE9F5"}}><td style={{padding:"8px 10px",fontSize:12,textAlign:"center"}}>{p.quantite}</td><td style={{padding:"8px 10px"}}><div style={{fontSize:13,fontWeight:500}}>{p.titre||"—"}</div>{p.description&&<div style={{fontSize:11,color:"#666"}}>{p.description}</div>}</td><td style={{padding:"8px 10px",fontSize:12,textAlign:"right"}}>{fmt(p.prix)}</td><td style={{padding:"8px 10px",fontSize:13,fontWeight:600,textAlign:"right"}}>{fmt(p.quantite*p.prix)}</td></tr>))}</tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><div style={{minWidth:200}}><div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #EDE9F5",fontSize:12}}><span>Total HT</span><strong>{fmt(totalHT)} €</strong></div>{form.tva&&<div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #EDE9F5",fontSize:12}}><span>TVA ({form.tauxTva}%)</span><strong>{fmt(totalTVA)} €</strong></div>}<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:14,fontWeight:700,color:"#2D0A3E"}}><span>Total {form.tva?"TTC":"HT"}</span><span>{fmt(totalTTC)} €</span></div></div></div>
      {form.conditions&&<div style={{padding:"8px 12px",background:"#FFFBF0",borderRadius:6,borderLeft:"3px solid #F5A623",fontSize:12,color:"#444"}}>{form.conditions}</div>}
      {type==="facture"&&form.iban&&<div style={{marginTop:8,padding:"8px 12px",background:"#F0FDF4",borderRadius:6,borderLeft:"3px solid #10B981",fontSize:12,color:"#444"}}>IBAN : {form.iban}</div>}
    </div>
  </div>);
}

function DocForm({type}) {
  const m=useM();
  const [form,setForm]=useState({numero:newNum(type==="devis"?"DEV":"FAC"),date:today(),validite:"30",echeance:"",client:{nom:"",email:"",adresse:""},prestations:[{titre:"",description:"",quantite:1,prix:0}],tva:false,tauxTva:20,conditions:type==="devis"?"Paiement à réception de facture.":"Paiement sous 30 jours.",iban:""});
  const [preview,setPreview]=useState(false);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));const sc=(k,v)=>setForm(f=>({...f,client:{...f.client,[k]:v}}));
  const sl=(i,k,v)=>setForm(f=>({...f,prestations:f.prestations.map((p,j)=>j===i?{...p,[k]:v}:p)}));
  const addL=()=>setForm(f=>({...f,prestations:[...f.prestations,{titre:"",description:"",quantite:1,prix:0}]}));
  const delL=i=>setForm(f=>({...f,prestations:f.prestations.filter((_,j)=>j!==i)}));
  const tHT=form.prestations.reduce((s,p)=>s+(Number(p.quantite||0)*Number(p.prix||0)),0);
  const tTVA=form.tva?tHT*(Number(form.tauxTva)/100):0;
  if(preview)return<DocPreview type={type} form={form} totals={{totalHT:tHT,totalTVA:tTVA,totalTTC:tHT+tTVA}} onBack={()=>setPreview(false)}/>;
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:m?"1fr 1fr":"1fr 1fr 1fr",gap:8,marginBottom:14}}>
      <div><SL t={`N° ${type==="devis"?"Devis":"Facture"}`}/><input className="cz3-inp" value={form.numero} onChange={e=>sf("numero",e.target.value)}/></div>
      <div><SL t="Date"/><input className="cz3-inp" value={form.date} onChange={e=>sf("date",e.target.value)}/></div>
      {type==="devis"&&<div><SL t="Validité (j)"/><input className="cz3-inp" value={form.validite} onChange={e=>sf("validite",e.target.value)}/></div>}
      {type==="facture"&&<div><SL t="Échéance"/><input className="cz3-inp" value={form.echeance} onChange={e=>sf("echeance",e.target.value)} placeholder="jj/mm/aaaa"/></div>}
    </div>
    <div style={{marginBottom:14}}><SL t="Client"/><div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:8}}><input className="cz3-inp" value={form.client.nom} onChange={e=>sc("nom",e.target.value)} placeholder="Nom / Entreprise"/><input className="cz3-inp" value={form.client.email} onChange={e=>sc("email",e.target.value)} placeholder="Email"/></div></div>
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SL t="Prestations"/><button onClick={addL} className="cz3-btn-sm" style={{color:"#F5A623",borderColor:"#F5A623"}}>+ Ajouter</button></div>
      {form.prestations.map((p,i)=>(<div key={i} style={{padding:"9px 11px",borderRadius:10,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:6}}><div style={{display:"grid",gridTemplateColumns:m?"1fr 60px 80px":"1fr 70px 90px auto",gap:6,alignItems:"center",marginBottom:5}}><input className="cz3-inp" value={p.titre} onChange={e=>sl(i,"titre",e.target.value)} placeholder="Titre"/><input className="cz3-inp" value={p.quantite} onChange={e=>sl(i,"quantite",e.target.value)} placeholder="Qté"/><input className="cz3-inp" value={p.prix} onChange={e=>sl(i,"prix",e.target.value)} placeholder="Prix HT €"/>{!m&&form.prestations.length>1&&<button onClick={()=>delL(i)} className="cz3-btn-sm" style={{color:"#991B1B",borderColor:"#FCA5A5"}}>✕</button>}</div><input className="cz3-inp" value={p.description} onChange={e=>sl(i,"description",e.target.value)} placeholder="Description (optionnel)"/></div>))}
      <div style={{display:"flex",justifyContent:"flex-end",gap:12,padding:"7px 0",fontSize:13}}><span>HT : <strong>{fmt(tHT)} €</strong></span>{form.tva&&<span>TVA : <strong>{fmt(tTVA)} €</strong></span>}<span style={{color:"#F5A623",fontWeight:700}}>Total : <strong>{fmt(tHT+tTVA)} €</strong></span></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:10,marginBottom:14}}>
      <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><input type="checkbox" checked={form.tva} onChange={e=>sf("tva",e.target.checked)}/><SL t="TVA"/>{form.tva&&<input className="cz3-inp" value={form.tauxTva} onChange={e=>sf("tauxTva",e.target.value)} style={{width:60}}/>}</div></div>
      {type==="facture"&&<div><SL t="IBAN" opt/><input className="cz3-inp" value={form.iban} onChange={e=>sf("iban",e.target.value)} placeholder="FR76 xxxx…"/></div>}
    </div>
    <div style={{marginBottom:20}}><SL t="Conditions"/><textarea className="cz3-inp" value={form.conditions} onChange={e=>sf("conditions",e.target.value)} rows={2} style={{resize:"vertical"}}/></div>
    <button className="cz3-btn" onClick={()=>setPreview(true)}>→ Prévisualiser {type==="devis"?"le devis":"la facture"}</button>
  </div>);
}

function RelanceModule() {
  const m=useM();
  const RTONS=[{id:"courtois",label:"Courtois (1ère)"},{id:"ferme",label:"Ferme (2ème)"},{id:"urgent",label:"Urgent (mise en demeure)"}];
  const [form,setForm]=useState({client:"",facture:"",montant:"",jours:"",ton:"courtois",notes:""});
  const [res,setRes]=useState(null);const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const gen=async()=>{if(!form.client||!form.montant){setErr("Client et montant requis.");return;}setErr("");setLoading(true);
    try{const r=await callAPI(RSYS,`Client:${form.client}\nFacture:${form.facture||"N/A"}\nMontant:${form.montant}€\nRetard:${form.jours||"?"}j\nTon:${RTONS.find(t=>t.id===form.ton)?.label}\nNotes:${form.notes||"Aucune"}`);setRes(r);}
    catch(e){setErr("Erreur.");}finally{setLoading(false);}
  };
  if(res)return(<div>
    <div className="cz3-card" style={{padding:"11px 15px",marginBottom:9}}><SL t="Objet"/><div style={{fontSize:13,fontWeight:600}}>{res.objet}</div></div>
    <div className="cz3-card" style={{padding:"13px 15px",marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><SL t="Corps"/><CopyBtn text={`Objet: ${res.objet}\n\n${res.corps}`}/></div><div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-line"}}>{res.corps}</div></div>
    {res.conseil&&<div style={{padding:"9px 13px",borderRadius:10,border:"1px solid #FCD34D",background:"#FEF3C7",marginBottom:12}}><SL t="Note interne"/><div style={{fontSize:12,color:"#78350F"}}>{res.conseil}</div></div>}
    <button onClick={()=>setRes(null)} className="cz3-btn-sm">← Nouvelle relance</button>
  </div>);
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:10,marginBottom:14}}>
      <div><SL t="Client"/><input className="cz3-inp" value={form.client} onChange={e=>sf("client",e.target.value)} placeholder="Nom"/></div>
      <div><SL t="N° Facture" opt/><input className="cz3-inp" value={form.facture} onChange={e=>sf("facture",e.target.value)} placeholder="FAC-2026-001"/></div>
      <div><SL t="Montant (€)"/><input className="cz3-inp" value={form.montant} onChange={e=>sf("montant",e.target.value)} placeholder="1 500"/></div>
      <div><SL t="Jours de retard" opt/><input className="cz3-inp" value={form.jours} onChange={e=>sf("jours",e.target.value)} placeholder="15"/></div>
    </div>
    <div style={{marginBottom:14}}><SL t="Niveau"/>
      <div style={{display:"flex",gap:6,flexDirection:m?"column":"row"}}>{RTONS.map(t=><div key={t.id} onClick={()=>sf("ton",t.id)} style={{flex:1,padding:"8px 10px",borderRadius:10,cursor:"pointer",textAlign:"center",fontSize:12,border:form.ton===t.id?"1.5px solid #F5A623":"1px solid rgba(45,10,62,.12)",background:form.ton===t.id?"#FFFBF0":"#fff",color:form.ton===t.id?"#F5A623":"#7C6A8E",fontWeight:form.ton===t.id?600:400}}>{t.label}</div>)}</div>
    </div>
    <div style={{marginBottom:20}}><SL t="Contexte" opt/><textarea className="cz3-inp" value={form.notes} onChange={e=>sf("notes",e.target.value)} rows={2} style={{resize:"vertical"}}/></div>
    {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:12,padding:"9px 13px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
    {loading?<Spin msg="Rédaction…"/>:<button className="cz3-btn" onClick={gen}>→ Générer l'email de relance</button>}
  </div>);
}

function RecapModule() {
  const m=useM();
  const MOIS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const [form,setForm]=useState({mois:MOIS[new Date().getMonth()],annee:new Date().getFullYear(),ca:"",clients:"",seances:"",objectif:"",notes:""});
  const [res,setRes]=useState(null);const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const tI=t=>t==="hausse"?"↗":t==="baisse"?"↘":"→";const tC=t=>t==="hausse"?"#10B981":t==="baisse"?"#EF4444":"#F59E0B";
  const gen=async()=>{if(!form.ca&&!form.clients){setErr("CA ou clients requis.");return;}setErr("");setLoading(true);
    try{const r=await callAPI(RCSYS,`Période:${form.mois} ${form.annee}\nCA:${form.ca||"?"}€\nClients:${form.clients||"?"}\nSéances:${form.seances||"?"}\nObjectif:${form.objectif||"?"}\nNotes:${form.notes||"Aucune"}`);setRes(r);}
    catch(e){setErr("Erreur.");}finally{setLoading(false);}
  };
  if(res)return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:15,fontWeight:600}}>{form.mois} {form.annee}</div><div style={{display:"flex",gap:8}}><CopyBtn text={`${form.mois} ${form.annee}\n\n${res.synthese}\n\nAlertes:\n${(res.alertes||[]).join("\n")}\n\nActions:\n${(res.actions||[]).join("\n")}`}/><button onClick={()=>setRes(null)} className="cz3-btn-sm">← Nouveau</button></div></div>
    <div className="cz3-card" style={{padding:"16px 18px",marginBottom:10,borderTop:"4px solid #F5A623"}}><SL t="Synthèse"/><p style={{margin:0,fontSize:13,lineHeight:1.8}}>{res.synthese}</p></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10}}>{(res.indicateurs||[]).map((ind,i)=><div key={i} className="cz3-card" style={{padding:"11px 13px"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:"#B8A898",marginBottom:4,textTransform:"uppercase"}}>{ind.label}</div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:17,fontWeight:600}}>{ind.valeur||"—"}</span><span style={{fontSize:14,color:tC(ind.tendance)}}>{tI(ind.tendance)}</span></div></div>)}</div>
    {(res.alertes||[]).filter(Boolean).length>0&&<div style={{marginBottom:10}}>{res.alertes.filter(Boolean).map((a,i)=><div key={i} style={{fontSize:13,padding:"7px 12px",borderRadius:9,border:"1px solid #FCA5A5",background:"#FFF5F5",marginBottom:4,display:"flex",gap:7}}><span>⚠️</span><span>{a}</span></div>)}</div>}
    <div>{(res.actions||[]).filter(Boolean).map((a,i)=><div key={i} style={{fontSize:13,padding:"7px 12px",borderRadius:9,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:4,display:"flex",gap:7}}><span style={{color:"#F5A623",fontWeight:700}}>{i+1}.</span><span>{a}</span></div>)}</div>
  </div>);
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:m?"1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:14}}>
      <div><SL t="Mois"/><select className="cz3-sel" value={form.mois} onChange={e=>sf("mois",e.target.value)}>{MOIS.map(m=><option key={m}>{m}</option>)}</select></div>
      <div><SL t="Année"/><input className="cz3-inp" value={form.annee} onChange={e=>sf("annee",e.target.value)}/></div>
      <div><SL t="Objectif (€)" opt/><input className="cz3-inp" value={form.objectif} onChange={e=>sf("objectif",e.target.value)} placeholder="5 000"/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
      <div><SL t="CA (€)"/><input className="cz3-inp" value={form.ca} onChange={e=>sf("ca",e.target.value)} placeholder="4 200"/></div>
      <div><SL t="Clients"/><input className="cz3-inp" value={form.clients} onChange={e=>sf("clients",e.target.value)} placeholder="8"/></div>
      <div><SL t="Séances"/><input className="cz3-inp" value={form.seances} onChange={e=>sf("seances",e.target.value)} placeholder="14"/></div>
    </div>
    <div style={{marginBottom:20}}><SL t="Faits marquants" opt/><textarea className="cz3-inp" value={form.notes} onChange={e=>sf("notes",e.target.value)} rows={2} style={{resize:"vertical"}}/></div>
    {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:12,padding:"9px 13px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
    {loading?<Spin msg="Génération…"/>:<button className="cz3-btn" onClick={gen}>→ Générer le récapitulatif</button>}
  </div>);
}

function AgentAdmin() {
  const [tab,setTab]=useState("devis");
  const ATABS=[{id:"devis",icon:"📄",label:"Devis"},{id:"facture",icon:"🧾",label:"Facture"},{id:"relance",icon:"📧",label:"Relance"},{id:"recap",icon:"📊",label:"Récap"}];
  return(<div>
    <div style={{background:"linear-gradient(135deg,#2D0A3E 0%,#1A0652 100%)",borderRadius:14,padding:"24px 24px 30px",marginBottom:18}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".16em",color:"rgba(245,166,35,.55)",textTransform:"uppercase",marginBottom:8}}>Agent Admin</div>
      <div className="cz3-serif" style={{fontSize:26,color:"#F0E8FC",lineHeight:1.2}}>Gestion commerciale<br/><span style={{fontStyle:"italic",color:"rgba(245,166,35,.75)"}}>& reporting</span></div>
    </div>
    <div className="cz3-tabs-scroll" style={{marginBottom:18,borderBottom:"1px solid rgba(45,10,62,.08)",paddingBottom:12}}>
      {ATABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`cz3-tab${tab===t.id?" sel":""}`}>{t.icon} {t.label}</button>)}
    </div>
    {tab==="devis"&&<DocForm type="devis"/>}{tab==="facture"&&<DocForm type="facture"/>}{tab==="relance"&&<RelanceModule/>}{tab==="recap"&&<RecapModule/>}
  </div>);
}

// ── MAIN ─────────────────────────────────────────────────────────
const MODS=[{id:"diagnostic",icon:"🎯",label:"Diagnostic"},{id:"editorial",icon:"✍️",label:"Éditorial"},{id:"admin",icon:"📋",label:"Admin"}];

export default function App() {
  const [mod,setMod]=useState("diagnostic");
  const m=useM();
  useEffect(()=>{ injectStyles(); },[]);
  return(
    <div className="cz3">
      <nav style={{background:"#FFF8E8",borderBottom:"2px solid #F5A623",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:800,margin:"0 auto",height:54,display:"flex",alignItems:"center",padding:"0 16px",gap:8}}>
          <Logo height={m?26:30}/>
          <div className="cz3-tabs-scroll" style={{flex:1,marginLeft:8}}>
            {MODS.map(md=>(
              <button key={md.id} onClick={()=>setMod(md.id)} className={`cz3-mod-tab${mod===md.id?" sel":""}`}>
                <span>{md.icon}</span>{!m&&<span>{md.label}</span>}
                {m&&<span style={{fontSize:10}}>{md.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div style={{maxWidth:800,margin:"0 auto",padding:m?"12px 12px 40px":"24px 20px"}}>
        <div className="cz3-card" style={{padding:m?"16px 16px 20px":"26px 26px 30px"}}>
          {mod==="diagnostic"&&<AgentDiagnostic/>}
          {mod==="editorial"&&<AgentEditorial/>}
          {mod==="admin"&&<AgentAdmin/>}
        </div>
      </div>
    </div>
  );
}
