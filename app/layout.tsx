import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CriadorHub — Plataforma para Creators Brasileiros',
  description: 'Gerencie seu Instagram e TikTok, conecte com marcas e crie legendas com IA.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
