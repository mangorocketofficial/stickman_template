/**
 * Auto-layout helpers for positioning scene objects
 */

import { SceneObject } from '../types/schema';

// Canvas dimensions (default)
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// Margins and safe areas
const MARGIN = 100;
const SAFE_AREA = {
  left: MARGIN,
  right: CANVAS_WIDTH - MARGIN,
  top: MARGIN,
  bottom: CANVAS_HEIGHT - MARGIN,
};

// Common positions
export const POSITIONS = {
  center: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
  centerTop: { x: CANVAS_WIDTH / 2, y: 250 },
  centerMid: { x: CANVAS_WIDTH / 2, y: 450 },
  centerBottom: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 200 },
  left: { x: 350, y: CANVAS_HEIGHT / 2 },
  leftBottom: { x: 300, y: 600 },
  right: { x: CANVAS_WIDTH - 350, y: CANVAS_HEIGHT / 2 },
  rightTop: { x: 1100, y: 350 },
};

// Layout patterns based on object combinations
export type LayoutPattern =
  | 'stickman_only'
  | 'stickman_text'
  | 'stickman_text_counter'
  | 'stickman_text_icon'
  | 'text_only';

/**
 * Detect which layout pattern to use based on object types
 */
export const detectLayoutPattern = (objects: SceneObject[]): LayoutPattern => {
  const types = objects.map((obj) => obj.type);
  const hasStickman = types.includes('stickman');
  const hasText = types.includes('text');
  const hasCounter = types.includes('counter');
  const hasIcon = types.includes('icon');

  if (hasStickman && hasText && hasCounter) return 'stickman_text_counter';
  if (hasStickman && hasText && hasIcon) return 'stickman_text_icon';
  if (hasStickman && hasText) return 'stickman_text';
  if (hasStickman) return 'stickman_only';
  return 'text_only';
};

/**
 * Get auto-layout position for an object based on pattern
 */
export const getAutoLayoutPosition = (
  objectType: SceneObject['type'],
  pattern: LayoutPattern,
  index: number
): { x: number; y: number } => {
  switch (pattern) {
    case 'stickman_only':
      if (objectType === 'stickman') return { x: 960, y: 600 };
      break;

    case 'stickman_text':
      if (objectType === 'stickman') return { x: 350, y: 600 };
      if (objectType === 'text') return { x: 1100, y: 350 };
      break;

    case 'stickman_text_counter':
      if (objectType === 'stickman') return { x: 300, y: 600 };
      if (objectType === 'text') return { x: 960, y: 250 };
      if (objectType === 'counter') return { x: 960, y: 450 };
      break;

    case 'stickman_text_icon':
      if (objectType === 'stickman') return { x: 300, y: 600 };
      if (objectType === 'icon') return { x: 960, y: 300 };
      if (objectType === 'text') return { x: 960, y: 500 };
      break;

    case 'text_only':
      if (objectType === 'text') return { x: 960, y: 400 };
      break;
  }

  // Default center position
  return POSITIONS.center;
};

/**
 * Calculate bounding box for text
 */
export const getTextBounds = (
  text: string,
  fontSize: number,
  maxWidth: number
): { width: number; height: number } => {
  // Approximate calculation
  const charWidth = fontSize * 0.6;
  const lineHeight = fontSize * 1.4;
  const textWidth = Math.min(text.length * charWidth, maxWidth);
  const lines = Math.ceil((text.length * charWidth) / maxWidth);
  const textHeight = lines * lineHeight;

  return { width: textWidth, height: textHeight };
};

/**
 * Check if position is within safe area
 */
export const isWithinSafeArea = (
  x: number,
  y: number,
  width: number = 0,
  height: number = 0
): boolean => {
  return (
    x - width / 2 >= SAFE_AREA.left &&
    x + width / 2 <= SAFE_AREA.right &&
    y - height / 2 >= SAFE_AREA.top &&
    y + height / 2 <= SAFE_AREA.bottom
  );
};

/**
 * Clamp position to safe area
 */
export const clampToSafeArea = (
  x: number,
  y: number,
  width: number = 0,
  height: number = 0
): { x: number; y: number } => {
  const clampedX = Math.max(
    SAFE_AREA.left + width / 2,
    Math.min(SAFE_AREA.right - width / 2, x)
  );
  const clampedY = Math.max(
    SAFE_AREA.top + height / 2,
    Math.min(SAFE_AREA.bottom - height / 2, y)
  );

  return { x: clampedX, y: clampedY };
};
