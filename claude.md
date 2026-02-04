# Stickman Infographic Video Automation

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

## Branch Structure (Parallel Development)
```
main                          ← stable base
├── feat/python-pipeline      ← Python pipeline (TTS, alignment, scene builder)
├── feat/remotion-core        ← Remotion project + scene renderer
└── feat/stickman-component   ← StickMan component + poses + motions
```

## Key Files
- `DEV_SPEC.md` - 전체 개발 명세서
- `python/` - Python 파이프라인
- `remotion/` - Remotion 비디오 프로젝트
- `scripts/` - 입력 스크립트

## MVP Scope
- StickMan: 8 poses, 4 motions, 5 expressions
- Objects: stickman, text, icon, shape, counter
- Animations: 8 enter, 4 during, 1 exit
- Auto-layout: 5 patterns

## Environment Variables
```
GROQ_API_KEY=your-groq-api-key
```

## Commands
```bash
# Full pipeline
python python/pipeline.py scripts/sample.md

# Remotion render
npx remotion render src/index.ts MainVideo --output=./out/final.mp4
```
