/**
 * Timing Presets - 15 animation timing patterns
 * Layer 3 (Direction Elements) for the stickman video system
 *
 * MVP 5: all_at_once, all_at_once_stagger, stickman_first, text_first, reveal_climax
 * V2 5: left_to_right, top_to_bottom, counter_focus, icon_burst, carry_stickman
 * V3 5: morph_text, wipe_replace, bounce_sequence, spiral_in, typewriter_reveal
 */

import { TimingPreset, TimingEntry, EnterAnimationType, ExitAnimationType } from './types';

// ============================================================================
// MVP TIMING PRESETS (5)
// ============================================================================

/**
 * 1. all_at_once - All elements appear simultaneously
 */
const all_at_once: TimingPreset = {
  name: 'all_at_once',
  description: 'All elements appear at the same time',
  entries: [
    { target: 'all', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 400 },
  ],
};

/**
 * 2. all_at_once_stagger - All elements appear with slight stagger
 */
const all_at_once_stagger: TimingPreset = {
  name: 'all_at_once_stagger',
  description: 'All elements appear with 100ms stagger between each',
  baseStaggerMs: 100,
  entries: [
    { target: 'stickman', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'primary', delayMs: 100, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'secondary', delayMs: 200, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'tertiary', delayMs: 300, enterAnimation: 'fadeIn', enterDurationMs: 400 },
  ],
};

/**
 * 3. stickman_first - Stickman appears first, then other elements
 */
const stickman_first: TimingPreset = {
  name: 'stickman_first',
  description: 'Stickman appears first, followed by other elements',
  entries: [
    { target: 'stickman', delayMs: 0, enterAnimation: 'popIn', enterDurationMs: 500, easing: 'easeOutBack' },
    { target: 'text', delayMs: 400, enterAnimation: 'fadeInUp', enterDurationMs: 400 },
    { target: 'icon', delayMs: 500, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'counter', delayMs: 600, enterAnimation: 'fadeIn', enterDurationMs: 300 },
  ],
};

/**
 * 4. text_first - Text appears first, then stickman
 */
const text_first: TimingPreset = {
  name: 'text_first',
  description: 'Text elements appear first, then stickman',
  entries: [
    { target: 'title', delayMs: 0, enterAnimation: 'fadeInDown', enterDurationMs: 400 },
    { target: 'text', delayMs: 150, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'stickman', delayMs: 400, enterAnimation: 'fadeInRight', enterDurationMs: 500 },
    { target: 'secondary', delayMs: 600, enterAnimation: 'fadeIn', enterDurationMs: 300 },
  ],
};

/**
 * 5. reveal_climax - Build up to a climax reveal
 */
const reveal_climax: TimingPreset = {
  name: 'reveal_climax',
  description: 'Build up with small elements, then reveal main content',
  entries: [
    { target: 'background', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'secondary', delayMs: 200, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'stickman', delayMs: 400, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'primary', delayMs: 700, enterAnimation: 'popInBounce', enterDurationMs: 600, easing: 'easeOutBack' },
    { target: 'counter', delayMs: 1000, enterAnimation: 'scaleIn', enterDurationMs: 400 },
  ],
};

// ============================================================================
// V2 TIMING PRESETS (5)
// ============================================================================

/**
 * 6. left_to_right - Elements appear from left to right
 */
const left_to_right: TimingPreset = {
  name: 'left_to_right',
  description: 'Elements appear sequentially from left to right',
  baseStaggerMs: 150,
  entries: [
    { target: 'item1', delayMs: 0, enterAnimation: 'slideRight', enterDurationMs: 400 },
    { target: 'item2', delayMs: 150, enterAnimation: 'slideRight', enterDurationMs: 400 },
    { target: 'item3', delayMs: 300, enterAnimation: 'slideRight', enterDurationMs: 400 },
    { target: 'item4', delayMs: 450, enterAnimation: 'slideRight', enterDurationMs: 400 },
    { target: 'item5', delayMs: 600, enterAnimation: 'slideRight', enterDurationMs: 400 },
  ],
};

/**
 * 7. top_to_bottom - Elements appear from top to bottom
 */
const top_to_bottom: TimingPreset = {
  name: 'top_to_bottom',
  description: 'Elements appear sequentially from top to bottom',
  baseStaggerMs: 150,
  entries: [
    { target: 'title', delayMs: 0, enterAnimation: 'slideDown', enterDurationMs: 400 },
    { target: 'item1', delayMs: 150, enterAnimation: 'slideDown', enterDurationMs: 400 },
    { target: 'item2', delayMs: 300, enterAnimation: 'slideDown', enterDurationMs: 400 },
    { target: 'item3', delayMs: 450, enterAnimation: 'slideDown', enterDurationMs: 400 },
    { target: 'secondary', delayMs: 600, enterAnimation: 'slideDown', enterDurationMs: 400 },
  ],
};

/**
 * 8. counter_focus - Focus on counter with supporting elements
 */
const counter_focus: TimingPreset = {
  name: 'counter_focus',
  description: 'Counter is the focus with supporting elements appearing around it',
  entries: [
    { target: 'stickman', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'text', delayMs: 200, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'counter', delayMs: 500, enterAnimation: 'popInBounce', enterDurationMs: 600, easing: 'spring' },
    { target: 'secondary', delayMs: 900, enterAnimation: 'fadeIn', enterDurationMs: 300 },
  ],
};

/**
 * 9. icon_burst - Icons burst in rapidly
 */
const icon_burst: TimingPreset = {
  name: 'icon_burst',
  description: 'Icons appear in rapid succession with pop effect',
  baseStaggerMs: 80,
  entries: [
    { target: 'title', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'item1', delayMs: 200, enterAnimation: 'popIn', enterDurationMs: 250 },
    { target: 'item2', delayMs: 280, enterAnimation: 'popIn', enterDurationMs: 250 },
    { target: 'item3', delayMs: 360, enterAnimation: 'popIn', enterDurationMs: 250 },
    { target: 'item4', delayMs: 440, enterAnimation: 'popIn', enterDurationMs: 250 },
    { target: 'item5', delayMs: 520, enterAnimation: 'popIn', enterDurationMs: 250 },
  ],
};

/**
 * 10. carry_stickman - Stickman carries the animation sequence
 */
const carry_stickman: TimingPreset = {
  name: 'carry_stickman',
  description: 'Stickman leads the animation with elements following',
  entries: [
    { target: 'stickman', delayMs: 0, enterAnimation: 'slideRight', enterDurationMs: 600 },
    { target: 'primary', delayMs: 300, enterAnimation: 'fadeInLeft', enterDurationMs: 400 },
    { target: 'secondary', delayMs: 500, enterAnimation: 'fadeInLeft', enterDurationMs: 400 },
    { target: 'counter', delayMs: 700, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'icon', delayMs: 800, enterAnimation: 'popIn', enterDurationMs: 300 },
  ],
};

// ============================================================================
// V3 TIMING PRESETS (5)
// ============================================================================

/**
 * 11. morph_text - Text morphs in with transformation effect
 */
const morph_text: TimingPreset = {
  name: 'morph_text',
  description: 'Text elements morph in with transformation effect',
  entries: [
    { target: 'background', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 200 },
    { target: 'title', delayMs: 100, enterAnimation: 'morphIn', enterDurationMs: 500, easing: 'easeOutCubic' },
    { target: 'text', delayMs: 400, enterAnimation: 'morphIn', enterDurationMs: 500, easing: 'easeOutCubic' },
    { target: 'stickman', delayMs: 700, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'secondary', delayMs: 900, enterAnimation: 'morphIn', enterDurationMs: 400 },
  ],
};

/**
 * 12. wipe_replace - Wipe animation replacing elements
 */
const wipe_replace: TimingPreset = {
  name: 'wipe_replace',
  description: 'Elements wipe in from different directions',
  entries: [
    { target: 'primary', delayMs: 0, enterAnimation: 'wipeRight', enterDurationMs: 500 },
    { target: 'stickman', delayMs: 200, enterAnimation: 'wipeUp', enterDurationMs: 500 },
    { target: 'secondary', delayMs: 400, enterAnimation: 'wipeLeft', enterDurationMs: 500 },
    { target: 'counter', delayMs: 600, enterAnimation: 'wipeDown', enterDurationMs: 400 },
  ],
};

/**
 * 13. bounce_sequence - Elements bounce in sequence
 */
const bounce_sequence: TimingPreset = {
  name: 'bounce_sequence',
  description: 'Elements bounce in one after another',
  baseStaggerMs: 120,
  entries: [
    { target: 'stickman', delayMs: 0, enterAnimation: 'popInBounce', enterDurationMs: 500, easing: 'easeOutBack' },
    { target: 'item1', delayMs: 120, enterAnimation: 'popInBounce', enterDurationMs: 400, easing: 'easeOutBack' },
    { target: 'item2', delayMs: 240, enterAnimation: 'popInBounce', enterDurationMs: 400, easing: 'easeOutBack' },
    { target: 'item3', delayMs: 360, enterAnimation: 'popInBounce', enterDurationMs: 400, easing: 'easeOutBack' },
    { target: 'item4', delayMs: 480, enterAnimation: 'popInBounce', enterDurationMs: 400, easing: 'easeOutBack' },
    { target: 'item5', delayMs: 600, enterAnimation: 'popInBounce', enterDurationMs: 400, easing: 'easeOutBack' },
  ],
};

/**
 * 14. spiral_in - Elements spiral in from edges
 */
const spiral_in: TimingPreset = {
  name: 'spiral_in',
  description: 'Elements spiral in from edges to center',
  entries: [
    { target: 'item1', delayMs: 0, enterAnimation: 'rotateIn', enterDurationMs: 500, easing: 'easeOut' },
    { target: 'item2', delayMs: 100, enterAnimation: 'rotateIn', enterDurationMs: 500, easing: 'easeOut' },
    { target: 'item3', delayMs: 200, enterAnimation: 'rotateIn', enterDurationMs: 500, easing: 'easeOut' },
    { target: 'item4', delayMs: 300, enterAnimation: 'rotateIn', enterDurationMs: 500, easing: 'easeOut' },
    { target: 'hero', delayMs: 500, enterAnimation: 'scaleIn', enterDurationMs: 600, easing: 'easeOutBack' },
  ],
};

/**
 * 15. typewriter_reveal - Typewriter effect for text elements
 */
const typewriter_reveal: TimingPreset = {
  name: 'typewriter_reveal',
  description: 'Text appears with typewriter effect',
  entries: [
    { target: 'stickman', delayMs: 0, enterAnimation: 'fadeIn', enterDurationMs: 300 },
    { target: 'title', delayMs: 200, enterAnimation: 'typewriter', enterDurationMs: 800 },
    { target: 'text', delayMs: 600, enterAnimation: 'typewriter', enterDurationMs: 1000 },
    { target: 'secondary', delayMs: 1200, enterAnimation: 'fadeIn', enterDurationMs: 400 },
    { target: 'counter', delayMs: 1400, enterAnimation: 'popIn', enterDurationMs: 400 },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All timing presets indexed by name
 */
export const TIMING_PRESETS: Record<string, TimingPreset> = {
  // MVP (5)
  all_at_once,
  all_at_once_stagger,
  stickman_first,
  text_first,
  reveal_climax,
  // V2 (5)
  left_to_right,
  top_to_bottom,
  counter_focus,
  icon_burst,
  carry_stickman,
  // V3 (5)
  morph_text,
  wipe_replace,
  bounce_sequence,
  spiral_in,
  typewriter_reveal,
};

/**
 * Array of all timing preset names
 */
export const TIMING_NAMES = Object.keys(TIMING_PRESETS) as string[];

/**
 * Get a timing preset by name
 */
export const getTimingPreset = (name: string): TimingPreset | undefined => {
  return TIMING_PRESETS[name];
};

/**
 * Check if a timing preset exists
 */
export const hasTimingPreset = (name: string): boolean => {
  return name in TIMING_PRESETS;
};

/**
 * Get timing entry for a specific target
 */
export const getTimingForTarget = (preset: TimingPreset, target: string): TimingEntry | undefined => {
  return preset.entries.find(entry => entry.target === target || entry.target === 'all');
};

/**
 * Calculate total animation duration for a preset
 */
export const calculateTotalDuration = (preset: TimingPreset): number => {
  let maxEndTime = 0;
  for (const entry of preset.entries) {
    const endTime = entry.delayMs + entry.enterDurationMs + (entry.exitDurationMs || 0);
    if (endTime > maxEndTime) {
      maxEndTime = endTime;
    }
  }
  return maxEndTime;
};

/**
 * Get all entries sorted by delay
 */
export const getSortedEntries = (preset: TimingPreset): TimingEntry[] => {
  return [...preset.entries].sort((a, b) => a.delayMs - b.delayMs);
};

// MVP preset names for easy reference
export const MVP_TIMING_NAMES = [
  'all_at_once',
  'all_at_once_stagger',
  'stickman_first',
  'text_first',
  'reveal_climax',
] as const;

// V2 preset names for easy reference
export const V2_TIMING_NAMES = [
  'left_to_right',
  'top_to_bottom',
  'counter_focus',
  'icon_burst',
  'carry_stickman',
] as const;

// V3 preset names for easy reference
export const V3_TIMING_NAMES = [
  'morph_text',
  'wipe_replace',
  'bounce_sequence',
  'spiral_in',
  'typewriter_reveal',
] as const;
