import { useState, useRef, useCallback, useEffect } from "react";

// ── STYLES ──────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("cz-v2-s")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.id = "cz-v2-s";
  s.textContent = `
    .cz2 *{box-sizing:border-box;}
    .cz2{font-family:'Outfit',sans-serif;background:#FAF8F5;min-height:100vh;color:#2D1B4E;}
    .cz2-serif{font-family:'DM Serif Display',serif;}
    .cz2-card{background:#fff;border-radius:18px;border:1px solid rgba(45,10,62,.08);box-shadow:0 1px 4px rgba(45,10,62,.06),0 6px 20px rgba(45,10,62,.04);}
    .cz2-inp{width:100%;padding:11px 15px;border:1.5px solid rgba(45,10,62,.15);border-radius:10px;background:#fff;color:#2D1B4E;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:all .2s;}
    .cz2-inp:focus{border-color:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.12);}
    .cz2-sel{appearance:none;width:100%;padding:11px 15px;border:1.5px solid rgba(45,10,62,.15);border-radius:10px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23F5A623' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;color:#2D1B4E;font-family:'Outfit',sans-serif;font-size:14px;outline:none;cursor:pointer;transition:all .2s;}
    .cz2-sel:focus{border-color:#F5A623;}
    .cz2-btn{background:#F5A623;color:#2D0A3E;border:none;border-radius:13px;padding:14px 28px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;}
    .cz2-btn:hover:not(:disabled){background:#E09A1A;box-shadow:0 4px 18px rgba(245,166,35,.32);transform:translateY(-1px);}
    .cz2-btn:disabled{opacity:.38;cursor:not-allowed;}
    .cz2-btn-sm{background:transparent;color:#7C6A8E;border:1px solid rgba(45,10,62,.15);border-radius:8px;padding:5px 12px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;cursor:pointer;transition:all .15s;}
    .cz2-btn-sm:hover{border-color:#F5A623;color:#F5A623;}
    .cz2-mod-tab{padding:8px 16px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:none;background:transparent;color:rgba(45,10,62,.5);transition:all .2s;display:flex;align-items:center;gap:6px;}
    .cz2-mod-tab:hover{color:#2D0A3E;background:rgba(45,10,62,.06);}
    .cz2-mod-tab.sel{background:#2D0A3E;color:#F5A623;font-weight:600;}
    .cz2-tab{padding:8px 18px;border-radius:100px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid transparent;transition:all .2s;background:transparent;color:#7C6A8E;}
    .cz2-tab:hover{color:#F5A623;background:rgba(245,166,35,.07);}
    .cz2-tab.sel{background:#F5A623;color:#2D0A3E;font-weight:700;}
    .cz2-pillar{border:1.5px solid rgba(45,10,62,.12);border-radius:12px;padding:13px 8px 10px;cursor:pointer;text-align:center;background:#fff;transition:all .2s;user-select:none;}
    .cz2-pillar:hover{border-color:#F5A623;transform:translateY(-2px);}
    .cz2-pillar.sel{border-color:#F5A623;background:#FFFBF0;box-shadow:0 4px 16px rgba(245,166,35,.18);}
    .cz2-n-opt{flex:1;padding:10px 4px;text-align:center;border-radius:10px;cursor:pointer;border:1.5px solid rgba(45,10,62,.12);background:#fff;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:#7C6A8E;transition:all .18s;}
    .cz2-n-opt:hover{border-color:#F5A623;color:#F5A623;}
    .cz2-n-opt.sel{border-color:#F5A623;background:#F5A623;color:#2D0A3E;}
    .cz2-answer{padding:11px 14px;border-radius:10px;border:1.5px solid rgba(45,10,62,.1);background:#FAFAF8;font-size:13px;color:#2D1B4E;font-family:'Outfit',sans-serif;line-height:1.5;}
    .cz2-answer.ok{border-color:#10B981;background:#ECFDF5;color:#065F46;font-weight:600;}
    @keyframes cz2Up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cz2Spin{to{transform:rotate(360deg)}}
    .cz2-up{animation:cz2Up .4s ease forwards;}
    .cz2-up1{animation:cz2Up .4s .08s ease both;}
    .cz2-up2{animation:cz2Up .4s .18s ease both;}
    .cz2-up3{animation:cz2Up .4s .28s ease both;}
    @media print{.no-print{display:none!important}.cz2{background:#fff}.cz2-card{box-shadow:none;border:1px solid #e0d8f0;}}
  `;
  document.head.appendChild(s);
};

// ── LOGO ────────────────────────────────────────────────────────
const Logo = ({ height=34 }) => (
  <svg viewBox="0 0 210 60" height={height} style={{display:"block"}} xmlns="http://www.w3.org/2000/svg" aria-label="CapZeniths">
    <circle cx="30" cy="30" r="28" fill="#2D0A3E"/>
    <rect x="14" y="37" width="9" height="9"  rx="1.5" fill="#F5A623"/>
    <rect x="26" y="28" width="9" height="18" rx="1.5" fill="#F5A623"/>
    <rect x="38" y="18" width="9" height="28" rx="1.5" fill="#F5A623"/>
    <polygon points="42.5,6.5 43.8,10.2 47.7,10.3 44.6,12.7 45.7,16.5 42.5,14.2 39.3,16.5 40.4,12.7 37.3,10.3 41.2,10.2" fill="#F5A623"/>
    <text x="66" y="41" fontFamily="'Outfit',sans-serif" fontSize="25" fontWeight="700" fill="#F5A623">Cap</text>
    <text x="109" y="41" fontFamily="'Outfit',sans-serif" fontSize="25" fontWeight="700" fill="#9B8ED4">Zeniths</text>
  </svg>
);

// ── SHARED UTILS ────────────────────────────────────────────────
const callAPI = async (system, content) => {
  const res = await fetch("/api/analyze", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content}]}),
  });
  const data = await res.json();
  return JSON.parse((data.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
};

const CopyBtn = ({text}) => {
  const [ok,setOk]=useState(false);
  return <button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),2000);}} className="cz2-btn-sm" style={ok?{borderColor:"#10B981",color:"#10B981"}:{}}>{ok?"✓ Copié":"Copier"}</button>;
};

const Spinner = ({msg}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0"}}>
    <div style={{width:16,height:16,border:"2px solid #F5A623",borderTopColor:"transparent",borderRadius:"50%",animation:"cz2Spin .8s linear infinite"}}/>
    <span style={{fontSize:13,color:"#7C6A8E"}}>{msg}</span>
  </div>
);

const SLabel = ({ch,opt}) => <div style={{fontSize:10,fontWeight:700,letterSpacing:".12em",color:"#B8A898",marginBottom:8,textTransform:"uppercase"}}>{ch}{opt&&<span style={{fontWeight:400,opacity:.6,marginLeft:6}}>(optionnel)</span>}</div>;

// ── AGENT DIAGNOSTIC ────────────────────────────────────────────
const DIAG_SYS = `Tu es l'Agent Diagnostic de CapZeniths, spécialiste prévention défaillance business. Analyse le PDF Cap-Diag ou les réponses et génère un rapport L1.1. 7 piliers : Cash, Stratégie, Clients, Équipe, Risques, Croissance, Résilience. Score 1-3=ROUGE, 4-6=ORANGE, 7-10=VERT. Style direct, anti-bullshit, spécifique. RÉPONDS EN JSON VALIDE sans backticks.
{"clientExtrait":{"nom":"","entreprise":"","secteur":"","type":"","ca":"","anciennete":""},"scoreGlobal":0,"niveauRisque":"MODÉRÉ","synthese":"","pilliers":[{"nom":"Cash","score":0,"statut":"ORANGE","diagnostic":""}],"pointsCritiques":[{"titre":"","description":"","impact":""}],"planAction":{"j30":[],"j60":[],"j90":[]},"prochainesEtapes":""}`;
const PICONS = {Cash:"💰",Stratégie:"🎯",Clients:"🤝",Équipe:"👥",Risques:"⚠️",Croissance:"📈",Résilience:"🛡️"};
const SS = {ROUGE:{bg:"#FEE2E2",text:"#991B1B",border:"#FCA5A5",dot:"#EF4444"},ORANGE:{bg:"#FEF3C7",text:"#92400E",border:"#FCD34D",dot:"#F59E0B"},VERT:{bg:"#D1FAE5",text:"#065F46",border:"#6EE7B7",dot:"#10B981"}};
const RS = {CRITIQUE:{bg:"#7F1D1D",text:"#FEE2E2"},ÉLEVÉ:{bg:"#78350F",text:"#FEF3C7"},MODÉRÉ:{bg:"#713F12",text:"#FEF9C3"},FAIBLE:{bg:"#064E3B",text:"#D1FAE5"}};

function AgentDiagnostic() {
  const [pdf,setPdf]=useState(null); const [b64,setB64]=useState(null); const [ctx,setCtx]=useState("");
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState(""); const [pct,setPct]=useState(0);
  const [report,setReport]=useState(null); const [err,setErr]=useState(""); const [drag,setDrag]=useState(false);
  const ref=useRef(null);
  const MSGS=["Lecture du rapport…","Analyse des 7 piliers…","Évaluation des risques…","Construction du plan…","Finalisation…"];
  const readPdf=f=>new Promise((r,j)=>{const rd=new FileReader();rd.onload=()=>r(rd.result.split(",")[1]);rd.onerror=j;rd.readAsDataURL(f);});
  const handleFile=useCallback(async f=>{if(!f)return;if(f.type!=="application/pdf"){setErr("PDF uniquement.");return;}setErr("");setPdf(f);setB64(await readPdf(f));},[]);
  const generate=async()=>{
    if(!b64&&!ctx.trim()){setErr("Importe un PDF ou ajoute du contexte.");return;}
    setErr("");setLoading(true);setPct(8);let mi=0;setMsg(MSGS[0]);
    const iv=setInterval(()=>{mi=Math.min(mi+1,MSGS.length-1);setMsg(MSGS[mi]);setPct(Math.round((mi/(MSGS.length-1))*85));},2000);
    try {
      const uc=[];
      if(b64)uc.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}});
      uc.push({type:"text",text:"Analyse et génère le rapport L1.1."+(ctx.trim()?"\n\nContexte : "+ctx:"")});
      const data=await callAPI(DIAG_SYS,uc);
      clearInterval(iv);setPct(100);setReport(data);
    }catch(e){clearInterval(iv);setErr("Erreur. Réessaie.");}finally{setLoading(false);}
  };
  const reset=()=>{setReport(null);setPdf(null);setB64(null);setCtx("");setErr("");setPct(0);};
  const ScoreBar=({score})=>(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:5,background:"rgba(45,10,62,.08)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${score*10}%`,height:"100%",borderRadius:3,background:score<=3?"#EF4444":score<=6?"#F59E0B":"#10B981"}}/></div><span style={{fontSize:13,fontWeight:600,minWidth:18}}>{score}</span></div>);

  if(report){
    const c=report.clientExtrait||{};const risk=RS[report.niveauRisque]||RS["MODÉRÉ"];
    const date=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
    const cl=[c.entreprise,c.nom].filter(v=>v&&!v.includes("trouvé")).join(" — ");
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:18,borderBottom:"1px solid rgba(45,10,62,.08)"}}>
          <div><div style={{fontSize:10,fontWeight:700,letterSpacing:".12em",color:"#B8A898",marginBottom:6,textTransform:"uppercase"}}>{date.toUpperCase()}</div>
            <div className="cz2-serif" style={{fontSize:28,color:"#2D0A3E",lineHeight:1.2}}>{cl||"Rapport Diagnostic"}</div>
            {[c.secteur,c.type,c.ca].filter(v=>v&&!v.includes("trouvé")).join(" · ")&&<div style={{fontSize:12,color:"#7C6A8E",marginTop:3}}>{[c.secteur,c.type,c.ca].filter(v=>v&&!v.includes("trouvé")).join(" · ")}</div>}
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
            <div className="cz2-serif" style={{fontSize:38,color:"#2D0A3E",lineHeight:1}}>{report.scoreGlobal}<span style={{fontSize:15,color:"#B8A898"}}>/10</span></div>
            <div style={{marginTop:6,display:"inline-block",padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:risk.bg,color:risk.text}}>RISQUE {report.niveauRisque}</div>
          </div>
        </div>
        <div className="cz2-card" style={{padding:"22px 26px",marginBottom:14,borderTop:"4px solid #F5A623"}}>
          <SLabel ch="Synthèse"/><p style={{margin:0,fontSize:14,color:"#2D1B4E",lineHeight:1.8}}>{report.synthese}</p>
        </div>
        <div style={{marginBottom:14}}>
          <SLabel ch="7 Piliers"/>
          {(report.pilliers||[]).map(p=>{const s=SS[p.statut]||SS.ORANGE;return(
            <div key={p.nom} className="cz2-card" style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",marginBottom:6}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:s.dot,flexShrink:0}}/>
              <span style={{fontSize:16,flexShrink:0}}>{PICONS[p.nom]}</span>
              <span style={{width:88,fontSize:13,fontWeight:600,flexShrink:0}}>{p.nom}</span>
              <div style={{flex:1}}><ScoreBar score={p.score}/></div>
              <div style={{fontSize:12,color:"#7C6A8E",flex:2,lineHeight:1.5}}>{p.diagnostic}</div>
              <div style={{flexShrink:0,padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:s.bg,color:s.text,border:`1px solid ${s.border}`}}>{p.statut}</div>
            </div>
          );})}
        </div>
        <div style={{marginBottom:14}}>
          <SLabel ch="Points critiques"/>
          {(report.pointsCritiques||[]).map((p,i)=>(
            <div key={i} style={{padding:"14px 18px",borderRadius:13,border:"1.5px solid #FCA5A5",background:"#FFF5F5",marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:700,color:"#7F1D1D",marginBottom:5}}><span style={{opacity:.4,marginRight:8}}>{i+1}.</span>{p.titre}</div>
              <div style={{fontSize:12,color:"#7F1D1D",lineHeight:1.65,marginBottom:4}}>{p.description}</div>
              <div style={{fontSize:11,color:"#991B1B",display:"flex",gap:6}}><span style={{opacity:.6}}>Impact :</span><span>{p.impact}</span></div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:14}}>
          <SLabel ch="Plan d'action"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[{label:"J+30",actions:report.planAction?.j30,color:"#F5A623"},{label:"J+60",actions:report.planAction?.j60,color:"#9B8ED4"},{label:"J+90",actions:report.planAction?.j90,color:"#10B981"}].map(({label,actions,color})=>(
              <div key={label} className="cz2-card" style={{padding:"14px 16px"}}>
                <div style={{fontSize:12,fontWeight:700,color,marginBottom:8,paddingBottom:7,borderBottom:"1px solid rgba(45,10,62,.06)"}}>{label}</div>
                {(actions||[]).map((a,i)=><div key={i} style={{fontSize:12,color:"#3D2A5C",marginBottom:6,display:"flex",gap:7,lineHeight:1.55}}><span style={{color,flexShrink:0,fontWeight:700}}>→</span><span>{a}</span></div>)}
              </div>
            ))}
          </div>
        </div>
        <div className="cz2-card" style={{padding:"18px 22px",borderTop:"4px solid #F5A623",marginBottom:20}}>
          <SLabel ch="Recommandation CapZeniths"/>
          <p style={{margin:0,fontSize:14,color:"#2D1B4E",lineHeight:1.8}}>{report.prochainesEtapes}</p>
        </div>
        <div style={{display:"flex",gap:10}} className="no-print">
          <button onClick={reset} className="cz2-btn-sm">← Nouveau diagnostic</button>
          <button onClick={()=>window.print()} className="cz2-btn-sm">🖨 PDF</button>
        </div>
      </div>
    );
  }

  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#2D0A3E 0%,#1A0652 100%)",borderRadius:14,padding:"36px 32px 42px",marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".16em",color:"rgba(245,166,35,.55)",textTransform:"uppercase",marginBottom:10}}>Agent Diagnostic</div>
        <div className="cz2-serif" style={{fontSize:32,color:"#F0E8FC",lineHeight:1.2,marginBottom:8}}>Générer votre rapport<br/><span style={{fontStyle:"italic",color:"rgba(245,166,35,.75)"}}>diagnostic L1.1</span></div>
        <div style={{fontSize:13,color:"rgba(240,232,252,.5)",lineHeight:1.7}}>Importez le PDF Cap-Diag — l'agent génère le rapport complet automatiquement.</div>
      </div>
      <div style={{marginBottom:20}}>
        <SLabel ch="Rapport Cap-Diag (PDF)"/>
        {!pdf?(
          <div onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onClick={()=>ref.current?.click()}
            style={{border:`2px dashed ${drag?"#F5A623":"rgba(45,10,62,.15)"}`,borderRadius:14,padding:"32px",textAlign:"center",cursor:"pointer",background:drag?"#FFFBF0":"#FAFAF8",transition:"all .15s"}}>
            <div style={{fontSize:28,marginBottom:8}}>📄</div>
            <div className="cz2-serif" style={{fontSize:16,color:"#2D1B4E",marginBottom:5,fontStyle:"italic"}}>Glisse-dépose le PDF ici</div>
            <div style={{fontSize:13,color:"#7C6A8E",marginBottom:12}}>ou clique pour sélectionner</div>
            <span style={{fontSize:12,padding:"6px 14px",borderRadius:20,border:"1.5px solid rgba(45,10,62,.15)",color:"#7C6A8E"}}>Parcourir…</span>
            <input ref={ref} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:13,border:"1.5px solid #10B981",background:"#ECFDF5"}}>
            <span style={{fontSize:22}}>✅</span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#065F46"}}>{pdf.name}</div><div style={{fontSize:11,color:"#047857",marginTop:2}}>{(pdf.size/1024).toFixed(0)} Ko · Prêt</div></div>
            <button onClick={()=>{setPdf(null);setB64(null);}} className="cz2-btn-sm" style={{color:"#065F46",borderColor:"#6EE7B7"}}>Changer</button>
          </div>
        )}
      </div>
      <div style={{marginBottom:22}}>
        <SLabel ch="Contexte complémentaire" opt/>
        <textarea className="cz2-inp" value={ctx} onChange={e=>setCtx(e.target.value)} rows={3} placeholder="Notes de l'appel découverte…" style={{resize:"vertical",lineHeight:1.6}}/>
      </div>
      {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
      {loading?(
        <div>
          <div style={{height:3,background:"rgba(245,166,35,.15)",borderRadius:2,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",background:"#F5A623",borderRadius:2,width:`${pct}%`,transition:"width .6s ease"}}/>
          </div>
          <Spinner msg={msg}/>
        </div>
      ):<button className="cz2-btn" onClick={generate} disabled={!b64&&!ctx.trim()}>→ Générer le rapport L1.1</button>}
    </div>
  );
}

// ── AGENT ÉDITORIAL ─────────────────────────────────────────────
const PILLIERS_ED = [{id:"cash",icon:"💰",label:"Cash"},{id:"strategie",icon:"🎯",label:"Stratégie"},{id:"clients",icon:"🤝",label:"Clients"},{id:"equipe",icon:"👥",label:"Équipe"},{id:"risques",icon:"⚠️",label:"Risques"},{id:"croissance",icon:"📈",label:"Croissance"},{id:"resilience",icon:"🛡️",label:"Résilience"}];
const TONS_ED = [{id:"antibullshit",label:"Anti-bullshit"},{id:"pedagogique",label:"Pédagogique"},{id:"provocateur",label:"Provocateur"},{id:"narratif",label:"Storytelling"}];
const DECL_TABS = [{id:"linkedin",label:"LinkedIn"},{id:"newsletter",label:"Newsletter"},{id:"video",label:"Vidéo 60s"},{id:"carousel",label:"Carousel"},{id:"instagram",label:"Instagram"}];
const ART_SYS=`Tu es l'Agent Éditorial de CapZeniths, spécialiste prévention défaillance business. Style direct, anti-bullshit, tutoiement, concret. RÉPONDS EN JSON VALIDE sans backticks.
{"titre":"<max 70 chars>","accroche":"<2-3 phrases percutantes>","sections":[{"h2":"<titre>","contenu":"<2 paragraphes>"},{"h2":"","contenu":""},{"h2":"","contenu":""}],"conclusion":"<1 paragraphe>","cta":"<1 phrase vers cap-diag>"}`;
const DECL_SYS=`Tu es l'Agent Éditorial de CapZeniths. Génère 5 déclinaisons de l'article fourni. Direct, anti-bullshit, tutoiement. RÉPONDS EN JSON VALIDE sans backticks.
{"linkedin":"<post complet>","newsletter":"<titre + 3-4 lignes + lien>","video":"<script 60s>","carousel":["<Slide 1>","<Slide 2>","<Slide 3>","<Slide 4>","<Slide 5>"],"instagram":"<2-3 lignes + 5 hashtags>"}`;

function AgentEditorial() {
  const [form,setForm]=useState({sujet:"",pilier:"",angle:"",probleme:"",motscles:"",ton:"antibullshit"});
  const [article,setArticle]=useState(null); const [decl,setDecl]=useState(null);
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
  const [tab,setTab]=useState("linkedin"); const [err,setErr]=useState("");
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const MSGS=["Analyse du pilier…","Rédaction de l'article…","Génération des déclinaisons…","Post LinkedIn, newsletter…","Finalisation…"];
  const generate=async()=>{
    if(!form.sujet.trim()){setErr("Renseigne un sujet.");return;}
    if(!form.pilier){setErr("Sélectionne un pilier.");return;}
    setErr("");setLoading(true);let mi=0;setMsg(MSGS[0]);
    const iv=setInterval(()=>{mi=Math.min(mi+1,MSGS.length-1);setMsg(MSGS[mi]);},2200);
    try {
      const p=PILLIERS_ED.find(x=>x.id===form.pilier);const t=TONS_ED.find(x=>x.id===form.ton);
      const art=await callAPI(ART_SYS,`Sujet : ${form.sujet}\nPilier : ${p?.label}\nAngle : ${form.angle||"Non précisé"}\nProblème : ${form.probleme||"Non précisé"}\nMots-clés : ${form.motscles||"Non précisé"}\nTon : ${t?.label}`);
      setArticle(art);
      const dl=await callAPI(DECL_SYS,`Titre : ${art.titre}\nAccroche : ${art.accroche}\nPilier : ${p?.label}`);
      clearInterval(iv);setDecl(dl);
    }catch(e){clearInterval(iv);setErr("Erreur. Réessaie.");}finally{setLoading(false);}
  };
  const reset=()=>{setArticle(null);setDecl(null);setErr("");};
  if(article&&decl){
    const p=PILLIERS_ED.find(x=>x.id===form.pilier);
    const artTxt=`# ${article.titre}\n\n${article.accroche}\n\n${article.sections.map(s=>`## ${s.h2}\n${s.contenu}`).join("\n\n")}\n\n${article.conclusion}\n\n${article.cta}`;
    const getDt=id=>id==="carousel"?(decl.carousel||[]).map((s,i)=>`Slide ${i+1} : ${s}`).join("\n"):decl[id]||"";
    return(
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:14,borderBottom:"1px solid rgba(45,10,62,.08)"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{background:"#F5A623",color:"#2D0A3E",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20}}>{p?.icon} {p?.label?.toUpperCase()}</span></div>
            <div className="cz2-serif" style={{fontSize:22,color:"#2D0A3E"}}>{article.titre}</div>
          </div>
          <button onClick={reset} className="cz2-btn-sm">← Nouvel article</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SLabel ch="Article pilier"/><CopyBtn text={artTxt}/></div>
            <div className="cz2-card" style={{padding:"16px 18px",fontSize:13,lineHeight:1.75}}>
              <div style={{fontWeight:600,marginBottom:8,fontSize:14}}>{article.titre}</div>
              <div style={{color:"#F5A623",fontStyle:"italic",marginBottom:10,paddingBottom:10,borderBottom:"1px solid rgba(45,10,62,.06)",fontSize:12}}>{article.accroche}</div>
              {article.sections.map((s,i)=><div key={i} style={{marginBottom:10}}><div style={{fontWeight:600,marginBottom:4}}>{s.h2}</div><div style={{fontSize:12,color:"#7C6A8E",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.contenu}</div></div>)}
              <div style={{paddingTop:10,borderTop:"1px solid rgba(45,10,62,.06)"}}><div style={{fontSize:12,color:"#7C6A8E",marginBottom:6,lineHeight:1.7}}>{article.conclusion}</div><div style={{fontSize:12,fontWeight:600,color:"#F5A623"}}>{article.cta}</div></div>
            </div>
          </div>
          <div>
            <SLabel ch="5 Déclinaisons"/>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
              {DECL_TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`cz2-tab${tab===t.id?" sel":""}`} style={{fontSize:11,padding:"5px 10px"}}>{t.label}</button>)}
            </div>
            <div className="cz2-card" style={{padding:"14px 16px",minHeight:260}}>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}><CopyBtn text={tab==="carousel"?(decl.carousel||[]).map((s,i)=>`Slide ${i+1} : ${s}`).join("\n"):decl[tab]||""}/></div>
              {tab!=="carousel"?<div style={{fontSize:12,color:"#2D1B4E",lineHeight:1.8,whiteSpace:"pre-line"}}>{decl[tab]||""}</div>:
              <div>{(decl.carousel||[]).map((s,i)=><div key={i} style={{padding:"7px 12px",borderRadius:8,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:5}}><span style={{fontSize:10,fontWeight:700,color:"#F5A623",marginRight:8}}>Slide {i+1}</span><span style={{fontSize:12}}>{s}</span></div>)}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#2D0A3E 0%,#1A0652 100%)",borderRadius:14,padding:"36px 32px 42px",marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".16em",color:"rgba(245,166,35,.55)",textTransform:"uppercase",marginBottom:10}}>Agent Éditorial</div>
        <div className="cz2-serif" style={{fontSize:32,color:"#F0E8FC",lineHeight:1.2,marginBottom:8}}>Générer votre article<br/><span style={{fontStyle:"italic",color:"rgba(245,166,35,.75)"}}>+ 5 déclinaisons</span></div>
        <div style={{fontSize:13,color:"rgba(240,232,252,.5)",lineHeight:1.7}}>Renseignez le brief — l'agent rédige l'article et génère les 5 formats automatiquement.</div>
      </div>
      <div style={{marginBottom:16}}>
        <SLabel ch="Pilier CapZeniths"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
          {PILLIERS_ED.map(p=><div key={p.id} onClick={()=>sf("pilier",p.id)} className={`cz2-pillar${form.pilier===p.id?" sel":""}`}><div style={{fontSize:20,marginBottom:4}}>{p.icon}</div><div style={{fontSize:11,fontWeight:600,color:form.pilier===p.id?"#F5A623":"#7C6A8E"}}>{p.label}</div></div>)}
        </div>
      </div>
      <div style={{marginBottom:14}}><SLabel ch="Sujet"/><input className="cz2-inp" value={form.sujet} onChange={e=>sf("sujet",e.target.value)} placeholder="Ex. : Les 3 erreurs de trésorerie qui tuent une entreprise en 90 jours"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><SLabel ch="Angle" opt/><input className="cz2-inp" value={form.angle} onChange={e=>sf("angle",e.target.value)} placeholder="Ex. : Les chiffres que personne ne dit"/></div>
        <div><SLabel ch="Problème" opt/><input className="cz2-inp" value={form.probleme} onChange={e=>sf("probleme",e.target.value)} placeholder="Ex. : Ne sait pas lire son bilan"/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
        <div><SLabel ch="Mots-clés SEO" opt/><input className="cz2-inp" value={form.motscles} onChange={e=>sf("motscles",e.target.value)} placeholder="Ex. : trésorerie PME, BFR"/></div>
        <div><SLabel ch="Ton"/><select className="cz2-sel" value={form.ton} onChange={e=>sf("ton",e.target.value)}>{TONS_ED.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
      </div>
      {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
      {loading?<Spinner msg={msg}/>:<button className="cz2-btn" onClick={generate} disabled={!form.sujet||!form.pilier}>→ Générer l'article + 5 déclinaisons</button>}
    </div>
  );
}

// ── AGENT ADMIN ─────────────────────────────────────────────────
const fmt=n=>Number(n||0).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});
const today=()=>new Date().toLocaleDateString("fr-FR");
const newNum=pfx=>`${pfx}-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;
const REL_SYS=`Tu es l'Agent Admin de CapZeniths. Tu rédiges des emails de relance professionnels pour factures impayées. Adapte le ton selon le niveau. RÉPONDS EN JSON VALIDE sans backticks.
{"objet":"<objet>","corps":"<email complet>","conseil":"<note interne>"}`;
const RECAP_SYS=`Tu es l'Agent Admin de CapZeniths. Tu génères des récapitulatifs d'activité mensuels directs. RÉPONDS EN JSON VALIDE sans backticks.
{"synthese":"<3-4 phrases>","indicateurs":[{"label":"CA du mois","valeur":"","tendance":"hausse"},{"label":"Clients actifs","valeur":"","tendance":"stable"},{"label":"Séances réalisées","valeur":"","tendance":"hausse"},{"label":"Taux renouvellement","valeur":"","tendance":"stable"}],"alertes":["<alerte>"],"actions":["<action 1>","<action 2>","<action 3>"]}`;

function DocPreview({type,form,totals,onBack}) {
  const {totalHT,totalTVA,totalTTC}=totals;
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:18}} className="no-print">
      <button onClick={onBack} className="cz2-btn-sm">← Modifier</button>
      <button onClick={()=>window.print()} className="cz2-btn">🖨 Imprimer / PDF</button>
    </div>
    <div id="print-zone" style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"32px",fontFamily:"Georgia,serif",color:"#111"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:18,borderBottom:"3px solid #F5A623"}}>
        <div><div style={{fontSize:18,fontWeight:700,color:"#2D0A3E",marginBottom:3}}>CapZeniths</div><div style={{fontSize:11,color:"#555"}}>Conseil Prévention Défaillance</div><div style={{fontSize:11,color:"#555"}}>ogan@capzeniths.com · capzeniths.com</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,letterSpacing:".05em"}}>{type==="devis"?"DEVIS":"FACTURE"}</div><div style={{fontSize:12,color:"#555",marginTop:3}}>N° {form.numero}</div><div style={{fontSize:12,color:"#555"}}>Date : {form.date}</div>{type==="devis"&&<div style={{fontSize:12,color:"#555"}}>Valide {form.validite} jours</div>}{type==="facture"&&<div style={{fontSize:12,color:"#555"}}>Échéance : {form.echeance}</div>}</div>
      </div>
      <div style={{marginBottom:20}}><div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",color:"#777",marginBottom:6}}>DESTINATAIRE</div><div style={{fontSize:14,fontWeight:700}}>{form.client.nom||"—"}</div>{form.client.email&&<div style={{fontSize:12,color:"#555"}}>{form.client.email}</div>}{form.client.adresse&&<div style={{fontSize:12,color:"#555"}}>{form.client.adresse}</div>}</div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:18}}>
        <thead><tr style={{background:"#2D0A3E",color:"#F5A623"}}><th style={{padding:"8px 12px",textAlign:"left",fontSize:11,width:40}}>QTÉ</th><th style={{padding:"8px 12px",textAlign:"left",fontSize:11}}>DÉSIGNATION</th><th style={{padding:"8px 12px",textAlign:"right",fontSize:11,width:100}}>P.U. (€)</th><th style={{padding:"8px 12px",textAlign:"right",fontSize:11,width:110}}>MONTANT (€)</th></tr></thead>
        <tbody>{form.prestations.map((p,i)=>(<tr key={i} style={{background:i%2===0?"#FFFBF0":"#fff",borderBottom:"1px solid #EDE9F5"}}><td style={{padding:"10px 12px",fontSize:13,textAlign:"center"}}>{p.quantite}</td><td style={{padding:"10px 12px"}}><div style={{fontSize:13,fontWeight:500}}>{p.titre||"—"}</div>{p.description&&<div style={{fontSize:11,color:"#666"}}>{p.description}</div>}</td><td style={{padding:"10px 12px",fontSize:13,textAlign:"right"}}>{fmt(p.prix)}</td><td style={{padding:"10px 12px",fontSize:13,fontWeight:600,textAlign:"right"}}>{fmt(p.quantite*p.prix)}</td></tr>))}</tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}><div style={{minWidth:220}}><div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #EDE9F5",fontSize:13}}><span>Total HT</span><strong>{fmt(totalHT)} €</strong></div>{form.tva&&<div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #EDE9F5",fontSize:13}}><span>TVA ({form.tauxTva}%)</span><strong>{fmt(totalTVA)} €</strong></div>}<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:15,fontWeight:700,color:"#2D0A3E"}}><span>Total {form.tva?"TTC":"HT"}</span><span>{fmt(totalTTC)} €</span></div></div></div>
      {form.conditions&&<div style={{padding:"10px 14px",background:"#FFFBF0",borderRadius:6,borderLeft:"3px solid #F5A623"}}><div style={{fontSize:10,fontWeight:700,color:"#F5A623",marginBottom:3}}>CONDITIONS</div><div style={{fontSize:12,color:"#444"}}>{form.conditions}</div></div>}
      {type==="facture"&&form.iban&&<div style={{marginTop:10,padding:"10px 14px",background:"#F0FDF4",borderRadius:6,borderLeft:"3px solid #10B981"}}><div style={{fontSize:10,fontWeight:700,color:"#065F46",marginBottom:3}}>IBAN</div><div style={{fontSize:12,color:"#444"}}>{form.iban}</div></div>}
    </div>
  </div>);
}

function DevisModule() {
  const [form,setForm]=useState({numero:newNum("DEV"),date:today(),validite:"30",client:{nom:"",email:"",adresse:""},prestations:[{titre:"",description:"",quantite:1,prix:0}],tva:false,tauxTva:20,conditions:"Paiement à réception de facture."});
  const [preview,setPreview]=useState(false);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v})); const sc=(k,v)=>setForm(f=>({...f,client:{...f.client,[k]:v}}));
  const sl=(i,k,v)=>setForm(f=>({...f,prestations:f.prestations.map((p,j)=>j===i?{...p,[k]:v}:p)}));
  const addL=()=>setForm(f=>({...f,prestations:[...f.prestations,{titre:"",description:"",quantite:1,prix:0}]}));
  const delL=i=>setForm(f=>({...f,prestations:f.prestations.filter((_,j)=>j!==i)}));
  const tHT=form.prestations.reduce((s,p)=>s+(Number(p.quantite||0)*Number(p.prix||0)),0);
  const tTVA=form.tva?tHT*(Number(form.tauxTva)/100):0;
  if(preview)return <DocPreview type="devis" form={form} totals={{totalHT:tHT,totalTVA:tTVA,totalTTC:tHT+tTVA}} onBack={()=>setPreview(false)}/>;
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}><div><SLabel ch="N° Devis"/><input className="cz2-inp" value={form.numero} onChange={e=>sf("numero",e.target.value)}/></div><div><SLabel ch="Date"/><input className="cz2-inp" value={form.date} onChange={e=>sf("date",e.target.value)}/></div><div><SLabel ch="Validité (jours)"/><input className="cz2-inp" value={form.validite} onChange={e=>sf("validite",e.target.value)}/></div></div>
    <div style={{marginBottom:14}}><SLabel ch="Client"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><input className="cz2-inp" value={form.client.nom} onChange={e=>sc("nom",e.target.value)} placeholder="Nom / Entreprise"/><input className="cz2-inp" value={form.client.email} onChange={e=>sc("email",e.target.value)} placeholder="Email"/><div style={{gridColumn:"1/-1"}}><input className="cz2-inp" value={form.client.adresse} onChange={e=>sc("adresse",e.target.value)} placeholder="Adresse (optionnel)"/></div></div></div>
    <div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SLabel ch="Prestations"/><button onClick={addL} className="cz2-btn-sm" style={{color:"#F5A623",borderColor:"#F5A623"}}>+ Ajouter</button></div>
      {form.prestations.map((p,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:10,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:7}}><div style={{display:"grid",gridTemplateColumns:"1fr 70px 90px auto",gap:7,alignItems:"center",marginBottom:6}}><input className="cz2-inp" value={p.titre} onChange={e=>sl(i,"titre",e.target.value)} placeholder="Titre"/><input className="cz2-inp" value={p.quantite} onChange={e=>sl(i,"quantite",e.target.value)} placeholder="Qté"/><input className="cz2-inp" value={p.prix} onChange={e=>sl(i,"prix",e.target.value)} placeholder="Prix HT €"/>{form.prestations.length>1&&<button onClick={()=>delL(i)} className="cz2-btn-sm" style={{color:"#991B1B",borderColor:"#FCA5A5"}}>✕</button>}</div><input className="cz2-inp" value={p.description} onChange={e=>sl(i,"description",e.target.value)} placeholder="Description (optionnel)"/></div>))}
      <div style={{display:"flex",justifyContent:"flex-end",gap:16,padding:"8px 0",fontSize:13}}><span>Total HT : <strong>{fmt(tHT)} €</strong></span>{form.tva&&<span>TVA : <strong>{fmt(tTVA)} €</strong></span>}<span style={{color:"#F5A623",fontWeight:700}}>Total : <strong>{fmt(tHT+tTVA)} €</strong></span></div>
    </div>
    <div style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><input type="checkbox" checked={form.tva} onChange={e=>sf("tva",e.target.checked)}/><SLabel ch="TVA applicable"/>{form.tva&&<input className="cz2-inp" value={form.tauxTva} onChange={e=>sf("tauxTva",e.target.value)} style={{width:70}}/>}</div></div>
    <div style={{marginBottom:22}}><SLabel ch="Conditions"/><textarea className="cz2-inp" value={form.conditions} onChange={e=>sf("conditions",e.target.value)} rows={2} style={{resize:"vertical"}}/></div>
    <button className="cz2-btn" onClick={()=>setPreview(true)}>→ Prévisualiser le devis</button>
  </div>);
}

function FactureModule() {
  const [form,setForm]=useState({numero:newNum("FAC"),date:today(),echeance:"",client:{nom:"",email:"",adresse:""},prestations:[{titre:"",description:"",quantite:1,prix:0}],tva:false,tauxTva:20,conditions:"Paiement sous 30 jours.",iban:""});
  const [preview,setPreview]=useState(false);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v})); const sc=(k,v)=>setForm(f=>({...f,client:{...f.client,[k]:v}}));
  const sl=(i,k,v)=>setForm(f=>({...f,prestations:f.prestations.map((p,j)=>j===i?{...p,[k]:v}:p)}));
  const addL=()=>setForm(f=>({...f,prestations:[...f.prestations,{titre:"",description:"",quantite:1,prix:0}]}));
  const delL=i=>setForm(f=>({...f,prestations:f.prestations.filter((_,j)=>j!==i)}));
  const tHT=form.prestations.reduce((s,p)=>s+(Number(p.quantite||0)*Number(p.prix||0)),0);
  const tTVA=form.tva?tHT*(Number(form.tauxTva)/100):0;
  if(preview)return <DocPreview type="facture" form={form} totals={{totalHT:tHT,totalTVA:tTVA,totalTTC:tHT+tTVA}} onBack={()=>setPreview(false)}/>;
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}><div><SLabel ch="N° Facture"/><input className="cz2-inp" value={form.numero} onChange={e=>sf("numero",e.target.value)}/></div><div><SLabel ch="Date"/><input className="cz2-inp" value={form.date} onChange={e=>sf("date",e.target.value)}/></div><div><SLabel ch="Échéance"/><input className="cz2-inp" value={form.echeance} onChange={e=>sf("echeance",e.target.value)} placeholder="jj/mm/aaaa"/></div></div>
    <div style={{marginBottom:14}}><SLabel ch="Client"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><input className="cz2-inp" value={form.client.nom} onChange={e=>sc("nom",e.target.value)} placeholder="Nom / Entreprise"/><input className="cz2-inp" value={form.client.email} onChange={e=>sc("email",e.target.value)} placeholder="Email"/><div style={{gridColumn:"1/-1"}}><input className="cz2-inp" value={form.client.adresse} onChange={e=>sc("adresse",e.target.value)} placeholder="Adresse (optionnel)"/></div></div></div>
    <div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SLabel ch="Prestations"/><button onClick={addL} className="cz2-btn-sm" style={{color:"#F5A623",borderColor:"#F5A623"}}>+ Ajouter</button></div>
      {form.prestations.map((p,i)=>(<div key={i} style={{padding:"10px 12px",borderRadius:10,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:7}}><div style={{display:"grid",gridTemplateColumns:"1fr 70px 90px auto",gap:7,alignItems:"center",marginBottom:6}}><input className="cz2-inp" value={p.titre} onChange={e=>sl(i,"titre",e.target.value)} placeholder="Titre"/><input className="cz2-inp" value={p.quantite} onChange={e=>sl(i,"quantite",e.target.value)} placeholder="Qté"/><input className="cz2-inp" value={p.prix} onChange={e=>sl(i,"prix",e.target.value)} placeholder="Prix HT €"/>{form.prestations.length>1&&<button onClick={()=>delL(i)} className="cz2-btn-sm" style={{color:"#991B1B",borderColor:"#FCA5A5"}}>✕</button>}</div><input className="cz2-inp" value={p.description} onChange={e=>sl(i,"description",e.target.value)} placeholder="Description (optionnel)"/></div>))}
      <div style={{display:"flex",justifyContent:"flex-end",gap:16,padding:"8px 0",fontSize:13}}><span>Total HT : <strong>{fmt(tHT)} €</strong></span>{form.tva&&<span>TVA : <strong>{fmt(tTVA)} €</strong></span>}<span style={{color:"#F5A623",fontWeight:700}}>Total : <strong>{fmt(tHT+tTVA)} €</strong></span></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><input type="checkbox" checked={form.tva} onChange={e=>sf("tva",e.target.checked)}/><SLabel ch="TVA"/>{form.tva&&<input className="cz2-inp" value={form.tauxTva} onChange={e=>sf("tauxTva",e.target.value)} style={{width:70}}/>}</div></div><div><SLabel ch="IBAN" opt/><input className="cz2-inp" value={form.iban} onChange={e=>sf("iban",e.target.value)} placeholder="FR76 xxxx…"/></div></div>
    <div style={{marginBottom:22}}><SLabel ch="Conditions"/><textarea className="cz2-inp" value={form.conditions} onChange={e=>sf("conditions",e.target.value)} rows={2} style={{resize:"vertical"}}/></div>
    <button className="cz2-btn" onClick={()=>setPreview(true)}>→ Prévisualiser la facture</button>
  </div>);
}

function RelanceModule() {
  const TONS=[{id:"courtois",label:"Courtois (1ère relance)"},{id:"ferme",label:"Ferme (2ème relance)"},{id:"urgent",label:"Urgent (mise en demeure)"}];
  const [form,setForm]=useState({client:"",facture:"",montant:"",jours:"",ton:"courtois",notes:""});
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const generate=async()=>{
    if(!form.client||!form.montant){setErr("Client et montant requis.");return;}
    setErr(""); setLoading(true);
    try { const r=await callAPI(REL_SYS,`Client : ${form.client}\nFacture : ${form.facture||"N/A"}\nMontant : ${form.montant} €\nRetard : ${form.jours||"?"} jours\nTon : ${TONS.find(t=>t.id===form.ton)?.label}\nNotes : ${form.notes||"Aucune"}`); setResult(r); }
    catch(e){setErr("Erreur. Réessaie.");} finally{setLoading(false);}
  };
  if(result)return(<div>
    <div className="cz2-card" style={{padding:"12px 16px",marginBottom:10}}><SLabel ch="Objet"/><div style={{fontSize:13,fontWeight:600}}>{result.objet}</div></div>
    <div className="cz2-card" style={{padding:"14px 16px",marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SLabel ch="Corps de l'email"/><CopyBtn text={`Objet : ${result.objet}\n\n${result.corps}`}/></div><div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-line"}}>{result.corps}</div></div>
    {result.conseil&&<div style={{padding:"10px 14px",borderRadius:10,border:"1px solid #FCD34D",background:"#FEF3C7",marginBottom:14}}><SLabel ch="Note interne"/><div style={{fontSize:12,color:"#78350F"}}>{result.conseil}</div></div>}
    <button onClick={()=>setResult(null)} className="cz2-btn-sm">← Nouvelle relance</button>
  </div>);
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div><SLabel ch="Client"/><input className="cz2-inp" value={form.client} onChange={e=>sf("client",e.target.value)} placeholder="Nom du client"/></div><div><SLabel ch="N° Facture" opt/><input className="cz2-inp" value={form.facture} onChange={e=>sf("facture",e.target.value)} placeholder="FAC-2026-001"/></div><div><SLabel ch="Montant (€)"/><input className="cz2-inp" value={form.montant} onChange={e=>sf("montant",e.target.value)} placeholder="1 500"/></div><div><SLabel ch="Jours de retard" opt/><input className="cz2-inp" value={form.jours} onChange={e=>sf("jours",e.target.value)} placeholder="15"/></div></div>
    <div style={{marginBottom:14}}><SLabel ch="Niveau de relance"/><div style={{display:"flex",gap:8}}>{TONS.map(t=><div key={t.id} onClick={()=>sf("ton",t.id)} style={{flex:1,padding:"8px 10px",borderRadius:10,cursor:"pointer",textAlign:"center",fontSize:12,border:form.ton===t.id?`1.5px solid #F5A623`:"1px solid rgba(45,10,62,.12)",background:form.ton===t.id?"#FFFBF0":"#fff",color:form.ton===t.id?"#F5A623":"#7C6A8E",fontWeight:form.ton===t.id?600:400,transition:"all .15s"}}>{t.label}</div>)}</div></div>
    <div style={{marginBottom:22}}><SLabel ch="Contexte" opt/><textarea className="cz2-inp" value={form.notes} onChange={e=>sf("notes",e.target.value)} rows={2} placeholder="Ex. : Client habituellement sérieux…" style={{resize:"vertical"}}/></div>
    {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:12,padding:"9px 13px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
    {loading?<Spinner msg="Rédaction de l'email…"/>:<button className="cz2-btn" onClick={generate}>→ Générer l'email de relance</button>}
  </div>);
}

function RecapModule() {
  const MOIS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const [form,setForm]=useState({mois:MOIS[new Date().getMonth()],annee:new Date().getFullYear(),ca:"",clients:"",seances:"",objectif:"",notes:""});
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const tendIcon=t=>t==="hausse"?"↗":t==="baisse"?"↘":"→"; const tendColor=t=>t==="hausse"?"#10B981":t==="baisse"?"#EF4444":"#F59E0B";
  const generate=async()=>{
    if(!form.ca&&!form.clients){setErr("CA ou clients requis.");return;}
    setErr(""); setLoading(true);
    try { const r=await callAPI(RECAP_SYS,`Période : ${form.mois} ${form.annee}\nCA : ${form.ca||"?"} €\nClients : ${form.clients||"?"}\nSéances : ${form.seances||"?"}\nObjectif : ${form.objectif||"?"}\nNotes : ${form.notes||"Aucune"}`); setResult(r); }
    catch(e){setErr("Erreur. Réessaie.");} finally{setLoading(false);}
  };
  if(result)return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontSize:15,fontWeight:600}}>{form.mois} {form.annee}</div><div style={{display:"flex",gap:8}}><CopyBtn text={`${form.mois} ${form.annee}\n\n${result.synthese}\n\nAlertes:\n${(result.alertes||[]).join("\n")}\n\nActions:\n${(result.actions||[]).join("\n")}`}/><button onClick={()=>setResult(null)} className="cz2-btn-sm">← Nouveau</button></div></div>
    <div className="cz2-card" style={{padding:"16px 20px",marginBottom:12,borderTop:"4px solid #F5A623"}}><SLabel ch="Synthèse"/><p style={{margin:0,fontSize:14,lineHeight:1.8}}>{result.synthese}</p></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:12}}>{(result.indicateurs||[]).map((ind,i)=><div key={i} className="cz2-card" style={{padding:"12px 14px"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:"#B8A898",marginBottom:5,textTransform:"uppercase"}}>{ind.label}</div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18,fontWeight:600,color:"#2D0A3E"}}>{ind.valeur||"—"}</span><span style={{fontSize:14,color:tendColor(ind.tendance)}}>{tendIcon(ind.tendance)}</span></div></div>)}</div>
    {(result.alertes||[]).length>0&&<div style={{marginBottom:12}}>{result.alertes.map((a,i)=><div key={i} style={{fontSize:13,padding:"8px 12px",borderRadius:10,border:"1px solid #FCA5A5",background:"#FFF5F5",marginBottom:5,display:"flex",gap:8}}><span>⚠️</span><span>{a}</span></div>)}</div>}
    <div>{(result.actions||[]).map((a,i)=><div key={i} style={{fontSize:13,padding:"8px 12px",borderRadius:10,border:"1px solid rgba(45,10,62,.08)",background:"#FAFAF8",marginBottom:5,display:"flex",gap:8}}><span style={{color:"#F5A623",fontWeight:700}}>{i+1}.</span><span>{a}</span></div>)}</div>
  </div>);
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}><div><SLabel ch="Mois"/><select className="cz2-sel" value={form.mois} onChange={e=>sf("mois",e.target.value)}>{MOIS.map(m=><option key={m}>{m}</option>)}</select></div><div><SLabel ch="Année"/><input className="cz2-inp" value={form.annee} onChange={e=>sf("annee",e.target.value)}/></div><div><SLabel ch="Objectif (€)" opt/><input className="cz2-inp" value={form.objectif} onChange={e=>sf("objectif",e.target.value)} placeholder="5 000"/></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}><div><SLabel ch="CA réalisé (€)"/><input className="cz2-inp" value={form.ca} onChange={e=>sf("ca",e.target.value)} placeholder="4 200"/></div><div><SLabel ch="Clients actifs"/><input className="cz2-inp" value={form.clients} onChange={e=>sf("clients",e.target.value)} placeholder="8"/></div><div><SLabel ch="Séances"/><input className="cz2-inp" value={form.seances} onChange={e=>sf("seances",e.target.value)} placeholder="14"/></div></div>
    <div style={{marginBottom:22}}><SLabel ch="Faits marquants" opt/><textarea className="cz2-inp" value={form.notes} onChange={e=>sf("notes",e.target.value)} rows={3} placeholder="Ex. : 2 nouveaux clients, 1 client en pause…" style={{resize:"vertical"}}/></div>
    {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:12,padding:"9px 13px",background:"#FEE2E2",borderRadius:10}}>⚠️ {err}</div>}
    {loading?<Spinner msg="Génération du récapitulatif…"/>:<button className="cz2-btn" onClick={generate}>→ Générer le récapitulatif</button>}
  </div>);
}

function AgentAdmin() {
  const [tab,setTab]=useState("devis");
  const ATABS=[{id:"devis",icon:"📄",label:"Devis"},{id:"facture",icon:"🧾",label:"Facture"},{id:"relance",icon:"📧",label:"Relance"},{id:"recap",icon:"📊",label:"Récapitulatif"}];
  return(<div>
    <div style={{background:"linear-gradient(135deg,#2D0A3E 0%,#1A0652 100%)",borderRadius:14,padding:"28px 32px 34px",marginBottom:22}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".16em",color:"rgba(245,166,35,.55)",textTransform:"uppercase",marginBottom:8}}>Agent Admin</div>
      <div className="cz2-serif" style={{fontSize:28,color:"#F0E8FC",lineHeight:1.2,marginBottom:6}}>Gestion commerciale<br/><span style={{fontStyle:"italic",color:"rgba(245,166,35,.75)"}}>& reporting</span></div>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:22,borderBottom:"1px solid rgba(45,10,62,.08)",paddingBottom:14}}>
      {ATABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`cz2-tab${tab===t.id?" sel":""}`}>{t.icon} {t.label}</button>)}
    </div>
    {tab==="devis"&&<DevisModule/>}{tab==="facture"&&<FactureModule/>}{tab==="relance"&&<RelanceModule/>}{tab==="recap"&&<RecapModule/>}
  </div>);
}

// ── APP PRINCIPALE ───────────────────────────────────────────────
const MODULES=[{id:"diagnostic",icon:"🎯",label:"Diagnostic",sub:"Rapport L1.1"},{id:"editorial",icon:"✍️",label:"Éditorial",sub:"Article + 5 formats"},{id:"admin",icon:"📋",label:"Admin",sub:"Devis · Factures · Relances"}];

export default function App() {
  const [mod,setMod]=useState("diagnostic");
  useEffect(()=>{ injectStyles(); },[]);
  return(
    <div className="cz2">
      {/* Navbar */}
      <nav style={{background:"#FFF8E8",borderBottom:"2px solid #F5A623",padding:"0 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:800,margin:"0 auto",height:58,display:"flex",alignItems:"center",gap:0}}>
          <div style={{marginRight:24,flexShrink:0}}><Logo height={32}/></div>
          <div style={{display:"flex",gap:4}}>
            {MODULES.map(m=>(
              <button key={m.id} onClick={()=>setMod(m.id)} className={`cz2-mod-tab${mod===m.id?" sel":""}`}>
                <span>{m.icon}</span><span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      {/* Contenu */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"28px 20px"}}>
        <div className="cz2-card" style={{padding:"28px 28px 32px"}}>
          {mod==="diagnostic"&&<AgentDiagnostic/>}
          {mod==="editorial"&&<AgentEditorial/>}
          {mod==="admin"&&<AgentAdmin/>}
        </div>
      </div>
    </div>
  );
}
