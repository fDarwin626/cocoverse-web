import type { Metadata } from "next";
import { Suspense } from "react";
import { AssetView } from "@/components/detail/AssetView";
import { ASSETS } from "@/lib/assets";
import { docFor } from "@/lib/docs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ASSETS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const asset = ASSETS.find((a) => a.slug === slug);
  if (!asset) return {};
  return { title: asset.name, description: docFor(slug)?.summary };
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
  return <AssetView slug={slug} />;
}