"""
TTS Generator Module
Generates speech audio from text using Edge TTS.
"""

import asyncio
import os
from pathlib import Path

import edge_tts


# Default TTS configuration
DEFAULT_VOICE = "ko-KR-HyunsuNeural"  # Korean male voice
DEFAULT_RATE = "+0%"  # Normal speed
DEFAULT_VOLUME = "+0%"  # Normal volume
DEFAULT_PITCH = "+0Hz"  # Normal pitch


async def generate_tts_async(
    text: str,
    output_path: str,
    voice: str = DEFAULT_VOICE,
    rate: str = DEFAULT_RATE,
    volume: str = DEFAULT_VOLUME,
    pitch: str = DEFAULT_PITCH,
) -> str:
    """
    Generate TTS audio asynchronously.

    Args:
        text: Text to convert to speech
        output_path: Path to save the audio file
        voice: Edge TTS voice ID
        rate: Speech rate (e.g., "+10%", "-20%")
        volume: Volume adjustment
        pitch: Pitch adjustment

    Returns:
        Path to the generated audio file
    """
    # Ensure output directory exists
    output_dir = os.path.dirname(output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    # Create TTS communicate object
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        volume=volume,
        pitch=pitch,
    )

    # Generate and save audio
    await communicate.save(output_path)

    return output_path


def generate_tts(
    text: str,
    output_path: str,
    voice: str = DEFAULT_VOICE,
    rate: str = DEFAULT_RATE,
    volume: str = DEFAULT_VOLUME,
    pitch: str = DEFAULT_PITCH,
) -> str:
    """
    Generate TTS audio synchronously.

    Args:
        text: Text to convert to speech
        output_path: Path to save the audio file
        voice: Edge TTS voice ID
        rate: Speech rate (e.g., "+10%", "-20%")
        volume: Volume adjustment
        pitch: Pitch adjustment

    Returns:
        Path to the generated audio file
    """
    return asyncio.run(generate_tts_async(
        text=text,
        output_path=output_path,
        voice=voice,
        rate=rate,
        volume=volume,
        pitch=pitch,
    ))


async def list_voices_async(language_filter: str = None) -> list[dict]:
    """
    List available Edge TTS voices.

    Args:
        language_filter: Optional language code to filter (e.g., "ko")

    Returns:
        List of voice dictionaries
    """
    voices = await edge_tts.list_voices()

    if language_filter:
        voices = [v for v in voices if v.get("Locale", "").startswith(language_filter)]

    return voices


def list_voices(language_filter: str = None) -> list[dict]:
    """
    List available Edge TTS voices synchronously.

    Args:
        language_filter: Optional language code to filter (e.g., "ko")

    Returns:
        List of voice dictionaries
    """
    return asyncio.run(list_voices_async(language_filter))


def get_korean_voices() -> list[dict]:
    """Get all Korean voices available in Edge TTS."""
    return list_voices("ko")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        if sys.argv[1] == "--list-voices":
            # List all Korean voices
            voices = get_korean_voices()
            print("Available Korean voices:")
            for v in voices:
                print(f"  {v['ShortName']}: {v.get('Gender', 'Unknown')}")
        else:
            # Generate TTS from text
            text = sys.argv[1]
            output_path = sys.argv[2] if len(sys.argv) > 2 else "output.mp3"
            voice = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_VOICE

            print(f"Generating TTS with voice: {voice}")
            result = generate_tts(text, output_path, voice=voice)
            print(f"Audio saved to: {result}")
    else:
        print("Usage:")
        print("  python tts_generator.py <text> [output_path] [voice]")
        print("  python tts_generator.py --list-voices")
