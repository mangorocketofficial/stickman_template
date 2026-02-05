/**
 * Auto-layout helpers for positioning scene objects
 *
 * Refactored to use centralized constants
 */

import { SceneObject } from '../types/schema';
import { CANVAS, LAYOUT, POSITIONS as CONST_POSITIONS } from '../constants';

// Re-export positions for backward compatibility
export const POSITIONS = CONST_POSITIONS;

// Re-export safe area for external use
export const SAFE_AREA = LAYOUT.SAFE_AREA;

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
      if (objectType === 'stickman') return CONST_POSITIONS.stickmanCenter;
      break;

    case 'stickman_text':
      if (objectType === 'stickman') return CONST_POSITIONS.stickmanLeft;
      if (objectType === 'text') return CONST_POSITIONS.rightTop;
      break;

    case 'stickman_text_counter':
      if (objectType === 'stickman') return CONST_POSITIONS.leftBottom;
      if (objectType === 'text') return CONST_POSITIONS.centerTop;
      if (objectType === 'counter') return CONST_POSITIONS.centerMid;
      break;

    case 'stickman_text_icon':
      if (objectType === 'stickman') return CONST_POSITIONS.leftBottom;
      if (objectType === 'icon') return { x: CANVAS.CENTER_X, y: 300 };
      if (objectType === 'text') return { x: CANVAS.CENTER_X, y: 500 };
      break;

    case 'text_only':
      if (objectType === 'text') return { x: CANVAS.CENTER_X, y: 400 };
      break;
  }

  // Default center position
  return CONST_POSITIONS.center;
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

/**
 * Get canvas dimensions
 */
export const getCanvasDimensions = () => ({
  width: CANVAS.WIDTH,
  height: CANVAS.HEIGHT,
});
