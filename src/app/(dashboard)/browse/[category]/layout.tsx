import React from "react";
import Link from "next/link";
import { getGenres } from "@/lib/tmdb";
import "./browse.css"; // We'll create this

export default async function BrowseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  // Decide which genres to load based on category
  const genreType = category === "movies" ? "movie" : "tv";
  const genres = await getGenres(genreType);

  return (
    <div className="browse-page">
      <div className="browse-layout">
        {/* Sidebar */}
        <aside className="browse-sidebar">
          <h2 className="browse-sidebar__title">Categories</h2>
          <div className="browse-sidebar__links">
            <Link href="/browse/movies" className={`browse-sidebar__link ${category === 'movies' ? 'browse-sidebar__link--active' : ''}`}>
              🎬 Movies
            </Link>
            <Link href="/browse/shows" className={`browse-sidebar__link ${category === 'shows' ? 'browse-sidebar__link--active' : ''}`}>
              📺 TV Shows
            </Link>
            <Link href="/browse/anime" className={`browse-sidebar__link ${category === 'anime' ? 'browse-sidebar__link--active' : ''}`}>
              ⚔️ Anime
            </Link>
          </div>

          <h2 className="browse-sidebar__title" style={{ marginTop: '32px' }}>Genres</h2>
          <div className="browse-sidebar__genres">
            {/* Provide an "All" option to clear genre filter */}
            <Link href={`/browse/${category}`} className="browse-sidebar__genre-tag">
              All
            </Link>
            {genres.map((g) => (
              <Link 
                key={g.id} 
                href={`/browse/${category}?genre=${g.id}`} 
                className="browse-sidebar__genre-tag"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="browse-content">
          {children}
        </main>
      </div>
    </div>
  );
}
