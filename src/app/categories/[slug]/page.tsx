import { notFound } from "next/navigation";
import { Catalog } from "@/components/catalog";
import { categories } from "@/data/categories";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const category = categories.find((item) => item.slug === slug); if (!category) notFound(); return <section className="container inner-page"><div className="page-overline">کتابینو / دسته‌بندی‌ها / {category.title}</div><Catalog initialCategory={slug} heading={category.title} description={`کتاب‌های منتخب در قفسه ${category.title}.`} /></section>; }
