import { createClient } from "@/lib/supabase/server"

export default async function DeliveryPage() {
  const supabase = await createClient()
  const { data: rates } = await supabase.from("delivery_rates").select("wilaya,home_price,stop_desk_price").order("wilaya")
  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">DELIVERY</p><h1 style={{margin:"4px 0 0"}}>DHD rates</h1></div></div><div className="panel" style={{padding:10,overflow:"auto"}}><table className="table"><thead><tr><th>Wilaya</th><th>Home</th><th>Stop desk</th></tr></thead><tbody>{rates?.map((r)=><tr key={r.wilaya}><td>{r.wilaya}</td><td>{r.home_price.toLocaleString("fr-DZ")} DA</td><td>{r.stop_desk_price.toLocaleString("fr-DZ")} DA</td></tr>)}</tbody></table>{(!rates || rates.length===0)&&<div className="empty">DHD tariffs will appear here after import.</div>}</div></div></main>
}
