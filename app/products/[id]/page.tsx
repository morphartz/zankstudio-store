"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Upload } from "lucide-react";

const data: Record<string,{name:string;price:number;badge:string}> = {
  "1":{name:"CUSTOM TEE 01",price:3500,badge:"NEW"},
  "2":{name:"CUSTOM TEE 02",price:3800,badge:"EXCLUSIVE"},
  "3":{name:"SIGNATURE TEE",price:4000,badge:"DROP 01"},
  "4":{name:"PERSONALIZED OVERSIZE",price:4500,badge:"CUSTOM"},
};

export default function ProductPage({params}:{params:{id:string}}){
  const product=data[params.id] ?? data["1"];
  const [size,setSize]=useState("M"); const [color,setColor]=useState("Black"); const [text,setText]=useState(""); const [added,setAdded]=useState(false);
  return <main><header className="header"><div className="container nav"><Link href="/" className="logo">ZANK STUDIO</Link><Link href="/cart" className="iconbtn"><ShoppingBag size={18}/></Link></div></header>
  <section className="section"><div className="container"><Link href="/" className="muted" style={{display:'inline-flex',gap:7,alignItems:'center'}}><ArrowLeft size={14}/> BACK</Link><div className="checkout" style={{paddingTop:25}}><div className="product-image" style={{borderRadius:22,minHeight:540}}><span className="pill" style={{position:'absolute',top:18,left:18,zIndex:2}}>{product.badge}</span></div><div><p className="muted">PERSONALIZED / TEE</p><h1 style={{fontSize:'clamp(42px,6vw,75px)',lineHeight:.9,letterSpacing:'-.07em',margin:'8px 0 18px'}}>{product.name}</h1><div className="price" style={{fontSize:22}}>{product.price.toLocaleString('fr-DZ')} DA</div><p className="muted" style={{lineHeight:1.7,marginTop:20}}>Made to order. Select your fit and base color, then add the personalisation details below.</p>
  <div className="form" style={{marginTop:25}}><div className="field"><label>Size</label><div style={{display:'flex',gap:8}}>{['S','M','L','XL','2XL'].map(v=><button key={v} className={size===v?'btn-black':'btn-white'} onClick={()=>setSize(v)}>{v}</button>)}</div></div><div className="field"><label>Color</label><div style={{display:'flex',gap:8}}>{['Black','White'].map(v=><button key={v} className={color===v?'btn-black':'btn-white'} onClick={()=>setColor(v)}>{v}</button>)}</div></div><div className="field"><label>Your text / design notes</label><textarea value={text} onChange={e=>setText(e.target.value)} rows={4} placeholder="Example: ZANK on chest, small type..." /></div><div className="field"><label>Artwork (optional)</label><button className="btn-white" type="button"><Upload size={14} style={{verticalAlign:'middle',marginRight:7}}/> Upload reference</button></div><button className="btn-black" onClick={()=>setAdded(true)}>{added?'ADDED TO CART':'ADD TO CART'}</button></div>
  </div></div></div></section></main>;
}
