/**
 * The public address of the site, with no trailing slash.
 *
 * On Vercel it fills itself in from the project's production address. Once you buy a
 * domain, set NEXT_PUBLIC_SITE_URL in the Vercel project settings (for example
 * https://cocoverse.dev) and every link in robots.txt, sitemap.xml, llms.txt and
 * llms-full.txt follows it. On your own computer it is http://localhost:3000.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");