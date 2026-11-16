import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Every crawler and AI agent may read every page. The only thing kept out is /flutter/,
 * the compiled Flutter files that run the live previews: they are large, and a crawler
 * gains nothing from them, since all the text is on the pages and in llms-full.txt.
 *
 * There is one group, for all bots. A bot named in a group of its own would ignore the
 * "*" group, so do not add named groups without repeating the disallow line.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/flutter/", "/capture/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}