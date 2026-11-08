"use client";

import { useState } from "react";
import { Check, Heart, ShoppingBag, BookOpenCheck } from "lucide-react";
import { useStore } from "@/components/store-provider";
import type { Book } from "@/data/books";

export function BookActions({ bookId, external = false, book }: { bookId: string; external?: boolean; book?: Book }) {
  const { favorites, toggleFavorite, addToCart, cart, cacheBook, buyBook, library } = useStore();
  const [message, setMessage] = useState("");
  const inCart = cart.includes(bookId);
  return <div className="detail-actions"><button className="button button-dark" onClick={() => { if (external && book) cacheBook(book); buyBook(bookId); setMessage("خرید انجام شد و کتاب به کتابخانه اضافه شد"); }}><BookOpenCheck size={17} />{library.includes(bookId) || message.startsWith("خرید") ? "خرید انجام شد" : "خرید کتاب"}</button><button className="button button-outline" onClick={() => { if (external && book) cacheBook(book); addToCart(bookId); setMessage("کتاب به سبد خرید اضافه شد"); }}><ShoppingBag size={17} />{inCart ? "در سبد خرید" : "افزودن به سبد"}</button><button className={`button button-outline${favorites.includes(bookId) ? " saved" : ""}`} onClick={() => { if (external && book) cacheBook(book); toggleFavorite(bookId); setMessage(favorites.includes(bookId) ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد"); }}><Heart size={17} fill={favorites.includes(bookId) ? "currentColor" : "none"} />{favorites.includes(bookId) ? "ذخیره‌شده" : "علاقه‌مندی"}</button>{message && <span className="inline-success"><Check size={14} /> {message}</span>}</div>;
}
