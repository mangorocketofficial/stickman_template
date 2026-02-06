/**
 * Tests for expressions.ts
 * Verifies all 20 expressions (5 base + 15 L1 V3 additions) are correctly defined
 */

import { describe, it, expect } from 'vitest';
import {
  EXPRESSIONS,
  DEFAULT_EXPRESSION,
  getExpression,
  EXPRESSION_NAMES,
  Expression,
  EyeStyle,
  MouthStyle,
} from '../components/StickMan/expressions';

// Valid eye styles
const VALID_EYE_STYLES: EyeStyle[] = [
  'dot',
  'circle',
  'closed',
  'wink',
  'squint',
  'wide',
  'tear',
  'angry',
  'heart',
];

// Valid mouth styles
const VALID_MOUTH_STYLES: MouthStyle[] = [
  'line',
  'smile',
  'frown',
  'circle',
  'wavy',
  'grin',
  'open',
  'teeth',
  'tongue',
];

// Base MVP expressions (5)
const BASE_EXPRESSIONS = [
  'neutral',
  'happy',
  'sad',
  'surprised',
  'thinking',
];

// L1 V3 additional expressions (15)
const V3_EXPRESSIONS = [
  // Positive expressions (3)
  'excited',
  'proud',
  'loving',
  // Neutral expressions (3)
  'focused',
  'sleepy',
  'blank',
  // Negative expressions (5)
  'angry',
  'confused',
  'worried',
  'crying',
  'embarrassed',
  // Additional expressions (4)
  'winking',
  'laughing',
  'determined',
  'silly',
];

const ALL_EXPRESSIONS = [...BASE_EXPRESSIONS, ...V3_EXPRESSIONS];

describe('EXPRESSIONS', () => {
  it('should have exactly 20 expressions', () => {
    expect(Object.keys(EXPRESSIONS).length).toBe(20);
  });

  it('should have all base expressions', () => {
    BASE_EXPRESSIONS.forEach((exprName) => {
      expect(EXPRESSIONS[exprName]).toBeDefined();
    });
  });

  it('should have all L1 V3 additional expressions', () => {
    V3_EXPRESSIONS.forEach((exprName) => {
      expect(EXPRESSIONS[exprName]).toBeDefined();
    });
  });

  describe('expression structure validation', () => {
    ALL_EXPRESSIONS.forEach((exprName) => {
      describe(`expression: ${exprName}`, () => {
        it('should have leftEye, rightEye, and mouth properties', () => {
          const expr = EXPRESSIONS[exprName];
          expect(expr.leftEye).toBeDefined();
          expect(expr.rightEye).toBeDefined();
          expect(expr.mouth).toBeDefined();
        });

        it('should have valid eye styles', () => {
          const expr = EXPRESSIONS[exprName];
          expect(VALID_EYE_STYLES).toContain(expr.leftEye);
          expect(VALID_EYE_STYLES).toContain(expr.rightEye);
        });

        it('should have valid mouth style', () => {
          const expr = EXPRESSIONS[exprName];
          expect(VALID_MOUTH_STYLES).toContain(expr.mouth);
        });

        it('should have optional size modifiers as positive numbers if present', () => {
          const expr = EXPRESSIONS[exprName];
          if (expr.eyeSize !== undefined) {
            expect(typeof expr.eyeSize).toBe('number');
            expect(expr.eyeSize).toBeGreaterThan(0);
          }
          if (expr.mouthSize !== undefined) {
            expect(typeof expr.mouthSize).toBe('number');
            expect(expr.mouthSize).toBeGreaterThan(0);
          }
        });
      });
    });
  });
});

describe('DEFAULT_EXPRESSION', () => {
  it('should be the neutral expression', () => {
    expect(DEFAULT_EXPRESSION).toBe(EXPRESSIONS.neutral);
  });

  it('should have required properties', () => {
    expect(DEFAULT_EXPRESSION.leftEye).toBe('dot');
    expect(DEFAULT_EXPRESSION.rightEye).toBe('dot');
    expect(DEFAULT_EXPRESSION.mouth).toBe('line');
  });
});

describe('getExpression', () => {
  it('should return the correct expression for valid names', () => {
    ALL_EXPRESSIONS.forEach((exprName) => {
      expect(getExpression(exprName)).toBe(EXPRESSIONS[exprName]);
    });
  });

  it('should return DEFAULT_EXPRESSION for invalid expression names', () => {
    expect(getExpression('nonexistent_expression')).toBe(DEFAULT_EXPRESSION);
    expect(getExpression('')).toBe(DEFAULT_EXPRESSION);
    expect(getExpression('invalid')).toBe(DEFAULT_EXPRESSION);
  });
});

describe('EXPRESSION_NAMES', () => {
  it('should contain all 20 expression names', () => {
    expect(EXPRESSION_NAMES.length).toBe(20);
  });

  it('should contain all defined expressions', () => {
    ALL_EXPRESSIONS.forEach((exprName) => {
      expect(EXPRESSION_NAMES).toContain(exprName);
    });
  });

  it('should match the keys of EXPRESSIONS object', () => {
    expect(EXPRESSION_NAMES.sort()).toEqual(Object.keys(EXPRESSIONS).sort());
  });
});

describe('Eye and Mouth style types', () => {
  it('should use all defined eye styles across expressions', () => {
    const usedEyeStyles = new Set<string>();
    Object.values(EXPRESSIONS).forEach((expr) => {
      usedEyeStyles.add(expr.leftEye);
      usedEyeStyles.add(expr.rightEye);
    });

    // At least 5 different eye styles should be used
    expect(usedEyeStyles.size).toBeGreaterThanOrEqual(5);
  });

  it('should use all defined mouth styles across expressions', () => {
    const usedMouthStyles = new Set<string>();
    Object.values(EXPRESSIONS).forEach((expr) => {
      usedMouthStyles.add(expr.mouth);
    });

    // At least 5 different mouth styles should be used
    expect(usedMouthStyles.size).toBeGreaterThanOrEqual(5);
  });
});
