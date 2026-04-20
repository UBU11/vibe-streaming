"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb";

export interface HeroSlideItem {
  id: number | string;
  title: string;
  overview: string;
  backdropPath: string | null;
  trailerKey: string | null;
  type: "movie" | "tv";
}

export default function HeroSlider({ items }: { items: HeroSlideItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 10000); // 10 seconds

    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="hero-slider-wrapper">
      {items.map((item, index) => {
        const isActive = index === currentIndex;
        
        return (
          <div 
            key={item.id} 
            className={`hero-slide ${isActive ? 'hero-slide--active' : ''}`}
            style={{ zIndex: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          >
            {/* Background Media */}
            <div className="hero-slide__bg">
              {isActive && item.trailerKey ? (
                <div className="hero-slide__video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${item.trailerKey}&playsinline=1`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="hero-slide__video"
                  />
                </div>
              ) : (
                <img 
                  src={getTmdbImageUrl(item.backdropPath, "original")} 
                  alt={item.title} 
                  className="hero-slide__image"
                />
              )}
              {/* Overlay for comic style and text readability */}
              <div className="hero-slide__overlay"></div>
            </div>

            {/* Content overlay */}
            <div className="hero-slide__content-container">
              <div className="hero-slide__content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span className="hero-slide__badge" style={{ 
                  background: 'var(--color-primary)', 
                  color: '#000', 
                  padding: '6px 12px', 
                  fontWeight: 900, 
                  width: 'fit-content',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.9rem'
                }}>
                  #{index + 1} Trending
                </span>
                
                <h1 style={{ 
                  fontSize: 'clamp(3rem, 6vw, 5rem)', 
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: '#FFF',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                  margin: 0
                }}>
                  {item.title}
                </h1>
                
                <p style={{ 
                  maxWidth: '600px', 
                  fontSize: '1.25rem', 
                  lineHeight: '1.5',
                  color: '#E5E5E5',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: 0
                }}>
                  {item.overview}
                </p>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <Link href={`/watch/${item.type === 'tv' ? 'show' : 'movie'}/${item.id}`} 
                        className="btn btn--primary btn--lg" 
                        style={{ borderRadius: '8px', padding: '12px 32px', fontSize: '1.2rem', boxShadow: '0 4px 14px 0 rgba(255, 51, 102, 0.39)' }}>
                    ▶ WATCH NOW
                  </Link>
                  <Link href="/library" 
                        className="btn btn--secondary btn--lg"
                        style={{ borderRadius: '8px', padding: '12px 32px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', backdropFilter: 'blur(10px)' }}>
                    + MY LIST
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slider Controls / Indicators */}
      <div className="hero-slider__indicators">
        {items.map((_, idx) => (
          <button 
            key={idx}
            className={`hero-slider__dot ${idx === currentIndex ? 'hero-slider__dot--active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
