'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default function NewProductPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name,setName]=useState('')
  const [slug,setSlug]=useState('')
  const [price,setPrice]=useState('3500')
  const [compareAtPrice,setCompareAtPrice]=useState('')
  const [stock,setStock]=useState('10')
  const [description,setDescription]=useState('')
  const [colors,setColors]=useState('BLACK,WHITE')
  const [sizes,setSizes]=useState('S,M,L,XL')
  const [badge,setBadge]=useState('NEW')
  const [featured,setFeatured]=useState(false)
  const [active,setActive]=useState(true)
  const [files,setFiles]=useState<File[]>([])
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')

  async function uploadImages() {
    const urls: string[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`)
      if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} is larger than 8 MB.`)
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type })
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const finalSlug = slug || slugify(name)
      if (!finalSlug) throw new Error('Add a product name.')
      const imageUrls = await uploadImages()
      const { error: insertError } = await supabase.from('products').insert({
        name: name.trim(), slug: finalSlug, price: Number(price), compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock), description: description.trim(), colors: colors.split(',').map(x=>x.trim()).filter(Boolean),
        sizes: sizes.split(',').map(x=>x.trim()).filter(Boolean), badge: badge.trim() || null, image_urls: imageUrls,
        is_featured: featured, is_active: active,
      })
      if (insertError) throw new Error(insertError.message)
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create product.')
      setSaving(false)
    }
  }

  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">PRODUCTS / NEW</p><h1 style={{margin:'4px 0 0'}}>Add product</h1></div><a className="btn-white" href="/admin/products">Back</a></div><form onSubmit={submit} className="panel form" style={{padding:24,maxWidth:860}}>
    <div className="split"><div className="field"><label>Name</label><input value={name} onChange={e=>{setName(e.target.value); if(!slug) setSlug(slugify(e.target.value))}} required /></div><div className="field"><label>Slug</label><input value={slug} onChange={e=>setSlug(e.target.value)} required /></div></div>
    <div className="field"><label>Description</label><textarea rows={5} value={description} onChange={e=>setDescription(e.target.value)} /></div>
    <div className="split"><div className="field"><label>Price DA</label><input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} required /></div><div className="field"><label>Compare-at price DA</label><input type="number" min="0" value={compareAtPrice} onChange={e=>setCompareAtPrice(e.target.value)} /></div></div>
    <div className="split"><div className="field"><label>Stock</label><input type="number" min="0" value={stock} onChange={e=>setStock(e.target.value)} required /></div><div className="field"><label>Product images</label><input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files || []))} /></div></div>
    {files.length>0 && <p className="muted">{files.length} image{files.length===1?'':'s'} selected. They will be uploaded to Supabase Storage.</p>}
    <div className="split"><div className="field"><label>Colors</label><input value={colors} onChange={e=>setColors(e.target.value)} /></div><div className="field"><label>Sizes</label><input value={sizes} onChange={e=>setSizes(e.target.value)} /></div></div>
    <div className="field"><label>Badge</label><input value={badge} onChange={e=>setBadge(e.target.value)} /></div>
    <div style={{display:'flex',gap:18,flexWrap:'wrap',fontSize:12}}><label><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} /> Featured</label><label><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /> Active</label></div>
    {error&&<p className="error">{error}</p>}<button className="btn-black" disabled={saving}>{saving?'Uploading & saving…':'Create product'}</button>
  </form></div></main>
}
