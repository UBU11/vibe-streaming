"use client";

import React from "react";
import VideoCard from "@/components/VideoCard";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import type { Video } from "@/types";

interface CategoryRowProps {
  title: string;
  videos: Video[];
  seeAllHref?: string;
}

export default function CategoryRow({ title, videos, seeAllHref }: CategoryRowProps) {
  const { scrollRef, scroll } = useHorizontalScroll<HTMLDivElement>();

  if (!videos || videos.length === 0) return null;

  return (
    <section className="category-row">
      <div className="section-header">
        <h2 className="section-header__title">{title}</h2>
        {seeAllHref && (
          <a href={seeAllHref} className="section-header__see-all">
            See all →
          </a>
        )}
      </div>

      <div className="category-row__wrapper">
        <button
          className="category-row__arrow category-row__arrow--left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <div className="category-row__scroll" ref={scrollRef}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
              duration={video.duration}
              category={video.category}
            />
          ))}
        </div>

        <button
          className="category-row__arrow category-row__arrow--right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
