"use client";

import { Icon } from "@iconify/react";
import type { CSSProperties } from "react";
import { type Promo, whatsappLink } from "@/lib/promo";
import { useClock } from "@/lib/useClock";
import "./promo.css";

/** A campaign phone, drawn as a lock screen. The whole phone is one link to WhatsApp, and the slide control sits inside its screen. */
export function PromoPhone({ promo }: { promo: Promo }) {
  const photo = { backgroundImage: `url(${promo.photo})` } as CSSProperties;
  const clock = useClock();
  return (
    <a
      className="pp"
      href={whatsappLink(promo.message)}
      target="_blank"
      rel="noopener noreferrer"
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
            <span className="pp-slide">
              <span className="pp-knob" aria-hidden="true">
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