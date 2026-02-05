// Scene JSON Schema - Contract between Python pipeline and Remotion renderer

// Top-Level Structure
export interface VideoProject {
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

// Scene
export interface Scene {
  id: string;                    // "scene_01"
  startMs: number;               // from Whisper alignment
  endMs: number;
  background: string;            // hex color, default "#1a1a2e"
  transition?: {
    in?: TransitionType;
    out?: TransitionType;
    durationMs?: number;         // default: 300
  };
  objects: SceneObject[];
}

export type TransitionType = "fadeIn" | "fadeOut" | "none";

// Scene Object
export interface SceneObject {
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

// Object-Specific Props
export interface StickmanProps {
  pose: string;                  // preset name: "standing", "pointing_right", etc.
  expression?: string;           // "neutral", "happy", "thinking", etc.
  color?: string;                // default: "#FFFFFF"
  lineWidth?: number;            // default: 3
}

export interface TextProps {
  content: string;
  fontSize?: number;             // default: 48
  fontWeight?: "normal" | "bold";
  color?: string;                // default: "#FFFFFF"
  maxWidth?: number;             // default: 800
  align?: "left" | "center" | "right";
}

export interface IconProps {
  name: string;                  // icon identifier: "money-bag", "chart-up", etc.
  size?: number;                 // default: 80
  color?: string;                // default: "#FFFFFF"
}

export interface ShapeProps {
  shape: "arrow" | "line" | "circle" | "rectangle" | "curved_arrow" | "bracket";
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  width?: number;
  height?: number;
  color?: string;                // default: "#FFFFFF"
  strokeWidth?: number;          // default: 3
  fill?: boolean;                // default: false
}

export interface CounterProps {
  from: number;
  to: number;
  format?: "number" | "currency_krw" | "currency_usd" | "percent";
  fontSize?: number;             // default: 64
  color?: string;                // default: "#FFFFFF"
}

// Animation Definition
export interface AnimationDef {
  type: string;                  // preset name
  durationMs?: number;           // default varies by type
  delayMs?: number;              // default: 0
  loop?: boolean;                // default: false

  // StickMan-specific: pose sequence
  keyframes?: PoseKeyframe[];

  // Motion-specific
  from?: "left" | "right" | "top" | "bottom";
}

export interface PoseKeyframe {
  atMs: number;                  // relative to scene start
  pose: string;                  // pose preset name
}

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
  words?: WordTimestamp[];           // Legacy: word-level timestamps
  segments: SegmentTimestamp[];      // Primary: segment-level from script
}

// Pose type for StickMan
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
