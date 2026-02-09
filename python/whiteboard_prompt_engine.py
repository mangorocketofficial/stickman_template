"""
Whiteboard Prompt Engine
Generates diagram-focused prompts optimized for educational whiteboard style.

Core principles:
1. Concept-centric (not decorative imagery)
2. Diagram types based on scene role
3. Consistent visual language across all scenes
4. Focus on explaining relationships, not objects
"""

from typing import Optional
import re


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
) -> str:
    """
    Generate whiteboard-optimized diagram prompt.

    Args:
        narration: Scene narration text
        scene_role: opening, explanation, emphasis, etc.
        image_hint: User-provided hint (if any)
        previous_concepts: Concepts from previous scenes (for continuity)

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

    # Extract key concepts from narration
    key_concepts = extract_key_concepts(narration)

    # Determine if narration has numbers (mathematical/financial content)
    has_numbers = bool(re.search(r'\d+', narration))

    # Get base diagram type for this scene role
    base_diagram = DIAGRAM_TYPES.get(scene_role, "simple explanatory diagram")

    # Build concept description
    if key_concepts:
        concept_desc = f"showing {', '.join(key_concepts[:3])}"
    else:
        concept_desc = "explaining the main concept"

    # Add continuity note if previous concepts exist
    continuity = ""
    if previous_concepts and len(previous_concepts) > 0:
        continuity = f", building on previous diagram elements"

    # Complexity modifier
    complexity = classify_diagram_complexity(len(narration), has_numbers)
    complexity_modifier = {
        "simple": "minimal clean",
        "moderate": "clear structured",
        "detailed": "comprehensive detailed"
    }[complexity]

    # Construct final prompt
    prompt = (
        f"{complexity_modifier} {base_diagram} "
        f"{concept_desc}{continuity}, "
        f"hand-drawn whiteboard style with black marker lines, "
        f"educational and easy to understand"
    )

    return prompt


def build_whiteboard_scene_prompts(sections, use_continuity: bool = True) -> list[str]:
    """
    Build prompts for all scenes with whiteboard optimization.

    Args:
        sections: List of ScriptSection objects
        use_continuity: Whether to track concepts across scenes

    Returns:
        List of whiteboard-optimized prompts
    """
    prompts = []
    cumulative_concepts = []

    for section in sections:
        # Determine scene role (reuse existing logic from prompt_generator.py)
        from prompt_generator import classify_scene_role
        scene_role = classify_scene_role(section.narration, section.name)

        # Get image_hint directive if exists
        image_hint_directives = [d for d in section.directives if d.type == 'image_hint']
        image_hint = image_hint_directives[0].args[0] if image_hint_directives else None

        # Generate whiteboard prompt
        prompt = generate_whiteboard_prompt(
            narration=section.narration,
            scene_role=scene_role,
            image_hint=image_hint,
            previous_concepts=cumulative_concepts if use_continuity else None,
        )

        prompts.append(prompt)

        # Track concepts for next scene
        if use_continuity:
            concepts = extract_key_concepts(section.narration)
            cumulative_concepts.extend(concepts[:2])  # Keep only most recent
            cumulative_concepts = cumulative_concepts[-5:]  # Max 5 cumulative concepts

    return prompts
