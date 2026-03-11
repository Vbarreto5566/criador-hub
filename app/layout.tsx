import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'criadorhub — plataforma para creators brasileiros',
  description: 'Gerencie Instagram e TikTok, conecte com marcas e crie legendas com IA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
