import { createClient } from '@/lib/supabase/server'
import { updateSettings } from '../actions'

export default async function SettingsPage(){
 const supabase=await createClient()
 const {data:s}=await supabase.from('store_settings').select('brand_name,phone,instagram,locations,announcement_text,announcement_enabled').eq('id',true).single()
 return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">SETTINGS</p><h1 style={{margin:'4px 0 0'}}>Store settings</h1></div></div><form action={updateSettings} className="panel form" style={{padding:24,maxWidth:820}}><div className="field"><label>Brand</label><input name="brand_name" defaultValue={s?.brand_name||'ZANK STUDIO'}/></div><div className="split"><div className="field"><label>Phone / WhatsApp</label><input name="phone" defaultValue={s?.phone||'0798460604'}/></div><div className="field"><label>Instagram</label><input name="instagram" defaultValue={s?.instagram||'zankstudio'}/></div></div><div className="field"><label>Locations</label><input name="locations" defaultValue={s?.locations||'Algiers / Oran'}/></div><div className="field"><label>Announcement bar</label><textarea name="announcement_text" rows={4} defaultValue={s?.announcement_text||''}/></div><label style={{display:'flex',gap:8,alignItems:'center',fontSize:12}}><input type="checkbox" name="announcement_enabled" defaultChecked={s?.announcement_enabled}/> Show announcement bar</label><button className="btn-black">Save settings</button></form></div></main>
}
