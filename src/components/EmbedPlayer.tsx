"use client";

import React, { useState } from "react";

interface EmbedPlayerProps {
  type: "movie" | "tv";
  tmdbId: number;
  season?: number;
  episode?: number;
}

export default function EmbedPlayer({ type, tmdbId, season, episode }: EmbedPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  let src = "";
  if (type === "movie") {
    src = `https://vidfast.pro/movie/${tmdbId}?autoPlay=true`;
  } else if (type === "tv" && season !== undefined && episode !== undefined) {
    src = `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?autoPlay=true`;
  }

  if (!src) {
    return (
      <div className="embed-player" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Invalid player parameters.</p>
      </div>
    );
  }

  return (
    <div className="embed-player">
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
          <div className="loader-cube" />
        </div>
      )}
      <iframe
        src={src}
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
