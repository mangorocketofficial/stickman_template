# Stickman Infographic Video Automation — Development Specification

## 1. Project Overview

### 1.1 Goal
Build an automated pipeline that converts a written script into a fully rendered infographic-style YouTube long-form video featuring animated stickman characters, text overlays, icons, counters, and synced subtitles.

### 1.2 Core Philosophy
- **MVP First**: Build the minimum viable version that produces a watchable video end-to-end.
- **Modular Architecture**: Every component must be independently replaceable and extensible.
- **Automation Over Editing**: No visual editor. Script in → Video out. Manual adjustments happen in JSON.
- **Audio is Truth**: All timing derives from the audio track. Scenes are drawn to match audio timing.

### 1.3 Target Output
- **Input**: A markdown script file with narration text and scene directives
- **Output**: `final.mp4` (1080p, H.264) + `captions.srt`
- **Duration**: 3–5 minute videos
- **Style**: Dark-themed infographic with white stickman, colored text/icons

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Python Pipeline                       │
│                                                         │
│  [Script.md] → [Script Parser] → [Edge TTS] → [audio]  │
│                                       ↓                  │
│                              [Groq Whisper API]          │
│                                       ↓                  │
│                              [Word-level timestamps]     │
│                                       ↓                  │
│                              [Scene Builder]             │
│                                       ↓                  │
│                              [scene.json + captions.srt] │
└───────────────────────────────┬─────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────┐
│                   Remotion Project                       │
│                                                         │
│  [scene.json] → [MainVideo] → [SceneRenderer]          │
│                                    ↓                     │
│                   ┌────────────────┼────────────┐       │
│                   ↓                ↓            ↓       │
│              [StickMan]    [AnimatedText]  [Counter]    │
│              [Shape]       [IconElement]   [Subtitle]   │
│                                    ↓                     │
│                            [Remotion Render]            │
│                                    ↓                     │
│                              [final.mp4]                │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| TTS | Edge TTS (`edge-tts` Python package) | Voice: `ko-KR-HyunsuNeural` (Korean male) |
| Speech Alignment | Groq API (Whisper `whisper-large-v3-turbo`) | Free tier, word-level timestamps via `timestamp_granularities[]=word` |
| Scene Generation | Python 3.11+ | Script parsing, JSON generation |
| Video Rendering | Remotion v4 (React + TypeScript) | Headless render via CLI |
| Animation | Remotion `interpolate()`, `spring()` | Frame-based animation primitives |
| Encoding | ffmpeg (bundled with Remotion) | H.264, AAC |
| Subtitles | SRT generation (Python) + Remotion burn-in | Dual output: file + burned-in |

### Key Dependencies

**Python side:**
```
edge-tts
groq
```

**Node.js side:**
```
remotion
@remotion/cli
@remotion/captions
react
typescript
```

---

## 4. Module Breakdown & Parallel Development Strategy

Development uses **git worktree** to enable parallel Claude Code agents working on separate branches simultaneously, then merging via PRs.

### Branch Structure

```
main                          ← stable base, merge target
├── feat/python-pipeline      ← Agent 1: Python pipeline (TTS, alignment, scene builder)
├── feat/remotion-core        ← Agent 2: Remotion project setup + scene renderer
├── feat/stickman-component   ← Agent 3: StickMan component + poses + motions
└── feat/integration          ← Final: wire everything together + test
```

### Module Ownership

#### Agent 1: `feat/python-pipeline`
**Scope:** Everything in `python/` directory
- Script parser (`script_parser.py`)
- TTS generator (`tts_generator.py`) — Edge TTS, Hyunsu voice
- Audio alignment (`alignment.py`) — Groq Whisper API
- Scene builder (`scene_builder.py`) — generates `scene.json`
- Subtitle generator (`subtitle_generator.py`) — generates `.srt`
- Pipeline orchestrator (`pipeline.py`) — CLI entry point
- Sample test script (`scripts/sample_compound_interest.md`)

**Output contract:** Generates valid `scene.json` conforming to the schema in Section 5, plus `captions.srt` and word-level `words.json`.

#### Agent 2: `feat/remotion-core`
**Scope:** Remotion project scaffolding + rendering components (excluding StickMan)
- Remotion project init + config
- `MainVideo.tsx` — top-level composition reading `scene.json`
- `SceneRenderer.tsx` — renders a single scene with background + transitions
- `ObjectRenderer.tsx` — routes object types to components
- `AnimatedText.tsx` — text with enter/during/exit animations
- `Counter.tsx` — animated number counter
- `Shape.tsx` — arrow, line, rectangle, circle
- `IconElement.tsx` — SVG icon display with animation
- `SubtitleOverlay.tsx` — word-level highlight subtitles
- `utils/timing.ts` — ms↔frame conversion helpers
- `utils/layout.ts` — auto-layout position helpers
- Animation presets: `fadeIn`, `fadeInUp`, `fadeOut`, `slideLeft`, `slideRight`, `popIn`, `typewriter`, `drawLine`

**Output contract:** Given a valid `scene.json` + audio file + stickman component, renders complete MP4.

#### Agent 3: `feat/stickman-component`
**Scope:** StickMan component system in `remotion/src/components/StickMan/`
- `StickMan.tsx` — main component
- `skeleton.ts` — bone definitions (lengths, hierarchy)
- `Joint.tsx` — recursive SVG joint renderer
- `poses.ts` — pose presets (minimum 8 poses for MVP)
- `motions.ts` — loop motion presets (minimum 4 motions for MVP)
- `expressions.ts` — face/expression definitions (minimum 5 expressions)
- `Face.tsx` — SVG face renderer
- `interpolation.ts` — pose interpolation + motion override logic

**Output contract:** Exports a `<StickMan>` component that accepts pose, expression, animation props and renders correctly within Remotion's frame system.

#### Integration: `feat/integration`
**Scope:** Wiring + end-to-end test
- Connect Python output → Remotion input
- End-to-end pipeline test with sample script
- Fix cross-module issues
- Final MP4 validation

---

## 5. Scene JSON Schema

This is the **contract between Python pipeline and Remotion renderer**. Both Agent 1 and Agent 2 must implement against this schema.

### 5.1 Top-Level Structure

```typescript
interface VideoProject {
  meta: {
    title: string;
    fps: number;              // default: 30
    width: number;            // default: 1920
    height: number;           // default: 1080
    audioSrc: string;         // relative path: "audio/tts_output.wav"
  };

  subtitles: {
    src: string;              // "subtitles/words.json"
    style: {
      fontSize: number;       // default: 48
      color: string;          // default: "#FFFFFF"
      position: "top" | "center" | "bottom";  // default: "bottom"
      highlightColor: string; // default: "#FFD700"
    };
  };

  scenes: Scene[];
}
```

### 5.2 Scene

```typescript
interface Scene {
  id: string;                    // "scene_01"
  startMs: number;               // from WhisperX alignment
  endMs: number;
  background: string;            // hex color, default "#1a1a2e"
  transition?: {
    in?: TransitionType;
    out?: TransitionType;
    durationMs?: number;         // default: 300
  };
  objects: SceneObject[];
}

type TransitionType = "fadeIn" | "fadeOut" | "none";
```

### 5.3 Scene Object

```typescript
interface SceneObject {
  id: string;
  type: "stickman" | "text" | "icon" | "shape" | "counter";
  position: { x: number; y: number };
  scale?: number;                // default: 1.0
  layer?: number;                // default: 1 (higher = on top)
  props: StickmanProps | TextProps | IconProps | ShapeProps | CounterProps;
  animation?: {
    enter?: AnimationDef;
    during?: AnimationDef;
    exit?: AnimationDef;
  };
}
```

### 5.4 Object-Specific Props

```typescript
// StickMan
interface StickmanProps {
  pose: string;                  // preset name: "standing", "pointing_right", etc.
  expression?: string;           // "neutral", "happy", "thinking", etc.
  color?: string;                // default: "#FFFFFF"
  lineWidth?: number;            // default: 3
}

// Text
interface TextProps {
  content: string;
  fontSize?: number;             // default: 48
  fontWeight?: "normal" | "bold";
  color?: string;                // default: "#FFFFFF"
  maxWidth?: number;             // default: 800
  align?: "left" | "center" | "right";
}

// Icon
interface IconProps {
  name: string;                  // icon identifier: "money-bag", "chart-up", etc.
  size?: number;                 // default: 80
  color?: string;                // default: "#FFFFFF"
}

// Shape
interface ShapeProps {
  shape: "arrow" | "line" | "circle" | "rectangle";
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  width?: number;
  height?: number;
  color?: string;                // default: "#FFFFFF"
  strokeWidth?: number;          // default: 3
  fill?: boolean;                // default: false
}

// Counter
interface CounterProps {
  from: number;
  to: number;
  format?: "number" | "currency_krw" | "currency_usd" | "percent";
  fontSize?: number;             // default: 64
  color?: string;                // default: "#FFFFFF"
}
```

### 5.5 Animation Definition

```typescript
interface AnimationDef {
  type: string;                  // preset name
  durationMs?: number;           // default varies by type
  delayMs?: number;              // default: 0
  loop?: boolean;                // default: false

  // StickMan-specific: pose sequence
  keyframes?: PoseKeyframe[];

  // Motion-specific
  from?: "left" | "right" | "top" | "bottom";
}

interface PoseKeyframe {
  atMs: number;                  // relative to scene start
  pose: string;                  // pose preset name
}
```

### 5.6 Animation Presets (MVP)

**Enter animations:**
| Name | Description |
|------|-------------|
| `fadeIn` | Opacity 0→1 |
| `fadeInUp` | Opacity 0→1 + translateY 30→0 |
| `slideLeft` | translateX from left edge |
| `slideRight` | translateX from right edge |
| `popIn` | Scale 0→1 with spring bounce |
| `typewriter` | Text characters appear one by one |
| `drawLine` | Shape/arrow draws progressively |
| `none` | Instant appear |

**During animations:**
| Name | Description |
|------|-------------|
| `floating` | Gentle Y oscillation (±5px) |
| `pulse` | Gentle scale oscillation (0.98–1.02) |
| `breathing` | StickMan subtle torso movement |
| `nodding` | StickMan head nod loop |
| `waving` | StickMan arm wave loop |
| `poseSequence` | StickMan keyframed pose changes |
| `none` | Static |

**Exit animations:**
| Name | Description |
|------|-------------|
| `fadeOut` | Opacity 1→0 |
| `none` | Scene transition handles exit |

---

## 6. StickMan Component Specification

### 6.1 Skeleton Definition

```
hip (root) ──── position anchor point
├── torso (length: 80)
│   ├── head (radius: 20)
│   ├── upperArmL (length: 50)
│   │   └── lowerArmL (length: 45)
│   └── upperArmR (length: 50)
│       └── lowerArmR (length: 45)
├── upperLegL (length: 55)
│   └── lowerLegL (length: 50)
└── upperLegR (length: 55)
    └── lowerLegR (length: 50)
```

- 10 parts, 9 joints
- Each joint: single rotation angle in degrees
- Forward Kinematics only (no IK)
- SVG `<g transform="rotate(...)">` for hierarchical rotation

### 6.2 Pose Type

```typescript
interface Pose {
  torso: number;
  head: number;
  upperArmL: number;
  lowerArmL: number;
  upperArmR: number;
  lowerArmR: number;
  upperLegL: number;
  lowerLegL: number;
  upperLegR: number;
  lowerLegR: number;
}
```

### 6.3 Required Pose Presets (MVP minimum 8)

| Pose Name | Description | Key Angles |
|-----------|-------------|------------|
| `standing` | Neutral idle pose | Arms slightly out, legs straight |
| `pointing_right` | Right arm extended horizontally | upperArmR: -90, body slight lean |
| `pointing_left` | Left arm extended horizontally | upperArmL: 90, body slight lean |
| `thinking` | Hand on chin | upperArmR raised, lowerArmR bent to chin |
| `celebrating` | Both arms raised | Both arms up ~160°, legs slightly apart |
| `explaining` | One hand raised, presenting | upperArmL: 45, lowerArmL: -90 |
| `shrugging` | Both arms out, palms up | Arms bent outward |
| `sitting` | Seated pose | Legs bent at 90° |

### 6.4 Required Motion Presets (MVP minimum 4)

| Motion Name | Loop | Description |
|-------------|------|-------------|
| `breathing` | yes | Subtle torso oscillation (±1°), cycle: 2000ms |
| `nodding` | yes | Head angle oscillation (0→15→0°), cycle: 600ms |
| `waving` | yes | lowerArmR oscillation (±30°), cycle: 500ms |
| `walkCycle` | yes | Alternating leg/arm swing, cycle: 800ms |

Motion presets use `poseOverride` — they modify specific joints on top of the base pose.

### 6.5 Required Expressions (MVP minimum 5)

| Expression | Eyes | Mouth |
|-----------|------|-------|
| `neutral` | · · | — (line) |
| `happy` | · · | ⌣ (smile arc) |
| `sad` | · · | ⌢ (frown arc) |
| `surprised` | ○ ○ | ○ (circle) |
| `thinking` | · · | ~ (wavy) |

All expressions are simple SVG primitives rendered inside the head circle.

### 6.6 Component Interface

```tsx
interface StickManProps {
  pose: Pose;                    // resolved pose (after interpolation)
  expression: string;
  position: { x: number; y: number };
  scale?: number;
  color?: string;
  lineWidth?: number;
}
```

---

## 7. Python Pipeline Specification

### 7.1 Script Format

```markdown
---
title: Video Title Here
voice: ko-KR-HyunsuNeural
style: dark_infographic
---

## scene: scene_name
[stickman: pose_name, expression_name]
[text: "Display text here", highlight]
[icon: icon-name]
[counter: 1000 -> 1000000, currency_krw]
[shape: arrow, #FF5722]

Narration text goes here as plain paragraphs.
Multiple lines become continuous narration.
```

### 7.2 Script Parser Output

```python
@dataclass
class ParsedScript:
    meta: dict                    # title, voice, style
    sections: list[ScriptSection]
    full_narration: str           # all narration concatenated

@dataclass
class ScriptSection:
    name: str                     # scene name
    directives: list[Directive]   # parsed [] directives
    narration: str                # plain text narration
```

### 7.3 TTS Configuration

```python
VOICE = "ko-KR-HyunsuNeural"    # Edge TTS Korean male (Hyunsu)
OUTPUT_FORMAT = "wav"             # WAV for best compatibility
RATE = "+0%"                      # Normal speed (adjustable)
```

- Generate **one continuous audio file** for the entire script
- Do NOT split audio by scene (timing alignment handles scene boundaries)

### 7.4 Groq Whisper API Integration

```python
from groq import Groq

client = Groq(api_key=os.environ["GROQ_API_KEY"])

def align_audio(audio_path: str) -> dict:
    with open(audio_path, "rb") as f:
        transcription = client.audio.transcriptions.create(
            file=(audio_path, f.read()),
            model="whisper-large-v3-turbo",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
            language="ko"
        )
    return transcription
```

**Output structure from Groq:**
```json
{
  "segments": [
    {
      "text": "안녕하세요 오늘은...",
      "start": 0.0,
      "end": 3.2
    }
  ],
  "words": [
    {"word": "안녕하세요", "start": 0.0, "end": 0.8},
    {"word": "오늘은", "start": 0.9, "end": 1.2}
  ]
}
```

**Important:** Groq free tier has a file size limit (25MB). For 8-minute audio in WAV, the file may exceed this. If so, convert to MP3 first (using `pydub` or `ffmpeg`) before sending to Groq.

### 7.5 Scene Builder Logic

```
1. Parse script → get section boundaries (by ## scene markers)
2. Map each section's narration text to WhisperX word timestamps
3. Determine scene startMs/endMs from first/last word of each section
4. Convert directives → SceneObject JSON (with auto-layout)
5. Apply default animations based on object type
6. Output scene.json
```

**Auto-layout rules (MVP):**

| Object Combo | Layout |
|-------------|--------|
| stickman only | stickman center (960, 600) |
| stickman + text | stickman left (350, 600), text right (1100, 350) |
| stickman + text + counter | stickman left (300, 600), text center-top (960, 250), counter center-mid (960, 450) |
| stickman + text + icon | stickman left (300, 600), icon center (960, 300), text center-bottom (960, 500) |
| text only | text center (960, 400) |

### 7.6 Subtitle Generator

Generate two formats:
1. **SRT file** — segment-level timing for YouTube upload
2. **Word-level JSON** — for Remotion burn-in with highlight effect

Word-level JSON format:
```json
{
  "words": [
    {"word": "안녕하세요", "startMs": 0, "endMs": 800},
    {"word": "오늘은", "startMs": 900, "endMs": 1200}
  ]
}
```

---

## 8. Remotion Project Specification

### 8.1 Composition Setup

```tsx
// Root composition
<Composition
  id="MainVideo"
  component={MainVideo}
  fps={meta.fps}
  width={meta.width}
  height={meta.height}
  durationInFrames={totalFrames}
  defaultProps={{ sceneData }}
/>
```

### 8.2 Rendering Command

```bash
npx remotion render src/index.ts MainVideo \
  --props="./public/scene.json" \
  --output="./out/final.mp4" \
  --codec=h264 \
  --concurrency=4
```

### 8.3 Component Rendering Order (per scene)

```
1. Background (full-screen color fill)
2. Shape objects (layer 1) — arrows, lines, etc.
3. StickMan (layer 2)
4. Text / Counter / Icon (layer 3)
5. Subtitle overlay (layer 99 — always on top)
```

### 8.4 Audio Handling

- Single `<Audio>` component at the MainVideo level
- Audio spans the entire video duration
- Scenes do NOT have individual audio — they are visual-only
- Audio is the timing reference; scenes are drawn to match

---

## 9. File & Directory Structure

```
stickman-video/
├── README.md
├── DEV_SPEC.md                         # This file
│
├── scripts/                            # Input scripts
│   └── sample_compound_interest.md     # Sample test script
│
├── python/                             # Python pipeline
│   ├── requirements.txt
│   ├── pipeline.py                     # Main CLI entry point
│   ├── script_parser.py                # Markdown script parser
│   ├── tts_generator.py                # Edge TTS wrapper
│   ├── alignment.py                    # Groq Whisper API wrapper
│   ├── scene_builder.py                # Script + timestamps → scene.json
│   ├── subtitle_generator.py           # SRT + word JSON generator
│   └── utils/
│       └── audio_utils.py              # WAV→MP3 conversion if needed
│
├── remotion/                           # Remotion video project
│   ├── package.json
│   ├── tsconfig.json
│   ├── remotion.config.ts
│   ├── src/
│   │   ├── index.ts                    # Remotion entry + Composition registration
│   │   ├── MainVideo.tsx               # Top-level: audio + scenes + subtitles
│   │   ├── SceneRenderer.tsx           # Single scene: bg + transitions + objects
│   │   ├── ObjectRenderer.tsx          # Type-based object routing
│   │   │
│   │   ├── components/
│   │   │   ├── StickMan/
│   │   │   │   ├── StickMan.tsx        # Main StickMan component
│   │   │   │   ├── Joint.tsx           # Recursive SVG joint renderer
│   │   │   │   ├── Face.tsx            # Expression renderer
│   │   │   │   ├── skeleton.ts         # Bone lengths & hierarchy
│   │   │   │   ├── poses.ts            # Pose presets
│   │   │   │   ├── motions.ts          # Motion loop presets
│   │   │   │   ├── expressions.ts      # Face definitions
│   │   │   │   └── interpolation.ts    # Pose blending & override logic
│   │   │   │
│   │   │   ├── AnimatedText.tsx        # Text with animation support
│   │   │   ├── Counter.tsx             # Animated number counter
│   │   │   ├── Shape.tsx               # Arrow, line, circle, rectangle
│   │   │   ├── IconElement.tsx         # SVG icon with animation
│   │   │   └── SubtitleOverlay.tsx     # Word-level burn-in subtitles
│   │   │
│   │   ├── animations/
│   │   │   ├── enter.ts                # Enter animation implementations
│   │   │   ├── during.ts              # During animation implementations
│   │   │   └── exit.ts                # Exit animation implementations
│   │   │
│   │   ├── utils/
│   │   │   ├── timing.ts              # msToFrames, framesToMs
│   │   │   └── layout.ts             # Auto-layout helpers
│   │   │
│   │   └── types/
│   │       └── schema.ts              # TypeScript types matching Section 5
│   │
│   └── public/
│       ├── scene.json                  # Generated by Python pipeline
│       ├── audio/                      # TTS audio output
│       ├── subtitles/                  # Word-level JSON
│       └── icons/                      # SVG icon library
│           ├── money-bag.svg
│           ├── chart-up.svg
│           ├── piggy-bank.svg
│           ├── lightbulb.svg
│           └── warning.svg
│
├── build/                              # Final output directory
│   ├── output/
│   │   └── final.mp4
│   └── subtitles/
│       └── captions.srt
│
└── templates/                          # Style presets (future use)
    └── dark_infographic.json
```

---

## 10. Development Phases

### Phase 1: Scaffold & Parallel Setup (Day 1)

**On `main`:**
1. Initialize repository
2. Create directory structure
3. Create this DEV_SPEC.md
4. Create sample test script
5. Create shared TypeScript types (`types/schema.ts`)
6. Push to main
7. Create 3 worktree branches

```bash
git worktree add ../stickman-python feat/python-pipeline
git worktree add ../stickman-remotion feat/remotion-core
git worktree add ../stickman-stickman feat/stickman-component
```

### Phase 2: Parallel Development (Day 2–5)

**Agent 1** (`feat/python-pipeline`): Build Python pipeline end-to-end
- Day 2: script_parser.py + tts_generator.py
- Day 3: alignment.py (Groq API integration)
- Day 4: scene_builder.py + subtitle_generator.py
- Day 5: pipeline.py orchestrator + test with sample script

**Agent 2** (`feat/remotion-core`): Build Remotion rendering framework
- Day 2: Project init + MainVideo.tsx + SceneRenderer.tsx
- Day 3: AnimatedText.tsx + Counter.tsx + Shape.tsx + IconElement.tsx
- Day 4: Animation presets (enter/during/exit)
- Day 5: SubtitleOverlay.tsx + test with mock scene.json

**Agent 3** (`feat/stickman-component`): Build StickMan component
- Day 2: skeleton.ts + Joint.tsx + basic SVG rendering
- Day 3: poses.ts (8 presets) + interpolation.ts
- Day 4: motions.ts (4 loop presets) + poseOverride logic
- Day 5: Face.tsx + expressions.ts + test within Remotion preview

### Phase 3: Integration (Day 6–7)

On `feat/integration`:
1. Merge all 3 feature branches
2. Wire Python output → Remotion input
3. End-to-end test: `python pipeline.py scripts/sample.md`
4. Fix cross-module issues
5. Verify final MP4 output

---

## 11. MVP Scope & Non-Goals

### In Scope (MVP)
- [x] Markdown script → TTS (Edge TTS, Hyunsu voice)
- [x] Groq Whisper API → word-level timestamps
- [x] Auto scene.json generation with auto-layout
- [x] StickMan with 8 poses, 4 motions, 5 expressions
- [x] 5 object types: stickman, text, icon, shape, counter
- [x] 8 enter animations, 4 during animations, 1 exit animation
- [x] Word-level subtitle burn-in
- [x] SRT file export
- [x] Single CLI command pipeline
- [x] Dark infographic visual style

### Not in Scope (MVP)
- ❌ Visual editor / GUI
- ❌ Multiple stickman characters in one scene
- ❌ Inverse Kinematics
- ❌ Custom path animations
- ❌ Camera zoom/pan
- ❌ Background images or video clips
- ❌ Held items / props system
- ❌ Multiple visual themes
- ❌ SaaS / web deployment
- ❌ Real-time preview server (use Remotion Studio built-in)

---

## 12. Testing Strategy

### Unit Tests
- **Python**: Verify script parser produces correct ParsedScript
- **Python**: Verify scene_builder output matches schema
- **Remotion**: Verify StickMan renders without errors for all pose presets

### Integration Test
- Run full pipeline with `scripts/sample_compound_interest.md`
- Validate:
  - `scene.json` conforms to schema
  - Audio file exists and is non-empty
  - `captions.srt` has valid SRT format
  - Remotion renders without errors
  - Output MP4 exists and has correct duration (within ±2 seconds of audio)

### Manual Validation
- Watch the output video end-to-end
- Verify subtitle sync with audio
- Verify stickman poses match scene directives
- Verify text/counter/icon appear at correct times

---

## 13. Environment Setup

### Python Environment
```bash
cd python/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Required env vars:
```bash
export GROQ_API_KEY="your-groq-api-key"
```

### Remotion Environment
```bash
cd remotion/
npm install
```

### Full Pipeline Run
```bash
# From project root
python python/pipeline.py scripts/sample_compound_interest.md
```

---

## 14. Sample Test Script

The following script should be included as `scripts/sample_compound_interest.md` and used for all integration testing:

```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
style: dark_infographic
---

## scene: intro
[stickman: standing, happy]

안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다.

## scene: concept
[stickman: explaining]
[text: "단리 vs 복리", highlight]

단리는 원금에만 이자가 붙습니다.
하지만 복리는 원금에 이자를 더한 금액에 다시 이자가 붙습니다.
이 차이가 시간이 지날수록 엄청나게 벌어집니다.

## scene: formula
[stickman: pointing_right]
[text: "복리 = 원금 × (1+r)ⁿ", highlight]
[counter: 1000000 -> 7612255, currency_krw]

백만원을 연 7%로 30년 동안 투자하면
약 761만원이 됩니다.
원금의 7.6배입니다!

## scene: conclusion
[stickman: celebrating]
[icon: chart-up]

시간은 복리의 가장 강력한 무기입니다.
일찍 시작할수록 복리의 마법은 더 강력해집니다.
오늘부터 시작하세요!
```

---

## 15. Key Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| Single audio file (not per-scene) | Natural prosody, seamless timing, simpler pipeline |
| Edge TTS over Google/OpenAI TTS | Free, good Korean quality, no API key needed for MVP |
| Groq Whisper over local WhisperX | No GPU dependency, faster setup, free tier sufficient for MVP |
| FK only (no IK) | Drastically reduces complexity; stickman needs "meaning" not "accuracy" |
| Pose presets over manual angles | Faster scene authoring; new poses added to one file |
| JSON intermediate format | Human-readable, editable, debuggable; decouples Python from Node.js |
| poseOverride for motions | Composable: base pose + motion overlay without duplicating full poses |
| Auto-layout with pattern matching | 80% of infographic scenes fit ~5 layout patterns; manual override via JSON |
| SRT + burn-in dual subtitle output | SRT for YouTube native captions; burn-in for guaranteed visual consistency |
