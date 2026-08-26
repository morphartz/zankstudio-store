import { createClient } from '@/lib/supabase/server'
import { updateOrderStatus } from '../actions'

const statuses=['new','confirmed','preparing','shipped','delivered','cancelled'] as const

export default async function AdminOrdersPage(){
 const supabase=await createClient()
 const {data:orders}=await supabase.from('orders').select('id,order_number,customer_name,phone,wilaya,delivery_method,total,status,created_at').order('created_at',{ascending:false})
 return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">ORDERS</p><h1 style={{margin:'4px 0 0'}}>Customer orders</h1></div></div><div className="panel" style={{padding:10,overflow:'auto'}}><table className="table"><thead><tr><th>#</th><th>Customer</th><th>Phone</th><th>Wilaya</th><th>Delivery</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders?.map(o=><tr key={o.id}><td>#{o.order_number}</td><td>{o.customer_name}</td><td>{o.phone}</td><td>{o.wilaya}</td><td>{o.delivery_method==='home'?'Home':'Stop desk'}</td><td>{o.total.toLocaleString('fr-DZ')} DA</td><td><form action={updateOrderStatus} style={{display:'flex',gap:6,alignItems:'center'}}><input type="hidden" name="id" value={o.id}/><select name="status" defaultValue={o.status} style={{border:'1px solid #d2d2d7',borderRadius:999,padding:'6px 9px',fontSize:10}}>{statuses.map(s=><option key={s}>{s}</option>)}</select><button className="btn-white" type="submit">Save</button></form></td></tr>)}</tbody></table></div></div></main>
}
