import React from "react";
import Link from "next/link";
import { getMangaDetails, getMangaFeed } from "@/lib/mangadex";
import { notFound } from "next/navigation";

function getExternalSourceName(url: string) {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('mangaplus')) return 'MangaPlus';
    if (hostname.includes('viz.com')) return 'VIZ Media';
    if (hostname.includes('webtoons')) return 'Webtoons';
    if (hostname.includes('tapas')) return 'Tapas';
    if (hostname.includes('comixology')) return 'ComiXology';
    if (hostname.includes('bilibili')) return 'Bilibili Comics';
    if (hostname.includes('azuki')) return 'Azuki';
    if (hostname.includes('mangamo')) return 'Mangamo';
    if (hostname.includes('inkr')) return 'INKR';
    return hostname.replace('www.', '');
  } catch (e) {
    return 'External';
  }
}

export default async function MangaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const [manga, chapters] = await Promise.all([
    getMangaDetails(resolvedParams.id),
    getMangaFeed(resolvedParams.id)
  ]);

  if (!manga) return notFound();

  // Group chapters by volume
  const groupedChapters = chapters.reduce((acc, chapter) => {
    const vol = chapter.volume;
    if (!acc[vol]) acc[vol] = [];
    acc[vol].push(chapter);
    return acc;
  }, {} as Record<string, typeof chapters>);

  const volumes = Object.keys(groupedChapters).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return Number(b) - Number(a); // Descending order
  });

  return (
    <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto', padding: '100px 40px 80px 40px' }}>

      <Link href="/manga" style={{ display: 'inline-block', marginBottom: '32px', fontSize: '1.2rem', fontWeight: 900, textDecoration: 'underline' }}>
        ← Back to Manga Hub
      </Link>

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Left Sidebar: Cover and Details */}
        <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            width: '100%',
            border: '4px solid #000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '8px 8px 0px var(--color-accent-2)',
            backgroundColor: '#222'
          }}>
            <img
              src={manga.coverUrl || "/placeholder-thumb.svg"}
              alt={manga.title}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>

          <div style={{ background: 'var(--color-surface)', border: '4px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '4px 4px 0px #000' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', borderBottom: '2px solid #000', paddingBottom: '8px' }}>Details</h3>
            <p><strong>Status:</strong> {manga.status.toUpperCase()}</p>
            <p><strong>Year:</strong> {manga.year || "Unknown"}</p>
          </div>
        </div>

        {/* Right Main Area: Title, Desc, Chapters */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', textShadow: '2px 2px 0px var(--color-accent-2), 4px 4px 0px #000' }}>
            {manga.title}
          </h1>

          <div style={{ background: '#fff', border: '4px solid #000', padding: '24px', borderRadius: '12px', marginBottom: '48px', boxShadow: '4px 4px 0px #000' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#000', margin: 0, whiteSpace: 'pre-wrap' }}>
              {manga.description}
            </p>
          </div>

          {/* Chapters List */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textShadow: '2px 2px 0px #000', WebkitTextStroke: '1px #000', color: 'var(--color-accent-1)' }}>
              Chapters
            </h2>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, background: '#000', color: '#fff', padding: '8px 16px', borderRadius: '8px' }}>
              {chapters.length} Available
            </span>
          </div>

          {chapters.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxHeight: '1000px', overflowY: 'auto', paddingRight: '16px' }}>
              {volumes.map(vol => (
                <div key={vol}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '16px', borderBottom: '4px solid #000', paddingBottom: '8px', color: 'var(--color-accent-2)' }}>
                    {vol === "Unknown" ? "No Volume / Unknown" : `Volume ${vol}`}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedChapters[vol].map((chapter) => {
                      const isExternal = !!chapter.externalUrl;
                      const sourceName = isExternal ? getExternalSourceName(chapter.externalUrl!) : null;
                      const targetHref = isExternal ? `/manga/${manga.id}/external?url=${encodeURIComponent(chapter.externalUrl!)}` : `/manga/${manga.id}/read/${chapter.id}`;

                      return (
                        <Link
                          key={chapter.id}
                          href={targetHref}
                          className="chapter-link"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>Chapter {chapter.chapter} {chapter.title ? `- ${chapter.title}` : ''}</span>
                            {isExternal && (
                              <span style={{ fontSize: '0.8rem', background: '#e0e0e0', color: '#333', padding: '2px 8px', borderRadius: '4px', border: '1px solid #999', fontWeight: 'bold' }}>
                                🔗 {sourceName}
                              </span>
                            )}
                          </div>
                          <span style={{ background: isExternal ? 'var(--color-primary)' : '#000', color: isExternal ? '#000' : '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '1rem', border: isExternal ? '2px solid #000' : 'none' }}>
                            {isExternal ? `Read on ${sourceName} ↗` : 'Read ▶'}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#fff', border: '4px solid #000', padding: '32px', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000', margin: 0 }}>
                No English chapters available for this manga yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
