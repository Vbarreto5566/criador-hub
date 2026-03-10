'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.replace('/dashboard')
      else router.replace('/auth')
    }
    check()
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07070f' }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(255,59,107,.2)', borderTopColor: '#ff3b6b', borderRadius: '50%' }} className="anim-spin" />
    </div>
  )
}
