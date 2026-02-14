#!/usr/bin/env python3
"""
Pipeline Orchestrator (v3: Streamlined Mixed Rendering)
Main CLI entry point that runs the complete video generation pipeline.

v3: External audio input, dynamic scene selection (~30%), Google Imagen only,
    post-render automation (compress + backup + cleanup).

Usage:
    python pipeline.py <script.md> [--output-dir ./output] [--style whiteboard] [--render]
"""

import argparse
import os
import re
import shutil
import subprocess
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
from alignment import align_audio, map_narration_to_words, map_segments_sequential, AlignmentResult
from scene_builder import build_scene_json_v2, save_scene_json
from subtitle_generator import generate_subtitles, split_long_subtitle_lines, split_narration_texts, build_whisper_subtitles
from prompt_generator import generate_scene_prompts
from image_generator import generate_scene_images, generate_placeholder_images
from stickman_assigner import select_image_scenes, assign_stickman_for_scenes
from whiteboard_text_generator import generate_whiteboard_texts


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


def post_render_process(
    output_dir: str,
    audio_path: str,
    title: str,
    skip_cleanup: bool = False,
) -> dict:
    """Run Remotion render, compress outputs, backup, and cleanup."""
    remotion_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'remotion')
    remotion_dir = os.path.normpath(remotion_dir)

    # 1. Render with Remotion
    print(f"\n[8/8] Rendering video with Remotion...")
    raw_video = os.path.join(remotion_dir, 'out', 'final.mp4')
    render_cmd = ['npx.cmd', 'remotion', 'render', 'src/index.tsx', 'MainVideo',
                  f'--output=./out/final.mp4', '--codec', 'h264']
    subprocess.run(render_cmd, cwd=remotion_dir, check=True)
    print(f"  Raw video: {raw_video}")

    # 2. Compress video with ffmpeg
    print("  Compressing video (CRF 23)...")
    compressed_video = os.path.join(remotion_dir, 'out', 'final_compressed.mp4')
    subprocess.run([
        'ffmpeg', '-y', '-i', raw_video,
        '-c:v', 'libx264', '-crf', '23',
        '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart',
        compressed_video,
    ], check=True, capture_output=True)

    # 3. Compress audio with ffmpeg
    print("  Compressing audio (128kbps)...")
    compressed_audio = os.path.join(os.path.dirname(audio_path), "audio_compressed.mp3")
    subprocess.run([
        'ffmpeg', '-y', '-i', audio_path,
        '-b:a', '128k', compressed_audio,
    ], check=True, capture_output=True)

    # 4. Backup to Desktop folder
    safe_title = re.sub(r'[<>:"/\\|?*]', '_', title)
    backup_dir = os.path.join(os.path.expanduser('~'), 'Desktop', safe_title)
    os.makedirs(backup_dir, exist_ok=True)
    os.makedirs(os.path.join(backup_dir, 'images'), exist_ok=True)

    print(f"  Backing up to: {backup_dir}")
    shutil.copy2(compressed_video, os.path.join(backup_dir, 'final.mp4'))
    shutil.copy2(compressed_audio, os.path.join(backup_dir, 'audio.mp3'))

    # Copy images
    images_dir = os.path.join(output_dir, "images")
    if os.path.exists(images_dir):
        for img in os.listdir(images_dir):
            if img.endswith('.png'):
                shutil.copy2(
                    os.path.join(images_dir, img),
                    os.path.join(backup_dir, 'images', img),
                )

    # Copy captions
    srt_src = os.path.join(output_dir, 'subtitles', 'captions.srt')
    if os.path.exists(srt_src):
        shutil.copy2(srt_src, os.path.join(backup_dir, 'captions.srt'))

    # 5. Cleanup intermediate files
    if not skip_cleanup:
        print("  Cleaning up intermediate files...")
        if os.path.exists(raw_video) and os.path.exists(compressed_video):
            os.remove(raw_video)

    video_size_mb = os.path.getsize(compressed_video) / (1024 * 1024) if os.path.exists(compressed_video) else 0
    audio_size_mb = os.path.getsize(compressed_audio) / (1024 * 1024) if os.path.exists(compressed_audio) else 0
    print(f"  Video: {video_size_mb:.1f}MB, Audio: {audio_size_mb:.1f}MB")
    print(f"  Backup complete: {backup_dir}")

    return {
        "compressed_video": compressed_video,
        "compressed_audio": compressed_audio,
        "backup_dir": backup_dir,
    }


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
    render: bool = False,
    skip_cleanup: bool = False,
    stock_upload: bool = False,
    stock_platforms: str = None,
    stock_dry_run: bool = False,
) -> dict:
    """
    Run the complete v3 video generation pipeline.

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
        render: Run Remotion render + post-processing after pipeline
        skip_cleanup: Keep intermediate files after rendering
    """
    print("=" * 60)
    print("Video Pipeline v3 (Mixed: AI Image + Whiteboard+StickMan)")
    print("=" * 60)

    dirs = setup_output_dirs(output_dir)
    print(f"\nOutput directory: {output_dir}")

    # === Step 1: Parse Script ===
    print("\n[1/8] Parsing script...")
    parsed_script = parse_script_file(script_path)

    # Override style from CLI if provided, else use script frontmatter
    if style:
        parsed_script.meta['style'] = style

    print(f"  Title: {parsed_script.meta.get('title', 'Untitled')}")
    print(f"  Voice: {parsed_script.meta.get('voice')}")
    print(f"  Style: {parsed_script.meta.get('style')}")
    print(f"  Sections: {len(parsed_script.sections)}")
    print(f"  Total narration: {len(parsed_script.full_narration)} characters")

    # === Step 2: Audio ===
    audio_path = os.path.join(dirs["audio"], "tts_output.mp3")
    audio_file_meta = parsed_script.meta.get('audio_file')

    if audio_file_meta:
        # Use externally provided audio file
        # Search: 1) absolute path, 2) relative to script dir, 3) relative to project root
        script_dir = os.path.dirname(os.path.abspath(script_path))
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        candidates = [
            audio_file_meta,  # absolute or CWD-relative
            os.path.join(script_dir, audio_file_meta),
            os.path.join(project_root, audio_file_meta),
        ]
        source_audio = None
        for candidate in candidates:
            if os.path.exists(candidate):
                source_audio = candidate
                break
        if not source_audio:
            print(f"  ERROR: audio_file not found: {audio_file_meta}")
            print(f"  Searched: {candidates}")
            sys.exit(1)
        shutil.copy2(source_audio, audio_path)
        print(f"\n[2/8] Using external audio: {audio_file_meta}")
        print(f"  Source: {source_audio}")
        print(f"  Copied to: {audio_path}")
    elif skip_tts and os.path.exists(audio_path):
        print(f"\n[2/8] Skipping TTS (using existing: {audio_path})")
    else:
        print("\n[2/8] Generating TTS audio...")
        from tts_generator import generate_tts
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
        print("\n[3/8] Skipping alignment (using estimated timings)...")
        fallback_line_timings = estimate_line_timings(parsed_script.sections)
        from alignment import AlignmentResult as AR
        alignment = AR(
            text=parsed_script.full_narration,
            words=[],
            segments=[],
            duration_ms=fallback_line_timings[-1][1] if fallback_line_timings else 0,
        )
    else:
        print("\n[3/8] Aligning audio with Groq Whisper...")
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
    print(f"\n[4/8] Generating subtitles (max {max_subtitle_words} words/line)...")
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
    print(f"\n[5/8] Splitting scenes (target: {scene_duration_ms/1000:.0f}s per scene)...")
    split_sections, split_scene_timings = split_long_scenes(
        parsed_script.sections,
        scene_timings,
        alignment.words,
        target_duration_ms=scene_duration_ms,
    )
    print(f"  Original scenes: {len(parsed_script.sections)} -> Split scenes: {len(split_sections)}")

    # --- Step 5b: Dynamically select ~30% scenes for AI images ---
    image_indices = select_image_scenes(split_sections)
    num_image = len(image_indices)
    num_whiteboard = len(split_sections) - num_image
    print(f"  Scene mix: {num_image} image + {num_whiteboard} whiteboard+stickman")
    print(f"  Image scenes (1-based): {sorted(image_indices)}")

    # --- Step 5c: Assign stickman for whiteboard scenes ---
    stickman_assignments = assign_stickman_for_scenes(split_sections, image_indices)
    print(f"  Stickman assignments: {len(stickman_assignments)} scenes")

    # --- Step 5d: Generate whiteboard text overlays ---
    whiteboard_texts = generate_whiteboard_texts(
        sections=split_sections,
        image_indices=image_indices,
        use_llm=use_llm_prompts,
    )
    wb_with_text = sum(1 for t in whiteboard_texts.values() if t.keyword)
    print(f"  Whiteboard texts: {wb_with_text}/{num_whiteboard} scenes with text overlays")

    # Build a new ParsedScript with split sections for prompt generation
    split_parsed = ParsedScript(
        meta=parsed_script.meta,
        sections=split_sections,
        full_narration=parsed_script.full_narration,
    )

    # === Step 6: Generate Images (Google Imagen, only for image scenes) ===
    active_style = parsed_script.meta.get('style', 'dark_infographic')
    model = "imagen-4.0-ultra-generate-001"
    print(f"\n[6/8] Generating images for {num_image} image scenes (model: {model})...")

    scene_prompts = generate_scene_prompts(
        sections=split_sections,
        style=active_style,
        use_llm=use_llm_prompts,
        image_scene_indices=image_indices,
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
                success=(
                    (i + 1) in image_indices and
                    os.path.exists(os.path.join(output_dir, f"images/scene_{i+1:02d}.png"))
                ),
            )
            for i, sp in enumerate(scene_prompts)
        ]
    elif use_placeholder_images:
        print("  Generating placeholder images (no API)...")
        image_results = generate_placeholder_images(scene_prompts, output_dir)
    else:
        print(f"  Using Google Imagen: {model}")
        image_results = generate_scene_images(
            scene_prompts, output_dir, model=model
        )

    # === Step 7: Build Scene JSON (mixed rendering) ===
    print(f"\n[7/8] Building scene.json ({num_image} image + {num_whiteboard} whiteboard)...")
    scene_json_path = os.path.join(output_dir, "scene.json")

    scene_data = build_scene_json_v2(
        parsed_script=split_parsed,
        section_timings=split_scene_timings,
        image_results=image_results,
        audio_path="audio/tts_output.mp3",
        words_path="subtitles/words.json",
        stickman_assignments=stickman_assignments,
        whiteboard_texts=whiteboard_texts,
    )

    save_scene_json(scene_data, scene_json_path)
    print(f"  Scene JSON: {scene_json_path}")
    print(f"  Total scenes: {len(scene_data['scenes'])}")

    # Print scene summary
    image_scenes = sum(1 for s in scene_data['scenes'] if s['background'].get('type') == 'image')
    wb_scenes = sum(1 for s in scene_data['scenes'] if s['background'].get('type') == 'color')
    stickman_scenes = sum(1 for s in scene_data['scenes'] if any(o.get('type') == 'stickman' for o in s.get('objects', [])))
    durations = [(s['endMs'] - s['startMs']) / 1000 for s in scene_data['scenes']]
    avg_duration = sum(durations) / len(durations) if durations else 0

    print(f"  Image scenes: {image_scenes}, Whiteboard+Stickman: {stickman_scenes}, Color-only: {wb_scenes - stickman_scenes}")
    print(f"  Avg duration: {avg_duration:.1f}s")

    # === Step 8: Render + Post-process (optional) ===
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

    if render:
        post_results = post_render_process(
            output_dir=output_dir,
            audio_path=audio_path,
            title=parsed_script.meta.get('title', 'Untitled'),
            skip_cleanup=skip_cleanup,
        )
        results.update(post_results)
    else:
        print(f"\nNext step: Preview in Remotion Studio")
        print(f"  cd remotion && npm start")

    # === Optional: Stock Upload ===
    if stock_upload:
        print(f"\n[Stock] Uploading AI images to stock platforms...")
        try:
            from stock_uploader import StockUploadOrchestrator, load_config
            stock_config = load_config()
            if stock_platforms:
                stock_config.enabled_platforms = [
                    p.strip() for p in stock_platforms.split(",")
                ]
            stock_config.dry_run = stock_dry_run

            orchestrator = StockUploadOrchestrator(stock_config)
            images_dir = os.path.join(output_dir, "images")
            prompts_log = os.path.join(output_dir, "prompts_log.json")

            stock_results = orchestrator.run(
                images_dir=images_dir,
                prompts_log_path=prompts_log if os.path.exists(prompts_log) else None,
            )
            results["stock_upload"] = stock_results
        except ImportError:
            print("  WARNING: stock_uploader module not found. Skipping.")
        except Exception as e:
            print(f"  ERROR: Stock upload failed: {e}")

    # === Summary ===
    print("\n" + "=" * 60)
    print("Pipeline v3 completed successfully!")
    print("=" * 60)

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate video from markdown script (v3: mixed rendering)"
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
    parser.add_argument("--render", action="store_true",
                        help="Render video with Remotion and post-process")
    parser.add_argument("--skip-cleanup", action="store_true",
                        help="Keep intermediate files after rendering")
    parser.add_argument("--stock-upload", action="store_true",
                        help="Upload AI-generated images to stock platforms")
    parser.add_argument("--stock-platforms",
                        help="Comma-separated stock platforms (default: all configured)")
    parser.add_argument("--stock-dry-run", action="store_true",
                        help="Show stock upload plan without uploading")

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
            render=args.render,
            skip_cleanup=args.skip_cleanup,
            stock_upload=args.stock_upload,
            stock_platforms=args.stock_platforms,
            stock_dry_run=args.stock_dry_run,
        )
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
