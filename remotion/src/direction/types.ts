/**
 * Direction Types - Camera, Layout, and Timing preset interfaces
 * Layer 3: Direction Elements for scene composition
 */

// ============================================================
// Camera Types
// ============================================================

/**
 * A single keyframe in a camera animation
 * @property atPercent - Position in the animation (0-100)
 * @property zoom - Zoom level (1.0 = normal, >1 = zoom in, <1 = zoom out)
 * @property offsetX - Horizontal pan offset in pixels
 * @property offsetY - Vertical pan offset in pixels
 * @property easing - CSS easing function name
 */
export interface CameraKeyframe {
  atPercent: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  easing: string;
}

/**
 * A complete camera movement preset
 * @property name - Unique identifier for the preset
 * @property keyframes - Array of keyframes defining the camera path
 */
export interface CameraPreset {
  name: string;
  keyframes: CameraKeyframe[];
}

// ============================================================
// Layout Types
// ============================================================

/**
 * A slot position in a layout template
 * @property role - The type of content expected (e.g., "stickman", "text", "icon")
 * @property position - X/Y coordinates relative to canvas center (percentages or pixels)
 * @property scale - Scale multiplier for the element
 * @property maxWidth - Maximum width constraint in pixels
 * @property anchor - Alignment anchor point
 */
export interface LayoutSlot {
  role: string;
  position: { x: number; y: number };
  scale?: number;
  maxWidth?: number;
  anchor?: 'center' | 'left' | 'right';
}

/**
 * A complete layout preset defining element positions
 * @property name - Unique identifier for the preset
 * @property slots - Array of slot definitions
 */
export interface LayoutPreset {
  name: string;
  slots: LayoutSlot[];
}

// ============================================================
// Timing Types
// ============================================================

/**
 * Timing configuration for a single element in a scene
 * @property target - Element role/type to apply timing to
 * @property delayMs - Delay before element appears (ms)
 * @property enterAnimation - Animation preset for entrance
 * @property enterDurationMs - Duration of enter animation (ms)
 * @property exitAnimation - Optional animation preset for exit
 * @property exitDurationMs - Optional duration of exit animation (ms)
 */
export interface TimingEntry {
  target: string;
  delayMs: number;
  enterAnimation: string;
  enterDurationMs: number;
  exitAnimation?: string;
  exitDurationMs?: number;
}

/**
 * A complete timing preset defining element choreography
 * @property name - Unique identifier for the preset
 * @property entries - Array of timing configurations per element
 */
export interface TimingPreset {
  name: string;
  entries: TimingEntry[];
}

// ============================================================
// Preset Name Types (for type safety)
// ============================================================

export type CameraPresetName =
  // MVP 5
  | 'static_full'
  | 'static_closeup'
  | 'static_wide'
  | 'zoom_in_slow'
  | 'zoom_in_fast'
  // V2 5
  | 'zoom_out_reveal'
  | 'zoom_pulse'
  | 'pan_left_to_right'
  | 'pan_right_to_left'
  | 'dolly_in';

export type LayoutPresetName =
  // MVP 10
  | 'center_single'
  | 'split_left_stickman'
  | 'triple_stickman_text_counter'
  | 'triple_stickman_icon_text'
  | 'text_only'
  | 'center_stack'
  | 'split_right_stickman'
  | 'split_equal'
  | 'grid_2x1'
  | 'overlay_fullscreen_text'
  // V2 8
  | 'center_hero'
  | 'triple_horizontal'
  | 'triple_top_bottom'
  | 'grid_2x2'
  | 'grid_3x1'
  | 'overlay_spotlight'
  | 'stickman_center_text_sides'
  | 'icon_grid';

export type TimingPresetName =
  // MVP 5
  | 'all_at_once'
  | 'all_at_once_stagger'
  | 'stickman_first'
  | 'text_first'
  | 'reveal_climax'
  // V2 5
  | 'left_to_right'
  | 'top_to_bottom'
  | 'counter_focus'
  | 'icon_burst'
  | 'carry_stickman';
