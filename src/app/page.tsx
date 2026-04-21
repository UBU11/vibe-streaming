import React from "react";
import Link from "next/link";
import MediaRow from "@/components/MediaRow";
import { getTrendingMovies, getTrendingShows, getGenres, getMediaVideos } from "@/lib/tmdb";
import GenreBadge from "@/components/GenreBadge";
import Marquee from "@/components/Marquee";
import HeroSlider, { HeroSlideItem } from "@/components/HeroSlider";

export default async function HomePage() {
  const [movies, shows, movieGenres, tvGenres] = await Promise.all([
    getTrendingMovies("day"),
    getTrendingShows("day"),
    getGenres("movie"),
    getGenres("tv"),
  ]);

  // Fetch trailers for the top 10 trending shows
  const top10Shows = shows.slice(0, 10);
  const sliderItems: HeroSlideItem[] = await Promise.all(
    top10Shows.map(async (show) => {
      const videos = await getMediaVideos(show.id, "tv");
      // Find the first YouTube trailer, fallback to any YouTube video if no trailer
      const trailer = videos.find((v) => v.site === "YouTube" && v.type === "Trailer") 
                   || videos.find((v) => v.site === "YouTube");
                   
      return {
        id: show.id,
        title: show.name || "Unknown Title",
        overview: show.overview,
        backdropPath: show.backdrop_path,
        trailerKey: trailer ? trailer.key : null,
        type: "tv"
      };
    })
  );

  return (
    <>
      <HeroSlider items={sliderItems} />

      <Marquee items={["★★★ TRENDING NOW", "BLOCKBUSTER HITS", "BINGE-WORTHY SERIES", "NEW RELEASES", "EPIC ADVENTURES ★★★"]} />

      {/* Main Content */}
      <div className="content">
        <MediaRow title="Trending TV Shows" items={shows} type="tv" />
        <MediaRow title="Trending Movies" items={movies} type="movie" />
        
        {/* Genres */}
        <section style={{ marginTop: '60px' }}>
          <div className="section-header">
            <h2 className="section-header__title">Browse Genres</h2>
          </div>
          <div className="genre-tags">
            {movieGenres.slice(0, 15).map(g => (
              <GenreBadge key={g.id} id={g.id} name={g.name} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
