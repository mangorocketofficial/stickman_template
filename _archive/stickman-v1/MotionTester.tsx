/**
 * MotionTester - Component for testing individual motions in isolation
 * Renders a large StickMan with the specified motion for easy visual inspection
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { StickMan } from './components/StickMan';
import { MOTION_NAMES } from './components/StickMan/motions';

export interface MotionTesterProps {
  motionName?: string;
  backgroundColor?: string;
}

export const MotionTester: React.FC<MotionTesterProps> = ({
  motionName = 'breathing',
  backgroundColor = '#1a1a2e',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Motion name display */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#ffffff',
          fontSize: 48,
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
        }}
      >
        Motion: {motionName}
      </div>

      {/* Frame info */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#888888',
          fontSize: 24,
          fontFamily: 'monospace',
        }}
      >
        Frame: {frame} | Time: {currentTimeMs.toFixed(0)}ms
      </div>

      {/* StickMan with motion */}
      <StickMan
        pose="standing"
        expression="neutral"
        position={{ x: width / 2, y: height / 2 + 100 }}
        scale={4}
        color="#FFFFFF"
        lineWidth={4}
        motion={motionName}
        startTimeMs={0}
      />

      {/* Available motions list */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#666666',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Available: {MOTION_NAMES.join(', ')}
      </div>
    </AbsoluteFill>
  );
};
