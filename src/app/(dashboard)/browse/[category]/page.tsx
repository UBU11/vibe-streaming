import React from "react";
import { discoverMedia } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";

export default async function BrowseCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ genre?: string; page?: string }>;
}) {
  const { category } = await params;
  const { genre, page } = await searchParams;
  
  const currentPage = page ? parseInt(page) : 1;
  
  // Parse params
  let type: "movie" | "tv" = "movie";
  let apiParams: Record<string, string> = {
    page: currentPage.toString(),
  };

  let title = "Browse";

  if (category === "movies") {
    type = "movie";
    title = "Movies";
  } else if (category === "shows") {
    type = "tv";
    title = "TV Shows";
  } else if (category === "anime") {
    type = "tv";
    title = "Anime";
    apiParams.with_genres = "16"; // Animation
    apiParams.with_original_language = "ja"; // Japanese
  }

  // Apply genre filter if provided (and we aren't overriding it entirely for anime)
  if (genre && category !== "anime") {
    apiParams.with_genres = genre;
  } else if (genre && category === "anime") {
    // If anime + genre, combine them (16,genre_id)
    apiParams.with_genres = `16,${genre}`;
  }

  const data = await discoverMedia(type, apiParams);

  // Pagination URLs
  const searchParamsString = genre ? `?genre=${genre}&` : "?";
  const prevPageUrl = currentPage > 1 ? `/browse/${category}${searchParamsString}page=${currentPage - 1}` : null;
  const nextPageUrl = currentPage < data.total_pages ? `/browse/${category}${searchParamsString}page=${currentPage + 1}` : null;

  return (
    <div>
      <div className="page-header" style={{ textAlign: "left", marginBottom: "40px" }}>
        <h1 className="page-header__title" style={{ fontSize: "4rem" }}>{title}</h1>
      </div>

      {data.results.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state__title">Nothing Found</h2>
          <p className="empty-state__text">No {title.toLowerCase()} matched your filters.</p>
        </div>
      ) : (
        <>
          <div className="media-grid">
            {data.results.map((item: any) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                type={type}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "60px", padding: "20px", borderTop: "4px solid #000" }}>
            {prevPageUrl ? (
              <a href={prevPageUrl} className="btn btn--secondary btn--lg">
                &larr; Previous
              </a>
            ) : <div />}
            
            {nextPageUrl && (
              <a href={nextPageUrl} className="btn btn--primary btn--lg">
                Next Page &rarr;
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
