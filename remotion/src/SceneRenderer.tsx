/**
 * SceneRenderer - Renders a single scene with background, transitions, and objects
 *
 * Updated for Track B-1: Now supports gradient and pattern backgrounds
 * Updated for Track B-5: Enhanced transition support (wipe, slide, crossfade)
 * Updated for Track B-3: Visual effects (vignette, spotlight, screen shake)
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene, TransitionType } from './types/schema';
import ObjectRenderer from './ObjectRenderer';
import BackgroundRenderer from './components/BackgroundRenderer';
import EffectsLayer, { useScreenShake } from './components/EffectsLayer';
import { msToFrames } from './utils/timing';
import {
  getTransitionStyle,
  getTransitionProgress,
} from './utils/transitions';
import { getCameraPreset, calculateCameraState } from './direction/camera';

interface SceneRendererProps {
  scene: Scene;
  globalStartFrame: number;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  globalStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const {
    id,
    startMs,
    endMs,
    background,
    transition,
    objects,
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
  // During middle of scene, both should be at "complete" state
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

  // Sort objects by layer
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
      {/* Background layer (supports gradients, patterns, animations) */}
      <BackgroundRenderer
        background={background}
        width={width}
        height={height}
      />

      {/* Render objects sorted by layer */}
      {/* sceneStartFrame=0 because frame is already relative to Sequence start */}
      {sortedObjects.map((obj) => (
        <ObjectRenderer
          key={obj.id}
          object={obj}
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
