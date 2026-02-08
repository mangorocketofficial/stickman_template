// Pose interpolation and motion override logic for StickMan

import { Pose } from '../../types/schema';
import { JOINT_NAMES, JointName } from './skeleton';
import { Motion, MotionKeyframe } from './motions';

/**
 * Linearly interpolate between two angles
 * Handles wraparound for angles
 */
function lerpAngle(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Cubic ease-in-out for smooth pose transitions
 * Returns 0 at t=0, 1 at t=1, with smooth acceleration/deceleration
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Interpolate between two poses
 * @param poseA Starting pose
 * @param poseB Ending pose
 * @param t Progress 0-1
 * @returns Interpolated pose
 */
export function interpolatePose(poseA: Pose, poseB: Pose, t: number): Pose {
  const clampedT = Math.max(0, Math.min(1, t));

  const result: Pose = {} as Pose;

  for (const joint of JOINT_NAMES) {
    result[joint] = lerpAngle(poseA[joint], poseB[joint], clampedT);
  }

  return result;
}

/**
 * Apply motion override to a base pose
 * Motion overrides only affect specific joints, leaving others unchanged
 */
export function applyMotionOverride(
  basePose: Pose,
  overrides: Partial<Pose>
): Pose {
  return {
    ...basePose,
    ...overrides,
  };
}

/**
 * Find the two keyframes surrounding a given progress value
 * and interpolate between them
 */
function interpolateKeyframes(
  keyframes: MotionKeyframe[],
  progress: number
): Partial<Pose> {
  // Clamp progress to 0-1
  const p = ((progress % 1) + 1) % 1; // Handle negative values

  // Find surrounding keyframes
  let prevKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].progress && p <= keyframes[i + 1].progress) {
      prevKeyframe = keyframes[i];
      nextKeyframe = keyframes[i + 1];
      break;
    }
  }

  // Calculate local progress between the two keyframes
  const range = nextKeyframe.progress - prevKeyframe.progress;
  const localProgress = range > 0 ? (p - prevKeyframe.progress) / range : 0;

  // Interpolate overrides
  const result: Partial<Pose> = {};

  // Get all joints affected by either keyframe
  const allJoints = new Set<string>([
    ...Object.keys(prevKeyframe.overrides),
    ...Object.keys(nextKeyframe.overrides),
  ]);

  for (const joint of allJoints) {
    const jointKey = joint as JointName;
    const prevValue = prevKeyframe.overrides[jointKey] ?? 0;
    const nextValue = nextKeyframe.overrides[jointKey] ?? 0;
    result[jointKey] = lerpAngle(prevValue, nextValue, localProgress);
  }

  return result;
}

/**
 * Calculate motion override at a given time
 * @param motion Motion definition
 * @param timeMs Current time in milliseconds
 * @returns Pose overrides for affected joints
 */
export function getMotionOverride(motion: Motion, timeMs: number): Partial<Pose> {
  const progress = (timeMs % motion.cycleDurationMs) / motion.cycleDurationMs;
  return interpolateKeyframes(motion.keyframes, progress);
}

/**
 * Apply a looping motion to a base pose at a given time
 * @param basePose The base pose
 * @param motion The motion to apply
 * @param timeMs Current time in milliseconds
 * @returns Final pose with motion applied
 */
export function applyMotion(
  basePose: Pose,
  motion: Motion,
  timeMs: number
): Pose {
  const overrides = getMotionOverride(motion, timeMs);
  return applyMotionOverride(basePose, overrides);
}

/**
 * Blend a motion smoothly with the base pose
 * Useful for transitioning into/out of a motion
 * @param basePose The base pose
 * @param motion The motion to apply
 * @param timeMs Current time in milliseconds
 * @param blendFactor 0 = base pose only, 1 = full motion
 */
export function blendMotion(
  basePose: Pose,
  motion: Motion,
  timeMs: number,
  blendFactor: number
): Pose {
  const clampedBlend = Math.max(0, Math.min(1, blendFactor));

  if (clampedBlend === 0) return basePose;
  if (clampedBlend === 1) return applyMotion(basePose, motion, timeMs);

  const motionPose = applyMotion(basePose, motion, timeMs);
  return interpolatePose(basePose, motionPose, clampedBlend);
}
