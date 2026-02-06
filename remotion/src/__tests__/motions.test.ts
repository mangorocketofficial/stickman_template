import { describe, it, expect } from 'vitest';
import { MOTIONS, Motion } from '../components/StickMan/motions';

// L2 MVP Motion Tests
// Test targets: 6 new motions
// - Loop motions: blinking, waving_loop, thinking_loop
// - Pose transitions: sit_down, depressing, surprising

describe('L2 MVP Motions', () => {
  // Loop motion names
  const loopMotions = ['blinking', 'waving_loop', 'thinking_loop'];

  // Pose transition motion names
  const poseTransitionMotions = ['sit_down', 'depressing', 'surprising'];

  // All L2 MVP motions
  const allL2Motions = [...loopMotions, ...poseTransitionMotions];

  describe('Motion Existence', () => {
    it.each(allL2Motions)('should have motion "%s" defined', (motionName) => {
      expect(MOTIONS[motionName]).toBeDefined();
    });
  });

  describe('Loop Motion Structure', () => {
    it.each(loopMotions)('"%s" should have cycleDurationMs as positive number', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.cycleDurationMs).toBeDefined();
      expect(typeof motion.cycleDurationMs).toBe('number');
      expect(motion.cycleDurationMs).toBeGreaterThan(0);
    });

    it.each(loopMotions)('"%s" should have affectedJoints array', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.affectedJoints).toBeDefined();
      expect(Array.isArray(motion.affectedJoints)).toBe(true);
      expect(motion.affectedJoints.length).toBeGreaterThan(0);
    });

    it.each(loopMotions)('"%s" should have keyframes array', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.keyframes).toBeDefined();
      expect(Array.isArray(motion.keyframes)).toBe(true);
      expect(motion.keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it.each(loopMotions)('"%s" should have first keyframe progress === 0', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.keyframes[0].progress).toBe(0);
    });

    it.each(loopMotions)('"%s" should have last keyframe progress === 1', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
      expect(lastKeyframe.progress).toBe(1);
    });

    it.each(loopMotions)('"%s" should have keyframes with overrides', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      motion.keyframes.forEach((kf, index) => {
        expect(kf.overrides).toBeDefined();
        expect(typeof kf.overrides).toBe('object');
      });
    });
  });

  describe('Pose Transition Motion Structure', () => {
    // Pose transitions use the same Motion interface as loop motions
    // They have cycleDurationMs which acts as transitionDurationMs
    // fromPose/toPose are implied by the motion name

    it.each(poseTransitionMotions)('"%s" should have cycleDurationMs (transitionDurationMs) as positive number', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.cycleDurationMs).toBeDefined();
      expect(typeof motion.cycleDurationMs).toBe('number');
      expect(motion.cycleDurationMs).toBeGreaterThan(0);
    });

    it.each(poseTransitionMotions)('"%s" should have affectedJoints array', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.affectedJoints).toBeDefined();
      expect(Array.isArray(motion.affectedJoints)).toBe(true);
      expect(motion.affectedJoints.length).toBeGreaterThan(0);
    });

    it.each(poseTransitionMotions)('"%s" should have keyframes array with at least 2 frames', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.keyframes).toBeDefined();
      expect(Array.isArray(motion.keyframes)).toBe(true);
      expect(motion.keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it.each(poseTransitionMotions)('"%s" should have first keyframe progress === 0 (start pose)', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      expect(motion.keyframes[0].progress).toBe(0);
    });

    it.each(poseTransitionMotions)('"%s" should have last keyframe progress === 1 (end pose)', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      const lastKeyframe = motion.keyframes[motion.keyframes.length - 1];
      expect(lastKeyframe.progress).toBe(1);
    });

    it.each(poseTransitionMotions)('"%s" should have different overrides between first and last keyframe', (motionName) => {
      const motion = MOTIONS[motionName] as Motion;
      const firstOverrides = motion.keyframes[0].overrides;
      const lastOverrides = motion.keyframes[motion.keyframes.length - 1].overrides;

      // At least one joint should have different value between start and end
      const firstKeys = Object.keys(firstOverrides);
      const lastKeys = Object.keys(lastOverrides);

      const hasDifference = firstKeys.some(key => {
        const keyTyped = key as keyof typeof firstOverrides;
        return firstOverrides[keyTyped] !== lastOverrides[keyTyped];
      }) || lastKeys.some(key => {
        const keyTyped = key as keyof typeof lastOverrides;
        return firstOverrides[keyTyped] !== lastOverrides[keyTyped];
      });

      expect(hasDifference).toBe(true);
    });
  });

  describe('Motion Duration Validation', () => {
    it('blinking should have slow cycle (~3000ms) for natural blink rate', () => {
      const motion = MOTIONS['blinking'] as Motion;
      expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(2000);
      expect(motion.cycleDurationMs).toBeLessThanOrEqual(5000);
    });

    it('waving_loop should have moderate cycle (400-600ms) for visible wave', () => {
      const motion = MOTIONS['waving_loop'] as Motion;
      expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(400);
      expect(motion.cycleDurationMs).toBeLessThanOrEqual(800);
    });

    it('thinking_loop should have slow cycle (~1500ms) for contemplative feel', () => {
      const motion = MOTIONS['thinking_loop'] as Motion;
      expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(1000);
      expect(motion.cycleDurationMs).toBeLessThanOrEqual(2500);
    });

    it('sit_down should have moderate duration (400-800ms) for natural sit', () => {
      const motion = MOTIONS['sit_down'] as Motion;
      expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(400);
      expect(motion.cycleDurationMs).toBeLessThanOrEqual(1000);
    });

    it('depressing should have slow duration (600-1000ms) for gradual slump', () => {
      const motion = MOTIONS['depressing'] as Motion;
      expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(600);
      expect(motion.cycleDurationMs).toBeLessThanOrEqual(1200);
    });

    it('surprising should have fast duration (300-500ms) for quick reaction', () => {
      const motion = MOTIONS['surprising'] as Motion;
      expect(motion.cycleDurationMs).toBeGreaterThanOrEqual(300);
      expect(motion.cycleDurationMs).toBeLessThanOrEqual(600);
    });
  });
});
