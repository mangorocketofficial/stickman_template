import { describe, it, expect } from 'vitest';
import { POSES, getPose, POSE_NAMES } from '../poses';
import { Pose } from '../../../types/schema';

// Required pose keys from Pose interface
const POSE_KEYS: (keyof Pose)[] = [
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

// Helper function to validate pose structure
function isValidPose(pose: Pose): boolean {
  return POSE_KEYS.every(
    (key) => typeof pose[key] === 'number' && !isNaN(pose[key])
  );
}

describe('L1 MVP Poses', () => {
  describe('pointing_up pose', () => {
    it('should exist in POSES', () => {
      expect(POSES).toHaveProperty('pointing_up');
    });

    it('should have all required joint angles', () => {
      const pose = POSES.pointing_up;
      expect(isValidPose(pose)).toBe(true);
    });

    it('should be retrievable via getPose', () => {
      const pose = getPose('pointing_up');
      expect(pose).toEqual(POSES.pointing_up);
    });

    it('should be included in POSE_NAMES', () => {
      expect(POSE_NAMES).toContain('pointing_up');
    });
  });

  describe('depressed pose', () => {
    it('should exist in POSES', () => {
      expect(POSES).toHaveProperty('depressed');
    });

    it('should have all required joint angles', () => {
      const pose = POSES.depressed;
      expect(isValidPose(pose)).toBe(true);
    });

    it('should be retrievable via getPose', () => {
      const pose = getPose('depressed');
      expect(pose).toEqual(POSES.depressed);
    });

    it('should be included in POSE_NAMES', () => {
      expect(POSE_NAMES).toContain('depressed');
    });

    it('should have hunched forward torso', () => {
      // depressed pose should have positive torso angle (hunched forward)
      expect(POSES.depressed.torso).toBeGreaterThan(0);
    });
  });

  describe('surprised_pose pose', () => {
    it('should exist in POSES', () => {
      expect(POSES).toHaveProperty('surprised_pose');
    });

    it('should have all required joint angles', () => {
      const pose = POSES.surprised_pose;
      expect(isValidPose(pose)).toBe(true);
    });

    it('should be retrievable via getPose', () => {
      const pose = getPose('surprised_pose');
      expect(pose).toEqual(POSES.surprised_pose);
    });

    it('should be included in POSE_NAMES', () => {
      expect(POSE_NAMES).toContain('surprised_pose');
    });
  });

  describe('arms_crossed pose', () => {
    it('should exist in POSES', () => {
      expect(POSES).toHaveProperty('arms_crossed');
    });

    it('should have all required joint angles', () => {
      const pose = POSES.arms_crossed;
      expect(isValidPose(pose)).toBe(true);
    });

    it('should be retrievable via getPose', () => {
      const pose = getPose('arms_crossed');
      expect(pose).toEqual(POSES.arms_crossed);
    });

    it('should be included in POSE_NAMES', () => {
      expect(POSE_NAMES).toContain('arms_crossed');
    });
  });
});

describe('All poses have valid structure', () => {
  it('should have at least 15 poses (8 original + 3 transition + 4 L1)', () => {
    expect(POSE_NAMES.length).toBeGreaterThanOrEqual(15);
  });

  POSE_NAMES.forEach((poseName) => {
    it(`${poseName} should have valid pose structure`, () => {
      const pose = POSES[poseName];
      expect(isValidPose(pose)).toBe(true);
    });
  });
});
