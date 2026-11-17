export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://cocoverse-ui.vercel.app")
).replace(/\/+$/, "");