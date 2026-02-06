/**
 * AnimatedText - Text component with enter/during/exit animation support
 *
 * Updated for Track B-4: Typography
 * - Supports text roles (title, body, number, highlight_box, caption)
 * - Supports text decorations (underline_animated, highlight_marker)
 * - Supports background boxes
 *
 * Updated for Track B-2: Theme integration
 * - Uses theme colors from context as defaults
 */

import React from 'react';
import { TextProps, AnimationDef, TextRole } from '../types/schema';
import { useAnimationPhases } from '../hooks/useAnimationPhases';
import { useTheme } from '../contexts/ThemeContext';
import { TEXT } from '../constants';
import { getTextStyleWithTheme, getDecorationStyle } from '../styles/textStyles';

interface AnimatedTextProps {
  props: TextProps;
  position: { x: number; y: number };
  scale?: number;
  animation?: {
    enter?: AnimationDef;
    during?: AnimationDef;
    exit?: AnimationDef;
  };
  sceneStartFrame: number;
  sceneDurationFrames: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  props,
  position,
  scale = 1,
  animation,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  // Get theme from context
  const { theme } = useTheme();

  // Get role-based default style with theme colors
  const role = props.role || 'body';
  const roleStyle = getTextStyleWithTheme(role, theme);

  // Extract props with role-based defaults
  const {
    content,
    fontSize = roleStyle.fontSize,
    fontWeight = roleStyle.fontWeight as 'normal' | 'bold',
    color = roleStyle.color,
    maxWidth = TEXT.DEFAULT_MAX_WIDTH,
    align = TEXT.DEFAULT_ALIGN,
    decoration = roleStyle.decoration,
    background = roleStyle.background,
  } = props;

  // Use centralized animation hook
  const {
    enterAnim,
    duringAnim,
    finalOpacity,
    enterProgress,
  } = useAnimationPhases(
    animation,
    sceneStartFrame,
    sceneDurationFrames,
    { enterType: 'fadeIn', duringType: 'none', exitType: 'none' }
  );

  // Handle typewriter effect
  const isTypewriter = animation?.enter?.type === 'typewriter';
  const visibleChars = isTypewriter
    ? Math.floor(content.length * enterProgress)
    : content.length;
  const displayText = isTypewriter ? content.slice(0, visibleChars) : content;

  // Get decoration styles
  const decorationStyles = getDecorationStyle(decoration, color);

  // Build background box styles
  const backgroundStyles: React.CSSProperties = background
    ? {
        backgroundColor: background.color || 'rgba(255, 255, 255, 0.15)',
        padding: background.padding || 20,
        borderRadius: background.borderRadius || 12,
      }
    : {};

  // Use monospace for number role
  const fontFamily = role === 'number' ? 'monospace' : TEXT.FONT_FAMILY;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale}) ${enterAnim.transform} ${duringAnim.transform}`,
        opacity: finalOpacity,
        maxWidth,
        textAlign: align,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        lineHeight: TEXT.LINE_HEIGHT,
        ...backgroundStyles,
        ...decorationStyles,
      }}
    >
      {displayText}
      {isTypewriter && enterProgress < 1 && (
        <span
          style={{
            borderRight: '2px solid',
            borderColor: color,
            marginLeft: 2,
            animation: 'none',
          }}
        />
      )}
    </div>
  );
};

export default AnimatedText;
