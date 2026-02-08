"""
Script Parser Level 3 (Track C-3)
Full Auto: narration only → complete video.

Input format:
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
---

안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다.
단리는 원금에만 이자가 붙습니다.
하지만 복리는 원금에 이자를 더한 금액에 다시 이자가 붙습니다.
백만원을 연 7%로 30년 투자하면 약 761만원이 됩니다.
오늘부터 시작하세요!
```

No hints, no scene markers - just plain narration text.
LLM handles everything automatically.
"""

import re
from dataclasses import dataclass, field
from typing import Optional

from script_parser import ParsedScript, ScriptSection, Directive
from full_auto import (
    full_auto_compose,
    VideoAnalysis,
    FullAutoScene,
)


def parse_l3_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML frontmatter from L3 markdown."""
    pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        return {}, content

    frontmatter_text = match.group(1)
    body = match.group(2)

    # Simple YAML parsing
    meta = {}
    for line in frontmatter_text.strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            meta[key.strip()] = value.strip()

    return meta, body


def scene_to_directives(scene: FullAutoScene) -> list[Directive]:
    """Convert FullAutoScene to list of Directives."""
    directives = []

    # Stickman
    stickman_args = [
        scene.stickman["pose"],
        scene.stickman["expression"],
    ]
    if scene.stickman["motion"] != "breathing":
        stickman_args.append(scene.stickman["motion"])

    directives.append(Directive(type="stickman", args=stickman_args))

    # Objects
    for obj in scene.objects:
        if obj["type"] == "text":
            directives.append(Directive(
                type="text",
                args=[obj["content"], obj.get("style", "body")],
            ))
        elif obj["type"] == "icon":
            directives.append(Directive(
                type="icon",
                args=[obj["name"]],
            ))
        elif obj["type"] == "counter":
            directives.append(Directive(
                type="counter",
                args=[
                    str(obj.get("from", 0)),
                    str(obj.get("to", 100)),
                    obj.get("format", "number"),
                ],
            ))
        elif obj["type"] == "shape":
            directives.append(Directive(
                type="shape",
                args=[obj.get("shape", "arrow")],
            ))

    return directives


def scene_to_section(scene: FullAutoScene, index: int) -> ScriptSection:
    """Convert FullAutoScene to ScriptSection."""
    # Name based on role
    role_names = {
        "opening": "intro",
        "explanation": "explain",
        "emphasis": "emphasis",
        "comparison": "compare",
        "example": "example",
        "closing": "conclusion",
    }
    name = role_names.get(scene.role, f"scene{index + 1}")

    directives = scene_to_directives(scene)

    return ScriptSection(
        name=name,
        directives=directives,
        narration=scene.narration,
        narration_lines=[scene.narration],
    )


def parse_l3_script(
    content: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> ParsedScript:
    """
    Parse Level 3 full-auto markdown script.

    The body contains only narration text - no hints, no scene markers.
    LLM automatically:
    - Analyzes overall video properties
    - Splits into scenes
    - Composes each scene with visual elements

    Args:
        content: Markdown content (frontmatter + narration)
        provider: LLM provider ("groq" or "anthropic")
        api_key: Optional API key

    Returns:
        ParsedScript compatible with existing pipeline
    """
    # Parse frontmatter
    meta, body = parse_l3_frontmatter(content)

    # Set defaults
    if 'voice' not in meta:
        meta['voice'] = 'ko-KR-HyunsuNeural'

    # Clean narration (remove extra whitespace)
    narration = ' '.join(body.split())

    if not narration.strip():
        return ParsedScript(meta=meta, sections=[], full_narration="")

    # Full auto composition
    analysis, scenes = full_auto_compose(narration, provider, api_key)

    # Override meta with LLM analysis (if not already set)
    if 'theme' not in meta:
        meta['theme'] = analysis.theme
    if 'bgm' not in meta:
        meta['bgm'] = analysis.bgm

    # Convert to sections
    sections = []
    for i, scene in enumerate(scenes):
        section = scene_to_section(scene, i)
        sections.append(section)

    return ParsedScript(
        meta=meta,
        sections=sections,
        full_narration=narration,
    )


def parse_l3_script_file(
    filepath: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> ParsedScript:
    """Parse Level 3 markdown script file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    return parse_l3_script(content, provider, api_key)


# ============================================================================
# DIRECT SCENE JSON BUILDER
# ============================================================================

def build_l3_scene_json(
    scenes: list[FullAutoScene],
    analysis: VideoAnalysis,
    meta: dict,
) -> dict:
    """
    Build scene.json directly from FullAutoScene list.

    Preserves all LLM-generated properties without modification.
    """
    scene_list = []

    # Mock timings (will be replaced by actual audio alignment)
    current_ms = 0
    for i, scene in enumerate(scenes):
        duration = len(scene.narration) * 80  # ~80ms per char
        start_ms = current_ms
        end_ms = current_ms + duration

        scene_id = f"scene_{i + 1:02d}_{scene.role}"

        # Build objects
        objects = []

        # Stickman
        objects.append({
            "id": f"{scene_id}_stickman_1",
            "type": "stickman",
            "position": {"x": 400, "y": 600},
            "props": {
                "color": "#FFFFFF",
                "lineWidth": 3,
                "pose": scene.stickman["pose"],
                "expression": scene.stickman["expression"],
                "motion": scene.stickman["motion"],
            },
            "animation": {
                "enter": {"type": "fadeIn", "durationMs": 500},
                "during": {"type": scene.stickman["motion"], "loop": True},
            },
        })

        # Other objects
        for j, obj in enumerate(scene.objects):
            obj_id = f"{scene_id}_{obj['type']}_{j + 1}"

            if obj["type"] == "text":
                objects.append({
                    "id": obj_id,
                    "type": "text",
                    "position": {"x": 1100, "y": 300 + j * 100},
                    "props": {
                        "content": obj["content"],
                        "fontSize": 48 if obj.get("style") == "title" else 36,
                        "fontWeight": "bold" if obj.get("style") == "title" else "normal",
                        "color": "#FFD700" if obj.get("style") == "title" else "#FFFFFF",
                        "align": "center",
                        "maxWidth": 800,
                        "style": obj.get("style", "body"),
                    },
                    "animation": {"enter": {"type": "fadeInUp", "durationMs": 400}},
                })

            elif obj["type"] == "icon":
                objects.append({
                    "id": obj_id,
                    "type": "icon",
                    "position": {"x": 1100, "y": 500},
                    "props": {
                        "name": obj["name"],
                        "size": 80,
                        "color": "#FFFFFF",
                    },
                    "animation": {"enter": {"type": "popIn", "durationMs": 400}},
                })

            elif obj["type"] == "counter":
                objects.append({
                    "id": obj_id,
                    "type": "counter",
                    "position": {"x": 960, "y": 400},
                    "props": {
                        "from": obj.get("from", 0),
                        "to": obj.get("to", 100),
                        "format": obj.get("format", "number"),
                        "fontSize": 64,
                        "color": "#FFFFFF",
                    },
                    "animation": {"enter": {"type": "fadeIn", "durationMs": 300}},
                })

        scene_list.append({
            "id": scene_id,
            "startMs": start_ms,
            "endMs": end_ms,
            "background": "#1a1a2e",
            "sceneTemplate": scene.scene_template,
            "camera": scene.camera,
            "transition": {
                "type": scene.transition,
                "durationMs": 300,
            },
            "objects": objects,
            "llmSource": scene.source,
        })

        current_ms = end_ms + 500

    # Build meta
    result_meta = {
        "title": meta.get("title", "Untitled"),
        "fps": 30,
        "width": 1920,
        "height": 1080,
        "audioSrc": meta.get("audioSrc", "audio/tts_output.mp3"),
        "theme": analysis.theme,
    }

    # BGM config
    if analysis.bgm:
        result_meta["bgm"] = {
            "src": f"audio/bgm/{analysis.bgm}.mp3",
            "volume": 0.3,
            "fadeInMs": 2000,
            "fadeOutMs": 3000,
            "duckingLevel": 0.15,
            "duckingAttackMs": 300,
            "duckingReleaseMs": 500,
        }

    return {
        "meta": result_meta,
        "subtitles": {
            "src": meta.get("wordsSrc", "subtitles/words.json"),
            "style": {
                "fontSize": 48,
                "color": "#FFFFFF",
                "position": "bottom",
                "highlightColor": "#FFD700",
            },
        },
        "scenes": scene_list,
    }


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    "parse_l3_script",
    "parse_l3_script_file",
    "scene_to_directives",
    "scene_to_section",
    "build_l3_scene_json",
]


if __name__ == "__main__":
    import sys
    import os
    from dotenv import load_dotenv

    load_dotenv()

    if len(sys.argv) > 1:
        filepath = sys.argv[1]
        print(f"Parsing L3 script: {filepath}")

        script = parse_l3_script_file(filepath)

        print(f"\nTitle: {script.meta.get('title', 'Untitled')}")
        print(f"Theme: {script.meta.get('theme')}")
        print(f"BGM: {script.meta.get('bgm', 'None')}")
        print(f"Sections: {len(script.sections)}")

        for section in script.sections:
            print(f"\n  Scene: {section.name}")
            print(f"    Narration: {section.narration[:50]}...")
            print(f"    Directives: {len(section.directives)}")
            for d in section.directives:
                print(f"      [{d.type}]: {d.args}")
    else:
        print("Usage: python script_parser_l3.py <script_l3.md>")
