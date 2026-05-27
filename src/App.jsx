import { useState, useRef, useCallback } from "react";

// ─── BRAND & CONSTANTS ──────────────────────────────────────────
const V = "#5B2C91", R = "#E91E8C", G = "#1D9E75";

const MODULES = [
  { id:"diagnostic", label:"Diagnostic", icon:"🎯", sub:"Rapport L1.1" },
  { id:"editorial",  label:"Éditorial",  icon:"✍️", sub:"Article + 5 formats" },
  { id:"admin",      label:"Admin",      icon:"📋", sub:"Devis · Factures · Relances" },
];

const ADMIN_TABS = [
  { id:"devis",   icon:"📄", label:"Devis" },
  { id:"facture", icon:"🧾", label:"Facture" },
  { id:"relance", icon:"📧", label:"Relance" },
  { id:"recap",   icon:"📊", label:"Récapitulatif" },
];

const PILLIERS = [
  {id:"cash",icon:"💰",label:"Cash"},
  {id:"strategie",icon:"🎯",label:"Stratégie"},
  {id:"clients",icon:"🤝",label:"Clients"},
  {id:"equipe",icon:"👥",label:"Équipe"},
  {id:"risques",icon:"⚠️",label:"Risques"},
  {id:"croissance",icon:"📈",label:"Croissance"},
  {id:"resilience",icon:"🛡️",label:"Résilience"},
];

const TONS_EDIT = [
  {id:"antibullshit",label:"Anti-bullshit"},
  {id:"pedagogique",label:"Pédagogique"},
  {id:"provocateur",label:"Provocateur"},
  {id:"narratif",label:"Storytelling"},
];

const DECL_TABS = [
  {id:"linkedin",label:"LinkedIn",icon:"ti-brand-linkedin"},
  {id:"newsletter",label:"Newsletter",icon:"ti-mail"},
  {id:"video",label:"Vidéo 60s",icon:"ti-video"},
  {id:"carousel",label:"Carousel",icon:"ti-layout-grid"},
  {id:"instagram",label:"Instagram",icon:"ti-brand-instagram"},
];

const STATUS_S = {
  ROUGE: {bg:"#FEE2E2",text:"#991B1B",border:"#FCA5A5",dot:"#EF4444"},
  ORANGE:{bg:"#FEF3C7",text:"#92400E",border:"#FCD34D",dot:"#F59E0B"},
  VERT:  {bg:"#D1FAE5",text:"#065F46",border:"#6EE7B7",dot:"#10B981"},
};
const RISK_S = {
  CRITIQUE:{bg:"#7F1D1D",text:"#FEE2E2"},
  ÉLEVÉ:   {bg:"#78350F",text:"#FEF3C7"},
  MODÉRÉ:  {bg:"#713F12",text:"#FEF9C3"},
  FAIBLE:  {bg:"#064E3B",text:"#D1FAE5"},
};
const P_ICONS = {Cash:"💰",Stratégie:"🎯",Clients:"🤝",Équipe:"👥",Risques:"⚠️",Croissance:"📈",Résilience:"🛡️"};

// ─── API CALLS ──────────────────────────────────────────────────
const callAPI = async (system, content) => {
  const res = await fetch("/api/analyze", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content}]}),
  });
  const data = await res.json();
  const raw = data.content?.[0]?.text || "";
  return JSON.parse(raw.replace(/```json|```/g,"").trim());
};

// ─── SHARED COMPONENTS ──────────────────────────────────────────
const CopyBtn = ({text,small}) => {
  const [ok,setOk] = useState(false);
  const go = () => { navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false),2000); };
  return (
    <button onClick={go} style={{fontSize:small?11:12,padding:small?"3px 8px":"5px 12px",cursor:"pointer",
      color:ok?"#065F46":"var(--color-text-secondary)",borderColor:ok?"#6EE7B7":"var(--color-border-secondary)",
      background:ok?"#D1FAE5":"transparent",borderRadius:"var(--border-radius-md)",border:"0.5px solid",transition:"all .2s"}}>
      {ok?"✓ Copié !":"Copier"}
    </button>
  );
};

const SectionLabel = ({children,opt}) => (
  <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.08em",color:"var(--color-text-secondary)",marginBottom:8,display:"flex",gap:8,alignItems:"center"}}>
    {children}{opt&&<span style={{opacity:.6,fontWeight:400}}>(optionnel)</span>}
  </div>
);

const Inp = ({placeholder,value,onChange,style={}}) => (
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{fontSize:13,padding:"9px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",width:"100%",boxSizing:"border-box",background:"var(--color-background-primary)",color:"var(--color-text-primary)",...style}}/>
);

const ScoreBar = ({score}) => (
  <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{flex:1,height:4,background:"var(--color-border-tertiary)",borderRadius:2,overflow:"hidden"}}>
      <div style={{width:`${score*10}%`,height:"100%",borderRadius:2,background:score<=3?"#EF4444":score<=6?"#F59E0B":"#10B981"}}/>
    </div>
    <span style={{fontSize:13,fontWeight:500,minWidth:18}}>{score}</span>
  </div>
);

const Spinner = ({msg}) => (
  <div style={{padding:"2rem 0",display:"flex",alignItems:"center",gap:12}}>
    <div style={{width:18,height:18,border:`2px solid ${V}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
    <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{msg}</span>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// AGENT DIAGNOSTIC
// ──────────────────────────────────────────────────────────────────
const DIAG_SYS = `Tu es l'Agent Diagnostic de CapZéniths, spécialiste prévention défaillance business.
Analyse le PDF Cap-Diag ou les réponses textuelles et génère un rapport L1.1.
7 piliers : Cash, Stratégie, Clients, Équipe, Risques, Croissance, Résilience. Score 1-3=ROUGE, 4-6=ORANGE, 7-10=VERT.
Style direct, anti-bullshit, spécifique. RÉPONDS UNIQUEMENT EN JSON VALIDE sans backticks.
{"clientExtrait":{"nom":"","entreprise":"","secteur":"","type":"","ca":"","anciennete":""},"scoreGlobal":0,"niveauRisque":"MODÉRÉ","synthese":"","pilliers":[{"nom":"Cash","score":0,"statut":"ORANGE","diagnostic":""}],"pointsCritiques":[{"titre":"","description":"","impact":""}],"planAction":{"j30":[],"j60":[],"j90":[]},"prochainesEtapes":""}`;

const DIAG_MSGS = ["Lecture du rapport Cap-Diag…","Analyse des 7 piliers…","Évaluation des risques…","Construction du plan d'action…","Finalisation du rapport L1.1…"];

function AgentDiagnostic() {
  const [pdfFile,setPdfFile] = useState(null);
  const [pdfB64,setPdfB64] = useState(null);
  const [ctx,setCtx] = useState("");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState("");
  const [report,setReport] = useState(null);
  const [err,setErr] = useState("");
  const [drag,setDrag] = useState(false);
  const ref = useRef(null);

  const readPdf = f => new Promise((res,rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

  const handleFile = useCallback(async f => {
    if(!f) return;
    if(f.type!=="application/pdf"){setErr("PDF uniquement.");return;}
    if(f.size>10*1024*1024){setErr("Max 10 Mo.");return;}
    setErr(""); setPdfFile(f); setPdfB64(await readPdf(f));
  },[]);

  const generate = async () => {
    if(!pdfB64&&!ctx.trim()){setErr("Importe un PDF ou ajoute du contexte.");return;}
    setErr(""); setLoading(true);
    let mi=0; setMsg(DIAG_MSGS[0]);
    const iv = setInterval(()=>{mi=Math.min(mi+1,DIAG_MSGS.length-1);setMsg(DIAG_MSGS[mi]);},2000);
    try {
      const uc = [];
      if(pdfB64) uc.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfB64}});
      uc.push({type:"text",text:"Analyse et génère le rapport L1.1 CapZéniths."+(ctx.trim()?"\n\nContexte : "+ctx:"")});
      clearInterval(iv);
      const r = await callAPI(DIAG_SYS, uc);
      setReport(r);
    } catch(e){clearInterval(iv);setErr("Erreur d'analyse. Réessaie.");}
    finally{setLoading(false);}
  };

  const reset = () => {setReport(null);setPdfFile(null);setPdfB64(null);setCtx("");setErr("");};

  if(report) {
    const c = report.clientExtrait||{};
    const risk = RISK_S[report.niveauRisque]||RISK_S["MODÉRÉ"];
    const date = new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
    const clientLabel = [c.entreprise,c.nom].filter(v=>v&&!v.includes("trouvé")).join(" — ");
    const meta = [c.secteur,c.type,c.ca].filter(v=>v&&!v.includes("trouvé")).join(" · ");
    return (
      <div style={{fontFamily:"var(--font-sans)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.09em",color:"var(--color-text-secondary)",marginBottom:5}}>RAPPORT L1.1 · CAPZÉNITHS · {date.toUpperCase()}</div>
            <div style={{fontSize:17,fontWeight:500,color:"var(--color-text-primary)",marginBottom:3}}>{clientLabel||"Client"}</div>
            {meta&&<div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{meta}</div>}
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
            <div style={{fontSize:36,fontWeight:300,color:"var(--color-text-primary)",lineHeight:1}}>{report.scoreGlobal}<span style={{fontSize:16,color:"var(--color-text-tertiary)"}}>/10</span></div>
            <div style={{marginTop:6,display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:risk.bg,color:risk.text}}>RISQUE {report.niveauRisque}</div>
          </div>
        </div>
        <div style={{padding:"14px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",marginBottom:16}}>
          <SectionLabel>SYNTHÈSE</SectionLabel>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-primary)",lineHeight:1.75}}>{report.synthese}</p>
        </div>
        <div style={{marginBottom:16}}>
          <SectionLabel>7 PILIERS</SectionLabel>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {(report.pilliers||[]).map(p=>{
              const s=STATUS_S[p.statut]||STATUS_S.ORANGE;
              return(
                <div key={p.nom} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)"}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:s.dot,flexShrink:0}}/>
                  <div style={{width:22,fontSize:15,flexShrink:0}}>{P_ICONS[p.nom]}</div>
                  <div style={{width:84,fontSize:13,fontWeight:500,flexShrink:0}}>{p.nom}</div>
                  <div style={{width:112,flexShrink:0}}><ScoreBar score={p.score}/></div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",flex:1,lineHeight:1.5}}>{p.diagnostic}</div>
                  <div style={{flexShrink:0,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:s.bg,color:s.text,border:`0.5px solid ${s.border}`}}>{p.statut}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <SectionLabel>POINTS CRITIQUES</SectionLabel>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(report.pointsCritiques||[]).map((p,i)=>(
              <div key={i} style={{padding:"12px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #FCA5A5",background:"#FFF5F5"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#7F1D1D",marginBottom:4}}><span style={{opacity:.4,marginRight:8}}>{i+1}.</span>{p.titre}</div>
                <div style={{fontSize:12,color:"#7F1D1D",lineHeight:1.6,marginBottom:4}}>{p.description}</div>
                <div style={{fontSize:11,color:"#991B1B",display:"flex",gap:6}}><span style={{opacity:.6}}>Impact :</span><span>{p.impact}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <SectionLabel>PLAN D'ACTION</SectionLabel>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {[{label:"J+30",actions:report.planAction?.j30,color:V},{label:"J+60",actions:report.planAction?.j60,color:R},{label:"J+90",actions:report.planAction?.j90,color:G}].map(({label,actions,color})=>(
              <div key={label} style={{padding:"12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)"}}>
                <div style={{fontSize:12,fontWeight:600,color,marginBottom:8,paddingBottom:6,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>{label}</div>
                {(actions||[]).map((a,i)=>(
                  <div key={i} style={{fontSize:12,color:"var(--color-text-primary)",marginBottom:6,display:"flex",gap:6,lineHeight:1.5}}>
                    <span style={{color,flexShrink:0}}>→</span><span>{a}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"14px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid #C4A3D4",background:"#F5EFF9",marginBottom:20}}>
          <SectionLabel>RECOMMANDATION CAPZÉNITHS</SectionLabel>
          <p style={{margin:0,fontSize:13,color:"#3C1E5A",lineHeight:1.75}}>{report.prochainesEtapes}</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={reset} style={{fontSize:13,padding:"8px 16px",cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",borderRadius:"var(--border-radius-md)"}}>← Nouveau</button>
          <button onClick={()=>window.print()} style={{fontSize:13,padding:"8px 16px",cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",borderRadius:"var(--border-radius-md)"}}>🖨 PDF</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.09em",color:"var(--color-text-secondary)",marginBottom:4}}>AGENT DIAGNOSTIC</div>
        <div style={{fontSize:17,fontWeight:500,color:"var(--color-text-primary)"}}>Générer un rapport L1.1</div>
        <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginTop:4}}>Importe le PDF Cap-Diag — l'agent extrait et génère le rapport complet.</div>
      </div>
      <div style={{marginBottom:18}}>
        <SectionLabel>RAPPORT CAP-DIAG (PDF)</SectionLabel>
        {!pdfFile?(
          <div onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onClick={()=>ref.current?.click()}
            style={{border:`1.5px dashed ${drag?V:"var(--color-border-secondary)"}`,borderRadius:"var(--border-radius-lg)",padding:"32px",textAlign:"center",cursor:"pointer",background:drag?"#F5EFF9":"var(--color-background-secondary)",transition:"all .15s"}}>
            <div style={{fontSize:28,marginBottom:8}}>📄</div>
            <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:4}}>Glisse-dépose le PDF ici</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12}}>ou clique pour sélectionner</div>
            <span style={{fontSize:12,padding:"6px 14px",borderRadius:20,border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)"}}>Parcourir…</span>
            <input ref={ref} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid #6EE7B7",background:"#D1FAE5"}}>
            <div style={{fontSize:22}}>✅</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"#065F46"}}>{pdfFile.name}</div><div style={{fontSize:11,color:"#047857"}}>{(pdfFile.size/1024).toFixed(0)} Ko · Prêt</div></div>
            <button onClick={()=>{setPdfFile(null);setPdfB64(null);}} style={{fontSize:12,padding:"4px 10px",cursor:"pointer",color:"#065F46",border:"0.5px solid #6EE7B7",background:"transparent",borderRadius:"var(--border-radius-md)"}}>Changer</button>
          </div>
        )}
      </div>
      <div style={{marginBottom:20}}>
        <SectionLabel opt>CONTEXTE COMPLÉMENTAIRE</SectionLabel>
        <textarea value={ctx} onChange={e=>setCtx(e.target.value)} rows={3} placeholder="Notes de l'appel découverte, informations hors PDF…"
          style={{width:"100%",fontSize:13,padding:"10px 12px",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
      </div>
      {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:"var(--border-radius-md)"}}>⚠️ {err}</div>}
      {loading?<Spinner msg={msg}/>:<button onClick={generate} style={{fontSize:14,fontWeight:500,padding:"11px 22px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)"}}>→ Générer le rapport L1.1</button>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// AGENT EDITORIAL
// ──────────────────────────────────────────────────────────────────
const ART_SYS = `Tu es l'Agent Éditorial de CapZéniths, spécialiste prévention défaillance business. Rédige des articles pour dirigeants de TPE/PME français. Style direct, anti-bullshit, tutoiement, concret.
RÉPONDS UNIQUEMENT EN JSON VALIDE sans backticks.
{"titre":"<max 70 chars>","accroche":"<2-3 phrases percutantes>","sections":[{"h2":"<titre>","contenu":"<2 paragraphes>"},{"h2":"","contenu":""},{"h2":"","contenu":""}],"conclusion":"<1 paragraphe>","cta":"<1 phrase vers cap-diag>"}`;

const DECL_SYS = `Tu es l'Agent Éditorial de CapZéniths. Génère 5 déclinaisons de l'article fourni. Direct, anti-bullshit, tutoiement.
RÉPONDS UNIQUEMENT EN JSON VALIDE sans backticks.
{"linkedin":"<post complet : 1ère ligne choc, corps 5-6 lignes, 2 emojis max, CTA, 3 hashtags>","newsletter":"<titre + 3-4 lignes teaser + lien>","video":"<script 60s : INTRO 10s | DEV 40s | CTA 10s>","carousel":["<Slide 1>","<Slide 2>","<Slide 3>","<Slide 4>","<Slide 5 CTA>"],"instagram":"<2-3 lignes + 5 hashtags>"}`;

const EDIT_MSGS = ["Analyse du pilier…","Rédaction de l'article…","Génération des déclinaisons…","Post LinkedIn, newsletter…","Finalisation des 5 formats…"];

function AgentEditorial() {
  const [form,setForm] = useState({sujet:"",pilier:"",angle:"",probleme:"",motscles:"",ton:"antibullshit"});
  const [article,setArticle] = useState(null);
  const [decl,setDecl] = useState(null);
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState("");
  const [tab,setTab] = useState("linkedin");
  const [err,setErr] = useState("");

  const sf = (k,v) => setForm(f=>({...f,[k]:v}));

  const generate = async () => {
    if(!form.sujet.trim()){setErr("Renseigne un sujet.");return;}
    if(!form.pilier){setErr("Sélectionne un pilier.");return;}
    setErr(""); setLoading(true);
    let mi=0; setMsg(EDIT_MSGS[0]);
    const iv = setInterval(()=>{mi=Math.min(mi+1,EDIT_MSGS.length-1);setMsg(EDIT_MSGS[mi]);},2200);
    try {
      const p = PILLIERS.find(x=>x.id===form.pilier);
      const t = TONS_EDIT.find(x=>x.id===form.ton);
      const ua = `Sujet : ${form.sujet}\nPilier : ${p?.label}\nAngle : ${form.angle||"Non précisé"}\nProblème : ${form.probleme||"Non précisé"}\nMots-clés : ${form.motscles||"Non précisé"}\nTon : ${t?.label}`;
      const art = await callAPI(ART_SYS, ua);
      setArticle(art);
      const ud = `Titre : ${art.titre}\nAccroche : ${art.accroche}\nPilier : ${p?.label}\nSections : ${art.sections.map(s=>s.h2).join(", ")}`;
      const dl = await callAPI(DECL_SYS, ud);
      clearInterval(iv);
      setDecl(dl);
    } catch(e){clearInterval(iv);setErr("Erreur. Réessaie.");}
    finally{setLoading(false);}
  };

  const reset = () => {setArticle(null);setDecl(null);setErr("");};

  if(article&&decl) {
    const p = PILLIERS.find(x=>x.id===form.pilier);
    const artTxt = `# ${article.titre}\n\n${article.accroche}\n\n${article.sections.map(s=>`## ${s.h2}\n${s.contenu}`).join("\n\n")}\n\n${article.conclusion}\n\n${article.cta}`;
    const getDt = id => id==="carousel"?(decl.carousel||[]).map((s,i)=>`Slide ${i+1} : ${s}`).join("\n"):decl[id]||"";
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:14,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.09em",color:"var(--color-text-secondary)",marginBottom:4}}>AGENT ÉDITORIAL</div>
            <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)"}}>{article.titre}</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{p?.icon} {p?.label} · {TONS_EDIT.find(t=>t.id===form.ton)?.label}</div>
          </div>
          <button onClick={reset} style={{fontSize:12,padding:"6px 14px",cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",borderRadius:"var(--border-radius-md)"}}>← Nouvel article</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SectionLabel>ARTICLE PILIER</SectionLabel><CopyBtn text={artTxt}/></div>
            <div style={{padding:"14px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",fontSize:13,lineHeight:1.75}}>
              <div style={{fontWeight:500,marginBottom:8,fontSize:14}}>{article.titre}</div>
              <div style={{color:V,fontStyle:"italic",marginBottom:12,paddingBottom:10,borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:12}}>{article.accroche}</div>
              {article.sections.map((s,i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{fontWeight:500,marginBottom:4}}>{s.h2}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.contenu}</div>
                </div>
              ))}
              <div style={{paddingTop:10,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:8,lineHeight:1.7}}>{article.conclusion}</div>
                <div style={{fontSize:12,fontWeight:500,color:R}}>{article.cta}</div>
              </div>
            </div>
          </div>
          <div>
            <SectionLabel>5 DÉCLINAISONS</SectionLabel>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
              {DECL_TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{fontSize:11,padding:"5px 9px",cursor:"pointer",borderRadius:"var(--border-radius-md)",border:tab===t.id?`0.5px solid ${V}`:"0.5px solid var(--color-border-secondary)",background:tab===t.id?"#F5EFF9":"transparent",color:tab===t.id?V:"var(--color-text-secondary)",fontWeight:tab===t.id?500:400,transition:"all .15s"}}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{padding:"14px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",minHeight:260}}>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}><CopyBtn text={getDt(tab)}/></div>
              {tab!=="carousel"?(
                <div style={{fontSize:12,color:"var(--color-text-primary)",lineHeight:1.8,whiteSpace:"pre-line"}}>{decl[tab]||""}</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(decl.carousel||[]).map((s,i)=>(
                    <div key={i} style={{padding:"7px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)"}}>
                      <span style={{fontSize:10,fontWeight:500,color:V,marginRight:8}}>Slide {i+1}</span>
                      <span style={{fontSize:12}}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.09em",color:"var(--color-text-secondary)",marginBottom:4}}>AGENT ÉDITORIAL</div>
        <div style={{fontSize:17,fontWeight:500,color:"var(--color-text-primary)"}}>Générer un article + 5 déclinaisons</div>
      </div>
      <div style={{marginBottom:14}}>
        <SectionLabel>SUJET</SectionLabel>
        <Inp value={form.sujet} onChange={v=>sf("sujet",v)} placeholder="Ex. : Les 3 erreurs de trésorerie qui tuent une entreprise en 90 jours"/>
      </div>
      <div style={{marginBottom:14}}>
        <SectionLabel>PILIER CAPZÉNITHS</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {PILLIERS.map(p=>(
            <div key={p.id} onClick={()=>sf("pilier",p.id)} style={{padding:"8px",borderRadius:"var(--border-radius-md)",cursor:"pointer",textAlign:"center",border:form.pilier===p.id?`1px solid ${V}`:"0.5px solid var(--color-border-secondary)",background:form.pilier===p.id?"#F5EFF9":"var(--color-background-secondary)",transition:"all .15s"}}>
              <div style={{fontSize:16,marginBottom:2}}>{p.icon}</div>
              <div style={{fontSize:11,fontWeight:form.pilier===p.id?500:400,color:form.pilier===p.id?V:"var(--color-text-secondary)"}}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><SectionLabel opt>ANGLE</SectionLabel><Inp value={form.angle} onChange={v=>sf("angle",v)} placeholder="Ex. : Les chiffres que personne ne dit"/></div>
        <div><SectionLabel opt>PROBLÈME</SectionLabel><Inp value={form.probleme} onChange={v=>sf("probleme",v)} placeholder="Ex. : Ne sait pas lire son bilan"/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
        <div><SectionLabel opt>MOTS-CLÉS SEO</SectionLabel><Inp value={form.motscles} onChange={v=>sf("motscles",v)} placeholder="Ex. : trésorerie PME, BFR"/></div>
        <div>
          <SectionLabel>TON</SectionLabel>
          <select value={form.ton} onChange={e=>sf("ton",e.target.value)} style={{fontSize:13,padding:"9px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",width:"100%",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}>
            {TONS_EDIT.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>
      {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:"var(--border-radius-md)"}}>⚠️ {err}</div>}
      {loading?<Spinner msg={msg}/>:<button onClick={generate} style={{fontSize:14,fontWeight:500,padding:"11px 22px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)",opacity:(!form.sujet||!form.pilier)?.5:1}}>→ Générer l'article + 5 déclinaisons</button>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// AGENT ADMIN
// ──────────────────────────────────────────────────────────────────
const fmt = n => Number(n||0).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});
const today = () => new Date().toLocaleDateString("fr-FR");
const newNum = pfx => `${pfx}-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;

function DocPreview({type,form,totals,onBack}) {
  const {totalHT,totalTVA,totalTTC} = totals;
  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        <button onClick={onBack} style={{fontSize:13,padding:"8px 14px",cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",borderRadius:"var(--border-radius-md)"}}>← Modifier</button>
        <button onClick={()=>window.print()} style={{fontSize:13,padding:"8px 14px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)"}}>🖨 Imprimer / PDF</button>
      </div>
      <div id="print-zone" style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:8,padding:"32px",fontFamily:"Georgia, serif",color:"#111"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,paddingBottom:20,borderBottom:"2px solid "+V}}>
          <div>
            <div style={{fontSize:20,fontWeight:700,color:V,marginBottom:4}}>CapZéniths</div>
            <div style={{fontSize:11,color:"#555"}}>Conseil Prévention Défaillance Business</div>
            <div style={{fontSize:11,color:"#555"}}>ogan@capzeniths.com · capzeniths.com</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:26,fontWeight:700,color:"#111",letterSpacing:"0.05em"}}>{type==="devis"?"DEVIS":"FACTURE"}</div>
            <div style={{fontSize:13,color:"#555",marginTop:4}}>N° {form.numero}</div>
            <div style={{fontSize:12,color:"#555"}}>Date : {form.date}</div>
            {type==="devis"&&<div style={{fontSize:12,color:"#555"}}>Valide {form.validite} jours</div>}
            {type==="facture"&&<div style={{fontSize:12,color:"#555"}}>Échéance : {form.echeance}</div>}
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",color:"#777",marginBottom:8}}>DESTINATAIRE</div>
          <div style={{fontSize:14,fontWeight:600}}>{form.client.nom||"—"}</div>
          {form.client.email&&<div style={{fontSize:12,color:"#555"}}>{form.client.email}</div>}
          {form.client.adresse&&<div style={{fontSize:12,color:"#555",marginTop:2}}>{form.client.adresse}</div>}
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20}}>
          <thead>
            <tr style={{background:V,color:"#fff"}}>
              <th style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600,width:40}}>QTÉ</th>
              <th style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600}}>DÉSIGNATION</th>
              <th style={{padding:"8px 12px",textAlign:"right",fontSize:11,fontWeight:600,width:100}}>P.U. (€)</th>
              <th style={{padding:"8px 12px",textAlign:"right",fontSize:11,fontWeight:600,width:110}}>MONTANT (€)</th>
            </tr>
          </thead>
          <tbody>
            {form.prestations.map((p,i)=>(
              <tr key={i} style={{background:i%2===0?"#F8F5FC":"#fff",borderBottom:"1px solid #EDE9F5"}}>
                <td style={{padding:"10px 12px",fontSize:13,textAlign:"center"}}>{p.quantite}</td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{fontSize:13,fontWeight:500}}>{p.titre||"—"}</div>
                  {p.description&&<div style={{fontSize:11,color:"#666",marginTop:2}}>{p.description}</div>}
                </td>
                <td style={{padding:"10px 12px",fontSize:13,textAlign:"right"}}>{fmt(p.prix)}</td>
                <td style={{padding:"10px 12px",fontSize:13,fontWeight:500,textAlign:"right"}}>{fmt(p.quantite*p.prix)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
          <div style={{minWidth:240}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #EDE9F5",fontSize:13}}><span>Total HT</span><strong>{fmt(totalHT)} €</strong></div>
            {form.tva&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #EDE9F5",fontSize:13}}><span>TVA ({form.tauxTva}%)</span><strong>{fmt(totalTVA)} €</strong></div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,fontWeight:700,color:V}}><span>Total {form.tva?"TTC":"HT"}</span><span>{fmt(totalTTC)} €</span></div>
          </div>
        </div>
        {form.conditions&&<div style={{padding:"12px 16px",background:"#F8F5FC",borderRadius:6,borderLeft:`3px solid ${V}`}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",color:V,marginBottom:4}}>CONDITIONS</div>
          <div style={{fontSize:12,color:"#444"}}>{form.conditions}</div>
        </div>}
        {type==="facture"&&form.iban&&<div style={{marginTop:12,padding:"12px 16px",background:"#F0FDF4",borderRadius:6,borderLeft:"3px solid #10B981"}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",color:"#065F46",marginBottom:4}}>COORDONNÉES BANCAIRES</div>
          <div style={{fontSize:12,color:"#444"}}>IBAN : {form.iban}</div>
        </div>}
      </div>
      <style>{`@media print{.no-print{display:none!important}#print-zone{border:none;padding:0;}body{background:white;}}`}</style>
    </div>
  );
}

function DevisModule() {
  const [form,setForm] = useState({numero:newNum("DEV"),date:today(),validite:"30",client:{nom:"",email:"",adresse:""},prestations:[{titre:"",description:"",quantite:1,prix:0}],tva:false,tauxTva:20,conditions:"Paiement à réception de facture. Devis valable 30 jours."});
  const [preview,setPreview] = useState(false);
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const sc = (k,v) => setForm(f=>({...f,client:{...f.client,[k]:v}}));
  const sl = (i,k,v) => setForm(f=>({...f,prestations:f.prestations.map((p,j)=>j===i?{...p,[k]:v}:p)}));
  const addL = () => setForm(f=>({...f,prestations:[...f.prestations,{titre:"",description:"",quantite:1,prix:0}]}));
  const delL = i => setForm(f=>({...f,prestations:f.prestations.filter((_,j)=>j!==i)}));
  const totHT = form.prestations.reduce((s,p)=>s+(Number(p.quantite||0)*Number(p.prix||0)),0);
  const totTVA = form.tva?totHT*(Number(form.tauxTva)/100):0;
  const totTTC = totHT+totTVA;
  if(preview) return <DocPreview type="devis" form={form} totals={{totalHT:totHT,totalTVA:totTVA,totalTTC:totTTC}} onBack={()=>setPreview(false)}/>;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        <div><SectionLabel>N° DEVIS</SectionLabel><Inp value={form.numero} onChange={v=>sf("numero",v)} placeholder="DEV-2026-001"/></div>
        <div><SectionLabel>DATE</SectionLabel><Inp value={form.date} onChange={v=>sf("date",v)} placeholder="jj/mm/aaaa"/></div>
        <div><SectionLabel>VALIDITÉ (jours)</SectionLabel><Inp value={form.validite} onChange={v=>sf("validite",v)} placeholder="30"/></div>
      </div>
      <div style={{marginBottom:14}}>
        <SectionLabel>CLIENT</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Inp value={form.client.nom} onChange={v=>sc("nom",v)} placeholder="Nom / Entreprise"/>
          <Inp value={form.client.email} onChange={v=>sc("email",v)} placeholder="Email"/>
          <div style={{gridColumn:"1/-1"}}><Inp value={form.client.adresse} onChange={v=>sc("adresse",v)} placeholder="Adresse (optionnel)"/></div>
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SectionLabel>PRESTATIONS</SectionLabel><button onClick={addL} style={{fontSize:12,padding:"3px 10px",cursor:"pointer",color:V,borderColor:V,background:"transparent",border:`0.5px solid ${V}`,borderRadius:"var(--border-radius-md)"}}>+ Ajouter</button></div>
        {form.prestations.map((p,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",marginBottom:8,background:"var(--color-background-secondary)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 100px auto",gap:8,alignItems:"center",marginBottom:6}}>
              <Inp value={p.titre} onChange={v=>sl(i,"titre",v)} placeholder="Titre de la prestation"/>
              <Inp value={p.quantite} onChange={v=>sl(i,"quantite",v)} placeholder="Qté"/>
              <Inp value={p.prix} onChange={v=>sl(i,"prix",v)} placeholder="Prix HT €"/>
              {form.prestations.length>1&&<button onClick={()=>delL(i)} style={{fontSize:12,padding:"4px 8px",cursor:"pointer",color:"#991B1B",border:"0.5px solid #FCA5A5",background:"#FEE2E2",borderRadius:"var(--border-radius-sm)"}}>✕</button>}
            </div>
            <Inp value={p.description} onChange={v=>sl(i,"description",v)} placeholder="Description (optionnel)"/>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"flex-end",gap:16,padding:"8px 0",fontSize:13}}>
          <span>Total HT : <strong>{fmt(totHT)} €</strong></span>
          {form.tva&&<span>TVA {form.tauxTva}% : <strong>{fmt(totTVA)} €</strong></span>}
          <span style={{color:V}}>Total : <strong>{fmt(totTTC)} €</strong></span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <input type="checkbox" checked={form.tva} onChange={e=>sf("tva",e.target.checked)} style={{cursor:"pointer"}}/>
            <SectionLabel>TVA applicable</SectionLabel>
            {form.tva&&<Inp value={form.tauxTva} onChange={v=>sf("tauxTva",v)} placeholder="20" style={{width:70}}/>}
          </div>
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <SectionLabel>CONDITIONS DE PAIEMENT</SectionLabel>
        <textarea value={form.conditions} onChange={e=>sf("conditions",e.target.value)} rows={2}
          style={{width:"100%",fontSize:13,padding:"9px 12px",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
      </div>
      <button onClick={()=>setPreview(true)} style={{fontSize:14,fontWeight:500,padding:"11px 22px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)"}}>→ Prévisualiser le devis</button>
    </div>
  );
}

function FactureModule() {
  const [form,setForm] = useState({numero:newNum("FAC"),date:today(),echeance:"",client:{nom:"",email:"",adresse:""},prestations:[{titre:"",description:"",quantite:1,prix:0}],tva:false,tauxTva:20,conditions:"Paiement sous 30 jours.",iban:""});
  const [preview,setPreview] = useState(false);
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const sc = (k,v) => setForm(f=>({...f,client:{...f.client,[k]:v}}));
  const sl = (i,k,v) => setForm(f=>({...f,prestations:f.prestations.map((p,j)=>j===i?{...p,[k]:v}:p)}));
  const addL = () => setForm(f=>({...f,prestations:[...f.prestations,{titre:"",description:"",quantite:1,prix:0}]}));
  const delL = i => setForm(f=>({...f,prestations:f.prestations.filter((_,j)=>j!==i)}));
  const totHT = form.prestations.reduce((s,p)=>s+(Number(p.quantite||0)*Number(p.prix||0)),0);
  const totTVA = form.tva?totHT*(Number(form.tauxTva)/100):0;
  const totTTC = totHT+totTVA;
  if(preview) return <DocPreview type="facture" form={form} totals={{totalHT:totHT,totalTVA:totTVA,totalTTC:totTTC}} onBack={()=>setPreview(false)}/>;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        <div><SectionLabel>N° FACTURE</SectionLabel><Inp value={form.numero} onChange={v=>sf("numero",v)} placeholder="FAC-2026-001"/></div>
        <div><SectionLabel>DATE</SectionLabel><Inp value={form.date} onChange={v=>sf("date",v)} placeholder="jj/mm/aaaa"/></div>
        <div><SectionLabel>DATE D'ÉCHÉANCE</SectionLabel><Inp value={form.echeance} onChange={v=>sf("echeance",v)} placeholder="jj/mm/aaaa"/></div>
      </div>
      <div style={{marginBottom:14}}>
        <SectionLabel>CLIENT</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Inp value={form.client.nom} onChange={v=>sc("nom",v)} placeholder="Nom / Entreprise"/>
          <Inp value={form.client.email} onChange={v=>sc("email",v)} placeholder="Email"/>
          <div style={{gridColumn:"1/-1"}}><Inp value={form.client.adresse} onChange={v=>sc("adresse",v)} placeholder="Adresse (optionnel)"/></div>
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><SectionLabel>PRESTATIONS</SectionLabel><button onClick={addL} style={{fontSize:12,padding:"3px 10px",cursor:"pointer",color:V,border:`0.5px solid ${V}`,background:"transparent",borderRadius:"var(--border-radius-md)"}}>+ Ajouter</button></div>
        {form.prestations.map((p,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",marginBottom:8,background:"var(--color-background-secondary)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 100px auto",gap:8,alignItems:"center",marginBottom:6}}>
              <Inp value={p.titre} onChange={v=>sl(i,"titre",v)} placeholder="Titre de la prestation"/>
              <Inp value={p.quantite} onChange={v=>sl(i,"quantite",v)} placeholder="Qté"/>
              <Inp value={p.prix} onChange={v=>sl(i,"prix",v)} placeholder="Prix HT €"/>
              {form.prestations.length>1&&<button onClick={()=>delL(i)} style={{fontSize:12,padding:"4px 8px",cursor:"pointer",color:"#991B1B",border:"0.5px solid #FCA5A5",background:"#FEE2E2",borderRadius:"var(--border-radius-sm)"}}>✕</button>}
            </div>
            <Inp value={p.description} onChange={v=>sl(i,"description",v)} placeholder="Description (optionnel)"/>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"flex-end",gap:16,padding:"8px 0",fontSize:13}}>
          <span>Total HT : <strong>{fmt(totHT)} €</strong></span>
          {form.tva&&<span>TVA {form.tauxTva}% : <strong>{fmt(totTVA)} €</strong></span>}
          <span style={{color:V}}>Total : <strong>{fmt(totTTC)} €</strong></span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <input type="checkbox" checked={form.tva} onChange={e=>sf("tva",e.target.checked)} style={{cursor:"pointer"}}/>
            <SectionLabel>TVA applicable</SectionLabel>
            {form.tva&&<Inp value={form.tauxTva} onChange={v=>sf("tauxTva",v)} placeholder="20" style={{width:70}}/>}
          </div>
        </div>
        <div><SectionLabel opt>IBAN</SectionLabel><Inp value={form.iban} onChange={v=>sf("iban",v)} placeholder="FR76 xxxx xxxx xxxx"/></div>
      </div>
      <div style={{marginBottom:20}}>
        <SectionLabel>CONDITIONS</SectionLabel>
        <textarea value={form.conditions} onChange={e=>sf("conditions",e.target.value)} rows={2}
          style={{width:"100%",fontSize:13,padding:"9px 12px",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
      </div>
      <button onClick={()=>setPreview(true)} style={{fontSize:14,fontWeight:500,padding:"11px 22px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)"}}>→ Prévisualiser la facture</button>
    </div>
  );
}

const REL_SYS = `Tu es l'Agent Admin de CapZéniths. Tu rédiges des emails de relance professionnels pour factures impayées. Adapte le ton selon le niveau de relance (courtois=1ère relance douce, ferme=2ème relance, urgent=mise en demeure). Style professionnel, direct, signé Ogan / CapZéniths.
RÉPONDS UNIQUEMENT EN JSON VALIDE sans backticks.
{"objet":"<objet email>","corps":"<email complet avec formule d'appel, corps, CTA clair avec date limite, formule de politesse>","conseil":"<note interne : prochaine étape si pas de réponse>"}`;

function RelanceModule() {
  const [form,setForm] = useState({client:"",facture:"",montant:"",jours:"",ton:"courtois",notes:""});
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const TONS_REL = [{id:"courtois",label:"Courtois (1ère relance)"},{id:"ferme",label:"Ferme (2ème relance)"},{id:"urgent",label:"Urgent (mise en demeure)"}];
  const generate = async () => {
    if(!form.client||!form.montant){setErr("Renseigne le client et le montant.");return;}
    setErr(""); setLoading(true);
    try {
      const t = TONS_REL.find(x=>x.id===form.ton);
      const r = await callAPI(REL_SYS,`Client : ${form.client}\nFacture : ${form.facture||"N/A"}\nMontant : ${form.montant} €\nRetard : ${form.jours||"?"} jours\nTon : ${t?.label}\nNotes : ${form.notes||"Aucune"}`);
      setResult(r);
    } catch(e){setErr("Erreur. Réessaie.");}
    finally{setLoading(false);}
  };
  if(result) return (
    <div>
      <div style={{padding:"12px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.08em",color:"var(--color-text-secondary)",marginBottom:4}}>OBJET</div>
        <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{result.objet}</div>
      </div>
      <div style={{padding:"14px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.08em",color:"var(--color-text-secondary)"}}>CORPS DE L'EMAIL</div>
          <CopyBtn text={`Objet : ${result.objet}\n\n${result.corps}`}/>
        </div>
        <div style={{fontSize:13,color:"var(--color-text-primary)",lineHeight:1.8,whiteSpace:"pre-line"}}>{result.corps}</div>
      </div>
      {result.conseil&&<div style={{padding:"10px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #FCD34D",background:"#FEF3C7",marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.08em",color:"#92400E",marginBottom:4}}>NOTE INTERNE</div>
        <div style={{fontSize:12,color:"#78350F"}}>{result.conseil}</div>
      </div>}
      <button onClick={()=>setResult(null)} style={{fontSize:13,padding:"8px 16px",cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",borderRadius:"var(--border-radius-md)"}}>← Nouvelle relance</button>
    </div>
  );
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><SectionLabel>CLIENT</SectionLabel><Inp value={form.client} onChange={v=>sf("client",v)} placeholder="Nom du client"/></div>
        <div><SectionLabel opt>N° FACTURE</SectionLabel><Inp value={form.facture} onChange={v=>sf("facture",v)} placeholder="FAC-2026-001"/></div>
        <div><SectionLabel>MONTANT (€)</SectionLabel><Inp value={form.montant} onChange={v=>sf("montant",v)} placeholder="1 500"/></div>
        <div><SectionLabel opt>JOURS DE RETARD</SectionLabel><Inp value={form.jours} onChange={v=>sf("jours",v)} placeholder="15"/></div>
      </div>
      <div style={{marginBottom:14}}>
        <SectionLabel>NIVEAU DE RELANCE</SectionLabel>
        <div style={{display:"flex",gap:8}}>
          {TONS_REL.map(t=>(
            <div key={t.id} onClick={()=>sf("ton",t.id)} style={{flex:1,padding:"8px 10px",borderRadius:"var(--border-radius-md)",cursor:"pointer",textAlign:"center",fontSize:12,border:form.ton===t.id?`1px solid ${V}`:"0.5px solid var(--color-border-secondary)",background:form.ton===t.id?"#F5EFF9":"var(--color-background-secondary)",color:form.ton===t.id?V:"var(--color-text-secondary)",fontWeight:form.ton===t.id?500:400,transition:"all .15s"}}>
              {t.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <SectionLabel opt>CONTEXTE</SectionLabel>
        <textarea value={form.notes} onChange={e=>sf("notes",e.target.value)} rows={2} placeholder="Ex. : Client habituellement sérieux, première fois en retard…"
          style={{width:"100%",fontSize:13,padding:"9px 12px",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
      </div>
      {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:"var(--border-radius-md)"}}>⚠️ {err}</div>}
      {loading?<Spinner msg="Rédaction de l'email de relance…"/>:<button onClick={generate} style={{fontSize:14,fontWeight:500,padding:"11px 22px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)"}}>→ Générer l'email de relance</button>}
    </div>
  );
}

const RECAP_SYS = `Tu es l'Agent Admin de CapZéniths. Tu génères des récapitulatifs d'activité mensuels directs et actionnables pour un cabinet de conseil en prévention défaillance business.
RÉPONDS UNIQUEMENT EN JSON VALIDE sans backticks.
{"synthese":"<3-4 phrases directes sur le mois>","indicateurs":[{"label":"CA du mois","valeur":"","tendance":"hausse|baisse|stable"},{"label":"Clients actifs","valeur":"","tendance":""},{"label":"Séances réalisées","valeur":"","tendance":""},{"label":"Taux de renouvellement","valeur":"","tendance":""}],"alertes":["<alerte 1>","<alerte 2>"],"actions":["<action prioritaire 1>","<action 2>","<action 3>"]}`;

function RecapModule() {
  const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const [form,setForm] = useState({mois:MOIS[new Date().getMonth()],annee:new Date().getFullYear(),ca:"",clients:"",seances:"",objectif:"",notes:""});
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const generate = async () => {
    if(!form.ca&&!form.clients){setErr("Renseigne au moins le CA ou le nombre de clients.");return;}
    setErr(""); setLoading(true);
    try {
      const r = await callAPI(RECAP_SYS,`Période : ${form.mois} ${form.annee}\nCA réalisé : ${form.ca||"Non renseigné"} €\nClients actifs : ${form.clients||"Non renseigné"}\nSéances : ${form.seances||"Non renseigné"}\nObjectif mensuel : ${form.objectif||"Non renseigné"}\nNotes : ${form.notes||"Aucune"}`);
      setResult(r);
    } catch(e){setErr("Erreur. Réessaie.");}
    finally{setLoading(false);}
  };
  if(result) {
    const tendIcon = t => t==="hausse"?"↗":t==="baisse"?"↘":"→";
    const tendColor = t => t==="hausse"?G:t==="baisse"?"#EF4444":"#F59E0B";
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:500}}>Récapitulatif — {form.mois} {form.annee}</div>
          <div style={{display:"flex",gap:8}}><CopyBtn text={`${form.mois} ${form.annee}\n\n${result.synthese}\n\nAlertes :\n${(result.alertes||[]).join("\n")}\n\nActions :\n${(result.actions||[]).join("\n")}`}/><button onClick={()=>setResult(null)} style={{fontSize:12,padding:"5px 12px",cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",borderRadius:"var(--border-radius-md)"}}>← Nouveau</button></div>
        </div>
        <div style={{padding:"14px 16px",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",marginBottom:14}}>
          <SectionLabel>SYNTHÈSE</SectionLabel>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-primary)",lineHeight:1.75}}>{result.synthese}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:14}}>
          {(result.indicateurs||[]).map((ind,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)"}}>
              <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.07em",color:"var(--color-text-secondary)",marginBottom:4}}>{ind.label?.toUpperCase()}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)"}}>{ind.valeur||"—"}</span>
                <span style={{fontSize:14,color:tendColor(ind.tendance)}}>{tendIcon(ind.tendance)}</span>
              </div>
            </div>
          ))}
        </div>
        {(result.alertes||[]).length>0&&<div style={{marginBottom:14}}>
          <SectionLabel>ALERTES</SectionLabel>
          {result.alertes.map((a,i)=><div key={i} style={{fontSize:13,color:"#7F1D1D",padding:"8px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #FCA5A5",background:"#FFF5F5",marginBottom:5,display:"flex",gap:8}}><span>⚠️</span><span>{a}</span></div>)}
        </div>}
        <div>
          <SectionLabel>ACTIONS PRIORITAIRES</SectionLabel>
          {(result.actions||[]).map((a,i)=><div key={i} style={{fontSize:13,color:"var(--color-text-primary)",padding:"8px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",marginBottom:5,display:"flex",gap:8}}><span style={{color:V,fontWeight:500}}>{i+1}.</span><span>{a}</span></div>)}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        <div>
          <SectionLabel>MOIS</SectionLabel>
          <select value={form.mois} onChange={e=>sf("mois",e.target.value)} style={{fontSize:13,padding:"9px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",width:"100%",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}>
            {MOIS.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
        <div><SectionLabel>ANNÉE</SectionLabel><Inp value={form.annee} onChange={v=>sf("annee",v)} placeholder="2026"/></div>
        <div><SectionLabel opt>OBJECTIF (€)</SectionLabel><Inp value={form.objectif} onChange={v=>sf("objectif",v)} placeholder="5 000"/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        <div><SectionLabel>CA RÉALISÉ (€)</SectionLabel><Inp value={form.ca} onChange={v=>sf("ca",v)} placeholder="4 200"/></div>
        <div><SectionLabel>CLIENTS ACTIFS</SectionLabel><Inp value={form.clients} onChange={v=>sf("clients",v)} placeholder="8"/></div>
        <div><SectionLabel>SÉANCES RÉALISÉES</SectionLabel><Inp value={form.seances} onChange={v=>sf("seances",v)} placeholder="14"/></div>
      </div>
      <div style={{marginBottom:20}}>
        <SectionLabel opt>NOTES / FAITS MARQUANTS</SectionLabel>
        <textarea value={form.notes} onChange={e=>sf("notes",e.target.value)} rows={3} placeholder="Ex. : 2 nouveaux clients signés, 1 client en pause, objectif commercial atteint à 84%…"
          style={{width:"100%",fontSize:13,padding:"9px 12px",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)"}}/>
      </div>
      {err&&<div style={{fontSize:13,color:"#991B1B",marginBottom:14,padding:"10px 14px",background:"#FEE2E2",borderRadius:"var(--border-radius-md)"}}>⚠️ {err}</div>}
      {loading?<Spinner msg="Génération du récapitulatif…"/>:<button onClick={generate} style={{fontSize:14,fontWeight:500,padding:"11px 22px",cursor:"pointer",background:V,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)"}}>→ Générer le récapitulatif</button>}
    </div>
  );
}

function AgentAdmin() {
  const [tab,setTab] = useState("devis");
  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.09em",color:"var(--color-text-secondary)",marginBottom:4}}>AGENT ADMIN</div>
        <div style={{fontSize:17,fontWeight:500,color:"var(--color-text-primary)"}}>Gestion commerciale & reporting</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:20,borderBottom:"0.5px solid var(--color-border-tertiary)",paddingBottom:14}}>
        {ADMIN_TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{fontSize:13,padding:"7px 14px",cursor:"pointer",borderRadius:"var(--border-radius-md)",border:tab===t.id?`1px solid ${V}`:"0.5px solid var(--color-border-secondary)",background:tab===t.id?"#F5EFF9":"transparent",color:tab===t.id?V:"var(--color-text-secondary)",fontWeight:tab===t.id?500:400,transition:"all .15s"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {tab==="devis"   && <DevisModule/>}
      {tab==="facture" && <FactureModule/>}
      {tab==="relance" && <RelanceModule/>}
      {tab==="recap"   && <RecapModule/>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mod,setMod] = useState("diagnostic");
  return (
    <div style={{minHeight:"100vh",background:"var(--color-background-secondary)",fontFamily:"var(--font-sans)"}}>
      <nav style={{background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",gap:0,height:52}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginRight:24,flexShrink:0}}>
            <div style={{width:30,height:30,borderRadius:8,background:V,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🎯</div>
            <div>
              <div style={{fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:600,color:V,lineHeight:1.1}}>CapZéniths</div>
              <div style={{fontSize:9,color:"var(--color-text-tertiary)",letterSpacing:"0.06em"}}>SUITE AGENTS IA</div>
            </div>
          </div>
          <div style={{display:"flex",gap:4}}>
            {MODULES.map(m=>(
              <button key={m.id} onClick={()=>setMod(m.id)} style={{fontSize:12,padding:"6px 14px",cursor:"pointer",borderRadius:"var(--border-radius-md)",border:mod===m.id?`1px solid ${V}`:"0.5px solid transparent",background:mod===m.id?"#F5EFF9":"transparent",color:mod===m.id?V:"var(--color-text-secondary)",fontWeight:mod===m.id?500:400,transition:"all .15s",display:"flex",alignItems:"center",gap:6}}>
                <span>{m.icon}</span><span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-xl)",border:"0.5px solid var(--color-border-light)",boxShadow:"0 4px 12px rgba(91,44,145,.08)",padding:"28px 28px 32px"}}>
          {mod==="diagnostic" && <AgentDiagnostic/>}
          {mod==="editorial"  && <AgentEditorial/>}
          {mod==="admin"      && <AgentAdmin/>}
        </div>
      </div>
    </div>
  );
}

}
