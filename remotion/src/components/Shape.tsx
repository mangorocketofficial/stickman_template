/**
 * Shape - Arrow, line, circle, rectangle component
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ShapeProps, AnimationDef } from '../types/schema';
import {
  calculateEnterAnimation,
  ENTER_DURATIONS,
} from '../animations/enter';
import {
  calculateExitAnimation,
  EXIT_DURATIONS,
} from '../animations/exit';
import { msToFrames } from '../utils/timing';

interface AnimatedShapeProps {
  props: ShapeProps;
  position: { x: number; y: number };
  scale?: number;
  animation?: {
    enter?: AnimationDef;
    during?: AnimationDef;
    exit?: AnimationDef;
  };
  sceneStartFrame: number;
  sceneDurationFrames: number;
}

export const Shape: React.FC<AnimatedShapeProps> = ({
  props,
  position,
  scale = 1,
  animation,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    shape,
    from: fromPoint,
    to: toPoint,
    width = 100,
    height = 100,
    color = '#FFFFFF',
    strokeWidth = 3,
    fill = false,
  } = props;

  // Animation phases
  const enterType = animation?.enter?.type || 'fadeIn';
  const enterDurationMs = animation?.enter?.durationMs || ENTER_DURATIONS[enterType] || 500;
  const enterDelayMs = animation?.enter?.delayMs || 0;
  const enterStartFrame = sceneStartFrame + msToFrames(enterDelayMs, fps);

  const exitType = animation?.exit?.type || 'none';
  const exitDurationMs = animation?.exit?.durationMs || EXIT_DURATIONS[exitType] || 300;
  const exitStartFrame = sceneStartFrame + sceneDurationFrames - msToFrames(exitDurationMs, fps);

  // Enter animation
  const enterAnim = calculateEnterAnimation(
    enterType,
    frame,
    fps,
    enterStartFrame,
    enterDurationMs
  );

  // Exit animation
  const exitAnim = calculateExitAnimation(exitType, frame, fps, exitStartFrame, exitDurationMs);

  const isInExitPhase = frame >= exitStartFrame && exitType !== 'none';
  const finalOpacity = isInExitPhase ? exitAnim.opacity : enterAnim.opacity;

  // Calculate SVG dimensions based on shape type
  const getSvgDimensions = () => {
    if ((shape === 'line' || shape === 'arrow') && fromPoint && toPoint) {
      const dx = Math.abs(toPoint.x - fromPoint.x);
      const dy = Math.abs(toPoint.y - fromPoint.y);
      return {
        width: Math.max(dx + strokeWidth * 2, 50),
        height: Math.max(dy + strokeWidth * 2, 50),
      };
    }
    return { width: width + strokeWidth * 2, height: height + strokeWidth * 2 };
  };

  const svgDims = getSvgDimensions();

  // Draw line progress for drawLine animation
  const isDrawLine = enterType === 'drawLine';
  const drawProgress = isDrawLine
    ? Math.min(
        1,
        Math.max(0, (frame - enterStartFrame) / msToFrames(enterDurationMs, fps))
      )
    : 1;

  const renderShape = () => {
    switch (shape) {
      case 'line': {
        const x1 = fromPoint ? fromPoint.x : 0;
        const y1 = fromPoint ? fromPoint.y : 0;
        const x2 = toPoint ? toPoint.x : width;
        const y2 = toPoint ? toPoint.y : 0;

        // Calculate line length for dash animation
        const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        return (
          <svg width={svgDims.width} height={svgDims.height} style={{ overflow: 'visible' }}>
            <line
              x1={strokeWidth}
              y1={strokeWidth}
              x2={strokeWidth + (x2 - x1) * drawProgress}
              y2={strokeWidth + (y2 - y1) * drawProgress}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </svg>
        );
      }

      case 'arrow': {
        const x1 = fromPoint ? fromPoint.x : 0;
        const y1 = fromPoint ? fromPoint.y : 0;
        const x2 = toPoint ? toPoint.x : width;
        const y2 = toPoint ? toPoint.y : 0;

        // Arrow head size
        const headLength = 15;
        const headAngle = Math.PI / 6;
        const angle = Math.atan2(y2 - y1, x2 - x1);

        // Interpolated end point for draw animation
        const endX = strokeWidth + (x2 - x1) * drawProgress;
        const endY = strokeWidth + (y2 - y1) * drawProgress;

        const arrowX1 = endX - headLength * Math.cos(angle - headAngle);
        const arrowY1 = endY - headLength * Math.sin(angle - headAngle);
        const arrowX2 = endX - headLength * Math.cos(angle + headAngle);
        const arrowY2 = endY - headLength * Math.sin(angle + headAngle);

        return (
          <svg width={svgDims.width} height={svgDims.height} style={{ overflow: 'visible' }}>
            <line
              x1={strokeWidth}
              y1={strokeWidth}
              x2={endX}
              y2={endY}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {drawProgress > 0.8 && (
              <>
                <line
                  x1={endX}
                  y1={endY}
                  x2={arrowX1}
                  y2={arrowY1}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                <line
                  x1={endX}
                  y1={endY}
                  x2={arrowX2}
                  y2={arrowY2}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        );
      }

      case 'circle': {
        const radius = Math.min(width, height) / 2;
        return (
          <svg width={width + strokeWidth * 2} height={height + strokeWidth * 2}>
            <circle
              cx={width / 2 + strokeWidth}
              cy={height / 2 + strokeWidth}
              r={radius * drawProgress}
              stroke={color}
              strokeWidth={strokeWidth}
              fill={fill ? color : 'none'}
              fillOpacity={fill ? 0.3 : 0}
            />
          </svg>
        );
      }

      case 'rectangle': {
        return (
          <svg width={width + strokeWidth * 2} height={height + strokeWidth * 2}>
            <rect
              x={strokeWidth}
              y={strokeWidth}
              width={width * drawProgress}
              height={height}
              stroke={color}
              strokeWidth={strokeWidth}
              fill={fill ? color : 'none'}
              fillOpacity={fill ? 0.3 : 0}
              rx={4}
              ry={4}
            />
          </svg>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale}) ${enterAnim.transform}`,
        opacity: finalOpacity,
      }}
    >
      {renderShape()}
    </div>
  );
};

export default Shape;
