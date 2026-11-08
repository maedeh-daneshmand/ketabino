import * as cheerio from "cheerio";
import type { Book } from "@/data/books";

const SITE = "https://www.iranketab.ir";
const IMAGE_BASE = SITE;

function toBookId(href: string) {
  return href.match(/^\/book\/(\d+)/)?.[1];
}

function samplePrice(id: string) {
  const number = Number(id) || 1;
  return (79 + (number * 37 % 121)) * 1000;
}

function toPersianBook(id: string, title: string, author: string, coverImage?: string, subtitle?: string, details: Partial<Book> = {}): Book {
  return {
    id: `iranketab-${id}`,
    title: title.replace(/^کتاب\s*/, "").trim(),
    author: author.trim() || "نویسنده نامشخص",
    category: "fiction",
    description: details.description || subtitle || "توضیحات این عنوان هنوز ثبت نشده است.",
    price: samplePrice(id),
    color: "#dcebe1",
    accent: "#315e4d",
    coverTitle: title,
    coverSubtitle: "یک انتخاب خواندنی",
    language: "فارسی",
    sample: [],
    external: true,
    coverImage,
    ...details,
  };
}

function normalizeCover(image?: string) {
  if (!image || /data:image|placeholder|blank/i.test(image)) return undefined;
  try {
    const parsed = new URL(image, SITE);
    const original = parsed.searchParams.get("pic");
    if (original?.startsWith("www.iranketab.ir/")) return `https://www.iranketab.ir/${original.slice("www.iranketab.ir/".length)}`;
    if (parsed.hostname === "www.iranketab.ir") return parsed.toString();
    return parsed.toString();
  } catch { return undefined; }
}

export async function getIranketabBook(bookId: string): Promise<Book | null> {
  const id = bookId.replace(/^iranketab-/, "");
  if (!/^\d+$/.test(id)) return null;
  try {
    const response = await fetch(`${SITE}/book/${id}`, { headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "Mozilla/5.0 (compatible; KetabinoBookDiscovery/1.0)" }, next: { revalidate: 1800 }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return null;
    const $ = cheerio.load(await response.text());
    const meta = (name: string) => $(`meta[property="${name}"]`).attr("content") || $(`meta[name="${name}"]`).attr("content") || "";
    const title = $("h1").first().text().trim() || meta("og:title").split(/[|–—]/)[0].trim();
    if (!title) return null;
    const author = $("a[href*='/author/']").first().text().trim() || $("[class*='author']").first().text().trim() || meta("book:author") || "نویسنده نامشخص";
    const subtitle = meta("description") || meta("og:description");
    const cover = normalizeCover(meta("og:image") || $("img").filter((_, el) => /ProductImages/.test($(el).attr("src") || "")).first().attr("src"));
    let structured: Record<string, unknown> = {};
    $("script[type='application/ld+json']").each((_, element) => {
      try {
        const parsed = JSON.parse($(element).text()) as Record<string, unknown> | Record<string, unknown>[];
        const candidates = Array.isArray(parsed) ? parsed : [parsed];
        const found = candidates.find((item) => /book|product/i.test(String(item["@type"] ?? "")));
        if (found) structured = found;
      } catch { /* Ignore malformed structured metadata. */ }
    });
    const textValue = (value: unknown) => typeof value === "string" ? value.trim() : "";
    const publisherValue = structured.publisher && typeof structured.publisher === "object" ? textValue((structured.publisher as Record<string, unknown>).name) : textValue(structured.publisher);
    const date = textValue(structured.datePublished) || meta("article:published_time");
    const isbn = textValue(structured.isbn);
    const pages = Number(structured.numberOfPages) || undefined;
    const subjects = Array.isArray(structured.genre) ? structured.genre.filter((item): item is string => typeof item === "string") : textValue(structured.genre) ? [textValue(structured.genre)] : [];
    const description = textValue(structured.description) || subtitle || $("[class*='description'], [class*='introduction'], [itemprop='description']").first().text().replace(/\s+/g, " ").trim();
    const publisherFromPage = $("[itemprop='publisher'], [class*='publisher']").first().text().replace(/\s+/g, " ").trim();
    const isbnFromPage = $("[itemprop='isbn'], [class*='isbn']").first().text().replace(/\s+/g, " ").trim();
    const pagesFromPage = $("[itemprop='numberOfPages'], [class*='page-count']").first().text().replace(/\D/g, "");
    const detailFields: Partial<Book> = {
      description,
      publisher: publisherValue || publisherFromPage || undefined,
      publishedDate: date || undefined,
      year: date.match(/\d{4}/) ? Number(date.match(/\d{4}/)?.[0]) : undefined,
      isbn: isbn || isbnFromPage || undefined,
      pageCount: pages || Number(pagesFromPage) || undefined,
      subjects: subjects.length ? subjects : undefined,
      mainCategory: subjects[0],
    };
    return toPersianBook(id, title, author, cover, subtitle, detailFields);
  } catch { return null; }
}

/** Read-only search of public Iranketab book listings. */
export async function searchIranketabBooks(query: string, limit = 12): Promise<{ books: Book[]; total: number }> {
  const cleanQuery = query.trim();
  if (!cleanQuery || /^(subject:|isbn:)/i.test(cleanQuery)) return { books: [], total: 0 };

  try {
    const url = `${SITE}/result/${encodeURIComponent(cleanQuery)}?t=${encodeURIComponent("کتاب")}`;
    const response = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "KetabinoBookDiscovery/1.0 (read-only book search)",
      },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { books: [], total: 0 };

    const html = await response.text();
    const $ = cheerio.load(html);
    const root = $(`[page-search-result]`);
    const totalText = $("span").filter((_, el) => /\d[\d۰-۹٬,]*\s*مورد/.test($(el).text())).first().text();
    const digits = totalText.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/\D/g, "");
    const total = digits ? Number(digits) : 0;
    const books: Book[] = [];
    root.find("a[href^='/book/']").each((_, element) => {
      if (books.length >= Math.min(24, Math.max(1, limit))) return;
      const card = $(element);
      const href = card.attr("href") || "";
      const id = toBookId(href);
      if (!id || books.some((book) => book.id === `iranketab-${id}`)) return;
      const title = card.find("div.truncate.text-primary").first().text().trim() || card.find("div.truncate").first().text().trim() || card.find("img").attr("alt")?.split("|")[0]?.trim() || "کتاب بدون عنوان";
      const subtitle = card.find("div.text-xs").first().text().trim();
      const author = card.find("div.text-sm").first().text().trim();
      const imageNode = card.find("img").first();
      const image = imageNode.attr("src") || imageNode.attr("data-src") || imageNode.attr("data-lazy-src") || imageNode.attr("data-original") || imageNode.attr("srcset")?.split(",")[0]?.trim().split(" ")[0];
      const coverImage = normalizeCover(image);
      books.push(toPersianBook(id, title, author, coverImage, subtitle));
    });
    return { books, total: Math.max(total, books.length) };
  } catch {
    return { books: [], total: 0 };
  }
}

