"""
LLM Enrichment Module (Track C-2)
Uses LLM to enrich narration with visual elements based on hints.

Features:
- Parse [hint: ...] tags from simplified markdown
- Call LLM API to generate scene composition
- Validate LLM output against available resources
- Fallback to C-1 rule engine on failure

Supported LLM providers:
- Groq (Llama 3) - default, uses existing GROQ_API_KEY
- Claude API - optional, requires ANTHROPIC_API_KEY
"""

import os
import re
import json
from dataclasses import dataclass, field
from typing import Optional

from smart_defaults import (
    SCENE_TEMPLATES,
    POSE_MOTION_MAP,
    TEMPLATE_CAMERA_MAP,
    auto_select_scene_template,
    auto_select_motion,
    auto_select_camera,
    auto_select_transition,
)
from emotion_analysis import (
    detect_emotion,
    suggest_expression,
    suggest_pose,
    extract_numbers,
)


# ============================================================================
# AVAILABLE RESOURCES (for validation)
# ============================================================================

AVAILABLE_POSES = list(POSE_MOTION_MAP.keys()) + [
    # Additional poses not in motion map
    "standing_relaxed", "sitting_crossed", "pointing_down",
    "hand_on_chin", "both_hands_up", "arms_crossed", "hands_on_hips",
    "confident", "listening", "presenting",
]

AVAILABLE_EXPRESSIONS = [
    "neutral", "happy", "sad", "surprised", "thinking",
    "excited", "focused", "angry", "worried", "confused",
]

AVAILABLE_MOTIONS = [
    "breathing", "nodding", "typing", "nervous", "laughing", "crying",
    "headShake", "clapping", "jumping", "running", "walkCycle",
    "thinking_loop", "waving_loop",
]

AVAILABLE_ICONS = [
    "lightbulb", "money-bag", "chart-up", "chart-down", "piggy-bank",
    "warning", "checkmark", "cross", "clock", "target", "star",
    "book", "graduation-cap", "trophy", "medal", "heart",
    "thumbs-up", "thumbs-down", "question", "exclamation",
    "arrow-right", "arrow-left", "arrow-up", "arrow-down",
    "calendar", "calculator", "coin", "bank", "wallet",
]

AVAILABLE_SHAPES = ["arrow", "line", "circle", "rectangle", "bracket"]

AVAILABLE_TEXT_STYLES = ["title", "body", "number", "highlight_box", "subtitle"]


# ============================================================================
# HINT PARSING
# ============================================================================

@dataclass
class HintedNarration:
    """A narration line with optional hint."""
    text: str
    hint: Optional[str] = None


def parse_hints(text: str) -> list[HintedNarration]:
    """
    Parse text with [hint: ...] tags into narration + hints.

    Input format:
    ```
    안녕하세요! 오늘은 복리에 대해 알아봅시다.
    [hint: 인사]

    단리는 원금에만 이자가 붙습니다.
    [hint: 설명]
    ```

    Returns list of HintedNarration objects.
    """
    results = []

    # Split by double newlines (paragraphs)
    paragraphs = re.split(r'\n\s*\n', text.strip())

    for para in paragraphs:
        if not para.strip():
            continue

        lines = para.strip().split('\n')
        narration_lines = []
        hint = None

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check for [hint: ...] tag
            hint_match = re.match(r'\[hint:\s*(.+?)\]', line)
            if hint_match:
                hint = hint_match.group(1).strip()
            else:
                narration_lines.append(line)

        if narration_lines:
            results.append(HintedNarration(
                text=' '.join(narration_lines),
                hint=hint,
            ))

    return results


# ============================================================================
# LLM PROMPT TEMPLATES
# ============================================================================

SYSTEM_PROMPT = """당신은 인포그래픽 영상 감독입니다.
나레이션 텍스트와 힌트를 분석하여 각 씬에 적합한 영상 요소를 결정합니다.

사용 가능한 리소스:

포즈 (stickman pose):
- 기본: standing, standing_relaxed, sitting, sitting_crossed
- 제스처: pointing_right, pointing_left, pointing_up, pointing_down, waving, thumbsUp, beckoning, shrugging, both_hands_up, arms_crossed, hands_on_hips, hand_on_chin
- 감정: thinking, explaining, celebrating, depressed, surprised_pose, confident, nervous_pose
- 활동: walking, running_pose, jumping_pose, typing_pose, presenting, listening

표정 (expression):
neutral, happy, sad, surprised, thinking, excited, focused, angry, worried, confused

모션 (motion - 루프 애니메이션):
breathing, nodding, typing, nervous, laughing, crying, headShake, clapping, jumping, running, walkCycle, thinking_loop, waving_loop

아이콘 (icon):
lightbulb, money-bag, chart-up, chart-down, piggy-bank, warning, checkmark, cross, clock, target, star, book, graduation-cap, trophy, medal, heart, thumbs-up, thumbs-down, question, exclamation, arrow-right, arrow-left, calculator, coin, bank, wallet

도형 (shape):
arrow, line, circle, rectangle, bracket

씬 템플릿:
intro_greeting, intro_hook, explain_default, explain_formula, explain_reverse, emphasis_number, emphasis_statement, compare_side_by_side, closing_summary, closing_call_to_action

힌트 의미:
- "인사" → 오프닝, 밝은 표정, 손인사
- "설명" → 설명 포즈, 중립/집중 표정
- "숫자 강조" → 숫자 카운터 추가, pointing 포즈
- "비교" → 양쪽 비교 레이아웃
- "마무리" → 클로징, 긍정적 표정
- "주의" → 경고 아이콘, 걱정 표정
- "강조" → zoom_in, 강한 포즈

규칙:
1. 모든 씬에 스틱맨 포함
2. 텍스트 오브젝트는 나레이션의 핵심 키워드 1-2개만 추출
3. 숫자가 언급되면 counter 오브젝트 추가
4. 연속으로 같은 포즈/템플릿 사용 금지
5. 힌트가 없으면 나레이션 내용으로 추론

JSON 형식으로만 응답하세요. 설명이나 마크다운 없이 순수 JSON만 출력하세요."""


USER_PROMPT_TEMPLATE = """나레이션: "{narration}"
힌트: {hint}
이전 씬 포즈: {previous_pose}
씬 번호: {scene_index}/{total_scenes}

위 나레이션에 대해 영상 구성을 JSON으로 출력하세요:

{{
  "scene_template": "템플릿명",
  "stickman": {{
    "pose": "포즈명",
    "expression": "표정명",
    "motion": "모션명"
  }},
  "objects": [
    {{"type": "text", "content": "핵심 키워드", "style": "title"}},
    {{"type": "icon", "name": "아이콘명"}}
  ],
  "camera": "카메라명",
  "transition": "트랜지션명"
}}"""


# ============================================================================
# LLM API CALLS
# ============================================================================

def call_groq_llm(
    narration: str,
    hint: Optional[str],
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str] = None,
    api_key: Optional[str] = None,
) -> Optional[dict]:
    """
    Call Groq LLM API to enrich narration.

    Uses Llama 3 70B model for best quality.
    """
    try:
        from groq import Groq
    except ImportError:
        print("Warning: groq package not installed. Run: pip install groq")
        return None

    if api_key is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            print("Warning: GROQ_API_KEY not set")
            return None

    client = Groq(api_key=api_key)

    user_prompt = USER_PROMPT_TEMPLATE.format(
        narration=narration,
        hint=hint or "없음 (나레이션에서 추론)",
        previous_pose=previous_pose or "없음",
        scene_index=scene_index + 1,
        total_scenes=total_scenes,
    )

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=500,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        print(f"LLM API error: {e}")
        return None


def call_anthropic_llm(
    narration: str,
    hint: Optional[str],
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str] = None,
    api_key: Optional[str] = None,
) -> Optional[dict]:
    """
    Call Anthropic Claude API to enrich narration.

    Uses Claude Haiku for cost efficiency.
    """
    try:
        import anthropic
    except ImportError:
        print("Warning: anthropic package not installed. Run: pip install anthropic")
        return None

    if api_key is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            print("Warning: ANTHROPIC_API_KEY not set")
            return None

    client = anthropic.Anthropic(api_key=api_key)

    user_prompt = USER_PROMPT_TEMPLATE.format(
        narration=narration,
        hint=hint or "없음 (나레이션에서 추론)",
        previous_pose=previous_pose or "없음",
        scene_index=scene_index + 1,
        total_scenes=total_scenes,
    )

    try:
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_prompt},
            ],
        )

        content = response.content[0].text

        # Extract JSON from response (Claude might add explanation)
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            return json.loads(json_match.group())

        return None

    except Exception as e:
        print(f"Anthropic API error: {e}")
        return None


# ============================================================================
# VALIDATION
# ============================================================================

def validate_pose(pose: str) -> str:
    """Validate pose, return default if invalid."""
    if pose in AVAILABLE_POSES:
        return pose
    # Try partial match
    for p in AVAILABLE_POSES:
        if pose.lower() in p.lower() or p.lower() in pose.lower():
            return p
    return "standing"


def validate_expression(expression: str) -> str:
    """Validate expression, return default if invalid."""
    if expression in AVAILABLE_EXPRESSIONS:
        return expression
    return "neutral"


def validate_motion(motion: str) -> str:
    """Validate motion, return default if invalid."""
    if motion in AVAILABLE_MOTIONS:
        return motion
    return "breathing"


def validate_icon(icon: str) -> str:
    """Validate icon, return default if invalid."""
    if icon in AVAILABLE_ICONS:
        return icon
    # Try partial match
    for i in AVAILABLE_ICONS:
        if icon.lower() in i.lower() or i.lower() in icon.lower():
            return i
    return "lightbulb"


def validate_template(template: str) -> str:
    """Validate scene template, return default if invalid."""
    if template in SCENE_TEMPLATES:
        return template
    return "explain_default"


def validate_llm_response(response: dict) -> dict:
    """
    Validate and fix LLM response.

    Ensures all values are valid resources.
    """
    validated = {}

    # Scene template
    validated["scene_template"] = validate_template(
        response.get("scene_template", "explain_default")
    )

    # Stickman
    stickman = response.get("stickman", {})
    validated["stickman"] = {
        "pose": validate_pose(stickman.get("pose", "standing")),
        "expression": validate_expression(stickman.get("expression", "neutral")),
        "motion": validate_motion(stickman.get("motion", "breathing")),
    }

    # Objects
    validated["objects"] = []
    for obj in response.get("objects", []):
        obj_type = obj.get("type", "")

        if obj_type == "text":
            validated["objects"].append({
                "type": "text",
                "content": obj.get("content", ""),
                "style": obj.get("style", "body"),
            })
        elif obj_type == "icon":
            validated["objects"].append({
                "type": "icon",
                "name": validate_icon(obj.get("name", "lightbulb")),
            })
        elif obj_type == "counter":
            validated["objects"].append({
                "type": "counter",
                "from": obj.get("from", 0),
                "to": obj.get("to", 100),
                "format": obj.get("format", "number"),
            })
        elif obj_type == "shape":
            validated["objects"].append({
                "type": "shape",
                "shape": obj.get("shape", "arrow"),
            })

    # Camera
    validated["camera"] = response.get("camera", "static_full")
    if validated["camera"] not in TEMPLATE_CAMERA_MAP.values():
        validated["camera"] = auto_select_camera(validated["scene_template"])

    # Transition
    validated["transition"] = response.get("transition", "crossfade")

    return validated


# ============================================================================
# FALLBACK TO RULE ENGINE
# ============================================================================

def rule_based_enrich(
    narration: str,
    hint: Optional[str],
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str] = None,
) -> dict:
    """
    Fallback enrichment using C-1 rule engine.

    Used when LLM fails or is unavailable.
    """
    # Detect emotion and scene role
    emotion = detect_emotion(narration)

    # Determine template based on hint and position
    if hint:
        hint_lower = hint.lower()
        if "인사" in hint_lower or "오프닝" in hint_lower:
            template = "intro_greeting"
        elif "마무리" in hint_lower or "결론" in hint_lower:
            template = "closing_summary"
        elif "숫자" in hint_lower or "강조" in hint_lower:
            template = "emphasis_number"
        elif "비교" in hint_lower:
            template = "compare_side_by_side"
        elif "주의" in hint_lower or "경고" in hint_lower:
            template = "emphasis_statement"
        elif "설명" in hint_lower:
            template = "explain_default"
        else:
            template = auto_select_scene_template(
                scene_index, total_scenes, ["stickman", "text"], narration
            )
    else:
        template = auto_select_scene_template(
            scene_index, total_scenes, ["stickman", "text"], narration
        )

    # Determine stickman properties
    pose = suggest_pose(narration, exclude_poses=[previous_pose] if previous_pose else None)
    expression = suggest_expression(narration)
    motion = auto_select_motion(pose, expression)

    # Extract text keywords (simple: first noun-like word)
    words = narration.split()
    keyword = ""
    for w in words:
        if len(w) > 2 and not w.endswith("는") and not w.endswith("을"):
            keyword = w
            break

    # Check for numbers
    numbers = extract_numbers(narration)
    objects = []

    if keyword:
        objects.append({
            "type": "text",
            "content": keyword[:20],  # Limit length
            "style": "title" if scene_index == 0 else "body",
        })

    if numbers:
        # Add counter for the most significant number
        num = max(numbers, key=lambda x: x["value"])
        objects.append({
            "type": "counter",
            "from": 0,
            "to": int(num["value"]),
            "format": "currency_krw" if num.get("unit") == "원" else "number",
        })

    return {
        "scene_template": template,
        "stickman": {
            "pose": pose,
            "expression": expression,
            "motion": motion,
        },
        "objects": objects,
        "camera": auto_select_camera(template),
        "transition": auto_select_transition(template, None),
    }


# ============================================================================
# MAIN ENRICHMENT FUNCTION
# ============================================================================

@dataclass
class EnrichedScene:
    """Enriched scene from LLM or rule engine."""
    narration: str
    hint: Optional[str]
    scene_template: str
    stickman: dict
    objects: list[dict]
    camera: str
    transition: str
    source: str  # "llm" or "rule"


def enrich_narration(
    narration: str,
    hint: Optional[str],
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str] = None,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> EnrichedScene:
    """
    Enrich narration with visual elements.

    Tries LLM first, falls back to rule engine on failure.

    Args:
        narration: The narration text
        hint: Optional hint tag content
        scene_index: Current scene index (0-based)
        total_scenes: Total number of scenes
        previous_pose: Previous scene's stickman pose (for variety)
        provider: LLM provider ("groq" or "anthropic")
        api_key: Optional API key (uses env var if not provided)

    Returns:
        EnrichedScene with all visual elements
    """
    result = None
    source = "rule"

    # Try LLM first
    if provider == "groq":
        result = call_groq_llm(
            narration, hint, scene_index, total_scenes, previous_pose, api_key
        )
    elif provider == "anthropic":
        result = call_anthropic_llm(
            narration, hint, scene_index, total_scenes, previous_pose, api_key
        )

    if result:
        # Validate LLM response
        result = validate_llm_response(result)
        source = "llm"
    else:
        # Fallback to rule engine
        result = rule_based_enrich(
            narration, hint, scene_index, total_scenes, previous_pose
        )
        source = "rule"

    return EnrichedScene(
        narration=narration,
        hint=hint,
        scene_template=result["scene_template"],
        stickman=result["stickman"],
        objects=result["objects"],
        camera=result["camera"],
        transition=result["transition"],
        source=source,
    )


def enrich_script(
    hinted_narrations: list[HintedNarration],
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> list[EnrichedScene]:
    """
    Enrich all scenes in a script.

    Args:
        hinted_narrations: List of narrations with hints
        provider: LLM provider
        api_key: Optional API key

    Returns:
        List of EnrichedScene objects
    """
    total_scenes = len(hinted_narrations)
    results = []
    previous_pose = None

    for i, hn in enumerate(hinted_narrations):
        enriched = enrich_narration(
            narration=hn.text,
            hint=hn.hint,
            scene_index=i,
            total_scenes=total_scenes,
            previous_pose=previous_pose,
            provider=provider,
            api_key=api_key,
        )
        results.append(enriched)
        previous_pose = enriched.stickman["pose"]

    return results


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Parsing
    "parse_hints",
    "HintedNarration",
    # Enrichment
    "enrich_narration",
    "enrich_script",
    "EnrichedScene",
    # Validation
    "validate_llm_response",
    "validate_pose",
    "validate_expression",
    "validate_motion",
    "validate_icon",
    # Fallback
    "rule_based_enrich",
    # LLM calls
    "call_groq_llm",
    "call_anthropic_llm",
    # Resources
    "AVAILABLE_POSES",
    "AVAILABLE_EXPRESSIONS",
    "AVAILABLE_MOTIONS",
    "AVAILABLE_ICONS",
]
