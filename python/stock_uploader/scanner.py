"""
Image scanner - discovers uploadable images and matches them with prompt metadata.
"""

import json
import os
import re
from pathlib import Path
from typing import Optional

from .models import ImageAsset
from .history import UploadHistory


def scan_images_directory(
    images_dir: str,
    prompts_log_path: Optional[str] = None,
) -> list[ImageAsset]:
    """
    Scan a directory for uploadable PNG images and match with prompt data.

    Args:
        images_dir: Directory containing scene_XX.png files.
        prompts_log_path: Path to prompts_log.json.
            If None, looks in parent dir (standard Remotion layout).

    Returns:
        List of ImageAsset objects sorted by scene_index.
    """
    images_dir = os.path.abspath(images_dir)
    if not os.path.isdir(images_dir):
        print(f"  ERROR: Images directory not found: {images_dir}")
        return []

    # Find scene image files
    image_files = sorted(
        p for p in Path(images_dir).glob("scene_*.png")
        if p.is_file()
    )
    if not image_files:
        print(f"  No scene_*.png files found in {images_dir}")
        return []

    # Load prompts log
    if prompts_log_path is None:
        # Standard layout: images/ is sibling of prompts_log.json
        parent = Path(images_dir).parent
        candidates = [
            parent / "prompts_log.json",
            parent / "prompts_31_60.json",
        ]
        prompts_data = {}
        for candidate in candidates:
            if candidate.exists():
                prompts_data.update(_load_prompts_log(str(candidate)))
    else:
        prompts_data = _load_prompts_log(prompts_log_path)

    # Match images to prompts
    assets = []
    for image_path in image_files:
        scene_num = _extract_scene_number(image_path.name)
        if scene_num is None:
            continue

        prompt_info = prompts_data.get(scene_num, {})
        file_hash = UploadHistory.compute_file_hash(str(image_path))

        asset = ImageAsset(
            file_path=str(image_path),
            scene_index=scene_num,
            original_prompt=prompt_info.get("prompt", ""),
            scene_role=prompt_info.get("role", ""),
            narration_summary=prompt_info.get("narration", ""),
            file_hash=file_hash,
        )
        assets.append(asset)

    assets.sort(key=lambda a: a.scene_index)
    return assets


def _load_prompts_log(path: str) -> dict[int, dict]:
    """Load prompts_log.json and return dict keyed by scene number."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print(f"  WARNING: Could not load prompts log {path}: {e}")
        return {}

    result = {}
    if isinstance(data, list):
        for entry in data:
            scene_num = entry.get("scene")
            if scene_num is not None:
                result[scene_num] = {
                    "prompt": entry.get("prompt", ""),
                    "role": entry.get("role", ""),
                    "source": entry.get("source", ""),
                    "negative_prompt": entry.get("negative_prompt", ""),
                }
    return result


def _extract_scene_number(filename: str) -> Optional[int]:
    """Extract scene number from filename like 'scene_01.png'."""
    match = re.match(r"scene_(\d+)\.png$", filename)
    if match:
        return int(match.group(1))
    return None
