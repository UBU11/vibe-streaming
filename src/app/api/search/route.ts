import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1;

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const results = await searchMulti(query, page);
    
    // Filter to only movies and shows, removing people
    const filteredResults = results.results.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv"
    );

    return NextResponse.json({
      success: true,
      data: filteredResults,
      page: results.page,
      totalPages: results.total_pages,
    });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
