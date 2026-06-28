import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, currentTime } = body;

    if (!videoId || currentTime === undefined) {
      return NextResponse.json({ success: false, error: "videoId and currentTime required" }, { status: 400 });
    }

    // TODO: Debounce via Upstash, then write to Turso (Agent.md §3.1)
    // const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    // await redis.set(`progress:${userId}:${videoId}`, { currentTime, duration, percentage }, { ex: 86400 });
    // Batch write to Turso periodically

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save progress" }, { status: 500 });
  }
}
