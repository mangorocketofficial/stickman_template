/**
 * Text Style Definitions for Track B-4: Typography
 *
 * Defines preset styles for different text roles:
 * - title: Large, bold headings
 * - body: Normal body text
 * - number: Monospace numbers (for counters, stats)
 * - highlight_box: Text with background box
 * - caption: Small caption text
 */

import { TextRole, TextStyleDef, TextDecoration } from '../types/schema';
import { TEXT, THEME } from '../constants';

/**
 * Default text styles for each role
 */
export const TEXT_STYLES: Record<TextRole, TextStyleDef> = {
  title: {
    role: 'title',
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    color: THEME.DEFAULT_TEXT_COLOR,
    decoration: 'none',
  },

  body: {
    role: 'body',
    fontSize: 48,
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    color: THEME.DEFAULT_TEXT_COLOR,
    decoration: 'none',
  },

  number: {
    role: 'number',
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: THEME.DEFAULT_ACCENT_COLOR,
    decoration: 'none',
  },

  highlight_box: {
    role: 'highlight_box',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    color: THEME.DEFAULT_TEXT_COLOR,
    background: {
      color: 'rgba(255, 255, 255, 0.15)',
      padding: 20,
      borderRadius: 12,
      opacity: 1,
    },
    decoration: 'none',
  },

  caption: {
    role: 'caption',
    fontSize: 32,
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    color: 'rgba(255, 255, 255, 0.7)',
    decoration: 'none',
  },
};

/**
 * Get text style by role with optional overrides
 */
export const getTextStyle = (
  role: TextRole,
  overrides?: Partial<TextStyleDef>
): TextStyleDef => {
  const baseStyle = TEXT_STYLES[role] || TEXT_STYLES.body;
  return {
    ...baseStyle,
    ...overrides,
  };
};

/**
 * CSS styles for text decorations
 */
export const getDecorationStyle = (
  decoration: TextDecoration | undefined,
  accentColor: string = THEME.DEFAULT_ACCENT_COLOR
): React.CSSProperties => {
  switch (decoration) {
    case 'underline_animated':
      return {
        textDecoration: 'underline',
        textDecorationColor: accentColor,
        textDecorationThickness: '3px',
        textUnderlineOffset: '6px',
      };

    case 'highlight_marker':
      return {
        background: `linear-gradient(transparent 60%, ${accentColor}40 60%)`,
        padding: '0 4px',
      };

    case 'none':
    default:
      return {};
  }
};

/**
 * Get complete CSS styles for a text element
 */
export const getTextCSSStyles = (
  style: TextStyleDef,
  additionalStyles?: React.CSSProperties
): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily,
    color: style.color,
    lineHeight: 1.4,
  };

  // Add background box styles if present
  if (style.background) {
    Object.assign(baseStyles, {
      backgroundColor: style.background.color,
      padding: style.background.padding,
      borderRadius: style.background.borderRadius,
      opacity: style.background.opacity,
    });
  }

  // Add decoration styles
  const decorationStyles = getDecorationStyle(style.decoration);

  return {
    ...baseStyles,
    ...decorationStyles,
    ...additionalStyles,
  };
};

export default TEXT_STYLES;
