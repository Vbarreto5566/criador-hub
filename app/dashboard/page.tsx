'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const name     = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'
  const niche    = user?.user_metadata?.niche || 'Creator'
  const initials = name.trim().split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()
  const since    = user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' }) : '—'

  const card = { background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20 }

  return (
    <div className="anim-fadeup">
      {/* HERO */}
      <div style={{ ...card, position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 72, background: 'linear-gradient(135deg,rgba(255,59,107,.12),rgba(124,58,255,.12))' }} />
        <div style={{ width: 74, height: 74, borderRadius: '50%', background: 'linear-gradient(135deg,#ff3b6b,#7c3aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', position: 'relative', zIndex: 1, border: '3px solid #07070f', boxShadow: '0 4px 20px rgba(255,59,107,.4)' }}>{initials}</div>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 700, marginTop: 8, position: 'relative', zIndex: 1 }}>{name}</div>
        <div style={{ color: '#6b6b8a', fontSize: 13, marginTop: 3, position: 'relative', zIndex: 1 }}>{user?.email}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 20, fontSize: 11, background: 'rgba(0,229,195,.1)', color: '#00e5c3', border: '1px solid rgba(0,229,195,.2)', marginTop: 9, position: 'relative', zIndex: 1 }}>✓ Conta ativa · {niche}</div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 }}>
        {[['Seguidores','—','Conecte suas redes'],['Engajamento','—','Conecte suas redes'],['Posts agendados','0','Nenhum agendado']].map(([l,v,c]) => (
          <div key={l} style={{ ...card }}>
            <div style={{ fontSize: 11, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{l}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 11, color: '#6b6b8a', marginTop: 3 }}>{c}</div>
          </div>
        ))}
      </div>

      {/* CONNECT SOCIAL */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6b6b8a', marginBottom: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3b6b', display: 'inline-block' }} />Conectar Redes Sociais
        </div>
        {[['📸','Instagram','#e6683c','rgba(230,104,60,.1)'],['🎵','TikTok','#ff004f','rgba(255,0,79,.1)']].map(([ico,nm,col,bg]) => (
          <div key={nm as string} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px', background: '#161625', border: '1px solid rgba(255,255,255,.07)', borderRadius: 11, marginBottom: 9 }}>
            <span style={{ fontSize: 22 }}>{ico}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{nm}</div>
              <div style={{ fontSize: 12, color: '#6b6b8a' }}>Conecte via API oficial do {nm}</div>
            </div>
            <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${col}66`, background: bg as string, color: col as string, cursor: 'pointer', fontSize: 12 }}>Conectar</button>
          </div>
        ))}
      </div>

      {/* ACCOUNT INFO */}
      <div style={card}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6b6b8a', marginBottom: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3b6b', display: 'inline-block' }} />Informações da Conta
        </div>
        {[['Email', user?.email || '—'],['Nicho', niche],['Membro desde', since],['ID da conta', (user?.id || '').slice(0,12) + '...']].map(([l,v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
            <span style={{ fontSize: 13, color: '#6b6b8a' }}>{l}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
