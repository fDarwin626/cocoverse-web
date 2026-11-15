import type { MetadataRoute } from "next";
import { ASSETS } from "@/lib/assets";
import { SITE_URL } from "@/lib/site";

/** The home page and one page for every asset in ASSETS. A new asset appears here by itself. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...ASSETS.map((asset) => ({
      url: `${SITE_URL}/asset/${asset.slug}`,
      lastModified: new Date(asset.addedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}