"""
Smart Defaults Module (Track C-1)
Rule engine for intelligent auto-completion of scene properties.

This module provides Level 1 automation:
- Scene template auto-selection based on position and content
- Pose → Motion auto-matching
- Template → Camera mapping
- Background color auto-variation within theme palette
- Transition auto-selection (preventing consecutive repetition)
- SFX auto-mapping for object events

No LLM required - pure rule-based logic.
"""

import math
from typing import Optional
from dataclasses import dataclass


# ============================================================================
# SCENE TEMPLATE AUTO-SELECTION
# ============================================================================

SCENE_TEMPLATES = [
    # MVP templates
    "intro_greeting",
    "explain_default",
    "explain_formula",
    "explain_reverse",
    "emphasis_number",
    "emphasis_statement",
    "compare_side_by_side",
    "closing_summary",
    # V2 templates
    "transition_topic_change",
    "example_with_counter",
    "intro_hook",
    "intro_minimal",
    "explain_two_column",
    "explain_step_by_step",
    "emphasis_icon_focus",
    "closing_call_to_action",
    # V3 templates
    "explain_diagram",
    "explain_timeline",
    "compare_before_after",
    "compare_pros_cons",
    "list_bullets",
    "list_numbered",
    "quiz_question",
    "transition_break",
    "emphasis_quote",
]


def auto_select_scene_template(
    scene_index: int,
    total_scenes: int,
    directive_types: list[str],
    narration: str = "",
) -> str:
    """
    Auto-select scene template based on position and content.

    Rules:
    1. First scene → intro template
    2. Last scene → closing template
    3. Has counter → emphasis_number
    4. Multiple texts → compare or explain_two_column
    5. Position-based alternation to prevent monotony
    """
    position_ratio = scene_index / max(total_scenes - 1, 1)

    # Position-based rules
    if scene_index == 0:
        return "intro_greeting"
    if scene_index == total_scenes - 1:
        return "closing_summary"

    # Content-based rules
    if "counter" in directive_types:
        return "emphasis_number"

    text_count = directive_types.count("text")
    if text_count >= 2:
        return "compare_side_by_side"

    if "icon" in directive_types and text_count == 0:
        return "emphasis_icon_focus"

    # Position-based alternation for variety
    if position_ratio < 0.3:
        # Early scenes: intro/explain
        templates = ["explain_default", "explain_formula", "intro_hook"]
        return _alternate_by_index(scene_index, templates)
    elif position_ratio < 0.7:
        # Middle scenes: explain/emphasis
        templates = ["explain_default", "explain_reverse", "example_with_counter", "emphasis_statement"]
        return _alternate_by_index(scene_index, templates)
    else:
        # Late scenes: emphasis/transition
        templates = ["emphasis_statement", "transition_topic_change", "explain_default"]
        return _alternate_by_index(scene_index, templates)


def _alternate_by_index(index: int, options: list[str]) -> str:
    """Select from options based on index for variety."""
    return options[index % len(options)]


# ============================================================================
# POSE → MOTION AUTO-MATCHING
# ============================================================================

POSE_MOTION_MAP = {
    # Base poses → default motions
    "standing": "breathing",
    "standing_relaxed": "breathing",
    "sitting": "breathing",
    "sitting_crossed": "breathing",

    # Gesture poses
    "pointing_right": "breathing",
    "pointing_left": "breathing",
    "pointing_up": "nodding",
    "pointing_down": "breathing",
    "both_hands_up": "breathing",
    "arms_crossed": "breathing",
    "hands_on_hips": "breathing",
    "hand_on_chin": "thinking_loop",
    "waving": "waving_loop",
    "thumbsUp": "breathing",
    "beckoning": "breathing",
    "shrugging": "headShake",

    # Emotion poses
    "thinking": "thinking_loop",
    "explaining": "nodding",
    "celebrating": "jumping",
    "depressed": "crying",
    "surprised_pose": "breathing",
    "confident": "breathing",
    "nervous_pose": "nervous",

    # Activity poses
    "walking": "walkCycle",
    "running_pose": "running",
    "jumping_pose": "jumping",
    "typing_pose": "typing",
    "presenting": "nodding",
    "listening": "nodding",
}

EXPRESSION_MOTION_OVERRIDE = {
    # Expression can override motion
    "happy": None,              # No override
    "excited": "jumping",       # Excited → jumping
    "sad": "crying",            # Sad → crying
    "surprised": None,          # No override
    "thinking": "thinking_loop",
    "angry": "headShake",
    "focused": None,
    "neutral": None,
    "worried": "nervous",
}


def auto_select_motion(pose: str, expression: str = "neutral") -> str:
    """
    Auto-select motion based on pose and expression.

    Priority:
    1. Expression override (if defined)
    2. Pose → Motion mapping
    3. Default: breathing
    """
    # Check expression override first
    if expression in EXPRESSION_MOTION_OVERRIDE:
        override = EXPRESSION_MOTION_OVERRIDE[expression]
        if override is not None:
            return override

    # Use pose mapping
    if pose in POSE_MOTION_MAP:
        return POSE_MOTION_MAP[pose]

    # Default fallback
    return "breathing"


# ============================================================================
# TEMPLATE → CAMERA MAPPING
# ============================================================================

TEMPLATE_CAMERA_MAP = {
    # Intro templates
    "intro_greeting": "static_full",
    "intro_hook": "zoom_in_slow",
    "intro_minimal": "static_full",

    # Explain templates
    "explain_default": "static_full",
    "explain_formula": "static_closeup",
    "explain_reverse": "pan_left_to_right",
    "explain_two_column": "static_wide",
    "explain_step_by_step": "static_full",
    "explain_diagram": "static_wide",
    "explain_timeline": "pan_left_to_right",

    # Emphasis templates
    "emphasis_number": "zoom_in_fast",
    "emphasis_statement": "zoom_in_slow",
    "emphasis_icon_focus": "static_closeup",
    "emphasis_quote": "zoom_breathe",

    # Compare templates
    "compare_side_by_side": "static_wide",
    "compare_before_after": "pan_left_to_right",
    "compare_pros_cons": "static_wide",

    # List templates
    "list_bullets": "static_full",
    "list_numbered": "static_full",

    # Transition templates
    "transition_topic_change": "zoom_out_reveal",
    "transition_break": "static_full",

    # Example templates
    "example_with_counter": "static_full",

    # Quiz templates
    "quiz_question": "zoom_in_slow",

    # Closing templates
    "closing_summary": "static_full",
    "closing_call_to_action": "zoom_in_slow",
}


def auto_select_camera(scene_template: str) -> str:
    """Auto-select camera preset based on scene template."""
    return TEMPLATE_CAMERA_MAP.get(scene_template, "static_full")


# ============================================================================
# BACKGROUND COLOR AUTO-VARIATION
# ============================================================================

# Theme palettes (matching remotion/src/styles/themes.ts)
THEME_PALETTES = {
    "dark_cool": {
        "primary": "#1a1a2e",
        "secondary": "#16213e",
        "accent": "#0f3460",
    },
    "dark_warm": {
        "primary": "#1a1a1a",
        "secondary": "#2d2d2d",
        "accent": "#3d3d3d",
    },
    "light_clean": {
        "primary": "#ffffff",
        "secondary": "#f5f5f5",
        "accent": "#e0e0e0",
    },
    "light_warm": {
        "primary": "#faf8f5",
        "secondary": "#f5f0e8",
        "accent": "#e8e0d5",
    },
    "dark_purple": {
        "primary": "#1a0a2e",
        "secondary": "#2d1b4e",
        "accent": "#3d2b5e",
    },
    "dark_green": {
        "primary": "#0a1a0a",
        "secondary": "#1b2d1b",
        "accent": "#2b3d2b",
    },
    "sunset": {
        "primary": "#1a0f0a",
        "secondary": "#2d1b15",
        "accent": "#3d2b20",
    },
    "ocean": {
        "primary": "#0a1a1f",
        "secondary": "#152d35",
        "accent": "#203d45",
    },
    "forest": {
        "primary": "#0f1a0a",
        "secondary": "#1b2d15",
        "accent": "#2b3d20",
    },
    "midnight": {
        "primary": "#0a0a1a",
        "secondary": "#15152d",
        "accent": "#20203d",
    },
}


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def _rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    """Convert RGB tuple to hex color."""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"


def _interpolate_color(color1: str, color2: str, ratio: float) -> str:
    """Interpolate between two colors."""
    rgb1 = _hex_to_rgb(color1)
    rgb2 = _hex_to_rgb(color2)

    result = tuple(
        int(rgb1[i] + (rgb2[i] - rgb1[i]) * ratio)
        for i in range(3)
    )
    return _rgb_to_hex(result)


def auto_background_colors(theme_name: str, total_scenes: int) -> list[str]:
    """
    Generate background colors for each scene within theme palette.
    Creates subtle variation using sine wave interpolation.
    """
    palette = THEME_PALETTES.get(theme_name, THEME_PALETTES["dark_cool"])
    primary = palette["primary"]
    secondary = palette["secondary"]

    colors = []
    for i in range(total_scenes):
        if total_scenes <= 1:
            ratio = 0
        else:
            # Sine wave creates smooth primary → secondary → primary transition
            ratio = math.sin(i / (total_scenes - 1) * math.pi) * 0.3

        color = _interpolate_color(primary, secondary, ratio)
        colors.append(color)

    return colors


# ============================================================================
# TRANSITION AUTO-SELECTION
# ============================================================================

TRANSITION_TYPES = [
    "cut",
    "crossfade",
    "fadeToBlack",
    "fadeFromBlack",
    "slideLeft",
    "slideRight",
    "slideUp",
    "slideDown",
    "wipeLeft",
    "wipeRight",
]

TEMPLATE_TRANSITION_MAP = {
    # Intro templates → fade in
    "intro_greeting": "fadeFromBlack",
    "intro_hook": "fadeFromBlack",
    "intro_minimal": "fadeFromBlack",

    # Explain templates → crossfade
    "explain_default": "crossfade",
    "explain_formula": "crossfade",
    "explain_reverse": "slideLeft",
    "explain_two_column": "crossfade",
    "explain_step_by_step": "slideUp",

    # Emphasis templates → cut (impactful)
    "emphasis_number": "cut",
    "emphasis_statement": "cut",
    "emphasis_icon_focus": "crossfade",

    # Compare templates → slide
    "compare_side_by_side": "crossfade",
    "compare_before_after": "slideLeft",

    # Transition templates
    "transition_topic_change": "fadeToBlack",
    "transition_break": "fadeToBlack",

    # Closing templates → fade out
    "closing_summary": "crossfade",
    "closing_call_to_action": "crossfade",
}


def auto_select_transition(
    scene_template: str,
    previous_transition: Optional[str] = None,
) -> str:
    """
    Auto-select transition based on scene template.
    Prevents consecutive repetition of the same transition.
    """
    preferred = TEMPLATE_TRANSITION_MAP.get(scene_template, "crossfade")

    # If same as previous, pick an alternative
    if preferred == previous_transition:
        alternatives = ["crossfade", "cut", "slideLeft"]
        for alt in alternatives:
            if alt != previous_transition:
                return alt

    return preferred


def auto_select_transitions(scene_templates: list[str]) -> list[str]:
    """
    Auto-select transitions for a list of scenes.
    Ensures no more than 2 consecutive same transitions.
    """
    transitions = []

    for i, template in enumerate(scene_templates):
        prev = transitions[-1] if transitions else None
        prev_prev = transitions[-2] if len(transitions) >= 2 else None

        transition = auto_select_transition(template, prev)

        # Prevent 3 consecutive same transitions
        if transition == prev == prev_prev:
            alternatives = ["crossfade", "cut", "slideLeft", "slideUp"]
            for alt in alternatives:
                if alt != transition:
                    transition = alt
                    break

        transitions.append(transition)

    return transitions


# ============================================================================
# SFX AUTO-MAPPING
# ============================================================================

OBJECT_SFX_MAP = {
    # Object type → SFX for enter animation
    "stickman": None,           # No SFX for stickman entry (too frequent)
    "text": "whoosh",           # Text swoosh in
    "counter": "chime",         # Counter with chime
    "icon": "pop",              # Icon pop in
    "shape": "whoosh",          # Shape draw with whoosh
}

ANIMATION_SFX_MAP = {
    # Animation type → SFX
    "popIn": "pop",
    "bounceIn": "pop",
    "slideInRight": "whoosh",
    "slideInLeft": "whoosh",
    "fadeInUp": "whoosh",
    "zoomIn": "whoosh",
    "typewriter": None,         # No SFX for typewriter
    "countUp": "chime",
}

EVENT_SFX_MAP = {
    # Special events → SFX
    "scene_emphasis": "impact",
    "scene_transition": None,
    "counter_complete": "tada",
    "celebration": "tada",
    "warning": "alert",
    "success": "chime",
    "error": "alert",
}


def auto_select_sfx(
    object_type: str,
    animation_type: Optional[str] = None,
    event_type: Optional[str] = None,
) -> Optional[str]:
    """
    Auto-select SFX based on object type, animation, or event.

    Priority:
    1. Event SFX (if specified)
    2. Animation SFX (if matches)
    3. Object type SFX
    """
    # Event SFX
    if event_type and event_type in EVENT_SFX_MAP:
        return EVENT_SFX_MAP[event_type]

    # Animation SFX
    if animation_type and animation_type in ANIMATION_SFX_MAP:
        return ANIMATION_SFX_MAP[animation_type]

    # Object type SFX
    if object_type in OBJECT_SFX_MAP:
        return OBJECT_SFX_MAP[object_type]

    return None


def auto_select_scene_sfx(objects: list[dict]) -> list[dict]:
    """
    Generate SFX triggers for a scene's objects.

    Returns list of SFX trigger configs:
    [{"sfx": "pop", "triggerMs": 0, "volume": 0.5}, ...]
    """
    sfx_triggers = []

    for obj in objects:
        obj_type = obj.get("type", "")
        animation = obj.get("animation", {})
        enter_type = animation.get("enter", {}).get("type")

        sfx = auto_select_sfx(obj_type, enter_type)

        if sfx:
            # Calculate trigger time from object's enter animation
            enter_duration = animation.get("enter", {}).get("durationMs", 400)
            trigger_ms = enter_duration // 2  # Trigger at midpoint of enter

            sfx_triggers.append({
                "sfx": sfx,
                "triggerMs": trigger_ms,
                "volume": 0.5,
            })

    return sfx_triggers


# ============================================================================
# TEXT STYLE AUTO-SELECTION
# ============================================================================

def auto_select_text_style(
    text_index: int,
    total_texts: int,
    content: str,
) -> str:
    """
    Auto-select text style based on position and content.

    Rules:
    1. First text in scene = "title"
    2. Numbers only = "number"
    3. Short text (< 10 chars) = "highlight_box"
    4. Everything else = "body"
    """
    # First text is title
    if text_index == 0:
        return "title"

    # Numbers only
    if content.replace(",", "").replace(".", "").replace("%", "").isdigit():
        return "number"

    # Short text as highlight
    if len(content) < 10:
        return "highlight_box"

    return "body"


# ============================================================================
# MAIN ENRICHMENT FUNCTION
# ============================================================================

@dataclass
class SmartDefaults:
    """Container for all auto-selected defaults for a scene."""
    scene_template: str
    camera: str
    background: str
    transition: str
    sfx_triggers: list[dict]


def enrich_scene(
    scene_index: int,
    total_scenes: int,
    directive_types: list[str],
    objects: list[dict],
    theme_name: str = "dark_cool",
    previous_transition: Optional[str] = None,
    narration: str = "",
) -> SmartDefaults:
    """
    Apply smart defaults to a scene.

    Returns SmartDefaults with all auto-selected properties.
    """
    # Scene template
    scene_template = auto_select_scene_template(
        scene_index, total_scenes, directive_types, narration
    )

    # Camera
    camera = auto_select_camera(scene_template)

    # Background
    backgrounds = auto_background_colors(theme_name, total_scenes)
    background = backgrounds[scene_index] if scene_index < len(backgrounds) else backgrounds[0]

    # Transition
    transition = auto_select_transition(scene_template, previous_transition)

    # SFX
    sfx_triggers = auto_select_scene_sfx(objects)

    return SmartDefaults(
        scene_template=scene_template,
        camera=camera,
        background=background,
        transition=transition,
        sfx_triggers=sfx_triggers,
    )


def enrich_stickman_props(props: dict) -> dict:
    """
    Enrich stickman props with auto-selected motion.
    Modifies props in place and returns it.
    """
    pose = props.get("pose", "standing")
    expression = props.get("expression", "neutral")

    # Only auto-select motion if not explicitly set
    if "motion" not in props or props["motion"] == "breathing":
        props["motion"] = auto_select_motion(pose, expression)

    return props


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Scene template
    "auto_select_scene_template",
    "SCENE_TEMPLATES",
    # Pose/Motion
    "auto_select_motion",
    "POSE_MOTION_MAP",
    "EXPRESSION_MOTION_OVERRIDE",
    # Camera
    "auto_select_camera",
    "TEMPLATE_CAMERA_MAP",
    # Background
    "auto_background_colors",
    "THEME_PALETTES",
    # Transition
    "auto_select_transition",
    "auto_select_transitions",
    "TRANSITION_TYPES",
    # SFX
    "auto_select_sfx",
    "auto_select_scene_sfx",
    "OBJECT_SFX_MAP",
    # Text
    "auto_select_text_style",
    # Main
    "enrich_scene",
    "enrich_stickman_props",
    "SmartDefaults",
]
