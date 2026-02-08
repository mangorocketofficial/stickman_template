/**
 * StickMan Placeholder - To be replaced by Agent 3's implementation
 * This is a simple placeholder for testing the rendering pipeline
 */

import React from 'react';
import { StickmanProps } from '../../types/schema';

interface StickManPlaceholderProps {
  props: StickmanProps;
  position: { x: number; y: number };
  scale?: number;
  sceneStartFrame: number;
  sceneDurationFrames: number;
}

/**
 * Simple SVG stick figure placeholder
 * Agent 3 will replace this with the full pose/motion/expression system
 */
export const StickManPlaceholder: React.FC<StickManPlaceholderProps> = ({
  props,
  position,
  scale = 1,
}) => {
  const { color = '#FFFFFF', lineWidth = 3 } = props;

  // Simple static stick figure
  const headRadius = 20;
  const torsoLength = 80;
  const armLength = 45;
  const legLength = 55;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <svg
        width="200"
        height="250"
        viewBox="-100 -20 200 250"
        style={{ overflow: 'visible' }}
      >
        {/* Head */}
        <circle
          cx={0}
          cy={0}
          r={headRadius}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth}
        />

        {/* Simple face - eyes */}
        <circle cx={-7} cy={-3} r={2} fill={color} />
        <circle cx={7} cy={-3} r={2} fill={color} />

        {/* Simple face - mouth */}
        <line
          x1={-5}
          y1={8}
          x2={5}
          y2={8}
          stroke={color}
          strokeWidth={lineWidth - 1}
          strokeLinecap="round"
        />

        {/* Torso */}
        <line
          x1={0}
          y1={headRadius}
          x2={0}
          y2={headRadius + torsoLength}
          stroke={color}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />

        {/* Left arm */}
        <line
          x1={0}
          y1={headRadius + 15}
          x2={-armLength}
          y2={headRadius + 50}
          stroke={color}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />

        {/* Right arm */}
        <line
          x1={0}
          y1={headRadius + 15}
          x2={armLength}
          y2={headRadius + 50}
          stroke={color}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />

        {/* Left leg */}
        <line
          x1={0}
          y1={headRadius + torsoLength}
          x2={-30}
          y2={headRadius + torsoLength + legLength}
          stroke={color}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />

        {/* Right leg */}
        <line
          x1={0}
          y1={headRadius + torsoLength}
          x2={30}
          y2={headRadius + torsoLength + legLength}
          stroke={color}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default StickManPlaceholder;
