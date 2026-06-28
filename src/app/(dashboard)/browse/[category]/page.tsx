import React from "react";
import { discoverMedia } from "@/lib/tmdb";
import { getMediaTitle, getMediaYear } from "@/lib/media";
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
  
  let type: "movie" | "tv" = "movie";
  const apiParams: Record<string, string> = {
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

  // Anime already constrains to genre 16; combine rather than overwrite.
  if (genre) {
    apiParams.with_genres = category === "anime" ? `16,${genre}` : genre;
  }

  const data = await discoverMedia(type, apiParams);

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
            {data.results.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={getMediaTitle(item)}
                posterPath={item.poster_path}
                type={type}
                voteAverage={item.vote_average}
                year={getMediaYear(item)}
              />
            ))}
          </div>

          {/* Pagination */}
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
