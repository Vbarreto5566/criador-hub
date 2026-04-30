import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase.js";

/* ── NOTIFICATION QUOTES ── */
const QUOTES = [
  { text: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.", author: "Rocky Balboa" },
  { text: "Você não precisa ser ótimo para começar, mas precisa começar para ser ótimo.", author: "Zig Ziglar" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristóteles" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "A jornada de mil milhas começa com um único passo.", author: "Lao Tsé" },
  { text: "First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.", author: "Octavia Butler" },
  { text: "Do not wait; the time will never be 'just right'. Start where you stand.", author: "Napoleon Hill" },
  { text: "Champions aren't made in gyms. Champions are made from something deep inside them.", author: "Muhammad Ali" },
  { text: "Hoje é sempre o melhor dia para começar.", author: "kivo" },
  { text: "Small habits, compounded over time, become your destiny.", author: "James Clear" },
  { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { text: "Você está mais perto do que imagina.", author: "kivo" },
  { text: "Fall seven times, stand up eight.", author: "Provérbio japonês" },
  { text: "The only bad workout is the one that didn't happen.", author: "kivo" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Sua versão de amanhã agradecer a sua versão de hoje.", author: "kivo" },
  { text: "We can do anything we want to do if we stick to it long enough.", author: "Helen Keller" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
];

function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/* ── PUSH NOTIFICATIONS ── */
async function registerPush() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return null;
  return true;
}

function scheduleLocalNotification(habit, delayMs = 1000) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  setTimeout(() => {
    const q = randomQuote();
    new Notification(`kivo · ${habit}`, {
      body: `"${q.text}" — ${q.author}`,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `kivo-${habit}`,
      silent: false,
    });
  }, delayMs);
}

function scheduleDailyReminders(habits) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const reminders = [
    { hour: 8, min: 0, label: "Bom dia" },
    { hour: 14, min: 0, label: "Lembrete da tarde" },
    { hour: 21, min: 0, label: "Check-in noturno" },
  ];
  reminders.forEach(r => {
    const target = new Date(now);
    target.setHours(r.hour, r.min, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target.getTime() - now.getTime();
    setTimeout(() => {
      const pending = habits.filter(h => !h.done);
      if (pending.length === 0) return;
      const q = randomQuote();
      const habitNames = pending.slice(0, 2).map(h => h.name).join(", ");
      new Notification(`kivo · ${r.label}`, {
        body: `${pending.length} hábito${pending.length > 1 ? "s" : ""} esperando: ${habitNames}.\n"${q.text}" — ${q.author}`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: `kivo-reminder-${r.hour}`,
      });
    }, delay);
  });
}

/* ── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@200;300;400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#18160f;--ink-mid:#3a3830;--ink-soft:#7a7668;
  --cream:#f5f2ec;--warm:#eae5da;--stone:#cfc9bc;
  --sage:#8b9d89;--sage-d:#536652;
  --clay:#c4a882;--clay-d:#8c6e4a;
  --white:#fdfcf9;--err:#b85c5c;
  --safe-b:env(safe-area-inset-bottom,0px);
  --fd:'Cormorant Garamond',Georgia,serif;
  --fb:'DM Sans',sans-serif;
}
html,body,#root{height:100%;background:var(--cream);color:var(--ink);font-family:var(--fb);font-weight:300;-webkit-font-smoothing:antialiased}
.app{max-width:390px;margin:0 auto;height:100%;display:flex;flex-direction:column;background:var(--cream);overflow:hidden}
.scrl{flex:1;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.scrl::-webkit-scrollbar{display:none}
.nav{background:rgba(245,242,236,.97);border-top:1px solid var(--stone);display:flex;justify-content:space-around;padding:10px 4px calc(10px + var(--safe-b));backdrop-filter:blur(16px);flex-shrink:0}
.nb{display:flex;flex-direction:column;align-items:center;gap:4px;padding:5px 10px;border:none;background:none;color:var(--stone);cursor:pointer;transition:color .2s;font-family:var(--fb);font-size:9px;font-weight:400;letter-spacing:.14em;text-transform:uppercase}
.nb.on{color:var(--ink)}
.finp{width:100%;background:transparent;border:none;border-bottom:1px solid var(--stone);padding:12px 0;color:var(--ink);font-family:var(--fb);font-size:15px;font-weight:300;outline:none;transition:border-color .2s}
.finp:focus{border-bottom-color:var(--ink)}
.finp::placeholder{color:var(--stone);font-size:14px}
.flabel{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--stone);margin-bottom:5px;display:block}
.btnp{width:100%;padding:15px;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:var(--fb);font-weight:300;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:background .2s}
.btnp:hover{background:var(--ink-mid)}
.btnp:disabled{opacity:.35;cursor:not-allowed}
.btno{width:100%;padding:14px;background:transparent;color:var(--ink);border:1px solid var(--stone);border-radius:2px;font-family:var(--fb);font-weight:300;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:border-color .2s}
.btno:hover{border-color:var(--ink)}
.btnlnk{background:none;border:none;color:var(--ink-soft);font-family:var(--fb);font-size:12px;font-weight:300;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:0}
.hrow{display:flex;align-items:center;justify-content:space-between;padding:15px 22px;border-bottom:1px solid var(--warm);cursor:pointer;transition:background .15s;-webkit-tap-highlight-color:transparent}
.hrow:last-child{border-bottom:none}
.hrow:active{background:var(--warm)}
.chk{width:20px;height:20px;border-radius:50%;border:1px solid var(--stone);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .4s cubic-bezier(.34,1.56,.64,1)}
.chk.done{background:var(--sage);border-color:var(--sage)}
.ptk{height:1.5px;background:var(--warm);overflow:hidden}
.pfl{height:100%;background:var(--ink);transition:width .9s cubic-bezier(.4,0,.2,1)}
.pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;border:1px solid var(--stone);font-size:9px;font-weight:400;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft)}
.pill.s{color:var(--sage-d);border-color:var(--sage)}
.pill.c{color:var(--clay-d);border-color:var(--clay)}
.msg{display:flex;gap:9px;margin-bottom:18px;animation:fu .3s ease}
@keyframes fu{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.bub{padding:12px 16px;border-radius:17px;line-height:1.65;max-width:85%}
.ai .bub{background:var(--white);border:1px solid var(--warm);border-bottom-left-radius:3px;color:var(--ink-mid);font-family:var(--fd);font-size:14.5px}
.usr{flex-direction:row-reverse}
.usr .bub{background:var(--ink);color:var(--cream);border-bottom-right-radius:3px;font-size:13px;font-weight:300}
.ins .bub{background:var(--ink);color:var(--cream);border:none;border-bottom-left-radius:3px;font-family:var(--fd);font-size:14.5px;font-style:italic}
.cin{padding:8px 13px calc(8px + var(--safe-b));background:linear-gradient(to top,var(--cream) 60%,transparent);display:flex;gap:7px;align-items:flex-end;flex-shrink:0}
textarea.ci{flex:1;background:var(--white);border:1px solid var(--stone);border-radius:100px;padding:9px 15px;color:var(--ink);font-family:var(--fb);font-size:13px;font-weight:300;resize:none;outline:none;max-height:88px;min-height:37px;line-height:1.5;transition:border-color .2s}
textarea.ci:focus{border-color:var(--ink-soft)}
textarea.ci::placeholder{color:var(--stone)}
.sbtn{width:37px;height:37px;border-radius:50%;background:var(--ink);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--cream)}
.sbtn:disabled{opacity:.3;cursor:not-allowed}
.dot{width:5px;height:5px;border-radius:50%;background:var(--stone);display:inline-block;animation:pls 1.2s ease infinite}
.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}
@keyframes pls{0%,100%{opacity:.8;transform:scale(1)}50%{opacity:.2;transform:scale(.55)}}
.pcard{border:1px solid var(--stone);padding:20px;cursor:pointer;position:relative;background:var(--white);transition:border-color .2s}
.pcard.sel{border-color:var(--ink);border-width:1.5px}
.pcard.feat{border-color:var(--sage)}
.pcard.feat.sel{border-color:var(--ink)}
.cdot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .15s;flex-shrink:0}
.cdot.sel{border-color:var(--ink);transform:scale(1.15)}
.tgl{display:flex;background:var(--warm);border-radius:100px;padding:3px;width:fit-content}
.topt{padding:5px 14px;border-radius:100px;font-size:9px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border:none;background:transparent;color:var(--ink-soft);font-family:var(--fb);transition:all .2s}
.topt.on{background:var(--white);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.spinner{width:16px;height:16px;border:1.5px solid var(--stone);border-top-color:var(--ink);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.icard{background:var(--white);border:1px solid var(--warm);padding:18px 20px;margin-bottom:8px;display:flex;flex-direction:column;gap:12px}
.itoggle{width:44px;height:26px;border-radius:100px;border:none;cursor:pointer;position:relative;transition:background .25s;flex-shrink:0}
.itoggle::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:white;transition:transform .25s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.itoggle.on{background:var(--sage)}
.itoggle.on::after{transform:translateX(18px)}
.itoggle.off{background:var(--stone)}
.overlay{position:absolute;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center;background:rgba(24,22,15,.45)}
.sheet{width:100%;background:var(--cream);max-height:88%;display:flex;flex-direction:column;border-radius:16px 16px 0 0;overflow:hidden;animation:slideUp .26s cubic-bezier(.32,.72,0,1)}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.notif-bell{width:32px;height:32px;border-radius:50%;background:var(--warm);border:1px solid var(--stone);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0}
.notif-bell.active{background:var(--sage);border-color:var(--sage)}
.quote-card{background:var(--ink);margin:16px 18px 0;padding:18px 20px}
@keyframes fallC{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
`;

const PLANS = [
  { id:"seed",name:"Seed",price:null,priceY:null,tag:null,desc:"Begin the practice.",
    f:[{t:"Hábitos ilimitados",ok:true},{t:"Streak counter",ok:true},{t:"Notificações",ok:true},{t:"Coach IA",ok:false},{t:"Insights IA",ok:false}]},
  { id:"ritual",name:"Ritual",price:"R$ 19",priceY:"R$ 190",tag:"Most popular",desc:"Build momentum.",
    f:[{t:"Hábitos ilimitados",ok:true},{t:"Coach IA ilimitado",ok:true},{t:"Notificações inteligentes",ok:true},{t:"Lembretes personalizados",ok:true},{t:"Insights IA",ok:false}]},
  { id:"devotion",name:"Devotion",price:"R$ 49",priceY:"R$ 490",tag:null,desc:"Master the self.",
    f:[{t:"Hábitos ilimitados",ok:true},{t:"Coach IA ilimitado",ok:true},{t:"Insights IA por hábito",ok:true},{t:"Notificações com frases",ok:true},{t:"Habit Programs",ok:true}]},
];

const INTEGRATIONS = [
  { id:"gcal", name:"Google Calendar", desc:"Agenda blocos de tempo para cada hábito.", color:"#4285F4" },
  { id:"spotify", name:"Spotify", desc:"Inicia playlist de foco quando você começa.", color:"#1DB954", plans:["ritual","devotion"] },
  { id:"strava", name:"Strava", desc:"Auto-completa hábitos ao registrar atividade.", color:"#FC4C02", plans:["ritual","devotion"] },
  { id:"notion", name:"Notion", desc:"Exporta relatório semanal automaticamente.", color:"#000", plans:["devotion"] },
];

const COLORS = ["#18160f","#8b9d89","#536652","#c4a882","#8c6e4a","#cfc9bc"];
const Q_COACH = ["Como estou indo esta semana?","Qual hábito precisa de atenção?","Estratégia para amanhã","Crie um lembrete criativo"];
const Q_INSIGHT = ["Dicas práticas para hoje","Por que este hábito é difícil?","Como criar o ambiente certo","Micro-ação para agora"];
const HABITS0 = [
  {id:1,name:"Morning run",color:"#8b9d89",streak:14,done:false},
  {id:2,name:"Journaling",color:"#c4a882",streak:8,done:false},
  {id:3,name:"Cold shower",color:"#8b9d89",streak:3,done:false},
  {id:4,name:"Meditation",color:"#cfc9bc",streak:0,done:false},
  {id:5,name:"No screens 9pm",color:"#536652",streak:1,done:false},
];

function greet(){ const h=new Date().getHours(); return h<12?"Good morning":h<18?"Good afternoon":"Good evening"; }
function fmtDate(){ return new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"}); }

async function callClaude(system, messages){
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,system,messages})
  });
  const d = await r.json();
  return d.content?.[0]?.text || "Algo deu errado.";
}

/* ── SVG ── */
const Logo=({sz=22,light=false})=>{
  const c=light?"#f5f2ec":"#18160f";
  return <svg width={sz} height={sz} viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="20" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="105 21"/>
    <circle cx="28" cy="28" r="11" stroke="#8b9d89" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="52 17" strokeDashoffset="-6"/>
    <circle cx="28" cy="28" r="4" fill={c}/>
    <line x1="28" y1="7" x2="28" y2="4" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
};
const Ico=({d,sz=18})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const Tick=()=><svg width="11" height="11" viewBox="0 0 12 12"><path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="var(--sage)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Dash=()=><svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6h8" stroke="var(--stone)" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const Send=()=><svg width="13" height="13" viewBox="0 0 13 13"><path d="M12 6.5L1 1.5L3.8 6.5L1 11.5L12 6.5Z" fill="currentColor"/></svg>;
const Bell=({active})=><svg width="16" height="16" viewBox="0 0 24 24" fill={active?"white":"none"} stroke={active?"white":"var(--ink-soft)"} strokeWidth="1.5" strokeLinecap="round">
  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
</svg>;

/* ── Insight Sheet ── */
function InsightSheet({habit,onClose}){
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{
    if(!habit)return;
    setLoading(true);
    callClaude(
      `Você é o motor de Insights do Kivo. Gere um insight específico, prático e calmo. Sem emojis. 2–3 parágrafos. Uma micro-ação concreta.`,
      [{role:"user",content:`Hábito: "${habit.name}" | Streak: ${habit.streak} dias | Feito hoje: ${habit.done?"sim":"não"}`}]
    ).then(t=>{setMsgs([{r:"ins",t}]);setLoading(false);});
  },[habit?.id]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  const send=async(text)=>{
    const t=(text||input).trim(); if(!t||loading)return;
    const h=[...msgs,{r:"usr",t}]; setMsgs(h); setInput(""); setLoading(true);
    const reply=await callClaude(
      `Kivo Insights. Hábito: "${habit.name}", streak ${habit.streak}d. Específico, prático. Sem emojis.`,
      h.map(m=>({role:m.r==="ins"?"assistant":"user",content:m.t}))
    );
    setMsgs(p=>[...p,{r:"ins",t:reply}]); setLoading(false);
  };
  return <div className="overlay">
    <div className="sheet">
      <div style={{padding:"16px 20px 13px",borderBottom:"1px solid var(--warm)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
        <div>
          <div style={{fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:"var(--clay-d)",marginBottom:4}}>Insight · Devotion</div>
          <div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:300,lineHeight:1}}>{habit.name}</div>
          {habit.streak>0&&<div style={{fontSize:10,color:"var(--stone)",marginTop:3}}>{habit.streak} days ↑</div>}
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--stone)",fontSize:22,lineHeight:1,paddingLeft:12}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 6px",scrollbarWidth:"none"}}>
        {loading&&msgs.length===0&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 0"}}><div style={{width:26,height:26,borderRadius:"50%",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center"}}><Logo sz={12} light/></div><div style={{display:"flex",gap:4}}><span className="dot"/><span className="dot"/><span className="dot"/></div></div>}
        {msgs.map((m,i)=><div key={i} className={`msg ${m.r==="usr"?"usr":"ins"}`}>
          {m.r!=="usr"&&<div style={{width:26,height:26,borderRadius:"50%",background:"var(--ink)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Logo sz={12} light/></div>}
          <div className="bub" style={{whiteSpace:"pre-wrap"}}>{m.t}</div>
        </div>)}
        {loading&&msgs.length>0&&<div className="msg ins"><div style={{width:26,height:26,borderRadius:"50%",background:"var(--ink)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Logo sz={12} light/></div><div className="bub" style={{background:"var(--ink)",display:"flex",gap:5,padding:"12px 16px"}}><span className="dot"/><span className="dot"/><span className="dot"/></div></div>}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&!loading&&<div style={{padding:"0 16px 8px",display:"flex",flexWrap:"wrap",gap:6}}>
        {Q_INSIGHT.map((q,i)=><button key={i} onClick={()=>send(q)} style={{background:"var(--warm)",border:"1px solid var(--stone)",borderRadius:"100px",padding:"4px 10px",fontSize:10,color:"var(--ink-mid)",cursor:"pointer",fontFamily:"var(--fb)",fontWeight:300}}>{q}</button>)}
      </div>}
      <div style={{padding:"6px 12px 16px",display:"flex",gap:7,alignItems:"flex-end",borderTop:"1px solid var(--warm)",flexShrink:0}}>
        <textarea className="ci" placeholder="Explore este hábito…" value={input} rows={1}
          onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=e.target.scrollHeight+"px";}}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
        <button className="sbtn" onClick={()=>send()} disabled={loading||!input.trim()}><Send/></button>
      </div>
    </div>
  </div>;
}

/* ── Welcome ── */
function Welcome({onStart,onSignin}){
  return <div style={{height:"100%",display:"flex",flexDirection:"column",padding:"0 28px"}}>
    <div style={{paddingTop:56,flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:48}}><Logo sz={28}/><span style={{fontFamily:"var(--fd)",fontSize:28,fontWeight:300}}>kivo</span></div>
      <h1 style={{fontFamily:"var(--fd)",fontSize:42,fontWeight:300,lineHeight:1.1,letterSpacing:"-.02em",marginBottom:14}}>Build the life<br/>you intend.</h1>
      <p style={{fontSize:14,fontWeight:300,color:"var(--ink-soft)",lineHeight:1.7,maxWidth:260}}>kivo aprende o ritmo dos seus dias — coaching pessoal, não genérico.</p>
      <div style={{margin:"32px 0 0",opacity:.1,overflow:"hidden",height:90}}>
        <svg width="210" height="105" viewBox="0 0 210 105"><g transform="translate(0 105)">{[38,76,114,152,190,228].map((r,i)=><circle key={i} cx="0" cy="0" r={r} fill="none" stroke="var(--ink)" strokeWidth=".7" strokeDasharray={`${Math.PI*r*.82} ${Math.PI*r*.18}`}/>)}</g><circle cx="0" cy="105" r="4" fill="var(--ink)" opacity=".8"/></svg>
      </div>
    </div>
    <div style={{paddingBottom:40,display:"flex",flexDirection:"column",gap:10}}>
      <button className="btnp" onClick={onStart}>Start today</button>
      <button className="btno" onClick={onSignin}>Sign in</button>
      <p style={{fontSize:11,fontWeight:300,color:"var(--stone)",textAlign:"center",lineHeight:1.6,marginTop:4}}>Sem anúncios. Sem ruído.<br/>Apenas a sua prática.</p>
    </div>
  </div>;
}

/* ── Plans ── */
function Plans({onSelect}){
  const [sel,setSel]=useState("devotion");
  const [billing,setBilling]=useState("monthly");
  return <div className="scrl" style={{padding:"36px 20px 36px"}}>
    <div style={{marginBottom:22}}>
      <div style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"var(--stone)",marginBottom:8}}>Escolha seu plano</div>
      <h2 style={{fontFamily:"var(--fd)",fontSize:30,fontWeight:300,lineHeight:1.1}}>Invista na<br/>sua prática.</h2>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
      <div className="tgl">
        <button className={`topt ${billing==="monthly"?"on":""}`} onClick={()=>setBilling("monthly")}>Mensal</button>
        <button className={`topt ${billing==="annual"?"on":""}`} onClick={()=>setBilling("annual")}>Anual</button>
      </div>
      {billing==="annual"&&<span className="pill c" style={{fontSize:8}}>2 meses grátis</span>}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
      {PLANS.map(p=><div key={p.id} className={`pcard ${sel===p.id?"sel":""} ${p.id==="ritual"&&sel!==p.id?"feat":""}`} onClick={()=>setSel(p.id)}>
        {p.tag&&<div style={{position:"absolute",top:-1,right:14,background:"var(--sage)",padding:"2px 8px",fontSize:7,letterSpacing:".14em",textTransform:"uppercase",color:"#fff",borderRadius:"0 0 3px 3px"}}>{p.tag}</div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div>
            <div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:300,lineHeight:1}}>{p.name}</div>
            <div style={{fontSize:11,fontWeight:300,color:"var(--ink-soft)",marginTop:2}}>{p.desc}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0,paddingLeft:10}}>
            {p.price?<><div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:300,lineHeight:1}}>{billing==="annual"?p.priceY:p.price}</div><div style={{fontSize:9,color:"var(--stone)",marginTop:1}}>{billing==="annual"?"/ ano":"/ mês"}</div></>:<div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:300}}>Grátis</div>}
          </div>
        </div>
        <div style={{borderTop:"1px solid var(--warm)",paddingTop:9,display:"flex",flexDirection:"column",gap:5}}>
          {p.f.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7}}>{f.ok?<Tick/>:<Dash/>}<span style={{fontSize:12,fontWeight:300,color:f.ok?"var(--ink-mid)":"var(--stone)"}}>{f.t}</span></div>)}
        </div>
      </div>)}
    </div>
    <button className="btnp" onClick={()=>onSelect(sel)}>{sel==="seed"?"Continuar grátis":`Continuar com ${PLANS.find(p=>p.id===sel)?.name}`}</button>
    <p style={{fontSize:11,fontWeight:300,color:"var(--stone)",textAlign:"center",marginTop:12}}>Cancele quando quiser.</p>
  </div>;
}

/* ── Auth ── */
function AuthForm({mode,plan,onDone,onSwitch}){
  const [v,setV]=useState({name:"",email:"",pass:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const isSignup=mode==="signup";
  const submit=async()=>{
    setErr("");
    if(isSignup&&!v.name.trim()){setErr("Preencha seu nome.");return;}
    if(!v.email.includes("@")){setErr("Email inválido.");return;}
    if(v.pass.length<6){setErr("Senha muito curta (mín. 6).");return;}
    setLoading(true);
    if(isSignup){
      const {error}=await supabase.auth.signUp({email:v.email.trim(),password:v.pass,options:{data:{name:v.name.trim(),plan}}});
      if(error){setErr(error.message);setLoading(false);}
    } else {
      const {error}=await supabase.auth.signInWithPassword({email:v.email.trim(),password:v.pass});
      if(error){setErr("Email ou senha incorretos.");setLoading(false);}
    }
  };
  return <div style={{padding:"40px 24px 36px"}}>
    <div style={{marginBottom:26}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Logo sz={17}/><span style={{fontFamily:"var(--fd)",fontSize:17,fontWeight:300}}>kivo</span></div>
      <h2 style={{fontFamily:"var(--fd)",fontSize:28,fontWeight:300,lineHeight:1.15,marginBottom:isSignup?8:0}}>{isSignup?"Criar sua conta":"Bem-vindo de volta."}</h2>
      {isSignup&&plan&&<span className="pill c">{PLANS.find(p=>p.id===plan)?.name}{plan==="seed"?" · Grátis":""}</span>}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:20,marginBottom:24}}>
      {isSignup&&<div><label className="flabel">Seu nome</label><input className="finp" type="text" placeholder="Como devemos te chamar?" value={v.name} onChange={e=>setV(p=>({...p,name:e.target.value}))}/></div>}
      <div><label className="flabel">Email</label><input className="finp" type="email" placeholder="seu@email.com" value={v.email} onChange={e=>setV(p=>({...p,email:e.target.value}))}/></div>
      <div><label className="flabel">Senha</label><input className="finp" type="password" placeholder={isSignup?"Mínimo 6 caracteres":"Sua senha"} value={v.pass} onChange={e=>setV(p=>({...p,pass:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
      {err&&<div style={{fontSize:12,color:"var(--err)",fontWeight:300}}>{err}</div>}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button className="btnp" onClick={submit} disabled={loading}>
        {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><div className="spinner" style={{borderTopColor:"var(--cream)"}}/>Processando…</span>:isSignup?"Criar conta":"Entrar"}
      </button>
      <div style={{textAlign:"center"}}><span style={{fontSize:12,fontWeight:300,color:"var(--ink-soft)"}}>{isSignup?"Já tem conta? ":"Novo no kivo? "}</span><button className="btnlnk" onClick={onSwitch}>{isSignup?"Entrar":"Criar conta"}</button></div>
    </div>
  </div>;
}

/* ── Main App ── */
function MainApp({session,profile,onSignOut}){
  const [tab,setTab]=useState("home");
  const [habits,setHabits]=useState(HABITS0);
  const [msgs,setMsgs]=useState([{r:"ai",t:`Bem-vindo de volta, ${profile?.name}.\n\nSeu ritual matinal está firme — 14 dias seguidos. Esse tipo de consistência não acontece por acaso.\n\nO que está na sua mente hoje?`}]);
  const [input,setInput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [newH,setNewH]=useState({name:"",color:"#8b9d89"});
  const [insightHabit,setInsightHabit]=useState(null);
  const [confetti,setConfetti]=useState(false);
  const [notifEnabled,setNotifEnabled]=useState(false);
  const [dailyQuote,setDailyQuote]=useState(()=>randomQuote());
  const [conns,setConns]=useState({});
  const [toast,setToast]=useState(null);
  const endRef=useRef(null);

  const plan=profile?.plan||"devotion";
  const canCoach=plan==="ritual"||plan==="devotion";
  const canInsight=plan==="devotion";
  const done=habits.filter(h=>h.done).length;
  const total=habits.length;
  const pct=total?done/total:0;
  const maxStreak=Math.max(...habits.map(h=>h.streak),0);
  const allDone=total>0&&done===total;
  const planName=PLANS.find(p=>p.id===plan)?.name;

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,aiLoading]);
  useEffect(()=>{if(allDone&&!confetti){setConfetti(true);setTimeout(()=>setConfetti(false),3200);}},[allDone]);

  useEffect(()=>{
    if(notifEnabled) scheduleDailyReminders(habits);
  },[notifEnabled,habits]);

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),3000);};

  const enableNotifications=async()=>{
    const ok=await registerPush();
    if(ok){
      setNotifEnabled(true);
      const q=randomQuote();
      scheduleLocalNotification("kivo ativado",500);
      showToast("Notificações ativadas");
    } else {
      showToast("Permissão negada. Ative nas configurações do celular.");
    }
  };

  const toggle=id=>{
    setHabits(p=>p.map(h=>{
      if(h.id!==id)return h;
      const nowDone=!h.done;
      if(nowDone&&notifEnabled){
        const q=randomQuote();
        setTimeout(()=>{
          new Notification(`kivo · ${h.name} concluído`,{
            body:`"${q.text}" — ${q.author}`,
            icon:"/icon-192.png",
            tag:`kivo-done-${h.id}`,
          });
        },800);
      }
      return {...h,done:nowDone,streak:nowDone?h.streak+1:Math.max(0,h.streak-1)};
    }));
  };

  const sendMsg=async(text)=>{
    const t=(text||input).trim(); if(!t||aiLoading||!canCoach)return;
    const h=[...msgs,{r:"usr",t}]; setMsgs(h); setInput(""); setAiLoading(true);
    const ctx=habits.map(h=>`- ${h.name}: ${h.done?"feito":"pendente"} | streak ${h.streak}d`).join("\n");
    const reply=await callClaude(
      `Você é o Kivo Coach — calmo, perspicaz, elevado. Usuário: ${profile?.name} · Plano: ${plan}\nHábitos:\n${ctx}\nProgresso: ${done}/${total} | Melhor streak: ${maxStreak}d\nRegras: específico, pessoal, 1–3 parágrafos curtos, sem listas, sem emojis, prosa limpa. Responda em português.`,
      h.map(m=>({role:m.r==="ai"?"assistant":"user",content:m.t}))
    ).catch(()=>"Sem conexão. Tente novamente.");
    setMsgs(p=>[...p,{r:"ai",t:reply}]); setAiLoading(false);
  };

  const addHabit=()=>{
    if(!newH.name.trim())return;
    setHabits(p=>[...p,{id:Date.now(),name:newH.name.trim(),color:newH.color,streak:0,done:false}]);
    setNewH({name:"",color:"#8b9d89"}); setShowAdd(false);
  };

  return <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    {confetti&&<div style={{position:"absolute",top:0,left:0,right:0,pointerEvents:"none",zIndex:98,overflow:"hidden",height:"100%"}}>
      {Array.from({length:14}).map((_,i)=><div key={i} style={{position:"absolute",left:`${5+i*6.5}%`,top:0,width:5,height:5,borderRadius:i%2===0?"50%":"1px",background:["#8b9d89","#c4a882","#cfc9bc","#536652","#3a3830"][i%5],animation:`fallC ${1.5+Math.random()*1.2}s ${Math.random()*.4}s ease-in forwards`,transform:`rotate(${Math.random()*180}deg)`}}/>)}
    </div>}

    {insightHabit&&<InsightSheet habit={insightHabit} onClose={()=>setInsightHabit(null)}/>}

    {toast&&<div style={{position:"absolute",bottom:90,left:"50%",transform:"translateX(-50%)",background:"var(--ink)",color:"var(--cream)",padding:"9px 16px",borderRadius:"100px",fontSize:12,fontWeight:300,letterSpacing:".04em",whiteSpace:"nowrap",zIndex:99,animation:"fu .25s ease"}}>{toast}</div>}

    <div className="scrl">

      {/* TODAY */}
      {tab==="home"&&<div>
        <div style={{padding:"32px 22px 20px",borderBottom:"1px solid var(--warm)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:9,letterSpacing:".18em",textTransform:"capitalize",color:"var(--stone)",marginBottom:8}}>{fmtDate()}</div>
              <h1 style={{fontFamily:"var(--fd)",fontSize:30,fontWeight:300,lineHeight:1.1}}>{greet()},<br/>{profile?.name}.</h1>
            </div>
            <div style={{display:"flex",gap:8,paddingTop:2,alignItems:"center"}}>
              <div className={`notif-bell ${notifEnabled?"active":""}`} onClick={notifEnabled?()=>setNotifEnabled(false):enableNotifications} title={notifEnabled?"Desativar notificações":"Ativar notificações"}>
                <Bell active={notifEnabled}/>
              </div>
              <button onClick={onSignOut} style={{background:"none",border:"none",cursor:"pointer",opacity:.4}}><Logo sz={20}/></button>
            </div>
          </div>
          <div style={{marginTop:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
              <span style={{fontFamily:"var(--fd)",fontSize:46,fontWeight:300,lineHeight:1}}>{done}</span>
              <span style={{fontSize:12,fontWeight:300,color:"var(--ink-soft)"}}>de {total} feitos</span>
            </div>
            <div className="ptk"><div className="pfl" style={{width:`${pct*100}%`}}/></div>
          </div>
          <div style={{display:"flex",gap:6,marginTop:11,flexWrap:"wrap"}}>
            {maxStreak>0&&<span className="pill">{maxStreak}d streak ↑</span>}
            {allDone?<span className="pill s">Tudo feito hoje</span>:<span className="pill">{total-done} restante{total-done!==1?"s":""}</span>}
            <span className="pill c" style={{fontSize:8}}>{planName}</span>
            {notifEnabled&&<span className="pill s" style={{fontSize:8}}>notificações ativas</span>}
          </div>
        </div>

        {habits.map(h=><div key={h.id} className="hrow">
          <div style={{display:"flex",alignItems:"center",gap:13,flex:1}} onClick={()=>toggle(h.id)}>
            <div className={`chk ${h.done?"done":""}`} style={!h.done?{borderColor:h.color}:{}}>
              {h.done&&<svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:300,color:h.done?"var(--stone)":"var(--ink)",textDecoration:h.done?"line-through":"none",transition:"all .3s",letterSpacing:"-.01em"}}>{h.name}</div>
              {h.streak>0&&<div style={{fontSize:10,color:"var(--stone)",marginTop:1,letterSpacing:".04em"}}>{h.streak}d ↑</div>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {canInsight&&<button onClick={()=>setInsightHabit(h)} style={{background:"none",border:"1px solid var(--clay)",borderRadius:"100px",padding:"2px 8px",fontSize:8,letterSpacing:".12em",textTransform:"uppercase",color:"var(--clay-d)",cursor:"pointer",fontFamily:"var(--fb)"}}>Insight</button>}
            <div style={{width:6,height:6,borderRadius:"50%",background:h.done?"var(--stone)":h.color,transition:"background .3s"}}/>
          </div>
        </div>)}

        {/* Quote card */}
        <div className="quote-card">
          <div style={{fontSize:9,letterSpacing:".14em",textTransform:"uppercase",color:"#5a5850",marginBottom:10}}>Frase do dia</div>
          <div style={{fontFamily:"var(--fd)",fontStyle:"italic",fontSize:15,fontWeight:300,color:"var(--cream)",lineHeight:1.6,marginBottom:8}}>{`"${dailyQuote.text}"`}</div>
          <div style={{fontSize:10,color:"#5a5850",letterSpacing:".06em"}}>— {dailyQuote.author}</div>
          <button onClick={()=>setDailyQuote(randomQuote())} style={{background:"none",border:"none",cursor:"pointer",color:"#5a5850",fontSize:10,marginTop:12,letterSpacing:".1em",textTransform:"uppercase",fontFamily:"var(--fb)",padding:0}}>Nova frase →</button>
        </div>

        {canCoach&&done>0&&<div style={{margin:"0 18px 0",background:"var(--warm)",padding:"16px 20px",cursor:"pointer",borderTop:"1px solid var(--stone)"}} onClick={()=>setTab("coach")}>
          <div style={{fontSize:9,letterSpacing:".14em",textTransform:"uppercase",color:"var(--stone)",marginBottom:7}}>Coach</div>
          <div style={{fontFamily:"var(--fd)",fontStyle:"italic",fontSize:14,fontWeight:300,color:"var(--ink-mid)",lineHeight:1.55}}>
            {allDone?"Tudo feito. Vamos falar sobre o que vem a seguir.":`${done} feito${done!==1?"s":""}, ${total-done} a ir. Você está na janela.`}
          </div>
          <div style={{fontSize:9,color:"var(--stone)",marginTop:12,letterSpacing:".12em",textTransform:"uppercase"}}>Abrir coach →</div>
        </div>}

        <div style={{padding:"22px 22px 6px"}}>
          <p style={{fontFamily:"var(--fd)",fontStyle:"italic",fontSize:13,fontWeight:300,color:"var(--stone)",lineHeight:1.7}}>Hábitos não são regras. São rituais que você escolhe.</p>
        </div>
      </div>}

      {/* COACH */}
      {tab==="coach"&&<div>
        <div style={{padding:"28px 22px 16px",borderBottom:"1px solid var(--warm)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo sz={20}/>
            <div>
              <h2 style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:300,lineHeight:1}}>kivo coach</h2>
              <div style={{fontSize:9,letterSpacing:".14em",textTransform:"uppercase",color:canCoach?"var(--sage)":"var(--stone)",marginTop:3}}>{canCoach?"Ativo · ilimitado":"Plano Ritual necessário"}</div>
            </div>
          </div>
        </div>
        {!canCoach?<div style={{padding:"32px 24px",textAlign:"center"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:300,color:"var(--ink-mid)",marginBottom:10,lineHeight:1.4}}>O coach está disponível<br/>no plano Ritual.</div>
          <p style={{fontSize:13,fontWeight:300,color:"var(--stone)",lineHeight:1.7,marginBottom:22}}>Upgrade para coaching IA personalizado.</p>
          <button className="btnp" style={{maxWidth:240,margin:"0 auto"}}>Upgrade para Ritual</button>
        </div>:(
          <>
            {msgs.length<=1&&<div style={{borderBottom:"1px solid var(--warm)"}}>
              <div style={{padding:"12px 20px 5px",fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:"var(--stone)"}}>Sugestões</div>
              {Q_COACH.map((q,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"11px 18px",borderBottom:i<3?"1px solid var(--warm)":"none",cursor:"pointer"}} onClick={()=>sendMsg(q)}>
                <span style={{fontSize:11,color:"var(--stone)"}}>→</span>
                <span style={{fontSize:13,fontWeight:300,color:"var(--ink-mid)"}}>{q}</span>
              </div>)}
            </div>}
            <div style={{padding:"18px 16px 6px"}}>
              {msgs.map((m,i)=><div key={i} className={`msg ${m.r==="usr"?"usr":"ai"}`}>
                {m.r==="ai"&&<div style={{width:26,height:26,borderRadius:"50%",background:"var(--warm)",border:"1px solid var(--stone)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Logo sz={13}/></div>}
                <div className="bub" style={{whiteSpace:"pre-wrap"}}>{m.t}</div>
              </div>)}
              {aiLoading&&<div className="msg ai"><div style={{width:26,height:26,borderRadius:"50%",background:"var(--warm)",border:"1px solid var(--stone)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Logo sz={13}/></div><div className="bub" style={{display:"flex",gap:5,padding:"12px 16px"}}><span className="dot"/><span className="dot"/><span className="dot"/></div></div>}
              <div ref={endRef}/>
            </div>
            <div className="cin">
              <textarea className="ci" placeholder="Pergunte ao seu coach…" value={input} rows={1}
                onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=e.target.scrollHeight+"px";}}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}/>
              <button className="sbtn" onClick={()=>sendMsg()} disabled={aiLoading||!input.trim()}><Send/></button>
            </div>
          </>
        )}
      </div>}

      {/* HABITS */}
      {tab==="habits"&&<div>
        <div style={{padding:"28px 22px 18px",borderBottom:"1px solid var(--warm)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <h2 style={{fontFamily:"var(--fd)",fontSize:27,fontWeight:300,lineHeight:1}}>Hábitos</h2>
            <button onClick={()=>setShowAdd(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:"var(--ink-soft)",fontFamily:"var(--fb)",fontSize:9,letterSpacing:".14em",textTransform:"uppercase",padding:"5px 0"}}>
              <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>Adicionar
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginTop:14}}>
            {[{v:total,l:"total"},{v:done,l:"hoje"},{v:`${maxStreak}d`,l:"streak"},{v:`${Math.round(pct*100)}%`,l:"taxa"}].map((s,i)=><div key={i} style={{background:"var(--white)",padding:"11px 8px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:300,lineHeight:1,color:i===1?"var(--sage-d)":i===2?"var(--clay-d)":"var(--ink)"}}>{s.v}</div>
              <div style={{fontSize:8,letterSpacing:".1em",textTransform:"uppercase",color:"var(--stone)",marginTop:3}}>{s.l}</div>
            </div>)}
          </div>
        </div>
        {showAdd&&<div style={{padding:"16px 22px",borderBottom:"1px solid var(--warm)",background:"var(--white)"}}>
          <div style={{fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:"var(--stone)",marginBottom:12}}>Novo hábito</div>
          <label className="flabel">Nome</label>
          <input className="finp" placeholder="Nome do ritual" value={newH.name} onChange={e=>setNewH(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addHabit()} autoFocus style={{marginBottom:16}}/>
          <div style={{fontSize:9,letterSpacing:".12em",textTransform:"uppercase",color:"var(--stone)",marginBottom:8}}>Cor</div>
          <div style={{display:"flex",gap:9,marginBottom:16}}>
            {COLORS.map(c=><div key={c} className={`cdot ${newH.color===c?"sel":""}`} style={{background:c}} onClick={()=>setNewH(p=>({...p,color:c}))}/>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btno" onClick={()=>setShowAdd(false)} style={{flex:1,padding:"11px"}}>Cancelar</button>
            <button className="btnp" onClick={addHabit} style={{flex:2,padding:"11px"}}>Adicionar</button>
          </div>
        </div>}
        {habits.map(h=><div key={h.id} style={{display:"flex",alignItems:"center",padding:"13px 22px",borderBottom:"1px solid var(--warm)",gap:12}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:h.done?"var(--stone)":h.color,flexShrink:0,transition:"background .3s"}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:300,letterSpacing:"-.01em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</div>
            {h.streak>0&&<div style={{fontSize:10,color:"var(--stone)",marginTop:1}}>{h.streak} dias ↑</div>}
          </div>
          {canInsight&&<button onClick={()=>setInsightHabit(h)} style={{background:"none",border:"1px solid var(--clay)",borderRadius:"100px",padding:"2px 8px",fontSize:8,letterSpacing:".12em",textTransform:"uppercase",color:"var(--clay-d)",cursor:"pointer",fontFamily:"var(--fb)",flexShrink:0}}>Insight</button>}
          {h.done&&<span className="pill s" style={{padding:"2px 7px",fontSize:8,flexShrink:0}}>feito</span>}
          <button onClick={()=>setHabits(p=>p.filter(x=>x.id!==h.id))} style={{background:"none",border:"none",color:"var(--stone)",cursor:"pointer",fontSize:17,lineHeight:1,padding:"0 3px",flexShrink:0,transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="var(--ink)"} onMouseLeave={e=>e.target.style.color="var(--stone)"}>×</button>
        </div>)}
      </div>}

      {/* CONNECT */}
      {tab==="connect"&&<div>
        <div style={{padding:"28px 22px 20px",borderBottom:"1px solid var(--warm)"}}>
          <div style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"var(--stone)",marginBottom:8}}>Conectar apps</div>
          <h2 style={{fontFamily:"var(--fd)",fontSize:27,fontWeight:300,lineHeight:1}}>Integrações</h2>
          <p style={{fontSize:13,fontWeight:300,color:"var(--ink-soft)",marginTop:7,lineHeight:1.6}}>Conecte seus apps favoritos para que o kivo funcione onde você já está.</p>
        </div>
        <div style={{padding:"14px 20px"}}>
          {/* Notifications card */}
          <div className="icard">
            <div style={{display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:38,height:38,borderRadius:10,background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bell active/></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                  <span style={{fontSize:14,fontWeight:400,color:"var(--ink)"}}>Notificações</span>
                  {notifEnabled&&<span className="pill s" style={{fontSize:8,padding:"2px 8px"}}>ativo</span>}
                </div>
                <p style={{fontSize:12,fontWeight:300,color:"var(--ink-soft)",lineHeight:1.5}}>Lembretes nos horários certos com frases de Rocky, Aristóteles e outros.</p>
              </div>
              <button className={`itoggle ${notifEnabled?"on":"off"}`} onClick={notifEnabled?()=>setNotifEnabled(false):enableNotifications}/>
            </div>
            {notifEnabled&&<div style={{borderTop:"1px solid var(--warm)",paddingTop:10,display:"flex",flexDirection:"column",gap:8}}>
              <div style={{fontSize:11,fontWeight:300,color:"var(--ink-soft)"}}>Lembretes agendados: 8h, 14h e 21h</div>
              <button onClick={()=>{const q=randomQuote();scheduleLocalNotification("Teste de notificação",300);showToast("Notificação de teste enviada");}} style={{background:"none",border:"1px solid var(--stone)",borderRadius:"2px",padding:"7px 14px",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--ink-soft)",cursor:"pointer",fontFamily:"var(--fb)",width:"fit-content"}}>Testar agora</button>
            </div>}
          </div>

          {INTEGRATIONS.map(intg=>{
            const connected=!!conns[intg.id];
            const available=!intg.plans||intg.plans.includes(plan);
            return <div key={intg.id} className="icard" style={{opacity:available?1:.6}}>
              <div style={{display:"flex",alignItems:"center",gap:13}}>
                <div style={{width:38,height:38,borderRadius:10,background:intg.color,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                    <span style={{fontSize:14,fontWeight:400,color:"var(--ink)"}}>{intg.name}</span>
                    {connected&&<span className="pill s" style={{fontSize:8,padding:"2px 8px"}}>conectado</span>}
                    {!available&&<span className="pill" style={{fontSize:8,padding:"2px 8px"}}>{intg.plans[0]==="ritual"?"Ritual+":"Devotion"}</span>}
                  </div>
                  <p style={{fontSize:12,fontWeight:300,color:"var(--ink-soft)",lineHeight:1.5}}>{intg.desc}</p>
                </div>
                <button className={`itoggle ${connected?"on":"off"}`} onClick={()=>{
                  if(!available){showToast(`Disponível no plano ${intg.plans[0]==="ritual"?"Ritual":"Devotion"}`);return;}
                  const next={...conns};
                  if(connected)delete next[intg.id]; else next[intg.id]=true;
                  setConns(next);
                  showToast(connected?`${intg.name} desconectado`:`${intg.name} conectado`);
                }}/>
              </div>
            </div>;
          })}
        </div>
      </div>}

    </div>

    <nav className="nav">
      {[
        {id:"home",label:"Hoje",d:"M3 12L12 3L21 12V20a1 1 0 01-1 1H5a1 1 0 01-1-1V12z"},
        {id:"coach",label:"Coach"},
        {id:"habits",label:"Hábitos",d:"M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"},
        {id:"connect",label:"Apps",d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"},
      ].map(({id,label,d})=><button key={id} className={`nb ${tab===id?"on":""}`} onClick={()=>setTab(id)}>
        {id==="coach"?<Logo sz={17}/>:<Ico d={d} sz={17}/>}
        {label}
      </button>)}
    </nav>
  </div>;
}

/* ── ROOT ── */
export default function App(){
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [screen,setScreen]=useState("welcome");
  const [plan,setPlan]=useState("ritual");
  const [bootDone,setBootDone]=useState(false);

  const loadProfile=async(userId)=>{
    const {data}=await supabase.from("profiles").select("*").eq("id",userId).single();
    setProfile(data);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      if(session){loadProfile(session.user.id);setScreen("app");}
      setBootDone(true);
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      setSession(session);
      if(session){loadProfile(session.user.id);setScreen("app");}
      else{setProfile(null);setScreen("welcome");}
    });
    return ()=>subscription.unsubscribe();
  },[]);

  if(!bootDone)return<><style>{CSS}</style><div className="app" style={{alignItems:"center",justifyContent:"center"}}><Logo sz={28}/></div></>;

  return <>
    <style>{CSS}</style>
    <div className="app">
      {screen==="welcome"&&<Welcome onStart={()=>setScreen("plans")} onSignin={()=>setScreen("signin")}/>}
      {screen==="plans"&&<Plans onSelect={p=>{setPlan(p);setScreen("signup");}}/>}
      {screen==="signup"&&<AuthForm mode="signup" plan={plan} onDone={()=>{}} onSwitch={()=>setScreen("signin")}/>}
      {screen==="signin"&&<AuthForm mode="signin" onDone={()=>{}} onSwitch={()=>setScreen("plans")}/>}
      {screen==="app"&&session&&profile&&<MainApp session={session} profile={profile} onSignOut={()=>supabase.auth.signOut()}/>}
      {screen==="app"&&session&&!profile&&<div className="app" style={{alignItems:"center",justifyContent:"center"}}><div className="spinner"/></div>}
    </div>
  </>;
}
