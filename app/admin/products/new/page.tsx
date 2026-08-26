"use client"

import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name,setName]=useState("")
  const [slug,setSlug]=useState("")
  const [price,setPrice]=useState("3500")
  const [stock,setStock]=useState("10")
  const [description,setDescription]=useState("")
  const [colors,setColors]=useState("BLACK,WHITE")
  const [sizes,setSizes]=useState("S,M,L,XL")
  const [badge,setBadge]=useState("NEW")
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState("")

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError("")
    const { error } = await supabase.from("products").insert({name,slug,price:Number(price),stock:Number(stock),description,colors:colors.split(",").map(x=>x.trim()).filter(Boolean),sizes:sizes.split(",").map(x=>x.trim()).filter(Boolean),badge:badge||null,is_featured:false,is_active:true})
    setSaving(false)
    if(error){setError(error.message);return}
    router.push("/admin/products")
  }

  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">PRODUCTS / NEW</p><h1 style={{margin:"4px 0 0"}}>Add product</h1></div><a className="btn-white" href="/admin/products">Back</a></div><form onSubmit={submit} className="panel form" style={{padding:24,maxWidth:820}}><div className="split"><div className="field"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required /></div><div className="field"><label>Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} required /></div></div><div className="field"><label>Description</label><textarea rows={5} value={description} onChange={e=>setDescription(e.target.value)} /></div><div className="split"><div className="field"><label>Price DA</label><input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} required /></div><div className="field"><label>Stock</label><input type="number" min="0" value={stock} onChange={e=>setStock(e.target.value)} required /></div></div><div className="split"><div className="field"><label>Colors</label><input value={colors} onChange={e=>setColors(e.target.value)} /></div><div className="field"><label>Sizes</label><input value={sizes} onChange={e=>setSizes(e.target.value)} /></div></div><div className="field"><label>Badge</label><input value={badge} onChange={e=>setBadge(e.target.value)} /></div>{error&&<p className="error">{error}</p>}<button className="btn-black" disabled={saving}>{saving?"Saving…":"Create product"}</button></form></div></main>
}
