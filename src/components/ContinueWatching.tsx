"use client";

import React from "react";
import VideoCard from "@/components/VideoCard";
import type { Video, WatchProgress } from "@/types";

interface ContinueWatchingProps {
  videos: (Video & { progress: WatchProgress })[];
}

export default function ContinueWatching({ videos }: ContinueWatchingProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="continue-watching" id="continue-watching">
      <div className="section-header">
        <h2 className="section-header__title">Continue Watching</h2>
        <span className="section-header__count">{videos.length} videos</span>
      </div>

      <div className="continue-watching__scroll">
        {videos.map((item) => (
          <VideoCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnailUrl={item.thumbnailUrl}
            duration={item.duration}
            category={item.category}
            progress={item.progress.percentage}
          />
        ))}
      </div>
    </section>
  );
}
