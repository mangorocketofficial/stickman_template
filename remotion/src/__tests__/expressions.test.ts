import { describe, it, expect } from 'vitest';
import {
  EXPRESSIONS,
  EXPRESSION_NAMES,
  getExpression,
  DEFAULT_EXPRESSION,
  Expression,
} from '../components/StickMan/expressions';

// Required expression properties
const REQUIRED_EXPRESSION_PROPS = ['leftEye', 'rightEye', 'mouth'];

// Valid eye styles
const VALID_EYE_STYLES = [
  'dot',
  'circle',
  'closed',
  'wink',
  'angry_left',
  'angry_right',
  'worried_left',
  'worried_right',
];

// Valid mouth styles
const VALID_MOUTH_STYLES = ['line', 'smile', 'frown', 'circle', 'wavy', 'wide_smile', 'angry'];

// Original 5 MVP expressions
const MVP_ORIGINAL_EXPRESSIONS = ['neutral', 'happy', 'sad', 'surprised', 'thinking'];

// MVP added expressions (3)
const MVP_ADDED_EXPRESSIONS = ['excited', 'focused', 'angry'];

// V2 expressions (4)
const V2_EXPRESSIONS = ['proud', 'sleepy', 'confused', 'worried'];

describe('expressions.ts - Expression Definitions', () => {
  describe('Expression Structure Validation', () => {
    it('should have all required properties for each expression', () => {
      for (const expName of EXPRESSION_NAMES) {
        const expression = EXPRESSIONS[expName];
        for (const prop of REQUIRED_EXPRESSION_PROPS) {
          expect(expression).toHaveProperty(prop);
        }
      }
    });

    it('should have valid eye styles for each expression', () => {
      for (const expName of EXPRESSION_NAMES) {
        const expression = EXPRESSIONS[expName];
        expect(VALID_EYE_STYLES).toContain(expression.leftEye);
        expect(VALID_EYE_STYLES).toContain(expression.rightEye);
      }
    });

    it('should have valid mouth styles for each expression', () => {
      for (const expName of EXPRESSION_NAMES) {
        const expression = EXPRESSIONS[expName];
        expect(VALID_MOUTH_STYLES).toContain(expression.mouth);
      }
    });

    it('should have optional modifiers as numbers when present', () => {
      for (const expName of EXPRESSION_NAMES) {
        const expression = EXPRESSIONS[expName];
        if (expression.eyeSize !== undefined) {
          expect(typeof expression.eyeSize).toBe('number');
          expect(expression.eyeSize).toBeGreaterThan(0);
        }
        if (expression.mouthSize !== undefined) {
          expect(typeof expression.mouthSize).toBe('number');
          expect(expression.mouthSize).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Original 5 MVP Expressions', () => {
    it.each(MVP_ORIGINAL_EXPRESSIONS)('should have expression: %s', (expName) => {
      expect(EXPRESSIONS).toHaveProperty(expName);
      expect(EXPRESSION_NAMES).toContain(expName);
    });
  });

  describe('MVP Added Expressions (3)', () => {
    it.each(MVP_ADDED_EXPRESSIONS)('should have expression: %s', (expName) => {
      expect(EXPRESSIONS).toHaveProperty(expName);
      expect(EXPRESSION_NAMES).toContain(expName);
    });

    it('should have exactly 3 MVP added expressions', () => {
      const foundExpressions = MVP_ADDED_EXPRESSIONS.filter((e) => EXPRESSIONS[e]);
      expect(foundExpressions.length).toBe(3);
    });
  });

  describe('V2 Expressions (4)', () => {
    it.each(V2_EXPRESSIONS)('should have expression: %s', (expName) => {
      expect(EXPRESSIONS).toHaveProperty(expName);
      expect(EXPRESSION_NAMES).toContain(expName);
    });

    it('should have exactly 4 V2 expressions', () => {
      const foundExpressions = V2_EXPRESSIONS.filter((e) => EXPRESSIONS[e]);
      expect(foundExpressions.length).toBe(4);
    });
  });

  describe('Total Expression Count', () => {
    const TOTAL_EXPECTED =
      MVP_ORIGINAL_EXPRESSIONS.length + MVP_ADDED_EXPRESSIONS.length + V2_EXPRESSIONS.length;

    it(`should have ${TOTAL_EXPECTED} total expressions (5 original + 3 MVP + 4 V2)`, () => {
      expect(EXPRESSION_NAMES.length).toBe(TOTAL_EXPECTED);
    });
  });

  describe('Specific Expression Validation', () => {
    it('excited should have circle eyes and wide_smile mouth', () => {
      const excited = EXPRESSIONS.excited;
      expect(excited.leftEye).toBe('circle');
      expect(excited.rightEye).toBe('circle');
      expect(excited.mouth).toBe('wide_smile');
    });

    it('focused should have closed eyes', () => {
      const focused = EXPRESSIONS.focused;
      expect(focused.leftEye).toBe('closed');
      expect(focused.rightEye).toBe('closed');
    });

    it('angry should have angry eye styles', () => {
      const angry = EXPRESSIONS.angry;
      expect(angry.leftEye).toBe('angry_left');
      expect(angry.rightEye).toBe('angry_right');
      expect(angry.mouth).toBe('angry');
    });

    it('worried should have worried eye styles', () => {
      const worried = EXPRESSIONS.worried;
      expect(worried.leftEye).toBe('worried_left');
      expect(worried.rightEye).toBe('worried_right');
    });

    it('confused should have asymmetric eyes', () => {
      const confused = EXPRESSIONS.confused;
      expect(confused.leftEye).not.toBe(confused.rightEye);
    });
  });

  describe('Utility Functions', () => {
    it('getExpression should return correct expression', () => {
      const happyExp = getExpression('happy');
      expect(happyExp).toBe(EXPRESSIONS.happy);
    });

    it('getExpression should return default expression for unknown name', () => {
      const unknownExp = getExpression('nonexistent_expression');
      expect(unknownExp).toBe(DEFAULT_EXPRESSION);
    });

    it('DEFAULT_EXPRESSION should be neutral', () => {
      expect(DEFAULT_EXPRESSION).toBe(EXPRESSIONS.neutral);
    });
  });
});
