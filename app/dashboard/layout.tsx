'use client'
import { useEffect, useState, CSSProperties } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const nav = [
  { href:'/dashboard',            icon:'⌂', label:'Início' },
  { href:'/dashboard/legenda',    icon:'✦', label:'Legendas IA' },
  { href:'/dashboard/analytics',  icon:'↗', label:'Analytics' },
  { href:'/dashboard/creators',   icon:'◎', label:'Criadores' },
  { href:'/dashboard/brands',     icon:'◇', label:'Marcas' },
  { href:'/dashboard/schedule',   icon:'▦', label:'Agenda' },
]

const titles: Record<string,string> = {
  '/dashboard':'Início',
  '/dashboard/legenda':'Legendas IA',
  '/dashboard/analytics':'Analytics',
  '/dashboard/creators':'Criadores',
  '/dashboard/brands':'Marcas',
  '/dashboard/schedule':'Agenda',
}

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:24, height:24, border:'1.5px solid var(--b3)', borderRadius:4, background:'var(--s3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M10 3.5C8.8 2.55 7.4 2 6 2C3.24 2 1 4.24 1 7C1 9.76 3.24 12 6 12C7.4 12 8.8 11.45 10 10.5" stroke="rgba(241,239,233,0.65)" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="10.5" cy="7" r="1.4" fill="rgba(241,239,233,0.4)"/>
        </svg>
      </div>
      <span style={{ fontFamily:'var(--serif)', fontSize:13, fontStyle:'italic', color:'var(--t1)' }}>
        criador<span style={{ fontStyle:'normal', color:'var(--t3)' }}>hub</span>
      </span>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth'); return }
      setEmail(session.user.email || '')
    }
    check()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/auth')
  }

  const nb: CSSProperties = { width:46, height:34, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'var(--t3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, transition:'all .12s', fontFamily:'var(--mono)', textDecoration:'none', width:'calc(100% - 8px)', margin:'0 4px', padding:'0 8px', gap:8, justifyContent:'flex-start' }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* SIDEBAR */}
      <nav style={{ width:220, background:'var(--s1)', borderRight:'1px solid var(--b1)', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', flexShrink:0, overflow:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'14px 14px 12px', borderBottom:'1px solid var(--b1)', display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={()=>router.push('/dashboard')}>
          <Logo/>
        </div>

        {/* Nav */}
        <div style={{ padding:'12px 0', flex:1 }}>
          <div style={{ padding:'0 14px 6px', fontSize:10, color:'var(--t4)', fontFamily:'var(--mono)', letterSpacing:'.08em', textTransform:'uppercase' }}>Workspace</div>
          {nav.map(n => {
            const active = pathname === n.href
            return (
              <Link key={n.href} href={n.href} style={{ ...nb, background:active?'var(--s3)':'transparent', color:active?'var(--t1)':'var(--t3)', textDecoration:'none', display:'flex', position:'relative' }}>
                {active && <span style={{ position:'absolute', left:4, width:2, height:16, background:'var(--t2)', borderRadius:2 }}/>}
                <span style={{ fontFamily:'var(--mono)', fontSize:12, opacity:active?0.8:0.45, width:16, textAlign:'center' }}>{n.icon}</span>
                <span style={{ fontSize:13.5 }}>{n.label}</span>
              </Link>
            )
          })}

          <div style={{ height:1, background:'var(--b1)', margin:'10px 10px' }}/>
          <div style={{ padding:'0 14px 6px', fontSize:10, color:'var(--t4)', fontFamily:'var(--mono)', letterSpacing:'.08em', textTransform:'uppercase' }}>Redes</div>
          {[['📸','Instagram'],['🎵','TikTok']].map(([ico,nm])=>(
            <div key={nm} style={{ ...nb, display:'flex', cursor:'pointer' }}>
              <span style={{ fontSize:12, opacity:.4, width:16, textAlign:'center' }}>{ico}</span>
              <span style={{ fontSize:13, flex:1 }}>{nm}</span>
              <span style={{ fontSize:10, color:'var(--t4)', fontFamily:'var(--mono)' }}>conectar</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop:'1px solid var(--b1)', padding:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:6, cursor:'pointer', transition:'background .12s' }}
            onMouseEnter={e=>(e.currentTarget.style.background='var(--s3)')}
            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
            onClick={handleSignOut}>
            <div style={{ width:24, height:24, borderRadius:4, background:'var(--s4)', border:'1px solid var(--b2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontFamily:'var(--mono)', color:'var(--t2)', flexShrink:0 }}>
              {email.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, color:'var(--t1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{email}</div>
            </div>
            <span style={{ fontSize:10, color:'var(--t4)', fontFamily:'var(--mono)' }}>sair</span>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        {/* Topbar */}
        <div style={{ height:44, borderBottom:'1px solid var(--b1)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', background:'var(--bg)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--t3)' }}>
            <span>criadorhub</span>
            <span style={{ color:'var(--t4)', fontSize:11 }}>/</span>
            <span style={{ color:'var(--t2)' }}>{titles[pathname]||''}</span>
          </div>
          <button onClick={handleSignOut} style={{ padding:'5px 11px', borderRadius:5, border:'1px solid var(--b2)', background:'transparent', color:'var(--t3)', cursor:'pointer', fontSize:12, fontFamily:'var(--sans)', transition:'all .12s' }}
            onMouseEnter={e=>{(e.target as HTMLElement).style.color='var(--t1)';(e.target as HTMLElement).style.borderColor='var(--b3)'}}
            onMouseLeave={e=>{(e.target as HTMLElement).style.color='var(--t3)';(e.target as HTMLElement).style.borderColor='var(--b2)'}}>
            sair
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'40px 48px', maxWidth:960 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
