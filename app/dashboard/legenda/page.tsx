'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { generateCaption } from '@/lib/claude'

type Platform = 'ig' | 'tt'
type Tone = 'casual' | 'inspirador' | 'engraçado' | 'profissional' | 'viral'

const TONES: { id: Tone; label: string }[] = [
  {id:'casual',label:'Casual'},{id:'inspirador',label:'Inspirador'},
  {id:'engraçado',label:'Engraçado'},{id:'profissional',label:'Profissional'},{id:'viral',label:'Viral'},
]
const NICHES = ['Fitness','Tech','Gastronomia','Gaming','Viagem','Moda','Beleza','Educação']

const card = { background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:10, padding:22 }
const fl   = { fontSize:10, color:'var(--t3)', marginBottom:5, display:'block', textTransform:'uppercase' as const, letterSpacing:'.07em', fontFamily:'var(--mono)' }
const fg   = { marginBottom:14 }

export default function LegendaPage() {
  const [userNiche, setUserNiche] = useState('Creator')
  const [topic,    setTopic]    = useState('')
  const [platform, setPlatform] = useState<Platform>('ig')
  const [tone,     setTone]     = useState<Tone>('casual')
  const [niche,    setNiche]    = useState('')
  const [hashtags, setHashtags] = useState(true)
  const [emojis,   setEmojis]   = useState(true)
  const [loading,  setLoading]  = useState(false)
  const [caption,  setCaption]  = useState('')
  const [err,      setErr]      = useState('')
  const [copied,   setCopied]   = useState(false)
  const [history,  setHistory]  = useState<{text:string;platform:string;tone:string;topic:string}[]>([])

  useEffect(() => {
    createClient().auth.getUser().then(({data})=>{
      setUserNiche(data.user?.user_metadata?.niche || 'Creator')
    })
  }, [])

  const generate = async () => {
    if (!topic.trim()) { setErr('Descreva o assunto do post.'); return }
    setErr(''); setLoading(true); setCaption('')
    try {
      const r = await generateCaption({topic, platform, tone, niche:niche||userNiche, hashtags, emoji:emojis})
      setCaption(r)
      setHistory(h=>[{text:r,platform,tone,topic:topic.slice(0,36)},...h.slice(0,4)])
    } catch { setErr('Erro ao gerar. Tente novamente.') }
    finally { setLoading(false) }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(caption).catch(()=>{})
    setCopied(true); setTimeout(()=>setCopied(false), 2000)
  }

  const togStyle = (active: boolean) => ({
    padding:'5px 11px', borderRadius:5,
    border:`1px solid ${active?'var(--b3)':'var(--b2)'}`,
    background: active?'var(--s3)':'transparent',
    color: active?'var(--t1)':'var(--t2)',
    cursor:'pointer', fontSize:12.5, fontFamily:'var(--sans)', transition:'all .12s',
  })

  const inpStyle = { width:'100%', padding:'8px 11px', background:'var(--s2)', border:'1.5px solid var(--b2)', borderRadius:6, color:'var(--t1)', fontFamily:'var(--sans)', fontSize:13.5, outline:'none', transition:'border-color .15s' }

  return (
    <div className="anim-fade">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:5 }}>Gerador de legendas</h1>
        <p style={{ fontSize:13, color:'var(--t3)' }}>Crie captions em português para Instagram e TikTok com IA</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'start' }}>
        {/* FORM */}
        <div style={card}>
          <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>Configurações</div>

          <div style={fg}>
            <label style={fl}>Plataforma</label>
            <div style={{ display:'flex', gap:4 }}>
              <button style={togStyle(platform==='ig')} onClick={()=>setPlatform('ig')}>Instagram</button>
              <button style={togStyle(platform==='tt')} onClick={()=>setPlatform('tt')}>TikTok</button>
            </div>
          </div>

          <div style={fg}>
            <label style={fl}>Tom</label>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {TONES.map(t=><button key={t.id} style={togStyle(tone===t.id)} onClick={()=>setTone(t.id)}>{t.label}</button>)}
            </div>
          </div>

          <div style={fg}>
            <label style={fl}>Ideia do post</label>
            <textarea style={{ ...inpStyle, resize:'vertical', minHeight:88, lineHeight:1.55 }}
              placeholder={`Ex: "Mostrei minha rotina matinal de ${userNiche}..."`}
              value={topic} onChange={e=>{setTopic(e.target.value);setErr('')}}/>
          </div>

          <div style={fg}>
            <label style={fl}>Nicho (opcional)</label>
            <select style={{ ...inpStyle, cursor:'pointer' }} value={niche} onChange={e=>setNiche(e.target.value)}>
              <option value="">Usar perfil ({userNiche})</option>
              {NICHES.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={fg}>
            <label style={fl}>Extras</label>
            <div style={{ display:'flex', gap:14 }}>
              <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12.5, color:'var(--t2)' }} onClick={()=>setHashtags(v=>!v)}>
                <div style={{ width:14, height:14, borderRadius:3, border:`1px solid ${hashtags?'var(--t2)':'var(--b3)'}`, background:hashtags?'var(--t2)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s', flexShrink:0 }}>
                  {hashtags && <svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2 4-4" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
                Hashtags
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12.5, color:'var(--t2)' }} onClick={()=>setEmojis(v=>!v)}>
                <div style={{ width:14, height:14, borderRadius:3, border:`1px solid ${emojis?'var(--t2)':'var(--b3)'}`, background:emojis?'var(--t2)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s', flexShrink:0 }}>
                  {emojis && <svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2 4-4" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
                Emojis
              </label>
            </div>
          </div>

          {err && <div style={{ fontSize:12, color:'#c87060', background:'rgba(200,112,96,.08)', border:'1px solid rgba(200,112,96,.2)', borderRadius:5, padding:'9px 11px', marginBottom:12, fontFamily:'var(--mono)' }}>{err}</div>}

          <button onClick={generate} disabled={loading} style={{ width:'100%', padding:'9px', borderRadius:6, border:'none', background:loading?'var(--s3)':'var(--t1)', color:loading?'var(--t3)':'var(--bg)', fontFamily:'var(--sans)', fontSize:13.5, fontWeight:500, cursor:loading?'not-allowed':'pointer', transition:'all .15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8, position:'relative' }}>
            {loading
              ? <><div style={{ width:13, height:13, border:'1.5px solid var(--t4)', borderTopColor:'var(--t2)', borderRadius:'50%' }} className="anim-spin"/>Gerando...</>
              : 'Gerar legenda'}
          </button>
        </div>

        {/* RESULT */}
        <div>
          <div style={card}>
            <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14 }}>Resultado</div>

            {!caption && !loading
              ? <div style={{ textAlign:'center', padding:'32px 0', color:'var(--t4)', fontFamily:'var(--mono)', fontSize:11 }}>aguardando geração...</div>
              : <div style={{ background:'var(--s2)', border:'1px solid var(--b1)', borderRadius:6, padding:14, fontSize:13.5, lineHeight:1.7, color:'var(--t1)', whiteSpace:'pre-wrap', minHeight:120 }} className={loading?'anim-pulse':''}>
                  {loading ? 'Gerando sua legenda...' : caption}
                </div>
            }

            {caption && (
              <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
                <button onClick={copy} style={{ padding:'7px 13px', borderRadius:5, border:`1px solid ${copied?'var(--b3)':'var(--b2)'}`, background:copied?'var(--s3)':'transparent', color:copied?'var(--t1)':'var(--t2)', cursor:'pointer', fontSize:12, fontFamily:'var(--sans)', transition:'all .12s' }}>
                  {copied ? 'Copiado ✓' : 'Copiar'}
                </button>
                <button onClick={generate} style={{ padding:'7px 13px', borderRadius:5, border:'1px solid var(--b2)', background:'transparent', color:'var(--t2)', cursor:'pointer', fontSize:12, fontFamily:'var(--sans)', transition:'all .12s' }}>
                  Regenerar
                </button>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div style={{ marginTop:12 }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:8 }}>Histórico</div>
              {history.map((h,i)=>(
                <div key={i} onClick={()=>setCaption(h.text)} style={{ padding:'10px 12px', background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:6, marginBottom:6, cursor:'pointer', transition:'border-color .12s' }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--b2)')}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b1)')}>
                  <div style={{ fontSize:12.5, color:'var(--t1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.text}</div>
                  <div style={{ fontSize:10, color:'var(--t3)', marginTop:3, fontFamily:'var(--mono)' }}>{h.platform==='ig'?'Instagram':'TikTok'} · {h.tone} · {h.topic}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
