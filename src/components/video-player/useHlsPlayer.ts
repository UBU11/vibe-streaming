"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type HlsType from "hls.js";

interface UseHlsPlayerOptions {
  src: string;
  autoPlay?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

export function useHlsPlayer({ src, autoPlay = false, onProgress, onEnded }: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HlsType | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else hls.destroy();
      });
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (autoPlay) video.play().catch(() => {});
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [src, autoPlay]);

  // Report progress every 10s while playing (Agent.md §3.1)
  useEffect(() => {
    if (!isPlaying || !onProgress) return;
    progressRef.current = setInterval(() => {
      const video = videoRef.current;
      if (video) onProgress(video.currentTime, video.duration);
    }, 10000);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying, onProgress]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = vol;
    setVolumeState(vol);
    setIsMuted(vol === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else container.requestFullscreen();
  }, []);

  const videoProps = {
    ref: videoRef,
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onTimeUpdate: () => {
      const video = videoRef.current;
      if (video) setCurrentTime(video.currentTime);
    },
    onLoadedMetadata: () => {
      const video = videoRef.current;
      if (video) setDuration(video.duration);
    },
    onWaiting: () => setIsBuffering(true),
    onPlaying: () => setIsBuffering(false),
    onEnded,
  };

  return {
    videoRef,
    videoProps,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isBuffering,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
  };
}
