/**
 * Camera Presets - Layer 3 Direction Elements
 *
 * 5 camera presets for scene direction:
 * 1. static_full - Full frame static shot (zoom: 1.0)
 * 2. static_closeup - Closeup static shot (zoom: 1.3)
 * 3. static_wide - Wide static shot (zoom: 0.8)
 * 4. zoom_in_slow - Slow zoom in over entire scene (1.0 -> 1.2)
 * 5. zoom_in_fast - Fast zoom in for emphasis (500ms, 1.0 -> 1.3)
 */

import { CameraKeyframe, CameraPreset } from './types';

// =============================================================================
// Camera Presets
// =============================================================================

/**
 * Static full frame - default camera view
 */
export const STATIC_FULL: CameraPreset = {
  name: 'static_full',
  description: 'Full frame static shot (zoom: 1.0)',
  keyframes: [
    {
      atPercent: 0,
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      easing: 'linear',
    },
    {
      atPercent: 100,
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      easing: 'linear',
    },
  ],
};

/**
 * Static closeup - tighter framing
 */
export const STATIC_CLOSEUP: CameraPreset = {
  name: 'static_closeup',
  description: 'Closeup static shot (zoom: 1.3)',
  keyframes: [
    {
      atPercent: 0,
      zoom: 1.3,
      offsetX: 0,
      offsetY: 0,
      easing: 'linear',
    },
    {
      atPercent: 100,
      zoom: 1.3,
      offsetX: 0,
      offsetY: 0,
      easing: 'linear',
    },
  ],
};

/**
 * Static wide - pulled back framing
 */
export const STATIC_WIDE: CameraPreset = {
  name: 'static_wide',
  description: 'Wide static shot (zoom: 0.8)',
  keyframes: [
    {
      atPercent: 0,
      zoom: 0.8,
      offsetX: 0,
      offsetY: 0,
      easing: 'linear',
    },
    {
      atPercent: 100,
      zoom: 0.8,
      offsetX: 0,
      offsetY: 0,
      easing: 'linear',
    },
  ],
};

/**
 * Slow zoom in - gradual emphasis over entire scene
 */
export const ZOOM_IN_SLOW: CameraPreset = {
  name: 'zoom_in_slow',
  description: 'Slow zoom in over entire scene (1.0 -> 1.2)',
  keyframes: [
    {
      atPercent: 0,
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      easing: 'easeInOut',
    },
    {
      atPercent: 100,
      zoom: 1.2,
      offsetX: 0,
      offsetY: 0,
      easing: 'easeInOut',
    },
  ],
};

/**
 * Fast zoom in - quick emphasis (typically 500ms)
 * Note: The actual duration is controlled by scene timing,
 * but this preset is designed for quick emphasis effects
 */
export const ZOOM_IN_FAST: CameraPreset = {
  name: 'zoom_in_fast',
  description: 'Fast zoom in for emphasis (1.0 -> 1.3, designed for ~500ms)',
  keyframes: [
    {
      atPercent: 0,
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      easing: 'easeOut',
    },
    {
      atPercent: 100,
      zoom: 1.3,
      offsetX: 0,
      offsetY: 0,
      easing: 'easeOut',
    },
  ],
};

// =============================================================================
// Exports
// =============================================================================

/**
 * All camera presets as an array
 */
export const CAMERA_PRESETS: CameraPreset[] = [
  STATIC_FULL,
  STATIC_CLOSEUP,
  STATIC_WIDE,
  ZOOM_IN_SLOW,
  ZOOM_IN_FAST,
];

/**
 * Camera preset names list
 */
export const CAMERA_PRESET_NAMES = CAMERA_PRESETS.map((p) => p.name);

/**
 * Camera presets as a map for quick lookup
 */
export const CAMERA_PRESETS_MAP: Record<string, CameraPreset> = Object.fromEntries(
  CAMERA_PRESETS.map((p) => [p.name, p])
);

/**
 * Get a camera preset by name
 * @param name - The preset name
 * @returns The camera preset, or STATIC_FULL as default
 */
export const getCameraPreset = (name: string): CameraPreset => {
  return CAMERA_PRESETS_MAP[name] ?? STATIC_FULL;
};

/**
 * Interpolate camera values at a given scene progress
 * @param preset - The camera preset
 * @param progressPercent - Scene progress (0-100)
 * @returns Interpolated camera values
 */
export const interpolateCameraAtProgress = (
  preset: CameraPreset,
  progressPercent: number
): { zoom: number; offsetX: number; offsetY: number } => {
  const { keyframes } = preset;

  // Clamp progress to valid range
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));

  // Find surrounding keyframes
  let prevKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (keyframes[i].atPercent <= clampedProgress && keyframes[i + 1].atPercent >= clampedProgress) {
      prevKeyframe = keyframes[i];
      nextKeyframe = keyframes[i + 1];
      break;
    }
  }

  // Calculate interpolation factor
  const range = nextKeyframe.atPercent - prevKeyframe.atPercent;
  const t = range === 0 ? 0 : (clampedProgress - prevKeyframe.atPercent) / range;

  // Apply easing (simplified - linear interpolation for now)
  const easedT = applyEasing(t, nextKeyframe.easing);

  return {
    zoom: prevKeyframe.zoom + (nextKeyframe.zoom - prevKeyframe.zoom) * easedT,
    offsetX: prevKeyframe.offsetX + (nextKeyframe.offsetX - prevKeyframe.offsetX) * easedT,
    offsetY: prevKeyframe.offsetY + (nextKeyframe.offsetY - prevKeyframe.offsetY) * easedT,
  };
};

/**
 * Apply easing function to interpolation factor
 */
const applyEasing = (t: number, easing: CameraKeyframe['easing']): number => {
  switch (easing) {
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'linear':
    default:
      return t;
  }
};
