"use client";

import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { books } from "@/data/books";
import { BookCover } from "@/components/book-cover";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";

export function CartView() {
  const { cart, removeFromCart, externalBooks, buyBook, clearCart } = useStore();
  const [purchased, setPurchased] = useState(false);
  const selected = [...books, ...externalBooks].filter((book, index, all) => cart.includes(book.id) && all.findIndex((item) => item.id === book.id) === index);
  const total = selected.reduce((sum, book) => sum + book.price, 0);
  if (purchased) return <div className="empty-state"><span>✓</span><h3>خرید انجام شد!</h3><p>همه کتاب‌ها با موفقیت به کتابخانه‌ات اضافه شدند.</p><Link href="/library" className="button button-dark">رفتن به کتابخانه <ArrowLeft size={16} /></Link></div>;
  if (!selected.length) return <div className="empty-state"><span><ShoppingBag /></span><h3>سبد خریدت هنوز خالی است</h3><p>از میان کتاب‌ها چیزی انتخاب کن تا اینجا منتظرت باشد.</p><Link href="/explore" className="button button-dark">رفتن به فروشگاه <ArrowLeft size={16} /></Link></div>;
  return <div className="cart-layout"><div className="cart-items">{selected.map((book) => <article className="cart-item" key={book.id}><Link href={`/books/${book.id}`}><BookCover book={book} /></Link><div className="cart-item-info"><Link href={`/books/${book.id}`}><b>{book.title}</b></Link><span>{book.author}</span><small>نسخه الکترونیکی</small></div><strong>{book.price.toLocaleString("fa-IR")} تومان</strong><button onClick={() => removeFromCart(book.id)} aria-label="حذف از سبد"><Trash2 size={17} /></button></article>)}</div><aside className="cart-summary"><h2>خلاصه سفارش</h2><div><span>تعداد کتاب‌ها</span><b>{selected.length.toLocaleString("fa-IR")}</b></div><div><span>جمع سفارش</span><b>{total.toLocaleString("fa-IR")} تومان</b></div><div className="cart-total"><span>مجموع</span><strong>{total.toLocaleString("fa-IR")} تومان</strong></div><button className="button button-dark" onClick={() => { selected.forEach((book) => buyBook(book.id)); clearCart(); setPurchased(true); }}>خرید همه کتاب‌ها <ArrowLeft size={17} /></button></aside></div>;
}
