import type { Metadata } from "next";
import { getMovieDetails, getMovieRecommendations } from "@/lib/tmdb";
import EmbedPlayer from "@/components/EmbedPlayer";
import MediaRow from "@/components/MediaRow";
import GenreBadge from "@/components/GenreBadge";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const details = await getMovieDetails(id);
    return { title: `${details.title} — Vibe`, description: details.overview };
  } catch {
    return { title: `Watch Movie — Vibe` };
  }
}

export default async function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const details = await getMovieDetails(id);
  const recommendations = await getMovieRecommendations(id);

  return (
    <div className="watch-page">
      <EmbedPlayer type="movie" tmdbId={details.id} />
      
      <div className="details-panel">
        <div className="details-panel__header">
          <div>
            <h1 className="details-panel__title">{details.title}</h1>
            <div className="details-panel__meta">
              <span>{new Date(details.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
              <span>•</span>
              <span>★ {details.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <p className="details-panel__overview">{details.overview}</p>
        
        <div className="genre-tags">
          {details.genres.map(g => (
            <GenreBadge key={g.id} id={g.id} name={g.name} />
          ))}
        </div>
      </div>

      {recommendations.length > 0 && (
        <MediaRow title="You Might Also Like" items={recommendations} type="movie" />
      )}
    </div>
  );
}
