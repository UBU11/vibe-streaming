import type { Metadata } from "next";
import { searchMulti } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";

export const metadata: Metadata = { title: "Search — Vibe", description: "Search for movies and TV shows on Vibe" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query = "" } = await searchParams;
  
  let results: any[] = [];
  if (query) {
    const data = await searchMulti(query, 1);
    results = data.results.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv"
    );
  }

  return (
    <div className="content" style={{ paddingTop: 120 }}>
      <div className="page-header">
        <h1 className="page-header__title">{query ? `Results for "${query}"` : "Search"}</h1>
        <p className="page-header__subtitle">Find your next favourite movie or series</p>
      </div>

      {!query ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h2 className="empty-state__title">Start Searching</h2>
          <p className="empty-state__text">Type a query in the search bar to discover content.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state__title">No results found</h2>
          <p className="empty-state__text">We couldn't find anything for "{query}". Try a different search term.</p>
        </div>
      ) : (
        <div className="media-grid">
          {results.map((item) => (
            <MediaCard
              key={`${item.media_type}-${item.id}`}
              id={item.id}
              title={item.title || item.name}
              posterPath={item.poster_path}
              type={item.media_type as "movie" | "tv"}
              voteAverage={item.vote_average}
              releaseDate={item.release_date || item.first_air_date}
            />
          ))}
        </div>
      )}
    </div>
  );
}
