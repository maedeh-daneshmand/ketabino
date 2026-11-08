"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { books } from "@/data/books";
import { categories } from "@/data/categories";
import { BookCard } from "@/components/book-card";
import { curatedBooks } from "@/data/curated-books";

export function Catalog({ initialQuery = "", initialCategory = "all", heading = "کتاب‌هایی برای کشف کردن", description = "میان قفسه‌ها بگرد و کتاب بعدی‌ات را پیدا کن." }: { initialQuery?: string; initialCategory?: string; heading?: string; description?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [onlineBooks, setOnlineBooks] = useState<typeof books>([]);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [onlineError, setOnlineError] = useState("");
  useEffect(() => {
    const trimmed = query.trim();
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoadingOnline(true);
      setOnlineError("");
      try {
        const categoryQuery: Record<string, string> = { fiction: "subject:fiction", "self-help": "subject:self-help", business: "subject:business", poetry: "subject:poetry", history: "subject:history", children: "subject:juvenile_fiction" };
        const searchTerm = trimmed || categoryQuery[category] || "subject:fiction";
        const params = new URLSearchParams({ q: searchTerm, category, lang: language, limit: "40" });
        const response = await fetch(`/api/books?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error("دریافت اطلاعات از سرویس کتاب‌ها ناموفق بود.");
        const data = await response.json() as { books?: typeof books };
        const results = data.books ?? [];
        if (!controller.signal.aborted) {
          setOnlineBooks(results);
          setOnlineError(results.length ? "" : "در حال حاضر دسترسی به فهرست‌های آنلاین برقرار نشد.");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setOnlineBooks([]);
          setOnlineError(error instanceof Error ? error.message : "خطا در دریافت اطلاعات کتاب‌ها.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingOnline(false);
      }
    }, 400);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, category, language]);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    const local = [...books, ...curatedBooks].filter((book) => Boolean(book.coverImage) && (category === "all" || book.category === category) && (language === "all" || book.language === language) && (!q || `${book.title} ${book.author} ${book.description} ${categories.find((item) => item.slug === book.category)?.title || ""}`.toLocaleLowerCase("fa").includes(q)));
    const seen = new Set(local.map((book) => `${book.title.toLocaleLowerCase("fa")}::${book.author.toLocaleLowerCase("fa")}`));
    const result = [...local, ...onlineBooks.filter((book) => {
      if (!book.coverImage) return false;
      const key = `${book.title.toLocaleLowerCase("fa")}::${book.author.toLocaleLowerCase("fa")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })];
    if (sort === "price-low") result.sort((a, b) => (a.external ? Number.MAX_SAFE_INTEGER : a.price) - (b.external ? Number.MAX_SAFE_INTEGER : b.price));
    if (sort === "price-high") result.sort((a, b) => (b.external ? -1 : b.price) - (a.external ? -1 : a.price));
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    return result;
  }, [query, category, language, sort, onlineBooks]);
  return <div className="catalog-layout"><aside className="catalog-sidebar"><div className="filter-title"><SlidersHorizontal size={18} /><b>فیلترها</b><button onClick={() => { setCategory("all"); setLanguage("all"); setQuery(""); setSort("recommended"); }}>پاک کردن</button></div><div className="filter-group"><b>دسته‌بندی</b>{[{ slug: "all", title: "همه کتاب‌ها" }, ...categories].map((cat) => <button key={cat.slug} className={`filter-option${category === cat.slug ? " selected" : ""}`} onClick={() => setCategory(cat.slug)}><span>{cat.title}</span><i>{category === cat.slug ? "●" : "○"}</i></button>)}</div><div className="filter-group"><b>زبان کتاب</b>{["all", "فارسی", "انگلیسی"].map((lang) => <button key={lang} className={`filter-option${language === lang ? " selected" : ""}`} onClick={() => setLanguage(lang)}><span>{lang === "all" ? "همه زبان‌ها" : lang}</span><i>{language === lang ? "●" : "○"}</i></button>)}</div></aside><div className="catalog-main"><div className="catalog-intro"><div><h1>{heading}</h1><p>{description}</p></div><label className="catalog-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="عنوان، نویسنده یا موضوع..." />{query && <button onClick={() => setQuery("")} aria-label="پاک کردن جست‌وجو"><X size={15} /></button>}</label></div><div className="catalog-toolbar"><span>{filtered.length.toLocaleString("fa-IR")} کتاب پیدا شد {loadingOnline ? "· در حال دریافت از فهرست‌های آنلاین…" : ""}</span><label>مرتب‌سازی <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recommended">پیشنهاد کتابینو</option><option value="price-low">ارزان‌ترین</option><option value="price-high">گران‌ترین</option><option value="title">نام کتاب</option></select></label></div>{onlineError && <p className="muted-copy" role="status">{onlineError} نمایش کتاب‌های موجود کتابینو ادامه دارد.</p>}{filtered.length ? <div className="book-grid catalog-grid">{filtered.map((book) => <BookCard key={book.id} book={book} />)}</div> : loadingOnline ? <p className="muted-copy">در حال جست‌وجوی کتاب‌ها در فهرست‌های آنلاین…</p> : <div className="empty-state"><span>⌕</span><h3>کتابی پیدا نکردیم</h3><p>عبارت دیگری امتحان کن یا فیلترها را تغییر بده.</p><button className="button button-dark" onClick={() => { setQuery(""); setCategory("all"); setLanguage("all"); }}>نمایش همه کتاب‌ها</button></div>}</div></div>;
}
