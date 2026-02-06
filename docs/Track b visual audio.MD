# 트랙 B: 시각 + 오디오 기반 (Visual & Audio Foundation)

## 개요

이 문서는 Layer MVP(트랙 A)와 **병렬로 진행 가능한** 시각 품질 및 오디오 레이어 개발 항목을 정의한다. Layer MVP가 "무엇을 어떻게 배치할지"를 다룬다면, 트랙 B는 "얼마나 보기 좋고 듣기 좋게 만들지"를 다룬다.

### 왜 병렬 진행이 가능한가
- 배경/테마/이펙트 → 현재 `background: "#1a1a2e"` 필드를 확장하면 됨, 씬 템플릿 불필요
- BGM/SFX → 오디오 트랙에 독립적으로 추가, 레이아웃과 무관
- 텍스트 타이포그래피 → Remotion 렌더러 수정만으로 가능
- 트랜지션 → 씬 간 전환 로직은 레이아웃과 독립

### 의존 관계
```
트랙 A (Layer MVP)     트랙 B (이 문서)
카메라 프리셋          배경 시스템
레이아웃 프리셋        컬러 테마
타이밍 프리셋          시각 이펙트
씬 템플릿              텍스트 타이포그래피
                       씬 트랜지션
                       BGM 시스템
                       SFX 시스템
                       TTS 품질 향상
                       오디오 믹싱
        ↓ 합류 ↓
    트랙 C (지능형 자동화)
```

---

## B-1. 배경 시스템 (Background System)

### 현재 상태
- 단색 `#1a1a2e` 고정, 씬 간 변화 없음

### 개발 항목

**① 정적 배경**
| 타입 | 설명 | 우선순위 |
|------|------|----------|
| solid | 단색 (현재) | ✅ 완료 |
| gradient_linear | 선형 그라데이션 | 🔴 높음 |
| gradient_radial | 원형 그라데이션 | 🔴 높음 |
| pattern_dots | 도트 패턴 | 🟡 중간 |
| pattern_grid | 격자 패턴 | 🟡 중간 |
| pattern_noise | 노이즈 텍스처 | 🟢 낮음 |

**② 동적 배경**
| 타입 | 설명 | 우선순위 |
|------|------|----------|
| gradient_shift | 색상이 서서히 변하는 그라데이션 | 🔴 높음 |
| particles_float | 떠다니는 파티클 (원, 사각형) | 🟡 중간 |
| particles_rise | 아래→위로 올라가는 파티클 | 🟡 중간 |
| wave | 물결 배경 | 🟢 낮음 |
| starfield | 별이 빛나는 배경 | 🟢 낮음 |

**③ 씬 배경 전환**
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| per_scene_color | 씬별 다른 배경색 | 🔴 높음 |
| color_transition | 씬 전환 시 배경색 보간 | 🔴 높음 |
| theme_palette | 테마에서 자동 배경색 선택 | 🟡 중간 |

### schema.ts 확장
```typescript
// 기존 (하위 호환 유지)
interface Scene {
  background: string;                     // "#1a1a2e"
}

// 확장
interface Scene {
  background: string | BackgroundDef;     // string이면 기존 단색
}

interface BackgroundDef {
  type: "solid" | "gradient_linear" | "gradient_radial" | "pattern" | "animated";
  colors: string[];                       // 그라데이션용 색상 배열
  angle?: number;                         // 선형 그라데이션 각도 (기본 180)
  pattern?: string;                       // 패턴 이름
  animation?: {
    type: string;                         // "shift" | "particles" | "wave"
    speed?: number;                       // 1.0 = 기본
    density?: number;                     // 파티클 밀도
  };
}
```

### 개발 순서
1. `gradient_linear` + `gradient_radial` 구현
2. `per_scene_color` + `color_transition` 구현
3. `gradient_shift` 동적 배경 구현
4. `pattern_dots` + `pattern_grid` 구현
5. 파티클 배경 구현
6. 특수 배경 (wave, starfield)

---

## B-2. 컬러 테마 시스템 (Color Theme)

### 현재 상태
- `dark_infographic` 1개 테마 하드코딩

### 테마 목록

| 테마명 | 배경 | 텍스트 | 강조 | 보조 | 우선순위 |
|--------|------|--------|------|------|----------|
| dark_infographic | #1a1a2e | #FFFFFF | #FFD700 | #4FC3F7 | ✅ 완료 |
| dark_warm | #1a1a1a | #F5F5F5 | #FF6B35 | #FFC857 | 🔴 높음 |
| dark_cool | #0d1b2a | #E0E1DD | #00B4D8 | #90E0EF | 🔴 높음 |
| dark_neon | #0a0a0a | #FFFFFF | #39FF14 | #FF00FF | 🔴 높음 |
| light_clean | #F8F9FA | #212529 | #0066FF | #6C757D | 🟡 중간 |
| light_warm | #FFF8E7 | #2D2D2D | #E85D04 | #FAA307 | 🟡 중간 |
| pastel | #F0E6FF | #333333 | #7B68EE | #FF69B4 | 🟡 중간 |
| corporate | #FFFFFF | #1A1A1A | #0052CC | #36B37E | 🟢 낮음 |
| retro | #2B2D42 | #EDF2F4 | #EF233C | #8D99AE | 🟢 낮음 |
| nature | #1B4332 | #D8F3DC | #95D5B2 | #52B788 | 🟢 낮음 |

### 테마 데이터 구조
```typescript
interface ColorTheme {
  name: string;
  background: {
    primary: string;
    secondary: string;           // 그라데이션 보조색
    surface: string;             // 카드/박스 배경
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;              // 강조 텍스트
  };
  highlight: string;             // 자막 하이라이트 색
  stickman: string;              // 스틱맨 색상
  accent: string[];              // 아이콘, 도형 등에 순환 적용
}
```

### 마크다운 사용법
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
style: dark_cool
---
```

### 개발 순서
1. `ColorTheme` 인터페이스 + 테마 JSON 파일 구조 확정
2. dark 계열 3개 테마 구현 (dark_warm, dark_cool, dark_neon)
3. 테마가 모든 오브젝트에 자동 적용되도록 렌더러 수정
4. light 계열 3개 테마 추가
5. 특수 테마 추가 (corporate, retro, nature)

---

## B-3. 시각 이펙트 (Visual Effects)

### 현재 상태
- 이펙트 없음

### 이펙트 목록

| 이펙트 | 대상 | 설명 | 우선순위 |
|--------|------|------|----------|
| glow | 텍스트, 아이콘 | 외부 발광 효과 | 🔴 높음 |
| drop_shadow | 모든 오브젝트 | 그림자 | 🔴 높음 |
| text_outline | 텍스트 | 외곽선 (가독성 향상) | 🔴 높음 |
| blur_background | 배경 | 배경 블러 (콘텐츠 강조) | 🟡 중간 |
| vignette | 전체 화면 | 가장자리 어둡게 | 🟡 중간 |
| spotlight | 특정 영역 | 원형 하이라이트 | 🟡 중간 |
| screen_shake | 전체 화면 | 흔들림 (충격/놀람) | 🟡 중간 |
| color_pop | 특정 오브젝트 | 특정 요소만 컬러, 나머지 회색조 | 🟢 낮음 |
| motion_blur | 이동 오브젝트 | 이동 시 잔상 | 🟢 낮음 |

### schema.ts 확장
```typescript
interface VisualEffect {
  type: string;
  target?: string;               // 오브젝트 ID 또는 "scene"
  intensity?: number;            // 0~1, 기본 0.5
  color?: string;                // 이펙트 색상 (glow 등)
  startMs?: number;              // 이펙트 시작 시점 (없으면 씬 전체)
  endMs?: number;
}

interface Scene {
  // ... 기존 필드
  effects?: VisualEffect[];
}
```

### 개발 순서
1. `glow` + `drop_shadow` + `text_outline` (CSS/SVG 필터 기반, 빠른 구현)
2. `vignette` (전체 화면 오버레이)
3. `blur_background` + `spotlight`
4. `screen_shake` (transform 기반)
5. `color_pop` + `motion_blur` (고급)

---

## B-4. 텍스트 타이포그래피 (Typography)

### 현재 상태
- 단일 폰트, 단일 스타일, 구분 없음

### 개발 항목

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 스타일 구분 | title(큰/bold) / body(기본) / number(monospace) / highlight_box(박스) | 🔴 높음 |
| 강조 스타일 | 형광펜 하이라이트, 밑줄 애니메이션, 색상 강조 | 🔴 높음 |
| 텍스트 박스 | 반투명 배경 카드 위에 텍스트 배치 | 🔴 높음 |
| 커스텀 폰트 | 한글 웹폰트 (Pretendard, Noto Sans KR) | 🟡 중간 |
| 수식 렌더링 | LaTeX → SVG 변환 | 🟢 낮음 |
| 코드 블록 | 신택스 하이라이트 | 🟢 낮음 |

### 마크다운 확장 문법
```markdown
[text: "복리의 마법", title]                  ← 큰 제목 스타일
[text: "단리는 원금에만 이자", body]           ← 본문 스타일
[text: "761만원", number]                     ← 숫자 강조 (monospace, 큰 사이즈)
[text: "핵심 포인트!", highlight_box]          ← 반투명 박스 안 강조
```

### 텍스트 스타일 정의
```typescript
interface TextStyle {
  role: "title" | "body" | "number" | "highlight_box" | "caption";
  fontSize: number;
  fontWeight: "normal" | "bold" | "black";
  fontFamily?: string;
  color: string;                  // 테마에서 자동 결정
  background?: {
    color: string;
    padding: number;
    borderRadius: number;
    opacity: number;
  };
  decoration?: "none" | "underline_animated" | "highlight_marker";
}
```

### 개발 순서
1. title/body/number/highlight_box 4개 스타일 정의 + `AnimatedText.tsx` 수정
2. 형광펜/밑줄 강조 애니메이션 구현
3. 텍스트 박스(반투명 카드) 컴포넌트
4. 커스텀 폰트 로딩 시스템
5. 수식/코드 특수 렌더링

---

## B-5. 씬 트랜지션 (Scene Transition)

### 현재 상태
- fadeIn / fadeOut만 존재

### 트랜지션 목록

| 트랜지션 | 설명 | 우선순위 |
|---------|------|----------|
| fade | 페이드 인/아웃 | ✅ 완료 |
| crossfade | 이전 씬 위에 다음 씬 오버랩 페이드 | 🔴 높음 |
| wipe_left | 왼→오 와이프 | 🔴 높음 |
| wipe_right | 오→왼 와이프 | 🔴 높음 |
| slide_push | 이전 씬을 밀어내며 등장 | 🔴 높음 |
| wipe_up | 아래→위 와이프 | 🟡 중간 |
| dissolve | 픽셀 단위 디졸브 | 🟡 중간 |
| zoom_through | 줌인하면서 다음 씬으로 | 🟡 중간 |
| morph | 오브젝트 모핑 전환 | 🟢 낮음 |
| glitch | 글리치 이펙트 전환 | 🟢 낮음 |

### schema.ts 확장
```typescript
// 기존
type TransitionType = "fadeIn" | "fadeOut" | "none";

// 확장
type TransitionType = 
  | "fadeIn" | "fadeOut" | "none"
  | "crossfade" | "wipe_left" | "wipe_right" | "wipe_up"
  | "slide_push" | "dissolve" | "zoom_through" | "morph" | "glitch";
```

### 개발 순서
1. `crossfade` (두 씬 오버랩 → 가장 자연스러운 기본 전환)
2. `wipe_left` + `wipe_right` + `slide_push`
3. `wipe_up` + `dissolve`
4. `zoom_through`
5. `morph` + `glitch` (특수)

---

## B-6. BGM 시스템 (Background Music)

### 현재 상태
- BGM 없음, TTS 나레이션만 존재

### 기능 로드맵

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| bgm_play | 지정된 BGM 파일 재생 | 🔴 높음 |
| auto_ducking | 나레이션 시 BGM 자동 감소 (→ 30%) | 🔴 높음 |
| fade_in_out | BGM 시작/끝 페이드 (2초/3초) | 🔴 높음 |
| loop | BGM 루프 재생 + 이음새 처리 | 🔴 높음 |
| multi_track | 씬별 다른 BGM (크로스페이드 전환) | 🟡 중간 |
| mood_match | 씬 분위기 자동 BGM 선택 | 🟢 낮음 (트랙 C 연계) |

### BGM 라이브러리 (로열티 프리)

| 무드 | 용도 | 목표 수량 | 우선순위 |
|------|------|----------|----------|
| upbeat_light | 도입, 긍정적 내용 | 3곡 | 🔴 높음 |
| calm_ambient | 설명, 중립적 내용 | 3곡 | 🔴 높음 |
| inspiring | 결론, CTA | 2곡 | 🔴 높음 |
| tense | 경고, 위험 | 2곡 | 🟡 중간 |
| playful | 재미있는 예시 | 2곡 | 🟡 중간 |
| dramatic | 강조, 놀라운 수치 | 2곡 | 🟡 중간 |
| corporate | 비즈니스/기업 | 2곡 | 🟢 낮음 |

### 마크다운 사용법
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
style: dark_infographic
bgm: calm_ambient
bgm_volume: 0.3
---
```

### schema.ts 확장
```typescript
interface VideoProject {
  meta: {
    // ... 기존 필드
    bgm?: {
      src: string;               // BGM 파일 경로
      volume: number;            // 0~1, 기본 0.3
      duckingLevel: number;      // 나레이션 중 볼륨, 기본 0.1
      fadeInMs: number;          // 시작 페이드, 기본 2000
      fadeOutMs: number;         // 종료 페이드, 기본 3000
    };
  };
}
```

### Remotion 구현 핵심
```tsx
// MainVideo.tsx
<Audio src={bgmSrc} volume={(frame) => {
  const isNarrating = checkNarrationAtFrame(frame, words);
  const baseVolume = meta.bgm.volume;
  const duckVolume = meta.bgm.duckingLevel;
  
  // 부드러운 전환 (100ms 페이드)
  return smoothTransition(isNarrating ? duckVolume : baseVolume, frame);
}} />
```

### 개발 순서
1. `<Audio>` 컴포넌트로 BGM 재생 + 루프
2. 볼륨 커브 함수 구현 (ducking)
3. 시작/끝 페이드 인/아웃
4. 마크다운 파서에서 `bgm` 필드 파싱
5. BGM 라이브러리 8곡 확보 (upbeat 3 + calm 3 + inspiring 2)
6. 멀티 트랙 크로스페이드

---

## B-7. 효과음 시스템 (SFX)

### 현재 상태
- SFX 없음

### 자동 SFX 매핑 규칙

| 트리거 이벤트 | 효과음 | 우선순위 |
|-------------|--------|----------|
| 씬 전환 | whoosh (슉) | 🔴 높음 |
| 텍스트 등장 (popIn) | 가벼운 pop | 🔴 높음 |
| 카운터 시작 | chime (띠링) | 🔴 높음 |
| 카운터 완료 | tada (짠!) | 🔴 높음 |
| 강조 씬 진입 | impact (붐) | 🟡 중간 |
| 경고/주의 씬 | alert | 🟡 중간 |
| 스틱맨 등장 | footstep / 등장음 | 🟡 중간 |
| 아이콘 등장 | notification | 🟡 중간 |
| 화면 흔들림 | rumble | 🟡 중간 |

### SFX 라이브러리 목표

| 단계 | 수량 | 커버리지 |
|------|------|---------|
| 1차 | 8개 | 기본 전환/등장음 |
| 2차 | 20개 | 씬 유형별 전용음 |
| 3차 | 40개 | 세밀한 상황별 매칭 |

### schema.ts 확장
```typescript
interface SFXTrigger {
  event: "scene_transition" | "object_enter" | "object_exit" |
         "counter_start" | "counter_end" | "emphasis" | "warning";
  src: string;
  volume?: number;               // 0~1, 기본 0.5
  delayMs?: number;              // 트리거 후 딜레이
}

interface Scene {
  // ... 기존 필드
  sfx?: SFXTrigger[];            // 수동 지정
  autoSfx?: boolean;             // true면 이벤트 기반 자동 매핑 (기본 true)
}
```

### 개발 순서
1. SFX 재생 컴포넌트 구현 (Remotion `<Audio>` 기반)
2. 이벤트 → SFX 자동 매핑 엔진
3. 기본 SFX 8개 확보 (whoosh, pop, chime, tada 등)
4. scene.json에서 수동 SFX 오버라이드 지원
5. SFX 라이브러리 20개로 확장

---

## B-8. TTS 품질 향상

### 현재 상태
- Edge TTS, 단일 음성 (ko-KR-HyunsuNeural), 고정 속도

### 개발 항목

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 속도 조절 | 강조 구간 느리게, 나열 구간 빠르게 | 🔴 높음 |
| 쉼표 처리 | 문장 사이 자연스러운 간격 | 🔴 높음 |
| SSML 지원 | 강세, 발음, 속도 세밀 제어 | 🟡 중간 |
| 멀티 보이스 | 남성/여성 음성 교차 (대화 장면) | 🟡 중간 |
| 고급 TTS 엔진 | OpenAI TTS / ElevenLabs 옵션 | 🟢 낮음 |
| 감정 TTS | 기쁨/슬픔/놀람 감정 반영 | 🟢 낮음 |

### 마크다운 확장 문법 (제안)
```markdown
안녕하세요! 오늘은 복리에 대해 알아보겠습니다.

무려... [pause: 500] 761만원이 됩니다! [rate: slow]

시간은 복리의 가장 강력한 무기입니다. [emphasis: strong]
```

### Edge TTS SSML 예시
```xml
<speak>
  <prosody rate="-10%">
    무려
  </prosody>
  <break time="500ms"/>
  <prosody rate="-20%" pitch="+5%">
    칠백육십일만원이 됩니다!
  </prosody>
</speak>
```

### 개발 순서
1. 문장 간 pause 자동 삽입 (마침표 후 300ms, 쉼표 후 150ms)
2. `[pause: N]` 마크다운 태그 파싱 + TTS 반영
3. `[rate: slow/fast]` 속도 조절
4. SSML 변환 레이어 구현
5. 멀티 보이스 지원 (캐릭터별 음성)
6. 고급 TTS 엔진 어댑터

---

## B-9. 오디오 믹싱 파이프라인

### 현재 상태
- TTS 단일 오디오 트랙, 믹싱 없음

### 믹싱 파이프라인
```
[TTS 나레이션] ──┐
                  ├──→ [오디오 믹서] ──→ [최종 오디오 트랙]
[BGM] ───────────┤        ↑
                  │    볼륨 커브
[SFX 이벤트] ────┘    (ducking, fade)
```

### 기능 목록

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 볼륨 노멀라이즈 | TTS 출력 볼륨 일정하게 | 🔴 높음 |
| BGM 덕킹 커브 | 나레이션 시작/끝에 부드러운 볼륨 전환 | 🔴 높음 |
| SFX 타이밍 동기화 | scene.json 타이밍에 맞춰 SFX 삽입 | 🔴 높음 |
| 마스터링 | 리미터, 컴프레서 적용 | 🟡 중간 |
| 라우드니스 표준화 | YouTube 권장 -14 LUFS 맞춤 | 🟡 중간 |

### 구현 방식 선택
```
옵션 A: Remotion 내부 처리 (현재 구조)
  - <Audio> 컴포넌트 여러 개로 믹싱
  - 장점: 추가 의존성 없음
  - 단점: 세밀한 오디오 처리 어려움

옵션 B: Python에서 사전 믹싱 (ffmpeg/pydub)
  - 파이프라인에서 최종 오디오 트랙 생성 후 Remotion에 전달
  - 장점: 오디오 처리 자유도 높음, 라우드니스 표준화 가능
  - 단점: 파이프라인 복잡도 증가

권장: 옵션 A로 시작 → 한계 도달 시 옵션 B로 전환
```

### 개발 순서
1. Remotion 내 다중 `<Audio>` 구현 (TTS + BGM)
2. 덕킹 볼륨 커브 함수
3. SFX 이벤트 → `<Audio>` 동적 생성
4. (필요 시) Python ffmpeg 기반 사전 믹싱으로 전환
5. 라우드니스 표준화

---

## B-10. 에러 검증 (Validation)

> 트랙 A/B 모든 작업에서 공통으로 필요한 검증 시스템

### 검증 항목

| 항목 | 에러 메시지 예시 | 우선순위 |
|------|-----------------|----------|
| 미존재 포즈 | "scene_03: 'dancing' 포즈 없음. 사용 가능: standing, ..." | 🔴 높음 |
| 미존재 아이콘 | "scene_04: 'rocket' 아이콘 없음. 유사: 'chart-up'" | 🔴 높음 |
| 미존재 테마 | "style: 'ocean' 테마 없음. 사용 가능: dark_infographic, ..." | 🔴 높음 |
| 오디오 초과 | "오디오 25MB 초과. 자동 압축 진행..." | 🔴 높음 |
| 오브젝트 겹침 | "scene_05: 텍스트와 카운터 영역 80% 중복" | 🟡 중간 |
| 씬 너무 짧음 | "scene_02: 0.5초 — 최소 1.5초 권장" | 🟡 중간 |
| 씬 너무 김 | "scene_07: 15초 — 분할 권장" | 🟡 중간 |
| BGM 미존재 | "bgm: 'jazz' 없음. 사용 가능: calm_ambient, ..." | 🔴 높음 |

### 구현 위치
```python
# pipeline.py에 validation 단계 추가

def validate_scene_json(scene_data: dict) -> list[Warning]:
    """scene.json 생성 후, Remotion 전달 전에 검증"""
    warnings = []
    
    for scene in scene_data["scenes"]:
        for obj in scene["objects"]:
            if obj["type"] == "stickman":
                if obj["props"]["pose"] not in VALID_POSES:
                    warnings.append(...)
            if obj["type"] == "icon":
                if obj["props"]["name"] not in VALID_ICONS:
                    warnings.append(...)
    
    return warnings
```

---

## 개발 우선순위 종합 (트랙 B 내부)

### 1차 (즉시 시작 가능 — 임팩트 최대)
| 항목 | 이유 |
|------|------|
| BGM + 덕킹 (B-6) | 추가만으로 영상 완성도 체감 2배 |
| 그라데이션 배경 (B-1) | 단색 → 그라데이션만으로 시각 품질 대폭 향상 |
| 씬별 배경색 변화 (B-1) | 단조로움 해소의 핵심 |
| 기본 SFX 8개 (B-7) | 씬 전환/등장 시 소리가 있으면 생동감 |
| 텍스트 스타일 구분 (B-4) | title vs body 구분만으로 가독성 향상 |
| 에러 검증 (B-10) | 잘못된 포즈/아이콘 입력 시 즉시 피드백 |

### 2차 (1차 완료 후)
| 항목 | 이유 |
|------|------|
| 컬러 테마 3개 추가 (B-2) | 다크 3종 → 영상별 분위기 차별화 |
| crossfade + wipe 트랜지션 (B-5) | 씬 전환 다양화 |
| glow + shadow 이펙트 (B-3) | 시각적 깊이감 |
| TTS 쉼/속도 조절 (B-8) | 나레이션 자연스러움 향상 |
| 텍스트 박스 + 강조 (B-4) | 핵심 메시지 부각 |

### 3차 (2차 완료 후)
| 항목 | 이유 |
|------|------|
| 파티클 배경 (B-1) | 프리미엄 느낌 |
| 추가 테마 + light 계열 (B-2) | 다양한 장르 대응 |
| SFX 20개 확장 (B-7) | 세밀한 연출 |
| SSML + 멀티 보이스 (B-8) | 고급 오디오 연출 |
| 오디오 마스터링 (B-9) | 유튜브 표준 맞춤 |
| 특수 트랜지션 (B-5) | morph, glitch 등 |
| 특수 이펙트 (B-3) | spotlight, color_pop 등 |