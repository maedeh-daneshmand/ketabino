"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Heart, Library, Search, ShoppingBag, Menu, X, Moon, Sun } from "lucide-react";
import { useStore } from "@/components/store-provider";

const links = [{ href: "/", label: "خانه" }, { href: "/explore", label: "فروشگاه" }, { href: "/membership", label: "اشتراک کتابینو" }, { href: "/about", label: "درباره ما" }];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites, cart } = useStore();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [night, setNight] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("ketabino-theme") === "dark"; setNight(saved); document.documentElement.dataset.theme = saved ? "dark" : "light"; }, []);
  const toggleTheme = () => { const next = !night; setNight(next); document.documentElement.dataset.theme = next ? "dark" : "light"; localStorage.setItem("ketabino-theme", next ? "dark" : "light"); };
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); router.push(`/search?q=${encodeURIComponent(query.trim())}`); setMenuOpen(false); };
  return (
    <header className="site-header">
      <div className="header-top"><div className="container header-top-inner"><span>دنیای تازه‌ای از خواندن، فقط چند صفحه با تو فاصله دارد.</span><Link href="/membership">با اشتراک کتابینو بیشتر بخوان <span>←</span></Link></div></div>
      <div className="container header-main">
        <Link href="/" className="brand"><span className="brand-symbol"><BookOpen size={21} /></span><span>کتابینو<small>KETABINO</small></span></Link>
        <nav className={`main-nav${menuOpen ? " nav-open" : ""}`} aria-label="منوی اصلی">{links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}</nav>
        <form className="header-search" onSubmit={submit}><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="نام کتاب یا نویسنده را جست‌وجو کن..." aria-label="جست‌وجوی کتاب" /></form>
        <div className="header-actions"><button type="button" className="header-icon theme-toggle" onClick={toggleTheme} aria-label={night ? "فعال‌کردن حالت روز" : "فعال‌کردن حالت شب"} title={night ? "حالت روز" : "حالت شب"}>{night ? <Sun size={19} /> : <Moon size={19} />}</button><Link href="/favorites" aria-label="علاقه‌مندی‌ها" className="header-icon"><Heart size={19} /><i>{favorites.length || ""}</i></Link><Link href="/library" aria-label="کتابخانه" className="header-icon"><Library size={19} /></Link><Link href="/cart" aria-label="سبد خرید" className="header-icon"><ShoppingBag size={19} /><i>{cart.length || ""}</i></Link></div>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="باز کردن منو">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
