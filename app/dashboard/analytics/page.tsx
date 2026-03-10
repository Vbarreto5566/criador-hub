// app/dashboard/analytics/page.tsx
'use client'
export default function AnalyticsPage() {
  const card = { background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20 }
  const bars = [30,50,40,70,60,80,65,90,75,85]
  const bars2 = [60,90,75,85,95,70,80,100,88,92]

  return (
    <div className="anim-fadeup">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {[['📸 Instagram', bars, '#e6683c'], ['🎵 TikTok', bars2, '#ff004f']].map(([title, b, col]) => (
          <div key={title as string} style={card}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6b6b8a', marginBottom: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: col as string, display: 'inline-block' }} />{title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {[['Seguidores','—'],['Alcance','—'],['Engaj.','—']].map(([l,v]) => (
                <div key={l}><div style={{ fontSize: 11, color: '#6b6b8a' }}>{l}</div><div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 34, marginTop: 10 }}>
              {(b as number[]).map((h, i) => <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: `${col as string}33`, height: h * .34 + 'px' }} />)}
            </div>
            <div style={{ fontSize: 11, color: '#6b6b8a', marginTop: 5 }}>Conecte sua conta para ver dados reais</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: 32, background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, marginBottom: 6 }}>Analytics completo disponível após conectar suas redes</div>
        <div style={{ color: '#6b6b8a', fontSize: 13 }}>Vá em Perfil → Conectar Redes Sociais para ativar</div>
      </div>
    </div>
  )
}
