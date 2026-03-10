'use client'
import { useState } from 'react'

const CREATORS = [
  { e:'💪', n:'Beatriz Souza', ni:'Fitness', f:'128K' },
  { e:'💻', n:'Rodrigo Nunes', ni:'Tech', f:'89K' },
  { e:'🍳', n:'Camila Torres', ni:'Gastronomia', f:'210K' },
  { e:'🎮', n:'Felipe Matos', ni:'Gaming', f:'340K' },
  { e:'✈️', n:'Lara Mendes', ni:'Viagem', f:'175K' },
  { e:'👔', n:'Bruno Castro', ni:'Moda', f:'95K' },
]

export default function CreatorsPage() {
  const [search, setSearch] = useState('')
  const [connected, setConnected] = useState<Record<number,boolean>>({})

  const filtered = CREATORS.filter(c =>
    c.n.toLowerCase().includes(search.toLowerCase()) ||
    c.ni.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="anim-fadeup">
      <input className="input-base" style={{ marginBottom: 16 }} placeholder="Buscar por nome, nicho ou localização..." value={search} onChange={e => setSearch(e.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {filtered.map((c, i) => (
          <div key={i} style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c3aff')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)')}>
            <div style={{ fontSize: 34, marginBottom: 9 }}>{c.e}</div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.n}</div>
            <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 10 }}>{c.ni} · {c.f} seguidores</div>
            <button onClick={() => setConnected(p => ({ ...p, [i]: !p[i] }))} style={{ width: '100%', padding: 7, borderRadius: 8, border: `1px solid ${connected[i] ? '#00e5c3' : '#7c3aff'}`, background: connected[i] ? 'rgba(0,229,195,.1)' : 'rgba(124,58,255,.08)', color: connected[i] ? '#00e5c3' : '#f0eeff', cursor: 'pointer', fontSize: 12, transition: 'all .2s' }}>
              {connected[i] ? '✓ Conectado' : 'Conectar'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b6b8a' }}>Nenhum creator encontrado para "{search}"</div>}
      </div>
    </div>
  )
}
