/**
 * BackgroundRenderer - Renders various background types
 *
 * Supports:
 * - solid: Single color (backward compatible)
 * - gradient_linear: Linear gradient
 * - gradient_radial: Radial gradient
 * - pattern: Dot/grid patterns (future)
 * - animated: Animated backgrounds (future)
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  BackgroundDef,
  BackgroundValue,
  isSimpleBackground,
  isSceneBackground,
  getBackgroundColor,
} from '../types/schema';
import { CANVAS } from '../constants';

interface BackgroundRendererProps {
  background: BackgroundValue;
  width?: number;
  height?: number;
}

/**
 * Generate CSS gradient string from BackgroundDef
 */
const getGradientCSS = (bg: BackgroundDef): string => {
  const { type, colors, angle = 180 } = bg;

  if (colors.length === 0) {
    return '#1a1a2e'; // fallback
  }

  if (colors.length === 1) {
    return colors[0];
  }

  switch (type) {
    case 'gradient_linear':
      return `linear-gradient(${angle}deg, ${colors.join(', ')})`;

    case 'gradient_radial':
      return `radial-gradient(circle at center, ${colors.join(', ')})`;

    case 'solid':
    default:
      return colors[0];
  }
};

/**
 * Render pattern overlay (dots, grid)
 */
const PatternOverlay: React.FC<{
  pattern: BackgroundDef['pattern'];
  colors: string[];
  width: number;
  height: number;
}> = ({ pattern, colors, width, height }) => {
  const patternColor = colors[1] || 'rgba(255,255,255,0.1)';

  switch (pattern) {
    case 'dots':
      return (
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <defs>
            <pattern id="dots-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="2" fill={patternColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      );

    case 'grid':
      return (
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <defs>
            <pattern id="grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke={patternColor}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * Animated gradient shift background
 */
const AnimatedGradientShift: React.FC<{
  colors: string[];
  speed?: number;
  width: number;
  height: number;
}> = ({ colors, speed = 1, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate color shift based on frame
  const cycleDuration = (10 / speed) * fps; // 10 seconds per cycle at speed 1
  const progress = (frame % cycleDuration) / cycleDuration;

  // Shift the angle over time
  const angle = progress * 360;

  const gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`;

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        background: gradient,
      }}
    />
  );
};

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  background,
  width = CANVAS.WIDTH,
  height = CANVAS.HEIGHT,
}) => {
  // Simple string background (backward compatible)
  if (isSimpleBackground(background)) {
    return (
      <div
        style={{
          position: 'absolute',
          width,
          height,
          backgroundColor: background,
        }}
      />
    );
  }

  // v2 SceneBackground color type: {"type": "color", "value": "#FFFFFF"}
  if (isSceneBackground(background) && background.type === 'color') {
    return (
      <div
        style={{
          position: 'absolute',
          width,
          height,
          backgroundColor: background.value,
        }}
      />
    );
  }

  // Complex background definition (BackgroundDef with colors array)
  const bg = background as BackgroundDef;

  // Handle animated backgrounds
  if (bg.animation?.type === 'shift') {
    return (
      <div style={{ position: 'absolute', width, height }}>
        <AnimatedGradientShift
          colors={bg.colors}
          speed={bg.animation.speed}
          width={width}
          height={height}
        />
        {bg.pattern && (
          <PatternOverlay
            pattern={bg.pattern}
            colors={bg.colors}
            width={width}
            height={height}
          />
        )}
      </div>
    );
  }

  // Static gradient or solid
  const backgroundStyle = getGradientCSS(bg);

  return (
    <div style={{ position: 'absolute', width, height }}>
      <div
        style={{
          position: 'absolute',
          width,
          height,
          background: backgroundStyle,
        }}
      />
      {bg.pattern && (
        <PatternOverlay
          pattern={bg.pattern}
          colors={bg.colors}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default BackgroundRenderer;
