#!/usr/bin/env python3
"""Generate branded 1200×630 Open Graph images from real WEC event photos + logo.

Rules:
- preserve aspect ratios (cover crop, never stretch)
- face-safe / trophy-safe focal points
- WEC palette + official logo
- concise thumbnail-readable text
- no photographer credit watermarks on the card
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
OUT = ROOT / "public" / "og"

W, H = 1200, 630

# WEC palette
BG = (26, 20, 16)  # #1a1410
SAND = (222, 204, 167)  # #DECCA7
CINNAMON = (153, 77, 39)  # #994D27
GOLD = (196, 141, 73)  # #C48D49
PANEL = (20, 15, 11, 230)


@dataclass
class Card:
    key: str
    photo: str
    # Focal point in source image, 0–1 (0,0=top-left). Used for face-safe cover crop.
    focus: tuple[float, float]
    kicker: str
    title: str
    subtitle: str


CARDS: list[Card] = [
    Card(
        "home",
        "event-2.jpg",
        (0.48, 0.42),
        "WORLD ESPRESSO CHAMPIONSHIP",
        "Same coffee.\nSame machine.",
        "Only the barista differs.",
    ),
    Card(
        "panama-2026",
        "event-8.jpg",
        (0.55, 0.45),
        "WEC 2026",
        "Panama Finals",
        "First independent championship.",
    ),
    Card(
        "how-it-works",
        "event-29.jpg",
        (0.50, 0.35),
        "FORMAT & JUDGING",
        "Blind paired\ncomparison",
        "ISO 5495. The cup decides.",
    ),
    Card(
        "champions",
        "event-28.jpg",
        (0.50, 0.32),
        "CHAMPIONS",
        "Skill under\nidentical conditions",
        "Title. Product. Career.",
    ),
    Card(
        "innovation-lab",
        "event-36.jpg",
        (0.62, 0.40),
        "INNOVATION LAB",
        "Science behind\nthe shot",
        "Open data. Better espresso.",
    ),
    Card(
        "live",
        "event-31.jpg",
        (0.48, 0.40),
        "LIVE RESULTS",
        "Brackets as\nthey happen",
        "Follow every match.",
    ),
    Card(
        "dalla-corte",
        "hero-team.jpg",
        (0.58, 0.35),
        "PARTNERS",
        "Thank you,\nDalla Corte",
        "Same machines. Fair fight.",
    ),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def cover_crop(img: Image.Image, focus: tuple[float, float]) -> Image.Image:
    """Scale to cover 1200×630 without stretching; anchor on focus point."""
    src_w, src_h = img.size
    scale = max(W / src_w, H / src_h)
    new_w = int(round(src_w * scale))
    new_h = int(round(src_h * scale))
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    fx, fy = focus
    cx = fx * new_w
    cy = fy * new_h
    left = int(round(cx - W / 2))
    top = int(round(cy - H / 2))
    left = max(0, min(left, new_w - W))
    top = max(0, min(top, new_h - H))
    return resized.crop((left, top, left + W, top + H))


def draw_text_block(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, ...],
    line_gap: int = 8,
) -> int:
    x, y = xy
    for line in text.split("\n"):
        draw.text((x, y), line, font=font, fill=fill)
        bbox = draw.textbbox((x, y), line, font=font)
        y = bbox[3] + line_gap
    return y


def compose(card: Card) -> Image.Image:
    photo = Image.open(ASSETS / card.photo).convert("RGB")
    base = cover_crop(photo, card.focus)

    # Slight darken for text contrast without crushing faces in the photo panel
    base = ImageEnhance.Brightness(base).enhance(0.85)
    base = ImageEnhance.Contrast(base).enhance(1.05)

    canvas = Image.new("RGBA", (W, H), BG)
    canvas.paste(base, (0, 0))

    # Left brand panel (gradient-like solid with soft edge)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    panel_w = 560
    for i in range(panel_w + 80):
        alpha = 235 if i < panel_w else int(235 * (1 - (i - panel_w) / 80))
        odraw.line([(i, 0), (i, H)], fill=(26, 20, 16, alpha))
    # Bottom vignette
    for j in range(90):
        a = int(140 * (j / 90))
        odraw.line([(0, H - 1 - j), (W, H - 1 - j)], fill=(26, 20, 16, a))
    canvas = Image.alpha_composite(canvas, overlay)

    draw = ImageDraw.Draw(canvas)

    # Accent bar
    draw.rectangle([48, 56, 48 + 72, 56 + 4], fill=CINNAMON)

    # Logo
    logo = Image.open(ASSETS / "logo-white.png").convert("RGBA")
    logo.thumbnail((88, 88), Image.Resampling.LANCZOS)
    canvas.paste(logo, (48, 80), logo)

    font_kicker = load_font(22, bold=True)
    font_title = load_font(54, bold=True)
    font_sub = load_font(26, bold=False)
    font_brand = load_font(18, bold=True)

    draw.text((152, 98), card.kicker, font=font_kicker, fill=GOLD)

    y = draw_text_block(draw, (48, 200), card.title, font_title, SAND, line_gap=10)
    draw_text_block(draw, (48, y + 12), card.subtitle, font_sub, (200, 180, 140))

    draw.text((48, H - 56), "WORLD ESPRESSO CHAMPIONSHIP", font=font_brand, fill=CINNAMON)

    # Thin cinnamon frame
    draw.rectangle([0, 0, W - 1, H - 1], outline=CINNAMON, width=2)

    return canvas.convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    preview_dir = Path("/opt/cursor/artifacts/og-final")
    preview_dir.mkdir(parents=True, exist_ok=True)

    for card in CARDS:
        img = compose(card)
        out_path = OUT / f"{card.key}.jpg"
        img.save(out_path, "JPEG", quality=90, optimize=True, progressive=True)
        img.save(preview_dir / f"{card.key}.jpg", "JPEG", quality=90)
        print(f"wrote {out_path} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    main()
