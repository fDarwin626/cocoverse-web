import { Hero } from "@/components/hero/Hero";
import { AssetBrowser } from "@/components/home/AssetBrowser";
import { loadAssets } from "@/lib/stats";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export default async function Home() {
  const assets = await loadAssets(); 
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CocoVerse UI",
          url: SITE_URL,
          description:
            "A Flutter package of animated 3D and particle effects, with a live preview and copyable code for every effect.",
          inLanguage: "en",
        }}
      />
      <Hero />
      {/* The body slides up over the hero, so the two read as separate spaces. */}
      <section className="clay-fluff relative -mt-12 rounded-t-[48px] pb-24 pt-14">
        <div className="mx-auto max-w-[1400px] px-6">
          <AssetBrowser assets={assets} />
        </div>
      </section>
    </main>
  );
}