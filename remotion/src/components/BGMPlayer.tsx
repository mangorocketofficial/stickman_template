/**
 * BGMPlayer - Background music player with auto-ducking
 *
 * Features:
 * - BGM playback with loop support
 * - Auto-ducking during narration
 * - Fade in/out at video start/end
 * - Smooth volume transitions
 */

import React, { useMemo } from 'react';
import { Audio, useCurrentFrame, useVideoConfig, staticFile, interpolate } from 'remotion';
import { BGMConfig, SubtitleData, SegmentTimestamp } from '../types/schema';

interface BGMPlayerProps {
  config: BGMConfig;
  subtitleData?: SubtitleData;
  totalDurationFrames: number;
}

/**
 * Check if narration is active at a given frame
 */
const isNarrationActive = (
  frame: number,
  fps: number,
  segments?: SegmentTimestamp[]
): boolean => {
  if (!segments || segments.length === 0) return false;

  const currentMs = (frame / fps) * 1000;

  return segments.some(
    (segment) => currentMs >= segment.startMs && currentMs <= segment.endMs
  );
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

  // Base volume starts at target
  let currentVolume = volume;

  // Apply fade in
  if (frame < fadeInFrames) {
    currentVolume = interpolate(frame, [0, fadeInFrames], [0, volume], {
      extrapolateRight: 'clamp',
    });
  }

  // Apply fade out
  if (frame > fadeOutStart) {
    currentVolume = interpolate(
      frame,
      [fadeOutStart, totalDurationFrames],
      [volume, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // Apply ducking during narration
  const narrationActive = isNarrationActive(frame, fps, segments);
  if (narrationActive) {
    // Smooth transition to ducking level (over ~100ms = ~3 frames at 30fps)
    // For simplicity, we just use the ducking level directly
    // A more sophisticated approach would track narration state changes
    currentVolume = Math.min(currentVolume, duckingLevel);
  }

  return currentVolume;
};

export const BGMPlayer: React.FC<BGMPlayerProps> = ({
  config,
  subtitleData,
  totalDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Get BGM source
  const bgmSrc = config.src ? staticFile(config.src) : null;

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

  // Calculate dynamic volume
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
      startFrom={0}
    />
  );
};

export default BGMPlayer;
