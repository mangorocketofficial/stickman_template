import { describe, it, expect } from 'vitest';
import {
  TIMING_PRESETS,
  TIMING_PRESET_NAMES,
  TIMING_PRESETS_MAP,
  getTimingPreset,
  getTimingForTarget,
  getEntriesByDelay,
  getTotalAnimationDuration,
  ALL_AT_ONCE,
  ALL_AT_ONCE_STAGGER,
  STICKMAN_FIRST,
  TEXT_FIRST,
  REVEAL_CLIMAX,
} from '../timing';
import { TimingEntry, TimingPreset } from '../types';

// Valid target values
const VALID_TARGETS: TimingEntry['target'][] = [
  'stickman',
  'primary_text',
  'secondary',
  'accent',
  'background',
  'all',
];

// Helper to validate a timing entry
function isValidTimingEntry(entry: TimingEntry): boolean {
  const hasValidTarget = VALID_TARGETS.includes(entry.target);
  const hasValidDelay = typeof entry.delayMs === 'number' && entry.delayMs >= 0;
  const hasValidEnterAnimation =
    typeof entry.enterAnimation === 'string' && entry.enterAnimation.length > 0;
  const hasValidEnterDuration =
    typeof entry.enterDurationMs === 'number' && entry.enterDurationMs > 0;
  const hasValidExitAnimation =
    entry.exitAnimation === undefined ||
    (typeof entry.exitAnimation === 'string' && entry.exitAnimation.length > 0);
  const hasValidExitDuration =
    entry.exitDurationMs === undefined ||
    (typeof entry.exitDurationMs === 'number' && entry.exitDurationMs > 0);

  return (
    hasValidTarget &&
    hasValidDelay &&
    hasValidEnterAnimation &&
    hasValidEnterDuration &&
    hasValidExitAnimation &&
    hasValidExitDuration
  );
}

// Helper to validate a timing preset
function isValidTimingPreset(preset: TimingPreset): boolean {
  return (
    typeof preset.name === 'string' &&
    preset.name.length > 0 &&
    Array.isArray(preset.entries) &&
    preset.entries.length >= 1 &&
    preset.entries.every(isValidTimingEntry)
  );
}

describe('L3 Timing Presets', () => {
  describe('TIMING_PRESETS array', () => {
    it('should have exactly 5 presets', () => {
      expect(TIMING_PRESETS.length).toBe(5);
    });

    it('should have all required preset names', () => {
      const names = TIMING_PRESETS.map((p) => p.name);
      expect(names).toContain('all_at_once');
      expect(names).toContain('all_at_once_stagger');
      expect(names).toContain('stickman_first');
      expect(names).toContain('text_first');
      expect(names).toContain('reveal_climax');
    });
  });

  describe('TIMING_PRESET_NAMES list', () => {
    it('should have exactly 5 names', () => {
      expect(TIMING_PRESET_NAMES.length).toBe(5);
    });

    it('should match TIMING_PRESETS', () => {
      expect(TIMING_PRESET_NAMES).toEqual(TIMING_PRESETS.map((p) => p.name));
    });
  });

  describe('TIMING_PRESETS_MAP', () => {
    it('should have all presets accessible by name', () => {
      TIMING_PRESET_NAMES.forEach((name) => {
        expect(TIMING_PRESETS_MAP[name]).toBeDefined();
        expect(TIMING_PRESETS_MAP[name].name).toBe(name);
      });
    });
  });

  describe('Individual presets validation', () => {
    describe('all_at_once', () => {
      it('should exist and be valid', () => {
        expect(isValidTimingPreset(ALL_AT_ONCE)).toBe(true);
      });

      it('should have all target with zero delay', () => {
        const allEntry = ALL_AT_ONCE.entries.find((e) => e.target === 'all');
        expect(allEntry).toBeDefined();
        expect(allEntry?.delayMs).toBe(0);
      });

      it('should have exit animation defined', () => {
        const allEntry = ALL_AT_ONCE.entries.find((e) => e.target === 'all');
        expect(allEntry?.exitAnimation).toBeDefined();
      });
    });

    describe('all_at_once_stagger', () => {
      it('should exist and be valid', () => {
        expect(isValidTimingPreset(ALL_AT_ONCE_STAGGER)).toBe(true);
      });

      it('should have staggered delays (50ms increments)', () => {
        const entries = getEntriesByDelay(ALL_AT_ONCE_STAGGER);
        // Check that delays increase
        for (let i = 1; i < entries.length; i++) {
          expect(entries[i].delayMs).toBeGreaterThanOrEqual(entries[i - 1].delayMs);
        }
      });

      it('should have background first', () => {
        const entries = getEntriesByDelay(ALL_AT_ONCE_STAGGER);
        expect(entries[0].target).toBe('background');
        expect(entries[0].delayMs).toBe(0);
      });
    });

    describe('stickman_first', () => {
      it('should exist and be valid', () => {
        expect(isValidTimingPreset(STICKMAN_FIRST)).toBe(true);
      });

      it('should have stickman before primary_text', () => {
        const stickmanEntry = STICKMAN_FIRST.entries.find((e) => e.target === 'stickman');
        const textEntry = STICKMAN_FIRST.entries.find((e) => e.target === 'primary_text');
        expect(stickmanEntry).toBeDefined();
        expect(textEntry).toBeDefined();
        expect(stickmanEntry!.delayMs).toBeLessThan(textEntry!.delayMs);
      });

      it('should use slideLeft for stickman', () => {
        const stickmanEntry = STICKMAN_FIRST.entries.find((e) => e.target === 'stickman');
        expect(stickmanEntry?.enterAnimation).toBe('slideLeft');
      });
    });

    describe('text_first', () => {
      it('should exist and be valid', () => {
        expect(isValidTimingPreset(TEXT_FIRST)).toBe(true);
      });

      it('should have primary_text before stickman', () => {
        const stickmanEntry = TEXT_FIRST.entries.find((e) => e.target === 'stickman');
        const textEntry = TEXT_FIRST.entries.find((e) => e.target === 'primary_text');
        expect(stickmanEntry).toBeDefined();
        expect(textEntry).toBeDefined();
        expect(textEntry!.delayMs).toBeLessThan(stickmanEntry!.delayMs);
      });

      it('should use fadeInUp for primary_text', () => {
        const textEntry = TEXT_FIRST.entries.find((e) => e.target === 'primary_text');
        expect(textEntry?.enterAnimation).toBe('fadeInUp');
      });
    });

    describe('reveal_climax', () => {
      it('should exist and be valid', () => {
        expect(isValidTimingPreset(REVEAL_CLIMAX)).toBe(true);
      });

      it('should have background first', () => {
        const bgEntry = REVEAL_CLIMAX.entries.find((e) => e.target === 'background');
        expect(bgEntry).toBeDefined();
        expect(bgEntry!.delayMs).toBe(0);
      });

      it('should have significant delay before primary_text for dramatic reveal', () => {
        const textEntry = REVEAL_CLIMAX.entries.find((e) => e.target === 'primary_text');
        expect(textEntry).toBeDefined();
        expect(textEntry!.delayMs).toBeGreaterThanOrEqual(1000);
      });

      it('should use popIn for dramatic elements', () => {
        const textEntry = REVEAL_CLIMAX.entries.find((e) => e.target === 'primary_text');
        expect(textEntry?.enterAnimation).toBe('popIn');
      });
    });
  });

  describe('All presets have valid structure', () => {
    TIMING_PRESET_NAMES.forEach((name) => {
      it(`${name} should have valid preset structure`, () => {
        const preset = TIMING_PRESETS_MAP[name];
        expect(isValidTimingPreset(preset)).toBe(true);
      });

      it(`${name} should have non-negative delay values`, () => {
        const preset = TIMING_PRESETS_MAP[name];
        preset.entries.forEach((entry) => {
          expect(entry.delayMs).toBeGreaterThanOrEqual(0);
        });
      });

      it(`${name} should have positive duration values`, () => {
        const preset = TIMING_PRESETS_MAP[name];
        preset.entries.forEach((entry) => {
          expect(entry.enterDurationMs).toBeGreaterThan(0);
          if (entry.exitDurationMs !== undefined) {
            expect(entry.exitDurationMs).toBeGreaterThan(0);
          }
        });
      });

      it(`${name} should have non-empty animation names`, () => {
        const preset = TIMING_PRESETS_MAP[name];
        preset.entries.forEach((entry) => {
          expect(entry.enterAnimation.length).toBeGreaterThan(0);
          if (entry.exitAnimation !== undefined) {
            expect(entry.exitAnimation.length).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  describe('getTimingPreset function', () => {
    it('should return correct preset by name', () => {
      expect(getTimingPreset('all_at_once')).toEqual(ALL_AT_ONCE);
      expect(getTimingPreset('stickman_first')).toEqual(STICKMAN_FIRST);
    });

    it('should return ALL_AT_ONCE for unknown names', () => {
      expect(getTimingPreset('unknown_preset')).toEqual(ALL_AT_ONCE);
      expect(getTimingPreset('')).toEqual(ALL_AT_ONCE);
    });
  });

  describe('getTimingForTarget function', () => {
    it('should find exact match for target', () => {
      const entry = getTimingForTarget(STICKMAN_FIRST, 'stickman');
      expect(entry).toBeDefined();
      expect(entry?.target).toBe('stickman');
    });

    it('should fall back to all target if no exact match', () => {
      const entry = getTimingForTarget(ALL_AT_ONCE, 'stickman');
      expect(entry).toBeDefined();
      expect(entry?.target).toBe('all');
    });

    it('should return undefined if no match and no all target', () => {
      // Create a preset without 'all' target for this test
      const testPreset: TimingPreset = {
        name: 'test',
        entries: [
          {
            target: 'stickman',
            delayMs: 0,
            enterAnimation: 'fadeIn',
            enterDurationMs: 500,
          },
        ],
      };
      const entry = getTimingForTarget(testPreset, 'primary_text');
      expect(entry).toBeUndefined();
    });
  });

  describe('getEntriesByDelay function', () => {
    it('should return entries sorted by delay ascending', () => {
      const sorted = getEntriesByDelay(STICKMAN_FIRST);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].delayMs).toBeLessThanOrEqual(sorted[i + 1].delayMs);
      }
    });

    it('should not modify original preset entries', () => {
      const originalEntries = [...STICKMAN_FIRST.entries];
      getEntriesByDelay(STICKMAN_FIRST);
      expect(STICKMAN_FIRST.entries).toEqual(originalEntries);
    });
  });

  describe('getTotalAnimationDuration function', () => {
    it('should calculate correct total duration', () => {
      // For ALL_AT_ONCE: delay 0 + duration 500 = 500
      const duration = getTotalAnimationDuration(ALL_AT_ONCE);
      expect(duration).toBe(500);
    });

    it('should account for delay + duration', () => {
      // For STICKMAN_FIRST: accent is last (delay 1000 + duration 400 = 1400)
      const duration = getTotalAnimationDuration(STICKMAN_FIRST);
      expect(duration).toBe(1400);
    });

    it('should find maximum end time across all entries', () => {
      // For REVEAL_CLIMAX: accent is last (delay 1600 + duration 400 = 2000)
      const duration = getTotalAnimationDuration(REVEAL_CLIMAX);
      expect(duration).toBe(2000);
    });
  });
});
