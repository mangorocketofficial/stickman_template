import { describe, it, expect } from 'vitest';
import { POSES, POSE_NAMES, getPose, DEFAULT_POSE } from '../components/StickMan/poses';

// Required pose joint keys
const REQUIRED_JOINTS = [
  'torso',
  'head',
  'upperArmL',
  'lowerArmL',
  'upperArmR',
  'lowerArmR',
  'upperLegL',
  'lowerLegL',
  'upperLegR',
  'lowerLegR',
];

// Original 8 MVP poses
const MVP_ORIGINAL_POSES = [
  'standing',
  'pointing_right',
  'pointing_left',
  'thinking',
  'celebrating',
  'explaining',
  'shrugging',
  'sitting',
];

// Pose transition target poses (refactoring)
const POSE_TRANSITION_POSES = ['waving', 'thumbsUp', 'beckoning'];

// MVP added poses (4)
const MVP_ADDED_POSES = ['pointing_up', 'depressed', 'surprised_pose', 'arms_crossed'];

// V2 poses (10)
const V2_POSES = [
  'leaning',
  'crouching',
  'stop',
  'facepalm',
  'hand_on_hip',
  'raising_hand',
  'confident',
  'scared',
  'writing',
  'presenting',
];

describe('poses.ts - Pose Definitions', () => {
  describe('Pose Structure Validation', () => {
    it('should have all required joints for each pose', () => {
      for (const poseName of POSE_NAMES) {
        const pose = POSES[poseName];
        for (const joint of REQUIRED_JOINTS) {
          expect(pose).toHaveProperty(joint);
          expect(typeof pose[joint as keyof typeof pose]).toBe('number');
        }
      }
    });

    it('should have joint angles within reasonable range (-180 to 180)', () => {
      for (const poseName of POSE_NAMES) {
        const pose = POSES[poseName];
        for (const joint of REQUIRED_JOINTS) {
          const angle = pose[joint as keyof typeof pose] as number;
          expect(angle).toBeGreaterThanOrEqual(-180);
          expect(angle).toBeLessThanOrEqual(180);
        }
      }
    });
  });

  describe('Original 8 MVP Poses', () => {
    it.each(MVP_ORIGINAL_POSES)('should have pose: %s', (poseName) => {
      expect(POSES).toHaveProperty(poseName);
      expect(POSE_NAMES).toContain(poseName);
    });
  });

  describe('Pose Transition Target Poses', () => {
    it.each(POSE_TRANSITION_POSES)('should have pose: %s', (poseName) => {
      expect(POSES).toHaveProperty(poseName);
      expect(POSE_NAMES).toContain(poseName);
    });
  });

  describe('MVP Added Poses (4)', () => {
    it.each(MVP_ADDED_POSES)('should have pose: %s', (poseName) => {
      expect(POSES).toHaveProperty(poseName);
      expect(POSE_NAMES).toContain(poseName);
    });

    it('should have exactly 4 MVP added poses', () => {
      const foundPoses = MVP_ADDED_POSES.filter((p) => POSES[p]);
      expect(foundPoses.length).toBe(4);
    });
  });

  describe('V2 Poses (10)', () => {
    it.each(V2_POSES)('should have pose: %s', (poseName) => {
      expect(POSES).toHaveProperty(poseName);
      expect(POSE_NAMES).toContain(poseName);
    });

    it('should have exactly 10 V2 poses', () => {
      const foundPoses = V2_POSES.filter((p) => POSES[p]);
      expect(foundPoses.length).toBe(10);
    });
  });

  describe('Total Pose Count', () => {
    const TOTAL_EXPECTED =
      MVP_ORIGINAL_POSES.length +
      POSE_TRANSITION_POSES.length +
      MVP_ADDED_POSES.length +
      V2_POSES.length;

    it(`should have ${TOTAL_EXPECTED} total poses (8 original + 3 transition + 4 MVP + 10 V2)`, () => {
      expect(POSE_NAMES.length).toBe(TOTAL_EXPECTED);
    });
  });

  describe('Utility Functions', () => {
    it('getPose should return correct pose', () => {
      const standingPose = getPose('standing');
      expect(standingPose).toBe(POSES.standing);
    });

    it('getPose should return default pose for unknown name', () => {
      const unknownPose = getPose('nonexistent_pose');
      expect(unknownPose).toBe(DEFAULT_POSE);
    });

    it('DEFAULT_POSE should be standing', () => {
      expect(DEFAULT_POSE).toBe(POSES.standing);
    });
  });
});
