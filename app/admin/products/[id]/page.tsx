import { createClient } from '@/lib/supabase/server'
import { updateProduct } from '../../actions'
import { notFound } from 'next/navigation'

export default async function EditProduct({params}:{params:{id:string}}){
  const supabase=await createClient()
  const {data:p}=await supabase.from('products').select('*').eq('id',params.id).single()
  if(!p) notFound()
  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">PRODUCTS / EDIT</p><h1 style={{margin:'4px 0 0'}}>Edit product</h1></div><a className="btn-white" href="/admin/products">Back</a></div><form action={updateProduct} className="panel form" style={{padding:24,maxWidth:820}}><input type="hidden" name="id" value={p.id}/><div className="split"><div className="field"><label>Name</label><input name="name" defaultValue={p.name} required/></div><div className="field"><label>Slug</label><input name="slug" defaultValue={p.slug} required/></div></div><div className="field"><label>Description</label><textarea name="description" rows={5} defaultValue={p.description}/></div><div className="split"><div className="field"><label>Price DA</label><input name="price" type="number" min="0" defaultValue={p.price} required/></div><div className="field"><label>Stock</label><input name="stock" type="number" min="0" defaultValue={p.stock} required/></div></div><div className="split"><div className="field"><label>Colors</label><input name="colors" defaultValue={(p.colors||[]).join(',')}/></div><div className="field"><label>Sizes</label><input name="sizes" defaultValue={(p.sizes||[]).join(',')}/></div></div><div className="field"><label>Badge</label><input name="badge" defaultValue={p.badge||''}/></div><label style={{display:'flex',gap:8,alignItems:'center',fontSize:12}}><input type="checkbox" name="is_active" defaultChecked={p.is_active}/> Active</label><button className="btn-black">Save changes</button></form></div></main>
}
