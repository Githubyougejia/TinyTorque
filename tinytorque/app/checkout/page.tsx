"use client";

import Link from "next/link";
import { FormEvent, startTransition, useEffect, useState } from "react";
import styles from "./checkout.module.css";

type CartItem = { id: string; name: string; caption: string; price: number; tone: string; badge?: string };

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("tiny-torque-cart");
    if (stored) startTransition(() => setCart(JSON.parse(stored) as CartItem[]));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactEmail: data.get("email"), shippingName: data.get("name"), shippingPhone: data.get("phone"),
        address1: data.get("address1"), address2: data.get("address2"), city: data.get("city"),
        state: data.get("state"), postcode: data.get("postcode"), country: data.get("country"),
        items: cart.map((item) => ({ productId: item.id, quantity: 1 })),
      }),
    });
    const result = await response.json() as { orderNumber?: string; error?: string };
    if (!response.ok) setError(result.error || "We could not create your order.");
    else { setOrderNumber(result.orderNumber || ""); window.localStorage.removeItem("tiny-torque-cart"); setCart([]); }
    setPending(false);
  }

  return <main className={styles.page}><header className={styles.header}><Link className={styles.logo} href="/">TINY<em>TORQUE</em></Link><Link className={styles.back} href="/">← CONTINUE SHOPPING</Link></header>{orderNumber ? <section className={styles.success}><p className={styles.kicker}>ORDER RECEIVED</p><h1>YOU’RE<br /><span>ALL SET.</span></h1><p>Your order number is <strong>{orderNumber}</strong>. We’ll send updates to your email.</p><Link className={styles.button} href="/account">VIEW ACCOUNT ↗</Link></section> : <section className={styles.layout}><div><p className={styles.kicker}>TINY TORQUE / CHECKOUT</p><h1>READY TO<br /><span>ROLL.</span></h1><div className={styles.summary}>{cart.length ? cart.map((item, index) => <div className={styles.item} key={item.id + index}><span>{item.name}</span><strong>${item.price}</strong></div>) : <p>Your cart is empty. <Link href="/#shop">Choose something for the drive.</Link></p>}<div className={styles.total}><span>TOTAL</span><strong>${total}</strong></div></div></div><form className={styles.form} onSubmit={submitOrder}><p className={styles.formTitle}>SHIPPING DETAILS</p><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required placeholder="YOU@EMAIL.COM" /><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="YOUR NAME" /><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required placeholder="YOUR PHONE NUMBER" /><label htmlFor="address1">Address</label><input id="address1" name="address1" required placeholder="STREET ADDRESS" /><input id="address2" name="address2" placeholder="UNIT / APARTMENT (OPTIONAL)" /><div className={styles.row}><input id="city" name="city" required placeholder="SUBURB / CITY" /><input id="state" name="state" placeholder="STATE" /></div><div className={styles.row}><input id="postcode" name="postcode" required placeholder="POSTCODE" /><input id="country" name="country" defaultValue="Australia" required placeholder="COUNTRY" /></div>{error && <p className={styles.error} role="alert">{error}</p>}<button className={styles.button} type="submit" disabled={pending || !cart.length}>{pending ? "CREATING ORDER…" : "PLACE ORDER ↗"}</button><p className={styles.note}>Payment will be added in the next checkout phase. This currently creates a pending order for testing.</p></form></section>}</main>;
}
