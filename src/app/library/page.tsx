import type { Metadata } from "next";
import { SavedBooks } from "@/components/saved-books";
export const metadata: Metadata = { title: "کتابخانه من" };
export default function LibraryPage() { return <section className="container inner-page"><div className="page-overline">کتابینو / فضای شخصی</div><SavedBooks kind="library" /></section>; }
