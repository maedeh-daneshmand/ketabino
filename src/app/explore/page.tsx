import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata: Metadata = { title: "فروشگاه کتاب" };
export default function ExplorePage() { return <section className="container inner-page"><div className="page-overline">قفسه‌های کتابینو / فروشگاه</div><Catalog /></section>; }
