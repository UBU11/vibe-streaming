"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Loader({
  size = "md",
  className = "",
  text,
}: LoaderProps) {
  return (
    <div className={`loader loader--${size} ${className}`} role="status" aria-label="Loading">
      <div className="loader__ring">
        <div className="loader__ring-segment loader__ring-segment--1" />
        <div className="loader__ring-segment loader__ring-segment--2" />
        <div className="loader__ring-segment loader__ring-segment--3" />
      </div>
      {text && <p className="loader__text">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function FullPageLoader({ text }: { text?: string }) {
  return (
    <div className="loader__fullpage">
      <Loader size="lg" text={text} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image skeleton-pulse" />
      <div className="skeleton-card__content">
        <div className="skeleton-card__title skeleton-pulse" />
        <div className="skeleton-card__subtitle skeleton-pulse" />
      </div>
    </div>
  );
}
