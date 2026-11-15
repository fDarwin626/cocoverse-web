import { useEffect, useState } from "react";

export type Clock = { date: string; time: string };

function format(now: Date): Clock {
  // No time zone is given, so the browser uses the visitor's own.
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).formatToParts(now);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const date = `${pick("weekday")}, ${pick("day")} ${pick("month")}`;

  // The visitor's own 12 or 24 hour style, without AM or PM, like a lock screen.
  const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" })
    .formatToParts(now)
    .filter((p) => p.type !== "dayPeriod")
    .map((p) => p.value)
    .join("")
    .trim();

  return { date, time };
}

/** The visitor's local date and time, null until the page has mounted. It updates at the start of every minute. */
export function useClock(): Clock | null {
  const [clock, setClock] = useState<Clock | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = new Date();
      setClock(format(now));
      timer = window.setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  return clock;
}