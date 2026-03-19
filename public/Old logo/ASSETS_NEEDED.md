# Missing Image Assets

The following image files are referenced in `layout.tsx` and `manifest.webmanifest` but need to be created by a designer or generated with an image tool.

## Required Files

### og-image.png
- **Dimensions:** 1200 x 630 pixels
- **Purpose:** Open Graph social sharing image (Facebook, LinkedIn, Twitter/X cards)
- **Design:** ConduitScore brand — violet-to-cyan gradient background (#080B14 base), crosshair logo icon, "ConduitScore" wordmark, "AI Visibility Score Scanner" tagline
- **Note:** A placeholder SVG version exists at `/og-image.svg`. Convert or recreate as PNG.

### logo.png
- **Dimensions:** 512 x 512 pixels (square, with transparent background)
- **Purpose:** Organization schema logo (`layout.tsx` JSON-LD), blog post publisher logo
- **Design:** ConduitScore crosshair icon on transparent background, or full wordmark

### apple-touch-icon.png
- **Dimensions:** 180 x 180 pixels
- **Purpose:** Apple device home screen icon (`<link rel="apple-touch-icon">` in layout.tsx)
- **Design:** Crosshair icon on violet-to-cyan gradient background, 20px corner radius recommended

### icon-192.png
- **Dimensions:** 192 x 192 pixels
- **Purpose:** PWA icon, referenced in `manifest.webmanifest`
- **Design:** Same as apple-touch-icon but 192x192

### icon-512.png
- **Dimensions:** 512 x 512 pixels
- **Purpose:** PWA splash screen icon, referenced in `manifest.webmanifest`
- **Design:** Same as icon-192 but 512x512

## Brand Colors Reference
- Primary violet: #6C3BFF
- Secondary cyan: #00D9FF
- Surface base (dark bg): #080B14
- Text primary: #F0F4FF
- Gradient: linear-gradient(135deg, #6C3BFF 0%, #00D9FF 100%)

## Current Workarounds
- `icon.svg` exists and is referenced as the SVG favicon
- `og-image.svg` exists as a placeholder for the OG image
- The site will not crash if PNG files are missing (URLs resolve to 404 but metadata still renders)
