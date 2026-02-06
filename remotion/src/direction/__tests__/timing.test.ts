/**
 * Timing Presets Tests
 */

import { describe, it, expect } from 'vitest';
import {
  TIMING_PRESETS,
  TIMING_PRESET_NAMES,
  MVP_TIMING_PRESET_NAMES,
  V2_TIMING_PRESET_NAMES,
  getTimingPreset,
  DEFAULT_TIMING_PRESET,
  getTimingByTarget,
  getTimingEntriesSorted,
} from '../timing';
import { TimingPresetName } from '../types';

describe('Timing Presets', () => {
  describe('Preset Counts', () => {
    it('should have exactly 10 timing presets', () => {
      expect(Object.keys(TIMING_PRESETS).length).toBe(10);
    });

    it('should have exactly 10 preset names in array', () => {
      expect(TIMING_PRESET_NAMES.length).toBe(10);
    });

    it('should have 5 MVP presets', () => {
      expect(MVP_TIMING_PRESET_NAMES.length).toBe(5);
    });

    it('should have 5 V2 presets', () => {
      expect(V2_TIMING_PRESET_NAMES.length).toBe(5);
    });
  });

  describe('MVP Presets (5)', () => {
    const mvpPresets: TimingPresetName[] = [
      'all_at_once',
      'all_at_once_stagger',
      'stickman_first',
      'text_first',
      'reveal_climax',
    ];

    mvpPresets.forEach((presetName) => {
      it(`should have MVP preset: ${presetName}`, () => {
        expect(TIMING_PRESETS[presetName]).toBeDefined();
        expect(TIMING_PRESETS[presetName].name).toBe(presetName);
      });
    });
  });

  describe('V2 Presets (5)', () => {
    const v2Presets: TimingPresetName[] = [
      'left_to_right',
      'top_to_bottom',
      'counter_focus',
      'icon_burst',
      'carry_stickman',
    ];

    v2Presets.forEach((presetName) => {
      it(`should have V2 preset: ${presetName}`, () => {
        expect(TIMING_PRESETS[presetName]).toBeDefined();
        expect(TIMING_PRESETS[presetName].name).toBe(presetName);
      });
    });
  });

  describe('Preset Structure', () => {
    Object.entries(TIMING_PRESETS).forEach(([name, preset]) => {
      describe(`Preset: ${name}`, () => {
        it('should have a name property', () => {
          expect(preset.name).toBe(name);
        });

        it('should have at least 1 entry', () => {
          expect(preset.entries.length).toBeGreaterThanOrEqual(1);
        });

        preset.entries.forEach((entry, index) => {
          it(`entry ${index} should have target string`, () => {
            expect(typeof entry.target).toBe('string');
            expect(entry.target.length).toBeGreaterThan(0);
          });

          it(`entry ${index} should have non-negative delayMs`, () => {
            expect(entry.delayMs).toBeGreaterThanOrEqual(0);
          });

          it(`entry ${index} should have enterAnimation string`, () => {
            expect(typeof entry.enterAnimation).toBe('string');
          });

          it(`entry ${index} should have non-negative enterDurationMs`, () => {
            expect(entry.enterDurationMs).toBeGreaterThanOrEqual(0);
          });

          it(`entry ${index} should have valid exitAnimation if defined`, () => {
            if (entry.exitAnimation !== undefined) {
              expect(typeof entry.exitAnimation).toBe('string');
            }
          });

          it(`entry ${index} should have valid exitDurationMs if defined`, () => {
            if (entry.exitDurationMs !== undefined) {
              expect(entry.exitDurationMs).toBeGreaterThanOrEqual(0);
            }
          });
        });
      });
    });
  });

  describe('getTimingPreset', () => {
    it('should return correct preset by name', () => {
      expect(getTimingPreset('all_at_once').name).toBe('all_at_once');
      expect(getTimingPreset('carry_stickman').name).toBe('carry_stickman');
    });

    it('should return all_at_once for unknown preset', () => {
      expect(getTimingPreset('unknown_preset').name).toBe('all_at_once');
    });

    it('should return all_at_once for empty string', () => {
      expect(getTimingPreset('').name).toBe('all_at_once');
    });
  });

  describe('DEFAULT_TIMING_PRESET', () => {
    it('should be all_at_once', () => {
      expect(DEFAULT_TIMING_PRESET.name).toBe('all_at_once');
    });
  });

  describe('getTimingByTarget', () => {
    it('should return entry for existing target', () => {
      const preset = TIMING_PRESETS.stickman_first;
      const entry = getTimingByTarget(preset, 'stickman');
      expect(entry).toBeDefined();
      expect(entry?.target).toBe('stickman');
    });

    it('should return undefined for non-existing target', () => {
      const preset = TIMING_PRESETS.all_at_once;
      const entry = getTimingByTarget(preset, 'nonexistent');
      expect(entry).toBeUndefined();
    });
  });

  describe('getTimingEntriesSorted', () => {
    it('should return entries sorted by delayMs ascending', () => {
      const preset = TIMING_PRESETS.stickman_first;
      const sorted = getTimingEntriesSorted(preset);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].delayMs).toBeGreaterThanOrEqual(sorted[i - 1].delayMs);
      }
    });

    it('should not mutate original preset entries', () => {
      const preset = TIMING_PRESETS.stickman_first;
      const originalOrder = [...preset.entries];
      getTimingEntriesSorted(preset);
      expect(preset.entries).toEqual(originalOrder);
    });
  });

  describe('Specific Timing Behaviors', () => {
    it('all_at_once should have all entries with delayMs = 0', () => {
      const preset = TIMING_PRESETS.all_at_once;
      preset.entries.forEach((entry) => {
        expect(entry.delayMs).toBe(0);
      });
    });

    it('carry_stickman should have stickman with enterAnimation = none', () => {
      const preset = TIMING_PRESETS.carry_stickman;
      const stickmanEntry = getTimingByTarget(preset, 'stickman');
      expect(stickmanEntry?.enterAnimation).toBe('none');
    });

    it('carry_stickman should have exit animations for non-stickman elements', () => {
      const preset = TIMING_PRESETS.carry_stickman;
      const textEntry = getTimingByTarget(preset, 'text');
      expect(textEntry?.exitAnimation).toBeDefined();
      expect(textEntry?.exitDurationMs).toBeGreaterThan(0);
    });
  });
});
