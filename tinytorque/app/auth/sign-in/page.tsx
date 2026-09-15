import Link from "next/link";
import AuthForm from "../AuthForm";
import styles from "../auth.module.css";

export default function SignInPage() {
  return <main className={styles.page}><header className={styles.top}><Link className={styles.back} href="/">← BACK TO SHOP</Link><Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link><span className={styles.cart}>ACCOUNT</span></header><section className={styles.shell}><div><p className={styles.kicker}>TINY TORQUE / WELCOME BACK</p><h1 className={styles.title}>GOOD TO<br /><span>SEE YOU.</span></h1><p className={styles.intro}>Sign in to see your orders, track deliveries, and keep your favourite upgrades in one place.</p></div><AuthForm mode="sign-in" /></section><footer className={styles.footer}><span>CAR CULTURE, MADE USEFUL.</span><span>MELBOURNE, AUSTRALIA · © 2026</span></footer></main>;
}
