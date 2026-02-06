/**
 * Tests for poses.ts
 * Verifies all 40 poses (11 base + 29 L1 V3 additions) are correctly defined
 */

import { describe, it, expect } from 'vitest';
import { POSES, DEFAULT_POSE, getPose, POSE_NAMES } from '../components/StickMan/poses';
import { Pose } from '../types/schema';

// All required pose joint keys
const POSE_JOINTS: (keyof Pose)[] = [
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

// Base MVP poses (8) + refactoring poses (3) = 11
const BASE_POSES = [
  'standing',
  'pointing_right',
  'pointing_left',
  'thinking',
  'celebrating',
  'explaining',
  'shrugging',
  'sitting',
  'waving',
  'thumbsUp',
  'beckoning',
];

// L1 V3 additional poses (28)
const V3_POSES = [
  // Basic poses (3)
  'leaning',
  'crouching',
  'lying',
  // Gesture poses (6)
  'pointing_up',
  'stop',
  'facepalm',
  'arms_crossed',
  'hand_on_hip',
  'raising_hand',
  // Emotion poses (6)
  'depressed',
  'surprised_pose',
  'confident',
  'scared',
  'exhausted',
  'praying',
  // Activity poses (13)
  'writing',
  'reading',
  'lifting',
  'pushing',
  'pulling',
  'presenting',
  'running',
  'jumping',
  'dancing',
  'kicking',
  'bowing',
  'stretching',
  'sleeping',
];

const ALL_POSES = [...BASE_POSES, ...V3_POSES];

describe('POSES', () => {
  it('should have exactly 39 poses', () => {
    expect(Object.keys(POSES).length).toBe(39);
  });

  it('should have all base poses', () => {
    BASE_POSES.forEach((poseName) => {
      expect(POSES[poseName]).toBeDefined();
    });
  });

  it('should have all L1 V3 additional poses', () => {
    V3_POSES.forEach((poseName) => {
      expect(POSES[poseName]).toBeDefined();
    });
  });

  describe('pose structure validation', () => {
    ALL_POSES.forEach((poseName) => {
      describe(`pose: ${poseName}`, () => {
        it('should have all required joint properties', () => {
          const pose = POSES[poseName];
          POSE_JOINTS.forEach((joint) => {
            expect(pose[joint]).toBeDefined();
            expect(typeof pose[joint]).toBe('number');
          });
        });

        it('should have numeric values within reasonable range (-180 to 180)', () => {
          const pose = POSES[poseName];
          POSE_JOINTS.forEach((joint) => {
            expect(pose[joint]).toBeGreaterThanOrEqual(-180);
            expect(pose[joint]).toBeLessThanOrEqual(180);
          });
        });
      });
    });
  });
});

describe('DEFAULT_POSE', () => {
  it('should be the standing pose', () => {
    expect(DEFAULT_POSE).toBe(POSES.standing);
  });

  it('should have all required joint properties', () => {
    POSE_JOINTS.forEach((joint) => {
      expect(DEFAULT_POSE[joint]).toBeDefined();
      expect(typeof DEFAULT_POSE[joint]).toBe('number');
    });
  });
});

describe('getPose', () => {
  it('should return the correct pose for valid names', () => {
    ALL_POSES.forEach((poseName) => {
      expect(getPose(poseName)).toBe(POSES[poseName]);
    });
  });

  it('should return DEFAULT_POSE for invalid pose names', () => {
    expect(getPose('nonexistent_pose')).toBe(DEFAULT_POSE);
    expect(getPose('')).toBe(DEFAULT_POSE);
    expect(getPose('invalid')).toBe(DEFAULT_POSE);
  });
});

describe('POSE_NAMES', () => {
  it('should contain all 39 pose names', () => {
    expect(POSE_NAMES.length).toBe(39);
  });

  it('should contain all defined poses', () => {
    ALL_POSES.forEach((poseName) => {
      expect(POSE_NAMES).toContain(poseName);
    });
  });

  it('should match the keys of POSES object', () => {
    expect(POSE_NAMES.sort()).toEqual(Object.keys(POSES).sort());
  });
});
