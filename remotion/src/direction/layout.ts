/**
 * Layout Presets - 18 layout templates for scene composition
 * Layer 3: Direction Elements
 *
 * Canvas: 1920x1080 (Full HD)
 * Position coordinates are relative to canvas center
 * Positive X = right, Positive Y = down
 *
 * MVP (10): center_single, split_left_stickman, triple_stickman_text_counter,
 *           triple_stickman_icon_text, text_only, center_stack, split_right_stickman,
 *           split_equal, grid_2x1, overlay_fullscreen_text
 * V2 (8): center_hero, triple_horizontal, triple_top_bottom, grid_2x2, grid_3x1,
 *         overlay_spotlight, stickman_center_text_sides, icon_grid
 */

import { LayoutPreset, LayoutPresetName, LayoutSlot } from './types';

// ============================================================
// MVP Layout Presets (10)
// ============================================================

/**
 * 1. center_single - Single element centered
 * Good for title screens, single focus moments
 */
const center_single: LayoutPreset = {
  name: 'center_single',
  slots: [
    {
      role: 'primary',
      position: { x: 960, y: 540 },
      scale: 1.0,
      anchor: 'center',
    },
  ],
};

/**
 * 2. split_left_stickman - Stickman on left, content on right
 * Classic presentation layout
 */
const split_left_stickman: LayoutPreset = {
  name: 'split_left_stickman',
  slots: [
    {
      role: 'stickman',
      position: { x: 350, y: 540 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'content',
      position: { x: 1200, y: 540 },
      scale: 1.0,
      maxWidth: 800,
      anchor: 'center',
    },
  ],
};

/**
 * 3. triple_stickman_text_counter - Stickman left, text top-center, counter bottom-center
 * Good for explaining stats or numbers
 */
const triple_stickman_text_counter: LayoutPreset = {
  name: 'triple_stickman_text_counter',
  slots: [
    {
      role: 'stickman',
      position: { x: 300, y: 540 },
      scale: 0.9,
      anchor: 'center',
    },
    {
      role: 'text',
      position: { x: 1100, y: 300 },
      scale: 1.0,
      maxWidth: 700,
      anchor: 'center',
    },
    {
      role: 'counter',
      position: { x: 1100, y: 650 },
      scale: 1.2,
      anchor: 'center',
    },
  ],
};

/**
 * 4. triple_stickman_icon_text - Stickman left, icon center, text below icon
 * Good for explaining concepts with icons
 */
const triple_stickman_icon_text: LayoutPreset = {
  name: 'triple_stickman_icon_text',
  slots: [
    {
      role: 'stickman',
      position: { x: 300, y: 540 },
      scale: 0.9,
      anchor: 'center',
    },
    {
      role: 'icon',
      position: { x: 1100, y: 350 },
      scale: 1.5,
      anchor: 'center',
    },
    {
      role: 'text',
      position: { x: 1100, y: 650 },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
    },
  ],
};

/**
 * 5. text_only - Text centered on screen
 * Good for title cards, quotes, transitions
 */
const text_only: LayoutPreset = {
  name: 'text_only',
  slots: [
    {
      role: 'text',
      position: { x: 960, y: 540 },
      scale: 1.0,
      maxWidth: 1200,
      anchor: 'center',
    },
  ],
};

/**
 * 6. center_stack - Multiple elements stacked vertically at center
 * Good for lists or sequential information
 */
const center_stack: LayoutPreset = {
  name: 'center_stack',
  slots: [
    {
      role: 'primary',
      position: { x: 960, y: 300 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'secondary',
      position: { x: 960, y: 540 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'tertiary',
      position: { x: 960, y: 780 },
      scale: 1.0,
      anchor: 'center',
    },
  ],
};

/**
 * 7. split_right_stickman - Stickman on right, content on left
 * Mirror of split_left_stickman for variety
 */
const split_right_stickman: LayoutPreset = {
  name: 'split_right_stickman',
  slots: [
    {
      role: 'content',
      position: { x: 720, y: 540 },
      scale: 1.0,
      maxWidth: 800,
      anchor: 'center',
    },
    {
      role: 'stickman',
      position: { x: 1570, y: 540 },
      scale: 1.0,
      anchor: 'center',
    },
  ],
};

/**
 * 8. split_equal - Two equal columns
 * Good for comparisons or A/B scenarios
 */
const split_equal: LayoutPreset = {
  name: 'split_equal',
  slots: [
    {
      role: 'left',
      position: { x: 480, y: 540 },
      scale: 1.0,
      maxWidth: 700,
      anchor: 'center',
    },
    {
      role: 'right',
      position: { x: 1440, y: 540 },
      scale: 1.0,
      maxWidth: 700,
      anchor: 'center',
    },
  ],
};

/**
 * 9. grid_2x1 - Two columns in a row
 * Good for showing two related items
 */
const grid_2x1: LayoutPreset = {
  name: 'grid_2x1',
  slots: [
    {
      role: 'cell_1',
      position: { x: 560, y: 540 },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
    },
    {
      role: 'cell_2',
      position: { x: 1360, y: 540 },
      scale: 1.0,
      maxWidth: 600,
      anchor: 'center',
    },
  ],
};

/**
 * 10. overlay_fullscreen_text - Large text covering full screen
 * Good for impactful statements or transitions
 */
const overlay_fullscreen_text: LayoutPreset = {
  name: 'overlay_fullscreen_text',
  slots: [
    {
      role: 'text',
      position: { x: 960, y: 540 },
      scale: 1.5,
      maxWidth: 1600,
      anchor: 'center',
    },
  ],
};

// ============================================================
// V2 Layout Presets (8)
// ============================================================

/**
 * 11. center_hero - Large central element with smaller side elements
 * Good for featuring a main subject with supporting info
 */
const center_hero: LayoutPreset = {
  name: 'center_hero',
  slots: [
    {
      role: 'hero',
      position: { x: 960, y: 480 },
      scale: 1.3,
      anchor: 'center',
    },
    {
      role: 'left_support',
      position: { x: 250, y: 540 },
      scale: 0.7,
      anchor: 'center',
    },
    {
      role: 'right_support',
      position: { x: 1670, y: 540 },
      scale: 0.7,
      anchor: 'center',
    },
  ],
};

/**
 * 12. triple_horizontal - Three equal columns
 * Good for showing three related concepts
 */
const triple_horizontal: LayoutPreset = {
  name: 'triple_horizontal',
  slots: [
    {
      role: 'left',
      position: { x: 320, y: 540 },
      scale: 0.9,
      maxWidth: 500,
      anchor: 'center',
    },
    {
      role: 'center',
      position: { x: 960, y: 540 },
      scale: 0.9,
      maxWidth: 500,
      anchor: 'center',
    },
    {
      role: 'right',
      position: { x: 1600, y: 540 },
      scale: 0.9,
      maxWidth: 500,
      anchor: 'center',
    },
  ],
};

/**
 * 13. triple_top_bottom - Title top, content middle, footer bottom
 * Classic presentation structure
 */
const triple_top_bottom: LayoutPreset = {
  name: 'triple_top_bottom',
  slots: [
    {
      role: 'title',
      position: { x: 960, y: 150 },
      scale: 1.0,
      maxWidth: 1400,
      anchor: 'center',
    },
    {
      role: 'content',
      position: { x: 960, y: 520 },
      scale: 1.0,
      maxWidth: 1200,
      anchor: 'center',
    },
    {
      role: 'footer',
      position: { x: 960, y: 900 },
      scale: 0.8,
      maxWidth: 1000,
      anchor: 'center',
    },
  ],
};

/**
 * 14. grid_2x2 - Four equal cells in 2x2 grid
 * Good for showing four related items
 */
const grid_2x2: LayoutPreset = {
  name: 'grid_2x2',
  slots: [
    {
      role: 'cell_1',
      position: { x: 560, y: 330 },
      scale: 0.8,
      maxWidth: 500,
      anchor: 'center',
    },
    {
      role: 'cell_2',
      position: { x: 1360, y: 330 },
      scale: 0.8,
      maxWidth: 500,
      anchor: 'center',
    },
    {
      role: 'cell_3',
      position: { x: 560, y: 750 },
      scale: 0.8,
      maxWidth: 500,
      anchor: 'center',
    },
    {
      role: 'cell_4',
      position: { x: 1360, y: 750 },
      scale: 0.8,
      maxWidth: 500,
      anchor: 'center',
    },
  ],
};

/**
 * 15. grid_3x1 - Three columns in a row
 * Good for step-by-step or process illustrations
 */
const grid_3x1: LayoutPreset = {
  name: 'grid_3x1',
  slots: [
    {
      role: 'cell_1',
      position: { x: 320, y: 540 },
      scale: 0.85,
      maxWidth: 450,
      anchor: 'center',
    },
    {
      role: 'cell_2',
      position: { x: 960, y: 540 },
      scale: 0.85,
      maxWidth: 450,
      anchor: 'center',
    },
    {
      role: 'cell_3',
      position: { x: 1600, y: 540 },
      scale: 0.85,
      maxWidth: 450,
      anchor: 'center',
    },
  ],
};

/**
 * 16. overlay_spotlight - Central spotlight with dimmed surrounding
 * Good for focusing attention on key element
 */
const overlay_spotlight: LayoutPreset = {
  name: 'overlay_spotlight',
  slots: [
    {
      role: 'spotlight',
      position: { x: 960, y: 540 },
      scale: 1.2,
      anchor: 'center',
    },
    {
      role: 'background_left',
      position: { x: 200, y: 540 },
      scale: 0.5,
      anchor: 'center',
    },
    {
      role: 'background_right',
      position: { x: 1720, y: 540 },
      scale: 0.5,
      anchor: 'center',
    },
  ],
};

/**
 * 17. stickman_center_text_sides - Stickman in center with text on both sides
 * Good for balanced presentations with central focus
 */
const stickman_center_text_sides: LayoutPreset = {
  name: 'stickman_center_text_sides',
  slots: [
    {
      role: 'text_left',
      position: { x: 300, y: 540 },
      scale: 0.9,
      maxWidth: 400,
      anchor: 'center',
    },
    {
      role: 'stickman',
      position: { x: 960, y: 540 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'text_right',
      position: { x: 1620, y: 540 },
      scale: 0.9,
      maxWidth: 400,
      anchor: 'center',
    },
  ],
};

/**
 * 18. icon_grid - Grid of icons for feature showcases
 * Good for showing multiple features or benefits
 */
const icon_grid: LayoutPreset = {
  name: 'icon_grid',
  slots: [
    {
      role: 'icon_1',
      position: { x: 480, y: 330 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'icon_2',
      position: { x: 960, y: 330 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'icon_3',
      position: { x: 1440, y: 330 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'icon_4',
      position: { x: 480, y: 750 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'icon_5',
      position: { x: 960, y: 750 },
      scale: 1.0,
      anchor: 'center',
    },
    {
      role: 'icon_6',
      position: { x: 1440, y: 750 },
      scale: 1.0,
      anchor: 'center',
    },
  ],
};

// ============================================================
// Exports
// ============================================================

/**
 * All layout presets as a record
 */
export const LAYOUT_PRESETS: Record<LayoutPresetName, LayoutPreset> = {
  // MVP
  center_single,
  split_left_stickman,
  triple_stickman_text_counter,
  triple_stickman_icon_text,
  text_only,
  center_stack,
  split_right_stickman,
  split_equal,
  grid_2x1,
  overlay_fullscreen_text,
  // V2
  center_hero,
  triple_horizontal,
  triple_top_bottom,
  grid_2x2,
  grid_3x1,
  overlay_spotlight,
  stickman_center_text_sides,
  icon_grid,
};

/**
 * Array of all layout preset names
 */
export const LAYOUT_PRESET_NAMES: LayoutPresetName[] = [
  // MVP
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
  // V2
  'center_hero',
  'triple_horizontal',
  'triple_top_bottom',
  'grid_2x2',
  'grid_3x1',
  'overlay_spotlight',
  'stickman_center_text_sides',
  'icon_grid',
];

/**
 * MVP layout preset names (first 10)
 */
export const MVP_LAYOUT_PRESET_NAMES: LayoutPresetName[] = [
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

/**
 * V2 layout preset names (additional 8)
 */
export const V2_LAYOUT_PRESET_NAMES: LayoutPresetName[] = [
  'center_hero',
  'triple_horizontal',
  'triple_top_bottom',
  'grid_2x2',
  'grid_3x1',
  'overlay_spotlight',
  'stickman_center_text_sides',
  'icon_grid',
];

/**
 * Get a layout preset by name
 * @param name - The preset name
 * @returns The layout preset or center_single as default
 */
export const getLayoutPreset = (name: string): LayoutPreset => {
  return LAYOUT_PRESETS[name as LayoutPresetName] || LAYOUT_PRESETS.center_single;
};

/**
 * Default layout preset
 */
export const DEFAULT_LAYOUT_PRESET = LAYOUT_PRESETS.center_single;

/**
 * Get slots for a specific role from a layout
 * @param layout - The layout preset
 * @param role - The role to find
 * @returns The slot or undefined
 */
export const getSlotByRole = (layout: LayoutPreset, role: string): LayoutSlot | undefined => {
  return layout.slots.find((slot) => slot.role === role);
};
