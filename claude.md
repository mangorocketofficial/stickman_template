# Stickman Infographic Video Automation

## Project Status: MVP Complete

| 항목 | 상태 |
|------|------|
| 개발 완료일 | 2026-02-04 |
| 브랜치 | master |
| 총 코드 | +6,150 lines |

## Project Overview
마크다운 스크립트를 입력받아 스틱맨 캐릭터가 등장하는 인포그래픽 스타일 유튜브 영상을 자동 생성하는 파이프라인

## Core Philosophy
- **MVP First**: 최소 기능으로 동작하는 영상 생성
- **Modular Architecture**: 각 컴포넌트 독립적 교체 가능
- **Automation Over Editing**: Script in → Video out (JSON으로 수동 조정)
- **Audio is Truth**: 모든 타이밍은 오디오 기준

## Tech Stack
| Layer | Technology |
|-------|------------|
| TTS | Edge TTS (`ko-KR-HyunsuNeural`) |
| Speech Alignment | Groq Whisper API (`whisper-large-v3-turbo`) |
| Video Rendering | Remotion v4 (React + TypeScript) |
| Encoding | ffmpeg (H.264, AAC) |

## Target Output
- **Input**: Markdown script
- **Output**: `final.mp4` (1080p, H.264) + `captions.srt`
- **Duration**: 3-5분 영상
- **Style**: Dark-themed infographic with white stickman

## Key Documentation
- `DEV_SPEC.md` - 전체 개발 명세서
- `INTEGRATION_PLAN.md` - 통합 계획서
- `INTEGRATION_COMPLETE.md` - 통합 완료 보고서

## Project Structure
```
python/                 # Python Pipeline
├── pipeline.py         # CLI entry point
├── script_parser.py    # Markdown parser
├── tts_generator.py    # Edge TTS
├── alignment.py        # Groq Whisper
├── scene_builder.py    # scene.json generator
└── subtitle_generator.py

remotion/               # Remotion Project
├── src/
│   ├── index.tsx       # Entry point
│   ├── MainVideo.tsx
│   ├── SceneRenderer.tsx
│   ├── ObjectRenderer.tsx
│   └── components/
│       ├── StickMan/   # 8 poses, 4 motions, 5 expressions
│       ├── AnimatedText.tsx
│       ├── Counter.tsx
│       ├── Shape.tsx
│       ├── IconElement.tsx
│       └── SubtitleOverlay.tsx
└── out/
    └── final.mp4       # Output video
```

## MVP Features
- **StickMan**: 8 poses, 4 motions, 5 expressions
- **Objects**: stickman, text, icon, shape, counter
- **Animations**: 8 enter, 6 during, 1 exit
- **Auto-layout**: 5 patterns
- **Subtitles**: Word-level highlight

## Environment Variables
```
GROQ_API_KEY=your-groq-api-key
```

## Quick Start
```bash
# 1. Set environment
export GROQ_API_KEY="your-key"

# 2. Run Python pipeline
python python/pipeline.py scripts/sample_compound_interest.md --output-dir remotion/public

# 3. Render video
cd remotion && npm install && npm run build
# → out/final.mp4
```

## Test Output
- 해상도: 1920 × 1080
- 코덱: H.264 + AAC
- 재생시간: 36.3초
- 파일크기: 2.6 MB
