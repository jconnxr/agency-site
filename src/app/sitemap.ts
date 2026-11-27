import type { MetadataRoute } from "next";
import { mainSite } from "@/lib/contact";

// /card is left out: it's noindex (the business-card QR landing page).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${mainSite}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${mainSite}/partners/`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
