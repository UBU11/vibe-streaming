import {
  TMDBMovieDetails,
  TMDBResponse,
  TMDBMovie,
  TMDBShow,
  TMDBShowDetails,
  TMDBSeasonDetails,
  TMDBGenre,
} from "@/types/tmdb";

// Removed mock data imports as requested to enforce strict real-data architecture
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim() || ""; 

/**
 * Make an authenticated request to the TMDB API
 */
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}, retries: number = 3): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not set. Please add it to your .env.local file.");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  
  // Enforce English titles and descriptions
  if (!params.language) {
    url.searchParams.append("language", "en-US");
  }

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`TMDB fetch failed, retrying... (${retries} retries left)`);
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return tmdbFetch(endpoint, params, retries - 1);
    }
    throw error;
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
  return await tmdbFetch<TMDBMovieDetails>(`/movie/${id}`);
}

export async function getShowDetails(id: string | number): Promise<TMDBShowDetails> {
  return await tmdbFetch<TMDBShowDetails>(`/tv/${id}`);
}

export async function getSeasonDetails(showId: string | number, seasonNumber: string | number): Promise<TMDBSeasonDetails> {
  return await tmdbFetch<TMDBSeasonDetails>(`/tv/${showId}/season/${seasonNumber}`);
}

export async function searchMulti(query: string, page: number = 1) {
  return await tmdbFetch<TMDBResponse<TMDBMovie | TMDBShow>>(`/search/multi`, {
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
  return await tmdbFetch<TMDBResponse<TMDBMovie | TMDBShow>>(`/discover/${type}`, params);
}

export async function getMediaVideos(id: string | number, type: "movie" | "tv"): Promise<{ key: string, type: string, site: string }[]> {
  try {
    const data = await tmdbFetch<{ results: { key: string, type: string, site: string }[] }>(`/${type}/${id}/videos`);
    return data.results;
  } catch {
    // Return empty if videos fail to load so the app doesn't crash, we'll just fall back to the image
    return [];
  }
}

export function getTmdbImageUrl(path: string | null, size: "w500" | "original" = "w500"): string {
  if (!path) return "/placeholder-thumb.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
