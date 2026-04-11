#!/bin/bash
echo "🌱 kivo · Deploy automatico"
echo ""

# Check node
if ! command -v node &> /dev/null; then
  echo "Instale o Node.js em nodejs.org e tente novamente"
  exit 1
fi

echo "Instalando dependencias..."
npm install

echo "Fazendo build..."
npm run build

echo "Instalando Vercel CLI..."
npm install -g vercel

echo ""
echo "Iniciando deploy na Vercel..."
echo "Se pedir login, entre com sua conta Vercel."
echo ""
vercel --yes \
  --env VITE_SUPABASE_URL=https://cisvcdardbbqbqgtuxbv.supabase.co \
  --env VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc3ZjZmRhcmRicWJxZ3R1eGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODk0NTQsImV4cCI6MjA5MTE2NTQ1NH0.1BnrLs8eBemTKnwUlmnD5tD3IAtdUKjYtGPB9UxNC14

echo ""
echo "Deploy completo! Abra o link acima no celular."
