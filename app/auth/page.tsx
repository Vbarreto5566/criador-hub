'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Screen = 'login' | 'signup' | 'forgot' | 'confirm'

function PwStrength({ pw }: { pw: string }) {
  if (!pw) return null
  const s = (pw.length >= 8 ? 1 : 0) + (/[A-Z]/.test(pw) ? 1 : 0) + (/\d/.test(pw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 1 : 0)
  const cls = s <= 1 ? '#ff3b6b' : s <= 2 ? '#ffe14d' : '#00e5c3'
  const lbl = s <= 1 ? 'Fraca' : s <= 2 ? 'Média' : 'Forte'
  return (
    <div>
      <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < s ? cls : '#1c1c2e', transition: 'background .3s' }} />)}
      </div>
      <div style={{ fontSize: 11, color: '#6b6b8a', marginTop: 3 }}>Senha: {lbl}</div>
    </div>
  )
}

function AuthPanel() {
  return (
    <div style={{ background: '#0f0f1a', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 25% 50%,rgba(124,58,255,.14) 0%,transparent 55%),radial-gradient(ellipse at 80% 15%,rgba(255,59,107,.09) 0%,transparent 50%)' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 340 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, margin: '0 auto 22px', background: 'linear-gradient(135deg,#ff3b6b,#7c3aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 34, color: '#fff', boxShadow: '0 8px 40px rgba(255,59,107,.4)' }}>C</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 34, fontWeight: 800, marginBottom: 10 }}>Criador<span style={{ color: '#ff3b6b' }}>Hub</span></h1>
        <p style={{ color: '#6b6b8a', fontSize: 14, lineHeight: 1.7 }}>A plataforma para creators brasileiros crescerem no Instagram e TikTok.</p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', textAlign: 'left' }}>
          {[['📊','Analytics em tempo real','Instagram & TikTok integrados'],['🤖','Legendas com IA','Captions em português com 1 clique'],['🤝','Rede de Criadores','Conecte e colabore com outros creators']].map(([i,t,d]) => (
            <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 15px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>{i}</span>
              <div><strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>{t}</strong><span style={{ fontSize: 12, color: '#6b6b8a' }}>{d}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const [screen, setScreen] = useState<Screen>('login')
  const [confirmEmail, setConfirmEmail] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // ── LOGIN ──
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass]   = useState('')
  const [loginErr, setLoginErr]     = useState('')
  const [loginLoad, setLoginLoad]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginErr(''); setLoginLoad(true)
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass })
    if (error) {
      setLoginErr(error.message.includes('Invalid') ? 'Email ou senha incorretos. Verifique e tente novamente.' : error.message)
      setLoginLoad(false)
    } else {
      router.replace('/dashboard')
    }
  }

  // ── SIGNUP ──
  const [form, setForm] = useState({ name: '', email: '', pass: '', niche: '' })
  const [signErr, setSignErr]   = useState('')
  const [signLoad, setSignLoad] = useState(false)
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setSignErr('') }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setSignErr('')
    if (!form.name.trim())  { setSignErr('Por favor, insira seu nome.'); return }
    if (!form.niche)        { setSignErr('Por favor, selecione seu nicho principal.'); return }
    if (form.pass.length < 6) { setSignErr('A senha precisa ter no mínimo 6 caracteres.'); return }
    setSignLoad(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.pass,
      options: { data: { full_name: form.name.trim(), niche: form.niche } },
    })
    setSignLoad(false)
    if (error) {
      if (error.message.includes('already')) setSignErr('Este email já está cadastrado. Tente fazer login.')
      else setSignErr(error.message)
    } else if (data.session) {
      router.replace('/dashboard')
    } else {
      setConfirmEmail(form.email)
      setScreen('confirm')
    }
  }

  // ── FORGOT ──
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent]   = useState(false)
  const [forgotErr, setForgotErr]     = useState('')
  const [forgotLoad, setForgotLoad]   = useState(false)

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setForgotLoad(true)
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail)
    setForgotLoad(false)
    if (error) setForgotErr(error.message)
    else setForgotSent(true)
  }

  const formWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }
  const box: React.CSSProperties = { width: '100%', maxWidth: 420 }
  const errBox = (msg: string) => msg ? <div style={{ background: 'rgba(255,59,107,.1)', border: '1px solid rgba(255,59,107,.25)', color: '#ff8fab', borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 14, display: 'flex', gap: 8 }}>⚠️ {msg}</div> : null
  const fg: React.CSSProperties = { marginBottom: 14 }
  const fl: React.CSSProperties = { fontSize: 11, color: '#6b6b8a', marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '.06em' }
  const mainBtn = (loading: boolean, label: string) => (
    <button className="btn-gradient" style={{ width: '100%', padding: 13, borderRadius: 11, fontSize: 15, marginTop: 6, position: 'relative', color: loading ? 'transparent' : 'white' }} disabled={loading}>
      {loading ? <span style={{ position: 'absolute', inset: 0, margin: 'auto', width: 20, height: 20, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'block' }} className="anim-spin" /> : label}
    </button>
  )

  if (screen === 'confirm') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07070f' }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 40, background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20 }} className="anim-fadeup">
        <div style={{ fontSize: 52, marginBottom: 14 }}>📧</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, marginBottom: 9 }}>Confirme seu email!</h2>
        <p style={{ color: '#6b6b8a', fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>Enviamos um link para <strong style={{ color: '#f0eeff' }}>{confirmEmail}</strong>. Clique no link para ativar sua conta e fazer login.</p>
        <button className="btn-gradient" style={{ width: '100%', padding: 13, borderRadius: 11, fontSize: 15 }} onClick={() => setScreen('login')}>Voltar para o login</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <AuthPanel />

      <div style={formWrap}>
        {screen === 'login' && (
          <div style={box} className="anim-fadeup">
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 5 }}>Bem-vindo de volta 👋</h2>
            <p style={{ color: '#6b6b8a', fontSize: 13, marginBottom: 28 }}>Entre na sua conta para continuar</p>
            {errBox(loginErr)}
            <form onSubmit={handleLogin}>
              <div style={fg}><label style={fl}>Email</label><input className={`input-base ${loginErr ? 'error' : ''}`} type="email" placeholder="seu@email.com" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginErr('') }} required /></div>
              <div style={fg}><label style={fl}>Senha</label><input className={`input-base ${loginErr ? 'error' : ''}`} type="password" placeholder="••••••••" value={loginPass} onChange={e => { setLoginPass(e.target.value); setLoginErr('') }} required /></div>
              <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 14 }}>
                <span onClick={() => setScreen('forgot')} style={{ fontSize: 12, color: '#6b6b8a', cursor: 'pointer' }}>Esqueceu a senha?</span>
              </div>
              {mainBtn(loginLoad, 'Entrar')}
            </form>
            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#6b6b8a' }}>
              Não tem conta? <span onClick={() => setScreen('signup')} style={{ color: '#ff3b6b', cursor: 'pointer', fontWeight: 500 }}>Criar conta grátis</span>
            </div>
          </div>
        )}

        {screen === 'signup' && (
          <div style={box} className="anim-fadeup">
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 5 }}>Criar sua conta 🚀</h2>
            <p style={{ color: '#6b6b8a', fontSize: 13, marginBottom: 28 }}>Grátis. Leva menos de 2 minutos.</p>
            {errBox(signErr)}
            <form onSubmit={handleSignup} noValidate>
              <div style={fg}><label style={fl}>Nome completo</label><input className="input-base" type="text" placeholder="Seu nome" value={form.name} onChange={e => setF('name', e.target.value)} required /></div>
              <div style={fg}><label style={fl}>Email</label><input className="input-base" type="email" placeholder="seu@email.com" value={form.email} onChange={e => setF('email', e.target.value)} required /></div>
              <div style={fg}><label style={fl}>Senha</label><input className="input-base" type="password" placeholder="Mínimo 6 caracteres" value={form.pass} onChange={e => setF('pass', e.target.value)} required /><PwStrength pw={form.pass} /></div>
              <div style={fg}>
                <label style={fl}>Nicho principal</label>
                <select className="input-base" style={{ appearance: 'none', cursor: 'pointer', background: '#161625' }} value={form.niche} onChange={e => setF('niche', e.target.value)}>
                  <option value="">Selecione seu nicho...</option>
                  {[['Fitness','💪 Fitness & Saúde'],['Tech','💻 Tecnologia'],['Gastronomia','🍳 Gastronomia'],['Gaming','🎮 Gaming'],['Viagem','✈️ Viagem & Turismo'],['Moda','👗 Moda & Estilo'],['Beleza','💄 Beleza & Skincare'],['Educação','📚 Educação'],['Humor','😂 Humor & Entretenimento'],['Negócios','💼 Negócios & Finanças'],['Outro','🌟 Outro']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              {mainBtn(signLoad, 'Criar conta grátis')}
            </form>
            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#6b6b8a' }}>
              Já tem conta? <span onClick={() => setScreen('login')} style={{ color: '#ff3b6b', cursor: 'pointer', fontWeight: 500 }}>Entrar</span>
            </div>
          </div>
        )}

        {screen === 'forgot' && (
          <div style={box} className="anim-fadeup">
            {forgotSent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 14 }}>📬</div>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, marginBottom: 9 }}>Email enviado!</h2>
                <p style={{ color: '#6b6b8a', fontSize: 13, marginBottom: 22 }}>Verifique sua caixa de entrada em <strong style={{ color: '#f0eeff' }}>{forgotEmail}</strong>.</p>
                <button className="btn-gradient" style={{ width: '100%', padding: 13, borderRadius: 11, fontSize: 15 }} onClick={() => setScreen('login')}>Voltar para o login</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 5 }}>Recuperar senha 🔑</h2>
                <p style={{ color: '#6b6b8a', fontSize: 13, marginBottom: 28 }}>Enviaremos um link de recuperação</p>
                {errBox(forgotErr)}
                <form onSubmit={handleForgot}>
                  <div style={fg}><label style={fl}>Email</label><input className="input-base" type="email" placeholder="seu@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required /></div>
                  {mainBtn(forgotLoad, 'Enviar link de recuperação')}
                </form>
                <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#6b6b8a' }}>
                  <span onClick={() => setScreen('login')} style={{ color: '#ff3b6b', cursor: 'pointer' }}>← Voltar para o login</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
