'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const ADMIN = 'a.g.b.morphzy@gmail.com'

async function requireAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (data?.claims?.email !== ADMIN) redirect('/admin/login')
  return supabase
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  if (id) await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products'); revalidatePath('/')
}

export async function updateProduct(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const price = Number(formData.get('price'))
  const stock = Number(formData.get('stock'))
  const colors = String(formData.get('colors') || '').split(',').map(s=>s.trim()).filter(Boolean)
  const sizes = String(formData.get('sizes') || '').split(',').map(s=>s.trim()).filter(Boolean)
  const badge = String(formData.get('badge') || '').trim() || null
  const is_active = formData.get('is_active') === 'on'
  if (!id || !name || !slug || !Number.isFinite(price) || !Number.isFinite(stock)) return
  await supabase.from('products').update({name,slug,price,stock,colors,sizes,badge,is_active}).eq('id', id)
  revalidatePath('/admin/products'); revalidatePath('/'); redirect('/admin/products')
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  const status = String(formData.get('status') || '')
  const allowed = ['new','confirmed','preparing','shipped','delivered','cancelled']
  if (id && allowed.includes(status)) await supabase.from('orders').update({status}).eq('id', id)
  revalidatePath('/admin/orders')
}

export async function updateSettings(formData: FormData) {
  const supabase = await requireAdmin()
  await supabase.from('store_settings').update({
    brand_name: String(formData.get('brand_name') || 'ZANK STUDIO'),
    phone: String(formData.get('phone') || '0798460604'),
    instagram: String(formData.get('instagram') || 'zankstudio'),
    locations: String(formData.get('locations') || 'Algiers / Oran'),
    announcement_text: String(formData.get('announcement_text') || ''),
    announcement_enabled: formData.get('announcement_enabled') === 'on',
  }).eq('id', true)
  revalidatePath('/'); revalidatePath('/admin/settings')
}

export async function updateDelivery(formData: FormData) {
  const supabase = await requireAdmin()
  const id = String(formData.get('id') || '')
  const home_price = Number(formData.get('home_price'))
  const stop_desk_price = Number(formData.get('stop_desk_price'))
  if (id && Number.isFinite(home_price) && Number.isFinite(stop_desk_price)) await supabase.from('delivery_rates').update({home_price,stop_desk_price}).eq('id',id)
  revalidatePath('/admin/delivery')
}
