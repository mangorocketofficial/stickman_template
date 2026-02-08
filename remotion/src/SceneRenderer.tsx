/**
 * SceneRenderer - Renders a single scene with background, transitions, and objects
 *
 * v2: Supports AI-generated image backgrounds and overlay system.
 * Backward compatible with v1 scene.json (string backgrounds + objects[]).
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Scene,
  TransitionType,
  SceneOverlay,
  TextProps,
  CounterProps,
  LogoProps,
  isImageBackground,
  isSimpleBackground,
} from './types/schema';
import ObjectRenderer from './ObjectRenderer';
import BackgroundRenderer from './components/BackgroundRenderer';
import ImageBackground from './components/ImageBackground';
import LogoWatermark from './components/LogoWatermark';
import EffectsLayer, { useScreenShake } from './components/EffectsLayer';
import AnimatedText from './components/AnimatedText';
import Counter from './components/Counter';
import { msToFrames } from './utils/timing';
import {
  getTransitionStyle,
  getTransitionProgress,
} from './utils/transitions';
import { getCameraPreset, calculateCameraState } from './direction/camera';
import { useTheme } from './contexts/ThemeContext';

interface SceneRendererProps {
  scene: Scene;
  globalStartFrame: number;
}

/**
 * Render a v2 overlay element (text, counter, logo)
 */
const OverlayRenderer: React.FC<{
  overlay: SceneOverlay;
  sceneStartFrame: number;
  sceneDurationFrames: number;
}> = ({ overlay, sceneStartFrame, sceneDurationFrames }) => {
  const { type, position, props, animation } = overlay;

  const commonProps = {
    position,
    animation,
    sceneStartFrame,
    sceneDurationFrames,
  };

  switch (type) {
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

    case 'logo': {
      const logoProps = props as LogoProps;
      return (
        <LogoWatermark
          src={logoProps.src}
          size={logoProps.size}
          opacity={logoProps.opacity}
        />
      );
    }

    default:
      console.warn(`Unknown overlay type: ${type}`);
      return null;
  }
};

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  globalStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { theme } = useTheme();

  const {
    id,
    startMs,
    endMs,
    background,
    transition,
    objects,
    overlays,
    effects = [],
    camera,
  } = scene;

  // Calculate scene timing
  const sceneStartFrame = msToFrames(startMs, fps);
  const sceneEndFrame = msToFrames(endMs, fps);
  const sceneDurationFrames = sceneEndFrame - sceneStartFrame;

  // Transition settings
  const transitionIn = (transition?.in || 'fadeIn') as TransitionType;
  const transitionOut = (transition?.out || 'fadeOut') as TransitionType;
  const transitionDurationMs = transition?.durationMs || 300;
  const transitionDurationFrames = msToFrames(transitionDurationMs, fps);

  // Note: Inside Sequence, useCurrentFrame() already returns frame relative to Sequence start (0-based)
  const relativeFrame = frame;

  // Calculate enter transition progress and style
  const enterProgress = getTransitionProgress(
    relativeFrame,
    sceneDurationFrames,
    transitionDurationFrames,
    true
  );
  const enterStyle = getTransitionStyle(
    transitionIn,
    enterProgress,
    true,
    width,
    height
  );

  // Calculate exit transition progress and style
  const exitProgress = getTransitionProgress(
    relativeFrame,
    sceneDurationFrames,
    transitionDurationFrames,
    false
  );
  const exitStyle = getTransitionStyle(
    transitionOut,
    exitProgress,
    false,
    width,
    height
  );

  // Combine transitions: enter applies at start, exit applies at end
  const isInEnterPhase = relativeFrame < transitionDurationFrames;
  const isInExitPhase = relativeFrame > sceneDurationFrames - transitionDurationFrames;

  let finalOpacity = 1;
  let finalTransform = 'none';
  let finalClipPath: string | undefined;

  if (isInEnterPhase && transitionIn !== 'none') {
    finalOpacity = enterStyle.opacity;
    finalTransform = enterStyle.transform;
    finalClipPath = enterStyle.clipPath;
  } else if (isInExitPhase && transitionOut !== 'none') {
    finalOpacity = exitStyle.opacity;
    finalTransform = exitStyle.transform;
    finalClipPath = exitStyle.clipPath;
  }

  // Sort objects by layer (v1 compat)
  const sortedObjects = [...objects].sort((a, b) => {
    const layerA = a.layer ?? 1;
    const layerB = b.layer ?? 1;
    return layerA - layerB;
  });

  // Get screen shake transform if effect is active
  const shakeTransform = useScreenShake(effects, startMs);

  // Calculate camera state based on preset
  const cameraPreset = camera ? getCameraPreset(camera) : null;
  const cameraProgress = sceneDurationFrames > 0 ? relativeFrame / sceneDurationFrames : 0;
  const cameraState = cameraPreset
    ? calculateCameraState(cameraPreset, cameraProgress)
    : { zoom: 1, offsetX: 0, offsetY: 0 };

  // Build camera transform string
  const cameraTransform = cameraState.zoom !== 1 || cameraState.offsetX !== 0 || cameraState.offsetY !== 0
    ? `scale(${cameraState.zoom}) translate(${cameraState.offsetX}px, ${cameraState.offsetY}px)`
    : 'none';

  // Combine all transforms: transition + shake + camera
  let combinedTransform = finalTransform;
  if (shakeTransform !== 'none') {
    combinedTransform = combinedTransform !== 'none'
      ? `${combinedTransform} ${shakeTransform}`
      : shakeTransform;
  }
  if (cameraTransform !== 'none') {
    combinedTransform = combinedTransform !== 'none'
      ? `${combinedTransform} ${cameraTransform}`
      : cameraTransform;
  }

  // Determine background rendering mode
  const isImage = isImageBackground(background);

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        opacity: finalOpacity,
        transform: combinedTransform,
        clipPath: finalClipPath,
        overflow: 'hidden',
      }}
    >
      {/* Background layer */}
      {isImage ? (
        <ImageBackground
          src={(background as { type: "image"; src: string; animation?: string; animationIntensity?: number }).src}
          animation={(background as { animation?: string }).animation as any}
          animationIntensity={(background as { animationIntensity?: number }).animationIntensity}
          width={width}
          height={height}
        />
      ) : (
        <BackgroundRenderer
          background={background}
          width={width}
          height={height}
        />
      )}

      {/* v1: Render objects sorted by layer */}
      {sortedObjects.length > 0 && sortedObjects.map((obj) => (
        <ObjectRenderer
          key={obj.id}
          object={obj}
          sceneStartFrame={0}
          sceneDurationFrames={sceneDurationFrames}
        />
      ))}

      {/* v2: Render overlays on top of image background */}
      {overlays && overlays.length > 0 && overlays.map((overlay) => (
        <OverlayRenderer
          key={overlay.id}
          overlay={overlay}
          sceneStartFrame={0}
          sceneDurationFrames={sceneDurationFrames}
        />
      ))}

      {/* Effects overlay layer (vignette, spotlight, etc.) */}
      {effects.length > 0 && (
        <EffectsLayer
          effects={effects}
          sceneStartMs={startMs}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default SceneRenderer;
