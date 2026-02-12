"""
Image Generator Module (v2)
Generates scene images using Replicate API or Google Vertex AI Imagen.
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


def _build_ideogram_params(
    prompt: str,
    negative_prompt: str,
    seed: Optional[int] = None,
) -> dict:
    """Build input params for Ideogram v2/v3 models."""
    params = {
        "prompt": prompt,
        "aspect_ratio": "16:9",
        "style_type": "Design",
        "magic_prompt_option": "On",
    }
    if negative_prompt:
        params["negative_prompt"] = negative_prompt
    if seed is not None:
        params["seed"] = seed
    return params


def _build_flux_params(
    prompt: str,
    negative_prompt: str,
    model: str,
    width: int,
    height: int,
    num_inference_steps: int,
    guidance_scale: float,
    seed: Optional[int] = None,
) -> dict:
    """Build input params for Flux models."""
    params = {
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
    if "flux-schnell" not in model:
        if negative_prompt:
            params["negative_prompt"] = negative_prompt
        if guidance_scale:
            params["guidance_scale"] = guidance_scale
    if seed is not None:
        params["seed"] = seed
    return params


def _generate_with_google_imagen(
    prompt: str,
    negative_prompt: str,
    output_path: str,
    model: str = "imagen-4.0-ultra-generate-001",
    seed: Optional[int] = None,
    max_retries: int = 3,
) -> tuple[bool, Optional[str]]:
    """
    Generate a single image using Google Vertex AI Imagen.

    Returns:
        Tuple of (success, error_message)
    """
    from google import genai
    from google.genai.types import GenerateImagesConfig

    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT", "notebooklm-485105")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")

    for attempt in range(max_retries):
        try:
            client = genai.Client(
                vertexai=True,
                project=project_id,
                location=location,
            )

            config_kwargs = {
                "number_of_images": 1,
                "aspect_ratio": "16:9",
                "output_mime_type": "image/png",
                "person_generation": "allow_adult",
                "safety_filter_level": "block_only_high",
                "language": "en",
            }

            if negative_prompt:
                config_kwargs["negative_prompt"] = negative_prompt
            if seed is not None:
                config_kwargs["seed"] = seed
                config_kwargs["add_watermark"] = False

            config = GenerateImagesConfig(**config_kwargs)

            response = client.models.generate_images(
                model=model,
                prompt=prompt,
                config=config,
            )

            if response.generated_images:
                os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
                response.generated_images[0].image.save(output_path)
                return True, None
            else:
                raise ValueError("No image generated (safety filter may have blocked)")

        except Exception as e:
            error_msg = str(e)
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                print(f"    Retry {attempt + 1}/{max_retries} in {wait_time}s: {error_msg[:100]}")
                time.sleep(wait_time)
            else:
                return False, f"Failed after {max_retries} attempts: {error_msg[:150]}"

    return False, "Unknown error"


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
    Generate a single image using Replicate API or Google Imagen.

    Returns:
        Tuple of (success, error_message)
    """
    # Route to Google Imagen if model starts with "imagen-"
    if model.startswith("imagen-"):
        return _generate_with_google_imagen(
            prompt, negative_prompt, output_path, model, seed, max_retries,
        )

    import replicate

    for attempt in range(max_retries):
        try:
            # Build model-specific params
            if "ideogram" in model:
                input_params = _build_ideogram_params(prompt, negative_prompt, seed)
            else:
                input_params = _build_flux_params(
                    prompt, negative_prompt, model, width, height,
                    num_inference_steps, guidance_scale, seed,
                )

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

    # Count actual image scenes (non-empty prompts)
    image_count = sum(1 for sp in scene_prompts if sp.generated_prompt)
    generated = 0

    for scene_prompt in scene_prompts:
        idx = scene_prompt.scene_index
        output_path = os.path.join(images_dir, f"scene_{idx + 1:02d}.png")
        relative_path = f"images/scene_{idx + 1:02d}.png"

        # Skip whiteboard scenes (empty prompt = no image needed)
        if not scene_prompt.generated_prompt:
            results.append(GeneratedImage(
                scene_index=idx,
                image_path="",
                prompt="",
                model="none",
                generation_time_s=0,
                success=False,
            ))
            continue

        generated += 1
        print(f"  Image {generated}/{image_count} (scene {idx + 1})...")

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
            print(f"    Done in {elapsed:.1f}s")
            # Wait 10 seconds between successful generations to avoid rate limits
            if generated < image_count:
                print(f"    Waiting 10s before next image to avoid rate limit...")
                time.sleep(10)
        else:
            print(f"    FAILED: {error}")

    # Summary
    succeeded = sum(1 for r in results if r.success)
    skipped = sum(1 for r in results if r.model == "none")
    failed = image_count - succeeded
    total_time = sum(r.generation_time_s for r in results)
    print(f"\n=== Complete: {succeeded}/{image_count} succeeded, {failed} failed, {skipped} skipped (whiteboard) ===")

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
        _create_placeholder_png(output_path, width, height, colors, idx + 1, scene_prompt.scene_role)

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


def _create_placeholder_png(
    output_path: str,
    width: int,
    height: int,
    colors: tuple[str, str],
    scene_num: int,
    role: str,
):
    """Create a simple gradient PNG placeholder image using Pillow."""
    from PIL import Image, ImageDraw, ImageFont

    def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    c1 = hex_to_rgb(colors[0])
    c2 = hex_to_rgb(colors[1])

    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    # Draw gradient
    for y in range(height):
        ratio = y / height
        r = int(c1[0] + (c2[0] - c1[0]) * ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Draw scene number text
    try:
        font_large = ImageFont.truetype("arial.ttf", 72)
        font_small = ImageFont.truetype("arial.ttf", 36)
    except (IOError, OSError):
        font_large = ImageFont.load_default()
        font_small = font_large

    # Scene number (centered, semi-transparent effect via color)
    text_color = (255, 255, 255, 80)
    label = f"Scene {scene_num}"
    bbox = draw.textbbox((0, 0), label, font=font_large)
    text_w = bbox[2] - bbox[0]
    draw.text(
        ((width - text_w) // 2, height // 2 - 60),
        label, fill=(100, 100, 100), font=font_large,
    )

    # Role label
    bbox2 = draw.textbbox((0, 0), role, font=font_small)
    text_w2 = bbox2[2] - bbox2[0]
    draw.text(
        ((width - text_w2) // 2, height // 2 + 20),
        role, fill=(120, 120, 80), font=font_small,
    )

    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    img.save(output_path, 'PNG')
