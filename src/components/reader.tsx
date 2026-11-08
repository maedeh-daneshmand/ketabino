"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Library } from "lucide-react";
import type { Book } from "@/data/books";
import { BookCover } from "@/components/book-cover";
import { useStore } from "@/components/store-provider";

export function Reader({ book }: { book: Book }) {
  const [page, setPage] = useState(0);
  const { addToLibrary, library } = useStore();
  return <section className="reader-shell"><aside className="reader-sidebar"><BookCover book={book} /><h2>{book.title}</h2><p>{book.author}</p><button className="button button-outline" onClick={() => addToLibrary(book.id)}><Library size={16} />{library.includes(book.id) ? "در کتابخانه تو" : "افزودن به کتابخانه"}</button><Link href={`/books/${book.id}`} className="reader-back">بازگشت به معرفی کتاب</Link></aside><div className="reader-main"><div className="reader-toolbar"><span><BookOpen size={17} /> اتاق مطالعه کتابینو</span><span>صفحه {`${page + 1}`.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])} از ۲</span></div><article className="reader-page"><span className="reader-page-label">{book.title}</span><h1>{page === 0 ? "شروع یک مسیر تازه" : "ادامه داستان"}</h1><p>{book.sample[page]}</p><p>{page === 0 ? "این بخش، نمونه‌ای کوتاه و اختصاصی برای آشنایی با فضای کتاب است. در نسخه کامل، فصل‌ها با همین محیط ساده و خوانا در دسترس خواهند بود." : "خواندن، فرصتی است برای دیدن جهان از زاویه‌ای دیگر. هر صفحه می‌تواند پرسشی تازه بسازد و راهی برای ادامه مسیر نشان دهد."}</p><span className="reader-page-number">{page + 1}</span></article><div className="reader-pagination"><button className="button button-outline" disabled={page === 0} onClick={() => setPage(0)}><ChevronRight size={17} /> صفحه قبل</button><button className="button button-dark" disabled={page === 1} onClick={() => setPage(1)}>صفحه بعد <ChevronLeft size={17} /></button></div></div></section>;
}
