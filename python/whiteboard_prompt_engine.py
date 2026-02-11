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


LLM_SYSTEM_PROMPT = """You are an expert at designing character-driven educational infographic illustrations.

Given a video script with multiple scenes, design a UNIQUE illustration for each scene featuring a friendly character.

STYLE: Flat line art with friendly human characters, soft pastel colors, clean and warm.
Think: nanobanana infographics, Kurzgesagt-lite, friendly explainer illustrations.

CRITICAL RULES:
1. Every scene MUST have a friendly human character or cute figure PERFORMING AN ACTION related to the concept
2. Each scene MUST be VISUALLY DIFFERENT — different character pose, different props, different composition
3. ABSOLUTELY NO text, numbers, letters, words, or labels of any kind
4. Describe the character's ACTION clearly: pointing at, holding, standing beside, looking at, etc.
5. Include supporting visual elements: charts, objects, icons, props that the character interacts with
6. Use soft pastel colors: light blue, peach, mint green, lavender, warm cream backgrounds
7. Keep descriptions to 2-3 sentences with specific visual details
8. Leave top 15% and bottom 20% relatively clean for text overlays added later

CHARACTER ACTIONS to use:
- Pointing at / presenting a chart or graph
- Holding or carrying objects (coins, magnifying glass, calculator)
- Standing next to a growing bar chart or ascending staircase
- Looking through a telescope or magnifying glass (discovery)
- Watering a growing plant or tree (growth metaphor)
- Balancing on a seesaw or scale (comparison)
- Climbing stairs or a mountain (progress)
- Celebrating with arms up (achievement/conclusion)

Keep each description under 60 words. Be concise but specific.

GOOD examples:
- {"image": "Friendly character standing left, pointing at exponential curve sweeping upward right. Soft mint green background. Sparkle effects near curve top. Character smiles excitedly."}
- {"image": "Two characters back-to-back center. Left holds small coin stack, right holds tall growing coin tower. Soft peach background with dividing line. Upward arrows on right side."}
- {"image": "Cheerful character pushing small snowball bottom-left up gentle hill. Snowball path shows 4 circles increasing in size going right. Soft lavender background with motion lines."}

BAD examples (DO NOT):
- "A chart showing 7% interest rate" (no character! and contains numbers!)
- "A person standing" (no action! no context! too vague!)
- "An infographic about compound interest" (no visual detail!)

Output format: Return ONLY a JSON array of objects:
[{"image": "detailed illustration description with character action"}, ...]
"""


def _build_scene_list_text(sections: list, start_index: int = 0) -> str:
    """Build formatted scene list text for LLM prompt."""
    scene_list = []
    for i, section in enumerate(sections):
        directives_str = ""
        for d in section.directives:
            if d.type == "text":
                directives_str += f'  [text overlay: "{d.args[0]}"]\n'
            elif d.type == "counter":
                directives_str += f'  [counter overlay: {d.args}]\n'

        scene_list.append(
            f"Scene {start_index + i + 1} ({section.name}):\n"
            f"  Narration: {section.narration[:200]}\n"
            f"{directives_str}"
        )

    return "\n".join(scene_list)


def _llm_generate_one_batch(
    client,
    batch_sections: list,
    batch_start_index: int,
) -> Optional[list[dict]]:
    """Send one batch of scenes to LLM and parse results."""
    scenes_text = _build_scene_list_text(batch_sections, batch_start_index)
    batch_size = len(batch_sections)

    user_prompt = f"""Here are {batch_size} video scenes (batch starting at scene {batch_start_index + 1}):

{scenes_text}

Design {batch_size} UNIQUE character-driven illustrations.
- Every scene has a friendly character DOING something related to the concept
- ZERO text, numbers, or letters anywhere
- Flat line art style, soft pastel colors, warm and friendly
- Each illustration is visually distinct (different pose, props, composition)
- Return as JSON array of exactly {batch_size} objects with "image" key
- IMPORTANT: Keep each description under 40 words to avoid truncation"""

    try:
        # Scale max_tokens with batch size (generous to avoid truncation)
        max_tokens = min(8000, 500 * batch_size)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": LLM_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=max_tokens,
        )

        raw = response.choices[0].message.content.strip()
        results = _parse_llm_json(raw)

        if not isinstance(results, list) or len(results) != batch_size:
            print(f"  [LLM] Batch: expected {batch_size} items, "
                  f"got {len(results) if isinstance(results, list) else 'non-list'}")
            return None

        # Normalize
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

            global_idx = batch_start_index + i + 1
            print(f"  [LLM] Scene {global_idx}: {normalized[-1]['image'][:70]}...")

        return normalized

    except json.JSONDecodeError as e:
        print(f"  [LLM] Batch {batch_start_index+1}: JSON parse failed: {e}")
        return None
    except Exception as e:
        print(f"  [LLM] Batch {batch_start_index+1}: API error: {e}")
        return None


def _llm_generate_single_scene(
    client,
    section,
    scene_index: int,
) -> Optional[dict]:
    """Generate LLM prompt for a single scene (used as fallback when batch fails)."""
    narration_preview = section.narration[:200]
    directives_str = ""
    for d in section.directives:
        if d.type == "text":
            directives_str += f'  [text overlay: "{d.args[0]}"]\n'

    user_prompt = f"""Design ONE character-driven illustration for this video scene:

Scene {scene_index + 1} ({section.name}):
  Narration: {narration_preview}
{directives_str}

Requirements:
- Friendly character DOING something related to the narration content
- ZERO text, numbers, or letters anywhere
- Flat line art style, soft pastel colors
- Keep description under 40 words
- Return ONLY: {{"image": "description here"}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": LLM_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=300,
        )

        raw = response.choices[0].message.content.strip()
        result = _parse_llm_json(raw)

        if isinstance(result, dict) and result.get("image"):
            return {
                "image": result["image"],
                "diagram_area": result.get("diagram_area", "center"),
            }
        elif isinstance(result, list) and len(result) > 0:
            item = result[0]
            if isinstance(item, dict) and item.get("image"):
                return {
                    "image": item["image"],
                    "diagram_area": item.get("diagram_area", "center"),
                }

        return None

    except Exception as e:
        print(f"  [LLM] Single scene {scene_index+1} failed: {e}")
        return None


def llm_batch_generate_prompts(sections: list, batch_size: int = 10) -> Optional[list[dict]]:
    """
    Send scenes to Groq Llama in batches and get distinct visual descriptions.

    For 60+ scenes, splits into batches of batch_size to avoid token limits.
    Failed batches are retried once with smaller batch size, then individual scenes.

    Returns:
        List of dicts: [{"image": str, "diagram_area": str}, ...]
        Or None if LLM fails.
    """
    import time

    client = _get_groq_client()
    if not client:
        print("  [LLM] GROQ_API_KEY not set, falling back to keyword-based prompts")
        return None

    total = len(sections)
    num_batches = max(1, (total + batch_size - 1) // batch_size)
    print(f"  [LLM] Generating prompts for {total} scenes in {num_batches} batch(es)...")

    all_results = []

    for batch_idx in range(num_batches):
        start = batch_idx * batch_size
        end = min(start + batch_size, total)
        batch = sections[start:end]

        print(f"  [LLM] Batch {batch_idx+1}/{num_batches} (scenes {start+1}-{end})...")

        # Attempt 1: full batch
        batch_results = _llm_generate_one_batch(client, batch, start)

        # Attempt 2: retry full batch once
        if not batch_results:
            print(f"  [LLM] Batch {batch_idx+1} failed, retrying...")
            time.sleep(2)
            batch_results = _llm_generate_one_batch(client, batch, start)

        # Attempt 3: split into half-batches
        if not batch_results and len(batch) > 3:
            mid = len(batch) // 2
            print(f"  [LLM] Retrying as 2 half-batches ({mid} + {len(batch)-mid})...")
            time.sleep(1)
            half1 = _llm_generate_one_batch(client, batch[:mid], start)
            time.sleep(1)
            half2 = _llm_generate_one_batch(client, batch[mid:], start + mid)
            if half1 and half2:
                batch_results = half1 + half2

        # Attempt 4: generate each scene individually
        if not batch_results:
            print(f"  [LLM] Half-batches failed, generating scenes individually...")
            individual_results = []
            for i, section in enumerate(batch):
                global_idx = start + i
                time.sleep(0.5)  # Rate limit
                result = _llm_generate_single_scene(client, section, global_idx)
                if result:
                    print(f"  [LLM] Scene {global_idx+1}: {result['image'][:70]}...")
                    individual_results.append(result)
                else:
                    print(f"  [LLM] Scene {global_idx+1}: individual generation failed")
                    individual_results.append({"image": None, "diagram_area": "center"})
            batch_results = individual_results

        all_results.extend(batch_results)

        # Rate limit between batches
        if batch_idx < num_batches - 1:
            time.sleep(1)

    # Check if all results have None image (total failure)
    none_count = sum(1 for r in all_results if r.get("image") is None)
    if none_count == len(all_results):
        return None

    if none_count > 0:
        print(f"  [LLM] Warning: {none_count}/{len(all_results)} scenes failed LLM, will use keyword fallback")

    return all_results


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
