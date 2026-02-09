"""
Image Generator Module (v2)
Generates scene images using Replicate API (Flux/SDXL).
"""

import os
import time
import asyncio
import urllib.request
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

from prompt_generator import ScenePrompt


@dataclass
class GeneratedImage:
    """Result of image generation for one scene."""
    scene_index: int
    image_path: str
    prompt: str
    model: str
    generation_time_s: float
    success: bool
    error: Optional[str] = None


def generate_single_image(
    prompt: str,
    negative_prompt: str,
    output_path: str,
    model: str = "black-forest-labs/flux-schnell",
    width: int = 1920,
    height: int = 1080,
    guidance_scale: float = 3.5,
    num_inference_steps: int = 4,
    seed: Optional[int] = None,
    max_retries: int = 3,
) -> tuple[bool, Optional[str]]:
    """
    Generate a single image using Replicate API.

    Returns:
        Tuple of (success, error_message)
    """
    import replicate

    for attempt in range(max_retries):
        try:
            input_params = {
                "prompt": prompt,
                "width": width,
                "height": height,
                "num_inference_steps": num_inference_steps,
                "go_fast": True,
                "megapixels": "1",
                "output_format": "png",
                "output_quality": 90,
            }

            # Flux schnell doesn't support negative_prompt or guidance_scale
            # but other models might
            if "flux-schnell" not in model:
                if negative_prompt:
                    input_params["negative_prompt"] = negative_prompt
                if guidance_scale:
                    input_params["guidance_scale"] = guidance_scale

            if seed is not None:
                input_params["seed"] = seed

            output = replicate.run(model, input=input_params)

            # Handle output format (can be URL string or FileOutput)
            image_url = None
            if isinstance(output, list) and len(output) > 0:
                image_url = str(output[0])
            elif isinstance(output, str):
                image_url = output
            elif hasattr(output, 'url'):
                image_url = output.url
            else:
                # Try to iterate
                for item in output:
                    image_url = str(item)
                    break

            if not image_url:
                raise ValueError("No image URL in Replicate output")

            # Download image
            os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
            urllib.request.urlretrieve(image_url, output_path)

            return True, None

        except Exception as e:
            error_msg = str(e)

            # Check for rate limit error (429 status)
            is_rate_limit = "429" in error_msg or "rate limit" in error_msg.lower() or "throttled" in error_msg.lower()

            if attempt < max_retries - 1:
                # For rate limit errors, wait 10 seconds
                if is_rate_limit:
                    wait_time = 10
                    print(f"    Rate limit hit. Waiting {wait_time}s before retry {attempt + 1}/{max_retries}...")
                else:
                    wait_time = 2 ** attempt  # Exponential backoff for other errors
                    print(f"    Retry {attempt + 1}/{max_retries} in {wait_time}s: {error_msg[:100]}")

                time.sleep(wait_time)
            else:
                return False, f"Failed after {max_retries} attempts: {error_msg[:150]}"

    return False, "Unknown error"


def generate_scene_images(
    scene_prompts: list[ScenePrompt],
    output_dir: str,
    model: str = "black-forest-labs/flux-schnell",
    width: int = 1920,
    height: int = 1080,
    base_seed: Optional[int] = None,
) -> list[GeneratedImage]:
    """
    Generate images for all scenes sequentially.

    Args:
        scene_prompts: List of ScenePrompt objects
        output_dir: Directory to save images
        model: Replicate model ID
        width: Image width
        height: Image height
        base_seed: Base seed for reproducibility (each scene gets base_seed + index)

    Returns:
        List of GeneratedImage results
    """
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(images_dir, exist_ok=True)

    results = []
    total = len(scene_prompts)

    for scene_prompt in scene_prompts:
        idx = scene_prompt.scene_index
        output_path = os.path.join(images_dir, f"scene_{idx + 1:02d}.png")
        relative_path = f"images/scene_{idx + 1:02d}.png"

        print(f"  Generating image {idx + 1}/{total}...")

        seed = (base_seed + idx) if base_seed is not None else None

        start_time = time.time()
        success, error = generate_single_image(
            prompt=scene_prompt.generated_prompt,
            negative_prompt=scene_prompt.negative_prompt,
            output_path=output_path,
            model=model,
            width=width,
            height=height,
            seed=seed,
        )
        elapsed = time.time() - start_time

        result = GeneratedImage(
            scene_index=idx,
            image_path=relative_path,
            prompt=scene_prompt.generated_prompt,
            model=model,
            generation_time_s=round(elapsed, 1),
            success=success,
            error=error,
        )
        results.append(result)

        if success:
            print(f"    Done in {elapsed:.1f}s → {relative_path}")
            # Wait 10 seconds between successful generations to avoid rate limits
            if idx < total - 1:  # Don't wait after last image
                print(f"    Waiting 10s before next image to avoid rate limit...")
                time.sleep(10)
        else:
            print(f"    FAILED: {error}")

    # Summary
    succeeded = sum(1 for r in results if r.success)
    failed = total - succeeded
    total_time = sum(r.generation_time_s for r in results)
    print(f"\n  Image generation complete: {succeeded}/{total} succeeded "
          f"({failed} failed) in {total_time:.1f}s total")

    return results


def generate_placeholder_images(
    scene_prompts: list[ScenePrompt],
    output_dir: str,
    width: int = 1920,
    height: int = 1080,
) -> list[GeneratedImage]:
    """
    Generate placeholder gradient images (no API needed).
    Useful for testing the pipeline without Replicate API.
    """
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(images_dir, exist_ok=True)

    # Color palettes for different roles
    role_colors = {
        "opening": ("#1a1a2e", "#16213e"),
        "explanation": ("#0f3460", "#1a1a2e"),
        "emphasis": ("#e94560", "#1a1a2e"),
        "comparison": ("#533483", "#1a1a2e"),
        "example": ("#0f3460", "#16213e"),
        "warning": ("#e94560", "#533483"),
        "closing": ("#16213e", "#0f3460"),
    }

    results = []
    total = len(scene_prompts)

    for scene_prompt in scene_prompts:
        idx = scene_prompt.scene_index
        output_path = os.path.join(images_dir, f"scene_{idx + 1:02d}.png")
        relative_path = f"images/scene_{idx + 1:02d}.png"

        # Create a simple SVG placeholder and convert to PNG-like
        colors = role_colors.get(scene_prompt.scene_role, ("#1a1a2e", "#16213e"))
        _create_placeholder_svg(output_path, width, height, colors, idx + 1, scene_prompt.scene_role)

        result = GeneratedImage(
            scene_index=idx,
            image_path=relative_path,
            prompt=scene_prompt.generated_prompt,
            model="placeholder",
            generation_time_s=0.0,
            success=True,
        )
        results.append(result)
        print(f"  Placeholder {idx + 1}/{total} → {relative_path}")

    return results


def _create_placeholder_svg(
    output_path: str,
    width: int,
    height: int,
    colors: tuple[str, str],
    scene_num: int,
    role: str,
):
    """Create a simple SVG placeholder image."""
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{colors[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{colors[1]};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="{width}" height="{height}" fill="url(#bg)"/>
  <text x="{width//2}" y="{height//2 - 40}" font-family="Arial" font-size="72"
        fill="#FFFFFF" text-anchor="middle" opacity="0.3">Scene {scene_num}</text>
  <text x="{width//2}" y="{height//2 + 40}" font-family="Arial" font-size="36"
        fill="#FFD700" text-anchor="middle" opacity="0.3">{role}</text>
</svg>'''

    # Save as SVG (Remotion can handle SVG images)
    # Change extension to .svg
    svg_path = output_path.replace('.png', '.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg)

    # Also save the PNG path reference (will be SVG actually)
    # For real pipeline, Replicate generates actual PNG
    import shutil
    if svg_path != output_path:
        shutil.copy(svg_path, output_path)
