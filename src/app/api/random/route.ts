import { NextResponse } from "next/server";
import { discoverMedia } from "@/lib/tmdb";

export async function GET(request: Request) {
  try {
    // 1. Decide randomly whether to pick a movie or a TV show
    const type = Math.random() > 0.5 ? "movie" : "tv";

    // 2. TMDB allows up to 500 pages for discover. Pick a random page between 1 and 20 (to ensure quality)
    const randomPage = Math.floor(Math.random() * 20) + 1;

    // 3. Fetch the random page of results
    const data = await discoverMedia(type, {
      page: randomPage.toString(),
      sort_by: "popularity.desc",
      "vote_count.gte": "100", // Ensure it has some ratings so it's not complete garbage
    });

    if (!data || !data.results || data.results.length === 0) {
      // Fallback if something fails
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 4. Pick a random item from the results array (usually 20 items per page)
    const randomItem = data.results[Math.floor(Math.random() * data.results.length)];

    // 5. Construct the redirect URL
    const watchUrl = type === "movie" 
      ? `/watch/movie/${randomItem.id}` 
      : `/watch/show/${randomItem.id}`;

    // 6. Redirect the user!
    return NextResponse.redirect(new URL(watchUrl, request.url));
    
  } catch (error) {
    console.error("Error generating random title:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
