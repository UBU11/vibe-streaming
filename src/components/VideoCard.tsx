"use client";

import React from "react";
import Link from "next/link";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: number;
  category?: string;
  progress?: number; // percentage 0-100
}

export default function VideoCard({
  id,
  title,
  thumbnailUrl,
  duration,
  category,
  progress,
}: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Link
      href={`/watch/${id}`}
      className="video-card"
      id={`video-card-${id}`}
    >
      <div className="video-card__thumbnail-wrapper">
        <img
          src={thumbnailUrl || "/placeholder-thumb.svg"}
          alt={title}
          className="video-card__thumbnail"
          loading="lazy"
        />
        <span className="video-card__duration">{formatDuration(duration)}</span>

        {/* Hover play icon */}
        <div className="video-card__play-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.6)" />
            <path d="M18 14L34 24L18 34V14Z" fill="white" />
          </svg>
        </div>

        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="video-card__progress">
            <div
              className="video-card__progress-bar"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="video-card__info">
        <h3 className="video-card__title">{title}</h3>
        {category && (
          <span className="video-card__category">{category}</span>
        )}
      </div>
    </Link>
  );
}
