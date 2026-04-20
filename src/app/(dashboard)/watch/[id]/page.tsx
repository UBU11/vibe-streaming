import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Watch — Vibe`, description: `Watch video ${id} on Vibe` };
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="watch-page">
      <div style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ marginBottom: 16, opacity: 0.4 }}>
            <circle cx="36" cy="36" r="36" fill="rgba(139,92,246,0.2)"/>
            <path d="M28 20L52 36L28 52V20Z" fill="currentColor"/>
          </svg>
          <p style={{ fontSize: "0.9rem" }}>Connect Vidfast API to stream video {id}</p>
        </div>
      </div>
      <h1 className="watch-page__title">Video {id}</h1>
      <div className="watch-page__meta">
        <span>Category</span>
        <span>•</span>
        <span>0:00</span>
      </div>
      <p className="watch-page__description">
        Video description will appear here once the Vidfast API is connected.
      </p>
    </div>
  );
}
