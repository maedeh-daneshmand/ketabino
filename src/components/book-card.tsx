"use client";

import Link from "next/link";
import { Heart, ShoppingBag, BookOpen } from "lucide-react";
import type { Book } from "@/data/books";
import { BookCover } from "@/components/book-cover";
import { useStore } from "@/components/store-provider";

export function BookCard({ book }: { book: Book }) {
  const { favorites, toggleFavorite, addToCart, cacheBook } = useStore();
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
        <div className="book-card-bottom"><strong>{book.price.toLocaleString("fa-IR")} <small>تومان</small></strong><Link className="quick-preview" href={`/reader/${book.id}`} aria-label={`مشاهده نمونه ${book.title}`} title="چند صفحه نمونه"><BookOpen size={14} /><span>نمونه</span></Link><button className="quick-add cart-add" onClick={() => { if (book.external) cacheBook(book); addToCart(book.id); }} aria-label="افزودن به سبد خرید" title="افزودن به سبد"><ShoppingBag size={15} /></button></div>
      </div>
    </article>
  );
}
