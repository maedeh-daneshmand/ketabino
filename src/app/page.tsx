import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, BookOpen, BookOpenText, Brain, BriefcaseBusiness, Feather, Headphones, Landmark, Leaf, Sparkles, Blocks } from "lucide-react";
import { books } from "@/data/books";
import { curatedBooks } from "@/data/curated-books";
import { categories } from "@/data/categories";
import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { SectionHeading } from "@/components/section-heading";
import { OnlineBookShelf } from "@/components/online-book-shelf";
import { WeeklyBestsellers } from "@/components/weekly-bestsellers";
import { ReadingChallenge } from "@/components/reading-challenge";
import { SpecialOffers } from "@/components/special-offers";

export default async function HomePage() {
  const featured = curatedBooks.slice(0, 5);
  const fresh = curatedBooks.slice(5, 10);
  return <>
    <section className="container hero-wrap"><div className="hero"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={15} /> فصل تازه‌ای برای خواندن</span><h1>هر کتاب،<br /><em>یک جهان تازه</em> است.</h1><p>میان هزاران داستان و ایده قدم بزن، کتاب بعدی‌ات را پیدا کن و لحظه‌های خودت را با خواندن بساز.</p><div className="hero-actions"><Link href="/explore" className="button button-dark">کشف کتاب‌ها <ArrowLeft size={17} /></Link><Link href="/about" className="button button-ghost">داستان کتابینو</Link></div><div className="hero-note"><span className="avatar-stack"><i>م</i><i>ن</i><i>س</i></span><span>برای آدم‌هایی که همیشه چیزی برای کشف دارند</span></div></div><div className="hero-art"><img className="hero-reading-image" src="/images/reading-corner.svg" alt="تصویرسازی گوشه‌ای دنج برای کتاب خواندن" /><div className="hero-sun" /><div className="hero-sticker">READ<br />MORE<br /><b>♡</b></div><div className="hero-book hero-book-one"><BookCover book={featured[1]} /></div><div className="hero-book hero-book-two"><BookCover book={featured[2]} /></div><div className="hero-book hero-book-three"><BookCover book={featured[0]} /></div><span className="hero-scribble">a little<br />more wonder</span><span className="hero-leaf leaf-one">✳</span><span className="hero-leaf leaf-two">✳</span></div><div className="hero-index"><b>۰۱</b><span /> ۰۳</div></div></section>
    <section className="container promise-row"><div><span className="promise-icon mint-icon"><Leaf /></span><b>انتخاب‌های فکرشده</b><small>کتاب‌هایی برای هر سلیقه</small></div><div><span className="promise-icon peach-icon"><BookOpen /></span><b>نمونه‌خوانی رایگان</b><small>قبل از انتخاب، ورق بزن</small></div><div><span className="promise-icon lilac-icon"><Headphones /></span><b>همراه همیشگی</b><small>کتابخانه شخصی تو</small></div><div><span className="promise-icon yellow-icon"><Sparkles /></span><b>تجربه‌ای ساده</b><small>از کشف تا مطالعه</small></div></section>
    <section className="section-block container"><SectionHeading eyebrow="از کجا شروع کنیم؟" title="قفسه‌ها را ورق بزن" description="هر حال‌وهوایی، قفسه مخصوص خودش را دارد." href="/explore" /><div className="category-grid">{categories.map((cat, i) => { const CategoryIcon = ({ fiction: BookOpenText, "self-help": Brain, business: BriefcaseBusiness, poetry: Feather, history: Landmark, children: Blocks } as const)[cat.slug as "fiction" | "self-help" | "business" | "poetry" | "history" | "children"]; return <Link href={`/categories/${cat.slug}`} className={`category-tile category-${cat.slug}`} key={cat.slug} style={{ "--tile-color": cat.color } as React.CSSProperties}><span className="category-number">۰{i + 1}</span><span className="category-art" aria-hidden="true"><CategoryIcon strokeWidth={1.25} /></span><b>{cat.title}</b><small>{cat.en}</small><ArrowUpLeft className="category-arrow" size={17} /></Link>; })}</div></section>
    <section className="section-block featured-section"><div className="container"><SectionHeading eyebrow="پیشنهاد سردبیر" title="شاید این‌ها را دوست داشته باشی" description="چند انتخاب برای شروع یک ماجرای تازه." href="/explore" /><div className="book-grid">{featured.map((book) => <BookCard key={book.id} book={book} />)}</div></div></section>
    <section className="container editorial-banner"><div className="editorial-copy"><span className="eyebrow">باشگاه کتاب‌خوان‌ها</span><h2>برای خودت،<br />یک قرارِ خواندنی بگذار.</h2><p>با اشتراک کتابینو، هر ماه بهانه‌ای تازه برای کشف و خواندن داشته باش.</p><Link href="/membership" className="button button-dark">آشنایی با اشتراک <ArrowLeft size={17} /></Link></div><div className="editorial-art"><img className="editorial-illustration" src="/images/book-club.svg" alt="تصویرسازی کتاب و مطالعه" /><div className="editorial-circle" /><div className="editorial-book"><BookCover book={featured[3]} large /></div><span className="editorial-quote">«هر صفحه<br />یک فرصت تازه»</span></div></section>
    <section className="section-block container"><SectionHeading eyebrow="تازه‌های قفسه" title="تازه به کتابینو رسیده" description="نگاهی به انتخاب‌های جدید این روزها." href="/explore" /><div className="book-grid">{fresh.map((book) => <BookCard key={book.id} book={book} />)}</div></section>
    <OnlineBookShelf />
    <SpecialOffers />
    <WeeklyBestsellers />
    <ReadingChallenge />
    <section className="reader-note"><div className="container reader-note-inner"><div><span className="eyebrow">یک تجربه کوچک</span><h2>قبل از خرید،<br />چند صفحه مهمان کتاب شو.</h2><p>نمونه‌خوانی کتاب‌ها را امتحان کن و با خیال راحت‌تر انتخاب کن.</p><Link href={`/reader/${books[0].id}`} className="text-link">رفتن به اتاق مطالعه <ArrowLeft size={17} /></Link></div><div className="reader-paper"><span>یادداشت شماره ۰۱</span><p>«گاهی برای تغییر زندگی لازم نیست تصمیم بزرگی بگیریم. کافی است چند لحظه مکث کنیم و ببینیم توجه ما در طول روز کجا خرج می‌شود.»</p><i>از کتاب هنر آرام زیستن</i></div></div></section>
  </>;
}
