/**
 * Centralized constants for the Remotion video project
 * All magic numbers and default values should be defined here
 */

// =============================================================================
// CANVAS DIMENSIONS
// =============================================================================

export const CANVAS = {
  WIDTH: 1920,
  HEIGHT: 1080,
  CENTER_X: 1920 / 2,  // 960
  CENTER_Y: 1080 / 2,  // 540
} as const;

// =============================================================================
// SAFE AREA & MARGINS
// =============================================================================

export const LAYOUT = {
  MARGIN: 100,
  SAFE_AREA: {
    left: 100,
    right: 1920 - 100,  // 1820
    top: 100,
    bottom: 1080 - 100, // 980
  },
} as const;

// =============================================================================
// COMMON POSITIONS
// =============================================================================

export const POSITIONS = {
  // Center positions
  center: { x: 960, y: 540 },
  centerTop: { x: 960, y: 250 },
  centerMid: { x: 960, y: 450 },
  centerBottom: { x: 960, y: 880 },

  // Left side
  left: { x: 350, y: 540 },
  leftBottom: { x: 300, y: 600 },
  leftTop: { x: 350, y: 300 },

  // Right side
  right: { x: 1570, y: 540 },
  rightTop: { x: 1100, y: 350 },
  rightBottom: { x: 1570, y: 700 },

  // Stickman typical positions
  stickmanCenter: { x: 960, y: 600 },
  stickmanLeft: { x: 350, y: 600 },
  stickmanRight: { x: 1570, y: 600 },
} as const;

// =============================================================================
// ANIMATION DURATIONS (in milliseconds)
// =============================================================================

export const ANIMATION = {
  // Enter animations
  ENTER: {
    fadeIn: 500,
    fadeInUp: 600,
    slideLeft: 500,
    slideRight: 500,
    popIn: 400,
    typewriter: 1000,
    drawLine: 800,
    none: 0,
  },

  // During (loop) animations - cycle duration
  DURING: {
    floating: 2000,
    pulse: 1500,
    breathing: 2000,
    nodding: 600,
    waving: 500,
    walkCycle: 800,
    poseSequence: 0, // Variable
    none: 0,
  },

  // Exit animations
  EXIT: {
    fadeOut: 300,
    none: 0,
  },

  // Default values
  DEFAULT_ENTER_DURATION: 500,
  DEFAULT_EXIT_DURATION: 300,
  DEFAULT_DURING_CYCLE: 2000,
} as const;

// =============================================================================
// SPRING CONFIGS (for Remotion spring animations)
// =============================================================================

export const SPRING_CONFIGS = {
  popIn: {
    damping: 12,
    stiffness: 200,
    mass: 0.5,
  },
  bounce: {
    damping: 8,
    stiffness: 150,
    mass: 0.8,
  },
  smooth: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
} as const;

// =============================================================================
// TEXT DEFAULTS
// =============================================================================

export const TEXT = {
  DEFAULT_FONT_SIZE: 48,
  DEFAULT_FONT_WEIGHT: 'normal',
  DEFAULT_COLOR: '#FFFFFF',
  DEFAULT_MAX_WIDTH: 800,
  DEFAULT_ALIGN: 'center',
  LINE_HEIGHT: 1.4,
  FONT_FAMILY: 'sans-serif',
} as const;

// =============================================================================
// COUNTER DEFAULTS
// =============================================================================

export const COUNTER = {
  DEFAULT_FONT_SIZE: 64,
  DEFAULT_COLOR: '#FFFFFF',
  FONT_FAMILY: 'monospace',
  LETTER_SPACING: '0.02em',
} as const;

// =============================================================================
// ICON DEFAULTS
// =============================================================================

export const ICON = {
  DEFAULT_SIZE: 80,
  DEFAULT_COLOR: '#FFFFFF',
  DEFAULT_ENTER_ANIMATION: 'popIn',
  DEFAULT_DURING_ANIMATION: 'floating',
} as const;

// =============================================================================
// SHAPE DEFAULTS
// =============================================================================

export const SHAPE = {
  DEFAULT_WIDTH: 100,
  DEFAULT_HEIGHT: 100,
  DEFAULT_COLOR: '#FFFFFF',
  DEFAULT_STROKE_WIDTH: 3,
  ARROW_HEAD_LENGTH: 15,
  ARROW_HEAD_ANGLE: Math.PI / 6,
} as const;

// =============================================================================
// STICKMAN DEFAULTS
// =============================================================================

export const STICKMAN = {
  DEFAULT_POSE: 'standing',
  DEFAULT_EXPRESSION: 'neutral',
  DEFAULT_COLOR: '#FFFFFF',
  DEFAULT_SCALE: 1,
} as const;

// =============================================================================
// SUBTITLE DEFAULTS
// =============================================================================

export const SUBTITLE = {
  DEFAULT_POSITION: 'bottom',
  DEFAULT_FONT_SIZE: 36,
  DEFAULT_BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.7)',
  DEFAULT_TEXT_COLOR: '#FFFFFF',
  DEFAULT_HIGHLIGHT_COLOR: '#FFD700',
  DEFAULT_PADDING: { horizontal: 20, vertical: 10 },
  BOTTOM_OFFSET: 80,
} as const;

// =============================================================================
// THEME DEFAULTS (for future Track B)
// =============================================================================

export const THEME = {
  DEFAULT_BACKGROUND: '#1a1a2e',
  DEFAULT_TEXT_COLOR: '#FFFFFF',
  DEFAULT_ACCENT_COLOR: '#FFD700',
  DEFAULT_SECONDARY_COLOR: '#4FC3F7',
} as const;

// =============================================================================
// VIDEO DEFAULTS
// =============================================================================

export const VIDEO = {
  DEFAULT_FPS: 30,
  DEFAULT_DURATION_FRAMES: 900, // 30 seconds at 30fps
} as const;

// =============================================================================
// WHITEBOARD DEFAULTS
// =============================================================================

export const WHITEBOARD = {
  BACKGROUND_COLOR: '#FAFAFA',
  KEYWORD_FONT_SIZE: 96,
  DESCRIPTION_FONT_SIZE: 48,
  TEXT_COLOR: '#1A1A2E',
  SECONDARY_TEXT_COLOR: '#444444',
  HIGHLIGHT_COLOR: '#FFE082',
  CURSOR_COLOR: '#1A1A2E',
  FONT_FAMILY_HANDWRITING: '"Nanum Pen Script", cursive',
  FONT_FAMILY_TYPING: '"Noto Sans KR", sans-serif',
} as const;

// =============================================================================
// TYPE EXPORTS (for type safety)
// =============================================================================

export type EnterAnimationType = keyof typeof ANIMATION.ENTER;
export type DuringAnimationType = keyof typeof ANIMATION.DURING;
export type ExitAnimationType = keyof typeof ANIMATION.EXIT;
export type Position = { x: number; y: number };
