import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, phone, email, wilaya, commune, address, delivery_method, items, notes } = body ?? {}

    if (!customer_name || !phone || !wilaya || !commune || !delivery_method || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order information.' }, { status: 400 })
    }

    const supabase = await createClient()
    const productIds = items.map((item: { product_id: string }) => item.product_id)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,name,price,stock,is_active,colors,sizes')
      .in('id', productIds)

    if (productsError) return NextResponse.json({ error: productsError.message }, { status: 500 })

    const productMap = new Map((products ?? []).map((p) => [p.id, p]))
    let subtotal = 0
    const orderItems = []

    for (const item of items as Array<{ product_id: string; quantity: number; color?: string; size?: string }>) {
      const product = productMap.get(item.product_id)
      const quantity = Number(item.quantity)
      if (!product || !product.is_active || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ error: 'Invalid product or quantity.' }, { status: 400 })
      }
      if (quantity > product.stock) {
        return NextResponse.json({ error: `${product.name} is not available in that quantity.` }, { status: 409 })
      }
      if (item.color && Array.isArray(product.colors) && !product.colors.includes(item.color)) {
        return NextResponse.json({ error: `Invalid color for ${product.name}.` }, { status: 400 })
      }
      if (item.size && Array.isArray(product.sizes) && !product.sizes.includes(item.size)) {
        return NextResponse.json({ error: `Invalid size for ${product.name}.` }, { status: 400 })
      }
      subtotal += product.price * quantity
      orderItems.push({ product_id: product.id, product_name: product.name, quantity, unit_price: product.price, color: item.color ?? null, size: item.size ?? null })
    }

    const { data: rate, error: rateError } = await supabase
      .from('delivery_rates')
      .select('home_price,stop_desk_price')
      .eq('wilaya', wilaya)
      .maybeSingle()

    if (rateError) return NextResponse.json({ error: rateError.message }, { status: 500 })
    if (!rate) return NextResponse.json({ error: 'Delivery price is not configured for this Wilaya yet.' }, { status: 400 })

    const delivery_price = delivery_method === 'home' ? rate.home_price : rate.stop_desk_price
    const total = subtotal + delivery_price

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ customer_name, phone, email: email || null, wilaya, commune, address: address || null, delivery_method, delivery_price, subtotal, total, status: 'new', notes: notes || null })
      .select('id,order_number,total,status')
      .single()

    if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems.map((item) => ({ ...item, order_id: order.id })))
    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
