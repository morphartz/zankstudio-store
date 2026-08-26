"use client"

import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: "a.g.b.morphzy@gmail.com",
      password,
    })
    setLoading(false)
    if (error) {
      setError("Invalid admin password.")
      return
    }
    router.replace("/admin")
    router.refresh()
  }

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <p className="kicker">ZANK STUDIO · ADMIN</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to manage products, orders, delivery and store settings.</p>
        <form onSubmit={submit} className="form">
          <div className="field">
            <label>Email</label>
            <input value="a.g.b.morphzy@gmail.com" disabled />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn-black" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </main>
  )
}
