/**
 * Builds all website logo assets from plate SVGs (transparent, no solid backgrounds).
 * Sources:
 *   New Horizontal Logo/conduitscore-plate-full-color.svg
 *   New Horizontal Logo/conduitscore-plate-monochrome.svg
 *
 * Run from phase_5_output: npm run generate:logos
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = process.cwd();
const PLATE_COLOR = path.join(ROOT, "New Horizontal Logo", "conduitscore-plate-full-color.svg");
const PLATE_MONO = path.join(ROOT, "New Horizontal Logo", "conduitscore-plate-monochrome.svg");
const OUT = path.join(ROOT, "public", "NEWNEW");
const LOGO_ROOT = path.join(ROOT, "public", "logo.svg");

const DENSITY = 300;
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function rasterColor(svgBuf, resizeOpts) {
  return sharp(svgBuf, { density: DENSITY }).resize(resizeOpts).ensureAlpha().png({ compressionLevel: 9 }).toBuffer();
}

/** Square icon: logo letterboxed on fully transparent canvas. */
async function squareIconTransparent(svgBuf, size, { padFraction = 0 } = {}) {
  const inner = Math.round(size * (1 - 2 * padFraction));
  const resized = await sharp(svgBuf, { density: DENSITY })
    .resize({ width: inner, height: inner, fit: "inside", background: TRANSPARENT })
    .ensureAlpha()
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: TRANSPARENT,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function toWhiteOnTransparent(pngBuffer) {
  const { data, info } = await sharp(pngBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    out[i + 3] = a;
  }
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** True average alpha at corners (should be 0 for transparency). */
async function minCornerAlpha(pngBuf) {
  const { data, info } = await sharp(pngBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const idx = (x, y) => (y * w + x) * 4 + 3;
  return Math.min(
    data[idx(0, 0)],
    data[idx(w - 1, 0)],
    data[idx(0, h - 1)],
    data[idx(w - 1, h - 1)],
  );
}

async function main() {
  if (!fs.existsSync(PLATE_COLOR) || !fs.existsSync(PLATE_MONO)) {
    console.error("Missing plate SVGs. Expected:", PLATE_COLOR, PLATE_MONO);
    process.exit(1);
  }

  const colorSvg = fs.readFileSync(PLATE_COLOR);
  const monoSvg = fs.readFileSync(PLATE_MONO);

  fs.mkdirSync(OUT, { recursive: true });

  // Master PNGs (transparent)
  const fullPng = await rasterColor(colorSvg, { width: 2400, fit: "inside" });
  fs.writeFileSync(path.join(OUT, "conduitscore-lockup-full.png"), fullPng);
  fs.writeFileSync(path.join(OUT, "conduitscore-lockup-transparent.png"), await rasterColor(colorSvg, { width: 480, fit: "inside" }));
  fs.writeFileSync(path.join(OUT, "nav-logo-200w.png"), await rasterColor(colorSvg, { width: 200, fit: "inside" }));
  fs.writeFileSync(path.join(OUT, "nav-logo-400w.png"), await rasterColor(colorSvg, { width: 400, fit: "inside" }));

  const monoPngLarge = await rasterColor(monoSvg, { width: 1600, fit: "inside" });
  fs.writeFileSync(path.join(OUT, "conduitscore-lockup-white.png"), await toWhiteOnTransparent(monoPngLarge));

  // SVG plates for direct use / schema
  fs.copyFileSync(PLATE_COLOR, path.join(OUT, "conduitscore-lockup.svg"));
  fs.copyFileSync(PLATE_COLOR, LOGO_ROOT);

  // Icons (all transparent)
  const s192 = await squareIconTransparent(colorSvg, 192);
  const s512 = await squareIconTransparent(colorSvg, 512);
  const s512Mask = await squareIconTransparent(colorSvg, 512, { padFraction: 0.1 });
  const apple = await squareIconTransparent(colorSvg, 180);
  const f32 = await squareIconTransparent(colorSvg, 32);
  const f16 = await squareIconTransparent(colorSvg, 16);
  const f48 = await squareIconTransparent(colorSvg, 48);
  const mstile = await squareIconTransparent(colorSvg, 150);

  fs.writeFileSync(path.join(OUT, "android-chrome-192x192.png"), s192);
  fs.writeFileSync(path.join(OUT, "android-chrome-512x512.png"), s512);
  fs.writeFileSync(path.join(OUT, "web-app-manifest-512x512.png"), s512Mask);
  fs.writeFileSync(path.join(OUT, "web-app-manifest-192x192.png"), await squareIconTransparent(colorSvg, 192, { padFraction: 0.08 }));
  fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), apple);
  fs.writeFileSync(path.join(OUT, "favicon-32x32.png"), f32);
  fs.writeFileSync(path.join(OUT, "favicon-16x16.png"), f16);
  fs.writeFileSync(path.join(OUT, "favicon-48x48.png"), f48);
  fs.writeFileSync(path.join(OUT, "mstile-150x150.png"), mstile);
  fs.writeFileSync(path.join(OUT, "favicon.ico"), await pngToIco([f16, f32]));

  // OG: wide transparent plate, logo centered (no background)
  const ogW = 1200;
  const ogH = 630;
  const ogMark = await sharp(colorSvg, { density: DENSITY })
    .resize({ width: 640, fit: "inside", background: TRANSPARENT })
    .ensureAlpha()
    .png()
    .toBuffer();
  await sharp({
    create: { width: ogW, height: ogH, channels: 4, background: TRANSPARENT },
  })
    .composite([{ input: ogMark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "og-image-1200x630.png"));

  // Delete obsolete / duplicate logo files (not llms or manifests)
  const remove = [
    "conduitscore-lockup-white.svg",
    "conduitscore-full-lockup.svg",
    "conduitscore-lockup-transparent_1.png",
    "lockup-1300x700.png",
  ];
  for (const name of remove) {
    const p = path.join(OUT, name);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  // Legacy source (optional clutter)
  const legacy = path.join(ROOT, "New Horizontal Logo", "exported-site-logos");
  if (fs.existsSync(legacy)) {
    fs.rmSync(legacy, { recursive: true, force: true });
    console.log("Removed:", legacy);
  }

  for (const name of ["newlogoConduitScoreHorizontal.cleaned.svg"]) {
    const p = path.join(ROOT, "New Horizontal Logo", name);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  // QA: corner alphas
  const checks = [
    ["android-chrome-512x512.png", s512],
    ["conduitscore-lockup-transparent.png", await fs.promises.readFile(path.join(OUT, "conduitscore-lockup-transparent.png"))],
    ["og-image-1200x630.png", await fs.promises.readFile(path.join(OUT, "og-image-1200x630.png"))],
  ];
  for (const [label, buf] of checks) {
    const a = await minCornerAlpha(buf);
    console.log(`Corner alpha (min @ corners) ${label}: ${a} (0 = transparent)`);
  }

  fs.copyFileSync(path.join(OUT, "conduitscore-lockup-full.png"), path.join(ROOT, "New Horizontal Logo", "conduitscore-lockup-full.png"));

  console.log("Wrote logo assets to", OUT);
  console.log("Wrote", LOGO_ROOT);
  console.log("Synced New Horizontal Logo/conduitscore-lockup-full.png for plate rebuilds (npm run build:plates)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
