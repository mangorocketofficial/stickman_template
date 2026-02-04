# Remotion Core - 개발 완료 문서

## 개요

`feat/remotion-core` 브랜치에서 Remotion 비디오 렌더링 프레임워크를 구현 완료했습니다.

**작업 기간:** 2024-02-04
**브랜치:** `feat/remotion-core`
**커밋:** `c290c43`

---

## 구현 범위

DEV_SPEC.md의 Agent 2 담당 범위를 모두 구현했습니다:

| 항목 | 상태 | 파일 |
|------|------|------|
| Remotion 프로젝트 설정 | ✅ | `package.json`, `tsconfig.json`, `remotion.config.ts` |
| MainVideo.tsx | ✅ | `src/MainVideo.tsx` |
| SceneRenderer.tsx | ✅ | `src/SceneRenderer.tsx` |
| ObjectRenderer.tsx | ✅ | `src/ObjectRenderer.tsx` |
| AnimatedText.tsx | ✅ | `src/components/AnimatedText.tsx` |
| Counter.tsx | ✅ | `src/components/Counter.tsx` |
| Shape.tsx | ✅ | `src/components/Shape.tsx` |
| IconElement.tsx | ✅ | `src/components/IconElement.tsx` |
| SubtitleOverlay.tsx | ✅ | `src/components/SubtitleOverlay.tsx` |
| timing.ts | ✅ | `src/utils/timing.ts` |
| layout.ts | ✅ | `src/utils/layout.ts` |
| Animation presets | ✅ | `src/animations/` |

---

## 파일 구조

```
remotion/
├── package.json                 # Dependencies (Remotion v4, React 18)
├── tsconfig.json                # TypeScript 설정
├── remotion.config.ts           # Remotion CLI 설정
├── .gitignore                   # Node.js / Remotion 무시 패턴
│
├── public/                      # Static assets
│   ├── scene.json               # 테스트용 mock scene 데이터
│   ├── audio/.gitkeep           # TTS 오디오 (Python pipeline에서 생성)
│   └── subtitles/
│       └── words.json           # 테스트용 word-level timestamps
│
└── src/
    ├── index.ts                 # Entry point + Composition 등록
    ├── MainVideo.tsx            # 최상위 컴포지션 (audio + scenes + subtitles)
    ├── SceneRenderer.tsx        # 단일 Scene 렌더러 (background + transitions)
    ├── ObjectRenderer.tsx       # Object type → Component 라우팅
    │
    ├── types/
    │   └── schema.ts            # VideoProject, Scene, SceneObject 등 타입 정의
    │
    ├── components/
    │   ├── AnimatedText.tsx     # 텍스트 + 애니메이션
    │   ├── Counter.tsx          # 숫자 카운터 애니메이션
    │   ├── Shape.tsx            # arrow, line, circle, rectangle
    │   ├── IconElement.tsx      # 인라인 SVG 아이콘
    │   ├── SubtitleOverlay.tsx  # Word-level 하이라이트 자막
    │   └── StickMan/
    │       └── StickManPlaceholder.tsx  # Agent 3 통합 전 placeholder
    │
    ├── animations/
    │   ├── index.ts             # Animation type exports
    │   ├── enter.ts             # Enter 애니메이션 (8종)
    │   ├── during.ts            # During 애니메이션 (6종)
    │   └── exit.ts              # Exit 애니메이션 (1종)
    │
    └── utils/
        ├── timing.ts            # msToFrames, framesToMs 등
        └── layout.ts            # Auto-layout 포지션 헬퍼
```

---

## 구현된 애니메이션

### Enter Animations (8종)

| 이름 | 설명 | 기본 duration |
|------|------|--------------|
| `fadeIn` | Opacity 0→1 | 500ms |
| `fadeInUp` | Opacity + translateY 30→0 | 600ms |
| `slideLeft` | 왼쪽에서 슬라이드 | 500ms |
| `slideRight` | 오른쪽에서 슬라이드 | 500ms |
| `popIn` | Spring 기반 scale 0→1 | 400ms |
| `typewriter` | 글자 하나씩 타이핑 | 1000ms |
| `drawLine` | Shape 점진적 그리기 | 800ms |
| `none` | 즉시 표시 | 0ms |

### During Animations (6종)

| 이름 | 설명 | cycle |
|------|------|-------|
| `floating` | Y축 ±5px 진동 | 2000ms |
| `pulse` | Scale 0.98~1.02 진동 | 1500ms |
| `breathing` | 미세한 torso 회전 | 2000ms |
| `nodding` | 머리 끄덕임 0→15→0° | 600ms |
| `waving` | 팔 흔들기 ±30° | 500ms |
| `walkCycle` | 걷기 모션 (legs + arms) | 800ms |

### Exit Animations (1종)

| 이름 | 설명 | 기본 duration |
|------|------|--------------|
| `fadeOut` | Opacity 1→0 | 300ms |
| `none` | Scene transition에서 처리 | 0ms |

---

## 컴포넌트 상세

### AnimatedText

텍스트 렌더링 + 애니메이션 지원

```tsx
props: {
  content: string;
  fontSize?: number;      // default: 48
  fontWeight?: "normal" | "bold";
  color?: string;         // default: "#FFFFFF"
  maxWidth?: number;      // default: 800
  align?: "left" | "center" | "right";
}
```

- Typewriter 효과: 커서 + 글자 하나씩 표시
- 한글 word-break 지원 (`word-break: keep-all`)

### Counter

숫자 카운터 애니메이션

```tsx
props: {
  from: number;
  to: number;
  format?: "number" | "currency_krw" | "currency_usd" | "percent";
  fontSize?: number;      // default: 64
  color?: string;         // default: "#FFFFFF"
}
```

- Ease-out 곡선으로 자연스러운 카운팅
- Intl.NumberFormat으로 로케일 포맷팅
- 통화 기호 (₩, $) 자동 적용

### Shape

도형 렌더링 (SVG 기반)

```tsx
props: {
  shape: "arrow" | "line" | "circle" | "rectangle";
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  width?: number;
  height?: number;
  color?: string;         // default: "#FFFFFF"
  strokeWidth?: number;   // default: 3
  fill?: boolean;         // default: false
}
```

- `drawLine` 애니메이션 지원 (점진적 그리기)
- Arrow는 80% 진행 후 화살촉 표시

### IconElement

SVG 아이콘 렌더링

```tsx
props: {
  name: string;           // 아이콘 식별자
  size?: number;          // default: 80
  color?: string;         // default: "#FFFFFF"
}
```

내장 아이콘 (8종):
- `money-bag`, `chart-up`, `piggy-bank`, `lightbulb`
- `warning`, `clock`, `star`, `check`

외부 아이콘: `public/icons/{name}.svg`에서 로드

### SubtitleOverlay

Word-level 하이라이트 자막

- 현재 단어 ±3단어 컨텍스트 표시
- 현재 단어 하이라이트 (색상 + bold)
- 반투명 배경 박스
- 위치: top / center / bottom

---

## 유틸리티 함수

### timing.ts

```typescript
msToFrames(ms: number, fps: number): number
framesToMs(frames: number, fps: number): number
getDurationInFrames(startMs: number, endMs: number, fps: number): number
getCurrentTimeMs(frame: number, fps: number): number
getRelativeFrame(currentFrame: number, sceneStartFrame: number): number
isWithinRange(currentFrame: number, startMs: number, endMs: number, fps: number): boolean
getProgress(currentFrame: number, startFrame: number, durationFrames: number): number
```

### layout.ts

```typescript
// 레이아웃 패턴 감지
detectLayoutPattern(objects: SceneObject[]): LayoutPattern

// 자동 포지션 계산
getAutoLayoutPosition(objectType, pattern, index): { x, y }

// Safe area 체크 및 clamp
isWithinSafeArea(x, y, width, height): boolean
clampToSafeArea(x, y, width, height): { x, y }
```

5가지 레이아웃 패턴:
1. `stickman_only` - 스틱맨 중앙
2. `stickman_text` - 스틱맨 좌측, 텍스트 우측
3. `stickman_text_counter` - 스틱맨 좌측, 텍스트 상단, 카운터 중앙
4. `stickman_text_icon` - 스틱맨 좌측, 아이콘 중앙, 텍스트 하단
5. `text_only` - 텍스트 중앙

---

## 테스트 데이터

### scene.json

4개 Scene으로 구성된 "복리의 마법" 테스트 비디오:

1. **scene_intro** (0-4초): 스틱맨 등장
2. **scene_concept** (4-12초): 단리 vs 복리 설명
3. **scene_formula** (12-20초): 복리 공식 + 카운터
4. **scene_conclusion** (20-26초): 마무리 + 아이콘

### words.json

37개 단어의 word-level timestamp

---

## 실행 방법

```bash
# 의존성 설치
cd remotion
npm install

# Remotion Studio 실행 (미리보기)
npm start

# 비디오 렌더링
npm run build
# 또는
npx remotion render src/index.ts MainVideo --output=./out/final.mp4
```

---

## 통합 대기 항목

### Agent 3 (feat/stickman-component)

현재 `StickManPlaceholder.tsx`로 대체되어 있음.

통합 시 필요한 작업:
1. `StickMan.tsx` → `ObjectRenderer.tsx`에서 import 변경
2. Pose, Expression props 연결
3. Motion presets (breathing, nodding, waving) 연결

### Agent 1 (feat/python-pipeline)

Python pipeline에서 생성하는 파일:
- `public/audio/tts_output.wav` - TTS 오디오
- `public/scene.json` - 실제 Scene 데이터
- `public/subtitles/words.json` - 실제 word timestamps

---

## 알려진 제한사항

1. **오디오 없음**: 테스트 데이터에 오디오 파일이 없어 미리보기 시 무음
2. **StickMan Placeholder**: 실제 포즈/모션 없이 기본 스틱맨만 표시
3. **아이콘 제한**: 8종 내장 아이콘만 지원, 추가 시 IconElement.tsx 수정 필요

---

## 다음 단계

1. **feat/stickman-component 머지** → 실제 StickMan 컴포넌트 적용
2. **feat/python-pipeline 머지** → 실제 scene.json 생성
3. **feat/integration** → End-to-end 테스트
4. **main 머지** → 최종 릴리스

---

*작성일: 2024-02-04*
*작성자: Claude Opus 4.5 (Agent 2: Remotion Core)*
