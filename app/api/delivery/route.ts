import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const wilaya = new URL(request.url).searchParams.get('wilaya')
  if (!wilaya) return NextResponse.json({ error: 'Wilaya is required.' }, { status: 400 })
  const supabase = await createClient()
  const { data, error } = await supabase.from('delivery_rates').select('wilaya,home_price,stop_desk_price').eq('wilaya', wilaya).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rate: data })
}
