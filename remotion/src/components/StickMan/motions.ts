// Motion loop presets for StickMan
// Motions use poseOverride - they modify specific joints on top of the base pose
// All motions are looping animations

import { Pose } from '../../types/schema';
import { JointName } from './skeleton';

export interface MotionKeyframe {
  progress: number;   // 0-1, position in cycle
  overrides: Partial<Pose>;
}

export interface Motion {
  name: string;
  cycleDurationMs: number;
  keyframes: MotionKeyframe[];
  affectedJoints: JointName[];  // which joints this motion modifies
}

// 4 Required motion presets for MVP
export const MOTIONS: Record<string, Motion> = {
  // Subtle torso oscillation for idle breathing effect
  breathing: {
    name: 'breathing',
    cycleDurationMs: 2000,
    affectedJoints: ['torso'],
    keyframes: [
      { progress: 0, overrides: { torso: 0 } },
      { progress: 0.5, overrides: { torso: 3 } },  // visible forward lean
      { progress: 1, overrides: { torso: 0 } },
    ],
  },

  // Head nodding motion
  nodding: {
    name: 'nodding',
    cycleDurationMs: 600,
    affectedJoints: ['head'],
    keyframes: [
      { progress: 0, overrides: { head: 0 } },
      { progress: 0.5, overrides: { head: 15 } },  // nod down
      { progress: 1, overrides: { head: 0 } },
    ],
  },

  // Walking cycle - alternating leg and arm swing
  walkCycle: {
    name: 'walkCycle',
    cycleDurationMs: 800,
    affectedJoints: ['torso', 'head', 'upperArmL', 'upperArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      {
        progress: 0,
        overrides: {
          torso: -5,
          head: -3,
          upperArmL: 30,
          upperArmR: -30,
          upperLegL: -20,
          lowerLegL: 0,
          upperLegR: 20,
          lowerLegR: -30,
        },
      },
      {
        progress: 0.25,
        overrides: {
          torso: -5,
          head: 0,
          upperArmL: 10,
          upperArmR: -10,
          upperLegL: 0,
          lowerLegL: -10,
          upperLegR: 0,
          lowerLegR: -10,
        },
      },
      {
        progress: 0.5,
        overrides: {
          torso: -5,
          head: 3,
          upperArmL: -30,
          upperArmR: 30,
          upperLegL: 20,
          lowerLegL: -30,
          upperLegR: -20,
          lowerLegR: 0,
        },
      },
      {
        progress: 0.75,
        overrides: {
          torso: -5,
          head: 0,
          upperArmL: -10,
          upperArmR: 10,
          upperLegL: 0,
          lowerLegL: -10,
          upperLegR: 0,
          lowerLegR: -10,
        },
      },
      {
        progress: 1,
        overrides: {
          torso: -5,
          head: -3,
          upperArmL: 30,
          upperArmR: -30,
          upperLegL: -20,
          lowerLegL: 0,
          upperLegR: 20,
          lowerLegR: -30,
        },
      },
    ],
  },

  // ============================================
  // EMOTION MOTIONS (Studio A)
  // ============================================

  // Laughing motion - torso shake with arm movement
  laughing: {
    name: 'laughing',
    cycleDurationMs: 400,
    affectedJoints: ['torso', 'head', 'upperArmL', 'upperArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 25, upperArmR: -25 } },
      { progress: 0.5, overrides: { torso: -3, head: -5, upperArmL: 30, upperArmR: -30 } },
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 25, upperArmR: -25 } },
    ],
  },

  // Crying motion - hunched posture with hands to face
  crying: {
    name: 'crying',
    cycleDurationMs: 1500,
    affectedJoints: ['head', 'torso', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { head: 20, torso: 5, upperArmL: 60, lowerArmL: -120, upperArmR: -60, lowerArmR: -120 } },
      { progress: 0.3, overrides: { head: 25, torso: 8, upperArmL: 65, lowerArmL: -125, upperArmR: -65, lowerArmR: -125 } },
      { progress: 0.7, overrides: { head: 20, torso: 5, upperArmL: 60, lowerArmL: -120, upperArmR: -60, lowerArmR: -120 } },
      { progress: 1, overrides: { head: 20, torso: 5, upperArmL: 60, lowerArmL: -120, upperArmR: -60, lowerArmR: -120 } },
    ],
  },

  // Nervous motion - fidgeting with shifting weight
  nervous: {
    name: 'nervous',
    cycleDurationMs: 800,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 2, head: -5, upperArmL: 40, lowerArmL: -90, upperArmR: -40, lowerArmR: -90 } },
      { progress: 0.5, overrides: { torso: -2, head: 5, upperArmL: 45, lowerArmL: -85, upperArmR: -45, lowerArmR: -85 } },
      { progress: 1, overrides: { torso: 2, head: -5, upperArmL: 40, lowerArmL: -90, upperArmR: -40, lowerArmR: -90 } },
    ],
  },

  // ============================================
  // ACTION MOTIONS (Studio B)
  // ============================================

  // Jumping motion - crouch and leap
  jumping: {
    name: 'jumping',
    cycleDurationMs: 600,
    affectedJoints: ['torso', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR', 'upperArmL', 'upperArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 5, upperLegL: 20, lowerLegL: -40, upperLegR: -20, lowerLegR: -40, upperArmL: 20, upperArmR: -20 } },
      { progress: 0.3, overrides: { torso: -10, upperLegL: -10, lowerLegL: 0, upperLegR: 10, lowerLegR: 0, upperArmL: 150, upperArmR: -150 } },
      { progress: 0.6, overrides: { torso: -5, upperLegL: 0, lowerLegL: 0, upperLegR: 0, lowerLegR: 0, upperArmL: 120, upperArmR: -120 } },
      { progress: 1, overrides: { torso: 5, upperLegL: 20, lowerLegL: -40, upperLegR: -20, lowerLegR: -40, upperArmL: 20, upperArmR: -20 } },
    ],
  },

  // Running motion - fast alternating legs with forward lean
  running: {
    name: 'running',
    cycleDurationMs: 400,
    affectedJoints: ['torso', 'upperArmL', 'upperArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: -10, upperArmL: 45, upperArmR: -45, upperLegL: -30, lowerLegL: -20, upperLegR: 30, lowerLegR: -50 } },
      { progress: 0.5, overrides: { torso: -10, upperArmL: -45, upperArmR: 45, upperLegL: 30, lowerLegL: -50, upperLegR: -30, lowerLegR: -20 } },
      { progress: 1, overrides: { torso: -10, upperArmL: 45, upperArmR: -45, upperLegL: -30, lowerLegL: -20, upperLegR: 30, lowerLegR: -50 } },
    ],
  },

  // Clapping motion - hands coming together
  clapping: {
    name: 'clapping',
    cycleDurationMs: 500,
    affectedJoints: ['upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmL: 60, lowerArmL: -90, upperArmR: -60, lowerArmR: -90 } },
      { progress: 0.4, overrides: { upperArmL: 30, lowerArmL: -45, upperArmR: -30, lowerArmR: -45 } },
      { progress: 1, overrides: { upperArmL: 60, lowerArmL: -90, upperArmR: -60, lowerArmR: -90 } },
    ],
  },

  // Typing motion - subtle hand movements
  typing: {
    name: 'typing',
    cycleDurationMs: 300,
    affectedJoints: ['upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmL: 30, lowerArmL: -100, upperArmR: -30, lowerArmR: -100 } },
      { progress: 0.25, overrides: { upperArmL: 35, lowerArmL: -95, upperArmR: -25, lowerArmR: -105 } },
      { progress: 0.5, overrides: { upperArmL: 25, lowerArmL: -105, upperArmR: -35, lowerArmR: -95 } },
      { progress: 0.75, overrides: { upperArmL: 30, lowerArmL: -100, upperArmR: -30, lowerArmR: -100 } },
      { progress: 1, overrides: { upperArmL: 30, lowerArmL: -100, upperArmR: -30, lowerArmR: -100 } },
    ],
  },

  // ============================================
  // GESTURE MOTIONS (Studio C)
  // ============================================

  // Head shake motion (disagreement gesture)
  headShake: {
    name: 'headShake',
    cycleDurationMs: 600,
    affectedJoints: ['head'],
    keyframes: [
      { progress: 0, overrides: { head: 0 } },
      { progress: 0.25, overrides: { head: -20 } },
      { progress: 0.75, overrides: { head: 20 } },
      { progress: 1, overrides: { head: 0 } },
    ],
  },

  // ============================================
  // MVP LOOP MOTIONS (L2)
  // ============================================

  // Blinking motion - uses head tilt to simulate blink effect
  blinking: {
    name: 'blinking',
    cycleDurationMs: 3000,
    affectedJoints: ['head'],
    keyframes: [
      { progress: 0, overrides: { head: 0 } },
      { progress: 0.03, overrides: { head: 3 } },    // quick blink down
      { progress: 0.06, overrides: { head: 0 } },    // back to normal
      { progress: 1, overrides: { head: 0 } },
    ],
  },

  // Waving loop - continuous wave motion
  waving_loop: {
    name: 'waving_loop',
    cycleDurationMs: 500,
    affectedJoints: ['upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmR: -130, lowerArmR: -40 } },
      { progress: 0.5, overrides: { upperArmR: -130, lowerArmR: -70 } },
      { progress: 1, overrides: { upperArmR: -130, lowerArmR: -40 } },
    ],
  },

  // Thinking loop - subtle head and arm movement while thinking
  thinking_loop: {
    name: 'thinking_loop',
    cycleDurationMs: 1500,
    affectedJoints: ['head', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { head: 10, upperArmR: -60, lowerArmR: -120 } },
      { progress: 0.5, overrides: { head: 15, upperArmR: -55, lowerArmR: -115 } },
      { progress: 1, overrides: { head: 10, upperArmR: -60, lowerArmR: -120 } },
    ],
  },

  // ============================================
  // V2 LOOP MOTIONS (L2)
  // ============================================

  // Swaying - subtle left-right body sway
  swaying: {
    name: 'swaying',
    cycleDurationMs: 2500,
    affectedJoints: ['torso', 'head'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0 } },
      { progress: 0.25, overrides: { torso: 3, head: 5 } },
      { progress: 0.5, overrides: { torso: 0, head: 0 } },
      { progress: 0.75, overrides: { torso: -3, head: -5 } },
      { progress: 1, overrides: { torso: 0, head: 0 } },
    ],
  },

  // Tapping - foot tapping motion
  tapping: {
    name: 'tapping',
    cycleDurationMs: 500,
    affectedJoints: ['upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.3, overrides: { upperLegR: -10, lowerLegR: 15 } },
      { progress: 0.5, overrides: { upperLegR: -5, lowerLegR: 0 } },
      { progress: 1, overrides: { upperLegR: -5, lowerLegR: 0 } },
    ],
  },

  // Looking around - head turning left and right
  looking_around: {
    name: 'looking_around',
    cycleDurationMs: 2000,
    affectedJoints: ['head', 'torso'],
    keyframes: [
      { progress: 0, overrides: { head: 0, torso: 0 } },
      { progress: 0.25, overrides: { head: -25, torso: -3 } },
      { progress: 0.5, overrides: { head: 0, torso: 0 } },
      { progress: 0.75, overrides: { head: 25, torso: 3 } },
      { progress: 1, overrides: { head: 0, torso: 0 } },
    ],
  },

  // Scratching head - hand moves to scratch head
  scratching_head: {
    name: 'scratching_head',
    cycleDurationMs: 1000,
    affectedJoints: ['head', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { head: 5, upperArmR: -120, lowerArmR: -150 } },
      { progress: 0.25, overrides: { head: 8, upperArmR: -125, lowerArmR: -145 } },
      { progress: 0.5, overrides: { head: 5, upperArmR: -120, lowerArmR: -150 } },
      { progress: 0.75, overrides: { head: 8, upperArmR: -125, lowerArmR: -145 } },
      { progress: 1, overrides: { head: 5, upperArmR: -120, lowerArmR: -150 } },
    ],
  },

  // Dancing - rhythmic body movement
  dancing: {
    name: 'dancing',
    cycleDurationMs: 1000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'upperArmR', 'upperLegL', 'upperLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 60, upperArmR: -60, upperLegL: 5, upperLegR: -5 } },
      { progress: 0.25, overrides: { torso: 5, head: 5, upperArmL: 80, upperArmR: -40, upperLegL: 10, upperLegR: -10 } },
      { progress: 0.5, overrides: { torso: 0, head: 0, upperArmL: 60, upperArmR: -60, upperLegL: 5, upperLegR: -5 } },
      { progress: 0.75, overrides: { torso: -5, head: -5, upperArmL: 40, upperArmR: -80, upperLegL: 10, upperLegR: -10 } },
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 60, upperArmR: -60, upperLegL: 5, upperLegR: -5 } },
    ],
  },

  // Bouncing - up and down bouncing motion
  bouncing: {
    name: 'bouncing',
    cycleDurationMs: 500,
    affectedJoints: ['torso', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.25, overrides: { torso: -3, upperLegL: 15, lowerLegL: -20, upperLegR: -15, lowerLegR: 20 } },
      { progress: 0.5, overrides: { torso: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.75, overrides: { torso: -3, upperLegL: 15, lowerLegL: -20, upperLegR: -15, lowerLegR: 20 } },
      { progress: 1, overrides: { torso: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
    ],
  },

  // ============================================
  // MVP POSE TRANSITIONS (L2)
  // standing -> target pose
  // ============================================

  // Sit down transition: standing -> sitting
  sit_down: {
    name: 'sit_down',
    cycleDurationMs: 800,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Mid: bending down
      { progress: 0.5, overrides: { torso: 5, head: 5, upperArmL: 25, lowerArmL: -45, upperArmR: -25, lowerArmR: 45, upperLegL: 45, lowerLegL: -45, upperLegR: -45, lowerLegR: 45 } },
      // End: sitting pose
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 30, lowerArmL: -90, upperArmR: -30, lowerArmR: 90, upperLegL: 90, lowerLegL: -90, upperLegR: -90, lowerLegR: 90 } },
    ],
  },

  // Depressing transition: standing -> depressed
  depressing: {
    name: 'depressing',
    cycleDurationMs: 1000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Mid: starting to slouch
      { progress: 0.5, overrides: { torso: 8, head: 12, upperArmL: 15, lowerArmL: 10, upperArmR: -15, lowerArmR: -10, upperLegL: 8, lowerLegL: 3, upperLegR: -8, lowerLegR: -3 } },
      // End: depressed pose
      { progress: 1, overrides: { torso: 15, head: 25, upperArmL: 10, lowerArmL: 20, upperArmR: -10, lowerArmR: -20, upperLegL: 10, lowerLegL: 5, upperLegR: -10, lowerLegR: -5 } },
    ],
  },

  // Surprising transition: standing -> surprised_pose
  surprising: {
    name: 'surprising',
    cycleDurationMs: 400,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Quick jump to surprised
      { progress: 0.3, overrides: { torso: -8, head: -5, upperArmL: 70, lowerArmL: -80, upperArmR: -70, lowerArmR: 80, upperLegL: 20, lowerLegL: 0, upperLegR: -20, lowerLegR: 0 } },
      // End: surprised_pose
      { progress: 1, overrides: { torso: -5, head: 0, upperArmL: 60, lowerArmL: -70, upperArmR: -60, lowerArmR: 70, upperLegL: 15, lowerLegL: 0, upperLegR: -15, lowerLegR: 0 } },
    ],
  },

  // ============================================
  // V2 POSE TRANSITIONS (L2)
  // standing -> target pose
  // ============================================

  // Raising transition: standing -> raising_hand
  raising: {
    name: 'raising',
    cycleDurationMs: 500,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Mid: arm going up
      { progress: 0.5, overrides: { torso: 0, head: 3, upperArmL: 20, lowerArmL: 0, upperArmR: -90, lowerArmR: -15, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // End: raising_hand pose
      { progress: 1, overrides: { torso: 0, head: 5, upperArmL: 20, lowerArmL: 0, upperArmR: -160, lowerArmR: -30, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
    ],
  },

  // Crossing arms transition: standing -> arms_crossed
  crossing_arms: {
    name: 'crossing_arms',
    cycleDurationMs: 600,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Mid: arms coming together
      { progress: 0.5, overrides: { torso: 0, head: 0, upperArmL: 35, lowerArmL: -65, upperArmR: -35, lowerArmR: 65, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // End: arms_crossed pose
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 50, lowerArmL: -130, upperArmR: -50, lowerArmR: 130, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
    ],
  },

  // Stop gesture transition: standing -> stop
  stop_gesture: {
    name: 'stop_gesture',
    cycleDurationMs: 400,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Quick arm raise
      { progress: 0.4, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -55, lowerArmR: -45, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // End: stop pose
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -90, lowerArmR: -90, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
    ],
  },

  // Presenting transition: standing -> presenting
  presenting: {
    name: 'presenting',
    cycleDurationMs: 600,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      // Start: standing pose
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      // Mid: beginning to present
      { progress: 0.5, overrides: { torso: -3, head: -5, upperArmL: 55, lowerArmL: -15, upperArmR: -25, lowerArmR: -10, upperLegL: 8, lowerLegL: 0, upperLegR: -8, lowerLegR: 0 } },
      // End: presenting pose
      { progress: 1, overrides: { torso: -5, head: -10, upperArmL: 90, lowerArmL: -30, upperArmR: -30, lowerArmR: -20, upperLegL: 10, lowerLegL: 0, upperLegR: -10, lowerLegR: 0 } },
    ],
  },

};

// Get motion by name
export function getMotion(name: string): Motion | undefined {
  return MOTIONS[name];
}

// List of all available motion names
export const MOTION_NAMES = Object.keys(MOTIONS);
