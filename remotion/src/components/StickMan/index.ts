// StickMan component barrel export

export { StickMan } from './StickMan';
export type { StickManProps } from './StickMan';

// Re-export all submodules
export * from './skeleton';
export * from './poses';
export * from './expressions';
export * from './motions';
export * from './interpolation';

// Export Face component for potential standalone use
export { Face } from './Face';
export { Body, Legs, getHeadPosition, getHeadRotation } from './Joint';
