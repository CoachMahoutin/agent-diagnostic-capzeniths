import { useState, useRef, useCallback } from 'react'

/* ─── Constants ─── */
const SECTEURS = [
  'Commerce / Retail','Restauration / Hôtellerie','BTP / Artisanat',
  'Services aux entreprises','Conseil / Formation','Santé / Bien-être',
  'Tech / Numérique','Transport / Logistique','Industrie / Production','Autre'
]
const TYPES = ['Auto-entrepreneur / EI','EURL / SARL','SAS / SASU','SA','Association','Autre']
const CA_OPTIONS = ['< 50k€','50k – 150k€','150k – 500k€','500k – 1M€','> 1M€']

const PILLAR_ICONS = {
  Cash:'💰', Stratégie:'🎯', Clients:'🤝',
  Équipe:'👥', Risques:'⚠️', Croissance:'📈', Résilience:'🛡️'
}

const STATUS = {
  ROUGE:  { bg:'#FEE2E2', text:'#991B1B', border:'#FCA5A5', dot:'#EF4444' },
  ORANGE: { bg:'#FEF3C7', text:'#92400E', border:'#FCD34D', dot:'#F59E0B' },
  VERT:   { bg:'#D1FAE5', text:'#065F46', border:'#6EE7B7', dot:'#10B981' },
}

const RISK = {
  CRITIQUE: { bg:'#7F1D1D', text:'#FEE2E2' },
  ÉLEVÉ:    { bg:'#78350F', text:'#FEF3C7' },
  MODÉRÉ:   { bg:'#713F12', text:'#FEF9C3' },
  FAIBLE:   { bg:'#064E3B', text:'#D1FAE5' },
}

const LOAD_MSGS = [
  'Lecture du rapport Cap-Diag…',
  'Analyse des 7 piliers en cours…',
  'Évaluation des risques critiques…',
  'Construction du plan d\'action…',
  'Finalisation du rapport L1.1…',
]

const SYSTEM_PROMPT = `Tu es l'Agent Diagnostic de CapZéniths, cabinet de conseil nouvelle génération spécialisé dans la prévention des difficultés d'entreprise.

On te fournit soit un rapport PDF Cap-Diag, soit des réponses textuelles brutes, soit les deux. Ton rôle : extraire toutes les informations pertinentes et générer un rapport L1.1 structuré, percutant et actionnable.

MÉTHODOLOGIE CAPZÉNITHS — 7 piliers de survie :
1. Cash — Trésorerie, flux financiers, BFR, réserves
2. Stratégie — Positionnement, vision, différenciation, marché
3. Clients — Acquisition, fidélisation, concentration, CA récurrent
4. Équipe — RH, compétences clés, organisation, dépendances
5. Risques — Juridique, opérationnel, marché, concurrence
6. Croissance — Développement, scalabilité, nouveaux marchés
7. Résilience — Capacité d'adaptation, gestion de crise, plan B

SCORING : 1–3 → ROUGE | 4–6 → ORANGE | 7–10 → VERT

STYLE : Direct, factuel, anti-bullshit. Nomme les vrais problèmes sans détour. Uniquement du spécifique basé sur les données. Professionnel mais sans condescendance.

RÉPONDS UNIQUEMENT EN JSON VALIDE, sans markdown, sans backticks, sans texte avant ou après.

FORMAT :
{
  "clientExtrait":{"nom":"...","entreprise":"...","secteur":"...","type":"...","ca":"...","anciennete":"..."},
  "scoreGlobal":<1-10>,
  "niveauRisque":"CRITIQUE"|"ÉLEVÉ"|"MODÉRÉ"|"FAIBLE",
  "synthese":"<3-4 phrases percutantes>",
  "pilliers":[
    {"nom":"Cash","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase précise>"},
    {"nom":"Stratégie","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase>"},
    {"nom":"Clients","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase>"},
    {"nom":"Équipe","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase>"},
    {"nom":"Risques","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase>"},
    {"nom":"Croissance","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase>"},
    {"nom":"Résilience","score":<1-10>,"statut":"ROUGE"|"ORANGE"|"VERT","diagnostic":"<1 phrase>"}
  ],
  "pointsCritiques":[
    {"titre":"...","description":"...","impact":"..."},
    {"titre":"...","description":"...","impact":"..."},
    {"titre":"...","description":"...","impact":"..."}
  ],
  "planAction":{"j30":["...","...","..."],"j60":["...","..."],"j90":["...","..."]},
  "prochainesEtapes":"<2-3 phrases directes>"
}`

/* ─── Sub-components ─── */
const Label = ({ children, optional }) => (
  <div style={{ fontSize:11, fontWeight:500, letterSpacing:'0.08em',
    color:'var(--text-secondary)', marginBottom:8, display:'flex', gap:8, alignItems:'center' }}>
    {children}
    {optional && <span style={{ fontSize:10, fontWeight:400, opacity:0.7 }}>(optionnel)</span>}
  </div>
)

const ScoreBar = ({ score }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
    <div style={{ flex:1, height:4, background:'var(--border-light)', borderRadius:2, overflow:'hidden' }}>
      <div style={{
        width:`${score * 10}%`, height:'100%', borderRadius:2,
        background: score <= 3 ? '#EF4444' : score <= 6 ? '#F59E0B' : '#10B981',
        transition:'width 0.8s ease'
      }} />
    </div>
    <span style={{ fontSize:14, fontWeight:500, minWidth:18 }}>{score}</span>
  </div>
)

/* ─── Main Component ─── */
export default function App() {
  const [step, setStep]           = useState(1)
  const [pdfFile, setPdfFile]     = useState(null)
  const [pdfBase64, setPdfBase64] = useState(null)
  const [context, setContext]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [loadMsg, setLoadMsg]     = useState('')
  const [report, setReport]       = useState(null)
  const [error, setError]         = useState('')
  const [dragOver, setDragOver]   = useState(false)
  const fileRef                   = useRef(null)

  const readPdf = (file) => new Promise((res, rej) => {
    const r = new FileReader()
    r.onload  = () => res(r.result.split(',')[1])
    r.onerror = () => rej(new Error('Lecture échouée'))
    r.readAsDataURL(file)
  })

  const handleFile = useCallback(async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Seuls les fichiers PDF sont acceptés.'); return }
    if (file.size > 10 * 1024 * 1024)   { setError('Fichier trop volumineux (max 10 Mo).'); return }
    setError('')
    setPdfFile(file)
    setPdfBase64(await readPdf(file))
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const generate = async () => {
    if (!pdfBase64 && !context.trim()) {
      setError('Importe un PDF Cap-Diag ou ajoute du contexte textuel.')
      return
    }
    setError(''); setLoading(true)
    let mi = 0; setLoadMsg(LOAD_MSGS[0])
    const iv = setInterval(() => { mi = Math.min(mi+1, LOAD_MSGS.length-1); setLoadMsg(LOAD_MSGS[mi]) }, 2000)

    try {
      const userContent = []
      if (pdfBase64) userContent.push({ type:'document', source:{ type:'base64', media_type:'application/pdf', data:pdfBase64 } })
      userContent.push({ type:'text', text:'Analyse ce rapport Cap-Diag et génère le rapport L1.1 CapZéniths.' + (context.trim() ? `\n\nContexte complémentaire :\n${context.trim()}` : '') })

      /* Calls /api/analyze — Vercel serverless function (keeps API key server-side) */
      const res  = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role:'user', content:userContent }]
        })
      })
      clearInterval(iv)
      const data   = await res.json()
      const raw    = data.content?.[0]?.text || ''
      const clean  = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setReport(parsed); setStep(2)
    } catch(e) {
      clearInterval(iv)
      setError('Erreur lors de l\'analyse. Vérifie le fichier et réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setStep(1); setReport(null); setPdfFile(null); setPdfBase64(null); setContext(''); setError('') }

  /* ── LAYOUT WRAPPER ── */
  const Page = ({ children }) => (
    <div style={{ minHeight:'100vh', background:'var(--bg-secondary)', padding:'24px 16px' }}>
      {/* Header */}
      <div style={{ maxWidth:680, margin:'0 auto 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'var(--violet)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🎯</div>
          <div>
            <div style={{ fontFamily:'Poppins,sans-serif', fontSize:15, fontWeight:600, color:'var(--violet)' }}>CapZéniths</div>
            <div style={{ fontSize:11, color:'var(--text-tertiary)', letterSpacing:'0.06em' }}>AGENT DIAGNOSTIC</div>
          </div>
        </div>
        {step === 2 && (
          <button onClick={reset} className="no-print"
            style={{ fontSize:12, padding:'6px 14px', border:'1px solid var(--border-medium)', background:'transparent', color:'var(--text-secondary)' }}>
            ← Nouveau diagnostic
          </button>
        )}
      </div>
      {/* Card */}
      <div style={{ maxWidth:680, margin:'0 auto', background:'var(--bg-primary)', borderRadius:var_('--radius-xl'), border:'1px solid var(--border-light)', boxShadow:'var(--shadow-md)', padding:'28px 28px 32px' }}>
        {children}
      </div>
    </div>
  )
  const var_ = (v) => `var(${v})`

  /* ── REPORT VIEW ── */
  if (step === 2 && report) {
    const c    = report.clientExtrait || {}
    const risk = RISK[report.niveauRisque] || RISK['MODÉRÉ']
    const date = new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})
    const clientLabel = [c.entreprise, c.nom].filter(v => v && !v.includes('trouvé')).join(' — ')
    const metaLabel   = [c.secteur, c.type, c.ca].filter(v => v && !v.includes('trouvé')).join(' · ')

    return (
      <Page>
        <div className="fade-in">
          {/* Report header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, paddingBottom:20, borderBottom:'1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize:10, fontWeight:500, letterSpacing:'0.09em', color:'var(--text-tertiary)', marginBottom:6 }}>
                RAPPORT DIAGNOSTIC L1.1 · {date.toUpperCase()}
              </div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontSize:20, fontWeight:600, color:'var(--text-primary)', marginBottom:4 }}>
                {clientLabel || 'Client'}
              </div>
              {metaLabel && <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{metaLabel}</div>}
            </div>
            <div style={{ textAlign:'right', flexShrink:0, marginLeft:20 }}>
              <div style={{ fontFamily:'Poppins,sans-serif', fontSize:40, fontWeight:300, color:'var(--text-primary)', lineHeight:1 }}>
                {report.scoreGlobal}
                <span style={{ fontSize:18, color:'var(--text-tertiary)' }}>/10</span>
              </div>
              <div style={{ marginTop:8, display:'inline-block', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:600, background:risk.bg, color:risk.text }}>
                RISQUE {report.niveauRisque}
              </div>
            </div>
          </div>

          {/* Synthèse */}
          <div style={{ padding:'16px 18px', borderRadius:'var(--radius-lg)', background:'var(--bg-secondary)', border:'1px solid var(--border-light)', marginBottom:20 }}>
            <Label>SYNTHÈSE</Label>
            <p style={{ fontSize:14, color:'var(--text-primary)', lineHeight:1.75, margin:0 }}>{report.synthese}</p>
          </div>

          {/* 7 Piliers */}
          <div style={{ marginBottom:20 }}>
            <Label>TABLEAU DE BORD 7 PILIERS</Label>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {report.pilliers.map(p => {
                const s = STATUS[p.statut] || STATUS.ORANGE
                return (
                  <div key={p.nom} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:'var(--radius-md)', border:'1px solid var(--border-light)', background:'var(--bg-primary)' }}>
                    <div style={{ width:12, height:12, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
                    <div style={{ width:22, fontSize:16, flexShrink:0 }}>{PILLAR_ICONS[p.nom]}</div>
                    <div style={{ width:86, fontSize:13, fontWeight:500, flexShrink:0 }}>{p.nom}</div>
                    <div style={{ width:116, flexShrink:0 }}><ScoreBar score={p.score} /></div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', flex:1, lineHeight:1.5 }}>{p.diagnostic}</div>
                    <div style={{ flexShrink:0, padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600, background:s.bg, color:s.text, border:`1px solid ${s.border}` }}>{p.statut}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Points critiques */}
          <div style={{ marginBottom:20 }}>
            <Label>POINTS CRITIQUES</Label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {report.pointsCritiques.map((p,i) => (
                <div key={i} style={{ padding:'14px 16px', borderRadius:'var(--radius-md)', border:'1px solid #FCA5A5', background:'#FFF5F5' }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#7F1D1D', marginBottom:5 }}>
                    <span style={{ opacity:0.45, marginRight:8 }}>{i+1}.</span>{p.titre}
                  </div>
                  <div style={{ fontSize:13, color:'#7F1D1D', lineHeight:1.6, marginBottom:5 }}>{p.description}</div>
                  <div style={{ fontSize:12, color:'#991B1B', display:'flex', gap:6 }}>
                    <span style={{ opacity:0.55 }}>Impact :</span><span>{p.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan d'action */}
          <div style={{ marginBottom:20 }}>
            <Label>PLAN D'ACTION</Label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                {label:'J+30', actions:report.planAction.j30, color:'var(--violet)'},
                {label:'J+60', actions:report.planAction.j60, color:'var(--rose)'},
                {label:'J+90', actions:report.planAction.j90, color:'var(--green)'},
              ].map(({label, actions, color}) => (
                <div key={label} style={{ padding:'14px', borderRadius:'var(--radius-md)', border:'1px solid var(--border-light)', background:'var(--bg-secondary)' }}>
                  <div style={{ fontSize:12, fontWeight:600, color, marginBottom:10, paddingBottom:8, borderBottom:'1px solid var(--border-light)' }}>{label}</div>
                  {(actions||[]).map((a,i) => (
                    <div key={i} style={{ fontSize:12, color:'var(--text-primary)', marginBottom:7, display:'flex', gap:7, lineHeight:1.55 }}>
                      <span style={{ color, flexShrink:0 }}>→</span><span>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Recommandation */}
          <div style={{ padding:'16px 18px', borderRadius:'var(--radius-lg)', border:'1px solid rgba(91,44,145,0.25)', background:'var(--violet-light)', marginBottom:24 }}>
            <Label>RECOMMANDATION CAPZÉNITHS</Label>
            <p style={{ fontSize:14, color:'var(--violet)', lineHeight:1.75, margin:0 }}>{report.prochainesEtapes}</p>
          </div>

          {/* Actions */}
          <div className="no-print" style={{ display:'flex', gap:10 }}>
            <button onClick={reset}
              style={{ fontSize:13, padding:'9px 18px', border:'1px solid var(--border-medium)', background:'transparent', color:'var(--text-secondary)' }}>
              ← Nouveau diagnostic
            </button>
            <button onClick={() => window.print()}
              style={{ fontSize:13, padding:'9px 18px', border:'1px solid var(--border-medium)', background:'transparent', color:'var(--text-secondary)' }}>
              🖨 Imprimer / Exporter PDF
            </button>
          </div>
        </div>
      </Page>
    )
  }

  /* ── INPUT FORM ── */
  return (
    <Page>
      <div>
        <div style={{ fontFamily:'Poppins,sans-serif', fontSize:20, fontWeight:600, color:'var(--text-primary)', marginBottom:6 }}>
          Générer un rapport L1.1
        </div>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:28 }}>
          Importe le rapport PDF Cap-Diag — l'agent extrait les données et génère le rapport complet automatiquement.
        </p>

        {/* PDF Drop Zone */}
        <div style={{ marginBottom:22 }}>
          <Label>RAPPORT CAP-DIAG (PDF)</Label>
          {!pdfFile ? (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              style={{
                border:`2px dashed ${dragOver ? 'var(--violet)' : 'var(--border-medium)'}`,
                borderRadius:'var(--radius-lg)', padding:'36px 20px', textAlign:'center', cursor:'pointer',
                background: dragOver ? 'var(--violet-light)' : 'var(--bg-secondary)',
                transition:'all .15s'
              }}
            >
              <div style={{ fontSize:32, marginBottom:10 }}>📄</div>
              <div style={{ fontFamily:'Poppins,sans-serif', fontSize:15, fontWeight:500, marginBottom:6 }}>Glisse-dépose le PDF ici</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14 }}>ou clique pour sélectionner</div>
              <span style={{ fontSize:13, padding:'7px 16px', borderRadius:20, border:'1px solid var(--border-medium)', color:'var(--text-secondary)', background:'var(--bg-primary)' }}>
                Parcourir…
              </span>
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
                onChange={e => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:'var(--radius-lg)', border:'1px solid var(--green)', background:'var(--green-light)' }}>
              <div style={{ fontSize:24 }}>✅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'#065F46' }}>{pdfFile.name}</div>
                <div style={{ fontSize:12, color:'#047857', marginTop:2 }}>{(pdfFile.size/1024).toFixed(0)} Ko · Prêt à analyser</div>
              </div>
              <button onClick={() => { setPdfFile(null); setPdfBase64(null); setError('') }}
                style={{ fontSize:12, padding:'5px 12px', border:'1px solid var(--green)', background:'transparent', color:'#065F46', borderRadius:'var(--radius-sm)' }}>
                Changer
              </button>
            </div>
          )}
        </div>

        {/* Context */}
        <div style={{ marginBottom:24 }}>
          <Label optional>CONTEXTE COMPLÉMENTAIRE</Label>
          <p style={{ fontSize:12, color:'var(--text-tertiary)', marginBottom:8 }}>
            Notes issues de ton appel découverte, informations non présentes dans le PDF…
          </p>
          <textarea value={context} onChange={e => setContext(e.target.value)} rows={4}
            placeholder={"Ex. : Le dirigeant vient de perdre son principal client (40% du CA). Son associé part en juin. Il hésite à recruter…"}
            style={{ resize:'vertical' }} />
        </div>

        {error && (
          <div style={{ fontSize:13, color:'#991B1B', marginBottom:16, padding:'11px 14px', background:'#FEE2E2', borderRadius:'var(--radius-md)', border:'1px solid #FCA5A5' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding:'18px 0', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:20, height:20, border:'2.5px solid var(--violet)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{loadMsg}</span>
          </div>
        ) : (
          <button onClick={generate}
            style={{ fontSize:14, fontWeight:600, padding:'12px 24px', background:'var(--violet)', color:'#fff', border:'none', fontFamily:'Poppins,sans-serif', letterSpacing:'0.01em' }}>
            → Générer le rapport L1.1
          </button>
        )}
      </div>
    </Page>
  )
}
