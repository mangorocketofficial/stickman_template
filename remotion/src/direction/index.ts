/**
 * Direction Module - Camera, Layout, and Timing Presets
 * Layer 3 (Direction Elements) for the stickman video system
 *
 * Total Presets:
 * - Camera: 15 presets (5 MVP + 5 V2 + 5 V3)
 * - Layout: 25 presets (10 MVP + 8 V2 + 7 V3)
 * - Timing: 15 presets (5 MVP + 5 V2 + 5 V3)
 */

// Export all types
export * from './types';

// Export camera module
export {
  CAMERA_PRESETS,
  CAMERA_NAMES,
  getCameraPreset,
  hasCameraPreset,
  calculateCameraState,
  MVP_CAMERA_NAMES,
  V2_CAMERA_NAMES,
  V3_CAMERA_NAMES,
} from './camera';

// Export layout module
export {
  LAYOUT_PRESETS,
  LAYOUT_NAMES,
  getLayoutPreset,
  hasLayoutPreset,
  getSlotByRole,
  getSlotsByRole,
  resolveSlotPosition,
  MVP_LAYOUT_NAMES,
  V2_LAYOUT_NAMES,
  V3_LAYOUT_NAMES,
} from './layout';

// Export timing module
export {
  TIMING_PRESETS,
  TIMING_NAMES,
  getTimingPreset,
  hasTimingPreset,
  getTimingForTarget,
  calculateTotalDuration,
  getSortedEntries,
  MVP_TIMING_NAMES,
  V2_TIMING_NAMES,
  V3_TIMING_NAMES,
} from './timing';

// Convenience functions for getting any preset by type
import { getCameraPreset, CAMERA_PRESETS } from './camera';
import { getLayoutPreset, LAYOUT_PRESETS } from './layout';
import { getTimingPreset, TIMING_PRESETS } from './timing';
import { CameraPreset, LayoutPreset, TimingPreset, DirectionConfig } from './types';

/**
 * Get a direction preset by type and name
 */
export const getDirectionPreset = (
  type: 'camera' | 'layout' | 'timing',
  name: string
): CameraPreset | LayoutPreset | TimingPreset | undefined => {
  switch (type) {
    case 'camera':
      return getCameraPreset(name);
    case 'layout':
      return getLayoutPreset(name);
    case 'timing':
      return getTimingPreset(name);
    default:
      return undefined;
  }
};

/**
 * Validate a direction configuration
 */
export const validateDirectionConfig = (config: DirectionConfig): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (config.camera && typeof config.camera === 'string') {
    if (!CAMERA_PRESETS[config.camera]) {
      errors.push(`Unknown camera preset: ${config.camera}`);
    }
  }

  if (config.layout && typeof config.layout === 'string') {
    if (!LAYOUT_PRESETS[config.layout]) {
      errors.push(`Unknown layout preset: ${config.layout}`);
    }
  }

  if (config.timing && typeof config.timing === 'string') {
    if (!TIMING_PRESETS[config.timing]) {
      errors.push(`Unknown timing preset: ${config.timing}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get counts for each preset type
 */
export const getPresetCounts = (): {
  camera: number;
  layout: number;
  timing: number;
  total: number;
} => {
  const camera = Object.keys(CAMERA_PRESETS).length;
  const layout = Object.keys(LAYOUT_PRESETS).length;
  const timing = Object.keys(TIMING_PRESETS).length;

  return {
    camera,
    layout,
    timing,
    total: camera + layout + timing,
  };
};
