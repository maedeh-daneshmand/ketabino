import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
export const metadata: Metadata = { title: "سبد خرید" };
export default function CartPage() { return <section className="container inner-page"><div className="page-overline">کتابینو / سبد خرید</div><div className="page-title-row"><div><span className="eyebrow">انتخاب‌های تو</span><h1>سبد خرید</h1><p>کتاب‌هایی که برای خواندن انتخاب کرده‌ای.</p></div></div><CartView /></section>; }
