import { createClient } from '@/lib/supabase/server'
import { deleteProduct } from '../actions'

export default async function AdminProductsPage(){
 const supabase=await createClient()
 const {data:products}=await supabase.from('products').select('id,name,price,stock,is_active,badge').order('created_at',{ascending:false})
 return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">PRODUCTS</p><h1 style={{margin:'4px 0 0'}}>Catalog</h1></div><a className="btn-black" href="/admin/products/new">Add product</a></div><div className="panel" style={{padding:10,overflow:'auto'}}><table className="table"><thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Badge</th><th>Actions</th></tr></thead><tbody>{products?.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.price.toLocaleString('fr-DZ')} DA</td><td>{p.stock}</td><td><span className="status">{p.is_active?'ACTIVE':'HIDDEN'}</span></td><td>{p.badge||'—'}</td><td><div style={{display:'flex',gap:7}}><a className="btn-white" href={`/admin/products/${p.id}`}>Edit</a><form action={deleteProduct}><input type="hidden" name="id" value={p.id}/><button className="btn-white" type="submit">Delete</button></form></div></td></tr>)}</tbody></table></div></div></main>
}
