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
    direction = 'right',
    style = 'solid',
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

      // L1 V3 추가 도형들

      case 'curved_arrow': {
        // 곡선 화살표
        const curveWidth = width;
        const curveHeight = height;
        const isHorizontal = direction === 'left' || direction === 'right';

        let pathD: string;
        let arrowPath: string;

        if (direction === 'right') {
          pathD = `M ${strokeWidth} ${curveHeight / 2 + strokeWidth}
                   Q ${curveWidth / 2 + strokeWidth} ${strokeWidth}
                     ${curveWidth + strokeWidth} ${curveHeight / 2 + strokeWidth}`;
          arrowPath = `M ${curveWidth + strokeWidth - 10} ${curveHeight / 2 + strokeWidth - 8}
                       L ${curveWidth + strokeWidth} ${curveHeight / 2 + strokeWidth}
                       L ${curveWidth + strokeWidth - 10} ${curveHeight / 2 + strokeWidth + 8}`;
        } else if (direction === 'left') {
          pathD = `M ${curveWidth + strokeWidth} ${curveHeight / 2 + strokeWidth}
                   Q ${curveWidth / 2 + strokeWidth} ${strokeWidth}
                     ${strokeWidth} ${curveHeight / 2 + strokeWidth}`;
          arrowPath = `M ${strokeWidth + 10} ${curveHeight / 2 + strokeWidth - 8}
                       L ${strokeWidth} ${curveHeight / 2 + strokeWidth}
                       L ${strokeWidth + 10} ${curveHeight / 2 + strokeWidth + 8}`;
        } else if (direction === 'down') {
          pathD = `M ${curveWidth / 2 + strokeWidth} ${strokeWidth}
                   Q ${curveWidth + strokeWidth} ${curveHeight / 2 + strokeWidth}
                     ${curveWidth / 2 + strokeWidth} ${curveHeight + strokeWidth}`;
          arrowPath = `M ${curveWidth / 2 + strokeWidth - 8} ${curveHeight + strokeWidth - 10}
                       L ${curveWidth / 2 + strokeWidth} ${curveHeight + strokeWidth}
                       L ${curveWidth / 2 + strokeWidth + 8} ${curveHeight + strokeWidth - 10}`;
        } else {
          pathD = `M ${curveWidth / 2 + strokeWidth} ${curveHeight + strokeWidth}
                   Q ${curveWidth + strokeWidth} ${curveHeight / 2 + strokeWidth}
                     ${curveWidth / 2 + strokeWidth} ${strokeWidth}`;
          arrowPath = `M ${curveWidth / 2 + strokeWidth - 8} ${strokeWidth + 10}
                       L ${curveWidth / 2 + strokeWidth} ${strokeWidth}
                       L ${curveWidth / 2 + strokeWidth + 8} ${strokeWidth + 10}`;
        }

        return (
          <svg width={curveWidth + strokeWidth * 2} height={curveHeight + strokeWidth * 2} style={{ overflow: 'visible' }}>
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={isDrawLine ? `${curveWidth * 2} ${curveWidth * 2}` : undefined}
              strokeDashoffset={isDrawLine ? curveWidth * 2 * (1 - drawProgress) : undefined}
            />
            {drawProgress > 0.8 && (
              <path
                d={arrowPath}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        );
      }

      case 'bracket': {
        // 괄호 (중괄호 스타일)
        const bracketWidth = width;
        const bracketHeight = height;

        let pathD: string;

        if (direction === 'left') {
          // 왼쪽 방향 괄호 {
          pathD = `M ${bracketWidth + strokeWidth} ${strokeWidth}
                   Q ${strokeWidth} ${strokeWidth}
                     ${strokeWidth} ${bracketHeight / 2 + strokeWidth}
                   Q ${strokeWidth} ${bracketHeight + strokeWidth}
                     ${bracketWidth + strokeWidth} ${bracketHeight + strokeWidth}`;
        } else if (direction === 'right') {
          // 오른쪽 방향 괄호 }
          pathD = `M ${strokeWidth} ${strokeWidth}
                   Q ${bracketWidth + strokeWidth} ${strokeWidth}
                     ${bracketWidth + strokeWidth} ${bracketHeight / 2 + strokeWidth}
                   Q ${bracketWidth + strokeWidth} ${bracketHeight + strokeWidth}
                     ${strokeWidth} ${bracketHeight + strokeWidth}`;
        } else if (direction === 'up') {
          // 위쪽 방향 괄호
          pathD = `M ${strokeWidth} ${bracketHeight + strokeWidth}
                   Q ${strokeWidth} ${strokeWidth}
                     ${bracketWidth / 2 + strokeWidth} ${strokeWidth}
                   Q ${bracketWidth + strokeWidth} ${strokeWidth}
                     ${bracketWidth + strokeWidth} ${bracketHeight + strokeWidth}`;
        } else {
          // 아래쪽 방향 괄호
          pathD = `M ${strokeWidth} ${strokeWidth}
                   Q ${strokeWidth} ${bracketHeight + strokeWidth}
                     ${bracketWidth / 2 + strokeWidth} ${bracketHeight + strokeWidth}
                   Q ${bracketWidth + strokeWidth} ${bracketHeight + strokeWidth}
                     ${bracketWidth + strokeWidth} ${strokeWidth}`;
        }

        return (
          <svg width={bracketWidth + strokeWidth * 2} height={bracketHeight + strokeWidth * 2} style={{ overflow: 'visible' }}>
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={isDrawLine ? `${bracketHeight * 2} ${bracketHeight * 2}` : undefined}
              strokeDashoffset={isDrawLine ? bracketHeight * 2 * (1 - drawProgress) : undefined}
            />
          </svg>
        );
      }

      case 'divider': {
        // 구분선
        const dividerWidth = width;
        const dashArray = style === 'dashed' ? '15,10' : style === 'dotted' ? '5,8' : 'none';

        return (
          <svg width={dividerWidth + strokeWidth * 2} height={strokeWidth * 4} style={{ overflow: 'visible' }}>
            <line
              x1={strokeWidth}
              y1={strokeWidth * 2}
              x2={strokeWidth + dividerWidth * drawProgress}
              y2={strokeWidth * 2}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={dashArray}
            />
          </svg>
        );
      }

      case 'highlight_box': {
        // 하이라이트 박스 (둥근 모서리 + 반투명)
        const boxPadding = 10;
        return (
          <svg width={width + strokeWidth * 2 + boxPadding * 2} height={height + strokeWidth * 2 + boxPadding * 2}>
            <rect
              x={strokeWidth + boxPadding}
              y={strokeWidth + boxPadding}
              width={width * drawProgress}
              height={height}
              stroke={color}
              strokeWidth={strokeWidth}
              fill={color}
              fillOpacity={0.15}
              rx={12}
              ry={12}
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
