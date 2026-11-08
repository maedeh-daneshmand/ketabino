import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { curatedBooks } from "@/data/curated-books";
import { BookCover } from "@/components/book-cover";

export function WeeklyBestsellers() {
  return <section className="section-block container weekly-bestsellers"><div className="section-heading"><div><span className="eyebrow"><TrendingUp size={14} /> انتخاب‌های محبوب</span><h2>پیشنهادهای پربازدید کتابینو</h2><p>چند عنوان برای شروع یک مسیر خواندنی تازه.</p></div><Link href="/explore" className="text-link">دیدن همه کتاب‌ها <ArrowLeft size={16} /></Link></div><div className="bestseller-list">{curatedBooks.slice(0, 5).map((book, index) => <Link href={`/books/${book.id}`} className="bestseller-item" key={book.id}><b className="bestseller-rank">{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</b><div className="bestseller-cover"><BookCover book={book} /></div><div className="bestseller-info"><strong>{book.title}</strong><span>{book.author}</span><small>{book.category === "fiction" ? "داستان و رمان" : book.category === "business" ? "کسب‌وکار و مدیریت" : "روان‌شناسی و توسعه فردی"}</small></div><span className="bestseller-price">{book.price.toLocaleString("fa-IR")} <small>تومان</small></span></Link>)}</div></section>;
}
