"""Pastel education style template - friendly illustrations for beginners/kids."""

from .base import PromptTemplate, register_template

template = PromptTemplate(
    name="pastel_education",
    base_prompt=(
        "Soft pastel illustration, gentle colors, "
        "friendly educational style, rounded shapes, "
        "warm and inviting atmosphere, cute minimal design, "
        "no text in image, no letters, no words, "
        "16:9 aspect ratio, high quality"
    ),
    negative_prompt=(
        "text, words, letters, watermark, signature, "
        "photorealistic, 3d render, dark, scary, violent, "
        "blurry, low quality, sharp edges"
    ),
    color_palette=["#FFF5E4", "#FFE5B4", "#FFDAB9", "#98D8C8", "#F7DC6F", "#BB8FCE"],
    model="imagen-4.0-ultra-generate-001",
    width=1920,
    height=1080,
)

register_template(template)
