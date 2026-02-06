/**
 * BGMPlayer - Background music player with auto-ducking
 *
 * Features:
 * - BGM playback with loop support
 * - Auto-ducking during narration with smooth transitions
 * - Fade in/out at video start/end
 * - Configurable ducking attack/release times
 *
 * Updated for Track B-9: Improved audio mixing
 * - Smooth ducking transitions (attack/release)
 * - Lookahead for predictive ducking
 */

import React, { useMemo } from 'react';
import { Audio, useCurrentFrame, useVideoConfig, staticFile, interpolate, Easing } from 'remotion';
import { BGMConfig, SubtitleData, SegmentTimestamp } from '../types/schema';

interface BGMPlayerProps {
  config: BGMConfig;
  subtitleData?: SubtitleData;
  totalDurationFrames: number;
}

// Default ducking timing configuration
const DUCKING_ATTACK_MS = 150;   // Time to duck down when narration starts
const DUCKING_RELEASE_MS = 300;  // Time to restore volume when narration ends

/**
 * Calculate ducking multiplier with smooth transitions
 */
const calculateDuckingMultiplier = (
  currentMs: number,
  segments: SegmentTimestamp[],
  attackMs: number = DUCKING_ATTACK_MS,
  releaseMs: number = DUCKING_RELEASE_MS
): number => {
  if (!segments || segments.length === 0) {
    return 1.0; // No ducking
  }

  // Check all segment boundaries for smooth transitions
  let duckingFactor = 1.0;

  for (const segment of segments) {
    // Attack phase: approaching segment start
    const attackStart = segment.startMs - attackMs;
    if (currentMs >= attackStart && currentMs < segment.startMs) {
      const progress = (currentMs - attackStart) / attackMs;
      const attackFactor = 1.0 - progress;
      duckingFactor = Math.min(duckingFactor, attackFactor);
    }

    // During narration: fully ducked
    if (currentMs >= segment.startMs && currentMs <= segment.endMs) {
      duckingFactor = 0;
    }

    // Release phase: after segment end
    const releaseEnd = segment.endMs + releaseMs;
    if (currentMs > segment.endMs && currentMs < releaseEnd) {
      const progress = (currentMs - segment.endMs) / releaseMs;
      const releaseFactor = progress;
      duckingFactor = Math.min(duckingFactor, releaseFactor);
    }
  }

  return Math.max(0, Math.min(1, duckingFactor));
};

/**
 * Calculate volume with ducking and fade effects
 */
const calculateVolume = (
  frame: number,
  fps: number,
  config: BGMConfig,
  totalDurationFrames: number,
  segments?: SegmentTimestamp[]
): number => {
  const {
    volume = 0.3,
    duckingLevel = 0.1,
    fadeInMs = 2000,
    fadeOutMs = 3000,
  } = config;

  const fadeInFrames = Math.round((fadeInMs / 1000) * fps);
  const fadeOutFrames = Math.round((fadeOutMs / 1000) * fps);
  const fadeOutStart = totalDurationFrames - fadeOutFrames;
  const currentMs = (frame / fps) * 1000;

  // Start with full volume
  let currentVolume = volume;

  // Apply fade in
  if (frame < fadeInFrames) {
    currentVolume = interpolate(
      frame,
      [0, fadeInFrames],
      [0, volume],
      { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
    );
  }

  // Apply fade out
  if (frame > fadeOutStart) {
    currentVolume = interpolate(
      frame,
      [fadeOutStart, totalDurationFrames],
      [volume, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) }
    );
  }

  // Apply smooth ducking during narration
  if (segments && segments.length > 0) {
    const duckingMultiplier = calculateDuckingMultiplier(currentMs, segments);

    // Interpolate between ducking level and full volume
    const duckingRange = volume - duckingLevel;
    currentVolume = duckingLevel + (duckingRange * duckingMultiplier);

    // Respect fade in/out limits
    currentVolume = Math.min(currentVolume, volume);
    if (frame < fadeInFrames) {
      const fadeProgress = frame / fadeInFrames;
      currentVolume *= fadeProgress;
    }
    if (frame > fadeOutStart) {
      const fadeProgress = 1 - ((frame - fadeOutStart) / fadeOutFrames);
      currentVolume *= Math.max(0, fadeProgress);
    }
  }

  return Math.max(0, currentVolume);
};

export const BGMPlayer: React.FC<BGMPlayerProps> = ({
  config,
  subtitleData,
  totalDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If no source and mood is specified, use default path pattern
  const effectiveSrc = useMemo(() => {
    if (config.src) {
      return staticFile(config.src);
    }
    if (config.mood) {
      // Default path pattern: audio/bgm/{mood}.mp3
      return staticFile(`audio/bgm/${config.mood}.mp3`);
    }
    return null;
  }, [config.src, config.mood]);

  if (!effectiveSrc) {
    return null;
  }

  // Calculate dynamic volume with smooth ducking
  const currentVolume = calculateVolume(
    frame,
    fps,
    config,
    totalDurationFrames,
    subtitleData?.segments
  );

  return (
    <Audio
      src={effectiveSrc}
      volume={currentVolume}
      loop={config.loop !== false} // default true
    />
  );
};

export default BGMPlayer;
