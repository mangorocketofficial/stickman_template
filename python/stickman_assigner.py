"""
Stickman Assigner Module
Assigns pose, expression, and motion to whiteboard scenes based on narration emotion.

Ported from _archive/stickman-v1/python-track-c/emotion_analysis.py
"""

from dataclasses import dataclass
from typing import Optional


# 1-based scene indices that should use AI-generated images (20 scenes)
IMAGE_SCENE_INDICES = {
    1, 5,                       # intro: opener + 18 concepts overview
    14, 18, 21,                 # stress_point: opener + definition + thickness
    22, 26, 30,                 # oil_removal: opener + oil surface + filing
    31, 33, 36, 38,             # nail_science: opener + moisture + dry/wet + gel removal
    39, 43, 45,                 # uv_lamp: opener + UV types + UVA wavelength
    46, 50, 54,                 # anatomy: opener + free edge + cuticle vs eponychium
    55, 63,                     # conclusion: opener + final closing
}


# ============================================================================
# EMOTION KEYWORDS (Korean) - from emotion_analysis.py
# ============================================================================

EMOTION_KEYWORDS = {
    "positive": [
        "좋은", "좋아요", "좋습니다",
        "놀라운", "대단한", "훌륭한", "멋진",
        "성공", "축하", "감사",
        "즐거운", "행복", "기쁜",
        "최고", "완벽", "굉장",
    ],
    "negative": [
        "위험", "주의", "조심",
        "손해", "손실", "실패", "실수",
        "문제", "걱정",
        "경고", "금지", "안됩니다",
        "절대", "피해야",
    ],
    "surprise": [
        "무려", "놀랍게도", "놀랍습니다",
        "엄청난", "어마어마한",
        "충격", "깜짝",
        "예상치 못한", "의외로",
    ],
    "thinking": [
        "왜", "어떻게", "무엇을",
        "만약", "그런데", "하지만",
        "과연", "정말",
        "생각해", "고민", "궁금",
        "비교", "분석",
    ],
    "emphasis": [
        "가장", "제일", "최고로",
        "핵심", "중요", "포인트",
        "바로", "정확히", "딱",
        "반드시", "꼭", "필수",
        "기억하세요", "잊지 마세요",
    ],
    "closing": [
        "시작하세요", "해보세요", "도전하세요",
        "기억하세요", "잊지 마세요",
        "감사합니다", "수고하셨습니다",
        "마무리", "마지막으로", "끝으로",
    ],
    "introduction": [
        "안녕하세요", "반갑습니다",
        "오늘은", "이번에는",
        "소개", "알아보", "살펴보",
        "시작", "먼저",
    ],
    "explanation": [
        "입니다", "습니다", "이란",
        "의미", "뜻", "정의",
        "예를 들어", "예시",
        "왜냐하면", "때문에", "이유",
        "따라서", "그러므로", "결과",
    ],
}


# ============================================================================
# EMOTION → VISUAL ELEMENT MAPPING
# ============================================================================

@dataclass
class EmotionMapping:
    expression: str
    pose_candidates: list[str]
    motion: str


EMOTION_MAPPINGS = {
    "positive": EmotionMapping(
        expression="happy",
        pose_candidates=["celebrating", "thumbsUp", "waving", "presenting"],
        motion="jumping",
    ),
    "negative": EmotionMapping(
        expression="sad",
        pose_candidates=["depressed", "shrugging", "arms_crossed"],
        motion="headShake",
    ),
    "surprise": EmotionMapping(
        expression="surprised",
        pose_candidates=["surprised_pose", "both_hands_up"],
        motion="breathing",
    ),
    "thinking": EmotionMapping(
        expression="thinking",
        pose_candidates=["thinking", "hand_on_chin", "sitting"],
        motion="thinking_loop",
    ),
    "emphasis": EmotionMapping(
        expression="focused",
        pose_candidates=["pointing_right", "pointing_up", "explaining"],
        motion="nodding",
    ),
    "closing": EmotionMapping(
        expression="happy",
        pose_candidates=["celebrating", "waving", "thumbsUp"],
        motion="clapping",
    ),
    "introduction": EmotionMapping(
        expression="happy",
        pose_candidates=["waving", "standing", "presenting"],
        motion="breathing",
    ),
    "explanation": EmotionMapping(
        expression="neutral",
        pose_candidates=["explaining", "pointing_right", "standing"],
        motion="nodding",
    ),
    "neutral": EmotionMapping(
        expression="neutral",
        pose_candidates=["standing", "explaining"],
        motion="breathing",
    ),
}


# ============================================================================
# STICKMAN ASSIGNMENT
# ============================================================================

@dataclass
class StickmanAssignment:
    pose: str
    expression: str
    motion: str
    color: str = "#333333"


def detect_emotion(text: str) -> str:
    """Detect primary emotion from Korean text using keyword matching."""
    text_lower = text.lower()
    scores = {}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in text_lower:
                score += len(keyword)
        scores[emotion] = score

    if scores:
        best = max(scores, key=scores.get)
        if scores[best] > 0:
            return best
    return "neutral"


def suggest_pose(text: str, exclude_poses: Optional[list[str]] = None) -> str:
    """Suggest pose based on emotion, avoiding previous poses for variety."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    candidates = mapping.pose_candidates

    if exclude_poses:
        available = [p for p in candidates if p not in exclude_poses]
        if available:
            return available[0]

    return candidates[0] if candidates else "standing"


def suggest_expression(text: str) -> str:
    """Suggest expression based on emotion."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    return mapping.expression


def suggest_motion(text: str) -> str:
    """Suggest motion based on emotion."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    return mapping.motion


def assign_stickman_for_scenes(
    sections: list,
    image_indices: set[int],
) -> dict[int, StickmanAssignment]:
    """
    Assign stickman pose/expression/motion for whiteboard (non-image) scenes.

    Args:
        sections: List of ScriptSection objects (post split_long_scenes)
        image_indices: Set of 1-based scene indices that use AI images

    Returns:
        Dict mapping 0-based scene index → StickmanAssignment
    """
    assignments = {}
    previous_pose = None

    for i, section in enumerate(sections):
        scene_num = i + 1  # 1-based
        if scene_num in image_indices:
            continue  # Skip image scenes

        narration = section.narration or ""
        pose = suggest_pose(narration, exclude_poses=[previous_pose] if previous_pose else None)
        expression = suggest_expression(narration)
        motion = suggest_motion(narration)

        assignments[i] = StickmanAssignment(
            pose=pose,
            expression=expression,
            motion=motion,
            color="#333333",
        )
        previous_pose = pose

    return assignments
