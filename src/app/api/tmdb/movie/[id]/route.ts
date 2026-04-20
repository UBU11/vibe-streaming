import { NextResponse } from "next/server";
import { getMovieDetails, getMovieRecommendations } from "@/lib/tmdb";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [details, recommendations] = await Promise.all([
      getMovieDetails(id),
      getMovieRecommendations(id),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        details,
        recommendations: recommendations.map(r => ({ ...r, media_type: "movie" })),
      },
    });
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 });
  }
}
