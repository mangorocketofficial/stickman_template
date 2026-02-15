# Imagen 이미지 생성 파이프라인

## 전체 흐름

```
마크다운 스크립트
  → 씬 파싱
  → 이미지 씬 선택 (~30%)
  → 프롬프트 생성 (3단계)
  → Imagen API 호출
  → 이미지 저장 (images/scene_XX.png)
  → scene.json 배경으로 삽입
  → Remotion Ken Burns 애니메이션 렌더링
```

---

## 1. 이미지 씬 선택

**파일**: `python/stickman_assigner.py` → `select_image_scenes()`

전체 씬의 ~30%를 이미지 생성 대상으로 자동 선택. 나머지 ~70%는 화이트보드+스틱맨.

### 우선순위 점수

| 점수 | 조건 |
|------|------|
| 100 | 첫/마지막 씬 (항상 포함) |
| 90 | `[image_hint]` 디렉티브가 있는 씬 |
| 80 | 섹션 오프너 |
| 70 | 새 섹션 그룹의 첫 서브씬 |
| 60 | emphasis/surprise/closing 감정 |
| 40 | positive/negative 감정 |
| 10 | 기본값 |

---

## 2. 프롬프트 생성 (3단계 전략)

### Tier 1: 스타일 템플릿

**파일**: `python/prompt_templates/`

3가지 스타일 중 선택:

| 스타일 | 파일 | 특징 |
|--------|------|------|
| Dark Infographic | `dark_infographic.py` | 다크 네이비 배경(#1a1a2e), 미니멀 인포그래픽 |
| Pastel Education | `pastel_education.py` | 파스텔 톤, 따뜻한 교육 스타일 |
| Whiteboard | `whiteboard.py` | 플랫 라인아트, 캐릭터 중심 |

모든 템플릿에 **"no text in image"** 명시 — 텍스트는 Remotion에서 오버레이 처리.

### Tier 2: 감정 기반 무드 매핑

**파일**: `python/prompt_generator.py`

한국어 나레이션에서 감정 키워드를 감지하여 시각적 무드로 변환:

| 씬 역할 | 무드 |
|----------|------|
| opening | welcoming and inviting atmosphere, establishing shot |
| explanation | clear and educational diagram, concept visualization |
| emphasis | dramatic and impactful visual, bold composition |
| comparison | side-by-side comparison layout, split view |
| example | practical illustration, real-world scenario |
| warning | cautionary visual, attention-grabbing, alert mood |
| closing | inspiring and hopeful atmosphere, forward-looking |

### Tier 3: LLM 프롬프트 강화

**파일**: `python/prompt_generator.py` → `_llm_generate_description()`

Groq Llama API로 나레이션 텍스트를 1~2문장 영어 시각 묘사로 변환.

---

## 3. Imagen API 호출

**파일**: `python/image_generator.py` → `generate_single_image()`

### API 설정

```python
client = genai.Client(
    vertexai=True,
    project="notebooklm-485105",  # GOOGLE_CLOUD_PROJECT
    location="us-central1",       # GOOGLE_CLOUD_LOCATION
)

response = client.models.generate_images(
    model="imagen-4.0-ultra-generate-001",
    prompt=prompt,
    config=GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio="16:9",
        output_mime_type="image/png",
        person_generation="allow_adult",
        safety_filter_level="block_only_high",
        language="en",
    ),
)
```

### 파라미터

| 항목 | 값 |
|------|-----|
| 모델 | `imagen-4.0-ultra-generate-001` |
| 인증 | Google Cloud Vertex AI |
| 이미지 수 | 1장/호출 |
| 비율 | 16:9 |
| 포맷 | PNG |
| 사람 생성 | 성인 허용 |
| 안전 필터 | block_only_high |

### 에러 처리

- 최대 3회 재시도, 지수 백오프 (1s, 2s, 4s)
- 이미지 간 10초 Rate Limit 대기
- 실패 시 `success=False` 반환, 파이프라인은 계속 진행 (폴백 배경색 사용)

---

## 4. 영상 통합

**파일**: `python/scene_builder.py` → `build_scene_v2()`

생성된 이미지는 `scene.json`에 배경으로 삽입:

```json
{
  "background": {
    "type": "image",
    "src": "images/scene_01.png",
    "animation": "kenBurns",
    "animationIntensity": 0.5
  }
}
```

### Ken Burns 효과 (5종 순환)

`kenBurns` → `zoomIn` → `zoomOut` → `panLeft` → `panRight`

---

## 5. 화이트보드 프롬프트 엔진

**파일**: `python/whiteboard_prompt_engine.py`

교육용 화이트보드 스타일 전용 프롬프트 생성:

### 다이어그램 타입 매핑

| 씬 역할 | 다이어그램 |
|----------|------------|
| opening | 중심 개념 + 분기 화살표 |
| explanation | 단계별 플로차트 |
| emphasis | 핵심 개념 하이라이트 |
| comparison | 좌우 비교 차트 |
| example | 계산 예시 다이어그램 |
| warning | 경고 기호 + 핵심 포인트 |
| closing | 요약 마인드맵 |

### LLM 배치 생성

- 10개 씬을 배치로 묶어 Groq Llama에 전송
- 캐릭터 중심 일러스트 프롬프트 생성
- 재시도: 배치 → 반배치 → 개별 씬 폴백
- Rate Limit: 배치 간 1~2초 대기

---

## 6. 실행 모드

| 모드 | 명령어 | 설명 |
|------|--------|------|
| 실제 생성 | `python pipeline.py script.md -o output` | Imagen API 호출 (이미지당 ~15초) |
| 플레이스홀더 | `python pipeline.py script.md -o output --placeholder-images` | Pillow 그라디언트 (테스트용) |
| 건너뛰기 | `python pipeline.py script.md -o output --skip-images` | 기존 이미지 재사용 |

---

## 7. 환경 변수

| 변수 | 용도 | 기본값 |
|------|------|--------|
| `GOOGLE_CLOUD_PROJECT` | Vertex AI 프로젝트 | `notebooklm-485105` |
| `GOOGLE_CLOUD_LOCATION` | Vertex AI 리전 | `us-central1` |
| `GROQ_API_KEY` | LLM 프롬프트 강화 | (필수) |

---

## 8. 출력 구조

```
output/images/
├── scene_01.png
├── scene_02.png
├── scene_03.png
└── ...
```

파일명: `scene_{index+1:02d}.png` (1-based, zero-padded)

---

## 핵심 설계 원칙

1. **이미지에 텍스트 없음** — 텍스트/숫자는 모두 Remotion 오버레이로 처리
2. **혼합 렌더링** — 30% AI 이미지 + 70% 화이트보드/스틱맨 (비용 최적화)
3. **다단계 프롬프트** — 템플릿 + 감정 매핑 + LLM으로 품질 향상
4. **폴백 전략** — API 실패 시에도 파이프라인 중단 없이 진행
