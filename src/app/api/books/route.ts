import { NextRequest, NextResponse } from "next/server";
import { searchBookCatalog } from "@/lib/book-catalog";

const categorySubjects: Record<string, string> = {
  fiction: "fiction",
  "self-help": "self-help",
  business: "business",
  poetry: "poetry",
  history: "history",
  children: "juvenile_fiction",
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const category = request.nextUrl.searchParams.get("category") ?? "all";
  const language = request.nextUrl.searchParams.get("lang") ?? "all";
  const startIndex = Number(request.nextUrl.searchParams.get("start") ?? 0);
  const maxResults = Number(request.nextUrl.searchParams.get("limit") ?? 24);

  const terms = query || (categorySubjects[category] ? `subject:${categorySubjects[category]}` : "subject:fiction");
  const result = await searchBookCatalog(terms, { maxResults, startIndex, lang: language === "انگلیسی" ? "en" : language === "فارسی" ? "fa" : "all" });
  return NextResponse.json(result, { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=86400" } });
}
