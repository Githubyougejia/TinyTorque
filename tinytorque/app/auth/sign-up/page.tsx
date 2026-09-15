import Link from "next/link";
import AuthForm from "../AuthForm";
import styles from "../auth.module.css";

export default function SignUpPage() {
  return <main className={styles.page}><header className={styles.top}><Link className={styles.back} href="/">← BACK TO SHOP</Link><Link className={styles.logo} href="/">TINY<br /><em>TORQUE</em></Link><span className={styles.cart}>ACCOUNT</span></header><section className={styles.shell}><div><p className={styles.kicker}>TINY TORQUE / JOIN THE CLUB</p><h1 className={styles.title}>MAKE IT<br /><span>YOURS.</span></h1><p className={styles.intro}>Create an account to keep your order history close and make your next garage upgrade quicker.</p></div><AuthForm mode="sign-up" /></section><footer className={styles.footer}><span>CAR CULTURE, MADE USEFUL.</span><span>MELBOURNE, AUSTRALIA · © 2026</span></footer></main>;
}
