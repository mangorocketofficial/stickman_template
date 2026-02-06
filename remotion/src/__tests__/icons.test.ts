import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Expected icon files for L1 MVP (11 icons)
const EXPECTED_ICONS = [
  'coin.svg',
  'bank.svg',
  'wallet.svg',
  'checkmark.svg',
  'cross.svg',
  'clock.svg',
  'target.svg',
  'star.svg',
  'book.svg',
  'arrow-up.svg',
  'arrow-down.svg',
];

const ICONS_DIR = path.resolve(__dirname, '../../public/icons');

describe('Icon SVG files', () => {
  it('icons directory should exist', () => {
    expect(fs.existsSync(ICONS_DIR)).toBe(true);
  });

  it('should have exactly 11 icon files', () => {
    const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith('.svg'));
    expect(files.length).toBe(11);
  });

  EXPECTED_ICONS.forEach((iconFile) => {
    describe(`${iconFile}`, () => {
      const iconPath = path.join(ICONS_DIR, iconFile);

      it('should exist', () => {
        expect(fs.existsSync(iconPath)).toBe(true);
      });

      it('should be a valid SVG file', () => {
        const content = fs.readFileSync(iconPath, 'utf-8');
        expect(content).toMatch(/<svg[\s\S]*<\/svg>/i);
      });

      it('should have viewBox attribute', () => {
        const content = fs.readFileSync(iconPath, 'utf-8');
        expect(content).toMatch(/viewBox\s*=\s*"/i);
      });
    });
  });
});

describe('All icons are expected', () => {
  it('should not have unexpected icon files', () => {
    const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith('.svg'));
    const unexpectedFiles = files.filter((f) => !EXPECTED_ICONS.includes(f));
    expect(unexpectedFiles).toEqual([]);
  });
});
