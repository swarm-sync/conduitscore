# ConduitScore Logo Implementation Tasks

## Use New Logo Assets
- [x] Replace the current header logo with `conduitscore_horizontal_logo.svg`
- [x] Replace the current footer logo with `conduitscore_horizontal_logo.svg`
- [x] Use `conduitscore_mark.svg` for favicon, app icon, or compact mobile logo placements
- [x] Remove all old PNG logo files from header/footer production use
- [x] Do not use screenshot-derived logo files anywhere on the site

## Header Fix
- [x] Remove the visible black box around the header logo by using only transparent SVG assets
- [x] Remove any wrapper background color behind the logo
- [x] Remove any border, shadow, or container styling that creates a visible rectangle around the logo
- [x] Set header logo height to `44px`
- [x] Set header logo width to `auto`
- [x] Add `display: block;` to the logo image element
- [x] Vertically center the logo inside the navbar
- [x] Keep the logo crisp on desktop and mobile

## Footer Fix
- [x] Replace the current pixelated footer logo with SVG
- [x] Use a footer logo max width of `280px`
- [x] Do not upscale any PNG in the footer
- [x] Ensure the footer logo is rendered from SVG only
- [x] Keep the footer logo fully transparent with no visible image box

## Asset Rules
- [x] Use SVG as the default format for all on-site logo placements
- [x] Use PNG only as fallback where SVG is not supported
- [x] If PNG fallback is required, export it from the SVG master at 4x size with transparent background
- [x] Keep one consistent logo system across header, footer, and branded sections

## Recommended File Usage
- [x] `conduitscore_horizontal_logo.svg` = navbar, footer, legal pages, docs header, sign-in, dashboard sidebar
- [x] `conduitscore_master_logo.svg` = hero sections, brand blocks, large branded placements
- [x] `conduitscore_mark.svg` = favicon (`<link rel="icon" type="image/svg+xml">`), app icon (apple-touch-icon, android-chrome), compact badges

## CSS / Component Rules
- [x] Ensure logo containers use transparent backgrounds
- [x] Do not stretch logos beyond native aspect ratio
- [x] Use `max-width: 100%; height: auto;`
- [x] Avoid applying blur, filter, opacity, or transform effects to production logo components (mixBlendMode removed everywhere)
- [x] Check logos on retina/high-DPI displays for sharpness (SVG is resolution-independent)

## QA Checklist
- [x] Header logo no longer looks stamped onto the page
- [x] No black rectangle is visible around the header logo
- [x] Footer logo is sharp and no longer pixelated
- [x] Same logo family is used consistently across the site
- [x] All logo assets scale cleanly on desktop and mobile
- [x] No low-resolution or screenshot-based logo assets remain in production
