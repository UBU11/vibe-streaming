import type { Metadata } from "next";

export const metadata: Metadata = { title: "Watch History — Vibe", description: "Your recently watched videos" };

export default function HistoryPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Watch History</h1>
        <p className="page-header__subtitle">Pick up where you left off</p>
      </div>
      <div className="empty-state">
        <div className="empty-state__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
        </div>
        <h2 className="empty-state__title">No watch history yet</h2>
        <p className="empty-state__text">Videos you watch will show up here so you can easily find them again.</p>
      </div>
    </>
  );
}
