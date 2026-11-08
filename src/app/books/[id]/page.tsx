import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Check, ShoppingBag } from "lucide-react";
import { books, getBook } from "@/data/books";
import { findGoogleBookDetails, getGoogleBook, searchGoogleBooks } from "@/lib/google-books";
import { getOpenLibraryBook, searchOpenLibraryBooks } from "@/lib/open-library";
import { getIranketabBook } from "@/lib/iranketab";
import { getCuratedBook } from "@/data/curated-books";
import { categories } from "@/data/categories";
import { BookCover } from "@/components/book-cover";
import { BookActions } from "@/components/book-actions";
import { BookCard } from "@/components/book-card";
import { SectionHeading } from "@/components/section-heading";
import { BookReviews } from "@/components/book-reviews";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let book = getBook(id) ?? getCuratedBook(id) ?? (id.startsWith("openlibrary-") ? await getOpenLibraryBook(id) : id.startsWith("iranketab-") ? await getIranketabBook(id) : await getGoogleBook(id)); if (!book) notFound();
  // Catalogue cards are intentionally light. Enrich the selected book on its own page.
  const needsDetails = !book.publisher || !book.publishedDate || !book.pageCount || !book.isbn || book.description.length < 90 || /به.?زودی|ثبت نشده/.test(book.description);
  if (needsDetails) {
    const selectedTitle = book.title;
    const selectedAuthor = book.author;
    let enriched = await findGoogleBookDetails(selectedTitle, selectedAuthor);
    if (!enriched || (!enriched.publisher && !enriched.publishedDate && !enriched.pageCount && enriched.description.length < 90)) {
      const fallback = await searchOpenLibraryBooks(selectedTitle, 8, 0, "all");
      const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      enriched = fallback.books.find((item) => normalize(item.title) === normalize(selectedTitle) || normalize(item.title).includes(normalize(selectedTitle))) ?? enriched;
    }
    if (enriched) book = {
      ...book,
      description: book.description.length >= 90 && !/به.?زودی|ثبت نشده/.test(book.description) ? book.description : enriched.description,
      subtitle: book.subtitle || enriched.subtitle,
      publisher: book.publisher || enriched.publisher,
      publishedDate: book.publishedDate || enriched.publishedDate,
      year: book.year || enriched.year,
      language: book.language && book.language !== "نامشخص" ? book.language : enriched.language,
      pageCount: book.pageCount || enriched.pageCount,
      isbn: book.isbn || enriched.isbn,
      subjects: book.subjects?.length ? book.subjects : enriched.subjects,
      mainCategory: book.mainCategory || enriched.mainCategory,
      averageRating: book.averageRating || enriched.averageRating,
      ratingsCount: book.ratingsCount || enriched.ratingsCount,
      dimensions: book.dimensions || enriched.dimensions,
    };
  }
  const category = categories.find((item) => item.slug === book.category);
  const localRelated = books.filter((item) => item.category === book.category && item.id !== book.id).slice(0, 4);
  const onlineRelated = book.external ? (await searchGoogleBooks(book.subjects?.[0] ? `subject:${book.subjects[0]}` : `inauthor:${book.author}`, { maxResults: 8 })).books.filter((item) => item.id !== book.id).slice(0, 4) : [];
  const related = book.external ? onlineRelated : localRelated;
  return <div className="container inner-page"><div className="page-overline"><Link href="/">خانه</Link> / <Link href="/explore">فروشگاه</Link> / {book.title}</div><section className="detail-layout"><div className="detail-cover"><BookCover book={book} large /><span className="detail-cover-caption">معرفی کتاب در کتابینو</span></div><div className="detail-content"><span className="eyebrow">{category?.title || book.mainCategory || book.subjects?.[0] || "کتاب منتخب"}</span><h1>{book.title}</h1>{book.subtitle && <p className="detail-author">{book.subtitle}</p>}<p className="detail-author">نوشته <b>{book.author}</b></p><p className="detail-description">{book.description}</p><h2 className="detail-section-title">شناسنامه و اطلاعات کتاب</h2><div className="detail-meta"><div><small>عنوان کامل</small><b>{book.title}</b></div>{book.subtitle && <div><small>عنوان فرعی</small><b>{book.subtitle}</b></div>}<div><small>نویسنده / پدیدآورنده</small><b>{book.author}</b></div><div><small>زبان کتاب</small><b>{book.language}</b></div><div><small>سال انتشار</small><b>{book.year?.toLocaleString("fa-IR") || book.publishedDate || "در اطلاعات در دسترس ثبت نشده"}</b></div><div><small>ناشر / انتشارات</small><b>{book.publisher || "در اطلاعات در دسترس ثبت نشده"}</b></div><div><small>تعداد صفحات</small><b>{book.pageCount?.toLocaleString("fa-IR") || "در اطلاعات در دسترس ثبت نشده"}</b></div><div><small>شابک (ISBN)</small><b dir="ltr">{book.isbn || "در اطلاعات در دسترس ثبت نشده"}</b></div><div><small>نوع اثر</small><b>{book.printType === "BOOK" ? "کتاب" : book.printType || "کتاب"}</b></div>{book.publishedDate && <div><small>تاریخ انتشار</small><b>{book.publishedDate}</b></div>}<div><small>موضوع اصلی</small><b>{book.mainCategory || category?.title || "در اطلاعات در دسترس ثبت نشده"}</b></div><div><small>امتیاز خوانندگان</small><b>{book.averageRating ? `${book.averageRating.toLocaleString("fa-IR")} از ۵ (${(book.ratingsCount ?? 0).toLocaleString("fa-IR")} رأی)` : "امتیاز عمومی ثبت نشده"}</b></div>{book.dimensions?.height && <div><small>ابعاد نسخه</small><b>{[book.dimensions.height, book.dimensions.width, book.dimensions.thickness].filter(Boolean).join(" × ")}</b></div>}{book.maturityRating && <div><small>رده‌بندی محتوا</small><b>{book.maturityRating}</b></div>}<div><small>شناسه داخلی کتابینو</small><b dir="ltr">{book.id}</b></div></div>{Boolean(book.subjects?.length) && <div className="detail-subjects"><small>موضوعات، کلیدواژه‌ها و دسته‌بندی‌ها</small><div>{book.subjects?.map((subject) => <span key={subject}>{subject}</span>)}</div></div>}<div className="detail-price"><strong>{book.price.toLocaleString("fa-IR")} <small>تومان</small></strong></div><BookActions bookId={book.id} external={book.external} book={book} /><Link href={`/reader/${book.id}`} className="sample-link"><BookOpen size={17} /> مشاهده چند صفحه از کتاب <ArrowLeft size={16} /></Link></div></section><BookReviews bookId={book.id} /><section className="section-block detail-related"><SectionHeading title="از همین قفسه" description="شاید این کتاب‌ها هم برایت جالب باشند." href={`/categories/${book.category}`} />{related.length ? <div className="book-grid">{related.map((item) => <BookCard key={item.id} book={item} />)}</div> : <p className="muted-copy">کتاب مرتبطی پیدا نشد.</p>}</section></div>;
}
