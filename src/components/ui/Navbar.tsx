"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link href="/" className="navbar__logo" id="navbar-logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', filter: 'drop-shadow(2px 2px 0px #000)' }}>
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <span className="navbar__logo-text">VIBE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar__center">
          <SearchBar />
        </div>

        <div className="navbar__actions">
          <Link href="/browse/movies" className="navbar__link" id="nav-browse">
            <span className="navbar__link-text">Browse</span>
          </Link>
          <Link href="/leaderboard" className="navbar__link" id="nav-leaderboard">
            <span className="navbar__link-text">🏆 Leaderboard</span>
          </Link>
          <Link href="/manga" className="navbar__link" id="nav-manga">
            <span className="navbar__link-text">📚 Manga</span>
          </Link>
          <a href="/api/random" className="navbar__link" id="nav-random" style={{ background: 'var(--color-primary)', color: '#000' }}>
            <span className="navbar__link-text">🎲 Surprise Me</span>
          </a>
          <Link href="/library" className="navbar__link" id="nav-library">
            <span className="navbar__link-text">Library</span>
          </Link>

          <button className="navbar__avatar" id="nav-avatar" aria-label="User menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="navbar__mobile-toggle"
          id="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`navbar__hamburger ${isMobileMenuOpen ? "navbar__hamburger--open" : ""}`}
          >
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`navbar__mobile-menu ${isMobileMenuOpen ? "navbar__mobile-menu--open" : ""}`}
        id="mobile-menu"
      >
        <div className="navbar__mobile-search">
          <SearchBar />
        </div>
        <Link href="/browse/movies" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
          Browse
        </Link>
        <Link href="/leaderboard" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
          🏆 Leaderboard
        </Link>
        <Link href="/manga" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
          📚 Manga
        </Link>
        <a href="/api/random" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-accent-1)' }}>
          🎲 Surprise Me
        </a>
        <Link href="/library" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
          Library
        </Link>
        <Link href="/" className="navbar__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
          Sign In
        </Link>
      </div>
    </nav>
  );
}
