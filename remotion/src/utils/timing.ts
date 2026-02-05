/**
 * Timing utility functions for ms ↔ frame conversion
 */

/**
 * Convert milliseconds to frame number
 */
export const msToFrames = (ms: number, fps: number): number => {
  return Math.round((ms / 1000) * fps);
};

/**
 * Convert frame number to milliseconds
 */
export const framesToMs = (frames: number, fps: number): number => {
  return (frames / fps) * 1000;
};

/**
 * Get duration in frames from start and end milliseconds
 */
export const getDurationInFrames = (startMs: number, endMs: number, fps: number): number => {
  return msToFrames(endMs - startMs, fps);
};

/**
 * Get the current time in ms from frame
 */
export const getCurrentTimeMs = (frame: number, fps: number): number => {
  return framesToMs(frame, fps);
};

/**
 * Calculate the relative frame within a scene
 */
export const getRelativeFrame = (
  currentFrame: number,
  sceneStartFrame: number
): number => {
  return Math.max(0, currentFrame - sceneStartFrame);
};

/**
 * Check if current frame is within a time range (in ms)
 */
export const isWithinRange = (
  currentFrame: number,
  startMs: number,
  endMs: number,
  fps: number
): boolean => {
  const currentMs = framesToMs(currentFrame, fps);
  return currentMs >= startMs && currentMs < endMs;
};

/**
 * Get progress (0-1) within a duration
 */
export const getProgress = (
  currentFrame: number,
  startFrame: number,
  durationFrames: number
): number => {
  const elapsed = currentFrame - startFrame;
  if (elapsed < 0) return 0;
  if (elapsed >= durationFrames) return 1;
  return elapsed / durationFrames;
};
