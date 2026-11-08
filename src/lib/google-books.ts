import type { Book } from "@/data/books";

type GoogleVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string; small?: string; medium?: string; large?: string; extraLarge?: string };
    language?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    previewLink?: string;
    infoLink?: string;
    subtitle?: string;
    mainCategory?: string;
    averageRating?: number;
    ratingsCount?: number;
    printType?: string;
    dimensions?: { height?: string; width?: string; thickness?: string };
    maturityRating?: string;
  };
  saleInfo?: {
    saleability?: string;
    retailPrice?: { amount?: number; currencyCode?: string };
  };
  accessInfo?: {
    viewability?: "PARTIAL" | "ALL_PAGES" | "NO_PAGES" | "UNKNOWN";
    embeddable?: boolean;
    accessViewStatus?: string;
    webReaderLink?: string;
    publicDomain?: boolean;
  };
};

const categoryMap: [RegExp, string][] = [
  [/fiction|novel|literature|داستان|رمان/i, "fiction"],
  [/psychology|self.help|self.improvement|روان|توسعه فردی/i, "self-help"],
  [/business|economics|management|کسب.?و.?کار|مدیریت/i, "business"],
  [/poetry|poems|شعر/i, "poetry"],
  [/history|philosophy|تاریخ|فلسفه/i, "history"],
  [/juvenile|children|young adult|کودک|نوجوان/i, "children"],
];

export function mapGoogleVolume(volume: GoogleVolume): Book {
  const info = volume.volumeInfo ?? {};
  const title = info.title?.trim() || "کتاب بدون عنوان";
  const author = info.authors?.join("، ") || "نویسنده نامشخص";
  const subjects = info.categories ?? [];
  const subjectText = [info.mainCategory, ...subjects].filter(Boolean).join(" ");
  const category = categoryMap.find(([pattern]) => pattern.test(subjectText))?.[1] ?? "fiction";
  const description = info.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "توضیحات این عنوان به‌زودی تکمیل می‌شود.";
  const isbn = info.industryIdentifiers?.find((item) => item.type === "ISBN_13")?.identifier
    ?? info.industryIdentifiers?.find((item) => item.type === "ISBN_10")?.identifier;
  const rawImage = info.imageLinks?.extraLarge ?? info.imageLinks?.large ?? info.imageLinks?.medium ?? info.imageLinks?.small ?? info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;
  const coverImage = rawImage?.replace(/^http:/, "https:").replace("&edge=curl", "")
    ?? (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : undefined);
  const yearMatch = info.publishedDate?.match(/\d{4}/);
  const year = yearMatch ? Number(yearMatch[0]) : undefined;
  const language = info.language?.toLowerCase().startsWith("en") ? "انگلیسی" : info.language?.toLowerCase().startsWith("fa") ? "فارسی" : info.language || "نامشخص";

  return {
    id: `google-${volume.id}`,
    title,
    author,
    category,
    description,
    price: 0,
    color: "#dcebe1",
    accent: "#315e4d",
    coverTitle: title,
    coverSubtitle: subjects[0] ?? "A good read",
    subtitle: info.subtitle,
    year,
    publisher: info.publisher,
    language,
    sample: [description, "برای آشنایی بیشتر با این کتاب، جزئیات آن را در کتابینو ببین."],
    external: true,
    coverImage,
    isbn,
    pageCount: info.pageCount,
    publishedDate: info.publishedDate,
    previewLink: info.previewLink,
    infoLink: info.infoLink,
    subjects,
    mainCategory: info.mainCategory,
    averageRating: info.averageRating,
    ratingsCount: info.ratingsCount,
    printType: info.printType,
    dimensions: info.dimensions,
    maturityRating: info.maturityRating,
    sourcePrice: volume.saleInfo?.saleability === "FOR_SALE" ? volume.saleInfo.retailPrice?.amount : undefined,
    sourceCurrency: volume.saleInfo?.retailPrice?.currencyCode,
    previewAvailable: volume.accessInfo?.viewability === "PARTIAL" || volume.accessInfo?.viewability === "ALL_PAGES",
    previewEmbeddable: volume.accessInfo?.embeddable === true,
    previewViewability: volume.accessInfo?.viewability,
  };
}

function googleBooksApiUrl(path: string, params?: URLSearchParams) {
  const query = new URLSearchParams(params);
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) query.set("key", apiKey);
  const suffix = query.size ? `?${query.toString()}` : "";
  return `https://www.googleapis.com/books/v1/${path}${suffix}`;
}

export async function searchGoogleBooks(query: string, options: { maxResults?: number; startIndex?: number; orderBy?: "relevance" | "newest"; lang?: string } = {}): Promise<{ books: Book[]; total: number }> {
  const params = new URLSearchParams({ q: query, maxResults: String(Math.min(40, Math.max(1, options.maxResults ?? 24))), startIndex: String(Math.max(0, options.startIndex ?? 0)), printType: "books", orderBy: options.orderBy ?? "relevance" });
  if (options.lang && options.lang !== "all") params.set("langRestrict", options.lang);
  try {
    const response = await fetch(googleBooksApiUrl("volumes", params), { next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000), headers: { Accept: "application/json" } });
    if (!response.ok) return { books: [], total: 0 };
    const data = await response.json() as { items?: GoogleVolume[]; totalItems?: number };
    return { books: (data.items ?? []).map(mapGoogleVolume), total: data.totalItems ?? 0 };
  } catch {
    return { books: [], total: 0 };
  }
}

export async function getGoogleBook(id: string): Promise<Book | null> {
  const volumeId = id.startsWith("google-") ? id.slice("google-".length) : id;
  try {
    const response = await fetch(googleBooksApiUrl(`volumes/${encodeURIComponent(volumeId)}`), {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const volume = await response.json() as GoogleVolume;
    return volume.volumeInfo ? mapGoogleVolume(volume) : null;
  } catch {
    return null;
  }
}

/** Find the richest matching public record when a catalogue entry has only basic card data. */
export async function findGoogleBookDetails(title: string, author: string): Promise<Book | null> {
  const queries = [`intitle:${title} inauthor:${author}`, `intitle:${title}`];
  for (const query of queries) {
    const result = await searchGoogleBooks(query, { maxResults: 8 });
    const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const expectedTitle = normalize(title);
    const expectedAuthor = normalize(author);
    const match = result.books.find((item) => {
      const actualTitle = normalize(item.title);
      const actualAuthor = normalize(item.author);
      const titleMatches = actualTitle === expectedTitle || actualTitle.includes(expectedTitle) || expectedTitle.includes(actualTitle);
      const authorMatches = !expectedAuthor || actualAuthor.includes(expectedAuthor) || expectedAuthor.includes(actualAuthor);
      return titleMatches && authorMatches;
    });
    if (match) return match;
  }
  return null;
}
