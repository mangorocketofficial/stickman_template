// Expression definitions for StickMan face
// All expressions use simple SVG primitives inside the head circle

export type EyeStyle = 'dot' | 'circle' | 'closed' | 'wink';
export type MouthStyle = 'line' | 'smile' | 'frown' | 'circle' | 'wavy';

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
};

// Default expression
export const DEFAULT_EXPRESSION = EXPRESSIONS.neutral;

// Get expression by name, falling back to neutral
export function getExpression(name: string): Expression {
  return EXPRESSIONS[name] ?? DEFAULT_EXPRESSION;
}

// List of all available expression names
export const EXPRESSION_NAMES = Object.keys(EXPRESSIONS);
