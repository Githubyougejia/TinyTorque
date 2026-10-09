import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import styles from "../../../auth/auth.module.css";
import orderStyles from "./order.module.css";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "long" }).format(new Date(value));
}

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");
  const { orderNumber } = await params;
  const { data: order } = await supabase.from("orders").select("*").eq("order_number", orderNumber).eq("user_id", user.id).maybeSingle();
  if (!order) notFound();
  const { data: items } = await supabase.from("order_items").select("product_name, quantity, unit_price").eq("order_id", order.id);

  return <main className={styles.page}><header className={styles.top}><Link className={styles.back} href="/account">← YOUR ACCOUNT</Link><Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link><form action="/auth/sign-out" method="post"><button className={styles.cart} type="submit">SIGN OUT</button></form></header><section className={orderStyles.main}><p className={styles.kicker}>TINY TORQUE / ORDER TRACKING</p><h1 className={styles.title}>{order.order_number}<br /><span>{order.status.toUpperCase()}.</span></h1><p className={orderStyles.date}>Placed {formatDate(order.created_at)}</p><div className={orderStyles.grid}><section className={orderStyles.card}><p className={orderStyles.label}>ITEMS</p>{items?.map((item) => <div className={orderStyles.item} key={item.product_name}><span>{item.product_name} × {item.quantity}</span><strong>${Number(item.unit_price).toFixed(2)}</strong></div>)}<div className={orderStyles.total}><span>TOTAL</span><strong>${Number(order.total).toFixed(2)}</strong></div></section><section className={orderStyles.card}><p className={orderStyles.label}>SHIPPING TO</p><p className={orderStyles.address}>{order.shipping_name}<br />{order.shipping_address_1}<br />{order.shipping_address_2 && <>{order.shipping_address_2}<br /></>}{order.shipping_city} {order.shipping_state} {order.shipping_postcode}<br />{order.shipping_country}</p></section></div><Link className={orderStyles.backLink} href="/account">← BACK TO ACCOUNT</Link></section></main>;
}
