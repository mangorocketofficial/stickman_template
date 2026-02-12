// Expression definitions for StickMan face
// All expressions use simple SVG primitives inside the head circle

export type EyeStyle = 'dot' | 'circle' | 'closed' | 'wink' | 'squint' | 'wide' | 'tear' | 'angry' | 'heart';
export type MouthStyle = 'line' | 'smile' | 'frown' | 'circle' | 'wavy' | 'grin' | 'open' | 'teeth' | 'tongue';

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
  // L1 V3 추가 표정 (15개)
  // ============================================

  // === 긍정적 표정 (3개) ===

  // Excited - 흥분
  excited: {
    leftEye: 'wide',
    rightEye: 'wide',
    mouth: 'grin',
    eyeSize: 1.3,
    mouthSize: 1.2,
  },

  // Proud - 자랑스러움
  proud: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'smile',
    mouthSize: 1.1,
  },

  // Loving - 사랑
  loving: {
    leftEye: 'heart',
    rightEye: 'heart',
    mouth: 'smile',
    eyeSize: 1.2,
  },

  // === 중립적 표정 (3개) ===

  // Focused - 집중
  focused: {
    leftEye: 'squint',
    rightEye: 'squint',
    mouth: 'line',
    eyeSize: 0.8,
  },

  // Sleepy - 졸림
  sleepy: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'line',
    mouthSize: 0.7,
  },

  // Blank - 멍함
  blank: {
    leftEye: 'dot',
    rightEye: 'dot',
    mouth: 'line',
    eyeSize: 0.7,
    mouthSize: 0.6,
  },

  // === 부정적 표정 (5개) ===

  // Angry - 화남
  angry: {
    leftEye: 'angry',
    rightEye: 'angry',
    mouth: 'frown',
    eyeSize: 0.9,
    mouthSize: 0.9,
  },

  // Confused - 혼란
  confused: {
    leftEye: 'circle',
    rightEye: 'squint',
    mouth: 'wavy',
    eyeSize: 1.1,
  },

  // Worried - 걱정
  worried: {
    leftEye: 'wide',
    rightEye: 'wide',
    mouth: 'frown',
    eyeSize: 1.1,
    mouthSize: 0.9,
  },

  // Crying - 울음
  crying: {
    leftEye: 'tear',
    rightEye: 'tear',
    mouth: 'frown',
    eyeSize: 0.9,
    mouthSize: 1.1,
  },

  // Embarrassed - 당황
  embarrassed: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'wavy',
    mouthSize: 0.8,
  },

  // === 추가 표정 (4개) ===

  // Winking - 윙크
  winking: {
    leftEye: 'dot',
    rightEye: 'wink',
    mouth: 'smile',
  },

  // Laughing - 웃음
  laughing: {
    leftEye: 'closed',
    rightEye: 'closed',
    mouth: 'open',
    mouthSize: 1.3,
  },

  // Determined - 결의
  determined: {
    leftEye: 'squint',
    rightEye: 'squint',
    mouth: 'line',
    eyeSize: 1.0,
    mouthSize: 1.0,
  },

  // Silly - 익살
  silly: {
    leftEye: 'dot',
    rightEye: 'wink',
    mouth: 'tongue',
    mouthSize: 1.1,
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
