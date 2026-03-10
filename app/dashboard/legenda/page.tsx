'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { generateCaption } from '@/lib/claude'

type Platform = 'ig' | 'tt'
type Tone = 'casual' | 'inspirador' | 'engraçado' | 'profissional' | 'viral'
type HistoryItem = { text: string; platform: Platform; tone: Tone; topic: string }

const TONES: { id: Tone; label: string }[] = [
  { id: 'casual',       label: '😊 Casual' },
  { id: 'inspirador',   label: '✨ Inspirador' },
  { id: 'engraçado',    label: '😂 Engraçado' },
  { id: 'profissional', label: '💼 Profissional' },
  { id: 'viral',        label: '🔥 Viral' },
]

const NICHES = ['Fitness','Tech','Gastronomia','Gaming','Viagem','Moda','Beleza','Educação','Humor','Negócios']

export default function LegendaPage() {
  const [userNiche, setUserNiche] = useState('Creator')
  const [topic,     setTopic]     = useState('')
  const [platform,  setPlatform]  = useState<Platform>('ig')
  const [tone,      setTone]      = useState<Tone>('casual')
  const [niche,     setNiche]     = useState('')
  const [hashtags,  setHashtags]  = useState(true)
  const [emojis,    setEmojis]    = useState(true)
  const [loading,   setLoading]   = useState(false)
  const [caption,   setCaption]   = useState('')
  const [err,       setErr]       = useState('')
  const [copied,    setCopied]    = useState(false)
  const [history,   setHistory]   = useState<HistoryItem[]>([])

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserNiche(data.user?.user_metadata?.niche || 'Creator')
    })
  }, [])

  const generate = async () => {
    if (!topic.trim()) { setErr('Descreva o assunto do post primeiro.'); return }
    setErr(''); setLoading(true); setCaption('')
    try {
      const result = await generateCaption({ topic, platform, tone, niche: niche || userNiche, hashtags, emoji: emojis })
      setCaption(result)
      setHistory(h => [{ text: result, platform, tone, topic: topic.slice(0,40) }, ...h.slice(0,4)])
    } catch {
      setErr('Erro ao gerar legenda. Verifique sua conexão e tente novamente.')
    } finally { setLoading(false) }
  }

  const copy = async () => {
    if (!caption) return
    await navigator.clipboard.writeText(caption).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const togStyle = (active: boolean, extra?: object) => ({
    padding: '7px 14px', borderRadius: 20,
    border: `1.5px solid ${active ? '#7c3aff' : 'rgba(255,255,255,.07)'}`,
    background: active ? 'rgba(124,58,255,.12)' : 'transparent',
    color: active ? '#f0eeff' : '#6b6b8a',
    cursor: 'pointer', fontSize: 13,
    transition: 'all .2s', ...extra
  })

  const card = { background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 24 }
  const fl   = { fontSize: 11, color: '#6b6b8a', marginBottom: 5, display: 'block', textTransform: 'uppercase' as const, letterSpacing: '.06em' }
  const fg   = { marginBottom: 14 }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }} className="anim-fadeup">
      {/* FORM */}
      <div style={card}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6b6b8a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aff', display: 'inline-block' }} />Configurar Legenda
        </div>

        <div style={fg}>
          <label style={fl}>Plataforma</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={togStyle(platform==='ig', platform==='ig' ? { borderColor:'#e6683c', background:'rgba(230,104,60,.1)', color:'#e6683c' } : {})} onClick={() => setPlatform('ig')}>📸 Instagram</button>
            <button style={togStyle(platform==='tt', platform==='tt' ? { borderColor:'#ff004f', background:'rgba(255,0,79,.1)', color:'#ff004f' } : {})} onClick={() => setPlatform('tt')}>🎵 TikTok</button>
          </div>
        </div>

        <div style={fg}>
          <label style={fl}>Tom da legenda</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {TONES.map(t => <button key={t.id} style={togStyle(tone===t.id)} onClick={() => setTone(t.id)}>{t.label}</button>)}
          </div>
        </div>

        <div style={fg}>
          <label style={fl}>Assunto / ideia do post</label>
          <textarea className="input-base" style={{ resize: 'vertical', minHeight: 90, lineHeight: 1.6 }}
            placeholder={`Ex: "Mostrei minha rotina matinal de ${userNiche} antes do trabalho"...`}
            value={topic} onChange={e => { setTopic(e.target.value); setErr('') }} />
        </div>

        <div style={fg}>
          <label style={fl}>Nicho (opcional)</label>
          <select className="input-base" style={{ background: '#161625', cursor: 'pointer' }} value={niche} onChange={e => setNiche(e.target.value)}>
            <option value="">Usar nicho do perfil ({userNiche})</option>
            {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div style={fg}>
          <label style={fl}>Opções extras</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            {[['hashtags','# Hashtags',hashtags,setHashtags],['emojis','😊 Emojis',emojis,setEmojis]].map(([id,lbl,val,setter]) => (
              <label key={id as string} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#6b6b8a' }} onClick={() => (setter as any)((v: boolean) => !v)}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${val ? '#7c3aff' : 'rgba(255,255,255,.07)'}`, background: val ? '#7c3aff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                  {val && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                </div>
                {lbl}
              </label>
            ))}
          </div>
        </div>

        {err && <div style={{ background: 'rgba(255,59,107,.1)', border: '1px solid rgba(255,59,107,.25)', color: '#ff8fab', borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 14 }}>⚠️ {err}</div>}

        <button className="btn-gradient" style={{ width: '100%', padding: 13, borderRadius: 11, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', color: loading ? 'transparent' : 'white' }}
          onClick={generate} disabled={loading}>
          {loading
            ? <span style={{ position: 'absolute', width: 20, height: 20, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="anim-spin" />
            : <>🤖 Gerar Legenda com IA</>}
        </button>
      </div>

      {/* RESULT */}
      <div style={card}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6b6b8a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3b6b', display: 'inline-block' }} />Legenda Gerada
        </div>

        {!caption && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b6b8a' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
            <div style={{ fontSize: 14 }}>Configure as opções e clique em<br /><strong style={{ color: '#f0eeff' }}>Gerar Legenda com IA</strong></div>
          </div>
        )}

        {(caption || loading) && (
          <>
            <div style={{ background: '#161625', border: '1px solid rgba(255,255,255,.07)', borderRadius: 11, padding: 18, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 160 }} className={loading ? 'anim-pulse' : ''}>
              {loading ? <span style={{ color: '#6b6b8a' }}>Gerando sua legenda perfeita em português... ✨</span> : caption}
            </div>
            {caption && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' as const }}>
                <button onClick={copy} style={{ padding: '9px 16px', borderRadius: 9, border: `1.5px solid ${copied ? '#7c3aff' : '#00e5c3'}`, background: copied ? 'rgba(124,58,255,.1)' : 'rgba(0,229,195,.08)', color: copied ? '#a78bfa' : '#00e5c3', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s' }}>
                  {copied ? '✓ Copiado!' : '📋 Copiar legenda'}
                </button>
                <button onClick={generate} style={{ padding: '9px 16px', borderRadius: 9, border: '1.5px solid #ff3b6b', background: 'rgba(255,59,107,.07)', color: '#ff3b6b', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔄 Gerar outra versão
                </button>
              </div>
            )}
          </>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Histórico recente</div>
            {history.map((h, i) => (
              <div key={i} onClick={() => setCaption(h.text)} style={{ padding: '11px 13px', background: '#161625', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, marginBottom: 7, cursor: 'pointer', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c3aff')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)')}>
                <p style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.text}</p>
                <span style={{ fontSize: 11, color: '#6b6b8a', marginTop: 3, display: 'block' }}>
                  {h.platform === 'ig' ? '📸 Instagram' : '🎵 TikTok'} · {h.tone} · {h.topic}{h.topic.length >= 40 ? '...' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
