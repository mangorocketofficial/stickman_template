// Recursive SVG joint renderer for StickMan
// Uses Forward Kinematics with hierarchical SVG transforms

import React from 'react';
import { Pose } from '../../types/schema';
import { BONE_LENGTHS, SHOULDER_OFFSET, HIP_WIDTH } from './skeleton';

interface JointProps {
  pose: Pose;
  color: string;
  lineWidth: number;
}

/**
 * Render a single bone as an SVG line
 */
const Bone: React.FC<{
  length: number;
  color: string;
  lineWidth: number;
}> = ({ length, color, lineWidth }) => (
  <line
    x1={0}
    y1={0}
    x2={0}
    y2={-length}
    stroke={color}
    strokeWidth={lineWidth}
    strokeLinecap="round"
  />
);

/**
 * Arm component - upper arm and lower arm with hierarchical rotation
 */
const Arm: React.FC<{
  side: 'L' | 'R';
  pose: Pose;
  color: string;
  lineWidth: number;
}> = ({ side, pose, color, lineWidth }) => {
  const upperKey = `upperArm${side}` as keyof Pose;
  const lowerKey = `lowerArm${side}` as keyof Pose;

  const upperAngle = pose[upperKey];
  const lowerAngle = pose[lowerKey];
  const upperLength = side === 'L' ? BONE_LENGTHS.upperArmL : BONE_LENGTHS.upperArmR;
  const lowerLength = side === 'L' ? BONE_LENGTHS.lowerArmL : BONE_LENGTHS.lowerArmR;

  // Shoulder offset: left arm goes left, right arm goes right
  const shoulderX = side === 'L' ? -SHOULDER_OFFSET : SHOULDER_OFFSET;

  return (
    <g transform={`translate(${shoulderX}, 0)`}>
      {/* Upper arm rotation - arms rotate from shoulder, pointing down by default */}
      <g transform={`rotate(${180 + upperAngle})`}>
        <Bone length={upperLength} color={color} lineWidth={lineWidth} />
        {/* Lower arm at end of upper arm */}
        <g transform={`translate(0, ${-upperLength})`}>
          <g transform={`rotate(${lowerAngle})`}>
            <Bone length={lowerLength} color={color} lineWidth={lineWidth} />
          </g>
        </g>
      </g>
    </g>
  );
};

/**
 * Leg component - upper leg and lower leg with hierarchical rotation
 */
const Leg: React.FC<{
  side: 'L' | 'R';
  pose: Pose;
  color: string;
  lineWidth: number;
}> = ({ side, pose, color, lineWidth }) => {
  const upperKey = `upperLeg${side}` as keyof Pose;
  const lowerKey = `lowerLeg${side}` as keyof Pose;

  const upperAngle = pose[upperKey];
  const lowerAngle = pose[lowerKey];
  const upperLength = side === 'L' ? BONE_LENGTHS.upperLegL : BONE_LENGTHS.upperLegR;
  const lowerLength = side === 'L' ? BONE_LENGTHS.lowerLegL : BONE_LENGTHS.lowerLegR;

  // Hip offset: left leg goes left, right leg goes right
  const hipX = side === 'L' ? -HIP_WIDTH : HIP_WIDTH;

  return (
    <g transform={`translate(${hipX}, 0)`}>
      {/* Upper leg rotation - legs rotate from hip, pointing down by default */}
      <g transform={`rotate(${180 + upperAngle})`}>
        <Bone length={upperLength} color={color} lineWidth={lineWidth} />
        {/* Lower leg at end of upper leg */}
        <g transform={`translate(0, ${-upperLength})`}>
          <g transform={`rotate(${lowerAngle})`}>
            <Bone length={lowerLength} color={color} lineWidth={lineWidth} />
          </g>
        </g>
      </g>
    </g>
  );
};

/**
 * Body component - renders torso, arms attached at shoulders
 * Origin is at hip (bottom of torso)
 */
export const Body: React.FC<JointProps> = ({ pose, color, lineWidth }) => {
  return (
    <g transform={`rotate(${pose.torso})`}>
      {/* Torso line from hip to shoulders */}
      <Bone length={BONE_LENGTHS.torso} color={color} lineWidth={lineWidth} />

      {/* Arms below neck (shoulders) - 20px down from torso top for neck-shoulder gap */}
      <g transform={`translate(0, ${-BONE_LENGTHS.torso + 20})`}>
        <Arm side="L" pose={pose} color={color} lineWidth={lineWidth} />
        <Arm side="R" pose={pose} color={color} lineWidth={lineWidth} />
      </g>
    </g>
  );
};

/**
 * Legs component - both legs attached at hip
 * Origin is at hip
 */
export const Legs: React.FC<JointProps> = ({ pose, color, lineWidth }) => {
  return (
    <g>
      <Leg side="L" pose={pose} color={color} lineWidth={lineWidth} />
      <Leg side="R" pose={pose} color={color} lineWidth={lineWidth} />
    </g>
  );
};

/**
 * Get the head position based on current pose
 * Used by Face component to position the head correctly
 */
export function getHeadPosition(pose: Pose): { x: number; y: number } {
  // Head is at top of torso, account for torso rotation
  const torsoRad = (pose.torso * Math.PI) / 180;
  const torsoEndX = Math.sin(torsoRad) * BONE_LENGTHS.torso;
  const torsoEndY = -Math.cos(torsoRad) * BONE_LENGTHS.torso;

  return {
    x: torsoEndX,
    y: torsoEndY - BONE_LENGTHS.head,  // head radius above torso end
  };
}

/**
 * Get the head rotation based on torso and head angles
 */
export function getHeadRotation(pose: Pose): number {
  return pose.torso + pose.head;
}
