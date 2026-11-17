import { busyEnd, busyStart } from "@/lib/smoothScroll";
import { afterLoader } from "@/lib/whenIdle";

export type FlutterApp = {
addView(options: { hostElement: HTMLElement; initialData?: Record<string, unknown> }): number;
  removeView(viewId: number): unknown;
};

declare global {
  interface Window {
    __cocoverseFlutter?: FlutterApp;
    cocoverseSetActive?: (viewId: number, active: boolean) => void;
  }
}


type LoaderState = { loading: Promise<FlutterApp> | null; scriptAdded: boolean };

// Kept on globalThis so hot reload (which re-runs this module) can never start a second engine.
const globalState = globalThis as unknown as {
  __cocoverseLoader?: LoaderState;
  __cocoverseScrollAt?: number;
  __cocoverseScrollWatch?: boolean;
};
const state: LoaderState = (globalState.__cocoverseLoader ??= { loading: null, scriptAdded: false });

/** Starts the one Flutter engine, the first time any phone asks for it. */
export function loadFlutter(): Promise<FlutterApp> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.__cocoverseFlutter) return Promise.resolve(window.__cocoverseFlutter);
  if (state.loading) return state.loading;

  state.loading = new Promise<FlutterApp>((resolve, reject) => {
        // While the engine starts, the page scrolls with the browser's own scrolling: smooth scrolling is
    // driven by script and would freeze together with the page.
    let busyOn = false;
    const endBusy = () => {
      if (!busyOn) return;
      busyOn = false;
      busyEnd();
    };
    const timeout = window.setTimeout(() => {
    state.loading = null;
    endBusy();
      reject(new Error("Flutter did not start in time"));
    }, 30000);
    window.addEventListener(
      "cocoverse-flutter-ready",
      () => {
        window.clearTimeout(timeout);
        endBusy();
        if (window.__cocoverseFlutter) resolve(window.__cocoverseFlutter);
      },
      { once: true },
    );
    // A slow start must never add a second engine. Two engines in one page crash with the Typeface and Picture errors.
    if (state.scriptAdded || document.querySelector("script[data-cocoverse-flutter]")) return;
        state.scriptAdded = true;
    // The engine's start-up blocks the page for a moment, so it waits for the loading screen to
    // go and for the browser to be idle. The page shows and scrolls first.
    afterLoader(() => {
      busyOn = true;
      busyStart();
      const script = document.createElement("script");
      script.src = "/flutter/flutter_bootstrap.js";
      script.async = true;
      script.dataset.cocoverseFlutter = "1";
      script.onerror = () => {
        window.clearTimeout(timeout);
        state.loading = null;
        state.scriptAdded = false;
        endBusy();
        reject(new Error("Could not load /flutter/flutter_bootstrap.js"));
      };
      document.head.appendChild(script);
    });

  });
  return state.loading;
}


/** How many views may warm up at once. Each warm-up draws frames, so more means a busier page. */
const MAX_WARM = 2;
/** A pause between one view finishing and the next one starting, in ms. */
const GAP_MS = 350;
/** How long the page must have been still before a new view is added, and the longest we wait for that, in ms. */
const QUIET_MS = 400;
const MAX_WAIT_MS = 5000;

let warming = 0;
const waiting: Array<() => void> = [];

function takeSlot(): Promise<void> {
  if (warming < MAX_WARM) {
    warming++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    waiting.push(() => {
      warming++;
      resolve();
    });
  });
}

function giveSlot() {
  warming--;
  waiting.shift()?.();
}

// Remember when the page last moved, so that new views wait until the visitor stops scrolling.
if (typeof window !== "undefined" && !globalState.__cocoverseScrollWatch) {
  globalState.__cocoverseScrollWatch = true;
  const mark = () => {
    globalState.__cocoverseScrollAt = performance.now();
  };
  for (const type of ["scroll", "wheel", "touchmove"]) {
    window.addEventListener(type, mark, { passive: true, capture: true });
  }
}

/** Resolves once the page has been still for QUIET_MS, or after MAX_WAIT_MS at the latest. */
function scrollQuiet(): Promise<void> {
  return new Promise((resolve) => {
    const started = performance.now();
    const check = () => {
      const now = performance.now();
      const since = now - (globalState.__cocoverseScrollAt ?? 0);
      if (since >= QUIET_MS || now - started >= MAX_WAIT_MS) resolve();
      else window.setTimeout(check, QUIET_MS - since + 20);
    };
    check();
  });
}

/** Resolves when the Flutter side says a view has finished warming up, or after `max` ms. */
export function viewReady(id: number, max = 4000): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener("cocoverse-view-ready", onReady);
      window.clearTimeout(timer);
      resolve();
    };
    const onReady = (event: Event) => {
      if ((event as CustomEvent<number>).detail === id) done();
    };
    const timer = window.setTimeout(done, max);
    window.addEventListener("cocoverse-view-ready", onReady);
  });
}

/**
 * Adds views two at a time, only while the page is still, and holds each place until the view has
 * warmed up. A screenful of phones then never all draw at once, and scrolling stays free.
 */
export async function enqueueView<T>(task: () => Promise<T>): Promise<T> {
  await takeSlot();
  try {
    await scrollQuiet();
    busyStart();
    try {
      return await task();
    } finally {
      busyEnd();
      await new Promise((resolve) => setTimeout(resolve, GAP_MS));
    }
  } finally {
    giveSlot();
  }
}