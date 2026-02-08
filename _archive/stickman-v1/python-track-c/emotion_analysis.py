"""
Emotion Analysis Module (Track C-4)
Keyword-based emotion detection and emotion → visual element mapping.

This module is shared between:
- Level 1 (smart defaults): Basic keyword detection
- Level 2 (LLM assistant): Hybrid keyword + LLM analysis
- Level 3 (full auto): Primary emotion source for scene composition

Features:
- Keyword-based emotion detection (no LLM required)
- Emotion → expression mapping
- Emotion → pose suggestion
- Emotion → motion suggestion
- Emotion → camera suggestion
- Emotion → BGM mood suggestion
"""

import re
from dataclasses import dataclass
from typing import Optional


# ============================================================================
# EMOTION KEYWORDS (Korean)
# ============================================================================

EMOTION_KEYWORDS = {
    "positive": [
        "좋은", "좋아요", "좋습니다",
        "놀라운", "대단한", "훌륭한", "멋진", "환상적",
        "성공", "승리", "축하", "감사",
        "마법", "기적", "행운",
        "즐거운", "행복", "기쁜",
        "최고", "완벽", "굉장",
    ],
    "negative": [
        "위험", "주의", "조심",
        "손해", "손실", "실패", "실수",
        "나쁜", "안좋은", "불행",
        "문제", "걱정", "염려",
        "경고", "금지", "안됩니다",
        "절대", "피해야",
    ],
    "surprise": [
        "무려", "놀랍게도", "놀랍습니다",
        "믿기 힘든", "믿을 수 없는",
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
        "절대", "무조건",
        "기억하세요", "잊지 마세요",
    ],
    "closing": [
        "시작하세요", "해보세요", "도전하세요",
        "기억하세요", "잊지 마세요",
        "감사합니다", "수고하셨습니다",
        "마무리", "마지막으로", "끝으로",
        "오늘부터", "지금부터",
        "행동하세요", "실천하세요",
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
    """Mapping from emotion to visual elements."""
    expression: str
    pose_candidates: list[str]
    motion: str
    camera: str
    bgm_mood: str


EMOTION_MAPPINGS = {
    "positive": EmotionMapping(
        expression="happy",
        pose_candidates=["celebrating", "thumbsUp", "waving", "presenting"],
        motion="jumping",
        camera="zoom_in_slow",
        bgm_mood="upbeat_light",
    ),
    "negative": EmotionMapping(
        expression="sad",
        pose_candidates=["depressed", "shrugging", "arms_crossed"],
        motion="headShake",
        camera="static_full",
        bgm_mood="tense",
    ),
    "surprise": EmotionMapping(
        expression="surprised",
        pose_candidates=["surprised_pose", "both_hands_up"],
        motion="breathing",
        camera="zoom_in_fast",
        bgm_mood="dramatic",
    ),
    "thinking": EmotionMapping(
        expression="thinking",
        pose_candidates=["thinking", "hand_on_chin", "sitting"],
        motion="thinking_loop",
        camera="static_closeup",
        bgm_mood="calm_ambient",
    ),
    "emphasis": EmotionMapping(
        expression="focused",
        pose_candidates=["pointing_right", "pointing_up", "explaining"],
        motion="nodding",
        camera="zoom_in_fast",
        bgm_mood="dramatic",
    ),
    "closing": EmotionMapping(
        expression="happy",
        pose_candidates=["celebrating", "waving", "thumbsUp"],
        motion="clapping",
        camera="static_full",
        bgm_mood="inspiring",
    ),
    "introduction": EmotionMapping(
        expression="happy",
        pose_candidates=["waving", "standing", "presenting"],
        motion="breathing",
        camera="static_full",
        bgm_mood="calm_ambient",
    ),
    "explanation": EmotionMapping(
        expression="neutral",
        pose_candidates=["explaining", "pointing_right", "standing"],
        motion="nodding",
        camera="static_full",
        bgm_mood="calm_ambient",
    ),
    "neutral": EmotionMapping(
        expression="neutral",
        pose_candidates=["standing", "explaining"],
        motion="breathing",
        camera="static_full",
        bgm_mood="calm_ambient",
    ),
}


# ============================================================================
# EMOTION DETECTION
# ============================================================================

def detect_emotion(text: str) -> str:
    """
    Detect primary emotion from text using keyword matching.

    Returns the emotion with the highest keyword match count.
    If no keywords match, returns "neutral".
    """
    text_lower = text.lower()

    scores = {}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in text_lower:
                # Weight longer keywords higher
                score += len(keyword)
        scores[emotion] = score

    # Find emotion with highest score
    if scores:
        best_emotion = max(scores, key=scores.get)
        if scores[best_emotion] > 0:
            return best_emotion

    return "neutral"


def detect_emotions(text: str) -> list[tuple[str, float]]:
    """
    Detect all emotions with confidence scores.

    Returns list of (emotion, confidence) tuples, sorted by confidence.
    Confidence is normalized 0-1 based on keyword match weight.
    """
    text_lower = text.lower()

    scores = {}
    total_score = 0

    for emotion, keywords in EMOTION_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in text_lower:
                score += len(keyword)
        scores[emotion] = score
        total_score += score

    if total_score == 0:
        return [("neutral", 1.0)]

    # Normalize scores to confidence
    results = []
    for emotion, score in scores.items():
        if score > 0:
            confidence = score / total_score
            results.append((emotion, confidence))

    # Sort by confidence descending
    results.sort(key=lambda x: x[1], reverse=True)

    return results if results else [("neutral", 1.0)]


# ============================================================================
# SCENE ROLE DETECTION
# ============================================================================

def detect_scene_role(
    text: str,
    scene_index: int,
    total_scenes: int,
) -> str:
    """
    Detect scene role based on content and position.

    Returns one of:
    - "opening": Introduction scene
    - "explanation": Main content explanation
    - "emphasis": Key point emphasis
    - "comparison": Comparing concepts
    - "closing": Conclusion/call-to-action
    """
    position_ratio = scene_index / max(total_scenes - 1, 1)

    # Position-based hints
    if scene_index == 0:
        return "opening"
    if scene_index == total_scenes - 1:
        return "closing"

    # Content-based detection
    emotion = detect_emotion(text)

    if emotion == "introduction":
        return "opening"
    if emotion == "closing":
        return "closing"
    if emotion == "emphasis":
        return "emphasis"
    if emotion == "thinking":
        return "comparison"

    # Default based on position
    if position_ratio < 0.2:
        return "opening"
    elif position_ratio > 0.85:
        return "closing"
    elif 0.4 <= position_ratio <= 0.6:
        return "emphasis"
    else:
        return "explanation"


# ============================================================================
# VISUAL ELEMENT SUGGESTIONS
# ============================================================================

def suggest_expression(text: str) -> str:
    """Suggest expression based on text emotion."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    return mapping.expression


def suggest_pose(text: str, exclude_poses: Optional[list[str]] = None) -> str:
    """
    Suggest pose based on text emotion.

    Args:
        text: Narration text
        exclude_poses: Poses to avoid (for variety)
    """
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    candidates = mapping.pose_candidates

    if exclude_poses:
        # Filter out excluded poses
        available = [p for p in candidates if p not in exclude_poses]
        if available:
            return available[0]

    return candidates[0] if candidates else "standing"


def suggest_motion(text: str) -> str:
    """Suggest motion based on text emotion."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    return mapping.motion


def suggest_camera(text: str) -> str:
    """Suggest camera based on text emotion."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    return mapping.camera


def suggest_bgm_mood(text: str) -> str:
    """Suggest BGM mood based on text emotion."""
    emotion = detect_emotion(text)
    mapping = EMOTION_MAPPINGS.get(emotion, EMOTION_MAPPINGS["neutral"])
    return mapping.bgm_mood


# ============================================================================
# BATCH ANALYSIS
# ============================================================================

@dataclass
class SceneEmotionAnalysis:
    """Complete emotion analysis for a scene."""
    primary_emotion: str
    confidence: float
    scene_role: str
    expression: str
    pose: str
    motion: str
    camera: str
    bgm_mood: str


def analyze_scene(
    text: str,
    scene_index: int,
    total_scenes: int,
    previous_pose: Optional[str] = None,
) -> SceneEmotionAnalysis:
    """
    Complete emotion analysis for a scene.

    Returns all suggested visual elements based on emotion.
    """
    emotions = detect_emotions(text)
    primary_emotion = emotions[0][0]
    confidence = emotions[0][1]

    scene_role = detect_scene_role(text, scene_index, total_scenes)

    # Get suggestions
    expression = suggest_expression(text)
    pose = suggest_pose(text, exclude_poses=[previous_pose] if previous_pose else None)
    motion = suggest_motion(text)
    camera = suggest_camera(text)
    bgm_mood = suggest_bgm_mood(text)

    return SceneEmotionAnalysis(
        primary_emotion=primary_emotion,
        confidence=confidence,
        scene_role=scene_role,
        expression=expression,
        pose=pose,
        motion=motion,
        camera=camera,
        bgm_mood=bgm_mood,
    )


def analyze_script(narrations: list[str]) -> list[SceneEmotionAnalysis]:
    """
    Analyze all scenes in a script.

    Returns list of SceneEmotionAnalysis for each scene.
    """
    total_scenes = len(narrations)
    results = []
    previous_pose = None

    for i, narration in enumerate(narrations):
        analysis = analyze_scene(
            text=narration,
            scene_index=i,
            total_scenes=total_scenes,
            previous_pose=previous_pose,
        )
        results.append(analysis)
        previous_pose = analysis.pose

    return results


# ============================================================================
# NUMBER EXTRACTION (for counters)
# ============================================================================

def extract_numbers(text: str) -> list[dict]:
    """
    Extract numbers from text for counter objects.

    Returns list of dicts with:
    - value: The number
    - formatted: Formatted string (with commas, units)
    - unit: Detected unit (원, %, 년, etc.)
    """
    results = []

    # Pattern: number with optional unit
    # Matches: 761만원, 7%, 30년, 100,000원, etc.
    patterns = [
        # Korean large numbers: 761만원, 1억원
        (r'(\d+(?:,\d{3})*(?:\.\d+)?)(만|억|조)?(원|달러|엔)?', 'korean'),
        # Percentages: 7%, 10.5%
        (r'(\d+(?:\.\d+)?)\s*%', 'percent'),
        # Years: 30년
        (r'(\d+)\s*년', 'year'),
        # Plain numbers with commas: 100,000
        (r'(\d{1,3}(?:,\d{3})+)', 'plain'),
        # Plain numbers: 100
        (r'(?<![,\d])(\d+)(?![,\d])', 'plain'),
    ]

    for pattern, ptype in patterns:
        for match in re.finditer(pattern, text):
            groups = match.groups()

            if ptype == 'korean':
                num_str = groups[0].replace(',', '')
                multiplier = groups[1] if len(groups) > 1 else None
                unit = groups[2] if len(groups) > 2 else None

                value = float(num_str)
                if multiplier == '만':
                    value *= 10000
                elif multiplier == '억':
                    value *= 100000000
                elif multiplier == '조':
                    value *= 1000000000000

                results.append({
                    'value': int(value),
                    'formatted': match.group(0),
                    'unit': unit or '',
                    'multiplier': multiplier or '',
                })

            elif ptype == 'percent':
                value = float(groups[0])
                results.append({
                    'value': value,
                    'formatted': f"{value}%",
                    'unit': '%',
                    'multiplier': '',
                })

            elif ptype == 'year':
                value = int(groups[0])
                results.append({
                    'value': value,
                    'formatted': f"{value}년",
                    'unit': '년',
                    'multiplier': '',
                })

            elif ptype == 'plain':
                num_str = groups[0].replace(',', '')
                value = int(num_str)
                results.append({
                    'value': value,
                    'formatted': groups[0],
                    'unit': '',
                    'multiplier': '',
                })

    # Remove duplicates (keep first occurrence)
    seen_values = set()
    unique_results = []
    for r in results:
        if r['value'] not in seen_values:
            seen_values.add(r['value'])
            unique_results.append(r)

    return unique_results


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Keywords
    "EMOTION_KEYWORDS",
    # Mappings
    "EMOTION_MAPPINGS",
    "EmotionMapping",
    # Detection
    "detect_emotion",
    "detect_emotions",
    "detect_scene_role",
    # Suggestions
    "suggest_expression",
    "suggest_pose",
    "suggest_motion",
    "suggest_camera",
    "suggest_bgm_mood",
    # Batch
    "analyze_scene",
    "analyze_script",
    "SceneEmotionAnalysis",
    # Numbers
    "extract_numbers",
]
