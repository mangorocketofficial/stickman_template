import { describe, it, expect } from 'vitest';
import {
  EXPRESSIONS,
  getExpression,
  EXPRESSION_NAMES,
  Expression,
  EyeStyle,
  MouthStyle,
} from '../expressions';

// Valid eye styles
const VALID_EYE_STYLES: EyeStyle[] = [
  'dot',
  'circle',
  'closed',
  'wink',
  'narrow',
  'angry',
];

// Valid mouth styles
const VALID_MOUTH_STYLES: MouthStyle[] = [
  'line',
  'smile',
  'frown',
  'circle',
  'wavy',
  'wide_smile',
  'angry',
];

// Helper function to validate expression structure
function isValidExpression(expr: Expression): boolean {
  return (
    VALID_EYE_STYLES.includes(expr.leftEye) &&
    VALID_EYE_STYLES.includes(expr.rightEye) &&
    VALID_MOUTH_STYLES.includes(expr.mouth) &&
    (expr.eyeSize === undefined || typeof expr.eyeSize === 'number') &&
    (expr.mouthSize === undefined || typeof expr.mouthSize === 'number')
  );
}

describe('L1 MVP Expressions', () => {
  describe('excited expression', () => {
    it('should exist in EXPRESSIONS', () => {
      expect(EXPRESSIONS).toHaveProperty('excited');
    });

    it('should have valid structure', () => {
      const expr = EXPRESSIONS.excited;
      expect(isValidExpression(expr)).toBe(true);
    });

    it('should be retrievable via getExpression', () => {
      const expr = getExpression('excited');
      expect(expr).toEqual(EXPRESSIONS.excited);
    });

    it('should be included in EXPRESSION_NAMES', () => {
      expect(EXPRESSION_NAMES).toContain('excited');
    });

    it('should have circle eyes for excited look', () => {
      expect(EXPRESSIONS.excited.leftEye).toBe('circle');
      expect(EXPRESSIONS.excited.rightEye).toBe('circle');
    });

    it('should have wide_smile mouth', () => {
      expect(EXPRESSIONS.excited.mouth).toBe('wide_smile');
    });
  });

  describe('focused expression', () => {
    it('should exist in EXPRESSIONS', () => {
      expect(EXPRESSIONS).toHaveProperty('focused');
    });

    it('should have valid structure', () => {
      const expr = EXPRESSIONS.focused;
      expect(isValidExpression(expr)).toBe(true);
    });

    it('should be retrievable via getExpression', () => {
      const expr = getExpression('focused');
      expect(expr).toEqual(EXPRESSIONS.focused);
    });

    it('should be included in EXPRESSION_NAMES', () => {
      expect(EXPRESSION_NAMES).toContain('focused');
    });

    it('should have narrow eyes for focused look', () => {
      expect(EXPRESSIONS.focused.leftEye).toBe('narrow');
      expect(EXPRESSIONS.focused.rightEye).toBe('narrow');
    });
  });

  describe('angry expression', () => {
    it('should exist in EXPRESSIONS', () => {
      expect(EXPRESSIONS).toHaveProperty('angry');
    });

    it('should have valid structure', () => {
      const expr = EXPRESSIONS.angry;
      expect(isValidExpression(expr)).toBe(true);
    });

    it('should be retrievable via getExpression', () => {
      const expr = getExpression('angry');
      expect(expr).toEqual(EXPRESSIONS.angry);
    });

    it('should be included in EXPRESSION_NAMES', () => {
      expect(EXPRESSION_NAMES).toContain('angry');
    });

    it('should have angry eyes', () => {
      expect(EXPRESSIONS.angry.leftEye).toBe('angry');
      expect(EXPRESSIONS.angry.rightEye).toBe('angry');
    });

    it('should have angry mouth', () => {
      expect(EXPRESSIONS.angry.mouth).toBe('angry');
    });
  });
});

describe('All expressions have valid structure', () => {
  it('should have at least 8 expressions (5 original + 3 L1)', () => {
    expect(EXPRESSION_NAMES.length).toBeGreaterThanOrEqual(8);
  });

  EXPRESSION_NAMES.forEach((exprName) => {
    it(`${exprName} should have valid expression structure`, () => {
      const expr = EXPRESSIONS[exprName];
      expect(isValidExpression(expr)).toBe(true);
    });
  });
});

describe('getExpression fallback', () => {
  it('should return neutral expression for unknown name', () => {
    const expr = getExpression('unknown_expression');
    expect(expr).toEqual(EXPRESSIONS.neutral);
  });
});
