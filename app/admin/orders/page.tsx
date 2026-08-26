import { createClient } from "@/lib/supabase/server"

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase.from("orders").select("order_number,customer_name,phone,wilaya,delivery_method,total,status,created_at").order("created_at", { ascending: false })
  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">ORDERS</p><h1 style={{margin:"4px 0 0"}}>Customer orders</h1></div></div><div className="panel" style={{padding:10,overflow:"auto"}}><table className="table"><thead><tr><th>#</th><th>Customer</th><th>Phone</th><th>Wilaya</th><th>Delivery</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders?.map((o)=><tr key={o.order_number}><td>#{o.order_number}</td><td>{o.customer_name}</td><td>{o.phone}</td><td>{o.wilaya}</td><td>{o.delivery_method === "home" ? "Home" : "Stop desk"}</td><td>{o.total.toLocaleString("fr-DZ")} DA</td><td><span className="status">{o.status.toUpperCase()}</span></td></tr>)}</tbody></table></div></div></main>
}
