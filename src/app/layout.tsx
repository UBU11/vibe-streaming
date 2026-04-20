import type { Metadata } from "next";
import Script from "next/script";
import { getDatadogRumScript } from "@/lib/datadog";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";
import { Space_Grotesk, Bangers } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const bangers = Bangers({ weight: '400', subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: "Vibe — Stream Your World",
  description: "A premium video streaming platform with adaptive bitrate playback, personal libraries, and real-time discovery.",
  keywords: ["video", "streaming", "vibe", "hls", "watch"],
  openGraph: {
    title: "Vibe — Stream Your World",
    description: "Discover and stream videos with a premium experience.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${bangers.variable}`}>
        <Navbar />
        <main>{children}</main>
        {/* <Script id="datadog-rum" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: getDatadogRumScript() }} /> */}
      </body>
    </html>
  );
}
