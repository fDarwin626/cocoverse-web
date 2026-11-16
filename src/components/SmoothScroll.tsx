"use client";

import { GLIDE, setLenis } from "@/lib/smoothScroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);


/**
 * Smooth, gliding mouse-wheel scrolling for the whole site, kept in step with GSAP's ScrollTrigger
 * so the pinned hero still works. A touch screen keeps its own native momentum.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: GLIDE,
      smoothWheel: true,
      // The details page scrolls inside its own box and has its own smooth scroller.
      prevent: (node) => node.hasAttribute("data-cv-modal"),
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}