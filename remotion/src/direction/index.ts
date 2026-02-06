/**
 * Direction Module - Layer 3 Direction Elements
 *
 * This module provides presets for:
 * - Camera: 5 presets (static_full, static_closeup, static_wide, zoom_in_slow, zoom_in_fast)
 * - Layout: 10 presets (center_single, split_left_stickman, etc.)
 * - Timing: 5 presets (all_at_once, stickman_first, etc.)
 */

// Types
export * from './types';

// Camera
export {
  // Presets
  STATIC_FULL,
  STATIC_CLOSEUP,
  STATIC_WIDE,
  ZOOM_IN_SLOW,
  ZOOM_IN_FAST,
  // Collections
  CAMERA_PRESETS,
  CAMERA_PRESET_NAMES,
  CAMERA_PRESETS_MAP,
  // Functions
  getCameraPreset,
  interpolateCameraAtProgress,
} from './camera';

// Layout
export {
  // Presets
  CENTER_SINGLE,
  SPLIT_LEFT_STICKMAN,
  TRIPLE_STICKMAN_TEXT_COUNTER,
  TRIPLE_STICKMAN_ICON_TEXT,
  TEXT_ONLY,
  CENTER_STACK,
  SPLIT_RIGHT_STICKMAN,
  SPLIT_EQUAL,
  GRID_2X1,
  OVERLAY_FULLSCREEN_TEXT,
  // Collections
  LAYOUT_PRESETS,
  LAYOUT_PRESET_NAMES,
  LAYOUT_PRESETS_MAP,
  // Functions
  getLayoutPreset,
  getSlotByRole,
  getSlotsByLayer,
} from './layout';

// Timing
export {
  // Presets
  ALL_AT_ONCE,
  ALL_AT_ONCE_STAGGER,
  STICKMAN_FIRST,
  TEXT_FIRST,
  REVEAL_CLIMAX,
  // Collections
  TIMING_PRESETS,
  TIMING_PRESET_NAMES,
  TIMING_PRESETS_MAP,
  // Functions
  getTimingPreset,
  getTimingForTarget,
  getEntriesByDelay,
  getTotalAnimationDuration,
} from './timing';
