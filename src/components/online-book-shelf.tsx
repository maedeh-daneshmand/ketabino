"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/data/books";
import { BookCard } from "@/components/book-card";
import { SectionHeading } from "@/components/section-heading";
import { curatedBooks } from "@/data/curated-books";

type BooksResponse = { books?: Book[] };

async function loadBooks(query: string, language: string): Promise<Book[]> {
  const params = new URLSearchParams({ q: query, lang: language, limit: "12" });
  const response = await fetch(`/api/books?${params.toString()}`);
  if (!response.ok) return [];
  const data = await response.json() as BooksResponse;
  return data.books ?? [];
}

export function OnlineBookShelf() {
  const [persianBooks, setPersianBooks] = useState<Book[]>([]);
  const [internationalBooks, setInternationalBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const [persian, international] = await Promise.all([
        loadBooks("هوش مصنوعی", "فارسی").catch(() => []),
        loadBooks("subject:fiction", "انگلیسی").catch(() => []),
      ]);

      const realPersian = persian.filter((book) => book.id.startsWith("iranketab-") && Boolean(book.coverImage));
      const realInternational = international.filter((book) =>
        Boolean(book.coverImage) && (book.id.startsWith("google-") || book.id.startsWith("openlibrary-"))
        && /[A-Za-z]/.test(book.title),
      );

      if (active) {
        setPersianBooks(realPersian.slice(0, 5));
        const internationalFallback = curatedBooks.filter((book) => book.language === "انگلیسی" && Boolean(book.coverImage));
        setInternationalBooks((realInternational.length ? realInternational : internationalFallback).slice(0, 5));
      }
    }

    load().finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (!loading && !persianBooks.length && !internationalBooks.length) return null;

  return <>
    <section className="section-block container">
      <SectionHeading eyebrow="ویژه فارسی‌زبان‌ها" title="کتاب‌های فارسی" description="از میان کتاب‌های تازه و خواندنی فارسی، انتخابت را پیدا کن." href="/search?q=هوش%20مصنوعی" />
      {loading && !persianBooks.length ? <p className="muted-copy">در حال دریافت کتاب‌های فارسی…</p> : persianBooks.length ? <div className="book-grid">{persianBooks.map((book) => <BookCard key={book.id} book={book} />)}</div> : <p className="muted-copy">در حال حاضر کتاب فارسی تازه‌ای برای نمایش پیدا نشد.</p>}
    </section>
    <section className="section-block container">
      <SectionHeading eyebrow="برای سلیقه‌های گوناگون" title="کتاب‌های انگلیسی" description="دنیایی از داستان‌ها، ایده‌ها و تجربه‌های تازه برای کشف کردن." href="/search?q=The%20Alchemist" />
      {loading && !internationalBooks.length ? <p className="muted-copy">در حال دریافت کتاب‌های بین‌المللی…</p> : internationalBooks.length ? <div className="book-grid">{internationalBooks.map((book) => <BookCard key={book.id} book={book} />)}</div> : <p className="muted-copy">برای دیدن عنوان‌های بیشتر، از جست‌وجوی کتاب استفاده کن.</p>}
    </section>
  </>;
}
