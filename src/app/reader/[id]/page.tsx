import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, Library } from "lucide-react";
import { getBook } from "@/data/books";
import { getGoogleBook } from "@/lib/google-books";
import { getOpenLibraryBook } from "@/lib/open-library";
import { getIranketabBook } from "@/lib/iranketab";
import { getCuratedBook } from "@/data/curated-books";
import { Reader } from "@/components/reader";
export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBook(id) ?? getCuratedBook(id) ?? (id.startsWith("openlibrary-") ? await getOpenLibraryBook(id) : id.startsWith("iranketab-") ? await getIranketabBook(id) : await getGoogleBook(id));
  if (!book) notFound();
  const summaryPanel = <section className="reader-summary"><div><span className="eyebrow">پیش‌نمایش کتاب</span><h2>چند صفحه از کتاب {book.title}</h2></div><p>در این بخش می‌توانید نمونه‌ای از متن کتاب را ببینید و پیش از شروع مطالعه، با فضای نوشتار و محتوای آن آشنا شوید.</p></section>;
  if (id.startsWith("google-") && book.previewAvailable && book.previewEmbeddable) {
    const volumeId = id.slice("google-".length);
    return <div className="container inner-page"><div className="page-overline"><Link href={`/books/${id}`}>بازگشت به معرفی کتاب</Link> / نمونه‌خوانی</div>{summaryPanel}<section className="preview-shell"><div className="preview-heading"><BookOpen /><div><h1>چند صفحه برای آشنایی با کتاب</h1><p>{book.title} · {book.author}</p></div></div><iframe className="preview-frame" title={`پیش‌نمایش کتاب ${book.title}`} src={`https://books.google.com/books?id=${encodeURIComponent(volumeId)}&printsec=frontcover&output=embed`} loading="lazy" allow="fullscreen" /><p className="preview-caption">تعداد صفحات قابل مشاهده به نمونه‌ای بستگی دارد که برای این عنوان در دسترس قرار گرفته است.</p></section></div>;
  }
  if (book.external) return <div className="container inner-page"><div className="page-overline"><Link href={`/books/${id}`}>بازگشت به معرفی کتاب</Link> / نمونه‌خوانی</div>{summaryPanel}<section className="empty-state"><span><BookOpen /></span><h3>نمونه‌ی قابل نمایش برای این کتاب پیدا نشد</h3><p>در حال حاضر پیش‌نمایش چند صفحه‌ایِ مجاز برای این عنوان در دسترس نیست. برای اینکه متن نادرست یا ساختگی نمایش داده نشود، نمونه‌ی غیرواقعی ارائه نمی‌کنیم.</p></section></div>;
  return <div className="container inner-page"><div className="page-overline"><Link href={`/books/${id}`}>بازگشت به معرفی کتاب</Link> / نمونه‌خوانی</div>{summaryPanel}<Reader book={book} /></div>;
}
