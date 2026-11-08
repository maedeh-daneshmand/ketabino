import { searchGoogleBooks } from "@/lib/google-books";
import { searchOpenLibraryBooks } from "@/lib/open-library";
import { searchIranketabBooks } from "@/lib/iranketab";

async function addGoogleCoverImages<T extends { isbn?: string; coverImage?: string }>(books: T[]): Promise<T[]> {
  const withIsbn = books.filter((book) => book.isbn).slice(0, 35);
  if (!withIsbn.length) return books;
  try {
    const bibkeys = [...new Set(withIsbn.map((book) => `ISBN:${book.isbn}`))].join(",");
    const params = new URLSearchParams({ bibkeys, jscmd: "viewapi", callback: "ketabino" });
    const response = await fetch(`https://books.google.com/books?${params}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
    if (!response.ok) return books;
    const body = await response.text();
    const jsonp = body.match(/^[^(]+\(([\s\S]*)\)\s*;?\s*$/);
    if (!jsonp?.[1]) return books;
    const covers = JSON.parse(jsonp[1]) as Record<string, { thumbnail_url?: string }>;
    return books.map((book) => {
      if (!book.isbn) return book;
      const cover = covers[`ISBN:${book.isbn}`]?.thumbnail_url;
      return cover ? { ...book, coverImage: cover.replace(/^http:/, "https:") } : book;
    });
  } catch {
    return books;
  }
}

async function findGoogleCoverByTitle<T extends { title: string; author: string; coverImage?: string }>(books: T[]): Promise<T[]> {
  const missing = books.filter((book) => !book.coverImage).slice(0, 8);
  if (!missing.length) return books;

  const resolved = await Promise.all(missing.map(async (book) => {
    try {
      const params = new URLSearchParams({
        q: `intitle:${book.title} inauthor:${book.author}`,
        maxResults: "5",
        printType: "books",
      });
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) return [book, undefined] as const;
      const data = await response.json() as { items?: { volumeInfo?: { title?: string; authors?: string[]; imageLinks?: { extraLarge?: string; large?: string; medium?: string; thumbnail?: string } } }[] };
      const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      const expectedTitle = normalize(book.title);
      const expectedAuthor = normalize(book.author);
      const match = data.items?.find((item) => {
        const info = item.volumeInfo;
        if (!info?.imageLinks) return false;
        const actualTitle = normalize(info.title ?? "");
        const actualAuthors = normalize((info.authors ?? []).join(" "));
        return (actualTitle === expectedTitle || actualTitle.includes(expectedTitle) || expectedTitle.includes(actualTitle))
          && (!expectedAuthor || actualAuthors.includes(expectedAuthor) || expectedAuthor.includes(actualAuthors));
      });
      const image = match?.volumeInfo?.imageLinks?.extraLarge ?? match?.volumeInfo?.imageLinks?.large
        ?? match?.volumeInfo?.imageLinks?.medium ?? match?.volumeInfo?.imageLinks?.thumbnail;
      return [book, image?.replace(/^http:/, "https:").replace("&edge=curl", "")] as const;
    } catch {
      return [book, undefined] as const;
    }
  }));

  const covers = new Map(resolved.filter((entry): entry is readonly [T, string] => Boolean(entry[1])).map(([book, cover]) => [book, cover]));
  return books.map((book) => covers.has(book) ? { ...book, coverImage: covers.get(book) } : book);
}

export async function searchBookCatalog(query: string, options: { maxResults?: number; startIndex?: number; lang?: string } = {}) {
  const searchTerm = query.trim() || "subject:fiction";
  const includeIranian = options.lang !== "en";
  const iranTerm = /^(subject:|isbn:)/i.test(searchTerm) ? ({ "subject:fiction": "رمان", "subject:self-help": "روانشناسی", "subject:business": "مدیریت", "subject:poetry": "شعر", "subject:history": "تاریخ", "subject:juvenile_fiction": "کتاب کودک" }[searchTerm.toLowerCase()] || "کتاب") : searchTerm;
  const [iran, google, openLibrary] = await Promise.all([
    includeIranian ? searchIranketabBooks(iranTerm, options.maxResults ?? 24) : Promise.resolve({ books: [], total: 0 }),
    searchGoogleBooks(searchTerm, { ...options, lang: options.lang === "fa" ? "fa" : options.lang === "en" ? "en" : "all" }),
    searchOpenLibraryBooks(searchTerm, options.maxResults, options.startIndex, options.lang),
  ]);
  const seen = new Set<string>();
  const merged = [...iran.books, ...google.books, ...openLibrary.books].filter((book) => {
    const key = `${book.title.trim().toLocaleLowerCase()}::${book.author.trim().toLocaleLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const booksWithIsbnCovers = await addGoogleCoverImages(merged.slice(0, options.maxResults ?? 24));
  const booksWithTitleCovers = await findGoogleCoverByTitle(booksWithIsbnCovers);
  const books = booksWithTitleCovers.map((book) => book.external && !book.price ? { ...book, price: 89000 + (book.title.length * 13000 % 142000) } : book);
  return { books, total: iran.total + google.total + openLibrary.total, source: "Iranketab + Google Books + Open Library" as const };
}
