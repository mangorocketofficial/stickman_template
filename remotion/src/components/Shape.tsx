/**
 * Shape - Arrow, line, circle, rectangle component
 *
 * Refactored to use useAnimationPhases hook for cleaner code
 */

import React from 'react';
import { ShapeProps, AnimationDef } from '../types/schema';
import { useAnimationPhases } from '../hooks/useAnimationPhases';
import { SHAPE } from '../constants';

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
  const {
    shape,
    from: fromPoint,
    to: toPoint,
    width = SHAPE.DEFAULT_WIDTH,
    height = SHAPE.DEFAULT_HEIGHT,
    color = SHAPE.DEFAULT_COLOR,
    strokeWidth = SHAPE.DEFAULT_STROKE_WIDTH,
    fill = false,
  } = props;

  // Use centralized animation hook
  const {
    enterAnim,
    finalOpacity,
    enterProgress,
  } = useAnimationPhases(
    animation,
    sceneStartFrame,
    sceneDurationFrames,
    { enterType: 'fadeIn', duringType: 'none', exitType: 'none' }
  );

  // Draw line progress for drawLine animation
  const isDrawLine = animation?.enter?.type === 'drawLine';
  const drawProgress = isDrawLine ? enterProgress : 1;

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

  const renderShape = () => {
    switch (shape) {
      case 'line': {
        const x1 = fromPoint ? fromPoint.x : 0;
        const y1 = fromPoint ? fromPoint.y : 0;
        const x2 = toPoint ? toPoint.x : width;
        const y2 = toPoint ? toPoint.y : 0;

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

        // Arrow head
        const angle = Math.atan2(y2 - y1, x2 - x1);

        // Interpolated end point for draw animation
        const endX = strokeWidth + (x2 - x1) * drawProgress;
        const endY = strokeWidth + (y2 - y1) * drawProgress;

        const arrowX1 = endX - SHAPE.ARROW_HEAD_LENGTH * Math.cos(angle - SHAPE.ARROW_HEAD_ANGLE);
        const arrowY1 = endY - SHAPE.ARROW_HEAD_LENGTH * Math.sin(angle - SHAPE.ARROW_HEAD_ANGLE);
        const arrowX2 = endX - SHAPE.ARROW_HEAD_LENGTH * Math.cos(angle + SHAPE.ARROW_HEAD_ANGLE);
        const arrowY2 = endY - SHAPE.ARROW_HEAD_LENGTH * Math.sin(angle + SHAPE.ARROW_HEAD_ANGLE);

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
