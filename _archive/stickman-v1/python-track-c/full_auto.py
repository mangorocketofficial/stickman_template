"""
Full Auto Module (Track C-3)
Level 3 automation: narration text only → complete video.

Features:
- Multi-step LLM pipeline:
  - Step 1: Overall analysis (genre, theme, bgm, mood)
  - Step 2: Scene splitting + role classification
  - Step 3: Per-scene detailed composition
- Monotony prevention algorithm
- Automatic scene grouping based on semantic meaning

Input: Plain narration text (no hints, no scene markers)
Output: Complete scene composition ready for rendering
"""

import os
import re
import json
from dataclasses import dataclass, field
from typing import Optional

from llm_enrichment import (
    validate_llm_response,
    validate_pose,
    validate_expression,
    validate_motion,
    validate_icon,
    validate_template,
    AVAILABLE_POSES,
    AVAILABLE_EXPRESSIONS,
    AVAILABLE_MOTIONS,
    AVAILABLE_ICONS,
)
from smart_defaults import SCENE_TEMPLATES, TEMPLATE_CAMERA_MAP
from emotion_analysis import detect_emotion, extract_numbers


# ============================================================================
# LLM PROMPTS FOR MULTI-STEP PIPELINE
# ============================================================================

STEP1_SYSTEM_PROMPT = """당신은 영상 기획자입니다.
전체 나레이션을 분석하여 영상의 장르, 테마, BGM, 전체 분위기를 결정합니다.

사용 가능한 테마: dark_cool, dark_warm, light_clean, light_warm, dark_purple, dark_green, sunset, ocean, forest, midnight

사용 가능한 BGM 무드: upbeat_light, calm_ambient, inspiring, tense, playful, dramatic, corporate

JSON 형식으로만 응답하세요."""

STEP1_USER_PROMPT = """전체 나레이션:
"{narration}"

위 나레이션을 분석하여 다음 JSON을 출력하세요:
{{
  "genre": "educational/promotional/news/story/tutorial 중 하나",
  "theme": "테마명",
  "bgm": "BGM 무드",
  "total_mood": "전체 분위기 설명 (한국어)",
  "key_topics": ["핵심 주제 1", "핵심 주제 2"]
}}"""

STEP2_SYSTEM_PROMPT = """당신은 영상 편집자입니다.
나레이션을 의미 단위로 씬을 분할하고 각 씬의 역할을 분류합니다.

씬 역할:
- opening: 인사, 소개
- explanation: 개념 설명, 정의
- emphasis: 핵심 포인트, 숫자 강조
- comparison: 비교, 대조
- example: 예시, 사례
- closing: 마무리, 요약, 행동 촉구

규칙:
1. 한 씬은 1-2문장이 적당
2. 의미가 연결된 문장은 같은 씬으로 묶음
3. 숫자/통계가 있으면 emphasis
4. 첫 씬은 opening, 마지막 씬은 closing

JSON 형식으로만 응답하세요."""

STEP2_USER_PROMPT = """전체 나레이션:
"{narration}"

전체 분위기: {mood}
핵심 주제: {topics}

위 나레이션을 씬 단위로 분할하고 역할을 분류하여 다음 JSON을 출력하세요:
{{
  "scenes": [
    {{"text": "첫 번째 씬 나레이션", "role": "opening"}},
    {{"text": "두 번째 씬 나레이션", "role": "explanation"}},
    ...
  ]
}}"""

STEP3_SYSTEM_PROMPT = """당신은 인포그래픽 영상 감독입니다.
각 씬의 나레이션과 역할을 바탕으로 상세한 영상 구성을 결정합니다.

사용 가능한 포즈: standing, pointing_right, pointing_left, pointing_up, thinking, explaining, celebrating, waving, thumbsUp, shrugging, sitting, depressed, surprised_pose, confident, presenting

사용 가능한 표정: neutral, happy, sad, surprised, thinking, excited, focused, angry, worried

사용 가능한 모션: breathing, nodding, typing, nervous, laughing, crying, headShake, clapping, jumping, thinking_loop, waving_loop

사용 가능한 아이콘: lightbulb, money-bag, chart-up, chart-down, piggy-bank, warning, checkmark, cross, clock, target, star, book, trophy, heart, thumbs-up, question, calculator, coin

씬 템플릿: intro_greeting, intro_hook, explain_default, explain_formula, emphasis_number, emphasis_statement, compare_side_by_side, closing_summary, closing_call_to_action

규칙:
1. 역할에 맞는 템플릿 선택
2. 나레이션에서 핵심 키워드 1-2개 추출하여 text 오브젝트 생성
3. 숫자가 있으면 counter 오브젝트 추가
4. 이전 씬과 다른 포즈 사용 (연속 금지)

JSON 형식으로만 응답하세요."""

STEP3_USER_PROMPT = """씬 나레이션: "{narration}"
씬 역할: {role}
씬 번호: {scene_index}/{total_scenes}
이전 씬 포즈: {previous_pose}
전체 테마: {theme}

위 씬에 대해 영상 구성을 JSON으로 출력하세요:
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
  "camera": "static_full/zoom_in_fast/zoom_in_slow/static_closeup/static_wide",
  "transition": "crossfade/cut/fadeFromBlack/slideLeft"
}}"""


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class VideoAnalysis:
    """Step 1 result: Overall video analysis."""
    genre: str
    theme: str
    bgm: str
    total_mood: str
    key_topics: list[str]


@dataclass
class SceneSplit:
    """Step 2 result: A single scene split."""
    text: str
    role: str  # opening, explanation, emphasis, comparison, example, closing


@dataclass
class FullAutoScene:
    """Step 3 result: Complete scene composition."""
    narration: str
    role: str
    scene_template: str
    stickman: dict
    objects: list[dict]
    camera: str
    transition: str
    source: str  # "llm" or "rule"


# ============================================================================
# LLM API CALLS
# ============================================================================

def call_llm_step(
    system_prompt: str,
    user_prompt: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> Optional[dict]:
    """Generic LLM call for any step."""
    if provider == "groq":
        try:
            from groq import Groq
        except ImportError:
            return None

        if api_key is None:
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                return None

        client = Groq(api_key=api_key)

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
                max_tokens=2000,
                response_format={"type": "json_object"},
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"LLM Step error: {e}")
            return None

    return None


# ============================================================================
# STEP 1: OVERALL ANALYSIS
# ============================================================================

def analyze_video(
    narration: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> VideoAnalysis:
    """Step 1: Analyze overall video properties."""
    user_prompt = STEP1_USER_PROMPT.format(narration=narration)

    result = call_llm_step(STEP1_SYSTEM_PROMPT, user_prompt, provider, api_key)

    if result:
        return VideoAnalysis(
            genre=result.get("genre", "educational"),
            theme=result.get("theme", "dark_cool"),
            bgm=result.get("bgm", "calm_ambient"),
            total_mood=result.get("total_mood", ""),
            key_topics=result.get("key_topics", []),
        )

    # Fallback
    return VideoAnalysis(
        genre="educational",
        theme="dark_cool",
        bgm="calm_ambient",
        total_mood="정보 전달",
        key_topics=[],
    )


# ============================================================================
# STEP 2: SCENE SPLITTING
# ============================================================================

def split_scenes(
    narration: str,
    analysis: VideoAnalysis,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> list[SceneSplit]:
    """Step 2: Split narration into scenes with roles."""
    user_prompt = STEP2_USER_PROMPT.format(
        narration=narration,
        mood=analysis.total_mood,
        topics=", ".join(analysis.key_topics),
    )

    result = call_llm_step(STEP2_SYSTEM_PROMPT, user_prompt, provider, api_key)

    if result and "scenes" in result:
        scenes = []
        for s in result["scenes"]:
            scenes.append(SceneSplit(
                text=s.get("text", ""),
                role=s.get("role", "explanation"),
            ))
        return scenes

    # Fallback: split by sentences
    return fallback_split_scenes(narration)


def fallback_split_scenes(narration: str) -> list[SceneSplit]:
    """Fallback scene splitting by sentences."""
    # Split by sentence endings
    sentences = re.split(r'(?<=[.!?])\s+', narration.strip())
    scenes = []

    for i, sentence in enumerate(sentences):
        if not sentence.strip():
            continue

        # Determine role based on position and content
        if i == 0:
            role = "opening"
        elif i == len(sentences) - 1:
            role = "closing"
        elif any(c.isdigit() for c in sentence):
            role = "emphasis"
        else:
            role = "explanation"

        scenes.append(SceneSplit(text=sentence.strip(), role=role))

    return scenes


# ============================================================================
# STEP 3: SCENE COMPOSITION
# ============================================================================

def compose_scene(
    scene_split: SceneSplit,
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str],
    theme: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> FullAutoScene:
    """Step 3: Compose detailed scene from split."""
    user_prompt = STEP3_USER_PROMPT.format(
        narration=scene_split.text,
        role=scene_split.role,
        scene_index=scene_index + 1,
        total_scenes=total_scenes,
        previous_pose=previous_pose or "없음",
        theme=theme,
    )

    result = call_llm_step(STEP3_SYSTEM_PROMPT, user_prompt, provider, api_key)

    if result:
        # Validate
        validated = validate_llm_response(result)
        return FullAutoScene(
            narration=scene_split.text,
            role=scene_split.role,
            scene_template=validated["scene_template"],
            stickman=validated["stickman"],
            objects=validated["objects"],
            camera=validated["camera"],
            transition=validated["transition"],
            source="llm",
        )

    # Fallback to rule-based
    return fallback_compose_scene(scene_split, scene_index, total_scenes, previous_pose)


def fallback_compose_scene(
    scene_split: SceneSplit,
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str],
) -> FullAutoScene:
    """Fallback scene composition using rules."""
    from emotion_analysis import suggest_pose, suggest_expression
    from smart_defaults import auto_select_motion, auto_select_camera, auto_select_transition

    # Template based on role
    role_template_map = {
        "opening": "intro_greeting",
        "explanation": "explain_default",
        "emphasis": "emphasis_number",
        "comparison": "compare_side_by_side",
        "example": "explain_formula",
        "closing": "closing_summary",
    }
    template = role_template_map.get(scene_split.role, "explain_default")

    # Pose (avoid previous)
    pose = suggest_pose(scene_split.text, exclude_poses=[previous_pose] if previous_pose else None)
    expression = suggest_expression(scene_split.text)
    motion = auto_select_motion(pose, expression)

    # Objects
    objects = []
    words = scene_split.text.split()
    if words:
        keyword = max(words, key=len)[:15]
        objects.append({"type": "text", "content": keyword, "style": "title"})

    numbers = extract_numbers(scene_split.text)
    if numbers:
        num = max(numbers, key=lambda x: x["value"])
        objects.append({
            "type": "counter",
            "from": 0,
            "to": int(num["value"]),
            "format": "currency_krw" if num.get("unit") == "원" else "number",
        })

    return FullAutoScene(
        narration=scene_split.text,
        role=scene_split.role,
        scene_template=template,
        stickman={"pose": pose, "expression": expression, "motion": motion},
        objects=objects,
        camera=auto_select_camera(template),
        transition=auto_select_transition(template, None),
        source="rule",
    )


# ============================================================================
# MONOTONY PREVENTION
# ============================================================================

def ensure_variety(scenes: list[FullAutoScene]) -> list[FullAutoScene]:
    """
    Ensure variety in scenes by preventing consecutive repetition.

    Rules:
    - No 3 consecutive same poses
    - No 2 consecutive same templates
    - No 3 consecutive same cameras
    """
    # Pose variety
    for i in range(2, len(scenes)):
        if (scenes[i].stickman["pose"] == scenes[i-1].stickman["pose"] ==
            scenes[i-2].stickman["pose"]):
            # Find alternative pose
            current = scenes[i].stickman["pose"]
            alternatives = [p for p in AVAILABLE_POSES[:10] if p != current]
            if alternatives:
                scenes[i].stickman["pose"] = alternatives[i % len(alternatives)]

    # Template variety
    for i in range(1, len(scenes)):
        if scenes[i].scene_template == scenes[i-1].scene_template:
            # Find alternative based on role
            role = scenes[i].role
            alternatives = {
                "opening": ["intro_greeting", "intro_hook"],
                "explanation": ["explain_default", "explain_formula", "explain_reverse"],
                "emphasis": ["emphasis_number", "emphasis_statement"],
                "closing": ["closing_summary", "closing_call_to_action"],
            }
            alts = alternatives.get(role, ["explain_default"])
            current = scenes[i].scene_template
            for alt in alts:
                if alt != current:
                    scenes[i].scene_template = alt
                    break

    # Camera variety
    for i in range(2, len(scenes)):
        if (scenes[i].camera == scenes[i-1].camera == scenes[i-2].camera):
            cameras = ["static_full", "zoom_in_slow", "static_closeup", "static_wide"]
            current = scenes[i].camera
            for cam in cameras:
                if cam != current:
                    scenes[i].camera = cam
                    break

    return scenes


# ============================================================================
# MAIN FULL AUTO FUNCTION
# ============================================================================

def full_auto_compose(
    narration: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> tuple[VideoAnalysis, list[FullAutoScene]]:
    """
    Full auto composition from narration only.

    Returns:
        (VideoAnalysis, list[FullAutoScene])
    """
    print("Step 1: Analyzing video...")
    analysis = analyze_video(narration, provider, api_key)
    print(f"  Genre: {analysis.genre}, Theme: {analysis.theme}, BGM: {analysis.bgm}")

    print("Step 2: Splitting scenes...")
    scene_splits = split_scenes(narration, analysis, provider, api_key)
    print(f"  Split into {len(scene_splits)} scenes")

    print("Step 3: Composing scenes...")
    scenes = []
    previous_pose = None

    for i, split in enumerate(scene_splits):
        scene = compose_scene(
            split, i, len(scene_splits), previous_pose,
            analysis.theme, provider, api_key
        )
        scenes.append(scene)
        previous_pose = scene.stickman["pose"]
        print(f"  Scene {i+1}: {scene.role} → {scene.scene_template} ({scene.source})")

    print("Step 4: Ensuring variety...")
    scenes = ensure_variety(scenes)

    return analysis, scenes


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    "full_auto_compose",
    "analyze_video",
    "split_scenes",
    "compose_scene",
    "ensure_variety",
    "VideoAnalysis",
    "SceneSplit",
    "FullAutoScene",
]


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv()

    test_narration = """
    안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다.
    단리는 원금에만 이자가 붙습니다.
    하지만 복리는 원금에 이자를 더한 금액에 다시 이자가 붙습니다.
    백만원을 연 7%로 30년 투자하면 약 761만원이 됩니다.
    시간은 복리의 가장 강력한 무기입니다.
    오늘부터 복리 투자를 시작하세요!
    """

    analysis, scenes = full_auto_compose(test_narration)

    print("\n=== Results ===")
    print(f"Theme: {analysis.theme}")
    print(f"BGM: {analysis.bgm}")
    print(f"Scenes: {len(scenes)}")

    for i, scene in enumerate(scenes):
        print(f"\n  Scene {i+1}: {scene.role}")
        print(f"    Template: {scene.scene_template}")
        print(f"    Stickman: {scene.stickman}")
        print(f"    Objects: {len(scene.objects)}")
