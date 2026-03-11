'use client'
const card = { background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:10, padding:20 }
export default function AnalyticsPage() {
  const bars1 = [28,42,35,58,50,70,55,80,65,75,62,70,80]
  const bars2 = [55,80,65,75,85,62,72,90,80,84,70,78,88]
  return (
    <div className="anim-fade">
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:5 }}>Analytics</h1>
        <p style={{ fontSize:13, color:'var(--t3)' }}>Conecte suas redes para ver dados em tempo real</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
        {[['Instagram',bars1],['TikTok',bars2]].map(([title, bars])=>(
          <div key={title as string} style={card}>
            <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>{title as string}</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              {[['seguidores','—'],['alcance','—'],['engaj.','—']].map(([l,v])=>(
                <div key={l}><div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)' }}>{l}</div><div style={{ fontFamily:'var(--serif)', fontSize:18, fontStyle:'italic', color:'var(--t2)' }}>{v}</div></div>
              ))}
            </div>
            <div style={{ display:'flex', gap:3, alignItems:'flex-end', height:38 }}>
              {(bars as number[]).map((h,i)=>(
                <div key={i} style={{ flex:1, borderRadius:'2px 2px 0 0', background:'var(--s4)', height:h*.45+'px', transition:'background .15s', cursor:'default' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--t3)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='var(--s4)')}/>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card, textAlign:'center', padding:'40px 24px' }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--t4)', marginBottom:8 }}>analytics indisponível</div>
        <div style={{ fontFamily:'var(--serif)', fontSize:18, fontStyle:'italic', color:'var(--t2)', marginBottom:16 }}>Conecte suas redes para começar</div>
        <button style={{ padding:'7px 16px', borderRadius:6, border:'1px solid var(--b2)', background:'transparent', color:'var(--t2)', cursor:'pointer', fontSize:13, fontFamily:'var(--sans)' }}>Conectar Instagram</button>
      </div>
    </div>
  )
}
