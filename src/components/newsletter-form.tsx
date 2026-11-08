"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return <><form onSubmit={(event) => { event.preventDefault(); setMessage(email.trim() ? "به جمع کتاب‌خوان‌های کتابینو خوش آمدی!" : "لطفاً ایمیل را وارد کن."); }}><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setMessage(""); }} placeholder="ایمیل تو" aria-label="ایمیل" /><button type="submit">عضویت</button></form><small>{message || "همراه خبرهای تازه کتابینو باش."}</small></>;
}
