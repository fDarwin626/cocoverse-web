/**
 * Runs `fn` when the browser has nothing else to do, or after `timeout` ms at the latest.
 * Returns a function that cancels it.
 */
export function whenIdle(fn: () => void, timeout = 2500): () => void {
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 250);
  return () => window.clearTimeout(id);
}

/**
 * Runs `fn` once the loading screen has gone (SiteLoader sets data-site-ready on <html>), and
 * then when the browser is idle. It waits at most `max` ms for the screen. Returns a cancel function.
 */
export function afterLoader(fn: () => void, max = 6000): () => void {
  const html = document.documentElement;
  const started = performance.now();
  let cancelIdle: () => void = () => {};
  let timer = 0;

  const check = () => {
    if (!html.hasAttribute("data-site-ready") && performance.now() - started < max) return false;
    cancelIdle = whenIdle(fn);
    return true;
  };

  if (!check()) {
    timer = window.setInterval(() => {
      if (check()) window.clearInterval(timer);
    }, 100);
  }

  return () => {
    window.clearInterval(timer);
    cancelIdle();
  };
}