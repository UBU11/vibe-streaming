import {
  TMDBMovieDetails,
  TMDBResponse,
  TMDBMovie,
  TMDBShow,
  TMDBShowDetails,
  TMDBSeasonDetails,
  TMDBGenre,
} from "@/types/tmdb";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim() || "";

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  retries = 6
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not set. Please add it to your .env.local file.");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  if (!params.language) url.searchParams.append("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      // Cache at the framework level (1h). TMDB metadata changes slowly, and
      // `no-store` forced a fresh network fetch on EVERY navigation — which is
      // what turned TMDB/Cloudfront's frequent connection resets into full-page
      // 500s ("lost the API connection on route change"). Cached reads skip the
      // network entirely, so moving between sections is stable.
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (retries <= 0) throw error;
    // ponytail: TMDB/Cloudfront resets ~60% of Node connections here (ECONNRESET)
    // — only on a cache miss, since cached reads skip the network. Exponential
    // backoff (capped) rides through the drops; a hard block (ISP) can't be
    // retried away, and callers degrade gracefully.
    await new Promise((resolve) => setTimeout(resolve, Math.min(1500, 250 * 2 ** (6 - retries))));
    return tmdbFetch(endpoint, params, retries - 1);
  }
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "day"): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`);
  return data.results;
}

export async function getTrendingShows(timeWindow: "day" | "week" = "day"): Promise<TMDBShow[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBShow>>(`/trending/tv/${timeWindow}`);
  return data.results;
}

export async function getMovieDetails(id: string | number): Promise<TMDBMovieDetails> {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${id}`);
}

export async function getShowDetails(id: string | number): Promise<TMDBShowDetails> {
  return tmdbFetch<TMDBShowDetails>(`/tv/${id}`);
}

export async function getSeasonDetails(
  showId: string | number,
  seasonNumber: string | number
): Promise<TMDBSeasonDetails> {
  return tmdbFetch<TMDBSeasonDetails>(`/tv/${showId}/season/${seasonNumber}`);
}

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch<TMDBResponse<TMDBMovie | TMDBShow>>(`/search/multi`, {
    query,
    page: page.toString(),
  });
}

export async function getMovieRecommendations(id: string | number): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBMovie>>(`/movie/${id}/recommendations`);
  return data.results;
}

export async function getShowRecommendations(id: string | number): Promise<TMDBShow[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBShow>>(`/tv/${id}/recommendations`);
  return data.results;
}

export async function getGenres(type: "movie" | "tv" = "movie"): Promise<TMDBGenre[]> {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>(`/genre/${type}/list`);
  return data.genres;
}

export async function discoverMedia(
  type: "movie" | "tv",
  params: Record<string, string> = {}
): Promise<TMDBResponse<TMDBMovie | TMDBShow>> {
  return tmdbFetch<TMDBResponse<TMDBMovie | TMDBShow>>(`/discover/${type}`, params);
}

export async function getMediaVideos(
  id: string | number,
  type: "movie" | "tv"
): Promise<{ key: string; type: string; site: string }[]> {
  // Swallow failures so a missing videos block never breaks the page; callers fall back to the still image.
  try {
    const data = await tmdbFetch<{ results: { key: string; type: string; site: string }[] }>(
      `/${type}/${id}/videos`
    );
    return data.results;
  } catch {
    return [];
  }
}

export function getTmdbImageUrl(path: string | null, size: "w500" | "original" = "w500"): string {
  if (!path) return "/placeholder-thumb.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
