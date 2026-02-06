// Expression definitions for StickMan face
// All expressions use simple SVG primitives inside the head circle

export type EyeStyle = 'dot' | 'circle' | 'closed' | 'wink' | 'angry_left' | 'angry_right' | 'worried_left' | 'worried_right';
export type MouthStyle = 'line' | 'smile' | 'frown' | 'circle' | 'wavy' | 'wide_smile' | 'angry';

export interface Expression {
  leftEye: EyeStyle;
  rightEye: EyeStyle;
  mouth: MouthStyle;
  // Optional modifiers
  eyeSize?: number;      // multiplier, default 1
  mouthSize?: number;    // multiplier, default 1
}

// 5 Required expression presets for MVP
export const EXPRESSIONS: Record<string, Expression> = {
  // Neutral - dot eyes, line mouth
  neutral: {
    leftEye: 'dot',
    rightEye: 'dot',
    mouth: 'line',
  },

  // Happy - dot eyes, smile arc mouth
  happy: {
    leftEye: 'dot',
    rightEye: 'dot',
    mouth: 'smile',
  },

  // Sad - dot eyes, frown arc mouth
  sad: {
    leftEye: 'dot',
    rightEye: 'dot',
    mouth: 'frown',
  },

  // Surprised - circle eyes, circle mouth
  surprised: {
    leftEye: 'circle',
    rightEye: 'circle',
    mouth: 'circle',
    eyeSize: 1.5,
    mouthSize: 0.8,
  },

  // Thinking - dot eyes, wavy mouth
  thinking: {
    leftEye: 'dot',
    rightEye: 'dot',
    mouth: 'wavy',
  },

  // ============================================
  // MVP 표정 (3개)
  // ============================================

  // Excited - big circle eyes, wide smile
  excited: {
    leftEye: 'circle',
    rightEye: 'circle',
    mouth: 'wide_smile',
    eyeSize: 1.3,
    mouthSize: 1.2,
  },

  // Focused - closed/squinting eyes, line mouth
  focused: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'line',
  },

  // Angry - angled eyebrows implied by eye style, angry mouth
  angry: {
    leftEye: 'angry_left',
    rightEye: 'angry_right',
    mouth: 'angry',
    eyeSize: 0.9,
  },

  // ============================================
  // V2 표정 (4개)
  // ============================================

  // Proud - closed/content eyes, subtle smile
  proud: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'smile',
    mouthSize: 0.8,
  },

  // Sleepy - closed eyes, circle mouth (yawning)
  sleepy: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'circle',
    eyeSize: 1.2,
    mouthSize: 1.2,
  },

  // Confused - one eye different, wavy mouth
  confused: {
    leftEye: 'circle',
    rightEye: 'dot',
    mouth: 'wavy',
    eyeSize: 1.1,
  },

  // Worried - angled brow eyes, frown
  worried: {
    leftEye: 'worried_left',
    rightEye: 'worried_right',
    mouth: 'frown',
  },
};

// Default expression
export const DEFAULT_EXPRESSION = EXPRESSIONS.neutral;

// Get expression by name, falling back to neutral
export function getExpression(name: string): Expression {
  return EXPRESSIONS[name] ?? DEFAULT_EXPRESSION;
}

// List of all available expression names
export const EXPRESSION_NAMES = Object.keys(EXPRESSIONS);
