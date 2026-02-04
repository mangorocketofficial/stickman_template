#!/usr/bin/env python3
"""
Pipeline Orchestrator
Main CLI entry point that runs the complete video generation pipeline.

Usage:
    python pipeline.py <script.md> [--output-dir ./output]
"""

import argparse
import os
import sys
from pathlib import Path

from script_parser import parse_script_file, ParsedScript
from tts_generator import generate_tts
from alignment import align_audio, map_narration_to_words, AlignmentResult
from scene_builder import build_scene_json, save_scene_json
from subtitle_generator import generate_subtitles


def setup_output_dirs(output_dir: str) -> dict:
    """Create output directory structure."""
    dirs = {
        "root": output_dir,
        "audio": os.path.join(output_dir, "audio"),
        "subtitles": os.path.join(output_dir, "subtitles"),
    }

    for dir_path in dirs.values():
        os.makedirs(dir_path, exist_ok=True)

    return dirs


def run_pipeline(
    script_path: str,
    output_dir: str = "./output",
    skip_tts: bool = False,
    skip_alignment: bool = False,
) -> dict:
    """
    Run the complete video generation pipeline.

    Args:
        script_path: Path to the markdown script file
        output_dir: Directory for output files
        skip_tts: Skip TTS generation (use existing audio)
        skip_alignment: Skip alignment (use mock timings)

    Returns:
        Dictionary with paths to all generated files
    """
    print("=" * 60)
    print("Stickman Video Pipeline")
    print("=" * 60)

    # Setup directories
    dirs = setup_output_dirs(output_dir)
    print(f"\nOutput directory: {output_dir}")

    # === Step 1: Parse Script ===
    print("\n[1/5] Parsing script...")
    parsed_script = parse_script_file(script_path)
    print(f"  Title: {parsed_script.meta.get('title', 'Untitled')}")
    print(f"  Voice: {parsed_script.meta.get('voice')}")
    print(f"  Sections: {len(parsed_script.sections)}")
    print(f"  Total narration: {len(parsed_script.full_narration)} characters")

    # === Step 2: Generate TTS ===
    audio_path = os.path.join(dirs["audio"], "tts_output.mp3")

    if skip_tts and os.path.exists(audio_path):
        print(f"\n[2/5] Skipping TTS (using existing: {audio_path})")
    else:
        print("\n[2/5] Generating TTS audio...")
        voice = parsed_script.meta.get('voice', 'ko-KR-HyunsuNeural')
        print(f"  Voice: {voice}")
        print(f"  Text length: {len(parsed_script.full_narration)} chars")

        generate_tts(
            text=parsed_script.full_narration,
            output_path=audio_path,
            voice=voice,
        )
        print(f"  Audio saved: {audio_path}")

    # === Step 3: Align Audio ===
    alignment: AlignmentResult = None
    section_timings: list[tuple[int, int]] = []

    if skip_alignment:
        print("\n[3/5] Skipping alignment (using estimated timings)...")
        # Estimate timings based on character count
        current_ms = 0
        for section in parsed_script.sections:
            # Rough estimate: ~100ms per character for Korean
            duration = max(2000, len(section.narration) * 100)
            section_timings.append((current_ms, current_ms + duration))
            current_ms += duration + 300  # 300ms gap between scenes

        # Create mock alignment for subtitle generation
        from alignment import WordTimestamp, SegmentTimestamp
        alignment = AlignmentResult(
            text=parsed_script.full_narration,
            words=[],
            segments=[
                SegmentTimestamp(
                    text=section.narration,
                    start=timing[0] / 1000,
                    end=timing[1] / 1000,
                )
                for section, timing in zip(parsed_script.sections, section_timings)
            ],
            duration_ms=section_timings[-1][1] if section_timings else 0,
        )
    else:
        print("\n[3/5] Aligning audio with Groq Whisper...")

        # Check for API key
        if not os.environ.get("GROQ_API_KEY"):
            print("  WARNING: GROQ_API_KEY not set!")
            print("  Set it with: export GROQ_API_KEY='your-key'")
            print("  Falling back to estimated timings...")
            skip_alignment = True

            # Use estimated timings
            current_ms = 0
            for section in parsed_script.sections:
                duration = max(2000, len(section.narration) * 100)
                section_timings.append((current_ms, current_ms + duration))
                current_ms += duration + 300

            from alignment import SegmentTimestamp
            alignment = AlignmentResult(
                text=parsed_script.full_narration,
                words=[],
                segments=[
                    SegmentTimestamp(
                        text=section.narration,
                        start=timing[0] / 1000,
                        end=timing[1] / 1000,
                    )
                    for section, timing in zip(parsed_script.sections, section_timings)
                ],
                duration_ms=section_timings[-1][1] if section_timings else 0,
            )
        else:
            alignment = align_audio(audio_path)
            print(f"  Transcription: {alignment.text[:50]}...")
            print(f"  Words: {len(alignment.words)}")
            print(f"  Segments: {len(alignment.segments)}")
            print(f"  Duration: {alignment.duration_ms}ms")

            # Map sections to word timings
            narrations = [s.narration for s in parsed_script.sections]
            section_timings = map_narration_to_words(narrations, alignment.words)

    # === Step 4: Generate Subtitles ===
    print("\n[4/5] Generating subtitles...")
    srt_path = os.path.join(dirs["subtitles"], "captions.srt")
    words_path = os.path.join(dirs["subtitles"], "words.json")

    generate_subtitles(
        alignment=alignment,
        srt_output_path=srt_path,
        words_output_path=words_path,
    )
    print(f"  SRT: {srt_path}")
    print(f"  Words JSON: {words_path}")

    # === Step 5: Build Scene JSON ===
    print("\n[5/5] Building scene.json...")
    scene_json_path = os.path.join(output_dir, "scene.json")

    # Use relative paths for Remotion
    scene_data = build_scene_json(
        parsed_script=parsed_script,
        section_timings=section_timings,
        audio_path="audio/tts_output.mp3",
        words_path="subtitles/words.json",
    )

    save_scene_json(scene_data, scene_json_path)
    print(f"  Scene JSON: {scene_json_path}")
    print(f"  Scenes: {len(scene_data['scenes'])}")

    for scene in scene_data['scenes']:
        duration_s = (scene['endMs'] - scene['startMs']) / 1000
        print(f"    {scene['id']}: {duration_s:.1f}s, {len(scene['objects'])} objects")

    # === Summary ===
    print("\n" + "=" * 60)
    print("Pipeline completed successfully!")
    print("=" * 60)

    results = {
        "script": script_path,
        "audio": audio_path,
        "srt": srt_path,
        "words": words_path,
        "scene_json": scene_json_path,
        "output_dir": output_dir,
    }

    print("\nGenerated files:")
    for name, path in results.items():
        if name != "output_dir":
            print(f"  {name}: {path}")

    print(f"\nNext step: Copy output to Remotion project")
    print(f"  cp -r {output_dir}/* remotion/public/")
    print(f"  cd remotion && npx remotion render src/index.ts MainVideo")

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate stickman infographic video from markdown script"
    )
    parser.add_argument(
        "script",
        help="Path to the markdown script file"
    )
    parser.add_argument(
        "--output-dir", "-o",
        default="./output",
        help="Output directory (default: ./output)"
    )
    parser.add_argument(
        "--skip-tts",
        action="store_true",
        help="Skip TTS generation (use existing audio)"
    )
    parser.add_argument(
        "--skip-alignment",
        action="store_true",
        help="Skip audio alignment (use estimated timings)"
    )

    args = parser.parse_args()

    # Validate script file exists
    if not os.path.exists(args.script):
        print(f"Error: Script file not found: {args.script}")
        sys.exit(1)

    try:
        run_pipeline(
            script_path=args.script,
            output_dir=args.output_dir,
            skip_tts=args.skip_tts,
            skip_alignment=args.skip_alignment,
        )
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
