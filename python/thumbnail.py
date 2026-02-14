"""
YouTube Thumbnail Generator

사용법:
    python python/thumbnail.py <배경이미지> <텍스트_줄1> [줄2] [줄3] [-o 출력경로]

예시:
    python python/thumbnail.py remotion/public/images/scene_11.png "피부학" "핵심개념" "총정리"
    python python/thumbnail.py remotion/public/images/scene_01.png "네일개론" "완전정복" -o thumbnail.png

규칙:
    - 출력: 1280x720 (YouTube 표준)
    - 텍스트: 우측 상단, 맑은고딕 Bold 80px, 흰색(#FFFFFF)
    - 배경 박스: #1A1A2E, opacity 220/255, border-radius 10px
    - 박스 패딩: 좌우 24px, 상하 12px
    - 줄 간격: 6px
    - 배경 이미지: 원본 비율 유지하며 1280x720에 맞춰 crop
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


# ── 스타일 상수 ──────────────────────────────────────

CANVAS_W, CANVAS_H = 1280, 720

FONT_PATH = r"C:\Windows\Fonts\malgunbd.ttf"
FONT_SIZE = 80
TEXT_COLOR = "#FFFFFF"

BOX_COLOR_HEX = "#1A1A2E"
BOX_OPACITY = 220
BOX_RADIUS = 10
BOX_PADDING_X = 24
BOX_PADDING_Y = 24

LINE_GAP = 6           # 박스 사이 간격
MARGIN_RIGHT = 50       # 우측 여백
MARGIN_TOP = 50         # 상단 여백


def hex_to_rgb(hex_color: str) -> tuple:
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def load_and_crop_bg(image_path: str) -> Image.Image:
    """배경 이미지를 1280x720으로 리사이즈+크롭."""
    src = Image.open(image_path).convert("RGB")
    scale = max(CANVAS_W / src.width, CANVAS_H / src.height)
    new_w = int(src.width * scale)
    new_h = int(src.height * scale)
    resized = src.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - CANVAS_W) // 2
    top = (new_h - CANVAS_H) // 2
    return resized.crop((left, top, left + CANVAS_W, top + CANVAS_H))


def generate_thumbnail(
    bg_image_path: str,
    lines: list[str],
    output_path: str = None,
) -> str:
    """
    썸네일 생성.

    Args:
        bg_image_path: 배경 이미지 경로
        lines: 텍스트 줄 리스트 (1~4줄)
        output_path: 출력 경로 (None이면 bg 옆에 thumbnail.png)

    Returns:
        저장된 파일 경로
    """
    if not output_path:
        output_path = str(Path(bg_image_path).parent / "thumbnail.png")

    # 배경 이미지 로드
    thumb = load_and_crop_bg(bg_image_path)
    draw = ImageDraw.Draw(thumb)

    # 폰트 로드
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)

    # 각 줄의 텍스트 크기 계산
    line_sizes = []
    for line in lines:
        bbox = font.getbbox(line)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        line_sizes.append((w, h))

    # 통합 박스 크기 계산
    max_text_w = max(w for w, h in line_sizes)
    total_text_h = sum(h for w, h in line_sizes) + LINE_GAP * (len(lines) - 1)
    box_w = max_text_w + BOX_PADDING_X * 2
    box_h = total_text_h + BOX_PADDING_Y * 2

    # 우측 상단 기준 배치
    block_right = CANVAS_W - MARGIN_RIGHT
    box_x = block_right - box_w
    box_y = MARGIN_TOP
    box_rgb = hex_to_rgb(BOX_COLOR_HEX)

    # 하나의 반투명 배경 박스
    overlay = Image.new("RGBA", thumb.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle(
        [box_x, box_y, box_x + box_w, box_y + box_h],
        radius=BOX_RADIUS,
        fill=(*box_rgb, BOX_OPACITY),
    )
    thumb_rgba = thumb.convert("RGBA")
    thumb_rgba = Image.alpha_composite(thumb_rgba, overlay)
    thumb = thumb_rgba.convert("RGB")
    draw = ImageDraw.Draw(thumb)

    # 박스 안에 텍스트 줄별 배치 (우측 정렬)
    y = box_y + BOX_PADDING_Y
    for i, line in enumerate(lines):
        w, h = line_sizes[i]
        text_x = block_right - BOX_PADDING_X - w  # 우측 정렬
        draw.text((text_x, y), line, font=font, fill=TEXT_COLOR)
        y += h + LINE_GAP

    thumb.save(output_path, quality=95)
    return output_path


def main():
    parser = argparse.ArgumentParser(description="YouTube 썸네일 생성")
    parser.add_argument("image", help="배경 이미지 경로")
    parser.add_argument("lines", nargs="+", help="텍스트 줄 (1~4개)")
    parser.add_argument("-o", "--output", default=None, help="출력 경로")
    args = parser.parse_args()

    if len(args.lines) > 4:
        print("텍스트는 최대 4줄까지 지원합니다.", file=sys.stderr)
        sys.exit(1)

    path = generate_thumbnail(args.image, args.lines, args.output)
    print(f"Thumbnail saved: {path}")


if __name__ == "__main__":
    main()
