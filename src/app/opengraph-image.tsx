import { ImageResponse } from "next/og";

export const alt = "CocoVerse UI: animated 3D and particle effects for Flutter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The picture that appears when a link to the site is shared. Dark page, gold accent, like the site. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#0b0a09",
          color: "#f3eee4",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#e8b64a", textTransform: "uppercase" }}>
          Flutter package
        </div>
        <div style={{ display: "flex", fontSize: 124, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>
          CocoVerse UI
        </div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 28, color: "#a59e91", maxWidth: 920, lineHeight: 1.3 }}>
          Animated 3D and particle effects, with a live preview and copyable code for every one.
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 56, color: "#e8b64a" }}>
          flutter pub add cocoverse_ui
        </div>
      </div>
    ),
    size,
  );
}