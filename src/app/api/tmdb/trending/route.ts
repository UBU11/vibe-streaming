import { NextResponse } from "next/server";
import { getTrendingMovies, getTrendingShows } from "@/lib/tmdb";
import type { TMDBMovie, TMDBShow } from "@/types/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  try {
    let movies: TMDBMovie[] = [];
    let shows: TMDBShow[] = [];

    if (type === "all" || type === "movie") {
      movies = await getTrendingMovies("day");
      // ensure media_type is set for mixed rows
      movies = movies.map(m => ({ ...m, media_type: "movie" }));
    }

    if (type === "all" || type === "tv") {
      shows = await getTrendingShows("day");
      shows = shows.map(s => ({ ...s, media_type: "tv" }));
    }

    return NextResponse.json({
      success: true,
      data: {
        movies,
        shows,
        all: [...movies, ...shows].sort((a, b) => b.vote_average - a.vote_average),
      },
    });
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch trending data" }, { status: 500 });
  }
}
