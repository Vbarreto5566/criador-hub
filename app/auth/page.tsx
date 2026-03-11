'use client'
import { useState, CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const st = {
  card: { width:'100%', maxWidth:360, padding:'40px 36px', background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:16 } as CSSProperties,
  lbl: { fontSize:10, color:'var(--t3)', marginBottom:5, display:'block', textTransform:'uppercase' as const, letterSpacing:'.07em', fontFamily:'var(--mono)' } as CSSProperties,
  inp: { width:'100%', padding:'9px 11px', background:'var(--s2)', border:'1.5px solid var(--b2)', borderRadius:6, color:'var(--t1)', fontFamily:'var(--sans)', fontSize:14, outline:'none', transition:'border-color .15s', display:'block' } as CSSProperties,
  fg:  { marginBottom:12 } as CSSProperties,
  btn: { width:'100%', padding:'9px', background:'var(--t1)', color:'var(--bg)', border:'none', borderRadius:6, fontFamily:'var(--sans)', fontSize:14, fontWeight:500, cursor:'pointer', position:'relative' as const, marginTop:6 } as CSSProperties,
  err: { fontSize:12, color:'#c87060', background:'rgba(200,112,96,.08)', border:'1px solid rgba(200,112,96,.2)', borderRadius:5, padding:'9px 11px', marginBottom:12, fontFamily:'var(--mono)' } as CSSProperties,
  ok:  { fontSize:12, color:'#5a7a5a', background:'rgba(90,122,90,.12)', border:'1px solid rgba(90,122,90,.2)', borderRadius:5, padding:'9px 11px', marginBottom:12, fontFamily:'var(--mono)' } as CSSProperties,
  sw:  { marginTop:16, fontSize:12, color:'var(--t3)', display:'flex', gap:4 } as CSSProperties,
  a:   { color:'var(--t2)', cursor:'pointer', textDecoration:'underline' as const } as CSSProperties,
  wrap:{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' } as CSSProperties,
  h1:  { fontFamily:'var(--serif)', fontSize:22, fontStyle:'italic', marginBottom:4, color:'var(--t1)' } as CSSProperties,
  sub: { fontSize:12, color:'var(--t3)', marginBottom:24, fontFamily:'var(--mono)' } as CSSProperties,
}

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28 }}>
      <div style={{ width:26, height:26, border:'1.5px solid var(--b3)', borderRadius:5, background:'var(--s3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10 3.5C8.8 2.55 7.4 2 6 2C3.24 2 1 4.24 1 7C1 9.76 3.24 12 6 12C7.4 12 8.8 11.45 10 10.5" stroke="rgba(241,239,233,0.65)" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="10.5" cy="7" r="1.4" fill="rgba(241,239,233,0.4)"/>
        </svg>
      </div>
      <span style={{ fontFamily:'var(--serif)', fontSize:15, fontStyle:'italic', color:'var(--t1)' }}>
        criador<span style={{ fontStyle:'normal', color:'var(--t3)' }}>hub</span>
      </span>
    </div>
  )
}

function PwStrength({ pw }: { pw: string }) {
  if (!pw) return null
  const score = (pw.length>=8?1:0)+(/[A-Z]/.test(pw)?1:0)+(/\d/.test(pw)?1:0)+(/[^A-Za-z0-9]/.test(pw)?1:0)
  const color = score<=1?'#8a5a4a':score<=2?'#8a7a4a':'#5a7a5a'
  return (
    <div>
      <div style={{ display:'flex', gap:3, marginTop:5 }}>
        {[0,1,2,3].map(i=><div key={i} style={{ height:2, flex:1, borderRadius:2, background:i<score?color:'var(--s4)', transition:'background .3s' }}/>)}
      </div>
      <div style={{ fontSize:10, color:'var(--t3)', marginTop:3, fontFamily:'var(--mono)' }}>
        {score<=1?'fraca':score<=2?'média':'forte'}
      </div>
    </div>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<'login'|'signup'|'forgot'|'confirm'>('login')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [f, setF] = useState({ name:'', email:'', pass:'', niche:'' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const set = (k: string, v: string) => { setF(p=>({...p,[k]:v})); setErr('') }
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email:f.email, password:f.pass })
    setLoading(false)
    if (error) setErr(error.message.includes('Invalid')?'Email ou senha incorretos.':error.message)
    else router.replace('/dashboard')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (!f.name.trim()) { setErr('Insira seu nome.'); return }
    if (!f.niche)       { setErr('Selecione seu nicho.'); return }
    if (f.pass.length<6){ setErr('Senha mínima de 6 caracteres.'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email:f.email, password:f.pass,
      options:{ data:{ full_name:f.name.trim(), niche:f.niche } },
    })
    setLoading(false)
    if (error) { setErr(error.message.includes('already')?'Email já cadastrado.':error.message); return }
    if (data.session) { router.replace('/dashboard'); return }
    setConfirmEmail(f.email); setScreen('confirm')
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(f.email)
    setLoading(false)
    if (error) setErr(error.message); else setOk('Link enviado. Verifique seu email.')
  }

  const Spin = () => <span style={{ position:'absolute', inset:0, margin:'auto', width:14, height:14, border:'1.5px solid rgba(17,17,16,.2)', borderTopColor:'var(--bg)', borderRadius:'50%', display:'block' }} className="anim-spin"/>

  if (screen==='confirm') return (
    <div style={st.wrap}>
      <div style={{...st.card, textAlign:'center'}} className="anim-fade">
        <Logo/>
        <div style={{ fontFamily:'var(--serif)', fontSize:36, marginBottom:12, color:'var(--t2)' }}>✉</div>
        <div style={st.h1}>Confirme seu email</div>
        <p style={{ fontSize:12, color:'var(--t3)', marginBottom:20, fontFamily:'var(--mono)', lineHeight:1.6 }}>Link enviado para <strong style={{color:'var(--t2)'}}>{confirmEmail}</strong></p>
        <button style={st.btn} onClick={()=>setScreen('login')}>Voltar para o login</button>
      </div>
    </div>
  )

  return (
    <div style={st.wrap}>
      <div style={st.card} className="anim-fade">
        <Logo/>

        {screen==='login' && <>
          <div style={st.h1}>Entrar</div>
          <div style={st.sub}>na sua conta criadorhub</div>
          {err && <div style={st.err}>{err}</div>}
          <form onSubmit={handleLogin}>
            <div style={st.fg}><label style={st.lbl}>Email</label>
              <input style={{...st.inp, ...(err?{borderColor:'rgba(180,100,80,.6)'}:{})}} type="email" placeholder="voce@email.com" value={f.email} onChange={e=>set('email',e.target.value)} required/>
            </div>
            <div style={st.fg}><label style={st.lbl}>Senha</label>
              <input style={{...st.inp, ...(err?{borderColor:'rgba(180,100,80,.6)'}:{})}} type="password" placeholder="••••••••" value={f.pass} onChange={e=>set('pass',e.target.value)} required/>
            </div>
            <div style={{textAlign:'right', marginBottom:10}}>
              <span style={st.a} onClick={()=>{setScreen('forgot');setErr('')}}>Esqueceu a senha?</span>
            </div>
            <button style={{...st.btn, color:loading?'transparent':'var(--bg)'}} disabled={loading}>{loading&&<Spin/>}Entrar</button>
          </form>
          <div style={st.sw}>Novo por aqui? <span style={st.a} onClick={()=>{setScreen('signup');setErr('')}}>Criar uma conta</span></div>
        </>}

        {screen==='signup' && <>
          <div style={st.h1}>Criar conta</div>
          <div style={st.sub}>comece grátis, sem cartão</div>
          {err && <div style={st.err}>{err}</div>}
          <form onSubmit={handleSignup} noValidate>
            <div style={st.fg}><label style={st.lbl}>Nome</label><input style={st.inp} type="text" placeholder="Seu nome" value={f.name} onChange={e=>set('name',e.target.value)} required/></div>
            <div style={st.fg}><label style={st.lbl}>Email</label><input style={st.inp} type="email" placeholder="voce@email.com" value={f.email} onChange={e=>set('email',e.target.value)} required/></div>
            <div style={st.fg}><label style={st.lbl}>Senha</label>
              <input style={st.inp} type="password" placeholder="Mínimo 6 caracteres" value={f.pass} onChange={e=>set('pass',e.target.value)} required/>
              <PwStrength pw={f.pass}/>
            </div>
            <div style={st.fg}><label style={st.lbl}>Nicho</label>
              <select style={{...st.inp, cursor:'pointer'}} value={f.niche} onChange={e=>set('niche',e.target.value)}>
                <option value="">Selecione...</option>
                {['Fitness','Tech','Gastronomia','Gaming','Viagem','Moda','Beleza','Educação','Humor','Negócios','Outro'].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button style={{...st.btn, color:loading?'transparent':'var(--bg)'}} type="submit" disabled={loading}>{loading&&<Spin/>}Criar conta</button>
          </form>
          <div style={st.sw}>Já tem conta? <span style={st.a} onClick={()=>{setScreen('login');setErr('')}}>Entrar</span></div>
        </>}

        {screen==='forgot' && <>
          <div style={st.h1}>Recuperar senha</div>
          <div style={st.sub}>enviaremos um link por email</div>
          {err && <div style={st.err}>{err}</div>}
          {ok  && <div style={st.ok}>{ok}</div>}
          {!ok && <form onSubmit={handleForgot}>
            <div style={st.fg}><label style={st.lbl}>Email</label><input style={st.inp} type="email" placeholder="voce@email.com" value={f.email} onChange={e=>set('email',e.target.value)} required/></div>
            <button style={{...st.btn, color:loading?'transparent':'var(--bg)'}} disabled={loading}>{loading&&<Spin/>}Enviar link</button>
          </form>}
          <div style={st.sw}><span style={st.a} onClick={()=>{setScreen('login');setErr('');setOk('')}}>← Voltar</span></div>
        </>}
      </div>
    </div>
  )
}
