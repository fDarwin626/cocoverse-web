import sharp from "sharp";

const SRC = "public/logo.png";
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const DARK = { r: 11, g: 10, b: 9, alpha: 1 };

// The browser tab icon: the whole head, square, transparent around it.
await sharp(SRC).resize(512, 512, { fit: "contain", background: CLEAR }).png({ compressionLevel: 9 }).toFile("src/app/icon.png");
console.log("wrote src/app/icon.png");

// The iPhone home-screen icon: iOS fills transparency with black, so it gets a dark background and a little room.
await sharp(SRC)
  .resize(150, 150, { fit: "contain", background: CLEAR })
  .flatten({ background: DARK })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: DARK })
  .png({ compressionLevel: 9 })
  .toFile("src/app/apple-icon.png");
console.log("wrote src/app/apple-icon.png");