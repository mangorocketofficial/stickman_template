"""
Audio Alignment Module
Uses Groq Whisper API to get word-level timestamps from audio.
"""

import os
from dataclasses import dataclass
from pathlib import Path

from groq import Groq


@dataclass
class WordTimestamp:
    """A single word with its timing information."""
    word: str
    start: float  # seconds
    end: float  # seconds

    @property
    def start_ms(self) -> int:
        """Start time in milliseconds."""
        return int(self.start * 1000)

    @property
    def end_ms(self) -> int:
        """End time in milliseconds."""
        return int(self.end * 1000)


@dataclass
class SegmentTimestamp:
    """A segment (sentence/phrase) with timing."""
    text: str
    start: float  # seconds
    end: float  # seconds

    @property
    def start_ms(self) -> int:
        return int(self.start * 1000)

    @property
    def end_ms(self) -> int:
        return int(self.end * 1000)


@dataclass
class AlignmentResult:
    """Complete alignment result from Whisper."""
    text: str
    words: list[WordTimestamp]
    segments: list[SegmentTimestamp]
    duration_ms: int


def align_audio(
    audio_path: str,
    language: str = "ko",
    api_key: str = None,
) -> AlignmentResult:
    """
    Align audio using Groq Whisper API to get word-level timestamps.

    Args:
        audio_path: Path to the audio file (WAV, MP3, etc.)
        language: Language code (default: "ko" for Korean)
        api_key: Groq API key (defaults to GROQ_API_KEY env var)

    Returns:
        AlignmentResult with words and segments
    """
    # Get API key
    if api_key is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise ValueError(
                "GROQ_API_KEY environment variable not set. "
                "Please set it or pass api_key parameter."
            )

    # Initialize Groq client
    client = Groq(api_key=api_key)

    # Check file size - Groq has 25MB limit
    file_size = os.path.getsize(audio_path)
    max_size = 25 * 1024 * 1024  # 25MB

    if file_size > max_size:
        # Need to convert to MP3 first
        from utils.audio_utils import convert_to_mp3

        mp3_path = audio_path.rsplit('.', 1)[0] + '_compressed.mp3'
        audio_path = convert_to_mp3(audio_path, mp3_path)
        print(f"Converted to MP3 for Groq API: {mp3_path}")

    # Call Groq Whisper API
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=(os.path.basename(audio_path), audio_file.read()),
            model="whisper-large-v3-turbo",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
            language=language,
        )

    # Parse response
    words = []
    if hasattr(transcription, 'words') and transcription.words:
        for w in transcription.words:
            words.append(WordTimestamp(
                word=w.word if hasattr(w, 'word') else w.get('word', ''),
                start=w.start if hasattr(w, 'start') else w.get('start', 0),
                end=w.end if hasattr(w, 'end') else w.get('end', 0),
            ))

    segments = []
    if hasattr(transcription, 'segments') and transcription.segments:
        for s in transcription.segments:
            segments.append(SegmentTimestamp(
                text=s.text if hasattr(s, 'text') else s.get('text', ''),
                start=s.start if hasattr(s, 'start') else s.get('start', 0),
                end=s.end if hasattr(s, 'end') else s.get('end', 0),
            ))

    # Calculate total duration
    duration_ms = 0
    if words:
        duration_ms = words[-1].end_ms
    elif segments:
        duration_ms = segments[-1].end_ms

    return AlignmentResult(
        text=transcription.text if hasattr(transcription, 'text') else '',
        words=words,
        segments=segments,
        duration_ms=duration_ms,
    )


def split_into_sentences(text: str) -> list[str]:
    """
    Split text into sentences by sentence-ending punctuation (. ? !).

    Args:
        text: Text to split

    Returns:
        List of sentences
    """
    import re

    if not text:
        return []

    # Split by sentence endings, keeping the punctuation
    # Pattern: split after . ? ! but handle edge cases like numbers
    sentences = re.split(r'(?<=[.?!])\s+', text.strip())

    # Filter empty strings and strip whitespace
    return [s.strip() for s in sentences if s.strip()]


def normalize_korean(text: str) -> str:
    """Normalize Korean text for matching."""
    import re
    # Remove spaces and common punctuation
    text = re.sub(r'[\s,.!?\'\"~·…]+', '', text)
    return text


def map_narration_to_words(
    narration_sections: list[str],
    words: list[WordTimestamp],
) -> list[tuple[int, int]]:
    """
    Map narration sections to word timestamps using sequential character counting.

    This approach counts characters through Whisper words sequentially,
    which is more robust than word matching when Whisper mishears words.

    Args:
        narration_sections: List of narration texts for each section
        words: Word timestamps from alignment

    Returns:
        List of (start_ms, end_ms) tuples for each section
    """
    if not words:
        return [(0, 0) for _ in narration_sections]

    if not narration_sections:
        return []

    # Calculate total characters in script vs audio
    total_script_chars = sum(len(normalize_korean(n)) for n in narration_sections if n.strip())
    total_audio_chars = sum(len(normalize_korean(w.word)) for w in words)

    # Build cumulative character counts for words
    word_char_cumsum = []
    cumsum = 0
    for w in words:
        word_char_cumsum.append(cumsum)
        cumsum += len(normalize_korean(w.word))

    result = []
    script_char_offset = 0

    for i, narration in enumerate(narration_sections):
        if not narration.strip():
            prev_end = result[-1][1] if result else words[0].start_ms
            result.append((prev_end, prev_end))
            continue

        narr_norm = normalize_korean(narration)
        narr_chars = len(narr_norm)

        # Find start word: character position in script -> proportional position in audio
        script_ratio = script_char_offset / total_script_chars if total_script_chars > 0 else 0
        target_audio_chars = int(script_ratio * total_audio_chars)

        # Find the word at this character position
        start_word_idx = 0
        for j, cc in enumerate(word_char_cumsum):
            if cc >= target_audio_chars:
                start_word_idx = max(0, j - 1)
                break
            start_word_idx = j

        # Find end word
        end_script_chars = script_char_offset + narr_chars
        end_ratio = end_script_chars / total_script_chars if total_script_chars > 0 else 1
        target_end_chars = int(end_ratio * total_audio_chars)

        end_word_idx = start_word_idx
        for j, cc in enumerate(word_char_cumsum):
            if cc >= target_end_chars:
                end_word_idx = max(start_word_idx, j - 1)
                break
            end_word_idx = j

        # Ensure we have at least one word
        if end_word_idx < start_word_idx:
            end_word_idx = start_word_idx

        # Get timestamps
        start_ms = words[start_word_idx].start_ms
        end_ms = words[end_word_idx].end_ms

        # For the last section, extend to audio end
        if i == len(narration_sections) - 1:
            end_ms = words[-1].end_ms

        result.append((start_ms, end_ms))
        script_char_offset += narr_chars

    return result


def map_sentences_to_words(
    sentences: list[str],
    words: list[WordTimestamp],
) -> list[tuple[int, int]]:
    """
    Map individual sentences to word timestamps.

    Args:
        sentences: List of sentences (one per subtitle)
        words: Word timestamps from alignment

    Returns:
        List of (start_ms, end_ms) tuples for each sentence
    """
    return map_narration_to_words(sentences, words)


if __name__ == "__main__":
    import sys
    import json

    if len(sys.argv) > 1:
        audio_path = sys.argv[1]
        print(f"Aligning audio: {audio_path}")

        result = align_audio(audio_path)

        print(f"\nTranscription: {result.text[:100]}...")
        print(f"Total words: {len(result.words)}")
        print(f"Total segments: {len(result.segments)}")
        print(f"Duration: {result.duration_ms}ms")

        # Print first few words
        print("\nFirst 10 words:")
        for word in result.words[:10]:
            print(f"  {word.start_ms:6d}ms - {word.end_ms:6d}ms: {word.word}")

        # Save full result
        output_path = audio_path.rsplit('.', 1)[0] + '_alignment.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'text': result.text,
                'words': [{'word': w.word, 'start_ms': w.start_ms, 'end_ms': w.end_ms}
                          for w in result.words],
                'segments': [{'text': s.text, 'start_ms': s.start_ms, 'end_ms': s.end_ms}
                             for s in result.segments],
                'duration_ms': result.duration_ms,
            }, f, ensure_ascii=False, indent=2)
        print(f"\nAlignment saved to: {output_path}")
    else:
        print("Usage: python alignment.py <audio_file>")
