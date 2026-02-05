/**
 * useAnimationPhases - Centralized hook for calculating enter/during/exit animations
 *
 * This hook extracts the common animation calculation logic that was duplicated
 * across AnimatedText, Counter, Shape, IconElement components.
 */

import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimationDef } from '../types/schema';
import {
  calculateEnterAnimation,
  EnterAnimationResult,
} from '../animations/enter';
import {
  calculateDuringAnimation,
  DuringAnimationResult,
} from '../animations/during';
import {
  calculateExitAnimation,
  ExitAnimationResult,
} from '../animations/exit';
import { msToFrames } from '../utils/timing';
import { ANIMATION } from '../constants';

// =============================================================================
// TYPES
// =============================================================================

export interface AnimationConfig {
  enter?: AnimationDef;
  during?: AnimationDef;
  exit?: AnimationDef;
}

export interface AnimationPhaseDefaults {
  enterType?: string;
  enterDurationMs?: number;
  duringType?: string;
  duringCycleMs?: number;
  exitType?: string;
  exitDurationMs?: number;
}

export interface AnimationPhasesResult {
  // Individual animation results
  enterAnim: EnterAnimationResult;
  duringAnim: DuringAnimationResult;
  exitAnim: ExitAnimationResult;

  // Combined values (most commonly used)
  finalOpacity: number;
  combinedTransform: string;

  // Phase info
  isInEnterPhase: boolean;
  isInDuringPhase: boolean;
  isInExitPhase: boolean;

  // Frame references (for components that need them)
  enterStartFrame: number;
  exitStartFrame: number;
  enterDurationFrames: number;

  // Progress values (0-1)
  enterProgress: number;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for calculating all animation phases in a unified way
 *
 * @param animation - Animation configuration from scene object
 * @param sceneStartFrame - Frame number where the scene starts (within Sequence, this is 0)
 * @param sceneDurationFrames - Total duration of the scene in frames
 * @param defaults - Default animation types/durations for this component type
 *
 * @example
 * // In a component:
 * const { finalOpacity, combinedTransform, enterProgress } = useAnimationPhases(
 *   animation,
 *   0,  // sceneStartFrame (always 0 inside Sequence)
 *   sceneDurationFrames,
 *   { enterType: 'fadeIn', duringType: 'floating' }
 * );
 */
export const useAnimationPhases = (
  animation: AnimationConfig | undefined,
  sceneStartFrame: number,
  sceneDurationFrames: number,
  defaults: AnimationPhaseDefaults = {}
): AnimationPhasesResult => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ----- Determine animation types and durations -----

  // Enter animation
  const enterType = animation?.enter?.type || defaults.enterType || 'fadeIn';
  const enterDurationMs =
    animation?.enter?.durationMs ||
    defaults.enterDurationMs ||
    ANIMATION.ENTER[enterType as keyof typeof ANIMATION.ENTER] ||
    ANIMATION.DEFAULT_ENTER_DURATION;
  const enterDelayMs = animation?.enter?.delayMs || 0;
  const enterStartFrame = sceneStartFrame + msToFrames(enterDelayMs, fps);
  const enterDurationFrames = msToFrames(enterDurationMs, fps);

  // During animation
  const duringType = animation?.during?.type || defaults.duringType || 'none';
  const duringCycleMs =
    animation?.during?.durationMs ||
    defaults.duringCycleMs ||
    ANIMATION.DURING[duringType as keyof typeof ANIMATION.DURING] ||
    ANIMATION.DEFAULT_DURING_CYCLE;

  // Exit animation
  const exitType = animation?.exit?.type || defaults.exitType || 'none';
  const exitDurationMs =
    animation?.exit?.durationMs ||
    defaults.exitDurationMs ||
    ANIMATION.EXIT[exitType as keyof typeof ANIMATION.EXIT] ||
    ANIMATION.DEFAULT_EXIT_DURATION;
  const exitStartFrame = sceneStartFrame + sceneDurationFrames - msToFrames(exitDurationMs, fps);

  // ----- Calculate animation values -----

  const enterAnim = calculateEnterAnimation(
    enterType,
    frame,
    fps,
    enterStartFrame,
    enterDurationMs
  );

  const duringAnim = calculateDuringAnimation(
    duringType,
    frame,
    fps,
    duringCycleMs
  );

  const exitAnim = calculateExitAnimation(
    exitType,
    frame,
    fps,
    exitStartFrame,
    exitDurationMs
  );

  // ----- Determine current phase -----

  const enterEndFrame = enterStartFrame + enterDurationFrames;
  const isInEnterPhase = frame < enterEndFrame;
  const isInExitPhase = frame >= exitStartFrame && exitType !== 'none';
  const isInDuringPhase = !isInEnterPhase && !isInExitPhase;

  // ----- Calculate combined values -----

  // Opacity: exit takes precedence over enter
  const finalOpacity = isInExitPhase ? exitAnim.opacity : enterAnim.opacity;

  // Transform: combine enter + during (exit typically doesn't transform)
  const combinedTransform = `${enterAnim.transform} ${duringAnim.transform}`.trim();

  // Enter progress (useful for typewriter, drawLine, etc.)
  const enterProgress = Math.min(1, Math.max(0, (frame - enterStartFrame) / enterDurationFrames));

  return {
    // Individual animation results
    enterAnim,
    duringAnim,
    exitAnim,

    // Combined values
    finalOpacity,
    combinedTransform,

    // Phase info
    isInEnterPhase,
    isInDuringPhase,
    isInExitPhase,

    // Frame references
    enterStartFrame,
    exitStartFrame,
    enterDurationFrames,

    // Progress
    enterProgress,
  };
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get default animation settings for a component type
 * Useful for standardizing defaults across the codebase
 */
export const getComponentDefaults = (componentType: string): AnimationPhaseDefaults => {
  switch (componentType) {
    case 'text':
      return {
        enterType: 'fadeIn',
        duringType: 'none',
        exitType: 'none',
      };
    case 'icon':
      return {
        enterType: 'popIn',
        duringType: 'floating',
        exitType: 'none',
      };
    case 'counter':
      return {
        enterType: 'fadeIn',
        duringType: 'none',
        exitType: 'none',
      };
    case 'shape':
      return {
        enterType: 'fadeIn',
        duringType: 'none',
        exitType: 'none',
      };
    case 'stickman':
      return {
        enterType: 'fadeIn',
        duringType: 'breathing',
        exitType: 'none',
      };
    default:
      return {
        enterType: 'fadeIn',
        duringType: 'none',
        exitType: 'none',
      };
  }
};

export default useAnimationPhases;
