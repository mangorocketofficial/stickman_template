/**
 * Timing Presets - 10 timing choreography presets for scene animation
 * Layer 3: Direction Elements
 *
 * Controls the order and timing of element entrance/exit animations
 *
 * MVP (5): all_at_once, all_at_once_stagger, stickman_first, text_first, reveal_climax
 * V2 (5): left_to_right, top_to_bottom, counter_focus, icon_burst, carry_stickman
 */

import { TimingPreset, TimingPresetName, TimingEntry } from './types';

// ============================================================
// MVP Timing Presets (5)
// ============================================================

/**
 * 1. all_at_once - All elements appear simultaneously
 * Simple, no choreography
 */
const all_at_once: TimingPreset = {
  name: 'all_at_once',
  entries: [
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'text',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'icon',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'counter',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'shape',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
  ],
};

/**
 * 2. all_at_once_stagger - All elements with slight stagger (50ms each)
 * Adds subtle polish without noticeable delay
 */
const all_at_once_stagger: TimingPreset = {
  name: 'all_at_once_stagger',
  entries: [
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'text',
      delayMs: 50,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'icon',
      delayMs: 100,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'counter',
      delayMs: 150,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'shape',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
  ],
};

/**
 * 3. stickman_first - Stickman enters, then other elements follow
 * Good for character-driven scenes
 */
const stickman_first: TimingPreset = {
  name: 'stickman_first',
  entries: [
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 600,
    },
    {
      target: 'text',
      delayMs: 400,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'icon',
      delayMs: 500,
      enterAnimation: 'popIn',
      enterDurationMs: 400,
    },
    {
      target: 'counter',
      delayMs: 600,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'shape',
      delayMs: 300,
      enterAnimation: 'drawLine',
      enterDurationMs: 600,
    },
  ],
};

/**
 * 4. text_first - Text appears first, then stickman and other elements
 * Good for text-heavy information scenes
 */
const text_first: TimingPreset = {
  name: 'text_first',
  entries: [
    {
      target: 'text',
      delayMs: 0,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
    },
    {
      target: 'stickman',
      delayMs: 300,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'icon',
      delayMs: 400,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'counter',
      delayMs: 500,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'shape',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
  ],
};

/**
 * 5. reveal_climax - Build-up to climax reveal
 * Background/shapes first, pause, then key element dramatically
 */
const reveal_climax: TimingPreset = {
  name: 'reveal_climax',
  entries: [
    {
      target: 'shape',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'stickman',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'text',
      delayMs: 800,
      enterAnimation: 'popIn',
      enterDurationMs: 500,
    },
    {
      target: 'icon',
      delayMs: 900,
      enterAnimation: 'popIn',
      enterDurationMs: 400,
    },
    {
      target: 'counter',
      delayMs: 1000,
      enterAnimation: 'popIn',
      enterDurationMs: 500,
    },
  ],
};

// ============================================================
// V2 Timing Presets (5)
// ============================================================

/**
 * 6. left_to_right - Elements appear from left to right
 * Good for sequential flow or progression
 */
const left_to_right: TimingPreset = {
  name: 'left_to_right',
  entries: [
    {
      target: 'left',
      delayMs: 0,
      enterAnimation: 'slideLeft',
      enterDurationMs: 500,
    },
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'slideLeft',
      enterDurationMs: 500,
    },
    {
      target: 'center',
      delayMs: 200,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
    },
    {
      target: 'text',
      delayMs: 200,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
    },
    {
      target: 'right',
      delayMs: 400,
      enterAnimation: 'slideRight',
      enterDurationMs: 500,
    },
    {
      target: 'icon',
      delayMs: 400,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'counter',
      delayMs: 400,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'shape',
      delayMs: 100,
      enterAnimation: 'drawLine',
      enterDurationMs: 600,
    },
  ],
};

/**
 * 7. top_to_bottom - Elements appear from top to bottom
 * Good for hierarchical information
 */
const top_to_bottom: TimingPreset = {
  name: 'top_to_bottom',
  entries: [
    {
      target: 'title',
      delayMs: 0,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
    },
    {
      target: 'text',
      delayMs: 0,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
    },
    {
      target: 'stickman',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'icon',
      delayMs: 300,
      enterAnimation: 'popIn',
      enterDurationMs: 400,
    },
    {
      target: 'content',
      delayMs: 400,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
    },
    {
      target: 'counter',
      delayMs: 500,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
    },
    {
      target: 'footer',
      delayMs: 600,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'shape',
      delayMs: 100,
      enterAnimation: 'drawLine',
      enterDurationMs: 600,
    },
  ],
};

/**
 * 8. counter_focus - Other elements static, counter animated prominently
 * Good for data/stats emphasis
 */
const counter_focus: TimingPreset = {
  name: 'counter_focus',
  entries: [
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
    },
    {
      target: 'text',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
    },
    {
      target: 'icon',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
    },
    {
      target: 'shape',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
    },
    {
      target: 'counter',
      delayMs: 500,
      enterAnimation: 'popIn',
      enterDurationMs: 600,
    },
  ],
};

/**
 * 9. icon_burst - Icons pop in with emphasis
 * Good for feature highlights or benefits
 */
const icon_burst: TimingPreset = {
  name: 'icon_burst',
  entries: [
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'text',
      delayMs: 100,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'icon',
      delayMs: 400,
      enterAnimation: 'popIn',
      enterDurationMs: 500,
    },
    {
      target: 'counter',
      delayMs: 600,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'shape',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
  ],
};

/**
 * 10. carry_stickman - Stickman persists, other elements transition
 * Good for scene continuity with changing context
 */
const carry_stickman: TimingPreset = {
  name: 'carry_stickman',
  entries: [
    {
      target: 'stickman',
      delayMs: 0,
      enterAnimation: 'none',
      enterDurationMs: 0,
    },
    {
      target: 'text',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'icon',
      delayMs: 100,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'counter',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'shape',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
  ],
};

// ============================================================
// Exports
// ============================================================

/**
 * All timing presets as a record
 */
export const TIMING_PRESETS: Record<TimingPresetName, TimingPreset> = {
  // MVP
  all_at_once,
  all_at_once_stagger,
  stickman_first,
  text_first,
  reveal_climax,
  // V2
  left_to_right,
  top_to_bottom,
  counter_focus,
  icon_burst,
  carry_stickman,
};

/**
 * Array of all timing preset names
 */
export const TIMING_PRESET_NAMES: TimingPresetName[] = [
  // MVP
  'all_at_once',
  'all_at_once_stagger',
  'stickman_first',
  'text_first',
  'reveal_climax',
  // V2
  'left_to_right',
  'top_to_bottom',
  'counter_focus',
  'icon_burst',
  'carry_stickman',
];

/**
 * MVP timing preset names (first 5)
 */
export const MVP_TIMING_PRESET_NAMES: TimingPresetName[] = [
  'all_at_once',
  'all_at_once_stagger',
  'stickman_first',
  'text_first',
  'reveal_climax',
];

/**
 * V2 timing preset names (additional 5)
 */
export const V2_TIMING_PRESET_NAMES: TimingPresetName[] = [
  'left_to_right',
  'top_to_bottom',
  'counter_focus',
  'icon_burst',
  'carry_stickman',
];

/**
 * Get a timing preset by name
 * @param name - The preset name
 * @returns The timing preset or all_at_once as default
 */
export const getTimingPreset = (name: string): TimingPreset => {
  return TIMING_PRESETS[name as TimingPresetName] || TIMING_PRESETS.all_at_once;
};

/**
 * Default timing preset
 */
export const DEFAULT_TIMING_PRESET = TIMING_PRESETS.all_at_once;

/**
 * Get timing entry for a specific target from a preset
 * @param preset - The timing preset
 * @param target - The target role to find
 * @returns The timing entry or undefined
 */
export const getTimingByTarget = (preset: TimingPreset, target: string): TimingEntry | undefined => {
  return preset.entries.find((entry) => entry.target === target);
};

/**
 * Get all timing entries sorted by delay
 * @param preset - The timing preset
 * @returns Array of entries sorted by delayMs ascending
 */
export const getTimingEntriesSorted = (preset: TimingPreset): TimingEntry[] => {
  return [...preset.entries].sort((a, b) => a.delayMs - b.delayMs);
};
