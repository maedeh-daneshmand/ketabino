"use client";

import Link from "next/link";
import { BookOpen, Heart, Library } from "lucide-react";
import { books } from "@/data/books";
import { BookCard } from "@/components/book-card";
import { useStore } from "@/components/store-provider";

export function SavedBooks({ kind }: { kind: "favorites" | "library" }) {
  const { favorites, library, externalBooks } = useStore();
  const ids = kind === "favorites" ? favorites : library;
  const selected = [...books.filter((book) => ids.includes(book.id)), ...externalBooks.filter((book) => ids.includes(book.id))];
  const isFavorites = kind === "favorites";
  return <><div className="page-title-row"><div><span className="eyebrow">فضای شخصی تو</span><h1>{isFavorites ? "علاقه‌مندی‌های من" : "کتابخانه من"}</h1><p>{isFavorites ? "کتاب‌هایی که برای بعداً کنار گذاشته‌ای." : "کتاب‌هایی که به کتابخانه‌ات اضافه کرده‌ای."}</p></div><span className="saved-count">{selected.length.toLocaleString("fa-IR")} کتاب</span></div>{selected.length ? <div className="book-grid">{selected.map((book) => <BookCard key={book.id} book={book} />)}</div> : <div className="empty-state"><span>{isFavorites ? <Heart /> : <Library />}</span><h3>{isFavorites ? "هنوز کتابی ذخیره نکرده‌ای" : "کتابخانه‌ات منتظر اولین کتاب است"}</h3><p>{isFavorites ? "هر کتابی را دوست داشتی با قلب کوچک روی جلد ذخیره کن." : "کتاب‌های موردعلاقه‌ات را به کتابخانه اضافه کن و نمونه‌شان را بخوان."}</p><Link href="/explore" className="button button-dark"><BookOpen size={17} /> کشف کتاب‌ها</Link></div>}</>;
}
