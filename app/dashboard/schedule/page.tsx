'use client'

const POSTS = [
  { time:'09:00', platform:'ig', title:'Reels — Rotina matinal', caption:'5 hábitos que mudaram minha vida 🌅', status:'sc' },
  { time:'12:30', platform:'tt', title:'TikTok — Treino rápido', caption:'15min sem equipamento', status:'lv' },
  { time:'18:00', platform:'ig', title:'Stories — Bastidores', caption:'Nos bastidores da parceria', status:'dr' },
]

const STATUS_MAP: Record<string,{label:string,color:string,bg:string}> = {
  sc: { label:'Agendado',    color:'#a78bfa', bg:'rgba(124,58,255,.14)' },
  lv: { label:'🔴 Ao vivo',  color:'#00e5c3', bg:'rgba(0,229,195,.1)' },
  dr: { label:'Rascunho',    color:'#6b6b8a', bg:'rgba(255,255,255,.04)' },
}

export default function SchedulePage() {
  const today = new Date().toLocaleDateString('pt-BR',{ weekday:'long', day:'numeric', month:'long' })

  return (
    <div className="anim-fadeup">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, color: '#6b6b8a', textTransform: 'capitalize' }}>{today}</div>
        <button className="btn-gradient" style={{ padding: '9px 16px', borderRadius: 9, fontSize: 13 }}>+ Agendar Post</button>
      </div>

      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6b6b8a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3b6b', display: 'inline-block' }} />Hoje
      </div>

      {POSTS.map((p, i) => {
        const s = STATUS_MAP[p.status]
        return (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 14px', background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 11, marginBottom: 8 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, color: '#6b6b8a', minWidth: 46 }}>{p.time}</div>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: p.platform === 'ig' ? 'rgba(230,104,60,.14)' : 'rgba(255,0,79,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
              {p.platform === 'ig' ? '📸' : '🎵'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: '#6b6b8a', marginTop: 1 }}>{p.caption}</div>
            </div>
            <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, background: s.bg, color: s.color }}>{s.label}</span>
          </div>
        )
      })}

      <div style={{ marginTop: 20, padding: 22, background: '#0f0f1a', border: '1px dashed rgba(255,255,255,.07)', borderRadius: 14, textAlign: 'center', color: '#6b6b8a', fontSize: 13 }}>
        + Clique em "Agendar Post" para adicionar novo conteúdo
      </div>
    </div>
  )
}
