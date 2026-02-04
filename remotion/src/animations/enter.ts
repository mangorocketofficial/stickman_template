/**
 * Enter animation presets
 */

import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Default durations in ms
export const ENTER_DURATIONS: Record<string, number> = {
  fadeIn: 500,
  fadeInUp: 600,
  slideLeft: 500,
  slideRight: 500,
  popIn: 400,
  typewriter: 1000,
  drawLine: 800,
  none: 0,
};

export interface EnterAnimationResult {
  opacity: number;
  transform: string;
  clipPath?: string;
}

/**
 * Calculate enter animation values
 */
export const calculateEnterAnimation = (
  type: string,
  frame: number,
  fps: number,
  startFrame: number,
  durationMs: number = ENTER_DURATIONS[type] || 500,
  direction?: 'left' | 'right' | 'top' | 'bottom'
): EnterAnimationResult => {
  const durationFrames = Math.round((durationMs / 1000) * fps);
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / durationFrames));

  switch (type) {
    case 'fadeIn':
      return {
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: 'translate(0, 0)',
      };

    case 'fadeInUp':
      return {
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      };

    case 'slideLeft':
      return {
        opacity: 1,
        transform: `translateX(${interpolate(progress, [0, 1], [-100, 0])}%)`,
      };

    case 'slideRight':
      return {
        opacity: 1,
        transform: `translateX(${interpolate(progress, [0, 1], [100, 0])}%)`,
      };

    case 'popIn': {
      // Spring-based scaling
      const scale = spring({
        frame: frame - startFrame,
        fps,
        config: {
          damping: 12,
          stiffness: 200,
          mass: 0.5,
        },
      });
      return {
        opacity: Math.min(1, progress * 3),
        transform: `scale(${scale})`,
      };
    }

    case 'typewriter':
      // Typewriter effect returns a clip path for text reveal
      return {
        opacity: 1,
        transform: 'translate(0, 0)',
        clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
      };

    case 'drawLine':
      // For shapes - reveals progressively
      return {
        opacity: 1,
        transform: 'translate(0, 0)',
        clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
      };

    case 'none':
    default:
      return {
        opacity: 1,
        transform: 'translate(0, 0)',
      };
  }
};

/**
 * Hook for using enter animation in components
 */
export const useEnterAnimation = (
  type: string,
  startFrame: number,
  durationMs?: number,
  direction?: 'left' | 'right' | 'top' | 'bottom'
): EnterAnimationResult => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return calculateEnterAnimation(type, frame, fps, startFrame, durationMs, direction);
};
