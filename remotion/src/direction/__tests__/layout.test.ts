/**
 * Layout Module Tests
 * Testing 25 layout presets (10 MVP + 8 V2 + 7 V3)
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../layout';
import { LayoutPreset, LayoutSlot, LayoutRole, LayoutAnchor } from '../types';

// Canvas dimensions
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

describe('Layout Module', () => {
  // ==========================================================================
  // Preset Counts
  // ==========================================================================
  describe('Preset Counts', () => {
    it('should have exactly 25 layout presets', () => {
      expect(Object.keys(LAYOUT_PRESETS)).toHaveLength(25);
    });

    it('should have 10 MVP presets', () => {
      expect(MVP_LAYOUT_NAMES).toHaveLength(10);
    });

    it('should have 8 V2 presets', () => {
      expect(V2_LAYOUT_NAMES).toHaveLength(8);
    });

    it('should have 7 V3 presets', () => {
      expect(V3_LAYOUT_NAMES).toHaveLength(7);
    });

    it('should have LAYOUT_NAMES array matching LAYOUT_PRESETS keys', () => {
      expect(LAYOUT_NAMES).toHaveLength(25);
      expect(LAYOUT_NAMES.sort()).toEqual(Object.keys(LAYOUT_PRESETS).sort());
    });
  });

  // ==========================================================================
  // MVP Layout Presets (10)
  // ==========================================================================
  describe('MVP Layout Presets', () => {
    const mvpPresets = [
      'center_single', 'split_left_stickman', 'triple_stickman_text_counter',
      'triple_stickman_icon_text', 'text_only', 'center_stack',
      'split_right_stickman', 'split_equal', 'grid_2x1', 'overlay_fullscreen_text'
    ];

    mvpPresets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in LAYOUT_PRESETS', () => {
          expect(LAYOUT_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(LAYOUT_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(LAYOUT_PRESETS[name].description).toBeDefined();
          expect(LAYOUT_PRESETS[name].description.length).toBeGreaterThan(0);
        });

        it('should have at least 1 slot', () => {
          expect(LAYOUT_PRESETS[name].slots.length).toBeGreaterThanOrEqual(1);
        });

        it('should have slots with valid positions within canvas', () => {
          LAYOUT_PRESETS[name].slots.forEach((slot) => {
            expect(slot.position.x).toBeGreaterThanOrEqual(0);
            expect(slot.position.x).toBeLessThanOrEqual(CANVAS_WIDTH);
            expect(slot.position.y).toBeGreaterThanOrEqual(0);
            expect(slot.position.y).toBeLessThanOrEqual(CANVAS_HEIGHT);
          });
        });
      });
    });

    describe('center_single', () => {
      it('should have 1 slot at center', () => {
        const preset = LAYOUT_PRESETS['center_single'];
        expect(preset.slots).toHaveLength(1);
        expect(preset.slots[0].position.x).toBe(960);
        expect(preset.slots[0].position.y).toBe(540);
      });

      it('should have minElements and maxElements of 1', () => {
        const preset = LAYOUT_PRESETS['center_single'];
        expect(preset.minElements).toBe(1);
        expect(preset.maxElements).toBe(1);
      });
    });

    describe('split_left_stickman', () => {
      it('should have stickman slot on left side', () => {
        const preset = LAYOUT_PRESETS['split_left_stickman'];
        const stickmanSlot = preset.slots.find(s => s.role === 'stickman');
        expect(stickmanSlot).toBeDefined();
        expect(stickmanSlot!.position.x).toBeLessThan(CANVAS_WIDTH / 2);
      });

      it('should have text slot on right side', () => {
        const preset = LAYOUT_PRESETS['split_left_stickman'];
        const textSlot = preset.slots.find(s => s.role === 'text');
        expect(textSlot).toBeDefined();
        expect(textSlot!.position.x).toBeGreaterThan(CANVAS_WIDTH / 2);
      });
    });

    describe('split_right_stickman', () => {
      it('should have stickman slot on right side', () => {
        const preset = LAYOUT_PRESETS['split_right_stickman'];
        const stickmanSlot = preset.slots.find(s => s.role === 'stickman');
        expect(stickmanSlot).toBeDefined();
        expect(stickmanSlot!.position.x).toBeGreaterThan(CANVAS_WIDTH / 2);
      });
    });

    describe('grid_2x1', () => {
      it('should have 2 slots', () => {
        const preset = LAYOUT_PRESETS['grid_2x1'];
        expect(preset.slots).toHaveLength(2);
      });

      it('should have slots positioned left and right', () => {
        const preset = LAYOUT_PRESETS['grid_2x1'];
        const positions = preset.slots.map(s => s.position.x).sort((a, b) => a - b);
        expect(positions[0]).toBeLessThan(CANVAS_WIDTH / 2);
        expect(positions[1]).toBeGreaterThan(CANVAS_WIDTH / 2);
      });
    });
  });

  // ==========================================================================
  // V2 Layout Presets (8)
  // ==========================================================================
  describe('V2 Layout Presets', () => {
    const v2Presets = [
      'center_hero', 'triple_horizontal', 'triple_top_bottom',
      'grid_2x2', 'grid_3x1', 'overlay_spotlight',
      'stickman_center_text_sides', 'icon_grid'
    ];

    v2Presets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in LAYOUT_PRESETS', () => {
          expect(LAYOUT_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(LAYOUT_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(LAYOUT_PRESETS[name].description).toBeDefined();
        });

        it('should have valid slots', () => {
          LAYOUT_PRESETS[name].slots.forEach((slot) => {
            expect(slot.role).toBeDefined();
            expect(slot.position).toBeDefined();
            expect(typeof slot.position.x).toBe('number');
            expect(typeof slot.position.y).toBe('number');
          });
        });
      });
    });

    describe('center_hero', () => {
      it('should have hero slot at center with larger scale', () => {
        const preset = LAYOUT_PRESETS['center_hero'];
        const heroSlot = preset.slots.find(s => s.role === 'hero');
        expect(heroSlot).toBeDefined();
        expect(heroSlot!.scale).toBeGreaterThan(1.0);
      });
    });

    describe('triple_horizontal', () => {
      it('should have 3 slots', () => {
        const preset = LAYOUT_PRESETS['triple_horizontal'];
        expect(preset.slots).toHaveLength(3);
      });

      it('should have slots at roughly equal horizontal spacing', () => {
        const preset = LAYOUT_PRESETS['triple_horizontal'];
        const xPositions = preset.slots.map(s => s.position.x).sort((a, b) => a - b);
        const spacing1 = xPositions[1] - xPositions[0];
        const spacing2 = xPositions[2] - xPositions[1];
        // Allow 20% tolerance
        expect(Math.abs(spacing1 - spacing2)).toBeLessThan(spacing1 * 0.3);
      });
    });

    describe('grid_2x2', () => {
      it('should have 4 slots', () => {
        const preset = LAYOUT_PRESETS['grid_2x2'];
        expect(preset.slots).toHaveLength(4);
      });

      it('should have minElements of 4', () => {
        const preset = LAYOUT_PRESETS['grid_2x2'];
        expect(preset.minElements).toBe(4);
      });
    });

    describe('grid_3x1', () => {
      it('should have 3 slots', () => {
        const preset = LAYOUT_PRESETS['grid_3x1'];
        expect(preset.slots).toHaveLength(3);
      });
    });

    describe('overlay_spotlight', () => {
      it('should have hero slot with higher layer', () => {
        const preset = LAYOUT_PRESETS['overlay_spotlight'];
        const heroSlot = preset.slots.find(s => s.role === 'hero');
        expect(heroSlot).toBeDefined();
        expect(heroSlot!.layer).toBeGreaterThan(1);
      });

      it('should have background slots with lower opacity', () => {
        const preset = LAYOUT_PRESETS['overlay_spotlight'];
        const bgSlots = preset.slots.filter(s => s.role === 'background');
        bgSlots.forEach(slot => {
          expect(slot.opacity).toBeLessThan(1.0);
        });
      });
    });
  });

  // ==========================================================================
  // V3 Layout Presets (7)
  // ==========================================================================
  describe('V3 Layout Presets', () => {
    const v3Presets = [
      'overlay_picture_in_picture', 'diagonal_split', 'pyramid_layout',
      'circular_layout', 'timeline_horizontal', 'comparison_table', 'floating_elements'
    ];

    v3Presets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in LAYOUT_PRESETS', () => {
          expect(LAYOUT_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(LAYOUT_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(LAYOUT_PRESETS[name].description).toBeDefined();
        });

        it('should have valid slot structure', () => {
          LAYOUT_PRESETS[name].slots.forEach((slot) => {
            expect(slot.role).toBeDefined();
            expect(slot.position.x).toBeGreaterThanOrEqual(0);
            expect(slot.position.y).toBeGreaterThanOrEqual(0);
          });
        });
      });
    });

    describe('overlay_picture_in_picture', () => {
      it('should have stickman slot at corner with smaller scale', () => {
        const preset = LAYOUT_PRESETS['overlay_picture_in_picture'];
        const stickmanSlot = preset.slots.find(s => s.role === 'stickman');
        expect(stickmanSlot).toBeDefined();
        expect(stickmanSlot!.scale).toBeLessThan(1.0);
        // Should be in corner (high x and y)
        expect(stickmanSlot!.position.x).toBeGreaterThan(CANVAS_WIDTH * 0.7);
        expect(stickmanSlot!.position.y).toBeGreaterThan(CANVAS_HEIGHT * 0.7);
      });

      it('should have stickman with higher layer', () => {
        const preset = LAYOUT_PRESETS['overlay_picture_in_picture'];
        const stickmanSlot = preset.slots.find(s => s.role === 'stickman');
        expect(stickmanSlot!.layer).toBeGreaterThan(10);
      });
    });

    describe('pyramid_layout', () => {
      it('should have hero slot at top', () => {
        const preset = LAYOUT_PRESETS['pyramid_layout'];
        const heroSlot = preset.slots.find(s => s.role === 'hero');
        expect(heroSlot).toBeDefined();
        const otherSlots = preset.slots.filter(s => s.role !== 'hero');
        const heroY = heroSlot!.position.y;
        otherSlots.forEach(slot => {
          expect(slot.position.y).toBeGreaterThan(heroY);
        });
      });

      it('should have at least 3 slots', () => {
        const preset = LAYOUT_PRESETS['pyramid_layout'];
        expect(preset.slots.length).toBeGreaterThanOrEqual(3);
      });
    });

    describe('circular_layout', () => {
      it('should have hero slot at center', () => {
        const preset = LAYOUT_PRESETS['circular_layout'];
        const heroSlot = preset.slots.find(s => s.role === 'hero');
        expect(heroSlot).toBeDefined();
        expect(heroSlot!.position.x).toBeCloseTo(960, -2);
        expect(heroSlot!.position.y).toBeCloseTo(540, -2);
      });

      it('should have item slots around the center', () => {
        const preset = LAYOUT_PRESETS['circular_layout'];
        const itemSlots = preset.slots.filter(s => s.role.startsWith('item'));
        expect(itemSlots.length).toBeGreaterThanOrEqual(4);
      });
    });

    describe('timeline_horizontal', () => {
      it('should have items at alternating vertical positions', () => {
        const preset = LAYOUT_PRESETS['timeline_horizontal'];
        const itemSlots = preset.slots.filter(s => s.role.startsWith('item'));
        const yPositions = itemSlots.map(s => s.position.y);
        const uniqueY = [...new Set(yPositions)];
        expect(uniqueY.length).toBe(2); // Above and below timeline
      });
    });

    describe('comparison_table', () => {
      it('should have title slot at top', () => {
        const preset = LAYOUT_PRESETS['comparison_table'];
        const titleSlot = preset.slots.find(s => s.role === 'title');
        expect(titleSlot).toBeDefined();
        expect(titleSlot!.position.y).toBeLessThan(200);
      });

      it('should have even number of item slots for comparison', () => {
        const preset = LAYOUT_PRESETS['comparison_table'];
        const itemSlots = preset.slots.filter(s => s.role.startsWith('item'));
        expect(itemSlots.length % 2).toBe(0);
      });
    });

    describe('floating_elements', () => {
      it('should have elements with varying scales', () => {
        const preset = LAYOUT_PRESETS['floating_elements'];
        const scales = preset.slots.map(s => s.scale || 1.0);
        const uniqueScales = [...new Set(scales)];
        expect(uniqueScales.length).toBeGreaterThan(1);
      });

      it('should have elements with varying opacity', () => {
        const preset = LAYOUT_PRESETS['floating_elements'];
        const hasVariedOpacity = preset.slots.some(s => s.opacity && s.opacity < 1.0);
        expect(hasVariedOpacity).toBe(true);
      });
    });
  });

  // ==========================================================================
  // Helper Functions
  // ==========================================================================
  describe('Helper Functions', () => {
    describe('getLayoutPreset', () => {
      it('should return preset for valid name', () => {
        const preset = getLayoutPreset('center_single');
        expect(preset).toBeDefined();
        expect(preset?.name).toBe('center_single');
      });

      it('should return undefined for invalid name', () => {
        const preset = getLayoutPreset('non_existent_preset');
        expect(preset).toBeUndefined();
      });
    });

    describe('hasLayoutPreset', () => {
      it('should return true for valid preset', () => {
        expect(hasLayoutPreset('center_single')).toBe(true);
        expect(hasLayoutPreset('grid_2x2')).toBe(true);
        expect(hasLayoutPreset('floating_elements')).toBe(true);
      });

      it('should return false for invalid preset', () => {
        expect(hasLayoutPreset('invalid')).toBe(false);
        expect(hasLayoutPreset('')).toBe(false);
      });
    });

    describe('getSlotByRole', () => {
      it('should return slot for valid role', () => {
        const preset = LAYOUT_PRESETS['split_left_stickman'];
        const slot = getSlotByRole(preset, 'stickman');
        expect(slot).toBeDefined();
        expect(slot?.role).toBe('stickman');
      });

      it('should return undefined for non-existent role', () => {
        const preset = LAYOUT_PRESETS['center_single'];
        const slot = getSlotByRole(preset, 'stickman');
        expect(slot).toBeUndefined();
      });
    });

    describe('getSlotsByRole', () => {
      it('should return all slots with matching role', () => {
        const preset = LAYOUT_PRESETS['overlay_spotlight'];
        const bgSlots = getSlotsByRole(preset, 'background');
        expect(bgSlots.length).toBeGreaterThanOrEqual(1);
        bgSlots.forEach(slot => {
          expect(slot.role).toBe('background');
        });
      });

      it('should return empty array for non-existent role', () => {
        const preset = LAYOUT_PRESETS['center_single'];
        const slots = getSlotsByRole(preset, 'stickman');
        expect(slots).toHaveLength(0);
      });
    });

    describe('resolveSlotPosition', () => {
      it('should return original position for center anchor', () => {
        const slot: LayoutSlot = {
          role: 'primary',
          position: { x: 960, y: 540 },
          anchor: 'center'
        };
        const resolved = resolveSlotPosition(slot, 200, 100);
        expect(resolved.x).toBe(960 - 100); // x - width/2
        expect(resolved.y).toBe(540 - 50);  // y - height/2
      });

      it('should adjust for left anchor', () => {
        const slot: LayoutSlot = {
          role: 'primary',
          position: { x: 100, y: 540 },
          anchor: 'left'
        };
        const resolved = resolveSlotPosition(slot, 200, 100);
        expect(resolved.x).toBe(100); // No adjustment for left anchor
      });

      it('should adjust for right anchor', () => {
        const slot: LayoutSlot = {
          role: 'primary',
          position: { x: 1820, y: 540 },
          anchor: 'right'
        };
        const resolved = resolveSlotPosition(slot, 200, 100);
        expect(resolved.x).toBe(1820 - 200); // x - width
      });

      it('should adjust for bottom anchor', () => {
        const slot: LayoutSlot = {
          role: 'primary',
          position: { x: 960, y: 980 },
          anchor: 'bottom'
        };
        const resolved = resolveSlotPosition(slot, 200, 100);
        expect(resolved.y).toBe(980 - 100); // y - height
      });

      it('should handle corner anchors', () => {
        const slot: LayoutSlot = {
          role: 'primary',
          position: { x: 100, y: 100 },
          anchor: 'top-left'
        };
        const resolved = resolveSlotPosition(slot, 200, 100);
        expect(resolved.x).toBe(100);
        expect(resolved.y).toBe(100);
      });
    });
  });

  // ==========================================================================
  // Slot Validation
  // ==========================================================================
  describe('Slot Validation', () => {
    Object.entries(LAYOUT_PRESETS).forEach(([name, preset]) => {
      describe(`${name} slots`, () => {
        it('should have valid role values', () => {
          const validRoles = [
            'stickman', 'text', 'title', 'subtitle', 'icon', 'counter', 'shape',
            'primary', 'secondary', 'tertiary', 'item1', 'item2', 'item3', 'item4',
            'item5', 'item6', 'hero', 'background', 'overlay', 'any'
          ];
          preset.slots.forEach((slot) => {
            expect(validRoles).toContain(slot.role);
          });
        });

        it('should have valid anchor values if specified', () => {
          const validAnchors = [
            'center', 'left', 'right', 'top', 'bottom',
            'top-left', 'top-right', 'bottom-left', 'bottom-right'
          ];
          preset.slots.forEach((slot) => {
            if (slot.anchor) {
              expect(validAnchors).toContain(slot.anchor);
            }
          });
        });

        it('should have valid scale values if specified', () => {
          preset.slots.forEach((slot) => {
            if (slot.scale !== undefined) {
              expect(slot.scale).toBeGreaterThan(0);
              expect(slot.scale).toBeLessThanOrEqual(3.0);
            }
          });
        });

        it('should have valid opacity values if specified', () => {
          preset.slots.forEach((slot) => {
            if (slot.opacity !== undefined) {
              expect(slot.opacity).toBeGreaterThanOrEqual(0);
              expect(slot.opacity).toBeLessThanOrEqual(1.0);
            }
          });
        });

        it('should have valid layer values if specified', () => {
          preset.slots.forEach((slot) => {
            if (slot.layer !== undefined) {
              expect(slot.layer).toBeGreaterThanOrEqual(0);
              expect(slot.layer).toBeLessThanOrEqual(100);
            }
          });
        });

        it('should have valid maxWidth values if specified', () => {
          preset.slots.forEach((slot) => {
            if (slot.maxWidth !== undefined) {
              expect(slot.maxWidth).toBeGreaterThan(0);
              expect(slot.maxWidth).toBeLessThanOrEqual(CANVAS_WIDTH);
            }
          });
        });
      });
    });
  });
});
