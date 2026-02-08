"""Whiteboard style template - hand-drawn sketch style for general education."""

from .base import PromptTemplate, register_template

template = PromptTemplate(
    name="whiteboard",
    base_prompt=(
        "Hand-drawn sketch illustration on white background, "
        "clean whiteboard style, black ink outlines, "
        "simple doodle aesthetic, educational diagram, "
        "no text in image, no letters, no words, "
        "16:9 aspect ratio, high quality"
    ),
    negative_prompt=(
        "text, words, letters, watermark, signature, "
        "photorealistic, 3d render, colorful, neon, dark background, "
        "blurry, low quality"
    ),
    color_palette=["#FFFFFF", "#333333", "#666666", "#2196F3", "#FF5722"],
    model="black-forest-labs/flux-schnell",
    width=1920,
    height=1080,
)

register_template(template)
