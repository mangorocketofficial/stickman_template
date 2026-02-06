/**
 * ObjectRenderer - Routes object types to their respective components
 *
 * Updated for Track B-2: Theme integration
 * - Uses theme colors as defaults when props don't specify color
 *
 * Updated for Track B-3: Visual effects
 * - Supports per-object effects (glow, shadow)
 */

import React from 'react';
import {
  SceneObject,
  StickmanProps,
  TextProps,
  IconProps,
  ShapeProps,
  CounterProps,
  VisualEffect,
} from './types/schema';
import AnimatedText from './components/AnimatedText';
import Counter from './components/Counter';
import Shape from './components/Shape';
import IconElement from './components/IconElement';
import { StickMan } from './components/StickMan';
import { useVideoConfig } from 'remotion';
import { useTheme } from './contexts/ThemeContext';
import { getEffectStyles } from './utils/effects';

interface ObjectRendererProps {
  object: SceneObject;
  sceneStartFrame: number;
  sceneDurationFrames: number;
}

/**
 * Combine effect styles into a single style object
 */
const combineEffectStyles = (effects: VisualEffect[]): React.CSSProperties => {
  if (!effects || effects.length === 0) return {};

  const combined: React.CSSProperties = {};
  const filters: string[] = [];
  const boxShadows: string[] = [];

  effects.forEach((effect) => {
    const styles = getEffectStyles(effect);

    // Collect filters
    if (styles.filter) {
      filters.push(styles.filter);
    }

    // Collect box shadows
    if (styles.boxShadow) {
      boxShadows.push(styles.boxShadow);
    }

    // Add text-specific styles
    if (styles.WebkitTextStroke) {
      combined.WebkitTextStroke = styles.WebkitTextStroke;
    }
    if (styles.textShadow) {
      combined.textShadow = styles.textShadow;
    }
  });

  if (filters.length > 0) {
    combined.filter = filters.join(' ');
  }
  if (boxShadows.length > 0) {
    combined.boxShadow = boxShadows.join(', ');
  }

  return combined;
};

export const ObjectRenderer: React.FC<ObjectRendererProps> = ({
  object,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const { fps } = useVideoConfig();
  const { theme, getAccentColor } = useTheme();
  const { type, position, scale, animation, props, effects = [] } = object;

  // Get combined effect styles for this object
  const effectStyles = combineEffectStyles(effects);
  const hasEffects = effects.length > 0;

  const commonProps = {
    position,
    scale,
    animation,
    sceneStartFrame,
    sceneDurationFrames,
  };

  // Wrapper function to apply effects
  const wrapWithEffects = (element: React.ReactNode): React.ReactNode => {
    if (!hasEffects) return element;
    return (
      <div style={{ ...effectStyles, display: 'contents' }}>
        {element}
      </div>
    );
  };

  switch (type) {
    case 'stickman': {
      const stickmanProps = props as StickmanProps;
      // Convert sceneStartFrame to startTimeMs for motion sync
      const startTimeMs = (sceneStartFrame / fps) * 1000;
      // Get motion from during animation if specified
      const motion = animation?.during?.type;

      return wrapWithEffects(
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
      return wrapWithEffects(
        <AnimatedText
          {...commonProps}
          props={props as TextProps}
        />
      );

    case 'counter': {
      const counterProps = props as CounterProps;
      return wrapWithEffects(
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
      return wrapWithEffects(
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
      return wrapWithEffects(
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
