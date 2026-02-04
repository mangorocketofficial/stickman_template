/**
 * Counter - Animated number counter component
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CounterProps, AnimationDef } from '../types/schema';
import {
  calculateEnterAnimation,
  ENTER_DURATIONS,
} from '../animations/enter';
import {
  calculateExitAnimation,
  EXIT_DURATIONS,
} from '../animations/exit';
import { msToFrames } from '../utils/timing';

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

  const { from, to, format = 'number', fontSize = 64, color = '#FFFFFF' } = props;

  // Animation phases
  const enterType = animation?.enter?.type || 'fadeIn';
  const enterDurationMs = animation?.enter?.durationMs || ENTER_DURATIONS[enterType] || 500;
  const enterDelayMs = animation?.enter?.delayMs || 0;
  const enterStartFrame = sceneStartFrame + msToFrames(enterDelayMs, fps);
  const enterDurationFrames = msToFrames(enterDurationMs, fps);

  const exitType = animation?.exit?.type || 'none';
  const exitDurationMs = animation?.exit?.durationMs || EXIT_DURATIONS[exitType] || 300;
  const exitStartFrame = sceneStartFrame + sceneDurationFrames - msToFrames(exitDurationMs, fps);

  // Enter animation
  const enterAnim = calculateEnterAnimation(
    enterType,
    frame,
    fps,
    enterStartFrame,
    enterDurationMs
  );

  // Exit animation
  const exitAnim = calculateExitAnimation(exitType, frame, fps, exitStartFrame, exitDurationMs);

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

  // Combine opacities
  const isInExitPhase = frame >= exitStartFrame && exitType !== 'none';
  const finalOpacity = isInExitPhase ? exitAnim.opacity : enterAnim.opacity;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale}) ${enterAnim.transform}`,
        opacity: finalOpacity,
        fontFamily: 'monospace',
        fontSize,
        fontWeight: 'bold',
        color,
        textAlign: 'center',
        letterSpacing: '0.02em',
      }}
    >
      {displayValue}
    </div>
  );
};

export default Counter;
