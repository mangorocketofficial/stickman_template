/**
 * EffectsLayer - Renders visual effects overlays for Track B-3
 *
 * Handles scene-level effects like vignette, spotlight, and screen shake.
 * Object-level effects are handled in ObjectRenderer.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { VisualEffect } from '../types/schema';
import {
  getVignetteStyles,
  getSpotlightStyles,
  getScreenShakeTransform,
} from '../utils/effects';
import { msToFrames } from '../utils/timing';

interface EffectsLayerProps {
  effects: VisualEffect[];
  sceneStartMs: number;
  width: number;
  height: number;
}

/**
 * EffectsLayer renders overlay effects that apply to the entire scene
 */
export const EffectsLayer: React.FC<EffectsLayerProps> = ({
  effects,
  sceneStartMs,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time relative to scene start
  const currentMs = (frame / fps) * 1000;

  // Filter effects that apply to the scene (not specific objects)
  const sceneEffects = effects.filter(
    (e) => !e.target || e.target === 'scene'
  );

  // Check if effect is active at current time
  const isEffectActive = (effect: VisualEffect): boolean => {
    const startMs = effect.startMs ?? 0;
    const endMs = effect.endMs ?? Infinity;
    return currentMs >= startMs && currentMs < endMs;
  };

  return (
    <>
      {sceneEffects.map((effect, index) => {
        if (!isEffectActive(effect)) return null;

        switch (effect.type) {
          case 'vignette':
            return (
              <div
                key={`vignette-${index}`}
                style={getVignetteStyles(effect.intensity) as React.CSSProperties}
              />
            );

          case 'spotlight': {
            // Default to center if no position specified
            const x = effect.options?.offsetX ?? width / 2;
            const y = effect.options?.offsetY ?? height / 2;
            const radius = effect.options?.radius ?? 300;
            return (
              <div
                key={`spotlight-${index}`}
                style={getSpotlightStyles(x, y, radius, effect.intensity) as React.CSSProperties}
              />
            );
          }

          case 'blur_background':
            return (
              <div
                key={`blur-${index}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width,
                  height,
                  backdropFilter: `blur(${(effect.options?.radius || 10) * (effect.intensity || 0.5)}px)`,
                  WebkitBackdropFilter: `blur(${(effect.options?.radius || 10) * (effect.intensity || 0.5)}px)`,
                  pointerEvents: 'none',
                }}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};

/**
 * Hook to get screen shake transform if screen_shake effect is active
 */
export const useScreenShake = (
  effects: VisualEffect[],
  sceneStartMs: number
): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const shakeEffect = effects.find((e) => {
    if (e.type !== 'screen_shake') return false;
    if (e.target && e.target !== 'scene') return false;
    const startMs = e.startMs ?? 0;
    const endMs = e.endMs ?? Infinity;
    return currentMs >= startMs && currentMs < endMs;
  });

  if (!shakeEffect) return 'none';

  return getScreenShakeTransform(
    frame,
    shakeEffect.intensity,
    shakeEffect.options?.frequency
  );
};

export default EffectsLayer;
