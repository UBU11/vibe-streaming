import { NextResponse } from "next/server";
import { discoverMedia } from "@/lib/tmdb";

const MAX_DISCOVER_PAGE = 20;

export async function GET(request: Request) {
  try {
    const type = Math.random() > 0.5 ? "movie" : "tv";
    const randomPage = Math.floor(Math.random() * MAX_DISCOVER_PAGE) + 1;

    const data = await discoverMedia(type, {
      page: randomPage.toString(),
      sort_by: "popularity.desc",
      "vote_count.gte": "100", // require enough ratings to avoid obscure titles
    });

    const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
    if (!randomItem) return NextResponse.redirect(new URL("/", request.url));

    const watchUrl =
      type === "movie" ? `/watch/movie/${randomItem.id}` : `/watch/show/${randomItem.id}`;
    return NextResponse.redirect(new URL(watchUrl, request.url));
  } catch (error) {
    console.error("Error generating random title:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
