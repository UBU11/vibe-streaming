"use client";

import { useCallback, useRef } from "react";

export function useHorizontalScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = (direction === "left" ? -0.8 : 0.8) * el.clientWidth;
    el.scrollBy({ left: distance, behavior: "smooth" });
  }, []);

  return { scrollRef, scroll };
}
