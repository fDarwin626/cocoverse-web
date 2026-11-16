// Takes one still picture of every effect and saves it to public/posters/<slug>.jpg.
//
// 1. Build and start the site:       npm run build   then   npm run start
// 2. In a second terminal, run:      node scripts/make-posters.mjs
//    One effect only:                node scripts/make-posters.mjs urchin
//
// The list of effects comes from the site's own sitemap, so a new asset is picked up by itself.
// A browser window opens and closes by itself: leave it alone while it works.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const OUT = "public/posters";
const WIDTH = 600;
const HEIGHT = 1041;

async function slugsFromSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not read ${BASE}/sitemap.xml (${res.status}). Is the site running?`);
  const xml = await res.text();
  return [...xml.matchAll(/\/asset\/([a-z0-9-]+)</g)].map((m) => m[1]);
}

const only = process.argv.slice(2);
const slugs = only.length ? only : await slugsFromSitemap();
mkdirSync(OUT, { recursive: true });

// A real window uses your graphics card. Set HEADLESS=1 to hide it.
const browser = await chromium.launch({ headless: process.env.HEADLESS === "1" });
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });

let failed = 0;
for (const slug of slugs) {
  process.stdout.write(`${slug} ... `);
  try {
    await page.goto(`${BASE}/capture/${slug}`, { waitUntil: "load" });
    // The page fades the live view in once its two-second warm-up is over.
    await page.waitForFunction(
      () => document.querySelector(".cvp-host")?.style.opacity === "1",
      null,
      { timeout: 90000 },
    );
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `${OUT}/${slug}.jpg`,
      type: "jpeg",
      quality: 82,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    console.log("ok");
  } catch (error) {
    failed++;
    console.log(`FAILED (${error.message})`);
  }
}

await browser.close();
console.log(failed ? `Done, ${failed} failed.` : "Done. Every picture is in public/posters.");
