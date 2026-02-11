"""
Prompt Generator Module (v2)
Converts narration text into AI image generation prompts.

Reuses emotion analysis logic from archived emotion_analysis.py
and scene role classification from archived full_auto.py.
"""

import os
import re
import json
from dataclasses import dataclass
from typing import Optional

from prompt_templates import get_template, PromptTemplate


# =============================================================================
# EMOTION ANALYSIS (extracted from archived emotion_analysis.py)
# =============================================================================

EMOTION_KEYWORDS = {
    "positive": ["좋은", "좋아요", "성공", "축하", "기쁜", "최고", "훌륭", "멋진",
                  "행복", "감사", "기회", "성장", "발전", "향상", "이득", "수익"],
    "negative": ["위험", "손해", "실패", "문제", "경고", "주의", "조심", "걱정",
                  "하락", "감소", "손실", "위기", "불안", "어려운"],
    "surprise": ["무려", "놀랍게도", "엄청난", "믿기 어려운", "상상", "충격",
                  "대단한", "놀라운"],
    "thinking": ["왜", "어떻게", "만약", "생각해", "고민", "분석", "비교",
                  "차이", "원리", "이유"],
    "emphasis": ["가장", "핵심", "중요", "반드시", "꼭", "절대", "바로",
                  "특히", "무엇보다"],
    "closing": ["시작하세요", "도전하세요", "감사합니다", "기억하세요",
                 "잊지 마세요", "정리하면", "요약하면", "결론"],
    "introduction": ["안녕하세요", "오늘은", "소개", "알아보", "시작"],
}

# Scene role → image mood mapping
ROLE_MOOD_MAP = {
    "opening": "welcoming and inviting atmosphere, establishing shot",
    "explanation": "clear and educational diagram, concept visualization",
    "emphasis": "dramatic and impactful visual, bold composition",
    "comparison": "side-by-side comparison layout, split view",
    "example": "practical illustration, real-world scenario",
    "warning": "cautionary visual, attention-grabbing, alert mood",
    "closing": "inspiring and hopeful atmosphere, forward-looking",
}


def detect_emotion(text: str) -> str:
    """Detect primary emotion from Korean text using keywords."""
    scores = {}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            scores[emotion] = score

    if not scores:
        return "neutral"
    return max(scores, key=scores.get)


def classify_scene_role(
    text: str,
    scene_index: int,
    total_scenes: int,
) -> str:
    """Classify scene role based on position and content."""
    # Position-based
    if scene_index == 0:
        return "opening"
    if scene_index == total_scenes - 1:
        return "closing"

    # Content-based
    emotion = detect_emotion(text)
    if emotion == "negative" or emotion == "emphasis":
        if any(kw in text for kw in ["위험", "경고", "주의", "조심"]):
            return "warning"
        return "emphasis"
    if emotion == "thinking":
        return "comparison"
    if emotion == "surprise":
        return "emphasis"

    # Check for numbers (likely emphasis or example)
    if re.search(r'\d{3,}', text):
        return "emphasis"

    return "explanation"


# =============================================================================
# PROMPT GENERATION
# =============================================================================

@dataclass
class ScenePrompt:
    """Generated prompt for a single scene."""
    scene_index: int
    scene_role: str
    image_hint: Optional[str]
    generated_prompt: str
    negative_prompt: str
    narration_summary: str
    diagram_area: str = "center"  # Where the diagram is in the image


def generate_prompt_from_hint(
    image_hint: str,
    template: PromptTemplate,
) -> str:
    """Generate prompt from explicit image_hint directive."""
    return template.compose_prompt(image_hint)


def generate_prompt_from_narration(
    narration: str,
    scene_role: str,
    template: PromptTemplate,
    use_llm: bool = False,
) -> str:
    """Generate image prompt from narration text."""
    if use_llm:
        llm_description = _llm_generate_description(narration, scene_role)
        if llm_description:
            return template.compose_prompt(llm_description)

    # Rule-based fallback: emotion + role → visual description
    mood = ROLE_MOOD_MAP.get(scene_role, "educational illustration")
    emotion = detect_emotion(narration)

    # Build scene description from narration context
    description_parts = [mood]

    if emotion == "positive":
        description_parts.append("warm and uplifting colors, golden accents")
    elif emotion == "negative":
        description_parts.append("cautious mood, red and orange warning tones")
    elif emotion == "surprise":
        description_parts.append("dramatic lighting, dynamic composition")
    elif emotion == "thinking":
        description_parts.append("analytical composition, balanced layout")
    elif emotion == "emphasis":
        description_parts.append("bold focal point, high contrast")

    return template.compose_prompt(", ".join(description_parts))


def _llm_generate_description(narration: str, scene_role: str) -> Optional[str]:
    """Use LLM to generate visual scene description from narration."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None

    try:
        from groq import Groq
        client = Groq(api_key=api_key)

        system_prompt = (
            "You are a visual scene describer for AI image generation. "
            "Given narration text and its role in a video, generate a concise "
            "visual scene description (1-2 sentences, English) suitable for "
            "an AI image generator. Focus on visual elements, mood, and composition. "
            "Do NOT include any text, words, or letters in the description. "
            "Output ONLY the scene description, nothing else."
        )

        user_prompt = (
            f"Scene role: {scene_role}\n"
            f"Narration (Korean): {narration}\n\n"
            f"Generate a visual scene description for this narration:"
        )

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=150,
        )

        description = response.choices[0].message.content.strip()
        return description if description else None

    except Exception as e:
        print(f"  LLM prompt generation failed: {e}")
        return None


def generate_scene_prompts(
    sections: list,
    style: str = "dark_infographic",
    use_llm: bool = True,
) -> list[ScenePrompt]:
    """
    Generate image prompts for all scenes.

    Args:
        sections: List of ScriptSection objects from parser
        style: Prompt template name
        use_llm: Whether to use LLM for better descriptions

    Returns:
        List of ScenePrompt objects
    """
    template = get_template(style)
    total_scenes = len(sections)
    prompts = []

    # Whiteboard style uses specialized diagram-focused prompts
    if style == "whiteboard":
        from whiteboard_prompt_engine import generate_whiteboard_prompt, llm_batch_generate_prompts

        # Try LLM batch generation first (entire script → distinct prompts)
        llm_descriptions = None
        if use_llm:
            llm_descriptions = llm_batch_generate_prompts(sections)

        for i, section in enumerate(sections):
            role = classify_scene_role(section.narration, i, total_scenes)

            # Check for image_hint directive
            image_hint = None
            for directive in section.directives:
                if directive.type == "image_hint":
                    image_hint = directive.args[0] if directive.args else None
                    break

            # Use LLM description if available, otherwise fall back to keyword-based
            diagram_area = "center"
            if (llm_descriptions and i < len(llm_descriptions)
                    and llm_descriptions[i].get("image")):
                llm_item = llm_descriptions[i]
                diagram_description = llm_item["image"]
                diagram_area = llm_item.get("diagram_area", "center")
                source = "LLM"
            else:
                diagram_description = generate_whiteboard_prompt(
                    narration=section.narration,
                    scene_role=role,
                    image_hint=image_hint,
                    directives=section.directives,
                )
                source = "keyword"

            # Compose with template base_prompt
            prompt_text = template.compose_prompt(diagram_description)

            scene_prompt = ScenePrompt(
                scene_index=i,
                scene_role=role,
                image_hint=image_hint,
                generated_prompt=prompt_text,
                negative_prompt=template.negative_prompt,
                narration_summary=section.narration[:100],
                diagram_area=diagram_area,
            )
            prompts.append(scene_prompt)

            print(f"  Scene {i+1}/{total_scenes} [{role}] prompt ({source}): "
                  f"{prompt_text[:80]}...")

    else:
        # Standard prompt generation for other styles
        for i, section in enumerate(sections):
            # Classify scene role
            role = classify_scene_role(section.narration, i, total_scenes)

            # Check for image_hint directive
            image_hint = None
            for directive in section.directives:
                if directive.type == "image_hint":
                    image_hint = directive.args[0] if directive.args else None
                    break

            # Generate prompt
            if image_hint:
                prompt_text = generate_prompt_from_hint(image_hint, template)
            else:
                prompt_text = generate_prompt_from_narration(
                    section.narration, role, template, use_llm=use_llm
                )

            scene_prompt = ScenePrompt(
                scene_index=i,
                scene_role=role,
                image_hint=image_hint,
                generated_prompt=prompt_text,
                negative_prompt=template.negative_prompt,
                narration_summary=section.narration[:100],
            )
            prompts.append(scene_prompt)

            source = "hint" if image_hint else ("LLM" if use_llm else "rule")
            print(f"  Scene {i+1}/{total_scenes} [{role}] prompt ({source}): "
                  f"{prompt_text[:80]}...")

    return prompts
