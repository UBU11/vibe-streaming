import React from "react";
import Link from "next/link";
import { getTrendingMovies, getTrendingShows, discoverMedia } from "@/lib/tmdb";
import LeaderboardCard from "@/components/LeaderboardCard";
import { TMDBMovie, TMDBShow } from "@/types/tmdb";

export const metadata = {
  title: "Leaderboard — Vibe",
  description: "See the top trending movies, TV shows, and anime right now.",
};

function getDateAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const params = await searchParams;
  const timeframe = params.t || "week"; // day, week, month
  
  let topMovies: TMDBMovie[] = [];
  let topShows: TMDBShow[] = [];
  let topAnime: TMDBShow[] = [];

  // Fetch logic based on timeframe
  if (timeframe === "month") {
    const [moviesRes, showsRes, animeRes] = await Promise.all([
      discoverMedia("movie", { sort_by: "popularity.desc", "primary_release_date.gte": getDateAgo(30) }),
      discoverMedia("tv", { sort_by: "popularity.desc", "first_air_date.gte": getDateAgo(30) }),
      discoverMedia("tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", "first_air_date.gte": getDateAgo(30) })
    ]);
    topMovies = (moviesRes.results as TMDBMovie[]).slice(0, 10);
    topShows = (showsRes.results as TMDBShow[]).slice(0, 10);
    topAnime = (animeRes.results as TMDBShow[]).slice(0, 10);
  } else {
    // Day or Week
    const tmdbTimeframe = timeframe as "day" | "week";
    const animeDateFilter = timeframe === "day" ? 1 : 7;
    
    const [moviesRes, showsRes, animeRes] = await Promise.all([
      getTrendingMovies(tmdbTimeframe),
      getTrendingShows(tmdbTimeframe),
      discoverMedia("tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", "first_air_date.gte": getDateAgo(animeDateFilter) })
    ]);
    
    topMovies = moviesRes.slice(0, 10);
    topShows = showsRes.slice(0, 10);
    topAnime = (animeRes.results as TMDBShow[]).slice(0, 10);
  }

  const timeframeLabels: Record<string, string> = {
    day: "Today",
    week: "This Week",
    month: "This Month"
  };

  return (
    <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-header__title">VIBE LEADERBOARD</h1>
        <br />
        <span className="page-header__subtitle">Top 10 Most Popular {timeframeLabels[timeframe]}</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
        <Link href="?t=day" className={`btn ${timeframe === 'day' ? 'btn--primary' : 'btn--secondary'}`} style={{ padding: '12px 32px', fontSize: '1.2rem' }}>
          Daily
        </Link>
        <Link href="?t=week" className={`btn ${timeframe === 'week' ? 'btn--primary' : 'btn--secondary'}`} style={{ padding: '12px 32px', fontSize: '1.2rem' }}>
          Weekly
        </Link>
        <Link href="?t=month" className={`btn ${timeframe === 'month' ? 'btn--primary' : 'btn--secondary'}`} style={{ padding: '12px 32px', fontSize: '1.2rem' }}>
          Monthly
        </Link>
      </div>

      <div className="leaderboard-container">
        {/* Top Movies */}
        <div className="leaderboard-column">
          <h2 className="leaderboard-column__header">🎬 Top Movies</h2>
          <div className="leaderboard-list">
            {topMovies.map((movie, index) => (
              <LeaderboardCard
                key={movie.id}
                id={movie.id}
                rank={index + 1}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                type="movie"
              />
            ))}
          </div>
        </div>

        {/* Top TV Shows */}
        <div className="leaderboard-column">
          <h2 className="leaderboard-column__header">📺 Top Shows</h2>
          <div className="leaderboard-list">
            {topShows.map((show, index) => (
              <LeaderboardCard
                key={show.id}
                id={show.id}
                rank={index + 1}
                title={show.name}
                posterPath={show.poster_path}
                voteAverage={show.vote_average}
                type="tv"
              />
            ))}
          </div>
        </div>

        {/* Top Anime */}
        <div className="leaderboard-column">
          <h2 className="leaderboard-column__header">⚔️ Top Anime</h2>
          <div className="leaderboard-list">
            {topAnime.map((anime, index) => (
              <LeaderboardCard
                key={anime.id}
                id={anime.id}
                rank={index + 1}
                title={anime.name || anime.title || "Unknown Anime"}
                posterPath={anime.poster_path}
                voteAverage={anime.vote_average}
                type="tv"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
