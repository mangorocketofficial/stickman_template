/**
 * Direction Types - Camera, Layout, and Timing Presets
 * Layer 3 (Direction Elements) for the stickman video system
 */

// ============================================================================
// CAMERA TYPES
// ============================================================================

/**
 * Easing function names for camera animations
 */
export type CameraEasing =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeOutBack'
  | 'spring';

/**
 * A single keyframe in a camera animation
 */
export interface CameraKeyframe {
  /** Position in the animation as a percentage (0-100) */
  atPercent: number;
  /** Zoom level (1.0 = normal, >1.0 = zoomed in, <1.0 = zoomed out) */
  zoom: number;
  /** Horizontal offset in pixels (positive = right, negative = left) */
  offsetX: number;
  /** Vertical offset in pixels (positive = down, negative = up) */
  offsetY: number;
  /** Easing function for transition to this keyframe */
  easing: CameraEasing;
}

/**
 * A camera preset defining how the camera moves during a scene
 */
export interface CameraPreset {
  /** Unique identifier for the preset */
  name: string;
  /** Human-readable description */
  description: string;
  /** Sequence of keyframes defining the camera movement */
  keyframes: CameraKeyframe[];
  /** Whether this preset requires runtime data (e.g., stickman position) */
  isDynamic?: boolean;
}

// ============================================================================
// LAYOUT TYPES
// ============================================================================

/**
 * Anchor point for positioning
 */
export type LayoutAnchor = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Role of an element in a layout
 */
export type LayoutRole =
  | 'stickman'
  | 'text'
  | 'title'
  | 'subtitle'
  | 'icon'
  | 'counter'
  | 'shape'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'item1'
  | 'item2'
  | 'item3'
  | 'item4'
  | 'item5'
  | 'item6'
  | 'hero'
  | 'background'
  | 'overlay'
  | 'any';

/**
 * A slot in a layout defining where an element should be positioned
 */
export interface LayoutSlot {
  /** Role identifier for this slot */
  role: LayoutRole;
  /** Position in pixels from top-left (1920x1080 canvas) */
  position: { x: number; y: number };
  /** Scale factor (1.0 = normal) */
  scale?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Anchor point for positioning */
  anchor?: LayoutAnchor;
  /** Z-index layer */
  layer?: number;
  /** Optional rotation in degrees */
  rotation?: number;
  /** Optional opacity (0-1) */
  opacity?: number;
}

/**
 * A layout preset defining positions for multiple elements
 */
export interface LayoutPreset {
  /** Unique identifier for the preset */
  name: string;
  /** Human-readable description */
  description: string;
  /** Slots defining element positions */
  slots: LayoutSlot[];
  /** Minimum number of elements required */
  minElements?: number;
  /** Maximum number of elements supported */
  maxElements?: number;
}

// ============================================================================
// TIMING TYPES
// ============================================================================

/**
 * Enter animation types available
 */
export type EnterAnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'popIn'
  | 'popInBounce'
  | 'typewriter'
  | 'drawLine'
  | 'scaleIn'
  | 'rotateIn'
  | 'flipIn'
  | 'wipeLeft'
  | 'wipeRight'
  | 'wipeUp'
  | 'wipeDown'
  | 'morphIn'
  | 'none';

/**
 * Exit animation types available
 */
export type ExitAnimationType =
  | 'fadeOut'
  | 'fadeOutUp'
  | 'fadeOutDown'
  | 'fadeOutLeft'
  | 'fadeOutRight'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'slideOutDown'
  | 'popOut'
  | 'scaleOut'
  | 'rotateOut'
  | 'wipeOutLeft'
  | 'wipeOutRight'
  | 'none';

/**
 * Target selector for timing entries
 */
export type TimingTarget =
  | 'stickman'
  | 'text'
  | 'title'
  | 'icon'
  | 'counter'
  | 'shape'
  | 'all'
  | 'primary'
  | 'secondary'
  | 'background'
  | string; // Allow custom IDs

/**
 * A timing entry defining animation timing for an element
 */
export interface TimingEntry {
  /** Target element selector */
  target: TimingTarget;
  /** Delay before animation starts (in milliseconds) */
  delayMs: number;
  /** Enter animation type */
  enterAnimation: EnterAnimationType;
  /** Duration of enter animation (in milliseconds) */
  enterDurationMs: number;
  /** Exit animation type */
  exitAnimation?: ExitAnimationType;
  /** Duration of exit animation (in milliseconds) */
  exitDurationMs?: number;
  /** Easing function for animations */
  easing?: CameraEasing;
}

/**
 * A timing preset defining animation sequence for a scene
 */
export interface TimingPreset {
  /** Unique identifier for the preset */
  name: string;
  /** Human-readable description */
  description: string;
  /** Timing entries for each element type */
  entries: TimingEntry[];
  /** Base stagger delay for sequential animations */
  baseStaggerMs?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Combined direction configuration for a scene
 */
export interface DirectionConfig {
  camera?: string | CameraPreset;
  layout?: string | LayoutPreset;
  timing?: string | TimingPreset;
}

/**
 * Runtime camera state calculated from preset
 */
export interface CameraState {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Runtime layout slot with resolved position
 */
export interface ResolvedLayoutSlot extends LayoutSlot {
  absoluteX: number;
  absoluteY: number;
}
