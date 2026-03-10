# 🇧🇷 CriadorHub — Plataforma para Creators Brasileiros

Plataforma completa para criadores de conteúdo no Brasil gerenciarem Instagram, TikTok, marcas e criarem legendas com IA.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** via Supabase (cadastro, login, recuperação de senha)
- 🤖 **Gerador de legendas com IA** para Instagram e TikTok em português
- 📊 **Analytics** do perfil (pronto para integrar APIs reais)
- 👥 **Rede de criadores** para se conectar com outros creators
- 🤝 **Marcas & Patrocinadores** para encontrar parcerias
- 📅 **Agenda de conteúdo** para planejar seus posts

---

## 🚀 Como rodar localmente

### 1. Pré-requisitos
- [Node.js 18+](https://nodejs.org) instalado no seu computador
- Uma conta no [Supabase](https://supabase.com) (já configurada)

### 2. Instalar dependências
Abra o terminal dentro da pasta `criador-hub` e rode:

```bash
npm install
```

### 3. Configurar variáveis de ambiente
O arquivo `.env.local` já está configurado com suas credenciais do Supabase.
Se precisar alterar, edite o arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://zvlyoiowdtzncolmgqpn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. ✅

---

## 🌐 Como publicar na internet (Vercel — GRÁTIS)

### Opção A: Via GitHub + Vercel (recomendado)

1. Crie uma conta em [github.com](https://github.com) se não tiver
2. Crie um repositório novo chamado `criador-hub`
3. Dentro da pasta do projeto, rode:
   ```bash
   git init
   git add .
   git commit -m "primeiro commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/criador-hub.git
   git push -u origin main
   ```
4. Acesse [vercel.com](https://vercel.com) e clique em **"Import Project"**
5. Conecte seu GitHub e selecione o repositório `criador-hub`
6. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://zvlyoiowdtzncolmgqpn.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anon
7. Clique em **Deploy** — em 2 minutos seu site está no ar! 🎉

### Opção B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
Siga as instruções no terminal.

---

## ⚙️ Configuração do Supabase

Para que o cadastro funcione corretamente, verifique no painel do Supabase:

1. Vá em **Authentication → Settings**
2. Em **Email Auth**, certifique que está **habilitado**
3. Para testar sem confirmar email: desative **"Confirm email"** (útil em desenvolvimento)
4. Para produção: deixe a confirmação ativa e configure o **Site URL** com o domínio da Vercel

---

## 📁 Estrutura do projeto

```
criador-hub/
├── app/
│   ├── auth/page.tsx          # Login, cadastro, recuperação de senha
│   ├── dashboard/
│   │   ├── layout.tsx         # Sidebar + topbar
│   │   ├── page.tsx           # Perfil do usuário
│   │   ├── legenda/page.tsx   # Gerador de legendas com IA 🤖
│   │   ├── analytics/page.tsx # Analytics
│   │   ├── creators/page.tsx  # Rede de criadores
│   │   ├── brands/page.tsx    # Marcas & parcerias
│   │   └── schedule/page.tsx  # Agenda de conteúdo
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   ├── supabase.ts            # Cliente Supabase
│   └── claude.ts              # Gerador de legendas com IA
├── .env.local                 # Suas credenciais (não commitar!)
└── package.json
```

---

## 🔮 Próximos passos sugeridos

- [ ] Integrar **Instagram Graph API** para dados reais
- [ ] Integrar **TikTok Display API** para analytics reais
- [ ] Adicionar banco de dados para salvar posts agendados
- [ ] Sistema de notificações para lembretes de postagem
- [ ] Página de landing com planos de assinatura

---

Feito com ❤️ para creators brasileiros 🇧🇷
