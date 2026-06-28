"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHlsPlayer } from "./useHlsPlayer";
import { formatDuration } from "@/lib/format";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

const CONTROLS_HIDE_DELAY_MS = 3000;

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  onProgress,
  onEnded,
  className = "",
}: VideoPlayerProps) {
  const player = useHlsPlayer({ src, autoPlay, onProgress, onEnded });
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (player.isPlaying) setShowControls(false);
    }, CONTROLS_HIDE_DELAY_MS);
  }, [player.isPlaying]);

  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    []
  );

  return (
    <div
      className={`video-player ${className}`}
      id="video-player"
      onMouseMove={revealControls}
      onMouseLeave={() => player.isPlaying && setShowControls(false)}
    >
      <video
        {...player.videoProps}
        className="video-player__video"
        poster={poster}
        onClick={player.togglePlay}
        playsInline
      />

      {player.isBuffering && (
        <div className="video-player__buffering">
          <div className="video-player__buffering-spinner" />
        </div>
      )}

      {!player.isPlaying && !player.isBuffering && (
        <button
          className="video-player__play-overlay"
          onClick={player.togglePlay}
          aria-label="Play video"
          id="video-play-overlay"
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="36" fill="rgba(0,0,0,0.5)" />
            <path d="M28 20L52 36L28 52V20Z" fill="white" />
          </svg>
        </button>
      )}

      <div
        className={`video-player__controls ${showControls ? "video-player__controls--visible" : ""}`}
      >
        <div className="video-player__progress">
          <input
            type="range"
            min="0"
            max={player.duration || 0}
            value={player.currentTime}
            onChange={(e) => player.seek(parseFloat(e.target.value))}
            className="video-player__progress-slider"
            aria-label="Seek"
            id="video-seek-slider"
          />
        </div>

        <div className="video-player__controls-row">
          <div className="video-player__controls-left">
            <button
              className="video-player__btn"
              onClick={player.togglePlay}
              aria-label={player.isPlaying ? "Pause" : "Play"}
              id="video-play-btn"
            >
              {player.isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="video-player__btn"
              onClick={player.toggleMute}
              aria-label={player.isMuted ? "Unmute" : "Mute"}
              id="video-mute-btn"
            >
              {player.isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={player.isMuted ? 0 : player.volume}
              onChange={(e) => player.setVolume(parseFloat(e.target.value))}
              className="video-player__volume-slider"
              aria-label="Volume"
              id="video-volume-slider"
            />

            <span className="video-player__time">
              {formatDuration(player.currentTime)} / {formatDuration(player.duration)}
            </span>
          </div>

          <div className="video-player__controls-right">
            <button
              className="video-player__btn"
              onClick={() => player.toggleFullscreen(player.videoRef.current?.parentElement ?? null)}
              aria-label="Toggle fullscreen"
              id="video-fullscreen-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
