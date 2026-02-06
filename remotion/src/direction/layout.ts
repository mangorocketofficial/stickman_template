/**
 * Layout Presets - Layer 3 Direction Elements
 *
 * 10 layout presets for scene object arrangement:
 *
 * Original 5 (from existing logic):
 * 1. center_single - Single element centered
 * 2. split_left_stickman - Stickman left, content right
 * 3. triple_stickman_text_counter - Stickman left, text top-center, counter bottom-center
 * 4. triple_stickman_icon_text - Stickman left, icon center, text bottom
 * 5. text_only - Text centered (no stickman)
 *
 * New 5:
 * 6. center_stack - Vertical center stack (text top, counter bottom)
 * 7. split_right_stickman - Stickman right, content left
 * 8. split_equal - Equal left-right split (for comparisons)
 * 9. grid_2x1 - 2-column 1-row grid (comparison)
 * 10. overlay_fullscreen_text - Fullscreen text overlay with background object
 */

import { LayoutSlot, LayoutPreset } from './types';

// Canvas dimensions
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;

// =============================================================================
// Layout Presets
// =============================================================================

/**
 * 1. Center Single - Single element centered
 */
export const CENTER_SINGLE: LayoutPreset = {
  name: 'center_single',
  description: 'Single element centered on screen',
  slots: [
    {
      role: 'stickman',
      position: { x: CENTER_X, y: 600 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
  ],
};

/**
 * 2. Split Left Stickman - Stickman on left, content on right
 */
export const SPLIT_LEFT_STICKMAN: LayoutPreset = {
  name: 'split_left_stickman',
  description: 'Stickman on left side, content on right',
  slots: [
    {
      role: 'stickman',
      position: { x: 350, y: 600 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'primary_text',
      position: { x: 1150, y: 350 },
      scale: 1.0,
      maxWidth: 800,
      anchor: 'center',
      layer: 2,
    },
    {
      role: 'secondary',
      position: { x: 1150, y: 550 },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
      layer: 2,
    },
  ],
};

/**
 * 3. Triple Stickman Text Counter - Complex layout with stickman, text, and counter
 */
export const TRIPLE_STICKMAN_TEXT_COUNTER: LayoutPreset = {
  name: 'triple_stickman_text_counter',
  description: 'Stickman left, text top-center, counter bottom-center',
  slots: [
    {
      role: 'stickman',
      position: { x: 300, y: 600 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'primary_text',
      position: { x: CENTER_X, y: 250 },
      scale: 1.0,
      maxWidth: 1000,
      anchor: 'center',
      layer: 2,
    },
    {
      role: 'secondary',
      position: { x: CENTER_X, y: 500 },
      scale: 1.2,
      anchor: 'center',
      layer: 2,
    },
  ],
};

/**
 * 4. Triple Stickman Icon Text - Stickman with icon and text
 */
export const TRIPLE_STICKMAN_ICON_TEXT: LayoutPreset = {
  name: 'triple_stickman_icon_text',
  description: 'Stickman left, icon center, text bottom',
  slots: [
    {
      role: 'stickman',
      position: { x: 300, y: 600 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'accent',
      position: { x: CENTER_X, y: 300 },
      scale: 1.5,
      anchor: 'center',
      layer: 2,
    },
    {
      role: 'primary_text',
      position: { x: CENTER_X, y: 550 },
      scale: 1.0,
      maxWidth: 800,
      anchor: 'center',
      layer: 2,
    },
  ],
};

/**
 * 5. Text Only - Centered text without stickman
 */
export const TEXT_ONLY: LayoutPreset = {
  name: 'text_only',
  description: 'Text centered without stickman',
  slots: [
    {
      role: 'primary_text',
      position: { x: CENTER_X, y: 400 },
      scale: 1.2,
      maxWidth: 1200,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'secondary',
      position: { x: CENTER_X, y: 600 },
      scale: 1.0,
      maxWidth: 1000,
      anchor: 'center',
      layer: 1,
    },
  ],
};

/**
 * 6. Center Stack - Vertical stack in center
 */
export const CENTER_STACK: LayoutPreset = {
  name: 'center_stack',
  description: 'Vertical center alignment (text top, counter/secondary bottom)',
  slots: [
    {
      role: 'primary_text',
      position: { x: CENTER_X, y: 300 },
      scale: 1.0,
      maxWidth: 1000,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'secondary',
      position: { x: CENTER_X, y: 550 },
      scale: 1.2,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'accent',
      position: { x: CENTER_X, y: 750 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
  ],
};

/**
 * 7. Split Right Stickman - Stickman on right, content on left
 */
export const SPLIT_RIGHT_STICKMAN: LayoutPreset = {
  name: 'split_right_stickman',
  description: 'Stickman on right side, content on left',
  slots: [
    {
      role: 'stickman',
      position: { x: CANVAS_WIDTH - 350, y: 600 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'primary_text',
      position: { x: 700, y: 350 },
      scale: 1.0,
      maxWidth: 800,
      anchor: 'center',
      layer: 2,
    },
    {
      role: 'secondary',
      position: { x: 700, y: 550 },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
      layer: 2,
    },
  ],
};

/**
 * 8. Split Equal - Equal left-right split for comparisons
 */
export const SPLIT_EQUAL: LayoutPreset = {
  name: 'split_equal',
  description: 'Equal left-right split for comparisons',
  slots: [
    {
      role: 'primary_text',
      position: { x: CANVAS_WIDTH / 4, y: CENTER_Y },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'secondary',
      position: { x: (CANVAS_WIDTH / 4) * 3, y: CENTER_Y },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
      layer: 1,
    },
  ],
};

/**
 * 9. Grid 2x1 - Two columns, one row grid
 */
export const GRID_2X1: LayoutPreset = {
  name: 'grid_2x1',
  description: 'Two-column grid for side-by-side comparison',
  slots: [
    {
      role: 'primary_text',
      position: { x: 480, y: 300 },
      scale: 1.0,
      maxWidth: 500,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'accent',
      position: { x: 480, y: 600 },
      scale: 1.0,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'secondary',
      position: { x: 1440, y: 300 },
      scale: 1.0,
      maxWidth: 500,
      anchor: 'center',
      layer: 1,
    },
    {
      role: 'stickman',
      position: { x: 1440, y: 600 },
      scale: 0.8,
      anchor: 'center',
      layer: 1,
    },
  ],
};

/**
 * 10. Overlay Fullscreen Text - Large fullscreen text with background
 */
export const OVERLAY_FULLSCREEN_TEXT: LayoutPreset = {
  name: 'overlay_fullscreen_text',
  description: 'Fullscreen text overlay with background object',
  slots: [
    {
      role: 'background',
      position: { x: CENTER_X, y: CENTER_Y },
      scale: 1.0,
      anchor: 'center',
      layer: 0,
    },
    {
      role: 'primary_text',
      position: { x: CENTER_X, y: CENTER_Y - 100 },
      scale: 1.5,
      maxWidth: 1400,
      anchor: 'center',
      layer: 2,
    },
    {
      role: 'secondary',
      position: { x: CENTER_X, y: CENTER_Y + 150 },
      scale: 1.0,
      maxWidth: 1200,
      anchor: 'center',
      layer: 2,
    },
    {
      role: 'overlay',
      position: { x: CENTER_X, y: CENTER_Y },
      scale: 1.0,
      anchor: 'center',
      layer: 3,
    },
  ],
};

// =============================================================================
// Exports
// =============================================================================

/**
 * All layout presets as an array
 */
export const LAYOUT_PRESETS: LayoutPreset[] = [
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
];

/**
 * Layout preset names list
 */
export const LAYOUT_PRESET_NAMES = LAYOUT_PRESETS.map((p) => p.name);

/**
 * Layout presets as a map for quick lookup
 */
export const LAYOUT_PRESETS_MAP: Record<string, LayoutPreset> = Object.fromEntries(
  LAYOUT_PRESETS.map((p) => [p.name, p])
);

/**
 * Get a layout preset by name
 * @param name - The preset name
 * @returns The layout preset, or CENTER_SINGLE as default
 */
export const getLayoutPreset = (name: string): LayoutPreset => {
  return LAYOUT_PRESETS_MAP[name] ?? CENTER_SINGLE;
};

/**
 * Get slot by role from a layout preset
 * @param preset - The layout preset
 * @param role - The role to find
 * @returns The matching slot, or undefined
 */
export const getSlotByRole = (preset: LayoutPreset, role: LayoutSlot['role']): LayoutSlot | undefined => {
  return preset.slots.find((slot) => slot.role === role);
};

/**
 * Get all slots sorted by layer (for rendering order)
 * @param preset - The layout preset
 * @returns Slots sorted by layer (ascending)
 */
export const getSlotsByLayer = (preset: LayoutPreset): LayoutSlot[] => {
  return [...preset.slots].sort((a, b) => (a.layer ?? 1) - (b.layer ?? 1));
};
