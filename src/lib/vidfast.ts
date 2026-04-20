import type {
  Video,
  VideoSearchResult,
  VidfastVideoResponse,
  VidfastSearchResponse,
} from "@/types";

const VIDFAST_BASE_URL =
  process.env.VIDFAST_BASE_URL ?? "https://api.vidfast.io/v1";
const VIDFAST_API_KEY = process.env.VIDFAST_API_KEY ?? "";

/**
 * Transform Vidfast API response to internal Video format
 */
function transformVideo(raw: VidfastVideoResponse): Video {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    thumbnailUrl: raw.thumbnail,
    duration: raw.duration,
    hlsManifestUrl: raw.sources.hls,
    category: raw.category,
    tags: raw.tags,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Make an authenticated request to the Vidfast API
 */
async function vidfastFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const startTime = Date.now();
  const url = `${VIDFAST_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VIDFAST_API_KEY}`,
      ...options.headers,
    },
  });

  const responseTimeMs = Date.now() - startTime;

  if (!response.ok) {
    throw new Error(
      `Vidfast API error: ${response.status} ${response.statusText} (${responseTimeMs}ms)`
    );
  }

  return response.json();
}

/**
 * Fetch a single video by ID
 */
export async function getVideo(id: string): Promise<Video> {
  const raw = await vidfastFetch<VidfastVideoResponse>(`/videos/${id}`);
  return transformVideo(raw);
}

/**
 * Search videos by query
 */
export async function searchVideos(
  query: string,
  cursor?: string
): Promise<VideoSearchResult> {
  const params = new URLSearchParams({ q: query });
  if (cursor) params.set("cursor", cursor);

  const raw = await vidfastFetch<VidfastSearchResponse>(
    `/videos/search?${params.toString()}`
  );

  return {
    videos: raw.results.map(transformVideo),
    nextCursor: raw.next_cursor,
    totalResults: raw.total,
  };
}

/**
 * Fetch trending / popular videos
 */
export async function getTrendingVideos(): Promise<Video[]> {
  const raw = await vidfastFetch<VidfastSearchResponse>("/videos/trending");
  return raw.results.map(transformVideo);
}

/**
 * Fetch videos by category
 */
export async function getVideosByCategory(
  category: string,
  cursor?: string
): Promise<VideoSearchResult> {
  const params = new URLSearchParams({ category });
  if (cursor) params.set("cursor", cursor);

  const raw = await vidfastFetch<VidfastSearchResponse>(
    `/videos?${params.toString()}`
  );

  return {
    videos: raw.results.map(transformVideo),
    nextCursor: raw.next_cursor,
    totalResults: raw.total,
  };
}
