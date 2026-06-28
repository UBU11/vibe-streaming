"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="empty-state" style={{ minHeight: '60vh', marginTop: '120px' }}>
      <h2 className="empty-state__title" style={{ fontSize: '4rem', color: 'var(--color-danger)' }}>
        NETWORK ERROR
      </h2>
      
      {error.message.includes("TMDB_API_KEY") ? (
        <p className="empty-state__text" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
          The TMDB API Key is missing or invalid. Please check your .env.local file.
        </p>
      ) : error.message.includes("fetch failed") || error.message.includes("ECONNRESET") ? (
        <div style={{ maxWidth: '600px', marginBottom: '24px' }}>
          <p className="empty-state__text" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
            Connection to TMDB servers was blocked or reset by your network.
          </p>
          <p style={{ fontSize: '1.1rem', background: '#fff', padding: '16px', border: '3px solid #000', color: '#000', fontWeight: 'bold' }}>
            Next Steps: Certain ISPs block access to the TMDB API. If you are experiencing repeated &quot;fetch failed&quot; or &quot;ECONNRESET&quot; errors, please try connecting to a VPN or using a different network, then click Try Again.
          </p>
        </div>
      ) : (
        <p className="empty-state__text" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
          Something went wrong while fetching the data from the server.
        </p>
      )}

      {/* Raw error retained for debugging */}
      {!error.message.includes("TMDB_API_KEY") && (
        <pre style={{ background: '#000', color: '#00ff00', padding: '16px', borderRadius: '4px', maxWidth: '800px', overflowX: 'auto', marginBottom: '32px', textAlign: 'left' }}>
          <code>{error.message}</code>
        </pre>
      )}

      <button
        className="btn btn--primary btn--lg"
        onClick={() => reset()}
      >
        TRY AGAIN
      </button>
    </div>
  );
}
