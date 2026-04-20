import React from "react";
import { getTopManga, searchManga } from "@/lib/mangadex";
import MangaCard from "@/components/MangaCard";

export const metadata = {
  title: "Manga — Vibe",
  description: "Read the top trending manga from MangaDex in high quality.",
};

export default async function MangaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch either search results or top manga
  const topManga = query ? await searchManga(query) : await getTopManga(30, 0);

  return (
    <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="page-header" style={{ marginBottom: '60px' }}>
        <h1 className="page-header__title" style={{ color: 'var(--color-accent-2)' }}>VIBE MANGA</h1>
        <br />

      </div>

      <div className="content" style={{ padding: '0 40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Dynamic Search Bar */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
          <form action="/manga" method="GET" style={{ display: 'flex', width: '100%', maxWidth: '600px' }}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for manga..."
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '1.2rem',
                border: '4px solid #000',
                borderRadius: '8px 0 0 8px',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <button type="submit" style={{
              padding: '16px 32px',
              fontSize: '1.2rem',
              background: 'var(--color-accent-2)',
              color: '#fff',
              border: '4px solid #000',
              borderLeft: 'none',
              borderRadius: '0 8px 8px 0',
              cursor: 'pointer',
              fontWeight: 900
            }}>
              SEARCH
            </button>
          </form>
        </div>

        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h2 className="section-header__title">{query ? `Search Results for "${query}"` : "Top Rated Manga"}</h2>
        </div>

        {topManga.length > 0 ? (
          <div className="manga-grid">
            {topManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <h2 className="empty-state__title">No Manga Found</h2>
            <p className="empty-state__text">
              We couldn't find any manga matching your search, or the MangaDex servers are down.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
