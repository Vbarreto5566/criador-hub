'use client'
import { useState } from 'react'

const BRANDS = [
  { ico:'👟', nm:'Nike Brasil', bdg:'R$ 5K–20K', desc:'Creators fitness e estilo de vida ativo.', open:true },
  { ico:'📱', nm:'Samsung BR', bdg:'R$ 8K–30K', desc:'Reviews de produtos para público jovem.', open:true },
  { ico:'💄', nm:'O Boticário', bdg:'R$ 4K–12K', desc:'Lançamentos de skincare e fragrâncias.', open:true },
  { ico:'🎮', nm:'Nuuvem', bdg:'R$ 2K–8K', desc:'Promoção de jogos e plataformas digitais.', open:false },
  { ico:'✈️', nm:'LATAM Airlines', bdg:'R$ 5K–15K', desc:'Parcerias com viajantes para destinos BR e internacional.', open:false },
]

export default function BrandsPage() {
  const [contacted, setContacted] = useState<Record<number,boolean>>({})

  return (
    <div className="anim-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {BRANDS.map((b, i) => (
        <div key={i} style={{ display: 'flex', gap: 15, alignItems: 'center', background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'border-color .2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#00e5c3')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)')}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#161625', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{b.ico}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
              <span style={{ fontWeight: 600 }}>{b.nm}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: b.open ? 'rgba(0,229,195,.08)' : 'rgba(122,122,154,.1)', color: b.open ? '#00e5c3' : '#6b6b8a' }}>{b.open ? 'Aberto' : 'Em breve'}</span>
            </div>
            <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 7 }}>{b.desc}</div>
            <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 6, background: 'rgba(0,229,195,.08)', color: '#00e5c3' }}>💰 {b.bdg}</span>
          </div>
          {b.open && (
            <button onClick={() => setContacted(p => ({ ...p, [i]: true }))} style={{ padding: '9px 16px', borderRadius: 9, border: 'none', flexShrink: 0, background: contacted[i] ? 'rgba(0,229,195,.1)' : 'linear-gradient(135deg,#ff3b6b,#7c3aff)', color: contacted[i] ? '#00e5c3' : '#fff', cursor: 'pointer', fontSize: 12, transition: 'all .2s' }}>
              {contacted[i] ? '✓ Enviado' : 'Candidatar'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
