# 스틱맨 영상 시스템 — 장기 개발 로드맵

## 개요

이 문서는 레이어 확장 로드맵(LAYER_EXPANSION_ROADMAP.md)의 **템플릿 시스템 외** 영역을 다룬다. 템플릿이 "무엇을 보여줄지"를 정의한다면, 이 로드맵은 "얼마나 잘 보여줄지", "얼마나 쉽게 만들지", "얼마나 멀리 퍼뜨릴지"를 정의한다.

### 관계도

```
┌──────────────────────────────────────────────────────────────┐
│                    사용자가 경험하는 흐름                        │
│                                                              │
│  [스크립트 작성] → [자동화 엔진] → [렌더링] → [출력/배포]       │
│       ↑                ↑              ↑            ↑         │
│    영역 4           영역 3         영역 1,2       영역 5       │
│    UX/워크플로우     지능형 자동화    시각+오디오    출력/배포     │
│                                                              │
│                      영역 6: 확장성 (전체에 걸침)               │
└──────────────────────────────────────────────────────────────┘
```

### 개발 페이즈 개요

| 페이즈 | 기간 (예상) | 핵심 목표 |
|--------|------------|----------|
| Phase 1: Foundation | 2~3주 | 시각+오디오 기반 완성 → "볼 만한 영상" |
| Phase 2: Intelligence | 2~3주 | LLM 자동화 → "쓰기만 하면 되는 영상" |
| Phase 3: Accessibility | 3~4주 | 웹 GUI + 프리뷰 → "누구나 만드는 영상" |
| Phase 4: Scale | 4~6주 | 배포 자동화 + 확장 → "찍어내는 영상" |

---

## 영역 1: 시각 품질 (Visual Polish)

> 템플릿이 아무리 다양해도 배경이 단색이고 이펙트가 없으면 전부 비슷해 보인다.

### 현재 상태
- 배경: 단색 `#1a1a2e` 고정
- 텍스트: 단일 폰트, 단일 스타일
- 이펙트: 없음
- 트랜지션: fadeIn / fadeOut만 존재

### 1-A. 배경 시스템 (Background System)

#### 분류

**① 정적 배경 (Static)**
| 타입 | 설명 | 페이즈 |
|------|------|--------|
| solid | 단색 (현재) | ✅ 완료 |
| gradient_linear | 선형 그라데이션 | Phase 1 |
| gradient_radial | 원형 그라데이션 | Phase 1 |
| pattern_dots | 도트 패턴 | Phase 1 |
| pattern_grid | 격자 패턴 | Phase 1 |
| pattern_noise | 노이즈 텍스처 | Phase 2 |

**② 동적 배경 (Animated)**
| 타입 | 설명 | 페이즈 |
|------|------|--------|
| gradient_shift | 색상이 서서히 변하는 그라데이션 | Phase 1 |
| particles_float | 떠다니는 파티클 (원, 사각형) | Phase 2 |
| particles_rise | 아래→위로 올라가는 파티클 | Phase 2 |
| wave | 물결 배경 | Phase 3 |
| starfield | 별이 빛나는 배경 | Phase 3 |

**③ 씬 배경 전환**
| 기능 | 설명 | 페이즈 |
|------|------|--------|
| per_scene_color | 씬별 다른 배경색 | Phase 1 |
| color_transition | 씬 전환 시 배경색 보간 | Phase 1 |
| theme_palette | 테마에서 자동 배경색 선택 | Phase 2 |

#### 구현 방식
```typescript
interface BackgroundDef {
  type: "solid" | "gradient_linear" | "gradient_radial" | "pattern" | "animated";
  colors: string[];              // 그라데이션용 색상 배열
  angle?: number;                // 선형 그라데이션 각도
  pattern?: string;              // 패턴 이름
  animation?: {
    type: string;                // "shift" | "particles" | "wave"
    speed?: number;              // 1.0 = 기본
    density?: number;            // 파티클 밀도
  };
}
```

#### schema.ts 확장
```typescript
// 기존
interface Scene {
  background: string;            // hex color
}

// 확장
interface Scene {
  background: string | BackgroundDef;  // 하위 호환 유지
}
```

---

### 1-B. 컬러 테마 시스템 (Color Theme)

#### 목표: 마크다운 frontmatter에서 `style: dark_infographic` 한 줄로 전체 색상 결정

| 테마명 | 배경 | 텍스트 | 강조 | 보조 | 페이즈 |
|--------|------|--------|------|------|--------|
| dark_infographic | #1a1a2e | #FFFFFF | #FFD700 | #4FC3F7 | ✅ 완료 |
| dark_warm | #1a1a1a | #F5F5F5 | #FF6B35 | #FFC857 | Phase 1 |
| dark_cool | #0d1b2a | #E0E1DD | #00B4D8 | #90E0EF | Phase 1 |
| dark_neon | #0a0a0a | #FFFFFF | #39FF14 | #FF00FF | Phase 1 |
| light_clean | #F8F9FA | #212529 | #0066FF | #6C757D | Phase 2 |
| light_warm | #FFF8E7 | #2D2D2D | #E85D04 | #FAA307 | Phase 2 |
| pastel | #F0E6FF | #333333 | #7B68EE | #FF69B4 | Phase 2 |
| corporate | #FFFFFF | #1A1A1A | #0052CC | #36B37E | Phase 3 |
| retro | #2B2D42 | #EDF2F4 | #EF233C | #8D99AE | Phase 3 |
| nature | #1B4332 | #D8F3DC | #95D5B2 | #52B788 | Phase 3 |

#### 구현 방식
```typescript
interface ColorTheme {
  name: string;
  background: {
    primary: string;
    secondary: string;         // 그라데이션 보조색
    surface: string;           // 오브젝트 배경 (카드 등)
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;            // 강조 텍스트
  };
  highlight: string;           // 자막 하이라이트 색
  stickman: string;            // 스틱맨 색상
  accent: string[];            // 아이콘, 도형, 카운터 등에 순환 적용
}
```

---

### 1-C. 시각 이펙트 (Visual Effects)

| 이펙트 | 대상 | 설명 | 페이즈 |
|--------|------|------|--------|
| glow | 텍스트, 아이콘 | 외부 발광 효과 | Phase 1 |
| drop_shadow | 모든 오브젝트 | 그림자 | Phase 1 |
| text_outline | 텍스트 | 텍스트 외곽선 (가독성 향상) | Phase 1 |
| blur_background | 배경 | 배경 블러 (콘텐츠 강조) | Phase 2 |
| vignette | 전체 화면 | 화면 가장자리 어둡게 | Phase 2 |
| spotlight | 특정 영역 | 스포트라이트 원형 하이라이트 | Phase 2 |
| color_pop | 특정 오브젝트 | 특정 요소만 컬러, 나머지 회색조 | Phase 3 |
| motion_blur | 이동 오브젝트 | 이동 시 잔상 | Phase 3 |
| screen_shake | 전체 화면 | 충격/놀람 시 흔들림 | Phase 2 |

#### 구현 방식
```typescript
interface VisualEffect {
  type: string;
  target?: string;             // 특정 오브젝트 ID 또는 "scene"
  intensity?: number;          // 0~1, 기본 0.5
  color?: string;              // 이펙트 색상 (glow 등)
  startMs?: number;            // 이펙트 시작 시점
  endMs?: number;              // 이펙트 종료 시점
}

// Scene에 추가
interface Scene {
  effects?: VisualEffect[];
}
```

---

### 1-D. 텍스트 타이포그래피 (Typography)

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 폰트 구분 | 제목(bold/큰 사이즈) vs 본문(regular) vs 수치(monospace) | Phase 1 |
| 강조 스타일 | 형광펜 하이라이트, 밑줄 애니메이션, 색상 강조 | Phase 1 |
| 텍스트 박스 | 반투명 배경 카드 위에 텍스트 배치 | Phase 1 |
| 커스텀 폰트 | 한글 웹폰트 지원 (Pretendard, Noto Sans KR 등) | Phase 2 |
| 수식 렌더링 | LaTeX 수식 → SVG 변환 후 표시 | Phase 3 |
| 코드 블록 | 코드 신택스 하이라이트 | Phase 3 |

#### 마크다운 확장 문법 (제안)
```markdown
[text: "복리 = 원금 × (1+r)ⁿ", title]       ← 큰 제목 스타일
[text: "단리는 원금에만 이자", body]           ← 본문 스타일  
[text: "761만원", number]                     ← 숫자 강조 스타일
[text: "핵심 포인트!", highlight_box]          ← 박스 안 강조
```

---

### 1-E. 씬 트랜지션 (Scene Transition)

| 트랜지션 | 설명 | 페이즈 |
|---------|------|--------|
| fade | 페이드 인/아웃 (현재) | ✅ 완료 |
| crossfade | 이전 씬 위에 다음 씬 페이드 | Phase 1 |
| wipe_left | 왼→오 와이프 | Phase 1 |
| wipe_right | 오→왼 와이프 | Phase 1 |
| wipe_up | 아래→위 와이프 | Phase 2 |
| dissolve | 픽셀 단위 디졸브 | Phase 2 |
| zoom_through | 줌인하면서 다음 씬으로 | Phase 2 |
| morph | 오브젝트 모핑 전환 | Phase 3 |
| glitch | 글리치 이펙트 전환 | Phase 3 |
| slide_push | 이전 씬을 밀어내며 등장 | Phase 1 |

---

## 영역 2: 오디오 레이어 (Audio Layer)

> 유튜브 영상에서 소리는 절반이다. 현재 그 절반이 TTS 하나로만 채워져 있다.

### 현재 상태
- TTS: Edge TTS (ko-KR-HyunsuNeural) 1개 음성
- BGM: 없음
- SFX: 없음
- 믹싱: 없음

### 2-A. BGM 시스템 (Background Music)

#### 기능 로드맵

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| bgm_play | 지정된 BGM 파일 재생 | Phase 1 |
| auto_ducking | 나레이션 시작 시 BGM 볼륨 자동 감소 (→ 30%), 나레이션 끝나면 복귀 | Phase 1 |
| fade_in_out | BGM 시작/끝 페이드 인/아웃 | Phase 1 |
| loop | BGM 루프 재생 + 이음새 처리 | Phase 1 |
| mood_match | 씬의 분위기에 따라 BGM 자동 선택 | Phase 3 |
| multi_track | 씬별 다른 BGM (크로스페이드 전환) | Phase 2 |

#### BGM 라이브러리 (로열티 프리)

| 무드 | 용도 | 초기 목표 | 페이즈 |
|------|------|----------|--------|
| upbeat_light | 도입, 긍정적 내용 | 3곡 | Phase 1 |
| calm_ambient | 설명, 중립적 내용 | 3곡 | Phase 1 |
| inspiring | 결론, CTA | 2곡 | Phase 1 |
| tense | 경고, 위험 | 2곡 | Phase 2 |
| playful | 재미있는 예시 | 2곡 | Phase 2 |
| dramatic | 강조, 놀라운 수치 | 2곡 | Phase 2 |
| corporate | 비즈니스/기업 주제 | 2곡 | Phase 3 |

#### 마크다운 확장 문법
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
bgm: calm_ambient
bgm_volume: 0.3
---
```

#### 구현 방식
```typescript
// schema.ts 확장
interface VideoProject {
  meta: {
    // ... 기존 필드
    bgm?: {
      src: string;             // BGM 파일 경로
      volume: number;          // 0~1, 기본 0.3
      duckingLevel: number;    // 나레이션 중 볼륨, 기본 0.1
      fadeInMs: number;        // 시작 페이드, 기본 2000
      fadeOutMs: number;       // 종료 페이드, 기본 3000
    };
  };
}
```

#### Remotion 구현
```tsx
// MainVideo.tsx에 추가
<Audio src={bgmSrc} volume={(frame) => {
  const isNarrating = checkNarrationAtFrame(frame, words);
  const baseVolume = meta.bgm.volume;
  const duckVolume = meta.bgm.duckingLevel;
  return isNarrating ? duckVolume : baseVolume;
}} />
```

---

### 2-B. 효과음 시스템 (SFX System)

#### 자동 SFX 매핑

| 트리거 | 효과음 | 페이즈 |
|--------|--------|--------|
| 씬 전환 | 부드러운 "슉" (whoosh) | Phase 1 |
| 텍스트 등장 (popIn) | 가벼운 "팝" | Phase 1 |
| 카운터 시작 | "띠링" (chime) | Phase 1 |
| 카운터 완료 | "짠!" (tada) | Phase 1 |
| 강조 씬 | "붐" (impact) | Phase 2 |
| 경고/주의 | 경고음 | Phase 2 |
| 스틱맨 등장 | 발소리 / 등장음 | Phase 2 |
| 아이콘 등장 | 가벼운 알림음 | Phase 2 |
| 화면 흔들림 | 충격음 | Phase 2 |

#### SFX 라이브러리 목표

| 페이즈 | 효과음 수 |
|--------|----------|
| Phase 1 | 8개 (기본 전환/등장음) |
| Phase 2 | 20개 (씬 유형별 전용음) |
| Phase 3 | 40개 (세밀한 상황별 매칭) |

#### 구현 방식
```typescript
interface SFXTrigger {
  event: "scene_transition" | "object_enter" | "object_exit" |
         "counter_start" | "counter_end" | "emphasis" | "warning";
  src: string;                 // SFX 파일 경로
  volume?: number;             // 0~1, 기본 0.5
  delayMs?: number;            // 트리거 후 재생 딜레이
}

// Scene에 추가
interface Scene {
  sfx?: SFXTrigger[];          // 수동 지정
  autoSfx?: boolean;           // true면 이벤트 기반 자동 매핑
}
```

---

### 2-C. TTS 품질 향상

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 속도 조절 | 강조 구간 느리게, 나열 구간 빠르게 | Phase 1 |
| 쉼표 처리 | 문장 사이 자연스러운 간격 (pause 태그) | Phase 1 |
| 멀티 보이스 | 남성/여성 음성 교차 (대화 장면) | Phase 2 |
| SSML 지원 | 강세, 발음, 속도를 세밀하게 제어 | Phase 2 |
| 고급 TTS 엔진 | OpenAI TTS / ElevenLabs 연동 옵션 | Phase 3 |
| 감정 TTS | 기쁨/슬픔/놀람 등 감정 반영 음성 | Phase 3 |

#### 마크다운 확장 문법 (제안)
```markdown
안녕하세요! 오늘은 복리에 대해 알아보겠습니다.

무려... [pause: 500ms] **761만원**이 됩니다! [rate: slow]

시간은 복리의 가장 강력한 무기입니다. [emphasis: strong]
```

---

### 2-D. 오디오 믹싱 파이프라인

```
[TTS 나레이션] ─┐
                 ├──→ [오디오 믹서] ──→ [최종 오디오 트랙]
[BGM] ──────────┤       ↑
                 │   볼륨 커브
[SFX 이벤트] ───┘   (ducking, fade)
```

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 볼륨 노멀라이즈 | TTS 출력 볼륨 일정하게 | Phase 1 |
| BGM 덕킹 | 나레이션 중 BGM 자동 감소 | Phase 1 |
| SFX 타이밍 동기화 | scene.json 타이밍에 맞춰 SFX 삽입 | Phase 1 |
| 마스터링 | 리미터, 컴프레서 적용 | Phase 2 |
| 라우드니스 표준화 | YouTube 권장 -14 LUFS로 조정 | Phase 2 |

---

## 영역 3: 지능형 자동화 (Smart Automation)

> 현재 규칙 기반(rule-based) 시스템을 LLM 기반 지능형 시스템으로 진화.
> 궁극적 목표: 나레이션 텍스트만 쓰면 모든 것이 자동.

### 현재 상태
- 씬 분할: 수동 (`## scene:` 마커)
- 오브젝트 선택: 수동 (`[stickman: ...]`, `[text: ...]`)
- 레이아웃: 오브젝트 조합 패턴 매칭 (5개 룰)
- 모션 배정: 오브젝트 타입별 하드코딩

### 3-A. 자동화 레벨 정의

```
Level 0 (현재): 전부 수동 — 유저가 씬, 오브젝트, 포즈, 모션 다 지정
Level 1: 반자동 — 유저가 씬과 오브젝트 지정, 레이아웃/모션/카메라 자동
Level 2: 나레이션 + 힌트 — 유저가 나레이션 + 간단한 힌트만, 나머지 자동
Level 3: 나레이션만 — 유저가 텍스트만 작성, 전체 영상 구성 자동
```

### 3-B. Level 1: 스마트 디폴트 (Phase 1)

사용자의 마크다운은 그대로 두되, 빈 부분을 지능적으로 채운다.

| 기능 | 현재 | Level 1 |
|------|------|---------|
| 씬 템플릿 | 없음 | 오브젝트 조합 + 씬 위치(도입/중간/결론)로 자동 선택 |
| 모션 | 전부 breathing | 포즈와 표정에 어울리는 모션 자동 매칭 |
| 카메라 | 고정 | 씬 역할(강조/설명/비교)에 따라 자동 선택 |
| 배경색 | 고정 | 씬 분위기에 맞게 테마 팔레트 내에서 자동 변화 |
| SFX | 없음 | 오브젝트 등장 이벤트에 자동 매핑 |

#### 구현: 룰 엔진 확장 (`scene_builder.py`)
```python
# 씬 위치에 따른 자동 씬 템플릿 선택
def auto_select_scene_template(
    scene_index: int,
    total_scenes: int,
    directives: list[Directive],
) -> str:
    position_ratio = scene_index / total_scenes
    
    if scene_index == 0:
        return "intro_greeting"
    elif scene_index == total_scenes - 1:
        return "closing_summary"
    elif has_counter(directives):
        return "emphasis_number"
    elif has_comparison(directives):
        return "compare_side_by_side"
    elif position_ratio < 0.3:
        return "explain_default"
    else:
        return alternate("explain_default", "explain_reverse")
```

---

### 3-C. Level 2: LLM 어시스턴트 (Phase 2)

유저가 나레이션 + 간단한 힌트만 작성하면 LLM이 오브젝트/포즈/표정을 추천.

#### 입력 (유저 작성)
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
---

안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다.
[hint: 인사하는 느낌]

단리는 원금에만 이자가 붙습니다.
[hint: 설명]

백만원을 연 7%로 30년 투자하면 약 761만원이 됩니다.
[hint: 숫자 강조]
```

#### LLM 프롬프트 구조
```
당신은 인포그래픽 영상 감독입니다.
아래 나레이션과 힌트를 보고, 각 문장에 적합한 영상 요소를 JSON으로 출력하세요.

사용 가능한 포즈: [standing, pointing_right, ...]
사용 가능한 표정: [neutral, happy, sad, ...]
사용 가능한 오브젝트: [stickman, text, icon, counter, shape]
사용 가능한 아이콘: [lightbulb, money-bag, ...]
사용 가능한 씬 템플릿: [intro_greeting, explain_default, ...]

나레이션:
"안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다."
힌트: 인사하는 느낌

출력 형식:
{
  "scene_template": "intro_greeting",
  "stickman": { "pose": "waving", "expression": "happy", "motion": "breathing" },
  "objects": [
    { "type": "text", "content": "복리의 마법", "style": "title" },
    { "type": "icon", "name": "lightbulb" }
  ]
}
```

#### 파이프라인 통합
```
[마크다운 + 힌트] → [LLM API] → [enriched 마크다운] → [기존 파이프라인]
```

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 문장별 오브젝트 추천 | 나레이션 분석 → 적절한 아이콘/카운터/도형 자동 추가 | Phase 2 |
| 감정 분석 → 표정/포즈 매칭 | "놀랍게도" → surprised, "주의하세요" → headShake + sad | Phase 2 |
| 씬 역할 자동 분류 | 문장의 의미 → opening/explanation/emphasis/closing 분류 | Phase 2 |
| 카운터 자동 생성 | "761만원이 됩니다" → counter 오브젝트 자동 추출 | Phase 2 |

---

### 3-D. Level 3: 풀 오토 (Phase 3~4)

유저가 나레이션 텍스트만 입력하면 전체 영상이 자동 생성.

#### 입력
```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
---

안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다.
단리는 원금에만 이자가 붙습니다.
하지만 복리는 원금에 이자를 더한 금액에 다시 이자가 붙습니다.
백만원을 연 7%로 30년 투자하면 약 761만원이 됩니다.
시간은 복리의 가장 강력한 무기입니다.
오늘부터 시작하세요!
```

#### 자동화 범위
| 단계 | 자동화 내용 |
|------|-----------|
| 씬 분할 | 문장 단위 자동 분할 + 의미 단위 그룹핑 |
| 씬 역할 분류 | 도입/설명/강조/비교/결론 자동 태깅 |
| 영상 템플릿 적용 | 씬 역할 시퀀스로 적합한 영상 템플릿 자동 선택 |
| 전체 오브젝트 생성 | 텍스트에서 키워드 추출 → 아이콘/카운터/도형 자동 |
| 스틱맨 연출 | 감정 분석 → 포즈/표정/모션 전체 자동 |
| BGM 선택 | 영상 전체 분위기 분석 → BGM 자동 선택 |
| 씬 템플릿 배정 | 단조로움 방지를 위한 템플릿 순환/변주 알고리즘 |

---

## 영역 4: 사용자 경험 (UX / Workflow)

> CLI → 웹 → 실시간 편집으로 진화. 비개발자도 사용 가능하게.

### 현재 상태
- 인터페이스: CLI (`python pipeline.py script.md`)
- 프리뷰: 없음 (렌더링 후에야 확인 가능)
- 에러 처리: 콘솔 출력

### 4-A. 실시간 프리뷰 (Phase 2)

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| Remotion Studio 연동 | scene.json 변경 시 자동 리로드 | Phase 2 |
| 씬 단위 프리뷰 | 특정 씬만 빠르게 미리보기 | Phase 2 |
| 핫 리로드 | 마크다운 저장 → 자동 재파싱 → 프리뷰 업데이트 | Phase 2 |
| 타임라인 스크러빙 | 프레임 단위로 드래그하며 확인 | Phase 3 |

---

### 4-B. 웹 GUI (Phase 3)

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │ 스크립트 편집기│  │         실시간 프리뷰            │ │
│  │              │  │                                  │ │
│  │ ## scene:    │  │    ┌───────────────────┐        │ │
│  │ [stickman:   │  │    │   영상 미리보기    │        │ │
│  │  pointing]   │  │    │                   │        │ │
│  │              │  │    └───────────────────┘        │ │
│  │ 나레이션...   │  │                                  │ │
│  │              │  │  ▶ ■ ⏮ ⏭  00:23 / 03:45       │ │
│  └──────────────┘  └──────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 타임라인                                           │ │
│  │ |씬1|씬2 |  씬3  |씬4| 씬5 |  씬6  |씬7|씬8|    │ │
│  │ ▼오디오 파형                                       │ │
│  │ ▼자막 트랙                                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  [🎬 렌더링] [💾 저장] [📤 YouTube 업로드]             │
└─────────────────────────────────────────────────────────┘
```

| 컴포넌트 | 설명 | 페이즈 |
|---------|------|--------|
| 스크립트 에디터 | 마크다운 편집 + 신택스 하이라이팅 | Phase 3 |
| 프리뷰 패널 | Remotion Player 임베드 | Phase 3 |
| 타임라인 | 씬 경계 + 오디오 파형 시각화 | Phase 3 |
| 씬 인스펙터 | 선택한 씬의 오브젝트/애니메이션 속성 편집 | Phase 3 |
| 템플릿 브라우저 | 씬 템플릿 미리보기 + 원클릭 적용 | Phase 3 |
| 에셋 라이브러리 | 아이콘/BGM/SFX 검색 + 드래그 앤 드롭 | Phase 4 |

#### 기술 스택 (제안)
```
프론트엔드: Next.js + Remotion Player
백엔드: Python FastAPI (파이프라인 래핑)
실시간: WebSocket (마크다운 변경 → 파이프라인 → 프리뷰)
```

---

### 4-C. 에러 피드백 & 검증 (Phase 2)

| 검증 항목 | 에러 메시지 예시 | 페이즈 |
|----------|-----------------|--------|
| 오브젝트 겹침 | "scene_05: 텍스트와 카운터가 겹칩니다 (영역 80% 중복)" | Phase 2 |
| 존재하지 않는 포즈 | "scene_03: 'dancing' 포즈가 없습니다. 사용 가능: standing, ..." | Phase 1 |
| 씬 너무 짧음 | "scene_02: 0.5초는 너무 짧습니다 (최소 1.5초 권장)" | Phase 2 |
| 씬 너무 김 | "scene_07: 15초 — 분할을 권장합니다" | Phase 2 |
| 아이콘 미존재 | "scene_04: 'rocket' 아이콘이 없습니다. 유사: 'chart-up'" | Phase 1 |
| 오디오 초과 | "오디오 파일이 25MB를 초과합니다. 자동 압축 진행..." | Phase 1 |

---

### 4-D. 렌더링 최적화 (Phase 2~3)

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 씬 단위 캐싱 | 변경되지 않은 씬은 재렌더링 안 함 | Phase 2 |
| 병렬 렌더링 | Remotion concurrency 최적화 | Phase 2 |
| 드래프트 모드 | 저해상도 빠른 프리뷰 (480p, 15fps) | Phase 2 |
| 증분 렌더링 | 수정된 씬만 재렌더 후 최종본에 합치기 | Phase 3 |
| 클라우드 렌더링 | Remotion Lambda 또는 자체 렌더팜 | Phase 4 |

---

## 영역 5: 출력 및 배포 (Output & Distribution)

> 렌더링 결과를 최대한 자동으로 플랫폼에 배포.

### 현재 상태
- 출력: `final.mp4` + `captions.srt` (2파일)
- 배포: 수동 업로드

### 5-A. 자동 산출물

| 산출물 | 설명 | 페이즈 |
|--------|------|--------|
| final.mp4 | 메인 영상 (1080p) | ✅ 완료 |
| captions.srt | 자막 파일 | ✅ 완료 |
| thumbnail.png | 자동 생성 썸네일 | Phase 1 |
| thumbnail_alt.png | 대안 썸네일 (2~3개) | Phase 2 |
| chapters.txt | YouTube 챕터 마커 | Phase 1 |
| description.txt | 자동 생성 영상 설명 | Phase 2 |
| tags.txt | 자동 추출 키워드/태그 | Phase 2 |
| shorts_vertical.mp4 | 세로형 숏폼 (9:16) | Phase 2 |
| preview_gif.gif | 미리보기 GIF (5초) | Phase 2 |

---

### 5-B. 썸네일 자동 생성 (Phase 1)

#### 전략
scene.json에서 가장 "시각적으로 풍성한" 씬을 자동 선택하여 스냅샷.

```python
def select_thumbnail_scene(scenes: list) -> Scene:
    """가장 많은 오브젝트 + 강조 요소가 있는 씬 선택"""
    scored = []
    for scene in scenes:
        score = len(scene.objects)
        if has_counter(scene): score += 2      # 숫자는 시선 끔
        if has_icon(scene): score += 1
        if scene.template == "emphasis_number": score += 3
        scored.append((score, scene))
    return max(scored, key=lambda x: x[0])[1]
```

#### 썸네일 구성
```
┌─────────────────────────────┐
│                             │
│   [핵심 텍스트 크게]         │
│                             │
│      [스틱맨]  [아이콘]      │
│                             │
│   [보조 텍스트 or 숫자]      │
│                             │
└─────────────────────────────┘
```

| 요소 | 설명 |
|------|------|
| 핵심 텍스트 | 영상 제목 또는 가장 임팩트 있는 문장 (큰 폰트, 강조색) |
| 스틱맨 | 가장 역동적인 포즈 스냅샷 |
| 숫자/키워드 | 카운터 최종값 또는 핵심 키워드 |

---

### 5-C. 다중 포맷 출력 (Phase 2)

| 포맷 | 해상도 | 비율 | 용도 |
|------|--------|------|------|
| youtube_hd | 1920×1080 | 16:9 | YouTube 기본 | 
| youtube_4k | 3840×2160 | 16:9 | YouTube 4K |
| shorts | 1080×1920 | 9:16 | YouTube Shorts / TikTok / Reels |
| square | 1080×1080 | 1:1 | Instagram 피드 |
| preview | 854×480 | 16:9 | 빠른 프리뷰 |

#### 세로형(Shorts) 변환 시 레이아웃 자동 재배치 필요
```
16:9 (가로)                    9:16 (세로)
┌──────────────────┐          ┌──────────┐
│ [SM]    [TEXT]   │    →     │  [TEXT]  │
│         [CTR]    │          │          │
└──────────────────┘          │   [SM]   │
                              │          │
                              │  [CTR]   │
                              └──────────┘
```

---

### 5-D. YouTube API 연동 (Phase 3)

```
[렌더링 완료] → [YouTube Data API v3] → 자동 업로드
                     ↓
              제목: meta.title
              설명: description.txt
              태그: tags.txt
              자막: captions.srt
              챕터: chapters.txt
              썸네일: thumbnail.png
              공개 설정: 비공개 (검수 후 공개)
```

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 영상 업로드 | mp4 → YouTube 업로드 | Phase 3 |
| 메타데이터 설정 | 제목, 설명, 태그, 카테고리 | Phase 3 |
| 자막 업로드 | SRT 파일 자동 첨부 | Phase 3 |
| 썸네일 설정 | 자동 생성 썸네일 업로드 | Phase 3 |
| 예약 발행 | 지정 시간에 공개 | Phase 4 |
| 시리즈 관리 | 재생목록 자동 추가 | Phase 4 |

---

## 영역 6: 확장성 (Extensibility)

> 시스템 자체의 표현 범위와 커뮤니티 확장 가능성.

### 현재 상태
- 캐릭터: 스틱맨 1명 고정
- 테마: 1개 (dark_infographic)
- 확장 방법: 코드 직접 수정

### 6-A. 멀티 캐릭터 (Phase 2~3)

| 기능 | 설명 | 페이즈 |
|------|------|--------|
| 듀얼 스틱맨 | 한 씬에 2명 (좌/우, 대화 구도) | Phase 2 |
| 캐릭터 구분 | 색상, 크기, 표식으로 구분 | Phase 2 |
| 대화 모드 | 말하는 캐릭터 강조, 듣는 캐릭터 반응 | Phase 3 |
| 최대 3명 | 패널 토의 / 비교 장면 | Phase 3 |
| 군중 | 배경에 소형 스틱맨 여러 명 | Phase 4 |

#### 마크다운 문법 확장
```markdown
## scene: debate
[stickman A: pointing_right, happy, color: #FFFFFF]
[stickman B: shrugging, confused, color: #4FC3F7]
[text: "A vs B", highlight]

A가 말합니다: 복리가 더 좋습니다!
B가 반론합니다: 하지만 리스크도 있잖아요.
```

---

### 6-B. 프롭 시스템 (Props) (Phase 3~4)

스틱맨이 물건을 들거나 사용하는 연출.

| 프롭 | 부착 위치 | 페이즈 |
|------|----------|--------|
| book | 손 (lowerArm) | Phase 3 |
| magnifier | 손 | Phase 3 |
| money | 손 | Phase 3 |
| phone | 손 | Phase 3 |
| flag | 손 | Phase 4 |
| sign_board | 손 (양손) | Phase 4 |
| umbrella | 손 | Phase 4 |
| laptop | 무릎 (sitting 포즈 전용) | Phase 4 |

#### 구현 방식
```typescript
interface StickmanProps {
  // ... 기존 필드
  prop?: {
    name: string;              // 프롭 식별자
    hand: "left" | "right" | "both";
    scale?: number;
  };
}
```

---

### 6-C. 캐릭터 커스터마이징 (Phase 3)

| 요소 | 옵션 | 페이즈 |
|------|------|--------|
| 색상 | 임의 hex 색상 | Phase 2 (이미 지원) |
| 선 굵기 | 1~5 (기본 3) | Phase 2 (이미 지원) |
| 악세서리 - 머리 | 없음, 안경, 모자, 왕관, 헤드폰 | Phase 3 |
| 악세서리 - 몸 | 없음, 넥타이, 망토, 가방 | Phase 4 |
| 크기 | 0.5~2.0 (기본 1.0) | Phase 2 (이미 지원) |
| 스타일 | 기본, 둥근, 각진, 귀여운 | Phase 4 |

---

### 6-D. 플러그인 / 커뮤니티 구조 (Phase 4)

| 구조 | 설명 | 페이즈 |
|------|------|--------|
| 포즈 팩 | JSON 파일로 포즈 세트 import/export | Phase 3 |
| 모션 팩 | 모션 프리셋 공유 | Phase 3 |
| 아이콘 팩 | SVG 아이콘 세트 (주제별: 의료, IT, 교육 등) | Phase 3 |
| 씬 템플릿 팩 | 씬 템플릿 세트 공유 | Phase 4 |
| 테마 팩 | 컬러 테마 + 배경 + 폰트 묶음 | Phase 4 |
| 마켓플레이스 | 사용자 제작 에셋 공유/판매 | Phase 4 |

#### 플러그인 포맷 (제안)
```
stickman-plugin-medical/
├── plugin.json              # 메타데이터 (이름, 버전, 의존성)
├── poses/                   # 커스텀 포즈 JSON 파일
│   ├── doctor_standing.json
│   └── patient_sitting.json
├── icons/                   # SVG 아이콘
│   ├── stethoscope.svg
│   └── syringe.svg
├── templates/               # 씬 템플릿
│   └── diagnosis_scene.json
└── preview/                 # 미리보기 이미지
    └── thumbnail.png
```

---

## 전체 페이즈별 요약

### Phase 1: Foundation (2~3주)
> "볼 만한 영상"을 만든다

| 영역 | 핵심 작업 |
|------|----------|
| 시각 | 그라데이션 배경, 3개 컬러 테마, glow/shadow, 텍스트 구분, crossfade/wipe 트랜지션 |
| 오디오 | BGM 재생 + 덕킹, 기본 SFX 8개, TTS 속도/쉼 조절 |
| 자동화 | Level 1 스마트 디폴트 (씬 위치 기반 템플릿 자동 선택) |
| UX | 에러 검증 (미존재 포즈/아이콘 경고) |
| 출력 | 썸네일 자동 생성, 챕터 마커 |

**완료 기준**: 같은 마크다운을 넣어도 기존보다 확연히 풍성한 영상 출력

### Phase 2: Intelligence (2~3주)
> "알아서 채워주는 영상"을 만든다

| 영역 | 핵심 작업 |
|------|----------|
| 시각 | 파티클 배경, 추가 테마 3개, blur/vignette/spotlight, 고급 트랜지션 |
| 오디오 | SFX 20개, 멀티 트랙 BGM, SSML 지원, 오디오 마스터링 |
| 자동화 | Level 2 LLM 어시스턴트 (나레이션 + 힌트 → 자동 구성) |
| UX | Remotion Studio 실시간 프리뷰, 씬 단위 캐싱, 드래프트 모드 |
| 출력 | 다중 해상도, Shorts 변환, 설명/태그 자동 생성 |
| 확장 | 듀얼 스틱맨, 포즈/아이콘 팩 import |

**완료 기준**: 유저가 힌트만 적어도 90% 완성도의 영상 자동 생성

### Phase 3: Accessibility (3~4주)
> "누구나 만드는 영상"을 만든다

| 영역 | 핵심 작업 |
|------|----------|
| 시각 | 특수 배경 (wave, starfield), 10개 테마, color_pop/motion_blur, morph 트랜지션 |
| 오디오 | 고급 TTS 엔진 옵션, 감정 TTS, 40개 SFX |
| 자동화 | Level 3 풀 오토 (나레이션만 → 전체 자동) |
| UX | 웹 GUI (에디터 + 프리뷰 + 타임라인), 증분 렌더링 |
| 출력 | YouTube API 연동 (업로드 + 메타데이터 + 자막) |
| 확장 | 대화 모드 (3명), 프롭 시스템, 악세서리, 씬 템플릿 팩 공유 |

**완료 기준**: 비개발자가 웹에서 텍스트만 입력하고 유튜브 업로드까지 원클릭

### Phase 4: Scale (4~6주)
> "찍어내는 영상"을 만든다

| 영역 | 핵심 작업 |
|------|----------|
| UX | 클라우드 렌더링, 배치 렌더링 (여러 영상 동시) |
| 출력 | 예약 발행, 시리즈 관리, 분석 대시보드 |
| 확장 | 군중 스틱맨, 캐릭터 스타일 변종, 플러그인 마켓플레이스 |
| 비즈니스 | 팀 협업 기능, API 공개, 화이트라벨 |

**완료 기준**: 한 사람이 주 5개 이상 영상을 일관된 품질로 생산 가능

---

## 기술 부채 및 리팩토링 포인트

페이즈 진행 중 각 시점에 해결해야 할 기술 부채.

| 시점 | 항목 | 이유 |
|------|------|------|
| Phase 1 시작 전 | scene.json 스키마 v2 확정 | 배경, SFX, 카메라 필드 추가 시 하위 호환 설계 필요 |
| Phase 1 완료 후 | 렌더링 성능 프로파일링 | 이펙트 추가로 렌더 시간 증가 예상 → 병목 파악 |
| Phase 2 시작 전 | Python ↔ LLM API 인터페이스 설계 | LLM 응답 포맷, 에러 핸들링, 비용 관리 |
| Phase 2 완료 후 | 오디오 파이프라인 분리 | TTS + BGM + SFX 믹싱이 복잡해지면 별도 모듈화 |
| Phase 3 시작 전 | 프론트엔드 아키텍처 결정 | 웹 GUI 기술 스택 확정, Remotion Player 통합 테스트 |
| Phase 4 시작 전 | 인프라 설계 | 클라우드 렌더링, 스토리지, CDN, 인증 |

---

## 성공 지표 (KPI)

| 지표 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| 영상 1개 제작 시간 | 10분 | 5분 | 2분 | 1분 |
| 마크다운 작성 부담 | 높음 (수동) | 중간 (힌트) | 낮음 (텍스트만) | 최소 |
| 렌더링 시간 (5분 영상) | 3분 | 2분 | 1분 | 30초 (클라우드) |
| 시각적 다양성 (씬 변주 수) | ~50 | ~200 | ~500 | ~1000+ |
| 사용 가능 유저층 | 개발자 | 개발자 + 파워유저 | 일반 사용자 | 팀/기업 |