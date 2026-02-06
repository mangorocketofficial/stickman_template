/**
 * Color Theme Definitions for Track B-2
 *
 * Predefined color themes for different moods:
 * - dark_infographic: Current default (deep purple/blue)
 * - dark_warm: Warm dark tones (amber/orange accents)
 * - dark_cool: Cool dark tones (cyan/blue accents)
 * - dark_neon: Vibrant neon on dark (pink/green/cyan)
 */

import { ColorTheme, ThemeName } from '../types/schema';

/**
 * All available themes
 */
export const THEMES: Record<ThemeName, ColorTheme> = {
  dark_infographic: {
    name: 'dark_infographic',
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      surface: 'rgba(255, 255, 255, 0.08)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#FFD700',
    },
    highlight: '#FFD700',
    stickman: '#FFFFFF',
    accent: ['#FFD700', '#4FC3F7', '#81C784', '#FF8A65'],
  },

  dark_warm: {
    name: 'dark_warm',
    background: {
      primary: '#1C1410',
      secondary: '#2D1F1A',
      surface: 'rgba(255, 200, 150, 0.08)',
    },
    text: {
      primary: '#FFF8F0',
      secondary: 'rgba(255, 248, 240, 0.7)',
      accent: '#FFB74D',
    },
    highlight: '#FFB74D',
    stickman: '#FFF8F0',
    accent: ['#FFB74D', '#FF8A65', '#FFCC80', '#A1887F'],
  },

  dark_cool: {
    name: 'dark_cool',
    background: {
      primary: '#0D1B2A',
      secondary: '#1B263B',
      surface: 'rgba(100, 200, 255, 0.08)',
    },
    text: {
      primary: '#E0F7FA',
      secondary: 'rgba(224, 247, 250, 0.7)',
      accent: '#4FC3F7',
    },
    highlight: '#4FC3F7',
    stickman: '#E0F7FA',
    accent: ['#4FC3F7', '#81D4FA', '#80DEEA', '#4DD0E1'],
  },

  dark_neon: {
    name: 'dark_neon',
    background: {
      primary: '#0A0A0F',
      secondary: '#12121A',
      surface: 'rgba(255, 0, 255, 0.05)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#FF00FF',
    },
    highlight: '#00FFFF',
    stickman: '#FFFFFF',
    accent: ['#FF00FF', '#00FFFF', '#00FF88', '#FFFF00'],
  },

  light_clean: {
    name: 'light_clean',
    background: {
      primary: '#FAFAFA',
      secondary: '#F5F5F5',
      surface: 'rgba(0, 0, 0, 0.04)',
    },
    text: {
      primary: '#212121',
      secondary: 'rgba(0, 0, 0, 0.6)',
      accent: '#1976D2',
    },
    highlight: '#1976D2',
    stickman: '#212121',
    accent: ['#1976D2', '#388E3C', '#F57C00', '#7B1FA2'],
  },

  light_warm: {
    name: 'light_warm',
    background: {
      primary: '#FFF8E1',
      secondary: '#FFECB3',
      surface: 'rgba(255, 152, 0, 0.08)',
    },
    text: {
      primary: '#3E2723',
      secondary: 'rgba(62, 39, 35, 0.7)',
      accent: '#FF6F00',
    },
    highlight: '#FF6F00',
    stickman: '#3E2723',
    accent: ['#FF6F00', '#FF8F00', '#FFA000', '#795548'],
  },

  pastel: {
    name: 'pastel',
    background: {
      primary: '#F8F0FF',
      secondary: '#E8F5E9',
      surface: 'rgba(156, 39, 176, 0.08)',
    },
    text: {
      primary: '#37474F',
      secondary: 'rgba(55, 71, 79, 0.7)',
      accent: '#9C27B0',
    },
    highlight: '#9C27B0',
    stickman: '#37474F',
    accent: ['#CE93D8', '#90CAF9', '#A5D6A7', '#FFCC80'],
  },

  corporate: {
    name: 'corporate',
    background: {
      primary: '#1E3A5F',
      secondary: '#2E4A6F',
      surface: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.8)',
      accent: '#4CAF50',
    },
    highlight: '#4CAF50',
    stickman: '#FFFFFF',
    accent: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
  },

  retro: {
    name: 'retro',
    background: {
      primary: '#2C1810',
      secondary: '#3D2817',
      surface: 'rgba(255, 193, 7, 0.1)',
    },
    text: {
      primary: '#FFF3E0',
      secondary: 'rgba(255, 243, 224, 0.7)',
      accent: '#FFC107',
    },
    highlight: '#FFC107',
    stickman: '#FFF3E0',
    accent: ['#FFC107', '#FF9800', '#795548', '#8D6E63'],
  },

  nature: {
    name: 'nature',
    background: {
      primary: '#1B2E1B',
      secondary: '#2D472D',
      surface: 'rgba(129, 199, 132, 0.1)',
    },
    text: {
      primary: '#E8F5E9',
      secondary: 'rgba(232, 245, 233, 0.7)',
      accent: '#81C784',
    },
    highlight: '#81C784',
    stickman: '#E8F5E9',
    accent: ['#81C784', '#AED581', '#C5E1A5', '#A5D6A7'],
  },
};

export const getTheme = (themeName?: string): ColorTheme => {
  if (!themeName) return THEMES.dark_infographic;
  return THEMES[themeName as ThemeName] || THEMES.dark_infographic;
};

export const getThemeGradient = (theme: ColorTheme, angle: number = 135): string => {
  return `linear-gradient(${angle}deg, ${theme.background.primary}, ${theme.background.secondary})`;
};

export const getAccentColor = (theme: ColorTheme, index: number): string => {
  return theme.accent[index % theme.accent.length];
};

export default THEMES;
