"""
Whiteboard style template - character-driven educational infographics.

v5: Nanobanana-inspired style with friendly characters + flat line art.
    NO text in images — overlays added in Remotion.
    Uses Google Imagen 4 Ultra for best quality.
"""

from .base import PromptTemplate, register_template

template = PromptTemplate(
    name="whiteboard",
    base_prompt=(
        "Friendly character in flat line art style performing an action, "
        "clean educational infographic illustration, "
        "soft pastel color background, simple hand-drawn aesthetic, "
        "warm and approachable design, "
        "NO text NO numbers NO letters NO words NO labels, "
        "only visual elements characters and shapes, "
        "16:9 landscape format, high quality"
    ),
    negative_prompt=(
        "text, letters, numbers, words, labels, titles, captions, annotations, "
        "typography, written characters, alphabet, digits, handwriting, "
        "watermark, signature, logo, "
        "photorealistic, photograph, 3d render, "
        "dark background, neon colors, scary, violent, "
        "Korean text, Chinese characters, Japanese text"
    ),
    color_palette=[
        "#FFFFFF",  # White
        "#F5F0EB",  # Warm cream
        "#A8D8EA",  # Soft blue
        "#FFB7B2",  # Soft pink
        "#B5EAD7",  # Soft green
        "#FFDAC1",  # Soft peach
        "#E2F0CB",  # Soft lime
    ],
    model="imagen-4.0-ultra-generate-001",
    width=1920,
    height=1080,
)

register_template(template)
