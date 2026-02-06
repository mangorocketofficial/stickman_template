/**
 * Layout Presets - 25 layout patterns
 * Layer 3 (Direction Elements) for the stickman video system
 *
 * MVP 10: center_single, split_left_stickman, triple_stickman_text_counter,
 *         triple_stickman_icon_text, text_only, center_stack, split_right_stickman,
 *         split_equal, grid_2x1, overlay_fullscreen_text
 * V2 8: center_hero, triple_horizontal, triple_top_bottom, grid_2x2, grid_3x1,
 *       overlay_spotlight, stickman_center_text_sides, icon_grid
 * V3 7: overlay_picture_in_picture, diagonal_split, pyramid_layout, circular_layout,
 *       timeline_horizontal, comparison_table, floating_elements
 */

import { LayoutPreset, LayoutSlot, LayoutRole, LayoutAnchor } from './types';

// Canvas dimensions (1920x1080)
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const CENTER_X = CANVAS_WIDTH / 2;  // 960
const CENTER_Y = CANVAS_HEIGHT / 2; // 540

// Common margins and spacing
const MARGIN = 100;
const SPACING = 50;

// ============================================================================
// MVP LAYOUT PRESETS (10)
// ============================================================================

/**
 * 1. center_single - Single element centered
 */
const center_single: LayoutPreset = {
  name: 'center_single',
  description: 'Single element positioned at center',
  minElements: 1,
  maxElements: 1,
  slots: [
    { role: 'primary', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
  ],
};

/**
 * 2. split_left_stickman - Stickman on left, content on right
 */
const split_left_stickman: LayoutPreset = {
  name: 'split_left_stickman',
  description: 'Stickman on left side, main content on right',
  minElements: 2,
  maxElements: 3,
  slots: [
    { role: 'stickman', position: { x: 350, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
    { role: 'text', position: { x: 1150, y: CENTER_Y - 50 }, anchor: 'center', maxWidth: 700 },
    { role: 'secondary', position: { x: 1150, y: CENTER_Y + 150 }, anchor: 'center', maxWidth: 700 },
  ],
};

/**
 * 3. triple_stickman_text_counter - Stickman left, text top-center, counter bottom-center
 */
const triple_stickman_text_counter: LayoutPreset = {
  name: 'triple_stickman_text_counter',
  description: 'Stickman left, text top-center, counter bottom-center',
  minElements: 3,
  maxElements: 3,
  slots: [
    { role: 'stickman', position: { x: 300, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
    { role: 'text', position: { x: 1100, y: 350 }, anchor: 'center', maxWidth: 800 },
    { role: 'counter', position: { x: 1100, y: 650 }, anchor: 'center', scale: 1.2 },
  ],
};

/**
 * 4. triple_stickman_icon_text - Stickman left, icon center, text bottom
 */
const triple_stickman_icon_text: LayoutPreset = {
  name: 'triple_stickman_icon_text',
  description: 'Stickman left, icon center, text at bottom',
  minElements: 3,
  maxElements: 3,
  slots: [
    { role: 'stickman', position: { x: 300, y: CENTER_Y - 50 }, anchor: 'center', scale: 1.0 },
    { role: 'icon', position: { x: 1100, y: 350 }, anchor: 'center', scale: 1.5 },
    { role: 'text', position: { x: 1100, y: 650 }, anchor: 'center', maxWidth: 700 },
  ],
};

/**
 * 5. text_only - Text centered on screen
 */
const text_only: LayoutPreset = {
  name: 'text_only',
  description: 'Text centered for emphasis',
  minElements: 1,
  maxElements: 2,
  slots: [
    { role: 'title', position: { x: CENTER_X, y: CENTER_Y - 50 }, anchor: 'center', maxWidth: 1200 },
    { role: 'subtitle', position: { x: CENTER_X, y: CENTER_Y + 100 }, anchor: 'center', maxWidth: 1000, opacity: 0.8 },
  ],
};

/**
 * 6. center_stack - Elements stacked vertically at center
 */
const center_stack: LayoutPreset = {
  name: 'center_stack',
  description: 'Elements stacked vertically at center',
  minElements: 2,
  maxElements: 4,
  slots: [
    { role: 'primary', position: { x: CENTER_X, y: 250 }, anchor: 'center' },
    { role: 'secondary', position: { x: CENTER_X, y: 450 }, anchor: 'center' },
    { role: 'tertiary', position: { x: CENTER_X, y: 650 }, anchor: 'center' },
    { role: 'any', position: { x: CENTER_X, y: 850 }, anchor: 'center' },
  ],
};

/**
 * 7. split_right_stickman - Content on left, stickman on right
 */
const split_right_stickman: LayoutPreset = {
  name: 'split_right_stickman',
  description: 'Main content on left, stickman on right',
  minElements: 2,
  maxElements: 3,
  slots: [
    { role: 'text', position: { x: 700, y: CENTER_Y - 50 }, anchor: 'center', maxWidth: 700 },
    { role: 'secondary', position: { x: 700, y: CENTER_Y + 150 }, anchor: 'center', maxWidth: 700 },
    { role: 'stickman', position: { x: 1550, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
  ],
};

/**
 * 8. split_equal - Left and right equal size
 */
const split_equal: LayoutPreset = {
  name: 'split_equal',
  description: 'Two elements split equally left and right',
  minElements: 2,
  maxElements: 2,
  slots: [
    { role: 'primary', position: { x: 480, y: CENTER_Y }, anchor: 'center', maxWidth: 700 },
    { role: 'secondary', position: { x: 1440, y: CENTER_Y }, anchor: 'center', maxWidth: 700 },
  ],
};

/**
 * 9. grid_2x1 - Two columns, one row
 */
const grid_2x1: LayoutPreset = {
  name: 'grid_2x1',
  description: 'Two-column grid layout',
  minElements: 2,
  maxElements: 2,
  slots: [
    { role: 'item1', position: { x: 530, y: CENTER_Y }, anchor: 'center', maxWidth: 600 },
    { role: 'item2', position: { x: 1390, y: CENTER_Y }, anchor: 'center', maxWidth: 600 },
  ],
};

/**
 * 10. overlay_fullscreen_text - Full-screen text overlay
 */
const overlay_fullscreen_text: LayoutPreset = {
  name: 'overlay_fullscreen_text',
  description: 'Full-screen text overlay for emphasis',
  minElements: 1,
  maxElements: 2,
  slots: [
    { role: 'title', position: { x: CENTER_X, y: CENTER_Y - 30 }, anchor: 'center', maxWidth: 1600, scale: 1.5 },
    { role: 'subtitle', position: { x: CENTER_X, y: CENTER_Y + 150 }, anchor: 'center', maxWidth: 1400, opacity: 0.7 },
  ],
};

// ============================================================================
// V2 LAYOUT PRESETS (8)
// ============================================================================

/**
 * 11. center_hero - Large center element with smaller side elements
 */
const center_hero: LayoutPreset = {
  name: 'center_hero',
  description: 'Large center element with smaller side elements',
  minElements: 1,
  maxElements: 3,
  slots: [
    { role: 'hero', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.3 },
    { role: 'secondary', position: { x: 250, y: CENTER_Y }, anchor: 'center', scale: 0.7, opacity: 0.6 },
    { role: 'tertiary', position: { x: 1670, y: CENTER_Y }, anchor: 'center', scale: 0.7, opacity: 0.6 },
  ],
};

/**
 * 12. triple_horizontal - Three elements equally spaced horizontally
 */
const triple_horizontal: LayoutPreset = {
  name: 'triple_horizontal',
  description: 'Three elements equally spaced horizontally',
  minElements: 3,
  maxElements: 3,
  slots: [
    { role: 'item1', position: { x: 320, y: CENTER_Y }, anchor: 'center' },
    { role: 'item2', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center' },
    { role: 'item3', position: { x: 1600, y: CENTER_Y }, anchor: 'center' },
  ],
};

/**
 * 13. triple_top_bottom - Title top, content middle, footer bottom
 */
const triple_top_bottom: LayoutPreset = {
  name: 'triple_top_bottom',
  description: 'Title top, content middle, supplementary bottom',
  minElements: 2,
  maxElements: 3,
  slots: [
    { role: 'title', position: { x: CENTER_X, y: 150 }, anchor: 'center', maxWidth: 1400 },
    { role: 'primary', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
    { role: 'secondary', position: { x: CENTER_X, y: 900 }, anchor: 'center', maxWidth: 1200, opacity: 0.8 },
  ],
};

/**
 * 14. grid_2x2 - Four elements in a 2x2 grid
 */
const grid_2x2: LayoutPreset = {
  name: 'grid_2x2',
  description: 'Four elements in a 2x2 grid',
  minElements: 4,
  maxElements: 4,
  slots: [
    { role: 'item1', position: { x: 530, y: 320 }, anchor: 'center', maxWidth: 500 },
    { role: 'item2', position: { x: 1390, y: 320 }, anchor: 'center', maxWidth: 500 },
    { role: 'item3', position: { x: 530, y: 760 }, anchor: 'center', maxWidth: 500 },
    { role: 'item4', position: { x: 1390, y: 760 }, anchor: 'center', maxWidth: 500 },
  ],
};

/**
 * 15. grid_3x1 - Three columns, one row
 */
const grid_3x1: LayoutPreset = {
  name: 'grid_3x1',
  description: 'Three-column grid layout',
  minElements: 3,
  maxElements: 3,
  slots: [
    { role: 'item1', position: { x: 320, y: CENTER_Y }, anchor: 'center', maxWidth: 450 },
    { role: 'item2', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', maxWidth: 450 },
    { role: 'item3', position: { x: 1600, y: CENTER_Y }, anchor: 'center', maxWidth: 450 },
  ],
};

/**
 * 16. overlay_spotlight - Center spotlight with dimmed background
 */
const overlay_spotlight: LayoutPreset = {
  name: 'overlay_spotlight',
  description: 'Center spotlight with dimmed background elements',
  minElements: 1,
  maxElements: 3,
  slots: [
    { role: 'hero', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.2, layer: 10 },
    { role: 'background', position: { x: 300, y: 300 }, anchor: 'center', scale: 0.6, opacity: 0.3, layer: 1 },
    { role: 'background', position: { x: 1620, y: 780 }, anchor: 'center', scale: 0.6, opacity: 0.3, layer: 1 },
  ],
};

/**
 * 17. stickman_center_text_sides - Stickman in center with text on both sides
 */
const stickman_center_text_sides: LayoutPreset = {
  name: 'stickman_center_text_sides',
  description: 'Stickman in center with text elements on both sides',
  minElements: 3,
  maxElements: 5,
  slots: [
    { role: 'stickman', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
    { role: 'item1', position: { x: 280, y: 350 }, anchor: 'center', maxWidth: 400 },
    { role: 'item2', position: { x: 280, y: 650 }, anchor: 'center', maxWidth: 400 },
    { role: 'item3', position: { x: 1640, y: 350 }, anchor: 'center', maxWidth: 400 },
    { role: 'item4', position: { x: 1640, y: 650 }, anchor: 'center', maxWidth: 400 },
  ],
};

/**
 * 18. icon_grid - Grid of icons
 */
const icon_grid: LayoutPreset = {
  name: 'icon_grid',
  description: 'Grid of icons for feature display',
  minElements: 4,
  maxElements: 6,
  slots: [
    { role: 'title', position: { x: CENTER_X, y: 120 }, anchor: 'center', maxWidth: 1200 },
    { role: 'item1', position: { x: 480, y: 400 }, anchor: 'center', scale: 1.2 },
    { role: 'item2', position: { x: CENTER_X, y: 400 }, anchor: 'center', scale: 1.2 },
    { role: 'item3', position: { x: 1440, y: 400 }, anchor: 'center', scale: 1.2 },
    { role: 'item4', position: { x: 480, y: 700 }, anchor: 'center', scale: 1.2 },
    { role: 'item5', position: { x: CENTER_X, y: 700 }, anchor: 'center', scale: 1.2 },
  ],
};

// ============================================================================
// V3 LAYOUT PRESETS (7)
// ============================================================================

/**
 * 19. overlay_picture_in_picture - Main content with small stickman in corner
 */
const overlay_picture_in_picture: LayoutPreset = {
  name: 'overlay_picture_in_picture',
  description: 'Main content with small stickman in corner (PiP style)',
  minElements: 2,
  maxElements: 3,
  slots: [
    { role: 'primary', position: { x: CENTER_X - 100, y: CENTER_Y }, anchor: 'center', scale: 1.0, maxWidth: 1200 },
    { role: 'stickman', position: { x: 1680, y: 850 }, anchor: 'center', scale: 0.5, layer: 20 },
    { role: 'secondary', position: { x: CENTER_X - 100, y: 850 }, anchor: 'center', maxWidth: 1000, opacity: 0.8 },
  ],
};

/**
 * 20. diagonal_split - Diagonal split layout
 */
const diagonal_split: LayoutPreset = {
  name: 'diagonal_split',
  description: 'Screen split diagonally with content on each side',
  minElements: 2,
  maxElements: 4,
  slots: [
    { role: 'primary', position: { x: 500, y: 350 }, anchor: 'center', maxWidth: 600 },
    { role: 'secondary', position: { x: 1420, y: 730 }, anchor: 'center', maxWidth: 600 },
    { role: 'stickman', position: { x: 350, y: 750 }, anchor: 'center', scale: 0.9 },
    { role: 'icon', position: { x: 1550, y: 280 }, anchor: 'center', scale: 1.2 },
  ],
};

/**
 * 21. pyramid_layout - Elements in pyramid shape
 */
const pyramid_layout: LayoutPreset = {
  name: 'pyramid_layout',
  description: 'Elements arranged in a pyramid pattern',
  minElements: 3,
  maxElements: 6,
  slots: [
    { role: 'hero', position: { x: CENTER_X, y: 200 }, anchor: 'center', scale: 1.2 },
    { role: 'item1', position: { x: 530, y: 480 }, anchor: 'center' },
    { role: 'item2', position: { x: 1390, y: 480 }, anchor: 'center' },
    { role: 'item3', position: { x: 320, y: 780 }, anchor: 'center', scale: 0.9 },
    { role: 'item4', position: { x: CENTER_X, y: 780 }, anchor: 'center', scale: 0.9 },
    { role: 'item5', position: { x: 1600, y: 780 }, anchor: 'center', scale: 0.9 },
  ],
};

/**
 * 22. circular_layout - Elements arranged in a circle
 */
const circular_layout: LayoutPreset = {
  name: 'circular_layout',
  description: 'Elements arranged in a circular pattern around center',
  minElements: 4,
  maxElements: 6,
  slots: [
    { role: 'hero', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
    { role: 'item1', position: { x: CENTER_X, y: 200 }, anchor: 'center', scale: 0.8 },
    { role: 'item2', position: { x: 1500, y: 400 }, anchor: 'center', scale: 0.8 },
    { role: 'item3', position: { x: 1400, y: 780 }, anchor: 'center', scale: 0.8 },
    { role: 'item4', position: { x: 520, y: 780 }, anchor: 'center', scale: 0.8 },
    { role: 'item5', position: { x: 420, y: 400 }, anchor: 'center', scale: 0.8 },
  ],
};

/**
 * 23. timeline_horizontal - Horizontal timeline with items
 */
const timeline_horizontal: LayoutPreset = {
  name: 'timeline_horizontal',
  description: 'Horizontal timeline with elements above and below line',
  minElements: 3,
  maxElements: 6,
  slots: [
    { role: 'title', position: { x: CENTER_X, y: 100 }, anchor: 'center', maxWidth: 1400 },
    { role: 'item1', position: { x: 300, y: 350 }, anchor: 'center', maxWidth: 300 },
    { role: 'item2', position: { x: 660, y: 700 }, anchor: 'center', maxWidth: 300 },
    { role: 'item3', position: { x: 1020, y: 350 }, anchor: 'center', maxWidth: 300 },
    { role: 'item4', position: { x: 1380, y: 700 }, anchor: 'center', maxWidth: 300 },
    { role: 'item5', position: { x: 1680, y: 350 }, anchor: 'center', maxWidth: 300 },
  ],
};

/**
 * 24. comparison_table - Table-style comparison layout
 */
const comparison_table: LayoutPreset = {
  name: 'comparison_table',
  description: 'Table-style comparison with headers and rows',
  minElements: 3,
  maxElements: 7,
  slots: [
    { role: 'title', position: { x: CENTER_X, y: 100 }, anchor: 'center', maxWidth: 1400 },
    { role: 'item1', position: { x: 530, y: 280 }, anchor: 'center', maxWidth: 500, scale: 1.1 },
    { role: 'item2', position: { x: 1390, y: 280 }, anchor: 'center', maxWidth: 500, scale: 1.1 },
    { role: 'item3', position: { x: 530, y: 500 }, anchor: 'center', maxWidth: 500 },
    { role: 'item4', position: { x: 1390, y: 500 }, anchor: 'center', maxWidth: 500 },
    { role: 'item5', position: { x: 530, y: 720 }, anchor: 'center', maxWidth: 500 },
    { role: 'item6', position: { x: 1390, y: 720 }, anchor: 'center', maxWidth: 500 },
  ],
};

/**
 * 25. floating_elements - Elements floating at various positions
 */
const floating_elements: LayoutPreset = {
  name: 'floating_elements',
  description: 'Elements floating at various positions with different scales',
  minElements: 4,
  maxElements: 6,
  slots: [
    { role: 'hero', position: { x: CENTER_X, y: CENTER_Y }, anchor: 'center', scale: 1.0 },
    { role: 'item1', position: { x: 250, y: 250 }, anchor: 'center', scale: 0.7, opacity: 0.9 },
    { role: 'item2', position: { x: 1650, y: 200 }, anchor: 'center', scale: 0.8, opacity: 0.85 },
    { role: 'item3', position: { x: 400, y: 750 }, anchor: 'center', scale: 0.75, opacity: 0.9 },
    { role: 'item4', position: { x: 1500, y: 800 }, anchor: 'center', scale: 0.7, opacity: 0.85 },
    { role: 'item5', position: { x: 1700, y: 500 }, anchor: 'center', scale: 0.65, opacity: 0.8 },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All layout presets indexed by name
 */
export const LAYOUT_PRESETS: Record<string, LayoutPreset> = {
  // MVP (10)
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
  // V2 (8)
  center_hero,
  triple_horizontal,
  triple_top_bottom,
  grid_2x2,
  grid_3x1,
  overlay_spotlight,
  stickman_center_text_sides,
  icon_grid,
  // V3 (7)
  overlay_picture_in_picture,
  diagonal_split,
  pyramid_layout,
  circular_layout,
  timeline_horizontal,
  comparison_table,
  floating_elements,
};

/**
 * Array of all layout preset names
 */
export const LAYOUT_NAMES = Object.keys(LAYOUT_PRESETS) as string[];

/**
 * Get a layout preset by name
 */
export const getLayoutPreset = (name: string): LayoutPreset | undefined => {
  return LAYOUT_PRESETS[name];
};

/**
 * Check if a layout preset exists
 */
export const hasLayoutPreset = (name: string): boolean => {
  return name in LAYOUT_PRESETS;
};

/**
 * Get slot by role from a layout
 */
export const getSlotByRole = (preset: LayoutPreset, role: LayoutRole): LayoutSlot | undefined => {
  return preset.slots.find(slot => slot.role === role);
};

/**
 * Get all slots that match a role
 */
export const getSlotsByRole = (preset: LayoutPreset, role: LayoutRole): LayoutSlot[] => {
  return preset.slots.filter(slot => slot.role === role);
};

/**
 * Calculate absolute position from slot
 */
export const resolveSlotPosition = (
  slot: LayoutSlot,
  elementWidth: number = 0,
  elementHeight: number = 0
): { x: number; y: number } => {
  let x = slot.position.x;
  let y = slot.position.y;

  // Adjust for anchor
  switch (slot.anchor) {
    case 'left':
      // Position is at left edge, no adjustment needed
      break;
    case 'right':
      x -= elementWidth;
      break;
    case 'top':
      // Position is at top edge
      break;
    case 'bottom':
      y -= elementHeight;
      break;
    case 'top-left':
      // No adjustment
      break;
    case 'top-right':
      x -= elementWidth;
      break;
    case 'bottom-left':
      y -= elementHeight;
      break;
    case 'bottom-right':
      x -= elementWidth;
      y -= elementHeight;
      break;
    case 'center':
    default:
      x -= elementWidth / 2;
      y -= elementHeight / 2;
      break;
  }

  return { x, y };
};

// MVP preset names for easy reference
export const MVP_LAYOUT_NAMES = [
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
] as const;

// V2 preset names for easy reference
export const V2_LAYOUT_NAMES = [
  'center_hero',
  'triple_horizontal',
  'triple_top_bottom',
  'grid_2x2',
  'grid_3x1',
  'overlay_spotlight',
  'stickman_center_text_sides',
  'icon_grid',
] as const;

// V3 preset names for easy reference
export const V3_LAYOUT_NAMES = [
  'overlay_picture_in_picture',
  'diagonal_split',
  'pyramid_layout',
  'circular_layout',
  'timeline_horizontal',
  'comparison_table',
  'floating_elements',
] as const;
