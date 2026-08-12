#!/usr/bin/env python3
"""Generate branded 1200×630 Open Graph images from real WEC photography."""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
OUT = ASSETS / "og"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
ESPRESSO = (26, 20, 16)
SAND = (222, 204, 167)
CINNAMON = (196, 120, 58)
CREAM = (245, 236, 220)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def cover_crop(src: Image.Image, box: tuple[int, int], focal: tuple[float, float] = (0.5, 0.4)) -> Image.Image:
    """Scale to cover box without distortion; crop using focal point (0–1)."""
    tw, th = box
    img = src.convert("RGB")
    scale = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale + 0.5), int(img.height * scale + 0.5)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    fx, fy = focal
    left = int((nw - tw) * fx)
    top = int((nh - th) * fy)
    left = max(0, min(left, nw - tw))
    top = max(0, min(top, nh - th))
    return img.crop((left, top, left + tw, top + th))


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], font, fill, max_width: int, line_gap: int = 8):
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    x, y = xy
    for line in lines[:4]:
        draw.text((x, y), line, font=font, fill=fill)
        bbox = draw.textbbox((x, y), line, font=font)
        y = bbox[3] + line_gap
    return y


def compose(
    filename: str,
    photo: Path,
    eyebrow: str,
    title: str,
    subtitle: str,
    focal: tuple[float, float] = (0.45, 0.35),
    photo_side: str = "right",
) -> Path:
    base = Image.new("RGB", (W, H), ESPRESSO)
    photo_w = 620
    src = Image.open(photo)
    crop = cover_crop(src, (photo_w, H), focal=focal)

    if photo_side == "right":
        base.paste(crop, (W - photo_w, 0))
        # Gradient into text panel
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for i in range(180):
            alpha = int(255 * (1 - i / 180))
            x = W - photo_w - 40 + i
            od.line([(x, 0), (x, H)], fill=(26, 20, 16, alpha))
        base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
        text_max = W - photo_w - 80
        text_x = 56
    else:
        base.paste(crop, (0, 0))
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        for i in range(W):
            # Darken left-to-right for text readability without hiding faces on left
            t = min(1.0, max(0.0, (i - 420) / 500))
            alpha = int(210 * t)
            od.line([(i, 0), (i, H)], fill=(26, 20, 16, alpha))
        # Soft top/bottom bars
        for j in range(80):
            a = int(160 * (1 - j / 80))
            od.line([(0, j), (W, j)], fill=(26, 20, 16, a))
            od.line([(0, H - 1 - j), (W, H - 1 - j)], fill=(26, 20, 16, a))
        base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
        text_max = 520
        text_x = 56

    draw = ImageDraw.Draw(base)

    # Logo
    logo_path = ASSETS / "logo-white.png"
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        logo = ImageOps.contain(logo, (72, 72), Image.Resampling.LANCZOS)
        base.paste(logo, (text_x, 48), logo)
        draw = ImageDraw.Draw(base)

    font_eye = load_font(22, bold=True)
    font_title = load_font(48, bold=True)
    font_sub = load_font(24, bold=False)
    font_foot = load_font(18, bold=False)

    y = 140
    draw.text((text_x, y), eyebrow.upper(), font=font_eye, fill=CINNAMON)
    y += 40
    draw.rectangle([text_x, y, text_x + 64, y + 4], fill=CINNAMON)
    y += 28
    y = draw_wrapped(draw, title, (text_x, y), font_title, CREAM, text_max, line_gap=10)
    y += 10
    draw_wrapped(draw, subtitle, (text_x, y), font_sub, SAND, text_max, line_gap=8)

    draw.text((text_x, H - 52), "worldespressochampionship.com", font=font_foot, fill=(160, 140, 110))

    out_path = OUT / filename
    base.save(out_path, "JPEG", quality=88, optimize=True)
    print(f"Wrote {out_path} ({out_path.stat().st_size // 1024} KB)")
    return out_path


def main() -> None:
    cards = [
        dict(
            filename="home.jpg",
            photo=ASSETS / "event-2.jpg",
            eyebrow="World Espresso Championship",
            title="The cup is the only judge",
            subtitle="Controlled. Blind. Published.",
            focal=(0.5, 0.32),
            photo_side="right",
        ),
        dict(
            filename="panama-2026.jpg",
            photo=ASSETS / "event-36.jpg",
            eyebrow="WEC 2026 Panama",
            title="26 October · Café Unido",
            subtitle="Registration open · Public partner prices",
            focal=(0.48, 0.35),
            photo_side="right",
        ),
        dict(
            filename="judging.jpg",
            photo=ASSETS / "event-25.jpg",
            eyebrow="How it works",
            title="Scoring v3 · Blind Cup A/B",
            subtitle="99 points · 50+ wins · No deliberation",
            focal=(0.42, 0.38),
            photo_side="right",
        ),
        dict(
            filename="champions.jpg",
            photo=ASSETS / "champions" / "2025-muhammad-aga.jpg",
            eyebrow="Champions",
            title="Four champions. One method.",
            subtitle="The fifth crowns in Panama, 2026",
            focal=(0.5, 0.28),
            photo_side="right",
        ),
        dict(
            filename="innovation.jpg",
            photo=ASSETS / "event-28.jpg",
            eyebrow="Innovation Lab",
            title="Find. Understand. Build.",
            subtitle="Insight beside the championship",
            focal=(0.45, 0.4),
            photo_side="right",
        ),
        dict(
            filename="live.jpg",
            photo=ASSETS / "event-35.jpg",
            eyebrow="Live results",
            title="Public bracket board",
            subtitle="Opens 26 October 2026",
            focal=(0.5, 0.35),
            photo_side="right",
        ),
        dict(
            filename="dalla-corte.jpg",
            photo=ASSETS / "event-37.jpg",
            eyebrow="Founding equipment partner",
            title="Thank you, Dalla Corte",
            subtitle="Four years · 2022–2025",
            focal=(0.5, 0.35),
            photo_side="right",
        ),
    ]

    for card in cards:
        if not card["photo"].exists():
            raise SystemExit(f"Missing photo: {card['photo']}")
        compose(**card)

    # Quick visual inventory
    for p in sorted(OUT.glob("*.jpg")):
        im = Image.open(p)
        assert im.size == (W, H), p
    print("All OG cards 1200×630 OK")


if __name__ == "__main__":
    main()
