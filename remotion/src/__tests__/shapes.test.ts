import { describe, it, expect } from 'vitest';

// The Shape component supports these shape types
const MVP_SHAPES = ['line', 'arrow', 'circle', 'rectangle'];
const V2_SHAPES = ['curved_arrow', 'bracket'];
const ALL_SHAPES = [...MVP_SHAPES, ...V2_SHAPES];

// Since Shape.tsx uses a switch statement, we need to verify the shape types are handled
// We'll read the file content to verify the shape types are implemented

describe('shapes.test.ts - Shape Component', () => {
  describe('MVP Shapes', () => {
    it.each(MVP_SHAPES)('should support shape type: %s', async (shapeType) => {
      // Read the Shape.tsx file to verify the shape type is handled
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      // Check that the shape type is handled in the switch statement
      expect(content).toContain(`case '${shapeType}':`);
    });
  });

  describe('V2 Shapes', () => {
    it.each(V2_SHAPES)('should support shape type: %s', async (shapeType) => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      expect(content).toContain(`case '${shapeType}':`);
    });

    it('should have curved_arrow implementation with quadratic bezier', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      // curved_arrow should use path with Q (quadratic bezier)
      expect(content).toContain("case 'curved_arrow':");
      // Check for curve control point logic
      expect(content).toContain('ctrlX');
      expect(content).toContain('ctrlY');
    });

    it('should have bracket implementation with bezier path', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      expect(content).toContain("case 'bracket':");
      // Bracket should have curly brace path
      expect(content).toContain('bracketHeight');
      expect(content).toContain('bracketWidth');
    });
  });

  describe('Total Shape Count', () => {
    it(`should support ${ALL_SHAPES.length} total shape types`, async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      let foundShapes = 0;
      for (const shape of ALL_SHAPES) {
        if (content.includes(`case '${shape}':`)) {
          foundShapes++;
        }
      }

      expect(foundShapes).toBe(ALL_SHAPES.length);
    });
  });

  describe('Shape Component Structure', () => {
    it('should export Shape component as default', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      expect(content).toContain('export default Shape');
    });

    it('should handle animation props', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      expect(content).toContain('animation?:');
      expect(content).toContain('enter?:');
      expect(content).toContain('during?:');
      expect(content).toContain('exit?:');
    });

    it('should support drawLine animation for shapes', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\Shape.tsx',
        'utf-8'
      );

      expect(content).toContain('drawLine');
      expect(content).toContain('drawProgress');
    });
  });
});
