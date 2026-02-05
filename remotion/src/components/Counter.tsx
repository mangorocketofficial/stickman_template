/**
 * Counter - Animated number counter component
 *
 * Refactored to use useAnimationPhases hook for cleaner code
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CounterProps, AnimationDef } from '../types/schema';
import { useAnimationPhases } from '../hooks/useAnimationPhases';
import { msToFrames } from '../utils/timing';
import { COUNTER, ANIMATION } from '../constants';

interface AnimatedCounterProps {
  props: CounterProps;
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

/**
 * Format number based on format type
 */
const formatNumber = (
  value: number,
  format: CounterProps['format'] = 'number'
): string => {
  switch (format) {
    case 'currency_krw':
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
      }).format(value);

    case 'currency_usd':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);

    case 'percent':
      return new Intl.NumberFormat('ko-KR', {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value / 100);

    case 'number':
    default:
      return new Intl.NumberFormat('ko-KR').format(Math.round(value));
  }
};

export const Counter: React.FC<AnimatedCounterProps> = ({
  props,
  position,
  scale = 1,
  animation,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { from, to, format = 'number', fontSize = COUNTER.DEFAULT_FONT_SIZE, color = COUNTER.DEFAULT_COLOR } = props;

  // Use centralized animation hook
  const {
    enterAnim,
    finalOpacity,
    enterStartFrame,
    exitStartFrame,
    enterDurationFrames,
  } = useAnimationPhases(
    animation,
    sceneStartFrame,
    sceneDurationFrames,
    { enterType: 'fadeIn', duringType: 'none', exitType: 'none' }
  );

  // Counter animation - counts from 'from' to 'to' during the scene
  // Start counting after enter animation completes
  const countStartFrame = enterStartFrame + enterDurationFrames;
  const countEndFrame = exitStartFrame;
  const countDurationFrames = countEndFrame - countStartFrame;

  let currentValue: number;
  if (frame < countStartFrame) {
    currentValue = from;
  } else if (frame >= countEndFrame) {
    currentValue = to;
  } else {
    // Eased interpolation for smooth counting
    const progress = (frame - countStartFrame) / countDurationFrames;
    // Use ease-out for more natural counting
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    currentValue = from + (to - from) * easedProgress;
  }

  const displayValue = formatNumber(currentValue, format);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale}) ${enterAnim.transform}`,
        opacity: finalOpacity,
        fontFamily: COUNTER.FONT_FAMILY,
        fontSize,
        fontWeight: 'bold',
        color,
        textAlign: 'center',
        letterSpacing: COUNTER.LETTER_SPACING,
      }}
    >
      {displayValue}
    </div>
  );
};

export default Counter;
