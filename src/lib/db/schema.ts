import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─── Users & Profiles ─────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// ─── Video Catalog (Cached from Vidfast) ──────────────

export const videos = sqliteTable("videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: integer("duration").notNull().default(0),
  hlsManifestUrl: text("hls_manifest_url").notNull(),
  category: text("category").notNull().default("uncategorized"),
  tags: text("tags").notNull().default("[]"), // JSON array
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  vidfastId: text("vidfast_id").unique(),
});

// ─── Watch History ────────────────────────────────────

export const watchHistory = sqliteTable("watch_history", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  videoId: text("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  progress: real("progress").notNull().default(0), // seconds watched
  duration: real("duration").notNull().default(0), // total duration
  percentage: real("percentage").notNull().default(0), // 0-100
  lastWatchedAt: text("last_watched_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── User Library / Favourites ────────────────────────

export const userLibrary = sqliteTable("user_library", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  videoId: text("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  addedAt: text("added_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── API Usage Logging ────────────────────────────────

export const apiUsageLogs = sqliteTable("api_usage_logs", {
  id: text("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTimeMs: integer("response_time_ms").notNull(),
  calledAt: text("called_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  metadata: text("metadata"), // JSON blob for extra info
});
