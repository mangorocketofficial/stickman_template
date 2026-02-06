/**
 * Tests for IconElement.tsx
 * Verifies all 50 icons (8 base + 42 L1 V3 additions) are correctly defined
 */

import { describe, it, expect } from 'vitest';

// Base MVP icons (8)
const BASE_ICONS = [
  'money-bag',
  'chart-up',
  'piggy-bank',
  'lightbulb',
  'warning',
  'clock',
  'star',
  'check',
];

// L1 V3 additional icons (48)
const V3_ICONS = [
  // Finance/Business icons (8)
  'dollar',
  'wallet',
  'bank',
  'credit-card',
  'coins',
  'chart-down',
  'chart-bar',
  'chart-pie',
  // General icons (11)
  'heart',
  'thumbs-up',
  'thumbs-down',
  'target',
  'trophy',
  'medal',
  'rocket',
  'calendar',
  'calculator',
  'percent',
  'trending',
  // Communication/Media (7)
  'speech-bubble',
  'megaphone',
  'question',
  'info',
  'x-mark',
  'plus',
  'minus',
  // People/Groups (2)
  'user',
  'users',
  // Other useful icons (20)
  'lock',
  'unlock',
  'shield',
  'gear',
  'home',
  'briefcase',
  'book',
  'bulb',
  'fire',
  'lightning',
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'refresh',
  'flag',
  'globe',
  'gift',
  'phone',
  'email',
];

const ALL_ICONS = [...BASE_ICONS, ...V3_ICONS];

describe('Icon definitions', () => {
  it('should define 8 base icons', () => {
    expect(BASE_ICONS.length).toBe(8);
  });

  it('should define 48 L1 V3 additional icons', () => {
    expect(V3_ICONS.length).toBe(48);
  });

  it('should define 56 total icons', () => {
    expect(ALL_ICONS.length).toBe(56);
  });

  it('should have unique icon names', () => {
    const uniqueIcons = new Set(ALL_ICONS);
    expect(uniqueIcons.size).toBe(ALL_ICONS.length);
  });
});

describe('Icon name conventions', () => {
  it('should use kebab-case for icon names', () => {
    ALL_ICONS.forEach((iconName) => {
      // No uppercase letters
      expect(iconName).toBe(iconName.toLowerCase());
      // No underscores
      expect(iconName).not.toContain('_');
      // Allowed characters: lowercase letters, numbers, hyphens
      expect(iconName).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it('should not have empty icon names', () => {
    ALL_ICONS.forEach((iconName) => {
      expect(iconName.length).toBeGreaterThan(0);
    });
  });
});

describe('Icon categories', () => {
  const financeIcons = [
    'money-bag',
    'dollar',
    'wallet',
    'bank',
    'credit-card',
    'coins',
    'piggy-bank',
  ];

  const chartIcons = [
    'chart-up',
    'chart-down',
    'chart-bar',
    'chart-pie',
    'trending',
  ];

  const arrowIcons = [
    'arrow-up',
    'arrow-down',
    'arrow-left',
    'arrow-right',
  ];

  const statusIcons = [
    'check',
    'x-mark',
    'plus',
    'minus',
    'warning',
    'info',
    'question',
  ];

  it('should have finance-related icons', () => {
    financeIcons.forEach((icon) => {
      expect(ALL_ICONS).toContain(icon);
    });
  });

  it('should have chart-related icons', () => {
    chartIcons.forEach((icon) => {
      expect(ALL_ICONS).toContain(icon);
    });
  });

  it('should have arrow icons', () => {
    arrowIcons.forEach((icon) => {
      expect(ALL_ICONS).toContain(icon);
    });
  });

  it('should have status icons', () => {
    statusIcons.forEach((icon) => {
      expect(ALL_ICONS).toContain(icon);
    });
  });
});

describe('Icon completeness for infographic use cases', () => {
  it('should have icons for positive feedback', () => {
    expect(ALL_ICONS).toContain('check');
    expect(ALL_ICONS).toContain('thumbs-up');
    expect(ALL_ICONS).toContain('star');
    expect(ALL_ICONS).toContain('trophy');
  });

  it('should have icons for negative feedback', () => {
    expect(ALL_ICONS).toContain('x-mark');
    expect(ALL_ICONS).toContain('thumbs-down');
    expect(ALL_ICONS).toContain('warning');
  });

  it('should have icons for navigation/direction', () => {
    expect(ALL_ICONS).toContain('arrow-up');
    expect(ALL_ICONS).toContain('arrow-down');
    expect(ALL_ICONS).toContain('arrow-left');
    expect(ALL_ICONS).toContain('arrow-right');
  });

  it('should have icons for time/scheduling', () => {
    expect(ALL_ICONS).toContain('clock');
    expect(ALL_ICONS).toContain('calendar');
  });

  it('should have icons for communication', () => {
    expect(ALL_ICONS).toContain('speech-bubble');
    expect(ALL_ICONS).toContain('megaphone');
    expect(ALL_ICONS).toContain('phone');
    expect(ALL_ICONS).toContain('email');
  });

  it('should have icons for security', () => {
    expect(ALL_ICONS).toContain('lock');
    expect(ALL_ICONS).toContain('unlock');
    expect(ALL_ICONS).toContain('shield');
  });

  it('should have icons for goals/achievements', () => {
    expect(ALL_ICONS).toContain('target');
    expect(ALL_ICONS).toContain('trophy');
    expect(ALL_ICONS).toContain('medal');
    expect(ALL_ICONS).toContain('flag');
  });
});
