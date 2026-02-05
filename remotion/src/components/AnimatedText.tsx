/**
 * AnimatedText - Text component with enter/during/exit animation support
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { TextProps, AnimationDef } from '../types/schema';
import {
  calculateEnterAnimation,
  ENTER_DURATIONS,
} from '../animations/enter';
import {
  calculateDuringAnimation,
  DURING_CYCLES,
} from '../animations/during';
import {
  calculateExitAnimation,
  EXIT_DURATIONS,
} from '../animations/exit';
import { msToFrames } from '../utils/timing';

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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    content,
    fontSize = 48,
    fontWeight = 'normal',
    color = '#FFFFFF',
    maxWidth = 800,
    align = 'center',
  } = props;

  // Calculate animation phases
  const enterType = animation?.enter?.type || 'fadeIn';
  const enterDurationMs = animation?.enter?.durationMs || ENTER_DURATIONS[enterType] || 500;
  const enterDelayMs = animation?.enter?.delayMs || 0;
  const enterStartFrame = sceneStartFrame + msToFrames(enterDelayMs, fps);

  const duringType = animation?.during?.type || 'none';

  const exitType = animation?.exit?.type || 'none';
  const exitDurationMs = animation?.exit?.durationMs || EXIT_DURATIONS[exitType] || 300;
  const exitStartFrame = sceneStartFrame + sceneDurationFrames - msToFrames(exitDurationMs, fps);

  // Calculate enter animation
  const enterAnim = calculateEnterAnimation(
    enterType,
    frame,
    fps,
    enterStartFrame,
    enterDurationMs
  );

  // Calculate during animation
  const duringAnim = calculateDuringAnimation(
    duringType,
    frame,
    fps,
    animation?.during?.durationMs || DURING_CYCLES[duringType]
  );

  // Calculate exit animation
  const exitAnim = calculateExitAnimation(
    exitType,
    frame,
    fps,
    exitStartFrame,
    exitDurationMs
  );

  // Combine animations
  const isInExitPhase = frame >= exitStartFrame && exitType !== 'none';
  const finalOpacity = isInExitPhase ? exitAnim.opacity : enterAnim.opacity;

  // Handle typewriter effect
  const isTypewriter = enterType === 'typewriter';
  const typewriterProgress = isTypewriter
    ? Math.min(1, (frame - enterStartFrame) / msToFrames(enterDurationMs, fps))
    : 1;
  const visibleChars = isTypewriter
    ? Math.floor(content.length * typewriterProgress)
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
        fontFamily: 'sans-serif',
        fontSize,
        fontWeight,
        color,
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        lineHeight: 1.4,
      }}
    >
      {displayText}
      {isTypewriter && typewriterProgress < 1 && (
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
