"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { activePhone, useActivePhone } from "@/lib/activePhone";
import { enqueueView, loadFlutter, viewReady } from "@/lib/flutterEngine";
import { useInView } from "@/lib/useInView";
import { useTouchOnly } from "@/lib/useTouchOnly";
import { PreviewPoster } from "./PreviewPoster";
import "./phone.css";

/** How long after the last touch an awake phone goes back to sleep. */
const IDLE_MS = 2500;
const LEAVE_MS = 1200;

/**
 * The live effect inside a phone screen: one view of the shared Flutter engine.
 *
 * On a phone or tablet nothing ever plays. The effect loads, shows its first frame and stays
 * still, and touching the screen does nothing. On desktop a phone wakes when you point at it.
 */
export function FlutterPreview({ slug }: { slug: string }) {
  const touch = useTouchOnly();
  const [wrapRef, near] = useInView<HTMLDivElement>("300px 0px");
  const hostRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<number | null>(null);
  const started = useRef(false);
  const timer = useRef(0);
  const [viewId, setViewId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const current = useActivePhone();
  const active = !touch && current === slug;

  // Add this phone's view the first time it comes near the screen.
  useEffect(() => {
    if (!near || started.current) return;
    started.current = true;
    enqueueView(async () => {
      const app = await loadFlutter();
      const host = hostRef.current;
      if (!host || !host.isConnected) {
        started.current = false;
        return;
      }
      const id = app.addView({ hostElement: host, initialData: { slug, low: touch } });
      idRef.current = id;
      setViewId(id);
      // Hold this place in the queue until the phone has warmed up, so only a few draw at once.
      await viewReady(id);
    }).catch((error) => {
      started.current = false;
      console.error("[cocoverse] could not start", slug, error);
    });
  }, [near, slug, touch]);

  // Give the view back when the phone leaves the page.
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      const id = idRef.current;
      if (id !== null) {
        window.__cocoverseFlutter?.removeView(id);
        idRef.current = null;
      }
    },
    [],
  );

  // Flutter says when the phone has had its two-second warm-up.
  useEffect(() => {
    if (viewId === null) return;
    const onReady = (event: Event) => {
      if ((event as CustomEvent<number>).detail === viewId) setReady(true);
    };
    window.addEventListener("cocoverse-view-ready", onReady);
    return () => window.removeEventListener("cocoverse-view-ready", onReady);
  }, [viewId]);

  // Wake or sleep the Flutter side. On a phone it is never awake.
  useEffect(() => {
    if (viewId === null) return;
    window.cocoverseSetActive?.(viewId, active);
  }, [viewId, active]);

  function sleepAfter(ms: number) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (activePhone.get() === slug && !activePhone.isHeld(slug)) activePhone.set(null);
    }, ms);
  }

  // An awake phone goes back to sleep once the user stops interacting.
  useEffect(() => {
    if (active) sleepAfter(IDLE_MS);
    else window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ...or when it is scrolled away.
  useEffect(() => {
    if (active && !near) activePhone.set(null);
  }, [active, near]);

  function poke() {
    if (active) sleepAfter(IDLE_MS);
  }

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerMove={poke}
      onPointerDown={poke}
      onPointerUp={poke}
      onWheel={poke}
      onPointerLeave={() => {
        if (active) sleepAfter(LEAVE_MS);
      }}
    >
      {/* On a phone the view ignores every touch, so a tap does nothing and the page scrolls freely. */}
      <div
        ref={hostRef}
        className="cvp-host"
        style={{ opacity: ready ? 1 : 0, pointerEvents: touch ? "none" : undefined }}
      />
      {!ready ? <PreviewPoster /> : null}
      {ready && !active && !touch ? (
        <button
          type="button"
          className="cvp-wake"
          aria-label={`Play the ${slug} preview`}
          onClick={() => activePhone.set(slug)}
        />
      ) : null}
      {ready && !active && !touch ? (
        <span className="cvp-play" aria-hidden="true">
          <Icon icon="solar:play-bold" />
        </span>
      ) : null}
    </div>
  );
}