import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditProductForm from './edit-form'

export default async function EditProduct({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single()
  if (!product) notFound()
  return <main className="admin-page"><div className="admin-main"><div className="admin-top"><div><p className="muted">PRODUCTS / EDIT</p><h1 style={{margin:'4px 0 0'}}>Edit product</h1></div><a className="btn-white" href="/admin/products">Back</a></div><EditProductForm product={product} /></div></main>
}
