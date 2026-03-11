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
      router.replace(session ? '/dashboard' : '/auth')
    }
    check()
  }, [router])

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#111110' }}>
      <div style={{ width:18, height:18, border:'1.5px solid rgba(255,255,255,.1)', borderTopColor:'#a8a49e', borderRadius:'50%' }} className="anim-spin" />
    </div>
  )
}
