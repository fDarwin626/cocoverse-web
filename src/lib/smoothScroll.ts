import type Lenis from "lenis";

/** How soft the glide is. Lower is more rubbery and slower to stop (0.05 is very soft); higher is tighter (0.15). */
export const GLIDE = 0.085;

let lenis: Lenis | null = null;

/** Set by SmoothScroll when it starts, and cleared when it stops. */
export function setLenis(next: Lenis | null) {
  lenis = next;
  applyWheel();
}

let busy = 0;
const extras = new Set<Lenis>();

function setWheel(l: Lenis, on: boolean) {
  (l.options as { smoothWheel?: boolean }).smoothWheel = on;
}

function applyWheel() {
  const on = busy === 0;
  if (lenis) setWheel(lenis, on);
  extras.forEach((l) => setWheel(l, on));
}

/** The Flutter side is working: scroll with the browser's own scrolling until it is done. */
export function busyStart() {
  busy++;
  applyWheel();
}

/** The Flutter side has finished one piece of work. */
export function busyEnd() {
  busy = Math.max(0, busy - 1);
  applyWheel();
}

/** Makes another smooth scroller (the details box) follow the same rule. Returns a function that stops that. */
export function trackSmooth(l: Lenis): () => void {
  extras.add(l);
  applyWheel();
  return () => {
    extras.delete(l);
  };
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