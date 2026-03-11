'use client'
const POSTS = [
  {time:'09:00',pl:'ig',title:'Reels — Rotina matinal',cap:'5 hábitos que mudaram minha vida',st:'sc'},
  {time:'12:30',pl:'tt',title:'TikTok — Treino rápido',cap:'15min sem equipamento',st:'lv'},
  {time:'18:00',pl:'ig',title:'Stories — Bastidores',cap:'Nos bastidores da parceria',st:'dr'},
]
const stMap: Record<string,{label:string;color:string;bg:string}> = {
  sc:{label:'agendado',color:'#6b6760',bg:'rgba(107,103,96,.12)'},
  lv:{label:'ao vivo', color:'#5a7a5a',bg:'rgba(90,122,90,.12)'},
  dr:{label:'rascunho',color:'#5a5a4a',bg:'rgba(90,90,74,.1)'},
}
export default function SchedulePage() {
  const today = new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})
  return (
    <div className="anim-fade">
      <div style={{ marginBottom:28, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:5 }}>Agenda</h1>
          <p style={{ fontSize:13, color:'var(--t3)' }}>Planeje e agende seu conteúdo</p>
        </div>
        <button style={{ padding:'7px 14px', borderRadius:6, border:'none', background:'var(--t1)', color:'var(--bg)', fontSize:12.5, fontFamily:'var(--sans)', fontWeight:500, cursor:'pointer', marginTop:6 }}>+ Novo post</button>
      </div>
      {['Hoje','Amanhã'].map(day=>(
        <div key={day} style={{ marginBottom:24 }}>
          <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8, paddingLeft:12 }}>{day}</div>
          {POSTS.map((p,i)=>{
            const s = stMap[p.st]
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 12px', borderRadius:6, cursor:'pointer', transition:'background .1s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--s1)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--t3)', minWidth:38 }}>{p.time}</span>
                <span style={{ width:5, height:5, borderRadius:'50%', background:p.pl==='ig'?'var(--t3)':'var(--t4)', flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13 }}>{p.title}</div>
                  <div style={{ fontSize:11, color:'var(--t3)' }}>{p.cap}</div>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ padding:'2px 7px', borderRadius:4, fontSize:10, fontFamily:'var(--mono)', background:s.bg, color:s.color }}>{s.label}</span>
                  <button style={{ padding:'4px 9px', borderRadius:5, border:'1px solid var(--b2)', background:'transparent', color:'var(--t3)', cursor:'pointer', fontSize:11, fontFamily:'var(--sans)' }}>editar</button>
                </div>
              </div>
            )
          })}
        </div>
      ))}
      <div style={{ textAlign:'center', padding:'28px 0', color:'var(--t4)', fontFamily:'var(--mono)', fontSize:11, borderTop:'1px solid var(--b1)' }}>
        clique em &quot;+ novo post&quot; para adicionar conteúdo
      </div>
    </div>
  )
}
