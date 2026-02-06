/**
 * Scene Transition Utilities for Track B-5
 *
 * Provides transition calculations for various scene transition types:
 * - fadeIn/fadeOut: Opacity transitions (existing)
 * - crossfade: Overlapping fade between scenes
 * - wipe_left/wipe_right/wipe_up/wipe_down: Directional wipe reveals
 * - slide_push: Push previous scene out
 */

import { interpolate, Easing } from 'remotion';
import { TransitionType } from '../types/schema';

export interface TransitionStyle {
  opacity: number;
  transform: string;
  clipPath?: string;
}

/**
 * Calculate transition styles based on type and progress
 *
 * @param type - Transition type
 * @param progress - Animation progress (0 to 1)
 * @param isEnter - true for enter transitions, false for exit
 * @param width - Canvas width (for slide calculations)
 * @param height - Canvas height (for slide calculations)
 */
export const getTransitionStyle = (
  type: TransitionType,
  progress: number,
  isEnter: boolean,
  width: number,
  height: number
): TransitionStyle => {
  // Clamp progress to 0-1
  const p = Math.max(0, Math.min(1, progress));

  switch (type) {
    // ===== FADE TRANSITIONS =====
    case 'fadeIn':
      return {
        opacity: isEnter ? p : 1,
        transform: 'none',
      };

    case 'fadeOut':
      return {
        opacity: isEnter ? 1 : 1 - p,
        transform: 'none',
      };

    case 'crossfade':
      // Same as fade but typically used with overlapping scenes
      return {
        opacity: isEnter ? p : 1 - p,
        transform: 'none',
      };

    // ===== WIPE TRANSITIONS =====
    case 'wipe_left':
      // Reveal from left to right
      if (isEnter) {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        };
      } else {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(0 0 0 ${p * 100}%)`,
        };
      }

    case 'wipe_right':
      // Reveal from right to left
      if (isEnter) {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`,
        };
      } else {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(0 ${p * 100}% 0 0)`,
        };
      }

    case 'wipe_up':
      // Reveal from bottom to top
      if (isEnter) {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
        };
      } else {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(0 0 ${p * 100}% 0)`,
        };
      }

    case 'wipe_down':
      // Reveal from top to bottom
      if (isEnter) {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
        };
      } else {
        return {
          opacity: 1,
          transform: 'none',
          clipPath: `inset(${p * 100}% 0 0 0)`,
        };
      }

    // ===== SLIDE TRANSITIONS =====
    case 'slide_push':
      // New scene pushes old scene out
      if (isEnter) {
        // Enter from right
        const translateX = (1 - p) * width;
        return {
          opacity: 1,
          transform: `translateX(${translateX}px)`,
        };
      } else {
        // Exit to left
        const translateX = -p * width;
        return {
          opacity: 1,
          transform: `translateX(${translateX}px)`,
        };
      }

    // ===== SPECIAL TRANSITIONS =====
    case 'dissolve':
      // Pixel dissolve effect (approximated with opacity + noise)
      return {
        opacity: isEnter ? p : 1 - p,
        transform: 'none',
      };

    case 'zoom_through':
      // Zoom in while fading
      if (isEnter) {
        const scale = 0.8 + 0.2 * p;
        return {
          opacity: p,
          transform: `scale(${scale})`,
        };
      } else {
        const scale = 1 + 0.3 * p;
        return {
          opacity: 1 - p,
          transform: `scale(${scale})`,
        };
      }

    case 'none':
    default:
      return {
        opacity: 1,
        transform: 'none',
      };
  }
};

/**
 * Calculate transition progress based on frame position
 *
 * @param relativeFrame - Current frame relative to scene start
 * @param sceneDurationFrames - Total scene duration in frames
 * @param transitionDurationFrames - Transition duration in frames
 * @param isEnter - true for enter phase, false for exit phase
 */
export const getTransitionProgress = (
  relativeFrame: number,
  sceneDurationFrames: number,
  transitionDurationFrames: number,
  isEnter: boolean
): number => {
  if (isEnter) {
    // Enter transition at scene start
    if (relativeFrame >= transitionDurationFrames) {
      return 1; // Transition complete
    }
    return interpolate(
      relativeFrame,
      [0, transitionDurationFrames],
      [0, 1],
      { extrapolateRight: 'clamp' }
    );
  } else {
    // Exit transition at scene end
    const exitStart = sceneDurationFrames - transitionDurationFrames;
    if (relativeFrame <= exitStart) {
      return 0; // Not yet in exit phase
    }
    return interpolate(
      relativeFrame,
      [exitStart, sceneDurationFrames],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }
};

/**
 * Check if a transition type requires overlap handling
 * (where two scenes need to be visible simultaneously)
 */
export const isOverlapTransition = (type: TransitionType): boolean => {
  return ['crossfade', 'dissolve'].includes(type);
};

/**
 * Check if transition needs clip-path support
 */
export const isClipPathTransition = (type: TransitionType): boolean => {
  return ['wipe_left', 'wipe_right', 'wipe_up', 'wipe_down'].includes(type);
};

export default getTransitionStyle;
