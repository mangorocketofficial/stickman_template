/**
 * Tests for motions.ts
 * Verifies all 43 motions (30 loop + 13 pose transitions) are correctly defined
 */

import { describe, it, expect } from 'vitest';
import { MOTIONS, getMotion, MOTION_NAMES, Motion, MotionKeyframe } from '../components/StickMan/motions';
import { JOINT_NAMES, JointName } from '../components/StickMan/skeleton';

// Loop motions (30)
const LOOP_MOTIONS = [
  // MVP base motions (3)
  'breathing',
  'nodding',
  'walkCycle',
  // Emotion motions (3)
  'laughing',
  'crying',
  'nervous',
  // Action motions (4)
  'jumping',
  'running',
  'clapping',
  'typing',
  // Gesture motions (1)
  'headShake',
  // MVP loop motions (3)
  'blinking',
  'waving_loop',
  'thinking_loop',
  // V2 loop motions - low energy (2)
  'swaying',
  'tapping',
  // V2 loop motions - medium energy (2)
  'looking_around',
  'scratching_head',
  // V2 loop motions - high energy (2)
  'dancing',
  'bouncing',
  // V3 loop motions - medium energy (3)
  'talking',
  'humming',
  'stretching_loop',
  // V3 loop motions - high energy (8)
  'exercising',
  'punching',
  'kicking_loop',
  'spinning',
  'waving_both_arms',
  'celebrating_loop',
  'panicking',
];

// Pose transition motions (13)
const POSE_TRANSITION_MOTIONS = [
  // MVP pose transitions (3)
  'sit_down',
  'depressing',
  'surprising',
  // V2 pose transitions (6)
  'raising',
  'crossing_arms',
  'stop_gesture',
  'presenting',
  'reading_start',
  'crouching_down',
  // V3 pose transitions (4)
  'saluting',
  'bowing',
  'lying_down',
  'praying',
];

const ALL_MOTIONS = [...LOOP_MOTIONS, ...POSE_TRANSITION_MOTIONS];

describe('MOTIONS', () => {
  it('should have exactly 43 motions', () => {
    expect(Object.keys(MOTIONS).length).toBe(43);
  });

  it('should have all 30 loop motions', () => {
    expect(LOOP_MOTIONS.length).toBe(30);
    LOOP_MOTIONS.forEach((motionName) => {
      expect(MOTIONS[motionName], `Missing loop motion: ${motionName}`).toBeDefined();
    });
  });

  it('should have all 13 pose transition motions', () => {
    expect(POSE_TRANSITION_MOTIONS.length).toBe(13);
    POSE_TRANSITION_MOTIONS.forEach((motionName) => {
      expect(MOTIONS[motionName], `Missing pose transition: ${motionName}`).toBeDefined();
    });
  });
});

describe('Loop motion structure validation', () => {
  LOOP_MOTIONS.forEach((motionName) => {
    describe(`loop motion: ${motionName}`, () => {
      const motion = MOTIONS[motionName];

      it('should have cycleDurationMs > 0', () => {
        expect(motion.cycleDurationMs).toBeGreaterThan(0);
      });

      it('should have affectedJoints array', () => {
        expect(Array.isArray(motion.affectedJoints)).toBe(true);
        expect(motion.affectedJoints.length).toBeGreaterThan(0);
      });

      it('should have valid joint names in affectedJoints', () => {
        motion.affectedJoints.forEach((joint) => {
          expect(JOINT_NAMES).toContain(joint);
        });
      });

      it('should have keyframes array with at least 2 keyframes', () => {
        expect(Array.isArray(motion.keyframes)).toBe(true);
        expect(motion.keyframes.length).toBeGreaterThanOrEqual(2);
      });

      it('should have first keyframe with progress === 0', () => {
        expect(motion.keyframes[0].progress).toBe(0);
      });

      it('should have last keyframe with progress === 1', () => {
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        expect(lastKeyframe.progress).toBe(1);
      });

      it('should have keyframes in ascending order by progress', () => {
        for (let i = 1; i < motion.keyframes.length; i++) {
          expect(motion.keyframes[i].progress).toBeGreaterThanOrEqual(
            motion.keyframes[i - 1].progress
          );
        }
      });

      it('should have keyframe progress values between 0 and 1', () => {
        motion.keyframes.forEach((kf) => {
          expect(kf.progress).toBeGreaterThanOrEqual(0);
          expect(kf.progress).toBeLessThanOrEqual(1);
        });
      });

      it('should have valid overrides in keyframes', () => {
        motion.keyframes.forEach((kf) => {
          expect(kf.overrides).toBeDefined();
          Object.keys(kf.overrides).forEach((key) => {
            expect(JOINT_NAMES).toContain(key);
            expect(typeof (kf.overrides as Record<string, number>)[key]).toBe('number');
          });
        });
      });

      it('should have name property matching motion key', () => {
        expect(motion.name).toBe(motionName);
      });
    });
  });
});

describe('Pose transition motion structure validation', () => {
  POSE_TRANSITION_MOTIONS.forEach((motionName) => {
    describe(`pose transition: ${motionName}`, () => {
      const motion = MOTIONS[motionName];

      it('should have cycleDurationMs > 0 (transitionDurationMs)', () => {
        expect(motion.cycleDurationMs).toBeGreaterThan(0);
      });

      it('should have affectedJoints array', () => {
        expect(Array.isArray(motion.affectedJoints)).toBe(true);
        expect(motion.affectedJoints.length).toBeGreaterThan(0);
      });

      it('should have valid joint names in affectedJoints', () => {
        motion.affectedJoints.forEach((joint) => {
          expect(JOINT_NAMES).toContain(joint);
        });
      });

      it('should have keyframes array with at least 2 keyframes', () => {
        expect(Array.isArray(motion.keyframes)).toBe(true);
        expect(motion.keyframes.length).toBeGreaterThanOrEqual(2);
      });

      it('should have first keyframe with progress === 0', () => {
        expect(motion.keyframes[0].progress).toBe(0);
      });

      it('should have last keyframe with progress === 1', () => {
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        expect(lastKeyframe.progress).toBe(1);
      });

      it('should have keyframes in ascending order by progress', () => {
        for (let i = 1; i < motion.keyframes.length; i++) {
          expect(motion.keyframes[i].progress).toBeGreaterThanOrEqual(
            motion.keyframes[i - 1].progress
          );
        }
      });

      it('should have name property matching motion key', () => {
        expect(motion.name).toBe(motionName);
      });
    });
  });
});

describe('getMotion', () => {
  it('should return the correct motion for valid names', () => {
    ALL_MOTIONS.forEach((motionName) => {
      expect(getMotion(motionName)).toBe(MOTIONS[motionName]);
    });
  });

  it('should return undefined for invalid motion names', () => {
    expect(getMotion('nonexistent_motion')).toBeUndefined();
    expect(getMotion('')).toBeUndefined();
    expect(getMotion('invalid')).toBeUndefined();
  });
});

describe('MOTION_NAMES', () => {
  it('should contain all 43 motion names', () => {
    expect(MOTION_NAMES.length).toBe(43);
  });

  it('should contain all defined motions', () => {
    ALL_MOTIONS.forEach((motionName) => {
      expect(MOTION_NAMES).toContain(motionName);
    });
  });

  it('should match the keys of MOTIONS object', () => {
    expect(MOTION_NAMES.sort()).toEqual(Object.keys(MOTIONS).sort());
  });
});
