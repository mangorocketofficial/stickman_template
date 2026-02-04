# Stickman Video Automation - 통합 계획서

## 개요

| 항목 | 내용 |
|------|------|
| 작성일 | 2026-02-04 |
| 작성자 | Claude Opus 4.5 |
| 목표 | 3개 feature 브랜치를 통합하여 End-to-end 파이프라인 완성 |

---

## 1. 브랜치 현황

### 1.1 통합 대상 브랜치

| 브랜치 | 담당 | 커밋 | 테스트 | 주요 산출물 |
|-------|------|------|--------|------------|
| `feat/python-pipeline` | Agent 1 | `9653e80` | PASS | script_parser, tts_generator, alignment, scene_builder, subtitle_generator |
| `feat/stickman-component` | Agent 3 | `18d1ff3` | PASS | StickMan.tsx, poses, motions, expressions, interpolation |
| `feat/remotion-core` | Agent 2 | `7293276` | PASS | MainVideo, SceneRenderer, ObjectRenderer, animations, components |

### 1.2 Worktree 위치

```
C:\Users\User\Desktop\
├── Lazy_Stick_Man\          [master] - 메인 저장소 (통합 진행)
├── stickman-python\         [feat/python-pipeline]
├── stickman-remotion\       [feat/remotion-core]
└── stickman-stickman\       [feat/stickman-component]
```

---

## 2. 통합 순서

### Phase 1: 브랜치 생성
```bash
git checkout -b feat/integration
```

### Phase 2: 순차 머지

#### Step 1: feat/stickman-component 머지
```bash
git merge feat/stickman-component --no-ff -m "merge: feat/stickman-component into integration"
```

**머지 대상 파일:**
```
remotion/src/components/StickMan/
├── StickMan.tsx
├── Joint.tsx
├── Face.tsx
├── skeleton.ts
├── poses.ts
├── motions.ts
├── expressions.ts
├── interpolation.ts
└── index.ts
```

#### Step 2: feat/remotion-core 머지
```bash
git merge feat/remotion-core --no-ff -m "merge: feat/remotion-core into integration"
```

**머지 대상 파일:**
```
remotion/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── src/
│   ├── index.tsx
│   ├── MainVideo.tsx
│   ├── SceneRenderer.tsx
│   ├── ObjectRenderer.tsx
│   ├── components/
│   │   ├── AnimatedText.tsx
│   │   ├── Counter.tsx
│   │   ├── Shape.tsx
│   │   ├── IconElement.tsx
│   │   ├── SubtitleOverlay.tsx
│   │   └── StickMan/StickManPlaceholder.tsx  ← 충돌 예상
│   ├── animations/
│   └── utils/
└── public/
```

**예상 충돌:**
- `remotion/src/components/StickMan/` 디렉토리
- StickManPlaceholder.tsx vs 실제 StickMan 컴포넌트

#### Step 3: feat/python-pipeline 머지
```bash
git merge feat/python-pipeline --no-ff -m "merge: feat/python-pipeline into integration"
```

**머지 대상 파일:**
```
python/
├── pipeline.py
├── script_parser.py
├── tts_generator.py
├── alignment.py
├── scene_builder.py
├── subtitle_generator.py
└── utils/
    └── audio_utils.py
```

**예상 충돌:** 없음 (디렉토리 분리)

---

## 3. 코드 통합 작업

### 3.1 StickManPlaceholder → StickMan 교체

**작업 위치:** `remotion/src/ObjectRenderer.tsx`

**변경 전:**
```tsx
import { StickManPlaceholder } from './components/StickMan/StickManPlaceholder';

// ...
case 'stickman':
  return <StickManPlaceholder ... />;
```

**변경 후:**
```tsx
import { StickMan } from './components/StickMan';

// ...
case 'stickman':
  return <StickMan ... />;
```

### 3.2 Props 매핑 확인

| scene.json props | StickMan props | 비고 |
|-----------------|----------------|------|
| `props.pose` | `pose` | string (preset name) |
| `props.expression` | `expression` | string (preset name) |
| `props.color` | `color` | default: "#FFFFFF" |
| `props.lineWidth` | `lineWidth` | default: 3 |
| `object.position` | `position` | { x, y } |
| `object.scale` | `scale` | default: 1 |
| `animation.during.type` | `motion` | breathing, nodding, etc. |

---

## 4. End-to-End 테스트 계획

### 4.1 테스트 스크립트
`scripts/sample_compound_interest.md` (복리의 마법)

### 4.2 테스트 단계

#### Step 1: Python Pipeline 실행
```bash
cd python
python pipeline.py ../scripts/sample_compound_interest.md --output-dir ../remotion/public
```

**예상 출력:**
```
remotion/public/
├── scene.json
├── audio/tts_output.mp3
└── subtitles/
    ├── captions.srt
    └── words.json
```

#### Step 2: Remotion 렌더링
```bash
cd remotion
npm install
npm run build
```

**예상 출력:**
```
remotion/out/final.mp4
```

### 4.3 검증 항목

| 항목 | 검증 방법 |
|------|----------|
| scene.json 생성 | 파일 존재 + JSON 파싱 |
| 오디오 파일 | ffprobe로 duration 확인 |
| 비디오 렌더링 | ffprobe로 해상도/코덱 확인 |
| StickMan 포즈 | 비디오에서 시각적 확인 |
| 자막 동기화 | 비디오에서 시각적 확인 |
| 전체 재생시간 | 오디오 duration과 일치 |

---

## 5. 예상 이슈 및 대응

### 5.1 머지 충돌

| 파일 | 예상 충돌 | 대응 |
|------|----------|------|
| StickMan/ 디렉토리 | remotion-core의 placeholder vs stickman-component | stickman-component 우선 |
| types/schema.ts | 두 브랜치에서 수정 가능 | 수동 병합 |

### 5.2 런타임 이슈

| 이슈 | 원인 | 대응 |
|------|------|------|
| GROQ_API_KEY 없음 | 환경변수 미설정 | .env 파일 확인 |
| npm 패키지 충돌 | 버전 불일치 | npm install 재실행 |
| TypeScript 타입 오류 | 스키마 불일치 | types/schema.ts 동기화 |

---

## 6. 롤백 계획

### 머지 실패 시
```bash
git merge --abort
```

### 머지 후 문제 발생 시
```bash
git reset --hard HEAD~1
```

### 완전 롤백
```bash
git checkout master
git branch -D feat/integration
```

---

## 7. 완료 기준

- [ ] 3개 브랜치 머지 완료
- [ ] StickManPlaceholder → StickMan 교체 완료
- [ ] Python pipeline 실행 성공 (scene.json 생성)
- [ ] Remotion 렌더링 성공 (final.mp4 생성)
- [ ] 출력 비디오 검증 (해상도, 코덱, 재생시간)
- [ ] main 브랜치로 머지

---

## 8. 타임라인

| 단계 | 예상 작업 |
|------|----------|
| 1 | feat/integration 브랜치 생성 |
| 2 | 3개 브랜치 순차 머지 |
| 3 | 충돌 해결 + 코드 통합 |
| 4 | npm install + 빌드 테스트 |
| 5 | Python pipeline 실행 |
| 6 | Remotion 렌더링 |
| 7 | 결과 검증 |
| 8 | main 머지 (승인 후) |

---

*작성: Claude Opus 4.5*
*일자: 2026-02-04*
