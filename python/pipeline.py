#!/usr/bin/env python3
"""
Pipeline Orchestrator (v2: AI Image Pipeline)
Main CLI entry point that runs the complete video generation pipeline.

v2: Replaces StickMan objects with AI-generated image backgrounds.

Usage:
    python pipeline.py <script.md> [--output-dir ./output] [--style dark_infographic]
"""

import argparse
import os
import sys
from pathlib import Path

# Load .env file if exists
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
        print(f"Loaded environment from {env_path}")
except ImportError:
    pass

from script_parser import parse_script_file, ParsedScript
from tts_generator import generate_tts
from alignment import align_audio, map_narration_to_words, AlignmentResult
from scene_builder import build_scene_json_v2, save_scene_json
from subtitle_generator import generate_subtitles
from prompt_generator import generate_scene_prompts
from image_generator import generate_scene_images, generate_placeholder_images


def setup_output_dirs(output_dir: str) -> dict:
    """Create output directory structure."""
    dirs = {
        "root": output_dir,
        "audio": os.path.join(output_dir, "audio"),
        "subtitles": os.path.join(output_dir, "subtitles"),
        "images": os.path.join(output_dir, "images"),
    }

    for dir_path in dirs.values():
        os.makedirs(dir_path, exist_ok=True)

    return dirs


def estimate_line_timings(sections) -> list[tuple[int, int]]:
    """Estimate timing for each line based on character count."""
    all_lines = []
    for section in sections:
        lines = section.narration_lines if section.narration_lines else [section.narration]
        all_lines.extend([line.strip() for line in lines if line.strip()])

    current_ms = 0
    line_timings = []
    for line in all_lines:
        duration = max(1500, len(line) * 100)
        line_timings.append((current_ms, current_ms + duration))
        current_ms += duration + 200
    return line_timings


def run_pipeline(
    script_path: str,
    output_dir: str = "./output",
    style: str = "dark_infographic",
    skip_tts: bool = False,
    skip_alignment: bool = False,
    skip_images: bool = False,
    use_placeholder_images: bool = False,
    use_llm_prompts: bool = True,
) -> dict:
    """
    Run the complete v2 video generation pipeline.

    Args:
        script_path: Path to the markdown script file
        output_dir: Directory for output files
        style: Prompt template name for image generation
        skip_tts: Skip TTS generation (use existing audio)
        skip_alignment: Skip alignment (use mock timings)
        skip_images: Skip image generation (use existing images)
        use_placeholder_images: Generate placeholder images instead of API
        use_llm_prompts: Use LLM to enhance image prompts
    """
    print("=" * 60)
    print("Video Pipeline v2 (AI Image)")
    print("=" * 60)

    dirs = setup_output_dirs(output_dir)
    print(f"\nOutput directory: {output_dir}")

    # === Step 1: Parse Script ===
    print("\n[1/6] Parsing script...")
    parsed_script = parse_script_file(script_path)

    # Override style from CLI if provided, else use script frontmatter
    if style:
        parsed_script.meta['style'] = style

    print(f"  Title: {parsed_script.meta.get('title', 'Untitled')}")
    print(f"  Voice: {parsed_script.meta.get('voice')}")
    print(f"  Style: {parsed_script.meta.get('style')}")
    print(f"  Sections: {len(parsed_script.sections)}")
    print(f"  Total narration: {len(parsed_script.full_narration)} characters")

    # === Step 2: Generate TTS ===
    audio_path = os.path.join(dirs["audio"], "tts_output.mp3")

    if skip_tts and os.path.exists(audio_path):
        print(f"\n[2/6] Skipping TTS (using existing: {audio_path})")
    else:
        print("\n[2/6] Generating TTS audio...")
        voice = parsed_script.meta.get('voice', 'ko-KR-HyunsuNeural')
        print(f"  Voice: {voice}")
        generate_tts(
            text=parsed_script.full_narration,
            output_path=audio_path,
            voice=voice,
        )
        print(f"  Audio saved: {audio_path}")

    # === Step 3: Align Audio ===
    alignment: AlignmentResult = None
    fallback_line_timings = None

    if skip_alignment:
        print("\n[3/6] Skipping alignment (using estimated timings)...")
        fallback_line_timings = estimate_line_timings(parsed_script.sections)
        from alignment import AlignmentResult as AR
        alignment = AR(
            text=parsed_script.full_narration,
            words=[],
            segments=[],
            duration_ms=fallback_line_timings[-1][1] if fallback_line_timings else 0,
        )
    else:
        print("\n[3/6] Aligning audio with Groq Whisper...")
        if not os.environ.get("GROQ_API_KEY"):
            print("  WARNING: GROQ_API_KEY not set! Using estimated timings...")
            fallback_line_timings = estimate_line_timings(parsed_script.sections)
            from alignment import AlignmentResult as AR
            alignment = AR(
                text=parsed_script.full_narration,
                words=[], segments=[],
                duration_ms=fallback_line_timings[-1][1] if fallback_line_timings else 0,
            )
        else:
            alignment = align_audio(audio_path)
            print(f"  Words: {len(alignment.words)}, Duration: {alignment.duration_ms}ms")

    # === Step 4: Generate Subtitles ===
    print("\n[4/6] Generating subtitles...")
    srt_path = os.path.join(dirs["subtitles"], "captions.srt")
    words_path = os.path.join(dirs["subtitles"], "words.json")

    all_lines = []
    section_line_indices = []
    for section in parsed_script.sections:
        start_idx = len(all_lines)
        lines = section.narration_lines if section.narration_lines else [section.narration]
        all_lines.extend([line.strip() for line in lines if line.strip()])
        section_line_indices.append((start_idx, len(all_lines)))

    if fallback_line_timings is not None:
        line_timings = fallback_line_timings
    else:
        line_timings = map_narration_to_words(all_lines, alignment.words)

    # Calculate scene timings from line timings
    scene_timings = []
    for start_idx, end_idx in section_line_indices:
        if start_idx < end_idx:
            scene_start = line_timings[start_idx][0]
            scene_end = line_timings[end_idx - 1][1]
            scene_timings.append((scene_start, scene_end))
        else:
            prev_end = scene_timings[-1][1] if scene_timings else 0
            scene_timings.append((prev_end, prev_end))

    generate_subtitles(
        alignment=alignment,
        srt_output_path=srt_path,
        words_output_path=words_path,
        script_narrations=all_lines,
        section_timings=line_timings,
    )
    print(f"  SRT: {srt_path}")
    print(f"  Lines: {len(all_lines)}")

    # === Step 5: Generate Images ===
    print(f"\n[5/6] Generating scene images (style: {parsed_script.meta.get('style')})...")

    scene_prompts = generate_scene_prompts(
        sections=parsed_script.sections,
        style=parsed_script.meta.get('style', 'dark_infographic'),
        use_llm=use_llm_prompts,
    )

    if skip_images:
        print("  Skipping image generation (using existing images)")
        from image_generator import GeneratedImage
        image_results = [
            GeneratedImage(
                scene_index=i,
                image_path=f"images/scene_{i+1:02d}.png",
                prompt=sp.generated_prompt,
                model="existing",
                generation_time_s=0,
                success=os.path.exists(os.path.join(output_dir, f"images/scene_{i+1:02d}.png")),
            )
            for i, sp in enumerate(scene_prompts)
        ]
    elif use_placeholder_images:
        print("  Generating placeholder images (no API)...")
        image_results = generate_placeholder_images(scene_prompts, output_dir)
    else:
        # Validate Replicate API key
        replicate_key = os.environ.get("REPLICATE_API_TOKEN")
        if not replicate_key:
            print("  WARNING: REPLICATE_API_TOKEN not set! Using placeholders...")
            image_results = generate_placeholder_images(scene_prompts, output_dir)
        else:
            model = parsed_script.meta.get('image_model', 'flux-schnell')
            full_model = f"black-forest-labs/{model}" if "/" not in model else model
            image_results = generate_scene_images(
                scene_prompts, output_dir, model=full_model
            )

    # === Step 6: Build Scene JSON ===
    all_vision_positions = None
    print(f"\n[6/6] Building scene.json (v2)...")
    scene_json_path = os.path.join(output_dir, "scene.json")

    scene_data = build_scene_json_v2(
        parsed_script=parsed_script,
        section_timings=scene_timings,
        image_results=image_results,
        audio_path="audio/tts_output.mp3",
        words_path="subtitles/words.json",
        all_vision_positions=all_vision_positions,
    )

    save_scene_json(scene_data, scene_json_path)
    print(f"  Scene JSON: {scene_json_path}")
    print(f"  Scenes: {len(scene_data['scenes'])}")

    for scene in scene_data['scenes']:
        duration_s = (scene['endMs'] - scene['startMs']) / 1000
        bg_type = scene['background'].get('type', 'unknown') if isinstance(scene['background'], dict) else 'color'
        overlays = len(scene.get('overlays', []))
        print(f"    {scene['id']}: {duration_s:.1f}s, bg={bg_type}, {overlays} overlays")

    # === Summary ===
    print("\n" + "=" * 60)
    print("Pipeline v2 completed successfully!")
    print("=" * 60)

    results = {
        "script": script_path,
        "audio": audio_path,
        "srt": srt_path,
        "words": words_path,
        "scene_json": scene_json_path,
        "output_dir": output_dir,
        "images_generated": sum(1 for r in image_results if r.success),
        "images_total": len(image_results),
    }

    print(f"\nNext step: Preview in Remotion Studio")
    print(f"  cd remotion && npm start")

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate AI image video from markdown script (v2)"
    )
    parser.add_argument("script", help="Path to the markdown script file")
    parser.add_argument("--output-dir", "-o", default="./output",
                        help="Output directory (default: ./output)")
    parser.add_argument("--style", "-s", default=None,
                        help="Image style template (default: from script frontmatter)")
    parser.add_argument("--skip-tts", action="store_true",
                        help="Skip TTS generation")
    parser.add_argument("--skip-alignment", action="store_true",
                        help="Skip audio alignment")
    parser.add_argument("--skip-images", action="store_true",
                        help="Skip image generation (use existing)")
    parser.add_argument("--placeholder-images", action="store_true",
                        help="Use placeholder images instead of API")
    parser.add_argument("--no-llm", action="store_true",
                        help="Don't use LLM for prompt enhancement")

    args = parser.parse_args()

    if not os.path.exists(args.script):
        print(f"Error: Script file not found: {args.script}")
        sys.exit(1)

    try:
        run_pipeline(
            script_path=args.script,
            output_dir=args.output_dir,
            style=args.style,
            skip_tts=args.skip_tts,
            skip_alignment=args.skip_alignment,
            skip_images=args.skip_images,
            use_placeholder_images=args.placeholder_images,
            use_llm_prompts=not args.no_llm,
        )
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
