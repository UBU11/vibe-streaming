export interface MangaData {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  status: string;
  year: number | null;
}

export interface ChapterData {
  id: string;
  chapter: string;
  volume: string;
  title: string | null;
  pages: number;
  externalUrl: string | null;
}

interface MangadexAttributes {
  title: Record<string, string>;
  description: Record<string, string>;
  status: string;
  year: number | null;
}

interface MangadexRelationship {
  type: string;
  attributes?: { fileName?: string };
}

export interface MangadexRawManga {
  id: string;
  attributes: MangadexAttributes;
  relationships: MangadexRelationship[];
}

export interface MangadexRawChapter {
  id: string;
  attributes: {
    chapter?: string | null;
    volume?: string | null;
    title?: string | null;
    pages?: number;
    externalUrl?: string | null;
  };
}

export interface MangaListResponse {
  data: MangadexRawManga[];
}

export interface ChapterListResponse {
  data: MangadexRawChapter[];
}
