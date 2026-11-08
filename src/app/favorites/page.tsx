import type { Metadata } from "next";
import { SavedBooks } from "@/components/saved-books";
export const metadata: Metadata = { title: "علاقه‌مندی‌های من" };
export default function FavoritesPage() { return <section className="container inner-page"><div className="page-overline">کتابینو / فضای شخصی</div><SavedBooks kind="favorites" /></section>; }
