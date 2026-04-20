import type { Metadata } from "next";
import { getShowDetails, getSeasonDetails, getShowRecommendations } from "@/lib/tmdb";
import EmbedPlayer from "@/components/EmbedPlayer";
import MediaRow from "@/components/MediaRow";
import GenreBadge from "@/components/GenreBadge";
import EpisodeList from "@/components/EpisodeList";

export async function generateMetadata({ params }: { params: Promise<{ id: string, season: string, episode: string }> }): Promise<Metadata> {
  const { id, season, episode } = await params;
  try {
    const show = await getShowDetails(id);
    return { title: `${show.name} S${season}E${episode} — Vibe`, description: show.overview };
  } catch {
    return { title: `Watch Series — Vibe` };
  }
}

export default async function WatchEpisodePage({ params }: { params: Promise<{ id: string, season: string, episode: string }> }) {
  const { id, season, episode } = await params;
  const seasonNum = parseInt(season);
  const episodeNum = parseInt(episode);
  
  const show = await getShowDetails(id);
  const seasonData = await getSeasonDetails(id, seasonNum);
  const recommendations = await getShowRecommendations(id);

  const currentEpisodeData = seasonData.episodes.find(ep => ep.episode_number === episodeNum);

  return (
    <div className="watch-page">
      <div className="watch-layout">
        <div className="watch-layout__main">
          <EmbedPlayer type="tv" tmdbId={show.id} season={seasonNum} episode={episodeNum} />
          
          <div className="details-panel">
            <div className="details-panel__header">
              <div>
                <h1 className="details-panel__title">{show.name}</h1>
                <div className="details-panel__meta">
                  <span>Season {seasonNum} • Episode {episodeNum}</span>
                  {currentEpisodeData && <span>• {currentEpisodeData.name}</span>}
                  <span>• ★ {show.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <p className="details-panel__overview">
              {currentEpisodeData?.overview || show.overview}
            </p>
            
            <div className="genre-tags">
              {show.genres.map(g => (
                <GenreBadge key={g.id} id={g.id} name={g.name} type="tv" />
              ))}
            </div>
          </div>
        </div>

        <div className="watch-layout__sidebar">
          <EpisodeList 
            showId={show.id}
            seasons={show.seasons.filter(s => s.season_number > 0)}
            currentSeasonNumber={seasonNum}
            currentEpisodeNumber={episodeNum}
            episodes={seasonData.episodes}
          />
        </div>
      </div>

      {recommendations.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <MediaRow title="You Might Also Like" items={recommendations} type="tv" />
        </div>
      )}
    </div>
  );
}
