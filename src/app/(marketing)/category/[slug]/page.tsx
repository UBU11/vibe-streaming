import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${name} — Vibe`, description: `Browse ${name} videos on Vibe` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className="content" style={{ paddingTop: 100 }}>
      <div className="page-header">
        <h1 className="page-header__title">{name}</h1>
        <p className="page-header__subtitle">Browse all {name.toLowerCase()} videos</p>
      </div>
      <div className="video-grid">
        <p style={{ color: "var(--color-text-muted)", gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
          Connect your Vidfast API key to load category content.
        </p>
      </div>
    </div>
  );
}
