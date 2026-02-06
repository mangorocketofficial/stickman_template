/**
 * Direction Module - Shared Type Definitions
 * Layer 3: Camera, Layout, and Timing presets for scene direction
 */

// =============================================================================
// Camera Types
// =============================================================================

/**
 * A single keyframe in a camera animation
 */
export interface CameraKeyframe {
  /** Position within scene as percentage (0-100) */
  atPercent: number;
  /** Zoom level (1.0 = default, >1 = zoom in, <1 = zoom out) */
  zoom: number;
  /** Horizontal offset in pixels */
  offsetX: number;
  /** Vertical offset in pixels */
  offsetY: number;
  /** Easing function for transition to this keyframe */
  easing: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
}

/**
 * A camera preset defining camera behavior for a scene
 */
export interface CameraPreset {
  /** Unique identifier for the preset */
  name: string;
  /** Description of the camera effect */
  description?: string;
  /** Keyframes defining the camera animation */
  keyframes: CameraKeyframe[];
}

// =============================================================================
// Layout Types
// =============================================================================

/**
 * A slot in a layout defining position and properties for an object
 */
export interface LayoutSlot {
  /** Role identifier (stickman, primary_text, secondary, accent, etc.) */
  role: 'stickman' | 'primary_text' | 'secondary' | 'accent' | 'background' | 'overlay';
  /** Position in pixels (1920x1080 canvas) */
  position: { x: number; y: number };
  /** Scale multiplier (default: 1.0) */
  scale?: number;
  /** Maximum width for text elements */
  maxWidth?: number;
  /** Anchor point for positioning */
  anchor?: 'center' | 'left' | 'right' | 'top' | 'bottom';
  /** Z-index layer (higher = on top) */
  layer?: number;
}

/**
 * A layout preset defining object arrangement
 */
export interface LayoutPreset {
  /** Unique identifier for the preset */
  name: string;
  /** Description of the layout pattern */
  description?: string;
  /** Slots defining positions for different object roles */
  slots: LayoutSlot[];
}

// =============================================================================
// Timing Types
// =============================================================================

/**
 * A timing entry for a specific object or role
 */
export interface TimingEntry {
  /** Target object role or type */
  target: 'stickman' | 'primary_text' | 'secondary' | 'accent' | 'background' | 'all';
  /** Delay in milliseconds from scene start */
  delayMs: number;
  /** Enter animation preset name */
  enterAnimation: string;
  /** Duration of enter animation in milliseconds */
  enterDurationMs: number;
  /** Exit animation preset name (optional) */
  exitAnimation?: string;
  /** Duration of exit animation in milliseconds (optional) */
  exitDurationMs?: number;
}

/**
 * A timing preset defining animation choreography
 */
export interface TimingPreset {
  /** Unique identifier for the preset */
  name: string;
  /** Description of the timing pattern */
  description?: string;
  /** Timing entries for different objects/roles */
  entries: TimingEntry[];
}
