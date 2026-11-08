import type { Book } from "@/data/books";
import { mapGoogleVolume } from "@/lib/google-books";
import { mapOpenLibraryDoc, type OpenLibraryDoc } from "@/lib/open-library";

type GoogleVolume = Parameters<typeof mapGoogleVolume>[0];

export async function searchBooksFromBrowser(query: string, options: { limit?: number; language?: string } = {}): Promise<Book[]> {
  const limit = Math.min(40, Math.max(1, options.limit ?? 24));
  const language = options.language;
  const googleParams = new URLSearchParams({ q: query || "subject:fiction", maxResults: String(limit), printType: "books", orderBy: "relevance" });
  if (language === "انگلیسی") googleParams.set("langRestrict", "en");
  if (language === "فارسی") googleParams.set("langRestrict", "fa");

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${googleParams}`, { signal: AbortSignal.timeout(9000), headers: { Accept: "application/json" } });
    if (response.ok) {
      const data = await response.json() as { items?: GoogleVolume[] };
      const books = (data.items ?? []).map(mapGoogleVolume);
      if (books.length) return books;
    }
  } catch { /* Try the second public catalog from the browser. */ }

  try {
    const params = new URLSearchParams({ q: query || "subject:fiction", limit: String(limit), fields: "key,title,author_name,first_publish_year,cover_i,edition_count,subject,language,publisher,isbn,number_of_pages_median" });
    const response = await fetch(`https://openlibrary.org/search.json?${params}`, { signal: AbortSignal.timeout(9000), headers: { Accept: "application/json" } });
    if (!response.ok) return [];
    const data = await response.json() as { docs?: OpenLibraryDoc[] };
    return (data.docs ?? []).map(mapOpenLibraryDoc);
  } catch {
    return [];
  }
}
