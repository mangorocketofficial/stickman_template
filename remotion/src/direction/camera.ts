/**
 * Camera Presets - 10 camera movement presets for scene direction
 * Layer 3: Direction Elements
 *
 * MVP (5): static_full, static_closeup, static_wide, zoom_in_slow, zoom_in_fast
 * V2 (5): zoom_out_reveal, zoom_pulse, pan_left_to_right, pan_right_to_left, dolly_in
 */

import { CameraPreset, CameraPresetName } from './types';

// ============================================================
// MVP Camera Presets (5)
// ============================================================

/**
 * 1. static_full - Full frame static shot (default)
 * No camera movement, shows entire scene
 */
const static_full: CameraPreset = {
  name: 'static_full',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

/**
 * 2. static_closeup - Close-up static shot
 * Zoomed in to 1.3x, good for emotional moments or details
 */
const static_closeup: CameraPreset = {
  name: 'static_closeup',
  keyframes: [
    { atPercent: 0, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

/**
 * 3. static_wide - Wide static shot
 * Zoomed out to 0.8x, shows more context
 */
const static_wide: CameraPreset = {
  name: 'static_wide',
  keyframes: [
    { atPercent: 0, zoom: 0.8, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 0.8, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

/**
 * 4. zoom_in_slow - Slow zoom in over entire scene
 * Gradual zoom from 1.0 to 1.2, creates sense of focus
 */
const zoom_in_slow: CameraPreset = {
  name: 'zoom_in_slow',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-out' },
    { atPercent: 100, zoom: 1.2, offsetX: 0, offsetY: 0, easing: 'ease-out' },
  ],
};

/**
 * 5. zoom_in_fast - Fast zoom in for emphasis
 * Quick 500ms zoom, used for dramatic emphasis
 */
const zoom_in_fast: CameraPreset = {
  name: 'zoom_in_fast',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 20, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 40, zoom: 1.25, offsetX: 0, offsetY: 0, easing: 'ease-out' },
    { atPercent: 100, zoom: 1.25, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

// ============================================================
// V2 Camera Presets (5)
// ============================================================

/**
 * 6. zoom_out_reveal - Zoom out to reveal full scene
 * Starts close (1.3x), zooms out to normal (1.0x)
 */
const zoom_out_reveal: CameraPreset = {
  name: 'zoom_out_reveal',
  keyframes: [
    { atPercent: 0, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'ease-out' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-out' },
  ],
};

/**
 * 7. zoom_pulse - Zoom in and out for emphasis
 * Pulses between 1.0 and 1.1 for attention-grabbing effect
 */
const zoom_pulse: CameraPreset = {
  name: 'zoom_pulse',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 25, zoom: 1.1, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 50, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 75, zoom: 1.1, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'ease-in-out' },
  ],
};

/**
 * 8. pan_left_to_right - Slow pan from left to right
 * Camera slides across scene, good for reveals
 */
const pan_left_to_right: CameraPreset = {
  name: 'pan_left_to_right',
  keyframes: [
    { atPercent: 0, zoom: 1.1, offsetX: -100, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 100, zoom: 1.1, offsetX: 100, offsetY: 0, easing: 'ease-in-out' },
  ],
};

/**
 * 9. pan_right_to_left - Slow pan from right to left
 * Camera slides across scene in opposite direction
 */
const pan_right_to_left: CameraPreset = {
  name: 'pan_right_to_left',
  keyframes: [
    { atPercent: 0, zoom: 1.1, offsetX: 100, offsetY: 0, easing: 'ease-in-out' },
    { atPercent: 100, zoom: 1.1, offsetX: -100, offsetY: 0, easing: 'ease-in-out' },
  ],
};

/**
 * 10. dolly_in - Zoom in with slight upward pan
 * Creates immersive "moving forward" feeling
 */
const dolly_in: CameraPreset = {
  name: 'dolly_in',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 20, easing: 'ease-out' },
    { atPercent: 100, zoom: 1.25, offsetX: 0, offsetY: -20, easing: 'ease-out' },
  ],
};

// ============================================================
// Exports
// ============================================================

/**
 * All camera presets as a record
 */
export const CAMERA_PRESETS: Record<CameraPresetName, CameraPreset> = {
  // MVP
  static_full,
  static_closeup,
  static_wide,
  zoom_in_slow,
  zoom_in_fast,
  // V2
  zoom_out_reveal,
  zoom_pulse,
  pan_left_to_right,
  pan_right_to_left,
  dolly_in,
};

/**
 * Array of all camera preset names
 */
export const CAMERA_PRESET_NAMES: CameraPresetName[] = [
  // MVP
  'static_full',
  'static_closeup',
  'static_wide',
  'zoom_in_slow',
  'zoom_in_fast',
  // V2
  'zoom_out_reveal',
  'zoom_pulse',
  'pan_left_to_right',
  'pan_right_to_left',
  'dolly_in',
];

/**
 * MVP camera preset names (first 5)
 */
export const MVP_CAMERA_PRESET_NAMES: CameraPresetName[] = [
  'static_full',
  'static_closeup',
  'static_wide',
  'zoom_in_slow',
  'zoom_in_fast',
];

/**
 * V2 camera preset names (additional 5)
 */
export const V2_CAMERA_PRESET_NAMES: CameraPresetName[] = [
  'zoom_out_reveal',
  'zoom_pulse',
  'pan_left_to_right',
  'pan_right_to_left',
  'dolly_in',
];

/**
 * Get a camera preset by name
 * @param name - The preset name
 * @returns The camera preset or static_full as default
 */
export const getCameraPreset = (name: string): CameraPreset => {
  return CAMERA_PRESETS[name as CameraPresetName] || CAMERA_PRESETS.static_full;
};

/**
 * Default camera preset
 */
export const DEFAULT_CAMERA_PRESET = CAMERA_PRESETS.static_full;
