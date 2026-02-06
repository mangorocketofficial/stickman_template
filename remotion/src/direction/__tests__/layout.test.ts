import { describe, it, expect } from 'vitest';
import {
  LAYOUT_PRESETS,
  LAYOUT_PRESET_NAMES,
  LAYOUT_PRESETS_MAP,
  getLayoutPreset,
  getSlotByRole,
  getSlotsByLayer,
  CENTER_SINGLE,
  SPLIT_LEFT_STICKMAN,
  TRIPLE_STICKMAN_TEXT_COUNTER,
  TRIPLE_STICKMAN_ICON_TEXT,
  TEXT_ONLY,
  CENTER_STACK,
  SPLIT_RIGHT_STICKMAN,
  SPLIT_EQUAL,
  GRID_2X1,
  OVERLAY_FULLSCREEN_TEXT,
} from '../layout';
import { LayoutSlot, LayoutPreset } from '../types';

// Canvas dimensions
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// Valid role values
const VALID_ROLES: LayoutSlot['role'][] = [
  'stickman',
  'primary_text',
  'secondary',
  'accent',
  'background',
  'overlay',
];

// Valid anchor values
const VALID_ANCHORS: NonNullable<LayoutSlot['anchor']>[] = [
  'center',
  'left',
  'right',
  'top',
  'bottom',
];

// Helper to validate a layout slot
function isValidSlot(slot: LayoutSlot): boolean {
  const hasValidRole = VALID_ROLES.includes(slot.role);
  const hasValidPosition =
    typeof slot.position.x === 'number' &&
    slot.position.x >= 0 &&
    slot.position.x <= CANVAS_WIDTH &&
    typeof slot.position.y === 'number' &&
    slot.position.y >= 0 &&
    slot.position.y <= CANVAS_HEIGHT;
  const hasValidScale = slot.scale === undefined || (typeof slot.scale === 'number' && slot.scale > 0);
  const hasValidMaxWidth =
    slot.maxWidth === undefined || (typeof slot.maxWidth === 'number' && slot.maxWidth > 0);
  const hasValidAnchor = slot.anchor === undefined || VALID_ANCHORS.includes(slot.anchor);
  const hasValidLayer = slot.layer === undefined || typeof slot.layer === 'number';

  return (
    hasValidRole && hasValidPosition && hasValidScale && hasValidMaxWidth && hasValidAnchor && hasValidLayer
  );
}

// Helper to validate a layout preset
function isValidLayoutPreset(preset: LayoutPreset): boolean {
  return (
    typeof preset.name === 'string' &&
    preset.name.length > 0 &&
    Array.isArray(preset.slots) &&
    preset.slots.length >= 1 &&
    preset.slots.every(isValidSlot)
  );
}

describe('L3 Layout Presets', () => {
  describe('LAYOUT_PRESETS array', () => {
    it('should have exactly 10 presets', () => {
      expect(LAYOUT_PRESETS.length).toBe(10);
    });

    it('should have all required preset names', () => {
      const names = LAYOUT_PRESETS.map((p) => p.name);
      // Original 5
      expect(names).toContain('center_single');
      expect(names).toContain('split_left_stickman');
      expect(names).toContain('triple_stickman_text_counter');
      expect(names).toContain('triple_stickman_icon_text');
      expect(names).toContain('text_only');
      // New 5
      expect(names).toContain('center_stack');
      expect(names).toContain('split_right_stickman');
      expect(names).toContain('split_equal');
      expect(names).toContain('grid_2x1');
      expect(names).toContain('overlay_fullscreen_text');
    });
  });

  describe('LAYOUT_PRESET_NAMES list', () => {
    it('should have exactly 10 names', () => {
      expect(LAYOUT_PRESET_NAMES.length).toBe(10);
    });

    it('should match LAYOUT_PRESETS', () => {
      expect(LAYOUT_PRESET_NAMES).toEqual(LAYOUT_PRESETS.map((p) => p.name));
    });
  });

  describe('LAYOUT_PRESETS_MAP', () => {
    it('should have all presets accessible by name', () => {
      LAYOUT_PRESET_NAMES.forEach((name) => {
        expect(LAYOUT_PRESETS_MAP[name]).toBeDefined();
        expect(LAYOUT_PRESETS_MAP[name].name).toBe(name);
      });
    });
  });

  describe('Individual presets validation', () => {
    describe('center_single', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(CENTER_SINGLE)).toBe(true);
      });

      it('should have a stickman slot', () => {
        const slot = getSlotByRole(CENTER_SINGLE, 'stickman');
        expect(slot).toBeDefined();
      });

      it('should have stickman centered horizontally', () => {
        const slot = getSlotByRole(CENTER_SINGLE, 'stickman')!;
        expect(slot.position.x).toBe(CANVAS_WIDTH / 2);
      });
    });

    describe('split_left_stickman', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(SPLIT_LEFT_STICKMAN)).toBe(true);
      });

      it('should have stickman on left side', () => {
        const slot = getSlotByRole(SPLIT_LEFT_STICKMAN, 'stickman')!;
        expect(slot.position.x).toBeLessThan(CANVAS_WIDTH / 2);
      });

      it('should have primary_text on right side', () => {
        const slot = getSlotByRole(SPLIT_LEFT_STICKMAN, 'primary_text')!;
        expect(slot.position.x).toBeGreaterThan(CANVAS_WIDTH / 2);
      });
    });

    describe('triple_stickman_text_counter', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(TRIPLE_STICKMAN_TEXT_COUNTER)).toBe(true);
      });

      it('should have stickman, primary_text, and secondary slots', () => {
        expect(getSlotByRole(TRIPLE_STICKMAN_TEXT_COUNTER, 'stickman')).toBeDefined();
        expect(getSlotByRole(TRIPLE_STICKMAN_TEXT_COUNTER, 'primary_text')).toBeDefined();
        expect(getSlotByRole(TRIPLE_STICKMAN_TEXT_COUNTER, 'secondary')).toBeDefined();
      });

      it('should have primary_text above secondary', () => {
        const textSlot = getSlotByRole(TRIPLE_STICKMAN_TEXT_COUNTER, 'primary_text')!;
        const counterSlot = getSlotByRole(TRIPLE_STICKMAN_TEXT_COUNTER, 'secondary')!;
        expect(textSlot.position.y).toBeLessThan(counterSlot.position.y);
      });
    });

    describe('triple_stickman_icon_text', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(TRIPLE_STICKMAN_ICON_TEXT)).toBe(true);
      });

      it('should have accent slot for icon', () => {
        expect(getSlotByRole(TRIPLE_STICKMAN_ICON_TEXT, 'accent')).toBeDefined();
      });
    });

    describe('text_only', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(TEXT_ONLY)).toBe(true);
      });

      it('should not have a stickman slot', () => {
        expect(getSlotByRole(TEXT_ONLY, 'stickman')).toBeUndefined();
      });

      it('should have primary_text centered', () => {
        const slot = getSlotByRole(TEXT_ONLY, 'primary_text')!;
        expect(slot.position.x).toBe(CANVAS_WIDTH / 2);
      });
    });

    describe('center_stack', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(CENTER_STACK)).toBe(true);
      });

      it('should have vertically stacked elements', () => {
        const primarySlot = getSlotByRole(CENTER_STACK, 'primary_text')!;
        const secondarySlot = getSlotByRole(CENTER_STACK, 'secondary')!;
        expect(primarySlot.position.y).toBeLessThan(secondarySlot.position.y);
      });

      it('should have all elements centered horizontally', () => {
        CENTER_STACK.slots.forEach((slot) => {
          expect(slot.position.x).toBe(CANVAS_WIDTH / 2);
        });
      });
    });

    describe('split_right_stickman', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(SPLIT_RIGHT_STICKMAN)).toBe(true);
      });

      it('should have stickman on right side', () => {
        const slot = getSlotByRole(SPLIT_RIGHT_STICKMAN, 'stickman')!;
        expect(slot.position.x).toBeGreaterThan(CANVAS_WIDTH / 2);
      });

      it('should have primary_text on left side', () => {
        const slot = getSlotByRole(SPLIT_RIGHT_STICKMAN, 'primary_text')!;
        expect(slot.position.x).toBeLessThan(CANVAS_WIDTH / 2);
      });
    });

    describe('split_equal', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(SPLIT_EQUAL)).toBe(true);
      });

      it('should have primary_text in left quarter', () => {
        const slot = getSlotByRole(SPLIT_EQUAL, 'primary_text')!;
        expect(slot.position.x).toBe(CANVAS_WIDTH / 4);
      });

      it('should have secondary in right quarter', () => {
        const slot = getSlotByRole(SPLIT_EQUAL, 'secondary')!;
        expect(slot.position.x).toBe((CANVAS_WIDTH / 4) * 3);
      });
    });

    describe('grid_2x1', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(GRID_2X1)).toBe(true);
      });

      it('should have at least 4 slots', () => {
        expect(GRID_2X1.slots.length).toBeGreaterThanOrEqual(4);
      });
    });

    describe('overlay_fullscreen_text', () => {
      it('should exist and be valid', () => {
        expect(isValidLayoutPreset(OVERLAY_FULLSCREEN_TEXT)).toBe(true);
      });

      it('should have background slot', () => {
        expect(getSlotByRole(OVERLAY_FULLSCREEN_TEXT, 'background')).toBeDefined();
      });

      it('should have overlay slot', () => {
        expect(getSlotByRole(OVERLAY_FULLSCREEN_TEXT, 'overlay')).toBeDefined();
      });

      it('should have background at lowest layer', () => {
        const bgSlot = getSlotByRole(OVERLAY_FULLSCREEN_TEXT, 'background')!;
        const overlaySlot = getSlotByRole(OVERLAY_FULLSCREEN_TEXT, 'overlay')!;
        expect(bgSlot.layer).toBeLessThan(overlaySlot.layer!);
      });
    });
  });

  describe('All presets have valid structure', () => {
    LAYOUT_PRESET_NAMES.forEach((name) => {
      it(`${name} should have valid preset structure`, () => {
        const preset = LAYOUT_PRESETS_MAP[name];
        expect(isValidLayoutPreset(preset)).toBe(true);
      });

      it(`${name} should have all positions within canvas bounds`, () => {
        const preset = LAYOUT_PRESETS_MAP[name];
        preset.slots.forEach((slot) => {
          expect(slot.position.x).toBeGreaterThanOrEqual(0);
          expect(slot.position.x).toBeLessThanOrEqual(CANVAS_WIDTH);
          expect(slot.position.y).toBeGreaterThanOrEqual(0);
          expect(slot.position.y).toBeLessThanOrEqual(CANVAS_HEIGHT);
        });
      });

      it(`${name} should have positive scale values`, () => {
        const preset = LAYOUT_PRESETS_MAP[name];
        preset.slots.forEach((slot) => {
          if (slot.scale !== undefined) {
            expect(slot.scale).toBeGreaterThan(0);
          }
        });
      });

      it(`${name} should have positive maxWidth values`, () => {
        const preset = LAYOUT_PRESETS_MAP[name];
        preset.slots.forEach((slot) => {
          if (slot.maxWidth !== undefined) {
            expect(slot.maxWidth).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  describe('getLayoutPreset function', () => {
    it('should return correct preset by name', () => {
      expect(getLayoutPreset('center_single')).toEqual(CENTER_SINGLE);
      expect(getLayoutPreset('split_left_stickman')).toEqual(SPLIT_LEFT_STICKMAN);
    });

    it('should return CENTER_SINGLE for unknown names', () => {
      expect(getLayoutPreset('unknown_preset')).toEqual(CENTER_SINGLE);
      expect(getLayoutPreset('')).toEqual(CENTER_SINGLE);
    });
  });

  describe('getSlotByRole function', () => {
    it('should find existing slot by role', () => {
      const slot = getSlotByRole(SPLIT_LEFT_STICKMAN, 'stickman');
      expect(slot).toBeDefined();
      expect(slot?.role).toBe('stickman');
    });

    it('should return undefined for non-existent role', () => {
      const slot = getSlotByRole(TEXT_ONLY, 'stickman');
      expect(slot).toBeUndefined();
    });
  });

  describe('getSlotsByLayer function', () => {
    it('should return slots sorted by layer ascending', () => {
      const sorted = getSlotsByLayer(OVERLAY_FULLSCREEN_TEXT);
      for (let i = 0; i < sorted.length - 1; i++) {
        const currentLayer = sorted[i].layer ?? 1;
        const nextLayer = sorted[i + 1].layer ?? 1;
        expect(currentLayer).toBeLessThanOrEqual(nextLayer);
      }
    });

    it('should not modify original preset slots', () => {
      const originalSlots = [...OVERLAY_FULLSCREEN_TEXT.slots];
      getSlotsByLayer(OVERLAY_FULLSCREEN_TEXT);
      expect(OVERLAY_FULLSCREEN_TEXT.slots).toEqual(originalSlots);
    });
  });
});
