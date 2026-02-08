# Stickman → AI Image Pipeline — Refactoring Plan

> **Date**: 2026-02-08  
> **Status**: Planning  
> **Previous**: MVP Complete (StickMan-based, 6,150 LOC)  
> **Target**: Script-to-Video pipeline with AI-generated scene images

---

## 1. Why We're Pivoting

### The Problem

The original architecture assumed users would want **scene-level editing** — choosing stickman poses, placing text objects, tweaking layouts. After building the full MVP, we realized:

1. **Educational videos don't need per-scene editing.** If the overall tone and mood are consistent, a well-written script is sufficient. Nobody wants to manually pick `pointing_right` vs `explaining` for 30 scenes.
2. **StickMan visual quality has a hard ceiling.** SVG stick figures can't compete with AI-generated illustrations for viewer engagement.
3. **Development cost is misallocated.** We spent ~2,600 lines on the StickMan system and dev tools — effort that could go toward the actual value proposition: **script in → polished video out**.

### The New Approach

```
Script.md → TTS → Whisper Timing → LLM Prompt Generation → AI Image per Scene → Remotion Assembly → final.mp4
```

Replace hand-coded StickMan scenes with **Replicate API** (Flux/SDXL) generated images per scene, with consistent tone/mood enforced via prompt templates. Keep the entire audio pipeline and Remotion rendering framework.

---

## 2. Architecture: Before vs After

### Before (v1 — StickMan)

```
Script.md → Parser → TTS → Whisper → Scene Builder → scene.json
                                         ↓
                                    [StickMan poses]
                                    [Text objects]
                                    [Icons, Shapes]
                                         ↓
                                    Remotion Render → final.mp4
```

### After (v2 — AI Image)

```
Script.md → Parser → TTS → Whisper → Prompt Generator → scene.json
                                         ↓
                                    [Replicate API]
                                    → scene_01.png
                                    → scene_02.png
                                    → ...
                                         ↓
                                    Remotion Render → final.mp4
                                    (image backgrounds + text overlays + subtitles)
```

### Key Difference

The **scene.json contract** still exists, but scenes now reference background images instead of object arrays. Text overlays and subtitles remain as Remotion components rendered on top of images.

---

## 3. New Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      Python Pipeline                          │
│                                                              │
│  [Script.md] → [Script Parser] → [Edge TTS] → [audio.mp3]  │
│                       ↓                             ↓         │
│               [Scene Splitter]              [Groq Whisper]   │
│                       ↓                             ↓         │
│              [Prompt Generator]         [Word Timestamps]    │
│                       ↓                                      │
│              [Replicate API]                                 │
│              → images/scene_01.png                           │
│              → images/scene_02.png                           │
│              → ...                                           │
│                       ↓                                      │
│              [Scene Builder v2]                              │
│              → scene.json + captions.srt                     │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Remotion Project                            │
│                                                              │
│  [scene.json] → [MainVideo] → [SceneRenderer v2]            │
│                                      ↓                        │
│                    ┌─────────────────┼──────────────┐        │
│                    ↓                 ↓              ↓        │
│            [ImageBackground]  [TextOverlay]  [Subtitle]      │
│            [Logo/Watermark]   [Counter]                      │
│                                      ↓                        │
│                              [Remotion Render]               │
│                                      ↓                        │
│                                [final.mp4]                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. What We Keep, Modify, and Remove

### ✅ Keep As-Is

| File | Lines | Reason |
|------|-------|--------|
| `python/tts_generator.py` | ~80 | Edge TTS — no changes needed |
| `python/alignment.py` | ~120 | Groq Whisper — core timing engine |
| `python/subtitle_generator.py` | ~100 | SRT + words.json generation |
| `python/utils/audio_utils.py` | ~40 | Audio conversion utilities |
| `remotion/src/MainVideo.tsx` | ~70 | Audio + scene sequencing |
| `remotion/src/components/SubtitleOverlay.tsx` | ~120 | Word-level highlight subtitles |
| `remotion/src/components/AnimatedText.tsx` | ~150 | Text overlay with animations |
| `remotion/src/components/Counter.tsx` | ~100 | Animated number counter |
| `remotion/src/animations/` | ~300 | Enter/during/exit animation presets |
| `remotion/src/utils/timing.ts` | ~30 | ms↔frame conversion |
| **Subtotal** | **~1,110** | |

### 🔄 Modify

| File | Changes | Effort |
|------|---------|--------|
| `python/script_parser.py` | Remove `[stickman:]` directives, add `[image_hint:]` directive for optional scene description | Small |
| `python/scene_builder.py` | **Major rewrite** — generate image prompts, call Replicate API, output image paths in scene.json instead of object arrays | Large |
| `python/pipeline.py` | Add image generation step between alignment and scene building, add `--style` flag for prompt template selection | Medium |
| `remotion/src/SceneRenderer.tsx` | Support `background.type: "image"` with `<Img>` component for full-screen scene images | Medium |
| `remotion/src/ObjectRenderer.tsx` | Remove `stickman` routing, add `logo`/`watermark` type | Small |
| `remotion/src/types/schema.ts` | Update Scene interface for new background types, add image-related props | Small |
| `remotion/src/index.tsx` | Remove MotionTester/InteractiveTuner/MotionKeyframeTuner compositions | Small |
| **Subtotal** | | **~3–4 days** |

### ❌ Remove (Archive)

| File/Directory | Lines | Notes |
|----------------|-------|-------|
| `remotion/src/components/StickMan/` | ~1,088 | Full component system |
| `remotion/src/MotionTester.tsx` | ~200 | Dev tool |
| `remotion/src/InteractiveTuner.tsx` | ~400 | Dev tool |
| `remotion/src/MotionKeyframeTuner.tsx` | ~500 | Dev tool |
| `remotion/src/components/Shape.tsx` | ~150 | Replaced by image content |
| `remotion/src/components/IconElement.tsx` | ~100 | Replaced by image content |
| `.studio/` | ~300 | Motion specs |
| **Subtotal** | **~2,738** | Move to `_archive/stickman-v1/` |

### ➕ New Files

| File | Purpose | Effort |
|------|---------|--------|
| `python/prompt_generator.py` | LLM-powered scene description → image prompt conversion | Medium |
| `python/image_generator.py` | Replicate API wrapper (Flux/SDXL), batch generation, retry logic | Medium |
| `python/prompt_templates/` | Style presets (dark_infographic, whiteboard, pastel_edu, etc.) | Small |
| `remotion/src/components/ImageBackground.tsx` | Full-screen image with Ken Burns / zoom animations | Medium |
| `remotion/src/components/LogoWatermark.tsx` | Consistent logo/branding overlay | Small |
| `python/consistency_checker.py` | (Optional) Validate generated images for style consistency | Future |

---

## 5. New scene.json Schema (v2)

### 5.1 Scene (Updated)

```typescript
interface Scene {
  id: string;
  startMs: number;
  endMs: number;

  // v2: background supports both color and image
  background: {
    type: "color" | "image";
    value: string;             // hex color OR relative image path
    animation?: "none" | "kenBurns" | "zoomIn" | "zoomOut" | "panLeft" | "panRight";
    animationDuration?: number; // ms, defaults to scene duration
  };

  transition?: {
    in?: TransitionType;
    out?: TransitionType;
    durationMs?: number;
  };

  // v2: simplified overlays (no more stickman objects)
  overlays?: SceneOverlay[];
}

interface SceneOverlay {
  id: string;
  type: "text" | "counter" | "logo";
  position: { x: number; y: number };
  props: TextProps | CounterProps | LogoProps;
  animation?: AnimationDef;
}
```

### 5.2 Backward Compatibility

The v2 schema is a **superset** of v1. Old `background: "#1a1a2e"` strings will be auto-converted to `{ type: "color", value: "#1a1a2e" }` by the renderer.

---

## 6. New Script Format (v2)

```markdown
---
title: 복리의 마법
voice: ko-KR-HyunsuNeural
style: dark_infographic          # prompt template selection
image_model: flux-schnell        # replicate model
---

## scene: intro
[image_hint: A person looking at a growing money tree, warm lighting]
[text: "복리의 마법", title]

안녕하세요! 오늘은 복리의 놀라운 힘에 대해 알아보겠습니다.

## scene: concept
[image_hint: Split comparison - simple interest vs compound interest, infographic style]
[text: "단리 vs 복리", highlight]

단리는 원금에만 이자가 붙습니다.
하지만 복리는 원금에 이자를 더한 금액에 다시 이자가 붙습니다.

## scene: formula
[text: "복리 = 원금 × (1+r)ⁿ", highlight]
[counter: 1000000 -> 7612255, currency_krw]

백만원을 연 7%로 30년 동안 투자하면 약 761만원이 됩니다.

## scene: conclusion
[image_hint: Sunrise over a growing city skyline, hopeful and inspiring]

시간은 복리의 가장 강력한 무기입니다.
오늘부터 시작하세요!
```

**Key changes:**
- `[stickman:]` → removed entirely
- `[image_hint:]` → optional scene description for image generation (if omitted, LLM auto-generates from narration)
- `[icon:]` / `[shape:]` → removed (baked into generated images)
- `style:` in frontmatter → selects prompt template for consistent tone

---

## 7. Prompt Template System

### 7.1 Template Structure

```python
# python/prompt_templates/dark_infographic.py

TEMPLATE = {
    "name": "dark_infographic",
    "base_prompt": (
        "Digital illustration, dark navy background (#1a1a2e), "
        "clean infographic style, minimal flat design, "
        "soft gradient lighting, professional educational content, "
        "no text in image, 16:9 aspect ratio"
    ),
    "negative_prompt": (
        "text, words, letters, watermark, signature, "
        "photorealistic, 3d render, blurry, low quality"
    ),
    "color_palette": ["#1a1a2e", "#FFD700", "#FFFFFF", "#4ECDC4"],
    "model": "flux-schnell",
    "width": 1920,
    "height": 1080,
}
```

### 7.2 Prompt Composition

```
Final Prompt = base_prompt + ", " + scene_specific_description

Where scene_specific_description comes from:
  1. [image_hint:] directive (if provided), OR
  2. LLM-generated description from narration text (auto mode)
```

### 7.3 Available Templates (MVP)

| Template | Description | Use Case |
|----------|-------------|----------|
| `dark_infographic` | Dark navy bg, gold accents, minimal flat | Finance, tech explainers |
| `whiteboard` | White bg, hand-drawn sketch style | General education |
| `pastel_education` | Soft pastel colors, friendly illustrations | Kids/beginner content |

---

## 8. Key Technical Decisions

### 8.1 Image Consistency Strategy

**Problem**: AI image generation can produce inconsistent styles across scenes.

**Solution (layered approach):**
1. **Prompt template** — Strong base prompt enforces overall style
2. **Negative prompts** — Exclude unwanted elements consistently
3. **Same model + seed range** — Use deterministic seeds when possible
4. **Post-generation validation** — (Future) Use CLIP similarity scoring to flag outlier images
5. **Fallback** — If an image looks off, regenerate with modified prompt

### 8.2 Cost Estimation

| Model | Cost/Image | Images/Video (10 scenes) | Cost/Video |
|-------|-----------|-------------------------|------------|
| Flux Schnell | ~$0.003 | 10 | ~$0.03 |
| Flux Dev | ~$0.03 | 10 | ~$0.30 |
| SDXL | ~$0.01 | 10 | ~$0.10 |

At **100 videos/month** with Flux Schnell: **~$3/month** — negligible.

### 8.3 Image Animation in Remotion

Static images per scene would feel lifeless. Apply subtle motion:

| Animation | Description | Implementation |
|-----------|-------------|----------------|
| Ken Burns | Slow zoom + pan | `scale` + `translateX/Y` interpolation |
| Zoom In | Gradual zoom to center | `scale: 1.0 → 1.1` over scene |
| Zoom Out | Reverse zoom | `scale: 1.1 → 1.0` over scene |
| Pan Left/Right | Horizontal drift | `translateX` interpolation |

This keeps the video dynamic without requiring actual animation.

---

## 9. Parallel Development Plan

### 9.1 Branch Structure

```
main (current MVP)
│
├── refactor/archive-stickman        ← Prep: move StickMan to archive
│
├── refactor/python-image-pipeline   ← Agent 1: image generation pipeline
├── refactor/remotion-image-renderer ← Agent 2: Remotion image background support
│
└── refactor/integration-v2          ← Final: wire + test
```

### 9.2 Pre-Work (on `main`, before branching)

**Must be done first — shared by both agents:**

1. Archive StickMan code to `_archive/stickman-v1/`
2. Update `types/schema.ts` with v2 Scene interface
3. Update script format documentation
4. Create sample v2 test script

```bash
# Archive stickman
mkdir -p _archive/stickman-v1
mv remotion/src/components/StickMan _archive/stickman-v1/
mv remotion/src/MotionTester.tsx _archive/stickman-v1/
mv remotion/src/InteractiveTuner.tsx _archive/stickman-v1/
mv remotion/src/MotionKeyframeTuner.tsx _archive/stickman-v1/
mv .studio _archive/stickman-v1/

# Create worktrees
git worktree add ../pipeline-v2 refactor/python-image-pipeline
git worktree add ../remotion-v2 refactor/remotion-image-renderer
```

---

### 9.3 Agent 1: `refactor/python-image-pipeline`

**Scope:** Everything in `python/` — image generation pipeline

**Files to modify:**
- `script_parser.py` — Support `[image_hint:]` directive, remove `[stickman:]`
- `scene_builder.py` — Major rewrite for v2 schema
- `pipeline.py` — Add image generation step, `--style` flag

**Files to create:**
- `prompt_generator.py` — Narration → image prompt (with optional LLM enhancement)
- `image_generator.py` — Replicate API wrapper
- `prompt_templates/dark_infographic.py`
- `prompt_templates/whiteboard.py`
- `prompt_templates/base.py` — Template base class

**Dependencies to add:**
```
replicate>=0.25.0
```

**Output contract:** Given a v2 markdown script, generates:
- `scene.json` (v2 schema with image backgrounds)
- `images/scene_XX.png` for each scene
- `audio/tts_output.mp3`
- `subtitles/captions.srt` + `subtitles/words.json`

**Day-by-day plan:**

| Day | Task |
|-----|------|
| Day 1 | `prompt_templates/` system + `prompt_generator.py` (narration → prompt) |
| Day 2 | `image_generator.py` (Replicate API wrapper with retry, batch support) |
| Day 3 | Rewrite `script_parser.py` + `scene_builder.py` for v2 |
| Day 4 | Update `pipeline.py` orchestrator, add `--style` flag |
| Day 5 | End-to-end test: script → images + scene.json |

---

### 9.4 Agent 2: `refactor/remotion-image-renderer`

**Scope:** Remotion rendering — image background support

**Files to modify:**
- `SceneRenderer.tsx` — Support `background.type: "image"` with `<Img>` + animations
- `ObjectRenderer.tsx` — Remove `stickman` case, add `logo` type
- `index.tsx` — Remove dev tool compositions (MotionTester, etc.)
- `types/schema.ts` — v2 type definitions (shared, but Agent 2 owns Remotion types)

**Files to create:**
- `components/ImageBackground.tsx` — Full-screen image with Ken Burns / zoom
- `components/LogoWatermark.tsx` — Branding overlay (position, opacity, size configurable)

**Files to remove from rendering pipeline:**
- `components/Shape.tsx` — No longer routed
- `components/IconElement.tsx` — No longer routed
- `components/StickMan/StickManPlaceholder.tsx` — Was already placeholder

**Output contract:** Given a valid v2 `scene.json` + image files + audio, renders complete MP4 with:
- Image backgrounds with subtle animation (Ken Burns etc.)
- Text overlays with enter/during/exit animations
- Counter animations
- Logo/watermark overlay
- Word-level subtitle burn-in
- Scene transitions (fade in/out)

**Day-by-day plan:**

| Day | Task |
|-----|------|
| Day 1 | `ImageBackground.tsx` component with Ken Burns / zoom animations |
| Day 2 | Update `SceneRenderer.tsx` to route image backgrounds, backward-compat for color |
| Day 3 | `LogoWatermark.tsx` + update `ObjectRenderer.tsx` |
| Day 4 | Remove dead code, update `index.tsx`, clean up types |
| Day 5 | Test with mock scene.json + placeholder images |

---

### 9.5 Integration: `refactor/integration-v2`

| Day | Task |
|-----|------|
| Day 6 | Merge both branches, resolve conflicts |
| Day 7 | End-to-end test: `python pipeline.py scripts/sample_v2.md --style dark_infographic` |
| Day 7 | Validate: audio sync, image display, subtitle timing, transitions |
| Day 7 | Fix cross-module issues, final MP4 validation |

---

## 10. Shared Contract: v2 Scene.json

Both agents must implement against this schema. This is the **integration boundary**.

```typescript
// types/schema.ts (v2)

interface VideoProject {
  meta: {
    title: string;
    fps: number;
    width: number;
    height: number;
    audioSrc: string;
    style?: string;               // NEW: prompt template name
  };

  subtitles: {
    src: string;
    style: SubtitleStyle;
  };

  branding?: {                    // NEW: global branding
    logo?: {
      src: string;                // "branding/logo.png"
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
      size: number;               // px
      opacity: number;            // 0-1
      margin: number;             // px from edge
    };
  };

  scenes: Scene[];
}

interface Scene {
  id: string;
  startMs: number;
  endMs: number;

  background: SceneBackground;

  transition?: {
    in?: TransitionType;
    out?: TransitionType;
    durationMs?: number;
  };

  overlays?: SceneOverlay[];
}

// NEW: replaces simple string background
type SceneBackground =
  | { type: "color"; value: string }
  | {
      type: "image";
      src: string;                // "images/scene_01.png"
      animation?: "none" | "kenBurns" | "zoomIn" | "zoomOut" | "panLeft" | "panRight";
      animationIntensity?: number; // 0.0-1.0, default 0.5
    };

// NEW: simplified overlay (replaces SceneObject for non-image elements)
interface SceneOverlay {
  id: string;
  type: "text" | "counter" | "logo";
  position: { x: number; y: number };
  props: TextProps | CounterProps | LogoProps;
  animation?: {
    enter?: AnimationDef;
    during?: AnimationDef;
    exit?: AnimationDef;
  };
}

// NEW
interface LogoProps {
  src: string;
  size: number;
  opacity?: number;
}
```

---

## 11. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Image style inconsistency across scenes | High | Medium | Strong prompt templates + negative prompts; manual review for MVP |
| Replicate API latency (10 images × 5-15s) | Medium | High | Parallel generation (async), progress bar in CLI |
| Replicate API downtime | High | Low | Retry logic with exponential backoff; cache generated images |
| Generated images contain unwanted text | Medium | Medium | Include "no text" in negative prompt; post-processing OCR check (future) |
| Ken Burns animation looks jerky | Low | Low | Use Remotion `spring()` for smooth easing |
| Cost escalation at scale | Medium | Low | Flux Schnell is extremely cheap (~$0.003/image) |

---

## 12. Success Criteria

### MVP v2 Done When:

- [ ] `python pipeline.py scripts/sample_v2.md --style dark_infographic` runs end-to-end
- [ ] All scenes have AI-generated background images with consistent style
- [ ] Images display in Remotion with Ken Burns animation
- [ ] Audio, subtitles, and text overlays are correctly synced
- [ ] Logo/watermark appears consistently across all scenes
- [ ] Output MP4 is 1080p, H.264, with correct duration
- [ ] Scene transitions (fade in/out) work smoothly
- [ ] Total pipeline time < 3 minutes for a 5-scene video

### Quality Bar:

- A non-technical viewer should find the video "professional-looking"
- All scenes in a single video should feel like they belong together visually
- Text overlays should be readable against image backgrounds

---

## 13. Future Enhancements (Post-MVP v2)

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| LLM auto-prompting | Use Claude/GPT to generate image_hints from narration automatically | High |
| CLIP consistency scoring | Score each generated image against the template style | Medium |
| Character consistency | Use IP-Adapter or character LoRA for recurring characters | Medium |
| B-roll video clips | Mix AI images with short stock video clips | Low |
| Interactive preview | Web UI to preview scenes before rendering | Low |
| StickMan hybrid mode | Overlay StickMan on AI backgrounds for explainer sections | Low |
| Multi-language support | Extend TTS and prompt templates for English, Japanese | Medium |

---

## 14. File Structure (Post-Refactor)

```
stickman-video/
├── README.md
├── REFACTOR_PLAN.md                    # This file
├── DEV_SPEC.md                         # Original spec (historical)
│
├── _archive/                           # Preserved StickMan code
│   └── stickman-v1/
│       ├── StickMan/                   # Full component system
│       ├── MotionTester.tsx
│       ├── InteractiveTuner.tsx
│       ├── MotionKeyframeTuner.tsx
│       └── .studio/
│
├── scripts/
│   ├── sample_compound_interest.md     # v1 format (legacy)
│   └── sample_compound_interest_v2.md  # v2 format
│
├── python/
│   ├── requirements.txt                # + replicate
│   ├── pipeline.py                     # Updated orchestrator
│   ├── script_parser.py                # Updated for v2 directives
│   ├── tts_generator.py                # Unchanged
│   ├── alignment.py                    # Unchanged
│   ├── prompt_generator.py             # NEW: narration → image prompt
│   ├── image_generator.py              # NEW: Replicate API wrapper
│   ├── scene_builder.py                # Rewritten for v2 schema
│   ├── subtitle_generator.py           # Unchanged
│   ├── prompt_templates/               # NEW
│   │   ├── base.py
│   │   ├── dark_infographic.py
│   │   └── whiteboard.py
│   └── utils/
│       └── audio_utils.py
│
├── remotion/
│   ├── package.json
│   ├── tsconfig.json
│   ├── remotion.config.ts
│   ├── src/
│   │   ├── index.tsx                   # Cleaned up
│   │   ├── MainVideo.tsx               # Unchanged
│   │   ├── SceneRenderer.tsx           # Updated for image backgrounds
│   │   ├── ObjectRenderer.tsx          # Simplified (no stickman)
│   │   │
│   │   ├── components/
│   │   │   ├── ImageBackground.tsx     # NEW: full-screen image + Ken Burns
│   │   │   ├── LogoWatermark.tsx       # NEW: branding overlay
│   │   │   ├── AnimatedText.tsx        # Unchanged
│   │   │   ├── Counter.tsx             # Unchanged
│   │   │   └── SubtitleOverlay.tsx     # Unchanged
│   │   │
│   │   ├── animations/                 # Unchanged
│   │   │   ├── enter.ts
│   │   │   ├── during.ts
│   │   │   └── exit.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── timing.ts              # Unchanged
│   │   │   └── layout.ts              # Simplified
│   │   │
│   │   └── types/
│   │       └── schema.ts              # Updated to v2
│   │
│   └── public/
│       ├── scene.json
│       ├── audio/
│       ├── subtitles/
│       ├── images/                     # NEW: generated scene images
│       └── branding/                   # NEW: logo files
│
└── build/
    └── output/
        └── final.mp4
```

---

## 15. Quick Reference: Agent Task Cards

### Agent 1 — Python Image Pipeline

```
Branch:   refactor/python-image-pipeline
Scope:    python/ directory
Duration: 5 days
Key deliverables:
  - prompt_generator.py
  - image_generator.py
  - prompt_templates/
  - Updated scene_builder.py (v2 schema)
  - Updated pipeline.py (--style flag, image step)
Test:     python pipeline.py scripts/sample_v2.md --style dark_infographic
Output:   scene.json + images/*.png + audio + subtitles
```

### Agent 2 — Remotion Image Renderer

```
Branch:   refactor/remotion-image-renderer
Scope:    remotion/src/ directory
Duration: 5 days
Key deliverables:
  - ImageBackground.tsx (Ken Burns animations)
  - LogoWatermark.tsx
  - Updated SceneRenderer.tsx
  - Updated types/schema.ts (v2)
  - Cleaned index.tsx (no dev tools)
Test:     npx remotion preview with mock v2 scene.json
Output:   Renders image-based scenes with overlays
```

### Integration

```
Branch:   refactor/integration-v2
Duration: 2 days
Task:     Merge + E2E test + fix + validate final.mp4
```

---

## Appendix A: Preserved Principles

These carry forward from v1 unchanged:

1. **Audio is Truth** — All timing derives from the TTS audio track
2. **Automation Over Editing** — Script in → Video out
3. **MVP First** — Get it working, then improve
4. **Modular Architecture** — Each component independently replaceable
5. **scene.json as Contract** — Python generates, Remotion consumes

---

## Appendix B: Migration Checklist

- [ ] Archive StickMan code to `_archive/stickman-v1/`
- [ ] Update `types/schema.ts` to v2
- [ ] Create sample v2 script
- [ ] Create git worktrees for parallel development
- [ ] Agent 1: Implement prompt system + image generation
- [ ] Agent 2: Implement image background rendering
- [ ] Merge branches
- [ ] End-to-end pipeline test
- [ ] Verify final MP4 quality
- [ ] Update README.md
- [ ] Update claude.md with v2 status
- [ ] Tag release: `v2.0.0-image-pipeline`