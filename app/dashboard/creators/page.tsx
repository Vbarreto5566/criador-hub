'use client'
import { useState } from 'react'
const CREATORS = [
  {e:'💪',n:'Beatriz Souza',ni:'Fitness',f:'128K',eng:'6.2%'},
  {e:'💻',n:'Rodrigo Nunes',ni:'Tech',f:'89K',eng:'4.8%'},
  {e:'🍳',n:'Camila Torres',ni:'Gastronomia',f:'210K',eng:'7.1%'},
  {e:'🎮',n:'Felipe Matos',ni:'Gaming',f:'340K',eng:'5.5%'},
  {e:'✈️',n:'Lara Mendes',ni:'Viagem',f:'175K',eng:'8.3%'},
  {e:'👔',n:'Bruno Castro',ni:'Moda',f:'95K',eng:'5.9%'},
]
export default function CreatorsPage() {
  const [search, setSearch] = useState('')
  const [connected, setConnected] = useState<Record<number,boolean>>({})
  const filtered = CREATORS.filter(c=>c.n.toLowerCase().includes(search.toLowerCase())||c.ni.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="anim-fade">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:5 }}>Criadores</h1>
        <p style={{ fontSize:13, color:'var(--t3)' }}>Encontre e conecte com outros creators</p>
      </div>
      <input style={{ width:'100%', padding:'8px 11px', background:'var(--s1)', border:'1px solid var(--b2)', borderRadius:6, color:'var(--t1)', fontFamily:'var(--sans)', fontSize:13.5, outline:'none', marginBottom:14 }} placeholder="Buscar por nome ou nicho..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {filtered.map((c,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:6, cursor:'pointer', transition:'background .1s' }}
            onMouseEnter={e=>(e.currentTarget.style.background='var(--s1)')}
            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
            <div style={{ width:32, height:32, borderRadius:6, background:'var(--s3)', border:'1px solid var(--b1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{c.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, color:'var(--t1)' }}>{c.n}</div>
              <div style={{ fontSize:11, color:'var(--t3)', fontFamily:'var(--mono)' }}>{c.ni} · {c.f} seguidores · {c.eng} engajamento</div>
            </div>
            <button onClick={()=>setConnected(p=>({...p,[i]:!p[i]}))} style={{ padding:'5px 11px', borderRadius:5, border:`1px solid ${connected[i]?'rgba(90,122,90,.4)':'var(--b2)'}`, background:connected[i]?'rgba(90,122,90,.1)':'transparent', color:connected[i]?'#5a7a5a':'var(--t2)', cursor:'pointer', fontSize:12, fontFamily:'var(--sans)', transition:'all .12s' }}>
              {connected[i]?'Conectado ✓':'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
