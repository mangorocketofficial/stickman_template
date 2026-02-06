"""
Script Parser Level 2 (Track C-2)
Parses simplified markdown with [hint: ...] tags for LLM enrichment.

Input format:
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
theme: dark_cool
bgm: calm_ambient
---

안녕하세요! 오늘은 복리에 대해 알아봅시다.
[hint: 인사]

단리는 원금에만 이자가 붙습니다.
[hint: 설명]

761만원이 됩니다!
[hint: 숫자 강조]

오늘부터 시작하세요!
[hint: 마무리]
```

Output: Converts to standard ParsedScript format for existing pipeline.
"""

import re
from dataclasses import dataclass, field
from typing import Optional

from script_parser import ParsedScript, ScriptSection, Directive
from llm_enrichment import (
    parse_hints,
    enrich_script,
    HintedNarration,
    EnrichedScene,
)


def parse_l2_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML frontmatter from L2 markdown."""
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


def enriched_to_directives(enriched: EnrichedScene) -> list[Directive]:
    """Convert EnrichedScene to list of Directives."""
    directives = []

    # Stickman directive
    stickman_args = [
        enriched.stickman["pose"],
        enriched.stickman["expression"],
    ]
    # Add motion if not breathing (default)
    if enriched.stickman["motion"] != "breathing":
        stickman_args.append(enriched.stickman["motion"])

    directives.append(Directive(type="stickman", args=stickman_args))

    # Other objects
    for obj in enriched.objects:
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


def enriched_to_section(
    enriched: EnrichedScene,
    index: int,
) -> ScriptSection:
    """Convert EnrichedScene to ScriptSection."""
    # Generate section name from template or index
    template = enriched.scene_template
    name_map = {
        "intro_greeting": "intro",
        "intro_hook": "intro",
        "intro_minimal": "intro",
        "explain_default": "explain",
        "explain_formula": "formula",
        "explain_reverse": "explain",
        "explain_two_column": "compare",
        "emphasis_number": "emphasis",
        "emphasis_statement": "emphasis",
        "emphasis_icon_focus": "emphasis",
        "compare_side_by_side": "compare",
        "transition_topic_change": "transition",
        "closing_summary": "conclusion",
        "closing_call_to_action": "conclusion",
    }
    name = name_map.get(template, f"scene{index + 1}")

    # Create directives from enriched data
    directives = enriched_to_directives(enriched)

    return ScriptSection(
        name=name,
        directives=directives,
        narration=enriched.narration,
        narration_lines=[enriched.narration],  # Single line for L2
    )


def parse_l2_script(
    content: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> ParsedScript:
    """
    Parse Level 2 simplified markdown script.

    This format uses [hint: ...] tags instead of explicit directives.
    LLM enriches the narration with visual elements.

    Args:
        content: Markdown content with hints
        provider: LLM provider ("groq" or "anthropic")
        api_key: Optional API key

    Returns:
        ParsedScript compatible with existing pipeline
    """
    # Parse frontmatter
    meta, body = parse_l2_frontmatter(content)

    # Set defaults
    if 'voice' not in meta:
        meta['voice'] = 'ko-KR-HyunsuNeural'
    if 'theme' not in meta:
        meta['theme'] = 'dark_cool'

    # Parse hints
    hinted_narrations = parse_hints(body)

    if not hinted_narrations:
        return ParsedScript(meta=meta, sections=[], full_narration="")

    # Enrich with LLM
    enriched_scenes = enrich_script(
        hinted_narrations,
        provider=provider,
        api_key=api_key,
    )

    # Convert to sections
    sections = []
    for i, enriched in enumerate(enriched_scenes):
        section = enriched_to_section(enriched, i)
        sections.append(section)

    # Collect full narration
    full_narration = ' '.join(hn.text for hn in hinted_narrations)

    return ParsedScript(
        meta=meta,
        sections=sections,
        full_narration=full_narration,
    )


def parse_l2_script_file(
    filepath: str,
    provider: str = "groq",
    api_key: Optional[str] = None,
) -> ParsedScript:
    """
    Parse Level 2 markdown script file.

    Args:
        filepath: Path to the markdown file
        provider: LLM provider
        api_key: Optional API key

    Returns:
        ParsedScript object
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    return parse_l2_script(content, provider, api_key)


# ============================================================================
# ENRICHED SCENE JSON BUILDER
# ============================================================================

def build_enriched_scene_json(
    enriched: EnrichedScene,
    index: int,
    start_ms: int,
    end_ms: int,
    theme_name: str = "dark_cool",
) -> dict:
    """
    Build scene JSON directly from EnrichedScene.

    This preserves all LLM-generated properties.
    """
    scene_id = f"scene_{index + 1:02d}_{enriched.scene_template.split('_')[0]}"

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
            "pose": enriched.stickman["pose"],
            "expression": enriched.stickman["expression"],
            "motion": enriched.stickman["motion"],
        },
        "animation": {
            "enter": {"type": "fadeIn", "durationMs": 500},
            "during": {"type": enriched.stickman["motion"], "loop": True},
        },
    })

    # Other objects
    for i, obj in enumerate(enriched.objects):
        obj_id = f"{scene_id}_{obj['type']}_{i + 1}"

        if obj["type"] == "text":
            objects.append({
                "id": obj_id,
                "type": "text",
                "position": {"x": 1100, "y": 300 + i * 100},
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

    return {
        "id": scene_id,
        "startMs": start_ms,
        "endMs": end_ms,
        "background": "#1a1a2e",  # Will be overridden by smart defaults
        "sceneTemplate": enriched.scene_template,
        "camera": enriched.camera,
        "transition": {
            "type": enriched.transition,
            "durationMs": 300,
        },
        "objects": objects,
        "llmSource": enriched.source,  # Track LLM vs rule source
    }


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    "parse_l2_script",
    "parse_l2_script_file",
    "enriched_to_directives",
    "enriched_to_section",
    "build_enriched_scene_json",
]


if __name__ == "__main__":
    import sys
    import os
    from dotenv import load_dotenv

    load_dotenv()

    if len(sys.argv) > 1:
        filepath = sys.argv[1]
        print(f"Parsing L2 script: {filepath}")

        script = parse_l2_script_file(filepath)

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
        print("Usage: python script_parser_l2.py <script_l2.md>")
