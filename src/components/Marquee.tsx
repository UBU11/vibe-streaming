import React from "react";

interface MarqueeProps {
  items: string[];
}

export default function Marquee({ items }: MarqueeProps) {
  // Duplicate items array a few times to ensure infinite scroll fills the screen
  const multipliedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {multipliedItems.map((item, index) => (
          <div key={index} className="marquee-item">
            <span>{item}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
