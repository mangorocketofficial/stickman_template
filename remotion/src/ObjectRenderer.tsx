/**
 * ObjectRenderer - Routes object types to their respective components
 *
 * Updated for Track B-2: Theme integration
 * - Uses theme colors as defaults when props don't specify color
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
import { useTheme } from './contexts/ThemeContext';

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
  const { theme, getAccentColor } = useTheme();
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
          color={stickmanProps.color || theme.stickman}
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

    case 'counter': {
      const counterProps = props as CounterProps;
      return (
        <Counter
          {...commonProps}
          props={{
            ...counterProps,
            color: counterProps.color || theme.text.accent,
          }}
        />
      );
    }

    case 'shape': {
      const shapeProps = props as ShapeProps;
      // Use rotating accent colors for shapes based on object index
      const accentIndex = object.id ? parseInt(object.id.replace(/\D/g, ''), 10) || 0 : 0;
      return (
        <Shape
          {...commonProps}
          props={{
            ...shapeProps,
            color: shapeProps.color || getAccentColor(accentIndex),
          }}
        />
      );
    }

    case 'icon': {
      const iconProps = props as IconProps;
      // Use rotating accent colors for icons based on object index
      const accentIndex = object.id ? parseInt(object.id.replace(/\D/g, ''), 10) || 0 : 0;
      return (
        <IconElement
          {...commonProps}
          props={{
            ...iconProps,
            color: iconProps.color || getAccentColor(accentIndex),
          }}
        />
      );
    }

    default:
      console.warn(`Unknown object type: ${type}`);
      return null;
  }
};

export default ObjectRenderer;
