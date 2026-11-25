import type { MetadataRoute } from "next";
import { mainSite } from "@/lib/contact";

// Only the homepage: /card is noindex (it's the business-card QR landing page).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${mainSite}/`, changeFrequency: "monthly", priority: 1 }];
}
