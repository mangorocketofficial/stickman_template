"""
Script Parser Module (v2)
Parses markdown scripts with YAML frontmatter and scene directives.

v2 changes:
- Added [image_hint:] directive for AI image generation
- Removed [stickman:], [icon:], [shape:] directives
- Added style, image_model to frontmatter
"""

import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Directive:
    """A parsed directive from [type: args] syntax."""
    type: str  # text, counter, image_hint
    args: list[str]


@dataclass
class ScriptSection:
    """A single scene section from the script."""
    name: str
    directives: list[Directive] = field(default_factory=list)
    narration: str = ""  # Full narration (for TTS)
    narration_lines: list[str] = field(default_factory=list)  # Per-line subtitles


@dataclass
class ParsedScript:
    """Complete parsed script with metadata and sections."""
    meta: dict
    sections: list[ScriptSection]
    full_narration: str


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML frontmatter from markdown content."""
    pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        return {}, content

    frontmatter_text = match.group(1)
    body = match.group(2)

    # Simple YAML parsing (key: value pairs)
    meta = {}
    for line in frontmatter_text.strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            value = value.strip()
            # Strip inline comments
            if '#' in value:
                value = value[:value.index('#')].strip()
            meta[key.strip()] = value

    return meta, body


def parse_directive(directive_str: str) -> Optional[Directive]:
    """Parse a single directive like [text: "content", style] or [image_hint: description]."""
    # Match [type: arg1, arg2, ...] or [type: free text]
    pattern = r'\[(\w+):\s*(.+?)\]'
    match = re.match(pattern, directive_str.strip())

    if not match:
        return None

    directive_type = match.group(1)
    args_str = match.group(2)

    # v2: Skip removed directive types
    if directive_type in ('stickman', 'icon', 'shape'):
        return None

    # v2: image_hint takes the entire string as one arg
    if directive_type == 'image_hint':
        return Directive(type='image_hint', args=[args_str.strip()])

    # Special handling for counter format: 1000 -> 2000, format
    if directive_type == 'counter':
        counter_pattern = r'(\d+)\s*->\s*(\d+)(?:,\s*(\w+))?'
        counter_match = re.match(counter_pattern, args_str)
        if counter_match:
            args = [counter_match.group(1), counter_match.group(2)]
            if counter_match.group(3):
                args.append(counter_match.group(3))
            return Directive(type='counter', args=args)

    # Regular comma-separated args, handling quoted strings
    args = []
    current_arg = ""
    in_quotes = False

    for char in args_str:
        if char == '"':
            in_quotes = not in_quotes
        elif char == ',' and not in_quotes:
            args.append(current_arg.strip().strip('"'))
            current_arg = ""
        else:
            current_arg += char

    if current_arg:
        args.append(current_arg.strip().strip('"'))

    return Directive(type=directive_type, args=args)


def parse_section(section_text: str) -> Optional[ScriptSection]:
    """Parse a single scene section."""
    lines = section_text.strip().split('\n')

    if not lines:
        return None

    # First line should be ## scene: name
    header_pattern = r'^##\s*scene:\s*(\w+)'
    header_match = re.match(header_pattern, lines[0])

    if not header_match:
        return None

    section_name = header_match.group(1)
    directives = []
    narration_lines = []

    for line in lines[1:]:
        line = line.strip()
        if not line:
            continue

        # Check if it's a directive [type: ...]
        if line.startswith('[') and ']' in line:
            directive = parse_directive(line)
            if directive:
                directives.append(directive)
        else:
            # It's narration text
            narration_lines.append(line)

    # Full narration for TTS (joined with space)
    narration = ' '.join(narration_lines)

    return ScriptSection(
        name=section_name,
        directives=directives,
        narration=narration,
        narration_lines=narration_lines,
    )


def parse_script(content: str) -> ParsedScript:
    """Parse a complete markdown script."""
    meta, body = parse_frontmatter(content)

    # Set defaults
    if 'voice' not in meta:
        meta['voice'] = 'ko-KR-HyunsuNeural'
    if 'style' not in meta:
        meta['style'] = 'dark_infographic'
    if 'image_model' not in meta:
        meta['image_model'] = 'flux-schnell'

    # Split into sections by ## scene:
    section_pattern = r'(##\s*scene:.*?)(?=##\s*scene:|$)'
    section_matches = re.findall(section_pattern, body, re.DOTALL)

    sections = []
    all_narrations = []

    for section_text in section_matches:
        section = parse_section(section_text)
        if section:
            sections.append(section)
            if section.narration:
                all_narrations.append(section.narration)

    full_narration = ' '.join(all_narrations)

    return ParsedScript(
        meta=meta,
        sections=sections,
        full_narration=full_narration
    )


def parse_script_file(filepath: str) -> ParsedScript:
    """Parse a markdown script file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    return parse_script(content)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        script = parse_script_file(sys.argv[1])
        print(f"Title: {script.meta.get('title', 'Untitled')}")
        print(f"Voice: {script.meta.get('voice')}")
        print(f"Style: {script.meta.get('style')}")
        print(f"Image Model: {script.meta.get('image_model')}")
        print(f"Sections: {len(script.sections)}")
        for section in script.sections:
            print(f"\n  Scene: {section.name}")
            print(f"    Directives: {len(section.directives)}")
            for d in section.directives:
                print(f"      [{d.type}]: {d.args}")
            print(f"    Narration: {section.narration[:80]}...")
        print(f"\nFull narration length: {len(script.full_narration)} chars")
    else:
        print("Usage: python script_parser.py <script.md>")
