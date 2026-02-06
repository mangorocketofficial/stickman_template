/**
 * Direction Module Index Tests
 * Verifies all exports are properly available from index
 */

import { describe, it, expect } from 'vitest';
import {
  // Types
  CameraKeyframe,
  CameraPreset,
  CameraPresetName,
  LayoutSlot,
  LayoutPreset,
  LayoutPresetName,
  TimingEntry,
  TimingPreset,
  TimingPresetName,
  // Camera exports
  CAMERA_PRESETS,
  CAMERA_PRESET_NAMES,
  MVP_CAMERA_PRESET_NAMES,
  V2_CAMERA_PRESET_NAMES,
  getCameraPreset,
  DEFAULT_CAMERA_PRESET,
  // Layout exports
  LAYOUT_PRESETS,
  LAYOUT_PRESET_NAMES,
  MVP_LAYOUT_PRESET_NAMES,
  V2_LAYOUT_PRESET_NAMES,
  getLayoutPreset,
  DEFAULT_LAYOUT_PRESET,
  getSlotByRole,
  // Timing exports
  TIMING_PRESETS,
  TIMING_PRESET_NAMES,
  MVP_TIMING_PRESET_NAMES,
  V2_TIMING_PRESET_NAMES,
  getTimingPreset,
  DEFAULT_TIMING_PRESET,
  getTimingByTarget,
  getTimingEntriesSorted,
} from '../index';

describe('Direction Module Index Exports', () => {
  describe('Camera Exports', () => {
    it('should export CAMERA_PRESETS', () => {
      expect(CAMERA_PRESETS).toBeDefined();
      expect(Object.keys(CAMERA_PRESETS).length).toBe(10);
    });

    it('should export CAMERA_PRESET_NAMES', () => {
      expect(CAMERA_PRESET_NAMES).toBeDefined();
      expect(CAMERA_PRESET_NAMES.length).toBe(10);
    });

    it('should export MVP_CAMERA_PRESET_NAMES', () => {
      expect(MVP_CAMERA_PRESET_NAMES).toBeDefined();
      expect(MVP_CAMERA_PRESET_NAMES.length).toBe(5);
    });

    it('should export V2_CAMERA_PRESET_NAMES', () => {
      expect(V2_CAMERA_PRESET_NAMES).toBeDefined();
      expect(V2_CAMERA_PRESET_NAMES.length).toBe(5);
    });

    it('should export getCameraPreset function', () => {
      expect(typeof getCameraPreset).toBe('function');
    });

    it('should export DEFAULT_CAMERA_PRESET', () => {
      expect(DEFAULT_CAMERA_PRESET).toBeDefined();
      expect(DEFAULT_CAMERA_PRESET.name).toBe('static_full');
    });
  });

  describe('Layout Exports', () => {
    it('should export LAYOUT_PRESETS', () => {
      expect(LAYOUT_PRESETS).toBeDefined();
      expect(Object.keys(LAYOUT_PRESETS).length).toBe(18);
    });

    it('should export LAYOUT_PRESET_NAMES', () => {
      expect(LAYOUT_PRESET_NAMES).toBeDefined();
      expect(LAYOUT_PRESET_NAMES.length).toBe(18);
    });

    it('should export MVP_LAYOUT_PRESET_NAMES', () => {
      expect(MVP_LAYOUT_PRESET_NAMES).toBeDefined();
      expect(MVP_LAYOUT_PRESET_NAMES.length).toBe(10);
    });

    it('should export V2_LAYOUT_PRESET_NAMES', () => {
      expect(V2_LAYOUT_PRESET_NAMES).toBeDefined();
      expect(V2_LAYOUT_PRESET_NAMES.length).toBe(8);
    });

    it('should export getLayoutPreset function', () => {
      expect(typeof getLayoutPreset).toBe('function');
    });

    it('should export DEFAULT_LAYOUT_PRESET', () => {
      expect(DEFAULT_LAYOUT_PRESET).toBeDefined();
      expect(DEFAULT_LAYOUT_PRESET.name).toBe('center_single');
    });

    it('should export getSlotByRole function', () => {
      expect(typeof getSlotByRole).toBe('function');
    });
  });

  describe('Timing Exports', () => {
    it('should export TIMING_PRESETS', () => {
      expect(TIMING_PRESETS).toBeDefined();
      expect(Object.keys(TIMING_PRESETS).length).toBe(10);
    });

    it('should export TIMING_PRESET_NAMES', () => {
      expect(TIMING_PRESET_NAMES).toBeDefined();
      expect(TIMING_PRESET_NAMES.length).toBe(10);
    });

    it('should export MVP_TIMING_PRESET_NAMES', () => {
      expect(MVP_TIMING_PRESET_NAMES).toBeDefined();
      expect(MVP_TIMING_PRESET_NAMES.length).toBe(5);
    });

    it('should export V2_TIMING_PRESET_NAMES', () => {
      expect(V2_TIMING_PRESET_NAMES).toBeDefined();
      expect(V2_TIMING_PRESET_NAMES.length).toBe(5);
    });

    it('should export getTimingPreset function', () => {
      expect(typeof getTimingPreset).toBe('function');
    });

    it('should export DEFAULT_TIMING_PRESET', () => {
      expect(DEFAULT_TIMING_PRESET).toBeDefined();
      expect(DEFAULT_TIMING_PRESET.name).toBe('all_at_once');
    });

    it('should export getTimingByTarget function', () => {
      expect(typeof getTimingByTarget).toBe('function');
    });

    it('should export getTimingEntriesSorted function', () => {
      expect(typeof getTimingEntriesSorted).toBe('function');
    });
  });

  describe('Total Preset Counts Summary', () => {
    it('should have 10 Camera presets (5 MVP + 5 V2)', () => {
      const total = MVP_CAMERA_PRESET_NAMES.length + V2_CAMERA_PRESET_NAMES.length;
      expect(total).toBe(10);
      expect(CAMERA_PRESET_NAMES.length).toBe(total);
    });

    it('should have 18 Layout presets (10 MVP + 8 V2)', () => {
      const total = MVP_LAYOUT_PRESET_NAMES.length + V2_LAYOUT_PRESET_NAMES.length;
      expect(total).toBe(18);
      expect(LAYOUT_PRESET_NAMES.length).toBe(total);
    });

    it('should have 10 Timing presets (5 MVP + 5 V2)', () => {
      const total = MVP_TIMING_PRESET_NAMES.length + V2_TIMING_PRESET_NAMES.length;
      expect(total).toBe(10);
      expect(TIMING_PRESET_NAMES.length).toBe(total);
    });

    it('should have 38 total presets', () => {
      const total =
        CAMERA_PRESET_NAMES.length +
        LAYOUT_PRESET_NAMES.length +
        TIMING_PRESET_NAMES.length;
      expect(total).toBe(38);
    });
  });
});
