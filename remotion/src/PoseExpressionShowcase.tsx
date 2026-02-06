/**
 * PoseExpressionShowcase - Shows one large StickMan cycling through all poses and expressions
 * Great for detailed visual inspection
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { StickMan } from './components/StickMan';
import { POSE_NAMES } from './components/StickMan/poses';
import { EXPRESSION_NAMES } from './components/StickMan/expressions';

export const PoseExpressionShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cycle through poses every 2 seconds
  const poseCycleDuration = fps * 2;
  const currentPoseIndex = Math.floor(frame / poseCycleDuration) % POSE_NAMES.length;
  const currentPose = POSE_NAMES[currentPoseIndex];

  // Cycle through expressions every 1 second (faster than poses)
  const expressionCycleDuration = fps * 1;
  const currentExpressionIndex = Math.floor(frame / expressionCycleDuration) % EXPRESSION_NAMES.length;
  const currentExpression = EXPRESSION_NAMES[currentExpressionIndex];

  // Transition animation
  const transitionProgress = (frame % poseCycleDuration) / poseCycleDuration;
  const scale = spring({
    frame: frame % poseCycleDuration,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Pose: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{currentPose}</span>
          <span style={{ color: '#666', marginLeft: 10 }}>
            ({currentPoseIndex + 1}/{POSE_NAMES.length})
          </span>
        </div>

        <div
          style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Expression: <span style={{ color: '#00BFFF', fontWeight: 'bold' }}>{currentExpression}</span>
          <span style={{ color: '#666', marginLeft: 10 }}>
            ({currentExpressionIndex + 1}/{EXPRESSION_NAMES.length})
          </span>
        </div>
      </div>

      {/* Main StickMan */}
      <svg
        width={1920}
        height={900}
        viewBox="-300 -300 600 600"
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
        }}
      >
        <StickMan
          pose={currentPose}
          expression={currentExpression}
          position={{ x: 0, y: 100 }}
          scale={2.5 * (0.9 + scale * 0.1)}
          color="#FFFFFF"
          lineWidth={3}
          motion="breathing"
        />
      </svg>

      {/* Pose List (left side) */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 120,
          bottom: 80,
          width: 180,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          POSES
        </div>
        {POSE_NAMES.slice(0, 20).map((pose, i) => (
          <div
            key={pose}
            style={{
              color: pose === currentPose ? '#FFD700' : '#666',
              fontSize: 11,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {pose === currentPose ? '▶ ' : '  '}{pose}
          </div>
        ))}
        {POSE_NAMES.length > 20 && (
          <div style={{ color: '#666', fontSize: 10 }}>
            +{POSE_NAMES.length - 20} more...
          </div>
        )}
      </div>

      {/* Expression List (right side) */}
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: 120,
          bottom: 80,
          width: 150,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ color: '#00BFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          EXPRESSIONS
        </div>
        {EXPRESSION_NAMES.map((expr, i) => (
          <div
            key={expr}
            style={{
              color: expr === currentExpression ? '#00BFFF' : '#666',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            {expr === currentExpression ? '▶ ' : '  '}{expr}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 200,
          right: 200,
          height: 8,
          backgroundColor: '#333',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            width: `${(currentPoseIndex / POSE_NAMES.length) * 100}%`,
            height: '100%',
            backgroundColor: '#FFD700',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#666',
          fontSize: 12,
          fontFamily: 'monospace',
        }}
      >
        Total: {POSE_NAMES.length} poses × {EXPRESSION_NAMES.length} expressions = {POSE_NAMES.length * EXPRESSION_NAMES.length} combinations
      </div>
    </AbsoluteFill>
  );
};
