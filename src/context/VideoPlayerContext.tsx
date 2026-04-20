"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { PlayerState } from "@/types";

interface VideoPlayerContextType {
  /** Currently loaded video ID */
  activeVideoId: string | null;
  /** Player state */
  playerState: PlayerState;
  /** Load a new video into the persistent player */
  loadVideo: (videoId: string, hlsUrl: string) => void;
  /** Update playback progress */
  updateProgress: (currentTime: number, duration: number) => void;
  /** Play / Pause toggle */
  togglePlay: () => void;
  /** Set volume (0-1) */
  setVolume: (volume: number) => void;
  /** Toggle mute */
  toggleMute: () => void;
  /** The HLS source URL */
  hlsUrl: string | null;
  /** Reference to the video element for external control */
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const defaultPlayerState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  quality: "auto",
  buffered: 0,
};

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(
  undefined
);

export function VideoPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);
  const [playerState, setPlayerState] =
    useState<PlayerState>(defaultPlayerState);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const loadVideo = useCallback((videoId: string, url: string) => {
    setActiveVideoId(videoId);
    setHlsUrl(url);
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      buffered: 0,
    }));
  }, []);

  const updateProgress = useCallback(
    (currentTime: number, duration: number) => {
      setPlayerState((prev) => ({ ...prev, currentTime, duration }));
    },
    []
  );

  const togglePlay = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setPlayerState((prev) => ({ ...prev, volume, isMuted: volume === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  return (
    <VideoPlayerContext.Provider
      value={{
        activeVideoId,
        playerState,
        loadVideo,
        updateProgress,
        togglePlay,
        setVolume,
        toggleMute,
        hlsUrl,
        videoRef,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error(
      "useVideoPlayer must be used within a VideoPlayerProvider"
    );
  }
  return context;
}
