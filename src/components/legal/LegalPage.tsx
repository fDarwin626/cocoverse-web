import type { ReactNode } from "react";

/** The frame for the terms and the privacy policy: a title, a date and sections. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[760px] px-6 pb-32 pt-32">
      <h1 className="text-4xl md:text-6xl">{title}</h1>
      <p className="mt-4 text-sm text-ink-dim">Last updated: {updated}</p>
      <div className="mt-10 space-y-10">{children}</div>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl text-gold-text">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink">{children}</div>
    </section>
  );
}