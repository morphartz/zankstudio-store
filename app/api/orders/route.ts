import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_ITEMS = 20

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, phone, email, wilaya, commune, address, delivery_method, items, notes } = body ?? {}

    if (!customer_name || !phone || !wilaya || !commune || !['home', 'stop_desk'].includes(delivery_method) || !Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
      return NextResponse.json({ error: 'Missing or invalid order information.' }, { status: 400 })
    }

    const supabase = await createClient()
    const productIds = Array.from(new Set(items.map((item: { product_id?: string }) => item.product_id).filter(Boolean)))
    if (!productIds.length) return NextResponse.json({ error: 'No valid products were supplied.' }, { status: 400 })

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,name,price,stock,is_active,colors,sizes')
      .in('id', productIds)

    if (productsError) return NextResponse.json({ error: 'Unable to load products.' }, { status: 500 })

    const productMap = new Map((products ?? []).map((p) => [p.id, p]))
    let subtotal = 0
    const orderItems: Array<Record<string, unknown>> = []

    for (const raw of items as Array<{ product_id: string; quantity: number; color?: string; size?: string }>) {
      const product = productMap.get(raw.product_id)
      const quantity = Number(raw.quantity)
      if (!product || !product.is_active || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ error: 'Invalid product or quantity.' }, { status: 400 })
      }
      if (quantity > product.stock) {
        return NextResponse.json({ error: `${product.name} is not available in that quantity.` }, { status: 409 })
      }
      if (raw.color && Array.isArray(product.colors) && !product.colors.includes(raw.color)) {
        return NextResponse.json({ error: `Invalid color for ${product.name}.` }, { status: 400 })
      }
      if (raw.size && Array.isArray(product.sizes) && !product.sizes.includes(raw.size)) {
        return NextResponse.json({ error: `Invalid size for ${product.name}.` }, { status: 400 })
      }

      subtotal += product.price * quantity
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: product.price,
        color: raw.color ?? null,
        size: raw.size ?? null,
      })
    }

    const { data: rate, error: rateError } = await supabase
      .from('delivery_rates')
      .select('home_price,stop_desk_price')
      .eq('wilaya', wilaya)
      .maybeSingle()

    if (rateError) return NextResponse.json({ error: 'Unable to load delivery pricing.' }, { status: 500 })
    if (!rate) return NextResponse.json({ error: 'Delivery price is not configured for this Wilaya yet.' }, { status: 400 })

    const delivery_price = delivery_method === 'home' ? rate.home_price : rate.stop_desk_price
    const total = subtotal + delivery_price

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: String(customer_name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        wilaya: String(wilaya).trim(),
        commune: String(commune).trim(),
        address: address ? String(address).trim() : null,
        delivery_method,
        delivery_price,
        subtotal,
        total,
        status: 'new',
        notes: notes ? String(notes).trim() : null,
      })
      .select('id,order_number,total,status')
      .single()

    if (orderError || !order) return NextResponse.json({ error: 'Unable to create order.' }, { status: 500 })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map((item) => ({ ...item, order_id: order.id })))

    if (itemsError) {
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Unable to save order items.' }, { status: 500 })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
