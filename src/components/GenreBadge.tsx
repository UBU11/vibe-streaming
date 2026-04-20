import React from "react";
import Link from "next/link";

interface GenreBadgeProps {
  id: number;
  name: string;
  type?: "movie" | "tv";
}

export default function GenreBadge({ id, name, type = "movie" }: GenreBadgeProps) {
  // Use a hash of the id to pick a consistent vibrant color
  const colors = [
    "#FFDE03", // Yellow
    "#FF6B9D", // Pink
    "#3B82F6", // Blue
    "#A3E635", // Lime
    "#FF9500", // Orange
    "#AF52DE", // Purple
    "#00C7BE", // Teal
  ];
  
  const color = colors[id % colors.length];
  
  const categoryStr = type === "movie" ? "movies" : "shows";

  return (
    <Link 
      href={`/browse/${categoryStr}?genre=${id}`}
      className="genre-tag"
      style={{ background: color, color: color === "#3B82F6" || color === "#AF52DE" ? "#FFF" : "#000", display: "inline-block" }}
    >
      {name}
    </Link>
  );
}
