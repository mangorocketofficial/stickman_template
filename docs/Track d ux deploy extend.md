# 트랙 D: UX + 배포 + 확장 (Accessibility & Scale)

## 개요

이 문서는 트랙 C(지능형 자동화) **이후** 진행하는 사용자 경험, 출력/배포 자동화, 시스템 확장성을 정의한다. 파이프라인이 충분히 성숙한 후에야 의미 있는 작업들이다.

### 왜 가장 마지막인가
- 웹 GUI → 파이프라인이 안정화되고, 스키마가 확정된 후에야 UI를 만들 수 있음
- YouTube 자동 업로드 → 썸네일/자막/메타데이터 생성이 먼저 완성되어야 함
- 멀티 캐릭터/프롭 → 기본 스틱맨 시스템이 성숙해야 확장 가능
- 플러그인 마켓 → 포즈/모션/템플릿 포맷이 안정화된 후

### 선행 조건
```
트랙 A (Layer MVP): ✓ 완료
트랙 B (시각/오디오): ✓ 완료
트랙 C (지능형 자동화): ✓ Level 2 이상 완료
  - scene.json 스키마 v2 안정화
  - 렌더링 파이프라인 안정화
  - LLM 기반 자동 구성 동작
```

### 의존 관계
```
트랙 A + B + C ──→ 트랙 D (이 문서)
                    ├── D-1: UX / 워크플로우
                    ├── D-2: 출력 / 배포
                    └── D-3: 확장성
```

---

## D-1. 사용자 경험 (UX / Workflow)

### 현재 상태
- CLI: `python pipeline.py script.md`
- 프리뷰: 없음 (렌더링 후에야 확인)
- 에디터: 아무 텍스트 에디터

### D-1-A. 실시간 프리뷰

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| Remotion Studio 연동 | scene.json 변경 시 자동 리로드 | 🔴 높음 |
| 씬 단위 프리뷰 | 특정 씬만 빠르게 미리보기 | 🔴 높음 |
| 핫 리로드 | 마크다운 저장 → 자동 재파싱 → 프리뷰 업데이트 | 🔴 높음 |
| 타임라인 스크러빙 | 프레임 단위 드래그 확인 | 🟡 중간 |
| A/B 비교 | 두 가지 설정의 결과를 나란히 비교 | 🟢 낮음 |

#### 구현 방식
```
[파일 감시 데몬]
  마크다운 변경 감지
       ↓
[파이프라인 (TTS 스킵, 캐싱)]
  scene.json만 재생성 (1~2초)
       ↓
[Remotion Studio]
  자동 리로드
       ↓
[브라우저 프리뷰]
```

### D-1-B. 웹 GUI

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
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │🎬 렌더링 │ │💾 저장   │ │📤 업로드  │               │
│  └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────┘
```

#### 주요 컴포넌트

| 컴포넌트 | 설명 | 우선순위 |
|---------|------|----------|
| 스크립트 에디터 | 마크다운 편집 + 커스텀 신택스 하이라이팅 | 🔴 높음 |
| 프리뷰 패널 | Remotion Player 임베드 | 🔴 높음 |
| 타임라인 | 씬 경계 + 오디오 파형 시각화 | 🟡 중간 |
| 씬 인스펙터 | 선택 씬의 오브젝트/속성 편집 (비주얼) | 🟡 중간 |
| 템플릿 브라우저 | 씬 템플릿 미리보기 + 원클릭 적용 | 🟡 중간 |
| 에셋 라이브러리 | 아이콘/BGM/SFX 검색 + 드래그 앤 드롭 | 🟢 낮음 |
| 히스토리/언두 | 변경 이력 + 되돌리기 | 🟢 낮음 |

#### 기술 스택 (제안)
```
프론트엔드:
  - Next.js (App Router)
  - Monaco Editor (스크립트 편집)
  - @remotion/player (프리뷰)
  - Zustand (상태 관리)

백엔드:
  - Python FastAPI (파이프라인 래핑)
  - WebSocket (실시간 프리뷰 업데이트)
  - Redis (렌더 작업 큐)

인프라:
  - Docker (파이프라인 + Remotion 컨테이너)
  - S3 호환 스토리지 (에셋/출력물)
```

### D-1-C. 렌더링 최적화

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 씬 단위 캐싱 | 변경 없는 씬 재렌더링 안 함 | 🔴 높음 |
| 병렬 렌더링 | Remotion concurrency 최적화 | 🔴 높음 |
| 드래프트 모드 | 저해상도 빠른 프리뷰 (480p, 15fps) | 🔴 높음 |
| 증분 렌더링 | 수정 씬만 재렌더 후 합치기 | 🟡 중간 |
| 클라우드 렌더링 | Remotion Lambda 또는 자체 렌더팜 | 🟢 낮음 |

#### 캐싱 전략
```
[scene.json 변경 감지]
  ↓
씬별 해시 비교
  ↓
변경된 씬만 → Remotion 렌더
변경 없는 씬 → 캐시에서 프레임 로드
  ↓
최종 합치기 → final.mp4
```

#### 렌더 시간 목표

| 영상 길이 | 현재 (예상) | 최적화 후 | 클라우드 |
|----------|-----------|----------|---------|
| 3분 | ~3분 | ~1분 | ~20초 |
| 5분 | ~5분 | ~2분 | ~30초 |
| 10분 | ~10분 | ~4분 | ~1분 |

### 개발 순서 (D-1)
1. Remotion Studio 연동 + 핫 리로드
2. 드래프트 모드 (빠른 프리뷰)
3. 씬 단위 캐싱
4. Next.js 웹 GUI 스캐폴딩
5. 스크립트 에디터 + Remotion Player 통합
6. 타임라인 + 씬 인스펙터
7. 에셋 라이브러리
8. 클라우드 렌더링

---

## D-2. 출력 및 배포 (Output & Distribution)

### 현재 상태
- 출력: `final.mp4` + `captions.srt`
- 배포: 수동 업로드

### D-2-A. 자동 산출물

| 산출물 | 설명 | 우선순위 |
|--------|------|----------|
| final.mp4 | 메인 영상 (1080p) | ✅ 완료 |
| captions.srt | 자막 파일 | ✅ 완료 |
| thumbnail.png | 자동 생성 썸네일 | 🔴 높음 |
| thumbnail_alt.png | 대안 썸네일 2~3개 | 🟡 중간 |
| chapters.txt | YouTube 챕터 마커 | 🔴 높음 |
| description.txt | 자동 생성 영상 설명 | 🟡 중간 |
| tags.txt | 자동 추출 키워드/태그 | 🟡 중간 |
| shorts.mp4 | 세로형 숏폼 (9:16) | 🟡 중간 |
| preview.gif | 미리보기 GIF (5초) | 🟢 낮음 |

### D-2-B. 썸네일 자동 생성

#### 씬 선택 알고리즘
```python
def select_thumbnail_scene(scenes: list) -> Scene:
    """가장 시각적으로 풍성한 씬 선택"""
    scored = []
    for scene in scenes:
        score = len(scene["objects"])
        for obj in scene["objects"]:
            if obj["type"] == "counter": score += 3  # 숫자는 시선 끔
            if obj["type"] == "icon": score += 1
        if scene.get("template") == "emphasis_number": score += 3
        if scene.get("template") == "emphasis_statement": score += 2
        scored.append((score, scene))
    return max(scored, key=lambda x: x[0])[1]
```

#### 썸네일 레이아웃
```
┌─────────────────────────────┐
│                             │
│   [핵심 텍스트 크게]         │
│   (영상 제목 or 핵심 문장)    │
│                             │
│      [스틱맨]  [아이콘]      │
│   (역동적 포즈)              │
│                             │
│   [보조: 숫자 or 키워드]     │
│                             │
└─────────────────────────────┘

크기: 1280×720
폰트: 테마의 title 스타일 (2배 크기)
배경: 테마 배경 + vignette
```

### D-2-C. 챕터 마커

```python
def generate_chapters(scenes: list) -> str:
    """scene.json의 씬 경계를 YouTube 챕터로 변환"""
    chapters = []
    for scene in scenes:
        timestamp = ms_to_timestamp(scene["startMs"])  # "00:00", "01:23"
        # 씬 이름 또는 첫 번째 텍스트 오브젝트 내용
        title = get_scene_title(scene)
        chapters.append(f"{timestamp} {title}")
    return "\n".join(chapters)
```

출력 예시:
```
00:00 인트로
00:08 단리란?
00:15 복리란?
00:23 복리 공식
00:35 30년 후 차이
00:48 72의 법칙
01:05 실전 예시
01:25 주의사항
01:40 마무리
```

### D-2-D. 다중 포맷 출력

| 포맷 | 해상도 | 비율 | 용도 |
|------|--------|------|------|
| youtube_hd | 1920×1080 | 16:9 | YouTube 기본 |
| youtube_4k | 3840×2160 | 16:9 | YouTube 4K |
| shorts | 1080×1920 | 9:16 | Shorts / TikTok / Reels |
| square | 1080×1080 | 1:1 | Instagram 피드 |
| preview | 854×480 | 16:9 | 빠른 프리뷰 |

#### 세로형(Shorts) 자동 레이아웃 재배치
```
가로 (16:9)                    세로 (9:16)
┌──────────────────┐          ┌──────────┐
│ [SM]    [TEXT]   │    →     │  [TEXT]  │
│         [CTR]    │          │          │
└──────────────────┘          │   [SM]   │
                              │          │
                              │  [CTR]   │
                              └──────────┘
```

각 레이아웃 프리셋에 `vertical` 변형 추가 필요:
```typescript
interface LayoutPreset {
  name: string;
  slots: LayoutSlot[];            // 기본 (16:9)
  verticalSlots?: LayoutSlot[];   // 세로형 (9:16) 변형
  squareSlots?: LayoutSlot[];     // 정사각형 (1:1) 변형
}
```

### D-2-E. YouTube API 연동

```
[렌더링 완료]
       ↓
[YouTube Data API v3]
       ↓
  ├── 영상 업로드 (mp4)
  ├── 제목 설정 (meta.title)
  ├── 설명 설정 (description.txt)
  ├── 태그 설정 (tags.txt)
  ├── 자막 업로드 (captions.srt)
  ├── 썸네일 설정 (thumbnail.png)
  ├── 챕터 (description에 포함)
  └── 공개 설정 (기본: 비공개 → 검수 후 공개)
```

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 영상 업로드 | mp4 → YouTube | 🔴 높음 |
| 메타데이터 설정 | 제목, 설명, 태그, 카테고리 | 🔴 높음 |
| 자막 업로드 | SRT 파일 자동 첨부 | 🔴 높음 |
| 썸네일 설정 | 생성된 썸네일 업로드 | 🔴 높음 |
| 예약 발행 | 지정 시간에 공개 | 🟡 중간 |
| 시리즈 관리 | 재생목록 자동 추가 | 🟡 중간 |
| 분석 연동 | 업로드 후 조회수/시청시간 추적 | 🟢 낮음 |

### D-2-F. 메타데이터 자동 생성 (LLM 활용)

```python
def generate_metadata(script: ParsedScript, scene_data: dict) -> dict:
    """LLM으로 영상 설명/태그 자동 생성"""
    prompt = f"""
    아래 영상의 YouTube 메타데이터를 생성하세요.
    
    제목: {script.meta['title']}
    나레이션: {script.full_narration[:500]}
    
    출력:
    - description: 영상 설명 (2~3문단, SEO 최적화)
    - tags: 관련 키워드 10~15개
    - category: YouTube 카테고리
    """
    return call_llm(prompt)
```

### 개발 순서 (D-2)
1. 썸네일 자동 생성 (씬 스냅샷 + 텍스트 오버레이)
2. 챕터 마커 생성
3. YouTube API 연동 (업로드 + 메타데이터)
4. 다중 해상도 (4K, 720p)
5. 세로형 Shorts 변환
6. LLM 기반 설명/태그 자동 생성
7. 예약 발행 + 시리즈 관리

---

## D-3. 확장성 (Extensibility)

### 현재 상태
- 캐릭터: 스틱맨 1명 고정
- 확장: 코드 직접 수정만 가능

### D-3-A. 멀티 캐릭터

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 듀얼 스틱맨 | 한 씬에 2명 (좌/우) | 🔴 높음 |
| 캐릭터 구분 | 색상, 크기, 표식 | 🔴 높음 |
| 대화 모드 | 말하는 캐릭터 강조, 듣는 캐릭터 반응 | 🟡 중간 |
| 최대 3명 | 패널 토의 | 🟢 낮음 |
| 군중 | 배경 소형 스틱맨 | 🟢 낮음 |

#### 마크다운 문법
```markdown
## scene: debate
[stickman A: pointing_right, happy, color: #FFFFFF]
[stickman B: shrugging, confused, color: #4FC3F7]
[text: "A vs B", title]

A가 말합니다: 복리가 더 좋습니다!
B가 반론합니다: 하지만 리스크도 있잖아요.
```

#### 대화 모드 구현
```typescript
interface DialogueTurn {
  speaker: "A" | "B" | "C";
  text: string;
  startMs: number;
  endMs: number;
}

// 말하는 캐릭터: scale 1.0 + 포즈 변경 + 입 움직임
// 듣는 캐릭터: scale 0.9 + opacity 0.7 + nodding 모션
```

#### 전용 레이아웃
```
듀얼 (대화)               듀얼 (비교)
┌────────────────────┐   ┌────────────────────┐
│  [A]    💬    [B]  │   │  [A]   vs   [B]   │
│  설명       반론   │   │  단리        복리  │
└────────────────────┘   └────────────────────┘
```

### D-3-B. 프롭 시스템 (Props)

스틱맨이 물건을 들거나 사용하는 연출.

| 프롭 | 부착 위치 | 우선순위 |
|------|----------|----------|
| book | 한 손 (lowerArm) | 🔴 높음 |
| magnifier | 한 손 | 🔴 높음 |
| money | 한 손 | 🔴 높음 |
| phone | 한 손 | 🟡 중간 |
| sign_board | 양손 | 🟡 중간 |
| laptop | 무릎 (sitting 전용) | 🟡 중간 |
| flag | 한 손 | 🟢 낮음 |
| umbrella | 한 손 | 🟢 낮음 |

#### schema.ts 확장
```typescript
interface StickmanProps {
  // ... 기존 필드
  prop?: {
    name: string;                // 프롭 식별자
    hand: "left" | "right" | "both";
    scale?: number;              // 기본 1.0
  };
}
```

#### 마크다운 문법
```markdown
[stickman: reading, focused, prop: book]
[stickman: sitting, neutral, prop: laptop]
```

#### 구현 방식
```
프롭 SVG는 lowerArm 끝(손 위치)에 부착
포즈별 프롭 호환성 테이블 필요:
  - reading + book ✓
  - pointing_right + book ✗ (손이 펴져있어서)
  - sitting + laptop ✓
  - standing + laptop ✗
```

### D-3-C. 캐릭터 커스터마이징

| 요소 | 옵션 | 우선순위 |
|------|------|----------|
| 색상 | 임의 hex | ✅ 완료 |
| 선 굵기 | 1~5 | ✅ 완료 |
| 크기 | 0.5~2.0 | ✅ 완료 |
| 악세서리 - 머리 | 안경, 모자, 왕관, 헤드폰, 리본 | 🟡 중간 |
| 악세서리 - 몸 | 넥타이, 망토, 가방, 앞치마 | 🟢 낮음 |
| 스타일 변형 | 기본, 둥근, 각진, 귀여운 | 🟢 낮음 |

#### 악세서리 구현
```typescript
interface Accessory {
  name: string;
  attachTo: "head" | "torso" | "hip";
  svgPath: string;
  offset: { x: number; y: number };
  scale: number;
}
```

#### 마크다운 문법
```markdown
[stickman: explaining, happy, accessory: glasses]
[stickman: celebrating, happy, accessory: crown]
```

### D-3-D. 플러그인 / 커뮤니티 구조

#### 플러그인 유형

| 플러그인 타입 | 내용물 | 우선순위 |
|-------------|--------|----------|
| 포즈 팩 | JSON 포즈 세트 | 🔴 높음 |
| 모션 팩 | 모션 프리셋 세트 | 🔴 높음 |
| 아이콘 팩 | SVG 아이콘 (주제별: 의료, IT, 교육) | 🔴 높음 |
| 씬 템플릿 팩 | 씬 템플릿 세트 | 🟡 중간 |
| 테마 팩 | 컬러 테마 + 배경 + 폰트 | 🟡 중간 |
| BGM 팩 | 무드별 BGM 세트 | 🟡 중간 |
| SFX 팩 | 효과음 세트 | 🟡 중간 |
| 캐릭터 팩 | 프롭 + 악세서리 + 포즈 세트 | 🟢 낮음 |

#### 플러그인 디렉토리 구조
```
stickman-plugin-medical/
├── plugin.json                 # 메타데이터
│   {
│     "name": "Medical Pack",
│     "version": "1.0.0",
│     "author": "...",
│     "type": ["icons", "poses", "templates"],
│     "description": "의료/건강 주제 영상용 에셋 팩"
│   }
├── poses/
│   ├── doctor_standing.json
│   └── patient_sitting.json
├── icons/
│   ├── stethoscope.svg
│   ├── syringe.svg
│   ├── heartbeat.svg
│   └── hospital.svg
├── templates/
│   └── diagnosis_scene.json
└── preview/
    └── thumbnail.png
```

#### 플러그인 로딩
```python
# 플러그인 매니저
class PluginManager:
    def load_plugin(self, path: str):
        """플러그인 디렉토리에서 에셋 로드"""
        manifest = load_json(f"{path}/plugin.json")
        
        if "poses" in manifest["type"]:
            self.register_poses(f"{path}/poses/")
        if "icons" in manifest["type"]:
            self.register_icons(f"{path}/icons/")
        if "templates" in manifest["type"]:
            self.register_templates(f"{path}/templates/")
    
    def list_plugins(self) -> list:
        """설치된 플러그인 목록"""
    
    def install_from_url(self, url: str):
        """원격 플러그인 설치"""
```

#### 마켓플레이스 (장기 비전)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 플러그인 검색 | 키워드/카테고리별 검색 | 🟡 중간 |
| 원클릭 설치 | URL or 마켓에서 설치 | 🟡 중간 |
| 버전 관리 | 플러그인 업데이트/호환성 체크 | 🟢 낮음 |
| 사용자 제작 공유 | 누구나 플러그인 업로드 | 🟢 낮음 |
| 유료 에셋 판매 | 프리미엄 에셋 결제 | 🟢 낮음 |

### 개발 순서 (D-3)
1. 듀얼 스틱맨 (한 씬 2명)
2. 기본 프롭 3개 (book, magnifier, money)
3. 포즈/아이콘 팩 import/export 포맷 확정
4. 플러그인 매니저 구현
5. 악세서리 시스템
6. 대화 모드 (말하기/듣기 분리)
7. 캐릭터 스타일 변형
8. 플러그인 마켓플레이스

---

## 전체 개발 순서 요약 (트랙 D 내부)

```
D-1-C. 렌더링 최적화 (1주)
  ├── 드래프트 모드
  ├── 씬 단위 캐싱
  └── 병렬 렌더링 튜닝
       ↓
D-1-A. 실시간 프리뷰 (1주)
  ├── Remotion Studio 핫 리로드
  └── 씬 단위 프리뷰
       ↓
D-2-A~C. 출력 자동화 (1~2주)
  ├── 썸네일 자동 생성
  ├── 챕터 마커
  └── YouTube API 연동
       ↓
D-3-A~B. 확장 기초 (2주)
  ├── 듀얼 스틱맨
  ├── 프롭 시스템
  └── 플러그인 포맷 확정
       ↓
D-1-B. 웹 GUI (3~4주)
  ├── 스크립트 에디터 + 프리뷰
  ├── 타임라인
  └── 에셋 라이브러리
       ↓
D-2-D~E. 배포 확장 (1~2주)
  ├── 다중 포맷 (Shorts, 4K)
  ├── 메타데이터 자동 생성
  └── 예약 발행
       ↓
D-3-C~D. 확장 고급 (2~3주)
  ├── 악세서리 시스템
  ├── 대화 모드
  ├── 캐릭터 스타일 변형
  └── 플러그인 마켓플레이스
```

---

## 완료 기준

| 마일스톤 | 기준 |
|---------|------|
| D-1 완료 | 웹에서 마크다운 편집 → 실시간 프리뷰 → 렌더링까지 원스톱 |
| D-2 완료 | 렌더링 → 썸네일/자막/챕터/설명 자동 생성 → YouTube 원클릭 업로드 |
| D-3 완료 | 커뮤니티가 포즈/아이콘/템플릿 팩을 만들어 공유/설치 가능 |
| 트랙 D 전체 | 비개발자가 웹 GUI에서 텍스트 입력 → 영상 생성 → YouTube 업로드까지 원클릭. 주 5개 이상 영상을 일관된 품질로 생산 가능 |

---

## 성공 지표 (KPI)

| 지표 | 트랙 D 시작 시 | D-1 완료 | D-2 완료 | D-3 완료 |
|------|--------------|---------|---------|---------|
| 영상 1개 제작 시간 | 5분 | 3분 | 2분 | 1분 |
| 사용 가능 유저층 | 개발자 | 개발자+파워유저 | 일반 사용자 | 팀/커뮤니티 |
| 렌더링 시간 (5분) | ~2분 | ~1분 | ~1분 | ~30초 |
| 업로드까지 클릭 수 | ~10회 (수동) | ~5회 | 1회 | 0회 (자동) |
| 커스터마이즈 가능 범위 | 코드 수정 | JSON 편집 | GUI 클릭 | 플러그인 설치 |