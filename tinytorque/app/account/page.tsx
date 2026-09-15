import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import styles from "../auth/auth.module.css";

async function updateProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  await supabase.from("profiles").update({
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
  }).eq("id", user.id);

  redirect("/account");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("name, phone").eq("id", user.id).maybeSingle(),
    supabase.from("orders").select("id, order_number, status, total, created_at, shipping_city").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <Link className={styles.back} href="/">← BACK TO SHOP</Link>
        <Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link>
        <form action="/auth/sign-out" method="post"><button className={styles.cart} type="submit">SIGN OUT</button></form>
      </header>
      <section className={styles.accountShell}>
        <div className={styles.accountIntro}>
          <p className={styles.kicker}>TINY TORQUE / YOUR ACCOUNT</p>
          <h1 className={styles.title}>YOUR<br /><span>GARAGE.</span></h1>
          <p className={styles.intro}>Keep your details and order history in one place.</p>
          <p className={styles.accountEmail}>{user.email}</p>
        </div>
        <div className={styles.accountContent}>
          <section className={styles.accountCard}>
            <p className={styles.cardLabel}>YOUR DETAILS</p>
            <form action={updateProfile} className={styles.profileForm}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" defaultValue={profile?.name ?? ""} required />
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""} />
              <button className={styles.submit} type="submit">SAVE DETAILS ↗</button>
            </form>
          </section>
          <section className={styles.accountCard}>
            <p className={styles.cardLabel}>ORDER HISTORY</p>
            {orders && orders.length > 0 ? <div className={styles.orders}>{orders.map((order) => <article className={styles.order} key={order.id}><div><strong>{order.order_number}</strong><span>{formatDate(order.created_at)} · {order.shipping_city}</span></div><div className={styles.orderRight}><strong>${Number(order.total).toFixed(2)}</strong><span className={styles.status}>{order.status}</span></div></article>)}</div> : <p className={styles.empty}>No orders yet. Your next upgrade belongs here.</p>}
          </section>
        </div>
      </section>
    </main>
  );
}
