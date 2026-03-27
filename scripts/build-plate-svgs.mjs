/**
 * Builds two production SVG plates in New Horizontal Logo/:
 * - conduitscore-plate-full-color.svg
 * - conduitscore-plate-monochrome.svg
 *
 * Source: exported-site-logos/conduitscore-lockup-full.png (transparent, full color).
 * Monochrome: black (#000000) ink, same alpha as full-color (print / single-ink use).
 *
 * Run: node scripts/build-plate-svgs.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "New Horizontal Logo", "conduitscore-lockup-full.png");
const OUT_DIR = path.join(ROOT, "New Horizontal Logo");

async function toMonochromeBlack(pngBuffer) {
  const { data, info } = await sharp(pngBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a === 0) continue;
    out[i] = 0;
    out[i + 1] = 0;
    out[i + 2] = 0;
  }
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

function wrapSvg({ w, h, title, dataUri }) {
  const esc = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, " ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 ${w} ${h}"
  width="${w}"
  height="${h}"
  role="img"
  aria-labelledby="plate-title">
  <title id="plate-title">${esc(title)}</title>
  <image
    x="0"
    y="0"
    width="${w}"
    height="${h}"
    preserveAspectRatio="xMidYMid meet"
    xlink:href="${dataUri}"
  />
</svg>
`;
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("Missing source PNG:", SRC);
    process.exit(1);
  }

  const meta = await sharp(SRC).metadata();
  const w = meta.width;
  const h = meta.height;

  const colorPng = await sharp(SRC).png({ compressionLevel: 9, effort: 10 }).toBuffer();
  const colorUri = `data:image/png;base64,${colorPng.toString("base64")}`;
  fs.writeFileSync(
    path.join(OUT_DIR, "conduitscore-plate-full-color.svg"),
    wrapSvg({
      w,
      h,
      title: "ConduitScore — horizontal lockup (full color)",
      dataUri: colorUri,
    }),
    "utf8",
  );

  const monoPng = await toMonochromeBlack(await fs.promises.readFile(SRC));
  const monoUri = `data:image/png;base64,${monoPng.toString("base64")}`;
  fs.writeFileSync(
    path.join(OUT_DIR, "conduitscore-plate-monochrome.svg"),
    wrapSvg({
      w,
      h,
      title: "ConduitScore — horizontal lockup (monochrome black on transparent)",
      dataUri: monoUri,
    }),
    "utf8",
  );

  console.log("Wrote:", path.join(OUT_DIR, "conduitscore-plate-full-color.svg"));
  console.log("Wrote:", path.join(OUT_DIR, "conduitscore-plate-monochrome.svg"));
  console.log("Dimensions:", w, "×", h);
  console.log("Full-color embed ~", Math.round(colorPng.length / 1024), "KB PNG");
  console.log("Monochrome embed ~", Math.round(monoPng.length / 1024), "KB PNG");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
