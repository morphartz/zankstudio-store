'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('a.g.b.morphzy@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/admin')
    router.refresh()
  }
  return <main className="admin-page" style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24}}>
    <form className="panel form" onSubmit={submit} style={{padding:28,width:'min(420px,100%)'}}>
      <div><div className="logo">ZANK STUDIO</div><p className="muted">ADMIN LOGIN</p></div>
      <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></div>
      {error && <p style={{color:'#b00020',fontSize:12}}>{error}</p>}
      <button className="btn-black" type="submit" disabled={loading}>{loading?'Signing in…':'Sign in'}</button>
    </form>
  </main>
}
