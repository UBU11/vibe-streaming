import React from "react";
import Link from "next/link";
import MediaRow from "@/components/MediaRow";
import { getTrendingMovies, getTrendingShows, getGenres, getMediaVideos } from "@/lib/tmdb";
import GenreBadge from "@/components/GenreBadge";
import Marquee from "@/components/Marquee";
import HeroSlider, { HeroSlideItem } from "@/components/HeroSlider";
import type { TMDBShow } from "@/types/tmdb";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function buildHeroItems(shows: TMDBShow[]): Promise<HeroSlideItem[]> {
  return Promise.all(
    shows.slice(0, 10).map(async (show) => {
      const videos = await safe(() => getMediaVideos(show.id, "tv"), []);
      const trailer =
        videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        videos.find((v) => v.site === "YouTube");
      return {
        id: show.id,
        title: show.name || "Unknown Title",
        overview: show.overview,
        backdropPath: show.backdrop_path,
        trailerKey: trailer ? trailer.key : null,
        type: "tv" as const,
      };
    })
  );
}

export default async function HomePage() {
  const [movies, shows, movieGenres] = await Promise.all([
    safe(() => getTrendingMovies("day"), []),
    safe(() => getTrendingShows("day"), []),
    safe(() => getGenres("movie"), []),
  ]);

  const sliderItems = shows.length > 0 ? await buildHeroItems(shows) : [];
  const nothingLoaded = movies.length === 0 && shows.length === 0 && movieGenres.length === 0;

  return (
    <>
      {sliderItems.length > 0 && <HeroSlider items={sliderItems} />}

      <Marquee items={["★★★ TRENDING NOW", "BLOCKBUSTER HITS", "BINGE-WORTHY SERIES", "NEW RELEASES", "EPIC ADVENTURES ★★★"]} />

      <div className="content">
        {nothingLoaded ? (
          <div className="empty-state" style={{ minHeight: "50vh", marginTop: "80px" }}>
            <h2 className="empty-state__title" style={{ color: "var(--color-danger)" }}>
              COULDN&apos;T REACH TMDB
            </h2>
            <p className="empty-state__text" style={{ maxWidth: "640px", margin: "0 auto 24px" }}>
              The connection to TMDB was blocked or reset. This is usually a network/ISP block or
              bot-filtering on Node connections — try a VPN or a different network, then retry.
            </p>
            <Link href="/" className="btn btn--primary btn--lg">Retry</Link>
          </div>
        ) : (
          <>
            {shows.length > 0 && <MediaRow title="Trending TV Shows" items={shows} type="tv" />}
            {movies.length > 0 && <MediaRow title="Trending Movies" items={movies} type="movie" />}

            {movieGenres.length > 0 && (
              <section style={{ marginTop: "60px" }}>
                <div className="section-header">
                  <h2 className="section-header__title">Browse Genres</h2>
                </div>
                <div className="genre-tags">
                  {movieGenres.slice(0, 15).map((g) => (
                    <GenreBadge key={g.id} id={g.id} name={g.name} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
