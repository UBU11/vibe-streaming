"use client";

import React from "react";
import Link from "next/link";
import { TMDBSeason, TMDBEpisode } from "@/types/tmdb";
import { useRouter } from "next/navigation";

interface EpisodeListProps {
  showId: number;
  seasons: TMDBSeason[];
  currentSeasonNumber: number;
  currentEpisodeNumber?: number;
  episodes: TMDBEpisode[];
}

export default function EpisodeList({
  showId,
  seasons,
  currentSeasonNumber,
  currentEpisodeNumber,
  episodes,
}: EpisodeListProps) {
  const router = useRouter();

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value;
    router.push(`/watch/show/${showId}/${newSeason}/1`);
  };

  return (
    <div className="episode-sidebar">
      <div className="episode-sidebar__header">
        <select 
          className="episode-sidebar__select"
          value={currentSeasonNumber}
          onChange={handleSeasonChange}
        >
          {seasons.map((s) => (
            <option key={s.season_number} value={s.season_number}>
              {s.name || `Season ${s.season_number}`}
            </option>
          ))}
        </select>
      </div>

      <div className="episode-sidebar__list">
        {episodes.map((ep) => {
          const isActive = currentEpisodeNumber === ep.episode_number;
          return (
            <Link 
              key={ep.id} 
              href={`/watch/show/${showId}/${currentSeasonNumber}/${ep.episode_number}`}
              className={`episode-card ${isActive ? 'episode-card--active' : ''}`}
            >
              <div className="episode-card__number">{ep.episode_number}</div>
              <div className="episode-card__info">
                <div className="episode-card__title">{ep.name}</div>
                <div className="episode-card__date">
                  {ep.air_date ? new Date(ep.air_date).toLocaleDateString() : 'Unknown date'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
