'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Product = { id:string; name:string; price:number; badge:string|null; description:string; colors:string[]; sizes:string[]; image_urls:string[] }

export default function ProductPage({params}:{params:{id:string}}){
  const [product,setProduct]=useState<Product|null>(null)
  const [size,setSize]=useState('')
  const [color,setColor]=useState('')
  const [note,setNote]=useState('')
  const [added,setAdded]=useState(false)
  useEffect(()=>{ const supabase=createClient(); supabase.from('products').select('id,name,price,badge,description,colors,sizes,image_urls').eq('id',params.id).single().then(({data})=>{if(data){setProduct(data);setSize(data.sizes?.[0]||'');setColor(data.colors?.[0]||'')}}) },[params.id])
  if(!product) return <main><div className="container" style={{padding:'120px 0'}}>Loading…</div></main>
  function add(){ const cart=JSON.parse(localStorage.getItem('zank-cart')||'[]'); const id=`${product.id}-${color}-${size}-${Date.now()}`; cart.push({id,product_id:product.id,name:product.name,price:product.price,color,size,quantity:1,image:product.image_urls?.[0],note}); localStorage.setItem('zank-cart',JSON.stringify(cart)); setAdded(true) }
  return <main><header className="header"><div className="container nav"><Link href="/" className="logo">ZANK STUDIO</Link><Link href="/cart" className="iconbtn"><ShoppingBag size={18}/></Link></div></header><section className="section"><div className="container"><Link href="/" className="muted" style={{display:'inline-flex',gap:7,alignItems:'center'}}><ArrowLeft size={14}/> BACK</Link><div className="checkout" style={{paddingTop:25}}><div className="product-image" style={{borderRadius:22,minHeight:540,backgroundImage:product.image_urls?.[0]?`url(${product.image_urls[0]})`:undefined,backgroundSize:'cover',backgroundPosition:'center'}}><span className="pill" style={{position:'absolute',top:18,left:18,zIndex:2}}>{product.badge||'PERSONALIZED'}</span></div><div><p className="muted">PERSONALIZED / TEE</p><h1 style={{fontSize:'clamp(42px,6vw,75px)',lineHeight:.9,letterSpacing:'-.07em',margin:'8px 0 18px'}}>{product.name}</h1><div className="price" style={{fontSize:22}}>{product.price.toLocaleString('fr-DZ')} DA</div><p className="muted" style={{lineHeight:1.7,marginTop:20}}>{product.description}</p><div className="form" style={{marginTop:25}}><div className="field"><label>Size</label><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{product.sizes.map(v=><button type="button" key={v} className={size===v?'btn-black':'btn-white'} onClick={()=>setSize(v)}>{v}</button>)}</div></div><div className="field"><label>Color</label><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{product.colors.map(v=><button type="button" key={v} className={color===v?'btn-black':'btn-white'} onClick={()=>setColor(v)}>{v}</button>)}</div></div><div className="field"><label>Personalisation notes</label><textarea value={note} onChange={e=>setNote(e.target.value)} rows={4} placeholder="Optional note about your order…" /></div><button className="btn-black" type="button" onClick={add}>{added?'ADDED TO BAG':'ADD TO BAG'}</button>{added&&<Link className="btn-white" href="/cart">VIEW BAG</Link>}</div></div></div></div></section></main>
}
