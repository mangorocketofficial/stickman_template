"""
Base prompt template class and template registry.
"""

from dataclasses import dataclass, field


@dataclass
class PromptTemplate:
    """A style template for AI image generation."""
    name: str
    base_prompt: str
    negative_prompt: str
    color_palette: list[str] = field(default_factory=list)
    model: str = "black-forest-labs/flux-schnell"
    width: int = 1920
    height: int = 1080
    guidance_scale: float = 3.5
    num_inference_steps: int = 4

    def compose_prompt(self, scene_description: str) -> str:
        """Compose final prompt from base + scene description."""
        return f"{self.base_prompt}, {scene_description}"


# Template registry
_TEMPLATES: dict[str, PromptTemplate] = {}


def register_template(template: PromptTemplate):
    """Register a template in the global registry."""
    _TEMPLATES[template.name] = template


def get_template(name: str) -> PromptTemplate:
    """Get a template by name."""
    if name not in _TEMPLATES:
        available = ", ".join(_TEMPLATES.keys())
        raise ValueError(f"Unknown template '{name}'. Available: {available}")
    return _TEMPLATES[name]


def list_templates() -> list[str]:
    """List all available template names."""
    return list(_TEMPLATES.keys())


# Auto-import all template modules to trigger registration
def _load_templates():
    from . import dark_infographic
    from . import whiteboard
    from . import pastel_education

_load_templates()
