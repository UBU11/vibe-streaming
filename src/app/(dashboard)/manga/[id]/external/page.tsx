import React from "react";
import Link from "next/link";

export default async function ExternalMangaReaderPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ url?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const url = resolvedSearch.url;

  if (!url) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: '#fff' }}>
        <h2>Invalid External URL</h2>
        <Link href={`/manga/${resolvedParams.id}`} style={{ color: 'var(--color-primary)' }}>Go Back</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#111' }}>
      <div style={{ 
        padding: '16px 24px', 
        background: '#000', 
        borderBottom: '4px solid var(--color-accent-2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50
      }}>
        <Link href={`/manga/${resolvedParams.id}`} style={{
          background: '#333',
          color: '#fff',
          padding: '8px 16px',
          fontWeight: 900,
          textDecoration: 'none',
          borderRadius: '8px',
          border: '2px solid #555'
        }}>
          ← Back to Chapters
        </Link>
        
        <div style={{ color: '#fff', fontSize: '1rem' }}>
          Attempting to load external reader...
        </div>

        <a href={url} target="_blank" rel="noopener noreferrer" style={{
          background: 'var(--color-primary)',
          color: '#000',
          padding: '8px 16px',
          fontWeight: 900,
          textDecoration: 'none',
          borderRadius: '8px',
          border: '2px solid #000'
        }}>
          Open in New Tab ↗
        </a>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#aaa',
          padding: '40px',
          textAlign: 'center',
          zIndex: 1
        }}>
          <h3 style={{ marginBottom: '16px', color: '#fff' }}>If the reader doesn't load below...</h3>
          <p>The publisher (like MangaPlus or VIZ) has blocked this website from embedding their reader.</p>
          <p>Please click the <strong>"Open in New Tab ↗"</strong> button in the top right to read it directly on their site!</p>
        </div>

        <iframe 
          src={url} 
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            position: 'relative',
            zIndex: 10,
            background: '#fff'
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
