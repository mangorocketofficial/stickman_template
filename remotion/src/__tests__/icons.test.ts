import { describe, it, expect } from 'vitest';

// Original 8 MVP icons
const MVP_ORIGINAL_ICONS = [
  'money-bag',
  'chart-up',
  'piggy-bank',
  'lightbulb',
  'warning',
  'clock',
  'star',
  'check',
];

// MVP added icons (10)
const MVP_ADDED_ICONS = [
  'coin',
  'bank',
  'wallet',
  'checkmark',
  'cross',
  'target',
  'book',
  'arrow-up',
  'arrow-down',
  'question',
];

// V2 icons (25)
const V2_ICONS = [
  'credit-card',
  'chart-down',
  'calculator',
  'briefcase',
  'heart',
  'lock',
  'gear',
  'graduation',
  'magnifier',
  'globe',
  'trophy',
  'arrow-right',
  'arrow-left',
  'compare',
  'percentage',
  'money-stack',
  'savings',
  'document',
  'calendar',
  'rocket',
  'shield',
  'bell',
  'home',
  'user',
  'users',
  'thumbs-up',
  'thumbs-down',
  'fire',
  'bolt',
  'sun',
  'moon',
  'cloud',
  'gift',
];

const ALL_ICONS = [...MVP_ORIGINAL_ICONS, ...MVP_ADDED_ICONS, ...V2_ICONS];

describe('icons.test.ts - Icon Element Component', () => {
  describe('Icon Registration Validation', () => {
    it('should have INLINE_ICONS object defined', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain('const INLINE_ICONS');
    });
  });

  describe('Original 8 MVP Icons', () => {
    it.each(MVP_ORIGINAL_ICONS)('should have icon: %s', async (iconName) => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain(`'${iconName}':`);
    });
  });

  describe('MVP Added Icons (10)', () => {
    it.each(MVP_ADDED_ICONS)('should have icon: %s', async (iconName) => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain(`'${iconName}':`);
    });

    it('should have exactly 10 MVP added icons', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      let foundCount = 0;
      for (const icon of MVP_ADDED_ICONS) {
        if (content.includes(`'${icon}':`)) {
          foundCount++;
        }
      }
      expect(foundCount).toBe(10);
    });
  });

  describe('V2 Icons (25+)', () => {
    it.each(V2_ICONS)('should have icon: %s', async (iconName) => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain(`'${iconName}':`);
    });

    it('should have at least 25 V2 icons', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      let foundCount = 0;
      for (const icon of V2_ICONS) {
        if (content.includes(`'${icon}':`)) {
          foundCount++;
        }
      }
      expect(foundCount).toBeGreaterThanOrEqual(25);
    });
  });

  describe('Total Icon Count', () => {
    it(`should have at least ${ALL_ICONS.length} total icons`, async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      let foundCount = 0;
      for (const icon of ALL_ICONS) {
        if (content.includes(`'${icon}':`)) {
          foundCount++;
        }
      }
      expect(foundCount).toBeGreaterThanOrEqual(ALL_ICONS.length);
    });
  });

  describe('Icon Component Structure', () => {
    it('should export IconElement component as default', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain('export default IconElement');
    });

    it('should accept size and color props', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain('size');
      expect(content).toContain('color');
    });

    it('should have fallback to external SVG files', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain('staticFile');
      expect(content).toContain('icons/');
    });

    it('should support animation props', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      expect(content).toContain('animation?:');
      expect(content).toContain('enter?:');
      expect(content).toContain('during?:');
      expect(content).toContain('exit?:');
    });
  });

  describe('Icon SVG Structure', () => {
    it('all icons should use SVG format', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      // Each icon should have an SVG component
      expect(content).toContain('<svg');
      expect(content).toContain('viewBox');
    });

    it('icons should accept dynamic color', async () => {
      const fs = await import('fs/promises');
      const content = await fs.readFile(
        'C:\\Users\\User\\Desktop\\stickman-l1-v2\\remotion\\src\\components\\IconElement.tsx',
        'utf-8'
      );

      // Icons should use color prop in stroke or fill
      expect(content).toContain('stroke={color}');
      expect(content).toContain('fill={color}');
    });
  });
});
