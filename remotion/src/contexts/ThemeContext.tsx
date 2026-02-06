/**
 * ThemeContext - Provides color theme to all components
 *
 * Usage:
 * 1. Wrap MainVideo with ThemeProvider
 * 2. Use useTheme() hook in components to access theme colors
 */

import React, { createContext, useContext } from 'react';
import { ColorTheme } from '../types/schema';
import { getTheme, THEMES } from '../styles/themes';

interface ThemeContextValue {
  theme: ColorTheme;
  getAccentColor: (index: number) => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  themeName?: string;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themeName,
  children,
}) => {
  const theme = getTheme(themeName);

  const getAccentColor = (index: number): string => {
    return theme.accent[index % theme.accent.length];
  };

  return (
    <ThemeContext.Provider value={{ theme, getAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default theme if not wrapped in provider
    const defaultTheme = THEMES.dark_infographic;
    return {
      theme: defaultTheme,
      getAccentColor: (index: number) => defaultTheme.accent[index % defaultTheme.accent.length],
    };
  }
  return context;
};

export default ThemeContext;
