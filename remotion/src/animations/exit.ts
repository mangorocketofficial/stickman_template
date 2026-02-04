/**
 * Exit animation presets
 */

import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Default durations in ms
export const EXIT_DURATIONS: Record<string, number> = {
  fadeOut: 300,
  none: 0,
};

export interface ExitAnimationResult {
  opacity: number;
  transform: string;
}

/**
 * Calculate exit animation values
 */
export const calculateExitAnimation = (
  type: string,
  frame: number,
  fps: number,
  exitStartFrame: number,
  durationMs: number = EXIT_DURATIONS[type] || 300
): ExitAnimationResult => {
  const durationFrames = Math.round((durationMs / 1000) * fps);
  const elapsed = frame - exitStartFrame;

  // Before exit starts
  if (elapsed < 0) {
    return {
      opacity: 1,
      transform: 'translate(0, 0)',
    };
  }

  const progress = Math.min(1, elapsed / durationFrames);

  switch (type) {
    case 'fadeOut':
      return {
        opacity: interpolate(progress, [0, 1], [1, 0]),
        transform: 'translate(0, 0)',
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
 * Hook for using exit animation in components
 */
export const useExitAnimation = (
  type: string,
  exitStartFrame: number,
  durationMs?: number
): ExitAnimationResult => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return calculateExitAnimation(type, frame, fps, exitStartFrame, durationMs);
};
