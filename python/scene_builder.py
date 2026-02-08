"""
Scene Builder Module (v2)
Converts parsed script, alignment data, and generated images into scene.json v2.

v2: Replaces StickMan objects with AI-generated image backgrounds.
"""

import json
import os
from typing import Optional

from script_parser import ParsedScript, Directive
from image_generator import GeneratedImage

# Default values
DEFAULT_FPS = 30
DEFAULT_WIDTH = 1920
DEFAULT_HEIGHT = 1080
DEFAULT_SUBTITLE_FONT_SIZE = 48
DEFAULT_SUBTITLE_COLOR = "#FFFFFF"
DEFAULT_SUBTITLE_HIGHLIGHT = "#FFD700"

# Ken Burns animation rotation for variety
IMAGE_ANIMATIONS = ["kenBurns", "zoomIn", "zoomOut", "panLeft", "panRight"]


def directive_to_overlay(directive: Directive, overlay_id: str) -> Optional[dict]:
    """Convert a directive to a v2 scene overlay."""
    if directive.type == "text":
        content = directive.args[0] if directive.args else ""
        is_title = "title" in directive.args
        is_highlight = "highlight" in directive.args

        return {
            "id": overlay_id,
            "type": "text",
            "position": {"x": 960, "y": 250 if is_title else 350},
            "props": {
                "content": content,
                "fontSize": 64 if is_title else 48,
                "fontWeight": "bold",
                "color": "#FFD700" if is_highlight else "#FFFFFF",
                "align": "center",
                "maxWidth": 1200,
                "role": "title" if is_title else ("highlight_box" if is_highlight else "body"),
                "background": {
                    "color": "rgba(0,0,0,0.5)",
                    "padding": 20,
                    "borderRadius": 12,
                    "opacity": 0.7,
                } if not is_title else None,
            },
            "animation": {
                "enter": {"type": "fadeInUp", "durationMs": 500},
            },
        }

    elif directive.type == "counter":
        from_val = int(directive.args[0]) if directive.args else 0
        to_val = int(directive.args[1]) if len(directive.args) > 1 else 100
        fmt = directive.args[2] if len(directive.args) > 2 else "number"

        return {
            "id": overlay_id,
            "type": "counter",
            "position": {"x": 960, "y": 500},
            "props": {
                "from": from_val,
                "to": to_val,
                "format": fmt,
                "fontSize": 72,
                "color": "#FFD700",
            },
            "animation": {
                "enter": {"type": "fadeIn", "durationMs": 300},
            },
        }

    return None


def build_scene_v2(
    section_name: str,
    section_index: int,
    directives: list[Directive],
    start_ms: int,
    end_ms: int,
    image_result: Optional[GeneratedImage] = None,
    total_scenes: int = 1,
) -> dict:
    """Build a single v2 scene with image background and overlays."""
    scene_id = f"scene_{section_index + 1:02d}_{section_name}"

    # Background: image or fallback color
    if image_result and image_result.success:
        animation = IMAGE_ANIMATIONS[section_index % len(IMAGE_ANIMATIONS)]
        background = {
            "type": "image",
            "src": image_result.image_path,
            "animation": animation,
            "animationIntensity": 0.5,
        }
    else:
        background = {
            "type": "color",
            "value": "#1a1a2e",
        }

    # Build overlays from directives (text, counter only)
    overlays = []
    type_counters = {}

    for directive in directives:
        if directive.type in ('text', 'counter'):
            type_counters[directive.type] = type_counters.get(directive.type, 0) + 1
            count = type_counters[directive.type]
            overlay_id = f"{scene_id}_{directive.type}_{count}"
            overlay = directive_to_overlay(directive, overlay_id)
            if overlay:
                overlays.append(overlay)

    # Transition
    if section_index == 0:
        transition = {"in": "fadeIn", "durationMs": 500}
    else:
        transition = {"in": "fadeIn", "out": "fadeOut", "durationMs": 300}

    scene = {
        "id": scene_id,
        "startMs": start_ms,
        "endMs": end_ms,
        "background": background,
        "transition": transition,
        "objects": [],  # v1 compat: empty objects array
        "overlays": overlays,
    }

    return scene


def build_scene_json_v2(
    parsed_script: ParsedScript,
    section_timings: list[tuple[int, int]],
    image_results: list[GeneratedImage],
    audio_path: str,
    words_path: str,
) -> dict:
    """
    Build the complete v2 scene.json.

    Args:
        parsed_script: Parsed markdown script
        section_timings: List of (start_ms, end_ms) for each section
        image_results: List of GeneratedImage results
        audio_path: Relative path to audio file
        words_path: Relative path to words.json

    Returns:
        Complete scene.json as dictionary (v2 schema)
    """
    total_scenes = len(parsed_script.sections)
    scenes = []

    for i, section in enumerate(parsed_script.sections):
        if i < len(section_timings):
            start_ms, end_ms = section_timings[i]
        else:
            prev_end = section_timings[-1][1] if section_timings else 0
            start_ms = prev_end
            end_ms = prev_end + 5000

        image_result = image_results[i] if i < len(image_results) else None

        scene = build_scene_v2(
            section_name=section.name,
            section_index=i,
            directives=section.directives,
            start_ms=start_ms,
            end_ms=end_ms,
            image_result=image_result,
            total_scenes=total_scenes,
        )
        scenes.append(scene)

    style = parsed_script.meta.get("style", "dark_infographic")

    return {
        "meta": {
            "title": parsed_script.meta.get("title", "Untitled"),
            "fps": DEFAULT_FPS,
            "width": DEFAULT_WIDTH,
            "height": DEFAULT_HEIGHT,
            "audioSrc": audio_path,
            "style": style,
        },
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
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(scene_data, f, ensure_ascii=False, indent=2)

    return output_path
