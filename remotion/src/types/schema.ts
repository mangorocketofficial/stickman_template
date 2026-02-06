// Scene JSON Schema - Contract between Python pipeline and Remotion renderer
// =============================================================================
// Track B 준비: 모든 인터페이스 뼈대 추가 (2026-02-05)
// =============================================================================

// =============================================================================
// TOP-LEVEL STRUCTURE
// =============================================================================

export interface VideoProject {
  meta: VideoMeta;
  subtitles: SubtitleConfig;
  scenes: Scene[];
}

export interface VideoMeta {
  title: string;
  fps: number;                    // default: 30
  width: number;                  // default: 1920
  height: number;                 // default: 1080
  audioSrc: string;               // relative path: "audio/tts_output.wav"

  // === Track B-2: Color Theme ===
  theme?: string;                 // theme name: "dark_infographic", "dark_cool", etc.

  // === Track B-6: BGM ===
  bgm?: BGMConfig;

  // === Track B-8: TTS Config ===
  tts?: TTSConfig;
}

export interface SubtitleConfig {
  src: string;                    // "subtitles/words.json"
  style: SubtitleStyle;
}

export interface SubtitleStyle {
  fontSize: number;               // default: 48
  color: string;                  // default: "#FFFFFF"
  position: "top" | "center" | "bottom";  // default: "bottom"
  highlightColor: string;         // default: "#FFD700"
  // === Track B-4: Typography ===
  fontFamily?: string;            // default: system font
  backgroundColor?: string;       // default: "rgba(0,0,0,0.7)"
}

// =============================================================================
// SCENE
// =============================================================================

export interface Scene {
  id: string;                     // "scene_01"
  startMs: number;                // from Whisper alignment
  endMs: number;

  // === Track B-1: Background (backward compatible) ===
  background: string | BackgroundDef;  // string = hex color for backward compat

  transition?: SceneTransition;
  objects: SceneObject[];

  // === Track B-3: Visual Effects ===
  effects?: VisualEffect[];

  // === Track B-7: SFX ===
  sfx?: SFXTrigger[];
  autoSfx?: boolean;              // default: true - auto-map events to SFX
}

export interface SceneTransition {
  in?: TransitionType;
  out?: TransitionType;
  durationMs?: number;            // default: 300
}

// =============================================================================
// TRACK B-1: BACKGROUND SYSTEM
// =============================================================================

export type BackgroundType =
  | "solid"
  | "gradient_linear"
  | "gradient_radial"
  | "pattern"
  | "animated";

export interface BackgroundDef {
  type: BackgroundType;
  colors: string[];               // gradient colors or pattern base colors
  angle?: number;                 // linear gradient angle (default: 180 = top to bottom)
  pattern?: PatternType;
  animation?: BackgroundAnimation;
}

export type PatternType =
  | "dots"
  | "grid"
  | "noise";

export interface BackgroundAnimation {
  type: BackgroundAnimationType;
  speed?: number;                 // 1.0 = default speed
  density?: number;               // particle density for particle animations
}

export type BackgroundAnimationType =
  | "shift"                       // gradient color shift
  | "particles_float"             // floating particles
  | "particles_rise"              // rising particles
  | "wave"                        // wave effect
  | "starfield";                  // starfield

// =============================================================================
// TRACK B-2: COLOR THEME SYSTEM
// =============================================================================

export interface ColorTheme {
  name: string;
  background: {
    primary: string;              // main background color
    secondary: string;            // gradient secondary color
    surface: string;              // card/box background
  };
  text: {
    primary: string;              // main text color
    secondary: string;            // dimmed text
    accent: string;               // highlighted text
  };
  highlight: string;              // subtitle highlight color
  stickman: string;               // stickman color
  accent: string[];               // rotating accent colors for icons, shapes, etc.
}

// Predefined theme names
export type ThemeName =
  | "dark_infographic"            // current default
  | "dark_warm"
  | "dark_cool"
  | "dark_neon"
  | "light_clean"
  | "light_warm"
  | "pastel"
  | "corporate"
  | "retro"
  | "nature";

// =============================================================================
// TRACK B-3: VISUAL EFFECTS
// =============================================================================

export type VisualEffectType =
  | "glow"
  | "drop_shadow"
  | "text_outline"
  | "blur_background"
  | "vignette"
  | "spotlight"
  | "screen_shake"
  | "color_pop"
  | "motion_blur";

export interface VisualEffect {
  type: VisualEffectType;
  target?: string;                // object ID or "scene" for whole scene
  intensity?: number;             // 0~1, default: 0.5
  color?: string;                 // effect color (for glow, etc.)
  startMs?: number;               // effect start time (relative to scene)
  endMs?: number;                 // effect end time
  // Effect-specific options
  options?: {
    radius?: number;              // blur radius, glow radius
    offsetX?: number;             // shadow offset
    offsetY?: number;
    frequency?: number;           // shake frequency
    amplitude?: number;           // shake amplitude
  };
}

// =============================================================================
// TRACK B-4: TEXT TYPOGRAPHY
// =============================================================================

export type TextRole =
  | "title"                       // large, bold heading
  | "body"                        // normal body text
  | "number"                      // monospace, large numbers
  | "highlight_box"               // text with background box
  | "caption";                    // small caption text

export type TextDecoration =
  | "none"
  | "underline_animated"          // animated underline
  | "highlight_marker";           // highlighter pen effect

export interface TextStyleDef {
  role: TextRole;
  fontSize: number;
  fontWeight: "normal" | "bold" | "black";
  fontFamily?: string;
  color: string;                  // usually from theme
  background?: {
    color: string;
    padding: number;
    borderRadius: number;
    opacity: number;
  };
  decoration?: TextDecoration;
}

// Extended TextProps with style role
export interface TextProps {
  content: string;
  fontSize?: number;              // default: 48
  fontWeight?: "normal" | "bold";
  color?: string;                 // default: "#FFFFFF"
  maxWidth?: number;              // default: 800
  align?: "left" | "center" | "right";
  // === Track B-4 additions ===
  role?: TextRole;                // style preset
  decoration?: TextDecoration;
  background?: {                  // inline background box
    color?: string;
    padding?: number;
    borderRadius?: number;
    opacity?: number;
  };
}

// =============================================================================
// TRACK B-5: SCENE TRANSITIONS
// =============================================================================

export type TransitionType =
  // Existing
  | "fadeIn"
  | "fadeOut"
  | "none"
  // New transitions
  | "crossfade"                   // overlap fade between scenes
  | "wipe_left"                   // left to right wipe
  | "wipe_right"                  // right to left wipe
  | "wipe_up"                     // bottom to top wipe
  | "wipe_down"                   // top to bottom wipe
  | "slide_push"                  // push previous scene out
  | "dissolve"                    // pixel dissolve
  | "zoom_through"                // zoom into next scene
  | "morph"                       // object morphing (advanced)
  | "glitch";                     // glitch effect (advanced)

// =============================================================================
// TRACK B-6: BGM SYSTEM
// =============================================================================

export type BGMMood =
  | "upbeat_light"
  | "calm_ambient"
  | "inspiring"
  | "tense"
  | "playful"
  | "dramatic"
  | "corporate";

export interface BGMConfig {
  src?: string;                   // explicit file path, or...
  mood?: BGMMood;                 // auto-select from library
  volume: number;                 // 0~1, default: 0.3
  duckingLevel: number;           // volume during narration, default: 0.1
  fadeInMs: number;               // default: 2000
  fadeOutMs: number;              // default: 3000
  loop?: boolean;                 // default: true
}

// =============================================================================
// TRACK B-7: SFX SYSTEM
// =============================================================================

export type SFXEvent =
  | "scene_transition"
  | "object_enter"
  | "object_exit"
  | "counter_start"
  | "counter_end"
  | "emphasis"
  | "warning"
  | "success"
  | "error";

export type SFXName =
  | "whoosh"
  | "pop"
  | "chime"
  | "tada"
  | "impact"
  | "alert"
  | "notification"
  | "footstep"
  | "rumble"
  | "click"
  | "swoosh";

export interface SFXTrigger {
  event: SFXEvent;
  src?: string;                   // explicit file path, or...
  name?: SFXName;                 // predefined SFX name
  volume?: number;                // 0~1, default: 0.5
  delayMs?: number;               // delay after trigger, default: 0
  targetId?: string;              // specific object ID (for object_enter/exit)
}

// =============================================================================
// TRACK B-8: TTS CONFIGURATION
// =============================================================================

export interface TTSConfig {
  voice?: string;                 // default: "ko-KR-HyunsuNeural"
  rate?: number;                  // -50 to +50 percent, default: 0
  pitch?: number;                 // -50 to +50 percent, default: 0
  volume?: number;                // 0~1, default: 1.0

  // Prosody controls
  autoPause?: {
    sentenceMs?: number;          // pause after sentence, default: 300
    commaMs?: number;             // pause after comma, default: 150
  };

  // Advanced (future)
  ssml?: boolean;                 // enable SSML processing
  multiVoice?: boolean;           // enable multi-voice support
}

// =============================================================================
// TRACK B-9: AUDIO MIXING (handled in VideoMeta.bgm and Scene.sfx)
// =============================================================================

// Audio mixing is handled through BGMConfig.duckingLevel and SFXTrigger.volume
// Future: may add master audio config here

// =============================================================================
// SCENE OBJECTS (existing + extended)
// =============================================================================

export interface SceneObject {
  id: string;
  type: "stickman" | "text" | "icon" | "shape" | "counter";
  position: { x: number; y: number };
  scale?: number;                 // default: 1.0
  layer?: number;                 // default: 1 (higher = on top)
  props: StickmanProps | TextProps | IconProps | ShapeProps | CounterProps;
  animation?: {
    enter?: AnimationDef;
    during?: AnimationDef;
    exit?: AnimationDef;
  };
  // === Track B-3: Per-object effects ===
  effects?: VisualEffect[];
}

// =============================================================================
// OBJECT-SPECIFIC PROPS
// =============================================================================

export interface StickmanProps {
  pose: string;                   // preset name: "standing", "pointing_right", etc.
  expression?: string;            // "neutral", "happy", "thinking", etc.
  color?: string;                 // default: "#FFFFFF"
  lineWidth?: number;             // default: 3
}

// TextProps defined above in Track B-4 section

export interface IconProps {
  name: string;                   // icon identifier: "money-bag", "chart-up", etc.
  size?: number;                  // default: 80
  color?: string;                 // default: "#FFFFFF"
}

export interface ShapeProps {
  shape: "arrow" | "line" | "circle" | "rectangle" | "curved_arrow" | "bracket";
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  width?: number;
  height?: number;
  color?: string;                 // default: "#FFFFFF"
  strokeWidth?: number;           // default: 3
  fill?: boolean;                 // default: false
}

export interface CounterProps {
  from: number;
  to: number;
  format?: "number" | "currency_krw" | "currency_usd" | "percent";
  fontSize?: number;              // default: 64
  color?: string;                 // default: "#FFFFFF"
}

// =============================================================================
// ANIMATION DEFINITION
// =============================================================================

export interface AnimationDef {
  type: string;                   // preset name
  durationMs?: number;            // default varies by type
  delayMs?: number;               // default: 0
  loop?: boolean;                 // default: false

  // StickMan-specific: pose sequence
  keyframes?: PoseKeyframe[];

  // Motion-specific
  from?: "left" | "right" | "top" | "bottom";
}

export interface PoseKeyframe {
  atMs: number;                   // relative to scene start
  pose: string;                   // pose preset name
}

// =============================================================================
// SUBTITLE DATA
// =============================================================================

// Word-level subtitle (legacy, kept for compatibility)
export interface WordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
}

// Segment-level subtitle (sentence/phrase)
export interface SegmentTimestamp {
  text: string;
  startMs: number;
  endMs: number;
}

export interface SubtitleData {
  words?: WordTimestamp[];        // Legacy: word-level timestamps
  segments: SegmentTimestamp[];   // Primary: segment-level from script
}

// =============================================================================
// STICKMAN POSE TYPE
// =============================================================================

export interface Pose {
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

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Helper type for background (backward compatible)
export type BackgroundValue = string | BackgroundDef;

// Helper to check if background is simple color string
export const isSimpleBackground = (bg: BackgroundValue): bg is string => {
  return typeof bg === "string";
};

// Helper to get background color (for simple cases)
export const getBackgroundColor = (bg: BackgroundValue): string => {
  if (isSimpleBackground(bg)) {
    return bg;
  }
  return bg.colors[0] || "#1a1a2e";
};
