// Main StickMan component for Remotion
// Combines all parts: skeleton, poses, expressions, motions

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Pose } from '../../types/schema';
import { getPose, DEFAULT_POSE } from './poses';
import { getExpression, DEFAULT_EXPRESSION } from './expressions';
import { getMotion } from './motions';
import { applyMotion, interpolatePose } from './interpolation';
import { Body, Legs, getHeadPosition, getHeadRotation } from './Joint';
import { Face } from './Face';
import { BONE_LENGTHS } from './skeleton';

export interface StickManProps {
  // Pose can be a preset name or a full Pose object
  pose: string | Pose;
  // Expression name
  expression?: string;
  // Position on canvas
  position: { x: number; y: number };
  // Scale multiplier
  scale?: number;
  // Stroke color
  color?: string;
  // Line width
  lineWidth?: number;
  // Optional motion name for looping animations
  motion?: string;
  // For pose transitions: target pose and progress
  targetPose?: string | Pose;
  transitionProgress?: number;
  // Start time in ms for motion sync
  startTimeMs?: number;
}

/**
 * Resolve pose from name or object
 */
function resolvePose(pose: string | Pose): Pose {
  if (typeof pose === 'string') {
    return getPose(pose);
  }
  return pose;
}

/**
 * Main StickMan component
 *
 * Usage:
 * <StickMan
 *   pose="standing"
 *   expression="happy"
 *   position={{ x: 960, y: 600 }}
 * />
 */
export const StickMan: React.FC<StickManProps> = ({
  pose,
  expression = 'neutral',
  position,
  scale = 1,
  color = '#FFFFFF',
  lineWidth = 2,
  motion,
  targetPose,
  transitionProgress,
  startTimeMs = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate current time in milliseconds
  const currentTimeMs = (frame / fps) * 1000;
  const elapsedTimeMs = currentTimeMs - startTimeMs;

  // Resolve base pose
  let currentPose = useMemo(() => resolvePose(pose), [pose]);

  // Handle pose transition if target and progress are provided
  if (targetPose !== undefined && transitionProgress !== undefined) {
    const targetPoseResolved = resolvePose(targetPose);
    currentPose = interpolatePose(currentPose, targetPoseResolved, transitionProgress);
  }

  // Apply motion if specified
  if (motion) {
    const motionDef = getMotion(motion);
    if (motionDef) {
      currentPose = applyMotion(currentPose, motionDef, elapsedTimeMs);
    }
  }

  // Resolve expression
  const currentExpression = useMemo(
    () => getExpression(expression),
    [expression]
  );

  // Calculate head position and rotation
  const headPos = getHeadPosition(currentPose);
  const headRotation = getHeadRotation(currentPose);

  // Scaled line width
  const scaledLineWidth = lineWidth * scale;

  return (
    <svg
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        overflow: 'visible',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
      width={1}
      height={1}
    >
      {/* Origin is at hip position */}
      <g>
        {/* Legs (behind body) */}
        <Legs pose={currentPose} color={color} lineWidth={scaledLineWidth} />

        {/* Body (torso + arms) */}
        <Body pose={currentPose} color={color} lineWidth={scaledLineWidth} />

        {/* Head with expression */}
        <g transform={`translate(${headPos.x}, ${headPos.y})`}>
          <Face
            expression={currentExpression}
            color={color}
            lineWidth={scaledLineWidth}
            rotation={headRotation}
          />
        </g>
      </g>
    </svg>
  );
};

// Re-export utilities for external use
export { getPose, POSES, POSE_NAMES } from './poses';
export { getExpression, EXPRESSIONS, EXPRESSION_NAMES } from './expressions';
export { getMotion, MOTIONS, MOTION_NAMES } from './motions';
export { interpolatePose, applyMotion, blendMotion } from './interpolation';
export { BONE_LENGTHS, SKELETON, JOINT_NAMES } from './skeleton';
export type { Pose } from '../../types/schema';
export type { Expression, EyeStyle, MouthStyle } from './expressions';
export type { Motion, MotionKeyframe } from './motions';
