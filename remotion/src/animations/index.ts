/**
 * Animation presets index
 */

export * from './enter';
export * from './during';
export * from './exit';

// Animation type definitions
export type EnterAnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'slideLeft'
  | 'slideRight'
  | 'popIn'
  | 'typewriter'
  | 'drawLine'
  | 'none';

export type DuringAnimationType =
  | 'floating'
  | 'pulse'
  | 'breathing'
  | 'nodding'
  | 'waving'
  | 'poseSequence'
  | 'none';

export type ExitAnimationType = 'fadeOut' | 'none';
