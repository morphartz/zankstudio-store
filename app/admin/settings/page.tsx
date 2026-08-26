import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from("store_settings").select("brand_name,phone,instagram,locations,announcement_text,announcement_enabled").eq("id",true).single()
  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">SETTINGS</p><h1 style={{margin:"4px 0 0"}}>Store settings</h1></div></div><div className="panel form" style={{padding:24,maxWidth:820}}><div className="field"><label>Brand</label><input value={settings?.brand_name ?? "ZANK STUDIO"} readOnly /></div><div className="split"><div className="field"><label>Phone / WhatsApp</label><input value={settings?.phone ?? "0798460604"} readOnly /></div><div className="field"><label>Instagram</label><input value={settings?.instagram ?? "zankstudio"} readOnly /></div></div><div className="field"><label>Locations</label><input value={settings?.locations ?? "Algiers / Oran"} readOnly /></div><div className="field"><label>Announcement</label><textarea rows={4} value={settings?.announcement_text ?? "NEW DROP • PERSONALIZED TEES • COD AVAILABLE • DELIVERY ACROSS ALGERIA"} readOnly /></div><p className="muted">Editing controls will be enabled once the live admin mutation actions are connected.</p></div></div></main>
}
