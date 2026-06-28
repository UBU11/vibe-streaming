import React from "react";
import Link from "next/link";
import { getChapterPages, getMangaDetails, getMangaFeed } from "@/lib/mangadex";
import { notFound } from "next/navigation";

export default async function MangaReaderPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const resolvedParams = await params;

  const [manga, chapters, pages] = await Promise.all([
    getMangaDetails(resolvedParams.id),
    getMangaFeed(resolvedParams.id),
    getChapterPages(resolvedParams.chapterId)
  ]);

  if (!manga || pages.length === 0) return notFound();

  // Find the current chapter so we can show its title/number and prev/next links.
  const currentChapterIndex = chapters.findIndex(c => c.id === resolvedParams.chapterId);
  const currentChapter = chapters[currentChapterIndex];

  // Navigation
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#000',
        borderBottom: '4px solid var(--color-accent-2)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href={`/manga/${manga.id}`} style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 900,
            background: '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '2px solid #555'
          }}>
            ← Back
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--color-accent-2)' }}>{manga.title}</span>
            <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
              Chapter {currentChapter?.chapter || "???"} {currentChapter?.title ? `- ${currentChapter.title}` : ''}
            </span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {prevChapter ? (
            <Link href={`/manga/${manga.id}/read/${prevChapter.id}`} style={{
              background: 'var(--color-primary)',
              color: '#000',
              padding: '8px 16px',
              fontWeight: 900,
              textDecoration: 'none',
              borderRadius: '8px',
              border: '2px solid #000'
            }}>
              &lt;&lt; Prev
            </Link>
          ) : (
            <span style={{ padding: '8px 16px', color: '#555', fontWeight: 900 }}>&lt;&lt; Prev</span>
          )}

          {nextChapter ? (
            <Link href={`/manga/${manga.id}/read/${nextChapter.id}`} style={{
              background: 'var(--color-primary)',
              color: '#000',
              padding: '8px 16px',
              fontWeight: 900,
              textDecoration: 'none',
              borderRadius: '8px',
              border: '2px solid #000'
            }}>
              Next &gt;&gt;
            </Link>
          ) : (
            <span style={{ padding: '8px 16px', color: '#555', fontWeight: 900 }}>Next &gt;&gt;</span>
          )}
        </div>
      </div>

      {/* Vertical webtoon-style reader area */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {pages.map((pageUrl, idx) => (
          <img
            key={idx}
            src={pageUrl}
            alt={`Page ${idx + 1}`}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              margin: 0,
              padding: 0
            }}
          />
        ))}
      </div>

      {/* Footer navigation */}
      <div style={{
        backgroundColor: '#000',
        borderTop: '4px solid var(--color-accent-2)',
        padding: '32px 24px',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px'
      }}>
        {prevChapter && (
          <Link href={`/manga/${manga.id}/read/${prevChapter.id}`} style={{
            background: '#333',
            color: '#fff',
            padding: '16px 32px',
            fontSize: '1.2rem',
            fontWeight: 900,
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid #555'
          }}>
            ← Previous Chapter
          </Link>
        )}
        {nextChapter && (
          <Link href={`/manga/${manga.id}/read/${nextChapter.id}`} style={{
            background: 'var(--color-accent-2)',
            color: '#000',
            padding: '16px 32px',
            fontSize: '1.2rem',
            fontWeight: 900,
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid #000'
          }}>
            Next Chapter →
          </Link>
        )}
      </div>
    </div>
  );
}
