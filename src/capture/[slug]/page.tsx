import type { Metadata } from "next";
import { Suspense } from "react";
import { FlutterPreview } from "@/components/phone/FlutterPreview";
import { ASSETS } from "@/lib/assets";

/**
 * Only for scripts/make-posters.mjs. It shows one effect at the exact shape of a phone screen,
 * above everything else on the page, so the script can take its picture. Search engines are
 * told to stay away from it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ASSETS.map((a) => ({ slug: a.slug }));
}

export default function CapturePage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <CaptureContent params={params} />
    </Suspense>
  );
}

async function CaptureContent({ params }: Props) {
  const { slug } = await params;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 600,
        height: 1041,
        zIndex: 2147483647,
        background: "#000",
      }}
    >
      <FlutterPreview slug={slug} />
    </div>
  );
}