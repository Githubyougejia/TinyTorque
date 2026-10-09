import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import styles from "./admin.module.css";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: orders } = await admin.from("orders").select("id, order_number, contact_email, status, total, shipping_city, created_at").order("created_at", { ascending: false });
  return <main className={styles.page}><header className={styles.header}><Link className={styles.back} href="/">← BACK TO SHOP</Link><Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link><span className={styles.label}>ADMIN / ORDERS</span></header><section className={styles.main}><h1 className={styles.title}>ORDER<br /><span>DESK.</span></h1><div className={styles.toolbar}><p className={styles.label}>ALL ORDERS</p><span className={styles.count}>{orders?.length ?? 0} total</span></div><div className={styles.table}><div className={styles.row + " " + styles.head}><span>Order</span><span>Customer</span><span>Status</span><span>Total</span><span>Open</span></div>{orders && orders.length ? orders.map((order) => <div className={styles.row} key={order.id}><span>{order.order_number}</span><span>{order.contact_email}<br />{order.shipping_city}</span><span className={styles.status}>{order.status}</span><span>${Number(order.total).toFixed(2)}</span><Link href={"/admin/orders/" + order.order_number}>VIEW ↗</Link></div>) : <p className={styles.empty}>No orders yet.</p>}</div></section></main>;
}
