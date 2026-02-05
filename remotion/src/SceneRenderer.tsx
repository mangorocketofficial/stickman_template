/**
 * SceneRenderer - Renders a single scene with background, transitions, and objects
 *
 * Updated for Track B-1: Now supports gradient and pattern backgrounds
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Scene } from './types/schema';
import ObjectRenderer from './ObjectRenderer';
import BackgroundRenderer from './components/BackgroundRenderer';
import { msToFrames } from './utils/timing';

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
  } = scene;

  // Calculate scene timing
  const sceneStartFrame = msToFrames(startMs, fps);
  const sceneEndFrame = msToFrames(endMs, fps);
  const sceneDurationFrames = sceneEndFrame - sceneStartFrame;

  // Transition settings
  const transitionIn = transition?.in || 'fadeIn';
  const transitionOut = transition?.out || 'fadeOut';
  const transitionDurationMs = transition?.durationMs || 300;
  const transitionDurationFrames = msToFrames(transitionDurationMs, fps);

  // Calculate transition opacity
  // Note: Inside Sequence, useCurrentFrame() already returns frame relative to Sequence start (0-based)
  const relativeFrame = frame;

  let transitionOpacity = 1;

  // Fade in at scene start
  if (transitionIn === 'fadeIn' && relativeFrame < transitionDurationFrames) {
    transitionOpacity = interpolate(
      relativeFrame,
      [0, transitionDurationFrames],
      [0, 1],
      { extrapolateRight: 'clamp' }
    );
  }

  // Fade out at scene end
  if (transitionOut === 'fadeOut') {
    const fadeOutStart = sceneDurationFrames - transitionDurationFrames;
    if (relativeFrame > fadeOutStart) {
      transitionOpacity = interpolate(
        relativeFrame,
        [fadeOutStart, sceneDurationFrames],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    }
  }

  // Sort objects by layer
  const sortedObjects = [...objects].sort((a, b) => {
    const layerA = a.layer ?? 1;
    const layerB = b.layer ?? 1;
    return layerA - layerB;
  });

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        opacity: transitionOpacity,
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
    </div>
  );
};

export default SceneRenderer;
