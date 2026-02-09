"""
Whiteboard style template - clean visual backgrounds for educational content.

v4: Visual-only backgrounds (charts, graphs, shapes, icons).
    NO text or numbers in images — those are added in Remotion post-production.
    Uses Ideogram v2 for high-quality clean design output.
"""

from .base import PromptTemplate, register_template

template = PromptTemplate(
    name="whiteboard",
    base_prompt=(
        "Clean modern infographic background on white, "
        "professional data visualization design, "
        "charts graphs curves arrows and shapes only, "
        "blue green and gold accent colors on white background, "
        "modern minimalist educational aesthetic, "
        "absolutely NO text NO numbers NO letters NO words NO labels anywhere, "
        "only pure visual elements and shapes, "
        "16:9 landscape format, high quality, clean whitespace"
    ),
    negative_prompt=(
        "text, letters, numbers, words, labels, titles, captions, annotations, "
        "typography, written characters, alphabet, digits, handwriting, "
        "watermark, signature, logo, "
        "blurry, low quality, messy, cluttered, "
        "photorealistic, photograph, 3d render, "
        "dark background, neon colors, "
        "Korean text, Chinese characters, Japanese text"
    ),
    color_palette=[
        "#FFFFFF",  # Pure white background
        "#000000",  # Black lines
        "#333333",  # Dark gray
        "#0066CC",  # Blue (charts/emphasis)
        "#FF6B35",  # Orange-red (highlights)
        "#2ECC71",  # Green (growth/positive)
        "#FFD700",  # Gold (accents)
    ],
    model="ideogram-ai/ideogram-v2",
    width=1920,
    height=1080,
)

register_template(template)
