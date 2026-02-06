/**
 * Direction Module - Layer 3 Direction Elements
 *
 * Exports camera, layout, and timing presets for scene direction.
 *
 * Total Presets:
 * - Camera: 10 (MVP 5 + V2 5)
 * - Layout: 18 (MVP 10 + V2 8)
 * - Timing: 10 (MVP 5 + V2 5)
 */

// Types
export type {
  CameraKeyframe,
  CameraPreset,
  CameraPresetName,
  LayoutSlot,
  LayoutPreset,
  LayoutPresetName,
  TimingEntry,
  TimingPreset,
  TimingPresetName,
} from './types';

// Camera presets and utilities
export {
  CAMERA_PRESETS,
  CAMERA_PRESET_NAMES,
  MVP_CAMERA_PRESET_NAMES,
  V2_CAMERA_PRESET_NAMES,
  getCameraPreset,
  DEFAULT_CAMERA_PRESET,
} from './camera';

// Layout presets and utilities
export {
  LAYOUT_PRESETS,
  LAYOUT_PRESET_NAMES,
  MVP_LAYOUT_PRESET_NAMES,
  V2_LAYOUT_PRESET_NAMES,
  getLayoutPreset,
  DEFAULT_LAYOUT_PRESET,
  getSlotByRole,
} from './layout';

// Timing presets and utilities
export {
  TIMING_PRESETS,
  TIMING_PRESET_NAMES,
  MVP_TIMING_PRESET_NAMES,
  V2_TIMING_PRESET_NAMES,
  getTimingPreset,
  DEFAULT_TIMING_PRESET,
  getTimingByTarget,
  getTimingEntriesSorted,
} from './timing';
