"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

type AuthFormProps = { mode: "sign-in" | "sign-up" };

export default function AuthForm({ mode }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const supabase = createClient();

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) setError(signUpError.message);
      else if (!data.session) setMessage("Check your email to confirm your Tiny Torque account.");
      else router.push("/account");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
      else router.push("/account");
    }

    setPending(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isSignUp && <><label htmlFor="name">Name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required placeholder="YOUR NAME" /><label htmlFor="phone">Phone</label><input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" required placeholder="YOUR PHONE NUMBER" /></>}
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="YOU@EMAIL.COM" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} minLength={6} required placeholder="••••••••" />
      {error && <p className={styles.error} role="alert">{error}</p>}
      {message && <p className={styles.message} role="status">{message}</p>}
      <button className={styles.submit} type="submit" disabled={pending}>{pending ? "PLEASE WAIT…" : isSignUp ? "CREATE ACCOUNT ↗" : "SIGN IN ↗"}</button>
      <p className={styles.switch}>{isSignUp ? "Already have an account?" : "New to Tiny Torque?"} <Link href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}>{isSignUp ? "Sign in" : "Create one"}</Link></p>
    </form>
  );
}
