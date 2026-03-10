'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const navItems = [
  { id: 'perfil',    href: '/dashboard',           icon: '👤', label: 'Perfil' },
  { id: 'legenda',   href: '/dashboard/legenda',   icon: '🤖', label: 'IA Legendas' },
  { id: 'analytics', href: '/dashboard/analytics', icon: '📊', label: 'Analytics' },
  { id: 'creators',  href: '/dashboard/creators',  icon: '👥', label: 'Creators' },
  { id: 'brands',    href: '/dashboard/brands',    icon: '🤝', label: 'Marcas' },
  { id: 'schedule',  href: '/dashboard/schedule',  icon: '📅', label: 'Agenda' },
]

const pageTitles: Record<string, React.ReactNode> = {
  '/dashboard':            <><span style={{color:'#ff3b6b'}}>Meu</span> Perfil</>,
  '/dashboard/legenda':    <>Gerador de <span style={{color:'#ff3b6b'}}>Legendas IA</span> 🤖</>,
  '/dashboard/analytics':  <><span style={{color:'#ff3b6b'}}>Analytics</span></>,
  '/dashboard/creators':   <>Rede de <span style={{color:'#ff3b6b'}}>Criadores</span></>,
  '/dashboard/brands':     <><span style={{color:'#ff3b6b'}}>Marcas</span> &amp; Parcerias</>,
  '/dashboard/schedule':   <>Agenda de <span style={{color:'#ff3b6b'}}>Conteúdo</span></>,
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth'); return }
      setUserEmail(session.user.email || '')
    }
    check()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/auth')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <nav style={{ width: 70, background: '#0f0f1a', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', gap: 4, position: 'sticky', top: 0, height: '100vh', zIndex: 100, flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, marginBottom: 14, background: 'linear-gradient(135deg,#ff3b6b,#7c3aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, color: '#fff', boxShadow: '0 3px 16px rgba(255,59,107,.35)' }}>C</div>
        {navItems.map(n => {
          const active = pathname === n.href
          return (
            <Link key={n.id} href={n.href} title={n.label} style={{ width: 46, height: 46, borderRadius: 11, border: 'none', background: active ? 'rgba(255,59,107,.12)' : 'transparent', cursor: 'pointer', color: active ? '#ff3b6b' : '#6b6b8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, transition: 'all .2s', textDecoration: 'none', position: 'relative' }}>
              {active && <span style={{ position: 'absolute', left: -1, width: 3, height: 22, background: '#ff3b6b', borderRadius: '0 3px 3px 0' }} />}
              {n.icon}
            </Link>
          )
        })}
        <div style={{ marginTop: 'auto', paddingBottom: 6 }}>
          <button onClick={handleSignOut} title="Sair" style={{ width: 46, height: 46, borderRadius: 11, border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b6b8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>🚪</button>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {/* TOPBAR */}
        <div style={{ padding: '16px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.07)', position: 'sticky', top: 0, background: 'rgba(7,7,15,.92)', backdropFilter: 'blur(20px)', zIndex: 50 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 19, fontWeight: 700 }}>
            {pageTitles[pathname] || 'CriadorHub'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#6b6b8a', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</span>
            <button onClick={handleSignOut} style={{ padding: '7px 13px', borderRadius: 9, border: '1px solid rgba(255,255,255,.07)', background: 'transparent', color: '#6b6b8a', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color='#ff3b6b'; (e.target as HTMLElement).style.borderColor='#ff3b6b' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color='#6b6b8a'; (e.target as HTMLElement).style.borderColor='rgba(255,255,255,.07)' }}>
              🚪 Sair
            </button>
          </div>
        </div>
        <div style={{ padding: 26, overflowY: 'auto', height: 'calc(100vh - 57px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
