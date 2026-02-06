/**
 * Direction Module Tests
 * Tests for Camera, Layout, and Timing presets
 */

import {
  // Camera
  CAMERA_PRESETS,
  CAMERA_NAMES,
  getCameraPreset,
  hasCameraPreset,
  calculateCameraState,
  MVP_CAMERA_NAMES,
  V2_CAMERA_NAMES,
  V3_CAMERA_NAMES,
  // Layout
  LAYOUT_PRESETS,
  LAYOUT_NAMES,
  getLayoutPreset,
  hasLayoutPreset,
  getSlotByRole,
  resolveSlotPosition,
  MVP_LAYOUT_NAMES,
  V2_LAYOUT_NAMES,
  V3_LAYOUT_NAMES,
  // Timing
  TIMING_PRESETS,
  TIMING_NAMES,
  getTimingPreset,
  hasTimingPreset,
  getTimingForTarget,
  calculateTotalDuration,
  MVP_TIMING_NAMES,
  V2_TIMING_NAMES,
  V3_TIMING_NAMES,
  // Index utilities
  getPresetCounts,
  validateDirectionConfig,
  // Types
  CameraPreset,
  LayoutPreset,
  TimingPreset,
} from '../direction';

// ============================================================================
// CAMERA PRESET TESTS
// ============================================================================

describe('Camera Presets', () => {
  describe('Preset Counts', () => {
    it('should have exactly 15 camera presets', () => {
      expect(Object.keys(CAMERA_PRESETS)).toHaveLength(15);
      expect(CAMERA_NAMES).toHaveLength(15);
    });

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

  describe('Required Camera Presets', () => {
    const expectedCameraPresets = [
      // MVP 5
      'static_full',
      'static_closeup',
      'static_wide',
      'zoom_in_slow',
      'zoom_in_fast',
      // V2 5
      'zoom_out_reveal',
      'zoom_pulse',
      'pan_left_to_right',
      'pan_right_to_left',
      'dolly_in',
      // V3 5
      'pan_follow_stickman',
      'reveal_pan_zoom',
      'shake',
      'zoom_breathe',
      'cinematic_sweep',
    ];

    expectedCameraPresets.forEach(name => {
      it(`should have camera preset: ${name}`, () => {
        expect(hasCameraPreset(name)).toBe(true);
        expect(getCameraPreset(name)).toBeDefined();
      });
    });
  });

  describe('Camera Preset Structure', () => {
    Object.entries(CAMERA_PRESETS).forEach(([name, preset]) => {
      describe(`${name}`, () => {
        it('should have required properties', () => {
          expect(preset.name).toBe(name);
          expect(preset.description).toBeDefined();
          expect(preset.keyframes).toBeDefined();
          expect(preset.keyframes.length).toBeGreaterThanOrEqual(2);
        });

        it('should have valid keyframes', () => {
          preset.keyframes.forEach(kf => {
            expect(kf.atPercent).toBeGreaterThanOrEqual(0);
            expect(kf.atPercent).toBeLessThanOrEqual(100);
            expect(typeof kf.zoom).toBe('number');
            expect(typeof kf.offsetX).toBe('number');
            expect(typeof kf.offsetY).toBe('number');
            expect(kf.easing).toBeDefined();
          });
        });

        it('should start at 0% and end at 100%', () => {
          expect(preset.keyframes[0].atPercent).toBe(0);
          expect(preset.keyframes[preset.keyframes.length - 1].atPercent).toBe(100);
        });
      });
    });
  });

  describe('calculateCameraState', () => {
    it('should return start state at progress 0', () => {
      const preset = getCameraPreset('zoom_in_slow')!;
      const state = calculateCameraState(preset, 0);
      expect(state.zoom).toBe(1.0);
      expect(state.offsetX).toBe(0);
      expect(state.offsetY).toBe(0);
    });

    it('should return end state at progress 1', () => {
      const preset = getCameraPreset('zoom_in_slow')!;
      const state = calculateCameraState(preset, 1);
      expect(state.zoom).toBeCloseTo(1.2, 2);
    });

    it('should interpolate between keyframes', () => {
      const preset = getCameraPreset('zoom_in_slow')!;
      const state = calculateCameraState(preset, 0.5);
      expect(state.zoom).toBeGreaterThan(1.0);
      expect(state.zoom).toBeLessThan(1.2);
    });
  });
});

// ============================================================================
// LAYOUT PRESET TESTS
// ============================================================================

describe('Layout Presets', () => {
  describe('Preset Counts', () => {
    it('should have exactly 25 layout presets', () => {
      expect(Object.keys(LAYOUT_PRESETS)).toHaveLength(25);
      expect(LAYOUT_NAMES).toHaveLength(25);
    });

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

  describe('Required Layout Presets', () => {
    const expectedLayoutPresets = [
      // MVP 10
      'center_single',
      'split_left_stickman',
      'triple_stickman_text_counter',
      'triple_stickman_icon_text',
      'text_only',
      'center_stack',
      'split_right_stickman',
      'split_equal',
      'grid_2x1',
      'overlay_fullscreen_text',
      // V2 8
      'center_hero',
      'triple_horizontal',
      'triple_top_bottom',
      'grid_2x2',
      'grid_3x1',
      'overlay_spotlight',
      'stickman_center_text_sides',
      'icon_grid',
      // V3 7
      'overlay_picture_in_picture',
      'diagonal_split',
      'pyramid_layout',
      'circular_layout',
      'timeline_horizontal',
      'comparison_table',
      'floating_elements',
    ];

    expectedLayoutPresets.forEach(name => {
      it(`should have layout preset: ${name}`, () => {
        expect(hasLayoutPreset(name)).toBe(true);
        expect(getLayoutPreset(name)).toBeDefined();
      });
    });
  });

  describe('Layout Preset Structure', () => {
    Object.entries(LAYOUT_PRESETS).forEach(([name, preset]) => {
      describe(`${name}`, () => {
        it('should have required properties', () => {
          expect(preset.name).toBe(name);
          expect(preset.description).toBeDefined();
          expect(preset.slots).toBeDefined();
          expect(preset.slots.length).toBeGreaterThanOrEqual(1);
        });

        it('should have valid slots', () => {
          preset.slots.forEach(slot => {
            expect(slot.role).toBeDefined();
            expect(slot.position).toBeDefined();
            expect(slot.position.x).toBeGreaterThanOrEqual(0);
            expect(slot.position.x).toBeLessThanOrEqual(1920);
            expect(slot.position.y).toBeGreaterThanOrEqual(0);
            expect(slot.position.y).toBeLessThanOrEqual(1080);
          });
        });
      });
    });
  });

  describe('getSlotByRole', () => {
    it('should find slot by role', () => {
      const preset = getLayoutPreset('split_left_stickman')!;
      const slot = getSlotByRole(preset, 'stickman');
      expect(slot).toBeDefined();
      expect(slot?.role).toBe('stickman');
    });

    it('should return undefined for missing role', () => {
      const preset = getLayoutPreset('text_only')!;
      const slot = getSlotByRole(preset, 'stickman');
      expect(slot).toBeUndefined();
    });
  });

  describe('resolveSlotPosition', () => {
    it('should resolve center anchor correctly', () => {
      const slot = {
        role: 'primary' as const,
        position: { x: 960, y: 540 },
        anchor: 'center' as const,
      };
      const pos = resolveSlotPosition(slot, 200, 100);
      expect(pos.x).toBe(860); // 960 - 100
      expect(pos.y).toBe(490); // 540 - 50
    });

    it('should resolve left anchor correctly', () => {
      const slot = {
        role: 'primary' as const,
        position: { x: 100, y: 100 },
        anchor: 'left' as const,
      };
      const pos = resolveSlotPosition(slot, 200, 100);
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(100);
    });
  });
});

// ============================================================================
// TIMING PRESET TESTS
// ============================================================================

describe('Timing Presets', () => {
  describe('Preset Counts', () => {
    it('should have exactly 15 timing presets', () => {
      expect(Object.keys(TIMING_PRESETS)).toHaveLength(15);
      expect(TIMING_NAMES).toHaveLength(15);
    });

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

  describe('Required Timing Presets', () => {
    const expectedTimingPresets = [
      // MVP 5
      'all_at_once',
      'all_at_once_stagger',
      'stickman_first',
      'text_first',
      'reveal_climax',
      // V2 5
      'left_to_right',
      'top_to_bottom',
      'counter_focus',
      'icon_burst',
      'carry_stickman',
      // V3 5
      'morph_text',
      'wipe_replace',
      'bounce_sequence',
      'spiral_in',
      'typewriter_reveal',
    ];

    expectedTimingPresets.forEach(name => {
      it(`should have timing preset: ${name}`, () => {
        expect(hasTimingPreset(name)).toBe(true);
        expect(getTimingPreset(name)).toBeDefined();
      });
    });
  });

  describe('Timing Preset Structure', () => {
    Object.entries(TIMING_PRESETS).forEach(([name, preset]) => {
      describe(`${name}`, () => {
        it('should have required properties', () => {
          expect(preset.name).toBe(name);
          expect(preset.description).toBeDefined();
          expect(preset.entries).toBeDefined();
          expect(preset.entries.length).toBeGreaterThanOrEqual(1);
        });

        it('should have valid entries', () => {
          preset.entries.forEach(entry => {
            expect(entry.target).toBeDefined();
            expect(entry.delayMs).toBeGreaterThanOrEqual(0);
            expect(entry.enterAnimation).toBeDefined();
            expect(entry.enterDurationMs).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('getTimingForTarget', () => {
    it('should find timing for specific target', () => {
      const preset = getTimingPreset('stickman_first')!;
      const entry = getTimingForTarget(preset, 'stickman');
      expect(entry).toBeDefined();
      expect(entry?.target).toBe('stickman');
    });

    it('should find timing for "all" target', () => {
      const preset = getTimingPreset('all_at_once')!;
      const entry = getTimingForTarget(preset, 'stickman');
      expect(entry).toBeDefined();
      expect(entry?.target).toBe('all');
    });
  });

  describe('calculateTotalDuration', () => {
    it('should calculate total duration correctly', () => {
      const preset = getTimingPreset('all_at_once')!;
      const duration = calculateTotalDuration(preset);
      expect(duration).toBe(400); // 0 delay + 400ms enter
    });

    it('should account for staggered animations', () => {
      const preset = getTimingPreset('stickman_first')!;
      const duration = calculateTotalDuration(preset);
      expect(duration).toBeGreaterThan(500); // Multiple staggered entries
    });
  });
});

// ============================================================================
// INDEX UTILITIES TESTS
// ============================================================================

describe('Direction Index Utilities', () => {
  describe('getPresetCounts', () => {
    it('should return correct counts', () => {
      const counts = getPresetCounts();
      expect(counts.camera).toBe(15);
      expect(counts.layout).toBe(25);
      expect(counts.timing).toBe(15);
      expect(counts.total).toBe(55);
    });
  });

  describe('validateDirectionConfig', () => {
    it('should validate correct config', () => {
      const result = validateDirectionConfig({
        camera: 'static_full',
        layout: 'center_single',
        timing: 'all_at_once',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid camera preset', () => {
      const result = validateDirectionConfig({
        camera: 'invalid_camera',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unknown camera preset: invalid_camera');
    });

    it('should detect invalid layout preset', () => {
      const result = validateDirectionConfig({
        layout: 'invalid_layout',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unknown layout preset: invalid_layout');
    });

    it('should detect invalid timing preset', () => {
      const result = validateDirectionConfig({
        timing: 'invalid_timing',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unknown timing preset: invalid_timing');
    });

    it('should allow empty config', () => {
      const result = validateDirectionConfig({});
      expect(result.valid).toBe(true);
    });
  });
});

// ============================================================================
// SUMMARY TEST
// ============================================================================

describe('Direction Module Summary', () => {
  it('should have all required presets (55 total)', () => {
    const counts = getPresetCounts();

    console.log('\n=== Direction Module Preset Summary ===');
    console.log(`Camera Presets: ${counts.camera}`);
    console.log(`Layout Presets: ${counts.layout}`);
    console.log(`Timing Presets: ${counts.timing}`);
    console.log(`Total Presets:  ${counts.total}`);
    console.log('========================================\n');

    expect(counts.camera).toBe(15);
    expect(counts.layout).toBe(25);
    expect(counts.timing).toBe(15);
    expect(counts.total).toBe(55);
  });
});
