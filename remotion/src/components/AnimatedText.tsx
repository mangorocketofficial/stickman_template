/**
 * AnimatedText - Text component with enter/during/exit animation support
 *
 * Refactored to use useAnimationPhases hook for cleaner code
 */

import React from 'react';
import { TextProps, AnimationDef } from '../types/schema';
import { useAnimationPhases } from '../hooks/useAnimationPhases';
import { TEXT } from '../constants';

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
  const {
    content,
    fontSize = TEXT.DEFAULT_FONT_SIZE,
    fontWeight = TEXT.DEFAULT_FONT_WEIGHT,
    color = TEXT.DEFAULT_COLOR,
    maxWidth = TEXT.DEFAULT_MAX_WIDTH,
    align = TEXT.DEFAULT_ALIGN,
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
        fontFamily: TEXT.FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        lineHeight: TEXT.LINE_HEIGHT,
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
