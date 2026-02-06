/**
 * Direction Module Index Tests
 * Testing exports and utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  // Types
  CameraPreset,
  CameraKeyframe,
  CameraState,
  CameraEasing,
  LayoutPreset,
  LayoutSlot,
  LayoutRole,
  LayoutAnchor,
  TimingPreset,
  TimingEntry,
  EnterAnimationType,
  ExitAnimationType,
  DirectionConfig,
  ResolvedLayoutSlot,

  // Camera exports
  CAMERA_PRESETS,
  CAMERA_NAMES,
  getCameraPreset,
  hasCameraPreset,
  calculateCameraState,
  MVP_CAMERA_NAMES,
  V2_CAMERA_NAMES,
  V3_CAMERA_NAMES,

  // Layout exports
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

  // Timing exports
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

  // Index utility functions
  getDirectionPreset,
  validateDirectionConfig,
  getPresetCounts,
} from '../index';

describe('Direction Module Index', () => {
  // ==========================================================================
  // Export Verification
  // ==========================================================================
  describe('Export Verification', () => {
    describe('Camera exports', () => {
      it('should export CAMERA_PRESETS', () => {
        expect(CAMERA_PRESETS).toBeDefined();
        expect(typeof CAMERA_PRESETS).toBe('object');
      });

      it('should export CAMERA_NAMES', () => {
        expect(CAMERA_NAMES).toBeDefined();
        expect(Array.isArray(CAMERA_NAMES)).toBe(true);
      });

      it('should export camera helper functions', () => {
        expect(typeof getCameraPreset).toBe('function');
        expect(typeof hasCameraPreset).toBe('function');
        expect(typeof calculateCameraState).toBe('function');
      });

      it('should export camera name arrays', () => {
        expect(MVP_CAMERA_NAMES).toBeDefined();
        expect(V2_CAMERA_NAMES).toBeDefined();
        expect(V3_CAMERA_NAMES).toBeDefined();
      });
    });

    describe('Layout exports', () => {
      it('should export LAYOUT_PRESETS', () => {
        expect(LAYOUT_PRESETS).toBeDefined();
        expect(typeof LAYOUT_PRESETS).toBe('object');
      });

      it('should export LAYOUT_NAMES', () => {
        expect(LAYOUT_NAMES).toBeDefined();
        expect(Array.isArray(LAYOUT_NAMES)).toBe(true);
      });

      it('should export layout helper functions', () => {
        expect(typeof getLayoutPreset).toBe('function');
        expect(typeof hasLayoutPreset).toBe('function');
        expect(typeof getSlotByRole).toBe('function');
        expect(typeof getSlotsByRole).toBe('function');
        expect(typeof resolveSlotPosition).toBe('function');
      });

      it('should export layout name arrays', () => {
        expect(MVP_LAYOUT_NAMES).toBeDefined();
        expect(V2_LAYOUT_NAMES).toBeDefined();
        expect(V3_LAYOUT_NAMES).toBeDefined();
      });
    });

    describe('Timing exports', () => {
      it('should export TIMING_PRESETS', () => {
        expect(TIMING_PRESETS).toBeDefined();
        expect(typeof TIMING_PRESETS).toBe('object');
      });

      it('should export TIMING_NAMES', () => {
        expect(TIMING_NAMES).toBeDefined();
        expect(Array.isArray(TIMING_NAMES)).toBe(true);
      });

      it('should export timing helper functions', () => {
        expect(typeof getTimingPreset).toBe('function');
        expect(typeof hasTimingPreset).toBe('function');
        expect(typeof getTimingForTarget).toBe('function');
        expect(typeof calculateTotalDuration).toBe('function');
        expect(typeof getSortedEntries).toBe('function');
      });

      it('should export timing name arrays', () => {
        expect(MVP_TIMING_NAMES).toBeDefined();
        expect(V2_TIMING_NAMES).toBeDefined();
        expect(V3_TIMING_NAMES).toBeDefined();
      });
    });
  });

  // ==========================================================================
  // getDirectionPreset
  // ==========================================================================
  describe('getDirectionPreset', () => {
    it('should return camera preset for type "camera"', () => {
      const preset = getDirectionPreset('camera', 'static_full');
      expect(preset).toBeDefined();
      expect(preset?.name).toBe('static_full');
    });

    it('should return layout preset for type "layout"', () => {
      const preset = getDirectionPreset('layout', 'center_single');
      expect(preset).toBeDefined();
      expect(preset?.name).toBe('center_single');
    });

    it('should return timing preset for type "timing"', () => {
      const preset = getDirectionPreset('timing', 'all_at_once');
      expect(preset).toBeDefined();
      expect(preset?.name).toBe('all_at_once');
    });

    it('should return undefined for invalid preset name', () => {
      const preset = getDirectionPreset('camera', 'invalid_preset');
      expect(preset).toBeUndefined();
    });

    it('should return undefined for invalid type', () => {
      // @ts-expect-error Testing invalid type
      const preset = getDirectionPreset('invalid', 'static_full');
      expect(preset).toBeUndefined();
    });
  });

  // ==========================================================================
  // validateDirectionConfig
  // ==========================================================================
  describe('validateDirectionConfig', () => {
    it('should validate valid camera config', () => {
      const result = validateDirectionConfig({ camera: 'static_full' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid layout config', () => {
      const result = validateDirectionConfig({ layout: 'center_single' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid timing config', () => {
      const result = validateDirectionConfig({ timing: 'all_at_once' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate combined valid config', () => {
      const result = validateDirectionConfig({
        camera: 'static_full',
        layout: 'center_single',
        timing: 'all_at_once'
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid camera preset', () => {
      const result = validateDirectionConfig({ camera: 'invalid_camera' });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('camera');
    });

    it('should detect invalid layout preset', () => {
      const result = validateDirectionConfig({ layout: 'invalid_layout' });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('layout');
    });

    it('should detect invalid timing preset', () => {
      const result = validateDirectionConfig({ timing: 'invalid_timing' });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('timing');
    });

    it('should detect multiple invalid presets', () => {
      const result = validateDirectionConfig({
        camera: 'invalid_camera',
        layout: 'invalid_layout',
        timing: 'invalid_timing'
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });

    it('should accept preset objects', () => {
      const result = validateDirectionConfig({
        camera: CAMERA_PRESETS['static_full'],
        layout: LAYOUT_PRESETS['center_single'],
        timing: TIMING_PRESETS['all_at_once']
      });
      expect(result.valid).toBe(true);
    });

    it('should validate empty config', () => {
      const result = validateDirectionConfig({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // ==========================================================================
  // getPresetCounts
  // ==========================================================================
  describe('getPresetCounts', () => {
    it('should return correct counts', () => {
      const counts = getPresetCounts();
      expect(counts.camera).toBe(15);
      expect(counts.layout).toBe(25);
      expect(counts.timing).toBe(15);
      expect(counts.total).toBe(55);
    });

    it('should match actual preset object keys', () => {
      const counts = getPresetCounts();
      expect(counts.camera).toBe(Object.keys(CAMERA_PRESETS).length);
      expect(counts.layout).toBe(Object.keys(LAYOUT_PRESETS).length);
      expect(counts.timing).toBe(Object.keys(TIMING_PRESETS).length);
    });
  });

  // ==========================================================================
  // Version Breakdown
  // ==========================================================================
  describe('Version Breakdown', () => {
    describe('Camera presets by version', () => {
      it('should have 5 MVP camera presets', () => {
        expect(MVP_CAMERA_NAMES).toHaveLength(5);
        MVP_CAMERA_NAMES.forEach(name => {
          expect(CAMERA_PRESETS[name]).toBeDefined();
        });
      });

      it('should have 5 V2 camera presets', () => {
        expect(V2_CAMERA_NAMES).toHaveLength(5);
        V2_CAMERA_NAMES.forEach(name => {
          expect(CAMERA_PRESETS[name]).toBeDefined();
        });
      });

      it('should have 5 V3 camera presets', () => {
        expect(V3_CAMERA_NAMES).toHaveLength(5);
        V3_CAMERA_NAMES.forEach(name => {
          expect(CAMERA_PRESETS[name]).toBeDefined();
        });
      });
    });

    describe('Layout presets by version', () => {
      it('should have 10 MVP layout presets', () => {
        expect(MVP_LAYOUT_NAMES).toHaveLength(10);
        MVP_LAYOUT_NAMES.forEach(name => {
          expect(LAYOUT_PRESETS[name]).toBeDefined();
        });
      });

      it('should have 8 V2 layout presets', () => {
        expect(V2_LAYOUT_NAMES).toHaveLength(8);
        V2_LAYOUT_NAMES.forEach(name => {
          expect(LAYOUT_PRESETS[name]).toBeDefined();
        });
      });

      it('should have 7 V3 layout presets', () => {
        expect(V3_LAYOUT_NAMES).toHaveLength(7);
        V3_LAYOUT_NAMES.forEach(name => {
          expect(LAYOUT_PRESETS[name]).toBeDefined();
        });
      });
    });

    describe('Timing presets by version', () => {
      it('should have 5 MVP timing presets', () => {
        expect(MVP_TIMING_NAMES).toHaveLength(5);
        MVP_TIMING_NAMES.forEach(name => {
          expect(TIMING_PRESETS[name]).toBeDefined();
        });
      });

      it('should have 5 V2 timing presets', () => {
        expect(V2_TIMING_NAMES).toHaveLength(5);
        V2_TIMING_NAMES.forEach(name => {
          expect(TIMING_PRESETS[name]).toBeDefined();
        });
      });

      it('should have 5 V3 timing presets', () => {
        expect(V3_TIMING_NAMES).toHaveLength(5);
        V3_TIMING_NAMES.forEach(name => {
          expect(TIMING_PRESETS[name]).toBeDefined();
        });
      });
    });
  });

  // ==========================================================================
  // Total Preset Summary
  // ==========================================================================
  describe('Total Preset Summary', () => {
    it('should have 55 total presets across all categories', () => {
      const total =
        Object.keys(CAMERA_PRESETS).length +
        Object.keys(LAYOUT_PRESETS).length +
        Object.keys(TIMING_PRESETS).length;
      expect(total).toBe(55);
    });

    it('should have correct breakdown: 15 camera + 25 layout + 15 timing', () => {
      expect(Object.keys(CAMERA_PRESETS).length).toBe(15);
      expect(Object.keys(LAYOUT_PRESETS).length).toBe(25);
      expect(Object.keys(TIMING_PRESETS).length).toBe(15);
    });

    it('should have correct version totals', () => {
      // MVP: 5 + 10 + 5 = 20
      const mvpTotal = MVP_CAMERA_NAMES.length + MVP_LAYOUT_NAMES.length + MVP_TIMING_NAMES.length;
      expect(mvpTotal).toBe(20);

      // V2: 5 + 8 + 5 = 18
      const v2Total = V2_CAMERA_NAMES.length + V2_LAYOUT_NAMES.length + V2_TIMING_NAMES.length;
      expect(v2Total).toBe(18);

      // V3: 5 + 7 + 5 = 17
      const v3Total = V3_CAMERA_NAMES.length + V3_LAYOUT_NAMES.length + V3_TIMING_NAMES.length;
      expect(v3Total).toBe(17);
    });
  });
});
