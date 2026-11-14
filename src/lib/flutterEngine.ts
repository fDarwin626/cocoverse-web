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
const globalState = globalThis as unknown as { __cocoverseLoader?: LoaderState };
const state: LoaderState = (globalState.__cocoverseLoader ??= { loading: null, scriptAdded: false });

/** Starts the one Flutter engine, the first time any phone asks for it. */
export function loadFlutter(): Promise<FlutterApp> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.__cocoverseFlutter) return Promise.resolve(window.__cocoverseFlutter);
  if (state.loading) return state.loading;

  state.loading = new Promise<FlutterApp>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      state.loading = null;
      reject(new Error("Flutter did not start in time"));
    }, 30000);
    window.addEventListener(
      "cocoverse-flutter-ready",
      () => {
        window.clearTimeout(timeout);
        if (window.__cocoverseFlutter) resolve(window.__cocoverseFlutter);
      },
      { once: true },
    );
    // A slow start must never add a second engine. Two engines in one page crash with the Typeface and Picture errors.
    if (state.scriptAdded || document.querySelector("script[data-cocoverse-flutter]")) return;
    state.scriptAdded = true;
    const script = document.createElement("script");
    script.src = "/flutter/flutter_bootstrap.js";
    script.async = true;
    script.dataset.cocoverseFlutter = "1";
    script.onerror = () => {
      window.clearTimeout(timeout);
      state.loading = null;
      state.scriptAdded = false;
      reject(new Error("Could not load /flutter/flutter_bootstrap.js"));
    };
    document.head.appendChild(script);
  });
  return state.loading;
}


let chain: Promise<unknown> = Promise.resolve();
const GAP = () => new Promise((resolve) => setTimeout(resolve, 350));

/** Runs tasks one at a time, a moment apart, so a screenful of phones does not all start at once. */
export function enqueueView<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(GAP, GAP);
  return run;
}