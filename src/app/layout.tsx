import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// One type system: Archivo (variable width) for headlines and body, IBM Plex Mono
// only for small data labels. Both are self-hosted by next/font at build time.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Italic serif for single accent words in headlines ("customers.").
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = "https://www.axiommediagroupokc.com";
const shareTitle = "Axiom Media Group | Websites and Google profiles for OKC businesses";
const shareDescription =
  "We set up the online side of your business, then keep it bringing in customers. Based in Oklahoma City.";
// Regenerate with: node scripts/make-og-image.mjs (after a build)
const shareImage = `${siteUrl}/og-image.png`;
const shareImageAlt = "Axiom Media Group: websites, Google profiles and ads for Oklahoma City businesses";

export const metadata: Metadata = {
  title: `${site.name} | Websites, Google profiles and ads for Oklahoma City businesses`,
  description:
    "We set up the online side of your business and keep it bringing in customers: websites, Google Business Profiles, AI search, online booking, social media and ads in Oklahoma City.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  // Link previews (iMessage, Facebook, LinkedIn, X). The card is a fixed,
  // designed image so no photo on the page gets picked up instead.
  openGraph: {
    type: "website",
    url: `${siteUrl}/`,
    siteName: site.name,
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage, width: 1200, height: 630, alt: shareImageAlt, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage, alt: shareImageAlt }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} ${instrument.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
