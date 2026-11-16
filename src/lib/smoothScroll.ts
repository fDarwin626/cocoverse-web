import type Lenis from "lenis";

/** How soft the glide is. Lower is more rubbery and slower to stop (0.05 is very soft); higher is tighter (0.15). */
export const GLIDE = 0.085;

let lenis: Lenis | null = null;

/** Set by SmoothScroll when it starts, and cleared when it stops. */
export function setLenis(next: Lenis | null) {
  lenis = next;
}

/** Freezes the page's scrolling, for example while the blur veil is open. */
export function stopSmooth() {
  lenis?.stop();
}

/** Lets the page scroll again. */
export function startSmooth() {
  lenis?.start();
}

/** Scrolls the page to an element, through Lenis when it is running. */
export function scrollToElement(el: HTMLElement | null) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}