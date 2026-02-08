/**
 * LogoWatermark - Renders a logo/watermark at a configurable corner position
 *
 * v2: Supports branding overlay on AI image backgrounds.
 */

import React from 'react';
import { Img, staticFile } from 'remotion';

interface LogoWatermarkProps {
  src: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  opacity?: number;
  margin?: number;
}

const getPositionStyle = (
  position: LogoWatermarkProps['position'],
  margin: number,
): React.CSSProperties => {
  switch (position) {
    case 'top-left':
      return { top: margin, left: margin };
    case 'top-right':
      return { top: margin, right: margin };
    case 'bottom-left':
      return { bottom: margin, left: margin };
    case 'bottom-right':
    default:
      return { bottom: margin, right: margin };
  }
};

export const LogoWatermark: React.FC<LogoWatermarkProps> = ({
  src,
  position = 'bottom-right',
  size = 60,
  opacity = 0.7,
  margin = 20,
}) => {
  const posStyle = getPositionStyle(position, margin);

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        opacity,
        zIndex: 90,
        pointerEvents: 'none',
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default LogoWatermark;
