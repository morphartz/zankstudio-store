'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function EditProductForm({ product }: { product: any }) {
  const supabase = createClient()
  const [files, setFiles] = useState<File[]>([])
  const [imageUrl, setImageUrl] = useState(product.image_urls?.[0] ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function upload() {
    if (!files.length) return imageUrl ? [imageUrl] : []
    const urls: string[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`)
      if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} is larger than 8 MB.`)
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type })
      if (uploadError) throw new Error(uploadError.message)
      urls.push(supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl)
    }
    return urls
  }

  async function save() {
    setSaving(true); setError('')
    try {
      const form = document.querySelector('form') as HTMLFormElement
      const data = new FormData(form)
      const imageUrls = await upload()
      const payload = {
        name: String(data.get('name') || '').trim(), slug: String(data.get('slug') || '').trim(), description: String(data.get('description') || '').trim(),
        price: Number(data.get('price')), compare_at_price: data.get('compare_at_price') ? Number(data.get('compare_at_price')) : null,
        stock: Number(data.get('stock')), colors: String(data.get('colors') || '').split(',').map(x=>x.trim()).filter(Boolean),
        sizes: String(data.get('sizes') || '').split(',').map(x=>x.trim()).filter(Boolean), badge: String(data.get('badge') || '').trim() || null,
        is_featured: data.get('is_featured') === 'on', is_active: data.get('is_active') === 'on', image_urls: imageUrls,
      }
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', product.id)
      if (updateError) throw new Error(updateError.message)
      window.location.href = '/admin/products'
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save product.')
      setSaving(false)
    }
  }

  return <form className="panel form" style={{padding:24,maxWidth:860}} onSubmit={e=>{e.preventDefault();save()}}>
    <div className="split"><div className="field"><label>Name</label><input name="name" defaultValue={product.name} required /></div><div className="field"><label>Slug</label><input name="slug" defaultValue={product.slug} required /></div></div>
    <div className="field"><label>Description</label><textarea name="description" rows={5} defaultValue={product.description} /></div>
    <div className="split"><div className="field"><label>Price DA</label><input name="price" type="number" min="0" defaultValue={product.price} required /></div><div className="field"><label>Compare-at price DA</label><input name="compare_at_price" type="number" min="0" defaultValue={product.compare_at_price ?? ''} /></div></div>
    <div className="split"><div className="field"><label>Stock</label><input name="stock" type="number" min="0" defaultValue={product.stock} required /></div><div className="field"><label>Replace images</label><input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files || []))} /></div></div>
    {imageUrl && <div className="field"><label>Current image</label><img src={imageUrl} alt="Current product" style={{width:'100%',maxWidth:320,aspectRatio:'1',objectFit:'cover',borderRadius:18}} /></div>}
    <div className="split"><div className="field"><label>Colors</label><input name="colors" defaultValue={(product.colors || []).join(',')} /></div><div className="field"><label>Sizes</label><input name="sizes" defaultValue={(product.sizes || []).join(',')} /></div></div>
    <div className="field"><label>Badge</label><input name="badge" defaultValue={product.badge || ''} /></div>
    <div style={{display:'flex',gap:18,flexWrap:'wrap',fontSize:12}}><label><input type="checkbox" name="is_featured" defaultChecked={product.is_featured} /> Featured</label><label><input type="checkbox" name="is_active" defaultChecked={product.is_active} /> Active</label></div>
    {error&&<p className="error">{error}</p>}<button className="btn-black" disabled={saving}>{saving?'Uploading & saving…':'Save changes'}</button>
  </form>
}
