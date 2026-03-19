from __future__ import annotations

import base64
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageColor, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE_SVG = ROOT / "brand" / "ConduitScore.svg"
PUBLIC_DIR = ROOT / "public"

WHITE_CUTOFF = 242


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


def main() -> None:
    base = crop_non_white(load_embedded_png())

    icon = trim(transparentize_whites(base.crop((108, 0, 532, 469))))
    wordmark = trim(transparentize_whites(base.crop((0, 519, 632, 579))))

    horizontal = make_horizontal(icon, wordmark)
    square160 = make_square_logo(icon, 160)
    square48 = make_square_logo(icon, 48)
    square180 = make_square_logo(icon, 180)
    square192 = make_square_logo(icon, 192)
    square512 = make_square_logo(icon, 512)
    maskable512 = make_square_logo(icon, 512, padding_ratio=0.2)
    og_square = make_og_square(icon, wordmark)

    write_png(horizontal, "logo-horizontal.png")
    write_png(square160, "logo-square.png")
    write_png(make_square_logo(icon, 16), "favicon-16x16.png")
    write_png(make_square_logo(icon, 32), "favicon-32x32.png")
    write_png(square48, "favicon-48x48.png")
    write_png(square180, "apple-touch-icon.png")
    write_png(square192, "android-chrome-192x192.png")
    write_png(square512, "android-chrome-512x512.png")
    write_png(maskable512, "android-chrome-512x512-maskable.png")
    write_png(square512, "icon-512.png")
    write_png(og_square, "og-image.png")
    write_ico(square512, "favicon.ico")

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
