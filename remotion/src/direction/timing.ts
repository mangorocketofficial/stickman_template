/**
 * Timing Presets - Layer 3 Direction Elements
 *
 * 5 timing presets for animation choreography:
 * 1. all_at_once - All objects appear simultaneously
 * 2. all_at_once_stagger - Simultaneous with 50ms micro-delays
 * 3. stickman_first - Stickman enters first, then others sequentially
 * 4. text_first - Text first, then stickman, then secondary elements
 * 5. reveal_climax - Background first, pause, then key elements appear
 */

import { TimingEntry, TimingPreset } from './types';

// =============================================================================
// Timing Presets
// =============================================================================

/**
 * 1. All At Once - Everything appears at the same time
 */
export const ALL_AT_ONCE: TimingPreset = {
  name: 'all_at_once',
  description: 'All objects appear simultaneously',
  entries: [
    {
      target: 'all',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
  ],
};

/**
 * 2. All At Once Stagger - Simultaneous with micro-delays for polish
 */
export const ALL_AT_ONCE_STAGGER: TimingPreset = {
  name: 'all_at_once_stagger',
  description: 'Simultaneous appearance with 50ms stagger for visual polish',
  entries: [
    {
      target: 'background',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'stickman',
      delayMs: 50,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'primary_text',
      delayMs: 100,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'secondary',
      delayMs: 150,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'accent',
      delayMs: 200,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
  ],
};

/**
 * 3. Stickman First - Stickman leads, others follow
 */
export const STICKMAN_FIRST: TimingPreset = {
  name: 'stickman_first',
  description: 'Stickman enters first, then content follows sequentially',
  entries: [
    {
      target: 'background',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
    },
    {
      target: 'stickman',
      delayMs: 100,
      enterAnimation: 'slideLeft',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 400,
    },
    {
      target: 'primary_text',
      delayMs: 500,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 600,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'secondary',
      delayMs: 800,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 600,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'accent',
      delayMs: 1000,
      enterAnimation: 'popIn',
      enterDurationMs: 400,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
  ],
};

/**
 * 4. Text First - Text leads the scene
 */
export const TEXT_FIRST: TimingPreset = {
  name: 'text_first',
  description: 'Text appears first, then stickman, then secondary elements',
  entries: [
    {
      target: 'background',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
    },
    {
      target: 'primary_text',
      delayMs: 100,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 600,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'stickman',
      delayMs: 500,
      enterAnimation: 'fadeIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 400,
    },
    {
      target: 'secondary',
      delayMs: 800,
      enterAnimation: 'fadeInUp',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'accent',
      delayMs: 1100,
      enterAnimation: 'popIn',
      enterDurationMs: 400,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
  ],
};

/**
 * 5. Reveal Climax - Build suspense then reveal key elements
 */
export const REVEAL_CLIMAX: TimingPreset = {
  name: 'reveal_climax',
  description: 'Background first, brief pause, then dramatic reveal of key elements',
  entries: [
    {
      target: 'background',
      delayMs: 0,
      enterAnimation: 'fadeIn',
      enterDurationMs: 400,
    },
    {
      target: 'stickman',
      delayMs: 600,
      enterAnimation: 'fadeIn',
      enterDurationMs: 300,
      exitAnimation: 'fadeOut',
      exitDurationMs: 400,
    },
    {
      target: 'primary_text',
      delayMs: 1200,
      enterAnimation: 'popIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'secondary',
      delayMs: 1400,
      enterAnimation: 'popIn',
      enterDurationMs: 500,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
    {
      target: 'accent',
      delayMs: 1600,
      enterAnimation: 'popIn',
      enterDurationMs: 400,
      exitAnimation: 'fadeOut',
      exitDurationMs: 300,
    },
  ],
};

// =============================================================================
// Exports
// =============================================================================

/**
 * All timing presets as an array
 */
export const TIMING_PRESETS: TimingPreset[] = [
  ALL_AT_ONCE,
  ALL_AT_ONCE_STAGGER,
  STICKMAN_FIRST,
  TEXT_FIRST,
  REVEAL_CLIMAX,
];

/**
 * Timing preset names list
 */
export const TIMING_PRESET_NAMES = TIMING_PRESETS.map((p) => p.name);

/**
 * Timing presets as a map for quick lookup
 */
export const TIMING_PRESETS_MAP: Record<string, TimingPreset> = Object.fromEntries(
  TIMING_PRESETS.map((p) => [p.name, p])
);

/**
 * Get a timing preset by name
 * @param name - The preset name
 * @returns The timing preset, or ALL_AT_ONCE as default
 */
export const getTimingPreset = (name: string): TimingPreset => {
  return TIMING_PRESETS_MAP[name] ?? ALL_AT_ONCE;
};

/**
 * Get timing entry for a specific target
 * @param preset - The timing preset
 * @param target - The target role
 * @returns The matching timing entry, or the 'all' entry if exists, or undefined
 */
export const getTimingForTarget = (
  preset: TimingPreset,
  target: TimingEntry['target']
): TimingEntry | undefined => {
  // First try exact match
  const exactMatch = preset.entries.find((entry) => entry.target === target);
  if (exactMatch) return exactMatch;

  // Fall back to 'all' entry
  return preset.entries.find((entry) => entry.target === 'all');
};

/**
 * Get all entries sorted by delay (for execution order)
 * @param preset - The timing preset
 * @returns Entries sorted by delayMs (ascending)
 */
export const getEntriesByDelay = (preset: TimingPreset): TimingEntry[] => {
  return [...preset.entries].sort((a, b) => a.delayMs - b.delayMs);
};

/**
 * Calculate total animation duration for a preset
 * @param preset - The timing preset
 * @returns Maximum delay + duration in milliseconds
 */
export const getTotalAnimationDuration = (preset: TimingPreset): number => {
  let maxEndTime = 0;
  for (const entry of preset.entries) {
    const entryEnd = entry.delayMs + entry.enterDurationMs;
    if (entryEnd > maxEndTime) maxEndTime = entryEnd;
  }
  return maxEndTime;
};
