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
├── subtitle_generator.py
└── thumbnail.py        # YouTube thumbnail generator

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

## Thumbnail Generation
```bash
python python/thumbnail.py <배경이미지> "줄1" "줄2" "줄3" [-o 출력경로]
# 예: python python/thumbnail.py remotion/public/images/scene_39.png "화장품학" "핵심개념" "총정리"
```

| 항목 | 값 |
|------|-----|
| 캔버스 | 1280×720 (YouTube 표준) |
| 폰트 | 맑은고딕 Bold (`malgunbd.ttf`) 80px |
| 텍스트 색상 | `#FFFFFF` |
| 배경 박스 | 하나의 통합 박스에 모든 텍스트 포함 |
| 박스 색상 | `#1A1A2E`, opacity 220/255, border-radius 10px |
| 박스 패딩 | 좌우 24px, 상하 24px |
| 줄 간격 | 6px |
| 텍스트 정렬 | 박스 내 우측 정렬 |
| 배치 | 우측 상단 (margin-right 50, margin-top 50) |
| 텍스트 줄 수 | 1~4줄 |

## Test Output
- 해상도: 1920 × 1080
- 코덱: H.264 + AAC
- 재생시간: 36.3초
- 파일크기: 2.6 MB

---

## Recent Updates (2026-02-05)

### Commits
| Hash | Description |
|------|-------------|
| `4ff2b8d` | fix: improve subtitle timing with proportional character counting |
| `cfe3225` | Initial commit: MVP complete stickman video automation |

### Fixed Issues
1. **Scene 2+ 오브젝트 렌더링 안됨**
   - 원인: `useCurrentFrame()`이 Sequence 내에서 상대 프레임 반환
   - 해결: `SceneRenderer.tsx`에서 `sceneStartFrame={0}` 사용

2. **자막 타이밍 10초 이상 차이**
   - 원인: Whisper가 "72를"을 "70일을"로 잘못 인식 → 단어 매칭 실패
   - 해결: `alignment.py`에서 비례 문자 카운팅 방식으로 변경

### Key Technical Notes
- **Remotion Sequence 내 프레임**: `useCurrentFrame()`은 Sequence 시작 기준 0부터 시작하는 상대 프레임 반환
- **자막 동기화**: 스크립트 문자 비율로 Whisper 단어 타임스탬프 매핑
- **환경변수**: `.env` 파일에서 `python-dotenv`로 로드 (Windows 호환)

### Current Working State
- 파이프라인 정상 작동
- 31개 씬, 59개 자막 라인 동기화 완료
- Remotion Studio: `cd remotion && npm start` → http://localhost:3000
