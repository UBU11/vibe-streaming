"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMediaTitle, getMediaType } from "@/lib/media";
import type { TMDBMedia } from "@/types/tmdb";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({
  className = "",
  placeholder = "Search movies & series...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TMDBMedia[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.data?.slice(0, 5) ?? []);
          setIsOpen(true);
        }
      } catch {
        // Suggestions are best-effort; never surface fetch errors to the user.
      }
    }, 300);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <div className={`search-bar ${className}`} ref={wrapperRef} id="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form">
        <svg
          className="search-bar__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-bar__input"
          id="search-input"
          aria-label="Search movies and series"
          autoComplete="off"
        />
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul className="search-bar__suggestions" id="search-suggestions">
          {suggestions.map((item) => {
            const type = getMediaType(item) === "movie" ? "movie" : "show";
            return (
              <li key={`${item.media_type}-${item.id}`}>
                <button
                  className="search-bar__suggestion-item"
                  onClick={() => {
                    setQuery(getMediaTitle(item));
                    setIsOpen(false);
                    router.push(`/watch/${type}/${item.id}`);
                  }}
                >
                  <span style={{ fontSize: '0.8rem', padding: '2px 6px', background: 'var(--color-primary)', border: '2px solid #000', borderRadius: '4px', marginRight: '8px' }}>
                    {item.media_type === 'movie' ? 'MOVIE' : 'SERIES'}
                  </span>
                  {getMediaTitle(item)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
