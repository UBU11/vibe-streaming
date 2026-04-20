import React from "react";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface LeaderboardCardProps {
  id: number | string;
  rank: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  type: "movie" | "tv";
}

export default function LeaderboardCard({ id, rank, title, posterPath, voteAverage, type }: LeaderboardCardProps) {
  return (
    <Link href={`/watch/${type === "tv" ? "show" : "movie"}/${id}`} className="leaderboard-card">
      <div className="leaderboard-card__rank">
        {rank}
      </div>
      <div className="leaderboard-card__poster-wrapper">
        <img 
          src={getTmdbImageUrl(posterPath, "w500")} 
          alt={title} 
          className="leaderboard-card__poster"
        />
      </div>
      <div className="leaderboard-card__info">
        <h3 className="leaderboard-card__title">{title}</h3>
        <div className="leaderboard-card__meta">
          <span className="leaderboard-card__rating">★ {voteAverage.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
