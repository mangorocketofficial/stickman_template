"""
Scene Builder Module (v3)
Converts parsed script, alignment data, and generated images into scene.json.

v2.1: Mixed rendering — AI images for key scenes, whiteboard+stickman for the rest.
v3: Whiteboard scenes use centered keyword + description layout with
    typing/handwriting/highlight effects (matching previous whiteboard pipeline).
"""

import json
import os
from typing import Optional

from script_parser import ParsedScript, Directive
from image_generator import GeneratedImage
from stickman_assigner import StickmanAssignment
from whiteboard_text_generator import WhiteboardText

# Default values
DEFAULT_FPS = 30
DEFAULT_WIDTH = 1920
DEFAULT_HEIGHT = 1080
DEFAULT_SUBTITLE_FONT_SIZE = 48
DEFAULT_SUBTITLE_COLOR = "#FFFFFF"
DEFAULT_SUBTITLE_HIGHLIGHT = "#FFD700"

# Ken Burns animation rotation for variety
IMAGE_ANIMATIONS = ["kenBurns", "zoomIn", "zoomOut", "panLeft", "panRight"]

# =============================================================================
# WHITEBOARD LAYOUT CONSTANTS
# =============================================================================

# Centered layout positions (matching previous whiteboard pipeline)
KEYWORD_ONLY_POS = {"keyword": {"x": 960, "y": 450}}
KEYWORD_DESC_POS = {
    "keyword": {"x": 960, "y": 370},
    "description": {"x": 960, "y": 550},
}

# Stickman alternates left/right for variety
STICKMAN_POSITIONS = [
    {"x": 1550, "y": 680},   # right
    {"x": 370, "y": 680},    # left
]

# Animation presets for keyword_style
ANIMATION_PRESETS = {
    "typing": {
        "enter": {"type": "typing", "durationMs": 1500},
    },
    "handwriting": {
        "enter": {"type": "handwriting", "durationMs": 2000},
    },
    "highlight": {
        "enter": {"type": "fadeIn", "durationMs": 400},
        "during": {"type": "highlightSweep", "durationMs": 800},
    },
}

# Text colors
KEYWORD_COLOR = "#1A1A2E"
DESCRIPTION_COLOR = "#444444"
HIGHLIGHT_BG_COLOR = "#FFE082"


def directive_to_overlay(
    directive: Directive,
    overlay_id: str,
    style: str = "dark_infographic",
    position_override: Optional[dict] = None,
) -> Optional[dict]:
    """Convert a directive to a v2 scene overlay."""
    if directive.type == "text":
        content = directive.args[0] if directive.args else ""
        is_title = "title" in directive.args
        is_highlight = "highlight" in directive.args

        if style == "whiteboard":
            text_color = "#0066CC" if is_highlight else "#000000"
            bg_color = "rgba(255,255,255,0.9)" if is_highlight else None
        else:
            text_color = "#FFD700" if is_highlight else "#FFFFFF"
            bg_color = "rgba(0,0,0,0.5)"

        default_x, default_y = 960, (250 if is_title else 350)
        pos_x = position_override.get("x", default_x) if position_override else default_x
        pos_y = position_override.get("y", default_y) if position_override else default_y

        return {
            "id": overlay_id,
            "type": "text",
            "position": {"x": pos_x, "y": pos_y},
            "props": {
                "content": content,
                "fontSize": 64 if is_title else 48,
                "fontWeight": "bold",
                "color": text_color,
                "align": "center",
                "maxWidth": 1200,
                "role": "title" if is_title else ("highlight_box" if is_highlight else "body"),
                "background": {
                    "color": bg_color,
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

        default_x, default_y = 960, 500
        pos_x = position_override.get("x", default_x) if position_override else default_x
        pos_y = position_override.get("y", default_y) if position_override else default_y

        return {
            "id": overlay_id,
            "type": "counter",
            "position": {"x": pos_x, "y": pos_y},
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
    style: str = "dark_infographic",
    vision_positions: Optional[list[dict]] = None,
    stickman_assignment: Optional[StickmanAssignment] = None,
    whiteboard_text: Optional[WhiteboardText] = None,
) -> dict:
    """Build a single scene — image background OR whiteboard+stickman.

    Whiteboard scenes use centered keyword + description layout with
    typing/handwriting/highlight effects. Stickman alternates left/right.
    """
    scene_id = f"scene_{section_index + 1:02d}_{section_name}"
    is_whiteboard = stickman_assignment is not None
    scene_duration_ms = end_ms - start_ms

    # Background: image or whiteboard color
    if image_result and image_result.success and not is_whiteboard:
        animation = IMAGE_ANIMATIONS[section_index % len(IMAGE_ANIMATIONS)]
        background = {
            "type": "image",
            "src": image_result.image_path,
            "animation": animation,
            "animationIntensity": 0.5,
        }
    else:
        fallback_color = "#FAFAFA" if style == "whiteboard" else "#1a1a2e"
        background = {
            "type": "color",
            "value": fallback_color,
        }

    # Build overlays from directives (for image scenes only)
    overlays = []
    if not is_whiteboard:
        type_counters = {}
        for directive in directives:
            if directive.type in ('text', 'counter'):
                type_counters[directive.type] = type_counters.get(directive.type, 0) + 1
                count = type_counters[directive.type]
                overlay_id = f"{scene_id}_{directive.type}_{count}"
                overlay = directive_to_overlay(directive, overlay_id, style=style)
                if overlay:
                    overlays.append(overlay)

    # Objects: whiteboard scenes get keyword + description text + stickman
    objects = []
    if is_whiteboard:
        sm = stickman_assignment
        wb = whiteboard_text

        # Keyword style and animation
        keyword_style = wb.keyword_style if wb else "typing"
        anim_preset = ANIMATION_PRESETS.get(keyword_style, ANIMATION_PRESETS["typing"])

        # Scale animation duration to scene length
        keyword_anim = {}
        if "enter" in anim_preset:
            enter = dict(anim_preset["enter"])
            if enter.get("durationMs", 0) > scene_duration_ms * 0.6:
                enter["durationMs"] = int(scene_duration_ms * 0.5)
            keyword_anim["enter"] = enter
        if "during" in anim_preset:
            keyword_anim["during"] = dict(anim_preset["during"])

        has_description = wb and bool(wb.description.strip()) if wb else False
        layout = KEYWORD_DESC_POS if has_description else KEYWORD_ONLY_POS
        keyword_pos = layout["keyword"]

        # Keyword text object (large, centered)
        keyword_content = wb.keyword if wb else section_name
        objects.append({
            "id": f"{scene_id}_keyword",
            "type": "text",
            "position": keyword_pos,
            "props": {
                "content": keyword_content,
                "fontSize": 72,
                "fontWeight": "bold",
                "color": KEYWORD_COLOR,
                "align": "center",
                "maxWidth": 1400,
            },
            "animation": keyword_anim,
        })

        # Description text object (smaller, below keyword, delayed)
        if has_description:
            desc_pos = layout["description"]
            # Delay description until ~30% into scene (synced to speech)
            desc_delay_ms = int(scene_duration_ms * 0.3)

            desc_anim = {
                "enter": {"type": "typing", "durationMs": 1000, "delayMs": desc_delay_ms},
            }
            # For highlight style: description also gets highlightSweep
            if keyword_style == "highlight":
                desc_anim["during"] = {
                    "type": "highlightSweep",
                    "durationMs": 800,
                }
                # Add highlight background color
                objects.append({
                    "id": f"{scene_id}_description",
                    "type": "text",
                    "position": desc_pos,
                    "layer": 2,
                    "props": {
                        "content": wb.description,
                        "fontSize": 36,
                        "fontWeight": "normal",
                        "color": DESCRIPTION_COLOR,
                        "align": "center",
                        "maxWidth": 1200,
                        "background": {
                            "color": HIGHLIGHT_BG_COLOR,
                        },
                    },
                    "animation": desc_anim,
                })
            else:
                objects.append({
                    "id": f"{scene_id}_description",
                    "type": "text",
                    "position": desc_pos,
                    "layer": 2,
                    "props": {
                        "content": wb.description,
                        "fontSize": 36,
                        "fontWeight": "normal",
                        "color": DESCRIPTION_COLOR,
                        "align": "center",
                        "maxWidth": 1200,
                    },
                    "animation": desc_anim,
                })

        # Stickman object (alternates left/right)
        stickman_pos = STICKMAN_POSITIONS[section_index % len(STICKMAN_POSITIONS)]
        objects.append({
            "id": f"{scene_id}_stickman",
            "type": "stickman",
            "position": stickman_pos,
            "scale": 1.2,
            "layer": 3,
            "props": {
                "pose": sm.pose,
                "expression": sm.expression,
                "color": sm.color,
                "faceColor": "#FFFFFF",
                "lineWidth": 3,
            },
            "animation": {
                "enter": {"type": "fadeIn", "durationMs": 500, "delayMs": 200},
                "during": {"type": sm.motion, "loop": True},
            },
        })

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
        "objects": objects,
        "overlays": overlays,
    }

    return scene


def build_scene_json_v2(
    parsed_script: ParsedScript,
    section_timings: list[tuple[int, int]],
    image_results: list[GeneratedImage],
    audio_path: str,
    words_path: str,
    all_vision_positions: Optional[list[list[dict]]] = None,
    stickman_assignments: Optional[dict[int, StickmanAssignment]] = None,
    whiteboard_texts: Optional[dict[int, WhiteboardText]] = None,
) -> dict:
    """Build the complete scene.json with mixed rendering."""
    total_scenes = len(parsed_script.sections)
    scenes = []
    style = parsed_script.meta.get("style", "dark_infographic")

    for i, section in enumerate(parsed_script.sections):
        if i < len(section_timings):
            start_ms, end_ms = section_timings[i]
        else:
            prev_end = section_timings[-1][1] if section_timings else 0
            start_ms = prev_end
            end_ms = prev_end + 5000

        image_result = image_results[i] if i < len(image_results) else None
        vision_positions = all_vision_positions[i] if all_vision_positions and i < len(all_vision_positions) else None
        stickman = stickman_assignments.get(i) if stickman_assignments else None
        wb_text = whiteboard_texts.get(i) if whiteboard_texts else None

        scene = build_scene_v2(
            section_name=section.name,
            section_index=i,
            directives=section.directives,
            start_ms=start_ms,
            end_ms=end_ms,
            image_result=image_result,
            total_scenes=total_scenes,
            style=style,
            vision_positions=vision_positions,
            stickman_assignment=stickman,
            whiteboard_text=wb_text,
        )
        scenes.append(scene)

    subtitle_color = DEFAULT_SUBTITLE_COLOR
    subtitle_highlight = "#0066CC" if style == "whiteboard" else DEFAULT_SUBTITLE_HIGHLIGHT

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
                "color": subtitle_color,
                "position": "bottom",
                "highlightColor": subtitle_highlight,
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
