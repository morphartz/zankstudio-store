'use client'

import Link from 'next/link'
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type CartItem = { id:string; name:string; price:number; color:string; size:string; quantity:number; image?:string; note?:string }

export default function CartPage(){
  const [items,setItems]=useState<CartItem[]>([])
  useEffect(()=>{ try{ setItems(JSON.parse(localStorage.getItem('zank-cart')||'[]')) }catch{} },[])
  useEffect(()=>{ localStorage.setItem('zank-cart',JSON.stringify(items)) },[items])
  const subtotal=useMemo(()=>items.reduce((s,i)=>s+i.price*i.quantity,0),[items])
  function change(id:string,delta:number){setItems(xs=>xs.map(i=>i.id===id?{...i,quantity:Math.max(1,i.quantity+delta)}:i))}
  function remove(id:string){setItems(xs=>xs.filter(i=>i.id!==id))}
  return <main><header className="header"><div className="container nav"><Link href="/" className="logo">ZANK STUDIO</Link><span className="muted">CART / {items.reduce((s,i)=>s+i.quantity,0)}</span></div></header><section className="section"><div className="container"><p className="muted">CART</p><h1 style={{fontSize:'clamp(45px,7vw,90px)',letterSpacing:'-.07em',margin:'5px 0 35px'}}>YOUR BAG.</h1>{items.length===0?<div className="empty"><h2 style={{marginTop:0}}>Your bag is empty.</h2><Link className="cta" href="/#shop">SHOP THE DROP <ArrowRight size={14}/></Link></div>:<div className="checkout"><div className="panel" style={{padding:20}}>{items.map(item=><div key={item.id} style={{display:'grid',gridTemplateColumns:'110px 1fr auto',gap:18,alignItems:'center',paddingBottom:18,marginBottom:18,borderBottom:'1px solid #eee'}}><div className="product-image" style={{borderRadius:14,backgroundImage:item.image?`url(${item.image})`:undefined,backgroundSize:'cover',backgroundPosition:'center'}}/><div><strong>{item.name}</strong><p className="muted">{item.color} / {item.size}</p>{item.note&&<p className="muted">{item.note}</p>}<button className="btn-white" onClick={()=>remove(item.id)}><Trash2 size={13}/> Remove</button></div><div style={{textAlign:'right'}}><div className="price">{item.price.toLocaleString('fr-DZ')} DA</div><div style={{display:'flex',gap:5,marginTop:10}}><button className="iconbtn" onClick={()=>change(item.id,-1)}><Minus size={13}/></button><span style={{padding:'12px 7px',fontSize:12}}>{item.quantity}</span><button className="iconbtn" onClick={()=>change(item.id,1)}><Plus size={13}/></button></div></div></div>)}</div><div className="panel summary"><h3 style={{marginTop:0}}>ORDER SUMMARY</h3><div className="summary-row"><span>Subtotal</span><strong>{subtotal.toLocaleString('fr-DZ')} DA</strong></div><div className="summary-row"><span>Delivery</span><span>Calculated at checkout</span></div><Link className="btn-black" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:18}} href="/checkout">CHECKOUT <ArrowRight size={14}/></Link><p className="muted" style={{fontSize:10,marginTop:12}}>Cash on Delivery · DHD Home or Stop Desk</p></div></div>}</div></section></main>
}
