/** Her WhatsApp number: country code and number, digits only. Change it here and every button follows. */
export const WHATSAPP_NUMBER = "2349128218436";

/** A WhatsApp link that opens with the message already typed. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type Promo = {
  id: string;
  /** The small line under the Dynamic Island, like the date on a lock screen. */
  label: string;
  /** An Iconify icon name, shown beside the label. */
  icon: string;
  title: string;
  text: string;
  /** What the visitor's WhatsApp message says when it opens. */
  message: string;
  /** The lock screen photo, blurred on the phone. Put the file in public/promo/. */
  photo: string;
};

/** The five campaign phones. Add or remove one here and everything follows. */
export const PROMOS: Promo[] = [
  {
    id: "fullstack",
    label: "Full-stack projects",
    icon: "solar:code-square-bold",
    title: "Have a project that needs a full-stack developer?",
    text: "From the first idea to launch: backend, frontend and everything in between.",
    message: "Hi, I have a project and I need a full-stack developer. Can we talk?",
    photo: "/promo/fullstack.jpg",
  },
  {
    id: "effect",
    label: "Request an effect",
    icon: "solar:widget-add-bold",
    title: "Want an effect added to the package?",
    text: "Tell us the effect you have in mind and we will consider building it into CocoVerse UI.",
    message: "Hi, I have an idea for a new effect for CocoVerse UI and I would like to suggest it.",
    photo: "/promo/effect.jpg",
  },
  {
    id: "flutter",
    label: "Flutter developer",
    icon: "solar:smartphone-bold",
    title: "Need a Flutter developer?",
    text: "Polished, animated apps for Android and iOS, built from start to finish.",
    message: "Hi, I need a Flutter developer for my app. Can we talk?",
    photo: "/promo/flutter.jpg",
  },
  {
    id: "question",
    label: "Questions and advice",
    icon: "solar:chat-round-dots-bold",
    title: "Questions about the package, or just need advice?",
    text: "Ask us about CocoVerse UI, or get a quick consultation. We are happy to help.",
    message: "Hi, I have a question about CocoVerse UI.",
    photo: "/promo/question.jpg",
  },
  {
    id: "website",
    label: "Websites",
    icon: "solar:monitor-bold",
    title: "Need a website for your product?",
    text: "A new site, a redesign or ongoing maintenance, all looked after for you.",
    message: "Hi, I need a website built, redesigned or maintained for my product. Can we talk?",
    photo: "/promo/website.jpg",
  },
];

/** The wide summary on the last page. One button for everything. */
export const BANNER = {
  eyebrow: "Open for work",
  title: "Have something in mind? Let's build it.",
  text: "Full-stack projects, Flutter apps, websites, new effects for the package, or a quick question. Send us a message on WhatsApp.",
  chips: ["Full-stack", "Flutter apps", "Websites", "New effects", "Questions and advice"],
  message: "Hi, I found you through CocoVerse UI and I would like to talk about a project.",
};

// ---------------------------------------------------------------------------
// How the pages are laid out. Nothing here knows how many pages there are, so it
// keeps working when the kit grows to ten pages or a thousand.
//
//   Page 1                 : assets only.
//   Every page after it    : one slot is a campaign phone, so it holds one asset fewer.
//   The last page (2 or up): the rest of the assets, then the summary banner.
// ---------------------------------------------------------------------------

export type PageInfo = {
  /** Index of the page's first asset in the sorted list. */
  start: number;
  /** How many assets the page holds. */
  take: number;
  /** Whether one slot is a campaign phone. */
  hasCard: boolean;
  /** Whether the summary banner closes the page. */
  hasBanner: boolean;
};

export function layoutPages(total: number, perPage: number): PageInfo[] {
  const pages: PageInfo[] = [];
  let start = 0;
  while (start < total || pages.length === 0) {
    const remaining = total - start;
    let take: number;
    let hasCard = false;
    let hasBanner = false;
    if (pages.length === 0) {
      take = Math.min(perPage, remaining);
    } else if (remaining <= perPage) {
      take = remaining;
      hasBanner = true;
    } else {
      take = perPage - 1;
      hasCard = true;
    }
    pages.push({ start, take, hasCard, hasBanner });
    start += take;
  }
  return pages;
}

/** Which campaign phone, and where in the grid. */
export type PromoRoll = { card: number; r: number };

/** A fresh roll, made each time a page is shown. r is turned into a slot when the page is drawn. */
export function rollPromo(): PromoRoll {
  return { card: Math.floor(Math.random() * PROMOS.length), r: Math.random() };
}