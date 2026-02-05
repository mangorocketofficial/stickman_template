/**
 * ObjectRenderer - Routes object types to their respective components
 */

import React from 'react';
import {
  SceneObject,
  StickmanProps,
  TextProps,
  IconProps,
  ShapeProps,
  CounterProps,
} from './types/schema';
import AnimatedText from './components/AnimatedText';
import Counter from './components/Counter';
import Shape from './components/Shape';
import IconElement from './components/IconElement';
import { StickMan } from './components/StickMan';
import { useVideoConfig } from 'remotion';

interface ObjectRendererProps {
  object: SceneObject;
  sceneStartFrame: number;
  sceneDurationFrames: number;
}

export const ObjectRenderer: React.FC<ObjectRendererProps> = ({
  object,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const { fps } = useVideoConfig();
  const { type, position, scale, animation, props } = object;

  const commonProps = {
    position,
    scale,
    animation,
    sceneStartFrame,
    sceneDurationFrames,
  };

  switch (type) {
    case 'stickman': {
      const stickmanProps = props as StickmanProps;
      // Convert sceneStartFrame to startTimeMs for motion sync
      const startTimeMs = (sceneStartFrame / fps) * 1000;
      // Get motion from during animation if specified
      const motion = animation?.during?.type;

      return (
        <StickMan
          pose={stickmanProps.pose}
          expression={stickmanProps.expression}
          position={position}
          scale={scale}
          color={stickmanProps.color}
          lineWidth={stickmanProps.lineWidth}
          motion={motion}
          startTimeMs={startTimeMs}
        />
      );
    }

    case 'text':
      return (
        <AnimatedText
          {...commonProps}
          props={props as TextProps}
        />
      );

    case 'counter':
      return (
        <Counter
          {...commonProps}
          props={props as CounterProps}
        />
      );

    case 'shape':
      return (
        <Shape
          {...commonProps}
          props={props as ShapeProps}
        />
      );

    case 'icon':
      return (
        <IconElement
          {...commonProps}
          props={props as IconProps}
        />
      );

    default:
      console.warn(`Unknown object type: ${type}`);
      return null;
  }
};

export default ObjectRenderer;
