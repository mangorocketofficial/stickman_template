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
import StickManPlaceholder from './components/StickMan/StickManPlaceholder';

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
  const { type, position, scale, animation, props } = object;

  const commonProps = {
    position,
    scale,
    animation,
    sceneStartFrame,
    sceneDurationFrames,
  };

  switch (type) {
    case 'stickman':
      return (
        <StickManPlaceholder
          {...commonProps}
          props={props as StickmanProps}
        />
      );

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
