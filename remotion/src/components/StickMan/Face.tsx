// SVG face renderer for StickMan
// Renders head circle and expression (eyes + mouth)

import React from 'react';
import { Expression, EyeStyle, MouthStyle } from './expressions';
import { BONE_LENGTHS } from './skeleton';

interface FaceProps {
  expression: Expression;
  color: string;
  lineWidth: number;
  rotation: number;  // head rotation angle
}

const HEAD_RADIUS = BONE_LENGTHS.head;

// Eye positioning
const EYE_Y = -5;           // above center
const EYE_SPACING = 8;      // distance from center
const BASE_EYE_SIZE = 2;

// Mouth positioning
const MOUTH_Y = 6;          // below center
const MOUTH_WIDTH = 10;

/**
 * Render a single eye based on style
 */
const Eye: React.FC<{
  x: number;
  style: EyeStyle;
  size: number;
  color: string;
  lineWidth: number;
}> = ({ x, style, size, color, lineWidth }) => {
  switch (style) {
    case 'dot':
      return (
        <circle cx={x} cy={EYE_Y} r={size} fill={color} />
      );

    case 'circle':
      return (
        <circle
          cx={x}
          cy={EYE_Y}
          r={size * 1.5}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
        />
      );

    case 'closed':
      return (
        <line
          x1={x - size}
          y1={EYE_Y}
          x2={x + size}
          y2={EYE_Y}
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    case 'wink':
      return (
        <path
          d={`M ${x - size} ${EYE_Y + size * 0.5} Q ${x} ${EYE_Y - size} ${x + size} ${EYE_Y + size * 0.5}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    default:
      return <circle cx={x} cy={EYE_Y} r={size} fill={color} />;
  }
};

/**
 * Render mouth based on style
 */
const Mouth: React.FC<{
  style: MouthStyle;
  size: number;
  color: string;
  lineWidth: number;
}> = ({ style, size, color, lineWidth }) => {
  const width = MOUTH_WIDTH * size;
  const halfWidth = width / 2;

  switch (style) {
    case 'line':
      return (
        <line
          x1={-halfWidth}
          y1={MOUTH_Y}
          x2={halfWidth}
          y2={MOUTH_Y}
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    case 'smile':
      return (
        <path
          d={`M ${-halfWidth} ${MOUTH_Y - 2} Q 0 ${MOUTH_Y + 6} ${halfWidth} ${MOUTH_Y - 2}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    case 'frown':
      return (
        <path
          d={`M ${-halfWidth} ${MOUTH_Y + 2} Q 0 ${MOUTH_Y - 4} ${halfWidth} ${MOUTH_Y + 2}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    case 'circle':
      return (
        <ellipse
          cx={0}
          cy={MOUTH_Y}
          rx={halfWidth * 0.5}
          ry={halfWidth * 0.4}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
        />
      );

    case 'wavy':
      return (
        <path
          d={`M ${-halfWidth} ${MOUTH_Y} Q ${-halfWidth * 0.5} ${MOUTH_Y - 3} 0 ${MOUTH_Y} Q ${halfWidth * 0.5} ${MOUTH_Y + 3} ${halfWidth} ${MOUTH_Y}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    default:
      return (
        <line
          x1={-halfWidth}
          y1={MOUTH_Y}
          x2={halfWidth}
          y2={MOUTH_Y}
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );
  }
};

/**
 * Face component - head circle with expression
 * Positioned at origin (0, 0) - parent should translate to correct position
 */
export const Face: React.FC<FaceProps> = ({
  expression,
  color,
  lineWidth,
  rotation,
}) => {
  const eyeSize = BASE_EYE_SIZE * (expression.eyeSize ?? 1);
  const mouthSize = expression.mouthSize ?? 1;

  return (
    <g transform={`rotate(${rotation})`}>
      {/* Head circle */}
      <circle
        cx={0}
        cy={0}
        r={HEAD_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
      />

      {/* Face features inside the head */}
      <g>
        {/* Left eye */}
        <Eye
          x={-EYE_SPACING}
          style={expression.leftEye}
          size={eyeSize}
          color={color}
          lineWidth={lineWidth}
        />
        {/* Right eye */}
        <Eye
          x={EYE_SPACING}
          style={expression.rightEye}
          size={eyeSize}
          color={color}
          lineWidth={lineWidth}
        />
        {/* Mouth */}
        <Mouth
          style={expression.mouth}
          size={mouthSize}
          color={color}
          lineWidth={lineWidth}
        />
      </g>
    </g>
  );
};
