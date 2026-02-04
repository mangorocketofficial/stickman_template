"""
Audio Utilities Module
Provides audio format conversion and manipulation functions.
"""

import os
import subprocess
from pathlib import Path

# Try to import pydub, fall back to ffmpeg CLI if not available
try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False


def convert_to_mp3(
    input_path: str,
    output_path: str = None,
    bitrate: str = "128k",
) -> str:
    """
    Convert audio file to MP3 format.

    Args:
        input_path: Path to input audio file
        output_path: Path for output MP3 (default: same name with .mp3)
        bitrate: MP3 bitrate (default: "128k")

    Returns:
        Path to the converted MP3 file
    """
    if output_path is None:
        output_path = str(Path(input_path).with_suffix('.mp3'))

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    if PYDUB_AVAILABLE:
        # Use pydub
        audio = AudioSegment.from_file(input_path)
        audio.export(output_path, format="mp3", bitrate=bitrate)
    else:
        # Fall back to ffmpeg CLI
        cmd = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-acodec", "libmp3lame",
            "-b:a", bitrate,
            output_path
        ]
        subprocess.run(cmd, check=True, capture_output=True)

    return output_path


def convert_to_wav(
    input_path: str,
    output_path: str = None,
    sample_rate: int = 44100,
    channels: int = 2,
) -> str:
    """
    Convert audio file to WAV format.

    Args:
        input_path: Path to input audio file
        output_path: Path for output WAV (default: same name with .wav)
        sample_rate: Sample rate in Hz (default: 44100)
        channels: Number of channels (default: 2 for stereo)

    Returns:
        Path to the converted WAV file
    """
    if output_path is None:
        output_path = str(Path(input_path).with_suffix('.wav'))

    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)

    if PYDUB_AVAILABLE:
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(sample_rate).set_channels(channels)
        audio.export(output_path, format="wav")
    else:
        cmd = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-ar", str(sample_rate),
            "-ac", str(channels),
            output_path
        ]
        subprocess.run(cmd, check=True, capture_output=True)

    return output_path


def get_audio_duration(audio_path: str) -> float:
    """
    Get the duration of an audio file in seconds.

    Args:
        audio_path: Path to audio file

    Returns:
        Duration in seconds
    """
    if PYDUB_AVAILABLE:
        audio = AudioSegment.from_file(audio_path)
        return len(audio) / 1000.0  # pydub returns milliseconds
    else:
        # Use ffprobe
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            audio_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())


def get_audio_duration_ms(audio_path: str) -> int:
    """
    Get the duration of an audio file in milliseconds.

    Args:
        audio_path: Path to audio file

    Returns:
        Duration in milliseconds
    """
    return int(get_audio_duration(audio_path) * 1000)


def get_file_size_mb(file_path: str) -> float:
    """
    Get file size in megabytes.

    Args:
        file_path: Path to file

    Returns:
        File size in MB
    """
    return os.path.getsize(file_path) / (1024 * 1024)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        output_format = sys.argv[2] if len(sys.argv) > 2 else "mp3"

        print(f"Input file: {input_file}")
        print(f"File size: {get_file_size_mb(input_file):.2f} MB")
        print(f"Duration: {get_audio_duration(input_file):.2f} seconds")

        if output_format == "mp3":
            output = convert_to_mp3(input_file)
            print(f"Converted to: {output}")
        elif output_format == "wav":
            output = convert_to_wav(input_file)
            print(f"Converted to: {output}")
    else:
        print("Usage: python audio_utils.py <input_file> [mp3|wav]")
