"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import type { Book } from "@/data/books";
import { BookCover } from "@/components/book-cover";
import { useStore } from "@/components/store-provider";

export function BookCard({ book }: { book: Book }) {
  const { favorites, toggleFavorite, addToCart, cacheBook, buyBook, library } = useStore();
  const [bought, setBought] = useState(false);
  const saved = favorites.includes(book.id);
  return (
    <article className="book-card">
      <div className="book-card-art">
        <Link href={`/books/${book.id}`} aria-label={`مشاهده ${book.title}`}><BookCover book={book} /></Link>
        <button className={`favorite-button${saved ? " is-active" : ""}`} onClick={() => { if (book.external) cacheBook(book); toggleFavorite(book.id); }} aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
        {book.tag && <span className="book-tag">{book.tag}</span>}
      </div>
      <div className="book-card-info">
        <Link href={`/books/${book.id}`} className="book-title">{book.title}</Link>
        <span className="book-author">{book.author}</span>
        {book.averageRating && <span className="book-author">امتیاز منبع: {book.averageRating.toLocaleString("fa-IR")} از ۵ {book.ratingsCount ? `(${book.ratingsCount.toLocaleString("fa-IR")} رأی)` : ""}</span>}
        <div className="book-card-bottom"><strong>{book.price.toLocaleString("fa-IR")} <small>تومان</small></strong><button className={`quick-add${bought || library.includes(book.id) ? " bought" : ""}`} onClick={() => { if (book.external) cacheBook(book); buyBook(book.id); setBought(true); }} aria-label="خرید کتاب" title="خرید کتاب">{bought || library.includes(book.id) ? <Check size={15} /> : <ShoppingBag size={15} />}</button><button className="quick-add cart-add" onClick={() => { if (book.external) cacheBook(book); addToCart(book.id); }} aria-label="افزودن به سبد خرید" title="افزودن به سبد"><span>+</span></button></div>
        {bought && <small className="inline-success card-buy-success">خرید انجام شد</small>}
      </div>
    </article>
  );
}
