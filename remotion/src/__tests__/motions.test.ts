import { describe, it, expect } from 'vitest';
import { MOTIONS, MOTION_NAMES, getMotion, Motion } from '../components/StickMan/motions';
import { JOINT_NAMES, JointName } from '../components/StickMan/skeleton';

// ============================================
// L2 V2 Motion Templates TDD Test
// ============================================

// Loop Motions (9 total)
const LOOP_MOTIONS = [
  'blinking',
  'waving_loop',
  'thinking_loop',
  'swaying',
  'tapping',
  'looking_around',
  'scratching_head',
  'dancing',
  'bouncing',
];

// Pose Transitions (7 total)
const POSE_TRANSITIONS = [
  'sit_down',
  'depressing',
  'surprising',
  'raising',
  'crossing_arms',
  'stop_gesture',
  'presenting',
];

// All 16 new motions
const ALL_NEW_MOTIONS = [...LOOP_MOTIONS, ...POSE_TRANSITIONS];

describe('motions.ts - L2 V2 Motion Templates', () => {
  // ============================================
  // 1. Motion Existence Tests
  // ============================================
  describe('Motion Existence', () => {
    describe('Loop Motions (9)', () => {
      it.each(LOOP_MOTIONS)('should have loop motion: %s', (motionName) => {
        expect(MOTIONS).toHaveProperty(motionName);
        expect(MOTION_NAMES).toContain(motionName);
      });

      it('should have exactly 9 loop motions defined', () => {
        const foundMotions = LOOP_MOTIONS.filter((m) => MOTIONS[m]);
        expect(foundMotions.length).toBe(9);
      });
    });

    describe('Pose Transitions (7)', () => {
      it.each(POSE_TRANSITIONS)('should have pose transition: %s', (motionName) => {
        expect(MOTIONS).toHaveProperty(motionName);
        expect(MOTION_NAMES).toContain(motionName);
      });

      it('should have exactly 7 pose transitions defined', () => {
        const foundMotions = POSE_TRANSITIONS.filter((m) => MOTIONS[m]);
        expect(foundMotions.length).toBe(7);
      });
    });

    describe('Total New Motions (16)', () => {
      it('should have all 16 new motions', () => {
        const foundMotions = ALL_NEW_MOTIONS.filter((m) => MOTIONS[m]);
        expect(foundMotions.length).toBe(16);
      });
    });
  });

  // ============================================
  // 2. Loop Motion Structure Validation
  // ============================================
  describe('Loop Motion Structure Validation', () => {
    it.each(LOOP_MOTIONS)('%s should have valid cycleDurationMs', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion).toBeDefined();
      expect(motion.cycleDurationMs).toBeDefined();
      expect(typeof motion.cycleDurationMs).toBe('number');
      expect(motion.cycleDurationMs).toBeGreaterThan(0);
    });

    it.each(LOOP_MOTIONS)('%s should have valid affectedJoints array', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion.affectedJoints).toBeDefined();
      expect(Array.isArray(motion.affectedJoints)).toBe(true);
      expect(motion.affectedJoints.length).toBeGreaterThan(0);

      // All affected joints should be valid JointNames
      for (const joint of motion.affectedJoints) {
        expect(JOINT_NAMES).toContain(joint);
      }
    });

    it.each(LOOP_MOTIONS)('%s should have valid keyframes array', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion.keyframes).toBeDefined();
      expect(Array.isArray(motion.keyframes)).toBe(true);
      expect(motion.keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it.each(LOOP_MOTIONS)('%s should have name property matching key', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion.name).toBe(motionName);
    });
  });

  // ============================================
  // 3. Keyframe Progress Validation
  // ============================================
  describe('Keyframe Progress Validation', () => {
    describe('Loop Motions', () => {
      it.each(LOOP_MOTIONS)('%s keyframes should start at progress 0', (motionName) => {
        const motion = MOTIONS[motionName];
        expect(motion.keyframes[0].progress).toBe(0);
      });

      it.each(LOOP_MOTIONS)('%s keyframes should end at progress 1', (motionName) => {
        const motion = MOTIONS[motionName];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        expect(lastKeyframe.progress).toBe(1);
      });

      it.each(LOOP_MOTIONS)('%s keyframes should have progress values between 0 and 1', (motionName) => {
        const motion = MOTIONS[motionName];
        for (const kf of motion.keyframes) {
          expect(kf.progress).toBeGreaterThanOrEqual(0);
          expect(kf.progress).toBeLessThanOrEqual(1);
        }
      });

      it.each(LOOP_MOTIONS)('%s keyframes should be in ascending order', (motionName) => {
        const motion = MOTIONS[motionName];
        for (let i = 1; i < motion.keyframes.length; i++) {
          expect(motion.keyframes[i].progress).toBeGreaterThanOrEqual(motion.keyframes[i - 1].progress);
        }
      });
    });

    describe('Pose Transitions', () => {
      it.each(POSE_TRANSITIONS)('%s keyframes should start at progress 0', (motionName) => {
        const motion = MOTIONS[motionName];
        expect(motion.keyframes[0].progress).toBe(0);
      });

      it.each(POSE_TRANSITIONS)('%s keyframes should end at progress 1', (motionName) => {
        const motion = MOTIONS[motionName];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        expect(lastKeyframe.progress).toBe(1);
      });

      it.each(POSE_TRANSITIONS)('%s keyframes should have progress values between 0 and 1', (motionName) => {
        const motion = MOTIONS[motionName];
        for (const kf of motion.keyframes) {
          expect(kf.progress).toBeGreaterThanOrEqual(0);
          expect(kf.progress).toBeLessThanOrEqual(1);
        }
      });

      it.each(POSE_TRANSITIONS)('%s keyframes should be in ascending order', (motionName) => {
        const motion = MOTIONS[motionName];
        for (let i = 1; i < motion.keyframes.length; i++) {
          expect(motion.keyframes[i].progress).toBeGreaterThanOrEqual(motion.keyframes[i - 1].progress);
        }
      });
    });
  });

  // ============================================
  // 4. Pose Transition Structure Validation
  // ============================================
  describe('Pose Transition Structure Validation', () => {
    it.each(POSE_TRANSITIONS)('%s should have valid cycleDurationMs', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion).toBeDefined();
      expect(motion.cycleDurationMs).toBeDefined();
      expect(typeof motion.cycleDurationMs).toBe('number');
      expect(motion.cycleDurationMs).toBeGreaterThan(0);
    });

    it.each(POSE_TRANSITIONS)('%s should have valid affectedJoints array', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion.affectedJoints).toBeDefined();
      expect(Array.isArray(motion.affectedJoints)).toBe(true);
      expect(motion.affectedJoints.length).toBeGreaterThan(0);

      // All affected joints should be valid JointNames
      for (const joint of motion.affectedJoints) {
        expect(JOINT_NAMES).toContain(joint);
      }
    });

    it.each(POSE_TRANSITIONS)('%s should have at least 3 keyframes (start, mid, end)', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion.keyframes).toBeDefined();
      expect(Array.isArray(motion.keyframes)).toBe(true);
      expect(motion.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it.each(POSE_TRANSITIONS)('%s should have name property matching key', (motionName) => {
      const motion = MOTIONS[motionName];
      expect(motion.name).toBe(motionName);
    });

    it.each(POSE_TRANSITIONS)('%s should affect multiple joints for full body transition', (motionName) => {
      const motion = MOTIONS[motionName];
      // Pose transitions typically affect at least 4 joints (arms + torso/head or legs)
      expect(motion.affectedJoints.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ============================================
  // 5. Keyframe Override Validation
  // ============================================
  describe('Keyframe Override Validation', () => {
    it.each(ALL_NEW_MOTIONS)('%s keyframes should have overrides object', (motionName) => {
      const motion = MOTIONS[motionName];
      for (const kf of motion.keyframes) {
        expect(kf.overrides).toBeDefined();
        expect(typeof kf.overrides).toBe('object');
      }
    });

    it.each(ALL_NEW_MOTIONS)('%s override values should be numbers', (motionName) => {
      const motion = MOTIONS[motionName];
      for (const kf of motion.keyframes) {
        for (const [key, value] of Object.entries(kf.overrides)) {
          expect(typeof value).toBe('number');
        }
      }
    });

    it.each(ALL_NEW_MOTIONS)('%s override keys should be valid joint names', (motionName) => {
      const motion = MOTIONS[motionName];
      for (const kf of motion.keyframes) {
        for (const key of Object.keys(kf.overrides)) {
          expect(JOINT_NAMES).toContain(key);
        }
      }
    });

    it.each(ALL_NEW_MOTIONS)('%s override angles should be within reasonable range (-180 to 180)', (motionName) => {
      const motion = MOTIONS[motionName];
      for (const kf of motion.keyframes) {
        for (const [key, value] of Object.entries(kf.overrides)) {
          expect(value as number).toBeGreaterThanOrEqual(-180);
          expect(value as number).toBeLessThanOrEqual(180);
        }
      }
    });
  });

  // ============================================
  // 6. Utility Functions
  // ============================================
  describe('Utility Functions', () => {
    it('getMotion should return correct motion for valid name', () => {
      for (const motionName of ALL_NEW_MOTIONS) {
        const motion = getMotion(motionName);
        expect(motion).toBe(MOTIONS[motionName]);
      }
    });

    it('getMotion should return undefined for unknown name', () => {
      const motion = getMotion('nonexistent_motion');
      expect(motion).toBeUndefined();
    });

    it('MOTION_NAMES should contain all new motions', () => {
      for (const motionName of ALL_NEW_MOTIONS) {
        expect(MOTION_NAMES).toContain(motionName);
      }
    });
  });

  // ============================================
  // 7. Specific Motion Behavior Tests
  // ============================================
  describe('Specific Motion Behavior', () => {
    describe('Loop Motion Characteristics', () => {
      it('blinking should be a quick subtle motion', () => {
        const motion = MOTIONS['blinking'];
        expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(2000); // Long cycle for natural blink timing
        expect(motion.affectedJoints).toContain('head');
      });

      it('waving_loop should affect arm joints', () => {
        const motion = MOTIONS['waving_loop'];
        expect(motion.affectedJoints.some(j => j.includes('Arm'))).toBe(true);
      });

      it('thinking_loop should affect head', () => {
        const motion = MOTIONS['thinking_loop'];
        expect(motion.affectedJoints).toContain('head');
      });

      it('swaying should be a slow gentle motion', () => {
        const motion = MOTIONS['swaying'];
        expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(2000);
        expect(motion.affectedJoints).toContain('torso');
      });

      it('tapping should affect leg joints', () => {
        const motion = MOTIONS['tapping'];
        expect(motion.affectedJoints.some(j => j.includes('Leg'))).toBe(true);
      });

      it('looking_around should affect head', () => {
        const motion = MOTIONS['looking_around'];
        expect(motion.affectedJoints).toContain('head');
      });

      it('scratching_head should affect arm and head', () => {
        const motion = MOTIONS['scratching_head'];
        expect(motion.affectedJoints).toContain('head');
        expect(motion.affectedJoints.some(j => j.includes('Arm'))).toBe(true);
      });

      it('dancing should affect multiple body parts', () => {
        const motion = MOTIONS['dancing'];
        expect(motion.affectedJoints.length).toBeGreaterThanOrEqual(4);
      });

      it('bouncing should affect legs and torso', () => {
        const motion = MOTIONS['bouncing'];
        expect(motion.affectedJoints).toContain('torso');
        expect(motion.affectedJoints.some(j => j.includes('Leg'))).toBe(true);
      });
    });

    describe('Pose Transition Characteristics', () => {
      it('sit_down should end with bent legs', () => {
        const motion = MOTIONS['sit_down'];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        // Check that legs are bent (significant angle)
        const upperLegL = lastKeyframe.overrides.upperLegL as number | undefined;
        expect(upperLegL).toBeDefined();
        expect(Math.abs(upperLegL!)).toBeGreaterThan(45);
      });

      it('depressing should end with hunched posture', () => {
        const motion = MOTIONS['depressing'];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        // Check for forward lean/head down
        const head = lastKeyframe.overrides.head as number | undefined;
        const torso = lastKeyframe.overrides.torso as number | undefined;
        expect(head).toBeGreaterThan(0); // Head tilted forward
        expect(torso).toBeGreaterThan(0); // Torso leaning forward
      });

      it('surprising should be a quick transition', () => {
        const motion = MOTIONS['surprising'];
        expect(motion.cycleDurationMs).toBeLessThanOrEqual(500);
      });

      it('raising should end with raised arm', () => {
        const motion = MOTIONS['raising'];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        // Check for raised arm (large negative angle for right arm going up)
        const upperArmR = lastKeyframe.overrides.upperArmR as number | undefined;
        expect(upperArmR).toBeDefined();
        expect(upperArmR!).toBeLessThan(-90); // Arm raised above shoulder
      });

      it('crossing_arms should end with crossed arm position', () => {
        const motion = MOTIONS['crossing_arms'];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        // Check for crossed arms (specific angle combination)
        const upperArmL = lastKeyframe.overrides.upperArmL as number | undefined;
        const upperArmR = lastKeyframe.overrides.upperArmR as number | undefined;
        expect(upperArmL).toBeDefined();
        expect(upperArmR).toBeDefined();
        expect(Math.abs(upperArmL!)).toBeGreaterThan(30);
        expect(Math.abs(upperArmR!)).toBeGreaterThan(30);
      });

      it('stop_gesture should end with arm extended', () => {
        const motion = MOTIONS['stop_gesture'];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        // Check for stop gesture arm position
        const upperArmR = lastKeyframe.overrides.upperArmR as number | undefined;
        const lowerArmR = lastKeyframe.overrides.lowerArmR as number | undefined;
        expect(upperArmR).toBeDefined();
        expect(lowerArmR).toBeDefined();
        expect(Math.abs(upperArmR!)).toBeGreaterThanOrEqual(90);
      });

      it('presenting should end with extended gesture', () => {
        const motion = MOTIONS['presenting'];
        const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
        // Check for presenting arm position
        const upperArmL = lastKeyframe.overrides.upperArmL as number | undefined;
        expect(upperArmL).toBeDefined();
        expect(Math.abs(upperArmL!)).toBeGreaterThanOrEqual(60);
      });
    });
  });
});
