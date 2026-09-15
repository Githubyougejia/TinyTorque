"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Product = { id: string; name: string; caption: string; price: number; tone: string; badge?: string };
const products: Product[] = [
  { id: "dashbot", name: "DASH DOT", caption: "mini pixel companion", price: 69, tone: "pink", badge: "NEW DROP" },
  { id: "shift-light", name: "SHIFT SIGNAL", caption: "reactive cabin light", price: 45, tone: "blue", badge: "FAVOURITE" },
  { id: "key-tag", name: "PARK TAG", caption: "reflective key loop", price: 18, tone: "lime" },
  { id: "air-freshener", name: "NIGHT DRIVE", caption: "air freshener / 3 pack", price: 16, tone: "orange" }
];

function PixelFace({ mood = "•‿•" }: { mood?: string }) { return <div className="pixel-face" aria-hidden="true"><span>{mood}</span></div>; }

export default function Home() {
  const router = useRouter();
  const [cart, setCart] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");
  const addToCart = (product: Product) => {
    const nextCart = cart.concat(product);
    setCart(nextCart);
    window.localStorage.setItem("tiny-torque-cart", JSON.stringify(nextCart));
    setNotice(product.name + " is in your cart.");
  };
  const submitSignup = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setNotice("You’re on the Tiny Torque list."); event.currentTarget.reset(); };
  return (
    <main>
      <div className="utility-bar">FREE AUS SHIPPING OVER $75 <span>✦</span> TINY TORQUE IS LIVE <span>✦</span> FREE AUS SHIPPING OVER $75</div>
      <header className="site-header">
        <button className="menu-button" aria-label="Open menu">☰ <span>MENU</span></button>
        <a className="logo" href="#top">TINY<br /><em>TORQUE</em></a>
        <button className="cart-button" onClick={() => cart.length ? router.push("/checkout") : setNotice("Your cart is empty — let’s fix that.")}>CART <span>{cart.length}</span></button>
      </header>
      <nav className="category-nav" aria-label="Categories"><a href="#shop">DASH GOODS</a><a href="#shop">LIGHTS</a><a href="#shop">KEYS & TAGS</a><a href="#shop">GARAGE</a><a href="#story">THE STORY</a></nav>
      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">DRIVER-OWNED GOODS FOR PEOPLE WHO LOVE THE LITTLE THINGS</p><h1>MAKE YOUR<br /><span>CAR HAPPY.</span></h1><p className="hero-detail">Tiny upgrades for the dash, the drive, and every car park photo in between.</p><a className="burst-button" href="#shop">SHOP THE DROP <b>↘</b></a></div>
        <div className="hero-art"><div className="sun">TINY<br />TORQUE<br /><span>EST. 2025</span></div><div className="road"></div><div className="car-body"><div className="windscreen"><PixelFace mood="^‿^" /></div><div className="headlight left"></div><div className="headlight right"></div><div className="bumper"></div></div><p className="art-note">THE WORLD’S FRIENDLIEST<br />CAR ACCESSORIES ★</p></div>
      </section>
      <div className="ticker"><span>DRIVE NICE ★ PARK NICE ★ MAKE IT YOURS ★ DRIVE NICE ★ PARK NICE ★ MAKE IT YOURS ★</span></div>
      <section className="drop-section" id="shop">
        <div className="section-title"><p>01 / THE LATEST</p><h2>FRESH<br /><span>FROM THE GARAGE.</span></h2><a href="#shop">ALL PRODUCTS ↗</a></div>
        <div className="product-grid">{products.map((product) => <article className={"product-card " + product.tone} key={product.id}>{product.badge && <p className="product-badge">{product.badge}</p>}<div className="product-art">{product.id === "dashbot" && <div className="dashbot"><PixelFace /><i></i><b></b></div>}{product.id === "shift-light" && <div className="signal"><span></span><span></span><span></span><span></span></div>}{product.id === "key-tag" && <div className="tag">TT<br /><small>NO. 01</small></div>}{product.id === "air-freshener" && <div className="freshener">NIGHT<br />DRIVE<br /><small>◒</small></div>}</div><div className="product-meta"><div><h3>{product.name}</h3><p>{product.caption}</p></div><strong>{"$" + product.price}</strong></div><button onClick={() => addToCart(product)}>ADD TO CART <span>+</span></button></article>)}</div>
      </section>
      <section className="story" id="story"><div className="story-car"><div className="story-wheel"></div><div className="story-window">♡</div></div><div className="story-copy"><p className="eyebrow">TINY TORQUE IS FOR</p><h2>PEOPLE WHO<br />LOOK BACK AT<br /><span>THEIR CAR.</span></h2><p>We make playful, useful objects for drivers who believe a little personality belongs in every cabin.</p><a className="line-link" href="#shop">MEET TINY TORQUE ↗</a></div></section>
      <section className="newsletter"><p>GET ON THE LIST</p><h2>NEW DROPS.<br />NO BORING EMAILS.</h2><form onSubmit={submitSignup}><input type="email" placeholder="YOUR EMAIL ADDRESS" required /><button type="submit">SIGN ME UP ↗</button></form></section>
      <footer><a className="logo" href="#top">TINY<br /><em>TORQUE</em></a><p>CAR CULTURE, MADE USEFUL.<br />MELBOURNE, AUSTRALIA.</p><div><a href="#shop">SHOP</a><a href="#story">ABOUT</a><a href="mailto:hello@tinytorque.com">CONTACT</a></div><small>© 2026 TINY TORQUE</small></footer>
      <output className={notice ? "toast show" : "toast"} aria-live="polite">{notice}</output>
    </main>
  );
}
