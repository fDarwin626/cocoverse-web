"use client";

import { useEffect, useState } from "react";
import "./site-loader.css";

/** The least time the screen stays on the first visit of a browser session, in ms. */
const MIN_FIRST_MS = 900;
/** The most time it ever stays, in ms, so a slow device is never stuck behind it. */
const MAX_MS = 8000;
/** How long the fade out takes, in ms. Keep it the same as the 0.6s in site-loader.css. */
const FADE_MS = 600;

type Phase = "show" | "leaving" | "gone";

function hasWebGL2(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * A full-screen loading screen that covers the page from the first paint until it is ready.
 * On the home page "ready" means the fur hero has drawn itself (FurBackdrop sets data-fur-top on
 * <html>), so the plain hero is never seen. On any other page it means the fonts are in.
 */
export function SiteLoader() {
  const [phase, setPhase] = useState<Phase>("show");
  useEffect(() => {
    const html = document.documentElement;
    const onHome = window.location.pathname === "/";
    const started = performance.now();

    let seen = false;
    try {
      seen = sessionStorage.getItem("cv-splash") === "1";
      sessionStorage.setItem("cv-splash", "1");
    } catch {
      // Storage is blocked: treat it as a first visit.
    }
    const minMs = seen ? 0 : MIN_FIRST_MS;

    let dead = false;
    let left = false;
    let ready = false;
    let minTimer = 0;
    let fadeTimer = 0;
    let observer: MutationObserver | null = null;

    const leave = () => {
      if (dead || left) return;
      left = true;
      html.setAttribute("data-site-ready", "");
      setPhase("leaving");
      fadeTimer = window.setTimeout(() => setPhase("gone"), FADE_MS);
    };

    const markReady = () => {
      if (dead || ready) return;
      ready = true;
      observer?.disconnect();
      minTimer = window.setTimeout(leave, Math.max(0, minMs - (performance.now() - started)));
    };

    const maxTimer = window.setTimeout(leave, MAX_MS);

    if (onHome && hasWebGL2()) {
      if (html.hasAttribute("data-fur-top")) {
        markReady();
      } else {
        observer = new MutationObserver(() => {
          if (html.hasAttribute("data-fur-top")) markReady();
        });
        observer.observe(html, { attributes: true, attributeFilter: ["data-fur-top"] });
      }
    } else {
      // Any other page, or no WebGL2 (then the plain hero stays): fonts in, and a frame painted.
      const fonts = document.fonts?.ready ?? Promise.resolve();
      fonts.then(() => requestAnimationFrame(() => requestAnimationFrame(markReady)));
    }

    return () => {
      dead = true;
      window.clearTimeout(maxTimer);
      window.clearTimeout(minTimer);
      window.clearTimeout(fadeTimer);
      observer?.disconnect();
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className="cv-loader" data-phase={phase} role="status" aria-live="polite">
      <div className="cv-loader-mark">
        <div className="cv-loader-logo" aria-hidden="true">
          <span>CocoVerse</span>
          <span className="cv-loader-ui">ui</span>
        </div>
        <div className="cv-loader-track" aria-hidden="true" />
        <span className="sr-only">Loading CocoVerse UI</span>
      </div>
    </div>
  );
}