import type { Metadata } from "next";
import { Suspense } from "react";
import { AssetView } from "@/components/detail/AssetView";
import { ASSETS } from "@/lib/assets";
import { docFor } from "@/lib/docs";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ASSETS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const asset = ASSETS.find((a) => a.slug === slug);
  if (!asset) return {};
    const summary = docFor(slug)?.summary ?? `${asset.name}, a Flutter effect in the CocoVerse UI package.`;
  const first = summary.includes(". ") ? `${summary.split(". ")[0]}.` : summary;
  const description = first.length > 158 ? `${first.slice(0, 155).trimEnd()}...` : first;
  const title = `${asset.name} for Flutter`;
  return {
    title,
    description,
    alternates: { canonical: `/asset/${slug}` },
    openGraph: {
      type: "article",
      siteName: "CocoVerse UI",
      title,
      description,
      url: `/asset/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function AssetPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <AssetContent params={params} />
    </Suspense>
  );
}

async function AssetContent({ params }: Props) {
  const { slug } = await params;
    const asset = ASSETS.find((a) => a.slug === slug);
  const doc = docFor(slug);
  return (
    <>
      {asset ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "CocoVerse UI", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: asset.name, item: `${SITE_URL}/asset/${slug}` },
                ],
              },
              {
                "@type": "TechArticle",
                headline: `${asset.name} for Flutter`,
                description: doc?.summary,
                url: `${SITE_URL}/asset/${slug}`,
                datePublished: asset.addedAt,
                inLanguage: "en",
                about: "Flutter",
                author: { "@type": "Organization", name: "CoCoNuT-sTuDiOs" },
              },
            ],
          }}
        />
      ) : null}
      <AssetView slug={slug} />
    </>
  );
}