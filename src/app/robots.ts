import type { MetadataRoute } from "next";
import { mainSite } from "@/lib/contact";

// Search and AI-answer crawlers are named on purpose so it's clear they're welcome.
// /card is kept out of results by its own noindex header, not here.
const crawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: crawlers, allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${mainSite}/sitemap.xml`,
  };
}
