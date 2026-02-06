/**
 * Layout Presets Tests
 */

import { describe, it, expect } from 'vitest';
import {
  LAYOUT_PRESETS,
  LAYOUT_PRESET_NAMES,
  MVP_LAYOUT_PRESET_NAMES,
  V2_LAYOUT_PRESET_NAMES,
  getLayoutPreset,
  DEFAULT_LAYOUT_PRESET,
  getSlotByRole,
} from '../layout';
import { LayoutPresetName } from '../types';

describe('Layout Presets', () => {
  describe('Preset Counts', () => {
    it('should have exactly 18 layout presets', () => {
      expect(Object.keys(LAYOUT_PRESETS).length).toBe(18);
    });

    it('should have exactly 18 preset names in array', () => {
      expect(LAYOUT_PRESET_NAMES.length).toBe(18);
    });

    it('should have 10 MVP presets', () => {
      expect(MVP_LAYOUT_PRESET_NAMES.length).toBe(10);
    });

    it('should have 8 V2 presets', () => {
      expect(V2_LAYOUT_PRESET_NAMES.length).toBe(8);
    });
  });

  describe('MVP Presets (10)', () => {
    const mvpPresets: LayoutPresetName[] = [
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
    ];

    mvpPresets.forEach((presetName) => {
      it(`should have MVP preset: ${presetName}`, () => {
        expect(LAYOUT_PRESETS[presetName]).toBeDefined();
        expect(LAYOUT_PRESETS[presetName].name).toBe(presetName);
      });
    });
  });

  describe('V2 Presets (8)', () => {
    const v2Presets: LayoutPresetName[] = [
      'center_hero',
      'triple_horizontal',
      'triple_top_bottom',
      'grid_2x2',
      'grid_3x1',
      'overlay_spotlight',
      'stickman_center_text_sides',
      'icon_grid',
    ];

    v2Presets.forEach((presetName) => {
      it(`should have V2 preset: ${presetName}`, () => {
        expect(LAYOUT_PRESETS[presetName]).toBeDefined();
        expect(LAYOUT_PRESETS[presetName].name).toBe(presetName);
      });
    });
  });

  describe('Preset Structure', () => {
    Object.entries(LAYOUT_PRESETS).forEach(([name, preset]) => {
      describe(`Preset: ${name}`, () => {
        it('should have a name property', () => {
          expect(preset.name).toBe(name);
        });

        it('should have at least 1 slot', () => {
          expect(preset.slots.length).toBeGreaterThanOrEqual(1);
        });

        preset.slots.forEach((slot, index) => {
          it(`slot ${index} should have role string`, () => {
            expect(typeof slot.role).toBe('string');
            expect(slot.role.length).toBeGreaterThan(0);
          });

          it(`slot ${index} should have valid position`, () => {
            expect(slot.position).toBeDefined();
            expect(typeof slot.position.x).toBe('number');
            expect(typeof slot.position.y).toBe('number');
            // Canvas is 1920x1080
            expect(slot.position.x).toBeGreaterThanOrEqual(0);
            expect(slot.position.x).toBeLessThanOrEqual(1920);
            expect(slot.position.y).toBeGreaterThanOrEqual(0);
            expect(slot.position.y).toBeLessThanOrEqual(1080);
          });

          it(`slot ${index} should have valid scale if defined`, () => {
            if (slot.scale !== undefined) {
              expect(slot.scale).toBeGreaterThan(0);
              expect(slot.scale).toBeLessThanOrEqual(3);
            }
          });

          it(`slot ${index} should have valid maxWidth if defined`, () => {
            if (slot.maxWidth !== undefined) {
              expect(slot.maxWidth).toBeGreaterThan(0);
              expect(slot.maxWidth).toBeLessThanOrEqual(1920);
            }
          });

          it(`slot ${index} should have valid anchor if defined`, () => {
            if (slot.anchor !== undefined) {
              expect(['center', 'left', 'right']).toContain(slot.anchor);
            }
          });
        });
      });
    });
  });

  describe('getLayoutPreset', () => {
    it('should return correct preset by name', () => {
      expect(getLayoutPreset('center_single').name).toBe('center_single');
      expect(getLayoutPreset('icon_grid').name).toBe('icon_grid');
    });

    it('should return center_single for unknown preset', () => {
      expect(getLayoutPreset('unknown_preset').name).toBe('center_single');
    });

    it('should return center_single for empty string', () => {
      expect(getLayoutPreset('').name).toBe('center_single');
    });
  });

  describe('DEFAULT_LAYOUT_PRESET', () => {
    it('should be center_single', () => {
      expect(DEFAULT_LAYOUT_PRESET.name).toBe('center_single');
    });
  });

  describe('getSlotByRole', () => {
    it('should return slot for existing role', () => {
      const layout = LAYOUT_PRESETS.split_left_stickman;
      const slot = getSlotByRole(layout, 'stickman');
      expect(slot).toBeDefined();
      expect(slot?.role).toBe('stickman');
    });

    it('should return undefined for non-existing role', () => {
      const layout = LAYOUT_PRESETS.center_single;
      const slot = getSlotByRole(layout, 'nonexistent');
      expect(slot).toBeUndefined();
    });
  });

  describe('Specific Layout Slot Counts', () => {
    it('center_single should have 1 slot', () => {
      expect(LAYOUT_PRESETS.center_single.slots.length).toBe(1);
    });

    it('split_left_stickman should have 2 slots', () => {
      expect(LAYOUT_PRESETS.split_left_stickman.slots.length).toBe(2);
    });

    it('triple_stickman_text_counter should have 3 slots', () => {
      expect(LAYOUT_PRESETS.triple_stickman_text_counter.slots.length).toBe(3);
    });

    it('grid_2x2 should have 4 slots', () => {
      expect(LAYOUT_PRESETS.grid_2x2.slots.length).toBe(4);
    });

    it('icon_grid should have 6 slots', () => {
      expect(LAYOUT_PRESETS.icon_grid.slots.length).toBe(6);
    });
  });
});
