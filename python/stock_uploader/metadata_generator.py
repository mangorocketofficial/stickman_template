"""
LLM-powered metadata generator for stock image uploads.
Uses Groq API (llama-3.3-70b-versatile) to generate English metadata
from existing image generation prompts.
"""

import json
import re
from typing import Optional

from .models import ImageAsset, StockMetadata

# Scene role -> suggested stock categories
ROLE_CATEGORY_HINTS: dict[str, list[str]] = {
    "opening": ["education", "illustrations", "backgrounds"],
    "explanation": ["education", "science", "illustrations"],
    "emphasis": ["education", "business", "illustrations"],
    "comparison": ["education", "business", "infographics"],
    "example": ["education", "illustrations"],
    "warning": ["education", "health", "illustrations"],
    "closing": ["education", "illustrations"],
}

# Common stock keywords that apply to all images from this pipeline
BASE_KEYWORDS = [
    "illustration", "flat design", "educational", "infographic",
    "pastel colors", "line art", "digital art", "AI generated",
    "concept", "presentation", "background",
]


def generate_metadata_for_asset(
    asset: ImageAsset,
    groq_api_key: str,
    model: str = "llama-3.3-70b-versatile",
) -> StockMetadata:
    """Generate stock-quality metadata for a single image using LLM."""
    if not groq_api_key:
        return _fallback_metadata(asset)

    try:
        from groq import Groq
        client = Groq(api_key=groq_api_key)

        prompt = _build_metadata_prompt(asset)

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=500,
            response_format={"type": "json_object"},
        )

        response_text = response.choices[0].message.content.strip()
        return _parse_metadata_response(response_text, asset)

    except Exception as e:
        print(f"    LLM metadata generation failed for scene {asset.scene_index}: {e}")
        return _fallback_metadata(asset)


def generate_metadata_batch(
    assets: list[ImageAsset],
    groq_api_key: str,
    model: str = "llama-3.3-70b-versatile",
) -> list[StockMetadata]:
    """
    Generate metadata for multiple images.
    Uses individual calls to avoid context length issues.
    """
    results = []
    total = len(assets)

    for i, asset in enumerate(assets):
        print(f"    Generating metadata {i + 1}/{total} (scene {asset.scene_index})...")
        metadata = generate_metadata_for_asset(asset, groq_api_key, model)
        results.append(metadata)

    return results


_SYSTEM_PROMPT = """\
You are a stock photography metadata specialist. Generate metadata for AI-generated \
educational illustrations to maximize discoverability on stock platforms.

Output valid JSON with these fields:
- title: Descriptive English title (10-100 chars, no special characters)
- description: Natural English description of the image (30-200 chars)
- keywords: Array of 25-50 English keywords (lowercase, single words or 2-word phrases)
- categories: Array of applicable categories from: education, illustration, infographic, \
science, technology, business, health, backgrounds, art, design, people, nature

KEYWORD RULES:
- All English, lowercase
- Mix of specific (image content) and generic (stock search terms)
- Include art style terms (flat illustration, line art, pastel, digital art)
- Include subject terms from the image content
- Include usage terms (presentation, education, infographic, background, concept)
- Include mood/color terms (warm, soft, minimal, colorful)
- NO brand names, NO trademarked terms
- Single words or 2-word phrases only
- Always include "AI generated" as a keyword

Output ONLY valid JSON, nothing else."""


def _build_metadata_prompt(asset: ImageAsset) -> str:
    """Build the LLM prompt for metadata generation."""
    # Extract the unique scene description from the prompt
    # (remove the common template prefix)
    scene_description = _extract_scene_description(asset.original_prompt)

    parts = [
        f"Image generation prompt: \"{scene_description}\"",
        f"Scene role in video: {asset.scene_role}",
    ]
    if asset.narration_summary:
        parts.append(f"Topic context (Korean narration): \"{asset.narration_summary[:200]}\"")

    parts.append("\nGenerate stock metadata JSON for this image.")
    return "\n".join(parts)


def _extract_scene_description(prompt: str) -> str:
    """
    Extract the unique scene-specific part from a full generation prompt.
    The prompts follow a pattern where the unique description comes after
    common template text, usually after 'high quality, '.
    """
    marker = "high quality, "
    idx = prompt.find(marker)
    if idx >= 0:
        return prompt[idx + len(marker):]
    # Fallback: return last sentence-like portion
    parts = prompt.rsplit(",", 2)
    return parts[-1].strip() if parts else prompt


def _parse_metadata_response(response_text: str, asset: ImageAsset) -> StockMetadata:
    """Parse LLM JSON response into StockMetadata."""
    try:
        data = json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if json_match:
            data = json.loads(json_match.group())
        else:
            return _fallback_metadata(asset)

    title = str(data.get("title", ""))[:200]
    description = str(data.get("description", ""))[:200]
    keywords = data.get("keywords", [])
    categories = data.get("categories", [])

    # Ensure minimum keyword count
    if len(keywords) < 10:
        keywords.extend(_extract_keywords_from_prompt(asset.original_prompt))
        keywords = list(dict.fromkeys(keywords))  # dedupe preserving order

    # Ensure AI generated keyword is present
    if "AI generated" not in keywords and "ai generated" not in keywords:
        keywords.append("ai generated")

    return StockMetadata(
        title=title or _generate_title(asset),
        description=description or _generate_description(asset),
        keywords=keywords[:50],
        categories=categories or ROLE_CATEGORY_HINTS.get(asset.scene_role, ["illustration"]),
    )


def _fallback_metadata(asset: ImageAsset) -> StockMetadata:
    """Rule-based fallback when LLM is unavailable."""
    title = _generate_title(asset)
    description = _generate_description(asset)
    keywords = _extract_keywords_from_prompt(asset.original_prompt)
    keywords.extend(BASE_KEYWORDS)
    keywords = list(dict.fromkeys(keywords))[:50]  # dedupe + limit
    categories = ROLE_CATEGORY_HINTS.get(asset.scene_role, ["illustration"])

    return StockMetadata(
        title=title,
        description=description,
        keywords=keywords,
        categories=categories,
    )


def _generate_title(asset: ImageAsset) -> str:
    """Generate a title from the scene description."""
    desc = _extract_scene_description(asset.original_prompt)
    # Capitalize and clean
    title = desc.strip().rstrip(".")
    if len(title) > 100:
        title = title[:97] + "..."
    return title.capitalize() if title else f"Educational illustration scene {asset.scene_index}"


def _generate_description(asset: ImageAsset) -> str:
    """Generate a description from the prompt."""
    desc = _extract_scene_description(asset.original_prompt)
    base = f"AI-generated educational illustration: {desc.strip().rstrip('.')}"
    if len(base) > 200:
        base = base[:197] + "..."
    return base


def _extract_keywords_from_prompt(prompt: str) -> list[str]:
    """Extract keywords from the English prompt text using heuristics."""
    # Remove common template phrases
    cleaned = prompt.lower()
    for remove in [
        "friendly character in flat line art style performing an action",
        "clean educational infographic illustration",
        "soft pastel color background",
        "simple hand-drawn aesthetic",
        "warm and approachable design",
        "no text no numbers no letters no words no labels",
        "only visual elements characters and shapes",
        "16:9 landscape format",
        "high quality",
    ]:
        cleaned = cleaned.replace(remove, "")

    # Extract meaningful words (3+ chars, no common stop words)
    stop_words = {
        "the", "and", "for", "with", "that", "this", "from", "are", "was",
        "has", "have", "had", "not", "but", "its", "his", "her", "you",
        "all", "can", "will", "one", "two", "our", "who", "which",
    }
    words = re.findall(r"[a-z]{3,}", cleaned)
    keywords = [w for w in words if w not in stop_words]

    # Also extract 2-word phrases
    two_word = re.findall(r"[a-z]+ [a-z]+", cleaned)
    for phrase in two_word:
        words_in = phrase.split()
        if all(w not in stop_words and len(w) >= 3 for w in words_in):
            keywords.append(phrase)

    return list(dict.fromkeys(keywords))  # dedupe preserving order
