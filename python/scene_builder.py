"""
Scene Builder Module
Converts parsed script and alignment data into scene.json for Remotion.

Updated for Track C-1: Smart Defaults integration
"""

import json
from dataclasses import dataclass, field, asdict
from typing import Optional, Any

from script_parser import ParsedScript, Directive
from smart_defaults import (
    enrich_scene,
    enrich_stickman_props,
    auto_select_text_style,
    auto_background_colors,
    auto_select_transitions,
    SmartDefaults,
)


# Default values
DEFAULT_FPS = 30
DEFAULT_WIDTH = 1920
DEFAULT_HEIGHT = 1080
DEFAULT_BG_COLOR = "#1a1a2e"
DEFAULT_SUBTITLE_FONT_SIZE = 48
DEFAULT_SUBTITLE_COLOR = "#FFFFFF"
DEFAULT_SUBTITLE_HIGHLIGHT = "#FFD700"

# Auto-layout presets
LAYOUTS = {
    "stickman_only": {
        "stickman": {"x": 960, "y": 600},
    },
    "stickman_text": {
        "stickman": {"x": 350, "y": 600},
        "text": {"x": 1100, "y": 350},
    },
    "stickman_text_counter": {
        "stickman": {"x": 300, "y": 600},
        "text": {"x": 960, "y": 250},
        "counter": {"x": 960, "y": 450},
    },
    "stickman_text_icon": {
        "stickman": {"x": 300, "y": 600},
        "icon": {"x": 960, "y": 300},
        "text": {"x": 960, "y": 500},
    },
    "text_only": {
        "text": {"x": 960, "y": 400},
    },
    "stickman_icon": {
        "stickman": {"x": 400, "y": 600},
        "icon": {"x": 1100, "y": 400},
    },
}

# Default animations by object type
DEFAULT_ANIMATIONS = {
    "stickman": {
        "enter": {"type": "fadeIn", "durationMs": 500},
        "during": {"type": "breathing", "loop": True},
    },
    "text": {
        "enter": {"type": "fadeInUp", "durationMs": 400},
    },
    "counter": {
        "enter": {"type": "fadeIn", "durationMs": 300},
    },
    "icon": {
        "enter": {"type": "popIn", "durationMs": 400},
    },
    "shape": {
        "enter": {"type": "drawLine", "durationMs": 500},
    },
}

# ============================================
# Motion Architecture Refactoring
# ============================================

# Pose transition actions: use targetPose for enter/during/exit transitions
POSE_ACTIONS = {
    "waving": "waving",           # → waving pose
    "pointing": "pointing_right",  # → pointing_right pose (existing)
    "thumbsUp": "thumbsUp",        # → thumbsUp pose
    "beckoning": "beckoning",      # → beckoning pose
    "excited": "celebrating",      # → celebrating pose (existing)
}

# Loop motions: continuous animation during the scene
LOOP_MOTIONS = [
    "breathing",   # default idle
    "nodding",     # agreeing while explaining
    "typing",      # typing action
    "nervous",     # nervous state
    "laughing",    # laughing
    "crying",      # crying
    "headShake",   # disagreement
    "clapping",    # applause (loop is natural)
    "jumping",     # jumping (loop is natural)
    "running",     # running (loop is natural)
    "walkCycle",   # walking (loop is natural)
]


def determine_layout(directives: list[Directive]) -> str:
    """Determine which layout pattern to use based on directives."""
    types = set(d.type for d in directives)

    if "stickman" in types and "text" in types and "counter" in types:
        return "stickman_text_counter"
    elif "stickman" in types and "text" in types and "icon" in types:
        return "stickman_text_icon"
    elif "stickman" in types and "text" in types:
        return "stickman_text"
    elif "stickman" in types and "icon" in types:
        return "stickman_icon"
    elif "stickman" in types:
        return "stickman_only"
    elif "text" in types:
        return "text_only"
    else:
        return "stickman_only"


def get_position(layout_name: str, obj_type: str, index: int = 0) -> dict:
    """Get position for an object type within a layout."""
    layout = LAYOUTS.get(layout_name, LAYOUTS["stickman_only"])
    if obj_type in layout:
        return layout[obj_type].copy()
    # Default center position
    return {"x": 960, "y": 540}


def directive_to_object(
    directive: Directive,
    obj_id: str,
    position: dict,
) -> dict:
    """Convert a directive to a scene object."""
    obj = {
        "id": obj_id,
        "type": directive.type,
        "position": position,
        "props": {},
        "animation": DEFAULT_ANIMATIONS.get(directive.type, {}).copy(),
    }

    if directive.type == "stickman":
        # [stickman: action_or_pose, expression]
        # action_or_pose can be: pose name, pose action, or loop motion
        action_or_pose = directive.args[0] if directive.args else "standing"
        expression = directive.args[1] if len(directive.args) > 1 else "neutral"

        obj["props"]["color"] = "#FFFFFF"
        obj["props"]["lineWidth"] = 3
        obj["props"]["expression"] = expression

        if action_or_pose in POSE_ACTIONS:
            # Pose transition: enter → hold targetPose → exit
            obj["props"]["pose"] = "standing"
            obj["props"]["targetPose"] = POSE_ACTIONS[action_or_pose]
            obj["props"]["motion"] = "breathing"  # subtle movement while holding pose
            obj["animation"] = {
                "enter": {"type": "poseTransition", "durationMs": 400},
                "exit": {"type": "poseTransition", "durationMs": 300},
            }
        elif action_or_pose in LOOP_MOTIONS:
            # Loop motion: base pose + continuous animation
            obj["props"]["pose"] = "standing"
            obj["props"]["motion"] = action_or_pose
            obj["animation"] = {
                "enter": {"type": "fadeIn", "durationMs": 500},
                "during": {"type": action_or_pose, "loop": True},
            }
        else:
            # Static pose (existing behavior)
            obj["props"]["pose"] = action_or_pose
            obj["props"]["motion"] = "breathing"  # default idle animation

    elif directive.type == "text":
        # [text: "content", style]
        obj["props"]["content"] = directive.args[0] if directive.args else ""
        obj["props"]["fontSize"] = 48
        obj["props"]["fontWeight"] = "bold" if "highlight" in directive.args else "normal"
        obj["props"]["color"] = "#FFD700" if "highlight" in directive.args else "#FFFFFF"
        obj["props"]["align"] = "center"
        obj["props"]["maxWidth"] = 800

    elif directive.type == "counter":
        # [counter: from -> to, format]
        obj["props"]["from"] = int(directive.args[0]) if directive.args else 0
        obj["props"]["to"] = int(directive.args[1]) if len(directive.args) > 1 else 100
        obj["props"]["format"] = directive.args[2] if len(directive.args) > 2 else "number"
        obj["props"]["fontSize"] = 64
        obj["props"]["color"] = "#FFFFFF"

    elif directive.type == "icon":
        # [icon: name]
        obj["props"]["name"] = directive.args[0] if directive.args else "lightbulb"
        obj["props"]["size"] = 80
        obj["props"]["color"] = "#FFFFFF"

    elif directive.type == "shape":
        # [shape: type, color]
        obj["props"]["shape"] = directive.args[0] if directive.args else "arrow"
        obj["props"]["color"] = directive.args[1] if len(directive.args) > 1 else "#FFFFFF"
        obj["props"]["strokeWidth"] = 3
        obj["props"]["fill"] = False

    return obj


def build_scene(
    section_name: str,
    section_index: int,
    directives: list[Directive],
    start_ms: int,
    end_ms: int,
    total_scenes: int = 1,
    theme_name: str = "dark_cool",
    previous_transition: Optional[str] = None,
    use_smart_defaults: bool = True,
    narration: str = "",
) -> dict:
    """Build a single scene from a script section."""
    scene_id = f"scene_{section_index + 1:02d}_{section_name}"

    # Determine layout
    layout_name = determine_layout(directives)

    # Build objects
    objects = []
    type_counters = {}

    for directive in directives:
        # Track count per type for unique IDs
        type_counters[directive.type] = type_counters.get(directive.type, 0) + 1
        count = type_counters[directive.type]

        obj_id = f"{scene_id}_{directive.type}_{count}"
        position = get_position(layout_name, directive.type, count - 1)

        obj = directive_to_object(directive, obj_id, position)

        # Apply smart defaults for stickman
        if use_smart_defaults and obj["type"] == "stickman":
            obj["props"] = enrich_stickman_props(obj["props"])

        # Apply smart defaults for text style
        if use_smart_defaults and obj["type"] == "text":
            text_index = type_counters["text"] - 1
            total_texts = sum(1 for d in directives if d.type == "text")
            content = obj["props"].get("content", "")
            style = auto_select_text_style(text_index, total_texts, content)
            obj["props"]["style"] = style

        objects.append(obj)

    # Apply smart defaults if enabled
    directive_types = [d.type for d in directives]

    if use_smart_defaults:
        smart = enrich_scene(
            scene_index=section_index,
            total_scenes=total_scenes,
            directive_types=directive_types,
            objects=objects,
            theme_name=theme_name,
            previous_transition=previous_transition,
            narration=narration,
        )

        return {
            "id": scene_id,
            "startMs": start_ms,
            "endMs": end_ms,
            "background": smart.background,
            "sceneTemplate": smart.scene_template,
            "camera": smart.camera,
            "transition": {
                "type": smart.transition,
                "durationMs": 300,
            },
            "sfxTriggers": smart.sfx_triggers,
            "objects": objects,
        }
    else:
        # Legacy behavior without smart defaults
        return {
            "id": scene_id,
            "startMs": start_ms,
            "endMs": end_ms,
            "background": DEFAULT_BG_COLOR,
            "transition": {
                "in": "fadeIn",
                "out": "fadeOut",
                "durationMs": 300,
            },
            "objects": objects,
        }


def build_scene_json(
    parsed_script: ParsedScript,
    section_timings: list[tuple[int, int]],
    audio_path: str,
    words_path: str,
    use_smart_defaults: bool = True,
) -> dict:
    """
    Build the complete scene.json from parsed script and timings.

    Args:
        parsed_script: Parsed markdown script
        section_timings: List of (start_ms, end_ms) for each section
        audio_path: Relative path to audio file
        words_path: Relative path to words.json
        use_smart_defaults: Enable Track C-1 smart defaults (default: True)

    Returns:
        Complete scene.json as dictionary
    """
    # Extract theme from frontmatter or use default
    theme_name = parsed_script.meta.get("theme", "dark_cool")
    bgm_mood = parsed_script.meta.get("bgm", None)

    total_scenes = len(parsed_script.sections)
    scenes = []
    previous_transition = None

    for i, section in enumerate(parsed_script.sections):
        if i < len(section_timings):
            start_ms, end_ms = section_timings[i]
        else:
            # Fallback timing
            prev_end = section_timings[-1][1] if section_timings else 0
            start_ms = prev_end
            end_ms = prev_end + 5000  # 5 second default

        scene = build_scene(
            section_name=section.name,
            section_index=i,
            directives=section.directives,
            start_ms=start_ms,
            end_ms=end_ms,
            total_scenes=total_scenes,
            theme_name=theme_name,
            previous_transition=previous_transition,
            use_smart_defaults=use_smart_defaults,
            narration=section.narration,
        )

        # Track transition for variety check
        if "transition" in scene:
            trans = scene["transition"]
            previous_transition = trans.get("type") if isinstance(trans, dict) else trans

        scenes.append(scene)

    # Build meta with optional BGM config
    meta = {
        "title": parsed_script.meta.get("title", "Untitled"),
        "fps": DEFAULT_FPS,
        "width": DEFAULT_WIDTH,
        "height": DEFAULT_HEIGHT,
        "audioSrc": audio_path,
        "theme": theme_name,
    }

    # Add BGM config if specified
    if bgm_mood:
        meta["bgm"] = {
            "src": f"audio/bgm/{bgm_mood}.mp3",
            "volume": 0.3,
            "fadeInMs": 2000,
            "fadeOutMs": 3000,
            "duckingLevel": 0.15,
            "duckingAttackMs": 300,
            "duckingReleaseMs": 500,
        }

    return {
        "meta": meta,
        "subtitles": {
            "src": words_path,
            "style": {
                "fontSize": DEFAULT_SUBTITLE_FONT_SIZE,
                "color": DEFAULT_SUBTITLE_COLOR,
                "position": "bottom",
                "highlightColor": DEFAULT_SUBTITLE_HIGHLIGHT,
            },
        },
        "scenes": scenes,
    }


def save_scene_json(scene_data: dict, output_path: str) -> str:
    """Save scene data to JSON file."""
    import os
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(scene_data, f, ensure_ascii=False, indent=2)

    return output_path


if __name__ == "__main__":
    import sys
    from script_parser import parse_script_file

    if len(sys.argv) > 1:
        script_path = sys.argv[1]

        # Parse script
        parsed = parse_script_file(script_path)
        print(f"Parsed: {len(parsed.sections)} sections")

        # Mock timings (in real use, these come from alignment)
        mock_timings = []
        current_ms = 0
        for section in parsed.sections:
            duration = len(section.narration) * 50  # ~50ms per char estimate
            mock_timings.append((current_ms, current_ms + duration))
            current_ms += duration + 500  # 500ms gap

        # Build scene JSON
        scene_data = build_scene_json(
            parsed_script=parsed,
            section_timings=mock_timings,
            audio_path="audio/tts_output.mp3",
            words_path="subtitles/words.json",
        )

        # Save
        output_path = "scene.json"
        save_scene_json(scene_data, output_path)
        print(f"Scene JSON saved to: {output_path}")

        # Print summary
        print(f"\nGenerated {len(scene_data['scenes'])} scenes:")
        for scene in scene_data['scenes']:
            print(f"  {scene['id']}: {scene['startMs']}ms - {scene['endMs']}ms "
                  f"({len(scene['objects'])} objects)")
    else:
        print("Usage: python scene_builder.py <script.md>")
