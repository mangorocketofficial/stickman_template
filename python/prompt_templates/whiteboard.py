"""
Whiteboard style template - hand-drawn sketch style for educational content.

Optimized for knowledge-sharing YouTube videos with consistent diagram aesthetic.
Inspired by Khan Academy, 3Blue1Brown, Veritasium whiteboard explanations.
"""

from .base import PromptTemplate, register_template

template = PromptTemplate(
    name="whiteboard",
    base_prompt=(
        "Educational whiteboard illustration on pure white background (#FFFFFF), "
        "hand-drawn black marker sketch style, clean simple lines, "
        "diagram with arrows and boxes, minimal doodle aesthetic, "
        "like Khan Academy or 3Blue1Brown explanatory diagrams, "
        "consistent sketch style across all scenes, "
        "absolutely NO text labels, NO letters, NO numbers, NO words in image, "
        "only visual shapes and diagrams, "
        "16:9 landscape format, ultra high quality, sharp lines"
    ),
    negative_prompt=(
        "text, letters, numbers, words, labels, titles, captions, watermark, signature, "
        "photorealistic, 3d render, photograph, complex shading, "
        "colorful background, neon colors, dark background, gradients, "
        "blurry, low quality, messy, cluttered, artistic, painterly"
    ),
    color_palette=[
        "#FFFFFF",  # Pure white background (forced)
        "#000000",  # Black marker lines (primary)
        "#333333",  # Dark gray (secondary lines)
        "#0066CC",  # Blue (emphasis/arrows)
        "#FF6B35",  # Orange-red (highlights)
    ],
    model="black-forest-labs/flux-schnell",
    width=1920,
    height=1080,
)

register_template(template)
