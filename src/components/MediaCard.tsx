import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  type: "movie" | "tv";
  voteAverage?: number;
  year?: string;
}

export default function MediaCard({ id, title, posterPath, type, voteAverage, year }: MediaCardProps) {
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
          unoptimized // TMDB serves pre-sized assets; skip the Next image optimization quota
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
