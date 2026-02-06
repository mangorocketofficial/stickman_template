// SVG face renderer for StickMan
// Renders filled head circle and expression (eyes + mouth)

import React from 'react';
import { Expression, EyeStyle, MouthStyle } from './expressions';
import { BONE_LENGTHS } from './skeleton';

interface FaceProps {
  expression: Expression;
  color: string;
  lineWidth: number;
  rotation: number;  // head rotation angle
  backgroundColor?: string;  // for eye/mouth contrast
}

const HEAD_RADIUS = BONE_LENGTHS.head;

// Eye positioning (scaled for radius 30)
const EYE_Y = -10;          // above center
const EYE_SPACING = 14;     // distance from center
const BASE_EYE_SIZE = 4;

// Mouth positioning (scaled for radius 30)
const MOUTH_Y = 10;         // below center
const MOUTH_WIDTH = 18;

// Default background color for contrast
const DEFAULT_BG = '#1a1a2e';

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

    case 'narrow':
      // Narrow horizontal line for focused expression
      return (
        <line
          x1={x - size * 1.2}
          y1={EYE_Y}
          x2={x + size * 1.2}
          y2={EYE_Y}
          stroke={color}
          strokeWidth={lineWidth * 0.6}
          strokeLinecap="round"
        />
      );

    case 'angry':
      // Angry eye with eyebrow - eye dot + angled eyebrow
      const isLeftEye = x < 0;
      const browAngle = isLeftEye ? -20 : 20;
      const browOffsetX = isLeftEye ? size * 0.3 : -size * 0.3;
      return (
        <g>
          {/* Eye dot */}
          <circle cx={x} cy={EYE_Y} r={size * 0.8} fill={color} />
          {/* Angry eyebrow */}
          <line
            x1={x - size * 1.5 + browOffsetX}
            y1={EYE_Y - size * 2}
            x2={x + size * 1.5 + browOffsetX}
            y2={EYE_Y - size * 2}
            stroke={color}
            strokeWidth={lineWidth * 0.6}
            strokeLinecap="round"
            transform={`rotate(${browAngle}, ${x}, ${EYE_Y - size * 2})`}
          />
        </g>
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
          d={`M ${-halfWidth} ${MOUTH_Y - 3} Q 0 ${MOUTH_Y + 10} ${halfWidth} ${MOUTH_Y - 3}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    case 'frown':
      return (
        <path
          d={`M ${-halfWidth} ${MOUTH_Y + 3} Q 0 ${MOUTH_Y - 7} ${halfWidth} ${MOUTH_Y + 3}`}
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
          d={`M ${-halfWidth} ${MOUTH_Y} Q ${-halfWidth * 0.5} ${MOUTH_Y - 5} 0 ${MOUTH_Y} Q ${halfWidth * 0.5} ${MOUTH_Y + 5} ${halfWidth} ${MOUTH_Y}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
        />
      );

    case 'wide_smile':
      // Wide D-shaped smile for excited expression
      return (
        <path
          d={`M ${-halfWidth} ${MOUTH_Y - 2} Q 0 ${MOUTH_Y + 15} ${halfWidth} ${MOUTH_Y - 2} L ${halfWidth} ${MOUTH_Y - 2} Q 0 ${MOUTH_Y + 2} ${-halfWidth} ${MOUTH_Y - 2} Z`}
          fill={color}
          stroke={color}
          strokeWidth={lineWidth * 0.3}
          strokeLinecap="round"
        />
      );

    case 'angry':
      // Inverted V shape for angry expression
      return (
        <path
          d={`M ${-halfWidth * 0.6} ${MOUTH_Y + 4} L 0 ${MOUTH_Y - 2} L ${halfWidth * 0.6} ${MOUTH_Y + 4}`}
          fill="none"
          stroke={color}
          strokeWidth={lineWidth * 0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
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
 * Face component - filled head circle with expression
 * Positioned at origin (0, 0) - parent should translate to correct position
 */
export const Face: React.FC<FaceProps> = ({
  expression,
  color,
  lineWidth,
  rotation,
  backgroundColor = DEFAULT_BG,
}) => {
  const eyeSize = BASE_EYE_SIZE * (expression.eyeSize ?? 1);
  const mouthSize = expression.mouthSize ?? 1;

  return (
    <g transform={`rotate(${rotation})`}>
      {/* Head circle - filled */}
      <circle
        cx={0}
        cy={0}
        r={HEAD_RADIUS}
        fill={color}
        stroke={color}
        strokeWidth={lineWidth}
      />

      {/* Face features inside the head - contrasting color */}
      <g>
        {/* Left eye */}
        <Eye
          x={-EYE_SPACING}
          style={expression.leftEye}
          size={eyeSize}
          color={backgroundColor}
          lineWidth={lineWidth}
        />
        {/* Right eye */}
        <Eye
          x={EYE_SPACING}
          style={expression.rightEye}
          size={eyeSize}
          color={backgroundColor}
          lineWidth={lineWidth}
        />
        {/* Mouth */}
        <Mouth
          style={expression.mouth}
          size={mouthSize}
          color={backgroundColor}
          lineWidth={lineWidth}
        />
      </g>
    </g>
  );
};
