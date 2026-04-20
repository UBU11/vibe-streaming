import { NextResponse } from "next/server";
import { getShowDetails, getShowRecommendations } from "@/lib/tmdb";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [details, recommendations] = await Promise.all([
      getShowDetails(id),
      getShowRecommendations(id),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        details,
        recommendations: recommendations.map(r => ({ ...r, media_type: "tv" })),
      },
    });
  } catch (error) {
    console.error(`Error fetching show ${id}:`, error);
    return NextResponse.json({ success: false, error: "Show not found" }, { status: 404 });
  }
}
