import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: products, error: productsError } = await supabase.from('products').select('id,name,price,stock,is_active').limit(1)
  if (productsError) return NextResponse.json({ ok: false, error: productsError.message }, { status: 500 })
  const { data: rates, error: ratesError } = await supabase.from('delivery_rates').select('wilaya,home_price,stop_desk_price').limit(1)
  if (ratesError) return NextResponse.json({ ok: false, error: ratesError.message }, { status: 500 })
  return NextResponse.json({ ok: true, products, rates })
}
