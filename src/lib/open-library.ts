import type { Book } from "@/data/books";

export type OpenLibraryDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  subject?: string[];
  language?: string[];
  publisher?: string[];
  isbn?: string[];
  number_of_pages_median?: number;
  first_sentence?: string[];
};

type OpenLibraryWork = {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
  authors?: { author?: { key?: string } }[];
};

export function mapOpenLibraryDoc(doc: OpenLibraryDoc): Book {
  const id = doc.key.split("/").filter(Boolean).pop() ?? doc.key;
  const lang = doc.language?.[0];
  const subjects = doc.subject?.slice(0, 8) ?? [];
  return {
    id: `openlibrary-${id}`,
    title: doc.title || "کتاب بدون عنوان",
    author: doc.author_name?.join("، ") || "نویسنده نامشخص",
    category: /psychology|self.?help/i.test(subjects.join(" ")) ? "self-help" : /business|economics/i.test(subjects.join(" ")) ? "business" : /poetry/i.test(subjects.join(" ")) ? "poetry" : /history|philosophy/i.test(subjects.join(" ")) ? "history" : /children|juvenile/i.test(subjects.join(" ")) ? "children" : "fiction",
    description: doc.first_sentence?.[0] || "توضیحات این عنوان به‌زودی تکمیل می‌شود.",
    price: 0,
    color: "#dcebe1",
    accent: "#315e4d",
    coverTitle: doc.title || "Book",
    coverSubtitle: subjects[0] || "A good read",
    language: lang === "per" || lang === "fas" ? "فارسی" : lang === "eng" ? "انگلیسی" : lang || "نامشخص",
    sample: [],
    external: true,
    coverImage: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : doc.isbn?.[0] ? `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg?default=false` : undefined,
    year: doc.first_publish_year,
    publisher: doc.publisher?.[0],
    isbn: doc.isbn?.[0],
    pageCount: doc.number_of_pages_median,
    subjects,
    mainCategory: subjects[0],
    infoLink: `https://openlibrary.org${doc.key}`,
  };
}

export async function searchOpenLibraryBooks(query: string, limit = 24, offset = 0, lang = "all"): Promise<{ books: Book[]; total: number }> {
  const languageQuery = lang === "fa" ? "language:per" : lang === "en" ? "language:eng" : "";
  const searchQuery = [query || "book", languageQuery].filter(Boolean).join(" ");
  const params = new URLSearchParams({ q: searchQuery, limit: String(Math.min(40, Math.max(1, limit))), offset: String(Math.max(0, offset)), fields: "key,title,author_name,first_publish_year,cover_i,edition_count,subject,language,publisher,isbn,number_of_pages_median,first_sentence" });
  try {
    const headers = { Accept: "application/json", "User-Agent": "KetabinoBookDiscovery/1.0" };
    let response = await fetch(`https://openlibrary.org/search.json?${params}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000), headers });
    if (lang === "fa" && response.ok) {
      const filteredData = await response.json() as { docs?: OpenLibraryDoc[]; numFound?: number; num_found?: number };
      if (filteredData.docs?.length) return { books: filteredData.docs.map(mapOpenLibraryDoc), total: filteredData.numFound ?? filteredData.num_found ?? 0 };
      const fallbackParams = new URLSearchParams(params);
      fallbackParams.set("q", query || "book");
      response = await fetch(`https://openlibrary.org/search.json?${fallbackParams}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000), headers });
    }
    if (!response.ok) return { books: [], total: 0 };
    const data = await response.json() as { docs?: OpenLibraryDoc[]; numFound?: number; num_found?: number };
    const docs = data.docs ?? [];
    const books = docs.map(mapOpenLibraryDoc);
    return { books: lang === "fa" ? books.filter((book) => book.language === "فارسی") : books, total: data.numFound ?? data.num_found ?? 0 };
  } catch {
    return { books: [], total: 0 };
  }
}

export async function getOpenLibraryBook(id: string): Promise<Book | null> {
  const workId = id.replace(/^openlibrary-/, "");
  try {
    const response = await fetch(`https://openlibrary.org/works/${encodeURIComponent(workId)}.json`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000), headers: { Accept: "application/json", "User-Agent": "KetabinoBookDiscovery/1.0" } });
    if (!response.ok) return null;
    const work = await response.json() as OpenLibraryWork;
    const description = typeof work.description === "string" ? work.description : work.description?.value;
    const cover = work.covers?.find((item) => item > 0);
    let edition: { publishers?: string[]; publish_date?: string; number_of_pages?: number; isbn_13?: string[]; isbn_10?: string[]; languages?: { key?: string }[] } = {};
    try {
      const editionsResponse = await fetch(`https://openlibrary.org/works/${encodeURIComponent(workId)}/editions.json?limit=1`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000), headers: { Accept: "application/json", "User-Agent": "KetabinoBookDiscovery/1.0" } });
      if (editionsResponse.ok) {
        const editions = await editionsResponse.json() as { entries?: typeof edition[] };
        edition = editions.entries?.[0] ?? {};
      }
    } catch { /* Work details remain available if edition metadata is unavailable. */ }
    const authorKeys = (work.authors ?? []).map((entry) => entry.author?.key).filter((key): key is string => Boolean(key)).slice(0, 3);
    const authorNames = await Promise.all(authorKeys.map(async (key) => {
      try {
        const authorResponse = await fetch(`https://openlibrary.org${key}.json`, { next: { revalidate: 86400 }, headers: { Accept: "application/json", "User-Agent": "KetabinoBookDiscovery/1.0" } });
        if (!authorResponse.ok) return "";
        const author = await authorResponse.json() as { name?: string };
        return author.name ?? "";
      } catch { return ""; }
    }));
    return {
      id: `openlibrary-${workId}`,
      title: work.title || "کتاب بدون عنوان",
      author: authorNames.filter(Boolean).join("، ") || "نویسنده نامشخص",
      category: /psychology|self.?help/i.test((work.subjects ?? []).join(" ")) ? "self-help" : "fiction",
      description: description || "توضیحات این عنوان به‌زودی تکمیل می‌شود.",
      price: 0,
      color: "#dcebe1",
      accent: "#315e4d",
      coverTitle: work.title || "Book",
      coverSubtitle: work.subjects?.[0] || "A good read",
      language: edition.languages?.[0]?.key?.endsWith("/eng") ? "انگلیسی" : edition.languages?.[0]?.key?.endsWith("/per") ? "فارسی" : "نامشخص",
      sample: [],
      external: true,
      coverImage: cover ? `https://covers.openlibrary.org/b/id/${cover}-L.jpg` : undefined,
      publishedDate: work.first_publish_date,
      publisher: edition.publishers?.[0],
      pageCount: edition.number_of_pages,
      isbn: edition.isbn_13?.[0] ?? edition.isbn_10?.[0],
      subjects: work.subjects?.slice(0, 12),
      mainCategory: work.subjects?.[0],
      infoLink: `https://openlibrary.org/works/${workId}`,
    };
  } catch {
    return null;
  }
}
