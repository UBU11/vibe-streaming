"use client";

import React from "react";
import MediaCard from "./MediaCard";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { getMediaTitle, getMediaType, getMediaYear } from "@/lib/media";
import type { TMDBMedia } from "@/types/tmdb";

interface MediaRowProps {
  title: string;
  items: TMDBMedia[];
  type?: "movie" | "tv" | "mixed";
  seeAllHref?: string;
}

export default function MediaRow({ title, items, type = "mixed", seeAllHref }: MediaRowProps) {
  const { scrollRef, scroll } = useHorizontalScroll<HTMLDivElement>();
  const hint = type === "mixed" ? undefined : type;

  if (!items || items.length === 0) return null;

  return (
    <section className="media-row">
      <div className="section-header">
        <h2 className="section-header__title">{title}</h2>
        {seeAllHref && (
          <a href={seeAllHref} className="section-header__see-all">
            See All →
          </a>
        )}
      </div>

      <div className="media-row__wrapper">
        <button
          className="media-row__arrow media-row__arrow--left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <div className="media-row__scroll" ref={scrollRef}>
          {items.map((item) => {
            const itemType = getMediaType(item, hint);
            return (
              <MediaCard
                key={`${itemType}-${item.id}`}
                id={item.id}
                title={getMediaTitle(item)}
                posterPath={item.poster_path}
                type={itemType}
                voteAverage={item.vote_average}
                year={getMediaYear(item)}
              />
            );
          })}
        </div>

        <button
          className="media-row__arrow media-row__arrow--right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
