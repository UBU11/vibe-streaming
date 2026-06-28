import type { TMDBMedia } from "@/types/tmdb";

export function getMediaTitle(item: TMDBMedia): string {
  return "title" in item ? item.title : item.name;
}

export function getMediaYear(item: TMDBMedia): string {
  const date = "release_date" in item ? item.release_date : item.first_air_date;
  return date ? new Date(date).getFullYear().toString() : "";
}

export function getMediaType(item: TMDBMedia, hint?: "movie" | "tv"): "movie" | "tv" {
  if (item.media_type === "movie" || item.media_type === "tv") return item.media_type;
  if (hint) return hint;
  return "first_air_date" in item ? "tv" : "movie";
}
