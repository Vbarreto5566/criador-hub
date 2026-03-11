'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const card = { background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:10, padding:18 }
const secTitle = { fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase' as const, marginBottom:12 }

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  useEffect(() => { createClient().auth.getUser().then(({data})=>setUser(data.user)) }, [])

  const name  = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'
  const niche = user?.user_metadata?.niche || 'Creator'
  const since = user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}) : '—'

  const sched = [
    {time:'09:00',pl:'ig',title:'Reels — Rotina matinal',cap:'5 hábitos que mudaram minha vida',st:'sc'},
    {time:'12:30',pl:'tt',title:'TikTok — Treino rápido',cap:'15min sem equipamento',st:'lv'},
    {time:'18:00',pl:'ig',title:'Stories — Bastidores',cap:'Nos bastidores da parceria',st:'dr'},
  ]
  const stMap: Record<string,{label:string,color:string,bg:string}> = {
    sc:{label:'agendado',color:'#6b6760',bg:'rgba(107,103,96,.12)'},
    lv:{label:'ao vivo', color:'#5a7a5a',bg:'rgba(90,122,90,.12)'},
    dr:{label:'rascunho',color:'#5a5a4a',bg:'rgba(90,90,74,.1)'},
  }

  return (
    <div className="anim-fade">
      {/* Heading */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'var(--serif)', fontSize:30, fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:6 }}>
          Olá, {name.split(' ')[0]}
        </h1>
        <p style={{ fontSize:13, color:'var(--t3)' }}>
          {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
        {[['Seguidores','—','conecte suas redes'],['Engajamento','—','conecte suas redes'],['Posts agendados','3','próximos 7 dias'],['Propostas','5','marcas ativas']].map(([l,v,d])=>(
          <div key={l} style={card}>
            <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--t3)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:8 }}>{l}</div>
            <div style={{ fontFamily:'var(--serif)', fontSize:26, fontStyle:'italic', color:'var(--t1)', letterSpacing:'-0.03em' }}>{v}</div>
            <div style={{ fontSize:11, color:'var(--t3)', marginTop:4, fontFamily:'var(--mono)' }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Schedule */}
        <div style={card}>
          <div style={secTitle}>Hoje</div>
          {sched.map((s,i)=>{
            const status = stMap[s.st]
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 10px', borderRadius:5, cursor:'pointer', transition:'background .1s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--s2)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--t3)', minWidth:38 }}>{s.time}</span>
                <span style={{ width:5, height:5, borderRadius:'50%', background:s.pl==='ig'?'var(--t3)':'var(--t4)', flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:'var(--t3)' }}>{s.cap}</div>
                </div>
                <span style={{ padding:'2px 7px', borderRadius:4, fontSize:10, fontFamily:'var(--mono)', background:status.bg, color:status.color }}>{status.label}</span>
              </div>
            )
          })}
        </div>

        {/* Quick actions */}
        <div style={card}>
          <div style={secTitle}>Início rápido</div>
          {[
            {icon:'✦',label:'Gerar uma legenda',href:'/dashboard/legenda'},
            {icon:'◎',label:'Explorar criadores',href:'/dashboard/creators'},
            {icon:'◇',label:'Ver propostas de marca',href:'/dashboard/brands'},
            {icon:'▦',label:'Agendar conteúdo',href:'/dashboard/schedule'},
          ].map((item,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:5, cursor:'pointer', transition:'background .1s' }}
              onClick={()=>router.push(item.href)}
              onMouseEnter={e=>(e.currentTarget.style.background='var(--s2)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div style={{ width:28, height:28, borderRadius:5, background:'var(--s3)', border:'1px solid var(--b1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'var(--t3)', fontFamily:'var(--mono)', flexShrink:0 }}>{item.icon}</div>
              <span style={{ fontSize:13, flex:1 }}>{item.label}</span>
              <span style={{ color:'var(--t4)', fontSize:12 }}>→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile info */}
      <div style={{ ...card, marginTop:14 }}>
        <div style={secTitle}>Conta</div>
        {[['Email',user?.email||'—'],['Nicho',niche],['Membro desde',since]].map(([l,v])=>(
          <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--b1)' }}>
            <span style={{ fontSize:13, color:'var(--t3)' }}>{l}</span>
            <span style={{ fontSize:13 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
