from __future__ import annotations

import base64
import io
import json
import math
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageColor, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
SOURCE_SVG = PUBLIC_DIR / "conduitscore.svg"

# Some design exports add a full-bleed white <rect> behind the artwork; remove for dark UI.
_EXPORT_WHITE_PLATE = (
    '<rect x="-100.8" width="1209.6" fill="#ffffff" y="-57.6" height="691.2" fill-opacity="1"/>'
)

WHITE_CUTOFF = 242


def persist_svg_without_export_plate() -> None:
    if not SOURCE_SVG.is_file():
        return
    raw = SOURCE_SVG.read_text(encoding="utf-8")
    cleaned = raw.replace(_EXPORT_WHITE_PLATE, "")
    if cleaned != raw:
        SOURCE_SVG.write_text(cleaned, encoding="utf-8")


def load_embedded_png() -> Image.Image:
    svg_text = SOURCE_SVG.read_text(encoding="utf-8")
    match = re.search(r'data:image/png;base64,([^"]+)', svg_text)
    if not match:
        raise RuntimeError("Could not find embedded PNG in source SVG.")
    image_bytes = base64.b64decode(match.group(1))
    return Image.open(io.BytesIO(image_bytes)).convert("RGBA")


def crop_non_white(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    bg = Image.new("RGB", rgb.size, "white")
    diff = ImageChops.difference(rgb, bg)
    bbox = diff.getbbox()
    if not bbox:
        raise RuntimeError("Source image appears to be empty.")
    return image.crop(bbox)


def transparentize_whites(image: Image.Image) -> Image.Image:
    result = Image.new("RGBA", image.size)
    pixels = []
    source = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = source[x, y]
            if a == 0:
                pixels.append((0, 0, 0, 0))
                continue
            if r >= WHITE_CUTOFF and g >= WHITE_CUTOFF and b >= WHITE_CUTOFF:
                pixels.append((255, 255, 255, 0))
                continue
            pixels.append((r, g, b, a))
    result.putdata(pixels)
    return result


def segment_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getbbox()
    if not bbox:
        raise RuntimeError("Segment crop was empty.")
    return bbox


def trim(image: Image.Image) -> Image.Image:
    bbox = segment_bbox(image)
    return image.crop(bbox)


def contain(image: Image.Image, width: int, height: int) -> Image.Image:
    scale = min(width / image.width, height / image.height)
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def paste_center(canvas: Image.Image, image: Image.Image, x: int, y: int) -> None:
    canvas.alpha_composite(image, (x, y))


def make_horizontal(icon: Image.Image, wordmark: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (800, 180), (0, 0, 0, 0))
    icon_img = contain(icon, 128, 128)
    wordmark_img = contain(wordmark, 632, 68)
    gap = 24
    total_width = icon_img.width + gap + wordmark_img.width
    start_x = (canvas.width - total_width) // 2
    icon_y = (canvas.height - icon_img.height) // 2
    wordmark_y = (canvas.height - wordmark_img.height) // 2
    paste_center(canvas, icon_img, start_x, icon_y)
    paste_center(canvas, wordmark_img, start_x + icon_img.width + gap, wordmark_y)
    return canvas


def make_square_logo(icon: Image.Image, size: int, padding_ratio: float = 0.12) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target = round(size * (1 - padding_ratio * 2))
    icon_img = contain(icon, target, target)
    offset = ((size - icon_img.width) // 2, (size - icon_img.height) // 2)
    canvas.alpha_composite(icon_img, offset)
    return canvas


def make_square_from_full(image: Image.Image, size: int, padding_ratio: float = 0.12) -> Image.Image:
    return make_square_logo(image, size, padding_ratio=padding_ratio)


def make_maskable_from_full(image: Image.Image, size: int) -> Image.Image:
    return make_square_from_full(image, size, padding_ratio=0.2)


def make_horizontal_from_full(full: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (800, 180), (0, 0, 0, 0))
    scaled = contain(full, 760, 160)
    x = (canvas.width - scaled.width) // 2
    y = (canvas.height - scaled.height) // 2
    canvas.alpha_composite(scaled, (x, y))
    return canvas


def make_og_from_full(full: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (1200, 1200), ImageColor.getrgb("#080809") + (255,))
    draw = ImageDraw.Draw(canvas)
    for i, alpha in enumerate(range(80, 0, -1)):
        inset = i * 8
        if inset >= canvas.width // 2 or inset >= canvas.height // 2:
            break
        color = (255, 45, 85, alpha // 2)
        draw.rounded_rectangle(
            (inset, inset, canvas.width - inset, canvas.height - inset),
            radius=140,
            outline=color,
            width=2,
        )
    logo = contain(full, 1000, 620)
    lx = (canvas.width - logo.width) // 2
    ly = (canvas.height - logo.height) // 2
    canvas.alpha_composite(logo, (lx, ly))
    return canvas


def make_og_square(icon: Image.Image, wordmark: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (1200, 1200), ImageColor.getrgb("#080809") + (255,))
    draw = ImageDraw.Draw(canvas)
    for i, alpha in enumerate(range(80, 0, -1)):
        inset = i * 8
        if inset >= canvas.width // 2 or inset >= canvas.height // 2:
            break
        color = (255, 45, 85, alpha // 2)
        draw.rounded_rectangle(
            (inset, inset, canvas.width - inset, canvas.height - inset),
            radius=140,
            outline=color,
            width=2,
        )

    icon_img = contain(icon, 560, 560)
    wordmark_img = contain(wordmark, 820, 100)
    icon_x = (canvas.width - icon_img.width) // 2
    icon_y = 150
    wordmark_x = (canvas.width - wordmark_img.width) // 2
    wordmark_y = 830
    canvas.alpha_composite(icon_img, (icon_x, icon_y))
    canvas.alpha_composite(wordmark_img, (wordmark_x, wordmark_y))
    return canvas


def write_png(image: Image.Image, name: str) -> None:
    image.save(PUBLIC_DIR / name)


def write_ico(image: Image.Image, name: str) -> None:
    image.save(PUBLIC_DIR / name, sizes=[(16, 16), (32, 32), (48, 48)])


def hex_points(cx: float, cy: float, radius: float) -> list[tuple[float, float]]:
    points = []
    for i in range(6):
        angle = math.radians(-90 + i * 60)
        points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    return points


def draw_hex(draw: ImageDraw.ImageDraw, cx: float, cy: float, radius: float, color: str, width: int) -> None:
    points = hex_points(cx, cy, radius)
    draw.line(points + [points[0]], fill=color, width=width, joint="curve")


def make_simple_favicon_png(size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    cx = cy = size / 2

    draw_hex(draw, cx, cy, size * 0.42, "#6A0D36", max(1, round(size * 0.11)))
    draw_hex(draw, cx, cy, size * 0.29, "#C51663", max(1, round(size * 0.09)))
    draw_hex(draw, cx, cy, size * 0.18, "#FF4D8E", max(1, round(size * 0.08)))

    inner = hex_points(cx, cy, size * 0.11)
    draw.polygon(inner, fill=(15, 7, 18, 235))

    stroke = max(1, round(size * 0.06))
    arm = size * 0.12
    for angle in (0, 60, 120):
        radians = math.radians(angle)
        dx = math.cos(radians) * arm
        dy = math.sin(radians) * arm
        draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill="#FF6DA5", width=stroke)

    return canvas


def simple_favicon_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" role="img" aria-label="ConduitScore favicon mark">
  <path d="M32 6 L52 17.5 L52 40.5 L32 52 L12 40.5 L12 17.5 Z" stroke="#6A0D36" stroke-width="6" stroke-linejoin="round"/>
  <path d="M32 16 L44 23 L44 37 L32 44 L20 37 L20 23 Z" stroke="#C51663" stroke-width="5" stroke-linejoin="round"/>
  <path d="M32 24 L38.5 27.8 L38.5 35.2 L32 39 L25.5 35.2 L25.5 27.8 Z" stroke="#FF4D8E" stroke-width="4" stroke-linejoin="round"/>
  <path d="M32 28 L35.5 30 L35.5 34 L32 36 L28.5 34 L28.5 30 Z" fill="#0F0712"/>
  <path d="M32 25.5 L32 38.5 M26.5 28.8 L37.5 35.2 M26.5 35.2 L37.5 28.8" stroke="#FF6DA5" stroke-width="3" stroke-linecap="round"/>
</svg>
"""


def main() -> None:
    if not SOURCE_SVG.is_file():
        raise FileNotFoundError(f"Missing {SOURCE_SVG}; place transparent conduitscore.svg in public/.")

    persist_svg_without_export_plate()

    base = crop_non_white(load_embedded_png())
    full = trim(transparentize_whites(base))

    write_png(make_horizontal_from_full(full), "logo-horizontal.png")
    write_png(make_square_from_full(full, 160), "logo-square.png")
    write_png(make_square_from_full(full, 16), "favicon-16x16.png")
    write_png(make_square_from_full(full, 32), "favicon-32x32.png")
    write_png(make_square_from_full(full, 48), "favicon-48x48.png")
    write_png(make_square_from_full(full, 180), "apple-touch-icon.png")
    write_png(make_square_from_full(full, 192), "android-chrome-192x192.png")
    write_png(make_square_from_full(full, 512), "android-chrome-512x512.png")
    write_png(make_maskable_from_full(full, 512), "android-chrome-512x512-maskable.png")
    write_png(make_square_from_full(full, 512), "icon-512.png")
    write_png(make_og_from_full(full), "og-image.png")
    write_ico(make_square_from_full(full, 256), "favicon.ico")

    manifest = {
        "name": "ConduitScore",
        "short_name": "ConduitScore",
        "description": "AI Visibility Score Scanner — see how ChatGPT, Perplexity, and Claude find your site.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#080809",
        "theme_color": "#080809",
        "icons": [
            {"src": "/favicon-16x16.png", "sizes": "16x16", "type": "image/png"},
            {"src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png"},
            {"src": "/favicon-48x48.png", "sizes": "48x48", "type": "image/png"},
            {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
            {
                "src": "/android-chrome-512x512-maskable.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable",
            },
            {"src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
        ],
    }
    for filename in ("manifest.webmanifest", "site.webmanifest"):
        (PUBLIC_DIR / filename).write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
