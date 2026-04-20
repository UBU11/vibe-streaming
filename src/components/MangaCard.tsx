import React from "react";
import Link from "next/link";
import { MangaData } from "@/lib/mangadex";

interface MangaCardProps {
  manga: MangaData;
}

export default function MangaCard({ manga }: MangaCardProps) {
  // Temporary redirect since we don't have a manga reader page yet
  // We'll point it to a "watch" path as placeholder or handle it later
  return (
    <Link href={`/manga/${manga.id}`} className="manga-card">
      <div className="manga-card__poster-wrapper">
        <img
          src={manga.coverUrl || "/placeholder-thumb.svg"}
          alt={manga.title}
          className="manga-card__poster"
        />
        <div className="manga-card__overlay">
          <span className="manga-card__status">{manga.status?.toUpperCase() || "UNKNOWN"}</span>
        </div>
      </div>
      <div className="manga-card__info">
        <h3 className="manga-card__title">{manga.title}</h3>
        <p className="manga-card__desc">{manga.description}</p>
      </div>
    </Link>
  );
}
