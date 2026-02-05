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
  // MVP LOOP MOTIONS (추가)
  // ============================================

  // Blinking motion - simple eye blink simulation via head nod
  blinking: {
    name: 'blinking',
    cycleDurationMs: 3000,
    affectedJoints: ['head'],
    keyframes: [
      { progress: 0, overrides: { head: 0 } },
      { progress: 0.03, overrides: { head: 3 } },    // quick down
      { progress: 0.06, overrides: { head: 0 } },    // back up
      { progress: 1, overrides: { head: 0 } },
    ],
  },

  // Waving loop - continuous wave motion
  waving_loop: {
    name: 'waving_loop',
    cycleDurationMs: 500,
    affectedJoints: ['upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmR: -130, lowerArmR: -30 } },
      { progress: 0.5, overrides: { upperArmR: -130, lowerArmR: -60 } },
      { progress: 1, overrides: { upperArmR: -130, lowerArmR: -30 } },
    ],
  },

  // Thinking loop - subtle head movement while thinking
  thinking_loop: {
    name: 'thinking_loop',
    cycleDurationMs: 2000,
    affectedJoints: ['head', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { head: 10, upperArmR: -60, lowerArmR: -120 } },
      { progress: 0.5, overrides: { head: 15, upperArmR: -55, lowerArmR: -125 } },
      { progress: 1, overrides: { head: 10, upperArmR: -60, lowerArmR: -120 } },
    ],
  },

  // ============================================
  // V2 LOOP MOTIONS (저에너지)
  // ============================================

  // Swaying - gentle side to side movement
  swaying: {
    name: 'swaying',
    cycleDurationMs: 2000,
    affectedJoints: ['torso', 'head'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0 } },
      { progress: 0.25, overrides: { torso: 5, head: 3 } },
      { progress: 0.5, overrides: { torso: 0, head: 0 } },
      { progress: 0.75, overrides: { torso: -5, head: -3 } },
      { progress: 1, overrides: { torso: 0, head: 0 } },
    ],
  },

  // Tapping - foot or finger tapping
  tapping: {
    name: 'tapping',
    cycleDurationMs: 400,
    affectedJoints: ['lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { lowerLegR: 0 } },
      { progress: 0.3, overrides: { lowerLegR: -15 } },
      { progress: 0.6, overrides: { lowerLegR: 0 } },
      { progress: 1, overrides: { lowerLegR: 0 } },
    ],
  },

  // ============================================
  // V2 LOOP MOTIONS (중에너지)
  // ============================================

  // Looking around - head turning left and right
  looking_around: {
    name: 'looking_around',
    cycleDurationMs: 2500,
    affectedJoints: ['head', 'torso'],
    keyframes: [
      { progress: 0, overrides: { head: 0, torso: 0 } },
      { progress: 0.25, overrides: { head: -25, torso: -5 } },
      { progress: 0.5, overrides: { head: 0, torso: 0 } },
      { progress: 0.75, overrides: { head: 25, torso: 5 } },
      { progress: 1, overrides: { head: 0, torso: 0 } },
    ],
  },

  // Scratching head - hand scratching head motion
  scratching_head: {
    name: 'scratching_head',
    cycleDurationMs: 600,
    affectedJoints: ['head', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { head: 5, upperArmR: -120, lowerArmR: -150 } },
      { progress: 0.5, overrides: { head: 8, upperArmR: -125, lowerArmR: -145 } },
      { progress: 1, overrides: { head: 5, upperArmR: -120, lowerArmR: -150 } },
    ],
  },

  // ============================================
  // V2 LOOP MOTIONS (고에너지)
  // ============================================

  // Dancing - rhythmic body movement
  dancing: {
    name: 'dancing',
    cycleDurationMs: 600,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'upperLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: -5, head: -5, upperArmL: 80, lowerArmL: -90, upperArmR: -80, lowerArmR: 90, upperLegL: 10, upperLegR: -10 } },
      { progress: 0.25, overrides: { torso: 0, head: 0, upperArmL: 100, lowerArmL: -70, upperArmR: -60, lowerArmR: 70, upperLegL: 5, upperLegR: -15 } },
      { progress: 0.5, overrides: { torso: 5, head: 5, upperArmL: 80, lowerArmL: -90, upperArmR: -80, lowerArmR: 90, upperLegL: 10, upperLegR: -10 } },
      { progress: 0.75, overrides: { torso: 0, head: 0, upperArmL: 60, lowerArmL: -70, upperArmR: -100, lowerArmR: 70, upperLegL: 15, upperLegR: -5 } },
      { progress: 1, overrides: { torso: -5, head: -5, upperArmL: 80, lowerArmL: -90, upperArmR: -80, lowerArmR: 90, upperLegL: 10, upperLegR: -10 } },
    ],
  },

  // Bouncing - up and down bounce
  bouncing: {
    name: 'bouncing',
    cycleDurationMs: 400,
    affectedJoints: ['torso', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.5, overrides: { torso: -5, upperLegL: 15, lowerLegL: -20, upperLegR: -15, lowerLegR: 20 } },
      { progress: 1, overrides: { torso: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
    ],
  },

  // ============================================
  // V3 LOOP MOTIONS (중에너지)
  // ============================================

  // Talking - mouth/head movement simulation
  talking: {
    name: 'talking',
    cycleDurationMs: 300,
    affectedJoints: ['head', 'torso'],
    keyframes: [
      { progress: 0, overrides: { head: 0, torso: 0 } },
      { progress: 0.3, overrides: { head: 3, torso: 1 } },
      { progress: 0.6, overrides: { head: -2, torso: -1 } },
      { progress: 1, overrides: { head: 0, torso: 0 } },
    ],
  },

  // Humming - gentle swaying with head movement
  humming: {
    name: 'humming',
    cycleDurationMs: 1200,
    affectedJoints: ['head', 'torso'],
    keyframes: [
      { progress: 0, overrides: { head: 0, torso: 0 } },
      { progress: 0.25, overrides: { head: 5, torso: 3 } },
      { progress: 0.5, overrides: { head: 0, torso: 0 } },
      { progress: 0.75, overrides: { head: -5, torso: -3 } },
      { progress: 1, overrides: { head: 0, torso: 0 } },
    ],
  },

  // Stretching loop - continuous stretch movement
  stretching_loop: {
    name: 'stretching_loop',
    cycleDurationMs: 2000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 170, lowerArmL: 0, upperArmR: -170, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: -10, head: -15, upperArmL: 175, lowerArmL: 10, upperArmR: -175, lowerArmR: -10 } },
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 170, lowerArmL: 0, upperArmR: -170, lowerArmR: 0 } },
    ],
  },

  // ============================================
  // V3 LOOP MOTIONS (고에너지)
  // ============================================

  // Exercising - jumping jacks motion
  exercising: {
    name: 'exercising',
    cycleDurationMs: 800,
    affectedJoints: ['torso', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'upperLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, upperLegR: -5 } },
      { progress: 0.5, overrides: { torso: -5, upperArmL: 160, lowerArmL: 10, upperArmR: -160, lowerArmR: -10, upperLegL: 25, upperLegR: -25 } },
      { progress: 1, overrides: { torso: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, upperLegR: -5 } },
    ],
  },

  // Punching - boxing punches
  punching: {
    name: 'punching',
    cycleDurationMs: 600,
    affectedJoints: ['torso', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, upperArmL: 50, lowerArmL: -90, upperArmR: -50, lowerArmR: 90 } },
      { progress: 0.25, overrides: { torso: -10, upperArmL: 90, lowerArmL: -20, upperArmR: -50, lowerArmR: 90 } },
      { progress: 0.5, overrides: { torso: 0, upperArmL: 50, lowerArmL: -90, upperArmR: -50, lowerArmR: 90 } },
      { progress: 0.75, overrides: { torso: 10, upperArmL: 50, lowerArmL: -90, upperArmR: -90, lowerArmR: 20 } },
      { progress: 1, overrides: { torso: 0, upperArmL: 50, lowerArmL: -90, upperArmR: -50, lowerArmR: 90 } },
    ],
  },

  // Kicking - alternating kicks
  kicking_loop: {
    name: 'kicking_loop',
    cycleDurationMs: 800,
    affectedJoints: ['torso', 'upperArmL', 'upperArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: -10, upperArmL: 40, upperArmR: -40, upperLegL: 5, lowerLegL: 0, upperLegR: -80, lowerLegR: 0 } },
      { progress: 0.5, overrides: { torso: 10, upperArmL: -40, upperArmR: 40, upperLegL: 80, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 1, overrides: { torso: -10, upperArmL: 40, upperArmR: -40, upperLegL: 5, lowerLegL: 0, upperLegR: -80, lowerLegR: 0 } },
    ],
  },

  // Spinning - rotation simulation
  spinning: {
    name: 'spinning',
    cycleDurationMs: 500,
    affectedJoints: ['torso', 'head', 'upperArmL', 'upperArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: -30, head: -30, upperArmL: 90, upperArmR: -90 } },
      { progress: 0.25, overrides: { torso: 0, head: 0, upperArmL: 60, upperArmR: -60 } },
      { progress: 0.5, overrides: { torso: 30, head: 30, upperArmL: 90, upperArmR: -90 } },
      { progress: 0.75, overrides: { torso: 0, head: 0, upperArmL: 60, upperArmR: -60 } },
      { progress: 1, overrides: { torso: -30, head: -30, upperArmL: 90, upperArmR: -90 } },
    ],
  },

  // Waving both arms - enthusiastic double wave
  waving_both_arms: {
    name: 'waving_both_arms',
    cycleDurationMs: 600,
    affectedJoints: ['upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmL: 150, lowerArmL: -30, upperArmR: -150, lowerArmR: 30 } },
      { progress: 0.5, overrides: { upperArmL: 150, lowerArmL: -60, upperArmR: -150, lowerArmR: 60 } },
      { progress: 1, overrides: { upperArmL: 150, lowerArmL: -30, upperArmR: -150, lowerArmR: 30 } },
    ],
  },

  // Celebrating loop - continuous celebration
  celebrating_loop: {
    name: 'celebrating_loop',
    cycleDurationMs: 500,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'upperLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: -5, upperArmL: 160, lowerArmL: 20, upperArmR: -160, lowerArmR: -20, upperLegL: 10, upperLegR: -10 } },
      { progress: 0.5, overrides: { torso: -5, head: -10, upperArmL: 170, lowerArmL: 30, upperArmR: -170, lowerArmR: -30, upperLegL: 20, upperLegR: -20 } },
      { progress: 1, overrides: { torso: 0, head: -5, upperArmL: 160, lowerArmL: 20, upperArmR: -160, lowerArmR: -20, upperLegL: 10, upperLegR: -10 } },
    ],
  },

  // Panicking - frantic movement
  panicking: {
    name: 'panicking',
    cycleDurationMs: 300,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: -5, head: -10, upperArmL: 100, lowerArmL: -60, upperArmR: -80, lowerArmR: 40 } },
      { progress: 0.25, overrides: { torso: 5, head: 10, upperArmL: 80, lowerArmL: -40, upperArmR: -100, lowerArmR: 60 } },
      { progress: 0.5, overrides: { torso: -5, head: -10, upperArmL: 100, lowerArmL: -60, upperArmR: -80, lowerArmR: 40 } },
      { progress: 0.75, overrides: { torso: 5, head: 10, upperArmL: 80, lowerArmL: -40, upperArmR: -100, lowerArmR: 60 } },
      { progress: 1, overrides: { torso: -5, head: -10, upperArmL: 100, lowerArmL: -60, upperArmR: -80, lowerArmR: 40 } },
    ],
  },

  // ============================================
  // POSE TRANSITION MOTIONS (MVP)
  // ============================================

  // Sit down transition - standing to sitting
  sit_down: {
    name: 'sit_down',
    cycleDurationMs: 1000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.5, overrides: { torso: 15, head: 10, upperArmL: 30, lowerArmL: -45, upperArmR: -30, lowerArmR: 45, upperLegL: 45, lowerLegL: -45, upperLegR: -45, lowerLegR: 45 } },
      { progress: 1, overrides: { torso: 0, head: 0, upperArmL: 30, lowerArmL: -90, upperArmR: -30, lowerArmR: 90, upperLegL: 90, lowerLegL: -90, upperLegR: -90, lowerLegR: 90 } },
    ],
  },

  // Depressing transition - becoming sad
  depressing: {
    name: 'depressing',
    cycleDurationMs: 1500,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: 10, head: 15, upperArmL: 15, lowerArmL: 10, upperArmR: -15, lowerArmR: -10 } },
      { progress: 1, overrides: { torso: 20, head: 30, upperArmL: 10, lowerArmL: 20, upperArmR: -10, lowerArmR: -20 } },
    ],
  },

  // Surprising transition - becoming surprised
  surprising: {
    name: 'surprising',
    cycleDurationMs: 500,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'upperLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, upperLegR: -5 } },
      { progress: 0.5, overrides: { torso: -5, head: -10, upperArmL: 50, lowerArmL: -20, upperArmR: -50, lowerArmR: 20, upperLegL: 8, upperLegR: -8 } },
      { progress: 1, overrides: { torso: -10, head: -15, upperArmL: 80, lowerArmL: -40, upperArmR: -80, lowerArmR: 40, upperLegL: 10, upperLegR: -10 } },
    ],
  },

  // ============================================
  // POSE TRANSITION MOTIONS (V2)
  // ============================================

  // Raising arm transition
  raising: {
    name: 'raising',
    cycleDurationMs: 800,
    affectedJoints: ['upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { upperArmR: -90, lowerArmR: -10 } },
      { progress: 1, overrides: { upperArmR: -160, lowerArmR: -20 } },
    ],
  },

  // Crossing arms transition
  crossing_arms: {
    name: 'crossing_arms',
    cycleDurationMs: 800,
    affectedJoints: ['upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { upperArmL: 35, lowerArmL: -65, upperArmR: -35, lowerArmR: 65 } },
      { progress: 1, overrides: { upperArmL: 50, lowerArmL: -130, upperArmR: -50, lowerArmR: 130 } },
    ],
  },

  // Stop gesture transition
  stop_gesture: {
    name: 'stop_gesture',
    cycleDurationMs: 600,
    affectedJoints: ['upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { upperArmR: -55, lowerArmR: -45 } },
      { progress: 1, overrides: { upperArmR: -90, lowerArmR: -90 } },
    ],
  },

  // Presenting transition
  presenting: {
    name: 'presenting',
    cycleDurationMs: 1000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: -3, head: -3, upperArmL: 60, lowerArmL: -15, upperArmR: -60, lowerArmR: 15 } },
      { progress: 1, overrides: { torso: -5, head: -5, upperArmL: 100, lowerArmL: -30, upperArmR: -100, lowerArmR: 30 } },
    ],
  },

  // Reading start transition
  reading_start: {
    name: 'reading_start',
    cycleDurationMs: 1000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: 5, head: 12, upperArmL: 35, lowerArmL: -50, upperArmR: -35, lowerArmR: 50 } },
      { progress: 1, overrides: { torso: 10, head: 25, upperArmL: 50, lowerArmL: -100, upperArmR: -50, lowerArmR: 100 } },
    ],
  },

  // Crouching down transition
  crouching_down: {
    name: 'crouching_down',
    cycleDurationMs: 800,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.5, overrides: { torso: 15, head: 10, upperArmL: 40, lowerArmL: -50, upperArmR: -40, lowerArmR: 50, upperLegL: 55, lowerLegL: -65, upperLegR: -55, lowerLegR: 65 } },
      { progress: 1, overrides: { torso: 30, head: 20, upperArmL: 60, lowerArmL: -100, upperArmR: -60, lowerArmR: 100, upperLegL: 110, lowerLegL: -130, upperLegR: -110, lowerLegR: 130 } },
    ],
  },

  // ============================================
  // POSE TRANSITION MOTIONS (V3)
  // ============================================

  // Saluting transition
  saluting: {
    name: 'saluting',
    cycleDurationMs: 600,
    affectedJoints: ['torso', 'head', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: -3, head: -5, upperArmR: -70, lowerArmR: -60 } },
      { progress: 1, overrides: { torso: -5, head: -10, upperArmR: -120, lowerArmR: -130 } },
    ],
  },

  // Bowing transition
  bowing: {
    name: 'bowing',
    cycleDurationMs: 1200,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: 25, head: 30, upperArmL: 17, lowerArmL: 5, upperArmR: -17, lowerArmR: -5 } },
      { progress: 1, overrides: { torso: 45, head: 50, upperArmL: 15, lowerArmL: 10, upperArmR: -15, lowerArmR: -10 } },
    ],
  },

  // Lying down transition
  lying_down: {
    name: 'lying_down',
    cycleDurationMs: 1500,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0, upperLegL: 5, lowerLegL: 0, upperLegR: -5, lowerLegR: 0 } },
      { progress: 0.5, overrides: { torso: 45, head: 45, upperArmL: 10, lowerArmL: -30, upperArmR: -10, lowerArmR: 30, upperLegL: 20, lowerLegL: -15, upperLegR: -10, lowerLegR: 8 } },
      { progress: 1, overrides: { torso: 85, head: 95, upperArmL: 30, lowerArmL: -60, upperArmR: -30, lowerArmR: 60, upperLegL: 30, lowerLegL: -30, upperLegR: -15, lowerLegR: 15 } },
    ],
  },

  // Praying transition
  praying: {
    name: 'praying',
    cycleDurationMs: 1000,
    affectedJoints: ['torso', 'head', 'upperArmL', 'lowerArmL', 'upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { torso: 0, head: 0, upperArmL: 20, lowerArmL: 0, upperArmR: -20, lowerArmR: 0 } },
      { progress: 0.5, overrides: { torso: 5, head: 12, upperArmL: 25, lowerArmL: -60, upperArmR: -25, lowerArmR: 60 } },
      { progress: 1, overrides: { torso: 10, head: 25, upperArmL: 30, lowerArmL: -120, upperArmR: -30, lowerArmR: 120 } },
    ],
  },

};

// Get motion by name
export function getMotion(name: string): Motion | undefined {
  return MOTIONS[name];
}

// List of all available motion names
export const MOTION_NAMES = Object.keys(MOTIONS);
