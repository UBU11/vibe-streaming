import { redirect } from "next/navigation";
import { getShowDetails } from "@/lib/tmdb";

export default async function ShowOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let firstSeasonNumber = -1;
  let hasSeasons = false;
  
  const details = await getShowDetails(id);
  const firstSeason = details.seasons?.find(s => s.season_number > 0) || details.seasons?.[0];
  
  if (firstSeason) {
    firstSeasonNumber = firstSeason.season_number;
    hasSeasons = true;
  }

  if (hasSeasons && firstSeasonNumber !== -1) {
    redirect(`/watch/show/${id}/${firstSeasonNumber}/1`);
  } else {
    return (
      <div className="watch-page">
        <div className="empty-state">
          <h2 className="empty-state__title">No Seasons Found</h2>
          <p className="empty-state__text">This show doesn't have any episodes yet.</p>
        </div>
      </div>
    );
  }
}
