# Start Pipeline (원파이프라인)

음성 파일 하나로 **스크립트 생성 → 음성 정렬 → 자막 → 이미지 생성 → 씬 합성**까지 전체를 실행합니다.
렌더링은 제외하고 Remotion Studio에서 프리뷰할 수 있도록 준비합니다.

## 입력

음성 파일 경로: $ARGUMENTS

## 실행 절차

**중간에 사용자에게 확인을 요청하지 않습니다. 모든 단계를 자율적으로 진행합니다.**

---

### Step 1. 음성 파일 확인

- `$ARGUMENTS` 경로의 파일이 존재하는지 확인
- 파일이 없으면 에러 메시지 출력 후 중단
- 음성 파일의 확장자 확인 (`.mp3`, `.m4a`, `.wav` 등)
- 파일명에서 주제명 추출 (확장자 제외, e.g. `공중위생법규`)

---

### Step 2. 기존 스크립트 검색

`scripts/` 디렉토리에서 이미 작성된 스크립트가 있는지 확인:

1. **파일명 매칭**: `scripts/{주제명}.md` 존재 여부 확인
2. **frontmatter 검색**: 없으면 `scripts/*.md`의 `audio_file:` frontmatter에서 음성 파일명 검색
3. **있으면**: Step 4로 건너뜀 (스크립트 생성 불필요)
4. **없으면**: Step 3 진행

---

### Step 3. 스크립트 자동 생성 (기존 스크립트 없을 때만)

#### 3a. 음성 전사 (Transcription)

Groq Whisper API로 음성을 텍스트로 변환:

```bash
cd c:\Users\User\Desktop\stickman-templates && python python/alignment.py "$ARGUMENTS"
```

이 명령은 `{음성파일명}_alignment.json`을 생성합니다. 이 JSON에서 `text` (전체 전사 텍스트)와 `segments` (구간별 텍스트)를 읽습니다.

#### 3b. 마크다운 스크립트 구성

전사된 텍스트를 분석하여 `scripts/{주제명}.md` 파일을 생성합니다.

**YAML frontmatter**:
```yaml
---
title: {주제명에서 유추한 제목}
voice: ko-KR-HyunsuNeural
style: whiteboard
audio_file: {프로젝트 루트 기준 음성 파일 상대경로}
headerText: 원펀 : 미용사(네일) - {제목}
---
```

**씬 분할 규칙**:
전사 텍스트를 의미 단위로 씬을 나눕니다. 기존 `scripts/nail_tech.md`의 패턴을 참고:

1. 전사 텍스트의 segments를 읽어 주제 전환점을 파악
2. 주제가 바뀌는 곳마다 새 씬 (`## scene: {영문_이름}`) 생성
3. 첫 씬은 `intro`, 마지막 씬은 `conclusion`
4. 각 씬에 `[text: "{핵심 키워드}", highlight]` 디렉티브 추가 (첫/마지막 씬은 `title`)
5. 씬 하나의 나레이션이 너무 길면 (500자 초과) 적절히 분할
6. 씬 이름은 영문 snake_case (내용을 반영한 이름)
7. 보통 5~15개 씬이 적당

**씬 구조 예시**:
```markdown
## scene: intro
[text: "자격증 필기 완전정복", title]

첫 번째 나레이션 텍스트...

## scene: topic_name
[text: "핵심 키워드", highlight]

해당 주제의 나레이션 텍스트...

## scene: conclusion
[text: "합격의 열쇠", title]

마무리 나레이션 텍스트...
```

---

### Step 4. audio_file frontmatter 확인/업데이트

스크립트의 YAML frontmatter에서 `audio_file:` 값이 음성 파일을 정확히 가리키는지 확인.
프로젝트 루트 기준 상대 경로로 설정합니다.

예시: `remotion/assets/공중위생법규.m4a` → `audio_file: remotion/assets/공중위생법규.m4a`

---

### Step 5. 파이프라인 실행 (pipeline.py)

```bash
cd c:\Users\User\Desktop\stickman-templates && python python/pipeline.py scripts/{주제명}.md -o remotion/public
```

파이프라인 내부에서 다음 단계가 순차 실행됩니다:

| 내부 단계 | 내용 | 설명 |
|-----------|------|------|
| [1/8] | 스크립트 파싱 | 마크다운 → 씬/나레이션 구조 파싱 |
| [2/8] | 음성 로드 | `audio_file` frontmatter의 음성을 output에 복사 |
| [3/8] | 음성 정렬 | Groq Whisper로 단어별 타임스탬프 추출 |
| [4/8] | **자막 생성** | Whisper 타임스탬프 기반 SRT + words.json 생성 |
| [5/8a] | 씬 분할 | 긴 씬을 ~15초 단위로 분할 |
| [5/8b] | 이미지 씬 선별 | 전체의 ~30%를 이미지 씬으로 동적 선별 |
| [5/8c] | 스틱맨 배치 | 화이트보드 씬에 포즈/표정/모션 할당 |
| [5/8d] | **설명 텍스트 생성** | 화이트보드 씬에 키워드/설명 텍스트 오버레이 생성 (LLM 사용) |
| [6/8] | **이미지 생성** | Google Imagen API로 선별된 씬의 배경 이미지 생성 (씬당 ~15초 + 10초 대기) |
| [7/8] | **씬 합성 (scene.json)** | 이미지 + 화이트보드 + 스틱맨 + 설명텍스트 + 자막 + 음성 → `scene.json` 생성 |
| [8/8] | (렌더링) | `--render` 없으므로 스킵 |

- 파이프라인 출력을 실시간으로 모니터링
- 에러 발생 시 원인 분석 후 해결 시도
- 이미지 생성 수에 따라 약 5~15분 소요

---

### Step 6. 결과 검증

파이프라인 완료 후 생성된 파일들을 확인:

| 파일 | 경로 | 내용 |
|------|------|------|
| scene.json | `remotion/public/scene.json` | 전체 씬 구성 (타이밍, 오브젝트, 배경) |
| 음성 | `remotion/public/audio/tts_output.mp3` | 복사된 원본 음성 |
| 자막 SRT | `remotion/public/subtitles/captions.srt` | 시간 동기화된 자막 |
| 자막 JSON | `remotion/public/subtitles/words.json` | 단어별 타임스탬프 |
| 이미지 | `remotion/public/images/scene_*.png` | AI 생성 배경 이미지 (이미지 씬만) |

결과 요약 출력:
- 총 씬 수 (이미지 씬 / 화이트보드 씬 비율)
- 생성 성공/실패 이미지 수
- 전체 영상 길이 (초)
- 평균 씬 길이

---

### Step 7. Remotion Studio 프리뷰 안내

```
Remotion Studio에서 프리뷰 가능합니다.
이미 실행 중이면 브라우저에서 새로고침하세요.
실행 안 됐으면: cd remotion && npm start
```

---

## 전체 흐름 요약

```
음성 파일 (.m4a/.mp3)
  │
  ├─ Step 1: 파일 확인 + 주제명 추출
  ├─ Step 2: 기존 scripts/{주제명}.md 검색
  ├─ Step 3: (없으면) Whisper 전사 → 씬 분할 → .md 스크립트 생성
  ├─ Step 4: audio_file frontmatter 경로 확인
  │
  └─ Step 5: pipeline.py 실행
       ├─ [1/8] 스크립트 파싱
       ├─ [2/8] 음성 복사
       ├─ [3/8] Whisper 음성 정렬 (단어 타임스탬프)
       ├─ [4/8] 자막 생성 (SRT + words.json)
       ├─ [5/8a] 씬 분할 (~15초 단위)
       ├─ [5/8b] 이미지/화이트보드 씬 선별 (~30%)
       ├─ [5/8c] 스틱맨 포즈/표정 배치
       ├─ [5/8d] 설명 텍스트 생성 (키워드 오버레이, LLM)
       ├─ [6/8] Google Imagen 이미지 생성
       └─ [7/8] scene.json 합성 (이미지+화이트보드+스틱맨+설명텍스트+자막+음성)
  │
  ├─ Step 6: 결과 검증 (파일 확인 + 요약)
  └─ Step 7: Remotion Studio 프리뷰 안내
```

## 주의사항

- `GROQ_API_KEY` 환경변수 필수 (음성 전사 + 정렬 모두 필요)
- Google Cloud 인증 필수 (Imagen API 이미지 생성)
- 이미지 생성은 씬당 약 10~15초 + 10초 rate limit 대기
- 전사 품질이 낮으면 스크립트 수동 수정 필요할 수 있음
- 파이프라인 중 에러 발생 시 자동으로 원인 분석 및 해결 시도
