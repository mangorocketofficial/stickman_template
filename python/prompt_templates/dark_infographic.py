"""Dark infographic style template - for finance, tech, educational content."""

from .base import PromptTemplate, register_template

template = PromptTemplate(
    name="dark_infographic",
    base_prompt=(
        "Digital illustration, dark navy background (#1a1a2e), "
        "clean infographic style, minimal flat design, "
        "soft gradient lighting, professional educational content, "
        "no text in image, no letters, no words, no watermark, "
        "16:9 aspect ratio, high quality, 4k"
    ),
    negative_prompt=(
        "text, words, letters, numbers, watermark, signature, logo, "
        "photorealistic, 3d render, blurry, low quality, deformed, "
        "ugly, noisy, grainy"
    ),
    color_palette=["#1a1a2e", "#16213e", "#0f3460", "#FFD700", "#FFFFFF", "#4ECDC4"],
    model="black-forest-labs/flux-schnell",
    width=1920,
    height=1080,
)

register_template(template)
