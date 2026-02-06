/**
 * Timing Module Tests
 * Testing 15 timing presets (5 MVP + 5 V2 + 5 V3)
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../timing';
import { TimingPreset, TimingEntry, EnterAnimationType, ExitAnimationType } from '../types';

describe('Timing Module', () => {
  // ==========================================================================
  // Preset Counts
  // ==========================================================================
  describe('Preset Counts', () => {
    it('should have exactly 15 timing presets', () => {
      expect(Object.keys(TIMING_PRESETS)).toHaveLength(15);
    });

    it('should have 5 MVP presets', () => {
      expect(MVP_TIMING_NAMES).toHaveLength(5);
    });

    it('should have 5 V2 presets', () => {
      expect(V2_TIMING_NAMES).toHaveLength(5);
    });

    it('should have 5 V3 presets', () => {
      expect(V3_TIMING_NAMES).toHaveLength(5);
    });

    it('should have TIMING_NAMES array matching TIMING_PRESETS keys', () => {
      expect(TIMING_NAMES).toHaveLength(15);
      expect(TIMING_NAMES.sort()).toEqual(Object.keys(TIMING_PRESETS).sort());
    });
  });

  // ==========================================================================
  // MVP Timing Presets (5)
  // ==========================================================================
  describe('MVP Timing Presets', () => {
    const mvpPresets = ['all_at_once', 'all_at_once_stagger', 'stickman_first', 'text_first', 'reveal_climax'];

    mvpPresets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in TIMING_PRESETS', () => {
          expect(TIMING_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(TIMING_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(TIMING_PRESETS[name].description).toBeDefined();
          expect(TIMING_PRESETS[name].description.length).toBeGreaterThan(0);
        });

        it('should have at least 1 timing entry', () => {
          expect(TIMING_PRESETS[name].entries.length).toBeGreaterThanOrEqual(1);
        });

        it('should have valid timing entries', () => {
          TIMING_PRESETS[name].entries.forEach((entry) => {
            expect(entry.target).toBeDefined();
            expect(entry.delayMs).toBeGreaterThanOrEqual(0);
            expect(entry.enterAnimation).toBeDefined();
            expect(entry.enterDurationMs).toBeGreaterThan(0);
          });
        });
      });
    });

    describe('all_at_once', () => {
      it('should target all elements', () => {
        const preset = TIMING_PRESETS['all_at_once'];
        expect(preset.entries[0].target).toBe('all');
      });

      it('should have 0 delay', () => {
        const preset = TIMING_PRESETS['all_at_once'];
        expect(preset.entries[0].delayMs).toBe(0);
      });
    });

    describe('all_at_once_stagger', () => {
      it('should have baseStaggerMs defined', () => {
        const preset = TIMING_PRESETS['all_at_once_stagger'];
        expect(preset.baseStaggerMs).toBeDefined();
        expect(preset.baseStaggerMs).toBeGreaterThan(0);
      });

      it('should have increasing delays', () => {
        const preset = TIMING_PRESETS['all_at_once_stagger'];
        for (let i = 1; i < preset.entries.length; i++) {
          expect(preset.entries[i].delayMs).toBeGreaterThanOrEqual(
            preset.entries[i - 1].delayMs
          );
        }
      });
    });

    describe('stickman_first', () => {
      it('should have stickman as first entry with 0 delay', () => {
        const preset = TIMING_PRESETS['stickman_first'];
        const stickmanEntry = preset.entries.find(e => e.target === 'stickman');
        expect(stickmanEntry).toBeDefined();
        expect(stickmanEntry!.delayMs).toBe(0);
      });

      it('should have other elements delayed after stickman', () => {
        const preset = TIMING_PRESETS['stickman_first'];
        const stickmanDelay = preset.entries.find(e => e.target === 'stickman')?.delayMs || 0;
        const otherEntries = preset.entries.filter(e => e.target !== 'stickman');
        otherEntries.forEach(entry => {
          expect(entry.delayMs).toBeGreaterThan(stickmanDelay);
        });
      });
    });

    describe('text_first', () => {
      it('should have title/text as first entries', () => {
        const preset = TIMING_PRESETS['text_first'];
        const firstEntry = preset.entries[0];
        expect(['title', 'text']).toContain(firstEntry.target);
      });

      it('should have stickman delayed', () => {
        const preset = TIMING_PRESETS['text_first'];
        const stickmanEntry = preset.entries.find(e => e.target === 'stickman');
        expect(stickmanEntry).toBeDefined();
        expect(stickmanEntry!.delayMs).toBeGreaterThan(0);
      });
    });

    describe('reveal_climax', () => {
      it('should have primary element with largest delay', () => {
        const preset = TIMING_PRESETS['reveal_climax'];
        const primaryEntry = preset.entries.find(e => e.target === 'primary');
        expect(primaryEntry).toBeDefined();
        const backgroundEntry = preset.entries.find(e => e.target === 'background');
        expect(primaryEntry!.delayMs).toBeGreaterThan(backgroundEntry?.delayMs || 0);
      });

      it('should use popInBounce for climax animation', () => {
        const preset = TIMING_PRESETS['reveal_climax'];
        const primaryEntry = preset.entries.find(e => e.target === 'primary');
        expect(primaryEntry?.enterAnimation).toBe('popInBounce');
      });
    });
  });

  // ==========================================================================
  // V2 Timing Presets (5)
  // ==========================================================================
  describe('V2 Timing Presets', () => {
    const v2Presets = ['left_to_right', 'top_to_bottom', 'counter_focus', 'icon_burst', 'carry_stickman'];

    v2Presets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in TIMING_PRESETS', () => {
          expect(TIMING_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(TIMING_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(TIMING_PRESETS[name].description).toBeDefined();
        });

        it('should have valid timing entries', () => {
          TIMING_PRESETS[name].entries.forEach((entry) => {
            expect(entry.delayMs).toBeGreaterThanOrEqual(0);
            expect(entry.enterDurationMs).toBeGreaterThan(0);
          });
        });
      });
    });

    describe('left_to_right', () => {
      it('should have baseStaggerMs defined', () => {
        const preset = TIMING_PRESETS['left_to_right'];
        expect(preset.baseStaggerMs).toBeDefined();
      });

      it('should use slideRight animation', () => {
        const preset = TIMING_PRESETS['left_to_right'];
        preset.entries.forEach(entry => {
          expect(entry.enterAnimation).toBe('slideRight');
        });
      });
    });

    describe('top_to_bottom', () => {
      it('should use slideDown animation', () => {
        const preset = TIMING_PRESETS['top_to_bottom'];
        preset.entries.forEach(entry => {
          expect(entry.enterAnimation).toBe('slideDown');
        });
      });
    });

    describe('counter_focus', () => {
      it('should have counter with emphasis animation', () => {
        const preset = TIMING_PRESETS['counter_focus'];
        const counterEntry = preset.entries.find(e => e.target === 'counter');
        expect(counterEntry).toBeDefined();
        expect(['popIn', 'popInBounce', 'scaleIn']).toContain(counterEntry!.enterAnimation);
      });

      it('should have counter delayed for emphasis', () => {
        const preset = TIMING_PRESETS['counter_focus'];
        const counterEntry = preset.entries.find(e => e.target === 'counter');
        expect(counterEntry!.delayMs).toBeGreaterThanOrEqual(400);
      });
    });

    describe('icon_burst', () => {
      it('should have rapid stagger timing', () => {
        const preset = TIMING_PRESETS['icon_burst'];
        expect(preset.baseStaggerMs).toBeLessThanOrEqual(100);
      });

      it('should use popIn for icons', () => {
        const preset = TIMING_PRESETS['icon_burst'];
        const iconEntries = preset.entries.filter(e => e.target.startsWith('item'));
        iconEntries.forEach(entry => {
          expect(entry.enterAnimation).toBe('popIn');
        });
      });
    });

    describe('carry_stickman', () => {
      it('should have stickman leading with slide animation', () => {
        const preset = TIMING_PRESETS['carry_stickman'];
        const stickmanEntry = preset.entries.find(e => e.target === 'stickman');
        expect(stickmanEntry).toBeDefined();
        expect(stickmanEntry!.delayMs).toBe(0);
        expect(stickmanEntry!.enterAnimation).toContain('slide');
      });
    });
  });

  // ==========================================================================
  // V3 Timing Presets (5)
  // ==========================================================================
  describe('V3 Timing Presets', () => {
    const v3Presets = ['morph_text', 'wipe_replace', 'bounce_sequence', 'spiral_in', 'typewriter_reveal'];

    v3Presets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in TIMING_PRESETS', () => {
          expect(TIMING_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(TIMING_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(TIMING_PRESETS[name].description).toBeDefined();
        });

        it('should have valid timing entry structure', () => {
          TIMING_PRESETS[name].entries.forEach((entry) => {
            expect(typeof entry.target).toBe('string');
            expect(typeof entry.delayMs).toBe('number');
            expect(typeof entry.enterAnimation).toBe('string');
            expect(typeof entry.enterDurationMs).toBe('number');
          });
        });
      });
    });

    describe('morph_text', () => {
      it('should use morphIn animation for text elements', () => {
        const preset = TIMING_PRESETS['morph_text'];
        const textEntries = preset.entries.filter(e =>
          e.target === 'title' || e.target === 'text' || e.target === 'secondary'
        );
        textEntries.forEach(entry => {
          expect(entry.enterAnimation).toBe('morphIn');
        });
      });
    });

    describe('wipe_replace', () => {
      it('should use wipe animations', () => {
        const preset = TIMING_PRESETS['wipe_replace'];
        const wipeAnimations = ['wipeRight', 'wipeLeft', 'wipeUp', 'wipeDown'];
        preset.entries.forEach(entry => {
          expect(wipeAnimations).toContain(entry.enterAnimation);
        });
      });
    });

    describe('bounce_sequence', () => {
      it('should have baseStaggerMs defined', () => {
        const preset = TIMING_PRESETS['bounce_sequence'];
        expect(preset.baseStaggerMs).toBeDefined();
      });

      it('should use bounce animation', () => {
        const preset = TIMING_PRESETS['bounce_sequence'];
        preset.entries.forEach(entry => {
          expect(entry.enterAnimation).toBe('popInBounce');
        });
      });

      it('should have easeOutBack easing', () => {
        const preset = TIMING_PRESETS['bounce_sequence'];
        preset.entries.forEach(entry => {
          expect(entry.easing).toBe('easeOutBack');
        });
      });
    });

    describe('spiral_in', () => {
      it('should use rotateIn animation for items', () => {
        const preset = TIMING_PRESETS['spiral_in'];
        const itemEntries = preset.entries.filter(e => e.target.startsWith('item'));
        itemEntries.forEach(entry => {
          expect(entry.enterAnimation).toBe('rotateIn');
        });
      });

      it('should have hero appearing last', () => {
        const preset = TIMING_PRESETS['spiral_in'];
        const heroEntry = preset.entries.find(e => e.target === 'hero');
        const maxItemDelay = Math.max(
          ...preset.entries.filter(e => e.target.startsWith('item')).map(e => e.delayMs)
        );
        expect(heroEntry!.delayMs).toBeGreaterThan(maxItemDelay);
      });
    });

    describe('typewriter_reveal', () => {
      it('should use typewriter animation for text', () => {
        const preset = TIMING_PRESETS['typewriter_reveal'];
        const textEntries = preset.entries.filter(e =>
          e.target === 'title' || e.target === 'text'
        );
        textEntries.forEach(entry => {
          expect(entry.enterAnimation).toBe('typewriter');
        });
      });

      it('should have longer duration for typewriter effect', () => {
        const preset = TIMING_PRESETS['typewriter_reveal'];
        const textEntries = preset.entries.filter(e => e.enterAnimation === 'typewriter');
        textEntries.forEach(entry => {
          expect(entry.enterDurationMs).toBeGreaterThanOrEqual(600);
        });
      });
    });
  });

  // ==========================================================================
  // Helper Functions
  // ==========================================================================
  describe('Helper Functions', () => {
    describe('getTimingPreset', () => {
      it('should return preset for valid name', () => {
        const preset = getTimingPreset('all_at_once');
        expect(preset).toBeDefined();
        expect(preset?.name).toBe('all_at_once');
      });

      it('should return undefined for invalid name', () => {
        const preset = getTimingPreset('non_existent_preset');
        expect(preset).toBeUndefined();
      });
    });

    describe('hasTimingPreset', () => {
      it('should return true for valid preset', () => {
        expect(hasTimingPreset('all_at_once')).toBe(true);
        expect(hasTimingPreset('stickman_first')).toBe(true);
        expect(hasTimingPreset('typewriter_reveal')).toBe(true);
      });

      it('should return false for invalid preset', () => {
        expect(hasTimingPreset('invalid')).toBe(false);
        expect(hasTimingPreset('')).toBe(false);
      });
    });

    describe('getTimingForTarget', () => {
      it('should return entry for specific target', () => {
        const preset = TIMING_PRESETS['stickman_first'];
        const entry = getTimingForTarget(preset, 'stickman');
        expect(entry).toBeDefined();
        expect(entry?.target).toBe('stickman');
      });

      it('should return "all" entry when target not found', () => {
        const preset = TIMING_PRESETS['all_at_once'];
        const entry = getTimingForTarget(preset, 'specific_target');
        expect(entry).toBeDefined();
        expect(entry?.target).toBe('all');
      });

      it('should return undefined when neither target nor "all" exists', () => {
        const preset: TimingPreset = {
          name: 'test',
          description: 'test',
          entries: [
            { target: 'stickman', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300 }
          ]
        };
        const entry = getTimingForTarget(preset, 'text');
        expect(entry).toBeUndefined();
      });
    });

    describe('calculateTotalDuration', () => {
      it('should calculate total duration correctly', () => {
        const preset: TimingPreset = {
          name: 'test',
          description: 'test',
          entries: [
            { target: 'a', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300 },
            { target: 'b', delayMs: 200, enterAnimation: 'fadeIn', enterDurationMs: 400 },
          ]
        };
        const duration = calculateTotalDuration(preset);
        expect(duration).toBe(600); // 200 + 400
      });

      it('should include exit duration when specified', () => {
        const preset: TimingPreset = {
          name: 'test',
          description: 'test',
          entries: [
            { target: 'a', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300, exitAnimation: 'fadeOut', exitDurationMs: 200 },
          ]
        };
        const duration = calculateTotalDuration(preset);
        expect(duration).toBe(500); // 0 + 300 + 200
      });

      it('should handle real presets', () => {
        const duration = calculateTotalDuration(TIMING_PRESETS['stickman_first']);
        expect(duration).toBeGreaterThan(0);
      });
    });

    describe('getSortedEntries', () => {
      it('should return entries sorted by delay', () => {
        const preset = TIMING_PRESETS['stickman_first'];
        const sorted = getSortedEntries(preset);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i].delayMs).toBeGreaterThanOrEqual(sorted[i - 1].delayMs);
        }
      });

      it('should not modify original preset entries', () => {
        const preset = TIMING_PRESETS['reveal_climax'];
        const originalFirst = preset.entries[0];
        getSortedEntries(preset);
        expect(preset.entries[0]).toBe(originalFirst);
      });
    });
  });

  // ==========================================================================
  // Entry Validation
  // ==========================================================================
  describe('Entry Validation', () => {
    const validEnterAnimations: EnterAnimationType[] = [
      'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
      'slideLeft', 'slideRight', 'slideUp', 'slideDown',
      'popIn', 'popInBounce', 'typewriter', 'drawLine', 'scaleIn',
      'rotateIn', 'flipIn', 'wipeLeft', 'wipeRight', 'wipeUp', 'wipeDown',
      'morphIn', 'none'
    ];

    Object.entries(TIMING_PRESETS).forEach(([name, preset]) => {
      describe(`${name} entries`, () => {
        it('should have valid enter animation values', () => {
          preset.entries.forEach((entry) => {
            expect(validEnterAnimations).toContain(entry.enterAnimation);
          });
        });

        it('should have non-negative delay values', () => {
          preset.entries.forEach((entry) => {
            expect(entry.delayMs).toBeGreaterThanOrEqual(0);
          });
        });

        it('should have positive duration values', () => {
          preset.entries.forEach((entry) => {
            expect(entry.enterDurationMs).toBeGreaterThan(0);
          });
        });

        it('should have reasonable duration values (50-2000ms)', () => {
          preset.entries.forEach((entry) => {
            expect(entry.enterDurationMs).toBeGreaterThanOrEqual(50);
            expect(entry.enterDurationMs).toBeLessThanOrEqual(2000);
          });
        });

        it('should have valid exit animation if specified', () => {
          const validExitAnimations = [
            'fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight',
            'slideOutLeft', 'slideOutRight', 'slideOutUp', 'slideOutDown',
            'popOut', 'scaleOut', 'rotateOut', 'wipeOutLeft', 'wipeOutRight', 'none'
          ];
          preset.entries.forEach((entry) => {
            if (entry.exitAnimation) {
              expect(validExitAnimations).toContain(entry.exitAnimation);
            }
          });
        });

        it('should have valid easing if specified', () => {
          const validEasings = [
            'linear', 'easeIn', 'easeOut', 'easeInOut',
            'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
            'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
            'easeOutBack', 'spring'
          ];
          preset.entries.forEach((entry) => {
            if (entry.easing) {
              expect(validEasings).toContain(entry.easing);
            }
          });
        });
      });
    });
  });
});
