"""
Whiteboard Text Generator (v2)
Generates keyword + description overlays for whiteboard scenes.

Each whiteboard scene gets:
  - keyword: Main concept (2-5 words, large, centered)
  - description: Brief explanation (1 sentence, smaller, below keyword)
  - keyword_style: typing | handwriting | highlight (rotating)
"""

import os
import re
import json
from dataclasses import dataclass
from typing import Optional


# =============================================================================
# ANIMATION STYLE ROTATION
# =============================================================================

# 3 whiteboard text styles rotating for variety
KEYWORD_STYLES = [
    "typing",       # Character-by-character with cursor
    "handwriting",  # Hand-drawn wobble effect
    "highlight",    # Fade in + highlight sweep
    "typing",
    "handwriting",
]


@dataclass
class WhiteboardText:
    """Generated text content for a single whiteboard scene."""
    scene_index: int            # 0-based
    keyword: str                # Main concept (large text, e.g. "스트레스 포인트")
    description: str            # Brief explanation (smaller text, 1 sentence)
    keyword_style: str = "typing"  # typing | handwriting | highlight


# =============================================================================
# RULE-BASED FALLBACK
# =============================================================================

def _extract_keyword_from_name(section_name: str) -> str:
    """Extract a readable keyword from section name."""
    SECTION_TITLES = {
        "intro": "핵심 개요",
        "stress_point": "스트레스 포인트",
        "oil_removal": "유분 제거",
        "nail_science": "손톱의 과학",
        "uv_lamp": "UV 램프",
        "anatomy": "손톱 해부학",
        "conclusion": "핵심 정리",
    }
    base_name = re.sub(r'_\d+$', '', section_name)
    return SECTION_TITLES.get(base_name, base_name)


def _extract_description(narration: str) -> str:
    """Extract first meaningful sentence as description."""
    sentences = re.split(r'[.?!。]\s*', narration)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]

    if not sentences:
        return narration[:30] + "…"

    desc = sentences[0]
    if len(desc) > 35:
        cut = desc[:35]
        last_space = cut.rfind(' ')
        if last_space > 15:
            cut = cut[:last_space]
        return cut + "…"
    return desc


def generate_texts_rule_based(
    sections: list,
    whiteboard_indices: list[int],
) -> list[WhiteboardText]:
    """Fallback: generate texts using rule-based extraction."""
    results = []

    for idx, scene_idx in enumerate(whiteboard_indices):
        section = sections[scene_idx]
        keyword = _extract_keyword_from_name(section.name)
        description = _extract_description(section.narration)
        style = KEYWORD_STYLES[idx % len(KEYWORD_STYLES)]

        results.append(WhiteboardText(
            scene_index=scene_idx,
            keyword=keyword,
            description=description,
            keyword_style=style,
        ))

    return results


# =============================================================================
# LLM BATCH GENERATION
# =============================================================================

def generate_texts_llm(
    sections: list,
    whiteboard_indices: list[int],
) -> Optional[list[WhiteboardText]]:
    """Use Groq LLM to batch-generate whiteboard texts."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None

    try:
        from groq import Groq
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"  [whiteboard_text] Groq init failed: {e}")
        return None

    # Build batch prompt with all scenes
    scene_descriptions = []
    for i, scene_idx in enumerate(whiteboard_indices):
        section = sections[scene_idx]
        narration = section.narration[:200]
        scene_descriptions.append(
            f"Scene {i+1} (name: {section.name}):\n{narration}"
        )

    BATCH_SIZE = 15
    all_results = []

    for batch_start in range(0, len(scene_descriptions), BATCH_SIZE):
        batch_end = min(batch_start + BATCH_SIZE, len(scene_descriptions))
        batch = scene_descriptions[batch_start:batch_end]
        batch_indices = whiteboard_indices[batch_start:batch_end]

        system_prompt = """You create Korean whiteboard text for educational video scenes.
For each scene, generate a JSON object with:
- "keyword": The MAIN CONCEPT as a short phrase (2-5 Korean words, max 15 chars). This is a large centered keyword.
- "description": A brief explanation sentence (max 25 Korean chars). This appears below the keyword.

Rules:
- keyword: Short, impactful phrase like "스트레스 포인트", "유분 제거", "힘이 집중되는 곳"
- description: One concise sentence explaining the keyword like "인조네일이 부러지는 그 지점", "표면의 미세한 유분과 수분"
- Use Korean only
- Output ONLY a JSON array, no other text"""

        user_prompt = "Generate whiteboard keyword + description for these scenes:\n\n"
        user_prompt += "\n\n".join(batch)
        user_prompt += f"\n\nOutput a JSON array of {len(batch)} objects."

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
                max_tokens=2000,
            )

            content = response.choices[0].message.content.strip()

            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if not json_match:
                print(f"  [whiteboard_text] No JSON found in LLM response (batch {batch_start})")
                continue

            items = json.loads(json_match.group())

            for j, item in enumerate(items):
                if j >= len(batch_indices):
                    break

                scene_idx = batch_indices[j]
                style = KEYWORD_STYLES[(batch_start + j) % len(KEYWORD_STYLES)]

                all_results.append(WhiteboardText(
                    scene_index=scene_idx,
                    keyword=item.get("keyword", ""),
                    description=item.get("description", ""),
                    keyword_style=style,
                ))

            print(f"  [whiteboard_text] Batch {batch_start+1}-{batch_end}: {len(items)} texts generated")

        except Exception as e:
            print(f"  [whiteboard_text] LLM batch failed: {e}")
            continue

    return all_results if all_results else None


# =============================================================================
# PUBLIC API
# =============================================================================

def generate_whiteboard_texts(
    sections: list,
    image_indices: set[int],
    use_llm: bool = True,
) -> dict[int, WhiteboardText]:
    """
    Generate text overlays for all whiteboard (non-image) scenes.

    Returns:
        Dict mapping 0-based scene index -> WhiteboardText
    """
    whiteboard_indices = [
        i for i in range(len(sections))
        if (i + 1) not in image_indices
    ]

    if not whiteboard_indices:
        return {}

    print(f"  Generating whiteboard texts for {len(whiteboard_indices)} scenes...")

    texts = None
    if use_llm:
        texts = generate_texts_llm(sections, whiteboard_indices)

    if not texts:
        print("  [whiteboard_text] Using rule-based fallback")
        texts = generate_texts_rule_based(sections, whiteboard_indices)

    # Fill in any missing scenes with rule-based
    generated_indices = {t.scene_index for t in texts}
    missing_indices = [i for i in whiteboard_indices if i not in generated_indices]
    if missing_indices:
        fallback = generate_texts_rule_based(sections, missing_indices)
        texts.extend(fallback)

    return {t.scene_index: t for t in texts}
