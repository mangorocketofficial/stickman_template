# 스틱맨 영상 시스템 — 레이어 확장 로드맵

## 개요

이 문서는 스틱맨 인포그래픽 영상 시스템의 시각 요소를 **5개 레이어 피라미드** 구조로 정의하고, 각 레이어별 목표 개발 수량, 카테고리 분류, 개발 우선순위를 명시한다.

### 핵심 원칙
- **아래에서 위로**: 하위 레이어가 충분히 채워진 후 상위 레이어로 올라간다
- **조합 폭발**: 하위 요소가 N개면 상위 조합은 N² 이상 — 하위를 먼저 풍성하게
- **독립 확장**: 각 레이어는 다른 레이어를 건드리지 않고 독립적으로 확장 가능
- **하위 호환**: 새 요소 추가 시 기존 scene.json이 깨지지 않아야 함

### 피라미드 구조

```
┌─────────────────────────────────────────────┐
│  Layer 5: 영상 템플릿 (Video Template)        │  ← 장르별 완성 패키지
├─────────────────────────────────────────────┤
│  Layer 4: 씬 템플릿 (Scene Template)          │  ← 연출 패턴 세트
├─────────────────────────────────────────────┤
│  Layer 3: 연출 요소 (Direction Elements)      │  ← 카메라, 레이아웃, 타이밍
├─────────────────────────────────────────────┤
│  Layer 2: 모션 템플릿 (Motion Template)       │  ← 포즈의 시간축 조합
├─────────────────────────────────────────────┤
│  Layer 1: 기본 요소 (Primitives)              │  ← 포즈, 표정, 오브젝트, 아이콘
└─────────────────────────────────────────────┘
```

---

## Layer 1: 기본 요소 (Primitives)

> 시스템의 최소 단위. 모든 상위 레이어의 재료가 된다.

### 개발 현황 및 목표

| 카테고리 | 현재 | MVP 목표 | V2 목표 | V3 목표 |
|---------|------|----------|---------|---------|
| 포즈 | 11개 | 15개 | 25개 | 40개 |
| 표정 | 5개 | 8개 | 12개 | 20개 |
| 오브젝트 타입 | 5종 | 5종 | 7종 | 10종 |
| 아이콘 | 5개 | 15개 | 40개 | 100개 |
| 도형 | 4종 | 4종 | 6종 | 8종 |

---

### 1-A. 포즈 (Pose)

포즈는 스틱맨의 정적 자세. 10개 관절의 각도 조합으로 정의.

#### 분류 기준: 의미/용도별

**① 기본 자세 (Idle)** — 특별한 행동 없이 서있거나 앉아있는 상태
| 포즈명 | 상태 | 개발 |
|--------|------|------|
| standing | 기본 서기 | ✅ 완료 |
| sitting | 앉기 | ✅ 완료 |
| leaning | 기대기 | 🔲 V2 |
| crouching | 웅크리기 | 🔲 V2 |
| lying | 눕기 | 🔲 V3 |

**② 제스처 (Gesture)** — 손/팔로 의미를 전달하는 동작
| 포즈명 | 의미 | 개발 |
|--------|------|------|
| pointing_right | 오른쪽 가리키기 | ✅ 완료 |
| pointing_left | 왼쪽 가리키기 | ✅ 완료 |
| pointing_up | 위 가리키기 | 🔲 MVP |
| explaining | 설명하기 | ✅ 완료 |
| shrugging | 어깨 으쓱 | ✅ 완료 |
| waving | 손 흔들기 | ✅ 완료 |
| thumbsUp | 엄지 척 | ✅ 완료 |
| beckoning | 손짓 | ✅ 완료 |
| stop | 정지 손짓 | 🔲 V2 |
| facepalm | 얼굴 감싸기 | 🔲 V2 |
| arms_crossed | 팔짱 | 🔲 V2 |
| hand_on_hip | 허리에 손 | 🔲 V2 |
| raising_hand | 손 들기 | 🔲 V2 |

**③ 감정 표현 (Emotion)** — 전신으로 감정을 드러내는 자세
| 포즈명 | 감정 | 개발 |
|--------|------|------|
| thinking | 생각 | ✅ 완료 |
| celebrating | 환호 | ✅ 완료 |
| depressed | 풀 죽음 | 🔲 MVP |
| surprised_pose | 놀람 (전신) | 🔲 MVP |
| confident | 당당함 | 🔲 V2 |
| scared | 겁먹음 | 🔲 V2 |
| exhausted | 지침 | 🔲 V3 |
| praying | 기도/간절 | 🔲 V3 |

**④ 활동 (Activity)** — 특정 행동을 나타내는 자세
| 포즈명 | 행동 | 개발 |
|--------|------|------|
| writing | 글쓰기 | 🔲 V2 |
| reading | 책 읽기 | 🔲 V2 |
| lifting | 들어올리기 | 🔲 V2 |
| pushing | 밀기 | 🔲 V3 |
| pulling | 당기기 | 🔲 V3 |
| presenting | 프레젠테이션 | 🔲 V2 |

#### 개발 우선순위
1. MVP: pointing_up, depressed, surprised_pose 추가 (기본 감정 커버리지 확보)
2. V2: 제스처 + 활동 포즈 확장 (씬 다양성 확보)
3. V3: 니치 포즈 추가 (특수 상황 대응)

---

### 1-B. 표정 (Expression)

스틱맨 머리 원 안에 렌더링되는 SVG 기반 얼굴 표현.

#### 분류 기준: 감정 축

**① 긍정 (Positive)**
| 표정명 | 눈 | 입 | 개발 |
|--------|----|----|------|
| happy | · · | ⌣ (스마일) | ✅ 완료 |
| excited | ⊙ ⊙ | D (활짝) | 🔲 MVP |
| proud | ‾ ‾ | ⌣ (미소) | 🔲 V2 |
| loving | ♡ ♡ | ⌣ | 🔲 V3 |

**② 중립 (Neutral)**
| 표정명 | 눈 | 입 | 개발 |
|--------|----|----|------|
| neutral | · · | — (일자) | ✅ 완료 |
| thinking | · · | ~ (물결) | ✅ 완료 |
| focused | − − | — | 🔲 MVP |
| sleepy | − − | ○ (하품) | 🔲 V2 |
| blank | · · | (없음) | 🔲 V3 |

**③ 부정 (Negative)**
| 표정명 | 눈 | 입 | 개발 |
|--------|----|----|------|
| sad | · · | ⌢ (찡그림) | ✅ 완료 |
| surprised | ○ ○ | ○ (놀람) | ✅ 완료 |
| angry | ╲ ╱ | ∧ (화남) | 🔲 MVP |
| confused | ? · | ~ | 🔲 V2 |
| worried | ╱ ╲ | ⌢ | 🔲 V2 |
| crying_face | T T | ⌢ | 🔲 V2 |
| embarrassed | · · (홍조) | ~ | 🔲 V3 |

#### 개발 우선순위
1. MVP: excited, focused, angry (긍정/중립/부정 각 1개씩 추가 → 8개)
2. V2: 세부 감정 확장 → 12개
3. V3: 특수 표정 추가 → 20개

---

### 1-C. 오브젝트 타입 (Object Type)

화면에 배치되는 시각 요소의 종류.

| 타입 | 설명 | 개발 |
|------|------|------|
| stickman | 스틱맨 캐릭터 | ✅ 완료 |
| text | 텍스트 오브젝트 | ✅ 완료 |
| icon | SVG 아이콘 | ✅ 완료 |
| shape | 도형 (화살표, 선 등) | ✅ 완료 |
| counter | 숫자 카운터 | ✅ 완료 |
| image | 외부 이미지/일러스트 | 🔲 V2 |
| chart | 차트/그래프 (bar, line, pie) | 🔲 V2 |
| badge | 강조 뱃지/라벨 | 🔲 V3 |
| progressBar | 진행률 바 | 🔲 V3 |
| table | 비교 테이블 | 🔲 V3 |

#### 개발 우선순위
1. MVP: 현재 5종 유지
2. V2: image + chart 추가 (인포그래픽 영상의 핵심 요소)
3. V3: badge, progressBar, table (데이터 시각화 강화)

---

### 1-D. 아이콘 (Icon)

SVG 기반 단색 아이콘. 오브젝트 타입 `icon`에서 사용.

#### 분류 기준: 주제별

**① 금융/비즈니스**
| 아이콘명 | 설명 | 개발 |
|---------|------|------|
| money-bag | 돈주머니 | ✅ 완료 |
| chart-up | 상승 차트 | ✅ 완료 |
| piggy-bank | 저금통 | ✅ 완료 |
| coin | 동전 | 🔲 MVP |
| bank | 은행 건물 | 🔲 MVP |
| wallet | 지갑 | 🔲 MVP |
| credit-card | 신용카드 | 🔲 V2 |
| chart-down | 하락 차트 | 🔲 V2 |
| calculator | 계산기 | 🔲 V2 |
| briefcase | 서류가방 | 🔲 V2 |

**② 일반/유틸리티**
| 아이콘명 | 설명 | 개발 |
|---------|------|------|
| lightbulb | 전구 (아이디어) | ✅ 완료 |
| warning | 경고 | ✅ 완료 |
| checkmark | 체크표시 | 🔲 MVP |
| cross | X 표시 | 🔲 MVP |
| clock | 시계 | 🔲 MVP |
| target | 과녁 | 🔲 MVP |
| star | 별 | 🔲 MVP |
| heart | 하트 | 🔲 V2 |
| lock | 자물쇠 | 🔲 V2 |
| gear | 톱니바퀴 | 🔲 V2 |

**③ 교육/정보**
| 아이콘명 | 설명 | 개발 |
|---------|------|------|
| book | 책 | 🔲 MVP |
| graduation | 학사모 | 🔲 V2 |
| magnifier | 돋보기 | 🔲 V2 |
| globe | 지구본 | 🔲 V2 |
| trophy | 트로피 | 🔲 V2 |

**④ 화살표/방향**
| 아이콘명 | 설명 | 개발 |
|---------|------|------|
| arrow-up | 위 화살표 | 🔲 MVP |
| arrow-down | 아래 화살표 | 🔲 MVP |
| arrow-right | 오른쪽 화살표 | 🔲 V2 |
| compare | 비교 (vs) | 🔲 V2 |

#### 개발 우선순위
1. MVP: 10개 추가 → 총 15개 (기본적인 인포그래픽 커버리지)
2. V2: 25개 추가 → 총 40개 (주제별 풍성한 선택지)
3. V3: 60개 추가 → 총 100개 (대부분의 주제 커버)

---

### 1-E. 도형 (Shape)

기본 기하학적 요소. 오브젝트 타입 `shape`에서 사용.

| 도형명 | 설명 | 개발 |
|--------|------|------|
| arrow | 화살표 | ✅ 완료 |
| line | 직선 | ✅ 완료 |
| circle | 원 | ✅ 완료 |
| rectangle | 사각형 | ✅ 완료 |
| curved_arrow | 곡선 화살표 | 🔲 V2 |
| bracket | 대괄호/중괄호 | 🔲 V2 |
| divider | 구분선 (수평/수직) | 🔲 V3 |
| highlight_box | 강조 박스 (반투명) | 🔲 V3 |

---

## Layer 2: 모션 템플릿 (Motion Template)

> Layer 1의 포즈를 시간축 위에 배열하여 움직임을 만든다.

### 개발 현황 및 목표

| 분류 | 현재 | MVP 목표 | V2 목표 | V3 목표 |
|------|------|----------|---------|---------|
| 루프 모션 | 11개 | 14개 | 20개 | 30개 |
| 포즈 전환형 | 5개 | 8개 | 12개 | 18개 |
| **합계** | **16개** | **22개** | **32개** | **48개** |

---

### 2-A. 루프 모션 (Loop Motion)

씬 동안 반복 재생되는 미세 움직임. `during` 구간에 적용.

#### 분류 기준: 에너지 레벨

**① 저에너지 (Subtle)** — 거의 정적, 미세한 생동감만 부여
| 모션명 | 설명 | 주기 | 개발 |
|--------|------|------|------|
| breathing | 호흡 (몸통 미세 진동) | 2000ms | ✅ 완료 |
| nodding | 고개 끄덕임 | 600ms | ✅ 완료 |
| headShake | 고개 젓기 (부정) | 600ms | ✅ 완료 |
| blinking | 눈 깜빡임 | 3000ms | 🔲 MVP |
| swaying | 좌우 미세 흔들림 | 2500ms | 🔲 V2 |
| tapping | 발 두드리기 | 500ms | 🔲 V2 |

**② 중에너지 (Moderate)** — 명확한 반복 동작
| 모션명 | 설명 | 주기 | 개발 |
|--------|------|------|------|
| typing | 타이핑 | 300ms | ✅ 완료 |
| nervous | 불안한 떨림 | 200ms | ✅ 완료 |
| laughing | 웃음 (몸 흔들림) | 400ms | ✅ 완료 |
| crying | 울음 (어깨 떨림) | 500ms | ✅ 완료 |
| clapping | 박수 | 400ms | ✅ 완료 |
| waving_loop | 손 흔들기 반복 | 500ms | 🔲 MVP |
| thinking_loop | 턱 만지며 고민 | 1500ms | 🔲 MVP |
| looking_around | 두리번거리기 | 2000ms | 🔲 V2 |
| scratching_head | 머리 긁기 | 1000ms | 🔲 V2 |

**③ 고에너지 (Dynamic)** — 큰 움직임, 이동 포함
| 모션명 | 설명 | 주기 | 개발 |
|--------|------|------|------|
| walkCycle | 걷기 | 800ms | ✅ 완료 |
| running | 달리기 | 400ms | ✅ 완료 |
| jumping | 점프 | 600ms | ✅ 완료 |
| dancing | 춤추기 | 1000ms | 🔲 V2 |
| bouncing | 통통 튀기 | 500ms | 🔲 V2 |
| exercising | 운동 (팔벌려뛰기) | 800ms | 🔲 V3 |

#### 개발 우선순위
1. MVP: blinking, waving_loop, thinking_loop 추가 (기본 표현력 보강)
2. V2: 중/고에너지 모션 확장 (역동적인 씬 지원)
3. V3: 특수 상황 모션 추가

---

### 2-B. 포즈 전환형 (Pose Transition)

`enter`에서 시작포즈 → 목표포즈로 전환, `during`에서 유지, `exit`에서 복귀.

#### 분류 기준: 전환 방향

**① 팔 중심 전환** — 팔/손 동작이 핵심
| 모션명 | 시작 → 목표 포즈 | 개발 |
|--------|------------------|------|
| waving | standing → waving | ✅ 완료 |
| pointing | standing → pointing_right | ✅ 완료 |
| thumbsUp | standing → thumbsUp | ✅ 완료 |
| beckoning | standing → beckoning | ✅ 완료 |
| raising | standing → raising_hand | 🔲 V2 |
| crossing_arms | standing → arms_crossed | 🔲 V2 |
| stop_gesture | standing → stop | 🔲 V2 |

**② 전신 전환** — 전체 자세가 변경
| 모션명 | 시작 → 목표 포즈 | 개발 |
|--------|------------------|------|
| excited | standing → celebrating | ✅ 완료 |
| sit_down | standing → sitting | 🔲 MVP |
| depressing | standing → depressed | 🔲 MVP |
| surprising | standing → surprised_pose | 🔲 MVP |
| presenting | standing → presenting | 🔲 V2 |
| reading_start | standing → reading | 🔲 V2 |
| crouching_down | standing → crouching | 🔲 V2 |

#### 개발 우선순위
1. MVP: sit_down, depressing, surprising 추가 (감정 전환 커버리지)
2. V2: 팔 중심 + 전신 전환 확장
3. V3: 복합 전환 (여러 포즈를 거치는 시퀀스)

---

## Layer 3: 연출 요소 (Direction Elements)

> 오브젝트와 모션을 "어떻게 보여줄지" 결정하는 연출 도구.
> 카메라, 레이아웃, 타이밍 세 축으로 구성.

### 개발 현황 및 목표

| 카테고리 | 현재 | MVP 목표 | V2 목표 | V3 목표 |
|---------|------|----------|---------|---------|
| 카메라 프리셋 | 0개 | 5개 | 10개 | 15개 |
| 레이아웃 프리셋 | 5개 | 10개 | 18개 | 25개 |
| 타이밍 프리셋 | 0개 | 5개 | 10개 | 15개 |

---

### 3-A. 카메라 프리셋 (Camera Preset)

가상 카메라의 위치, 줌, 움직임을 정의.

#### 분류 기준: 움직임 유형

**① 고정 (Static)** — 카메라가 움직이지 않음
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| static_full | 전체 화면 고정 (현재 기본값) | ✅ 완료 |
| static_closeup | 클로즈업 고정 (1.3x 줌) | 🔲 MVP |
| static_wide | 와이드 고정 (0.8x 줌) | 🔲 MVP |

**② 줌 (Zoom)** — 줌인 또는 줌아웃
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| zoom_in_slow | 느린 줌인 (1.0→1.2, 씬 전체) | 🔲 MVP |
| zoom_in_fast | 빠른 줌인 (강조용, 500ms) | 🔲 MVP |
| zoom_out_reveal | 줌아웃으로 전체 공개 (1.3→1.0) | 🔲 V2 |
| zoom_pulse | 줌인→줌아웃 반복 (강조) | 🔲 V2 |

**③ 팬 (Pan)** — 카메라 수평/수직 이동
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| pan_left_to_right | 왼쪽→오른쪽 천천히 이동 | 🔲 V2 |
| pan_right_to_left | 오른쪽→왼쪽 이동 | 🔲 V2 |
| pan_follow_stickman | 스틱맨 따라가기 | 🔲 V3 |

**④ 복합 (Combined)** — 줌 + 팬 동시
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| dolly_in | 줌인 + 살짝 위로 팬 (몰입감) | 🔲 V2 |
| reveal_pan_zoom | 팬하면서 줌아웃 (전체 공개) | 🔲 V3 |
| shake | 화면 흔들림 (충격/강조) | 🔲 V3 |

#### 개발 우선순위
1. MVP: static 2개 + zoom 2개 = 총 5개 (단조로움 해소의 핵심)
2. V2: 팬 + 복합 추가 (역동적 연출)
3. V3: 특수 효과 카메라

#### 구현 방식
```typescript
interface CameraPreset {
  name: string;
  keyframes: CameraKeyframe[];
}

interface CameraKeyframe {
  atPercent: number;       // 0~100, 씬 내 상대 위치
  zoom: number;            // 1.0 = 기본, 1.3 = 클로즈업
  offsetX: number;         // 수평 이동 (px)
  offsetY: number;         // 수직 이동 (px)
  easing: string;          // "linear" | "easeInOut" | "easeOut"
}
```

---

### 3-B. 레이아웃 프리셋 (Layout Preset)

오브젝트들의 화면 내 배치 패턴을 정의.

#### 분류 기준: 구도 패턴

**① 중앙형 (Center)** — 주요 요소가 중앙에 위치
| 프리셋명 | 구도 | 개발 |
|---------|------|------|
| center_single | 단일 요소 중앙 배치 | ✅ 완료 (text_only) |
| center_stack | 중앙 세로 정렬 (위: 텍스트, 아래: 카운터 등) | 🔲 MVP |
| center_hero | 중앙 큰 요소 + 좌우 보조 | 🔲 V2 |

**② 좌우 분할형 (Split)** — 화면을 좌우로 나눔
| 프리셋명 | 구도 | 개발 |
|---------|------|------|
| split_left_stickman | 스틱맨 좌, 콘텐츠 우 | ✅ 완료 (stickman_text) |
| split_right_stickman | 스틱맨 우, 콘텐츠 좌 | 🔲 MVP |
| split_equal | 좌우 동일 크기 (비교용) | 🔲 MVP |

**③ 삼분할형 (Triple)** — 화면을 3영역으로 나눔
| 프리셋명 | 구도 | 개발 |
|---------|------|------|
| triple_stickman_text_counter | 좌: 스틱맨, 상중: 텍스트, 하중: 카운터 | ✅ 완료 |
| triple_stickman_icon_text | 좌: 스틱맨, 중: 아이콘, 하: 텍스트 | ✅ 완료 |
| triple_horizontal | 좌-중-우 균등 배치 | 🔲 V2 |
| triple_top_bottom | 상단 제목 + 중단 콘텐츠 + 하단 보조 | 🔲 V2 |

**④ 그리드형 (Grid)** — 여러 요소를 격자 배치
| 프리셋명 | 구도 | 개발 |
|---------|------|------|
| grid_2x1 | 2열 1행 (비교) | 🔲 MVP |
| grid_2x2 | 2열 2행 (4개 요소 나열) | 🔲 V2 |
| grid_3x1 | 3열 1행 (3개 요소 나열) | 🔲 V2 |

**⑤ 오버레이형 (Overlay)** — 요소가 겹쳐 배치
| 프리셋명 | 구도 | 개발 |
|---------|------|------|
| overlay_fullscreen_text | 전체화면 텍스트 + 배경 오브젝트 | 🔲 MVP |
| overlay_spotlight | 중앙 스포트라이트 + 주변 어두움 | 🔲 V2 |
| overlay_picture_in_picture | 메인 화면 + 코너 소형 스틱맨 | 🔲 V3 |

#### 개발 우선순위
1. MVP: center_stack, split_right_stickman, split_equal, grid_2x1, overlay_fullscreen_text 추가 → 총 10개
2. V2: 삼분할 + 그리드 확장 → 총 18개
3. V3: 오버레이 + 특수 레이아웃 → 총 25개

#### 구현 방식
```typescript
interface LayoutPreset {
  name: string;
  slots: LayoutSlot[];       // 각 슬롯의 위치/크기 정의
}

interface LayoutSlot {
  role: string;              // "stickman" | "primary_text" | "secondary" | "accent"
  position: { x: number; y: number };
  scale?: number;
  maxWidth?: number;
  anchor?: "center" | "left" | "right";
}
```

---

### 3-C. 타이밍 프리셋 (Timing Preset)

오브젝트들의 등장/퇴장 순서와 애니메이션 타이밍을 정의.

#### 분류 기준: 등장 패턴

**① 동시 (Simultaneous)** — 모든 요소가 한꺼번에
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| all_at_once | 모든 오브젝트 동시 등장 | 🔲 MVP |
| all_at_once_stagger | 동시지만 50ms씩 미세 딜레이 | 🔲 MVP |

**② 순차 (Sequential)** — 하나씩 차례로
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| stickman_first | 스틱맨 → 나머지 순차 | 🔲 MVP |
| text_first | 텍스트 먼저 → 스틱맨 → 보조 요소 | 🔲 MVP |
| left_to_right | 왼쪽 요소부터 오른쪽으로 | 🔲 V2 |
| top_to_bottom | 위쪽 요소부터 아래쪽으로 | 🔲 V2 |

**③ 강조 (Emphasis)** — 특정 요소를 부각
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| reveal_climax | 배경 먼저 → 잠시 정적 → 핵심 요소 등장 | 🔲 MVP |
| counter_focus | 다른 요소 고정 → 카운터만 애니메이션 | 🔲 V2 |
| icon_burst | 아이콘이 팝업으로 강조 등장 | 🔲 V2 |

**④ 전환 (Transition)** — 이전 씬과 연결
| 프리셋명 | 설명 | 개발 |
|---------|------|------|
| carry_stickman | 스틱맨은 유지, 배경/텍스트만 전환 | 🔲 V2 |
| wipe_replace | 왼→오 와이프로 씬 교체 | 🔲 V2 |
| morph_text | 이전 텍스트가 새 텍스트로 변형 | 🔲 V3 |

#### 개발 우선순위
1. MVP: 동시 2개 + 순차 2개 + 강조 1개 = 총 5개
2. V2: 순차 + 전환 확장 → 총 10개
3. V3: 특수 전환 추가 → 총 15개

#### 구현 방식
```typescript
interface TimingPreset {
  name: string;
  entries: TimingEntry[];
}

interface TimingEntry {
  target: string;           // 오브젝트 role 또는 type
  delayMs: number;          // 씬 시작 기준 등장 딜레이
  enterAnimation: string;   // enter 애니메이션 프리셋명
  enterDurationMs: number;
  exitAnimation?: string;
  exitDurationMs?: number;
}
```

---

## Layer 4: 씬 템플릿 (Scene Template)

> Layer 3의 카메라 + 레이아웃 + 타이밍을 하나의 연출 패키지로 묶는다.
> "이 씬에서는 이런 느낌"을 한 단어로 지정할 수 있게 한다.

### 개발 현황 및 목표

| 현재 | MVP 목표 | V2 목표 | V3 목표 |
|------|----------|---------|---------|
| 0개 | 8개 | 16개 | 25개 |

### 분류 기준: 씬의 서사적 역할

**① 도입 (Opening)** — 영상 시작, 주제 소개
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| intro_greeting | zoom_out_reveal 또는 static_full | center_stack | stickman_first | 🔲 MVP |
| intro_question | zoom_in_slow | center_hero | reveal_climax | 🔲 V2 |
| intro_title_card | static_wide | overlay_fullscreen_text | all_at_once | 🔲 V2 |

**② 설명 (Explanation)** — 개념, 정의, 원리 설명
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| explain_default | static_full | split_left_stickman | stickman_first | 🔲 MVP |
| explain_formula | static_closeup | center_stack | text_first | 🔲 MVP |
| explain_reverse | static_full | split_right_stickman | text_first | 🔲 MVP |
| explain_with_visual | pan_left_to_right | triple_horizontal | left_to_right | 🔲 V2 |

**③ 강조 (Emphasis)** — 핵심 포인트, 놀라운 수치, 결론
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| emphasis_number | zoom_in_fast | center_stack | reveal_climax | 🔲 MVP |
| emphasis_statement | zoom_in_slow | overlay_fullscreen_text | all_at_once | 🔲 MVP |
| emphasis_spotlight | static_closeup | overlay_spotlight | reveal_climax | 🔲 V2 |

**④ 비교 (Comparison)** — 두 개 이상의 요소 대비
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| compare_side_by_side | static_wide | split_equal | all_at_once_stagger | 🔲 MVP |
| compare_before_after | pan_left_to_right | grid_2x1 | left_to_right | 🔲 V2 |
| compare_list | static_full | grid_3x1 | top_to_bottom | 🔲 V2 |

**⑤ 전환 (Transition)** — 주제 전환, 화제 변경
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| transition_topic_change | zoom_out_reveal | center_single | all_at_once | 🔲 MVP |
| transition_carry_over | static_full | split_left_stickman | carry_stickman | 🔲 V2 |
| transition_wipe | static_full | (이전 씬 유지) | wipe_replace | 🔲 V3 |

**⑥ 예시 (Example)** — 구체적 수치, 사례 제시
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| example_with_counter | static_full | triple_stickman_text_counter | stickman_first | 🔲 MVP |
| example_story | zoom_in_slow | split_left_stickman | stickman_first | 🔲 V2 |

**⑦ 경고/주의 (Warning)** — 주의사항, 리스크 안내
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| warning_alert | shake 또는 static_full | center_stack | reveal_climax | 🔲 V2 |
| warning_subtle | static_full | split_left_stickman | text_first | 🔲 V2 |

**⑧ 마무리 (Closing)** — 요약, CTA, 인사
| 템플릿명 | 카메라 | 레이아웃 | 타이밍 | 개발 |
|---------|--------|---------|--------|------|
| closing_summary | zoom_out_reveal | center_stack | all_at_once | 🔲 V2 |
| closing_cta | static_full | overlay_fullscreen_text | reveal_climax | 🔲 V2 |

### 씬 템플릿 구현 방식

```typescript
interface SceneTemplate {
  name: string;
  role: "opening" | "explanation" | "emphasis" | "comparison" |
        "transition" | "example" | "warning" | "closing";
  camera: string;            // 카메라 프리셋명
  layout: string;            // 레이아웃 프리셋명
  timing: string;            // 타이밍 프리셋명
  defaultMotion?: string;    // 스틱맨 기본 모션 (override 가능)
  suggestedPoses?: string[]; // 이 씬에 어울리는 포즈 후보
  suggestedExpressions?: string[];
}
```

### 마크다운 스크립트에서의 사용

```markdown
## scene: formula [template: explain_formula]
[stickman: pointing_right, happy]
[text: "복리 = 원금 × (1+r)ⁿ", highlight]
[counter: 1000000 -> 7612255, currency_krw]

백만원을 연 7%로 30년 동안 투자하면 약 761만원이 됩니다.
```

`[template: ...]`을 지정하면 카메라/레이아웃/타이밍이 자동 적용. 지정하지 않으면 오브젝트 조합 기반으로 기존 방식 폴백.

#### 개발 우선순위
1. MVP 8개: intro_greeting, explain_default, explain_formula, explain_reverse, emphasis_number, emphasis_statement, compare_side_by_side, transition_topic_change
2. V2 8개 추가: 도입/예시/경고/마무리 카테고리 확장
3. V3 9개 추가: 특수 연출 + 복합 전환

---

## Layer 5: 영상 템플릿 (Video Template)

> 씬 템플릿의 시퀀스를 장르별로 패키지화한다.
> "이런 종류의 영상을 만들겠다"를 선언하면 씬 구성이 자동 추천된다.

### 개발 현황 및 목표

| 현재 | MVP 목표 | V2 목표 | V3 목표 |
|------|----------|---------|---------|
| 0개 | 2개 | 5개 | 10개 |

### 분류 기준: 영상 장르

**① 교육/설명형 (Educational)**
| 템플릿명 | 구조 | 개발 |
|---------|------|------|
| concept_explainer | 도입 → 정의 → 예시 → 비교 → 강조 → 마무리 | 🔲 MVP |
| step_by_step | 도입 → 단계1 → 단계2 → ... → 정리 → 마무리 | 🔲 V2 |
| myth_buster | 도입 → 통념 → 반박 → 사실 → 마무리 | 🔲 V2 |

**② 정보/뉴스형 (Informational)**
| 템플릿명 | 구조 | 개발 |
|---------|------|------|
| news_summary | 도입 → 핵심1 → 핵심2 → 핵심3 → 마무리 | 🔲 MVP |
| list_ranking | 도입 → N위 → ... → 1위 → 마무리 | 🔲 V2 |

**③ 비교/리뷰형 (Comparison)**
| 템플릿명 | 구조 | 개발 |
|---------|------|------|
| a_vs_b | 도입 → A설명 → B설명 → 비교 → 결론 | 🔲 V2 |
| pros_and_cons | 도입 → 장점들 → 단점들 → 종합 → 마무리 | 🔲 V3 |

**④ 스토리/내러티브형 (Narrative)**
| 템플릿명 | 구조 | 개발 |
|---------|------|------|
| story_arc | 도입 → 배경 → 전개 → 위기 → 해결 → 교훈 | 🔲 V3 |
| biography | 도입 → 초기 → 전환점 → 성과 → 레거시 → 마무리 | 🔲 V3 |

### 영상 템플릿 구현 방식

```typescript
interface VideoTemplate {
  name: string;
  genre: string;
  description: string;
  structure: VideoSection[];
}

interface VideoSection {
  role: string;                      // "opening" | "explanation" | "example" 등
  suggestedSceneTemplates: string[]; // 이 섹션에 적합한 씬 템플릿 후보
  minScenes: number;                 // 이 섹션의 최소 씬 수
  maxScenes: number;                 // 이 섹션의 최대 씬 수
}
```

### 마크다운 스크립트에서의 사용

```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
style: dark_infographic
video_template: concept_explainer
---
```

`video_template`이 지정되면, 각 씬에 `[template: ...]`이 없어도 씬의 위치와 내용에 따라 적절한 씬 템플릿을 자동 추천.

#### 개발 우선순위
1. MVP: concept_explainer, news_summary (가장 범용적인 2개)
2. V2: step_by_step, myth_buster, list_ranking, a_vs_b 추가
3. V3: 내러티브 + 특수 장르 추가

---

## 전체 개발 로드맵 요약

### MVP (Phase 1)
| 레이어 | 추가 작업 | 결과 |
|--------|----------|------|
| L1 | 포즈 +4, 표정 +3, 아이콘 +10 | 포즈 15, 표정 8, 아이콘 15 |
| L2 | 루프 +3, 포즈전환 +3 | 모션 22개 |
| L3 | 카메라 5, 레이아웃 +5, 타이밍 5 | 연출 프리셋 20개 |
| L4 | 씬 템플릿 8개 신규 | 8개 |
| L5 | 영상 템플릿 2개 신규 | 2개 |

### V2 (Phase 2)
| 레이어 | 추가 작업 | 결과 |
|--------|----------|------|
| L1 | 포즈 +10, 표정 +4, 아이콘 +25, 오브젝트 +2 | 포즈 25, 표정 12, 아이콘 40 |
| L2 | 루프 +6, 포즈전환 +4 | 모션 32개 |
| L3 | 카메라 +5, 레이아웃 +8, 타이밍 +5 | 연출 프리셋 38개 |
| L4 | 씬 템플릿 +8 | 16개 |
| L5 | 영상 템플릿 +3 | 5개 |

### V3 (Phase 3)
| 레이어 | 추가 작업 | 결과 |
|--------|----------|------|
| L1 | 포즈 +15, 표정 +8, 아이콘 +60, 오브젝트 +3 | 포즈 40, 표정 20, 아이콘 100 |
| L2 | 루프 +10, 포즈전환 +6 | 모션 48개 |
| L3 | 카메라 +5, 레이아웃 +7, 타이밍 +5 | 연출 프리셋 55개 |
| L4 | 씬 템플릿 +9 | 25개 |
| L5 | 영상 템플릿 +5 | 10개 |

---

## 부록: 조합 가능 수 추정

| 단계 | 레이어별 요소 수 | 이론적 조합 수 |
|------|----------------|---------------|
| MVP 완료 후 | L1: ~40종 × L2: 22 × L3: 20 × L4: 8 × L5: 2 | 수십만 가지 조합 |
| V2 완료 후 | L1: ~80종 × L2: 32 × L3: 38 × L4: 16 × L5: 5 | 수백만 가지 조합 |
| V3 완료 후 | L1: ~170종 × L2: 48 × L3: 55 × L4: 25 × L5: 10 | 수천만 가지 조합 |

하위 레이어의 요소 하나를 추가할 때마다 상위 레이어의 조합 가능 수가 곱셈으로 증가한다. 이것이 "아래부터 채운다" 원칙의 이유다.