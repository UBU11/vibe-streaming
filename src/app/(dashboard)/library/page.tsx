import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Library — Vibe", description: "Your saved videos and favourites" };

export default function LibraryPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">My Library</h1>
        <p className="page-header__subtitle">Your saved videos and favourites</p>
      </div>
      <div className="empty-state">
        <div className="empty-state__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <h2 className="empty-state__title">Your library is empty</h2>
        <p className="empty-state__text">Start adding videos to your library and they will appear here.</p>
      </div>
    </>
  );
}
