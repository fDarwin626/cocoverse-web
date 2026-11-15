"use client";

import { Icon } from "@iconify/react";
import { BANNER, whatsappLink } from "@/lib/promo";
import "./promo.css";

/** The summary that closes the last page: a panel cut into the stone. One link, one button. */
export function PromoBanner() {
  return (
    <a
      className="pb"
      href={whatsappLink(BANNER.message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${BANNER.title} Reach out on WhatsApp.`}
    >
      <span className="pb-inner">
        <span className="pb-copy">
          <span className="pb-eyebrow">{BANNER.eyebrow}</span>
          <span className="pb-title">{BANNER.title}</span>
          <span className="pb-text">{BANNER.text}</span>
          <span className="pb-chips">
            {BANNER.chips.map((chip) => (
              <span className="pb-chip" key={chip}>
                {chip}
              </span>
            ))}
          </span>
        </span>
        <span className="pb-cta">
          <Icon icon="mdi:whatsapp" width={22} height={22} />
          Reach out
        </span>
      </span>
    </a>
  );
}