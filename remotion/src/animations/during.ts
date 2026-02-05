/**
 * During (loop) animation presets
 */

import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Default cycle durations in ms
export const DURING_CYCLES: Record<string, number> = {
  floating: 2000,
  pulse: 1500,
  breathing: 2000,
  nodding: 600,
  waving: 500,
  poseSequence: 0, // Variable
  none: 0,
};

export interface DuringAnimationResult {
  transform: string;
  scale?: number;
}

/**
 * Calculate during/loop animation values
 */
export const calculateDuringAnimation = (
  type: string,
  frame: number,
  fps: number,
  cycleMs: number = DURING_CYCLES[type] || 2000
): DuringAnimationResult => {
  if (cycleMs === 0) {
    return { transform: 'translate(0, 0)' };
  }

  // Calculate current position in cycle (0 to 1)
  const cycleFrames = Math.round((cycleMs / 1000) * fps);
  const cycleProgress = (frame % cycleFrames) / cycleFrames;

  // Use sine wave for smooth oscillation (0 to 2π)
  const sineValue = Math.sin(cycleProgress * Math.PI * 2);

  switch (type) {
    case 'floating':
      // Gentle Y oscillation (±5px)
      return {
        transform: `translateY(${sineValue * 5}px)`,
      };

    case 'pulse':
      // Gentle scale oscillation (0.98–1.02)
      const pulseScale = 1 + sineValue * 0.02;
      return {
        transform: `scale(${pulseScale})`,
        scale: pulseScale,
      };

    case 'breathing':
      // Subtle torso movement - used by StickMan component
      // Returns small rotation value for torso
      return {
        transform: `rotate(${sineValue * 1}deg)`,
      };

    case 'nodding':
      // Head nod loop (0→15→0 degrees)
      // Uses absolute sine to keep positive
      const nodAngle = Math.abs(sineValue) * 15;
      return {
        transform: `rotate(${nodAngle}deg)`,
      };

    case 'waving':
      // Arm wave (±30 degrees)
      return {
        transform: `rotate(${sineValue * 30}deg)`,
      };

    case 'none':
    default:
      return {
        transform: 'translate(0, 0)',
      };
  }
};

/**
 * Get joint override values for StickMan motions
 */
export const getMotionJointOverrides = (
  motionType: string,
  frame: number,
  fps: number
): Record<string, number> => {
  const cycleMs = DURING_CYCLES[motionType] || 2000;
  if (cycleMs === 0) return {};

  const cycleFrames = Math.round((cycleMs / 1000) * fps);
  const cycleProgress = (frame % cycleFrames) / cycleFrames;
  const sineValue = Math.sin(cycleProgress * Math.PI * 2);

  switch (motionType) {
    case 'breathing':
      return {
        torso: sineValue * 1, // ±1 degree
      };

    case 'nodding':
      return {
        head: Math.abs(sineValue) * 15, // 0→15→0 degrees
      };

    case 'waving':
      return {
        lowerArmR: sineValue * 30, // ±30 degrees
      };

    case 'walkCycle': {
      // Alternating leg/arm swing
      const walkCycleFrames = Math.round((800 / 1000) * fps);
      const walkProgress = (frame % walkCycleFrames) / walkCycleFrames;
      const walkSine = Math.sin(walkProgress * Math.PI * 2);

      return {
        upperLegL: walkSine * 20,
        upperLegR: -walkSine * 20,
        lowerLegL: Math.abs(walkSine) * 15,
        lowerLegR: Math.abs(-walkSine) * 15,
        upperArmL: -walkSine * 15,
        upperArmR: walkSine * 15,
      };
    }

    default:
      return {};
  }
};

/**
 * Hook for using during animation in components
 */
export const useDuringAnimation = (
  type: string,
  cycleMs?: number
): DuringAnimationResult => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return calculateDuringAnimation(type, frame, fps, cycleMs);
};
