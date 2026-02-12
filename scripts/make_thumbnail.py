"""
YouTube Thumbnail Generator - Clean style
"""

from PIL import Image, ImageDraw, ImageFont
import os

# === CONFIG ===
SOURCE_IMAGE = r"C:\Users\User\Desktop\stickman-templates\remotion\public\images\scene_11.png"
OUTPUT_PATH = r"C:\Users\User\Desktop\stickman-templates\remotion\out\thumbnail.png"
THUMB_W, THUMB_H = 1280, 720

FONT_NOTO = "C:/Windows/Fonts/NotoSansKR-VF.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"


def add_rounded_rect(draw, bbox, fill, radius=20):
    x1, y1, x2, y2 = bbox
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
    draw.pieslice([x1, y1, x1 + 2 * radius, y1 + 2 * radius], 180, 270, fill=fill)
    draw.pieslice([x2 - 2 * radius, y1, x2, y1 + 2 * radius], 270, 360, fill=fill)
    draw.pieslice([x1, y2 - 2 * radius, x1 + 2 * radius, y2], 90, 180, fill=fill)
    draw.pieslice([x2 - 2 * radius, y2 - 2 * radius, x2, y2], 0, 90, fill=fill)


def create_thumbnail():
    src = Image.open(SOURCE_IMAGE).convert("RGBA")

    # Canvas
    thumb = Image.new("RGBA", (THUMB_W, THUMB_H), (255, 220, 80, 255))

    # Place character on the LEFT
    src_ratio = src.width / src.height
    target_h = int(THUMB_H * 1.1)
    target_w = int(target_h * src_ratio)
    src_resized = src.resize((target_w, target_h), Image.LANCZOS)
    x_offset = -100
    y_offset = (THUMB_H - target_h) // 2
    thumb.paste(src_resized, (x_offset, y_offset), src_resized if src_resized.mode == "RGBA" else None)

    thumb_rgb = thumb.convert("RGB")
    draw = ImageDraw.Draw(thumb_rgb)

    # === Text block config ===
    lines = [
        ("네일개론", 100),
        ("총정리", 110),
    ]

    # Measure all lines to calculate text block size
    fonts = []
    line_bboxes = []
    total_height = 0
    max_width = 0
    line_gap = 18

    for text, size in lines:
        font = ImageFont.truetype(FONT_NOTO, size)
        fonts.append(font)
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        line_bboxes.append((w, h, bbox[1]))  # width, height, y_offset
        max_width = max(max_width, w)
        total_height += h

    total_height += line_gap * (len(lines) - 1)

    # Position: right side, TOP aligned
    pad_x = 50
    pad_y = 35
    block_w = max_width + pad_x * 2
    block_h = total_height + pad_y * 2

    block_x = THUMB_W - block_w - 35
    block_y = 30  # top-aligned

    # Draw semi-transparent background using RGBA overlay
    overlay = Image.new("RGBA", thumb_rgb.size, (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)

    add_rounded_rect(
        ov_draw,
        (block_x, block_y, block_x + block_w, block_y + block_h),
        fill=(25, 25, 50, 220),  # mostly opaque dark
        radius=24
    )
    thumb_rgb = Image.alpha_composite(thumb_rgb.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(thumb_rgb)

    # Draw each line centered in the block
    cursor_y = block_y + pad_y
    for i, (text, size) in enumerate(lines):
        font = fonts[i]
        w, h, y_off = line_bboxes[i]
        text_x = block_x + (block_w - w) // 2
        draw.text((text_x, cursor_y - y_off), text, font=font, fill=(255, 255, 255))
        cursor_y += h + line_gap

    # Save
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    thumb_rgb.save(OUTPUT_PATH, "PNG", quality=95)
    print(f"Thumbnail saved: {OUTPUT_PATH}")


if __name__ == "__main__":
    create_thumbnail()
