import { NextResponse } from "next/server";
import { getSeasonDetails } from "@/lib/tmdb";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string, seasonNumber: string }> }) {
  const { id, seasonNumber } = await params;

  try {
    const season = await getSeasonDetails(id, seasonNumber);

    return NextResponse.json({
      success: true,
      data: season,
    });
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} for show ${id}:`, error);
    return NextResponse.json({ success: false, error: "Season not found" }, { status: 404 });
  }
}
