import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // TODO: Check Turso cache → fallback to Vidfast API (Agent.md §3.1)
    return NextResponse.json({
      success: true,
      data: {
        id,
        title: `Video ${id}`,
        description: "Connect Vidfast API to load video metadata",
        thumbnailUrl: "/placeholder-thumb.svg",
        duration: 0,
        hlsManifestUrl: "",
        category: "uncategorized",
        tags: [],
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
  }
}
