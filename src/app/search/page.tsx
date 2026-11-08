import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata: Metadata = { title: "جست‌وجوی کتاب" };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const params = await searchParams; return <section className="container inner-page"><div className="page-overline">کتابینو / جست‌وجو</div><Catalog initialQuery={params.q || ""} heading="جست‌وجوی کتاب" description="نام کتاب، نویسنده یا موضوع موردنظرت را بنویس." /></section>; }
