// src/lib/mangadex.ts

const MANGADEX_API_URL = "https://api.mangadex.org";
const MANGADEX_UPLOADS_URL = "https://uploads.mangadex.org";

export interface MangaData {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  status: string;
  year: number | null;
}

/**
 * Fetch top manga from MangaDex sorted by followedCount
 */
export async function getTopManga(limit: number = 20, offset: number = 0): Promise<MangaData[]> {
  try {
    const response = await fetch(
      `${MANGADEX_API_URL}/manga?includes[]=cover_art&order[followedCount]=desc&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&availableTranslatedLanguage[]=en`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((manga: any) => {
      // Extract title (usually EN, fallback to original or romanized)
      const titleObj = manga.attributes.title;
      const title = titleObj.en || titleObj["ja-ro"] || Object.values(titleObj)[0] || "Unknown Title";

      // Extract description
      const descObj = manga.attributes.description;
      const description = descObj.en || Object.values(descObj)[0] || "No description available.";

      // Extract cover art filename from relationships
      let coverFileName = null;
      const coverRel = manga.relationships.find((rel: any) => rel.type === "cover_art");
      if (coverRel && coverRel.attributes && coverRel.attributes.fileName) {
        coverFileName = coverRel.attributes.fileName;
      }

      // Construct cover URL
      const coverUrl = coverFileName
        ? `${MANGADEX_UPLOADS_URL}/covers/${manga.id}/${coverFileName}.512.jpg`
        : "/placeholder-thumb.svg";

      return {
        id: manga.id,
        title,
        description,
        coverUrl,
        status: manga.attributes.status,
        year: manga.attributes.year,
      };
    });
  } catch (error) {
    console.error("Failed to fetch top manga:", error);
    return [];
  }
}

export async function searchManga(query: string, limit: number = 20): Promise<MangaData[]> {
  try {
    const response = await fetch(
      `${MANGADEX_API_URL}/manga?title=${encodeURIComponent(query)}&includes[]=cover_art&order[relevance]=desc&limit=${limit}&contentRating[]=safe&contentRating[]=suggestive&availableTranslatedLanguage[]=en`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();

    return data.data.map((manga: any) => {
      const titleObj = manga.attributes.title;
      const title = titleObj.en || titleObj["ja-ro"] || Object.values(titleObj)[0] || "Unknown Title";

      const descObj = manga.attributes.description;
      const description = descObj.en || Object.values(descObj)[0] || "No description available.";

      let coverFileName = null;
      const coverRel = manga.relationships.find((rel: any) => rel.type === "cover_art");
      if (coverRel && coverRel.attributes && coverRel.attributes.fileName) {
        coverFileName = coverRel.attributes.fileName;
      }

      const coverUrl = coverFileName
        ? `${MANGADEX_UPLOADS_URL}/covers/${manga.id}/${coverFileName}.512.jpg`
        : "/placeholder-thumb.svg";

      return {
        id: manga.id,
        title,
        description,
        coverUrl,
        status: manga.attributes.status,
        year: manga.attributes.year,
      };
    });
  } catch (error) {
    console.error("Failed to search manga:", error);
    return [];
  }
}

export async function getMangaDetails(id: string): Promise<MangaData | null> {
  try {
    const response = await fetch(
      `${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const manga = data.data;

    const titleObj = manga.attributes.title;
    const title = titleObj.en || titleObj["ja-ro"] || Object.values(titleObj)[0] || "Unknown Title";

    const descObj = manga.attributes.description;
    const description = descObj.en || Object.values(descObj)[0] || "No description available.";

    let coverFileName = null;
    const coverRel = manga.relationships.find((rel: any) => rel.type === "cover_art");
    if (coverRel && coverRel.attributes && coverRel.attributes.fileName) {
      coverFileName = coverRel.attributes.fileName;
    }

    const coverUrl = coverFileName
      ? `${MANGADEX_UPLOADS_URL}/covers/${manga.id}/${coverFileName}.512.jpg`
      : "/placeholder-thumb.svg";

    return {
      id: manga.id,
      title,
      description,
      coverUrl,
      status: manga.attributes.status,
      year: manga.attributes.year,
    };
  } catch (error) {
    console.error("Failed to fetch manga details:", error);
    return null;
  }
}

export interface ChapterData {
  id: string;
  chapter: string;
  volume: string;
  title: string | null;
  pages: number;
  externalUrl: string | null;
}

export async function getMangaFeed(id: string): Promise<ChapterData[]> {
  try {
    let allChapters: any[] = [];
    let offset = 0;
    const limit = 500;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${MANGADEX_API_URL}/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=${limit}&offset=${offset}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Failed to fetch feed");
      const data = await response.json();
      
      allChapters = allChapters.concat(data.data);
      
      if (data.data.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return allChapters.map((chap: any) => ({
      id: chap.id,
      chapter: chap.attributes.chapter || "Oneshot",
      volume: chap.attributes.volume || "Unknown",
      title: chap.attributes.title || null,
      pages: chap.attributes.pages || 0,
      externalUrl: chap.attributes.externalUrl || null
    }));
  } catch (error) {
    console.error("Failed to fetch manga feed:", error);
    return [];
  }
}

export interface ChapterPagesData {
  baseUrl: string;
  hash: string;
  data: string[];
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${MANGADEX_API_URL}/at-home/server/${chapterId}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Failed to fetch chapter pages");
    const data = await response.json();

    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const files = data.chapter.data;

    // Construct full image URLs
    return files.map((file: string) => `${baseUrl}/data/${hash}/${file}`);
  } catch (error) {
    console.error("Failed to fetch chapter pages:", error);
    return [];
  }
}
