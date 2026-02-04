/**
 * IconElement - SVG icon display with animation
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { IconProps, AnimationDef } from '../types/schema';
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

interface IconElementProps {
  props: IconProps;
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

// Inline SVG icons for MVP - common infographic icons
const INLINE_ICONS: Record<string, React.FC<{ size: number; color: string }>> = {
  'money-bag': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L9 6H15L12 2Z"
        fill={color}
      />
      <path
        d="M7 8C5 10 4 13 4 16C4 20 7 22 12 22C17 22 20 20 20 16C20 13 19 10 17 8H7Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 12V18M10 14H14M10 16H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  'chart-up': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 20L9 14L13 18L21 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 10H21V14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'piggy-bank': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="13"
        rx="8"
        ry="6"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="16" cy="11" r="1" fill={color} />
      <path d="M12 7V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 15L3 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 15L21 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'lightbulb': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M9 21H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 24H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'warning': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 20H22L12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  ),

  'clock': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 6V12L16 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'star': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'check': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M8 12L11 15L16 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export const IconElement: React.FC<IconElementProps> = ({
  props,
  position,
  scale = 1,
  animation,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { name, size = 80, color = '#FFFFFF' } = props;

  // Animation phases
  const enterType = animation?.enter?.type || 'popIn';
  const enterDurationMs = animation?.enter?.durationMs || ENTER_DURATIONS[enterType] || 400;
  const enterDelayMs = animation?.enter?.delayMs || 0;
  const enterStartFrame = sceneStartFrame + msToFrames(enterDelayMs, fps);

  const duringType = animation?.during?.type || 'floating';

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

  // During animation
  const duringAnim = calculateDuringAnimation(
    duringType,
    frame,
    fps,
    animation?.during?.durationMs || DURING_CYCLES[duringType]
  );

  // Exit animation
  const exitAnim = calculateExitAnimation(exitType, frame, fps, exitStartFrame, exitDurationMs);

  const isInExitPhase = frame >= exitStartFrame && exitType !== 'none';
  const finalOpacity = isInExitPhase ? exitAnim.opacity : enterAnim.opacity;

  // Get icon component or fallback
  const IconComponent = INLINE_ICONS[name];

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale}) ${enterAnim.transform} ${duringAnim.transform}`,
        opacity: finalOpacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {IconComponent ? (
        <IconComponent size={size} color={color} />
      ) : (
        // Fallback: try to load from public/icons folder
        <img
          src={staticFile(`icons/${name}.svg`)}
          width={size}
          height={size}
          style={{
            filter: color !== '#FFFFFF' ? `drop-shadow(0 0 0 ${color})` : undefined,
          }}
          alt={name}
        />
      )}
    </div>
  );
};

export default IconElement;
