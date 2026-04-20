// ─── Video Types ──────────────────────────────────────

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number; // seconds
  hlsManifestUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoSearchResult {
  videos: Video[];
  nextCursor: string | null;
  totalResults: number;
}

// ─── User Types ───────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

// ─── Watch Progress Types ─────────────────────────────

export interface WatchProgress {
  userId: string;
  videoId: string;
  progress: number; // seconds watched
  duration: number; // total duration
  percentage: number; // 0-100
  lastWatchedAt: string;
}

// ─── Library Types ────────────────────────────────────

export interface LibraryItem {
  userId: string;
  videoId: string;
  addedAt: string;
  video?: Video;
}

// ─── API Response Types ───────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  totalResults: number;
}

// ─── Vidfast API Types ────────────────────────────────

export interface VidfastVideoResponse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  sources: {
    hls: string;
    dash?: string;
  };
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface VidfastSearchResponse {
  results: VidfastVideoResponse[];
  next_cursor: string | null;
  total: number;
}

// ─── Player Types ─────────────────────────────────────

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  quality: string;
  buffered: number;
}

export type PlayerAction =
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SEEK"; time: number }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_QUALITY"; quality: string }
  | { type: "UPDATE_TIME"; time: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SET_BUFFERED"; buffered: number };

// ─── Category Types ───────────────────────────────────

export interface Category {
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
}
