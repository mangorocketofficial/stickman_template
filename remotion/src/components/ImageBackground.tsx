/**
 * ImageBackground - Renders AI-generated image as full-screen background
 *
 * Supports Ken Burns and other camera animations using spring-based easing.
 * v2: Core component for AI image pipeline.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, Img, staticFile, spring } from 'remotion';
import { ImageAnimation } from '../types/schema';

interface ImageBackgroundProps {
  src: string;
  animation?: ImageAnimation;
  animationIntensity?: number; // 0.0-1.0, default 0.5
  width?: number;
  height?: number;
}

/**
 * Calculate animation transform based on type and progress.
 * Uses spring-based easing for smooth motion.
 */
const getAnimationTransform = (
  animation: ImageAnimation,
  progress: number,  // 0.0 to 1.0
  intensity: number, // 0.0 to 1.0
): React.CSSProperties => {
  // Scale range: image scales from (1 + base) to (1 + base + range) or reverse
  const scaleBase = 1.0;
  const scaleRange = 0.15 * intensity; // max 15% zoom at intensity 1.0
  const panRange = 5 * intensity;       // max 5% pan at intensity 1.0

  switch (animation) {
    case 'kenBurns': {
      // Classic Ken Burns: slow zoom in + slight pan
      const scale = scaleBase + scaleRange * progress;
      const translateX = -panRange * progress;
      const translateY = -panRange * 0.5 * progress;
      return {
        transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
      };
    }

    case 'zoomIn': {
      const scale = scaleBase + scaleRange * progress;
      return {
        transform: `scale(${scale})`,
      };
    }

    case 'zoomOut': {
      const scale = scaleBase + scaleRange * (1 - progress);
      return {
        transform: `scale(${scale})`,
      };
    }

    case 'panLeft': {
      const translateX = panRange * (1 - progress);
      return {
        transform: `scale(${scaleBase + scaleRange * 0.3}) translateX(${translateX}%)`,
      };
    }

    case 'panRight': {
      const translateX = -panRange * (1 - progress);
      return {
        transform: `scale(${scaleBase + scaleRange * 0.3}) translateX(${translateX}%)`,
      };
    }

    case 'none':
    default:
      return {};
  }
};

export const ImageBackground: React.FC<ImageBackgroundProps> = ({
  src,
  animation = 'none',
  animationIntensity = 0.5,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width: videoWidth, height: videoHeight } = useVideoConfig();

  const w = width ?? videoWidth;
  const h = height ?? videoHeight;

  // Calculate smooth progress using spring
  const springProgress = spring({
    frame,
    fps,
    config: {
      damping: 200,  // Very smooth, no oscillation
      mass: 1,
      stiffness: 10, // Slow movement
    },
    durationInFrames,
  });

  // For animations, use linear progress (spring makes it too fast at start)
  // Blend between linear and spring for natural feel
  const linearProgress = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  const progress = animation === 'none' ? 0 : linearProgress * 0.7 + springProgress * 0.3;

  const animStyle = getAnimationTransform(animation, progress, animationIntensity);

  // Resolve the image source path
  const imgSrc = staticFile(src);

  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        overflow: 'hidden',
      }}
    >
      <Img
        src={imgSrc}
        style={{
          position: 'absolute',
          width: w,
          height: h,
          objectFit: 'cover',
          ...animStyle,
        }}
      />
    </div>
  );
};

export default ImageBackground;
