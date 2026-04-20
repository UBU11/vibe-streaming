import React from "react";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb";
import Image from "next/image";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  type: "movie" | "tv";
  voteAverage?: number;
  releaseDate?: string;
}

export default function MediaCard({
  id,
  title,
  posterPath,
  type,
  voteAverage,
  releaseDate,
}: MediaCardProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const href = type === "movie" ? `/watch/movie/${id}` : `/watch/show/${id}`;

  return (
    <Link href={href} className="media-card">
      <div className="media-card__poster-wrapper">
        <Image
          src={getTmdbImageUrl(posterPath, "w500")}
          alt={title}
          className="media-card__poster"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized // using unoptimized since TMDB handles sizing and we want to skip Next's image optimization quota
        />
        <div className="media-card__badges">
          <span className={`media-card__badge media-card__badge--${type}`}>
            {type === "movie" ? "Movie" : "Series"}
          </span>
          {voteAverage ? (
            <span className="media-card__badge media-card__badge--rating">
              ★ {voteAverage.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="media-card__info">
        <h3 className="media-card__title">{title}</h3>
        <span className="media-card__meta">{year}</span>
      </div>
    </Link>
  );
}
