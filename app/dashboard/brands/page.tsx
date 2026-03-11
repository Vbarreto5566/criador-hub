'use client'
import { useState } from 'react'
const BRANDS = [
  {e:'👟',n:'Nike Brasil',bdg:'R$ 5K–20K',desc:'Creators fitness e estilo de vida ativo',open:true},
  {e:'📱',n:'Samsung BR',bdg:'R$ 8K–30K',desc:'Reviews de produtos para público jovem',open:true},
  {e:'💄',n:'O Boticário',bdg:'R$ 4K–12K',desc:'Lançamentos de skincare e fragrâncias',open:true},
  {e:'🎮',n:'Nuuvem',bdg:'R$ 2K–8K',desc:'Promoção de jogos e plataformas',open:false},
  {e:'✈️',n:'LATAM Airlines',bdg:'R$ 5K–15K',desc:'Parcerias com viajantes',open:false},
]
export default function BrandsPage() {
  const [contacted, setContacted] = useState<Record<number,boolean>>({})
  return (
    <div className="anim-fade">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:5 }}>Marcas</h1>
        <p style={{ fontSize:13, color:'var(--t3)' }}>Propostas abertas de parceria para creators</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {BRANDS.map((b,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 12px', borderRadius:6, cursor:'pointer', transition:'background .1s' }}
            onMouseEnter={e=>(e.currentTarget.style.background='var(--s1)')}
            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
            <div style={{ width:34, height:34, borderRadius:7, background:'var(--s3)', border:'1px solid var(--b1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{b.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, color:'var(--t1)', marginBottom:2 }}>{b.n}</div>
              <div style={{ fontSize:11.5, color:'var(--t3)' }}>{b.desc}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontFamily:'var(--mono)', background:'var(--s3)', color:'var(--t3)', border:'1px solid var(--b1)' }}>{b.bdg}</span>
              {b.open
                ? <button onClick={()=>setContacted(p=>({...p,[i]:true}))} style={{ padding:'5px 11px', borderRadius:5, border:'1px solid var(--b2)', background:contacted[i]?'rgba(90,122,90,.1)':'transparent', color:contacted[i]?'#5a7a5a':'var(--t2)', cursor:'pointer', fontSize:12, fontFamily:'var(--sans)', transition:'all .12s' }}>
                    {contacted[i]?'Enviado ✓':'Candidatar'}
                  </button>
                : <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontFamily:'var(--mono)', color:'var(--t4)' }}>em breve</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
