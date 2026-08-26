import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()
  const [{ count: products }, { count: orders }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ])

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="logo">ZANK STUDIO</div>
          <p className="muted">Store control</p>
          <nav>
            <Link className="active" href="/admin">Dashboard</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/admin/delivery">Delivery</Link>
            <Link href="/admin/settings">Settings</Link>
          </nav>
        </aside>
        <section className="admin-main">
          <div className="admin-top"><div><p className="muted">ZANK STUDIO</p><h1 style={{margin:"4px 0 0"}}>Dashboard</h1></div><a className="btn-white" href="/">View store</a></div>
          <div className="stats">
            <div className="stat"><div className="label">PRODUCTS</div><div className="value">{products ?? 0}</div></div>
            <div className="stat"><div className="label">ORDERS</div><div className="value">{orders ?? 0}</div></div>
            <div className="stat"><div className="label">COD</div><div className="value">ON</div></div>
            <div className="stat"><div className="label">DELIVERY</div><div className="value">DHD</div></div>
          </div>
          <div className="panel" style={{padding:24}}>
            <h2 style={{marginTop:0}}>Store controls</h2>
            <div className="split">
              <Link className="btn-white" href="/admin/products">Manage products</Link>
              <Link className="btn-white" href="/admin/orders">Manage orders</Link>
              <Link className="btn-white" href="/admin/delivery">Manage DHD prices</Link>
              <Link className="btn-white" href="/admin/settings">Store settings</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
