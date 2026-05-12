# ConduitScore Logo Fix Tasks

## Header Logo Fix
- [ ] Remove the current header logo asset.
- [ ] Replace it with a **transparent-background SVG** version of the ConduitScore logo.
- [ ] If SVG is not available, use a **transparent PNG exported at 4x resolution**.
- [ ] Ensure the logo file itself has **no black background baked into it**.
- [ ] Set the header logo container background to **transparent**.
- [ ] Remove any CSS background color, border, box-shadow, or image wrapper styling that creates the visible black box around the logo.
- [ ] Ensure the logo sits directly on the site header background with no visible rectangular image boundary.
- [ ] Keep the logo vertically centered in the navbar.

## Footer Logo Fix
- [ ] Remove the current footer logo asset.
- [ ] Replace it with the same **transparent SVG master logo** used in the header.
- [ ] If using PNG fallback, export a **large transparent PNG** specifically for footer use, at minimum **1200px wide**.
- [ ] Do not upscale a small logo file in CSS.
- [ ] Set the rendered footer logo size from a large source asset, not by stretching a tiny image.
- [ ] Ensure `image-rendering: auto;` is used.
- [ ] Ensure the logo is displayed at **100% scale or smaller relative to its source dimensions**.
- [ ] Remove any compressed or screenshot-derived logo assets from production.

## Asset Standardization
- [ ] Create one official logo pack for the site:
  - [ ] `logo-mark.svg`
  - [ ] `logo-horizontal.svg`
  - [ ] `logo-full.svg`
  - [ ] `logo-mark@4x.png`
  - [ ] `logo-full@4x.png`
- [ ] Use SVG everywhere possible on the website.
- [ ] Use PNG only as fallback for places SVG cannot be used.
- [ ] Ensure all exported PNGs have **transparent backgrounds**.
- [ ] Ensure all logo exports come from the original vector/source design file, not from screenshots or cropped website images.

## Navbar Implementation
- [ ] Render the logo using a clean image tag or component with no decorative wrapper behind it.
- [ ] Constrain logo height in the navbar to a clean fixed size, such as **40–52px high**.
- [ ] Let width scale automatically to preserve aspect ratio.
- [ ] Add `display: block;` to the logo image to avoid inline spacing artifacts.
- [ ] Confirm the logo looks crisp on desktop and mobile.

## Footer Implementation
- [ ] Render the footer logo from vector source.
- [ ] Set a fixed max width appropriate for the footer layout.
- [ ] Do not enlarge beyond native clarity if PNG fallback is used.
- [ ] Check the logo on retina/high-DPI screens to confirm it remains sharp.

## QA Checks
- [ ] No visible black rectangle around the header logo.
- [ ] Header logo blends cleanly into the navbar background.
- [ ] Footer logo is sharp, not blurry or pixelated.
- [ ] Both header and footer use transparent-background assets.
- [ ] Same logo system is used consistently across the site.
- [ ] No screenshot-based or low-res logo files remain in production.