"""
Whiteboard Prompt Engine
Generates diagram-focused prompts optimized for educational whiteboard style.

Core principles:
1. Concept-centric (not decorative imagery)
2. Diagram types based on scene role
3. Consistent visual language across all scenes
4. Focus on explaining relationships, not objects

v2: LLM batch generation — sends entire script to Groq Llama for
    context-aware, distinct visual descriptions per scene.
"""

from typing import Optional
import os
import re
import json


# Scene role → Diagram type mapping
DIAGRAM_TYPES = {
    "opening": "simple title diagram with main concept in center and branching arrows",
    "explanation": "step-by-step flowchart with numbered boxes and connecting arrows",
    "emphasis": "highlighted key concept box with radiating importance indicators",
    "comparison": "side-by-side comparison chart with dividing line and contrasting elements",
    "example": "worked example with calculation steps and result box",
    "warning": "caution diagram with alert symbol and key points in boxes",
    "closing": "summary mind map connecting all main concepts with lines",
}


# Common educational diagram elements
DIAGRAM_ELEMENTS = {
    "arrow": "directional arrows showing flow or causation",
    "box": "rectangular boxes containing key points",
    "circle": "circular nodes for concepts or items",
    "line": "connecting lines showing relationships",
    "bracket": "grouping brackets for related items",
    "divider": "separating lines for distinct sections",
    "highlight": "emphasis boxes or underlining for important parts",
}


def extract_key_concepts(narration: str) -> list[str]:
    """
    Extract key concepts from narration text.
    Focus on nouns, financial terms, mathematical concepts.
    """
    # Remove common filler words
    stop_words = {'는', '을', '를', '이', '가', '에', '의', '와', '과', '으로', '입니다', '습니다'}

    # Simple tokenization (can be enhanced with NLP)
    words = re.findall(r'[\w]+', narration)

    # Filter and return meaningful words (longer than 2 chars, not in stop words)
    concepts = [w for w in words if len(w) > 2 and w not in stop_words]

    # Return first 3-5 key concepts
    return concepts[:5]


def classify_diagram_complexity(narration_length: int, has_numbers: bool) -> str:
    """Determine diagram complexity level based on content."""
    if has_numbers or narration_length > 100:
        return "detailed"
    elif narration_length > 50:
        return "moderate"
    else:
        return "simple"


def generate_whiteboard_prompt(
    narration: str,
    scene_role: str,
    image_hint: Optional[str] = None,
    previous_concepts: Optional[list[str]] = None,
    directives: Optional[list] = None,
) -> str:
    """
    Generate whiteboard-optimized diagram prompt.

    Args:
        narration: Scene narration text
        scene_role: opening, explanation, emphasis, etc.
        image_hint: User-provided hint (if any)
        previous_concepts: Concepts from previous scenes (for continuity)
        directives: Script directives (for text overlay positioning)

    Returns:
        Diagram-focused prompt for whiteboard style
    """

    # If user provided explicit image_hint, use it but ensure whiteboard compatibility
    if image_hint:
        # Check if hint already mentions diagram/chart/illustration
        if any(word in image_hint.lower() for word in ['diagram', 'chart', 'illustration', 'drawing', 'sketch']):
            return f"Hand-drawn whiteboard {image_hint}, simple black marker on white background"
        else:
            # Convert decorative hint to diagram format
            return f"Hand-drawn diagram illustrating {image_hint}, whiteboard sketch style"

    # Korean keyword → Visual concept mapping
    CONCEPT_MAP = {
        "복리": "compound interest exponential growth curve",
        "단리": "simple interest linear growth bar",
        "눈덩이": "snowball rolling downhill getting bigger",
        "공식": "mathematical formula diagram with boxes and arrows",
        "72의 법칙": "rule of 72 calculation visualization",
        "계산": "step-by-step calculation flow diagram",
        "비교": "side-by-side comparison chart",
        "성장": "upward trending growth arrow",
        "이자": "interest accumulation stacked blocks",
        "투자": "investment growth timeline",
        "원금": "principal amount foundation block",
    }

    # Detect comparison scenarios first (multiple keywords = comparison)
    comparison_pairs = [
        (["단리", "복리"], "side-by-side comparison: left side linear growth line (simple interest), right side exponential curve (compound interest)"),
        (["장점", "단점"], "side-by-side comparison chart with pros and cons"),
        (["전", "후"], "before and after comparison diagram"),
    ]

    visual_concept = None
    for keywords, comparison_visual in comparison_pairs:
        if all(keyword in narration for keyword in keywords):
            visual_concept = comparison_visual
            break

    # If not a comparison, find single concept
    if not visual_concept:
        for korean_keyword, english_visual in CONCEPT_MAP.items():
            if korean_keyword in narration:
                visual_concept = english_visual
                break

    # Fallback to generic based on scene role
    if not visual_concept:
        visual_concept = DIAGRAM_TYPES.get(scene_role, "simple explanatory diagram")

    # Check for text overlays in directives
    blank_area_instruction = ""
    if directives:
        text_overlays = [d.args[0] for d in directives if d.type == 'text' and d.args]
        counter_overlays = [d for d in directives if d.type == 'counter']

        if text_overlays:
            # Reserve top area for text
            blank_area_instruction = ", top 20% of image completely blank white space for title overlay"
        if counter_overlays:
            # Reserve bottom area for counter
            blank_area_instruction += ", bottom 30% blank for number counter display"

    # Construct final prompt with STRONG no-text emphasis
    prompt = (
        f"Educational whiteboard diagram showing {visual_concept}, "
        f"hand-drawn black marker sketch on pure white background"
        f"{blank_area_instruction}, "
        f"CRITICAL REQUIREMENT: zero text, zero letters, zero words, zero numbers anywhere in the image, "
        f"only visual elements like arrows boxes curves and shapes, "
        f"absolutely no written labels or annotations, "
        f"pure visual diagram without any typography"
    )

    return prompt


def _parse_llm_json(raw: str):
    """Parse JSON from LLM response, handling markdown code blocks and mixed text."""
    # Try markdown code block first
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
        return json.loads(raw)

    # Try to find JSON array [...] or object {...} in the text
    for start_char, end_char in [("[", "]"), ("{", "}")]:
        start = raw.find(start_char)
        if start != -1:
            # Find matching closing bracket
            depth = 0
            for i in range(start, len(raw)):
                if raw[i] == start_char:
                    depth += 1
                elif raw[i] == end_char:
                    depth -= 1
                    if depth == 0:
                        return json.loads(raw[start:i+1])

    # Last resort: try the whole string
    return json.loads(raw)


def _get_groq_client():
    """Get Groq client if API key is available."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None
    from groq import Groq
    return Groq(api_key=api_key)


def llm_batch_generate_prompts(sections: list) -> Optional[list[dict]]:
    """
    Send the ENTIRE script to Groq Llama and get distinct visual descriptions
    + diagram position hints for each scene in one API call.

    Returns:
        List of dicts: [{"image": str, "diagram_area": str}, ...]
        Or None if LLM fails.
    """
    client = _get_groq_client()
    if not client:
        print("  [LLM] GROQ_API_KEY not set, falling back to keyword-based prompts")
        return None

    # Build the full script context for LLM
    scene_list = []
    for i, section in enumerate(sections):
        directives_str = ""
        for d in section.directives:
            if d.type == "text":
                directives_str += f'  [text overlay: "{d.args[0]}"]\n'
            elif d.type == "counter":
                directives_str += f'  [counter overlay: {d.args}]\n'

        scene_list.append(
            f"Scene {i+1} ({section.name}):\n"
            f"  Narration: {section.narration}\n"
            f"{directives_str}"
        )

    scenes_text = "\n".join(scene_list)

    system_prompt = """You are an expert at designing visual backgrounds for educational YouTube videos.

Given a full video script with multiple scenes, design a UNIQUE visual background image for each scene.
Text and numbers will be added separately in post-production, so the images must contain ZERO text.

CRITICAL RULES:
1. Each image MUST be VISUALLY DIFFERENT — different composition, chart style, color scheme, visual metaphor
2. ABSOLUTELY NO text, numbers, letters, words, labels, annotations, or typography of any kind
3. Focus on: charts, graphs, curves, arrows, shapes, icons, visual metaphors, color gradients, patterns
4. Each image should visually represent the CONCEPT of the scene through shapes and composition alone
5. Keep 2-3 sentences per description with RICH visual detail (multiple elements, not just one shape)
6. Think about the narrative flow: intro=simple/inviting, middle=detailed/informative, closing=inspiring/complete
7. Leave generous whitespace for text overlays — top 15% and bottom 20% should be relatively clean
8. Use a consistent color palette: white background, blue/green/gold accents, clean modern aesthetic

VISUAL ELEMENT TYPES to use:
- Line charts: smooth curves, exponential growth lines, trend lines (no axis labels)
- Bar charts: ascending/descending bars with different heights and colors (no numbers)
- Comparison layouts: split view with contrasting visual elements left vs right
- Flowcharts: connected shapes with arrows showing process flow (no text in boxes)
- Icons/symbols: dollar signs, arrows, lightbulbs, gears, growth symbols
- Abstract patterns: concentric circles, radiating lines, stacked layers
- Visual metaphors: snowball getting bigger, staircase going up, tree growing

GOOD examples:
- {"image": "Clean white background with a single elegant exponential growth curve sweeping from bottom-left to top-right in deep blue. Below it, a faint straight diagonal line in light gray for contrast. Subtle grid pattern in the background. Small golden sparkle accents near the top of the curve."}
- {"image": "Split composition with vertical dividing line. Left side: three flat horizontal blue bars of equal length. Right side: five green bars increasing dramatically in height from left to right, the tallest reaching near the top. Clean white background with subtle shadow under each bar."}
- {"image": "Central circular icon of a snowball with motion lines trailing behind it, rolling down a gentle slope from left to right. The snowball gets progressively larger shown as 4 overlapping circles increasing in size. Light blue background gradient at bottom suggesting a hill. Clean and minimal."}

BAD examples (DO NOT):
- "A chart showing 7% interest rate" (contains numbers!)
- "A slide with 'Compound Interest' heading" (contains text!)
- "An educational diagram" (too vague, no visual detail!)

Output format: Return ONLY a JSON array of objects:
[{"image": "detailed visual description"}, ...]
"""

    user_prompt = f"""Here is the full video script ({len(sections)} scenes):

{scenes_text}

Design {len(sections)} UNIQUE visual background images.
- ZERO text, numbers, or letters — only visual elements like charts, curves, shapes, icons
- Each image is visually distinct (different composition, chart type, color emphasis)
- Rich detail: multiple visual elements per image, not just a single shape
- Leave whitespace at top and bottom for text overlays added later
- Return as JSON array of {len(sections)} objects with "image" key"""

    try:
        print(f"  [LLM] Sending {len(sections)} scenes to Groq Llama...")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=3000,
        )

        raw = response.choices[0].message.content.strip()
        print(f"  [LLM] Response received ({len(raw)} chars)")

        results = _parse_llm_json(raw)

        if not isinstance(results, list) or len(results) != len(sections):
            print(f"  [LLM] Expected {len(sections)} items, got {len(results) if isinstance(results, list) else 'non-list'}")
            return None

        # Normalize: accept both string and dict formats
        normalized = []
        for i, item in enumerate(results):
            if isinstance(item, str):
                normalized.append({"image": item, "diagram_area": "center"})
            elif isinstance(item, dict):
                normalized.append({
                    "image": item.get("image", "simple diagram"),
                    "diagram_area": item.get("diagram_area", "center"),
                })
            else:
                normalized.append({"image": str(item), "diagram_area": "center"})
            print(f"  [LLM] Scene {i+1} [{normalized[-1]['diagram_area']}]: {normalized[-1]['image'][:70]}...")

        return normalized

    except json.JSONDecodeError as e:
        print(f"  [LLM] Failed to parse JSON response: {e}")
        print(f"  [LLM] Raw response: {raw[:200]}")
        return None
    except Exception as e:
        print(f"  [LLM] Groq API error: {e}")
        return None


def vision_analyze_overlay_positions(
    image_paths: list[str],
    overlay_infos: list[list[dict]],
) -> Optional[list[list[dict]]]:
    """
    Step 3: Send generated images to Groq Llama Vision to analyze
    where diagram elements are, and decide optimal overlay positions.

    Args:
        image_paths: List of image file paths (one per scene)
        overlay_infos: For each scene, list of overlays needing placement:
            [{"type": "text", "content": "복리의 마법", "role": "title"}, ...]

    Returns:
        For each scene, list of adjusted overlays with x,y positions:
            [{"type": "text", "content": "...", "x": 480, "y": 120}, ...]
        Or None if Vision LLM fails.
    """
    client = _get_groq_client()
    if not client:
        print("  [Vision] GROQ_API_KEY not set, skipping vision analysis")
        return None

    import base64

    adjusted_all = []

    for scene_idx, (img_path, overlays) in enumerate(zip(image_paths, overlay_infos)):
        if not overlays or not os.path.exists(img_path):
            adjusted_all.append(overlays)
            continue

        # Read and encode image
        with open(img_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode("utf-8")

        # Build overlay description for LLM
        overlay_desc = []
        for ov in overlays:
            if ov["type"] == "text":
                overlay_desc.append(f'Text overlay: "{ov["content"]}" (role: {ov.get("role", "body")})')
            elif ov["type"] == "counter":
                overlay_desc.append(f'Counter overlay: {ov.get("from", 0)} → {ov.get("to", 100)}')

        overlay_text = "\n".join(overlay_desc)

        prompt = f"""Image is 1920x1080. Place these overlays in EMPTY white space (no overlap with diagram):
{overlay_text}

Reply with ONLY this JSON, nothing else:
[{{"type": "text", "x": 960, "y": 150}}]

x range: 200-1720, y range: 100-980. Place text at top empty area, counter at bottom empty area."""

        try:
            response = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}},
                            {"type": "text", "text": prompt},
                        ],
                    }
                ],
                temperature=0.3,
                max_tokens=500,
            )

            raw = response.choices[0].message.content.strip()
            positions = _parse_llm_json(raw)

            if isinstance(positions, list) and len(positions) == len(overlays):
                adjusted = []
                for ov, pos in zip(overlays, positions):
                    merged = {**ov}
                    merged["x"] = int(pos.get("x", 960))
                    merged["y"] = int(pos.get("y", 350))
                    # Clamp to safe area
                    merged["x"] = max(200, min(1720, merged["x"]))
                    merged["y"] = max(100, min(980, merged["y"]))
                    adjusted.append(merged)
                adjusted_all.append(adjusted)
                print(f"  [Vision] Scene {scene_idx+1}: {', '.join(f'{a['type']}→({a['x']},{a['y']})' for a in adjusted)}")
            else:
                print(f"  [Vision] Scene {scene_idx+1}: unexpected format, using defaults")
                adjusted_all.append(overlays)

        except Exception as e:
            print(f"  [Vision] Scene {scene_idx+1} failed: {e}")
            adjusted_all.append(overlays)

    return adjusted_all
