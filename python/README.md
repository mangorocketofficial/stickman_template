# Python Pipeline - Development Complete

> **Branch**: `feat/python-pipeline`
> **Commit**: `9653e80`
> **Date**: 2026-02-04

## Overview

마크다운 스크립트를 입력받아 Remotion 렌더링을 위한 `scene.json`, 오디오 파일, 자막 파일을 생성하는 Python 파이프라인 구현 완료.

## Module Structure

```
python/
├── pipeline.py           # CLI 엔트리 포인트
├── script_parser.py      # Markdown 스크립트 파서
├── tts_generator.py      # Edge TTS 래퍼
├── alignment.py          # Groq Whisper API 래퍼
├── scene_builder.py      # scene.json 생성기
├── subtitle_generator.py # SRT + word JSON 생성기
├── requirements.txt      # 의존성
└── utils/
    ├── __init__.py
    └── audio_utils.py    # 오디오 변환 유틸리티
```

## Module Details

### 1. script_parser.py
- YAML frontmatter 파싱 (title, voice, style)
- Scene directive 파싱: `[stickman: pose, expression]`, `[text: "content"]`, etc.
- Narration 텍스트 추출

**Output**: `ParsedScript` dataclass

### 2. tts_generator.py
- Edge TTS 비동기 래퍼
- 기본 음성: `ko-KR-HyunsuNeural` (한국어 남성)
- Rate, volume, pitch 조절 가능

**Output**: MP3/WAV 오디오 파일

### 3. alignment.py
- Groq Whisper API (`whisper-large-v3-turbo`) 연동
- Word-level + segment-level timestamps 추출
- 25MB 초과시 자동 MP3 변환

**Output**: `AlignmentResult` (words, segments, duration)

### 4. scene_builder.py
- DEV_SPEC.md 스키마 준수 scene.json 생성
- 5가지 auto-layout 패턴:
  - `stickman_only`: 중앙 배치
  - `stickman_text`: 좌측 스틱맨 + 우측 텍스트
  - `stickman_text_counter`: 3단 레이아웃
  - `stickman_text_icon`: 아이콘 중앙 배치
  - `text_only`: 텍스트만

**Output**: `scene.json`

### 5. subtitle_generator.py
- SRT 파일 생성 (segment 기반)
- Word-level JSON 생성 (Remotion overlay용)

**Output**: `captions.srt`, `words.json`

### 6. pipeline.py
- 전체 파이프라인 오케스트레이션
- CLI 인터페이스 제공

## Usage

```bash
# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
export GROQ_API_KEY="your-groq-api-key"

# 전체 파이프라인 실행
python pipeline.py ../scripts/sample_compound_interest.md -o ./output

# TTS 스킵 (기존 오디오 사용)
python pipeline.py script.md --skip-tts

# Alignment 스킵 (추정 타이밍 사용)
python pipeline.py script.md --skip-alignment
```

## Output Structure

```
output/
├── scene.json           # Remotion 입력 파일
├── audio/
│   └── tts_output.mp3   # TTS 오디오
└── subtitles/
    ├── captions.srt     # YouTube용 자막
    └── words.json       # Word-level timestamps
```

## scene.json Schema Compliance

DEV_SPEC.md Section 5에 정의된 스키마 100% 준수:

- `meta`: title, fps, width, height, audioSrc
- `subtitles`: src, style (fontSize, color, position, highlightColor)
- `scenes[]`: id, startMs, endMs, background, transition, objects[]
- `objects[]`: id, type, position, props, animation

## Test Results

**Sample Script**: `scripts/sample_compound_interest.md`

| Scene | Duration | Objects |
|-------|----------|---------|
| intro | 1.65s | stickman (standing, happy) |
| concept | 4.05s | stickman (explaining), text |
| formula | 2.45s | stickman (pointing_right), text, counter |
| conclusion | 3.0s | stickman (celebrating), icon |

## Integration Notes

Remotion 프로젝트와 통합 시:

```bash
# Output을 Remotion public 폴더로 복사
cp -r output/* ../remotion/public/

# Remotion 렌더링
cd ../remotion
npx remotion render src/index.ts MainVideo --output=./out/final.mp4
```

## Dependencies

```
edge-tts>=6.1.0    # Microsoft Edge TTS
groq>=0.4.0        # Groq API client
pydub>=0.25.1      # Audio manipulation (optional, fallback to ffmpeg)
```

## Known Limitations

1. Groq API 25MB 파일 크기 제한 → 자동 MP3 변환으로 해결
2. Section-to-word 매핑은 비례 분배 방식 (fuzzy matching 미구현)
3. 한국어 전용 (다국어 지원 시 voice 설정 변경 필요)

## Next Steps

- [ ] Remotion `feat/remotion-core` 브랜치와 통합 테스트
- [ ] StickMan `feat/stickman-component` 브랜치와 통합 테스트
- [ ] End-to-end 파이프라인 검증
