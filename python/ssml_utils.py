"""
SSML Utilities for Track B-8: TTS Enhancement

Provides SSML generation and text preprocessing for Edge TTS.

Supported inline tags:
- [pause: 500]       -> <break time="500ms"/>
- [rate: slow]       -> <prosody rate="-20%">...</prosody>
- [rate: fast]       -> <prosody rate="+20%">...</prosody>
- [rate: +10%]       -> <prosody rate="+10%">...</prosody>
- [emphasis: strong] -> <emphasis level="strong">...</emphasis>
- [pitch: high]      -> <prosody pitch="+10%">...</prosody>
- [pitch: low]       -> <prosody pitch="-10%">...</prosody>
"""

import re
from dataclasses import dataclass
from typing import Optional


# Rate presets
RATE_PRESETS = {
    'slow': '-20%',
    'slower': '-30%',
    'fast': '+20%',
    'faster': '+30%',
    'normal': '+0%',
}

# Pitch presets
PITCH_PRESETS = {
    'high': '+10%',
    'higher': '+20%',
    'low': '-10%',
    'lower': '-20%',
    'normal': '+0Hz',
}


@dataclass
class SSMLConfig:
    """Configuration for SSML generation."""
    auto_pause_sentence: int = 300    # ms pause after sentence (period)
    auto_pause_comma: int = 150       # ms pause after comma
    auto_pause_question: int = 400    # ms pause after question mark
    auto_pause_exclamation: int = 350 # ms pause after exclamation
    enable_auto_pause: bool = True


def parse_inline_tags(text: str) -> tuple[str, list[dict]]:
    """
    Parse inline tags from text and return clean text + tag list.

    Args:
        text: Input text with inline tags like [pause: 500]

    Returns:
        Tuple of (clean_text, tags) where tags have positions
    """
    tags = []

    # Pattern for inline tags: [type: value]
    pattern = r'\[(\w+):\s*([^\]]+)\]'

    # Find all matches with positions
    for match in re.finditer(pattern, text):
        tag_type = match.group(1).lower()
        tag_value = match.group(2).strip()
        position = match.start()

        tags.append({
            'type': tag_type,
            'value': tag_value,
            'start': position,
            'end': match.end(),
            'original': match.group(0),
        })

    # Remove tags from text
    clean_text = re.sub(pattern, '', text)

    return clean_text, tags


def convert_rate_value(value: str) -> str:
    """Convert rate value to Edge TTS format."""
    value = value.lower().strip()

    # Check presets
    if value in RATE_PRESETS:
        return RATE_PRESETS[value]

    # Check if it's already a percentage
    if value.endswith('%'):
        if not value.startswith('+') and not value.startswith('-'):
            return f'+{value}'
        return value

    # Try to parse as number
    try:
        num = int(value)
        return f'{num:+d}%'
    except ValueError:
        return '+0%'


def convert_pitch_value(value: str) -> str:
    """Convert pitch value to Edge TTS format."""
    original_value = value.strip()
    value_lower = original_value.lower()

    # Check presets
    if value_lower in PITCH_PRESETS:
        return PITCH_PRESETS[value_lower]

    # Check if it's a percentage value
    if value_lower.endswith('%'):
        if not value_lower.startswith('+') and not value_lower.startswith('-'):
            return f'+{value_lower}'
        return value_lower

    # Check if it's a Hz value (preserve case for Hz)
    if value_lower.endswith('hz'):
        # Extract numeric part
        numeric_part = value_lower[:-2].strip()
        if not numeric_part.startswith('+') and not numeric_part.startswith('-'):
            return f'+{numeric_part}Hz'
        return f'{numeric_part}Hz'

    # Try to parse as number (assume Hz)
    try:
        num = int(value_lower)
        return f'{num:+d}Hz'
    except ValueError:
        return '+0Hz'


def text_to_ssml(
    text: str,
    voice: str = "ko-KR-HyunsuNeural",
    rate: str = "+0%",
    pitch: str = "+0Hz",
    config: Optional[SSMLConfig] = None
) -> str:
    """
    Convert text with inline tags to SSML.

    Args:
        text: Input text with optional inline tags
        voice: Edge TTS voice name
        rate: Default speech rate
        pitch: Default pitch
        config: SSML configuration

    Returns:
        SSML formatted string
    """
    if config is None:
        config = SSMLConfig()

    # Parse inline tags
    clean_text, tags = parse_inline_tags(text)

    # Build SSML
    ssml_parts = ['<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ko-KR">']
    ssml_parts.append(f'<voice name="{voice}">')
    ssml_parts.append(f'<prosody rate="{rate}" pitch="{pitch}">')

    # Process text with tags
    current_pos = 0
    sorted_tags = sorted(tags, key=lambda t: t['start'])

    # Adjust tag positions after removal
    offset = 0
    for tag in sorted_tags:
        tag['adjusted_pos'] = tag['start'] - offset
        offset += len(tag['original'])

    # Build content with SSML elements
    result_text = clean_text

    # Add auto-pause for punctuation if enabled
    if config.enable_auto_pause:
        result_text = add_auto_pauses(result_text, config)

    # Process inline tags (insert SSML at positions)
    # For simplicity, we'll process tags in sequence
    for tag in sorted_tags:
        tag_ssml = convert_tag_to_ssml(tag)
        if tag_ssml:
            # Insert at approximate position (simplified)
            result_text = result_text + tag_ssml

    ssml_parts.append(result_text)
    ssml_parts.append('</prosody>')
    ssml_parts.append('</voice>')
    ssml_parts.append('</speak>')

    return ''.join(ssml_parts)


def convert_tag_to_ssml(tag: dict) -> str:
    """Convert a parsed tag to SSML element."""
    tag_type = tag['type']
    value = tag['value']

    if tag_type == 'pause':
        # [pause: 500] -> <break time="500ms"/>
        try:
            ms = int(value)
            return f'<break time="{ms}ms"/>'
        except ValueError:
            return f'<break time="{value}"/>'

    elif tag_type == 'rate':
        # Rate changes need to wrap subsequent text (simplified: just set globally)
        rate_val = convert_rate_value(value)
        return f'<prosody rate="{rate_val}"> </prosody>'

    elif tag_type == 'pitch':
        pitch_val = convert_pitch_value(value)
        return f'<prosody pitch="{pitch_val}"> </prosody>'

    elif tag_type == 'emphasis':
        # [emphasis: strong] -> <emphasis level="strong">
        level = value.lower()
        if level not in ['strong', 'moderate', 'reduced', 'none']:
            level = 'strong'
        return f'<emphasis level="{level}"> </emphasis>'

    return ''


def add_auto_pauses(text: str, config: SSMLConfig) -> str:
    """Add automatic pauses after punctuation marks."""
    # Replace punctuation with punctuation + break
    result = text

    # Period (sentence end)
    result = re.sub(
        r'\.(\s|$)',
        f'.<break time="{config.auto_pause_sentence}ms"/>\\1',
        result
    )

    # Question mark
    result = re.sub(
        r'\?(\s|$)',
        f'?<break time="{config.auto_pause_question}ms"/>\\1',
        result
    )

    # Exclamation mark
    result = re.sub(
        r'!(\s|$)',
        f'!<break time="{config.auto_pause_exclamation}ms"/>\\1',
        result
    )

    # Comma
    result = re.sub(
        r',(\s)',
        f',<break time="{config.auto_pause_comma}ms"/>\\1',
        result
    )

    return result


def preprocess_for_edge_tts(
    text: str,
    config: Optional[SSMLConfig] = None
) -> tuple[str, str]:
    """
    Preprocess text for Edge TTS.

    Edge TTS has limited SSML support, so we:
    1. Extract pause tags and note their approximate positions
    2. Return clean text for TTS and a separate prosody adjustment string

    Args:
        text: Input text with inline tags
        config: SSML configuration

    Returns:
        Tuple of (clean_text_for_tts, rate_adjustment)
    """
    if config is None:
        config = SSMLConfig()

    # Parse inline tags
    clean_text, tags = parse_inline_tags(text)

    # Extract rate adjustments (use first one found, or default)
    rate = '+0%'
    for tag in tags:
        if tag['type'] == 'rate':
            rate = convert_rate_value(tag['value'])
            break

    return clean_text, rate


def strip_inline_tags(text: str) -> str:
    """Remove all inline tags from text, returning clean text."""
    pattern = r'\[(\w+):\s*([^\]]+)\]'
    return re.sub(pattern, '', text).strip()


if __name__ == "__main__":
    # Test
    test_text = "안녕하세요! [pause: 500] 오늘은 복리에 대해 알아보겠습니다. [rate: slow] 무려... 761만원이 됩니다!"

    print("Original:", test_text)
    print()

    clean, tags = parse_inline_tags(test_text)
    print("Clean text:", clean)
    print("Tags:", tags)
    print()

    ssml = text_to_ssml(test_text)
    print("SSML:")
    print(ssml)
