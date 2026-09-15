import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import styles from "../auth/auth.module.css";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  return <main className={styles.page}><header className={styles.top}><Link className={styles.back} href="/">← BACK TO SHOP</Link><Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link><form action="/auth/sign-out" method="post"><button className={styles.cart} type="submit">SIGN OUT</button></form></header><section className={styles.shell}><div><p className={styles.kicker}>TINY TORQUE / YOUR ACCOUNT</p><h1 className={styles.title}>WELCOME<br /><span>BACK.</span></h1><p className={styles.intro}>Your account is ready. Order history and delivery tracking will appear here as we build the shop.</p></div><div className={styles.form}><label>Email address</label><p>{user.email}</p><label>Account ID</label><p>{user.id}</p><Link className={styles.submit} href="/">CONTINUE SHOPPING ↗</Link></div></section></main>;
}
