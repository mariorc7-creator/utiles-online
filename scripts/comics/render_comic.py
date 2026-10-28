#!/usr/bin/env python3
"""Create one 4-panel comic image shared by Instagram and X."""
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path("comics-input")
OUT = Path("comics-output")
OUT.mkdir(parents=True, exist_ok=True)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
PANEL_SIZE = (1080, 1350)
GUTTER = 14

def wrap(draw, text, font, max_width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        nxt = (line + " " + word).strip()
        if line and draw.textbbox((0, 0), nxt, font=font)[2] > max_width:
            lines.append(line)
            line = word
        else:
            line = nxt
    if line:
        lines.append(line)
    return lines

def render(comic_id):
    story = json.loads((ROOT / (comic_id + ".json")).read_text(encoding="utf-8"))
    if len(story.get("panels", [])) != 4:
        raise ValueError("Comic must have exactly four panels")
    cells = []
    for i, panel in enumerate(story["panels"], start=1):
        pic = ROOT / (comic_id + "-" + str(i) + ".png")
        image = Image.open(pic).convert("RGB")
        # Preserve a full scene; avoid recropping a multi-panel contact sheet.
        image = ImageOps.fit(image, PANEL_SIZE, Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        draw = ImageDraw.Draw(image)
        dialogue = " ".join(panel["text"].split())
        if len(dialogue) > 85:
            raise ValueError("Dialogue too long")
        size = 60
        while size >= 35:
            font = ImageFont.truetype(FONT, size)
            lines = wrap(draw, dialogue, font, 940)
            if len(lines) <= 3:
                break
            size -= 3
        if len(lines) > 3:
            raise ValueError("Dialogue does not fit in three lines")
        spacing = size + 14
        box_height = max(165, len(lines) * spacing + 80)
        draw.rounded_rectangle((43, 52, 1037, 52 + box_height), radius=48, fill="white", outline="#191919", width=7)
        y = 52 + (box_height - len(lines) * spacing) // 2 + 12
        for line in lines:
            draw.text((540, y), line, font=font, fill="#151515", anchor="mt")
            y += spacing
        cells.append(image)
    # Source panels are full resolution; form ONE comic with clear panel borders.
    w = 2 * PANEL_SIZE[0] + 3 * GUTTER
    h = 2 * PANEL_SIZE[1] + 3 * GUTTER
    comic = Image.new("RGB", (w, h), "#171717")
    for i, cell in enumerate(cells):
        comic.paste(cell, (GUTTER + (i % 2) * (PANEL_SIZE[0] + GUTTER), GUTTER + (i // 2) * (PANEL_SIZE[1] + GUTTER)))
    # Fit the complete comic to the standard Instagram 4:5 photo aspect.
    comic = comic.resize((1080, 1350), Image.Resampling.LANCZOS)
    output = OUT / (comic_id + "-comic.jpg")
    comic.save(output, quality=95, optimize=True, subsampling=0)
    (OUT / (comic_id + "-caption.txt")).write_text(story.get("caption", "") + "\n", encoding="utf-8")
    print("Single shared comic:", output)

if __name__ == "__main__":
    render(sys.argv[1])
