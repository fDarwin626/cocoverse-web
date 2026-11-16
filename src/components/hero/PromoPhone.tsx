"use client";

import { Icon } from "@iconify/react";
import { type CSSProperties, type MouseEvent, type PointerEvent, useRef } from "react";
import { type Promo, whatsappLink } from "@/lib/promo";
import { useClock } from "@/lib/useClock";
import "./promo.css";

/** How far along the track the knob must be let go to count as a slide: 70 percent. */
const SLIDE_DONE = 0.7;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * A campaign phone, drawn as a lock screen. A tap anywhere on the phone opens WhatsApp, and so
 * does sliding the gold knob along its track.
 */
export function PromoPhone({ promo }: { promo: Promo }) {
  const photo = { backgroundImage: `url(${promo.photo})` } as CSSProperties;
  const clock = useClock();
  const href = whatsappLink(promo.message);

  const slideRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const drag = useRef({ id: -1, startX: 0, max: 1, moved: false });
  const suppressClick = useRef(false);

  function reset() {
    const knob = knobRef.current;
    const slide = slideRef.current;
    if (!knob || !slide) return;
    // Glide back, then hand the knob back to its hint animation.
    knob.style.transition = "transform 0.25s ease";
    knob.style.transform = "translateX(0px)";
    slide.style.setProperty("--p", "0");
    window.setTimeout(() => {
      knob.style.transition = "";
      knob.style.transform = "";
      delete knob.dataset.drag;
    }, 260);
  }

  function onDown(event: PointerEvent<HTMLSpanElement>) {
    const knob = knobRef.current;
    const slide = slideRef.current;
    if (!knob || !slide) return;
    suppressClick.current = false;
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      max: Math.max(1, slide.clientWidth - knob.offsetWidth - 2 * knob.offsetLeft),
      moved: false,
    };
    knob.style.transition = "";
    knob.dataset.drag = "1";
    knob.setPointerCapture(event.pointerId);
  }

  function onMove(event: PointerEvent<HTMLSpanElement>) {
    const d = drag.current;
    const knob = knobRef.current;
    const slide = slideRef.current;
    if (d.id !== event.pointerId || !knob || !slide) return;
    const dx = clamp(event.clientX - d.startX, 0, d.max);
    if (dx > 6) d.moved = true;
    knob.style.transform = `translateX(${dx}px)`;
    slide.style.setProperty("--p", String(dx / d.max));
  }

  function onUp(event: PointerEvent<HTMLSpanElement>) {
    const d = drag.current;
    const knob = knobRef.current;
    if (d.id !== event.pointerId || !knob) return;
    d.id = -1;
    if (knob.hasPointerCapture(event.pointerId)) knob.releasePointerCapture(event.pointerId);
    // A drag must not also count as a tap on the link.
    if (d.moved) suppressClick.current = true;
    const dx = clamp(event.clientX - d.startX, 0, d.max);
    if (d.moved && dx >= d.max * SLIDE_DONE) {
      knob.style.transform = `translateX(${d.max}px)`;
      window.open(href, "_blank", "noopener,noreferrer");
      window.setTimeout(reset, 900);
    } else if (d.moved) {
      reset();
    } else {
      // A plain tap on the knob: the link handles it.
      delete knob.dataset.drag;
    }
  }

  function onCancel(event: PointerEvent<HTMLSpanElement>) {
    const d = drag.current;
    if (d.id !== event.pointerId) return;
    d.id = -1;
    reset();
  }

  function onLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    if (suppressClick.current) {
      suppressClick.current = false;
      event.preventDefault();
    }
  }

  return (
    <a
      className="pp"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onClick={onLinkClick}
      onDragStart={(event) => event.preventDefault()}
      aria-label={`${promo.title} Reach out on WhatsApp.`}
    >
      <span className="pp-body">
        <span className="pp-btn pp-b-action" aria-hidden="true" />
        <span className="pp-btn pp-b-up" aria-hidden="true" />
        <span className="pp-btn pp-b-down" aria-hidden="true" />
        <span className="pp-btn pp-b-power" aria-hidden="true" />
        <span className="pp-btn pp-b-cam" aria-hidden="true" />
        <span className="pp-bezel">
          <span className="pp-screen">
            <span className="pp-photo" style={photo} aria-hidden="true" />
            <span className="pp-tone" aria-hidden="true" />
            <span className="pp-island" aria-hidden="true" />
            <span className="pp-clock" aria-hidden="true">
              <span className="pp-date">{clock?.date ?? "\u00a0"}</span>
              <span className="pp-time">{clock?.time ?? "\u00a0"}</span>
            </span>
            <span className="pp-head">
              <span className="pp-label">
                <Icon icon={promo.icon} aria-hidden="true" />
                {promo.label}
              </span>
              <span className="pp-title">{promo.title}</span>
              <span className="pp-text">{promo.text}</span>
            </span>
            <span className="pp-slide" ref={slideRef}>
              <span
                className="pp-knob"
                ref={knobRef}
                aria-hidden="true"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onCancel}
              >
                <Icon icon="mdi:whatsapp" />
              </span>
              <span className="pp-slide-text">Slide to reach out</span>
            </span>
            <span className="pp-bar" aria-hidden="true" />
            <span className="pp-glare" aria-hidden="true" />
          </span>
        </span>
      </span>
    </a>
  );
}