"use client";

import Link from "next/link";
import { ShoppingBag, Instagram, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

const products = [
  { id:"1", name:"CUSTOM TEE 01", price:3500, badge:"NEW", colors:"B / W" },
  { id:"2", name:"CUSTOM TEE 02", price:3800, badge:"EXCLUSIVE", colors:"W / B" },
  { id:"3", name:"SIGNATURE TEE", price:4000, badge:"DROP 01", colors:"B / W" },
  { id:"4", name:"PERSONALIZED OVERSIZE", price:4500, badge:"CUSTOM", colors:"B / W" },
];

export default function Home() {
  const [cartCount] = useState(0);
  return (
    <main>
      <div className="topbar"><div className="marquee"><span>NEW DROP • PERSONALIZED TEES • COD AVAILABLE • DELIVERY ACROSS ALGERIA • @ZANKSTUDIO • </span><span>NEW DROP • PERSONALIZED TEES • COD AVAILABLE • DELIVERY ACROSS ALGERIA • @ZANKSTUDIO • </span></div></div>
      <header className="header"><div className="container nav"><Link href="/" className="logo">ZANK STUDIO</Link><nav className="navlinks"><a href="#shop">SHOP</a><a href="#custom">CUSTOM</a><a href="#delivery">DELIVERY</a></nav><div className="actions"><Link className="iconbtn" href="/cart" aria-label="Cart"><ShoppingBag size={18}/>{cartCount>0 && <sup>{cartCount}</sup>}</Link></div></div></header>
      <section className="hero"><div className="container hero-inner"><span className="kicker">ALGIERS / ORAN · ALGERIA</span><h1>WEAR<br/>YOUR IDEA.</h1><p>Personalized tees made for people who would rather wear something with a point of view than another shirt nobody remembers.</p><a className="cta" href="#shop">SHOP THE DROP <ArrowRight size={15}/></a></div></section>
      <section className="section" id="shop"><div className="container"><div className="section-head"><div><p className="muted">01 / SHOP</p><h2>Latest pieces</h2></div><span className="muted">COD · DHD DELIVERY</span></div><div className="grid">{products.map((p)=><Link href={`/products/${p.id}`} className="card" key={p.id}><div className="product-image"><span className="pill" style={{position:'absolute',top:12,left:12,zIndex:2}}>{p.badge}</span></div><div className="product-copy"><div className="product-name">{p.name}</div><div className="product-meta"><span className="muted">{p.colors}</span><span className="price">{p.price.toLocaleString('fr-DZ')} DA</span></div></div></Link>)}</div></div></section>
      <section className="section" id="custom" style={{background:'#050505',color:'#fff'}}><div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}><div><p style={{fontSize:11,fontWeight:900,letterSpacing:'.14em'}}>02 / YOUR DESIGN</p><h2 style={{fontSize:'clamp(45px,7vw,90px)',margin:'15px 0',letterSpacing:'-.07em'}}>MADE<br/>PERSONAL.</h2></div><div><p style={{color:'#aaa',lineHeight:1.8,fontSize:14}}>Choose your tee, size, color and personalisation. Tell us exactly what belongs on it. Orders are confirmed by phone or WhatsApp before production.</p><a className="cta" style={{background:'#fff',color:'#000'}} href="/customize">CREATE YOUR TEE <ArrowRight size={15}/></a></div></div></section>
      <section className="section" id="delivery"><div className="container"><div className="section-head"><div><p className="muted">03 / DELIVERY</p><h2>Built for Algeria.</h2></div></div><div className="split"><div className="panel" style={{padding:25}}><h3 style={{marginTop:0}}>DHD · HOME</h3><p className="muted" style={{lineHeight:1.7}}>Delivery across Algeria with the price calculated by Wilaya at checkout.</p></div><div className="panel" style={{padding:25}}><h3 style={{marginTop:0}}>DHD · STOP DESK</h3><p className="muted" style={{lineHeight:1.7}}>Choose stop-desk delivery when it suits you better. COD stays available.</p></div></div></div></section>
      <footer className="footer"><div className="container footer-grid"><div><div className="logo">ZANK STUDIO</div><p className="muted">Personalized tees · Algiers / Oran</p></div><div style={{display:'flex',gap:10}}><a className="iconbtn" href="https://instagram.com/zankstudio" aria-label="Instagram"><Instagram size={17}/></a><a className="iconbtn" href="https://wa.me/213798460604" aria-label="WhatsApp"><MessageCircle size={17}/></a></div></div></footer>
    </main>
  );
}
