"use client";

import { Icon } from "@iconify/react";

/** The window of page numbers to show: `size` pages, kept around the page you are on. */
export function pageWindow(pages: number, current: number, size: number): { first: number; last: number } {
  const count = Math.min(size, pages);
  const wanted = current - Math.floor((count - 1) / 2);
  const first = Math.max(1, Math.min(wanted, pages - count + 1));
  return { first, last: first + count - 1 };
}

type PaginationProps = {
  pages: number;
  current: number;
  /** How many page numbers show at once: 4 on a phone, 6 on desktop. */
  size: number;
  onGo: (page: number) => void;
};

/**
 * Never wider than `size` numbers, however many pages there are. Pages outside the window
 * are a dots button: the one on the left goes to page 1, the one on the right to the last page.
 */
export function Pagination({ pages, current, size, onGo }: PaginationProps) {
  const { first, last } = pageWindow(pages, current, size);
  const numbers = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  return (
    <nav aria-label="Pages" className="mt-16 flex items-center justify-center gap-1.5 md:gap-3">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <filter id="fur-edge" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <button
        type="button"
        aria-label="Previous page"
        disabled={current === 1}
        onClick={() => onGo(current - 1)}
        className="clay grid size-11 place-items-center rounded-full! text-ink-dim disabled:opacity-40"
      >
        <Icon icon="solar:alt-arrow-left-bold" width={18} />
      </button>

      {first > 1 ? (
        <button
          type="button"
          aria-label="First page"
          onClick={() => onGo(1)}
          className="grid h-9 w-4 place-items-center text-lg font-bold text-ink-dim hover:text-ink md:h-12 md:w-6"
        >
          …
        </button>
      ) : null}

      {numbers.map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === current ? "page" : undefined}
          onClick={() => onGo(n)}
          className={
            n === current
              ? "fur fur-gold grid size-9 place-items-center text-base font-bold md:size-12 md:text-xl"
              : "fur grid size-9 place-items-center text-base font-bold text-ink-dim hover:text-ink md:size-12 md:text-xl"
          }
        >
          {n}
        </button>
      ))}

      {last < pages ? (
        <button
          type="button"
          aria-label="Last page"
          onClick={() => onGo(pages)}
          className="grid h-9 w-4 place-items-center text-lg font-bold text-ink-dim hover:text-ink md:h-12 md:w-6"
        >
          …
        </button>
      ) : null}

      <button
        type="button"
        aria-label="Next page"
        disabled={current === pages}
        onClick={() => onGo(current + 1)}
        className="clay grid size-11 place-items-center rounded-full! text-ink-dim disabled:opacity-40"
      >
        <Icon icon="solar:alt-arrow-right-bold" width={18} />
      </button>
    </nav>
  );
}