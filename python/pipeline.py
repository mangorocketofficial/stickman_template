#!/usr/bin/env python3
"""
Pipeline Orchestrator (v2: AI Image Pipeline)
Main CLI entry point that runs the complete video generation pipeline.

v2: Replaces StickMan objects with AI-generated image backgrounds.
v2.1: 15-second scene splitting, 9-word subtitle splitting, template model routing.

Usage:
    python pipeline.py <script.md> [--output-dir ./output] [--style whiteboard]
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

from script_parser import parse_script_file, ParsedScript, ScriptSection
from tts_generator import generate_tts
from alignment import align_audio, map_narration_to_words, map_segments_sequential, AlignmentResult
from scene_builder import build_scene_json_v2, save_scene_json
from subtitle_generator import generate_subtitles, split_long_subtitle_lines, split_narration_texts, build_whisper_subtitles
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


def split_long_scenes(
    sections: list[ScriptSection],
    scene_timings: list[tuple[int, int]],
    words: list,
    target_duration_ms: int = 15000,
) -> tuple[list[ScriptSection], list[tuple[int, int]]]:
    """
    Split scenes longer than target_duration into ~15s sub-scenes using word boundaries.

    Args:
        sections: Original script sections
        scene_timings: (start_ms, end_ms) per section
        words: Word timestamps from Whisper
        target_duration_ms: Target scene duration (default: 15000ms = 15s)

    Returns:
        Tuple of (split_sections, split_timings)
    """
    new_sections = []
    new_timings = []

    for section, (start_ms, end_ms) in zip(sections, scene_timings):
        duration = end_ms - start_ms

        # If scene is short enough (< 19.5s), keep as is
        if duration <= target_duration_ms * 1.3:
            new_sections.append(section)
            new_timings.append((start_ms, end_ms))
            continue

        # Get words within this scene's time range (with small buffer)
        scene_words = [
            w for w in words
            if w.start_ms >= start_ms - 200 and w.end_ms <= end_ms + 200
        ]

        if not scene_words:
            new_sections.append(section)
            new_timings.append((start_ms, end_ms))
            continue

        # Calculate number of sub-scenes
        num_subs = max(2, round(duration / target_duration_ms))
        words_per_sub = max(1, len(scene_words) // num_subs)

        print(f"    Splitting {section.name} ({duration/1000:.1f}s) into {num_subs} sub-scenes")

        for sub_idx in range(num_subs):
            w_start = sub_idx * words_per_sub
            w_end = (sub_idx + 1) * words_per_sub if sub_idx < num_subs - 1 else len(scene_words)

            if w_start >= len(scene_words):
                break

            sub_words = scene_words[w_start:w_end]
            sub_start_ms = sub_words[0].start_ms
            sub_end_ms = sub_words[-1].end_ms
            sub_narration = " ".join(w.word for w in sub_words)

            sub_section = ScriptSection(
                name=f"{section.name}_{sub_idx + 1:02d}",
                # First sub-scene inherits directives (text overlay)
                directives=section.directives if sub_idx == 0 else [],
                narration=sub_narration,
                narration_lines=[sub_narration],
            )

            new_sections.append(sub_section)
            new_timings.append((sub_start_ms, sub_end_ms))

    return new_sections, new_timings


def run_pipeline(
    script_path: str,
    output_dir: str = "./output",
    style: str = "dark_infographic",
    skip_tts: bool = False,
    skip_alignment: bool = False,
    skip_images: bool = False,
    use_placeholder_images: bool = False,
    use_llm_prompts: bool = True,
    scene_duration_ms: int = 15000,
    max_subtitle_words: int = 9,
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
        scene_duration_ms: Target duration per scene in ms (default: 15000)
        max_subtitle_words: Max words per subtitle line before splitting (default: 9)
    """
    print("=" * 60)
    print("Video Pipeline v2.1 (AI Image + 15s Scene Split)")
    print("=" * 60)

    dirs = setup_output_dirs(output_dir)
    print(f"\nOutput directory: {output_dir}")

    # === Step 1: Parse Script ===
    print("\n[1/7] Parsing script...")
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
        print(f"\n[2/7] Skipping TTS (using existing: {audio_path})")
    else:
        print("\n[2/7] Generating TTS audio...")
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
        print("\n[3/7] Skipping alignment (using estimated timings)...")
        fallback_line_timings = estimate_line_timings(parsed_script.sections)
        from alignment import AlignmentResult as AR
        alignment = AR(
            text=parsed_script.full_narration,
            words=[],
            segments=[],
            duration_ms=fallback_line_timings[-1][1] if fallback_line_timings else 0,
        )
    else:
        print("\n[3/7] Aligning audio with Groq Whisper...")
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

    # === Step 4: Calculate timings & split subtitles ===
    print(f"\n[4/7] Generating subtitles (max {max_subtitle_words} words/line)...")
    srt_path = os.path.join(dirs["subtitles"], "captions.srt")
    words_path = os.path.join(dirs["subtitles"], "words.json")

    # Collect original narration lines per section (for scene timing)
    raw_lines = []
    section_line_indices = []
    for section in parsed_script.sections:
        start_idx = len(raw_lines)
        lines = section.narration_lines if section.narration_lines else [section.narration]
        raw_lines.extend([line.strip() for line in lines if line.strip()])
        section_line_indices.append((start_idx, len(raw_lines)))

    if fallback_line_timings is not None:
        # Fallback: no Whisper data, use proportional timing
        split_lines = split_narration_texts(raw_lines, max_words=max_subtitle_words)
        split_line_timings = fallback_line_timings
        line_timings = fallback_line_timings
    else:
        # Build subtitles directly from Whisper segments + word timestamps
        # This uses Whisper's own text and timing for perfect audio sync
        split_lines, split_line_timings = build_whisper_subtitles(
            alignment.segments, alignment.words, max_words=max_subtitle_words
        )
        # Map original script sections for scene timing calculation
        line_timings = map_narration_to_words(raw_lines, alignment.words)

    print(f"  Whisper segments: {len(alignment.segments)} -> Subtitle lines: {len(split_lines)}")

    # Calculate scene timings from original line timings (before subtitle split)
    scene_timings = []
    for start_idx, end_idx in section_line_indices:
        if start_idx < end_idx:
            scene_start = line_timings[start_idx][0]
            scene_end = line_timings[end_idx - 1][1]
            scene_timings.append((scene_start, scene_end))
        else:
            prev_end = scene_timings[-1][1] if scene_timings else 0
            scene_timings.append((prev_end, prev_end))

    # Generate subtitles with Whisper-synced timing
    generate_subtitles(
        alignment=alignment,
        srt_output_path=srt_path,
        words_output_path=words_path,
        script_narrations=split_lines,
        section_timings=split_line_timings,
    )
    print(f"  SRT: {srt_path}")
    print(f"  Subtitle segments: {len(split_lines)}")

    # === Step 5: Split scenes into ~15s sub-scenes ===
    print(f"\n[5/7] Splitting scenes (target: {scene_duration_ms/1000:.0f}s per scene)...")
    split_sections, split_scene_timings = split_long_scenes(
        parsed_script.sections,
        scene_timings,
        alignment.words,
        target_duration_ms=scene_duration_ms,
    )
    print(f"  Original scenes: {len(parsed_script.sections)} -> Split scenes: {len(split_sections)}")

    # Build a new ParsedScript with split sections for prompt generation
    split_parsed = ParsedScript(
        meta=parsed_script.meta,
        sections=split_sections,
        full_narration=parsed_script.full_narration,
    )

    # === Step 6: Generate Images ===
    active_style = parsed_script.meta.get('style', 'dark_infographic')
    print(f"\n[6/7] Generating scene images (style: {active_style}, {len(split_sections)} scenes)...")

    scene_prompts = generate_scene_prompts(
        sections=split_sections,
        style=active_style,
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
        # Get model from template (respects style-specific model config)
        from prompt_templates import get_template
        template = get_template(active_style)
        model = template.model

        if model.startswith("imagen-"):
            # Google Imagen - no Replicate key needed
            print(f"  Using Google Imagen: {model}")
            image_results = generate_scene_images(
                scene_prompts, output_dir, model=model
            )
        else:
            # Replicate-based model
            replicate_key = os.environ.get("REPLICATE_API_TOKEN")
            if not replicate_key:
                print("  WARNING: REPLICATE_API_TOKEN not set! Using placeholders...")
                image_results = generate_placeholder_images(scene_prompts, output_dir)
            else:
                full_model = f"black-forest-labs/{model}" if "/" not in model else model
                print(f"  Using Replicate: {full_model}")
                image_results = generate_scene_images(
                    scene_prompts, output_dir, model=full_model
                )

    # === Step 7: Build Scene JSON ===
    print(f"\n[7/7] Building scene.json (v2, {len(split_sections)} scenes)...")
    scene_json_path = os.path.join(output_dir, "scene.json")

    scene_data = build_scene_json_v2(
        parsed_script=split_parsed,
        section_timings=split_scene_timings,
        image_results=image_results,
        audio_path="audio/tts_output.mp3",
        words_path="subtitles/words.json",
    )

    save_scene_json(scene_data, scene_json_path)
    print(f"  Scene JSON: {scene_json_path}")
    print(f"  Total scenes: {len(scene_data['scenes'])}")

    # Print scene summary (compact for many scenes)
    scenes_with_overlays = sum(1 for s in scene_data['scenes'] if s.get('overlays'))
    durations = [(s['endMs'] - s['startMs']) / 1000 for s in scene_data['scenes']]
    avg_duration = sum(durations) / len(durations) if durations else 0
    min_duration = min(durations) if durations else 0
    max_duration = max(durations) if durations else 0

    print(f"  Duration: avg={avg_duration:.1f}s, min={min_duration:.1f}s, max={max_duration:.1f}s")
    print(f"  Scenes with overlays: {scenes_with_overlays}")

    if len(scene_data['scenes']) <= 15:
        for scene in scene_data['scenes']:
            duration_s = (scene['endMs'] - scene['startMs']) / 1000
            bg_type = scene['background'].get('type', 'unknown') if isinstance(scene['background'], dict) else 'color'
            overlays = len(scene.get('overlays', []))
            print(f"    {scene['id']}: {duration_s:.1f}s, bg={bg_type}, {overlays} overlays")

    # === Summary ===
    print("\n" + "=" * 60)
    print("Pipeline v2.1 completed successfully!")
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
        "total_scenes": len(split_sections),
        "subtitle_segments": len(split_lines),
    }

    print(f"\nNext step: Preview in Remotion Studio")
    print(f"  cd remotion && npm start")

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate AI image video from markdown script (v2.1)"
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
    parser.add_argument("--scene-duration", type=int, default=15000,
                        help="Target scene duration in ms (default: 15000)")
    parser.add_argument("--max-subtitle-words", type=int, default=9,
                        help="Max words per subtitle line (default: 9)")

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
            scene_duration_ms=args.scene_duration,
            max_subtitle_words=args.max_subtitle_words,
        )
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
