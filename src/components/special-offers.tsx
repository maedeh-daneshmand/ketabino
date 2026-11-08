import Link from "next/link";
import { ArrowLeft, BadgePercent, Sparkles } from "lucide-react";
import { curatedBooks } from "@/data/curated-books";
import { BookCover } from "@/components/book-cover";

export function SpecialOffers() {
  const offers = curatedBooks.slice(2, 7);
  return <section className="container special-offers"><div className="offers-heading"><div><span className="eyebrow"><Sparkles size={14} /> انتخاب‌های تازه برای تو</span><h2>پیشنهادهای ویژه کتابینو</h2><p>چند کتاب منتخب با قیمت‌های پیشنهادی این هفته.</p></div><Link href="/explore" className="offers-link">همه کتاب‌ها <ArrowLeft size={16} /></Link></div><div className="offers-books">{offers.map((book, index) => { const discount = index % 2 === 0 ? 15 : 10; const oldPrice = Math.round(book.price / (1 - discount / 100) / 1000) * 1000; return <Link href={`/books/${book.id}`} className="offer-book" key={book.id}><span className="offer-discount"><BadgePercent size={13} /> {discount.toLocaleString("fa-IR")}٪</span><div className="offer-cover"><BookCover book={book} /></div><b>{book.title}</b><small>{book.author}</small><div><del>{oldPrice.toLocaleString("fa-IR")}</del><strong>{book.price.toLocaleString("fa-IR")} <small>تومان</small></strong></div></Link>; })}</div></section>;
}
