import type {
  ChapterData,
  ChapterListResponse,
  MangaData,
  MangaListResponse,
  MangadexRawChapter,
  MangadexRawManga,
} from "@/types/mangadex";

const MANGADEX_API_URL = "https://api.mangadex.org";
const MANGADEX_UPLOADS_URL = "https://uploads.mangadex.org";
const PLACEHOLDER_COVER = "/placeholder-thumb.svg";

function pickLocalized(record: Record<string, string>, fallback: string): string {
  return record.en || record["ja-ro"] || Object.values(record)[0] || fallback;
}

function transformManga(manga: MangadexRawManga): MangaData {
  const coverFileName = manga.relationships.find((rel) => rel.type === "cover_art")?.attributes?.fileName;

  return {
    id: manga.id,
    title: pickLocalized(manga.attributes.title, "Unknown Title"),
    description: pickLocalized(manga.attributes.description, "No description available."),
    coverUrl: coverFileName
      ? `${MANGADEX_UPLOADS_URL}/covers/${manga.id}/${coverFileName}.512.jpg`
      : PLACEHOLDER_COVER,
    status: manga.attributes.status,
    year: manga.attributes.year,
  };
}

async function fetchMangadex<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`MangaDex API error: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getTopManga(limit = 20, offset = 0): Promise<MangaData[]> {
  const url = `${MANGADEX_API_URL}/manga?includes[]=cover_art&order[followedCount]=desc&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&availableTranslatedLanguage[]=en`;
  try {
    const { data } = await fetchMangadex<MangaListResponse>(url);
    return data.map(transformManga);
  } catch (error) {
    console.error("Failed to fetch top manga:", error);
    return [];
  }
}

export async function searchManga(query: string, limit = 20): Promise<MangaData[]> {
  const url = `${MANGADEX_API_URL}/manga?title=${encodeURIComponent(query)}&includes[]=cover_art&order[relevance]=desc&limit=${limit}&contentRating[]=safe&contentRating[]=suggestive&availableTranslatedLanguage[]=en`;
  try {
    const { data } = await fetchMangadex<MangaListResponse>(url);
    return data.map(transformManga);
  } catch (error) {
    console.error("Failed to search manga:", error);
    return [];
  }
}

export async function getMangaDetails(id: string): Promise<MangaData | null> {
  try {
    const { data } = await fetchMangadex<{ data: MangadexRawManga }>(`${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art`);
    return transformManga(data);
  } catch (error) {
    console.error("Failed to fetch manga details:", error);
    return null;
  }
}

export async function getMangaFeed(id: string): Promise<ChapterData[]> {
  try {
    const chapters: MangadexRawChapter[] = [];
    const limit = 500;
    let offset = 0;
    let batch: MangadexRawChapter[];

    do {
      const { data } = await fetchMangadex<ChapterListResponse>(
        `${MANGADEX_API_URL}/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=${limit}&offset=${offset}`
      );
      batch = data;
      chapters.push(...batch);
      offset += limit;
    } while (batch.length === limit);

    return chapters.map((chap): ChapterData => ({
      id: chap.id,
      chapter: chap.attributes.chapter || "Oneshot",
      volume: chap.attributes.volume || "Unknown",
      title: chap.attributes.title || null,
      pages: chap.attributes.pages || 0,
      externalUrl: chap.attributes.externalUrl || null,
    }));
  } catch (error) {
    console.error("Failed to fetch manga feed:", error);
    return [];
  }
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  try {
    const { baseUrl, chapter } = await fetchMangadex<{
      baseUrl: string;
      chapter: { hash: string; data: string[] };
    }>(`${MANGADEX_API_URL}/at-home/server/${chapterId}`);
    return chapter.data.map((file) => `${baseUrl}/data/${chapter.hash}/${file}`);
  } catch (error) {
    console.error("Failed to fetch chapter pages:", error);
    return [];
  }
}
