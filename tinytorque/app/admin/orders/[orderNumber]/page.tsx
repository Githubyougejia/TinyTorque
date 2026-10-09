import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import styles from "../admin.module.css";

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

async function updateStatus(orderId: string, formData: FormData) {
  "use server";
  await requireAdmin();
  const status = String(formData.get("status") || "pending");
  if (!statuses.includes(status as typeof statuses[number])) return;
  const admin = createAdminClient();
  await admin.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  redirect("/admin/orders");
}

export default async function AdminOrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  await requireAdmin();
  const { orderNumber } = await params;
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
  if (!order) notFound();
  const { data: items } = await admin.from("order_items").select("product_name, quantity, unit_price").eq("order_id", order.id);
  return <main className={styles.page}><header className={styles.header}><Link className={styles.back} href="/admin/orders">← ALL ORDERS</Link><Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link><span className={styles.label}>ADMIN / ORDER</span></header><section className={styles.main}><h1 className={styles.title}>{order.order_number}<br /><span>DETAILS.</span></h1><div className={styles.table}><div className={styles.row}><span>CUSTOMER</span><span>{order.contact_email}<br />{order.shipping_name}</span><span>ADDRESS</span><span>{order.shipping_address_1}<br />{order.shipping_city} {order.shipping_postcode}</span><span /></div><div className={styles.row}><span>ITEMS</span><span>{items?.map((item) => <span key={item.product_name}>{item.product_name} × {item.quantity}<br /></span>)}</span><span>TOTAL</span><span>${Number(order.total).toFixed(2)}</span><span /></div></div><form className={styles.toolbar} action={updateStatus.bind(null, order.id)}><label className={styles.label} htmlFor="status">UPDATE STATUS</label><select id="status" name="status" defaultValue={order.status}><option value="pending">Pending</option><option value="paid">Paid</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="refunded">Refunded</option></select><button type="submit">SAVE STATUS ↗</button></form></section></main>;
}
