/**
 * Camera Presets - 15 camera movement patterns
 * Layer 3 (Direction Elements) for the stickman video system
 *
 * MVP 5: static_full, static_closeup, static_wide, zoom_in_slow, zoom_in_fast
 * V2 5: zoom_out_reveal, zoom_pulse, pan_left_to_right, pan_right_to_left, dolly_in
 * V3 5: pan_follow_stickman, reveal_pan_zoom, shake, zoom_breathe, cinematic_sweep
 */

import { CameraPreset, CameraKeyframe, CameraState, CameraEasing } from './types';

// ============================================================================
// MVP CAMERA PRESETS (5)
// ============================================================================

/**
 * 1. static_full - Full frame fixed view (zoom: 1.0)
 */
const static_full: CameraPreset = {
  name: 'static_full',
  description: 'Full frame fixed view with no camera movement',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

/**
 * 2. static_closeup - Close-up fixed view (zoom: 1.3)
 */
const static_closeup: CameraPreset = {
  name: 'static_closeup',
  description: 'Close-up fixed view for emphasis',
  keyframes: [
    { atPercent: 0, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

/**
 * 3. static_wide - Wide fixed view (zoom: 0.8)
 */
const static_wide: CameraPreset = {
  name: 'static_wide',
  description: 'Wide fixed view showing more context',
  keyframes: [
    { atPercent: 0, zoom: 0.8, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 0.8, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

/**
 * 4. zoom_in_slow - Slow zoom in from 1.0 to 1.2
 */
const zoom_in_slow: CameraPreset = {
  name: 'zoom_in_slow',
  description: 'Gradual zoom in for dramatic effect',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.2, offsetX: 0, offsetY: 0, easing: 'easeInOut' },
  ],
};

/**
 * 5. zoom_in_fast - Fast zoom in (500ms equivalent at 30fps)
 */
const zoom_in_fast: CameraPreset = {
  name: 'zoom_in_fast',
  description: 'Quick zoom in for impact (500ms)',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 20, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'easeOut' },
    { atPercent: 100, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'linear' },
  ],
};

// ============================================================================
// V2 CAMERA PRESETS (5)
// ============================================================================

/**
 * 6. zoom_out_reveal - Zoom out to reveal entire scene (1.3 to 1.0)
 */
const zoom_out_reveal: CameraPreset = {
  name: 'zoom_out_reveal',
  description: 'Zoom out to reveal the full scene',
  keyframes: [
    { atPercent: 0, zoom: 1.3, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeOut' },
  ],
};

/**
 * 7. zoom_pulse - Zoom in and out repeatedly
 */
const zoom_pulse: CameraPreset = {
  name: 'zoom_pulse',
  description: 'Pulsing zoom for emphasis',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 25, zoom: 1.1, offsetX: 0, offsetY: 0, easing: 'easeOut' },
    { atPercent: 50, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeInOut' },
    { atPercent: 75, zoom: 1.1, offsetX: 0, offsetY: 0, easing: 'easeOut' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeIn' },
  ],
};

/**
 * 8. pan_left_to_right - Pan from left to right
 */
const pan_left_to_right: CameraPreset = {
  name: 'pan_left_to_right',
  description: 'Horizontal pan from left to right',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: -200, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.0, offsetX: 200, offsetY: 0, easing: 'easeInOut' },
  ],
};

/**
 * 9. pan_right_to_left - Pan from right to left
 */
const pan_right_to_left: CameraPreset = {
  name: 'pan_right_to_left',
  description: 'Horizontal pan from right to left',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 200, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.0, offsetX: -200, offsetY: 0, easing: 'easeInOut' },
  ],
};

/**
 * 10. dolly_in - Zoom in while panning up (dolly effect)
 */
const dolly_in: CameraPreset = {
  name: 'dolly_in',
  description: 'Zoom in with upward pan for cinematic effect',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 50, easing: 'linear' },
    { atPercent: 100, zoom: 1.2, offsetX: 0, offsetY: -50, easing: 'easeInOut' },
  ],
};

// ============================================================================
// V3 CAMERA PRESETS (5)
// ============================================================================

/**
 * 11. pan_follow_stickman - Follow stickman position (dynamic)
 */
const pan_follow_stickman: CameraPreset = {
  name: 'pan_follow_stickman',
  description: 'Camera follows the stickman position (requires runtime data)',
  isDynamic: true,
  keyframes: [
    { atPercent: 0, zoom: 1.1, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 100, zoom: 1.1, offsetX: 0, offsetY: 0, easing: 'easeOut' },
  ],
};

/**
 * 12. reveal_pan_zoom - Pan while zooming out to reveal
 */
const reveal_pan_zoom: CameraPreset = {
  name: 'reveal_pan_zoom',
  description: 'Pan and zoom out simultaneously to reveal scene',
  keyframes: [
    { atPercent: 0, zoom: 1.4, offsetX: -300, offsetY: -100, easing: 'linear' },
    { atPercent: 50, zoom: 1.2, offsetX: 0, offsetY: -50, easing: 'easeOut' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeOut' },
  ],
};

/**
 * 13. shake - Camera shake for impact/emphasis
 */
const shake: CameraPreset = {
  name: 'shake',
  description: 'Camera shake for impact or emphasis',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 10, zoom: 1.0, offsetX: 10, offsetY: -5, easing: 'linear' },
    { atPercent: 20, zoom: 1.0, offsetX: -8, offsetY: 7, easing: 'linear' },
    { atPercent: 30, zoom: 1.0, offsetX: 6, offsetY: -4, easing: 'linear' },
    { atPercent: 40, zoom: 1.0, offsetX: -5, offsetY: 6, easing: 'linear' },
    { atPercent: 50, zoom: 1.0, offsetX: 4, offsetY: -3, easing: 'linear' },
    { atPercent: 60, zoom: 1.0, offsetX: -3, offsetY: 4, easing: 'linear' },
    { atPercent: 70, zoom: 1.0, offsetX: 2, offsetY: -2, easing: 'linear' },
    { atPercent: 80, zoom: 1.0, offsetX: -1, offsetY: 1, easing: 'linear' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeOut' },
  ],
};

/**
 * 14. zoom_breathe - Subtle breathing zoom effect
 */
const zoom_breathe: CameraPreset = {
  name: 'zoom_breathe',
  description: 'Subtle breathing zoom effect for ambient atmosphere',
  keyframes: [
    { atPercent: 0, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'linear' },
    { atPercent: 25, zoom: 1.03, offsetX: 0, offsetY: 0, easing: 'easeInOut' },
    { atPercent: 50, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeInOut' },
    { atPercent: 75, zoom: 1.03, offsetX: 0, offsetY: 0, easing: 'easeInOut' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeInOut' },
  ],
};

/**
 * 15. cinematic_sweep - Wide cinematic camera sweep
 */
const cinematic_sweep: CameraPreset = {
  name: 'cinematic_sweep',
  description: 'Wide cinematic sweep with zoom and pan combination',
  keyframes: [
    { atPercent: 0, zoom: 1.2, offsetX: -250, offsetY: 50, easing: 'linear' },
    { atPercent: 40, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeOut' },
    { atPercent: 70, zoom: 1.05, offsetX: 100, offsetY: -30, easing: 'easeInOut' },
    { atPercent: 100, zoom: 1.0, offsetX: 0, offsetY: 0, easing: 'easeOut' },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All camera presets indexed by name
 */
export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  // MVP (5)
  static_full,
  static_closeup,
  static_wide,
  zoom_in_slow,
  zoom_in_fast,
  // V2 (5)
  zoom_out_reveal,
  zoom_pulse,
  pan_left_to_right,
  pan_right_to_left,
  dolly_in,
  // V3 (5)
  pan_follow_stickman,
  reveal_pan_zoom,
  shake,
  zoom_breathe,
  cinematic_sweep,
};

/**
 * Array of all camera preset names
 */
export const CAMERA_NAMES = Object.keys(CAMERA_PRESETS) as string[];

/**
 * Get a camera preset by name
 */
export const getCameraPreset = (name: string): CameraPreset | undefined => {
  return CAMERA_PRESETS[name];
};

/**
 * Interpolate between two camera keyframes
 */
const interpolateKeyframes = (
  kf1: CameraKeyframe,
  kf2: CameraKeyframe,
  t: number,
  easing: CameraEasing
): CameraState => {
  // Apply easing
  let easedT = t;
  switch (easing) {
    case 'easeIn':
      easedT = t * t;
      break;
    case 'easeOut':
      easedT = 1 - (1 - t) * (1 - t);
      break;
    case 'easeInOut':
      easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      break;
    case 'easeInQuad':
      easedT = t * t;
      break;
    case 'easeOutQuad':
      easedT = 1 - (1 - t) * (1 - t);
      break;
    case 'easeInOutQuad':
      easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      break;
    case 'easeInCubic':
      easedT = t * t * t;
      break;
    case 'easeOutCubic':
      easedT = 1 - Math.pow(1 - t, 3);
      break;
    case 'easeInOutCubic':
      easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      break;
    case 'easeOutBack':
      const c1 = 1.70158;
      const c3 = c1 + 1;
      easedT = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      break;
    case 'spring':
      easedT = 1 - Math.cos((t * Math.PI) / 2);
      break;
    case 'linear':
    default:
      easedT = t;
  }

  return {
    zoom: kf1.zoom + (kf2.zoom - kf1.zoom) * easedT,
    offsetX: kf1.offsetX + (kf2.offsetX - kf1.offsetX) * easedT,
    offsetY: kf1.offsetY + (kf2.offsetY - kf1.offsetY) * easedT,
  };
};

/**
 * Calculate camera state at a given progress (0-1)
 */
export const calculateCameraState = (
  preset: CameraPreset,
  progress: number
): CameraState => {
  const percent = Math.max(0, Math.min(100, progress * 100));
  const keyframes = preset.keyframes;

  // Find surrounding keyframes
  let kf1 = keyframes[0];
  let kf2 = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (percent >= keyframes[i].atPercent && percent <= keyframes[i + 1].atPercent) {
      kf1 = keyframes[i];
      kf2 = keyframes[i + 1];
      break;
    }
  }

  // Calculate interpolation factor
  const range = kf2.atPercent - kf1.atPercent;
  const t = range === 0 ? 0 : (percent - kf1.atPercent) / range;

  return interpolateKeyframes(kf1, kf2, t, kf2.easing);
};

/**
 * Check if a camera preset exists
 */
export const hasCameraPreset = (name: string): boolean => {
  return name in CAMERA_PRESETS;
};

// MVP preset names for easy reference
export const MVP_CAMERA_NAMES = [
  'static_full',
  'static_closeup',
  'static_wide',
  'zoom_in_slow',
  'zoom_in_fast',
] as const;

// V2 preset names for easy reference
export const V2_CAMERA_NAMES = [
  'zoom_out_reveal',
  'zoom_pulse',
  'pan_left_to_right',
  'pan_right_to_left',
  'dolly_in',
] as const;

// V3 preset names for easy reference
export const V3_CAMERA_NAMES = [
  'pan_follow_stickman',
  'reveal_pan_zoom',
  'shake',
  'zoom_breathe',
  'cinematic_sweep',
] as const;
