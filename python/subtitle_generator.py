"""
Subtitle Generator Module
Generates SRT files and word-level JSON for Remotion subtitle overlay.
"""

import json
import os
from dataclasses import dataclass
from typing import Optional

from alignment import AlignmentResult, WordTimestamp, SegmentTimestamp


def ms_to_srt_time(ms: int) -> str:
    """Convert milliseconds to SRT timestamp format (HH:MM:SS,mmm)."""
    hours = ms // 3600000
    minutes = (ms % 3600000) // 60000
    seconds = (ms % 60000) // 1000
    millis = ms % 1000
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"


def generate_srt(
    segments: list[SegmentTimestamp],
    output_path: str,
    max_chars_per_line: int = 42,
) -> str:
    """
    Generate SRT subtitle file from segments.

    Args:
        segments: List of segment timestamps
        output_path: Path to save the SRT file
        max_chars_per_line: Maximum characters per subtitle line

    Returns:
        Path to the generated SRT file
    """
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    lines = []
    for i, segment in enumerate(segments, 1):
        # Split long text into multiple lines
        text = segment.text.strip()
        if len(text) > max_chars_per_line:
            # Simple word-wrap
            words = text.split()
            wrapped_lines = []
            current_line = ""

            for word in words:
                if len(current_line) + len(word) + 1 <= max_chars_per_line:
                    current_line = f"{current_line} {word}".strip()
                else:
                    if current_line:
                        wrapped_lines.append(current_line)
                    current_line = word

            if current_line:
                wrapped_lines.append(current_line)

            text = "\n".join(wrapped_lines)

        # SRT entry format
        start_time = ms_to_srt_time(segment.start_ms)
        end_time = ms_to_srt_time(segment.end_ms)

        lines.append(f"{i}")
        lines.append(f"{start_time} --> {end_time}")
        lines.append(text)
        lines.append("")  # Blank line separator

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))

    return output_path


def generate_subtitle_json(
    output_path: str,
    script_narrations: list[str] = None,
    section_timings: list[tuple[int, int]] = None,
    words: list[WordTimestamp] = None,
    segments: list[SegmentTimestamp] = None,
) -> str:
    """
    Generate JSON for Remotion subtitle overlay.

    Primary: segments with original script text (no Whisper transcription errors)
    Legacy: word-level timestamps (kept for compatibility)

    Args:
        output_path: Path to save the JSON file
        script_narrations: Original script narration texts (preferred)
        section_timings: Timing for each script section
        words: List of word timestamps from Whisper (optional)
        segments: List of segment timestamps from Whisper (fallback)

    Returns:
        Path to the generated JSON file
    """
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    # Build segments: use original script text with Whisper timing
    output_segments = []

    if script_narrations and section_timings:
        # Use original script text with section timings
        for narration, (start_ms, end_ms) in zip(script_narrations, section_timings):
            if narration.strip():
                output_segments.append({
                    "text": narration.strip(),
                    "startMs": start_ms,
                    "endMs": end_ms,
                })
    elif segments:
        # Fallback: use Whisper segments
        for seg in segments:
            output_segments.append({
                "text": seg.text.strip(),
                "startMs": seg.start_ms,
                "endMs": seg.end_ms,
            })

    data = {
        "segments": output_segments,
        "words": [
            {
                "word": w.word,
                "startMs": w.start_ms,
                "endMs": w.end_ms,
            }
            for w in words
        ] if words else []
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return output_path


def generate_subtitles(
    alignment: AlignmentResult,
    srt_output_path: str,
    words_output_path: str,
    script_narrations: list[str] = None,
    section_timings: list[tuple[int, int]] = None,
) -> tuple[str, str]:
    """
    Generate both SRT and JSON from alignment result.

    Uses original script text for subtitles to avoid Whisper transcription errors.
    Timing comes from Whisper alignment.

    Args:
        alignment: AlignmentResult from Whisper
        srt_output_path: Path for SRT file
        words_output_path: Path for JSON file
        script_narrations: Original script narration texts
        section_timings: Timing for each script section

    Returns:
        Tuple of (srt_path, json_path)
    """
    # For SRT, use original script text with section timings if available
    if script_narrations and section_timings:
        # Create segments from script narrations
        srt_segments = [
            SegmentTimestamp(
                text=narration.strip(),
                start=timing[0] / 1000,
                end=timing[1] / 1000,
            )
            for narration, timing in zip(script_narrations, section_timings)
            if narration.strip()
        ]
        srt_path = generate_srt(srt_segments, srt_output_path)
    else:
        # Fallback: use Whisper segments
        srt_path = generate_srt(alignment.segments, srt_output_path)

    # Generate JSON with segments (using script text)
    json_path = generate_subtitle_json(
        output_path=words_output_path,
        script_narrations=script_narrations,
        section_timings=section_timings,
        words=alignment.words,
        segments=alignment.segments,
    )

    return srt_path, json_path


def segments_from_words(
    words: list[WordTimestamp],
    max_words_per_segment: int = 10,
    max_duration_ms: int = 5000,
) -> list[SegmentTimestamp]:
    """
    Create segments from words if segments are not available.

    Args:
        words: List of word timestamps
        max_words_per_segment: Maximum words per segment
        max_duration_ms: Maximum duration for a segment

    Returns:
        List of generated segments
    """
    if not words:
        return []

    segments = []
    current_words = []
    segment_start = words[0].start

    for word in words:
        current_words.append(word.word)
        duration = word.end_ms - int(segment_start * 1000)

        # Check if we should end the segment
        should_end = (
            len(current_words) >= max_words_per_segment or
            duration >= max_duration_ms or
            word == words[-1]
        )

        if should_end:
            segments.append(SegmentTimestamp(
                text=" ".join(current_words),
                start=segment_start,
                end=word.end,
            ))
            current_words = []
            if word != words[-1]:
                # Set start for next segment
                next_idx = words.index(word) + 1
                if next_idx < len(words):
                    segment_start = words[next_idx].start

    return segments


if __name__ == "__main__":
    import sys

    # Test with mock data
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        # Create mock alignment data
        mock_words = [
            WordTimestamp("안녕하세요", 0.0, 0.8),
            WordTimestamp("오늘은", 0.9, 1.2),
            WordTimestamp("복리의", 1.3, 1.8),
            WordTimestamp("마법에", 1.9, 2.3),
            WordTimestamp("대해", 2.4, 2.7),
            WordTimestamp("알아보겠습니다", 2.8, 3.5),
        ]

        mock_segments = [
            SegmentTimestamp("안녕하세요 오늘은 복리의 마법에 대해 알아보겠습니다", 0.0, 3.5),
        ]

        mock_alignment = AlignmentResult(
            text="안녕하세요 오늘은 복리의 마법에 대해 알아보겠습니다",
            words=mock_words,
            segments=mock_segments,
            duration_ms=3500,
        )

        # Generate files
        srt_path, words_path = generate_subtitles(
            alignment=mock_alignment,
            srt_output_path="test_output/captions.srt",
            words_output_path="test_output/words.json",
        )

        print(f"Generated SRT: {srt_path}")
        print(f"Generated words JSON: {words_path}")

        # Show contents
        print("\n--- SRT Content ---")
        with open(srt_path, 'r', encoding='utf-8') as f:
            print(f.read())

        print("\n--- Words JSON Content ---")
        with open(words_path, 'r', encoding='utf-8') as f:
            print(f.read())

    else:
        print("Usage: python subtitle_generator.py --test")
