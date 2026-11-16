"use client";

import { useLayoutEffect, useRef } from "react";
import { enqueueView, loadFlutter } from "@/lib/flutterEngine";
import { phoneFlight } from "@/lib/flight";
import { useTouchOnly } from "@/lib/useTouchOnly";
import { whenIdle } from "@/lib/whenIdle";

/** How long the phone takes to fly in from the grid, in milliseconds. The effect starts after it. */
const FLIGHT_MS = 1100;

/** The live effect in the details page's phone.
 *  It is always a fresh view, never the one from the grid. When the page opens over the
 *  grid it waits for the phone to land, so the effect is made at its final size. */
export function HeroPreview({ slug }: { slug: string }) {
  const box = useRef<HTMLDivElement>(null);
  const touch = useTouchOnly();

  useLayoutEffect(() => {
    const target = box.current;
    if (!target) return;
    let cancelled = false;
    let ownId: number | null = null;

    const mine = document.createElement("div");
    mine.className = "cvp-host";
    mine.style.opacity = "0";
    const poster = document.createElement("div");
    poster.className = "cvp-poster";
    target.append(mine, poster);

    const onReady = (event: Event) => {
      const id = ownId;
      if (id === null || (event as CustomEvent<number>).detail !== id) return;
      mine.style.opacity = "1";
      poster.remove();
      window.cocoverseSetActive?.(id, true);
    };
    window.addEventListener("cocoverse-view-ready", onReady);

    // Opened from the grid: let the phone land first. Opened directly: start at once.
    const delay = phoneFlight.get(slug) ? FLIGHT_MS : 0;
    // The engine's start-up blocks the page for a moment, so it waits until the browser is idle.
    let cancelIdle: () => void = () => {};
    const wait = window.setTimeout(() => {
      cancelIdle = whenIdle(() => {
        enqueueView(async () => {
          const app = await loadFlutter();
          if (cancelled) return;
          ownId = app.addView({ hostElement: mine, initialData: { slug, low: touch } });
        }).catch((error) => console.error("[cocoverse] could not start", slug, error));
      });
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(wait);
      cancelIdle();
      window.removeEventListener("cocoverse-view-ready", onReady);
      if (ownId !== null) window.__cocoverseFlutter?.removeView(ownId);
      mine.remove();
      poster.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return <div ref={box} className="absolute inset-0" />;
}