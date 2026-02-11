"""
Subtitle Generator Module
Generates SRT files and word-level JSON for Remotion subtitle overlay.
"""

import json
import os
from dataclasses import dataclass
from typing import Optional

from alignment import AlignmentResult, WordTimestamp, SegmentTimestamp


def build_whisper_subtitles(
    segments: list[SegmentTimestamp],
    words: list[WordTimestamp],
    max_words: int = 9,
) -> tuple[list[str], list[tuple[int, int]]]:
    """
    Build subtitles directly from Whisper output with accurate word-level timing.

    1. Split each Whisper segment by punctuation + word count
    2. Map sub-segments to Whisper words within the segment for precise timing

    This avoids the script-text-to-audio mismatch that causes timing drift.

    Args:
        segments: Whisper segments (sentence-level chunks with timestamps)
        words: Whisper words (word-level timestamps)
        max_words: Max words per subtitle line

    Returns:
        Tuple of (subtitle_texts, subtitle_timings)
    """
    all_texts = []
    all_timings = []

    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue

        # Split this segment's text by punctuation + word count
        parts = split_text_only(text, max_words)
        if not parts:
            continue

        # Find Whisper words within this segment's time range (with small tolerance)
        seg_words = [
            w for w in words
            if w.start_ms >= seg.start_ms - 200 and w.end_ms <= seg.end_ms + 200
        ]

        # If only 1 part or no words found, use segment timing as-is
        if len(parts) == 1 or not seg_words:
            for part in parts:
                all_texts.append(part)
                all_timings.append((seg.start_ms, seg.end_ms))
            continue

        # Distribute words across parts by word count (어절 단위)
        part_word_counts = [max(len(p.split()), 1) for p in parts]
        total_part_words = sum(part_word_counts)

        word_idx = 0
        for i, part in enumerate(parts):
            if i == len(parts) - 1:
                # Last part gets all remaining words
                end_word_idx = len(seg_words) - 1
            else:
                expected = max(1, round(part_word_counts[i] / total_part_words * len(seg_words)))
                end_word_idx = min(word_idx + expected - 1, len(seg_words) - 1)

            if end_word_idx < word_idx:
                end_word_idx = word_idx
            if end_word_idx >= len(seg_words):
                end_word_idx = len(seg_words) - 1

            start_ms = seg_words[word_idx].start_ms
            end_ms = seg_words[end_word_idx].end_ms

            all_texts.append(part)
            all_timings.append((start_ms, end_ms))

            word_idx = end_word_idx + 1
            if word_idx >= len(seg_words):
                word_idx = len(seg_words) - 1

    return all_texts, all_timings


def ms_to_srt_time(ms: int) -> str:
    """Convert milliseconds to SRT timestamp format (HH:MM:SS,mmm)."""
    hours = ms // 3600000
    minutes = (ms % 3600000) // 60000
    seconds = (ms % 60000) // 1000
    millis = ms % 1000
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"


def split_text_only(text: str, max_words: int = 9) -> list[str]:
    """Split a single text by punctuation first, then by word count. Returns list of segments."""
    text = text.strip()
    if not text:
        return []

    result = []
    _split_text_recursive(text, max_words, result)
    return result


def _split_text_recursive(text: str, max_words: int, out: list):
    """Recursively split text by punctuation then word count (text only, no timing)."""
    text = text.strip()
    if not text:
        return

    # Priority 1: Split on punctuation
    parts = _split_on_punctuation(text)
    if parts:
        for part in parts:
            _split_text_recursive(part, max_words, out)
        return

    # Priority 2: No punctuation — split at word boundary if too long
    words = text.split()
    if len(words) >= max_words:
        first_part = " ".join(words[:max_words])
        second_part = " ".join(words[max_words:])
        out.append(first_part)
        _split_text_recursive(second_part, max_words, out)
        return

    out.append(text)


def split_narration_texts(lines: list[str], max_words: int = 9) -> list[str]:
    """
    Split narration lines into subtitle segments (text only, no timing).

    Priority 1: Split on punctuation (.!?,) regardless of word count.
    Priority 2: If no punctuation, split at word 9 when 9+ words.

    Use this BEFORE map_narration_to_words() for accurate Whisper-based timing.

    Args:
        lines: List of narration text lines
        max_words: Maximum words per subtitle line (default: 9)

    Returns:
        List of split subtitle text segments
    """
    all_segments = []
    for line in lines:
        segments = split_text_only(line, max_words)
        all_segments.extend(segments)
    return all_segments


def split_long_subtitle_lines(
    lines: list[str],
    line_timings: list[tuple[int, int]],
    max_words: int = 9,
) -> tuple[list[str], list[tuple[int, int]]]:
    """
    Split subtitle lines using punctuation-first strategy.

    Priority 1: Split on punctuation (.!?,) regardless of word count.
    Priority 2: If no punctuation, split at word 9 when 9+ words.

    NOTE: For better timing accuracy, prefer split_narration_texts() + map_narration_to_words().
    This function uses proportional character timing which drifts on long segments.

    Args:
        lines: List of subtitle text lines
        line_timings: List of (start_ms, end_ms) for each line
        max_words: Maximum words before forced split (default: 9)

    Returns:
        Tuple of (split_lines, split_timings)
    """
    new_lines = []
    new_timings = []

    for line, timing in zip(lines, line_timings):
        _split_subtitle(line, timing[0], timing[1], max_words, new_lines, new_timings)

    return new_lines, new_timings


PUNCTUATION_MARKS = {'.', ',', '!', '?'}


def _split_on_punctuation(text: str) -> list[str] | None:
    """Split text on punctuation marks. Returns list of parts or None if no punctuation found."""
    parts = []
    current = []

    for char in text:
        current.append(char)
        if char in PUNCTUATION_MARKS:
            part = "".join(current).strip()
            if part:
                parts.append(part)
            current = []

    # Remaining text after last punctuation
    remainder = "".join(current).strip()
    if remainder:
        parts.append(remainder)

    # Only return if we actually split (found punctuation)
    if len(parts) > 1:
        return parts
    return None


def _split_subtitle(
    text: str,
    start_ms: int,
    end_ms: int,
    max_words: int,
    out_lines: list,
    out_timings: list,
):
    """Split a subtitle line: first by punctuation, then by word count."""
    text = text.strip()
    if not text:
        return

    # Priority 1: Split on punctuation
    parts = _split_on_punctuation(text)
    if parts:
        duration = end_ms - start_ms
        total_chars = len(text)
        current_ms = start_ms

        for i, part in enumerate(parts):
            if i < len(parts) - 1:
                ratio = len(part) / total_chars if total_chars > 0 else 1.0 / len(parts)
                part_end_ms = current_ms + int(duration * ratio)
            else:
                part_end_ms = end_ms

            # Recursively process each part (may need word-count split)
            _split_subtitle(part, current_ms, part_end_ms, max_words, out_lines, out_timings)
            current_ms = part_end_ms
        return

    # Priority 2: No punctuation — split at word 9 if 9+ words
    words = text.split()
    if len(words) >= max_words:
        first_part = " ".join(words[:max_words])
        second_part = " ".join(words[max_words:])

        duration = end_ms - start_ms
        total_chars = len(text)
        first_ratio = len(first_part) / total_chars if total_chars > 0 else 0.5
        split_ms = start_ms + int(duration * first_ratio)

        out_lines.append(first_part)
        out_timings.append((start_ms, split_ms))

        # Recursively handle the remainder (might still be 9+ words)
        _split_subtitle(second_part, split_ms, end_ms, max_words, out_lines, out_timings)
        return

    # Under limits — keep as-is
    out_lines.append(text)
    out_timings.append((start_ms, end_ms))


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
