/**
 * ObjectRenderer - Routes object types to their respective components (v2)
 *
 * v2: Removed stickman, shape, icon routing (archived)
 * Kept: text, counter
 * Added: logo (future)
 */

import React from 'react';
import {
  SceneObject,
  TextProps,
  CounterProps,
  LogoProps,
  StickmanProps,
  VisualEffect,
} from './types/schema';
import AnimatedText from './components/AnimatedText';
import WhiteboardText from './components/WhiteboardText';
import Counter from './components/Counter';
import LogoWatermark from './components/LogoWatermark';
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

    if (styles.filter) {
      filters.push(styles.filter);
    }
    if (styles.boxShadow) {
      boxShadows.push(styles.boxShadow);
    }
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
  const { theme } = useTheme();
  const { type, position, scale, animation, props, effects = [] } = object;

  const effectStyles = combineEffectStyles(effects);
  const hasEffects = effects.length > 0;

  const commonProps = {
    position,
    scale,
    animation,
    sceneStartFrame,
    sceneDurationFrames,
  };

  const wrapWithEffects = (element: React.ReactNode): React.ReactNode => {
    if (!hasEffects) return element;
    return (
      <div style={{ ...effectStyles, display: 'contents' }}>
        {element}
      </div>
    );
  };

  switch (type) {
    case 'text': {
      const textProps = props as TextProps;
      const enterType = animation?.enter?.type;
      const duringType = animation?.during?.type;
      // Route to WhiteboardText for typing/handwriting/highlightSweep animations
      if (enterType === 'typing' || enterType === 'handwriting' || duringType === 'highlightSweep') {
        return wrapWithEffects(
          <WhiteboardText
            {...commonProps}
            props={textProps}
          />
        );
      }
      return wrapWithEffects(
        <AnimatedText
          {...commonProps}
          props={textProps}
        />
      );
    }

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

    case 'logo': {
      const logoProps = props as unknown as LogoProps;
      return wrapWithEffects(
        <LogoWatermark
          src={logoProps.src}
          size={logoProps.size}
          opacity={logoProps.opacity}
        />
      );
    }

    case 'stickman': {
      const stickmanProps = props as StickmanProps;
      const motionName = (animation?.during as { type?: string })?.type || 'breathing';
      const startTimeMs = (sceneStartFrame / fps) * 1000;
      return wrapWithEffects(
        <StickMan
          pose={stickmanProps.pose || 'standing'}
          expression={stickmanProps.expression || 'neutral'}
          position={position || { x: 300, y: 580 }}
          scale={scale || 1.5}
          color={stickmanProps.color || '#333333'}
          faceColor={stickmanProps.faceColor}
          lineWidth={stickmanProps.lineWidth || 3}
          motion={motionName}
          startTimeMs={startTimeMs}
          sceneDurationMs={(sceneDurationFrames / fps) * 1000}
        />
      );
    }

    // v1 legacy types — log warning but don't crash
    case 'shape':
    case 'icon':
      console.warn(`[v2] Object type "${type}" is no longer supported (archived in v1). Skipping.`);
      return null;

    default:
      console.warn(`Unknown object type: ${type}`);
      return null;
  }
};

export default ObjectRenderer;
